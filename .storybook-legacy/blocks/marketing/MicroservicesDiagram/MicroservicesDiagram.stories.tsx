import type { Meta, StoryObj } from "@storybook/nextjs"

import { MicroservicesDiagram } from "@/components/blocks/marketing/MicroservicesDiagram"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof MicroservicesDiagram> = {
    title: "Legacy/Blocks/Marketing/MicroservicesDiagram",
    component: MicroservicesDiagram,
}

export default meta

type Story = StoryObj<typeof MicroservicesDiagram>

/**
 * Toàn bộ state của MicroservicesDiagram trong một gallery: có caption, không
 * caption, và khung hẹp để kiểm tra các tier node xuống dòng. Topology + các
 * điểm hỏng (overload/cascade/bottleneck) là dữ liệu minh hoạ cố định trong
 * component, không phải prop, nên gallery này xoay quanh prop `caption` và
 * bề rộng khung chứa.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so cách MicroservicesDiagram hiển thị khi có/không có caption, và khi khung chứa hẹp buộc các tier node phải xuống dòng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Có caption"
                hint="Dùng trên trang landing khi cần một câu chốt bài học ngay dưới sơ đồ, ví dụ giải thích vì sao kiến trúc này sẽ sập."
            >
                <MicroservicesDiagram caption="Một node Postgres, một luồng đồng bộ tới Payment — đây là công thức cho một sự cố dây chuyền." />
            </Variant>
            <Variant
                label="Không có caption"
                hint="Khi sơ đồ chỉ dùng để trang trí phần hero, không cần câu giải thích kèm theo."
            >
                <MicroservicesDiagram />
            </Variant>
            <Variant
                label="Khung hẹp (wrap)"
                hint="Khi khung chứa hẹp hơn bề rộng của tier — các node trong cùng một tier (ví dụ Auth/Order/Payment) phải tự xuống dòng mà không vỡ layout."
            >
                <div className="max-w-[320px]">
                    <MicroservicesDiagram caption="Trên màn hẹp, các node vẫn giữ đúng thứ tự tier dù phải xuống dòng." />
                </div>
            </Variant>
        </Gallery>
    ),
}
