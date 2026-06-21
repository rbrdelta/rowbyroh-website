// Gate B — Playwright config. Visual regression + functional/e2e against a
// local server that mirrors Vercel routing. Desktop + mobile projects.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
    testDir: '.',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['list']] : [['list']],
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}-{projectName}{ext}',
    use: {
        baseURL: `http://localhost:${PORT}`,
        // Visual stability: disable animations, freeze the scroll bar transitions.
        screenshot: 'off',
    },
    // Pixel tolerance so font-hinting / anti-aliasing jitter doesn't fail the run.
    expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' } },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    webServer: {
        command: `node ${new URL('./server.mjs', import.meta.url).pathname} ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
    },
});
