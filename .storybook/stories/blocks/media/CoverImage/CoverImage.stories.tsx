import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CoverImage } from "@/components/blocks/media/CoverImage"

const meta: Meta<typeof CoverImage> = {
    title: "Blocks/Media/CoverImage",
    component: CoverImage,
}
export default meta
type Story = StoryObj<typeof CoverImage>

/** For a 16:9 cover/thumbnail image of a course, blog post or changelog — the image auto-crops with object-cover to fit the rounded frame. */
export const Default: Story = {
    parameters: { usage: "For a 16:9 cover/thumbnail image of a course, blog post or changelog — the image auto-crops with object-cover to fit the rounded frame." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With image</Label>
                <Typography type="body-sm" color="muted">
                    For a 16:9 cover / thumbnail image (course, blog, changelog) — the image auto-crops with object-cover to fit the rounded frame.
                </Typography>
            </div>
            <div className="w-96">
                <CoverImage src="https://picsum.photos/seed/coverimage/800/450" alt="Course cover image" />
            </div>
        </div>
    ),
}

/** Use when there's no image yet (src null) — the frame keeps the 16:9 ratio with a surface background, avoiding layout shift when the image loads later. */
export const Empty: Story = {
    parameters: { usage: "Use when there's no image yet (src null) — the frame keeps the 16:9 ratio with a surface background, avoiding layout shift when the image loads later." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No image yet</Label>
                <Typography type="body-sm" color="muted">
                    Use when src is null — the frame keeps the 16:9 ratio with a surface background, avoiding layout shift when the image loads later.
                </Typography>
            </div>
            <div className="w-96">
                <CoverImage src={null} alt="No cover image yet" />
            </div>
        </div>
    ),
}
