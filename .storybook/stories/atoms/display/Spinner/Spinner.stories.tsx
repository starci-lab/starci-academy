import type { Meta, StoryObj } from "@storybook/nextjs"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Spinner.Base> = {
    title: "Atoms/Display/Spinner/Spinner.Base",
    component: Spinner.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Spinner.Base>

const SPINNER_PARTS: Array<AnatomyNode> = [
    { name: "Spinner", tier: "atom", role: "glyph xoay (HeroUI Spinner) — atom ép size/tone" },
]

/** Default — spinner md, tone accent; `label` = tên a11y. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Spinner.Base"
                tier="atom"
                leaf="Default"
                parts={SPINNER_PARTS}
                reason="Chỉ-báo BUSY: một glyph xoay bọc HeroUI Spinner; size/tone phân bằng prop. KHÔNG isSkeleton (spinner CHÍNH LÀ chỉ-báo tải)."
                code={"<Spinner.Base label=\"Đang tải\" />"}
            >
                <Spinner.Base showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Sizes — sm · md · lg · xl (atom tự ép kích thước). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Spinner.Base"
                tier="atom"
                leaf="Sizes"
                parts={SPINNER_PARTS}
                note="4 bậc size sm/md/lg/xl — atom sở hữu scale (§4)."
                code={"<Spinner.Base size=\"sm|md|lg|xl\" />"}
            >
                <div className="flex items-end gap-6">
                    <Spinner.Base size="sm" showAnatomy />
                    <Spinner.Base size="md" showAnatomy />
                    <Spinner.Base size="lg" showAnatomy />
                    <Spinner.Base size="xl" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Tones — accent · success · warning · danger · current (theo màu chữ container). */
export const Tones: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Spinner.Base"
                tier="atom"
                leaf="Tones"
                parts={SPINNER_PARTS}
                note="tone='current' kế thừa màu chữ container (vd trong nút màu)."
                code={"<Spinner.Base tone=\"accent|success|warning|danger|current\" />"}
            >
                <div className="flex items-center gap-6">
                    <Spinner.Base tone="accent" showAnatomy />
                    <Spinner.Base tone="success" showAnatomy />
                    <Spinner.Base tone="warning" showAnatomy />
                    <Spinner.Base tone="danger" showAnatomy />
                    <span className="text-foreground inline-flex">
                        <Spinner.Base tone="current" showAnatomy />
                    </span>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
