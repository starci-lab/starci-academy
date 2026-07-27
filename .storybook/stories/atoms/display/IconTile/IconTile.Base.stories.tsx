import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    FolderIcon,
    GraduationCapIcon,
    RocketLaunchIcon,
} from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `IconTile.Base`: the avatar frame of a THING (course, project, section…).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Every prop has one leaf, rendering EVERY state
 * that prop produces: `tone` · `size` · `src` (a cover image over the icon) ·
 * `isSkeleton`. A prop that produces no visual (`alt`, `anatPart`, `className`)
 * has NO leaf.
 *
 * ⚠️ REMOVED 2026-07-26: the `shape` axis (`circle`/`square`) + the `Shape` leaf.
 * No consumer in the design tree ever passed `shape` — a choice nobody made.
 * The tile is now ALWAYS round (teacher decided).
 *
 * ⚠️ `icon` has NO leaf of its own — it's REQUIRED CONTENT (except while skeleton),
 * not a "visual" axis to toggle like `Chip.Base`. The icon appears throughout every
 * leaf, changing per leaf so the sample data reads real, but "having an icon or
 * not" itself isn't something this component leaves for the caller to choose
 * (always present unless `isSkeleton`).
 *
 * 🎨 The icon takes a COMPONENT (`icon={GraduationCapIcon}`), NOT JSX — the atom
 * renders it and forces its own scale per `size` (§5.0). All three steps
 * (`sm`=size-5, `md`=size-6, `lg`=size-8) are ≥ `size-5`, so the atom does NOT pass
 * `weight` (§5.0a — only a glyph < size-5 needs `bold`).
 *
 * The atom has `showAnatomy` — each leaf turns it on at the FIRST tile. `Tile`
 * (root div) · `Cover` (the `<img>`) · `Icon` (the caller's glyph) are plain
 * elements/arbitrary content, not fixed importable components, so none of them
 * gets a name in `annotate` (§ naming pass, 2026-07-28) — only `Skeleton`
 * (a direct HeroUI import) is a real, nameable node, `tier: "heroui"`.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Skeleton: {
        tier: "heroui",
        role: "the resting shimmer box, drawn in place of the tile while isSkeleton is on",
    },
}

/** Guide shown at the top of the autodocs page. UI-facing text is written in ENGLISH. */
const ICON_TILE_DOC = `
## Icon or cover image

A tile fills its frame with exactly one thing. Pass \`icon\` for the default —
a bare glyph, auto-sized and coloured by \`tone\`. Add \`src\` when you have a real
thumbnail (a course cover, a project banner): the image takes over the whole
frame and the icon becomes the fallback — it reappears automatically if the
image URL 404s, so a broken asset never shows a broken-image glyph.

## Sizing

Three sizes, one box each: the icon scales with the box, so callers never pick
a glyph size themselves. \`sm\` (40px) is the default — it pairs with a
\`TitledText\` row or an empty state; reach for \`lg\` at the top of a detail page.

## Shape

Always round. There is no shape axis to pick: a tile usually stands on its own
(an empty state, the head of a row) with no straight edge nearby to line up
against, so round reads softer everywhere it appears.
`

