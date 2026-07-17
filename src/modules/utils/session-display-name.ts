import type { useTranslations } from "next-intl"

/** Translator returned by next-intl's `useTranslations`. Mirrors `MarkdownTranslator`. */
type SessionNameTranslator = ReturnType<typeof useTranslations>

/**
 * Renders a session's "HH:mm · D/M" time tag for the fallback display name —
 * day/month order is FIXED (not locale-reordered like `M/D` in en-US) since this
 * is a short session tag, not a full date; only the digits themselves go through
 * `Intl` so they still render in the viewer's locale numbering.
 */
const formatSessionTime = (createdAt: string, locale: string): string => {
    const date = new Date(createdAt)
    const hm = new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date)
    return `${hm} · ${date.getDate()}/${date.getMonth() + 1}`
}

/**
 * Display name for a mock-interview / flashcard-quiz session — the learner's own
 * name when they set one at setup, else a TIME-BASED fallback derived from the
 * session's own `createdAt` ("Phiên 14:30 · 12/7"). Never random-generated: an
 * unnamed session always reads by exactly when it was started.
 * @param name - the session's stored `name` (optional field, BE nullable).
 * @param createdAt - ISO timestamp the fallback is derived from — the session's
 *   own `createdAt` where available; a resumable session that only carries
 *   `updatedAt` (no `createdAt` in its query shape) passes that instead, which
 *   is the closest available server timestamp for that session.
 * @param t - next-intl translator, reads `common.sessionNameDefault`.
 * @param locale - active locale, for the time tag's digit formatting.
 */
export const sessionDisplayName = (
    name: string | null | undefined,
    createdAt: string,
    t: SessionNameTranslator,
    locale: string,
): string => {
    const trimmed = name?.trim()
    if (trimmed) {
        return trimmed
    }
    return t("common.sessionNameDefault", { time: formatSessionTime(createdAt, locale) })
}
