import React from "react"
import { SurfaceCardNested, type SurfaceCardNestedSection } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { AsyncContent, type AsyncContentErrorProps } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChangelogList`: the dashboard right-rail "What's new" list — dated
 * changelog rows (an optional category, a title that opens the entry when it
 * has a destination, an optional one-line body), ported from
 * `@/components/features/dashboard/ChangelogList` (`framed=true` path — the
 * dashboard Overview-tab placement; the flat/legacy heading path that same
 * file also supports is a different screen, out of THIS block's scope).
 *
 * REUSE, NOT A NEW SHAPE:
 *   • `SurfaceCardNested` (composite) — the card-in-card frame WITH A HEADER
 *     BAR sitting INSIDE the frame. Its `title` slot carries the section label
 *     ("What's new") and its `items` slot carries the divided rows. This block
 *     never builds a card box, a header bar or a divider by hand.
 *   • `AsyncContent` (composite) — the error → loading → empty → content
 *     switch. Left `emptyContent` UNSET on purpose (see the empty-state note
 *     below) so the composite's own SILENT empty branch fires.
 *   • `Typography` (atom) — the body line under a row's title; `SurfaceCard`'s
 *     own `NestedSection` renders `content` completely unstyled, so this is
 *     the one place this block still reaches for a leaf directly.
 *
 * WHAT THIS BLOCK OWNS (§14d.1 — domain wording the caller must not hand in):
 *   • The date format (`vi-VN`, matches every other already-shipped dashboard
 *     surface — the real `src` component reads the app locale via
 *     `next-intl`'s `useLocale()`; this presentational tier takes no i18n
 *     hook, per the same "next-intl strings inlined locally (vi)" convention
 *     `TrialConversionStrip`/`PriceTag` already carry).
 *   • The category → label lookup (`CATEGORY_LABEL`).
 *   • Composing the meta line ("{ date } · { category label }") — see the
 *     judgement call below for why this is TEXT, not a colored chip.
 *
 * LEAF BOUNDARY (canon `2-leaf-states.md` §0's R0 test — "who flips the prop
 * that changes the tree?"):
 *   • `isLoading` — the CALLER sets this boolean and it swaps the whole region
 *     for a skeleton mirror ⇒ its own LEAF, same as every other list block.
 *   • `error` — optional, and its PRESENCE alone swaps the whole region for a
 *     message ⇒ its own LEAF (§2②).
 *   • `entries.length === 0` is DATA returning `0` (R0's own worked example)
 *     ⇒ a STATE, not a leaf of its own. This block deliberately passes
 *     `isEmpty` with NO `emptyContent` — `AsyncContent`'s own contract is
 *     "left empty → the empty branch renders null (the section hides
 *     itself)", which is the EXACT behaviour the real `src` component hand-
 *     rolled (`if (!isLoading && !error && entries.length === 0) return
 *     null`). Reusing the composite's own silent branch instead of adding a
 *     second `return null` guard keeps that behaviour in ONE place.
 *
 * ⭐ JUDGEMENT CALL — the meta line reads as plain muted text ("Nov 3 ·
 * Feature"), not a colored category pill. `SurfaceCardNestedSection` gives
 * each row exactly ONE `eyebrow` slot, rendered through `Typography`'s own
 * `text` prop (a `<span>`) — there is no second per-row chip channel to hang
 * a `Chip` off without reaching past the resolved primitive. Documented here
 * rather than silently dropping the category signal or inventing a slot
 * `SurfaceCardNested` does not have.
 *
 * ⭐ JUDGEMENT CALL — a row with `linkUrl` becomes a whole-row link (via
 * `NestedSection`'s own `href`/interactive branch — nav-link affordance,
 * title underlines on hover), not just the title text. The real `src`
 * component only linked the title span; `SurfaceCardNested` has no way to
 * make a SUBSTRING of a non-interactive row into a link, so widening the
 * press target to the row is the faithful adaptation to the resolved shape.
 *
 * ⭐ JUDGEMENT CALL — no outer `Label`/`LabeledCard`. The real `src` component
 * needed `LabeledCard frameless` ONLY to avoid double card chrome (its body,
 * `SurfaceListCard`, was already its own card face). `SurfaceCardNested`'s
 * built-in header bar already sits INSIDE the one card face this block draws,
 * so the section label lives there instead of a second wrapper outside it.
 *
 * ⭐ JUDGEMENT CALL — `body` renders as plain text, not markdown, even though
 * the upstream field is documented as markdown. The real `src` component
 * renders it with a bare `Typography`, never a markdown viewer — this block
 * mirrors what `src` actually draws, not what the field's doc comment claims.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Category of a changelog entry — mirrors `ChangelogCategory` (backend-sourced enum). */
export type ChangelogCategory = "feature" | "fix" | "announcement"

/** One changelog row — plain DATA; the block builds the meta line, link target and body styling. */
export interface ChangelogListEntry {
    /** Stable id — the React key. */
    id: string
    /** Headline. */
    title: string
    /** Short body under the title. Row has no third line when absent. */
    body?: string | null
    /** Drives the meta line's trailing label via {@link CATEGORY_LABEL}. Row has no category text when absent. */
    category?: ChangelogCategory | null
    /** ISO publish date — the block formats it (`vi-VN`). */
    publishedAt: string
    /** "Read more" destination. Present → the whole row becomes a link (see file header). */
    linkUrl?: string | null
}

/** Props for {@link ChangelogList}. */
export interface ChangelogListProps {
    /** The recent changelog entries, newest first. REQUIRED — see file header §R0. */
    entries: Array<ChangelogListEntry>
    /** `true` → the list's own fetch is in flight; own LEAF (see file header). */
    isLoading: boolean
    /** Truthy → the list falls to its error message; own LEAF (beats loading/empty). */
    error?: unknown
    /** Fired when the reader presses "Retry" on the error branch. Omit to render the error with no action. */
    onRetry?: () => void
    /** Extra classes on the root. */
    className?: string
}

/** The block's own section label — matches `dashboard.changelog` in `vi.json`. */
const TITLE = "What's new"

/** category → meta-line label — the block's own vocabulary (§14d.1), never handed in by a caller. */
const CATEGORY_LABEL: Record<ChangelogCategory, string> = {
    feature: "Feature",
    fix: "Fix",
    announcement: "Announcement",
}

const ERROR_TITLE = "Couldn't load the changelog. Please try again."
const RETRY_LABEL = "Retry"

/** How many placeholder rows mirror the list while `entries` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** Formats an ISO date the same way across every row — the block's one date rule. */
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("vi-VN")

/** One row's meta line: the formatted date, plus the category label when present. */
const metaLine = (entry: ChangelogListEntry): string => {
    const category = entry.category ? CATEGORY_LABEL[entry.category] : null
    return category ? `${formatDate(entry.publishedAt)} · ${category}` : formatDate(entry.publishedAt)
}

/** Placeholder rows for the loading mirror — no data, no press target (§12c). */
const skeletonItems = (): Array<SurfaceCardNestedSection> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        eyebrow: "x",
        title: "x",
        content: () => <Typography size="sm" color="muted" isSkeleton text="x" />,
    }))

/** One real row: meta line, title (linked when `linkUrl` is set), optional body. */
const entryItem = (entry: ChangelogListEntry): SurfaceCardNestedSection => ({
    key: entry.id,
    eyebrow: metaLine(entry),
    title: entry.title,
    content: entry.body ? () => <Typography size="sm" color="muted" text={entry.body} /> : undefined,
    href: entry.linkUrl ?? undefined,
})

/**
 * The dashboard "What's new" rail. See the file header for the full contract,
 * the leaf boundary reasoning and the judgement calls (meta-line text instead
 * of a chip, whole-row link, no outer label wrapper, plain-text body).
 *
 * @param props - {@link ChangelogListProps}
 */
const ChangelogList = ({
    entries,
    isLoading,
    error,
    onRetry,
    className,
}: ChangelogListProps) => {
    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel: onRetry ? RETRY_LABEL : undefined,

    }

    return (
        <div className={className}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={
                    <SurfaceCardNested
                        title={TITLE}
                        items={skeletonItems()}
                        isSkeleton

                    />
                }
                isEmpty={entries.length === 0}
                error={error}
                errorContent={errorContent}

                content={
                    <SurfaceCardNested
                        title={TITLE}
                        items={entries.map(entryItem)}

                    />
                }
            />
        </div>
    )
}

export { ChangelogList }
