import { defineRouting } from "next-intl/routing"

/**
 * i18n routing + locale cookie for middleware (`createMiddleware`).
 * `localeCookie`: persist chosen locale across visits (server-readable; not localStorage).
 * @see https://next-intl.dev/docs/routing/configuration#localecookie
 */
export const routing = defineRouting({
    locales: ["en", "vi"],
    defaultLocale: "vi",
    localeCookie: {
        name: "NEXT_LOCALE",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
    },
})