import React from "react"
import { MapTrifoldIcon } from "@phosphor-icons/react"
import { MindMapRail, type MindMapRailItem, type MindMapRailTier } from "@/components/blocks/learn/MindMapRail"
import { MindMapContinueButton } from "@/components/blocks/learn/MindMapContinueButton"
import { MindMapFullscreenButton, type MindMapFullscreenButtonAriaLabels } from "@/components/blocks/learn/MindMapFullscreenButton"
import { Legend, type LegendItem } from "@/components/composites/stats/Legend"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { type ComponentTypeWithSkeleton, type SkeletonProps } from "@/components/frames/_slot"
import { ResizableRail } from "@/components/behaviors/ResizableRail"
import { StackH, StackV } from "@/components/frames/Stack"
import { Stage } from "@/components/frames/Stage"
import { ScrollArea } from "@/components/frames/ScrollArea"
import { FillAvailable } from "@/components/frames/FillAvailable"
import type { CallerIdentity } from "@/components/frames/_identity"

/**
 * SCREEN — `_MindMapPage`: the course keyword graph, in its two real shapes.
 * See the component's own file header for the full function list and the two
 * corrections against the planner's proposed tree (`MindMapBackButton` and
 * `FloatingActionButton` are both absent, on purpose).
 *
 * The graph engine arrives as the `canvas` slot. This screen lays out the rail,
 * the floating chrome and the empty state; it does not know ReactFlow exists.
 *
 * FIVE LEAVES, by STRUCTURE — `workspace` and `standalone` are different
 * compositions (not one shape with a variant flag flipping paint), so each
 * gets its own leaves; `Empty` and `Loading` each lose or swap real nodes
 * (rail's shimmer vs. its populated list; the three floating blocks present
 * vs. absent), which is a structural change, not a data condition of one leaf.
 *
 * PRESENTATIONAL — every input arrives as a prop; the connected `index.tsx`
 * owns the fetch, the rail's filter state, and every `t()` call (`split.md`).
 *
 * Emits its own identity (`data-tier="page"` / `data-component="MindMapPage"`)
 * unconditionally on its root, same as `_ModulePage`/`_ContentPage` — see
 * `split.md`'s "Identity is data-tier + data-component" section.
 *
 * The viewport-relative full-bleed height, the canvas's floating-chrome
 * anchoring, and the rail's scroll region are all composed on `Stage` /
 * `ScrollArea` (`@/components/frames/Stage`, `@/components/frames/ScrollArea`)
 * — the two frames the vocabulary gap this screen flagged in a previous pass
 * was built to close. No raw `className` shape remains on this page.
 */

/** Which shape of the mind map this screen renders — see the file header. */
export type MindMapVariant = "workspace" | "standalone"

/** Props for {@link MindMapPage}. */
export interface MindMapPageProps {
    /** Which shape to render — see the file header for how the two differ. */
    variant: MindMapVariant

    // ── `workspace`: the `MindMapRail` search pane ──
    /** Current search text (controlled). Ignored outside `workspace`. */
    query: string
    /** Fired on every keystroke in the rail's search field. */
    onQuery: (query: string) => void
    /** Current popularity-tier filter. */
    tier: MindMapRailTier
    /** Fired with the tier the reader picked in the rail's funnel popover. */
    onTier: (tier: MindMapRailTier) => void
    /** The current query+tier's matching keywords, in display order. */
    items: Array<MindMapRailItem>
    /** Which result is currently focused on the canvas, if any. */
    selectedId?: string
    /** Fired with a result's id when its rail row is pressed. */
    onPick: (id: string) => void
    /** `true` → the rail's own query/tier fetch is in flight (independent of `isSkeleton`). */
    isRailLoading?: boolean
    /** Accessible name for the rail's search field. */
    railAriaLabel: string
    /** Accessible name for the rail's tier filter group. */
    railTierAriaLabel: string
    /** Accessible name for the rail's drag-to-resize handle. */
    railResizeAriaLabel: string

