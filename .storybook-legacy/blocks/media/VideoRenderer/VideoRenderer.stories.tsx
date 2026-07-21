import type { Meta, StoryObj } from "@storybook/nextjs"
import { VideoRenderer } from "@/components/blocks/media/VideoRenderer"
import { LessonVideoType } from "@/modules/types/enums/lesson-video-type"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"
import { VideoRendererType } from "@/modules/types/enums/video-renderer-type"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof VideoRenderer> = {
    title: "Legacy/Blocks/Media/VideoRenderer",
    component: VideoRenderer,
}
export default meta
type Story = StoryObj<typeof VideoRenderer>

/**
 * All 3 sub-players VideoRenderer can pick, plus the resolve rules that choose
 * among them (explicit `rendererType` override, `videoType`/`hostPlatform`
 * hints, URL sniffing) and the empty state when `url` is blank.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Đặt trong trang chi tiết bài học để phát video bài giảng — component tự chọn player phù hợp (native video, dashjs, hoặc iframe YouTube) dựa trên URL/videoType/hostPlatform, khỏi phải tự if-else ở nơi gọi.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Standard (mp4)"
                hint="URL trỏ tới file mp4 thường, không khớp YouTube hay .mpd — dùng player `<video>` gốc với control HeroUI tự viết."
            >
                <div className="w-96">
                    <VideoRenderer
                        url="https://storage.starci.org/lessons/intro-nestjs.mp4"
                        title="Giới thiệu NestJS"
                    />
                </div>
            </Variant>
            <Variant
                label="MPEG-DASH (.mpd)"
                hint="URL trỏ tới manifest .mpd, hoặc videoType=MpegDash tường minh — dùng dashjs, phát adaptive bitrate kèm bộ chọn chất lượng."
            >
                <div className="w-96">
                    <VideoRenderer
                        url="https://storage.starci.org/lessons/system-design-scaling.mpd"
                        videoType={LessonVideoType.MpegDash}
                        title="Scaling hệ thống lớn"
                    />
                </div>
            </Variant>
            <Variant
                label="YouTube"
                hint="URL youtube.com/youtu.be, hoặc hostPlatform=Youtube tường minh — luôn thắng các suy luận khác, nhúng iframe với control gốc của YouTube."
            >
                <div className="w-96">
                    <VideoRenderer
                        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        hostPlatform={VideoHostPlatform.Youtube}
                        title="Buổi livestream Q&A khóa Fullstack"
                    />
                </div>
            </Variant>
            <Variant
                label="Ép rendererType tường minh"
                hint="Prop rendererType override toàn bộ suy luận từ URL/videoType/hostPlatform — dùng khi biết chắc player nào cần phát dù URL trông khác."
            >
                <div className="w-96">
                    <VideoRenderer
                        url="https://storage.starci.org/lessons/legacy-video-id-42"
                        rendererType={VideoRendererType.Standard}
                        title="Video legacy ép về Standard player"
                    />
                </div>
            </Variant>
            <Variant
                label="Rỗng — chưa có URL"
                hint="url rỗng hoặc chỉ chứa khoảng trắng — hiện thông báo thay khung video, dùng khi bài học chưa upload video."
            >
                <div className="w-96">
                    <VideoRenderer url="" title="Bài học chưa có video" />
                </div>
            </Variant>
        </Gallery>
    ),
}
