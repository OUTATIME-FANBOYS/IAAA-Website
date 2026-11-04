"use client";

import { useActionState } from "react";
import { Turnstile } from "@/components/ui";
import type { NewsletterSettings } from "@/sanity/lib/settings";
import { subscribeToNewsletter, type NewsletterState } from "./newsletter-action";

const inputClass =
  "min-h-12 w-full rounded-ds border border-paper/30 bg-paper px-4 py-3 text-ui text-primary " +
  "placeholder:text-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blossom";

const idle: NewsletterState = { status: "idle" };

/** Newsletter sign-up. Submits to a server action that adds the visitor to Mailchimp; the result shows in place. */
export function NewsletterSignup({ n }: { n: NewsletterSettings }) {
  const [state, action, pending] = useActionState(subscribeToNewsletter, idle);
  const message =
    state.status === "success" ? n.successMessage : state.status === "exists" ? n.existsMessage : state.status === "error" ? n.errorMessage : undefined;

  const fields = [
    { name: "EMAIL", label: n.emailLabel, type: "email", autoComplete: "email" },
    { name: "FNAME", label: n.firstNameLabel, type: "text", autoComplete: "given-name" },
    { name: "LNAME", label: n.lastNameLabel, type: "text", autoComplete: "family-name" },
    { name: "PHONE", label: n.phoneLabel, type: "tel", autoComplete: "tel" },
    { name: "MMERGE5", label: n.zipLabel, type: "text", autoComplete: "postal-code", pattern: "\\d{5}(-\\d{4})?", inputMode: "numeric" as const },
  ].filter((f): f is typeof f & { label: string } => Boolean(f.label));

  return (
    <section aria-labelledby={n.heading ? "newsletter-heading" : undefined} className="grid gap-8 tablet:grid-cols-[2fr_3fr] tablet:gap-12">
      <div className="flex flex-col gap-3">
        {n.heading ? (
          <h2 id="newsletter-heading" className="font-serif text-card font-medium text-paper">
            {n.heading}
          </h2>
        ) : null}
        {n.body ? <p className="text-body text-paper/80">{n.body}</p> : null}
      </div>
      <form action={action} className="flex flex-col gap-4">
        <div className="grid gap-4 tablet:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={f.name === "EMAIL" ? "flex flex-col gap-2 tablet:col-span-2" : "flex flex-col gap-2"}>
              <label htmlFor={`newsletter-${f.name}`} className="text-meta font-medium text-paper">
                {f.label}
              </label>
              <input
                id={`newsletter-${f.name}`}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                required
                defaultValue={state.values?.[f.name] ?? ""}
                pattern={"pattern" in f ? f.pattern : undefined}
                inputMode={"inputMode" in f ? f.inputMode : undefined}
                className={inputClass}
              />
            </div>
          ))}
        </div>
        {/* Spam trap: real visitors never see or fill this in. */}
        <div aria-hidden="true" className="absolute -left-[5000px]">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <Turnstile resetKey={state} />
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
          {n.requiredNote ? <p className="text-meta text-paper/70 tablet:max-w-[28rem]">{n.requiredNote}</p> : <span />}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center rounded-ds border border-blossom bg-blossom px-6 py-3 font-sans text-ui font-semibold text-primary transition-[background-color,color,transform] duration-300 ease-ds hover:bg-transparent hover:text-blossom active:scale-[0.98] active:bg-blossom/25 active:text-blossom disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            {pending ? (n.sendingLabel ?? n.buttonLabel) : n.buttonLabel}
          </button>
        </div>
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-meta font-medium text-blossom" : "text-meta font-medium text-paper"}
        >
          {message}
        </p>
      </form>
    </section>
  );
}
