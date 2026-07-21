import type { Meta, StoryObj } from "@storybook/nextjs"
import { HostPlatformChip } from "@/components/blocks/chips/HostPlatformChip"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof HostPlatformChip> = {
    title: "Blocks/Chip/HostPlatformChip",
    component: HostPlatformChip,
    argTypes: {
        hostPlatform: {
            control: "select",
            options: [
                VideoHostPlatform.Youtube,
                VideoHostPlatform.GoogleDrive,
                VideoHostPlatform.Vimeo,
                VideoHostPlatform.CloudflareStream,
            ],
            description: "Host platform of the lesson video. `Other` is intentionally excluded — EnumChip throws for it (no map entry).",
        },
    },
}
export default meta
type Story = StoryObj<typeof HostPlatformChip>

/**
 * YouTube — public or unlisted video, the most common case for lecture videos.
 */
export const YouTube: Story = {
    args: {
        hostPlatform: VideoHostPlatform.Youtube,
    },
}

/**
 * Google Drive — internal content shared via a Drive link.
 */
export const GoogleDrive: Story = {
    args: {
        hostPlatform: VideoHostPlatform.GoogleDrive,
    },
}

/**
 * Vimeo — video with tighter privacy controls than YouTube.
 */
export const Vimeo: Story = {
    args: {
        hostPlatform: VideoHostPlatform.Vimeo,
    },
}

/**
 * Cloudflare Stream — self-hosted CDN delivery with adaptive bitrate.
 */
export const CloudflareStream: Story = {
    args: {
        hostPlatform: VideoHostPlatform.CloudflareStream,
    },
}

/**
 * All 4 handled host platforms. `VideoHostPlatform.Other` is intentionally
 * omitted — `EnumChip` throws for it (no map entry), matching the old switch
 * `default` throw, so it never reaches this chip in a healthy render.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Đặt cạnh tên bài học trong danh sách video hoặc trang chi tiết bài học, để học viên biết video được phát từ đâu trước khi bấm play — YouTube/Vimeo cho video công khai, Google Drive cho file chia sẻ nội bộ, Cloudflare Stream cho video CDN nội bộ.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="YouTube"
                hint="Video công khai hoặc unlisted, host trên YouTube — trường hợp phổ biến nhất cho bài giảng."
            >
                <HostPlatformChip hostPlatform={VideoHostPlatform.Youtube} />
            </Variant>
            <Variant
                label="Google Drive"
                hint="Video được chia sẻ qua link Google Drive (MP4 hoặc streaming link) — thường dùng cho nội dung nội bộ chưa public."
            >
                <HostPlatformChip hostPlatform={VideoHostPlatform.GoogleDrive} />
            </Variant>
            <Variant
                label="Vimeo"
                hint="Video host trên Vimeo, có kiểm soát quyền riêng tư chặt hơn YouTube — dùng cho bài giảng cần giới hạn người xem."
            >
                <HostPlatformChip hostPlatform={VideoHostPlatform.Vimeo} />
            </Variant>
            <Variant
                label="Cloudflare Stream"
                hint="Video phát qua CDN của Cloudflare Stream (adaptive bitrate) — dùng khi tự lưu trữ và cần tốc độ tải ổn định."
            >
                <HostPlatformChip hostPlatform={VideoHostPlatform.CloudflareStream} />
            </Variant>
        </Gallery>
    ),
}
