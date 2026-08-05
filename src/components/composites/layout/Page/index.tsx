import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { StackH, StackV } from "@/components/frames/Stack"

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
 *   is a horizontal row, so `header`/`footer` would be a lie).
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
 * HISTORY — `.Container` was moved to `Container` (`@/components/frames/Container/Container`)
 * on 2026-07-26: the old frame had no `mx-auto`, no `max-w`, only right padding —
 * a half-baked version of the "content width" concept that `Container` already
 * does correctly (§13c: a duplicate frame gets deleted).
 *
 * COMPOSITE-8 — both `PageHeader` and `PageBottomBar` own an `isSkeleton` of
 * their own, so every slot they render is a COMPONENT reference
 * (`ComponentType<{ isSkeleton?: boolean }>`), never a pre-built node: the
 * frame calls it itself so it can forward `isSkeleton` into it. Text the
 * frame renders directly through `Typography` (`title`/`description`) is a
 * plain `string` instead — the frame wraps it in the atom itself.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Page" } as const

// ─────────────────────────────────────────────────────────────────────────────
// .Header — the breadcrumb/title/description/actions/meta block (was `PageHeader`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props {@link PageHeader} carries regardless of loading state. */
interface PageHeaderOwnProps {

    /**
     * Optional supporting description placed directly below the title. The
     * frame renders it through `Typography` itself (`text-sm`, muted tone) and
     * forwards `isSkeleton`, so this is plain text (COMPOSITE-8), not a
     * pre-built node. Omit when the title is self-explanatory.
     */
    description?: string
    /**
     * Optional breadcrumb row rendered above the title row, as a COMPONENT
     * reference (COMPOSITE-8) — the frame calls it itself. Typically a
     * `<Breadcrumbs>` house atom or a `LinkBack`. Omitted entirely while
     * loading (a route rarely needs it before data lands).
     */
    breadcrumb?: ComponentTypeWithSkeleton
    /**
     * Optional right-aligned slot for action controls, as a COMPONENT
     * reference — the frame calls it and renders it `shrink-0` so it never
     * compresses the title column. Omitted entirely while loading.
     */
    actions?: ComponentTypeWithSkeleton
    /**
     * Optional meta row placed BELOW the title/description — typically a row
     * of stat/meta chips ("24 Modules · 87 Content items …") — as a
     * COMPONENT reference. Rendered `gap-3` from the title block. While
     * loading, the frame draws its OWN 2-chip placeholder instead of calling
     * this (COMPOSITE-10: the frame decides how many, not this slot). Omit
     * when the header carries no stats.
     */
    meta?: ComponentTypeWithSkeleton
    /**
     * Title scale. `"page"` (default) = `Typography.Heading` level 3 — a route's
     * OWN page title. `"compact"` = body-size bold, for a header that labels a
     * PANE/PHASE inside an existing page shell.
     */
    size?: "page" | "compact"
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
            title?: string
        }
        | {
            isSkeleton?: false
            /**
             * Primary page or section title. Rendered at `text-xl font-medium` in the
             * foreground tone through `Typography` (COMPOSITE-8: the frame builds it
             * itself, so this is plain text).
             */
            title: string
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
    breadcrumb: Breadcrumb,
    actions: Actions,
    meta: Meta,
    size = "page",
    isSkeleton = false,
    classNames}: PageHeaderProps) => {
    // ONE render path (§12c) — every part this frame would render anyway stays,
    // each handed `isSkeleton`; the atoms draw their own shimmer. While loading, the
    // real shape (breadcrumb/description/meta presence) isn't known yet, so the
    // composite makes the same shape call the old hand-split branch made: assume a
    // description line and a 2-chip meta row, skip breadcrumb/actions (a route
    // rarely needs those before data lands).
    const showDescription = isSkeleton || description != null
    const showMeta = isSkeleton || Meta != null

    // Left column: stacked title and optional description
    const titleBlock = (
        <>
            {size === "compact" ? (
                <Typography weight="bold" isSkeleton={isSkeleton} text={title} />
            ) : (
                <Typography size="h3" weight="bold" isSkeleton={isSkeleton} text={title} />
            )}
            {showDescription ? (
                // clamp to 2 lines on mobile (keep the header short on a phone); full on sm+
                // — a viewport-width decision, so the wrapper owns it, not the atom. Skipped
                // while loading: the shimmer bar has no overflow to clamp.
                isSkeleton ? (
                    <Typography size="sm" color="muted" isSkeleton />
                ) : (
                    <div className="line-clamp-2 @app-sm:line-clamp-none">
                        <Typography size="sm"
                            color="muted"
                            text={description}
                        />
                    </div>
                )
            ) : null}
        </>
    )
    // Main row: title+description stack on the left, actions pinned to the right
    const titleRow = (
        <StackH
            align="start"
            justify="between"
            gap={4}
            principle="content-row"
            items={[
                () => <StackV gap={3} classNames={["min-w-0"]} items={[() => titleBlock]} />,
                // Right slot: shrink-0 prevents action buttons from being squeezed.
                // Omitted while loading — the shape of the action row isn't known yet.
                ...(!isSkeleton && Actions ? [() => (
                    <div className="shrink-0"><Actions isSkeleton={isSkeleton} /></div>
                )] : []),
            ]}
        />
    )
    const headerBody = (
        <>
            {/* Breadcrumb row — rendered only when provided and loaded, sits above the main title row */}
            {!isSkeleton && Breadcrumb ? (
                <div><Breadcrumb isSkeleton={isSkeleton} /></div>
            ) : null}
            {titleRow}
            {/* Meta row: stat/meta chips below the title block (gap={4} from outer). While
                loading, 2 `Chip` placeholders stand in — the composite decides the count,
                the atom draws its own pill shimmer (no hand-rolled bar). */}
            {showMeta ? (
                isSkeleton ? (
                    <StackH
                        gap={3}
                        align="stretch"
                        principle="chip-row"
                        items={[
                            () => <Chip isSkeleton />,
                            () => <Chip isSkeleton />,
                        ]}
                    />
                ) : (
                    <div>{Meta ? <Meta isSkeleton={isSkeleton} /> : null}</div>
                )
            ) : null}
        </>
    )
    return (
        // outer gap={4}: breadcrumb ↔ title-block ↔ meta (different header tiers);
        // title ↔ description stay a related gap={3} pair inside the title block.
        <StackV gap={4} classNames={classNames} items={[() => headerBody]} />
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .BottomBar — the viewport-pinned action bar (was `StickyBottomBar`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link PageBottomBar}. */
export interface PageBottomBarProps {
    /**
     * Leading content of the bar — typically a price — as a COMPONENT
     * reference (COMPOSITE-8): the frame calls it itself so it can forward
     * `isSkeleton`.
     */
    body?: ComponentTypeWithSkeleton
    /**
     * Trailing control(s) — the primary CTA — as a COMPONENT reference. When
     * BOTH `body` and `actions` are given the frame lays out the row itself
     * (`justify-between`, `shrink-0` on the actions) so callers stop
     * hand-rolling that flex row.
     */
    actions?: ComponentTypeWithSkeleton
    /** Shorthand for {@link PageBottomBarProps.body} — same component-reference contract. */
    /**
     * `true` → forwarded into whichever of `body`/`actions` renders, so a bar
     * whose price/CTA is not known yet (e.g. still loading enrollment status)
     * can shimmer instead of showing stale content.
     */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
    isSkeleton = false,
    classNames}: PageBottomBarProps) => {
    const Main = body
    const Actions = actions
    const chrome = "fixed bottom-0 left-0 right-[var(--app-rail-w,0px)] z-40 border-t border-separator bg-background px-6 py-3"

    // Only ONE side supplied → render it raw: the caller's own width strategy
    // (`w-full` CTA, two `flex-1` buttons) must not be boxed by a shrink-0 wrapper.
    if (Main == null || Actions == null) {
        const Only = Main ?? Actions
        return (
            <div className={cn(chrome, classNames)} data-tier="composite" data-component="PageBottomBar">
                <div>{Only ? <Only isSkeleton={isSkeleton} /> : null}</div>
            </div>
        )
    }

    return (
        <div className={cn(chrome, classNames)} data-tier="composite" data-component="PageBottomBar">
            <StackH
                align="center"
                justify="between"
                gap={4}
                principle="content-row"
                items={[
                    () => <div className="min-w-0"><Main isSkeleton={isSkeleton} /></div>,
                    () => <div className="shrink-0"><Actions isSkeleton={isSkeleton} /></div>,
                ]}
            />
        </div>
    )
}

/**
 * The page-chrome frame namespace — the frames a ROUTE is built out of, one
 * import, two members:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Header` | `breadcrumb`/`title`/`description`/`actions`/`meta` (no children) |
 * | `.BottomBar` | `body`/`actions` slots |
 *
 * `.Container` moved to `Container` (`@/components/frames/Container/Container`)
 * on 2026-07-26 — see the history note at the top of this file.
 */
export { Header as PageHeader, BottomBar as PageBottomBar }
