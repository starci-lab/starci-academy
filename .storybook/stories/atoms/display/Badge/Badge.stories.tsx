import type { Meta, StoryObj } from "@storybook/nextjs"
import { BellIcon } from "@phosphor-icons/react"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Badge.Base`: bọc thẳng HeroUI `Badge` (+ `Badge.Anchor` khi có `children`).
 * Atom lá — không dựng lại atom nào khác nên KHÔNG có deps: bỏ hẳn prop `annotate`
 * (§12g, thầy chốt 2026-07-26 lần 2). `Anchor`/`Content`/`Badge`/`Skeleton` là span
 * NỘI BỘ của chính atom này (khe, không có nhà để nhảy tới), không phải deps.
 *
 * `Badge.Base` là atom-WRAPPER hợp lệ giữ `children` (§12b) — anchor cần bọc phần tử
 * nó treo lên, không phải lỗ hổng cấm children.
 */
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

/**
 * Leaf props `count` / `dot` / `max` — badge treo góc phần tử (`Badge.Anchor`).
 * MỘT leaf render ĐỦ ba cách gọi: số đếm thô · chấm trơn (không số) · số vượt
 * ngưỡng cap ("99+"). Cả ba dựng CÙNG một cây (Anchor › Content + Badge), chỉ khác
 * NHÃN bên trong ⇒ đó là giá trị của cùng một prop-family, không phải ba leaf riêng.
 */
export const Anchored: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Props `count` / `dot` / `max`"
                reason="The one badge atom over HeroUI Badge — count, dot, cap, and standalone are all the same atom, split by prop."
                note="A raw count renders as-is. `dot` drops the number and shrinks the badge to a marker. Count 128 with max=99 renders '99+' — the atom owns the cap, callers just pass the raw number."
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

/** Leaf prop `color` — ĐỦ union tone (danger · accent · success · warning · default). */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Prop `color`"
                note="Standalone badge (no children) — five tones carrying meaning (alert, new, done…), not decoration."
                code={"<Badge.Base count={5} color=\"danger|accent|success|warning|default\" />"}
            >
                <div className="flex items-center gap-3">
                    <Badge.Base count={5} color="danger" showAnatomy />
                    <Badge.Base count={5} color="accent" />
                    <Badge.Base count={5} color="success" />
                    <Badge.Base count={5} color="warning" />
                    <Badge.Base count={5} color="default" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — ĐỦ union kích cỡ (sm · md · lg), đổi pixel ngay cả khi đứng riêng. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="The badge scales with what it sits on — a small icon needs a small marker, a bigger anchor can carry a bigger one."
                note="Standalone badges (no anchor needed) — the pill itself grows from sm to lg, same count value throughout."
                code={"<Badge.Base count={5} size=\"sm\" />\n<Badge.Base count={5} size=\"md\" />\n<Badge.Base count={5} size=\"lg\" />"}
            >
                <div className="flex items-center gap-3">
                    <Badge.Base count={5} size="sm" showAnatomy />
                    <Badge.Base count={5} size="md" />
                    <Badge.Base count={5} size="lg" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `placement` — ĐỦ bốn góc, cùng một anchor thật để thấy badge treo góc nào. */
export const Placement: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Prop `placement`"
                reason="Only meaningful with an anchor — the badge hangs off a corner of what it decorates, so the corner has to be a caller choice."
                note="Same bell host, same count, only the anchor corner changes across the four cells."
                code={"<Badge.Base count={3} placement=\"top-right\">{<BellIcon/>}</Badge.Base>\n<Badge.Base count={3} placement=\"top-left\">{<BellIcon/>}</Badge.Base>\n<Badge.Base count={3} placement=\"bottom-right\">{<BellIcon/>}</Badge.Base>\n<Badge.Base count={3} placement=\"bottom-left\">{<BellIcon/>}</Badge.Base>"}
            >
                <div className="flex items-center gap-8">
                    <Badge.Base count={3} placement="top-right" showAnatomy>
                        <BellHost />
                    </Badge.Base>
                    <Badge.Base count={3} placement="top-left">
                        <BellHost />
                    </Badge.Base>
                    <Badge.Base count={3} placement="bottom-right">
                        <BellHost />
                    </Badge.Base>
                    <Badge.Base count={3} placement="bottom-left">
                        <BellHost />
                    </Badge.Base>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c), không dùng Skeleton.* dùng chung. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                note="A small pill shimmer owned by the atom itself — nothing to keep in sync with a shared skeleton component."
                code={"<Badge.Base isSkeleton count={3} />"}
            >
                <Badge.Base isSkeleton count={3} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
