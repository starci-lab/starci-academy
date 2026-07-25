import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Tooltip.Base> = {
    title: "Atoms/Overlay/Tooltip/Tooltip.Base",
    component: Tooltip.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Tooltip.Base>

// LEAF = composition. Trigger nằm TRONG render-box (được badge); Content/Arrow portal
// ra body nên chỉ hiện ở legend + Cây.
const PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "phần tử mở tooltip (Tooltip.Trigger) — prop `children` (NGOẠI LỆ wrapper)" },
    { name: "Content", tier: "atom", role: "panel hint (Tooltip.Content) — prop `label`, portal ra body" },
    { name: "Arrow", tier: "atom", role: "mũi chỉ về trigger (Tooltip.Arrow) — bật bằng `showArrow`" },
]

/** A bordered term used as the tooltip trigger. */
const TriggerBox = ({ label = "Di chuột vào đây" }: { label?: string }) => (
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
                parts={PARTS}
                reason="Atom tooltip DUY NHẤT bọc HeroUI Tooltip; atom sở hữu inset/max-width/arrow, consumer chỉ truyền label + trigger."
                note="defaultOpen pin panel mở khi load để soi. placement=top. ⚠️ Tooltip.Base GIỮ `children` — ngoại lệ CÓ TÊN: atom-wrapper buộc bọc phần tử bất kỳ (chip/icon-button/thuật ngữ) để react-aria gắn hover/focus/aria-describedby thẳng lên nó. Atom khác cấm tuyệt đối."
                code={"<Tooltip.Base label=\"Xếp hạng theo XP tuần\" placement=\"top\">\n  <TermChip />\n</Tooltip.Base>"}
            >
                <div className="flex justify-center py-12">
                    <Tooltip.Base label="Xếp hạng theo tổng XP trong tuần" placement="top" defaultOpen showAnatomy>
                        <TriggerBox label="Hạng tuần" />
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
                leaf="Placements"
                parts={PARTS}
                note="Cùng một atom, khác `placement`. Panel portal ra body và tự neo quanh trigger."
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
