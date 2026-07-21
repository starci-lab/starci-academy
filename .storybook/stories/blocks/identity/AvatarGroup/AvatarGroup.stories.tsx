import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarGroup } from "./AvatarGroup"

const meta: Meta<typeof AvatarGroup> = {
    title: "Primitives/Identity/AvatarGroup",
    component: AvatarGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AvatarGroup>

// Stable local data-URI "photo" so uploaded-image avatars render without an external host.
const PHOTO = (hue: number) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='hsl(${hue}%2C60%25%2C55%25)'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E`

const users = [
    { username: "minh.tran", displayName: "Noah Mitchell", avatar: PHOTO(210) },
    { username: "lan.pham", displayName: "Ava Parker", avatar: PHOTO(320) },
    { username: "hoang.le", displayName: "Liam Harper", avatar: null },
    { username: "an.nguyen", displayName: "Emma Nelson", avatar: null },
    { username: "thu.vo", displayName: "Mia Vaughn", avatar: null },
    { username: "khoa.dinh", displayName: "Lucas Dean", avatar: null },
]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <AvatarGroup users={users.slice(0, 3)} />
        </div>
    ),
}

export const OverflowChip: Story = {
    render: () => (
        <div className="p-8">
            <AvatarGroup max={3} users={users} />
        </div>
    ),
}

export const Empty: Story = {
    render: () => (
        <div className="p-8">
            {/* no users → the block renders nothing (no empty-state placeholder of its own). */}
            <AvatarGroup users={[]} />
        </div>
    ),
}
