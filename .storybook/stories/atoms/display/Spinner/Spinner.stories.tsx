import type { Meta, StoryObj } from "@storybook/nextjs"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Spinner.Base`: bọc thẳng HeroUI Spinner, chỉ ép `size`/`tone` (§4).
 *
 * ⭐ Atom LÁ — không compose component nào có story riêng ⇒ DEPS RỖNG. Bản trước
 * tự khai một part "Spinner" TRỎ VÀO CHÍNH NÓ (không `storyId` nên không bấm đi
 * đâu được) — đúng thứ luật "deps không có thì thôi" cấm (thầy chốt 2026-07-26
 * lần 2). Bỏ hẳn `parts`/`annotate` ở đây, giống `Button.Base`.
 */
const meta: Meta<typeof Spinner.Base> = {
    title: "Atoms/Display/Spinner/Spinner.Base",
    component: Spinner.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Spinner.Base>

/** Leaf trần — spinner md, tone accent; `label` là tên a11y (không hiện chữ). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Spinner.Base"
                tier="atom"
                leaf="Default"
                reason="A busy indicator: one spinning glyph wrapping HeroUI Spinner, size/tone set by prop. No isSkeleton branch here — the spin itself IS the loading signal."
                code={"<Spinner.Base label=\"Loading\" />"}
            >
                <Spinner.Base showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — sm · md · lg · xl, atom tự ép kích thước (§4). */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Spinner.Base"
                tier="atom"
                leaf="Prop `size`"
                note="Four steps: sm/md/lg/xl. The atom owns the scale — callers never hand-set a diameter."
                code={"<Spinner.Base size=\"sm|md|lg|xl\" />"}
            >
                <div className="flex items-end gap-6">
                    <Spinner.Base size="sm" showAnatomy />
                    <Spinner.Base size="md" />
                    <Spinner.Base size="lg" />
                    <Spinner.Base size="xl" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — accent · success · warning · danger · current (đọc màu chữ container). */
export const Tones: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Spinner.Base"
                tier="atom"
                leaf="Prop `tone`"
                note={"\"current\" inherits the surrounding text colour — useful inside a coloured button."}
                code={"<Spinner.Base tone=\"accent|success|warning|danger|current\" />"}
            >
                <div className="flex items-center gap-6">
                    <Spinner.Base tone="accent" showAnatomy />
                    <Spinner.Base tone="success" />
                    <Spinner.Base tone="warning" />
                    <Spinner.Base tone="danger" />
                    <span className="text-foreground inline-flex">
                        <Spinner.Base tone="current" />
                    </span>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
