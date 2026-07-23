import type { Meta, StoryObj } from "@storybook/nextjs"
import { PersonaIdentityChip } from "./PersonaIdentityChip"

const meta: Meta<typeof PersonaIdentityChip> = {
    title: "Design/Learn/PersonaIdentityChip",
    component: PersonaIdentityChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PersonaIdentityChip>

/** Default: generated fallback avatar (no `avatarUrl`), seeded by name. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="starci@example.com" />
        </div>
    ),
}

/** An authored/uploaded avatar photo renders directly (mirrors the interviewer's real face photo). */
export const WithAvatarUrl: Story = {
    render: () => (
        <div className="p-8">
            <PersonaIdentityChip
                name="StarCi"
                role="Solution Architect"
                avatarUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%234F46E5'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E"
            />
        </div>
    ),
}

/** Long name/role truncate to one line instead of wrapping/overflowing the row. */
export const LongNameTruncates: Story = {
    render: () => (
        <div className="max-w-52 p-8">
            <PersonaIdentityChip
                name="Nguyễn Văn Rất Là Dài Tên"
                role="Senior Staff Solution Architect & Interview Lead"
                avatarSeed="long-name@example.com"
            />
        </div>
    ),
}

/** All three sizes side by side — `sm`/`md` avatars pair with a `body-sm` name, `lg` steps the name up to `body`. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="sm@example.com" size="sm" />
            <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="md@example.com" size="md" />
            <PersonaIdentityChip name="StarCi" role="Solution Architect" avatarSeed="lg@example.com" size="lg" />
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the avatar dot + two label bars, sized to match. */
export const Loading: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <PersonaIdentityChip name="StarCi" role="Solution Architect" isSkeleton size="sm" />
            <PersonaIdentityChip name="StarCi" role="Solution Architect" isSkeleton size="md" />
            <PersonaIdentityChip name="StarCi" role="Solution Architect" isSkeleton size="lg" />
        </div>
    ),
}
