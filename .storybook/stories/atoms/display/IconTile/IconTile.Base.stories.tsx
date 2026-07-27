import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    FolderIcon,
    GraduationCapIcon,
    RocketLaunchIcon,
} from "@phosphor-icons/react"
import {
    IconTile,
    type IconTileSize,
    type IconTileTone,
} from "@sb-components/atoms/display/IconTile/IconTile"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 * The atom has `showAnatomy` — each leaf turns it on at the FIRST tile, badging 4
 * namespaced parts: `Tile` (root) · `Cover` (image) · `Icon` (glyph) · `Skeleton`.
 */

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

/** FULL `IconTileTone` union — the SAME icon throughout so tone is the only variable changing the visual. */
const TONES: Array<{ tone: IconTileTone; hint: string }> = [
    { tone: "accent", hint: "the default identity colour" },
    { tone: "success", hint: "a completed or passed item" },
    { tone: "warning", hint: "needs attention before it's done" },
    { tone: "danger", hint: "blocked or failed" },
    { tone: "neutral", hint: "archived — low emphasis" },
]

/** FULL `IconTileSize` union. */
const SIZES: Array<{ size: IconTileSize; hint: string }> = [
    { size: "sm", hint: "40px — pairs with a TitledText row" },
    { size: "md", hint: "64px — a list row or card header" },
    { size: "lg", hint: "80px — the top of a detail page" },
]

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
                reason="The one framed icon-tile in the system — the avatar of a course, a project, a section. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to `tone=accent`, `size=sm` (40px). The frame is always round — there is no shape axis to pick. The icon auto-sizes to the box; nothing about it is caller-controlled."
                code={"<IconTile.Base icon={GraduationCapIcon} />"}
            >
                <IconTile.Base icon={GraduationCapIcon} showAnatomy />
            </BlockAnatomy>
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
                reason="Tone is meaning, not decoration. A project tile that is always accent reads as neutral identity; switching it to danger says something happened to that project, without adding a badge."
                note="Every tone lands on the same soft tint — one step of opacity over its own colour, same recipe as Chip.Base's soft surface."
                code={`<IconTile.Base tone="accent" icon={FolderIcon} />
<IconTile.Base tone="success" icon={FolderIcon} />
<IconTile.Base tone="warning" icon={FolderIcon} />
<IconTile.Base tone="danger" icon={FolderIcon} />
<IconTile.Base tone="neutral" icon={FolderIcon} />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {TONES.map(({ tone }, index) => (
                        <IconTile.Base key={tone} tone={tone} icon={FolderIcon} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
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
                reason="The tile owns its own scale (§4) — a caller never pins a pixel box or picks the glyph size separately; it just says which of the three sizes this spot needs."
                note="The icon inside grows with the box (§12d) — sm/md/lg carry their own glyph size, so the pairing never looks off."
                code={`<IconTile.Base size="sm" icon={RocketLaunchIcon} />
<IconTile.Base size="md" icon={RocketLaunchIcon} />
<IconTile.Base size="lg" icon={RocketLaunchIcon} />`}
            >
                <div className="flex flex-wrap items-end gap-4">
                    {SIZES.map(({ size }, index) => (
                        <IconTile.Base key={size} size={size} icon={RocketLaunchIcon} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
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
                reason="Once a thing has a real thumbnail — a course cover, a project banner — the image should carry the identity instead of a generic glyph. The icon stays as the safety net."
                note="A failed image request (404, unsynced asset) falls back to the icon instead of a broken-image glyph — the middle and right tiles here both start from the same broken URL/no-URL state and land on the same icon."
                code={`<IconTile.Base icon={BookOpenIcon} />
<IconTile.Base icon={BookOpenIcon} src="${COURSE_COVER}" alt="React Patterns course cover" />
<IconTile.Base icon={BookOpenIcon} src="${BROKEN_COVER}" alt="Broken cover" />`}
            >
                <div className="flex flex-wrap items-center gap-4">
                    <IconTile.Base icon={BookOpenIcon} size="lg" showAnatomy />
                    <IconTile.Base
                        icon={BookOpenIcon}
                        size="lg"
                        src={COURSE_COVER}
                        alt="React Patterns course cover"
                    />
                    <IconTile.Base icon={BookOpenIcon} size="lg" src={BROKEN_COVER} alt="Broken cover" />
                </div>
            </BlockAnatomy>
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
                reason="Whoever owns the shape owns its resting state — the tile draws its own shimmer at its own box size instead of a shared skeleton component."
                note="The shimmer keeps whatever size the tile would render — the three circles below are the same `sm`/`md`/`lg` boxes as the Sizes leaf, just filled with shimmer instead of an icon."
                code={`<IconTile.Base isSkeleton size="sm" />
<IconTile.Base isSkeleton size="md" />
<IconTile.Base isSkeleton size="lg" />`}
            >
                <div className="flex flex-wrap items-end gap-4">
                    {SIZES.map(({ size }, index) => (
                        <IconTile.Base key={size} isSkeleton size={size} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
