import React from "react"
import { MapTrifoldIcon, ShareNetworkIcon } from "@phosphor-icons/react"
import { MindMapRail, type MindMapRailItem, type MindMapRailTier } from "@sb-components/starci/blocks/learn/MindMapRail/MindMapRail"
import { MindMapContinueButton } from "@sb-components/starci/blocks/learn/MindMapContinueButton/MindMapContinueButton"
import { MindMapFullscreenButton, type MindMapFullscreenButtonAriaLabels } from "@sb-components/starci/blocks/learn/MindMapFullscreenButton/MindMapFullscreenButton"
import { Legend, type LegendItem } from "@sb-components/composites/stats/Legend/Legend"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { ResizableRail } from "@sb-components/behaviors/ResizableRail/ResizableRail"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * SCREEN — `MindMapPage`: the course keyword graph, in its two real shapes.
 * See the component's own file header for the full function list, the two
 * corrections against the planner's proposed tree (`MindMapBackButton` and
 * `FloatingActionButton` are both absent, on purpose), and why the canvas
 * region is a documented §B3 gap rather than a faked ReactFlow mount.
 *
 * FIVE LEAVES, by STRUCTURE — `workspace` and `standalone` are different
 * compositions (not one shape with a variant flag flipping paint), so each
 * gets its own leaves; `Empty` and `Loading` each lose or swap real nodes
 * (rail's shimmer vs. its populated list; the three floating blocks present
 * vs. absent), which is a structural change, not a data condition of one leaf.
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
}

/** localStorage key + bounds the real `MindMapWorkspace` persists the rail width under. */
const RAIL_STORAGE_KEY = "mindmap-rail-width"
const RAIL_DEFAULT_WIDTH = 320
const RAIL_MIN_WIDTH = 264
const RAIL_MAX_WIDTH = 520

const CANVAS_GAP_TITLE = "Concept map region"
const CANVAS_GAP_DESCRIPTION = "The real ReactFlow graph (nodes, drawer, minimap) isn't built this pass — this block is where it will mount (§B3)."
const CANVAS_GAP_LOADING_TITLE = "Loading map…"

const WORKSPACE_EMPTY_TITLE = "This course has no concept map yet"
const WORKSPACE_EMPTY_DESCRIPTION = "The map is generated automatically once the course has enough modules — check back later."

/** Props for the {@link MindMapCanvasGap} stand-in below. */
interface MindMapCanvasGapProps {
    isLoading?: boolean
}

/**
 * Stand-in for the out-of-reach ReactFlow engine (§B3) — see the file header's
 * "CANVAS GAP" note for why `AsyncContentEmpty` is the reused shape here.
 */
const MindMapCanvasGap = ({ isLoading = false}: MindMapCanvasGapProps) => (
    <StackV
        gap={1}
        principle="sibling-stack"
        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
        align="center"
        justify="center"
        classNames={["h-full"]}

        items={[() => (
            <AsyncContentEmpty

                icon={ShareNetworkIcon}
                title={isLoading ? CANVAS_GAP_LOADING_TITLE : CANVAS_GAP_TITLE}
                description={isLoading ? undefined : CANVAS_GAP_DESCRIPTION}
            />
        )]}
    />
)

/**
 * `workspace` empty state — the course has no authored map yet. Replaces the
 * ENTIRE spine, same "one frame + one composite, each badging itself" shape
 * `CourseContents`/`ModulePage` already established for this exact case.
 */
const MindMapWorkspaceEmpty = () => (
    <div className="h-[calc(100dvh-4rem)]">
        <StackV
            gap={1}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            align="center"
            justify="center"
            items={[() => (
                <AsyncContentEmpty

                    icon={MapTrifoldIcon}
                    title={WORKSPACE_EMPTY_TITLE}
                    description={WORKSPACE_EMPTY_DESCRIPTION}
                />
            )]}
        />
    </div>
)

/**
 * The mind-map screen, in its two shapes. See the file header for the function
 * list, the two corrections against the planner's proposed tree, and the
 * canvas gap.
 *
 * @param props - {@link MindMapPageProps}
 */
const MindMapPage = ({
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
}: MindMapPageProps) => {
    if (variant === "workspace" && isEmpty) {
        return <MindMapWorkspaceEmpty />
    }

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
    // SAME ReactFlow engine's own Panel children, see the file header's
    // "OVERLAYS ARE FRAMES" note.
    const showOverlays = variant === "standalone" && !isSkeleton

    const canvasItems = [
        () => <MindMapCanvasGap isLoading={isSkeleton} />,
        ...(showOverlays ? [
            () => (
                <div className="absolute inset-x-0 top-4 z-10">
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
                </div>
            ),
            () => (
                <div className="absolute bottom-4 left-4 z-10">
                    <StackV
                        gap={1}
                        isSkeleton={isSkeleton}
                        items={[() => (
                            <div>
                                <Legend items={legendItems} />
                            </div>
                        )]}
                    />
                </div>
            ),
            () => (
                <div className="absolute bottom-4 right-4 z-10">
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
                </div>
            ),
        ] : []),
    ]

    const workspaceRail = (
        <ResizableRail
            storageKey={RAIL_STORAGE_KEY}
            defaultWidth={RAIL_DEFAULT_WIDTH}
            minWidth={RAIL_MIN_WIDTH}
            maxWidth={RAIL_MAX_WIDTH}
            ariaLabel={railResizeAriaLabel}
            // eslint-disable-next-line starci-fe/handler-on-prefix -- `handleSide` is a ResizableRail layout prop (which edge the resize handle sits on), a noun not an onXxx event handler
            handleSide="right"
            className="h-full shrink-0 border-r border-default"
        >
            <div className="overflow-y-auto">
                <StackV
                    padding={6}
                    principle="page-pad"
                    explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
                    gap={1}
                    classNames={["h-full"]}
                    isSkeleton={isSkeleton}
                    items={[() => railSection]}
                />
            </div>
        </ResizableRail>
    )

    return (
        <div className="h-[calc(100dvh-4rem)]">
            <StackH
                gap={1}
                isSkeleton={isSkeleton}
                items={[
                    ...(variant === "workspace" ? [() => workspaceRail] : []),
                    // The canvas region: the out-of-reach engine's gap, plus (standalone only) the
                    // floating chrome that in the real app renders as the SAME engine's own Panel
                    // children — see the file header's "OVERLAYS ARE FRAMES" note.
                    () => (
                        <div className="relative min-w-0 flex-1">
                            <StackV
                                gap={1}
                                isSkeleton={isSkeleton}
                                items={canvasItems}
                            />
                        </div>
                    ),
                ]}
            />
        </div>
    )
}

export { MindMapPage }
