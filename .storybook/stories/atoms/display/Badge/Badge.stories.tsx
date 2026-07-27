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
 *
 * DI TRÚ SANG API `states[]` (thầy chốt 2026-07-27, canon §8): mỗi giá trị prop
 * (`count`/`dot`/`max` cho `Anchored` · từng tone cho `Colors` · từng cỡ cho
 * `Sizes` · từng góc cho `Placement`) từng bị xếp cạnh nhau trong CÙNG một
 * `children`, chỉ MỘT phần tử được `showAnatomy`. Giờ mỗi giá trị là một STATE
 * riêng, panel chỉ mount đúng state đang chọn nên cây deps và code snippet thuộc
 * đúng nó thay vì trộn lẫn cả hàng.
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
 * BA state đều dựng CÙNG một cây (Anchor › Content + Badge), chỉ khác NHÃN bên
 * trong ⇒ đó là giá trị của cùng một prop-family, không phải ba leaf riêng.
 */
export const Anchored: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Badge.Base"
                tier="atom"
                leaf="Props `count` / `dot` / `max`"
                reason="The one badge atom over HeroUI Badge covers count, dot, and cap through a single component, distinguished only by which prop the caller passes."
                states={[
                    {
                        name: "count = 3",
                        why: "The anchor badge renders the plain number 3, since nothing here caps or hides it. A raw count under any cap is shown verbatim so the anchored icon carries an honest unread total.",
                        code: "<Badge.Base count={3}>{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base count={3} showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                    {
                        name: "dot = true",
                        why: "The badge drops to a bare dot with no number, since `dot` overrides `count` entirely. This is the presence signal to reach for when a raw count would look like more detail than the anchor needs.",
                        code: "<Badge.Base dot>{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base dot showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                    {
                        name: "count = 128, max = 99",
                        why: "The label switches from the raw number to `99+`, because `count` exceeds `max`. The atom owns the cap itself so the caller never has to format the overflow string.",
                        code: "<Badge.Base count={128} max={99}>{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base count={128} max={99} showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                ]}
            />
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
                reason="The badge renders standalone since no anchor child is passed, and each of the five tones carries a specific meaning, such as alert, new, or done, rather than acting as decoration."
                states={[
                    {
                        name: "color = danger",
                        why: "Only the badge's tint changes to the danger red, and the tree stays the identical single node as every other tone in this family. Red marks something needing immediate attention, such as an unread alert.",
                        code: "<Badge.Base count={5} color=\"danger\" />",
                        render: <Badge.Base count={5} color="danger" showAnatomy />,
                    },
                    {
                        name: "color = accent",
                        why: "The badge tint switches to the accent tone with no other change to its shape. Accent flags a fresh or newly arrived item rather than a problem to act on.",
                        code: "<Badge.Base count={5} color=\"accent\" />",
                        render: <Badge.Base count={5} color="accent" showAnatomy />,
                    },
                    {
                        name: "color = success",
                        why: "The badge tint switches to the success green, again with an identical node tree to the other tones. Green marks a completed or resolved state, the opposite signal from danger.",
                        code: "<Badge.Base count={5} color=\"success\" />",
                        render: <Badge.Base count={5} color="success" showAnatomy />,
                    },
                    {
                        name: "color = warning",
                        why: "The badge tint switches to the warning amber, still the same single badge node as every other tone. Amber sits between danger and success, for something that needs attention but is not yet critical.",
                        code: "<Badge.Base count={5} color=\"warning\" />",
                        render: <Badge.Base count={5} color="warning" showAnatomy />,
                    },
                    {
                        name: "color = default",
                        why: "The badge tint falls back to the neutral default tone, again changing nothing but the fill colour. This tone suits a plain count with no urgency or status attached to it.",
                        code: "<Badge.Base count={5} color=\"default\" />",
                        render: <Badge.Base count={5} color="default" showAnatomy />,
                    },
                ]}
            />
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
                reason="The badge renders standalone with no anchor, since size is easiest to compare without an icon attached, and the pill itself grows from small to large while the count value stays the same across every state."
                states={[
                    {
                        name: "size = sm",
                        why: "The badge pill renders at its smallest footprint, with no other node added to or removed from the tree. A small size fits next to a compact icon or a dense row where a bigger marker would crowd its neighbours.",
                        code: "<Badge.Base count={5} size=\"sm\" />",
                        render: <Badge.Base count={5} size="sm" showAnatomy />,
                    },
                    {
                        name: "size = md",
                        why: "The badge pill grows to the default footprint, the standard mid-size, and still the same single node as every other size. This is the size used when the badge sits without a tighter or larger visual context around it.",
                        code: "<Badge.Base count={5} size=\"md\" />",
                        render: <Badge.Base count={5} size="md" showAnatomy />,
                    },
                    {
                        name: "size = lg",
                        why: "The badge pill grows to its largest footprint, still just the one node with no children added. A large size suits a bigger anchor, or wherever the badge needs to stay legible from further away.",
                        code: "<Badge.Base count={5} size=\"lg\" />",
                        render: <Badge.Base count={5} size="lg" showAnatomy />,
                    },
                ]}
            />
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
                reason="This prop is only meaningful with an anchor, since the badge hangs off a corner of whatever it decorates, so the corner has to be a caller choice; the same bell host and the same count are reused across every state, and only the anchor corner itself changes."
                states={[
                    {
                        name: "placement = top-right",
                        why: "The badge anchors to the top-right corner of the bell icon, with the same Anchor/Content/Badge tree as every other corner. Top-right is the default corner, matching where most native badges commonly sit.",
                        code: "<Badge.Base count={3} placement=\"top-right\">{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base count={3} placement="top-right" showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                    {
                        name: "placement = top-left",
                        why: "The badge moves to the top-left corner instead, changing only the anchor position and nothing about the tree shape. A left-side badge suits an anchor whose top-right corner is already claimed by something else.",
                        code: "<Badge.Base count={3} placement=\"top-left\">{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base count={3} placement="top-left" showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                    {
                        name: "placement = bottom-right",
                        why: "The badge moves down to the bottom-right corner, again with no structural change to the tree. A bottom placement suits an anchor whose top edge already carries another marker or label.",
                        code: "<Badge.Base count={3} placement=\"bottom-right\">{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base count={3} placement="bottom-right" showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                    {
                        name: "placement = bottom-left",
                        why: "The badge moves to the bottom-left corner, the last of the four positions and still the identical tree shape. This corner is picked when both top corners are already occupied by other UI on the anchor.",
                        code: "<Badge.Base count={3} placement=\"bottom-left\">{<BellIcon/>}</Badge.Base>",
                        render: (
                            <Badge.Base count={3} placement="bottom-left" showAnatomy>
                                <BellHost />
                            </Badge.Base>
                        ),
                    },
                ]}
            />
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
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The badge swaps to a small pill or dot shimmer that mirrors its own resting footprint, instead of the real numbered badge. The shimmer is drawn by the atom itself, so there is no shared skeleton component to keep in sync when the badge's shape changes.",
                        code: "<Badge.Base isSkeleton count={3} />",
                        render: <Badge.Base isSkeleton count={3} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
