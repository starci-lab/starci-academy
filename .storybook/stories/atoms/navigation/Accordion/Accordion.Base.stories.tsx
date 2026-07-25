import type { Meta, StoryObj } from "@storybook/nextjs"
import { Accordion } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Accordion.Base> = {
    title: "Atoms/Navigation/Accordion/Accordion.Base",
    component: Accordion.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Accordion.Base>

const PANEL_PARTS: Array<AnatomyNode> = [
    { name: "Item", tier: "atom", role: "một panel (HeroUI Disclosure) — id + title + content từ `items`" },
    { name: "Trigger", tier: "atom", role: "hàng tiêu đề bấm mở/đóng (Disclosure.Trigger)" },
    { name: "Indicator", tier: "atom", role: "chevron xoay khi mở (Disclosure.Indicator)" },
    { name: "Content", tier: "atom", role: "vùng nội dung hiện khi mở (Disclosure.Content > Body)" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (hàng trigger đóng)" },
]

const FAQ_ITEMS = [
    { key: "refund", title: "Chính sách hoàn tiền?", content: "Hoàn 100% trong 7 ngày đầu nếu chưa học quá 20% nội dung." },
    { key: "cert", title: "Có chứng chỉ không?", content: "Có chứng chỉ hoàn thành sau khi vượt bài kiểm tra cuối khoá." },
    { key: "access", title: "Truy cập bao lâu?", content: "Trọn đời — mua một lần, học lại không giới hạn." },
]

/** Single — `allowsMultiple=false` (mặc định): mở panel này thì các panel khác đóng. */
export const Single: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                leaf="Single"
                parts={PANEL_PARTS}
                reason="Atom accordion DUY NHẤT bọc HeroUI DisclosureGroup+Disclosure; single/multi là leaf (prop allowsMultiple), không component riêng."
                code={`<Accordion.Base items={FAQ_ITEMS} /> {/* allowsMultiple mặc định false */}`}
            >
                <Accordion.Base items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Multiple — `allowsMultiple` bật: nhiều panel mở độc lập cùng lúc. */
export const Multiple: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                leaf="Multiple"
                parts={PANEL_PARTS}
                note="allowsMultiple → mỗi panel mở/đóng riêng, không đóng các panel khác."
                code={`<Accordion.Base allowsMultiple items={FAQ_ITEMS} />`}
            >
                <Accordion.Base allowsMultiple items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** DefaultOpen — `defaultExpandedKeys` mở sẵn một panel ở lần render đầu (uncontrolled). */
export const DefaultOpen: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                leaf="DefaultOpen"
                parts={PANEL_PARTS}
                note="defaultExpandedKeys=['refund'] → panel đầu mở sẵn; vẫn single-open (mở panel khác sẽ đóng nó)."
                code={`<Accordion.Base defaultExpandedKeys={["refund"]} items={FAQ_ITEMS} />`}
            >
                <Accordion.Base defaultExpandedKeys={["refund"]} items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (hàng trigger đóng); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → cột trigger-row shimmer OWNED bởi atom (hybrid C) khi FAQ chưa tải."
                code={`<Accordion.Base isSkeleton items={FAQ_ITEMS} />`}
            >
                <Accordion.Base isSkeleton items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
