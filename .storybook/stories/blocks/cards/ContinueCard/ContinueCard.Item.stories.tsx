import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Button } from "../../buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the `item` variant of ContinueCard: one of N "tiếp tục phiên đang dở"
 * cards in a grid/list (the story trình 1 card đại diện, lưới là việc của
 * consumer). A static SectionCard frame; the CTA is a real SeeMoreLink on its own
 * row.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Design/Cards/ContinueCard/Item",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// Content leaf — the loaded item: SectionCard frame CONTAINS (title + subtitle) then a
// SeeMoreLink CTA row. No progress (value undefined), no icon (item variant). Title/subtitle/CTA
// mount INSIDE SectionCard → they nest under its children, in DOM order.
const ITEM_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "design",
        role: "khung surface tự đóng — chứa info + hàng CTA",
        children: [
            { name: "Typography · tiêu đề", tier: "primitive", role: "tên mục đang học dở (weight medium, truncate 1 dòng)" },
            { name: "Typography · phụ đề", tier: "primitive", role: "nhãn phụ muted (body-xs, truncate)", state: "muted" },
            { name: "SeeMoreLink", tier: "primitive", role: 'CTA "Tiếp tục →" trên hàng riêng — hover/click sống trên link' },
        ],
    },
]

// Loading leaf — Skeleton mirrors the item LAYOUT (title · subtitle · CTA), no progress and no sweep.
// The three Skeleton lines are rendered INSIDE the SectionCard frame → they nest under its children.
const LOADING_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "design",
        role: "khung surface (giữ nguyên footprint)",
        children: [
            { name: "Skeleton.Typography · tiêu đề", tier: "primitive", role: "mirror dòng tiêu đề (width 2/3)", state: "skeleton" },
            { name: "Skeleton.Typography · phụ đề", tier: "primitive", role: "mirror dòng phụ đề (width 1/3)", state: "skeleton" },
            { name: "Skeleton.Typography · CTA", tier: "primitive", role: "mirror hàng CTA (width 1/4)", state: "skeleton" },
        ],
    },
]

// Error leaf — the error renders INSIDE the card frame (not a blank card): EmptyState danger + retry.
// EmptyState mounts INSIDE SectionCard; the WarningIcon (icon prop) + retry Button (action prop)
// mount INSIDE EmptyState → the tree nests SectionCard > EmptyState > (WarningIcon, Button).
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "design",
        role: "khung surface — lỗi render TRONG khung (không phải card trắng)",
        children: [
            {
                name: "EmptyState",
                tier: "primitive",
                role: 'trạng thái "Mất kết nối" — icon cảnh báo + mô tả',
                state: "danger",
                children: [
                    { name: "WarningIcon", tier: "primitive", role: "icon cảnh báo (duotone) — decorative", state: "decorative" },
                    { name: "Button", tier: "primitive", role: '"Thử lại" (secondary, sm)' },
                ],
            },
        ],
    },
]

/** The loaded item card — one representative (grid is the consumer's concern). */
export const Content: Story = {
    name: "Mục",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Mục"
                parts={ITEM_PARTS}
                reason={
                    "Biến thể \"item\" (1-trong-N — story trình 1 card đại diện, lưới là việc của consumer). Mỗi state là 1 leaf trong folder: Mục (content, CTA SeeMoreLink) · Đang tải (Skeleton mirror LAYOUT item, KHÔNG progress/sweep) · Lỗi mạng rớt (EmptyState tone=\"danger\" trong SectionCard). Skeleton mirror layout, không nhấn/animation."
                }
            >
                <div className="w-80">
                    <ContinueCard variant="item" title="Building a RESTful API with NestJS" subtitle="Reading" ctaLabel="Continue" href="/courses/nestjs-api/lessons/5" />
                </div>
            </BlockAnatomy>,
        ),
}

/** Loading — skeleton mirrors the item LAYOUT (title · subtitle · CTA link; no progress, no sweep). */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="Skeleton mirror LAYOUT của item (tiêu đề · phụ đề · CTA), KHÔNG progress và KHÔNG sweep — composition khác leaf content (không nội dung thật)."
            >
                <div className="w-80">
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton.Typography type="body" width="2/3" />
                            <Skeleton.Typography type="body-xs" width="1/3" />
                        </div>
                        <Skeleton.Typography type="body-sm" width="1/4" />
                    </SectionCard>
                </div>
            </BlockAnatomy>,
        ),
}

/** Network drop — error rendered INSIDE the card frame (not a blank card). */
export const LoadError: Story = {
    name: "Lỗi tải (mạng rớt)",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Lỗi tải (mạng rớt)"
                parts={ERROR_PARTS}
                note={'Mạng rớt → EmptyState tone="danger" + nút Thử lại render TRONG SectionCard, không để lại card trắng.'}
            >
                <div className="w-80">
                    <SectionCard>
                        <EmptyState
                            tone="danger"
                            icon={<WarningIcon weight="duotone" />}
                            title="Mất kết nối"
                            description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                            action={
                                <Button variant="secondary" size="sm" onPress={() => {}}>
                                    Thử lại
                                </Button>
                            }
                        />
                    </SectionCard>
                </div>
            </BlockAnatomy>,
        ),
}
