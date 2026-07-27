import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Tooltip.Base`: hover-hint DUY NHẤT bọc HeroUI Tooltip.
 *
 * ⚠️ GIỮ `children` là ĐÚNG (§12b, lý do ghi ở header `Tooltip.tsx`): atom-wrapper
 * buộc bọc phần tử bất kỳ để react-aria gắn hover/focus/aria-describedby thẳng lên
 * nó. Cùng giới hạn PORTAL như Menu/Popover — `Content`/`Arrow` render ra body nên
 * BlockAnatomy (leo ancestor trong render-box) không leo tới được.
 *
 * ⚠️ KHÔNG có `annotate`: phần DOM duy nhất còn nằm TRONG render-box là `Trigger` —
 * chính là `children` do story truyền vào (`TriggerBox`, một span demo không có
 * story riêng). `Content`/`Arrow` portal ra ngoài nên không bao giờ vào được cây dù
 * có khai `storyId`. Không có node nào trỏ tới được một story thật ⇒ bỏ hẳn prop.
 *
 * 📐 Hai leaf theo prop CÓ HÌNH: `Default` (trần, baseline) + `Placements` (union
 * `placement` render đủ 4 hướng trong CÙNG một leaf, không tách theo từng giá trị).
 */
const meta: Meta<typeof Tooltip.Base> = {
    title: "Atoms/Overlay/Tooltip/Tooltip.Base",
    component: Tooltip.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tooltip.Base>

/** Props for the demo trigger element. */
interface TriggerBoxProps {
    /** Text shown inside the trigger. */
    label?: string
}

/** A bordered term used as the tooltip trigger. */
const TriggerBox = ({ label = "Hover to see it" }: TriggerBoxProps) => (
    <span className="inline-flex cursor-help rounded-xl border border-default-200 bg-default-100 px-3 py-2 text-sm font-medium text-foreground">
        {label}
    </span>
)

/** Default — top-placed hint, pre-opened to soak. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tooltip.Base"
                tier="atom"
                leaf="Default"
                reason="The one tooltip atom, wrapping HeroUI Tooltip. It owns the inset, max-width and arrow — callers just hand it a label and a trigger."
                note="defaultOpen pins the panel open on load so you can inspect it; placement defaults to top. Tooltip.Base is one of only two atoms allowed to keep children (the other is Badge) — it has to wrap whatever element it explains, so react-aria can attach hover/focus/aria-describedby straight onto that element. Every other atom is barred from taking children."
                code={"<Tooltip.Base label=\"Weekly XP ranking\" placement=\"top\">\n  <TermChip />\n</Tooltip.Base>"}
            >
                <div className="flex justify-center py-12">
                    <Tooltip.Base label="Ranked by total XP earned this week" placement="top" defaultOpen showAnatomy>
                        <TriggerBox label="Weekly rank" />
                    </Tooltip.Base>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Placements — top · bottom · left · right, mỗi phía một trigger pinned mở. */
export const Placements: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Tooltip.Base"
                tier="atom"
                leaf="Prop `placement`"
                note="Same atom, different placement. The panel portals to the body and anchors itself around the trigger."
                code={"<Tooltip.Base label=\"…\" placement=\"top | bottom | left | right\">…</Tooltip.Base>"}
            >
                <div className="grid grid-cols-2 gap-x-24 gap-y-20 px-16 py-24">
                    <div className="flex justify-center">
                        <Tooltip.Base label="Placement top" placement="top" defaultOpen showAnatomy>
                            <TriggerBox label="Top" />
                        </Tooltip.Base>
                    </div>
                    <div className="flex justify-center">
                        <Tooltip.Base label="Placement bottom" placement="bottom" defaultOpen showAnatomy>
                            <TriggerBox label="Bottom" />
                        </Tooltip.Base>
                    </div>
                    <div className="flex justify-center">
                        <Tooltip.Base label="Placement left" placement="left" defaultOpen showAnatomy>
                            <TriggerBox label="Left" />
                        </Tooltip.Base>
                    </div>
                    <div className="flex justify-center">
                        <Tooltip.Base label="Placement right" placement="right" defaultOpen showAnatomy>
                            <TriggerBox label="Right" />
                        </Tooltip.Base>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
