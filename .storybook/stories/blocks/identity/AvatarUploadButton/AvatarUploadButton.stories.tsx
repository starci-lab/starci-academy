import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarUploadButton } from "./AvatarUploadButton"

const meta: Meta<typeof AvatarUploadButton> = {
    title: "Primitives/Identity/AvatarUploadButton",
    component: AvatarUploadButton,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AvatarUploadButton>

// Stable local data-URI "photo" so the saved-image path renders without an external host.
const PHOTO =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%230EA5E9'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E"

export const HasPhoto: Story = {
    render: () => (
        <div className="p-8">
            <AvatarUploadButton
                avatar={PHOTO}
                displayName="Ethan Carter"
                seed="ethan.carter@example.com"
                label="Change profile photo"
                onPress={() => {}}
            />
        </div>
    ),
}

export const NoPhotoWithIdentity: Story = {
    render: () => (
        <div className="p-8">
            <AvatarUploadButton
                avatar={null}
                displayName="Olivia Bennett"
                seed="olivia.bennett@example.com"
                label="Upload profile photo"
                onPress={() => {}}
            />
        </div>
    ),
}

export const NoIdentity: Story = {
    render: () => (
        <div className="p-8">
            <AvatarUploadButton
                avatar={null}
                displayName={null}
                seed={null}
                label="Add profile photo"
                onPress={() => {}}
            />
        </div>
    ),
}
