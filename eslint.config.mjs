import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import starciFe from "./plugins/eslint/index.mjs"
import jsxA11y from "eslint-plugin-jsx-a11y"

export default defineConfig([
    {
        ignores: [
            "**/.next/**",
            "**/node_modules/**",
            "**/dist/**",
            "**/out/**",
            "**/.turbo/**",
            "**/coverage/**",
            // Generated audit reports and one-off migration scripts are evidence,
            // not product source. They are validated by their own audit runners.
            "**/.artifacts/**",
            "**/next-env.d.ts",
        ],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
    },
    {
        // `scripts/**` are Node gate runners, not browser code — `process`/`console`
        // are valid there. Without this block every script gate goes red on `no-undef`.
        files: ["scripts/**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: { "react-hooks": pluginReactHooks },
        rules: {
            "react/display-name": "off",
            "react/react-in-jsx-scope": "off",
            "react/no-unescaped-entities": "off",
            indent: ["error", 4],
            "react-hooks/exhaustive-deps": "off",
            "linebreak-style": "off",
            quotes: ["error", "double"],
            semi: ["error", "never"],
        },
    },
    {
        files: [".storybook/components/nivoexpert/**/*.{ts,tsx}"],
        rules: {
            "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
        },
    },
    {
        // StarCi FE canon — mechanical ENFORCEMENT. 'warn' while old debt remains;
        // raise to 'error' at measured zero. Pre-commit --max-warnings=0 on staged files.
        files: ["src/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
        plugins: { "starci-fe": starciFe },
        rules: {
            "starci-fe/no-fractional-spacing": "error",
            "starci-fe/no-adjacent-chip": "error",
            "starci-fe/no-modal-title-classname": "error",
            "starci-fe/no-hero-heading-class": "warn",
            "starci-fe/no-arbitrary-token": "warn",
            "starci-fe/prefer-arrow-export": "warn",
            "starci-fe/require-export-jsdoc": "warn",
            "starci-fe/handler-on-prefix": "warn",
            "starci-fe/export-matches-folder": "warn",
            "starci-fe/no-heroui-outside-vocabulary": "warn",
            "starci-fe/no-classname-at-sentence-tier": "warn",
            "starci-fe/no-cn-above-vocabulary": "warn",
            "starci-fe/no-retired-async-content": "warn",
            "starci-fe/no-anatomy-overlay": "warn",
            "starci-fe/presentational-purity": "error",
            "starci-fe/require-identity-root": "warn",
            "starci-fe/no-identity-wrapper-div": "warn",
            "starci-fe/no-raw-shape-at-sentence-tier": "warn",
            "starci-fe/no-parallel-skeleton": "warn",
            "starci-fe/explain-justifies-token-choice": "error",
            "starci-fe/no-per-part-classname-prop": "warn",
            "starci-fe/require-frame-self-declare": "warn",
            "starci-fe/no-inline-skeleton-branch": "warn",
            "starci-fe/page-folder-two-files-only": "warn",
            "starci-fe/no-skeleton-twin-component": "warn",
            "starci-fe/no-helper-folder-in-components": "warn",
            "starci-fe/no-hardcoded-user-text-in-vocabulary": "warn",
            // Authoring rules (2026-08-06) — warn until debt 0, then ratchet.
            "starci-fe/no-inline-parameter-type": "warn",
            "starci-fe/no-emoji-in-source": "warn",
            "starci-fe/no-vietnamese-in-source-authoring": "warn",
        },
    },
    {
        files: ["src/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
        plugins: { "starci-fe": starciFe },
        rules: {
            "starci-fe/no-public-frame-css-props": "error",
        },
    },
    {
        files: ["plugins/eslint/**/*.{js,mjs,cjs}", "scripts/**/*.{js,mjs,cjs}"],
        plugins: { "starci-fe": starciFe },
        rules: {
            "starci-fe/no-inline-parameter-type": "warn",
            "starci-fe/no-emoji-in-source": "warn",
            "starci-fe/no-vietnamese-in-source-authoring": "warn",
        },
    },
    {
        files: ["src/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
        plugins: { "jsx-a11y": jsxA11y },
        rules: {
            "jsx-a11y/alt-text": "warn",
            "jsx-a11y/anchor-has-content": "warn",
            "jsx-a11y/anchor-is-valid": "warn",
            "jsx-a11y/aria-props": "warn",
            "jsx-a11y/aria-role": "warn",
            "jsx-a11y/aria-unsupported-elements": "warn",
            "jsx-a11y/role-has-required-aria-props": "warn",
            "jsx-a11y/role-supports-aria-props": "warn",
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/no-static-element-interactions": "warn",
            "jsx-a11y/label-has-associated-control": "warn",
            "jsx-a11y/no-redundant-roles": "warn",
        },
    },
    {
        files: ["plugins/eslint/**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.node },
        rules: {
            indent: "off",
        },
    },
    {
        files: [".storybook/test-runner.ts", ".storybook/test-runner/**/*.{js,mjs,ts}"],
        rules: {
            "starci-fe/prefer-arrow-export": "off",
        },
    },
])
