import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeepGoingPath, type KeepGoingLesson } from "@sb-components/_legacy/blocks/learn/KeepGoingPath/KeepGoingPath"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof KeepGoingPath> = {
    title: "Legacy/Block/Learn/KeepGoingPath",
    component: KeepGoingPath,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeepGoingPath>

const PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCardHeader", tier: "block", role: "dòng dẫn chương — đi `label` của SurfaceCard (render NGOÀI/trên surface), KHÔNG phải Typography rời" },
    { name: "Surface", tier: "block", role: "vỏ surface + danh sách hàng — `SurfaceCard.List`, CÙNG layout với LearnNudges. `bordered` là PROP (chỉ bật khi nằm trong surface cha), mặc định shadow", storyId: "layouts-cards-surfacecard-surfacecard-list--leading-meta" },
]

const LESSONS: Array<KeepGoingLesson> = [
    { id: "l1", title: "Docker là gì", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Viết Dockerfile tối ưu", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "intermediate", locked: true, onPress: () => {} },
]

/**
 * Leaf DUY NHẤT — ba trạng thái bài (đã xong · đang học · chưa học) cùng nằm trong
 * MỘT danh sách, không phải ba story: chúng là nội dung của cùng một cây.
 */
export const Default: Story = {
    render: () => (
        <div className="max-w-2xl p-8">
            <BlockAnatomy
                name="KeepGoingPath"
                tier="block"
                leaf="Default"
                parts={PARTS}
                reason="ĐỒNG NHẤT RENDER (thầy soi mắt 2026-07-25): cụm này trông y hệt `LearnNudges` ngay trên nó nên phải đi CÙNG layout `SurfaceCard.List` — không chế thêm khái niệm render. Bản đầu tự vẽ `div.rounded-2xl.border` + `List.Row`: hai đường render cho một hình, đã dẹp."
                note="Caller chỉ đưa DỮ LIỆU (`heading` + mảng `lessons`). Bảng trạng thái→icon nằm trong block. `bordered` KHÔNG hard-code: block không biết cha mình là gì — đứng trên nền trang trần thì shadow, nằm trong surface cha mới viền."
                code={"<KeepGoingPath heading=\"Tiếp tục · Chương 2\" lessons={[…]} />"}
            >
                <KeepGoingPath
                    heading="Tiếp tục · Chương 2 · Container hoá"
                    lessons={LESSONS}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
