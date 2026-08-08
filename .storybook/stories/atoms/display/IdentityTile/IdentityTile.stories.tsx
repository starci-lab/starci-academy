import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    FolderIcon,
    GraduationCapIcon,
    RocketLaunchIcon,
} from "@phosphor-icons/react"
import { IdentityTile } from "@sb-components/atoms/display/IdentityTile/IdentityTile"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `IdentityTile`: the squared identity frame of a thing (course, project,
 * section…). Distinct from circular `IconTile`.
 *
 * One prop = one leaf: `tone` · `size` · `src` · `isSkeleton`. The icon takes a
 * component (`icon={GraduationCapIcon}`), not JSX.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Skeleton": {
        tier: "heroui",
        role: "the resting shimmer box, drawn in place of the tile while isSkeleton is on",
    },
}

/** Guide shown at the top of the autodocs page. UI-facing text is written in ENGLISH. */
const IDENTITY_TILE_DOC = `
## Icon or cover image

A tile fills its frame with exactly one thing. Pass \`icon\` for the default —
a bare glyph, auto-sized and coloured by \`tone\`. Add \`src\` when you have a real
thumbnail (a course cover, a project banner): the image takes over the whole
frame and the icon becomes the fallback — it reappears automatically if the
image URL 404s, so a broken asset never shows a broken-image glyph.

## Sizing

Three sizes, one box each: the icon scales with the box, so callers never pick
a glyph size themselves. \`md\` (64px, rounded-2xl) is the default — the list-row
and card-header step; \`sm\` is 48px with rounded-xl; \`lg\` is 80px with rounded-2xl.

## Shape

Always a soft square (xl / 2xl by size). There is no shape axis: this is the
entity identity mark, not the circular glyph atom (\`IconTile\`).
`

