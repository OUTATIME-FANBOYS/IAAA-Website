"use client";

import { useActionState } from "react";
import { Turnstile, buttonClass } from "@/components/ui";
import { submitLead, type LeadsState } from "./actions";

export interface LeadsFormLabels {
  nameLabel?: string;
  emailLabel?: string;
  firstChoiceLabel?: string;
  secondChoiceLabel?: string;
  optionalLabel?: string;
  pickPlaceholder?: string;
  noSecondPlaceholder?: string;
  noteLabel?: string;
  notePlaceholder?: string;
  submitLabel?: string;
  sendingLabel?: string;
  successHeading?: string;
  successBody?: string;
  errorRequired?: string;
  errorSameGroup?: string;
  errorGeneric?: string;
}

const control =
  "min-h-12 w-full rounded-ds border border-subtle bg-white px-4 py-3 text-ui text-primary " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy";

/** A select with its own chevron: the browser's default arrow is tiny and sits on the edge of the field. */
function SelectField({ children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={`${control} cursor-pointer appearance-none pr-12`}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

const idle: LeadsState = { status: "idle" };

export function LeadsForm({ groups, labels }: { groups: string[]; labels: LeadsFormLabels }) {
  const [state, action, pending] = useActionState(submitLead, idle);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col gap-3">
        {labels.successHeading ? <h3 className="font-serif text-card font-medium text-primary">{labels.successHeading}</h3> : null}
        {labels.successBody ? <p className="text-body text-secondary">{labels.successBody}</p> : null}
      </div>
    );
  }

  const v = (key: string) => state.values?.[key] ?? "";
  const error =
    state.error === "required" ? labels.errorRequired : state.error === "sameGroup" ? labels.errorSameGroup : state.error ? labels.errorGeneric : undefined;
  const optional = labels.optionalLabel ? <span className="ml-2 text-[0.8125rem] font-normal text-caption">{labels.optionalLabel}</span> : null;

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      <div aria-hidden="true" className="absolute -left-[5000px]">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="grid gap-6 tablet:grid-cols-2">
        <label className="flex flex-col gap-2 text-meta font-medium text-primary">
          {labels.nameLabel}
          <input name="name" required autoComplete="name" defaultValue={v("name")} className={control} />
        </label>
        <label className="flex flex-col gap-2 text-meta font-medium text-primary">
          {labels.emailLabel}
          <input name="email" type="email" required autoComplete="email" defaultValue={v("email")} className={control} />
        </label>
      </div>
      <div className="grid gap-6 tablet:grid-cols-2">
        <label className="flex flex-col gap-2 text-meta font-medium text-primary">
          {labels.firstChoiceLabel}
          <SelectField name="group1" required defaultValue={v("group1")}>
            <option value="">{labels.pickPlaceholder}</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectField>
        </label>
        <label className="flex flex-col gap-2 text-meta font-medium text-primary">
          <span>
            {labels.secondChoiceLabel}
            {optional}
          </span>
          <SelectField name="group2" defaultValue={v("group2")}>
            <option value="">{labels.noSecondPlaceholder}</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectField>
        </label>
      </div>
      <label className="flex flex-col gap-2 text-meta font-medium text-primary">
        <span>
          {labels.noteLabel}
          {optional}
        </span>
        <textarea name="note" rows={4} placeholder={labels.notePlaceholder} defaultValue={v("note")} className={control} />
      </label>
      <Turnstile resetKey={state} />
      {error ? (
        <p role="alert" className="text-meta font-medium text-burgundy">
          {error}
        </p>
      ) : null}
      <div>
        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary", "cursor-pointer")}
        >
          {pending ? labels.sendingLabel : labels.submitLabel}
        </button>
      </div>
    </form>
  );
}
