import type { Meta, StoryObj } from "@storybook/nextjs"
import { Link, type LinkSeeMoreSize } from "@sb-components/atoms/navigation/Link/Link"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Link.SeeMore`: the system's ONE "See more →" / "Continue →" affordance,
 * shared by `SurfaceCard`'s header (`onSeeMore`) and `ContinueCard`'s item CTA
 * (`decorative`).
 *
 * 2026-07-26: merged from `SeeMoreLink.Base` into the `Link.*` namespace alongside
 * `Link.Back` (§12a), two shapes of the same "text-link + arrow" concept.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). `decorative` and `size` have visual form → each gets
 * its own leaf, rendering the FULL union. `label` is TEXT (§12g.2) so it has NO leaf of
 * its own — every other leaf still has to pass it. Props with no visual form
 * (`className`, `showAnatomy`, `anatPart`) get NO leaf.
 *
 * ⚠️ `onPress` has NO leaf of its own — whether or not there's a handler, the text +
 * arrow are identical, only the press behavior changes (not pixels). `href` is the same:
 * it changes the rendered TAG (`<a>` instead of HeroUI `Link`) but does NOT change pixels
 * (§12g.1, the "tag change ≠ visual change" test), so there's NO separate `WithHref`
 * leaf; calling with `href` only shows up in the Code tab of the bare leaf.
 *
 * 🔗 The bare leaf is named `Default` (renamed from `OnPress` on 2026-07-26, `onPress`
 * has no visual form so it can't name a leaf). `SurfaceCard.Base` pins this leaf's story
 * id into its `ANNOTATE` deps; renaming the export here MUST come with updating the
 * `storyId` over there, or the Deps link breaks silently (no build error, the click
 * just doesn't navigate).
 *
 * ⚠️ The story id changed with this merge (`atoms-navigation-seemorelink-base--*` →
 * `atoms-navigation-link-link-see-more--*`), whoever coordinates this needs to sweep
 * every `storyId` pinned to this atom (e.g. `SurfaceCard.Base`).
 */

const meta: Meta<typeof Link.SeeMore> = {
    title: "Atoms/Navigation/Link/Link.SeeMore",
    component: Link.SeeMore,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Link.SeeMore>

/** One row of the size demo table below. */
interface SizeRow {
    /** step from the `LinkSeeMoreSize` union applied to this row */
    size: LinkSeeMoreSize
    /** link text shown for this row */
    label: string
    /** short caption explaining when to reach for this size */
    hint: string
}

/** The FULL `LinkSeeMoreSize` union. */
const SIZES: Array<SizeRow> = [
    { size: "sm", label: "See more (sm)", hint: "sits beside a full section label" },
    { size: "xs", label: "See more (xs)", hint: "sits beside a small eyebrow / subtle label" },
]

/** The BARE leaf — `decorative` not on, `size` left at default. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Link.SeeMore"
                tier="atom"
                leaf="Bare link"
                reason="The one see-more affordance in the system: semibold accent text with an arrow that slides right on hover (§5b, an arrow slides, a caret would not). Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "onPress set, size default (sm)",
                        why: "Defaults to `size=sm`, rendering a real `<Link>` driven by `onPress` so the feature owns routing (for example a router push at the end of a list). Passing `href` instead renders the exact same pixels through a plain `<a>`, so `href` does not earn its own leaf.",
                        code: "<Link.SeeMore onPress={() => {}} label=\"See more\" />\n<Link.SeeMore href=\"/courses\" label=\"See all courses\" />",
                        render: <Link.SeeMore onPress={() => {}} label="See more" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `decorative` — drops its own `<a>`/`Link` tag, switches hover from self to
 * riding the parent's `group` (the parent surface is the single press target).
 */
export const Decorative: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Link.SeeMore"
                tier="atom"
                leaf="Prop `decorative`"
                reason="Set it when the whole surface around this link is already the one press target (for example a ContinueCard item), since a nested `<a>`/`<button>` there would be invalid markup, two targets fighting for one click."
                states={[
                    {
                        name: "decorative = true",
                        why: "The link drops its own `<a>`/`Link` tag and its hover fade now rides the parent's `group` state, so hovering anywhere on the bordered box below fades it in, not just the text itself. This lets a whole card act as the single press target while the link still visually reads as the affordance that closes it.",
                        code: "<div className=\"group cursor-pointer\">\n  <Link.SeeMore decorative label=\"Continue\" />\n</div>",
                        render: (
                            <div className="group w-fit cursor-pointer rounded-lg border border-default p-3">
                                <Link.SeeMore decorative label="Continue" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 2 steps, renders the FULL union in ONE leaf. */
export const Size: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Link.SeeMore"
                tier="atom"
                leaf="Prop `size`"
                reason="The link matches the text row it sits beside: sm next to a full section label, xs next to a small eyebrow, so the caller never has to eyeball a pairing."
                states={[
                    {
                        name: "size = sm | xs",
                        why: "Both sizes render side by side: only the text (and the arrow riding its line-height) scales between them, while the gap and font-weight stay put. Rendering the full union together lets a reader confirm at a glance that `sm` pairs with a full section label and `xs` pairs with a small eyebrow.",
                        code: "<Link.SeeMore size=\"sm\" onPress={() => {}} label=\"See more (sm)\" />\n<Link.SeeMore size=\"xs\" onPress={() => {}} label=\"See more (xs)\" />",
                        render: (
                            <div className="flex flex-wrap items-center gap-6">
                                {SIZES.map(({ size, label }, index) => (
                                    <Link.SeeMore
                                        key={size}
                                        size={size}
                                        onPress={() => {}}
                                        label={label}
                                        showAnatomy={index === 0}
                                    />
                                ))}
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
