import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip } from "@heroui/react"
import { MediaCard } from "./MediaCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof MediaCard> = {
    title: "Primitives/Card/MediaCard",
    component: MediaCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MediaCard>

const metaChips = (
    <>
        <Chip size="sm">Fullstack</Chip>
        <Chip size="sm" variant="soft">Intermediate</Chip>
    </>
)

const DESCRIPTION = "Build a solid foundation from frontend to backend through hands-on projects, graded by AI."

/** With cover — a 16:9 full-bleed image at the top, then title / meta / description / CTA in the padded body. */
export const WithCover: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<img src="https://placehold.co/640x360" alt="Course cover" className="size-full object-cover" />}
                    title="Fullstack Mastery path"
                    meta={metaChips}
                    description={DESCRIPTION}
                    footer={<Button size="sm">View course</Button>}
                />
            </div>
        </div>
    ),
}

/** No cover — omit `cover` and a 16:9 placeholder fills the slot so a grid stays even instead of leaving a hole. */
export const WithoutCover: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    title="Fullstack Mastery path"
                    meta={metaChips}
                    description={DESCRIPTION}
                    footer={<Button size="sm">View course</Button>}
                />
            </div>
        </div>
    ),
}

/** `onPress` — the whole card is a single pressable, keyboard-accessible target (custom handler). */
export const Pressable: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<img src="https://placehold.co/640x360" alt="Course cover" className="size-full object-cover" />}
                    title="Fullstack Mastery path"
                    meta={metaChips}
                    description={DESCRIPTION}
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** `href` — the whole card is one accessible link (navigates on click). */
export const AsLink: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<img src="https://placehold.co/640x360" alt="Course cover" className="size-full object-cover" />}
                    title="Fullstack Mastery path"
                    meta={metaChips}
                    description={DESCRIPTION}
                    href="#"
                />
            </div>
        </div>
    ),
}

/**
 * Loading: MIRROR the real card — keep the `Card` frame + the full-bleed 16:9 cover slot,
 * swap the cover image + body text for `Skeleton` bars sized to match (title body, two-line
 * description, a footer button) so the layout never jumps when the entity resolves.
 */
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <div style={{ width: 320 }}>
                <MediaCard
                    cover={<Skeleton className="aspect-video w-full" />}
                    title={<Skeleton className="h-4 my-2 w-2/3 rounded" />}
                    meta={<Skeleton.Chip />}
                    description={
                        <span className="flex flex-col gap-1">
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-3 w-1/2 rounded" />
                        </span>
                    }
                    footer={<Skeleton.Button />}
                />
            </div>
        </div>
    ),
}
