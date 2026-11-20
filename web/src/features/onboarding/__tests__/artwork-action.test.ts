import { beforeEach, describe, expect, it, vi } from "vitest";

type Doc = Record<string, unknown>;
const state = vi.hoisted(() => ({
  invite: null as Doc | null,
  docs: {} as Record<string, Doc>,
  existing: [] as string[],
  ops: [] as unknown[],
  upload: vi.fn(),
  turnstile: true,
  turnstileData: null as FormData | null,
}));

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstile: async (data: FormData) => {
    state.turnstileData = data;
    return state.turnstile;
  },
}));

vi.mock("@/sanity/lib/write-client", () => ({
  getWriteClient: () => ({
    fetch: async (query: string, params: Record<string, string>) => {
      if (query.includes("memberInvite")) return state.invite && state.invite.token === params.secret ? state.invite : null;
      if (query.includes("path(")) return state.existing;
      if (query.includes("_id == $draft")) return state.docs[params.draft] ?? null;
      return [params.id, params.draft].flatMap((id) => (state.docs[id] ? [state.docs[id]] : []));
    },
    assets: { upload: state.upload },
    transaction: () => {
      const tx = {
        create: (doc: Doc) => (state.ops.push({ create: doc }), tx),
        patch: (id: string, fn: (p: unknown) => unknown) => {
          const op: Doc = { patch: id };
          const p = {
            setIfMissing: (v: Doc) => ((op.setIfMissing = v), p),
            append: (field: string, items: unknown[]) => ((op.append = { field, items }), p),
          };
          fn(p);
          state.ops.push(op);
          return tx;
        },
        commit: async () => undefined,
      };
      return tx;
    },
  }),
}));

import { submitArtwork } from "../actions";

const TOKEN = "a".repeat(32);
const jpeg = () => new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3])], "a.jpg", { type: "image/jpeg" });
const form = (fields: Record<string, string | File> = {}) => {
  const data = new FormData();
  data.set("invite", TOKEN);
  const base = { image: jpeg(), title: "Blue Study", medium: "Oil on canvas", dimensions: "24 × 30 in" };
  for (const [k, v] of Object.entries({ ...base, ...fields })) data.set(k, v);
  return data;
};
const liveInvite = (extra: Doc = {}) => ({
  _id: "drafts.invite1",
  token: TOKEN,
  expiresAt: new Date(Date.now() + 3600_000).toISOString(),
  memberId: "member-ada",
  ...extra,
});

beforeEach(() => {
  state.invite = liveInvite();
  state.docs = { "drafts.member-ada": { _id: "drafts.member-ada", _type: "member", name: "Ada" } };
  state.existing = [];
  state.ops = [];
  state.upload.mockReset().mockResolvedValue({ _id: "image-abc-10x10-jpg" });
  state.turnstile = true;
  state.turnstileData = null;
  vi.stubEnv("SANITY_API_WRITE_TOKEN", "t");
  vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "p");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("submitArtwork", () => {
  it("saves one draft artwork for the member and appends it to the member draft's featured works", async () => {
    expect(await submitArtwork(form({ year: "2019", description: "Study." }))).toEqual({ status: "saved" });
    expect(state.upload).toHaveBeenCalledTimes(1);
    const create = (state.ops[0] as { create: Doc }).create;
    expect(create._id).toMatch(/^drafts\.artwork-ada-[0-9a-f]{12}$/);
    expect(create).toMatchObject({
      _type: "artwork",
      title: "Blue Study",
      medium: "Oil on canvas",
      dimensions: "24 × 30 in",
      year: 2019,
      description: "Study.",
      artist: { artistType: "member", member: { _type: "reference", _ref: "member-ada" } },
      image: { _type: "imageWithAlt", asset: { _ref: "image-abc-10x10-jpg" }, alt: "Blue Study by Ada" },
    });
    const patch = state.ops[1] as { patch: string; setIfMissing: Doc; append: { field: string; items: Doc[] } };
    expect(patch.patch).toBe("drafts.member-ada");
    expect(patch.append.field).toBe("featuredArtworks");
    expect(patch.append.items[0]).toMatchObject({ _type: "reference", _ref: String(create._id).replace("drafts.", "") });
    // Never publishes, and never writes a published member id.
    expect(JSON.stringify(state.ops)).not.toMatch(/"(_id|patch)":"member-/);
  });

  it("asks the artist to save the profile first when no member draft exists", async () => {
    state.docs = {};
    expect(await submitArtwork(form())).toEqual({ status: "error", reason: "profile" });
    expect(state.upload).not.toHaveBeenCalled();
    expect(state.ops).toHaveLength(0);
  });

  it("asks for the profile when the invite has no member yet", async () => {
    state.invite = liveInvite({ memberId: null });
    expect(await submitArtwork(form())).toEqual({ status: "error", reason: "profile" });
  });

  it("rejects bytes that are not a JPEG without uploading", async () => {
    const fake = new File([new TextEncoder().encode("<svg onload=alert(1)>")], "x.jpg", { type: "image/jpeg" });
    expect(await submitArtwork(form({ image: fake }))).toEqual({ status: "error", reason: "image", errors: { image: "image" } });
    expect(state.upload).not.toHaveBeenCalled();
  });

  it("stops at the per-member limit", async () => {
    state.existing = Array.from({ length: 30 }, (_, i) => `drafts.artwork-ada-${i.toString(16).padStart(12, "0")}`);
    expect(await submitArtwork(form())).toEqual({ status: "error", reason: "limit" });
    expect(state.upload).not.toHaveBeenCalled();
  });

  it("returns field errors without uploading", async () => {
    const result = await submitArtwork(form({ title: "" }));
    expect(result).toEqual({ status: "error", reason: "fields", errors: { title: "required" } });
    expect(state.upload).not.toHaveBeenCalled();
  });

  it("checks the Turnstile token before writing, and returns a spam error without writing when it fails", async () => {
    state.turnstile = false;
    expect(await submitArtwork(form({ "cf-turnstile-response": "bad-token" }))).toEqual({ status: "error", reason: "spam" });
    expect(state.turnstileData?.get("cf-turnstile-response")).toBe("bad-token");
    expect(state.upload).not.toHaveBeenCalled();
    expect(state.ops).toHaveLength(0);
  });

  it("saves when the Turnstile check passes", async () => {
    state.turnstile = true;
    expect(await submitArtwork(form({ "cf-turnstile-response": "good-token" }))).toEqual({ status: "saved" });
    expect(state.upload).toHaveBeenCalledTimes(1);
  });

  it("rejects an invite that is turned off", async () => {
    state.invite = liveInvite({ revoked: true });
    expect(await submitArtwork(form())).toEqual({ status: "invalid" });
  });
});
