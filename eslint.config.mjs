
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
        ],
    },
    { 
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
        plugins: { js }, 
        extends: ["js/recommended"], 
        languageOptions: { globals: globals.browser }
    },
    {
        // `scripts/**` là dao gate chạy trên Node, không phải code chạy trong browser —
        // `process`/`console` ở đó là hợp lệ. Không có block này thì mọi script gate đều
        // đỏ `no-undef` (cả `check-story-coverage.mjs` có từ trước), nên ai cũng học cách
        // ngó lơ eslint ở thư mục này — đúng cách một gate chết dần.
        files: ["scripts/**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.node },
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
        // `nivoexpert/**` components are deliberately PLAIN CSS (styled-jsx reading
        // `--nivo-*` runtime tokens), not HeroUI/Tailwind — see
        // canon/fe/enforce/tiers/split.md, "Sync precondition" (nivo-expert-app
        // re-themes per tenant at runtime, so its twins read its OWN tokens, never
        // the vendor-wrapping atoms). `react/no-unknown-property` does not know the
        // Next.js styled-jsx `<style jsx>` convention out of the box (unlike
        // `eslint-config-next`, which this book does not extend) — allow just the
        // two props styled-jsx adds, scoped to the one namespace that uses it.
        files: [".storybook/components/nivoexpert/**/*.{ts,tsx}"],
        rules: {
            "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
        },
    },
    {
        // ── StarCi FE canon — tầng ENFORCEMENT trục-1 cơ học (.claude/fe/enforcement) ──
        // Rule máy giết dần lint-candidates L1–L4/L6. Rollout: 'warn' cho luật còn nhiều
        // vi phạm cũ (gravity 60 file) → nâng 'error' khi codebase xanh; 'error' cho luật hiếm.
        // `.storybook/**` phủ story tree (chuyển khỏi src/ 2026-07-16) — story vẫn theo canon.
        files: ["src/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
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
            // authoring convention (2026-08) — 'warn' repo-wide (nợ cũ nhiều); pre-commit --max-warnings=0
            // trên file STAGED chặn vi phạm MỚI. Nâng 'error' khi từng luật về nợ 0.
            "starci-fe/prefer-arrow-export": "warn", // structure-and-naming §5 · hàm module-level = arrow const
            "starci-fe/require-export-jsdoc": "warn", // comments §3 · export mở đầu bằng JSDoc
            "starci-fe/handler-on-prefix": "warn", // react-idioms §7 · handler `onXxx` không `handleXxx`
            "starci-fe/export-matches-folder": "warn", // structure-and-naming §1/§5 · index.tsx export trùng tên folder
            // L12 (modal-body-padding) KHÔNG bật: quá nhiều ngoại lệ hợp lệ (Drawer.Body p-0 dialog · p-0 full-bleed
            // · command-palette) → false-positive. Để cho constrained-primitive (ModalShell từ chối bodyClassName p-*), không phải lint.

            // tier rules (2026-08 refactor) — đo nợ trên `src/**` với đúng 1 rule bật/lần trước khi wire.
            // Cùng ROLLOUT ở trên: 'warn' repo-wide khi nợ > 0 (pre-commit --max-warnings=0 trên STAGED
            // chặn vi phạm MỚI, nợ cũ burn dần), 'error' khi nợ đo được = 0 (sinh ra sạch, giữ sạch).
            "starci-fe/no-heroui-outside-vocabulary": "warn", // [[canon atom-layer-heroui-wrappers]] · nợ đo 2026-08-05 = 655
            "starci-fe/no-classname-at-sentence-tier": "warn", // [[canon BLOCK-4]] · nợ đo 2026-08-05 = 671
            "starci-fe/no-cn-above-vocabulary": "warn", // [[canon BLOCK-5]] · nợ đo 2026-08-05 = 792
            "starci-fe/no-retired-async-content": "warn", // [[canon fe-asynccontent-4branch-retired]] · nợ đo 2026-08-05 = 103
            "starci-fe/no-anatomy-overlay": "warn", // [[canon atom-tightening-migration-and-pos-ruling]] · nợ đo 2026-08-05 = 3
            "starci-fe/presentational-purity": "error", // [[canon split.md]] · nợ đo 2026-08-05 = 0 — sinh sạch (pilot split đã dọn trước lint), giữ sạch
            "starci-fe/require-identity-root": "warn", // [[canon components/frames/_identity.ts]] · rewired 2026-08-05 (root mang identity, không phải div bọc) · nợ đo 2026-08-05 = 814
            "starci-fe/no-identity-wrapper-div": "warn", // [[canon components/frames/_identity.ts]] · nợ đo 2026-08-05 = 1
            "starci-fe/no-raw-shape-at-sentence-tier": "warn", // [[canon sentence-tier-composes-not-draws]] · nợ đo 2026-08-05 = 1746
            "starci-fe/no-parallel-skeleton": "warn", // [[canon v2-src-twins-and-gates]] · nợ đo 2026-08-05 = 159
            "starci-fe/no-hardcoded-user-text-in-vocabulary": "warn", // [[canon fe-no-custom-from-design-up]] · nợ đo 2026-08-05 = 4
        },
    },
    {
        // ── A11Y tier (L9) — eslint-plugin-jsx-a11y, tầng LINT thay Storybook-axe (nhẹ, 0 friction) ──
        // Curated rule cao-giá-trị, 'warn' rollout (nợ a11y cũ burn dần; gate pre-commit chặn code mới).
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
            // icon-only button/link thiếu accessible name (ShareModal SnippetIcon…), interactive div thiếu role/key:
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/no-static-element-interactions": "warn",
            "jsx-a11y/label-has-associated-control": "warn",
            "jsx-a11y/no-redundant-roles": "warn",
            // Icon libs — CHO PHÉP CẢ @phosphor-icons/react LẪN @gravity-ui/icons (thầy chốt 2026-07-22,
            // gỡ ban gravity 2026-07-14). Chọn icon theo thẩm mỹ; size icon theo TEXT-size (principles §5 icon-size).
        },
    },
])
