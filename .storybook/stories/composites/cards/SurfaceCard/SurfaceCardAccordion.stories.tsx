import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Chip } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
// `EmptyState` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — phosphor's `weight="duotone"` can no longer ride along, so it's wrapped
// into a component to KEEP the artwork as-is.
const FolderOpenDuotone = (props: SVGProps<SVGSVGElement>) => <FolderOpenIcon data-tier="fixture" {...props} weight="duotone" />
/**
 * FRAME (Layouts) — a bounded `bg-surface` frame wrapping COLLAPSIBLE sections, the
 * separator running full-bleed to the card edge: same skin as `SurfaceCardList`,
 * differing in that each row expands.
 *
 * ⚠️ STATE SCOPE (teacher decided 2026-07-25): stories here only render state that
 * THIS component itself produces — `items` (a REPEATED list → data, children
 * forbidden), `titleEnd`, expand mode (`allowsMultipleExpanded` /
 * `defaultExpandedKeys`), `variant`, empty, and the loading mirror. The section
 * header slot set shares `SurfaceCardHeader` with `SurfaceCard` → here we keep
 * only ONE leaf `WithLabel`, not the whole set repeated.
 *
 * ⭐ 2026-07-26 (teacher): `bordered?: boolean` changed to `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`, one of THREE INDEPENDENT AXES shared with
 * `SurfaceCard`/`.List`/`.CrossList`). The `Bordered` leaf (which only acted out
 * half the union) merged into `Variants` — rendering the FULL `surface`/`nested`
 * union side by side instead of splitting by the old boolean VALUE.
 *
 * ANATOMY IS PER-LEAF: each story is its own leaf, carrying its own BlockAnatomy.
 */
const meta: Meta<typeof SurfaceCardAccordion> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCardAccordion",
    component: SurfaceCardAccordion,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SurfaceCardAccordion>
/**
 * Standard mock content (C-fixture) = ProfileCard: avatar + title + description.
 * `items[].body` opens INSIDE the accordion frame (already a `bg-surface`), so NO
 * extra outer `Card` wrapper — avoiding card-in-card (§1a) — just the
 * avatar+title+desc row.
 */
const panel = () => (
    <div data-tier="fixture" className="flex flex-row items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Learn fullstack, system design, and DevOps along an interview-prep path.
            </span>
        </div>
    </div>
)
const items: ReadonlyArray<SurfaceCardAccordionItem> = [
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: panel },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: panel },
    { id: "error", title: "Error handling", subtitle: "4 resources", body: panel },
]
/**
 * `EmptyState` is a REAL DEP of the `Empty` leaf (its own story, clickable) —
 * matches the icon+title+description shape (NO action) rendering at this leaf ⇒
 * points to the right `Description` leaf over there. Every other part of the frame
 * (`Surface`/`Header`) has NO story of its own, so NONE are declared — the old
 * `parts={...}` line used to declare them, creating dead entries (unclickable).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the surface when items is empty, showing an icon with a title and description.",
    tier: "composite",
    storyId: "composites-feedback-feedback-feedbackempty--description",
}
/**
 * ⭐ Rendering is delegated to the house `Accordion` atom (COMPOSITE-3) — this frame
 * composes each trigger's content (leading node + title + subtitle + trailing node)
 * as DATA handed to the atom's `items`, and the atom owns expand/collapse plus its
 * own collapsed-row mirror while loading (COMPOSITE-10). The atom is a REAL DEP with
 * its own story, so it carries `storyId` here and shows up as a clickable node —
 * unlike a bare `heroui` node, which would need no `storyId` at all.
 */