    // ── `standalone`: floating chrome over the canvas ──
    /** Href of the viewer's next unread lesson/challenge, or `null` when none resolves. Ignored outside `standalone`. */
    resumeHref?: string | null
    /** `true` → the viewer has read everything the map has to offer. */
    allContentDone?: boolean
    /** Fired on a resume press. */
    onResume?: () => void
    /** Accessible name for the resume action. */
    continueAriaLabel?: string
    /** Legend entries — colour swatch + label, e.g. done/in-progress/not-started/locked/current. */
    legendItems?: Array<LegendItem>
    /** Fired on every press of the zoom-in button. */
    onZoomIn?: () => void
    /** Fired on every press of the zoom-out button. */
    onZoomOut?: () => void
    /** Fired on every press of the fullscreen toggle. */
    onToggleFullscreen?: () => void
    /** `true` → canvas is currently fullscreen. */
    isFullscreen?: boolean
    /** Per-button accessible names for the zoom/fullscreen rail. */
    fullscreenAriaLabels?: MindMapFullscreenButtonAriaLabels

    // ── shared ──
    /** `true` → every block that can mirror itself does; the canvas gap swaps to its loading wording. */
    isSkeleton?: boolean
    /** `true` → the course has no authored map/modules yet. `workspace`-ONLY — see the file header. */
    isEmpty?: boolean

    /**
     * The graph itself, mounted by the caller. A screen composes; it does not own a
     * rendering engine — and an earlier pass left a literal placeholder here instead
     * of a slot, which meant wiring this screen would have shipped a mind-map page
     * with no map in it.
     */
    canvas: ComponentTypeWithSkeleton
    /**
     * The empty state's one way forward — browse the course's modules instead.
     * Omit → the empty state states the fact and offers nothing, which is right
     * only when there is nowhere useful to send the reader.
     */
    onBrowseModules?: () => void
    /** Every word the whole-screen empty state says — resolved by the connected half. */
    labels: MindMapPageLabels
}

/** All display text this screen owns, already localized by the connected half. */
export interface MindMapPageLabels {
    /** Heading when the course has no authored map yet. */
    emptyTitle: string
    /** Body when the course has no authored map yet. */
    emptyDescription: string
    /** Label on the empty state's way forward, paired with {@link MindMapPageProps.onBrowseModules}. */
    emptyCta: string
}

/** localStorage key + bounds the real workspace persists the rail width under. */
const RAIL_STORAGE_KEY = "mindmap-rail-width"
const RAIL_DEFAULT_WIDTH = 320
const RAIL_MIN_WIDTH = 264
const RAIL_MAX_WIDTH = 520

/** This screen's own identity — handed down to whichever `Stage` is the root, per branch, instead of a wrapping div (BLOCK-2). See `_identity.ts`. */
const MIND_MAP_PAGE_IDENTITY: CallerIdentity = { tier: "page", component: "MindMapPage" }

/**
 * `workspace` empty state — the course has no authored map yet. Replaces the
 * ENTIRE spine, same "one frame + one composite, each badging itself" shape
 * `CourseContents`/`ModulePage` already established for this exact case. The
 * viewport-relative full-bleed height is `Stage`'s `fill="viewport"` — the
 * same shape the real spine below uses for the same reason.
 */
const MindMapWorkspaceEmpty = ({ labels, onBrowseModules }: MindMapWorkspaceEmptyProps) => (
    <Stage
        fill="viewport"
        identity={MIND_MAP_PAGE_IDENTITY}
        canvas={() => (
            <StackV
                gap={1}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                align="center"
                justify="center"
                items={[() => (
                    <AsyncContentEmpty

                        icon={MapTrifoldIcon}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                        onRetry={onBrowseModules}
                        retryLabel={labels.emptyCta}
                    />
                )]}
            />
        )}
    />
)

/**
 * The mind-map screen, in its two shapes. See the file header for the function
 * list, the two corrections against the planner's proposed tree, and the
 * canvas gap.
 *
 * @param props - {@link MindMapPageProps}
 */
