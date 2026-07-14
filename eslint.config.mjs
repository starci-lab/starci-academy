
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import starciFe from "./eslint-plugin-starci-fe/index.mjs"
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
        ],
    },
    { 
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
        plugins: { js }, 
        extends: ["js/recommended"], 
        languageOptions: { globals: globals.browser }
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        // register react-hooks so `react-hooks/*` rule names resolve (the rule is
        // kept off below; we only need the plugin loaded for the disable directives)
        plugins: { "react-hooks": pluginReactHooks },
        rules: {
            "react/display-name": "off",
            // React 19 + Next automatic JSX runtime — không cần `import React` trong scope.
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
        // ── StarCi FE canon — tầng ENFORCEMENT trục-1 cơ học (.claude/fe/enforcement) ──
        // Rule máy giết dần lint-candidates L1–L4/L6. Rollout: 'warn' cho luật còn nhiều
        // vi phạm cũ (gravity 60 file) → nâng 'error' khi codebase xanh; 'error' cho luật hiếm.
        files: ["src/**/*.{ts,tsx}"],
        plugins: { "starci-fe": starciFe },
        // ROLLOUT: tất cả 'warn' repo-wide (nợ cũ 216+116 hiển thị, burn dần qua ui-patch).
        // ENFORCEMENT thật ở pre-commit: lint-staged chạy `eslint --max-warnings=0` trên file
        // STAGED → code mới/động-vào KHÔNG thêm được vi phạm. Nâng 'error' repo-wide khi nợ về 0.
        rules: {
            "starci-fe/no-fractional-spacing": "error", // L4 · BURNED 2026-07-14 (nợ=0) → make-illegal
            "starci-fe/no-adjacent-chip": "error", // L3 · BURNED 2026-07-14 (nợ=0) → make-illegal
            "starci-fe/no-modal-title-classname": "error", // L2 · BURNED 2026-07-14 (nợ=0) → make-illegal
            "starci-fe/no-hero-heading-class": "warn", // L2b · heuristic, 13 nợ (landing/marketing hợp lệ) — giữ warn
            "starci-fe/no-arbitrary-token": "warn", // token · arbitrary spacing/hex (v4 không prune được) — advisory
            // L12 (modal-body-padding) KHÔNG bật: quá nhiều ngoại lệ hợp lệ (Drawer.Body p-0 dialog · p-0 full-bleed
            // · command-palette) → false-positive. Để cho constrained-primitive (ModalShell từ chối bodyClassName p-*), không phải lint.
        },
    },
    {
        // ── A11Y tier (L9) — eslint-plugin-jsx-a11y, tầng LINT thay Storybook-axe (nhẹ, 0 friction) ──
        // Curated rule cao-giá-trị, 'warn' rollout (nợ a11y cũ burn dần; gate pre-commit chặn code mới).
        files: ["src/**/*.{ts,tsx}"],
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
            // icon-only button/link thiếu accessible name (ShareModal SnippetIcon…), interactive div thiếu role/key:
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/no-static-element-interactions": "warn",
            "jsx-a11y/label-has-associated-control": "warn",
            "jsx-a11y/no-redundant-roles": "warn",
            // L1 · icon @gravity-ui — MIGRATED (60 file → Phosphor 2026-07-14, nợ=0) → error (make-illegal)
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@gravity-ui/icons",
                            message: "Dùng @phosphor-icons/react thay @gravity-ui (canon trục-1 §Icon · enforcement L1).",
                        },
                    ],
                    patterns: [
                        {
                            group: ["@gravity-ui/*"],
                            message: "Dùng @phosphor-icons/react thay @gravity-ui (canon trục-1 §Icon · enforcement L1).",
                        },
                    ],
                },
            ],
        },
    },
])
