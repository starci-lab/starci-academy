import type { Meta, StoryObj } from "@storybook/nextjs"
import { VideoRenderer } from "./VideoRenderer"
import { LessonVideoType, VideoHostPlatform, VideoRendererType } from "./enums"

const meta: Meta<typeof VideoRenderer> = {
    title: "Design/Media/VideoRenderer",
    component: VideoRenderer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof VideoRenderer>

// Placeholder media URLs — the frame + control bar render offline; the actual
// stream/iframe only loads with network access (external hosts, CSP-gated).

export const Standard: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <VideoRenderer
                    url="https://storage.starci.org/lessons/intro-nestjs.mp4"
                    title="Giới thiệu NestJS"
                />
            </div>
        </div>
    ),
}

export const MpegDash: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <VideoRenderer
                    url="https://storage.starci.org/lessons/system-design-scaling.mpd"
                    videoType={LessonVideoType.MpegDash}
                    title="Scaling hệ thống lớn"
                />
            </div>
        </div>
    ),
}

export const Youtube: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <VideoRenderer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    hostPlatform={VideoHostPlatform.Youtube}
                    title="Buổi livestream Q&A khóa Fullstack"
                />
            </div>
        </div>
    ),
}

export const ExplicitRendererType: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <VideoRenderer
                    url="https://storage.starci.org/lessons/legacy-video-id-42"
                    rendererType={VideoRendererType.Standard}
                    title="Video legacy ép về Standard player"
                />
            </div>
        </div>
    ),
}

export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <VideoRenderer url="" title="Bài học chưa có video" />
            </div>
        </div>
    ),
}

/** hostPlatform forces the Youtube sub-player, but the URL isn't a parseable
 * YouTube link — `toYoutubeEmbedUrl` returns null and `YoutubePlayer` shows
 * its own "Invalid or unsupported YouTube URL." message (distinct from the
 * top-level "No video URL." empty state above, which only fires on a blank URL). */
export const YoutubeInvalidUrl: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <VideoRenderer
                    url="https://storage.starci.org/lessons/broken-link"
                    hostPlatform={VideoHostPlatform.Youtube}
                    title="Link YouTube bị lỗi"
                />
            </div>
        </div>
    ),
}
