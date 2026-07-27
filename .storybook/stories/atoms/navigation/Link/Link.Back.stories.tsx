import type { Meta, StoryObj } from "@storybook/nextjs"
import { Link } from "@sb-components/atoms/navigation/Link/Link"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Link.Back`: the ONLY "← Back" button in the system, wrapping HeroUI `Link`
 * directly. A leaf atom — it doesn't build on top of any other atom, so it has NO
 * deps: the `annotate` prop is dropped entirely (§12g, teacher's call, 2026-07-26,
 * second pass).
 *
 * 2026-07-26: merged from `BackLink.Base` into the `Link.*` namespace alongside
 * `Link.SeeMore` (§12a) — two shapes of the same "text-link + arrow" concept.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The atom's four props: `label` · `target` · `onPress` ·
 * `className`. NO prop earns its own leaf:
 *   • `label`/`target` only swap the TEXT inside one existing `<span>` — no element is
 *     added or removed (unlike `Divider.Base label`, where turning on `label` builds a
 *     whole 3-part layout, rule|label|rule). §12g.1: changing a prop's value without
 *     changing the structural pixels earns no leaf — this is exactly the "prop is just
 *     TEXT" carve-out (`text`/`title`/`label` as a single string).
 *   • `onPress`/`className` produce no visual (§12g's exclusion list).
 *
 * Result: this atom has just ONE leaf, `Default` — like `Logo.Base` (a component with
 * only `className`, no union to enumerate).
 *
 * The previous version split `WithTarget`/`CustomLabel` into two separate leaves —
 * that's splitting leaves by the VALUE of a text prop, exactly what §12g forbids.
 * Merged back: `Default` demonstrates all three call shapes (bare / `target` / `label`)
 * in one frame, not three states of three different props.
 */
const meta: Meta<typeof Link.Back> = {
    title: "Atoms/Navigation/Link/Link.Back",
    component: Link.Back,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Link.Back>

/**
 * BARE leaf — the ONLY one this atom has. The three lines below are three CALL SHAPES
 * of the same text prop (`label`/`target` default/set), not three different leaves —
 * none of these values change the DOM structure, only the displayed string inside the
 * same `<span>`.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Link.Back"
                tier="atom"
                leaf="Bare link"
                reason="The one back affordance in the system, wrapping HeroUI Link. `label` and `target` only swap the string inside the same span, the DOM never changes shape, so neither prop earns its own leaf."
                states={[
                    {
                        name: "label unset, target unset | target set | label set (three call shapes)",
                        why: "Only the string inside the same span changes across the three lines: generic \"Back\" with neither prop set, \"Back to {target}\" once target is set, and the label overriding the whole string once it is set. Hover slides the arrow left and underlines the label on every line the same way, because that motion is fixed rather than prop-driven.",
                        code: `<Link.Back onPress={goBack} />
<Link.Back target="challenge" onPress={goBack} />
<Link.Back label="Back to all courses" onPress={goBack} />`,
                        render: (
                            <div className="flex flex-col gap-4">
                                <Link.Back onPress={() => {}} />
                                <Link.Back target="challenge" onPress={() => {}} />
                                <Link.Back label="Back to all courses" onPress={() => {}} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
