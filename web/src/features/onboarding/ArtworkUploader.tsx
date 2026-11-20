"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";
import { submitArtwork, type ArtworkResult } from "./actions";
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

const FAILURE_MESSAGES: Record<string, string> = {
  profile: "Save your profile first, then add your artworks.",
  limit: `You have reached the limit of ${MAX_ARTWORKS_PER_INVITE} artworks for this link. Contact the IAAA team if you need more.`,
  image: "This photo could not be read. Try another photo.",
  invalid: "This link is no longer valid.",
  save: "Something went wrong saving this artwork. Try again.",
  fields: "Please check the highlighted fields.",
};

const fieldMessage = (code?: ArtworkFieldError) =>
  code === "required"
    ? "Required."
    : code === "year"
      ? "Enter a four-digit year."
      : code === "image"
        ? "This photo could not be read. Try another."
        : undefined;

function failureOf(result: ArtworkResult): Pick<Entry, "errors" | "message"> {
  if (result.status === "saved") return { errors: {} };
  if (result.status === "invalid") return { errors: {}, message: FAILURE_MESSAGES.invalid };
  return { errors: result.errors ?? {}, message: FAILURE_MESSAGES[result.reason] };
}

/**
 * The "Add your artworks" step shown after the profile is saved. Each image is sent in its own request,
 * one after another, so every upload stays well under the 4.5 MB request limit.
 */
export function ArtworkUploader({ token }: { token: string }) {
  const [entries, setEntries] = useState<Entry[]>(() => [newEntry()]);
  const [progress, setProgress] = useState<string | null>(null);

  const patch = (id: string, change: Partial<Entry>) =>
    setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...change } : e)));

  async function onPhoto(id: string, file: File | undefined) {
    patch(id, { image: null, errors: {}, message: undefined });
    if (!file) return;
    const small = await resizeImage(file);
    if (!small || small.size > MAX_ARTWORK_BYTES) {
      patch(id, { message: "This photo could not be used. Try a smaller photo." });
      return;
    }
    patch(id, { image: small });
  }

  async function uploadAll() {
    const queue = entries.filter((e) => e.status !== "saved");
    for (let i = 0; i < queue.length; i++) {
      const entry = queue[i];
      setProgress(`Uploading ${i + 1} of ${queue.length}…`);
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
      try {
        result = await submitArtwork(data);
      } catch {
        result = { status: "error", reason: "save" };
      }
      if (result.status === "saved") patch(entry.id, { status: "saved", errors: {}, message: undefined });
      else patch(entry.id, { status: "failed", ...failureOf(result) });
    }
    setProgress(null);
  }

  const busy = progress !== null;
  const remaining = entries.filter((e) => e.status !== "saved");
  const savedCount = entries.length - remaining.length;
  const allSaved = remaining.length === 0;

  return (
    <section aria-labelledby="artworks-heading" className="flex flex-col gap-8 border-t border-subtle pt-12">
      <div className="flex flex-col gap-3">
        <h2 id="artworks-heading" className="font-serif text-card font-medium text-primary">
          Add your artworks
        </h2>
        <p className="text-body text-secondary">
          Upload the works you would like on your member page. Each one is saved as a draft, and the IAAA team reviews
          it before anything goes live.
        </p>
      </div>

      {entries.map((entry, index) =>
        entry.status === "saved" ? (
          <div key={entry.id} role="status" className="text-body text-secondary">
            Saved as a draft for review: {entry.title}
          </div>
        ) : (
          <fieldset key={entry.id} disabled={busy} className="flex flex-col gap-6 rounded-ds border border-subtle p-6">
            <legend className="px-1 font-serif text-[1.125rem] font-medium text-primary">Artwork {index + 1}</legend>
            <Field
              id={`${entry.id}-image`}
              label="Photo"
              hint="JPEG, PNG or WebP. It is resized in your browser to at most 2000 px."
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
              {entry.image ? <p className="text-[0.8125rem] text-caption">Photo ready.</p> : null}
            </Field>
            <div className="grid gap-6 tablet:grid-cols-2">
              <Field id={`${entry.id}-title`} label="Title" error={fieldMessage(entry.errors.title)}>
                <input
                  id={`${entry.id}-title`}
                  value={entry.title}
                  onChange={(e) => patch(entry.id, { title: e.target.value })}
                  aria-invalid={Boolean(entry.errors.title)}
                  className={inputClass}
                />
              </Field>
              <Field id={`${entry.id}-medium`} label="Medium" hint="e.g. Oil on canvas" error={fieldMessage(entry.errors.medium)}>
                <input
                  id={`${entry.id}-medium`}
                  value={entry.medium}
                  onChange={(e) => patch(entry.id, { medium: e.target.value })}
                  aria-describedby={`${entry.id}-medium-hint`}
                  aria-invalid={Boolean(entry.errors.medium)}
                  className={inputClass}
                />
              </Field>
              <Field id={`${entry.id}-dimensions`} label="Dimensions" hint="e.g. 24 × 30 in" error={fieldMessage(entry.errors.dimensions)}>
                <input
                  id={`${entry.id}-dimensions`}
                  value={entry.dimensions}
                  onChange={(e) => patch(entry.id, { dimensions: e.target.value })}
                  aria-describedby={`${entry.id}-dimensions-hint`}
                  aria-invalid={Boolean(entry.errors.dimensions)}
                  className={inputClass}
                />
              </Field>
              <Field id={`${entry.id}-year`} label="Year (optional)" error={fieldMessage(entry.errors.year)}>
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
            <Field id={`${entry.id}-description`} label="Description (optional)" hint="Materials, the series it belongs to, or the story behind the work.">
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
            {entry.status === "uploading" ? <p className="text-meta text-secondary">Uploading…</p> : null}
            {remaining.length > 1 ? (
              <div>
                <button
                  type="button"
                  onClick={() => setEntries((list) => list.filter((e) => e.id !== entry.id))}
                  className={buttonClass("secondary", "cursor-pointer")}
                >
                  Remove this artwork
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
      {allSaved ? (
        <p role="status" className="text-body text-secondary">
          All {savedCount} artwork{savedCount === 1 ? "" : "s"} saved as drafts. Thank you.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-4">
        {entries.length < MAX_ARTWORKS_PER_INVITE ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => setEntries((list) => [...list, newEntry()])}
            className={buttonClass("secondary", "cursor-pointer")}
          >
            Add another artwork
          </button>
        ) : null}
        {!allSaved ? (
          <button
            type="button"
            disabled={busy}
            onClick={uploadAll}
            className={buttonClass("primary", "cursor-pointer")}
          >
            {busy ? "Uploading…" : savedCount > 0 ? "Upload the remaining artworks" : "Upload artworks"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
