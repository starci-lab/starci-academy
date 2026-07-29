import React from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Page.*`, the ONE page-chrome frame namespace
 * (teacher's call, 2026-07-25, canon §13a). Sibling frames that used to live as loose
 * folders (`PageHeader` · `StickyBottomBar`) are now MEMBERS of one namespace
 * — same tier (frame / layout), same family (chrome of a ROUTE: what sits above
 * the content and pinned under it), one import.
 *
 * FRAME API LAW (§13b):
 * - `PageBottomBar` is a WRAPPER frame → named slots `body`/`actions` (a bar
 *   is a horizontal row, so `header`/`footer` would be a lie); `children`
 *   stays as shorthand for `body`.
 * - `PageHeader` is NOT a generic wrapper — it already owns semantic slots
 *   (`breadcrumb`/`title`/`description`/`actions`/`meta`) and deliberately
 *   takes no `children`.
 * - No repeating list here, so no `items` member (§13b list clause N/A).
 * - Namespace only — no bare component export.
 *
 * Behaviour/skin of every member is carried over VERBATIM from its old folder;
 * this is an API refactor, not a visual one. Synced to `src` later. No
 * `@/components` imports (design-spec ports stay self-contained).
 *
 * HISTORY — `.Container` was moved to `Container` (`@sb-components/frames/Container/Container`)
 * on 2026-07-26: the old frame had no `mx-auto`, no `max-w`, only right padding —
 * a half-baked version of the "content width" concept that `Container` already
 * does correctly (§13c: a duplicate frame gets deleted).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// .Header — the breadcrumb/title/description/actions/meta block (was `PageHeader`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props {@link PageHeader} carries regardless of loading state. */
interface PageHeaderOwnProps {
    /**
     * Anatomy tag for THIS component itself — so the PARENT can badge it as ONE node (§11a.1).
     *
     * ⭐ 2026-07-27 (deep-scan): without this prop the parent can't name it, so the parent
     * is forced to pass `showAnatomy` down — and that OPENS UP the child's guts, leaking
     * grandchildren out as if they were siblings. This is the ROOT cause of that whole
     * class of bugs, not a symptom.
     */
    anatPart?: string

    /**
     * Optional supporting description placed directly below the title. Rendered
     * at `text-sm` in the muted tone. Omit when the title is self-explanatory.
     */
    description?: ReactNode
    /**
     * Optional breadcrumb row rendered above the title row. Accepts any node —
     * typically a `<Breadcrumbs>` HeroUI component or a plain anchor chain.
     * Rendered at a smaller scale so it visually precedes the title hierarchy.
     */
    breadcrumb?: ReactNode
    /**
     * Optional right-aligned slot for action controls (e.g. `<Button>` or a
     * group of buttons). Rendered `shrink-0` so it never compresses the title
     * column.
     */
    actions?: ReactNode
    /**
     * Optional meta row placed BELOW the title/description — typically a row of
     * stat/meta chips ("24 Modules · 87 Content items …"). Rendered `gap-3` from the
     * title block. Omit when the header carries no stats.
     */
    meta?: ReactNode
    /**
     * Title scale. `"page"` (default) = `Typography.Heading` level 3 — a route's
     * OWN page title. `"compact"` = body-size bold, for a header that labels a
     * PANE/PHASE inside an existing page shell.
     */
    size?: "page" | "compact"
    /** Extra classes on the header wrapper. */
    className?: string
    /**
     * `true` → each part this frame renders carries a `data-anat-part="<name>"`
     * attribute so a BlockAnatomy panel can badge it on-render. Off in production.
     */
    showAnatomy?: boolean
}

/**
 * Props for {@link PageHeader}. `title` is REQUIRED unless `isSkeleton` (§12b) —
 * a shimmer header has no real title to show yet.
 */
export type PageHeaderProps = PageHeaderOwnProps &
    (
        | {
            isSkeleton: true
            /** Primary page or section title. See the live variant's doc for the full contract. */
            title?: ReactNode
        }
        | {
            isSkeleton?: false
            /**
             * Primary page or section title. Rendered at `text-xl font-medium` in the
             * foreground tone. Accept a string or any inline React node (e.g. a
             * title with an inline badge).
             */
            title: ReactNode
        }
    )

/**
 * Page/section header frame. Renders an optional breadcrumb row above a flex
 * row that places a stacked title + description on the left and optional action
 * controls on the right.
 *
 * This frame carries no card wrapper — the caller places it directly inside
 * a `Container` or wraps it in a `SectionCard` when a framed surface
 * is required.
 *
 * @param props - See {@link PageHeaderProps}.
 */
const Header = ({
    title,
    description,
    breadcrumb,
    actions,
    meta,
    size = "page",
    isSkeleton = false,
    className,
    showAnatomy,
    anatPart,
}: PageHeaderProps) => {
    if (isSkeleton) {
        // Shape-agnostic mirror: the real shape (breadcrumb/description/meta presence)
        // isn't known before the route's data arrives, so this assumes the full header.
        return (
            <StackV gap="grouped" anatPart={anatPart} className={className}>
                <StackV gap="related" className="min-w-0">
                    <HeroSkeleton className={size === "compact" ? "h-4 w-48 rounded" : "h-6 w-64 rounded"} />
                    <HeroSkeleton className="h-4 w-80 max-w-full rounded" />
                </StackV>
                {/* No `items-*` in the old hand-rolled row → browser default was `stretch`,
                    not `StackH`'s `center` default (both skeleton pills share one height so it
                    reads the same, but `align="stretch"` keeps the DOM contract honest). */}
                <StackH gap="related" align="stretch">
                    <HeroSkeleton className="h-6 w-24 rounded-full" />
                    <HeroSkeleton className="h-6 w-24 rounded-full" />
                </StackH>
            </StackV>
        )
    }
    return (
        // outer gap="grouped": breadcrumb ↔ title-block ↔ meta (different header tiers);
        // title ↔ description stay a related gap="related" pair inside the title block.
        <StackV gap="grouped" anatPart={anatPart} className={className}>
            {/* Breadcrumb row — rendered only when provided, sits above the main title row */}
            {breadcrumb ? (
                <div>{breadcrumb}</div>
            ) : null}

            {/* Main row: title+description stack on the left, actions pinned to the right */}
            <StackH align="start" justify="between" gap="grouped">
                {/* Left column: stacked title and optional description */}
                <StackV gap="related" className="min-w-0">
                    {size === "compact" ? (
                        <Typography weight="bold" anatPart={showAnatomy ? "Typography" : undefined} text={title} />
                    ) : (
                        <Typography size="h3" weight="bold" anatPart={showAnatomy ? "Typography" : undefined} text={title} />
                    )}
                    {description ? (
                        // clamp to 2 lines on mobile (keep the header short on a phone); full on sm+
                        <Typography size="sm"
                            color="muted"
                            className="line-clamp-2 @app-sm:line-clamp-none"
                            anatPart={showAnatomy ? "Typography" : undefined}
                            text={description}
                        />
                    ) : null}
                </StackV>

                {/* Right slot: shrink-0 prevents action buttons from being squeezed */}
                {actions ? (
                    <div className="shrink-0">{actions}</div>
                ) : null}
            </StackH>

            {/* Meta row: stat/meta chips below the title block (gap="grouped" from outer) */}
            {meta ? (
                <div>{meta}</div>
            ) : null}
        </StackV>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .BottomBar — the viewport-pinned action bar (was `StickyBottomBar`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link PageBottomBar}. */
export interface PageBottomBarProps {
    /**
     * Leading content of the bar — typically a price. Equivalent to `children`;
     * wins over it when both are passed.
     */
    body?: ReactNode
    /**
     * Trailing control(s) — the primary CTA. When BOTH `body` and `actions` are
     * given the frame lays out the row itself (`justify-between`, `shrink-0` on
     * the actions) so callers stop hand-rolling that flex row.
     */
    actions?: ReactNode
    /** Shorthand for {@link PageBottomBarProps.body}. */
    children?: ReactNode
    /** Extra classes on the bar chrome. */
    className?: string
    /**
     * `true` → each region emits `data-anat-part="<name>"` so a BlockAnatomy
     * panel can badge it on-render. Off in production.
     */
    showAnatomy?: boolean
}

/**
 * A fixed bottom action bar pinned to the viewport edge — owns the chrome
 * (fixed position, top divider, surface background, safe padding) so features
 * just drop a price + CTA inside. Typically `@app-md:hidden` for a mobile sticky
 * enroll/checkout bar.
 *
 * A bar is a horizontal row, so its named slots are `body` (leading) +
 * `actions` (trailing) rather than the vertical `header`/`body`/`footer` trio.
 * With only one of them the content renders RAW, so a full-width button or a
 * two-button decision row keeps its own sizing (`flex-1`, `w-full`).
 *
 * @param props - {@link PageBottomBarProps}
 */
const BottomBar = ({
    body,
    actions,
    children,
    className,
    showAnatomy = false,
}: PageBottomBarProps) => {
    const main = body ?? children
    const chrome = "fixed bottom-0 left-0 right-[var(--app-rail-w,0px)] z-40 border-t border-separator bg-background px-6 py-3"

    // Only ONE side supplied → render it raw: the caller's own width strategy
    // (`w-full` CTA, two `flex-1` buttons) must not be boxed by a shrink-0 wrapper.
    if (main == null || actions == null) {
        const only = main ?? actions
        return (
            <div className={cn(chrome, className)}>
                <div>{only}</div>
            </div>
        )
    }

    return (
        <div className={cn(chrome, className)}>
            <StackH align="center" justify="between" gap="grouped">
                <div className="min-w-0">{main}</div>
                <div className="shrink-0">{actions}</div>
            </StackH>
        </div>
    )
}

/**
 * The page-chrome KHUNG namespace — the frames a ROUTE is built out of, one
 * import, two members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Header` | `breadcrumb`/`title`/`description`/`actions`/`meta` (no children) |
 * | `.BottomBar` | `body`/`actions` slots (+ `children` = body) |
 *
 * `.Container` moved to `Container` (`@sb-components/frames/Container/Container`)
 * on 2026-07-26 — see the history note at the top of this file.
 */
export { Header as PageHeader, BottomBar as PageBottomBar }
