import type { Meta, StoryObj } from "@storybook/nextjs"
import { Divider, type DividerVariant } from "@sb-components/atoms/display/Divider/Divider"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Divider.Base`: wraps HeroUI `Separator` directly (HeroUI has no
 * "Divider", renamed for the app's vocabulary). A leaf atom — it doesn't build
 * any other atom so it has NO deps: the `annotate` prop is dropped entirely
 * (§12g, decided 2026-07-26, second pass). `Line`/`Label` are INTERNAL spans of
 * this very atom (a slot, nowhere else to jump to), not deps.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g): `orientation` · `variant` · `label`, each prop
 * one leaf, and the leaf renders EVERY value in full. The previous version split
 * `Horizontal`/`Vertical` into two separate leaves — that's splitting by the
 * VALUE of the SAME prop `orientation`, exactly what §12g forbids (its own
 * example calls out `Small`/`Medium`/`OnDark` as wrong) — merged back into one
 * `Orientation` leaf rendering both values in full. `variant` previously had no
 * leaf at all, even though it's also a prop with a visible shape — added
 * `Variants` to complete the set.
 */
const meta: Meta<typeof Divider.Base> = {
    title: "Atoms/Display/Divider/Divider.Base",
    component: Divider.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Divider.Base>

/** The FULL `DividerVariant` union — miss one value and it'll grow a leaf in the wrong place. */
const VARIANTS: Array<DividerVariant> = ["default", "secondary", "tertiary"]

/** Bare leaf — default orientation (horizontal), default variant, no label. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Bare divider"
                reason="The one rule in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to a horizontal line, default weight, no label."
                code={"<Divider.Base />"}
            >
                <div className="w-72">
                    <Divider.Base showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `orientation` — BOTH values: horizontal (default) and vertical. */
export const Orientation: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Prop `orientation`"
                note="Vertical needs a parent with a height to show against — use it between items sitting on one row."
                code={`<Divider.Base />
<Divider.Base orientation="vertical" />`}
            >
                <div className="flex flex-col gap-6">
                    <div className="w-72">
                        <Divider.Base showAnatomy />
                    </div>
                    <div className="flex h-16 items-center gap-4">
                        <span className="text-muted text-sm">Lesson</span>
                        <Divider.Base orientation="vertical" />
                        <span className="text-muted text-sm">Exercise</span>
                        <Divider.Base orientation="vertical" />
                        <span className="text-muted text-sm">Discussion</span>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `variant` — the FULL weight/tone union of the line. */
export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Prop `variant`"
                note="Line weight/tone only — orientation and label stay at their defaults."
                code={`<Divider.Base variant="default" />
<Divider.Base variant="secondary" />
<Divider.Base variant="tertiary" />`}
            >
                <div className="flex w-72 flex-col gap-4">
                    {VARIANTS.map((variant, index) => (
                        <Divider.Base key={variant} variant={variant} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `label` — horizontal only: rule · label · rule. */
export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Divider.Base"
                tier="atom"
                leaf="Prop `label`"
                note="Horizontal only — the atom builds two flex-1 rules around the centered text (e.g. 'OR' on a sign-in form)."
                code={"<Divider.Base label=\"OR\" />"}
            >
                <div className="w-72">
                    <Divider.Base label="OR" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
