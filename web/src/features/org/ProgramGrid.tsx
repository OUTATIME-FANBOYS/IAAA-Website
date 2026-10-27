import type { OrgProgram } from "./data";

export function ProgramGrid({ programs }: { programs: OrgProgram[] }) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
      {programs.map((p) => (
        <li
          key={p.title}
          className="flex h-full flex-col gap-4 rounded-ds border border-subtle bg-paper p-6"
        >
          <h3 className="font-serif text-card font-medium text-primary">{p.title}</h3>
          {p.description ? <p className="text-meta text-caption">{p.description}</p> : null}
        </li>
      ))}
    </ul>
  );
}
