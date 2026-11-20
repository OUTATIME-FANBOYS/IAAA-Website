"use client";

import { useCallback, useRef, useState } from "react";
import { Turnstile, buttonClass } from "@/components/ui";
import { submitArtwork, type ArtworkFailure, type ArtworkResult } from "./actions";
import { MAX_ARTWORK_BYTES, MAX_ARTWORKS_PER_INVITE, type ArtworkErrors, type ArtworkFieldError } from "./artwork";
import { Field, inputClass } from "./fields";
import { resizeImage } from "./resize-image";

type Status = "editing" | "uploading" | "saved" | "failed";

interface Entry {
  id: string;
  image: File | null;
  title: string;
  medium: string;
  dimensions: string;
  year: string;
  description: string;
  status: Status;
  errors: ArtworkErrors;
  message?: string;
}

/** Text from Site settings labels, keyed by name. A missing label renders nothing: no English fallback. */
type Labels = Record<string, string | undefined>;

const newEntry = (): Entry => ({
  id: crypto.randomUUID(),
  image: null,
  title: "",
  medium: "",
  dimensions: "",
  year: "",
  description: "",
  status: "editing",
  errors: {},
});

/** Fills {placeholders} in a label, e.g. "Artwork {n}". */
const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));

/** Token from the Turnstile check that the upload is waiting for. `null` means the check failed to run. */
type TokenSlot = { token: string | null } | null;

/** A missing Turnstile site key means the check is off, so uploads go without a token (the server skips it too). */
const turnstileOn = () => Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

function failureOf(result: ArtworkResult, labels: Labels): Pick<Entry, "errors" | "message"> {
  if (result.status === "saved") return { errors: {} };
  if (result.status === "invalid") return { errors: {}, message: labels.artworkErrorInvalid };
  return { errors: result.errors ?? {}, message: failureMessage(result.reason, labels) };
}

function failureMessage(reason: ArtworkFailure, labels: Labels): string | undefined {
  switch (reason) {
    case "profile":
      return labels.artworkErrorProfile;
    case "limit":
      return labels.artworkErrorLimit ? fill(labels.artworkErrorLimit, { max: MAX_ARTWORKS_PER_INVITE }) : undefined;
    case "image":
      return labels.artworkErrorImage;
    case "save":
      return labels.artworkErrorSave;
    case "fields":
      return labels.artworkErrorFields;
    case "spam":
      return labels.artworkErrorSpam;
  }
}

/**
 * The "Add your artworks" step shown after the profile is saved. Each image is sent in its own request,
 * one after another, so every upload stays well under the 4.5 MB request limit. Each request carries its
 * own Turnstile token (tokens work once), so the widget is reset after every upload.
 */
