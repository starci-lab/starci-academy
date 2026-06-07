"use client"

import React, { useMemo } from "react"
import { useTheme } from "next-themes"
import { useAppSelector } from "@/redux"
import { useQueryContentSwr, useRepoSandpackFiles } from "@/hooks"
import { SandpackPanel } from "@/components/reuseable/SandpackPanel"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import type { SandpackFiles } from "@codesandbox/sandpack-react"

/**
 * Tailwind v4 theme registered at runtime in the preview iframe. `@tailwindcss/browser`
 * uses the DEFAULT config (no HeroUI colors), and heroui.min.css does not ship
 * `bg-background` / `text-foreground` / `default-*` utilities — so we register them
 * here as a `<style type="text/tailwindcss">`. `@custom-variant dark` makes the
 * `.dark` class drive every token (page bg, text, hover) for both light and dark.
 */
const THEME_TAILWINDCSS = `@custom-variant dark (&:where(.dark, .dark *));
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-background: var(--sb-bg);
  --color-foreground: var(--sb-fg);
  --color-muted: var(--sb-muted);
  --color-border: var(--sb-border);
  --color-default-50: var(--sb-d50);
  --color-default-100: var(--sb-d100);
  --color-default-200: var(--sb-d200);
  --color-default-400: var(--sb-muted);
  --color-default-500: var(--sb-muted);
  --color-accent: var(--sb-accent);
}
:root {
  --sb-bg: oklch(97.02% 0.0033 185.90); --sb-fg: #18181b; --sb-muted: #71717a; --sb-border: #e4e4e7;
  --sb-d50: #fafafa; --sb-d100: #f4f4f5; --sb-d200: #e4e4e7; --sb-accent: #0d9488;
}
.dark {
  --sb-bg: oklch(12.00% 0.0033 185.90); --sb-fg: #fafafa; --sb-muted: #a1a1aa; --sb-border: #27272a;
  --sb-d50: oklch(16.00% 0.0033 185.90); --sb-d100: oklch(20.00% 0.0033 185.90); --sb-d200: #3f3f46; --sb-accent: #2dd4bf;
}`

/**
 * Bridges the Sandpack template entry (/App.tsx, imported as ../App) to the real
 * /src/App. Injects the Tailwind theme + toggles the platform light/dark mode on
 * the preview iframe's <html>.
 */
const buildAppBridge = (isDark: boolean): string => `import { useEffect } from "react"
import App from "./src/App"

export default function SandboxRoot() {
    useEffect(() => {
        document.documentElement.classList.toggle("dark", ${isDark})
        // load Inter (the font heroui.com uses) so the preview matches the docs
        if (!document.getElementById("sb-font")) {
            const link = document.createElement("link")
            link.id = "sb-font"
            link.rel = "stylesheet"
            link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            document.head.appendChild(link)
        }
        if (!document.getElementById("sb-theme")) {
            const style = document.createElement("style")
            style.id = "sb-theme"
            style.setAttribute("type", "text/tailwindcss")
            style.textContent = ${JSON.stringify(THEME_TAILWINDCSS)}
            document.head.appendChild(style)
        }
    }, [])
    return <App />
}
`

/**
 * Rewrites a lesson source file so it runs inside Sandpack's bundler:
 *  - `import.meta.env.VITE_API_BASE` → the session-scoped mock URL literal
 *  - any other `import.meta.env.X` → "" (bundler can't evaluate import.meta)
 *  - `import.meta.hot...` → undefined (HMR not available)
 *  - strips Tailwind/HeroUI @import directives (loaded via CDN instead)
 */
