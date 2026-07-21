import type { Meta, StoryObj } from "@storybook/nextjs"
import { Legend } from "@/components/blocks/stats/Legend"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof Legend> = {
    title: "Blocks/Stats/Legend",
    component: Legend,
}
export default meta
type Story = StoryObj<typeof Legend>

/**
 * Toàn bộ ma trận trạng thái của Legend: vài mục cơ bản, nhiều mục cần wrap khi
 * block hẹp, và label dài để xác nhận chấm màu không co lại theo text. Dùng để
 * tra khi nào legend cần bọc trong khối hẹp và khi nào chấm màu phải giữ kích
 * thước cố định.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Legend cơ bản"
                hint="Dùng khi cần chú giải một vài mức độ cạnh một dải màu phân đoạn — chấm màu + nhãn nằm gọn trên một hàng."
            >
                <Legend
                    items={[
                        { key: "easy", label: "Easy", color: "var(--success)" },
                        { key: "medium", label: "Medium", color: "var(--warning)" },
                        { key: "hard", label: "Hard", color: "var(--danger)" },
                    ]}
                />
            </Variant>
            <Variant
                label="Nhiều mục (tràn xuống dòng)"
                hint="Khi legend cần hiện nhiều nhóm cùng lúc trong một block hẹp, các mục tự xuống dòng mới thay vì tràn ra ngoài block."
            >
                <div className="max-w-[220px]">
                    <Legend
                        items={[
                            { key: "javascript", label: "JavaScript", color: "var(--warning)" },
                            { key: "typescript", label: "TypeScript", color: "var(--accent)" },
                            { key: "python", label: "Python", color: "var(--success)" },
                            { key: "go", label: "Go", color: "var(--heat-3)" },
                            { key: "java", label: "Java", color: "var(--danger)" },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Nhãn dài"
                hint="Khi nhãn dài hơn bình thường, chấm màu vẫn giữ kích thước cố định, không co lại theo chiều dài của text."
            >
                <div className="max-w-[260px]">
                    <Legend
                        items={[
                            { key: "senior", label: "Senior/Staff — architecture-level system design questions", color: "var(--accent)" },
                            { key: "junior", label: "Junior — fundamental basics questions", color: "var(--success)" },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của Legend: vài mục cơ bản, nhiều mục cần wrap khi block hẹp, " +
            "và nhãn dài để xác nhận chấm màu không co lại theo text. Dùng khi cần tra kích thước block " +
            "phù hợp cho legend và xác nhận hành vi wrap/giữ chấm màu cố định.",
    },
}
