import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/members", "/events", "/about/organization"];
const WIDTHS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "phone", width: 375, height: 667 },
];

async function load(page: Page, route: string): Promise<boolean> {
  const res = await page.goto(route, { waitUntil: "load" });
  return !!res && res.status() < 400;
}

for (const route of ROUTES) {
  for (const vp of WIDTHS) {
    test.describe(`${route} @ ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test.beforeEach(async ({ page }) => {
        const ok = await load(page, route);
        test.skip(!ok, `${route} not available yet`);
      });

      test("axe: no WCAG A/AA violations", async ({ page }) => {
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const summary = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join(" | ")}`,
        );
        expect(summary, summary.join("\n")).toEqual([]);
      });

      test("exactly one h1", async ({ page }) => {
        await expect(page.locator("h1:visible")).toHaveCount(1);
      });

      test("images have meaningful alt", async ({ page }) => {
        const imgs = await page.locator("img").evaluateAll((els) =>
          els.map((e) => ({
            src: e.getAttribute("src") ?? "",
            alt: e.getAttribute("alt"),
            role: e.getAttribute("role"),
          })),
        );
        const bad = imgs.filter((i) => {
          if (i.alt === null) return true;
          if (i.alt === "" ) return false; // decorative allowed
          const a = i.alt.trim().toLowerCase();
          return /^(image|img|photo|picture)$/.test(a) || /\.(jpe?g|png|webp|gif|svg)$/.test(a);
        });
        expect(bad).toEqual([]);
      });

      test("links and buttons have accessible names", async ({ page }) => {
        const unnamed = await page.locator("a[href], button").evaluateAll((els) =>
          els
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            })
            .filter((e) => {
              const txt = (e.textContent ?? "").trim();
              const aria = e.getAttribute("aria-label") ?? e.getAttribute("aria-labelledby") ?? "";
              const imgAlt = e.querySelector("img[alt]:not([alt=''])");
              return !txt && !aria && !imgAlt;
            })
            .map((e) => e.outerHTML.slice(0, 120)),
        );
        expect(unnamed).toEqual([]);
        const vague = await page.locator("a[href]").evaluateAll((els) =>
          els
            .map((e) => ({ t: (e.textContent ?? "").trim().toLowerCase(), h: e.getAttribute("href") }))
            .filter((l) => /^(click here|here|read more|more)$/.test(l.t)),
        );
        expect(vague).toEqual([]);
      });

      test("keyboard focus is visible on every tab stop", async ({ page }) => {
        const problems: string[] = [];
        for (let i = 0; i < 40; i++) {
          await page.keyboard.press("Tab");
          const r = await page.evaluate(() => {
            const e = document.activeElement as HTMLElement | null;
            if (!e || e === document.body) return null;
            const cs = getComputedStyle(e);
            const outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
            const shadow = cs.boxShadow !== "none";
            const rect = e.getBoundingClientRect();
            return {
              desc: `${e.tagName.toLowerCase()}[${(e.textContent ?? "").trim().slice(0, 30)}]`,
              visible: outline || shadow,
              offscreen: rect.width === 0 || rect.height === 0,
            };
          });
          if (!r) break;
          if (!r.visible && !r.offscreen) problems.push(r.desc);
        }
        expect(problems).toEqual([]);
      });
    });
  }
}

// Token-level contrast checks (WCAG AA) for the design palette.
function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

test.describe("palette contrast", () => {
  const pairs: [string, string, string][] = [
    ["burgundy on paper", "#8D0428", "#FAF8F5"],
    ["white on burgundy", "#FFFFFF", "#8D0428"],
    ["#666 on paper", "#666666", "#FAF8F5"],
  ];
  for (const [name, fg, bg] of pairs) {
    test(`${name} >= 4.5:1`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
