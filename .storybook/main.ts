import type { StorybookConfig } from "@storybook/nextjs"

/**
 * Storybook for StarCi FE — the VISUAL tier of enforcement (.claude/fe/methodology/enforcement.md).
 * Every canonical block has stories covering its states → axe (a11y) fail-on-error + (later)
 * Chromatic/Playwright snapshots catch UI regressions lint can't see (contrast, fill-on-fill, dark mode).
 */
const config: StorybookConfig = {
    stories: ["./stories/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-a11y"],
    framework: { name: "@storybook/nextjs", options: {} },
    staticDirs: ["../public"],
}

export default config
