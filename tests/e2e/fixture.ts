import { test as base, BrowserContext, chromium } from "@playwright/test";
import * as path from "path";

export const test = base.extend<{
    context: BrowserContext;
    extensionId: string;
}>({
    context: async ({}, use) => {
        const extensionPath = path.join(__dirname, "..", "..", "dist");
        const context = await chromium.launchPersistentContext("", {
            headless: false,
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`
            ]
        });

        await use(context);
        await context.close();
    },
    extensionId: async ({ context }, use) => {
        let [ background ] = context.serviceWorkers();
        if (!background)
            background = await context.waitForEvent("serviceworker");

        const extensionId = background.url().split('/')[2];
        await use(extensionId);
    }
});

export const expect = test.expect;