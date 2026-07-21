import type { Meta, StoryObj } from "@storybook/nextjs"
import { DragScrollArea } from "@/components/blocks/layout/DragScrollArea"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof DragScrollArea> = {
    title: "Blocks/Layout/DragScrollArea",
    component: DragScrollArea,
}
export default meta
type Story = StoryObj<typeof DragScrollArea>

const shortLessons = [
    "Buổi 1: Giới thiệu NestJS",
    "Buổi 2: Modules & Providers",
    "Buổi 3: Dependency Injection",
]

const longLessons = [
    "Buổi 1: Giới thiệu NestJS",
    "Buổi 2: Modules & Providers",
    "Buổi 3: Dependency Injection",
    "Buổi 4: Controllers & Routing",
    "Buổi 5: Pipes & Validation",
    "Buổi 6: Guards & Interceptors",
    "Buổi 7: TypeORM cơ bản",
    "Buổi 8: Quan hệ bảng & Migration",
    "Buổi 9: GraphQL Resolver",
    "Buổi 10: Xác thực Keycloak",
    "Buổi 11: Kafka & Debezium CDC",
    "Buổi 12: Triển khai lên VPS",
]

const LessonList = ({ lessons }: { lessons: Array<string> }) => (
    <SurfaceListCard>
        {lessons.map((lesson, index) => (
            <SurfaceListCardRow key={lesson} title={lesson} subtitle={`Bài giảng #${index + 1}`} />
        ))}
    </SurfaceListCard>
)

/**
 * Toàn bộ ma trận trạng thái của DragScrollArea: nội dung tràn cần kéo để xem hết
 * (ẩn scrollbar, mặc định), nội dung ngắn không tràn (không có fade), hiện lại
 * scrollbar gốc (`hideScrollBar={false}`), và tuỳ chỉnh kích thước fade cạnh
 * (`size`) — bốn trạng thái duy nhất mà props thật của block hỗ trợ.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Bọc quanh danh sách buổi học/khóa học dài hơn khung hiển thị khi muốn ẩn scrollbar nhưng vẫn cho kéo bằng con trỏ (Windows không có trackpad mượt) — đặt `max-h-*` qua `className` để có chiều cao cố định. Nội dung ngắn không tràn thì fade tự tắt. `hideScrollBar={false}` khi muốn giữ thanh cuộn gốc để người dùng biết còn bao nhiêu nội dung. `size` chỉnh độ rộng vùng fade ở hai cạnh trên/dưới.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Tràn nội dung — ẩn scrollbar (mặc định)"
                hint="Danh sách 12 buổi học cao hơn khung max-h-64: kéo bằng con trỏ hoặc lăn chuột để xem hết, fade mờ ở cạnh trên/dưới báo còn nội dung."
            >
                <DragScrollArea className="max-h-64">
                    <LessonList lessons={longLessons} />
                </DragScrollArea>
            </Variant>
            <Variant
                label="Nội dung ngắn — không tràn"
                hint="Chỉ 3 buổi học, thấp hơn khung max-h-64 nên không cần cuộn — không có fade vì ScrollShadow tự tắt khi nội dung vừa khung."
            >
                <DragScrollArea className="max-h-64">
                    <LessonList lessons={shortLessons} />
                </DragScrollArea>
            </Variant>
            <Variant
                label="Hiện lại scrollbar gốc"
                hint="`hideScrollBar={false}` khi cần scrollbar làm mốc trực quan còn bao nhiêu nội dung, ví dụ khu vực quản trị nhiều dữ liệu."
            >
                <DragScrollArea className="max-h-64" hideScrollBar={false}>
                    <LessonList lessons={longLessons} />
                </DragScrollArea>
            </Variant>
            <Variant
                label="Tuỳ chỉnh vùng fade lớn hơn"
                hint="`size={80}` cho vùng fade rộng hơn mặc định (40px) — dùng khi khung cuộn cao và muốn dấu hiệu tràn nội dung rõ hơn."
            >
                <DragScrollArea className="max-h-64" size={80}>
                    <LessonList lessons={longLessons} />
                </DragScrollArea>
            </Variant>
        </Gallery>
    ),
}
