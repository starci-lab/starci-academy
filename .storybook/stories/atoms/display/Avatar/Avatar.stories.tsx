import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserIcon } from "@phosphor-icons/react"
import {
    Avatar,
    type AvatarColor,
    type AvatarSize,
    type AvatarStatus,
} from "@sb-components/atoms/display/Avatar/Avatar"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Avatar.Base`: the system's ONE avatar, wrapping HeroUI Avatar directly.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Rewritten 2026-07-26 after `AvatarBase` folded
 * DiceBear into its fallback chain (see the header of `AvatarBase.tsx`):
 *
 * The OLD version split 4 leaves (`Image`/`Initials`/`Fallback`/`Empty`) by IMAGE
 * SOURCE — that's ONE axis, not four — so they fold into one `Source` leaf.
 * In exchange, the old version was flat-out MISSING a leaf for `size` and `color`
 * even though both produce their own shape (size changes the box, the status dot,
 * and the glyph weight; color changes the fallback background).
 *
 * The new leaf set — exactly the props of `AvatarBaseProps` that HAVE a shape:
 *   `Default` (bare) · `Source` (the src→generated→initials→icon chain, including
 *   the failed-load-src case) · `Fallback` (which face to show without a src) ·
 *   `Status` (4 tones) · `Sizes` (3 tiers) · `Colors` (5 tints) · `Skeleton`
 *   (skeleton leaf, hybrid C).
 *
 * A prop that produces no shape (`className`, `showAnatomy`) gets no leaf.
 *
 * 🎨 Icon = Phosphor (§5.0), pass the COMPONENT (`icon={UserIcon}`) not JSX —
 * the atom forces the scale + weight itself based on `size` (§5.0a).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const meta: Meta<typeof Avatar.Base> = {
    title: "Atoms/Display/Avatar/Avatar.Base",
    component: Avatar.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Avatar.Base>

// A real photo already in use elsewhere in the app — no new asset needed.
const REAL_IMG = "https://i.pravatar.cc/150?img=12"
// Guaranteed 404 — used to prove the fallback chain steps down after a load error.
const BROKEN_IMG = "https://example.com/nope.png"
// Stable identity for the generated (DiceBear) face — same seed, same face everywhere.
const SEED = "mai.chi@starci.vn"
const NAME = "Mai Chi"

/** One row of the `status` demo table. */
interface StatusRow {
    /** The status value this row demonstrates. */
    status: AvatarStatus
    /** Human-readable meaning of the status, shown next to the demo cell. */
    hint: string
}

/** FULL `AvatarStatus` union — missing a value means it sprouts as a stray leaf elsewhere. */
const STATUSES: Array<StatusRow> = [
    { status: "online", hint: "active right now" },
    { status: "offline", hint: "not signed in" },
    { status: "busy", hint: "in a call, do not disturb" },
    { status: "away", hint: "stepped away" },
]

/** One row of the `size` demo table. */
interface SizeRow {
    /** The size value this row demonstrates. */
    size: AvatarSize
    /** Human-readable use case for this size, shown next to the demo cell. */
    hint: string
}

/** FULL `AvatarSize` union. */
const SIZES: Array<SizeRow> = [
    { size: "sm", hint: "dense rows — tables, comment threads" },
    { size: "md", hint: "default — cards, lists" },
    { size: "lg", hint: "profile header, hero" },
]

/** One row of the `color` demo table. */
interface ColorRow {
    /** The color value this row demonstrates. */
    color: AvatarColor
    /** Human-readable meaning of the color, shown next to the demo cell. */
    hint: string
}

/** FULL `AvatarColor` union. */
const COLORS: Array<ColorRow> = [
    { color: "accent", hint: "brand tint" },
    { color: "danger", hint: "something needs attention" },
    { color: "default", hint: "no meaning, plain" },
    { color: "success", hint: "positive signal" },
    { color: "warning", hint: "caution signal" },
]

/** BARE leaf — no prop turned on yet, to show the default shape. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Bare avatar"
                reason="The one avatar in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="No src, no name, no icon — the atom still has to draw something, so it falls through to fallback=&quot;generated&quot; and asks DiceBear for a face using its built-in placeholder seed. Size defaults to md, no status dot."
                code={"<Avatar.Base />"}
            >
                <Avatar.Base showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf `Source` — the IMAGE-SOURCE axis (folded from 4 old leaves). Renders the
 * full fallback chain: real photo → generated face (DiceBear, seed) → initials →
 * icon, plus the FAILED-LOAD src case stepping down to the generated face — the
 * capability just folded in, so it has to show up here.
 */
export const Source: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Source chain"
                reason="An avatar tries harder before it gives up: a real photo, then a generated face so the person still looks like someone, then initials, then a plain icon. Which step you land on depends on what data you actually have."
                note="The broken-image cell is the one that used to be missing: HeroUI/Radix only mounts the <img> after it loads, so the atom listens for the load error instead and steps down to the generated face — not straight to initials."
                code={`<Avatar.Base src="${REAL_IMG}" name="Mai Chi" />
