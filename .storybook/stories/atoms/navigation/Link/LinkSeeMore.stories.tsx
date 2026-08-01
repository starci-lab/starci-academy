import type { Meta, StoryObj } from "@storybook/nextjs"
import { LinkSeeMore } from "@sb-components/atoms/navigation/Link/Link"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `LinkSeeMore`: the system's ONE "See more →" / "Continue →" affordance,
 * shared by `SurfaceCard`'s header (`onSeeMore`) and `ContinueCard`'s item CTA
 * (`decorative`).
 *
 * 2026-07-26: merged from `SeeMoreLink.Base` into the `Link.*` namespace alongside
 * `LinkBack` (§12a), two shapes of the same "text-link + arrow" concept.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). `decorative` and `size` have visual form → each gets
 * its own leaf, rendering the FULL union. `label` is TEXT (§12g.2) so it has NO leaf of
 * its own — every other leaf still has to pass it. Props with no visual form
 * (`className`) get NO leaf.
 *
 * ⚠️ `onPress` has NO leaf of its own — whether or not there's a handler, the text +
 * arrow are identical, only the press behavior changes (not pixels). `href` is the same:
 * it changes the rendered TAG (`<a>` instead of HeroUI `Link`) but does NOT change pixels
 * (§12g.1, the "tag change ≠ visual change" test), so there's NO separate `WithHref`
 * leaf; calling with `href` only shows up in the Code tab of the bare leaf.
 *
 * 🔗 The bare leaf is named `Default` (renamed from `OnPress` on 2026-07-26, `onPress`
 * has no visual form so it can't name a leaf). `SurfaceCard` pins this leaf's story
 * id into its `ANNOTATE` deps; renaming the export here MUST come with updating the
 * `storyId` over there, or the Deps link breaks silently (no build error, the click
 * just doesn't navigate).
 *
 * ⚠️ The story id changed with this merge (`atoms-navigation-seemorelink-base--*` →
 * `atoms-navigation-link-link-see-more--*`), whoever coordinates this needs to sweep
 * every `storyId` pinned to this atom (e.g. `SurfaceCard`).
 *
 * `annotate` (2026-07-27, heroui tier added to canon): the root is HeroUI `Link`
 * ONLY on the `onPress`/no-`href`/non-`decorative` branch — that's the only branch
 * tagged `"Link"` (tier heroui) in `ANNOTATE` below. The `href` branch renders a
 * plain `<a>` and the `decorative` branch a plain `<span>`; neither is a real HeroUI
 * or system component, so neither gets a fallback tag (Rule 1 — a node's name must
 * match what's actually rendered, not a role).
 */

const meta: Meta<typeof LinkSeeMore> = {
    title: "Atoms/Navigation/Link/LinkSeeMore",
    component: LinkSeeMore,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LinkSeeMore>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Link: { tier: "heroui", role: "the see-more affordance itself, on the onPress/interactive branch" },
}

/** The BARE leaf — `decorative` not on, `size` left at default. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LinkSeeMore"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Bare link"
                reason="The one see-more affordance in the system: semibold accent text with an arrow that slides right on hover (§5b, an arrow slides, a caret would not). Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "onPress set, size default (sm)",
                        why: "Defaults to `size=sm`, rendering a real `<Link>` driven by `onPress` so the feature owns routing (for example a router push at the end of a list). Passing `href` instead renders the exact same pixels through a plain `<a>`, so `href` does not earn its own leaf.",
                        code: "<LinkSeeMore onPress={() => {}} label=\"See more\" />\n<LinkSeeMore href=\"/courses\" label=\"See all courses\" />",
                        render: <LinkSeeMore onPress={() => {}} label="See more" />,
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LinkSeeMore"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `decorative`"
                reason="Set it when the whole surface around this link is already the one press target (for example a ContinueCard item), since a nested `<a>`/`<button>` there would be invalid markup, two targets fighting for one click."
                states={[
                    {
                        name: "decorative = true",
                        why: "The link drops its own `<a>`/`Link` tag and its hover fade now rides the parent's `group` state, so hovering anywhere on the bordered box below fades it in, not just the text itself. This lets a whole card act as the single press target while the link still visually reads as the affordance that closes it.",
                        code: "<div className=\"group cursor-pointer\">\n  <LinkSeeMore decorative label=\"Continue\" />\n</div>",
                        render: (
                            <div data-tier="fixture" className="group w-fit cursor-pointer rounded-lg border border-default p-3">
                                <LinkSeeMore decorative label="Continue" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 2 steps, each its own state tab. */
export const Size: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LinkSeeMore"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="The link matches the text row it sits beside: sm next to a full section label, xs next to a small eyebrow, so the caller never has to eyeball a pairing."
                states={[
                    {
                        name: "size = sm",
                        why: "Renders the see-more link at its default sm size, the arrow riding the text's line-height. This is the size to reach for when the link sits beside a full section label.",
                        code: "<LinkSeeMore size=\"sm\" onPress={() => {}} label=\"See more (sm)\" />",
                        render: (
                            <LinkSeeMore
                                size="sm"
                                onPress={() => {}}
                                label="See more (sm)"
                               
                            />
                        ),
                    },
                    {
                        name: "size = xs",
                        why: "Renders the see-more link a step smaller, the text and arrow both shrinking together while the font-weight stays put. This is the size to reach for when the link sits beside a small eyebrow or subtle label.",
                        code: "<LinkSeeMore size=\"xs\" onPress={() => {}} label=\"See more (xs)\" />",
                        render: (
                            <LinkSeeMore
                                size="xs"
                                onPress={() => {}}
                                label="See more (xs)"
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