const meta: Meta<typeof IdentityTile> = {
    title: "Atoms/Display/IdentityTile/IdentityTile",
    component: IdentityTile,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: IDENTITY_TILE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof IdentityTile>

/** A REAL cover image — deterministic (DiceBear, fixed seed), no external asset needed. */
const COURSE_COVER = "https://api.dicebear.com/9.x/shapes/svg?seed=ReactPatterns"
/** A URL deliberately pointed wrong to prove the fallback branch when the image 404s. */
const BROKEN_COVER = "/covers/does-not-exist.jpg"

/** BARE leaf — no prop turned on yet: `tone="accent"`, `size="md"`. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IdentityTile"
                tier="atom"
                leaf="Bare tile"
                annotate={ANNOTATE}
                reason="The squared identity tile in the system — the avatar of a course, a project, a section. Every leaf below it differs by exactly one prop, so this is the baseline every other leaf is compared against."
                states={[
                    {
                        name: "tone = \"accent\", size = \"md\"",
                        why: "A soft-square tile renders at 64px with rounded-2xl, the accent tint, and the graduation-cap glyph centred inside it. The icon auto-sizes to the box with nothing caller-controlled.",
                        code: "<IdentityTile icon={GraduationCapIcon} />",
                        render: <IdentityTile icon={GraduationCapIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `tone` — 5 MEANINGS, rendering the FULL union. */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IdentityTile"
                tier="atom"
                leaf="Prop `tone`"
                annotate={ANNOTATE}
                reason="Tone is meaning, not decoration. A project tile that is always accent reads as neutral identity; switching it to danger says something happened to that project, without adding a separate badge."
                states={[
                    {
                        name: "tone = \"accent\"",
                        why: "The tile lands on a soft accent tint, the default identity colour used when nothing special has happened to the thing it represents.",
                        code: "<IdentityTile tone=\"accent\" icon={FolderIcon} />",
                        render: <IdentityTile tone="accent" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "The tile lands on a soft success tint, the colour used for a completed or passed item.",
                        code: "<IdentityTile tone=\"success\" icon={FolderIcon} />",
                        render: <IdentityTile tone="success" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The tile lands on a soft warning tint, for a thing that needs attention before it counts as done.",
                        code: "<IdentityTile tone=\"warning\" icon={FolderIcon} />",
                        render: <IdentityTile tone="warning" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The tile lands on a soft danger tint, for a thing that is blocked or has failed.",
                        code: "<IdentityTile tone=\"danger\" icon={FolderIcon} />",
                        render: <IdentityTile tone="danger" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"neutral\"",
                        why: "The tile lands on a soft neutral tint, the low-emphasis colour for something archived.",
                        code: "<IdentityTile tone=\"neutral\" icon={FolderIcon} />",
                        render: <IdentityTile tone="neutral" icon={FolderIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 3 steps, rendering the FULL union. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IdentityTile"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="The tile owns its own scale. A caller never pins a pixel box or picks the glyph size separately — it names which of the three sizes this spot needs, and the icon inside grows with the box automatically."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The frame renders at 48px with rounded-xl, the compact identity step for dense rows.",
                        code: "<IdentityTile size=\"sm\" icon={RocketLaunchIcon} />",
                        render: <IdentityTile size="sm" icon={RocketLaunchIcon} />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The frame steps up to 64px with rounded-2xl, the size reached for in a list row or a card header.",
                        code: "<IdentityTile size=\"md\" icon={RocketLaunchIcon} />",
                        render: <IdentityTile size="md" icon={RocketLaunchIcon} />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The frame reaches 80px with rounded-2xl, the size for the top of a detail page where the tile carries more visual weight on its own.",
                        code: "<IdentityTile size=\"lg\" icon={RocketLaunchIcon} />",
                        render: <IdentityTile size="lg" icon={RocketLaunchIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `src` — a cover image OVERRIDES the icon; falls back to the icon when
 * the image fails (404).
 */
export const CoverImage: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IdentityTile"
                tier="atom"
                leaf="Prop `src`"
                annotate={ANNOTATE}
                reason="Once a thing has a real thumbnail, the image should carry the identity instead of a generic glyph. The icon stays underneath as the safety net for whenever that image is missing or broken."
                states={[
                    {
                        name: "src = undefined",
                        why: "With no `src` passed, the tile falls back to its plain icon glyph on the tinted background.",
                        code: "<IdentityTile icon={BookOpenIcon} size=\"lg\" />",
                        render: <IdentityTile icon={BookOpenIcon} size="lg" />,
                    },
                    {
                        name: "src = valid cover URL",
                        why: "The image fills the whole frame and the icon glyph disappears completely behind it.",
                        code: `<IdentityTile icon={BookOpenIcon} src="${COURSE_COVER}" alt="React Patterns course cover" />`,
                        render: (
                            <IdentityTile
                                icon={BookOpenIcon}
                                size="lg"
                                src={COURSE_COVER}
                                alt="React Patterns course cover"
                            />
                        ),
                    },
                    {
                        name: "src = broken/404 URL",
                        why: "The image request fails and the tile falls back to the same icon glyph as the no-src state instead of showing a broken-image icon.",
                        code: `<IdentityTile icon={BookOpenIcon} src="${BROKEN_COVER}" alt="Broken cover" />`,
                        render: (
                            <IdentityTile
                                icon={BookOpenIcon}
                                size="lg"
                                src={BROKEN_COVER}
                                alt="Broken cover"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — shimmer co-located at exact size + radius. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IdentityTile"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state, so the tile draws its own shimmer at its own box size and radius instead of borrowing a shared skeleton component."
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\"",
                        why: "A soft-square shimmer fills the same 48px rounded-xl box the real icon would occupy.",
                        code: "<IdentityTile isSkeleton size=\"sm\" />",
                        render: <IdentityTile isSkeleton size="sm" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\"",
                        why: "The shimmer grows to the 64px rounded-2xl box, matching the md size step exactly.",
                        code: "<IdentityTile isSkeleton size=\"md\" />",
                        render: <IdentityTile isSkeleton size="md" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"lg\"",
                        why: "The shimmer reaches the 80px rounded-2xl box, matching the lg size step exactly.",
                        code: "<IdentityTile isSkeleton size=\"lg\" />",
                        render: <IdentityTile isSkeleton size="lg" />,
                    },
                ]}
            />
        </div>
    ),
}
