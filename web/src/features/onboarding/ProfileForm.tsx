"use client";

import { useActionState, useRef, useState, type ReactNode } from "react";
import { submitProfile, type ProfileState } from "./actions";
import type { Prefill } from "./invite";
import { LINK_KEYS, MAX_PHOTO_BYTES, type FieldError, type LinkKey } from "./profile";
import { resizeImage } from "./resize-image";

const LINK_LABELS: Record<LinkKey, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  blog: "Blog",
};

const inputClass =
  "min-h-12 w-full rounded-ds border border-subtle bg-white px-4 py-3 text-ui text-primary " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy aria-[invalid=true]:border-burgundy";

const idle: ProfileState = { status: "idle" };

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-meta font-medium text-primary">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-caption">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[0.8125rem] font-medium text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ProfileForm({
  token,
  labels,
  prefill,
  hasExistingPhoto,
}: {
  token: string;
  labels: Record<string, string | undefined>;
  prefill: Prefill | null;
  hasExistingPhoto: boolean;
}) {
  const [state, action, pending] = useActionState(submitProfile, idle);
  const [photoError, setPhotoError] = useState(false);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const t = (key: string) => labels[key] ?? "";

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <h2 className="font-serif text-card font-medium text-primary">{t("onboardSuccessTitle")}</h2>
        <p className="text-body text-secondary">{t("onboardSuccessBody")}</p>
      </div>
    );
  }

  const value = (key: string, fallback = "") => state.values?.[key] ?? fallback;
  const message = (code?: FieldError) =>
    code === "required"
      ? t("onboardErrorRequired")
      : code === "link"
        ? t("onboardErrorLink")
        : code === "photo"
          ? t("onboardErrorPhoto")
          : code === "alt"
            ? t("onboardErrorAlt")
            : undefined;
  const err = state.errors ?? {};

  // Resize before submit: large phone photos would otherwise be rejected by the server.
  async function onPhoto(file: File | undefined) {
    setPhotoError(false);
    setHasNewPhoto(false);
    if (!file) return;
    const small = await resizeImage(file);
    if (!small || small.size > MAX_PHOTO_BYTES || !photoRef.current) {
      if (photoRef.current) photoRef.current.value = "";
      setPhotoError(true);
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(small);
    photoRef.current.files = transfer.files;
    setHasNewPhoto(true);
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="invite" value={token} />
      <div aria-hidden="true" className="absolute -left-[5000px]">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <Field id="name" label={t("onboardNameLabel")} error={message(err.name)}>
        <input id="name" name="name" required autoComplete="name" defaultValue={value("name", prefill?.name)} aria-invalid={Boolean(err.name)} className={inputClass} />
      </Field>
      <div className="grid gap-8 tablet:grid-cols-2">
        <Field id="location" label={t("onboardLocationLabel")} hint={t("onboardLocationHint")}>
          <input id="location" name="location" defaultValue={value("location", prefill?.location)} aria-describedby="location-hint" className={inputClass} />
        </Field>
        <Field id="medium" label={t("onboardMediumLabel")} hint={t("onboardMediumHint")}>
          <input id="medium" name="medium" defaultValue={value("medium", prefill?.medium)} aria-describedby="medium-hint" className={inputClass} />
        </Field>
      </div>

      <Field id="photo" label={t("onboardPhotoLabel")} hint={t("onboardPhotoHint")} error={photoError ? t("onboardErrorPhoto") : message(err.photo)}>
        <input
          ref={photoRef}
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onPhoto(e.target.files?.[0])}
          aria-describedby="photo-hint"
          aria-invalid={Boolean(err.photo) || photoError}
          className="text-ui text-primary file:mr-4 file:min-h-12 file:cursor-pointer file:rounded-ds file:border file:border-burgundy file:bg-paper file:px-6 file:py-3 file:font-semibold file:text-burgundy"
        />
        {hasExistingPhoto && !hasNewPhoto ? <p className="text-[0.8125rem] text-caption">{t("onboardPhotoKept")}</p> : null}
      </Field>
      <Field id="photoAlt" label={t("onboardPhotoAltLabel")} hint={t("onboardPhotoAltHint")} error={message(err.photoAlt)}>
        <input id="photoAlt" name="photoAlt" defaultValue={value("photoAlt")} aria-describedby="photoAlt-hint" aria-invalid={Boolean(err.photoAlt)} className={inputClass} />
      </Field>

      <Field id="bio" label={t("onboardBioLabel")} hint={t("onboardBioHint")} error={message(err.bio)}>
        <textarea id="bio" name="bio" rows={8} required defaultValue={value("bio", prefill?.bio)} aria-describedby="bio-hint" aria-invalid={Boolean(err.bio)} className={inputClass} />
      </Field>
      <Field id="statement" label={t("onboardStatementLabel")} hint={t("onboardStatementHint")}>
        <textarea id="statement" name="statement" rows={6} defaultValue={value("statement", prefill?.statement)} aria-describedby="statement-hint" className={inputClass} />
      </Field>

      <fieldset className="flex flex-col gap-6">
        <legend className="mb-2 font-serif text-card font-medium text-primary">{t("onboardLinksHeading")}</legend>
        <div className="grid gap-6 tablet:grid-cols-2">
          {LINK_KEYS.map((key) => (
            <Field key={key} id={key} label={LINK_LABELS[key]} error={message(err[key])}>
              <input id={key} name={key} type="url" inputMode="url" placeholder="https://" defaultValue={value(key, prefill?.links[key])} aria-invalid={Boolean(err[key])} className={inputClass} />
            </Field>
          ))}
        </div>
      </fieldset>

      {state.status === "error" && Object.keys(err).length === 0 ? (
        <p role="alert" className="text-meta font-medium text-burgundy">
          {t("onboardErrorGeneric")}
        </p>
      ) : null}
      {state.status === "invalid" ? (
        <p role="alert" className="text-meta font-medium text-burgundy">
          {t("onboardInvalidBody")}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-ds border border-burgundy bg-burgundy px-6 py-3 font-sans text-ui font-semibold text-white transition-[background-color,color,transform] duration-300 ease-ds hover:bg-paper hover:text-burgundy active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
        >
          {pending ? t("onboardSending") : t("onboardSubmit")}
        </button>
      </div>
    </form>
  );
}
