import React from "react"
import { Typography, cn } from "@heroui/react"
import { LockSimpleIcon } from "@phosphor-icons/react"
import { EnumChip, type EnumChipEntry } from "../../chips/EnumChip/EnumChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported from
 * `@/components/blocks/learn/EntityResultRow`. Authored in Storybook (not `src`);
 * synced to `src` later. NO `@/components` / `@/modules` imports — the
 * `SearchCourseContentItem` shape + the `entityResult` i18n strings are inlined
 * below, and the kind chip composes the local {@link EnumChip} primitive (the src
 * hand-rolls a raw HeroUI `Chip` — see the port report's P2 flag).
 */

/** Inlined shape of the RAG search hit (mirrors `@/modules/.../SearchCourseContentItem`). */
export interface SearchCourseContentItem {
    kind: string
    title: string
    breadcrumb: string | null
    snippet: string
    score: number
    moduleId: string | null
    contentId: string | null
    deckId: string | null
    taskId: string | null
    isLocked: boolean
}

/** Inlined `entityResult` i18n strings (vi) — the caller normally passes these via next-intl. */
const STRINGS = {
    kindContent: "Bài học",
    kindChallenge: "Thử thách",
    kindFlashcard: "Flashcard",
    kindMilestone: "Dự án",
    enrollToOpen: "Ghi danh để mở",
} as const

/**
 * Per-kind chip presentation for the local {@link EnumChip}. `code` shares the
 * lesson's presentation (it resolves to a content page). Unknown kinds fall back
 * to `content`.
 */
const KIND_META: Record<"content" | "code" | "challenge" | "flashcard" | "milestone", EnumChipEntry> = {
    content: { color: "success", label: STRINGS.kindContent },
    code: { color: "success", label: STRINGS.kindContent },
    challenge: { color: "warning", label: STRINGS.kindChallenge },
    flashcard: { color: "accent", label: STRINGS.kindFlashcard },
    milestone: { color: "default", label: STRINGS.kindMilestone },
}

type KnownKind = keyof typeof KIND_META

/** Resolve a hit's kind to a known key, defaulting unknown kinds to content. */
const resolveKind = (kind: string): KnownKind => (kind in KIND_META ? (kind as KnownKind) : "content")

/** Props for the {@link EntityResultRow} block. */
export interface EntityResultRowProps {
    /** The RAG search hit to render (content/challenge/flashcard/milestone). */
    item: SearchCourseContentItem
    /** Fired when the row is clicked — the caller owns navigation. */
    onSelect: (item: SearchCourseContentItem) => void
    /** Show a kind chip above the title (chat tool-result). Default off (quiet related-content list). */
    showKindChip?: boolean
    /** Show a one-line snippet under the title as context. Default off. */
    showSnippet?: boolean
    /** Extra classes on the row. */
    className?: string
    /** Anatomy tag: names this row's part so a {@link BlockAnatomy} panel can badge it. */
    anatPart?: string
}

/**
 * One pickable RAG result row — the shared row shape behind the content-AI
 * search view, the passive "related content" list, and the in-chat tool-result
 * widget. A nav go-there link: the whole row navigates on click, so hover
 * underlines the TITLE (never a background fill), and the row carries
 * `cursor-pointer`. The AFFORDANCE is the title itself — plain `text-foreground`
 * with a hover-underline, NO accent + NO trailing arrow. Layout: optional kind
 * chip / breadcrumb, then the foreground title, then an optional snippet — all
 * stacked left, no right column.
 *
 * @param props - {@link EntityResultRowProps}
 */
export const EntityResultRow = ({
    item,
    onSelect,
    showKindChip = false,
    showSnippet = false,
    className,
    anatPart,
}: EntityResultRowProps) => {
    const kind = resolveKind(item.kind)
    return (
        <button
            type="button"
            data-anat-part={anatPart}
            onClick={() => onSelect(item)}
            className={cn(
                "group relative flex w-full cursor-pointer flex-col gap-2 px-4 py-3 text-left after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-surface-foreground/6 after:content-[''] last:after:hidden",
                className,
            )}
        >
            {showKindChip ? (
                <EnumChip value={kind} map={KIND_META} className="w-fit" />
            ) : item.breadcrumb ? (
                <Typography type="body-xs" color="muted" truncate>
                    {item.breadcrumb}
                </Typography>
            ) : null}
            {/* affordance = the TITLE itself: FOREGROUND text + hover-underline ONLY — no
                accent, no arrow. Nav link → hover underlines the title. */}
            <Typography
                type="body-sm"
                weight="medium"
                truncate
                className="text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
            >
                {item.title}
            </Typography>
            {showSnippet && item.snippet ? (
                <Typography type="body-xs" color="muted" truncate>
                    {item.snippet}
                </Typography>
            ) : null}
            {/* locked = this viewer must enrol to open it (premium lesson / capstone).
                The row still NAVIGATES — landing on the surface's own enrol gate is the
                funnel; this only sets the expectation first. */}
            {item.isLocked ? (
                <span className="flex items-center gap-1 text-warning-soft-foreground">
                    <LockSimpleIcon aria-hidden focusable="false" className="size-3.5 shrink-0" />
                    <Typography type="body-xs" className="text-warning-soft-foreground">
                        {STRINGS.enrollToOpen}
                    </Typography>
                </span>
            ) : null}
        </button>
    )
}
