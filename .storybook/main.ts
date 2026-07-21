import type { StorybookConfig } from "@storybook/nextjs"

/**
 * Storybook for StarCi FE — the VISUAL tier of enforcement (.claude/fe/methodology/enforcement.md).
 * Every canonical block has stories covering its states → axe (a11y) fail-on-error + (later)
 * Chromatic/Playwright snapshots catch UI regressions lint can't see (contrast, fill-on-fill, dark mode).
 */
const config: StorybookConfig = {
    // The rewrite: 4 tiers `Primitives / Block / Layout / Overlay`, render-only
    // stories + autodocs "Overview" per component. The pre-2026-07-21 stories were
    // archived OUT of Storybook to `../.storybook-legacy/` (not loaded — kept only
    // for reference while the rewrite lands).
    stories: ["./stories/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
    framework: { name: "@storybook/nextjs", options: {} },
    staticDirs: ["../public"],
    // `tags: ['autodocs']` on a meta → an auto-generated docs page per component,
    // titled "Overview" (component description from JSDoc + Component API props
    // table from the TS types + every story as a gallery). No hand-written MDX.
    docs: {
        defaultName: "Overview",
    },
}

export default config
