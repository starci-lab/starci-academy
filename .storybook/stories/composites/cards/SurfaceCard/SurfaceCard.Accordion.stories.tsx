import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Chip } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — phosphor's `weight="duotone"` can no longer ride along, so it's wrapped
// into a component to KEEP the artwork as-is.
const FolderOpenDuotone = (props: SVGProps<SVGSVGElement>) => <FolderOpenIcon {...props} weight="duotone" />

/**
 * FRAME (Layouts) — a bounded `bg-surface` frame wrapping COLLAPSIBLE sections, the
 * separator running full-bleed to the card edge: same skin as `SurfaceCard.List`,
 * differing in that each row expands.
 *
 * ⚠️ STATE SCOPE (teacher decided 2026-07-25): stories here only render state that
 * THIS component itself produces — `items` (a REPEATED list → data, children
 * forbidden), `titleEnd`, expand mode (`allowsMultipleExpanded` /
 * `defaultExpandedKeys`), `variant`, empty, and the loading mirror. The section
 * header slot set shares `SurfaceCardHeader` with `SurfaceCard.Base` → here we keep
 * only ONE leaf `WithLabel`, not the whole set repeated.
 *
 * ⭐ 2026-07-26 (teacher): `bordered?: boolean` changed to `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`, one of THREE INDEPENDENT AXES shared with
 * `SurfaceCard.Base`/`.List`/`.CrossList`). The `Bordered` leaf (which only acted out
 * half the union) merged into `Variants` — rendering the FULL `surface`/`nested`
 * union side by side instead of splitting by the old boolean VALUE.
 *
 * ANATOMY IS PER-LEAF: each story is its own leaf, carrying its own BlockAnatomy.
 */
const meta: Meta<typeof SurfaceCard.Accordion> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard.Accordion",
    component: SurfaceCard.Accordion,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Accordion>

/**
 * Standard mock content (C-fixture) = ProfileCard: avatar + title + description.
 * `items[].body` opens INSIDE the accordion frame (already a `bg-surface`), so NO
 * extra outer `Card` wrapper — avoiding card-in-card (§1a) — just the
 * avatar+title+desc row.
 */
const panel = () => (
    <div className="flex flex-row items-center gap-3">
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
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: panel() },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: panel() },
    { id: "error", title: "Error handling", subtitle: "4 resources", body: panel() },
]

/**
 * `Feedback.Empty` is a REAL DEP of the `Empty` leaf (its own story, clickable) —
 * matches the icon+title+description shape (NO action) rendering at this leaf ⇒
 * points to the right `Description` leaf over there. Every other part of the frame
 * (`Surface`/`Header`) has NO story of its own, so NONE are declared — the old
 * `parts={...}` line used to declare them, creating dead entries (unclickable).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the surface when items is empty, showing an icon with a title and description.",
    tier: "composite",
    storyId: "composites-feedback-feedback-feedback-empty--description",
}

/**
 * ⭐ 2026-07-27 — `Accordion.Item` renders straight from `@heroui/react` (this frame
 * builds each trigger row on HeroUI's own `Accordion.Item`, no port of ours in
 * between). It carries `data-anat-part="Accordion.Item"` directly, so it needs the
 * `heroui` tier here to show up at all — a `heroui` node needs no `storyId` (there is
 * no story of ours to jump to), the tier alone is what keeps the panel from hiding it.
 * Previously named `"Row"`, a role label that hid which real component was rendering.
 * Applies to every leaf below that mounts REAL (non-skeleton) items; `Loading` mounts
 * `AccordionFrameSkeleton` instead, a plain mimic `<div>`, not this component.
 */
