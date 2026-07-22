import path from "node:path"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/**
 * Flowbook — a standalone Vite app that PROTOTYPES the app's screen flows: each flow's
 * UI is hand-drawn with the design system (HeroUI v3 primitives + the Tailwind v4
 * `globals.css` tokens) and walked through its states by an XState machine. It does NOT
 * import the app's feature/block components from `src` — the screens are redrawn so the
 * prototype needs no redux/socket/data harness. The only `@` reference is `globals.css`.
 */
export default defineConfig({
    root: __dirname,
    plugins: [react(), tailwindcss()],
    // `@ -> src` exists ONLY so we can pull in the app's real stylesheet (tokens/theme).
    resolve: { alias: { "@": path.resolve(__dirname, "../src") } },
    // Sits next to Storybook (6006) so the two dev servers never collide.
    server: { port: 6007, open: true },
})
