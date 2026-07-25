import type { Meta, StoryObj } from "@storybook/nextjs"
import { BellIcon } from "@phosphor-icons/react"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Badge.Base> = {
    title: "Atoms/Display/Badge/Badge.Base",
    component: Badge.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Badge.Base>

// A small anchor host for the badge (bell icon) — the badge treo góc phần tử này.
// Icon Phosphor (§5⃣0, một bộ duy nhất); `size-6` > `size-5` ⇒ giữ weight mặc định
// `regular`, KHÔNG truyền weight (§5⃣0a — chỉ icon nhỏ hơn size-5 mới cần bold).
const BellHost = () => <BellIcon className="text-muted size-6" aria-hidden />

// LEAF = composition (theo prop). Mỗi leaf render 1 badge + đúng parts của nó.
const ANCHORED_PARTS: Array<AnatomyNode> = [
    { name: "Anchor", tier: "atom", role: "HeroUI Badge.Anchor — bọc phần tử để treo badge góc" },
    { name: "Content", tier: "atom", role: "phần tử được treo (children) — vd icon chuông" },
    { name: "Badge", tier: "atom", role: "nhãn đếm/chấm (HeroUI Badge), tone theo `color`" },
]
const STANDALONE_PARTS: Array<AnatomyNode> = [
    { name: "Badge", tier: "atom", role: "badge inline độc lập (không children → không anchor)" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (pill/dot shimmer)" },
]

/**
 * Anchored — badge treo góc phần tử (Badge.Anchor). MỘT leaf render ĐỦ nội dung:
 * số đếm · chấm trơn (dot) · số vượt ngưỡng cap "99+".
 *
 * Gộp 3 story cũ (`Count`/`Dot`/`Max`) về đây theo §14d.2: cả ba dựng CÙNG một cây
 * (Anchor › Content + Badge — đúng `ANCHORED_PARTS` y hệt), không mất/thêm node nào,
 * chỉ khác NHÃN bên trong ⇒ đó là STATE, không phải leaf.
 */
export const Anchored: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Anchored"
                parts={ANCHORED_PARTS}
                reason="Atom badge DUY NHẤT bọc HeroUI Badge; count/dot/cap/standalone phân bằng prop → leaf = composition."
                note="count → số thô · dot → badge không nhãn, thu về chấm (min-w-0 p-0) · count=128 + max=99 → atom tự render '99+' (cap là việc của atom §4, consumer đưa số thô)."
                code={"<Badge.Base count={3}>{<BellIcon/>}</Badge.Base>\n<Badge.Base dot>{<BellIcon/>}</Badge.Base>\n<Badge.Base count={128} max={99}>{<BellIcon/>}</Badge.Base>"}
            >
                <div className="flex items-center gap-8">
                    <Badge.Base count={3} showAnatomy>
                        <BellHost />
                    </Badge.Base>
                    <Badge.Base dot showAnatomy>
                        <BellHost />
                    </Badge.Base>
                    <Badge.Base count={128} max={99} showAnatomy>
                        <BellHost />
                    </Badge.Base>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Colors — tone theo `color` (danger · accent · success · warning · default). */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Colors"
                parts={STANDALONE_PARTS}
                note="Badge độc lập (không children) — 5 tone ngữ nghĩa; màu tải nghĩa (alert/mới…)."
                code={"<Badge.Base count={5} color=\"danger|accent|success|warning|default\" />"}
            >
                <div className="flex items-center gap-3">
                    <Badge.Base count={5} color="danger" showAnatomy />
                    <Badge.Base count={5} color="accent" showAnatomy />
                    <Badge.Base count={5} color="success" showAnatomy />
                    <Badge.Base count={5} color="warning" showAnatomy />
                    <Badge.Base count={5} color="default" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton; không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → pill shimmer OWNED bởi atom (hybrid C)."
                code={"<Badge.Base isSkeleton count={3} />"}
            >
                <Badge.Base isSkeleton count={3} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