const rewriteForSandpack = (code: string, mockApiBase: string): string =>
    code
        .replace(/import\.meta\.env\.VITE_API_BASE/g, JSON.stringify(mockApiBase))
        .replace(/import\.meta\.env\.\w+/g, "\"\"")
        .replace(/import\.meta\.env/g, "({})")
        .replace(/import\.meta\.hot[^\n]*/g, "undefined")
        .replace(/@import\s+["']tailwindcss["'];?/g, "")
        .replace(/@import\s+["']@heroui\/styles["'];?/g, "")

/**
 * Sandbox tab body — runs the lesson's frontend live in Sandpack against a
 * session-isolated mock API served by the standalone mock app. Always light
 * theme (dark mode is intentionally ignored here).
 *
 * Flow:
 * 1. A random sessionId is generated client-side (the mock app lazily seeds on
 *    first request — no handshake needed).
 * 2. The lesson source is fetched from GitHub (cached by repo URL).
 * 3. Every file's `import.meta.env.VITE_API_BASE` is overridden to the mock URL
 *    `<mockHost>/mocks/<module>/<lesson>/sessions/<sessionId>` — the cloned source
 *    still falls back to `http://localhost:3000` for local dev.
 */
export const SandboxBody = () => {
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)
    // editor chrome follows the platform theme; the preview app stays light
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme !== "light"

    // host of the standalone mock app (e.g. http://localhost:3002 — no /api prefix)
    const mockApiHost = process.env.NEXT_PUBLIC_MOCK_API_BASE_URL ?? ""
    // lesson path on that host (e.g. /mocks/4-server-state.../0-usequery...)
    const lessonPath = content?.backendUrl ?? null

    // fresh isolated session id, stable for this lesson's component lifetime
    const sessionId = useMemo(
        () => (typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`),
        [content?.id],
    )

    const { files: githubFiles, dependencies, isLoading: githubLoading } = useRepoSandpackFiles(
        content?.id,
        content?.githubBaseUrl,
        content?.githubDir,
        content?.isPremium,
    )

    const contentReady = !queryContentSwr.isLoading && !!queryContentSwr.data && !queryContentSwr.error
    if (!contentReady || githubLoading) return <CodeBodySkeleton />

    // full session-scoped mock URL the lesson's VITE_API_BASE will point at
    const mockApiBase = lessonPath
        ? `${mockApiHost}${lessonPath}/sessions/${sessionId}`
        : ""

    // rewrite every fetched file's env reference to the live mock URL
    const rewrittenFiles: SandpackFiles = {}
    for (const [path, file] of Object.entries(githubFiles)) {
        const code = typeof file === "string" ? file : file.code
        rewrittenFiles[path] = { code: rewriteForSandpack(code, mockApiBase) }
    }

    // synthetic stubs: bridge the template entry (+ theme sync) and no-op the
    // vite config the bundler can't run. Tailwind v4 + HeroUI load via
    // SandpackProvider externalResources (not index.html — Sandpack ignores tags there).
    const stubs: SandpackFiles = {
        "/App.tsx": { code: buildAppBridge(isDark) },
        "/vite.config.ts": { code: "// vite config omitted in sandbox" },
    }

    const files: SandpackFiles = { ...stubs, ...rewrittenFiles }

    // thin, rounded, theme-aware scrollbars for the editor/file-tree (default ones look crude)
    const thumb = isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.16)"
    const thumbHover = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)"

    return (
        <div className="sb-scroll mt-3">
            <style>{`
                .sb-scroll *::-webkit-scrollbar { width: 8px; height: 8px; }
                .sb-scroll *::-webkit-scrollbar-track { background: transparent; }
                .sb-scroll *::-webkit-scrollbar-thumb { background: ${thumb}; border-radius: 9999px; border: 2px solid transparent; background-clip: content-box; }
                .sb-scroll *::-webkit-scrollbar-thumb:hover { background: ${thumbHover}; background-clip: content-box; }
                .sb-scroll *::-webkit-scrollbar-corner { background: transparent; }
                .sb-scroll * { scrollbar-width: thin; scrollbar-color: ${thumb} transparent; }
            `}</style>
            <SandpackPanel files={files} dependencies={dependencies} isDark={isDark} />
        </div>
    )
}
