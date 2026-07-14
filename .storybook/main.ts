import type { StorybookConfig } from "@storybook/nextjs"

/**
 * Storybook cho StarCi FE — tầng VISUAL của enforcement (.claude/fe/methodology/enforcement.md).
 * Mỗi block canonical có story đủ state → axe (a11y) fail-on-error + (sau) Chromatic/Playwright
 * snapshot bắt regression giao diện mà LINT không thấy (contrast, fill-on-fill, dark-mode).
 */
const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-a11y"],
    framework: { name: "@storybook/nextjs", options: {} },
    staticDirs: ["../public"],
}

export default config
