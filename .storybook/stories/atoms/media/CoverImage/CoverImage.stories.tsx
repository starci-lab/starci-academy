import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoverImage } from "@sb-components/atoms/media/CoverImage/CoverImage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof CoverImage> = {
    title: "Atoms/Media/CoverImage",
    component: CoverImage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CoverImage>

// Offline-safe inline cover (16:9). No external host so it renders under CSP.
const COVER_SRC =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20800%20450'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%236366f1'/%3E%3Cstop%20offset='1'%20stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='800'%20height='450'%20fill='url(%23g)'/%3E%3Ctext%20x='400'%20y='240'%20font-family='sans-serif'%20font-size='44'%20fill='white'%20text-anchor='middle'%3ECourse%20cover%2016:9%3C/text%3E%3C/svg%3E"

/**
 * Annotation SHARED across all three leaves (IconTile/PricePoint convention,
 * 2026-07-28): only `Skeleton` (a real HeroUI import, `tier: "heroui"`) earns a
 * name — `WithImage`/`NoImage` render a BARE div/img with no sub-part that's a
 * real component worth naming, so the Deps tab for those two leaves is naturally
 * empty (same as `IconTile`'s `Tile`/`Cover`). Do NOT self-declare a `"CoverImage"`
 * key pointing at the root itself — that's an anti-pattern already removed
 * (precedent: `Spinner.Base` self-declaring a part pointing at itself, caught by
 * the teacher on 2026-07-26).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Skeleton": { tier: "heroui", role: "the SAME aspect-video/rounded-2xl footprint, shimmering — no `<img>` mounted while the source is loading" },
}

export const WithImage: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CoverImage"
                tier="atom"
                leaf="Prop `src` (set)"
                reason="A cover holds a fixed 16:9 slot in a card. When `src` resolves, the frame mounts a lazy-loaded `object-cover` image inside the SAME footprint the empty state and the shimmer already reserved, so nothing jumps."
                annotate={ANNOTATE}
                states={[
                    {
                        name: "src set",
                        why: "The frame mounts a lazy-loaded `<img>` that fills the box via `object-cover`, so any source aspect crops cleanly into the fixed 16:9 slot.",
                        code: "<CoverImage src={COVER_SRC} alt=\"Course cover image\" />",
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <CoverImage src={COVER_SRC} alt="Course cover image" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const NoImage: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CoverImage"
                tier="atom"
                leaf="Prop `src` (unset)"
                reason="A cover can't assume the caller always has a real asset yet (e.g. a course still missing its thumbnail) — the frame stays the same rounded 16:9 surface, just empty, instead of collapsing or showing a broken-image glyph."
                annotate={ANNOTATE}
                states={[
                    {
                        name: "src = null",
                        why: "No `<img>` mounts — the frame renders as a bare rounded surface at the same footprint, so the layout doesn't reflow once a real cover lands.",
                        code: "<CoverImage src={null} alt=\"No cover image yet\" />",
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <CoverImage src={null} alt="No cover image yet" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CoverImage"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="A cover holds a fixed 16:9 slot in a card whether or not the image has arrived yet — the shimmer keeps that exact footprint so the layout doesn't jump once `src` resolves."
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The frame shimmers at the same aspect-video/rounded-2xl box the real image or the empty state would occupy. No `anatPart` is passed from this top-level story (this leaf is the ROOT of its own tree, not nested in a parent), so the atom self-badges the lone box as `Skeleton` via its `showAnatomy` fallback.",
                        code: "<CoverImage isSkeleton alt=\"Course cover image\" />",
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <CoverImage isSkeleton alt="Course cover image" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
