import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Page.*`, the ONE page-chrome KHUNG namespace
 * (thầy 2026-07-25, canon §13a). Three sibling frames that used to live as
 * three loose folders (`PageHeader` · `PageContainer` · `StickyBottomBar`) are
 * now MEMBERS of one namespace — same tier (khung / layout), same họ (chrome
 * of a ROUTE: what sits above the content, around it, and pinned under it),
 * one import.
 *
 * KHUNG API LAW (§13b):
 * - `Page.Container` is a WRAPPER frame → named slots `header`/`body`/`footer`
 *   are the main road, `children` stays as shorthand for `body`.
 * - `Page.BottomBar` is a WRAPPER frame → named slots `body`/`actions` (a bar
 *   is a horizontal row, so `header`/`footer` would be a lie); `children`
 *   stays as shorthand for `body`.
 * - `Page.Header` is NOT a generic wrapper — it already owns semantic slots
 *   (`breadcrumb`/`title`/`description`/`actions`/`meta`) and deliberately
 *   takes no `children`.
 * - No repeating list here, so no `items` member (§13b list clause N/A).
 * - Namespace only — no bare component export.
 *
 * Behaviour/skin of every member is carried over VERBATIM from its old folder;
 * this is an API refactor, not a visual one. Synced to `src` later. No
 * `@/components` imports (design-spec ports stay self-contained).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────────
// .Header — the breadcrumb/title/description/actions/meta block (was `PageHeader`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Page.Header}. */
export interface PageHeaderProps {
    /**
     * Primary page or section title. Rendered at `text-xl font-medium` in the
     * foreground tone. Accept a string or any inline React node (e.g. a
     * title with an inline badge).
     */
    title: ReactNode
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
     * stat/meta chips ("24 Module · 87 Nội dung …"). Rendered `gap-3` from the
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
 * Page/section header frame. Renders an optional breadcrumb row above a flex
 * row that places a stacked title + description on the left and optional action
 * controls on the right.
 *
 * This frame carries no card wrapper — the caller places it directly inside
 * {@link Page.Container} or wraps it in a `SectionCard` when a framed surface
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
    className,
    showAnatomy,
}: PageHeaderProps) => {
    return (
        // outer gap-3: breadcrumb ↔ title-block ↔ meta (different header tiers);
        // title ↔ description stay a tight gap-2 pair inside the title block.
        <div className={cn("flex flex-col gap-3", className)}>
            {/* Breadcrumb row — rendered only when provided, sits above the main title row */}
            {breadcrumb ? (
                <div data-anat-part={showAnatomy ? "Breadcrumb" : undefined}>{breadcrumb}</div>
            ) : null}

            {/* Main row: title+description stack on the left, actions pinned to the right */}
            <div className="flex items-start justify-between gap-3">
                {/* Left column: stacked title and optional description */}
                <div className="flex min-w-0 flex-col gap-2">
                    {size === "compact" ? (
                        <Typography.Base weight="bold" showAnatomy={showAnatomy} text={title} />
                    ) : (
                        <Typography.Base size="h3" weight="bold" showAnatomy={showAnatomy} text={title} />
                    )}
                    {description ? (
                        // clamp to 2 lines on mobile (keep the header short on a phone); full on sm+
                        <Typography.Base size="sm"
                            color="muted"
                            className="line-clamp-2 @app-sm:line-clamp-none"
                            showAnatomy={showAnatomy}
                            text={description}
                        />
                    ) : null}
                </div>

                {/* Right slot: shrink-0 prevents action buttons from being squeezed */}
                {actions ? (
                    <div className="shrink-0" data-anat-part={showAnatomy ? "Actions" : undefined}>{actions}</div>
                ) : null}
            </div>

            {/* Meta row: stat/meta chips below the title block (gap-3 from outer) */}
            {meta ? (
                <div data-anat-part={showAnatomy ? "Meta" : undefined}>{meta}</div>
            ) : null}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Container — the outermost route frame (was `PageContainer`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Page.Container}. */
export interface PageContainerProps {
    /**
     * Top region of the page — normally a {@link Page.Header}. Separated from
     * `body` by the PAGE rhythm (`gap-8`), not the card rhythm.
     */
    header?: ReactNode
    /** Main region. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /** Bottom region IN FLOW (a page footer, a closing CTA row). Not the fixed bar — that is {@link Page.BottomBar}. */
    footer?: ReactNode
    /** Shorthand for {@link PageContainerProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
    /** Extra classes on the page shell. */
    className?: string
    /**
     * `true` → each region emits `data-anat-part="<name>"` so a BlockAnatomy
     * panel can badge it on-render. Off in production.
     */
    showAnatomy?: boolean
}

/**
 * Standard page shell — full width of the parent with a right gutter + vertical
 * rhythm. No `mx-auto` centering and no left padding (flush start). Owns page
 * spacing so features (which must not use `p-*`) compose inside it. Override
 * via `className`.
 *
 * With neither `header` nor `footer` the body renders RAW — a `children`-only
 * call produces the exact same DOM as the old `PageContainer` (no extra div).
 *
 * @param props - {@link PageContainerProps}
 */
const Container = ({
    header,
    body,
    footer,
    children,
    className,
    showAnatomy = false,
}: PageContainerProps) => {
    const main = body ?? children
    // gap-8 = the PAGE rhythm between top-level regions (header ↔ content ↔
    // footer). Deliberately wider than the card-internal gap-3 (§10: related
    // tight, sections wide).
    const content = header == null && footer == null
        ? main
        : (
            <div className="flex flex-col gap-8">
                {header != null ? <div data-anat-part={showAnatomy ? "Header" : undefined}>{header}</div> : null}
                {main != null ? <div data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div> : null}
                {footer != null ? <div data-anat-part={showAnatomy ? "Footer" : undefined}>{footer}</div> : null}
            </div>
        )

    return (
        <div
            className={cn(
                "w-full py-16 pr-4 @app-sm:pr-6 @app-lg:pr-8",
                className,
            )}
        >
            {content}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .BottomBar — the viewport-pinned action bar (was `StickyBottomBar`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link Page.BottomBar}. */
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
    const chrome = "fixed bottom-0 left-0 right-[var(--app-rail-w,0px)] z-40 border-t border-separator bg-background px-4 py-3"

    // Only ONE side supplied → render it raw: the caller's own width strategy
    // (`w-full` CTA, two `flex-1` buttons) must not be boxed by a shrink-0 wrapper.
    if (main == null || actions == null) {
        const only = main ?? actions
        const part = main != null ? "Body" : "Actions"
        return (
            <div className={cn(chrome, className)}>
                <div data-anat-part={showAnatomy ? part : undefined}>{only}</div>
            </div>
        )
    }

    return (
        <div className={cn(chrome, className)}>
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0" data-anat-part={showAnatomy ? "Body" : undefined}>{main}</div>
                <div className="shrink-0" data-anat-part={showAnatomy ? "Actions" : undefined}>{actions}</div>
            </div>
        </div>
    )
}

/**
 * The page-chrome KHUNG namespace — the frames a ROUTE is built out of, one
 * import, three members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Header` | `breadcrumb`/`title`/`description`/`actions`/`meta` (no children) |
 * | `.Container` | `header`/`body`/`footer` slots (+ `children` = body) |
 * | `.BottomBar` | `body`/`actions` slots (+ `children` = body) |
 */
export const Page = {
    Header,
    Container,
    BottomBar,
}
