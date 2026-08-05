import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { CardsIcon, TrayIcon, CaretRightIcon } from "@phosphor-icons/react"
import { ListLabeled, type ListLabeledItem } from "@sb-components/composites/lists/List/List"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `EmptyState` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — the phosphor `weight="duotone"` can no longer tag along, so wrap it
// in a component to KEEP the stroke style.
const TrayDuotone = (props: SVGProps<SVGSVGElement>) => <TrayIcon data-tier="fixture" {...props} weight="duotone" />

/**
 * `ListLabeled` — a repeated-list frame with no card chrome: a section label (icon + Label), a
 * `gap-2` column built from `items`, a footer CTA, and the list's own empty (`emptyState`) and
 * loading (`isSkeleton`) states. `icon`/`action`/`emptyState` take component references and
 * `label` a plain string. Single-row slot variants belong to `ListRow`.
 */
const meta: Meta<typeof ListLabeled> = {
    title: "Composites/Lists/List/ListLabeled",
    component: ListLabeled,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ListLabeled>

/**
 * Local stand-in for `@sb-components/_legacy/designs/chips/DifficultyChip` — a soft chip whose
 * colour maps to a challenge difficulty.
 */
type Difficulty = "beginner" | "intermediate" | "advanced"

/** One row of the difficulty lookup table below. */
interface DifficultyRow {
    /** label shown on the chip */
    label: string
    /** soft chip color mapped to this difficulty */
    color: "success" | "warning" | "danger"
}

const DIFFICULTY: Record<Difficulty, DifficultyRow> = {
    beginner: { label: "Beginner", color: "success" },
    intermediate: { label: "Intermediate", color: "warning" },
    advanced: { label: "Advanced", color: "danger" },
}

/** Props for the `DifficultyChip` demo wrapper below. */
interface DifficultyChipProps {
    /** difficulty key looked up in `DIFFICULTY` */
    difficulty: Difficulty
}

const DifficultyChip = ({ difficulty }: DifficultyChipProps) => (
    <Chip data-tier="fixture" size="sm" variant="soft" color={DIFFICULTY[difficulty].color}>
        <Chip.Label>{DIFFICULTY[difficulty].label}</Chip.Label>
    </Chip>
)

const decks: ReadonlyArray<ListLabeledItem> = [
    { key: "closures", title: "JavaScript Closures", subtitle: "12 cards" },
    { key: "event-loop", title: "Event Loop", subtitle: "9 cards" },
]

const BeginnerMeta = () => <DifficultyChip difficulty="beginner" />
const AdvancedMeta = () => <DifficultyChip difficulty="advanced" />
const IntermediateMeta = () => <DifficultyChip difficulty="intermediate" />

const challenges: ReadonlyArray<ListLabeledItem> = [
    { key: "two-sum", title: "Two Sum", meta: BeginnerMeta },
    { key: "sliding-window", title: "Sliding Window Maximum", meta: AdvancedMeta },
    { key: "lru-cache", title: "LRU Cache", meta: IntermediateMeta },
]

/** Shared trailing chevron component (COMPOSITE-8) for every navigation shortcut below. */
const ChevronTrailing = () => <CaretRightIcon data-tier="fixture" className="size-3 text-muted" aria-hidden focusable="false" />

const shortcuts: ReadonlyArray<ListLabeledItem> = [
    { key: "courses", title: "Courses", href: "/courses", trailing: ChevronTrailing },
    { key: "review", title: "Review flashcards", href: "/review", trailing: ChevronTrailing },
    { key: "practice", title: "Practice", href: "/practice", trailing: ChevronTrailing },
]

/** Header (icon+Label) + List (a column of ListRow built from `items`) — Action only appears when there's a CTA. */
const ROW: AnatomyNode = { name: "ListRow", tier: "composite", role: "1 row, repeated ×N, built from items", storyId: "composites-lists-list-listrow--title-only" }
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "composite", role: "icon (optional) plus section Label" },
    { name: "List", tier: "composite", role: "gap-2 column of rows", children: [ROW] },
]

/** One related deck, no CTA — the lightest review panel. */
export const SingleItem: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListLabeled"
                tier="composite"
                leaf="SingleItem"
                parts={BASE_PARTS}
                reason="A label plus a short list, with an optional CTA, and no card frame — lighter than SurfaceCardList for secondary panels such as a review or practice rail next to a lesson. `items` is data because this is a REPEATED list (§13b)."
                states={[
                    {
                        name: "items has 1 entry",
                        why: "The List column renders exactly one row and no Action node appears. This is the lightest shape of the frame, a single related deck surfaced next to a lesson with nothing else competing for attention.",
                        code: `<ListLabeled
  label="Review this lesson"
  items={[{ key: "closures", title: "JavaScript Closures", subtitle: "12 cards" }]}
/>`,
                        render: <ListLabeled label="Review this lesson" items={decks.slice(0, 1)} />,
                    },
                ]}
            />
        </div>
    ),
}

const ACTION_PARTS: Array<AnatomyNode> = [
    ...BASE_PARTS,
    { name: "Action", tier: "composite", role: "footer CTA (Button), gap-3 from List" },
]

