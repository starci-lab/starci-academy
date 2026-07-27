import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Chip } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { SurfaceCardVariant } from "@sb-components/composites/cards/surface-card-header"
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
 * (`Surface`/`Header`/`Row`) has NO story of its own, so NONE are declared — the old
 * `parts={...}` line used to declare them, creating dead entries (unclickable).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the Surface when items is empty — icon + title + description.",
    tier: "composite",
    storyId: "composites-feedback-feedback-feedback-empty--description",
}

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="Default"
                reason="No `label`/`description` (bare) → renders the Surface wrapping the Rows directly, no Header. Default `allowsMultipleExpanded=false`: opening another Row auto-closes the one that was open."
                code={`<SurfaceCard.Accordion
  items={[
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: <Panel /> },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: <Panel /> },
  ]}
  defaultExpandedKeys={new Set(["rest"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy items={items} defaultExpandedKeys={new Set(["rest"])} />
            </BlockAnatomy>
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
                note="`label` turns on the Header above (gap-3 between Header and Surface). The full header slot set (see-more/action/labelEnd/subtleLabel/description) is demonstrated in the SurfaceCard.Base story."
                code={`<SurfaceCard.Accordion
  label="Resources"
  items={[…]}
  defaultExpandedKeys={new Set(["rest"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Resources" items={items} defaultExpandedKeys={new Set(["rest"])} />
            </BlockAnatomy>
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
/**
 * One row of the variant demo table.
 */
interface VariantRow {
    /** the variant token this row demonstrates */
    variant: SurfaceCardVariant
    /** short note explaining when this variant applies */
    hint: string
}

const VARIANTS: ReadonlyArray<VariantRow> = [
    { variant: "surface", hint: "on bare bg-background — the default shadow-surface frame" },
    { variant: "nested", hint: "inside a parent surface — a border replaces the shadow (surface-in-surface, §1a)" },
]

export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="composite"
                leaf="Prop `variant`"
                note={"`variant=\"surface\"` (default) draws shadow-surface on bare bg-background; `variant=\"nested\"` swaps that shadow for a border when this frame sits inside another surface (a panel/modal/drawer) — shadow is nearly invisible there (§1a)."}
                code={`<SurfaceCard.Accordion label="Resources" items={[…]} />
<SurfaceCard.Accordion label="Resources" variant="nested" items={[…]} />`}
            >
                <div className="flex flex-col gap-6">
                    {VARIANTS.map(({ variant, hint }, index) => (
                        variant === "nested" ? (
                            <div key={variant} className="rounded-3xl bg-surface p-3 shadow-surface" title={hint}>
                                <SurfaceCard.Accordion
                                    showAnatomy={index === 0}
                                    label="Resources"
                                    variant={variant}
                                    items={items}
                                    defaultExpandedKeys={new Set(["rest"])}
                                />
                            </div>
                        ) : (
                            <SurfaceCard.Accordion
                                key={variant}
                                showAnatomy={index === 0}
                                label="Resources"
                                variant={variant}
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        )
                    ))}
                </div>
            </BlockAnatomy>
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
                note="`titleEnd` (a status Chip) shows before the caret; the title truncates itself to make room."
                code={`<SurfaceCard.Accordion
  label="Milestones"
  items={[
    { id: "m1", title: "1/1. Project kickoff", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>, body: <Panel /> },
  ]}
/>`}
            >
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
            </BlockAnatomy>
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
                note="`allowsMultipleExpanded` → more than one Row can be open at once; the composition doesn't change."
                code={`<SurfaceCard.Accordion
  label="Multiple open"
  allowsMultipleExpanded
  items={[…]}
  defaultExpandedKeys={new Set(["rest", "error"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Multiple open" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
            </BlockAnatomy>
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
                note="An empty `defaultExpandedKeys` — every Row starts collapsed on mount."
                code={`<SurfaceCard.Accordion
  label="All collapsed"
  items={[…]}
  defaultExpandedKeys={new Set()}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="All collapsed" items={items} defaultExpandedKeys={new Set()} />
            </BlockAnatomy>
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
                note="`items={[]}` → `emptyState` fills the Surface (p-8) instead of leaving it blank."
                code={`<SurfaceCard.Accordion
  label="Resources"
  items={[]}
  emptyState={<Feedback.Empty icon={FolderOpenDuotone} title="No resources yet" … />}
/>`}
            >
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
            </BlockAnatomy>
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
                note="`isSkeleton` swaps the ENTIRE Surface/Row for `Skeleton.Accordion` (one mirror node); the Header above stays unchanged (still the real label)."
                code={`<SurfaceCard.Accordion
  label="Resources"
  items={[…]}
  isSkeleton
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Resources" items={items} isSkeleton />
            </BlockAnatomy>
        </div>
    ),
}
