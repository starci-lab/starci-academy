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
                reason="A busy indicator: one spinning glyph wrapping HeroUI Spinner, size/tone set by prop. No isSkeleton branch here, the spin itself IS the loading signal."
                states={[
                    {
                        name: "size = \"md\", tone = \"accent\"",
                        why: "A single spinning ring renders at the medium diameter in the accent colour, with no visible label text on screen. The `label` prop only feeds the accessible name, so a screen reader announces it while sighted users see just the glyph.",
                        code: "<Spinner.Base label=\"Loading\" />",
                        render: <Spinner.Base showAnatomy />,
                    },
                ]}
            />
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
                reason="The atom owns the size scale so callers never hand-set a diameter, matching the same rule Button.Base and IconTile.Base follow for their own scales."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The ring renders at its smallest diameter, the step reached for inline next to a short line of text or inside a small button. Only the diameter changes across the four size states, the ring shape and stroke stay the same.",
                        code: "<Spinner.Base size=\"sm\" />",
                        render: <Spinner.Base size="sm" showAnatomy />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The ring steps up to the default diameter, the size used when a spinner stands on its own rather than inline with text. Nothing else about the ring changes from the sm step.",
                        code: "<Spinner.Base size=\"md\" />",
                        render: <Spinner.Base size="md" showAnatomy />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The ring grows again for a spot that needs more visual weight, such as the centre of an otherwise empty panel. The stroke thickens along with the diameter so the ring never looks thin and stretched.",
                        code: "<Spinner.Base size=\"lg\" />",
                        render: <Spinner.Base size="lg" showAnatomy />,
                    },
                    {
                        name: "size = \"xl\"",
                        why: "The ring reaches its largest diameter, reserved for a full-page loading moment where the spinner is the only thing on screen. It is the last step of the same four-step scale as the other three sizes.",
                        code: "<Spinner.Base size=\"xl\" />",
                        render: <Spinner.Base size="xl" showAnatomy />,
                    },
                ]}
            />
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
                reason="Tone lets a spinner sitting inside a coloured surface (a danger button, a success banner) read as part of that surface instead of always shipping the same accent ring."
                states={[
                    {
                        name: "tone = \"accent\"",
                        why: "The ring spins in the accent colour, the default identity tone used for a generic loading moment. Every other tone below keeps the same ring shape and only swaps this colour.",
                        code: "<Spinner.Base tone=\"accent\" />",
                        render: <Spinner.Base tone="accent" showAnatomy />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "The ring spins in the success colour, for a moment that is confirming something already agreed to succeed rather than a neutral wait. Only the colour differs from the accent state.",
                        code: "<Spinner.Base tone=\"success\" />",
                        render: <Spinner.Base tone="success" showAnatomy />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The ring spins in the warning colour, for a wait that carries some risk or cost if it fails. Only the colour differs from the accent state.",
                        code: "<Spinner.Base tone=\"warning\" />",
                        render: <Spinner.Base tone="warning" showAnatomy />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The ring spins in the danger colour, matching a destructive action that is currently in flight (such as an unenroll request). Only the colour differs from the accent state.",
                        code: "<Spinner.Base tone=\"danger\" />",
                        render: <Spinner.Base tone="danger" showAnatomy />,
                    },
                    {
                        name: "tone = \"current\"",
                        why: "The ring inherits whatever text colour surrounds it instead of picking one of its own, shown here against a foreground-coloured wrapper. This is the step reached for when the spinner sits inside a coloured button and must match the button's own label colour.",
                        code: "<Spinner.Base tone=\"current\" />",
                        render: (
                            <span className="text-foreground inline-flex">
                                <Spinner.Base tone="current" showAnatomy />
                            </span>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
