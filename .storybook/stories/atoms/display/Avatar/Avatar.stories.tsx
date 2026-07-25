import type { Meta, StoryObj } from "@storybook/nextjs"
import { Person } from "@gravity-ui/icons"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Avatar.Base> = {
    title: "Atoms/Display/Avatar/Avatar.Base",
    component: Avatar.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Avatar.Base>

// A deterministic demo image (DiceBear) — same seed → same face; no external asset needed.
const DEMO_SRC = "https://api.dicebear.com/9.x/thumbs/svg?seed=Mai"

// LEAF = composition (theo prop). Mỗi leaf render 1 avatar + đúng parts của nó.
const IMAGE_PARTS: Array<AnatomyNode> = [
    { name: "Image", tier: "atom", role: "ảnh thật (HeroUI AvatarImage) — prop `src`" },
]
const INITIALS_PARTS: Array<AnatomyNode> = [
    { name: "Fallback", tier: "atom", role: "initials 2 chữ từ `name` khi KHÔNG có ảnh" },
]
const ICON_PARTS: Array<AnatomyNode> = [
    { name: "Fallback", tier: "atom", role: "glyph (`icon` component) khi không ảnh & không name" },
]
const STATUS_PARTS: Array<AnatomyNode> = [
    { name: "Image", tier: "atom", role: "ảnh thật (HeroUI AvatarImage)" },
    { name: "Status", tier: "atom", role: "chấm hiện diện góc dưới-phải — tone theo `status`" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (circle shimmer)" },
]

/** Image — ảnh thật load qua `src`; fallback ẩn phía sau. */
export const Image: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Image"
                parts={IMAGE_PARTS}
                reason="Atom avatar DUY NHẤT bọc HeroUI Avatar; ảnh/initials/icon/status phân bằng prop → leaf = composition."
                code={"<Avatar.Base src=\"…\" name=\"Mai Chi\" />"}
            >
                <Avatar.Base src={DEMO_SRC} name="Mai Chi" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Initials — không `src` → 2 chữ cái đầu của `name`. */
export const Initials: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Initials"
                parts={INITIALS_PARTS}
                note="Không src → atom lấy 2 chữ đầu `name` (chuỗi fallback: ảnh → initials → icon)."
                code={"<Avatar.Base name=\"Mai Chi\" color=\"accent\" />"}
            >
                <Avatar.Base name="Mai Chi" color="accent" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Fallback — không src & không name → glyph (`icon` = component). */
export const Fallback: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Fallback"
                parts={ICON_PARTS}
                note="`icon` truyền COMPONENT (`Person`) — atom render trong Fallback, tự ép size."
                code={"<Avatar.Base icon={Person} />"}
            >
                <Avatar.Base icon={Person} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** WithStatus — chấm hiện diện góc dưới-phải (tone theo status). */
export const WithStatus: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="WithStatus"
                parts={STATUS_PARTS}
                note="status='online' → chấm success; offline=default · busy=danger · away=warning."
                code={"<Avatar.Base src=\"…\" name=\"Mai\" status=\"online\" />"}
            >
                <Avatar.Base src={DEMO_SRC} name="Mai" status="online" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Sizes — sm · md · lg (atom tự ép kích thước). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Sizes"
                parts={INITIALS_PARTS}
                note="3 bậc size sm/md/lg — atom sở hữu scale (§4), consumer không tự đặt px."
                code={"<Avatar.Base name=\"Mai\" size=\"sm|md|lg\" />"}
            >
                <div className="flex items-end gap-4">
                    <Avatar.Base name="Mai" size="sm" color="accent" showAnatomy />
                    <Avatar.Base name="Mai" size="md" color="accent" showAnatomy />
                    <Avatar.Base name="Mai" size="lg" color="accent" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (circle); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → circle shimmer OWNED bởi atom (hybrid C), khớp size box."
                code={"<Avatar.Base isSkeleton />"}
            >
                <Avatar.Base isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
