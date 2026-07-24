import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LightningIcon,
    SnowflakeIcon,
    TShirtIcon,
} from "@phosphor-icons/react"
import { RewardItemCard } from "./RewardItemCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof RewardItemCard> = {
    title: "Design/Rewards/RewardItemCard",
    component: RewardItemCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RewardItemCard>

/** Plain canvas — each leaf carries its OWN BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

const ICONS = {
    streakFreeze: <SnowflakeIcon aria-hidden focusable="false" />,
    aiCreditBoost: <LightningIcon aria-hidden focusable="false" />,
    tshirt: <TShirtIcon aria-hidden focusable="false" />,
}

// ── DOM MIRROR ────────────────────────────────────────────────────────────
// RewardItemCard renders a raw HeroUI `Card` (= the anatomy ROOT node) that
// CONTAINS two plain layout rows: a HEADER row (IconTile + a text column) and a
// FOOTER row (StatusChip + Button). Those rows are plain layout `<div>`s — no
// component, no tier — so their grouping lives in the ROLE text, not as nodes; DOM
// order preserves adjacency (same convention as PricingCard/CourseProgressRow).
// The header's title↔mô tả stack is ONE `TitledText` primitive (was 2 hand-rolled
// spans — §9 fix) → ONE node (primitive = leaf: its internal Typography are
// TitledText's own anatomy, drill into TitledText's story), same as IconTile ·
// StatusChip · Button (the `Primitives/*` atoms this card composes).
//
// Shared by every content leaf (data · không đủ Coin · đang đổi · lưới · tiêu đề
// dài): same Card frame, only prop-driven state differs.
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "khung icon vuông tinted (size sm, tone accent) — đầu header row" },
    { name: "TitledText", tier: "primitive", role: "cụm tên (body-sm semibold, truncate) + mô tả (body-xs muted) — hiện prop title/description trong 1 primitive" },
    { name: "StatusChip", tier: "primitive", role: "chip giá Coin (tone accent, soft) — đầu footer row" },
    { name: "Button", tier: "primitive", role: "CTA đổi thưởng (variant primary, size sm) — isDisabled khi không đủ Coin/đang đổi, isPending khi đang đổi — cuối footer row" },
]

// Khung chờ leaf: Skeleton mirror đúng khung Card này (§6/§8: skeleton là PROP).
// Cùng 2 hàng layout: header (ô icon + TitledText isSkeleton) · footer (vệt chip + vệt nút).
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton · ô icon", tier: "primitive", role: "ô vuông 48px (size-12 rounded-xl) mirror IconTile — đầu header row", state: "skeleton" },
    { name: "TitledText", tier: "primitive", role: "TitledText isSkeleton mirror cụm tiêu đề + mô tả (2 vệt chữ) — cùng primitive khi tải", state: "skeleton" },
    { name: "Skeleton.Chip", tier: "primitive", role: "vệt chip giá mirror StatusChip — đầu footer row", state: "skeleton" },
    { name: "Skeleton.Button", tier: "primitive", role: "vệt CTA (width w-20) mirror Button — cuối footer row", state: "skeleton" },
]

/** Default — affordable reward, ready to redeem. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RewardItemCard"
                tier="design"
                leaf="Có dữ liệu"
                parts={CONTENT_PARTS}
                reason="Một ô trong catalog Coin shop gom IconTile (nhận diện thưởng) + tiêu đề/mô tả + StatusChip (giá) + Button (đổi) trong một khung Card tự-đủ, để RewardCatalog chỉ truyền data + onRedeem — không tự dựng lại icon/chip/nút. Khi tải: Skeleton mirror đúng khung Card này."
            >
                <div className="w-72">
                    <RewardItemCard
                        showAnatomy
                        icon={ICONS.streakFreeze}
                        title="Streak Freeze"
                        description="Bảo toàn chuỗi ngày học nếu lỡ một ngày."
                        cost={150}
                        onRedeem={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** CannotAfford — `disabled`: viewer's Coin balance is below the cost, CTA locks + swaps label. */
