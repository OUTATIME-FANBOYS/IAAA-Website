import type { ReactNode } from "react";
import { Button, EditorialLink } from "@/components/ui";
import { CopyButton } from "./CopyButton";
import {
  CHECK_ADDRESS,
  CHECK_PAYEE,
  DONATE_URL,
  TREASURER_EMAIL,
  ZELLE_EMAIL,
} from "./data";

function Card({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex h-full flex-col gap-4 rounded-ds border border-subtle bg-white p-8">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blossom/40 font-serif text-card font-semibold text-burgundy"
      >
        {n}
      </span>
      <h3 className="font-serif text-card font-medium text-primary">{title}</h3>
      {children}
    </li>
  );
}

const Note = ({ children }: { children: ReactNode }) => (
  <p className="text-[0.8125rem] text-caption">{children}</p>
);

const Box = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-2 rounded-ds border border-subtle bg-paper p-4 text-meta text-secondary">{children}</div>
);

/** The six ways to give, as a two-column card grid. */
export function GivingChannels() {
  return (
    <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
      <Card n={1} title="Online donation">
        <p className="text-meta text-secondary">
          Give securely online with a credit card, debit card or bank account, as a one-time gift or on a
          recurring schedule.
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Button href={DONATE_URL}>Donate online</Button>
        </div>
      </Card>

      <Card n={2} title="Memorials & tributes">
        <p className="text-meta text-secondary">
          IAAA is honored to accept gifts celebrating special occasions, or given in loving memory of a
          community member.
        </p>
        <Box>
          <p className="font-semibold text-primary">Dedication guidelines</p>
          <ul className="flex flex-col gap-1">
            <li>Memorial gift: In memory of (name), and the address of the family to receive notice.</li>
            <li>Tribute gift: In honor of (name) on (occasion).</li>
          </ul>
          <p className="text-[0.8125rem] text-caption">
            Email details to <EditorialLink href={`mailto:${TREASURER_EMAIL}`}>{TREASURER_EMAIL}</EditorialLink>
          </p>
        </Box>
      </Card>

      <Card n={3} title="Donate by Zelle">
        <p className="text-meta text-secondary">
          Make a fast, direct transfer from your banking app or web portal.
        </p>
        <Box>
          <p className="text-label font-semibold uppercase text-caption">Registered Zelle recipient email</p>
          <div className="flex items-center justify-between gap-3">
            <span className="break-all font-mono text-meta text-primary">{ZELLE_EMAIL}</span>
            <CopyButton text={ZELLE_EMAIL} label="Copy email" />
          </div>
        </Box>
        <Note>Please include your full name and email in the Zelle memo so we can send a tax receipt.</Note>
      </Card>

      <Card n={4} title="Corporate matching">
        <p className="text-meta text-secondary">
          Many companies match charitable gifts made by their employees. Check with your employer’s HR or CSR
          team (Benevity, CyberGrants, Bright Funds and others) to multiply your support.
        </p>
        <div className="mt-auto pt-2">
          <Button href={DONATE_URL} variant="secondary">
            Check company match &amp; donate
          </Button>
        </div>
      </Card>

      <Card n={5} title="Donor advised fund (DAF)">
        <p className="text-meta text-secondary">
          Recommend a grant to IAAA through your DAF provider, such as Fidelity Charitable, Schwab Charitable
          or Vanguard Charitable.
        </p>
        <div className="mt-auto pt-2">
          <EditorialLink href={`mailto:${TREASURER_EMAIL}?subject=DAF%20grant%20to%20IAAA`}>
            Email us for DAF details
          </EditorialLink>
        </div>
      </Card>

      <Card n={6} title="Donate by check">
        <p className="text-meta text-secondary">
          Make your check payable to <strong className="font-semibold text-primary">“{CHECK_PAYEE}”</strong> and
          mail it to:
        </p>
        <Box>
          <address className="font-mono not-italic text-primary">
            {CHECK_ADDRESS.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </Box>
        <Note>A written receipt for tax documentation will be mailed upon receipt.</Note>
      </Card>
    </ul>
  );
}
