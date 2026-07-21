import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@heroui/react"
import { UserCell } from "./UserCell"

const meta: Meta<typeof UserCell> = {
    title: "Primitives/Identity/UserCell",
    component: UserCell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

// Stable local data-URI "photo" so the uploaded-image path renders without an external host.
const PHOTO =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23DB2777'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E"

export const Small: Story = {
    render: () => (
        <div className="p-8">
            <UserCell
                username="levan.dev"
                displayName="Ethan Vaughn"
                avatar={null}
                handle="@levan.dev"
                size="sm"
            />
        </div>
    ),
}

export const Medium: Story = {
    render: () => (
        <div className="p-8">
            <UserCell
                username="levan.dev"
                displayName="Ethan Vaughn"
                avatar={null}
                handle="@levan.dev"
                size="md"
            />
        </div>
    ),
}

export const NoHandle: Story = {
    render: () => (
        <div className="p-8">
            <UserCell
                username="jamesanderson"
                displayName="James Anderson"
                avatar={null}
            />
        </div>
    ),
}

export const RealAvatar: Story = {
    render: () => (
        <div className="p-8">
            <UserCell
                username="sophiachen"
                displayName="Sophia Chen"
                avatar={PHOTO}
                handle="@sophiachen"
            />
        </div>
    ),
}

export const WithTrailing: Story = {
    render: () => (
        <div className="p-8">
            <UserCell
                username="emmafoster"
                displayName="Emma Foster"
                avatar={null}
                handle="@emmafoster"
                trailing={<Chip size="sm" variant="soft" color="warning">Admin</Chip>}
            />
        </div>
    ),
}

export const LongNameNarrow: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-48">
                <UserCell
                    username="very.long.username.for.testing.truncation"
                    displayName="Alexandra Wellington-Fairchild With An Exceptionally Long Display Name For Testing Truncation"
                    avatar={null}
                    handle="@very.long.username.for.testing.truncation.overflow"
                />
            </div>
        </div>
    ),
}
