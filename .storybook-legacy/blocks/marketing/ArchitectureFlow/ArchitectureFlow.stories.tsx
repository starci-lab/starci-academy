import type { Meta, StoryObj } from "@storybook/nextjs"

import { ArchitectureFlow } from "@/components/blocks/marketing/ArchitectureFlow"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ArchitectureFlow> = {
    title: "Legacy/Blocks/Marketing/ArchitectureFlow",
    component: ArchitectureFlow,
}

export default meta

type Story = StoryObj<typeof ArchitectureFlow>

/**
 * Toàn bộ state của ArchitectureFlow trong một gallery: rỗng, một node, luồng
 * điển hình, và luồng dài phải wrap trên màn hẹp.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so trực tiếp cách ArchitectureFlow xử lý số lượng node khác nhau, từ rỗng đến luồng dài phải xuống dòng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Khi mảng nodes trống — dùng để kiểm tra block không vỡ layout khi chưa có dữ liệu."
            >
                <ArchitectureFlow nodes={[]} />
            </Variant>
            <Variant
                label="Một node"
                hint="Khi hệ thống chỉ minh hoạ một thành phần duy nhất, không có kết nối caret."
            >
                <ArchitectureFlow nodes={["Client"]} />
            </Variant>
            <Variant
                label="Luồng điển hình"
                hint="Luồng 4 node ngắn — trường hợp phổ biến nhất khi minh hoạ kiến trúc hệ thống thật trên trang landing."
            >
                <ArchitectureFlow nodes={["Client", "API Gateway", "Cache", "PostgreSQL"]} />
            </Variant>
            <Variant
                label="Luồng dài, nhãn dài (wrap)"
                hint="Nhiều node với nhãn dài — kiểm tra flex-wrap khi bề rộng khung hẹp hơn tổng chiều dài luồng."
            >
                <div className="max-w-[360px]">
                    <ArchitectureFlow
                        nodes={[
                            "Client Mobile App",
                            "API Gateway (Kong)",
                            "Redis Cache Cluster",
                            "Kafka Event Bus",
                            "PostgreSQL Primary + Replica",
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
