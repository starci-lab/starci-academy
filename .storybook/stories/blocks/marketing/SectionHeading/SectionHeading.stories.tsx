import type { Meta, StoryObj } from "@storybook/nextjs"
import { SectionHeading } from "@/components/blocks/marketing/SectionHeading"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SectionHeading> = {
    title: "Blocks/Media/SectionHeading",
    component: SectionHeading,
}
export default meta
type Story = StoryObj<typeof SectionHeading>

/**
 * Toàn bộ biến thể của SectionHeading: căn giữa mặc định, căn trái theo layout
 * cột nội dung/sidebar, kèm anchor "#" để liên kết trực tiếp bằng URL, và bản
 * tối giản chỉ có title. Dùng để tra khi nào chọn align/anchorId, và khi nào
 * bỏ eyebrow/intro cho gọn.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định (căn giữa)"
                hint="Dùng cho section marketing tiêu chuẩn — eyebrow + title đậm + một dòng mô tả, căn giữa."
            >
                <SectionHeading
                    eyebrow="Real learning"
                    title="A learning path designed for working professionals"
                    intro="From fundamentals to hands-on projects, every course is tied to a tangible product you can hold."
                />
            </Variant>
            <Variant
                label="Căn trái"
                hint="Dùng khi heading cần khớp layout cột nội dung hoặc sidebar — căn trái thay vì căn giữa mặc định."
            >
                <SectionHeading
                    align="start"
                    title="Frequently asked questions"
                    intro="The most common questions before you enroll in a course."
                />
            </Variant>
            <Variant
                label="Có anchor URL"
                hint={"Dùng khi section cần được liên kết trực tiếp bằng URL (từ mục lục hoặc menu điều hướng) — hiện dấu \"#\" cạnh title để copy link."}
            >
                <SectionHeading
                    title="Tuition and offers"
                    intro="See the full details of tuition plans, installment options, and current offers."
                    anchorId="hoc-phi"
                />
            </Variant>
            <Variant
                label="Chỉ có title"
                hint="Dùng bản tối giản (bỏ eyebrow và intro) khi title đã đủ rõ — tránh lặp nội dung trong một section ngắn."
            >
                <SectionHeading title="Training partners" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ biến thể của SectionHeading: căn giữa mặc định, căn trái theo layout cột nội dung/sidebar, " +
            "kèm anchor \"#\" để liên kết trực tiếp bằng URL, và bản tối giản chỉ có title. Dùng để tra khi nào " +
            "chọn align/anchorId, và khi nào bỏ eyebrow/intro cho gọn.",
    },
}