const ACCORDION_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "DisclosureGroup": {
        tier: "atom",
        role: "the collapsible sections — SurfaceCardAccordion composes each trigger's content and hands it, as data, to the house Accordion atom, which owns expand/collapse and the loading mirror.",
        storyId: "atoms-navigation-accordion-accordion--default",
    },
}
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="Default"
                annotate={ACCORDION_ANNOTATE}
                reason="No `label`/`description` (bare) renders the Surface wrapping the Rows directly, with no Header above it."
                states={[
                    {
                        name: "label = undefined, allowsMultipleExpanded = false (default)",
                        why: "The Surface wraps the three Rows directly with no Header above them, since neither `label` nor `description` was passed. Opening a second Row auto-closes whichever one was already open, the default single-open behaviour.",
                        code: `<SurfaceCardAccordion
  items={[
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: <Panel /> },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: <Panel /> },
  ]}
  defaultExpandedKeys={new Set(["rest"])}
/>`,
                        render: <SurfaceCardAccordion showAnatomy items={items} defaultExpandedKeys={new Set(["rest"])} />,
                    },
                ]}
            />
        </div>
    ),
}
export const WithLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="WithLabel"
                annotate={ACCORDION_ANNOTATE}
                states={[
                    {
                        name: "label = \"Resources\"",
                        why: "A Header appears above the Surface, separated from it by a gap-3 seam, carrying the label text. The full header slot set (see-more, action, labelEnd, subtleLabel, description) is demonstrated separately on the SurfaceCard story.",
                        code: `<SurfaceCardAccordion
  label="Resources"
  items={[…]}
  defaultExpandedKeys={new Set(["rest"])}
/>`,
                        render: <SurfaceCardAccordion showAnatomy label="Resources" items={items} defaultExpandedKeys={new Set(["rest"])} />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * `variant` — the surface-in-surface AXIS (§1a), independent of every other axis.
 * Renders the FULL union side by side: `"surface"` (default, `shadow-surface` on a
 * bare background) / `"nested"` (a border replaces the shadow, when this frame sits
 * INSIDE a parent surface) — replacing the old `Bordered` leaf that only acted out
 * half the union.
 *
 * 2026-07-26 (teacher): merged from the `Bordered` leaf (changed from
 * `bordered?: boolean` to `variant?: SurfaceCardVariant`).
 */
export const Variants: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="Prop `variant`"
                annotate={ACCORDION_ANNOTATE}
                reason="`variant` is one of three independent axes shared with SurfaceCard/.List/.CrossList: it answers whether this frame sits directly on the page background or nested inside another surface, never both at once (§1a)."
                states={[
                    {
                        name: "variant = \"surface\" (default)",
                        why: "The frame draws its own `shadow-surface` shadow while sitting on the bare page background. This is the default look for an accordion that is the outermost surface at its spot on the page.",
                        code: "<SurfaceCardAccordion label=\"Resources\" items={[…]} />",
                        render: (
                            <SurfaceCardAccordion
                                showAnatomy
                                label="Resources"
                                variant="surface"
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        ),
                    },
                    {
                        name: "variant = \"nested\"",
                        why: "The shadow disappears and a border takes its place, since a shadow reads as nearly invisible once this frame is already sitting inside a parent surface such as a panel, modal, or drawer. Everything else about the accordion's composition stays the same as the surface state.",
                        code: "<SurfaceCardAccordion label=\"Resources\" variant=\"nested\" items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="rounded-3xl bg-surface p-3 shadow-surface">
                                <SurfaceCardAccordion
                                    label="Resources"
                                    variant="nested"
                                    items={items}
                                    defaultExpandedKeys={new Set(["rest"])}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * `items[].titleEnd` — a node to the right of the title (left of the caret): a
 * status chip / score right inside the collapsed trigger. The title truncates
 * itself to make room; `titleEnd` keeps its full width.
 */
/** `titleEnd` slot fixtures for {@link WithTitleEnd} — component references (COMPOSITE-8), not built nodes. */
const DoneBadge = () => <Chip data-tier="fixture" size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>
const InProgressBadge = () => <Chip data-tier="fixture" size="sm" variant="soft" color="warning"><Chip.Label>In progress</Chip.Label></Chip>
const NotStartedBadge = () => <Chip data-tier="fixture" size="sm" variant="soft" color="default"><Chip.Label>Not started</Chip.Label></Chip>
export const WithTitleEnd: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="WithTitleEnd"
                annotate={ACCORDION_ANNOTATE}
                states={[
                    {
                        name: "items[].titleEnd set (status Chip)",
                        why: "A status chip appears right inside the collapsed trigger, to the left of the caret, and the title text truncates itself to leave room for it. Each row's `titleEnd` keeps its own full width regardless of how long its neighbour's title runs.",
                        code: `<SurfaceCardAccordion
  label="Milestones"
  items={[
    { id: "m1", title: "1/1. Project kickoff", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>, body: <Panel /> },
  ]}
/>`,
                        render: (
                            <SurfaceCardAccordion
                                showAnatomy
                                label="Milestones"
                                defaultExpandedKeys={new Set(["m2"])}
                                items={[
                                    { id: "m1", title: "1/1. Project kickoff", titleEnd: DoneBadge, body: panel },
                                    { id: "m2", title: "2/2. Build the API", titleEnd: InProgressBadge, body: panel },
                                    { id: "m3", title: "3/3. Deploy", titleEnd: NotStartedBadge, body: panel },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `allowsMultipleExpanded` — multiple sections open at once (default is single-open, see leaf Default). */
export const MultipleExpand: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="MultipleExpand"
                annotate={ACCORDION_ANNOTATE}
                states={[
                    {
                        name: "allowsMultipleExpanded = true",
                        why: "More than one Row stays open at the same time instead of the newest one closing its neighbour. The composition of Surface, Header, and Rows does not change, only how many can be expanded together.",
                        code: `<SurfaceCardAccordion
  label="Multiple open"
  allowsMultipleExpanded
  items={[…]}
  defaultExpandedKeys={new Set(["rest", "error"])}
/>`,
                        render: (
                            <SurfaceCardAccordion showAnatomy label="Multiple open" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** All collapsed: an empty `defaultExpandedKeys` — every section starts collapsed on mount. */
export const NoneExpand: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="NoneExpand"
                annotate={ACCORDION_ANNOTATE}
                states={[
                    {
                        name: "defaultExpandedKeys = new Set()",
                        why: "Every Row starts collapsed on mount, since the set naming which keys should already be open is empty. No Row's body renders until the learner clicks one open themselves.",
                        code: `<SurfaceCardAccordion
  label="All collapsed"
  items={[…]}
  defaultExpandedKeys={new Set()}
/>`,
                        render: <SurfaceCardAccordion showAnatomy label="All collapsed" items={items} defaultExpandedKeys={new Set()} />,
                    },
                ]}
            />
        </div>
    ),
}
/** `emptyState` slot fixture for {@link Empty} — a component reference (COMPOSITE-8), not a built node. */
const ResourcesEmptyState = () => (
    <EmptyState
        icon={FolderOpenDuotone}
        title="No resources yet"
        description="Docs for this topic will show up here."
        anatPart="EmptyState"
    />
)
/** Empty: an empty `items` → {@link EmptyState} fills the surface (instead of a blank card). */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="Empty"
                annotate={{ "EmptyState": PART_FEEDBACK_EMPTY }}
                states={[
                    {
                        name: "items = []",
                        why: "`EmptyState` fills the surface with an icon, a title, and a description instead of leaving a blank card. No Row or Header renders since there is nothing to list.",
                        code: `<SurfaceCardAccordion
  label="Resources"
  items={[]}
  emptyState={ResourcesEmptyState}
/>`,
                        render: (
                            <SurfaceCardAccordion
                                showAnatomy
                                label="Resources"
                                items={[]}
                                emptyState={ResourcesEmptyState}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** Loading: `isSkeleton` forwards straight into the house `Accordion` atom, which draws its own collapsed-row mirror — this composite never builds a separate Skeleton. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The Accordion atom self-renders its own collapsed-row mirror instead of the real Rows, while the Header above stays unchanged and still shows the real label. This composite never builds a second skeleton tree of its own (COMPOSITE-10) — it only forwards the flag into the atom that owns the shape.",
                        code: `<SurfaceCardAccordion
  label="Resources"
  items={[…]}
  isSkeleton
/>`,
                        render: <SurfaceCardAccordion showAnatomy label="Resources" items={items} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}