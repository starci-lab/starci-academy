import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LightningIcon,
    SnowflakeIcon,
    TShirtIcon,
} from "@phosphor-icons/react"
import { RewardItemCard } from "./RewardItemCard"
import { blockShell } from "../../../block-anatomy"

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

// Anatomy = KIỂM KÊ ĐẦY ĐỦ: mọi part block dựng nên, tag tier (block/primitive).
const ANATOMY = {
    primitives: [
        { name: "IconTile", tier: "block" as const, role: "khung icon vuông tinted (tone accent, size sm)" },
        { name: "Typography (raw span)", tier: "primitive" as const, role: "tiêu đề (semibold, truncate) + mô tả (muted)" },
        { name: "StatusChip", tier: "block" as const, role: "chip giá Coin (tone accent, soft)" },
        { name: "Button", tier: "block" as const, role: "CTA đổi thưởng — disabled khi không đủ Coin, isPending khi đang đổi" },
        { name: "Skeleton", tier: "primitive" as const, state: "isSkeleton", role: "mirror đúng khung Card khi catalog đang tải" },
    ],
    reason:
        "Một ô trong catalog Coin shop gom IconTile (nhận diện thưởng) + tiêu đề/mô tả + StatusChip (giá) + Button (đổi) trong một khung Card tự-đủ, để RewardCatalog chỉ truyền data + onRedeem — không tự dựng lại icon/chip/nút.",
}

const ICONS = {
    streakFreeze: <SnowflakeIcon aria-hidden focusable="false" />,
    aiCreditBoost: <LightningIcon aria-hidden focusable="false" />,
    tshirt: <TShirtIcon aria-hidden focusable="false" />,
}

/** Default — affordable reward, ready to redeem. */
export const Default: Story = {
    render: () =>
        blockShell(
            <div className="w-72">
                <RewardItemCard
                    icon={ICONS.streakFreeze}
                    title="Streak Freeze"
                    description="Bảo toàn chuỗi ngày học nếu lỡ một ngày."
                    cost={150}
                    onRedeem={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** CannotAfford — `disabled`: viewer's Coin balance is below the cost, CTA locks + swaps label. */
export const CannotAfford: Story = {
    name: "Không đủ Coin",
    render: () =>
        blockShell(
            <div className="w-72">
                <RewardItemCard
                    icon={ICONS.aiCreditBoost}
                    title="AI Credit Boost"
                    description="Cộng thêm lượt chấm bài AI trong tuần."
                    cost={500}
                    disabled
                    onRedeem={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Redeeming — `isRedeeming`: this reward's redeem is in flight (CTA spinner, press locked). */
export const Redeeming: Story = {
    name: "Đang đổi",
    render: () =>
        blockShell(
            <div className="w-72">
                <RewardItemCard
                    icon={ICONS.tshirt}
                    title="Áo thun StarCi"
                    description="Áo thun cotton in logo StarCi Academy, giao tận nhà."
                    cost={2000}
                    isRedeeming
                    onRedeem={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Grid — a few items side by side, mirroring the catalog's `@app-sm:grid-cols-2` layout. */
export const Grid: Story = {
    render: () =>
        blockShell(
            <div className="grid w-full max-w-3xl grid-cols-1 gap-3 @app-sm:grid-cols-2">
                <RewardItemCard
                    icon={ICONS.streakFreeze}
                    title="Streak Freeze"
                    description="Bảo toàn chuỗi ngày học nếu lỡ một ngày."
                    cost={150}
                    onRedeem={() => {}}
                />
                <RewardItemCard
                    icon={ICONS.aiCreditBoost}
                    title="AI Credit Boost"
                    description="Cộng thêm lượt chấm bài AI trong tuần."
                    cost={500}
                    disabled
                    onRedeem={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** LongTitle — title overflows the card width and clips via `truncate` (single line, ellipsis) instead of wrapping. */
export const LongTitle: Story = {
    name: "Tiêu đề dài (truncate)",
    render: () =>
        blockShell(
            <div className="w-72">
                <RewardItemCard
                    icon={ICONS.tshirt}
                    title="Áo thun StarCi Academy phiên bản giới hạn kỷ niệm 5 năm thành lập"
                    description="Áo thun cotton in logo StarCi Academy, giao tận nhà."
                    cost={2000}
                    onRedeem={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Skeleton — `isSkeleton` mirrors the exact Card frame while the catalog loads. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        blockShell(
            <div className="grid w-full max-w-3xl grid-cols-1 gap-3 @app-sm:grid-cols-2">
                <RewardItemCard isSkeleton icon={null} title="" description="" cost={0} onRedeem={() => {}} />
                <RewardItemCard isSkeleton icon={null} title="" description="" cost={0} onRedeem={() => {}} />
            </div>,
            ANATOMY,
        ),
}
