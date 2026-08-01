import path from "path"
import type { StorybookConfig } from "@storybook/nextjs"

/**
 * Storybook for StarCi FE — the VISUAL tier of enforcement (.claude/fe/methodology/enforcement.md).
 * Every canonical block has stories covering its states → axe (a11y) fail-on-error + (later)
 * Chromatic/Playwright snapshots catch UI regressions lint can't see (contrast, fill-on-fill, dark mode).
 */
const config: StorybookConfig = {
    // SIX tiers, lowest first: `Atoms / Frames / Composites / Designs / Blocks / Screens`,
    // render-only stories + autodocs "Overview" per component. (This line read "4 tiers
    // Primitives / Block / Layout / Overlay" until 2026-07-27 — it described the FIRST plan,
    // not the tree that shipped, and nothing errors when a comment falls behind.)
    // The pre-2026-07-21 stories were
    // archived OUT of Storybook to `../.storybook-legacy/` (not loaded — kept only
    // for reference while the rewrite lands).
    // `_legacy` holds pre-2026-07-21 dead stories that still import components since removed
    // (the flattened `Feedback` namespace, the retired `PricePoint` atom, …). They are excluded
    // everywhere else (every gate skips `_legacy`); excluding them here keeps the preview building.
    stories: ["./stories/**/*.stories.@(ts|tsx)", "!./stories/_legacy/**"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
    framework: { name: "@storybook/nextjs", options: {} },
    staticDirs: ["../public"],
    // `tags: ['autodocs']` on a meta → an auto-generated docs page per component,
    // titled "Overview" (component description from JSDoc + Component API props
    // table from the TS types + every story as a gallery). No hand-written MDX.
    docs: {
        defaultName: "Overview",
    },
    // Component implementations live in a SEPARATE tree `.storybook/components/**`
    // (stories stay in `./stories/**`). Resolve `@sb-components/*` to it so stories
    // import components by alias instead of `../../../`. (Mirrors tsconfig paths.)
    webpackFinal: async (webpackConfig) => {
        webpackConfig.resolve = webpackConfig.resolve ?? {}
        webpackConfig.resolve.alias = {
            ...(webpackConfig.resolve.alias ?? {}),
            // main.ts is loaded as ESM (file:// URL) → no `__dirname`. `storybook dev`
            // runs from the project root, so resolve the components tree off cwd.
            "@sb-components": path.resolve(process.cwd(), ".storybook/components"),
            // Utils của Storybook (BlockAnatomy…) — KHÔNG phải component của hệ, nên
            // sống ngoài `components/` (thầy chốt 2026-07-25).
            "@sb-utils": path.resolve(process.cwd(), ".storybook/utils"),
        }
        return webpackConfig
    },
}

export default config