<Avatar.Base seed="mai.chi@starci.vn" name="Mai Chi" />
<Avatar.Base name="Mai Chi" fallback="initials" />
<Avatar.Base icon={UserIcon} fallback="icon" />
<Avatar.Base src="https://example.com/nope.png" seed="mai.chi@starci.vn" name="Mai Chi" />`}
            >
                <div className="flex flex-wrap items-end gap-4">
                    <Avatar.Base src={REAL_IMG} name={NAME} showAnatomy />
                    <Avatar.Base seed={SEED} name={NAME} />
                    <Avatar.Base name={NAME} fallback="initials" />
                    <Avatar.Base icon={UserIcon} fallback="icon" />
                    <Avatar.Base src={BROKEN_IMG} seed={SEED} name={NAME} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `fallback` — the face shown when there is NO `src`. `src` is
 * deliberately dropped in all 3 cells: WITH a `src`, all three would render the
 * same picture (the photo beats every fallback) ⇒ meaningless.
 */
export const Fallback: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Prop `fallback`"
                reason="This prop only matters when there is no photo — it decides how far down the chain the avatar is allowed to fall. Leave it alone and you get the generated face; turn it off when you need a plain, non-identifying mark."
                note="No src on any of these three — with a real photo present all three would render the same picture, which would say nothing about the prop."
                code={`<Avatar.Base fallback="generated" name="Mai Chi" />
<Avatar.Base fallback="initials" name="Mai Chi" />
<Avatar.Base fallback="icon" icon={UserIcon} />`}
            >
                <div className="flex flex-wrap items-end gap-4">
                    <Avatar.Base fallback="generated" name={NAME} showAnatomy />
                    <Avatar.Base fallback="initials" name={NAME} />
                    <Avatar.Base fallback="icon" icon={UserIcon} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `status` — the presence dot. Renders ALL 4 tones × all 3 sizes to
 * expose the dot-diameter table (`SIZE_MAP.dot`: size-2 / 2.5 / 3) if it drifts by size.
 */
export const Status: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Prop `status`"
                reason="The dot tells the reader whether this person is reachable right now, without them opening a profile. It sits at the same corner and scales with the avatar at every size."
                note="Each row is one status shown at all three sizes — the dot diameter is supposed to grow with the avatar (size-2 → 2.5 → 3); a row that looks the same size throughout means that table drifted."
                code={`<Avatar.Base src="${REAL_IMG}" name="Mai Chi" status="online" size="sm" />
<Avatar.Base src="${REAL_IMG}" name="Mai Chi" status="offline" size="md" />
<Avatar.Base src="${REAL_IMG}" name="Mai Chi" status="busy" size="lg" />
<Avatar.Base src="${REAL_IMG}" name="Mai Chi" status="away" />`}
            >
                <div className="flex flex-col gap-4">
                    {STATUSES.map(({ status }, statusIndex) => (
                        <div key={status} className="flex items-end gap-4">
                            {SIZES.map(({ size }, sizeIndex) => (
                                <Avatar.Base
                                    key={size}
                                    src={REAL_IMG}
                                    name={NAME}
                                    status={status}
                                    size={size}
                                    showAnatomy={statusIndex === 0 && sizeIndex === 0}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `size` — 3 tiers, EACH tier carries an icon so the glyph weight can
 * be seen changing with size (§5.0a: `sm` → size-4 → `bold`; `md`/`lg` →
 * `regular`). Without an icon there's nothing to compare the weight against.
 */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="Three presets cover every place an avatar shows up — a dense row, a default card, a profile header — and the atom owns the exact pixels, so no call-site ever picks a size in between."
                note="Every cell carries the same fallback icon on purpose: the box grows across sm/md/lg, and so does the glyph's stroke weight — the sm glyph is bold to survive being drawn small, md/lg switch to regular."
                code={`<Avatar.Base icon={UserIcon} size="sm" />
