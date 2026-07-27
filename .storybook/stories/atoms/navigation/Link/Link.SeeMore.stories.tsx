import type { Meta, StoryObj } from "@storybook/nextjs"
import { Link, type LinkSeeMoreSize } from "@sb-components/atoms/navigation/Link/Link"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Link.SeeMore`: the system's ONE "See more →" / "Continue →" affordance,
 * shared by `SurfaceCard`'s header (`onSeeMore`) and `ContinueCard`'s item CTA
 * (`decorative`).
 *
 * 2026-07-26: merged from `SeeMoreLink.Base` into the `Link.*` namespace alongside
 * `Link.Back` (§12a) — two shapes of the same "text-link + arrow" concept.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). `decorative` and `size` have visual form → each gets
 * its own leaf, rendering the FULL union. `label` is TEXT (§12g.2) so it has NO leaf of
 * its own — every other leaf still has to pass it. Props with no visual form
 * (`className`, `showAnatomy`, `anatPart`) get NO leaf.
 *
 * ⚠️ `onPress` has NO leaf of its own — whether or not there's a handler, the text +
 * arrow are identical, only the press behavior changes (not pixels). `href` is the same:
 * it changes the rendered TAG (`<a>` instead of HeroUI `Link`) but does NOT change pixels
 * (§12g.1 — the "tag change ≠ visual change" test), so there's NO separate `WithHref`
 * leaf; calling with `href` only shows up in the Code tab of the bare leaf.
 *
 * 🔗 The bare leaf is named `Default` (renamed from `OnPress` on 2026-07-26 — `onPress`
 * has no visual form so it can't name a leaf). `SurfaceCard.Base` pins this leaf's story
 * id into its `ANNOTATE` deps; renaming the export here MUST come with updating the
 * `storyId` over there, or the Deps link breaks silently (no build error, the click
 * just doesn't navigate).
 *
 * ⚠️ The story id changed with this merge (`atoms-navigation-seemorelink-base--*` →
 * `atoms-navigation-link-link-see-more--*`) — whoever coordinates this needs to sweep
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

/** The FULL `LinkSeeMoreSize` union. */
const SIZES: Array<{ size: LinkSeeMoreSize; label: string; hint: string }> = [
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
                reason="The one see-more affordance in the system — semibold accent text with an arrow that slides right on hover (§5b: an arrow slides, a caret would not). Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to `size=sm`, a real `<Link>` driven by `onPress` — the feature owns routing (e.g. a router push at the end of a list). `href` renders the exact same pixels through a plain `<a>` instead, so it does not earn its own leaf."
                code={`<Link.SeeMore onPress={() => {}} label="See more" />
<Link.SeeMore href="/courses" label="See all courses" />`}
            >
                <Link.SeeMore onPress={() => {}} label="See more" showAnatomy />
            </BlockAnatomy>
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
                reason="Set it when the whole surface around this link is already the one press target (e.g. a ContinueCard item) — a nested `<a>`/`<button>` there would be invalid markup, two targets fighting for one click."
                note="No cursor-pointer of its own, and the fade rides the parent's `group` hover instead of its own — hover anywhere on the bordered box below, not just on the text."
                code={`<div className="group cursor-pointer">
  <Link.SeeMore decorative label="Continue" />
</div>`}
            >
                <div className="group w-fit cursor-pointer rounded-lg border border-default p-3">
                    <Link.SeeMore decorative label="Continue" showAnatomy />
                </div>
            </BlockAnatomy>
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
                reason="The link matches the text row it sits beside — `sm` next to a full section label, `xs` next to a small eyebrow — so the caller never has to eyeball a pairing."
                note="Only the text (and the arrow riding its line-height) scales; the gap and font-weight stay put."
                code={`<Link.SeeMore size="sm" onPress={() => {}} label="See more (sm)" />
<Link.SeeMore size="xs" onPress={() => {}} label="See more (xs)" />`}
            >
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
            </BlockAnatomy>
        </div>
    ),
}
