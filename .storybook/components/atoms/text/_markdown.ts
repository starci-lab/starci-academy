/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SHARED UTIL — `stripMarkdown`: markdown source → plain text, every marker
 * gone (code span, bold/italic/strike, heading, list marker, link/image).
 *
 * PORTED, NOT INVENTED (AUDIT 2026-07-30, feedback ChallengePage/Graded
 * round-3, thầy chốt: "viết lib chuyển markdown → plain text, bỏ ``, bỏ **").
 * `src`'s `useSpeechSynthesis.ts` already owns this exact transform — text fed
 * to the browser's speech API can't carry `` ` `` / `**` either, same problem
 * one tier over. Copied verbatim rather than re-derived, per §14d.1 (gần
 * giống thì áp dụng lại pattern, không xây mới).
 *
 * FOR THE "text" TIER, NOT "body". A field the content-authoring schema names
 * "text" (outputs/prerequisites — `.claude/docs/rules/fullstack/
 * challenges.md` §3) may still arrive with markdown syntax IN the string
 * (authors type `` `GET /tasks` `` out of habit even where it will render
 * plain) — this strips it at the RENDER boundary rather than trusting every
 * caller to hand in clean text.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Markdown source → plain text. Every marker removed, not styled — for fields that must never carry markdown at all (title tier, or a "text"-typed content field). */
export const stripMarkdown = (markdown: string): string =>
    markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_~]/g, "")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-+*]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim()
