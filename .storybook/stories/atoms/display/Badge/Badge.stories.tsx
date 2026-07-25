import type { Meta, StoryObj } from "@storybook/nextjs"
import { Bell } from "@gravity-ui/icons"
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
const BellHost = () => <Bell className="text-muted size-6" aria-hidden />

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

/** Count — số đếm treo góc phần tử (Badge.Anchor). */
export const Count: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Count"
                parts={ANCHORED_PARTS}
                reason="Atom badge DUY NHẤT bọc HeroUI Badge; count/dot/cap/standalone phân bằng prop → leaf = composition."
                code={"<Badge.Base count={3}>{<Bell/>}</Badge.Base>"}
            >
                <Badge.Base count={3} showAnatomy>
                    <BellHost />
                </Badge.Base>
            </BlockAnatomy>
        </div>
    ),
}

/** Dot — chấm trơn (không số), tín hiệu chưa-đọc/hiện-diện. */
export const Dot: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Dot"
                parts={ANCHORED_PARTS}
                note="dot → badge không nhãn, thu về chấm (min-w-0 p-0)."
                code={"<Badge.Base dot>{<Bell/>}</Badge.Base>"}
            >
                <Badge.Base dot showAnatomy>
                    <BellHost />
                </Badge.Base>
            </BlockAnatomy>
        </div>
    ),
}

/** Max — số vượt ngưỡng cap thành "{max}+" (atom tự cap §4). */
export const Max: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Max"
                parts={ANCHORED_PARTS}
                note="count=128, max=99 → atom render '99+' (cap là việc của atom, consumer đưa số thô)."
                code={"<Badge.Base count={128} max={99}>{<Bell/>}</Badge.Base>"}
            >
                <Badge.Base count={128} max={99} showAnatomy>
                    <BellHost />
                </Badge.Base>
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
