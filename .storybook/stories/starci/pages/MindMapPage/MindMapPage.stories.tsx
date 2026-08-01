import type { Meta, StoryObj } from "@storybook/nextjs"
import { MindMapPage } from "@sb-components/starci/pages/MindMapPage/MindMapPage"
import type { MindMapRailItem } from "@sb-components/starci/blocks/learn/MindMapRail/MindMapRail"
import type { LegendItem } from "@sb-components/composites/stats/Legend/Legend"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
const meta: Meta<typeof MindMapPage> = {
    title: "StarCi/Pages/MindMapPage/MindMapPage",
    component: MindMapPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MindMapPage>

const RAIL_ITEMS: Array<MindMapRailItem> = [
    { id: "k1", label: "Docker layer", popularity: 82, breadcrumb: "Containerization > Docker" },
    { id: "k2", label: "Multi-stage build", popularity: 58, breadcrumb: "Containerization > Docker > Build" },
    { id: "k3", label: "BuildKit cache mount", popularity: 21, breadcrumb: "Containerization > Docker > Build" },
]

const LEGEND_ITEMS: Array<LegendItem> = [
    { key: "current", label: "Currently here", color: "var(--accent)" },
    { key: "done", label: "Completed", color: "var(--success)" },
    { key: "inProgress", label: "In progress", color: "var(--warning)" },
    { key: "notStarted", label: "Not started", color: "var(--muted)" },
    { key: "locked", label: "Locked", color: "var(--separator)" },
]

const FULLSCREEN_ARIA_LABELS = {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    toggleFullscreen: "Toggle fullscreen",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the root row splitting the resizable rail from the canvas region — full-bleed, no `Container` (workspace route, see the file header)", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "one region's own frame — the rail's padded scroll column, the canvas's relatively-positioned overlay host, or one floating overlay's placement wrapper", storyId: "frames-stack-stackv--default" },
    "ResizableRail": { tier: "frame", role: "drag-to-resize wrapper around the rail's scroll column, persisting the chosen width — reused verbatim from the real `MindMapWorkspace`", storyId: "behaviors-resizablerail-resizablerail--default" },
    "MindMapRail": { tier: "block", role: "search + popularity-tier filter + result list for the keyword lookup pane", storyId: "starci-blocks-learn-mindmaprail-mindmaprail--default" },
    "AsyncContentEmpty": { tier: "composite", role: "stands in for BOTH real gaps: the out-of-reach ReactFlow canvas (§B3) and the course-has-no-map empty state — same reused composite, different wording", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
    "MindMapContinueButton": { tier: "block", role: "the single primary next-step action floating top-center over the canvas", storyId: "starci-blocks-learn-mindmapcontinuebutton-mindmapcontinuebutton--resume-available" },
    "Legend": { tier: "composite", role: "the module-status colour key floating bottom-left over the canvas — reused verbatim, no dedicated block exists to wrap it", storyId: "composites-stats-legend--basic" },
    "MindMapFullscreenButton": { tier: "block", role: "zoom in / zoom out / toggle fullscreen, floating bottom-right over the canvas", storyId: "starci-blocks-learn-mindmapfullscreenbutton-mindmapfullscreenbutton--default" },
}

/** LEAF — `workspace`, populated: the resizable rail beside the canvas gap. */
export const WorkspaceDefault: Story = {
    render: () => (
        <BlockAnatomy
            name="MindMapPage"
            tier="screen"
            leaf="Workspace — default"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "variant = \"workspace\", items populated, no filter active",
                    why: "The 3rd column of the learn shell: a resizable rail (search + tier filter + results) beside the concept-graph canvas. Nothing else — no back link, no continue button, no legend, no zoom rail — because the learn shell around this pane already owns that chrome. The canvas itself is the documented §B3 gap: the real `ConceptMap` is a live ReactFlow engine out of reach this pass.",
                    code: `<MindMapPage
    variant="workspace"
    query=""
    onQuery={setQuery}
    tier="all"
    onTier={setTier}
    items={railItems}
    onPick={setSelectedId}
    railAriaLabel="Search concepts"
    railTierAriaLabel="Filter by popularity"
    railResizeAriaLabel="Drag to resize"
/>`,
                    render: (
                        <MindMapPage
                            showAnatomy
                            variant="workspace"
                            query=""
                            onQuery={() => {}}
                            tier="all"
                            onTier={() => {}}
                            items={RAIL_ITEMS}
                            onPick={() => {}}
                            railAriaLabel="Search concepts"
                            railTierAriaLabel="Filter by popularity"
                            railResizeAriaLabel="Drag to resize"
                        />
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — `workspace`, loading: the rail shows its own shimmer, the canvas gap swaps to its loading wording. */
export const WorkspaceLoading: Story = {
    render: () => (
        <BlockAnatomy
            name="MindMapPage"
            tier="screen"
            leaf="Workspace — loading"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isSkeleton = true",
                    why: "The flag flows into `MindMapRail`, which draws its OWN resting shape (search + funnel stay live, only the result list mirrors — see that block's file header), and the canvas gap swaps its title to the loading wording. No hand-built shimmer tree of its own: every block that can mirror itself does.",
                    code: "<MindMapPage variant=\"workspace\" {...props} isSkeleton />",
                    render: (
                        <MindMapPage
                            showAnatomy
                            variant="workspace"
                            query=""
                            onQuery={() => {}}
                            tier="all"
                            onTier={() => {}}
                            items={RAIL_ITEMS}
                            onPick={() => {}}
                            railAriaLabel="Search concepts"
                            railTierAriaLabel="Filter by popularity"
                            railResizeAriaLabel="Drag to resize"
                            isSkeleton
                        />
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — `workspace`, empty: the course has no authored map yet, the whole spine is replaced. */
export const WorkspaceEmpty: Story = {
    render: () => (
        <BlockAnatomy
            name="MindMapPage"
            tier="screen"
            leaf="Workspace — empty"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isEmpty = true",
                    why: "An unauthored course has no map to search — the rail and the canvas gap both disappear, replaced by ONE centred message, same \"whole spine swap\" shape `CourseContents`'s own empty state already established. `isEmpty` is `workspace`-only: `standalone`'s canvas gap already stands in for every one of its own not-yet-built branches.",
                    code: "<MindMapPage variant=\"workspace\" {...props} isEmpty />",
                    render: (
                        <MindMapPage
                            showAnatomy
                            variant="workspace"
                            query=""
                            onQuery={() => {}}
                            tier="all"
                            onTier={() => {}}
                            items={[]}
                            onPick={() => {}}
                            railAriaLabel="Search concepts"
                            railTierAriaLabel="Filter by popularity"
                            railResizeAriaLabel="Drag to resize"
                            isEmpty
                        />
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — `standalone`, populated: the canvas gap plus its three floating overlays. */
export const StandaloneDefault: Story = {
    render: () => (
        <BlockAnatomy
            name="MindMapPage"
            tier="screen"
            leaf="Standalone — default"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "variant = \"standalone\", resumeHref set, no rail",
                    why: "The public full-bleed route: no rail (the public map has no search pane), just the canvas gap with its three floating pieces — resume action top-center, status legend bottom-left, zoom/fullscreen rail bottom-right. In the real app all three are `<Panel>` children of the SAME ReactFlow engine this gap stands in for; here each is its own frame-placed overlay (see the component's \"OVERLAYS ARE FRAMES\" note). `MindMapBackButton` is deliberately absent — see Correction 1 in the file header.",
                    code: `<MindMapPage
    variant="standalone"
    query="" onQuery={() => {}} tier="all" onTier={() => {}} items={[]} onPick={() => {}}
    railAriaLabel="" railTierAriaLabel="" railResizeAriaLabel=""
    resumeHref="/course/devops/learn/content/l2"
    allContentDone={false}
    onResume={onResume}
    continueAriaLabel="Continue learning"
    legendItems={legendItems}
    onZoomIn={onZoomIn} onZoomOut={onZoomOut} onToggleFullscreen={onToggleFullscreen}
    isFullscreen={false}
    fullscreenAriaLabels={{ zoomIn: "Zoom in", zoomOut: "Zoom out", toggleFullscreen: "Toggle fullscreen" }}
/>`,
                    render: (
                        <MindMapPage
                            showAnatomy
                            variant="standalone"
                            query=""
                            onQuery={() => {}}
                            tier="all"
                            onTier={() => {}}
                            items={[]}
                            onPick={() => {}}
                            railAriaLabel=""
                            railTierAriaLabel=""
                            railResizeAriaLabel=""
                            resumeHref="/course/devops/learn/content/l2"
                            allContentDone={false}
                            onResume={() => {}}
                            continueAriaLabel="Continue learning"
                            legendItems={LEGEND_ITEMS}
                            onZoomIn={() => {}}
                            onZoomOut={() => {}}
                            onToggleFullscreen={() => {}}
                            isFullscreen={false}
                            fullscreenAriaLabels={FULLSCREEN_ARIA_LABELS}
                        />
                    ),
                },
            ]}
        />
    ),
}

/** LEAF — `standalone`, loading: a single full-bleed gap, all three overlays absent. */
export const StandaloneLoading: Story = {
    render: () => (
        <BlockAnatomy
            name="MindMapPage"
            tier="screen"
            leaf="Standalone — loading"
            parts={[]}
            annotate={ANNOTATE}
            states={[
                {
                    name: "isSkeleton = true",
                    why: "Grounded in the real `StandaloneMindMap`: none of the four floating buttons exist until the course entity resolves, because all four are `<Panel>` children of a `Canvas` that has not mounted yet. This leaf mirrors that exactly — the three overlays are not just hidden, they are STRUCTURALLY absent — leaving one full-bleed loading message where the whole engine will eventually mount.",
                    code: "<MindMapPage variant=\"standalone\" {...props} isSkeleton />",
                    render: (
                        <MindMapPage
                            showAnatomy
                            variant="standalone"
                            query=""
                            onQuery={() => {}}
                            tier="all"
                            onTier={() => {}}
                            items={[]}
                            onPick={() => {}}
                            railAriaLabel=""
                            railTierAriaLabel=""
                            railResizeAriaLabel=""
                            isSkeleton
                        />
                    ),
                },
            ]}
        />
    ),
}
