import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { CardsIcon, TrayIcon, CaretRightIcon } from "@phosphor-icons/react"
import { List, type ListLabeledItem } from "@sb-components/layouts/lists/List/List"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — the phosphor `weight="duotone"` can no longer tag along, so wrap it
// in a component to KEEP the stroke style.
const TrayDuotone = (props: SVGProps<SVGSVGElement>) => <TrayIcon {...props} weight="duotone" />

/**
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): `List.Labeled` is a REPEATED-LIST
 * frame with no card frame. What it produces: a section label (icon + Label),
 * a `gap-2` column built from `items`, a footer CTA, and the two states of the
 * list ITSELF — EMPTY (`emptyState`) + LOADING (`isSkeleton`). Slot variants of
 * a single ROW (leading/meta/trailing/divider/href) belong to `List.Row` —
 * NOT repeated here.
 */
const meta: Meta<typeof List.Labeled> = {
    title: "Layouts/Lists/List/List.Labeled",
    component: List.Labeled,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof List.Labeled>

/**
 * Local stand-in for `@sb-components/_legacy/designs/chips/DifficultyChip` — a soft chip whose
 * colour maps to a challenge difficulty.
 */
type Difficulty = "beginner" | "intermediate" | "advanced"

/** One row of the difficulty lookup table below. */
interface DifficultyRow {
    /** Vietnamese label shown on the chip */
    label: string
    /** soft chip color mapped to this difficulty */
    color: "success" | "warning" | "danger"
}

const DIFFICULTY: Record<Difficulty, DifficultyRow> = {
    beginner: { label: "Cơ bản", color: "success" },
    intermediate: { label: "Trung cấp", color: "warning" },
    advanced: { label: "Nâng cao", color: "danger" },
}

/** Props for the `DifficultyChip` demo wrapper below. */
interface DifficultyChipProps {
    /** difficulty key looked up in `DIFFICULTY` */
    difficulty: Difficulty
}

const DifficultyChip = ({ difficulty }: DifficultyChipProps) => (
    <Chip size="sm" variant="soft" color={DIFFICULTY[difficulty].color}>
        <Chip.Label>{DIFFICULTY[difficulty].label}</Chip.Label>
    </Chip>
)

const decks: ReadonlyArray<ListLabeledItem> = [
    { key: "closures", title: "JavaScript Closures", subtitle: "12 thẻ" },
    { key: "event-loop", title: "Event Loop", subtitle: "9 thẻ" },
]

const challenges: ReadonlyArray<ListLabeledItem> = [
    { key: "two-sum", title: "Two Sum", meta: <DifficultyChip difficulty="beginner" /> },
    { key: "sliding-window", title: "Sliding Window Maximum", meta: <DifficultyChip difficulty="advanced" /> },
    { key: "lru-cache", title: "LRU Cache", meta: <DifficultyChip difficulty="intermediate" /> },
]

const shortcuts: ReadonlyArray<ListLabeledItem> = [
    { key: "courses", title: "Khoá học", href: "/courses", trailing: <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" /> },
    { key: "review", title: "Ôn tập thẻ ghi nhớ", href: "/review", trailing: <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" /> },
    { key: "practice", title: "Luyện tập", href: "/practice", trailing: <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" /> },
]

/** Header (icon+Label) + List (a column of List.Row built from `items`) — Action only appears when there's a CTA. */
const ROW: AnatomyNode = { name: "List.Row", tier: "primitive", role: "1 row (repeated ×N) — built from `items`", storyId: "layouts-lists-list-list-row--title-only" }
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "icon (optional) + section Label" },
    { name: "List", tier: "primitive", role: "gap-2 column of rows", children: [ROW] },
]

/** One related deck, no CTA — the lightest review panel. */
export const SingleItem: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="SingleItem"
                parts={BASE_PARTS}
                reason="A 'label + short list (+CTA)' rail/panel with NO card frame — lighter than SurfaceCard.List for secondary panels (review, practice next to a lesson). `items` is data because this is a REPEATED list (§13b)."
                code={`<List.Labeled
  label="Ôn tập bài này"
  items={[{ key: "closures", title: "JavaScript Closures", subtitle: "12 thẻ" }]}
/>`}
            >
                <List.Labeled label="Ôn tập bài này" items={decks.slice(0, 1)} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

const ACTION_PARTS: Array<AnatomyNode> = [
    ...BASE_PARTS,
    { name: "Action", tier: "primitive", role: "footer CTA (Button), gap-3 from List" },
]

/** Multiple rows (title + difficulty meta) with a footer `action` CTA — the lesson-rail practice panel. */
export const MultipleWithAction: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="MultipleWithAction"
                parts={ACTION_PARTS}
                note="`action` adds a 3rd CTA group (gap-3 from List) — 3 groups: Header · List · Action."
                code={`<List.Labeled
  label="Luyện tập bài này"
  items={[{ key: "two-sum", title: "Two Sum", meta: <DifficultyChip … /> }, …]}
  action={<Button size="sm" variant="primary">Luyện tập ngay</Button>}
/>`}
            >
                <List.Labeled
                    label="Luyện tập bài này"
                    items={challenges}
                    action={
                        <Button size="sm" variant="primary" className="self-start">
                            Luyện tập ngay
                        </Button>
                    }
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `icon` before the label — a visual marker to tell adjacent panels apart at a glance. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="WithIcon"
                parts={BASE_PARTS}
                note="`icon` renders BEFORE Label, in the same one Header node (icon isn't split into its own part)."
                code={`<List.Labeled
  label="Thẻ ghi nhớ liên quan"
  icon={<CardsIcon className="size-5" />}
  items={[…]}
/>`}
            >
                <List.Labeled
                    label="Thẻ ghi nhớ liên quan"
                    icon={<CardsIcon aria-hidden focusable="false" className="size-5" />}
                    items={decks}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Navigation: each item has `href` + chevron → the whole row is an `<a>` (the frame doesn't decide this, the item does). */
export const NavigationItems: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="NavigationItems"
                parts={BASE_PARTS}
                note="Composition doesn't change — items carry `href`/`trailing`, so each List.Row switches to an <a> with a hover surface."
                code={`<List.Labeled
  label="Truy cập nhanh"
  items={[{ key: "courses", title: "Khoá học", href: "/courses", trailing: <CaretRightIcon /> }, …]}
/>`}
            >
                <List.Labeled label="Truy cập nhanh" items={shortcuts} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "icon (optional) + section Label" },
    { name: "List", tier: "primitive", role: "gap-2 column — empty, so it holds emptyState instead of rows" },
]

/**
 * Empty — `items` is empty: the frame pours `emptyState` into the list slot,
 * Header still stands, so the panel doesn't disappear. The EMPTY state
 * belongs to the list frame (not to `List.Row`).
 */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="items=[] → the List slot renders `emptyState`; the parts tree drops the List.Row node."
                code={`<List.Labeled
  label="Ôn tập bài này"
  items={[]}
  emptyState={<Feedback.Empty title="Chưa có mục nào" … />}
/>`}
            >
                <List.Labeled
                    label="Ôn tập bài này"
                    items={[]}
                    emptyState={
                        <Feedback.Empty
                            icon={TrayDuotone}
                            title="Chưa có mục nào"
                            description="Chưa tìm thấy thẻ ghi nhớ liên quan cho bài học này."
                        />
                    }
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "icon (optional) + section Label" },
    {
        name: "List",
        tier: "primitive",
        role: "gap-2 column, frame kept as-is",
        children: [{ name: "List.Row", tier: "primitive", role: "row mirror (×skeletonRows)", storyId: "layouts-lists-list-list-row--leading-subtitle" }],
    },
]

/**
 * Loading — `isSkeleton` MIRRORS the real tree: the `Label` header + the
 * `gap-2` List frame stay as-is, only each row switches to a `List.Row`
 * mirror, so the panel doesn't jump once data lands.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="isSkeleton ignores `items` (no data yet while loading) and draws `skeletonRows` mirror rows — default 3."
                code={`<List.Labeled
  label="Luyện tập bài này"
  items={[]}
  isSkeleton
/>`}
            >
                <List.Labeled label="Luyện tập bài này" items={[]} isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