/** Footer CTA component (COMPOSITE-8): `ListLabeled` calls this itself for the `action` slot. */
const PracticeNowAction = () => (
    <Button data-tier="fixture" size="sm" variant="primary" className="self-start">
        Practice now
    </Button>
)

/** Multiple rows (title + difficulty meta) with a footer `action` CTA — the lesson-rail practice panel. */
export const MultipleWithAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListLabeled"
                tier="composite"
                leaf="MultipleWithAction"
                parts={ACTION_PARTS}
                states={[
                    {
                        name: "items has 3 entries, action passed",
                        why: "A third group, Action, appears below List with a gap-3 seam, giving the panel Header · List · Action stacked in that order. This is for a panel that ends in a real call to action, such as jumping straight into practice.",
                        code: `<ListLabeled
  label="Practice this lesson"
  items={[{ key: "two-sum", title: "Two Sum", meta: BeginnerMeta }, …]}
  action={PracticeNowAction}
/>`,
                        render: (
                            <ListLabeled
                                label="Practice this lesson"
                                items={challenges}
                                action={PracticeNowAction}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leading icon component (COMPOSITE-8) for the section label below. */
const CardsLeadingIcon = () => <CardsIcon data-tier="fixture" aria-hidden focusable="false" className="size-5" />

/** `icon` before the label — a visual marker to tell adjacent panels apart at a glance. */
export const WithIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListLabeled"
                tier="composite"
                leaf="WithIcon"
                parts={BASE_PARTS}
                states={[
                    {
                        name: "icon passed",
                        why: "The icon renders before Label, still inside the same single Header node rather than as a part of its own. This gives an adjacent panel a visual marker to tell it apart from its neighbours at a glance.",
                        code: `<ListLabeled
  label="Related flashcards"
  icon={CardsLeadingIcon}
  items={[…]}
/>`,
                        render: (
                            <ListLabeled
                                label="Related flashcards"
                                icon={CardsLeadingIcon}
                                items={decks}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Navigation: each item has `href` + chevron → the whole row is an `<a>` (the frame doesn't decide this, the item does). */
export const NavigationItems: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListLabeled"
                tier="composite"
                leaf="NavigationItems"
                parts={BASE_PARTS}
                states={[
                    {
                        name: "items carry href and trailing",
                        why: "The composition doesn't change, but each ListRow switches to rendering as an `<a>` with a hover surface because the item itself carries `href`/`trailing`, not because the frame decided to. This is for a panel whose rows are pure navigation, such as quick links to other pages.",
                        code: `<ListLabeled
  label="Quick access"
  items={[{ key: "courses", title: "Courses", href: "/courses", trailing: ChevronTrailing }, …]}
/>`,
                        render: <ListLabeled label="Quick access" items={shortcuts} />,
                    },
                ]}
            />
        </div>
    ),
}

const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "composite", role: "icon (optional) plus section Label" },
    { name: "List", tier: "composite", role: "gap-2 column, empty, so it holds emptyState instead of rows" },
]

/** Empty-state component (COMPOSITE-8): `ListLabeled` calls this itself for the `emptyState` slot. */
const NoRelatedDecks = () => (
    <EmptyState
        icon={TrayDuotone}
        title="Nothing here yet"
        description="No related flashcards found for this lesson yet."
    />
)

/**
 * Empty — `items` is empty: the frame pours `emptyState` into the list slot,
 * Header still stands, so the panel doesn't disappear. The EMPTY state
 * belongs to the list frame (not to `ListRow`).
 */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListLabeled"
                tier="composite"
                leaf="Empty"
                parts={EMPTY_PARTS}
                states={[
                    {
                        name: "items = []",
                        why: "The List slot pours in `emptyState` instead of a row, dropping the ListRow node from the tree, while Header still stands above it. This keeps the panel from disappearing outright when a related deck or practice set genuinely has nothing to show yet.",
                        code: `<ListLabeled
  label="Review this lesson"
  items={[]}
  emptyState={NoRelatedDecks}
/>`,
                        render: (
                            <ListLabeled
                                label="Review this lesson"
                                items={[]}
                                emptyState={NoRelatedDecks}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "composite", role: "icon (optional) plus section Label" },
    {
        name: "List",
        tier: "composite",
        role: "gap-2 column, frame kept as-is",
        children: [{ name: "ListRow", tier: "composite", role: "row mirror, repeated ×skeletonRows", storyId: "composites-lists-list-listrow--leading-subtitle" }],
    },
]

/**
 * Loading — `isSkeleton` MIRRORS the real tree: the `Label` header + the
 * `gap-2` List frame stay as-is, only each row switches to a `ListRow`
 * mirror, so the panel doesn't jump once data lands.
 */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListLabeled"
                tier="composite"
                leaf="Loading"
                parts={LOADING_PARTS}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The Label header and the gap-2 List frame stay exactly as they are, and only each row switches to a ListRow mirror, `skeletonRows` of them by default (`items` is ignored while loading). This keeps the panel from jumping in size once the real rows land.",
                        code: `<ListLabeled
  label="Practice this lesson"
  items={[]}
  isSkeleton
/>`,
                        render: <ListLabeled label="Practice this lesson" items={[]} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