const _MindMapPage = ({
    variant,
    query,
    onQuery,
    tier,
    onTier,
    items,
    selectedId,
    onPick,
    isRailLoading = false,
    railAriaLabel,
    railTierAriaLabel,
    railResizeAriaLabel,
    resumeHref = null,
    allContentDone = false,
    onResume,
    continueAriaLabel = "",
    legendItems = [],
    onZoomIn = () => {},
    onZoomOut = () => {},
    onToggleFullscreen = () => {},
    isFullscreen = false,
    fullscreenAriaLabels = { zoomIn: "", zoomOut: "", toggleFullscreen: "" },
    isSkeleton = false,
    isEmpty = false,
    canvas: Canvas,
    onBrowseModules,
    labels,
}: MindMapPageProps) => {
    // Built as a thunk, called only for the non-empty branch below — mirrors
    // `_ModulePage`'s `spine(isSkeleton)`, so the empty branch never pays for
    // building a tree it will not render.
    const workspace = () => {
        const railSection = (
            <MindMapRail

                query={query}
                onQuery={onQuery}
                tier={tier}
                onTier={onTier}
                items={items}
                selectedId={selectedId}
                onPick={onPick}
                isLoading={isRailLoading}
                ariaLabel={railAriaLabel}
                tierAriaLabel={railTierAriaLabel}
                isSkeleton={isSkeleton}

            />
        )

        // The canvas region's floating chrome — in the real app these render as the
        // SAME ReactFlow engine's own Panel children. Only present (`standalone`,
        // resting) — `Stage` skips a slot entirely when it is `undefined`.
        const showOverlays = variant === "standalone" && !isSkeleton

        const topCenterSlot = showOverlays
            ? ({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={1}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[() => (
                        <MindMapContinueButton

                            resumeHref={resumeHref}
                            allContentDone={allContentDone}
                            onResume={onResume}
                            continueAriaLabel={continueAriaLabel}
                            isSkeleton={isSkeleton}
                        />
                    )]}
                />
            )
            : undefined

        const bottomStartSlot = showOverlays
            ? ({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={1}
                    isSkeleton={isSkeleton}
                    items={[() => <Legend items={legendItems} />]}
                />
            )
            : undefined

        const bottomEndSlot = showOverlays
            ? ({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={1}
                    isSkeleton={isSkeleton}
                    items={[() => (
                        <MindMapFullscreenButton

                            onZoomIn={onZoomIn}
                            onZoomOut={onZoomOut}
                            onToggleFullscreen={onToggleFullscreen}
                            isFullscreen={isFullscreen}
                            ariaLabels={fullscreenAriaLabels}
                            isSkeleton={isSkeleton}
                        />
                    )]}
                />
            )
            : undefined

        // The canvas region: the out-of-reach engine's gap, plus (standalone only) the
        // floating chrome that in the real app renders as the SAME engine's own Panel
        // children. `Stage` owns the positioning context and the three floating anchors —
        // no page-level `relative`/`absolute` left.
        const canvasStage = (
            <FillAvailable
                at="base"
                explain="Canvas stage consumes remaining workspace width beside the resizable rail — not a fixed-size peer."
                body={() => (
                    <Stage
                        canvas={Canvas}
                        topCenter={topCenterSlot}
                        bottomStart={bottomStartSlot}
                        bottomEnd={bottomEndSlot}
                        isSkeleton={isSkeleton}
                    />
                )}
            />
        )

        const workspaceRail = (
            <ResizableRail
                storageKey={RAIL_STORAGE_KEY}
                defaultWidth={RAIL_DEFAULT_WIDTH}
                minWidth={RAIL_MIN_WIDTH}
                maxWidth={RAIL_MAX_WIDTH}
                ariaLabel={railResizeAriaLabel}
                handleSide="right"
                className="h-full shrink-0 border-r border-default"

            >
                <ScrollArea
                    axis="y"
                    isSkeleton={isSkeleton}
                    body={({ isSkeleton }: SkeletonProps) => (
                        <StackV
                            padding={6}
                            principle="page-pad"
                            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
                            gap={1}
                            classNames={["h-full"]}
                            isSkeleton={isSkeleton}
                            items={[() => railSection]}
                        />
                    )}
                />
            </ResizableRail>
        )

        const workspaceSections = (
            <>
                {variant === "workspace" ? workspaceRail : null}
                {canvasStage}
            </>
        )

        // The viewport-relative full-bleed height — the shell's own chrome height
        // subtracted — is `Stage`'s `fill="viewport"`; the rail + canvas row is its
        // `canvas` slot (a stage need not be a literal drawing surface — see the
        // frame's own file header for why this is the shape it names).
        return (
            <Stage
                fill="viewport"
                isSkeleton={isSkeleton}
                identity={MIND_MAP_PAGE_IDENTITY}
                canvas={({ isSkeleton }: SkeletonProps) => (
                    <StackH gap={1} isSkeleton={isSkeleton} items={[() => workspaceSections]} />
                )}
            />
        )
    }

    return variant === "workspace" && isEmpty
        ? <MindMapWorkspaceEmpty labels={labels} onBrowseModules={onBrowseModules} />
        : workspace()
}

export { _MindMapPage }

type MindMapWorkspaceEmptyProps = {
    labels: MindMapPageLabels
    onBrowseModules?: () => void
}
