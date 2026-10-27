import { test, expect } from "@playwright/test";

const NEWS = [
  "https://npnweb.org/an-interview-with-geeta-dave/",
  "https://www.pragatisharma.com/",
  "https://www.pragatisharma.com/",
  "https://www.indianamericanartists.org/member-bios/members/salma-arastu",
  "https://galleryat808.com/portfolio/exhibition-pieces/",
  "https://www.indianamericanartists.org/member-bios/members/usha-shukla",
  "https://www.healing-power-of-art.org/world-changer-sujata-tibrewala-artist-and-founder-of-iaaa/",
  "https://www.indianamericanartists.org/member-bios/members/geeta-dave",
];

const COLS: Record<string, number> = { desktop: 4, tablet: 2, phone: 1 };

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders the hero h1", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your art has a story. Let’s help it travel further.",
  );
});

test("member news has 8 cards with correct hrefs", async ({ page }) => {
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Member news & creative milestones" }) });
  const cards = section.locator("a[href]");
  await expect(cards).toHaveCount(8);
  const hrefs = await cards.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")));
  expect(hrefs).toEqual(NEWS);
});

test("member news grid column count matches viewport", async ({ page }, info) => {
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Member news & creative milestones" }) });
  const cards = section.locator("a[href]");
  await expect(cards).toHaveCount(8);
  const lefts = await cards.evaluateAll((els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().left)),
  );
  expect(new Set(lefts).size).toBe(COLS[info.project.name]);
});

test("nav links point to the expected pages", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [label, path] of [
    ["About", "/about"],
    ["Events", "/events"],
    ["Membership", "/membership"],
    ["Ways to Give", "/ways-to-give"],
  ]) {
    const href = await nav.getByRole("link", { name: label }).getAttribute("href");
    expect(href, label).toMatch(new RegExp(`${path}$`));
  }
});

test("membership band CTA links to /membership", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Find the community that helps you grow." }),
  ).toBeVisible();
  const cta = page.getByRole("link", { name: /Become a member · \$50 \/ year/ });
  await expect(cta).toBeVisible();
  expect(await cta.getAttribute("href")).toMatch(/\/membership$/);
});
