import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserAvatar } from "./UserAvatar"

const meta: Meta<typeof UserAvatar> = {
    title: "Primitives/Identity/UserAvatar",
    component: UserAvatar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof UserAvatar>

// Stable local data-URI "photo" so the uploaded-image path renders without an external host.
const PHOTO =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%234F46E5'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E"

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <UserAvatar username="Ben Turner" seed="tranbinh@example.com" />
        </div>
    ),
}

export const UploadedImage: Story = {
    render: () => (
        <div className="p-8">
            <UserAvatar username="Sophia Chen" avatar={PHOTO} />
        </div>
    ),
}

export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex items-center gap-4">
                <UserAvatar username="Anna" seed="an@example.com" size="sm" />
                <UserAvatar username="Ben" seed="binh@example.com" size="md" />
                <UserAvatar username="Chris" seed="cuong@example.com" size="lg" />
            </div>
        </div>
    ),
}
