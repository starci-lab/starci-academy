import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Avatar.Group> = {
    title: "Atoms/Display/Avatar/Avatar.Group",
    component: Avatar.Group,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Avatar.Group>

// Stable local data-URI "photo" so image avatars render without an external host.
const PHOTO = (hue: number) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='hsl(${hue}%2C60%25%2C55%25)'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E`

const members = [
    { key: "minh.tran", name: "Noah Mitchell", src: PHOTO(210) },
    { key: "lan.pham", name: "Ava Parker", src: PHOTO(320) },
    { key: "hoang.le", name: "Liam Harper" },
    { key: "an.nguyen", name: "Emma Nelson" },
    { key: "thu.vo", name: "Mia Vaughn" },
    { key: "khoa.dinh", name: "Lucas Dean" },
]

/**
 * STATE THUỘC VỀ AI (§12f): story ở đây chỉ render state do CHÍNH `Avatar.Group`
 * sinh ra — mapping `items`, cắt `max` + chip "+N", `size` cấp cụm, hàng rỗng,
 * skeleton cả cụm. Ảnh/initials/icon/status là state của `Avatar.Base` → KHÔNG lặp.
 */
const DEFAULT_PARTS: Array<AnatomyNode> = [
    { name: "Avatar", tier: "atom", role: "một `Avatar.Base` chồng mép (lặp ×N) — ring-2 ring-background tách lớp" },
]
const OVERFLOW_PARTS: Array<AnatomyNode> = [
    { name: "Avatar", tier: "atom", role: "một `Avatar.Base` chồng mép (lặp ×max)" },
    { name: "Overflow", tier: "atom", role: "chip tròn '+N' đếm phần dư, cùng ring như Avatar" },
]

/** Default — `items` đủ chỗ hiện hết, không có chip "+N"; render đủ 3 bậc size. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Default"
                parts={DEFAULT_PARTS}
                reason="Cụm avatar chồng mép ('who follows') là MEMBER của atom Avatar, không phải khung riêng (§13c) — atom tự dựng từng Avatar.Base từ `items`, consumer không truyền children."
                note="`size` đặt ở CẤP CỤM (§12d): cả hàng luôn đồng cỡ, item KHÔNG mang size riêng. 3 bậc cùng CÂY DOM nên nằm chung một leaf (§14d.2)."
                code={"<Avatar.Group size=\"sm|md|lg\" items={[{ key: \"u1\", name: \"Noah\", src: \"…\" }, …]} />"}
            >
                <div className="flex flex-col gap-4">
                    <Avatar.Group size="sm" items={members.slice(0, 3)} showAnatomy />
                    <Avatar.Group size="md" items={members.slice(0, 3)} showAnatomy />
                    <Avatar.Group size="lg" items={members.slice(0, 3)} showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Overflow — `max` cắt bớt, phần dư gộp thành chip tròn "+N" cuối hàng. */
export const Overflow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Overflow"
                parts={OVERFLOW_PARTS}
                note="max=3 với 6 người → 3 avatar + '+3'. `total` cho phép đếm theo TỔNG thật khi mới tải trang đầu."
                code={"<Avatar.Group max={3} items={/* 6 người */} />"}
            >
                <Avatar.Group max={3} items={members} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Empty — `items=[]` → hàng không render gì (atom không tự vẽ empty-state). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Empty"
                parts={[]}
                note="Chưa có ai → hàng rỗng, KHÔNG placeholder. Câu 'chưa có ai tham gia' là việc của block bao ngoài."
                code={"<Avatar.Group items={[]} />"}
            >
                <Avatar.Group items={[]} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — `isSkeleton` truyền xuống, mỗi slot tự mirror → giữ nguyên footprint (§12c). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Group"
                tier="atom"
                leaf="Loading"
                parts={DEFAULT_PARTS}
                note="Cụm không tự vẽ skeleton riêng: nó chuyển isSkeleton xuống từng Avatar.Base, giữ đúng số slot + độ chồng mép nên layout không nhảy."
                code={"<Avatar.Group isSkeleton items={[…]} />"}
            >
                <Avatar.Group isSkeleton items={members.slice(0, 4)} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