<Avatar.Base icon={UserIcon} size="md" />
<Avatar.Base icon={UserIcon} size="lg" />`}
            >
                <div className="flex items-end gap-4">
                    {SIZES.map(({ size }, sizeIndex) => (
                        <Avatar.Base key={size} icon={UserIcon} size={size} showAnatomy={sizeIndex === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `color` — the tint of the FALLBACK BACKGROUND. Renders all 5 tints ×
 * both fallbacks that have a background (initials, icon) — `color` never touches
 * a real photo, so no cell needs a `src`.
 */
export const Colors: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Prop `color`"
                reason="Color only paints the fallback surface — it gives an initials or icon avatar a bit of identity when there is no photo to carry it. A photographed avatar ignores it entirely, which is why every cell below has no src."
                note="Two rows, same five tints: the top row is initials, the bottom is the icon fallback — proving the tint applies to the surface, not to the glyph or the letters drawn on it."
                code={`<Avatar.Base color="accent" name="Mai Chi" fallback="initials" />
<Avatar.Base color="danger" name="Mai Chi" fallback="initials" />
<Avatar.Base color="default" name="Mai Chi" fallback="initials" />
<Avatar.Base color="success" name="Mai Chi" fallback="initials" />
<Avatar.Base color="warning" name="Mai Chi" fallback="initials" />

<Avatar.Base color="accent" icon={UserIcon} fallback="icon" />
<Avatar.Base color="danger" icon={UserIcon} fallback="icon" />
<Avatar.Base color="default" icon={UserIcon} fallback="icon" />
<Avatar.Base color="success" icon={UserIcon} fallback="icon" />
<Avatar.Base color="warning" icon={UserIcon} fallback="icon" />`}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-end gap-4">
                        {COLORS.map(({ color }, colorIndex) => (
                            <Avatar.Base
                                key={color}
                                color={color}
                                name={NAME}
                                fallback="initials"
                                showAnatomy={colorIndex === 0}
                            />
                        ))}
                    </div>
                    <div className="flex items-end gap-4">
                        {COLORS.map(({ color }) => (
                            <Avatar.Base key={color} color={color} icon={UserIcon} fallback="icon" />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer OWNED by the atom (hybrid C, §12c), renders
 * all 3 sizes × (with `status` / without `status`).
 *
 * The atom draws a NEUTRAL status dot (`bg-default-300`) right inside the
 * skeleton branch when `status` is set — it doesn't know online/offline yet so
 * it doesn't paint a state color, but HAVING a dot is the atom's real loading
 * shape (without it, the "has status" and "no status" cells would render
 * identical pixels, violating §D). So the two columns in every row below MUST
 * differ: the right column always carries an extra gray dot in the corner.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Avatar.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the avatar draws its own shimmer instead of a shared skeleton wrapper — a circle sized to match the size it will resolve to, plus a neutral dot when a status will eventually show."
                note="Each row is one size, no-status vs status-set: the status column always carries an extra neutral gray dot at the corner, even before we know whether the person is online — the two cells are never identical, which is what keeps the footprint from jumping once real data (and its real status colour) lands."
                code={`<Avatar.Base isSkeleton size="sm" />
<Avatar.Base isSkeleton size="sm" status="online" />
<Avatar.Base isSkeleton size="md" />
<Avatar.Base isSkeleton size="md" status="online" />
<Avatar.Base isSkeleton size="lg" />
<Avatar.Base isSkeleton size="lg" status="online" />`}
            >
                <div className="flex flex-col gap-4">
                    {SIZES.map(({ size }, sizeIndex) => (
                        <div key={size} className="flex items-end gap-4">
                            <Avatar.Base isSkeleton size={size} showAnatomy={sizeIndex === 0} />
                            <Avatar.Base isSkeleton size={size} status="online" />
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}
