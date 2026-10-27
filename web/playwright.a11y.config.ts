import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.A11Y_PORT ?? 3111);

export default defineConfig({
  testDir: "./tests/a11y",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
