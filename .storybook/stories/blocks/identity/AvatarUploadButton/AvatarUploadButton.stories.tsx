import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AvatarUploadButton } from "@/components/blocks/identity/AvatarUploadButton"

const meta: Meta<typeof AvatarUploadButton> = {
    title: "Block/Identity/AvatarUploadButton",
    component: AvatarUploadButton,
}
export default meta
type Story = StoryObj<typeof AvatarUploadButton>

/** Use when the avatar itself is the button for changing the photo — rather than `UserAvatar` (display only, not editable) or `ImageDropzone` (a separate drop area for any image, not anchored to one person's identity). Place it in a profile form, where the user is editing themselves. */
export const Default: Story = {
    parameters: { usage: "Use when the avatar itself is the button for changing the photo — rather than `UserAvatar` (display only, not editable) or `ImageDropzone` (a separate drop area for any image, not anchored to one person's identity). Place it in a profile form, where the user is editing themselves." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Has a photo</Label>
                <Typography type="body-sm" color="muted">
                    The state when the profile already has a saved photo: the label names what happens on
                    press, so write it as change, not upload.
                </Typography>
            </div>
            <AvatarUploadButton
                avatar="https://i.pravatar.cc/150?img=12"
                displayName="Ethan Carter"
                seed="ethan.carter@example.com"
                label="Change profile photo"
                onPress={() => {}}
            />
        </div>
    ),
}

/** The two fallbacks when no photo has been uploaded, depending on whether identity remains to generate an avatar. */
export const NoAvatar: Story = {
    parameters: { usage: "The two fallbacks when no photo has been uploaded, depending on whether identity remains to generate an avatar." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Has name and seed</Label>
                    <Typography type="body-sm" color="muted">
                        The common fallback: no photo uploaded yet, but the user has registered so a name and
                        email remain to generate a stable avatar. Always pass seed alongside displayName —
                        without seed, every render produces a different face.
                    </Typography>
                </div>
                <AvatarUploadButton
                    avatar={null}
                    displayName="Olivia Bennett"
                    seed="olivia.bennett@example.com"
                    label="Upload profile photo"
                    onPress={() => {}}
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Empty identity</Label>
                    <Typography type="body-sm" color="muted">
                        The last fallback: no photo, no name, no seed falls back to the default face. This
                        happens with a freshly created, still-empty profile — the label should be add, since
                        there has never been anything to change.
                    </Typography>
                </div>
                <AvatarUploadButton
                    avatar={null}
                    displayName={null}
                    seed={null}
                    label="Add profile photo"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}
