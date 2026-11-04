"use client";

import { useActionState } from "react";
import { Turnstile } from "@/components/ui";
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
          <select name="group1" required defaultValue={v("group1")} className={control}>
            <option value="">{labels.pickPlaceholder}</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-meta font-medium text-primary">
          <span>
            {labels.secondChoiceLabel}
            {optional}
          </span>
          <select name="group2" defaultValue={v("group2")} className={control}>
            <option value="">{labels.noSecondPlaceholder}</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
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
          className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-ds border border-burgundy bg-burgundy px-6 py-3 font-sans text-ui font-semibold text-white transition-[background-color,color,transform] duration-300 ease-ds hover:bg-paper hover:text-burgundy active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
        >
          {pending ? labels.sendingLabel : labels.submitLabel}
        </button>
      </div>
    </form>
  );
}
