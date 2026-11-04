import { beforeEach, describe, expect, it, vi } from "vitest";

type Doc = Record<string, unknown>;
const state = vi.hoisted(() => ({
  invite: null as Doc | null,
  docs: {} as Record<string, Doc>,
  ops: [] as unknown[],
  taken: 0,
  upload: vi.fn(),
}));

vi.mock("@/sanity/lib/write-client", () => ({
  getWriteClient: () => ({
    fetch: async (query: string, params: Record<string, string>) => {
      if (query.includes("memberInvite")) return state.invite && state.invite.token === params.secret ? state.invite : null;
      if (query.startsWith("count(")) return state.taken;
      return [params.id, params.draft].flatMap((id) => (state.docs[id] ? [state.docs[id]] : []));
    },
    getDocument: async (id: string) => state.docs[id] ?? null,
    assets: { upload: state.upload },
    transaction: () => {
      const tx = {
        createIfNotExists: (doc: Doc) => (state.ops.push({ create: doc }), tx),
        patch: (id: string, fn: (p: unknown) => unknown) => {
          const op: Doc = { patch: id };
          const p = { set: (v: Doc) => ((op.set = v), p), unset: (v: string[]) => ((op.unset = v), p) };
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

import { submitProfile } from "../actions";

const TOKEN = "a".repeat(32);
const jpeg = () => new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3])], "profile.jpg", { type: "image/jpeg" });
const form = (fields: Record<string, string | File>) => {
  const data = new FormData();
  data.set("invite", TOKEN);
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};
const base = { name: "Ada Lovelace", bio: "Hello.\n\nSecond.", photoAlt: "Ada smiling", photo: jpeg() };
const idle = { status: "idle" as const };
const liveInvite = (extra: Doc = {}) => ({
  _id: "drafts.invite1",
  token: TOKEN,
  expiresAt: new Date(Date.now() + 3600_000).toISOString(),
  ...extra,
});

beforeEach(() => {
  state.invite = liveInvite();
  state.docs = {};
  state.ops = [];
  state.taken = 0;
  state.upload.mockReset().mockResolvedValue({ _id: "image-abc-10x10-jpg" });
  vi.stubEnv("SANITY_API_WRITE_TOKEN", "t");
  vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "p");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("submitProfile", () => {
  it("creates an unpublished member draft for a new member and records it on the invite", async () => {
    expect((await submitProfile(idle, form(base))).status).toBe("success");
    const create = (state.ops[0] as { create: Doc }).create;
    expect(create).toMatchObject({ _id: "drafts.member-ada-lovelace", _type: "member", group: "member" });
    const patch = state.ops[1] as { patch: string; set: Doc };
    expect(patch.patch).toBe("drafts.member-ada-lovelace");
    expect(patch.set).toMatchObject({ name: "Ada Lovelace", photo: { _type: "imageWithAlt", alt: "Ada smiling" } });
    expect(patch.set.submittedAt).toBeTruthy();
    expect(state.ops[2]).toMatchObject({ patch: "drafts.invite1", set: { memberId: "member-ada-lovelace" } });
    // Never writes a published (non-draft) document.
    expect(JSON.stringify(state.ops)).not.toMatch(/"(_id|patch)":"member-/);
  });

  it.each([
    ["no token match", () => (state.invite = liveInvite({ token: "b".repeat(32) }))],
    ["expired", () => (state.invite = liveInvite({ expiresAt: new Date(Date.now() - 1000).toISOString() }))],
    ["turned off", () => (state.invite = liveInvite({ revoked: true }))],
    ["published (public) invite", () => (state.invite = liveInvite({ _id: "invite1" }))],
  ])("rejects an invite that is %s", async (_name, setup) => {
    setup();
    expect((await submitProfile(idle, form(base))).status).toBe("invalid");
    expect(state.ops).toHaveLength(0);
    expect(state.upload).not.toHaveBeenCalled();
  });

  it("rejects a malformed token without querying", async () => {
    const data = form(base);
    data.set("invite", "short");
    expect((await submitProfile(idle, data)).status).toBe("invalid");
  });

  it("rejects a file that is not really an image", async () => {
    const fake = new File([new TextEncoder().encode("<svg onload=alert(1)>")], "x.jpg", { type: "image/jpeg" });
    const result = await submitProfile(idle, form({ ...base, photo: fake }));
    expect(result.status).toBe("error");
    expect(result.errors?.photo).toBe("photo");
    expect(state.upload).not.toHaveBeenCalled();
  });

  it("picks a different id when the name is taken", async () => {
    state.taken = 1;
    await submitProfile(idle, form(base));
    const create = (state.ops[0] as { create: Doc }).create;
    expect(create._id).not.toBe("drafts.member-ada-lovelace");
  });

  it("starts an existing member's draft from the live profile and only changes form fields", async () => {
    state.invite = liveInvite({ memberRef: "member-sam" });
    state.docs["member-sam"] = {
      _id: "member-sam", _type: "member", _rev: "r", _createdAt: "x", name: "Sam", group: "leadership",
      roleTitle: "Treasurer", isFounder: true, photo: { asset: { _ref: "image-old-1x1-jpg" } },
    };
    const result = await submitProfile(idle, form({ name: "Sam Q", bio: "New bio", links_ignored: "x" }));
    expect(result.status).toBe("success");
    const create = (state.ops[0] as { create: Doc }).create;
    expect(create).toMatchObject({ _id: "drafts.member-sam", roleTitle: "Treasurer", isFounder: true, group: "leadership" });
    expect(create).not.toHaveProperty("_rev");
    const set = (state.ops[1] as { set: Doc }).set;
    expect(Object.keys(set).sort()).toEqual(["bio", "name", "submittedAt"]);
    expect((state.ops[1] as { unset: string[] }).unset).toEqual(["location", "tagline", "artistStatement", "links"]);
    expect(set).not.toHaveProperty("photo");
  });

  it("silently accepts bots that fill the spam trap", async () => {
    expect((await submitProfile(idle, form({ ...base, company: "x" }))).status).toBe("success");
    expect(state.ops).toHaveLength(0);
  });

  it("returns what was typed when validation fails", async () => {
    const result = await submitProfile(idle, form({ name: "Ada", bio: "", photoAlt: "x" }));
    expect(result.status).toBe("error");
    expect(result.errors?.bio).toBe("required");
    expect(result.values?.name).toBe("Ada");
  });
});
