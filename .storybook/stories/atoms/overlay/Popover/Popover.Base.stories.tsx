import type { Meta, StoryObj } from "@storybook/nextjs"
import { CircleInfo } from "@gravity-ui/icons"
import { Popover } from "@sb-components/atoms/overlay/Popover/Popover"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Popover.Base> = {
    title: "Atoms/Overlay/Popover/Popover.Base",
    component: Popover.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Popover.Base>

// Trigger (Button) nằm TRONG render-box (được badge); Content/Arrow/Heading/Body portal
// ra body → chỉ hiện ở legend + Cây.
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở panel (Button) — prop `triggerLabel`" },
    { name: "Content", tier: "atom", role: "dialog surface (Popover.Content), portal ra body" },
    { name: "Arrow", tier: "atom", role: "mũi chỉ về trigger (Popover.Arrow)" },
    { name: "Body", tier: "atom", role: "thân panel — prop `content`" },
]
const HEADING_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở panel (Button) — prop `triggerLabel`" },
    { name: "Content", tier: "atom", role: "dialog surface (Popover.Content), portal ra body" },
    { name: "Arrow", tier: "atom", role: "mũi chỉ về trigger (Popover.Arrow)" },
    { name: "Heading", tier: "atom", role: "tiêu đề panel (Popover.Heading) — prop `heading`" },
    { name: "Body", tier: "atom", role: "thân panel — prop `content`" },
]
const TRIGGER_ICON_PARTS: Array<AnatomyNode> = [
    { name: "Trigger", tier: "atom", role: "nút mở panel (Button) — prop `triggerLabel`" },
    { name: "TriggerIcon", tier: "atom", role: "glyph dẫn đầu trigger (`triggerIcon` COMPONENT) — atom ép size-3.5" },
    { name: "Content", tier: "atom", role: "dialog surface (Popover.Content), portal ra body" },
    { name: "Arrow", tier: "atom", role: "mũi chỉ về trigger (Popover.Arrow)" },
    { name: "Body", tier: "atom", role: "thân panel — prop `content`" },
]

/** Default — trigger button + panel mở sẵn (không heading). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Default"
                parts={BASE_PARTS}
                reason="Atom popover DUY NHẤT bọc HeroUI Popover + Button trigger (react-aria DialogTrigger cần trigger pressable); atom sở hữu surface/placement/arrow."
                note="defaultOpen pin panel mở khi load để soi. placement=bottom. Nhãn nút đi bằng `triggerLabel` — atom KHÔNG nhận children; `content` là THÂN panel nên vẫn là ReactNode."
                code={"<Popover.Base triggerLabel=\"Chi tiết\" content={<p>…</p>} placement=\"bottom\" />"}
            >
                <div className="flex justify-center py-16">
                    <Popover.Base
                        triggerLabel="Chi tiết chuỗi"
                        content="Phiên học gần nhất cách đây 2 ngày. Duy trì chuỗi bằng cách học mỗi ngày."
                        placement="bottom"
                        defaultOpen
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithHeading — thêm dòng tiêu đề đậm phía trên thân. */
export const WithHeading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="WithHeading"
                parts={HEADING_PARTS}
                note="`heading` bật Popover.Heading (dòng đậm) trên `content`."
                code={"<Popover.Base triggerLabel=\"Chi tiết\" heading=\"Chuỗi 12 ngày\" content={<p>…</p>} />"}
            >
                <div className="flex justify-center py-16">
                    <Popover.Base
                        triggerLabel="Chi tiết chuỗi"
                        heading="Chuỗi 12 ngày"
                        content="Học thêm hôm nay để giữ chuỗi. Bỏ 1 ngày sẽ reset về 0."
                        placement="bottom"
                        defaultOpen
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithTriggerIcon — nhãn nút kèm glyph dẫn đầu (prop `triggerIcon`). */
export const WithTriggerIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="WithTriggerIcon"
                parts={TRIGGER_ICON_PARTS}
                note="`triggerIcon` là COMPONENT gravity; atom ép `size-3.5` (icon = size chữ nút) nên caller không chèn sai scale."
                code={"<Popover.Base triggerLabel=\"Cách tính điểm\" triggerIcon={CircleInfo} content={<p>…</p>} />"}
            >
                <div className="flex justify-center py-16">
                    <Popover.Base
                        triggerLabel="Cách tính điểm"
                        triggerIcon={CircleInfo}
                        content="Điểm = số tiêu chí đạt / tổng tiêu chí trong checklist của câu hỏi."
                        placement="bottom"
                        defaultOpen
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
