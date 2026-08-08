import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Chip } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Button as HouseButton } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
// `EmptyState` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — phosphor's `weight="duotone"` can no longer ride along, so it's wrapped
// into a component to KEEP the artwork as-is.
const FolderOpenDuotone = (props: SVGProps<SVGSVGElement>) => <FolderOpenIcon data-tier="fixture" {...props} weight="duotone" />
/**
 * `SurfaceCardAccordion` — a bounded `bg-surface` frame wrapping collapsible sections, the
 * separator running full-bleed to the card edge: same skin as `SurfaceCardList`, differing in
 * that each row expands. Shares `SurfaceLabelProps` for the section header
 * (`label`/`labelEnd`/`action`/`onSeeMore`/`seeMoreLabel`/`subtleLabel`) plus string
 * `description`. No `error`/`errorState` branch (topology class D = 0 for LabeledCard+Accordion).
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
/** `action` slot fixture — ComponentTypeWithSkeleton for the shared header right slot. */
const ManageAction = () => <HouseButton variant="secondary" size="sm" label="Manage" onPress={() => {}} />
const ANNOTATE_SEE_MORE: Record<string, AnatomyAnnotation> = {
    "LinkSeeMore": {
        tier: "atom",
        role: "see-more affordance SurfaceCardHeader builds when onSeeMore is passed",
        storyId: "atoms-navigation-link-linkseemore--default",
    },
}
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
    storyId: "composites-feedback-emptystate--description",
}
/**
 * * Rendering is delegated to the house `Accordion` atom (COMPOSITE-3) — this frame
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
/** Story: resting state for this component. */
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
                        render: <SurfaceCardAccordion items={items} defaultExpandedKeys={new Set(["rest"])} />,
                    },
                ]}
            />
        </div>
    ),
}
/** Story: surface with a leading label — shared SurfaceLabelProps (no error branch). */
export const WithLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="WithLabel"
                annotate={{ ...ACCORDION_ANNOTATE, ...ANNOTATE_SEE_MORE }}
                reason="Same SurfaceLabelProps header as SurfaceCardList. Topology class D = 0, so no error/errorState add-on."
                states={[
                    {
                        name: "label + description",
                        why: "Header and string caption sit outside the accordion face — the labeled accordion contract mirrors SurfaceCardList without inventing a LabeledCard wrapper.",
                        code: `<SurfaceCardAccordion
  label="Resources"
  description="Expand a topic to read its notes."
  items={[…]}
  defaultExpandedKeys={new Set(["rest"])}
/>`,
                        render: (
                            <SurfaceCardAccordion
                                label="Resources"
                                description="Expand a topic to read its notes."
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        ),
                    },
                    {
                        name: "onSeeMore + seeMoreLabel",
                        why: "Shared header right slot builds LinkSeeMore — identical SurfaceLabelProps path as SurfaceCardList.",
                        code: `<SurfaceCardAccordion
  label="Resources"
  onSeeMore={() => {}}
  seeMoreLabel="Browse all"
  items={[…]}
/>`,
                        render: (
                            <SurfaceCardAccordion
                                label="Resources"
                                onSeeMore={() => {}}
                                seeMoreLabel="Browse all"
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        ),
                    },
                    {
                        name: "labelEnd",
                        why: "Muted passive tag in the header right slot when neither action nor onSeeMore claims it.",
                        code: "<SurfaceCardAccordion label=\"Resources\" labelEnd=\"3\" items={[…]} />",
                        render: (
                            <SurfaceCardAccordion
                                label="Resources"
                                labelEnd="3"
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        ),
                    },
                    {
                        name: "action",
                        why: "`action` is a ComponentTypeWithSkeleton slot; wins over see-more and labelEnd.",
                        code: "<SurfaceCardAccordion label=\"Resources\" action={ManageAction} items={[…]} />",
                        render: (
                            <SurfaceCardAccordion
                                label="Resources"
                                action={ManageAction}
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        ),
                    },
                    {
                        name: "subtleLabel",
                        why: "Eyebrow treatment with gap-2 — same SurfaceLabelProps subtle path as SurfaceCardList.",
                        code: "<SurfaceCardAccordion label=\"Module A\" subtleLabel items={[…]} />",
                        render: (
                            <SurfaceCardAccordion
                                label="Module A"
                                subtleLabel
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * `variant` — the surface-in-surface AXIS, independent of every other axis.
 * Renders the FULL union side by side: `"surface"` (default, `shadow-surface` on a
 * bare background) / `"nested"` (a border replaces the shadow, when this frame sits
 * INSIDE a parent surface).
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
/** Story: accordion item with trailing title content. */
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
                            <SurfaceCardAccordion label="Multiple open" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
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
                        render: <SurfaceCardAccordion label="All collapsed" items={items} defaultExpandedKeys={new Set()} />,
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
/** Loading: `isSkeleton` forwards into header + house Accordion atom — no parallel skeleton tree. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardAccordion"
                tier="composite"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true (labeled)",
                        why: "Header label/caption shimmer via SurfaceCardHeader + RichText, and the Accordion atom self-renders its collapsed-row mirror. This composite never builds a second skeleton tree (COMPOSITE-10).",
                        code: `<SurfaceCardAccordion
  label="Resources"
  description="Expand a topic to read its notes."
  items={[…]}
  isSkeleton
/>`,
                        render: (
                            <SurfaceCardAccordion
                                label="Resources"
                                description="Expand a topic to read its notes."
                                items={items}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}