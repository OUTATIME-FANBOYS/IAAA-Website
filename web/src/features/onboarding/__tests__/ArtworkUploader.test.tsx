import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  onToken: undefined as undefined | ((token: string | null) => void),
  resets: [] as unknown[],
  submit: vi.fn(),
}));

vi.mock("@/components/ui", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/ui")>()),
  Turnstile: ({ resetKey, onToken }: { resetKey?: unknown; onToken?: (token: string | null) => void }) => {
    hooks.onToken = onToken;
    hooks.resets.push(resetKey);
    return null;
  },
}));

vi.mock("../actions", () => ({ submitArtwork: hooks.submit }));
vi.mock("../resize-image", () => ({ resizeImage: async (file: File) => file }));

import { ArtworkUploader } from "../ArtworkUploader";

const LABELS = {
  artworkHeading: "Add your works",
  artworkIntro: "Send us your best pieces.",
  artworkLegend: "Work {n}",
  artworkPhotoLabel: "Picture",
  artworkTitleLabel: "Name of the work",
  artworkUpload: "Send works",
  artworkErrorSpam: "The security check failed. Try again.",
  artworkAllSavedOne: "Done: {count} work saved.",
};

const photo = () => new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], "a.jpg", { type: "image/jpeg" });

async function fillAndUpload(user: ReturnType<typeof userEvent.setup>) {
  await user.upload(screen.getByLabelText(LABELS.artworkPhotoLabel), photo());
  await user.type(screen.getByLabelText(LABELS.artworkTitleLabel), "Blue Study");
  await user.click(screen.getByRole("button", { name: LABELS.artworkUpload }));
}

beforeEach(() => {
  hooks.onToken = undefined;
  hooks.resets = [];
  hooks.submit.mockReset();
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
});

describe("ArtworkUploader labels", () => {
  it("reads every piece of text from the labels it is given", () => {
    render(<ArtworkUploader token="t" labels={LABELS} />);
    expect(screen.getByRole("heading", { name: "Add your works" })).toBeInTheDocument();
    expect(screen.getByText("Send us your best pieces.")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Work 1" })).toBeInTheDocument();
    expect(screen.getByLabelText("Name of the work")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send works" })).toBeInTheDocument();
  });

  it("hides text whose label is missing instead of showing English", () => {
    render(<ArtworkUploader token="t" labels={{}} />);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.queryByText(/Add your artworks/)).toBeNull();
    expect(screen.queryByText(/Upload/)).toBeNull();
    expect(screen.queryByRole("button", { name: /artwork/i })).toBeNull();
    expect(screen.queryByText("Title")).toBeNull();
  });
});

describe("ArtworkUploader Turnstile", () => {
  it("sends the Turnstile token with the upload", async () => {
    const user = userEvent.setup();
    hooks.submit.mockResolvedValue({ status: "saved" });
    render(<ArtworkUploader token="invite-token" labels={LABELS} />);
    act(() => hooks.onToken?.("token-1"));

    await fillAndUpload(user);

    await waitFor(() => expect(screen.getByText(/Done: 1 work saved/)).toBeInTheDocument());
    expect(hooks.submit).toHaveBeenCalledTimes(1);
    const sent = hooks.submit.mock.calls[0][0] as FormData;
    expect(sent.get("cf-turnstile-response")).toBe("token-1");
    expect(sent.get("invite")).toBe("invite-token");
  });

  it("shows the spam-check message and does not retry when verification fails", async () => {
    const user = userEvent.setup();
    hooks.submit.mockResolvedValue({ status: "error", reason: "spam" });
    render(<ArtworkUploader token="invite-token" labels={LABELS} />);
    act(() => hooks.onToken?.("token-1"));
    const resetBefore = hooks.resets.at(-1);

    await fillAndUpload(user);

    expect(await screen.findByText("The security check failed. Try again.")).toBeInTheDocument();
    expect(hooks.submit).toHaveBeenCalledTimes(1);
    // The spent token is discarded and the widget reset, so the next attempt gets a fresh token.
    expect(hooks.resets.at(-1)).not.toBe(resetBefore);
  });

  it("skips the token entirely when the Turnstile site key is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    const user = userEvent.setup();
    hooks.submit.mockResolvedValue({ status: "saved" });
    render(<ArtworkUploader token="invite-token" labels={LABELS} />);

    await fillAndUpload(user);

    await waitFor(() => expect(hooks.submit).toHaveBeenCalledTimes(1));
    expect((hooks.submit.mock.calls[0][0] as FormData).get("cf-turnstile-response")).toBeNull();
  });
});
