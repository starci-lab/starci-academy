import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ImageDropzone } from "@/components/blocks/identity/ImageDropzone"

const meta: Meta<typeof ImageDropzone> = {
    title: "Core/Identity/ImageDropzone",
    component: ImageDropzone,
}
export default meta
type Story = StoryObj<typeof ImageDropzone>

/** Use when the upload is an IMAGE and the user needs to see the picked image immediately — rather than the generic `Dropzone` (any file, wired into React Hook Form). To change an avatar in place without a separate drop area, use `AvatarUploadButton`. */
export const Default: Story = {
    parameters: { usage: "Use when the upload is an IMAGE and the user needs to see the picked image immediately — rather than the generic `Dropzone` (any file, wired into React Hook Form). To change an avatar in place without a separate drop area, use `AvatarUploadButton`." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With format hint</Label>
                <Typography type="body-sm" color="muted">
                    Pass hint when the backend has real constraints on format or size. Saying it up front here
                    is cheaper than letting the user finish picking only to hit an error.
                </Typography>
            </div>
            <ImageDropzone
                onFile={() => {}}
                label="Drag and drop an image here, or click to choose"
                hint="PNG, JPG, WEBP, GIF · up to 5 MB"
            />
        </div>
    ),
}

/** Drop `hint` when there's no constraint worth stating up front — the drop area shrinks to a single label line. */
export const WithoutHint: Story = {
    parameters: { usage: "Drop `hint` when there's no constraint worth stating up front — the drop area shrinks to a single label line." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No hint</Label>
                <Typography type="body-sm" color="muted">
                    Drop the hint when every common image format is accepted and there's no meaningful size
                    cap. Don't drop it just to look tidy — hiding a real constraint means the user hits an
                    error after picking.
                </Typography>
            </div>
            <ImageDropzone onFile={() => {}} label="Click to choose an image" />
        </div>
    ),
}
