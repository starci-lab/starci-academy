import type { Meta, StoryObj } from "@storybook/nextjs"
import { StatRibbon } from "@/components/blocks/stats/StatRibbon"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof StatRibbon> = {
    title: "Legacy/Blocks/Stats/StatRibbon",
    component: StatRibbon,
    // NEW — pending review ("Chờ duyệt")
    tags: ["news"],
}
export default meta
type Story = StoryObj<typeof StatRibbon>

/**
 * Toàn bộ trạng thái của StatRibbon: dải đủ 4 stat và dải rút gọn khi viewer
 * chưa có rank/percentile. Dùng để tra khi nào ribbon còn đủ 4 ô và khi nào
 * chỉ còn 2 ô mà layout (divider + cell đều) vẫn phải lên gọn.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Đủ 4 stat"
                hint="Dải stat đầu trang tab hồ sơ (Challenges / Skills): 4 StatPair — số đã pass, XP, top percentile, rank — trong một card, chia bởi divider dọc full-height trên màn rộng, grid 2 cột trên mobile."
            >
                <StatRibbon
                    items={[
                        { key: "passed", value: 12, label: "Passed" },
                        { key: "xp", value: "1,204", label: "XP" },
                        { key: "top", value: "8%", label: "Top" },
                        { key: "rank", value: "#3", label: "Rank" },
                    ]}
                />
            </Variant>
            <Variant
                label="Chỉ 2 stat (chưa có rank)"
                hint="Viewer chưa pass bài nào nên chưa có rank/percentile — hai ô đó ẩn, ribbon chỉ còn 2 stat đã biết nhưng divider và cell đều vẫn lên layout gọn với 2 item."
            >
                <StatRibbon
                    items={[
                        { key: "passed", value: 0, label: "Passed" },
                        { key: "xp", value: 0, label: "XP" },
                    ]}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của StatRibbon: dải đủ 4 stat (headline stat strip đầu tab hồ sơ) và " +
            "dải rút gọn khi viewer chưa có rank/percentile. Dùng để tra layout ribbon khi số ô thay đổi.",
    },
}
