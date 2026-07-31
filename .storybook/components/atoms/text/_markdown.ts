/**
 * `stripMarkdown` — markdown source to plain text, every marker removed (code span,
 * bold/italic/strike, heading, list marker, link/image).
 *
 * Ported from `src`'s `useSpeechSynthesis.ts`, which strips markdown the same way
 * before feeding text to the browser's speech API — same problem, one tier over.
 *
 * For the "text" tier, not "body": a field typed `text` in the content schema may still
 * arrive with markdown syntax in it (authors type `` `GET /tasks` `` out of habit even
 * where it renders plain) — this strips it at the render boundary rather than trusting
 * every caller to hand in clean text.
 */
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
