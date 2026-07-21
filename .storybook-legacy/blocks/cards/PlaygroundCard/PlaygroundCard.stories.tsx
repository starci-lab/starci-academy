import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundCard } from "@/components/blocks/cards/PlaygroundCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PlaygroundCard> = {
    title: "Legacy/Blocks/Card/PlaygroundCard",
    component: PlaygroundCard,
}

export default meta

type Story = StoryObj<typeof PlaygroundCard>

/**
 * Toàn bộ trạng thái của PlaygroundCard trong một gallery: số bước bình thường,
 * chỉ 1 bước (số ít), số bước lớn, và tiêu đề dài để kiểm tra truncate. Đây là
 * ô thẻ trong lưới hub Playground (Docker/Kubernetes) — không có state
 * loading/empty/error/disabled/selected riêng vì block chỉ hiển thị dữ liệu
 * tĩnh (title + số bước) cộng một CTA "Vào playground", không tự fetch hay
 * giữ selection.
 */
export const AllVariants: Story = {
    args: {
        title: "Triển khai container Nginx đầu tiên",
        stepCount: 5,
        onOpen: () => {},
    },
    parameters: {
        usage:
            "Dùng để rà toàn bộ trạng thái của PlaygroundCard cùng lúc: số bước bình " +
            "thường, chỉ 1 bước, số bước lớn, và tiêu đề dài để kiểm tra truncate. Đây " +
            "là ô thẻ trong lưới hub Playground — không có state loading/empty/error/" +
            "disabled riêng vì block chỉ hiển thị dữ liệu tĩnh cộng một CTA, không tự " +
            "fetch hay giữ selection.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Số bước bình thường"
                hint="Trường hợp phổ biến nhất trong lưới hub — vài bước hướng dẫn."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Triển khai container Nginx đầu tiên"
                        stepCount={5}
                        onOpen={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Chỉ 1 bước"
                hint="Bài thực hành ngắn, số ít — chuỗi i18n vẫn hiển thị đúng số bước."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Kiểm tra phiên bản Docker"
                        stepCount={1}
                        onOpen={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Số bước lớn"
                hint="Bài thực hành nhiều bước — chip số bước vẫn giữ kích thước cố định, không vỡ layout thẻ."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Dựng cluster Kubernetes nhiều node"
                        stepCount={12}
                        onOpen={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Tiêu đề dài (truncate)"
                hint="Tiêu đề vượt quá chiều rộng ô thẻ phải bị cắt trên một dòng (truncate), không xuống dòng làm lệch chiều cao lưới."
            >
                <div className="w-64">
                    <PlaygroundCard
                        title="Triển khai hệ thống microservices với Docker Compose và Kubernetes trên nhiều môi trường"
                        stepCount={8}
                        onOpen={() => {}}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