const ACCORDION_ITEM_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Accordion.Item": {
        tier: "heroui",
        role: "one collapsible trigger + panel row, rendered directly from HeroUI's Accordion.Item.",
    },
}

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="Default"
                annotate={ACCORDION_ITEM_ANNOTATE}
                reason="No `label`/`description` (bare) renders the Surface wrapping the Rows directly, with no Header above it."
                states={[
                    {
                        name: "label = undefined, allowsMultipleExpanded = false (default)",
                        why: "The Surface wraps the three Rows directly with no Header above them, since neither `label` nor `description` was passed. Opening a second Row auto-closes whichever one was already open, the default single-open behaviour.",
                        code: `<SurfaceCard.Accordion
  items={[
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: <Panel /> },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: <Panel /> },
  ]}
  defaultExpandedKeys={new Set(["rest"])}
/>`,
                        render: <SurfaceCard.Accordion showAnatomy items={items} defaultExpandedKeys={new Set(["rest"])} />,
                    },
                ]}
            />
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="WithLabel"
                annotate={ACCORDION_ITEM_ANNOTATE}
                states={[
                    {
                        name: "label = \"Resources\"",
                        why: "A Header appears above the Surface, separated from it by a gap-3 seam, carrying the label text. The full header slot set (see-more, action, labelEnd, subtleLabel, description) is demonstrated separately on the SurfaceCard.Base story.",
                        code: `<SurfaceCard.Accordion
  label="Resources"
  items={[…]}
  defaultExpandedKeys={new Set(["rest"])}
/>`,
                        render: <SurfaceCard.Accordion showAnatomy label="Resources" items={items} defaultExpandedKeys={new Set(["rest"])} />,
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="Prop `variant`"
                annotate={ACCORDION_ITEM_ANNOTATE}
                reason="`variant` is one of three independent axes shared with SurfaceCard.Base/.List/.CrossList: it answers whether this frame sits directly on the page background or nested inside another surface, never both at once (§1a)."
                states={[
                    {
                        name: "variant = \"surface\" (default)",
                        why: "The frame draws its own `shadow-surface` shadow while sitting on the bare page background. This is the default look for an accordion that is the outermost surface at its spot on the page.",
                        code: "<SurfaceCard.Accordion label=\"Resources\" items={[…]} />",
                        render: (
                            <SurfaceCard.Accordion
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
                        code: "<SurfaceCard.Accordion label=\"Resources\" variant=\"nested\" items={[…]} />",
                        render: (
                            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                                <SurfaceCard.Accordion
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
export const WithTitleEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="WithTitleEnd"
                annotate={ACCORDION_ITEM_ANNOTATE}
                states={[
                    {
                        name: "items[].titleEnd set (status Chip)",
                        why: "A status chip appears right inside the collapsed trigger, to the left of the caret, and the title text truncates itself to leave room for it. Each row's `titleEnd` keeps its own full width regardless of how long its neighbour's title runs.",
                        code: `<SurfaceCard.Accordion
  label="Milestones"
  items={[
    { id: "m1", title: "1/1. Project kickoff", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>, body: <Panel /> },
  ]}
/>`,
                        render: (
                            <SurfaceCard.Accordion
                                showAnatomy
                                label="Milestones"
                                defaultExpandedKeys={new Set(["m2"])}
                                items={[
                                    { id: "m1", title: "1/1. Project kickoff", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>, body: panel() },
                                    { id: "m2", title: "2/2. Build the API", titleEnd: <Chip size="sm" variant="soft" color="warning"><Chip.Label>In progress</Chip.Label></Chip>, body: panel() },
                                    { id: "m3", title: "3/3. Deploy", titleEnd: <Chip size="sm" variant="soft" color="default"><Chip.Label>Not started</Chip.Label></Chip>, body: panel() },
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="MultipleExpand"
                annotate={ACCORDION_ITEM_ANNOTATE}
                states={[
                    {
                        name: "allowsMultipleExpanded = true",
                        why: "More than one Row stays open at the same time instead of the newest one closing its neighbour. The composition of Surface, Header, and Rows does not change, only how many can be expanded together.",
                        code: `<SurfaceCard.Accordion
  label="Multiple open"
  allowsMultipleExpanded
  items={[…]}
  defaultExpandedKeys={new Set(["rest", "error"])}
/>`,
                        render: (
                            <SurfaceCard.Accordion showAnatomy label="Multiple open" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="NoneExpand"
                annotate={ACCORDION_ITEM_ANNOTATE}
                states={[
                    {
                        name: "defaultExpandedKeys = new Set()",
                        why: "Every Row starts collapsed on mount, since the set naming which keys should already be open is empty. No Row's body renders until the learner clicks one open themselves.",
                        code: `<SurfaceCard.Accordion
  label="All collapsed"
  items={[…]}
  defaultExpandedKeys={new Set()}
/>`,
                        render: <SurfaceCard.Accordion showAnatomy label="All collapsed" items={items} defaultExpandedKeys={new Set()} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Empty: an empty `items` → {@link Feedback.Empty} fills the surface (instead of a blank card). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="Empty"
                annotate={{ "Feedback.Empty": PART_FEEDBACK_EMPTY }}
                states={[
                    {
                        name: "items = []",
                        why: "`Feedback.Empty` fills the surface with an icon, a title, and a description instead of leaving a blank card. No Row or Header renders since there is nothing to list.",
                        code: `<SurfaceCard.Accordion
  label="Resources"
  items={[]}
  emptyState={<Feedback.Empty icon={FolderOpenDuotone} title="No resources yet" … />}
/>`,
                        render: (
                            <SurfaceCard.Accordion
                                showAnatomy
                                label="Resources"
                                items={[]}
                                emptyState={
                                    <Feedback.Empty
                                        icon={FolderOpenDuotone}
                                        title="No resources yet"
                                        description="Docs for this topic will show up here."
                                        anatPart="Feedback.Empty"
                                    />
                                }
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading: `isSkeleton` draws its own `Skeleton.Accordion` mirror (keeping the surface shell) — no separate Skeleton built. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The entire Surface and Row region swaps for a single `Skeleton.Accordion` mirror node, while the Header above stays unchanged and still shows the real label. No separate Skeleton component was built for this leaf, the accordion draws its own resting shape.",
                        code: `<SurfaceCard.Accordion
  label="Resources"
  items={[…]}
  isSkeleton
/>`,
                        render: <SurfaceCard.Accordion showAnatomy label="Resources" items={items} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