export const CannotAfford: Story = {
    name: "Không đủ Coin",
    render: () =>
        shell(
            <BlockAnatomy
                name="RewardItemCard"
                tier="design"
                leaf="Không đủ Coin"
                parts={CONTENT_PARTS}
                note="Cùng composition với leaf 'Có dữ liệu'; Button khoá (isDisabled) + đổi nhãn sang 'Không đủ Coin'."
            >
                <div className="w-72">
                    <RewardItemCard
                        showAnatomy
                        icon={ICONS.aiCreditBoost}
                        title="AI Credit Boost"
                        description="Cộng thêm lượt chấm bài AI trong tuần."
                        cost={500}
                        disabled
                        onRedeem={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Redeeming — `isRedeeming`: this reward's redeem is in flight (CTA spinner, press locked). */
export const Redeeming: Story = {
    name: "Đang đổi",
    render: () =>
        shell(
            <BlockAnatomy
                name="RewardItemCard"
                tier="design"
                leaf="Đang đổi"
                parts={CONTENT_PARTS}
                note="Cùng composition; Button hiện spinner (isPending) và khoá bấm khi redeem đang bay."
            >
                <div className="w-72">
                    <RewardItemCard
                        showAnatomy
                        icon={ICONS.tshirt}
                        title="Áo thun StarCi"
                        description="Áo thun cotton in logo StarCi Academy, giao tận nhà."
                        cost={2000}
                        isRedeeming
                        onRedeem={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Grid — a few items side by side, mirroring the catalog's `@app-sm:grid-cols-2` layout. */
export const Grid: Story = {
    name: "Lưới catalog",
    render: () =>
        shell(
            <BlockAnatomy
                name="RewardItemCard"
                tier="design"
                leaf="Lưới catalog"
                parts={CONTENT_PARTS}
                note="Cùng composition, lặp ×N theo lưới @app-sm:grid-cols-2 của RewardCatalog."
            >
                <div className="grid w-full max-w-3xl grid-cols-1 gap-3 @app-sm:grid-cols-2">
                    <RewardItemCard
                        showAnatomy
                        icon={ICONS.streakFreeze}
                        title="Streak Freeze"
                        description="Bảo toàn chuỗi ngày học nếu lỡ một ngày."
                        cost={150}
                        onRedeem={() => {}}
                    />
                    <RewardItemCard
                        showAnatomy
                        icon={ICONS.aiCreditBoost}
                        title="AI Credit Boost"
                        description="Cộng thêm lượt chấm bài AI trong tuần."
                        cost={500}
                        disabled
                        onRedeem={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** LongTitle — title overflows the card width and clips via `truncate` (single line, ellipsis) instead of wrapping. */
export const LongTitle: Story = {
    name: "Tiêu đề dài (truncate)",
    render: () =>
        shell(
            <BlockAnatomy
                name="RewardItemCard"
                tier="design"
                leaf="Tiêu đề dài"
                parts={CONTENT_PARTS}
                note="Cùng composition; tiêu đề dài bị cắt truncate 1 dòng (ellipsis) thay vì xuống dòng."
            >
                <div className="w-72">
                    <RewardItemCard
                        showAnatomy
                        icon={ICONS.tshirt}
                        title="Áo thun StarCi Academy phiên bản giới hạn kỷ niệm 5 năm thành lập"
                        description="Áo thun cotton in logo StarCi Academy, giao tận nhà."
                        cost={2000}
                        onRedeem={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Skeleton — `isSkeleton` mirrors the exact Card frame while the catalog loads. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        shell(
            <BlockAnatomy
                name="RewardItemCard"
                tier="design"
                leaf="Khung chờ"
                parts={SKELETON_PARTS}
                note="isSkeleton → Skeleton mirror đúng khung Card (icon · 2 dòng chữ · chip · nút), không phần thật nào — giữ lưới catalog khỏi nhảy khi tải."
            >
                <div className="grid w-full max-w-3xl grid-cols-1 gap-3 @app-sm:grid-cols-2">
                    <RewardItemCard showAnatomy isSkeleton icon={null} title="" description="" cost={0} onRedeem={() => {}} />
                    <RewardItemCard showAnatomy isSkeleton icon={null} title="" description="" cost={0} onRedeem={() => {}} />
                </div>
            </BlockAnatomy>,
        ),
}
