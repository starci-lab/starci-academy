import type { Meta, StoryObj } from "@storybook/nextjs"
import { HostPlatformChip, VideoHostPlatform } from "./HostPlatformChip"

const meta: Meta<typeof HostPlatformChip> = {
    title: "Primitives/Chips/HostPlatformChip",
    component: HostPlatformChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HostPlatformChip>

/** YouTube: public or unlisted video — the most common case for lecture videos. */
export const YouTube: Story = {
    render: () => (
        <div className="p-8">
            <HostPlatformChip hostPlatform={VideoHostPlatform.Youtube} />
        </div>
    ),
}

/** Google Drive: internal content shared via a Drive link (MP4 or streaming). */
export const GoogleDrive: Story = {
    render: () => (
        <div className="p-8">
            <HostPlatformChip hostPlatform={VideoHostPlatform.GoogleDrive} />
        </div>
    ),
}

/** Vimeo: hosted video with tighter privacy controls than YouTube. */
export const Vimeo: Story = {
    render: () => (
        <div className="p-8">
            <HostPlatformChip hostPlatform={VideoHostPlatform.Vimeo} />
        </div>
    ),
}

/** Cloudflare Stream: self-hosted CDN delivery with adaptive bitrate. */
export const CloudflareStream: Story = {
    render: () => (
        <div className="p-8">
            <HostPlatformChip hostPlatform={VideoHostPlatform.CloudflareStream} />
        </div>
    ),
}

/** Đang tải: skeleton mirror pill (h-6) trong lúc chưa xác định host platform. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <HostPlatformChip hostPlatform={VideoHostPlatform.Youtube} isSkeleton />
        </div>
    ),
}
