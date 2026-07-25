import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { CardsIcon, TrayIcon, CaretRightIcon } from "@phosphor-icons/react"
import { List, type ListLabeledItem } from "@sb-components/blocks/lists/List/List"
import { Feedback } from "@sb-components/blocks/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` nhận icon là COMPONENT ref và tự ép `size-8` (§4/§5) — phosphor
// `weight="duotone"` không đi kèm được nữa, nên bọc thành component để GIỮ NGUYÊN nét vẽ.
const TrayDuotone = (props: SVGProps<SVGSVGElement>) => <TrayIcon {...props} weight="duotone" />

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `List.Labeled` là khung DANH SÁCH LẶP không có
 * khung card. Thứ nó đẻ ra: nhãn phần (icon + Label), cột `gap-2` dựng từ `items`, CTA
 * footer, và hai trạng thái của CHÍNH danh sách — RỖNG (`emptyState`) + ĐANG TẢI
 * (`isSkeleton`). Các biến thể slot của một HÀNG (leading/meta/trailing/divider/href) là
 * tài sản của `List.Row` — KHÔNG lặp ở đây.
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
 * Local stand-in for `@sb-components/blocks/chips/DifficultyChip` — a soft chip whose
 * colour maps to a challenge difficulty.
 */
type Difficulty = "beginner" | "intermediate" | "advanced"
const DIFFICULTY: Record<Difficulty, { label: string; color: "success" | "warning" | "danger" }> = {
    beginner: { label: "Cơ bản", color: "success" },
    intermediate: { label: "Trung cấp", color: "warning" },
    advanced: { label: "Nâng cao", color: "danger" },
}
const DifficultyChip = ({ difficulty }: { difficulty: Difficulty }) => (
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

/** Header (icon+Label) + List (cột List.Row dựng từ `items`) — Action chỉ xuất hiện khi có CTA. */
const ROW: AnatomyNode = { name: "List.Row", tier: "primitive", role: "1 hàng (lặp ×N) — dựng từ `items`", storyId: "layouts-lists-list-list-row--title-only" }
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "icon (tuỳ chọn) + Label phần" },
    { name: "List", tier: "primitive", role: "cột gap-2 các hàng", children: [ROW] },
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
                reason="Rail/panel 'label + list ngắn (+CTA)' KHÔNG có khung card — nhẹ hơn SurfaceCard.List cho các panel phụ (ôn tập, luyện tập cạnh bài học). `items` là dữ liệu vì đây là danh sách LẶP (§13b)."
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
    { name: "Action", tier: "primitive", role: "CTA footer (Button), cách List gap-3" },
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
                note="`action` thêm nhóm CTA thứ 3 (gap-3 với List) — 3 nhóm: Header · List · Action."
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
                note="`icon` render TRƯỚC Label, cùng 1 node Header (không tách icon thành part riêng)."
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

/** Điều hướng: mỗi item có `href` + chevron → cả hàng là `<a>` (khung không tự chọn, item quyết định). */
export const NavigationItems: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="NavigationItems"
                parts={BASE_PARTS}
                note="Composition không đổi — item mang `href`/`trailing` nên mỗi List.Row đổi sang <a> có hover surface."
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
    { name: "Header", tier: "primitive", role: "icon (tuỳ chọn) + Label phần" },
    { name: "List", tier: "primitive", role: "cột gap-2 — rỗng nên chứa emptyState thay cho hàng" },
]

/**
 * Empty — `items` rỗng: khung đổ `emptyState` vào đúng slot danh sách, Header vẫn đứng
 * nguyên nên panel không biến mất. Trạng thái RỖNG thuộc về khung danh sách (không phải
 * của `List.Row`).
 */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="items=[] → slot List render `emptyState`; cây parts rụng node List.Row."
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
    { name: "Header", tier: "primitive", role: "icon (tuỳ chọn) + Label phần" },
    {
        name: "List",
        tier: "primitive",
        role: "cột gap-2 giữ nguyên khung",
        children: [{ name: "List.Row", tier: "primitive", role: "mirror hàng (×skeletonRows)", storyId: "layouts-lists-list-list-row--loading" }],
    },
]

/**
 * Loading — `isSkeleton` MIRROR cây thật: `Label` header + khung List `gap-2` giữ nguyên,
 * chỉ mỗi hàng đổi sang mirror của `List.Row`, nên panel không nhảy khi dữ liệu về.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Labeled"
                tier="primitive"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="isSkeleton bỏ qua `items` (lúc tải chưa có dữ liệu) và vẽ `skeletonRows` hàng mirror — mặc định 3."
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