export function ArtworkUploader({ token, labels }: { token: string; labels: Labels }) {
  const [entries, setEntries] = useState<Entry[]>(() => [newEntry()]);
  const [progress, setProgress] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const tokenSlot = useRef<TokenSlot>(null);
  const waiting = useRef<((token: string | null) => void) | null>(null);
  const t = (key: string) => labels[key] ?? "";

  const onToken = useCallback((next: string | null) => {
    if (waiting.current) {
      const resolve = waiting.current;
      waiting.current = null;
      resolve(next);
    } else {
      tokenSlot.current = { token: next };
    }
  }, []);

  /** The next unused token: the one already issued, or the one the widget issues after its reset. */
  const nextToken = useCallback(
    () =>
      new Promise<string | null>((resolve) => {
        if (tokenSlot.current) {
          const { token: ready } = tokenSlot.current;
          tokenSlot.current = null;
          resolve(ready);
        } else {
          waiting.current = resolve;
        }
      }),
    [],
  );

  const patch = (id: string, change: Partial<Entry>) =>
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...change } : e)));

  async function onPhoto(id: string, file: File | undefined) {
    patch(id, { image: null, errors: {}, message: undefined });
    if (!file) return;
    const small = await resizeImage(file);
    if (!small || small.size > MAX_ARTWORK_BYTES) {
      patch(id, { message: t("artworkErrorPhotoSize") || undefined });
      return;
    }
    patch(id, { image: small });
  }

  async function uploadAll() {
    const queue = entries.filter((e) => e.status !== "saved");
    for (let i = 0; i < queue.length; i++) {
      const entry = queue[i];
      setProgress(fill(t("artworkProgress"), { current: i + 1, total: queue.length }) || null);
      if (!entry.image) {
        patch(entry.id, { status: "failed", errors: { image: "required" }, message: undefined });
        continue;
      }
      patch(entry.id, { status: "uploading", errors: {}, message: undefined });
      const data = new FormData();
      data.set("invite", token);
      data.set("image", entry.image);
      data.set("title", entry.title);
      data.set("medium", entry.medium);
      data.set("dimensions", entry.dimensions);
      data.set("year", entry.year);
      data.set("description", entry.description);
      let result: ArtworkResult;
      if (turnstileOn()) {
        const spamToken = await nextToken();
        if (spamToken) {
          data.set("cf-turnstile-response", spamToken);
          try {
            result = await submitArtwork(data);
          } catch {
            result = { status: "error", reason: "save" };
          }
        } else {
          result = { status: "error", reason: "spam" };
        }
        // The token is spent once the server has checked it: reset the widget for the next upload.
        tokenSlot.current = null;
        setTurnstileKey((k) => k + 1);
      } else {
        try {
          result = await submitArtwork(data);
        } catch {
          result = { status: "error", reason: "save" };
        }
      }
      if (result.status === "saved") patch(entry.id, { status: "saved", errors: {}, message: undefined });
      else patch(entry.id, { status: "failed", ...failureOf(result, labels) });
    }
    setProgress(null);
  }

  const busy = progress !== null;
  const remaining = entries.filter((e) => e.status !== "saved");
  const savedCount = entries.length - remaining.length;
  const allSaved = remaining.length === 0;
  const uploadLabel = busy ? t("artworkUploading") : savedCount > 0 ? t("artworkUploadRemaining") : t("artworkUpload");
  const fieldMessage = (code?: ArtworkFieldError) =>
    code === "required"
      ? t("artworkErrorRequired") || undefined
      : code === "year"
        ? t("artworkErrorYear") || undefined
        : code === "image"
          ? t("artworkErrorPhoto") || undefined
          : undefined;

  return (
    <section aria-labelledby="artworks-heading" className="flex flex-col gap-8 border-t border-subtle pt-12">
      <div className="flex flex-col gap-3">
        {t("artworkHeading") ? (
          <h2 id="artworks-heading" className="font-serif text-card font-medium text-primary">
            {t("artworkHeading")}
          </h2>
        ) : null}
        {t("artworkIntro") ? <p className="text-body text-secondary">{t("artworkIntro")}</p> : null}
      </div>

      {entries.map((entry, index) =>
        entry.status === "saved" ? (
          <div key={entry.id} role="status" className="text-body text-secondary">
            {t("artworkSaved") ? fill(t("artworkSaved"), { title: entry.title }) : null}
          </div>
        ) : (
          <fieldset key={entry.id} disabled={busy} className="flex flex-col gap-6 rounded-ds border border-subtle p-6">
            {t("artworkLegend") ? (
              <legend className="px-1 font-serif text-[1.125rem] font-medium text-primary">
                {fill(t("artworkLegend"), { n: index + 1 })}
              </legend>
            ) : null}
            <Field
              id={`${entry.id}-image`}
              label={t("artworkPhotoLabel")}
              hint={t("artworkPhotoHint") || undefined}
              error={entry.errors.image ? fieldMessage(entry.errors.image) : undefined}
            >
              <input
                id={`${entry.id}-image`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onPhoto(entry.id, e.target.files?.[0])}
                aria-invalid={Boolean(entry.errors.image)}
                className="text-ui text-primary file:mr-4 file:min-h-12 file:cursor-pointer file:rounded-ds file:border file:border-burgundy file:bg-paper file:px-6 file:py-3 file:font-semibold file:text-burgundy"
              />
              {entry.image && t("artworkPhotoReady") ? <p className="text-[0.8125rem] text-caption">{t("artworkPhotoReady")}</p> : null}
            </Field>
            <div className="grid gap-6 tablet:grid-cols-2">
              <Field id={`${entry.id}-title`} label={t("artworkTitleLabel")} error={fieldMessage(entry.errors.title)}>
                <input
                  id={`${entry.id}-title`}
                  value={entry.title}
                  onChange={(e) => patch(entry.id, { title: e.target.value })}
                  aria-invalid={Boolean(entry.errors.title)}
                  className={inputClass}
                />
              </Field>
              <Field
                id={`${entry.id}-medium`}
                label={t("artworkMediumLabel")}
                hint={t("artworkMediumHint") || undefined}
                error={fieldMessage(entry.errors.medium)}
              >
                <input
                  id={`${entry.id}-medium`}
                  value={entry.medium}
                  onChange={(e) => patch(entry.id, { medium: e.target.value })}
                  aria-describedby={`${entry.id}-medium-hint`}
                  aria-invalid={Boolean(entry.errors.medium)}
                  className={inputClass}
                />
              </Field>
              <Field
                id={`${entry.id}-dimensions`}
                label={t("artworkDimensionsLabel")}
                hint={t("artworkDimensionsHint") || undefined}
                error={fieldMessage(entry.errors.dimensions)}
              >
                <input
                  id={`${entry.id}-dimensions`}
                  value={entry.dimensions}
                  onChange={(e) => patch(entry.id, { dimensions: e.target.value })}
                  aria-describedby={`${entry.id}-dimensions-hint`}
                  aria-invalid={Boolean(entry.errors.dimensions)}
                  className={inputClass}
                />
              </Field>
              <Field id={`${entry.id}-year`} label={t("artworkYearLabel")} error={fieldMessage(entry.errors.year)}>
                <input
                  id={`${entry.id}-year`}
                  inputMode="numeric"
                  value={entry.year}
                  onChange={(e) => patch(entry.id, { year: e.target.value })}
                  aria-invalid={Boolean(entry.errors.year)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field
              id={`${entry.id}-description`}
              label={t("artworkDescriptionLabel")}
              hint={t("artworkDescriptionHint") || undefined}
            >
              <textarea
                id={`${entry.id}-description`}
                rows={4}
                value={entry.description}
                onChange={(e) => patch(entry.id, { description: e.target.value })}
                aria-describedby={`${entry.id}-description-hint`}
                className={inputClass}
              />
            </Field>
            {entry.message ? (
              <p role="alert" className="text-meta font-medium text-burgundy">
                {entry.message}
              </p>
            ) : null}
            {entry.status === "uploading" && t("artworkUploading") ? (
              <p className="text-meta text-secondary">{t("artworkUploading")}</p>
            ) : null}
            {remaining.length > 1 && t("artworkRemove") ? (
              <div>
                <button
                  type="button"
                  onClick={() => setEntries((list) => list.filter((e) => e.id !== entry.id))}
                  className={buttonClass("secondary", "cursor-pointer")}
                >
                  {t("artworkRemove")}
                </button>
              </div>
            ) : null}
          </fieldset>
        ),
      )}

      {progress ? (
        <p role="status" className="text-meta text-secondary">
          {progress}
        </p>
      ) : null}
      {allSaved && savedCount > 0 ? (
        <p role="status" className="text-body text-secondary">
          {fill(savedCount === 1 ? t("artworkAllSavedOne") : t("artworkAllSaved"), { count: savedCount })}
        </p>
      ) : null}

      {!allSaved && turnstileOn() ? <Turnstile resetKey={turnstileKey} onToken={onToken} /> : null}

      <div className="flex flex-wrap gap-4">
        {entries.length < MAX_ARTWORKS_PER_INVITE && t("artworkAdd") ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => setEntries((list) => [...list, newEntry()])}
            className={buttonClass("secondary", "cursor-pointer")}
          >
            {t("artworkAdd")}
          </button>
        ) : null}
        {!allSaved && uploadLabel ? (
          <button
            type="button"
            disabled={busy}
            onClick={uploadAll}
            className={buttonClass("primary", "cursor-pointer")}
          >
            {uploadLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
