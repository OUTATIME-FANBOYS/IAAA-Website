import type { ReactNode } from "react";
import { Button, EditorialLink, Section, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";
import { CopyButton } from "./CopyButton";

interface Action {
  label: string;
  href: string;
  style?: "primary" | "secondary";
}

export interface Channel {
  title: string;
  body?: string;
  note?: string;
  panel?: {
    heading?: string;
    lines?: string[];
    monospace?: boolean;
    copyValue?: string;
    copyLabel?: string;
    copiedLabel?: string;
    footnote?: string;
    footnoteLink?: Action;
  };
  button?: Action;
  link?: Action;
}

export interface ChannelsSectionProps {
  eyebrow?: string;
  heading?: string;
  channels: Channel[];
  tone?: SectionTone;
}

function Card({ n, channel }: { n: number; channel: Channel }) {
  const { panel } = channel;
  const hasPanel = panel && (panel.heading || panel.lines?.length || panel.copyValue || panel.footnote);
  return (
    <li className="flex h-full flex-col gap-4 rounded-ds border border-subtle bg-white p-8">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blossom/40 font-serif text-card font-semibold text-burgundy"
      >
        {n}
      </span>
      <h3 className="font-serif text-card font-medium text-primary">{channel.title}</h3>
      {channel.body ? <p className="text-meta text-secondary">{channel.body}</p> : null}
      {hasPanel ? (
        <div className="flex flex-col gap-2 rounded-ds border border-subtle bg-paper p-4 text-meta text-secondary">
          {panel.heading ? (
            <p className={panel.copyValue ? "text-label font-semibold uppercase text-caption" : "font-semibold text-primary"}>
              {panel.heading}
            </p>
          ) : null}
          {panel.lines?.length ? (
            panel.monospace ? (
              <address className="font-mono not-italic text-primary">
                {panel.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            ) : (
              <ul className="flex flex-col gap-1">
                {panel.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )
          ) : null}
          {panel.copyValue ? (
            <div className="flex items-center justify-between gap-3">
              <span className="break-all font-mono text-meta text-primary">{panel.copyValue}</span>
              {panel.copyLabel ? <CopyButton text={panel.copyValue} label={panel.copyLabel} copiedLabel={panel.copiedLabel} /> : null}
            </div>
          ) : null}
          {panel.footnote || panel.footnoteLink ? (
            <p className="text-[0.8125rem] text-caption">
              {panel.footnote} {panel.footnoteLink ? <EditorialLink href={panel.footnoteLink.href}>{panel.footnoteLink.label}</EditorialLink> : null}
            </p>
          ) : null}
        </div>
      ) : null}
      {channel.note ? <p className="text-[0.8125rem] text-caption">{channel.note}</p> : null}
      {channel.button || channel.link ? (
        <div className="mt-auto flex flex-col items-start gap-3 pt-2">
          {channel.button ? (
            <Button href={channel.button.href} variant={channel.button.style === "secondary" ? "secondary" : "primary"}>
              {channel.button.label}
            </Button>
          ) : null}
          {channel.link ? <EditorialLink href={channel.link.href}>{channel.link.label}</EditorialLink> : null}
        </div>
      ) : null}
    </li>
  );
}

/** Numbered cards, each with text, an optional detail box, a button and/or link. */
export function ChannelsSection({ eyebrow, heading, channels, tone }: ChannelsSectionProps): ReactNode {
  return (
    <Section divider tone={tone} innerClassName="flex flex-col gap-8">
      {eyebrow || heading ? (
        <div className="flex flex-col gap-4">
          {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
          {heading ? <SectionHeading>{heading}</SectionHeading> : null}
        </div>
      ) : null}
      <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
        {channels.map((c, i) => (
          <Card key={c.title} n={i + 1} channel={c} />
        ))}
      </ul>
    </Section>
  );
}
