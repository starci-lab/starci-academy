import type { Meta, StoryObj } from "@storybook/nextjs"
import { CodeIcon, StackIcon } from "@phosphor-icons/react"

import { TopicLane } from "@/components/blocks/marketing/TopicLane"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof TopicLane> = {
    title: "Legacy/Blocks/Marketing/TopicLane",
    component: TopicLane,
}

export default meta

type Story = StoryObj<typeof TopicLane>

/**
 * Toàn bộ state của TopicLane trong một gallery: rỗng, một dòng, danh sách
 * điển hình, nhãn dài phải truncate, và dòng tĩnh không có onPress.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng gallery này để so trực tiếp cách TopicLane xử lý số lượng dòng chủ đề khác nhau, từ rỗng đến danh sách dài cần truncate nhãn.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Khi mảng items trống — lane chỉ còn icon và title, dùng để kiểm tra block không vỡ layout khi chưa có dữ liệu."
            >
                <div className="max-w-[320px]">
                    <TopicLane icon={<CodeIcon />} title="Code" items={[]} />
                </div>
            </Variant>
            <Variant
                label="Một dòng"
                hint="Khi lane chỉ minh hoạ một chủ đề duy nhất."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        icon={<CodeIcon />}
                        title="Code"
                        items={[{ label: "React Server Components", tag: "FS", onPress: () => {} }]}
                    />
                </div>
            </Variant>
            <Variant
                label="Danh sách điển hình"
                hint="4 dòng chủ đề ngắn — trường hợp phổ biến nhất trên trang landing, mỗi dòng bấm được để điều hướng."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        icon={<CodeIcon />}
                        title="Code"
                        items={[
                            { label: "React Server Components", tag: "FS", onPress: () => {} },
                            { label: "Thiết kế schema PostgreSQL", tag: "FS", onPress: () => {} },
                            { label: "Circuit breaker pattern", tag: "SD", onPress: () => {} },
                            { label: "Zero-downtime deployment", tag: "DO", onPress: () => {} },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Nhãn dài (truncate)"
                hint="Nhãn dài hơn chiều rộng lane — kiểm tra truncate một dòng, tag bên phải không bị co lại."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        icon={<StackIcon />}
                        title="Infrastructure"
                        items={[
                            {
                                label: "Thiết kế hệ thống chịu lỗi ở quy mô hàng triệu request mỗi giây",
                                tag: "SD",
                                onPress: () => {},
                            },
                            {
                                label: "Triển khai Kubernetes multi-region với zero downtime",
                                tag: "DO",
                                onPress: () => {},
                            },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Dòng tĩnh (không onPress)"
                hint="Khi item không có onPress — dòng vẫn hiển thị bình thường nhưng không điều hướng khi bấm, dùng để tham khảo thông tin thuần."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        icon={<StackIcon />}
                        title="Infrastructure"
                        items={[
                            { label: "Message queue với Kafka", tag: "SD" },
                            { label: "Observability với OpenTelemetry", tag: "DO" },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
