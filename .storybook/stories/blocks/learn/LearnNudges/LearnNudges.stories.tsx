import type { Meta, StoryObj } from "@storybook/nextjs"
import { LearnNudges, type LearnNudge } from "@sb-components/_blocks/learn/LearnNudges/LearnNudges"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof LearnNudges> = {
    title: "Block/Learn/LearnNudges",
    component: LearnNudges,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnNudges>

const PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCardHeader", tier: "block", role: "dòng dẫn — đi `label` của SurfaceCard (render NGOÀI/trên surface)" },
    { name: "Surface", tier: "block", role: "vỏ surface + danh sách hàng — `SurfaceCard.List`, CÙNG layout với KeepGoingPath", storyId: "layouts-cards-surfacecard-surfacecard-list--leading-meta" },
]

const ITEMS: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Ôn 12 thẻ đến hạn hôm nay", count: 12, onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Luyện phỏng vấn cho capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "Bạn đang hạng #42 tuần này", onPress: () => {} },
]

/**
 * Leaf DUY NHẤT — block không view-switch. Ba loại việc nằm CÙNG một danh sách:
 * chúng là NỘI DUNG của cây, không phải ba cây khác nhau (§14f loại ②).
 */
export const Default: Story = {
    render: () => (
        <div className="max-w-2xl p-8">
            <BlockAnatomy
                name="LearnNudges"
                tier="block"
                leaf="Default"
                parts={PARTS}
                reason="§14a — 'hôm nay nên làm gì' là một CHỨC NĂNG của screen nên phải có tên. Trước đó screen gọi thẳng SurfaceCard.List (tầng layout) rồi tự nhét items + tự chọn icon: screen lắp chi tiết thay block, đọc code screen không ra được trang làm gì."
                note="§14b — caller đưa `kind` (ENUM), KHÔNG đưa icon. Bảng `kind → icon` nằm trong block; screen không được biết 'ôn thẻ' trông ra sao. Nếu prop là `leadingIcon` thì screen lại phải cầm icon ⇒ thủng luật."
                code={"<LearnNudges heading=\"Việc nên làm hôm nay\" items={[{ id, kind: \"flashcards\", title, count }]} />"}
            >
                <LearnNudges
                    heading="Việc nên làm hôm nay"
                    items={ITEMS}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
