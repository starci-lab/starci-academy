import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonaIdentityChip } from "@sb-components/_legacy/designs/learn/PersonaIdentityChip/PersonaIdentityChip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof PersonaIdentityChip> = {
    title: "Legacy/Design/Learn/PersonaIdentityChip",
    component: PersonaIdentityChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PersonaIdentityChip>

// leaf live (Default/WithAvatarUrl/LongNameTruncates/Sizes): avatar + tên + vai trò —
// cùng composition dù avatar generated/uploaded hay size khác nhau.
const PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "composite", role: "avatar (uploaded→generated fallback theo avatarUrl/avatarSeed)" },
    { name: "Typography", tier: "composite", role: "tên (name, medium)" },
    { name: "Typography", tier: "composite", role: "vai trò (role, muted)" },
]

// leaf Loading: isSkeleton đổi hẳn composition — avatar dot + 2 dòng nhãn skeleton.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "composite", role: "avatar dot placeholder" },
    { name: "Skeleton", tier: "composite", role: "dòng tên (width 1/2)" },
    { name: "Skeleton", tier: "composite", role: "dòng vai trò (width 1/3)" },
]

/** Default: generated fallback avatar (no `avatarUrl`), seeded by name. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="PersonaIdentityChip" tier="design" leaf="Default" parts={PARTS}>
                <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="starci@example.com" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** An authored/uploaded avatar photo renders directly (mirrors the interviewer's real face photo). */
export const WithAvatarUrl: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="PersonaIdentityChip" tier="design" leaf="WithAvatarUrl" parts={PARTS} note="avatarUrl có giá trị — UserAvatar ưu tiên ảnh upload, cùng 3 part với Default.">
                <PersonaIdentityChip
                    name="StarCi"
                    role="Solution Architect"
                    avatarUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%234F46E5'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Long name/role truncate to one line instead of wrapping/overflowing the row. */
export const LongNameTruncates: Story = {
    render: () => (
        <div className="max-w-52 p-8">
            <BlockAnatomy name="PersonaIdentityChip" tier="design" leaf="LongNameTruncates" parts={PARTS} note="tên/vai trò dài trong khung hẹp — cả hai dòng truncate, cùng composition với Default.">
                <PersonaIdentityChip
                    name="Nguyễn Văn Rất Là Dài Tên"
                    role="Senior Staff Solution Architect & Interview Lead"
                    avatarSeed="long-name@example.com"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** All three sizes side by side — `sm`/`md` avatars pair with a `body-sm` name, `lg` steps the name up to `body`. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="PersonaIdentityChip" tier="design" leaf="Sizes" parts={PARTS} note="3 size (sm/md/lg) cùng composition — chỉ đổi avatar box + type scale tên.">
                <div className="flex flex-col gap-6">
                    <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="sm@example.com" size="sm" showAnatomy />
                    <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="md@example.com" size="md" showAnatomy />
                    <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="lg@example.com" size="lg" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the avatar dot + two label bars, sized to match. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="PersonaIdentityChip" tier="design" leaf="Loading" parts={SKELETON_PARTS} note="isSkeleton đổi hẳn composition: avatar dot + 2 dòng nhãn skeleton, không UserAvatar/Typography thật.">
                <div className="flex flex-col gap-6">
                    <PersonaIdentityChip name="StarCi" role="Solution Architect" isSkeleton size="sm" showAnatomy />
                    <PersonaIdentityChip name="StarCi" role="Solution Architect" isSkeleton size="md" showAnatomy />
                    <PersonaIdentityChip name="StarCi" role="Solution Architect" isSkeleton size="lg" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
