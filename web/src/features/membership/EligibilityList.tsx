import { ELIGIBILITY } from "./data";

export function EligibilityList() {
  return (
    <ul className="flex flex-col divide-y divide-subtle border-y border-subtle">
      {ELIGIBILITY.map((e) => (
        <li key={e.title} className="flex flex-col gap-1 py-5">
          <h3 className="font-serif text-card font-medium text-primary">{e.title}</h3>
          <p className="text-meta text-secondary">{e.description}</p>
        </li>
      ))}
    </ul>
  );
}