const meta: Meta<typeof IconTile.Base> = {
    title: "Atoms/Display/IconTile/IconTile.Base",
    component: IconTile.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: ICON_TILE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof IconTile.Base>

/** A REAL cover image — deterministic (DiceBear, fixed seed), no external asset needed. */
const COURSE_COVER = "https://api.dicebear.com/9.x/shapes/svg?seed=ReactPatterns"
/** A URL deliberately pointed wrong to prove the fallback branch when the image 404s. */
const BROKEN_COVER = "/covers/does-not-exist.jpg"

/** BARE leaf — no prop turned on yet: `tone="accent"`, `size="sm"`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Bare tile"
                annotate={ANNOTATE}
                reason="The one framed icon-tile in the system, the avatar of a course, a project, a section. Every leaf below it differs by exactly one prop, so this is the baseline every other leaf is compared against."
                states={[
                    {
                        name: "tone = \"accent\", size = \"sm\"",
                        why: "A round tile renders at 40px with the accent tint and the graduation-cap glyph centred inside it. The frame is always round, there is no shape axis to pick, and the icon auto-sizes to the box with nothing caller-controlled.",
                        code: "<IconTile.Base icon={GraduationCapIcon} />",
                        render: <IconTile.Base icon={GraduationCapIcon} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `tone` — 5 MEANINGS, rendering the FULL union. The icon stays the same so tone is the only variable. */
export const Tones: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Prop `tone`"
                annotate={ANNOTATE}
                reason="Tone is meaning, not decoration. A project tile that is always accent reads as neutral identity; switching it to danger says something happened to that project, without adding a separate badge."
                states={[
                    {
                        name: "tone = \"accent\"",
                        why: "The tile lands on a soft accent tint, the default identity colour used when nothing special has happened to the thing it represents. Every other tone below keeps the same folder glyph and only swaps this tint.",
                        code: "<IconTile.Base tone=\"accent\" icon={FolderIcon} />",
                        render: <IconTile.Base tone="accent" icon={FolderIcon} showAnatomy />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "The tile lands on a soft success tint, the colour used for a completed or passed item. Only the tint differs from the accent state.",
                        code: "<IconTile.Base tone=\"success\" icon={FolderIcon} />",
                        render: <IconTile.Base tone="success" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The tile lands on a soft warning tint, for a thing that needs attention before it counts as done. Only the tint differs from the accent state.",
                        code: "<IconTile.Base tone=\"warning\" icon={FolderIcon} />",
                        render: <IconTile.Base tone="warning" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The tile lands on a soft danger tint, for a thing that is blocked or has failed. Only the tint differs from the accent state.",
                        code: "<IconTile.Base tone=\"danger\" icon={FolderIcon} />",
                        render: <IconTile.Base tone="danger" icon={FolderIcon} />,
                    },
                    {
                        name: "tone = \"neutral\"",
                        why: "The tile lands on a soft neutral tint, the low-emphasis colour for something archived. Only the tint differs from the accent state.",
                        code: "<IconTile.Base tone=\"neutral\" icon={FolderIcon} />",
                        render: <IconTile.Base tone="neutral" icon={FolderIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — 3 steps, rendering the FULL union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="The tile owns its own scale (§4). A caller never pins a pixel box or picks the glyph size separately, it just names which of the three sizes this spot needs, and the icon inside grows with the box automatically."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The frame renders at 40px, the step that pairs with a TitledText row or sits inside a compact empty state. The rocket glyph inside scales down to match the smaller frame.",
                        code: "<IconTile.Base size=\"sm\" icon={RocketLaunchIcon} />",
                        render: <IconTile.Base size="sm" icon={RocketLaunchIcon} showAnatomy />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The frame steps up to 64px, the size reached for in a list row or a card header. The glyph grows along with the frame so the pairing never looks off.",
                        code: "<IconTile.Base size=\"md\" icon={RocketLaunchIcon} />",
                        render: <IconTile.Base size="md" icon={RocketLaunchIcon} />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The frame reaches 80px, the size for the top of a detail page where the tile carries more visual weight on its own. The glyph again grows to match.",
                        code: "<IconTile.Base size=\"lg\" icon={RocketLaunchIcon} />",
                        render: <IconTile.Base size="lg" icon={RocketLaunchIcon} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `src` — a cover image OVERRIDES the icon; falls back to the icon when
 * the image fails (404). Renders all THREE behavior branches: no src, valid src,
 * broken src.
 */
export const CoverImage: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Prop `src`"
                annotate={ANNOTATE}
                reason="Once a thing has a real thumbnail, a course cover, a project banner, the image should carry the identity instead of a generic glyph. The icon stays underneath as the safety net for whenever that image is missing or broken."
                states={[
                    {
                        name: "src = undefined",
                        why: "With no `src` passed, the tile falls back to its plain icon glyph on the tinted background. This is the same bare tile every other leaf in this file starts from.",
                        code: "<IconTile.Base icon={BookOpenIcon} />",
                        render: <IconTile.Base icon={BookOpenIcon} size="lg" showAnatomy />,
                    },
                    {
                        name: "src = valid cover URL",
                        why: "The image fills the whole frame and the icon glyph disappears completely behind it. The cover takes over the tile's identity the moment a real thumbnail exists.",
                        code: `<IconTile.Base icon={BookOpenIcon} src="${COURSE_COVER}" alt="React Patterns course cover" />`,
                        render: (
                            <IconTile.Base
                                icon={BookOpenIcon}
                                size="lg"
                                src={COURSE_COVER}
                                alt="React Patterns course cover"
                            />
                        ),
                    },
                    {
                        name: "src = broken/404 URL",
                        why: "The image request fails and the tile falls back to the same icon glyph as the no-src state instead of showing a broken-image icon. A failed thumbnail therefore never looks different from having no thumbnail at all.",
                        code: `<IconTile.Base icon={BookOpenIcon} src="${BROKEN_COVER}" alt="Broken cover" />`,
                        render: <IconTile.Base icon={BookOpenIcon} size="lg" src={BROKEN_COVER} alt="Broken cover" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c), exact size + same rounding
 * as the tile.
 *
 * Renders all THREE sizes (§12g's isSkeleton exception: "every SHAPE that prop
 * itself produces").
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state, so the tile draws its own shimmer at its own box size instead of borrowing a shared skeleton component."
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\"",
                        why: "A round shimmer fills the same 40px circle the real icon would occupy, with no glyph drawn inside it. The size this shimmer commits to matches exactly what the real tile will render once data lands.",
                        code: "<IconTile.Base isSkeleton size=\"sm\" />",
                        render: <IconTile.Base isSkeleton size="sm" showAnatomy />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\"",
                        why: "The shimmer circle grows to the 64px box, matching the md size step exactly. Nothing else about the shimmer changes across the three sizes.",
                        code: "<IconTile.Base isSkeleton size=\"md\" />",
                        render: <IconTile.Base isSkeleton size="md" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"lg\"",
                        why: "The shimmer circle reaches the 80px box, matching the lg size step exactly. This is the largest resting shape the tile ever commits to before data arrives.",
                        code: "<IconTile.Base isSkeleton size=\"lg\" />",
                        render: <IconTile.Base isSkeleton size="lg" />,
                    },
                ]}
            />
        </div>
    ),
}
