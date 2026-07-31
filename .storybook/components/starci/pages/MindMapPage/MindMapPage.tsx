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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `MindMapPage`: the course keyword graph, in two shapes reached
 * from two different places — `workspace` (a rail-plus-canvas pane embedded in
 * the learn shell) and `standalone` (the public, full-bleed route with its own
 * floating chrome). A screen owns a LIST OF FUNCTIONS and nothing else: it
 * calls blocks, places them in frames, and hands each one typed data.
 *
 * GROUNDED IN THE REAL FEATURE — read `src/components/features/learn/MindMap/
 * MindMapWorkspace/index.tsx` and `.../Canvas/index.tsx` before touching this
 * file. They are NOT two variants of one component reshuffling the same four
 * pieces; they are two DIFFERENT compositions:
 *   • `MindMapWorkspace` = `MindMapRail` beside `ConceptMap`. Nothing else —
 *     no back link, no continue button, no legend, no zoom rail. It sits
 *     inside the learn shell, which already owns navigation chrome.
 *   • `Canvas` (mounted by `StandaloneMindMap`) = the bare ReactFlow canvas
 *     PLUS four `<Panel>` children rendered AS ITS OWN DIRECT CHILDREN:
 *     `MindMapBackButton` (top-left), `MindMapContinueButton` (top-center,
 *     ReactFlow's own default `Panel` position), `MindMapLegend`
 *     (bottom-left), `MindMapFullscreenButton` (bottom-right — "where the
 *     Next.js dev badge sits", per that file's own comment).
 * Reading the real tree first is what caught two corrections to the planner's
 * proposed tree below — see the two ⚠️ notes.
 *
 * ⚠️ CORRECTION 1 — `MindMapBackButton` IS NOT IN THIS SCREEN. It was never
 * built as a Storybook block this run (not in the "newly built" list, not in
 * "reused"), and `FloatingActionButton` — the one reused block offered as a
 * stand-in — does not fit it: that block's OWN story states outright "đừng
 * bọc trong element khác để định vị" (it hard-codes `fixed bottom-6 right-…`
 * and takes no repositioning prop), so wiring it in as a top-left back link
 * would either render in the wrong corner or, if forced there via `className`,
 * fight itself (tailwind-merge does not collapse `bottom-6`+`top-4`, both
 * classes would apply and stretch the box). Forcing a mismatched fit in
 * quietly is exactly the failure this run's brief opens with — so this is a
 * documented GAP, not a fake button. A dedicated `MindMapBackButton` block
 * (icon-only, `variant="secondary"`, caller-positioned like its three
 * siblings) is the correct follow-up, not a reuse of this one.
 *
 * ⚠️ CORRECTION 2 — `FloatingActionButton` IS NOT USED ANYWHERE IN THIS
 * SCREEN. Grounding against `Canvas/index.tsx` shows the real feature has NO
 * bottom-right primary FAB distinct from `MindMapFullscreenButton`'s own rail
 * (which already occupies that exact corner) — inventing a second bottom-right
 * fixed circle would visually collide with it. There is no other grounded need
 * for it in either variant (the workspace empty-state action in the real
 * source is a plain secondary text button, not an icon-only FAB). Rather than
 * force it into a role it does not fit, it is left out; see Correction 1's
 * reasoning for why a bad-fit reuse is worse than a documented absence.
 *
 * ⛔ CANVAS GAP (§B3). Neither `ConceptMap` (workspace) nor `Canvas`
 * (standalone) is a Storybook port — both are real ReactFlow engines with
 * their own data fetch, node types and drawer wiring, out of reach for this
 * pass. `MindMapCanvasGap` below is the CHROME around that gap: an
 * `AsyncContentEmpty` — the one composite this codebase already lets a screen
 * call directly (`CourseContents`/`ModulePage` precedent) — reused here
 * for the same reason it exists: an icon + a message centred in the region the
 * real engine will occupy, instead of a blank void or a hand-rolled stub.
 *
 * FOUR FUNCTIONS in `standalone`, all floating chrome around the gap: (1) jump
 * back into the reading flow the moment progress resolves — `MindMapContinueButton`;
 * (2) read what the module-node tints mean — `Legend` composite (reused,
 * verbatim, no `MindMapLegend` block exists to wrap it — same thin-wrapper
 * shape the real `src/…/MindMapLegend/index.tsx` itself is); (3) zoom and
 * toggle fullscreen — `MindMapFullscreenButton`. `workspace` has exactly ONE
 * function: search + filter the keyword rail — `MindMapRail`, resizable via
 * `ResizableRail` (reused, verbatim, same behaviour + `storageKey` the real
 * `MindMapWorkspace` uses).
 *
 * ⭐ NO `Container`. Both variants are full-bleed workspace regions (the rail
 * sits flush against the canvas, the canvas fills whatever is left), not a
 * capped reading column — same reasoning `PlaygroundSessionPage`'s file
 * header already gives for skipping `Container` on a workspace route.
 *
 * ⭐ OVERLAYS ARE FRAMES, NOT DIVS. Every floating piece over the canvas is a
 * `StackV` with a PLACEMENT-only className (`absolute inset-x-0 top-4 z-10`,
 * …) — the same `className`-for-placement idiom `PlaygroundSessionPage`
 * already establishes for its docked sheet. `Legend` carries no `anatPart`
 * prop of its own (unlike every block here), so it gets the same bare,
 * class-free anatomy-marker `div` `MindMapRail`'s own file already uses for
 * the same reason (a wrapper with zero layout classes names a node without
 * laying anything out).
 *
 * ⭐ `isEmpty` IS `workspace`-ONLY (route-level note, matches
 * `MindMapWorkspace`'s own empty state: an unauthored course has no map to
 * search). `standalone`'s canvas gap already stands in for every one of its
 * own real loading/empty/error branches — building a second empty leaf for a
 * region that is not built yet would be inventing a case with nothing behind
 * it (§14d.3).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/** localStorage key + bounds the real `MindMapWorkspace` persists the rail width under. */
const RAIL_STORAGE_KEY = "mindmap-rail-width"
const RAIL_DEFAULT_WIDTH = 320
const RAIL_MIN_WIDTH = 264
const RAIL_MAX_WIDTH = 520

const CANVAS_GAP_TITLE = "Vùng bản đồ khái niệm"
const CANVAS_GAP_DESCRIPTION = "Đồ thị ReactFlow thật (node, drawer, minimap) chưa dựng trong lần này — khối này là chỗ nó sẽ mount (§B3)."
const CANVAS_GAP_LOADING_TITLE = "Đang tải bản đồ…"

const WORKSPACE_EMPTY_TITLE = "Khoá này chưa có bản đồ khái niệm"
const WORKSPACE_EMPTY_DESCRIPTION = "Bản đồ được dựng tự động khi khoá có đủ module — quay lại sau nhé."

/** Props for the {@link MindMapCanvasGap} stand-in below. */
interface MindMapCanvasGapProps {
    isLoading?: boolean
    showAnatomy?: boolean
}

/**
 * Stand-in for the out-of-reach ReactFlow engine (§B3) — see the file header's
 * "CANVAS GAP" note for why `AsyncContentEmpty` is the reused shape here.
 */
const MindMapCanvasGap = ({ isLoading = false, showAnatomy = false }: MindMapCanvasGapProps) => (
    <StackV
        gap="flush"
        align="center"
        justify="center"
        classNames={["h-full"]}
        anatPart={showAnatomy ? "StackV" : undefined}
        body={
            <AsyncContentEmpty
                anatPart={showAnatomy ? "AsyncContentEmpty" : undefined}
                icon={ShareNetworkIcon}
                title={isLoading ? CANVAS_GAP_LOADING_TITLE : CANVAS_GAP_TITLE}
                description={isLoading ? undefined : CANVAS_GAP_DESCRIPTION}
            />
        }
    />
)

/**
 * `workspace` empty state — the course has no authored map yet. Replaces the
 * ENTIRE spine, same "one frame + one composite, each badging itself" shape
 * `CourseContents`/`ModulePage` already established for this exact case.
 */
const MindMapWorkspaceEmpty = () => (
    <StackV
        gap="flush"
        align="center"
        justify="center"
        className="h-[calc(100dvh-4rem)]"
        anatPart="StackV"
        body={
            <AsyncContentEmpty
                anatPart="AsyncContentEmpty"
                icon={MapTrifoldIcon}
                title={WORKSPACE_EMPTY_TITLE}
                description={WORKSPACE_EMPTY_DESCRIPTION}
            />
        }
    />
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
    showAnatomy = false,
}: MindMapPageProps) => {
    if (variant === "workspace" && isEmpty) {
        return <MindMapWorkspaceEmpty />
    }

    const railSection = (
        <MindMapRail
            anatPart="MindMapRail"
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
            showAnatomy={showAnatomy}
        />
    )

    // The canvas region's floating chrome — in the real app these render as the
    // SAME ReactFlow engine's own Panel children, see the file header's
    // "OVERLAYS ARE FRAMES" note.
    const canvasOverlays = (
        <>
            <StackV
                gap="flush"
                align="center"
                className="absolute inset-x-0 top-4 z-10"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={
                    <MindMapContinueButton
                        anatPart="MindMapContinueButton"
                        resumeHref={resumeHref}
                        allContentDone={allContentDone}
                        onResume={onResume}
                        continueAriaLabel={continueAriaLabel}
                        showAnatomy={showAnatomy}
                    />
                }
            />
            <StackV
                gap="flush"
                className="absolute bottom-4 left-4 z-10"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={
                    // `Legend` carries no `anatPart` of its own — same bare, class-free
                    // anatomy marker `MindMapRail`'s own file already uses for the same
                    // reason (naming a node without laying anything out).
                    <div data-anat-part={showAnatomy ? "Legend" : undefined}>
                        <Legend items={legendItems} />
                    </div>
                }
            />
            <StackV
                gap="flush"
                className="absolute bottom-4 right-4 z-10"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={
                    <MindMapFullscreenButton
                        anatPart="MindMapFullscreenButton"
                        onZoomIn={onZoomIn}
                        onZoomOut={onZoomOut}
                        onToggleFullscreen={onToggleFullscreen}
                        isFullscreen={isFullscreen}
                        ariaLabels={fullscreenAriaLabels}
                        showAnatomy={showAnatomy}
                    />
                }
            />
        </>
    )

    const canvasRegion = (
        <>
            <MindMapCanvasGap isLoading={isSkeleton} showAnatomy={showAnatomy} />
            {variant === "standalone" && !isSkeleton ? canvasOverlays : null}
        </>
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
            showAnatomy={showAnatomy}
        >
            <StackV
                padding="roomy"
                gap="flush"
                className="overflow-y-auto"
                classNames={["h-full"]}
                anatPart={showAnatomy ? "StackV" : undefined}
                body={railSection}
            />
        </ResizableRail>
    )

    const workspaceSections = (
        <>
            {variant === "workspace" ? workspaceRail : null}
            {/* The canvas region: the out-of-reach engine's gap, plus (standalone only) the
                floating chrome that in the real app renders as the SAME engine's own Panel
                children — see the file header's "OVERLAYS ARE FRAMES" note. */}
            <StackV
                gap="flush"
                className="relative"
                classNames={["min-w-0", "flex-1"]}
                anatPart={showAnatomy ? "StackV" : undefined}
                body={canvasRegion}
            />
        </>
    )

    return <StackH gap="flush" className="h-[calc(100dvh-4rem)]" anatPart={showAnatomy ? "StackH" : undefined} body={workspaceSections} />
}

export { MindMapPage }
