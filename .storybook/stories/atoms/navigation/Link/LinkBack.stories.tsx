import type { Meta, StoryObj } from "@storybook/nextjs"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `LinkBack`: the ONLY "← Back" button in the system, wrapping HeroUI `Link`
 * directly. A leaf atom — it doesn't build on top of any other atom OF THE SYSTEM,
 * but the HeroUI `Link` it renders is still a REAL import (2026-07-27, heroui tier
 * added to canon), so its root is tagged `"Link"` and declared `tier: "heroui"` in
 * `ANNOTATE` below — no `storyId`, there's no story of ours for a library component.
 *
 * 2026-07-26: merged from `BackLink.Base` into the `Link.*` namespace alongside
 * `LinkSeeMore` (§12a) — two shapes of the same "text-link + arrow" concept.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The atom's four props: `label` · `target` · `onPress` ·
 * `className`. NO prop earns its own leaf:
 *   • `label`/`target` only swap the TEXT inside one existing `<span>` — no element is
 *     added or removed (unlike `Divider label`, where turning on `label` builds a
 *     whole 3-part layout, rule|label|rule). §12g.1: changing a prop's value without
 *     changing the structural pixels earns no leaf — this is exactly the "prop is just
 *     TEXT" carve-out (`text`/`title`/`label` as a single string).
 *   • `onPress`/`className` produce no visual (§12g's exclusion list).
 *
 * Result: this atom has just ONE leaf, `Default` — like `Logo` (a component with
 * only `className`, no union to enumerate).
 *
 * The previous version split `WithTarget`/`CustomLabel` into two separate leaves —
 * that's splitting leaves by the VALUE of a text prop, exactly what §12g forbids.
 * Merged back: `Default` demonstrates all three call shapes (bare / `target` / `label`)
 * in one frame, not three states of three different props.
 */
const meta: Meta<typeof LinkBack> = {
    title: "Atoms/Navigation/Link/LinkBack",
    component: LinkBack,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LinkBack>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Link": { tier: "heroui", role: "the back affordance itself — label + arrow, sliding left on hover" },
}

/**
 * BARE leaf — the ONLY one this atom has. `Default`/`TargetSet`/`LabelSet` are three
 * CALL SHAPES of the same text prop (`label`/`target` default/set), not three different
 * leaves — none of these values change the DOM structure, only the displayed string
 * inside the same `<span>`.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LinkBack"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Bare link"
                reason="The one back affordance in the system, wrapping HeroUI Link. `label` and `target` only swap the string inside the same span, the DOM never changes shape, so neither prop earns its own leaf."
                states={[
                    {
                        name: "label unset, target unset",
                        why: "The link renders the generic string \"Back\" inside its span because neither the label nor the target prop is set. Hover still slides the arrow left and underlines the label the same as every other call shape, since that motion is fixed rather than prop-driven.",
                        code: "<LinkBack onPress={goBack} />",
                        render: <LinkBack onPress={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * See the shared doc block above `Default` for why this is a call-shape split, not a
 * new leaf.
 */
export const TargetSet: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LinkBack"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Bare link"
                reason="The one back affordance in the system, wrapping HeroUI Link. `label` and `target` only swap the string inside the same span, the DOM never changes shape, so neither prop earns its own leaf."
                states={[
                    {
                        name: "target = \"challenge\"",
                        why: "The span now reads \"Back to challenge\" because the target prop is set and gets interpolated into the same generic string. The product wants the destination named so the user knows where the back action lands, without adding any new element to the DOM.",
                        code: "<LinkBack target=\"challenge\" onPress={goBack} />",
                        render: <LinkBack target="challenge" onPress={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * See the shared doc block above `Default` for why this is a call-shape split, not a
 * new leaf.
 */
export const LabelSet: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LinkBack"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Bare link"
                reason="The one back affordance in the system, wrapping HeroUI Link. `label` and `target` only swap the string inside the same span, the DOM never changes shape, so neither prop earns its own leaf."
                states={[
                    {
                        name: "label = \"Back to all courses\"",
                        why: "The span shows the full custom string \"Back to all courses\" because the label prop overrides the generic text outright. The product wants full control of the wording in places where the default \"Back to {target}\" phrasing does not fit the copy.",
                        code: "<LinkBack label=\"Back to all courses\" onPress={goBack} />",
                        render: <LinkBack label="Back to all courses" onPress={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}
