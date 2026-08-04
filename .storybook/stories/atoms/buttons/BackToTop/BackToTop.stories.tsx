import type { Meta, StoryObj } from "@storybook/nextjs"
import { BackToTop } from "@sb-components/atoms/buttons/BackToTop/BackToTop"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `BackToTop`: one round accent control with a single fixed glyph (an
 * up arrow), that fades between hidden and visible. It composes no other
 * component — the glyph is hard-coded, not a caller-supplied child — so it
 * stays one element rather than the generic icon-button composite
 * (`FloatingActionButton`, whose `icon` IS a caller value).
 *
 * `isVisible` is the one leaf — the atom owns every state its shown/hidden
 * value can be in (ATOM-4). It renders in-flow: WHERE it floats on the page
 * is the host shell's call (nivo's `MarketingLandingShell` wraps it in
 * `fixed bottom-6 end-6 z-40`), not this atom's — position is the one class
 * of decision only the parent can make.
 */

const meta: Meta<typeof BackToTop> = {
    title: "Atoms/Buttons/BackToTop/BackToTop",
    component: BackToTop,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof BackToTop>

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
                name="BackToTop"
                tier="atom"
                leaf="Prop `isVisible`"
                reason="One control, one fixed glyph — the up arrow is hard-coded, not a child the caller hands in, so `isVisible` (shown vs. hidden) is the only enumerable state. Placement is deliberately absent: a floating position is the parent shell's decision, not this atom's."
                states={[
                    {
                        name: "isVisible = false — at the top of the page",
                        why: "Before the reader has scrolled past the fold, the control is faded out and untabbable (`aria-hidden`, `tabIndex=-1`) so it never intercepts focus while invisible.",
                        code: "<BackToTop isVisible={false} label=\"Back to top\" onPress={scrollToTop} />",
                        render: (
                            <div data-tier="fixture" className="dark relative flex h-40 items-end justify-end rounded-lg bg-background p-6">
                                <BackToTop isVisible={false} label="Back to top" onPress={() => {}} />
                            </div>
                        ),
                    },
                    {
                        name: "isVisible = true — past the fold",
                        why: "Once the shell's own scroll listener crosses its reveal threshold, the same control fades in and becomes pressable — pressing it scrolls the reader back to the top.",
                        code: "<BackToTop isVisible={true} label=\"Back to top\" onPress={scrollToTop} />",
                        render: (
                            <div data-tier="fixture" className="dark relative flex h-40 items-end justify-end rounded-lg bg-background p-6">
                                <BackToTop isVisible label="Back to top" onPress={() => {}} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
