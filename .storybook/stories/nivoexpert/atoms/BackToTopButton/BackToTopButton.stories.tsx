import type { Meta, StoryObj } from "@storybook/nextjs"
import { BackToTopButton } from "@sb-components/nivoexpert/atoms/BackToTopButton/BackToTopButton"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `BackToTopButton`: one round control with a single fixed glyph (an
 * up arrow), that fades between hidden and visible. It composes no other
 * component — the glyph is hard-coded, not a caller-supplied child — so it
 * stays one element rather than a generic icon-button composite.
 *
 * PLAIN CSS: reads `--nivo-*` runtime tokens directly (styled-jsx), the
 * nivoexpert restyle of the shared `atoms/buttons/BackToTop` atom onto
 * `nivo-expert-app`'s plain-CSS token contract — no HeroUI.
 *
 * `isVisible` is the one leaf — the atom owns every state its shown/hidden
 * value can be in. It renders in-flow: WHERE it floats on the page is the
 * host shell's call (`TenantLandingShell` wraps it in a fixed bottom-end
 * corner), not this atom's — position is the one class of decision only the
 * parent can make.
 */

const meta: Meta<typeof BackToTopButton> = {
    title: "NivoExpert/Atoms/BackToTopButton/BackToTopButton",
    component: BackToTopButton,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof BackToTopButton>

/**
 * BARE leaf — `isVisible` is the whole atom's visible state; `onPress`/`label`
 * are wiring (a callback + the resolved accessible name), not enumerable
 * appearance. Both values of `isVisible` are shown as `states[]` of this one
 * leaf.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="BackToTopButton"
                tier="atom"
                leaf="Prop `isVisible`"
                reason="One control, one fixed glyph — the up arrow is hard-coded, not a child the caller hands in, so `isVisible` (shown vs. hidden) is the only enumerable state. Placement is deliberately absent: a floating position is the parent layout's decision, not this atom's."
                states={[
                    {
                        name: "isVisible = false — at the top of the page",
                        why: "Before the reader has scrolled past the hero fold, the control is faded out and untabbable (`aria-hidden`, `tabIndex=-1`) so it never intercepts focus while invisible.",
                        code: "<BackToTopButton isVisible={false} label=\"Back to top\" onPress={scrollToTop} />",
                        render: (
                            <div data-tier="fixture" className="relative flex h-40 items-end justify-end rounded-lg p-6" style={{ background: "var(--nivo-bg)" }}>
                                <BackToTopButton isVisible={false} label="Back to top" onPress={() => {}} />
                            </div>
                        ),
                    },
                    {
                        name: "isVisible = true — past the hero fold",
                        why: "Once the shell's own scroll listener crosses its reveal threshold, the same control fades in and becomes pressable — pressing it scrolls the reader back to the top.",
                        code: "<BackToTopButton isVisible={true} label=\"Back to top\" onPress={scrollToTop} />",
                        render: (
                            <div data-tier="fixture" className="relative flex h-40 items-end justify-end rounded-lg p-6" style={{ background: "var(--nivo-bg)" }}>
                                <BackToTopButton isVisible label="Back to top" onPress={() => {}} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
