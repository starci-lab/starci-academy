import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    FolderIcon,
    GraduationCapIcon,
    RocketLaunchIcon,
} from "@phosphor-icons/react"
import {
    IconTile,
    type IconTileShape,
    type IconTileSize,
    type IconTileTone,
} from "@sb-components/atoms/display/IconTile/IconTile"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `IconTile.Base`: khung avatar của một THỨ (course, project, section…).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Mỗi prop có hình một leaf, render ĐỦ mọi state
 * prop ấy sinh ra: `tone` · `size` · `shape` · `src` (ảnh cover đè icon) ·
 * `isSkeleton`. Prop không sinh hình (`alt`, `anatPart`, `className`) KHÔNG có leaf.
 *
 * ⚠️ `icon` KHÔNG có leaf riêng — nó là NỘI DUNG bắt buộc (trừ lúc skeleton), không
 * phải một trục "hình" để bật/tắt như `Chip.Base`. Icon xuất hiện xuyên suốt mọi leaf,
 * đổi tuỳ leaf để dữ liệu mẫu đọc thật, nhưng bản thân việc "có icon hay không" không
 * phải là điều component này để caller chọn (luôn có trừ khi `isSkeleton`).
 *
 * 🎨 Icon nhận COMPONENT (`icon={GraduationCapIcon}`), KHÔNG phải JSX — atom tự render
 * + tự ép scale theo `size` (§5.0). Cả ba nấc (`sm`=size-5, `md`=size-6, `lg`=size-8) đều
 * ≥ `size-5` nên atom KHÔNG truyền `weight` (§5.0a — chỉ glyph < size-5 mới cần `bold`).
 *
 * Atom có `showAnatomy` — mỗi leaf bật ở tile ĐẦU TIÊN, badge 4 part namespace: `Tile`
 * (root) · `Cover` (ảnh) · `Icon` (glyph) · `Skeleton`.
 */

/** Hướng dẫn hiện đầu trang autodocs. Chữ trên UI viết TIẾNG ANH. */
const ICON_TILE_DOC = `
## Icon or cover image

A tile fills its frame with exactly one thing. Pass \`icon\` for the default —
a bare glyph, auto-sized and coloured by \`tone\`. Add \`src\` when you have a real
thumbnail (a course cover, a project banner): the image takes over the whole
frame and the icon becomes the fallback — it reappears automatically if the
image URL 404s, so a broken asset never shows a broken-image glyph.

## Sizing

Three sizes, one box each: the icon scales with the box, so callers never pick
a glyph size themselves. \`sm\` is the default — it pairs with an empty state or
a list row; reach for \`lg\` at the top of a detail page.

## Shape

\`circle\` is the default — a tile standing alone (an empty state, the top of a
dialog) has no straight edge nearby to line up against, so round reads softer.
Switch to \`square\` when the tile sits in a grid or a row next to other
square-cornered cards.
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

/** ĐỦ union `IconTileTone` — cùng MỘT icon để tone là biến duy nhất đổi hình. */
const TONES: Array<{ tone: IconTileTone; hint: string }> = [
    { tone: "accent", hint: "the default identity colour" },
    { tone: "success", hint: "a completed or passed item" },
    { tone: "warning", hint: "needs attention before it's done" },
    { tone: "danger", hint: "blocked or failed" },
    { tone: "neutral", hint: "archived — low emphasis" },
]

/** ĐỦ union `IconTileSize`. */
const SIZES: Array<{ size: IconTileSize; hint: string }> = [
    { size: "sm", hint: "48px — the empty-state pairing" },
    { size: "md", hint: "64px — a list row or card header" },
    { size: "lg", hint: "80px — the top of a detail page" },
]

/** ĐỦ union `IconTileShape`. */
const SHAPES: Array<{ shape: IconTileShape; hint: string }> = [
    { shape: "circle", hint: "default — reads soft standing alone" },
    { shape: "square", hint: "lines up with straight edges nearby" },
]

/** Ảnh cover THẬT — deterministic (DiceBear, seed cố định), không cần asset ngoài. */
const COURSE_COVER = "https://api.dicebear.com/9.x/shapes/svg?seed=ReactPatterns"
/** URL cố tình sai đường dẫn để chứng minh nhánh fallback khi ảnh 404. */
const BROKEN_COVER = "/covers/does-not-exist.jpg"

/** Leaf TRẦN — chưa bật prop nào: `tone="accent"`, `size="sm"`, `shape="circle"`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Bare tile"
                reason="The one framed icon-tile in the system — the avatar of a course, a project, a section. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to tone=accent, size=sm (48px), shape=circle. The icon auto-sizes to the box; nothing about it is caller-controlled."
                code={"<IconTile.Base icon={GraduationCapIcon} />"}
            >
                <IconTile.Base icon={GraduationCapIcon} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — 5 Ý NGHĨA, render ĐỦ union. Icon giữ nguyên để tone là biến duy nhất. */
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

/** Leaf prop `size` — 3 bậc, render ĐỦ union. */
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

/** Leaf prop `shape` — 2 giá trị, render ĐỦ union. */
export const Shape: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Prop `shape`"
                reason="A tile standing alone (an empty state, a dialog header) has no straight edge to line up against, so circle reads softer there. Square earns its place once the tile sits inside a grid of its own kind."
                note="Only the corner radius changes — box size, tint, and icon scale stay identical between the two."
                code={`<IconTile.Base shape="circle" icon={BookOpenIcon} />
<IconTile.Base shape="square" icon={BookOpenIcon} />`}
            >
                <div className="flex flex-wrap items-center gap-4">
                    {SHAPES.map(({ shape }, index) => (
                        <IconTile.Base key={shape} shape={shape} icon={BookOpenIcon} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `src` — ảnh cover ĐÈ icon; fallback quay lại icon khi ảnh lỗi (404).
 * Render đủ BA nhánh hành vi: không src, src hợp lệ, src gãy.
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
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c), đúng cỡ + đúng shape của tile.
 *
 * Render đủ BA size (§12g ngoại lệ isSkeleton: "đủ mọi HÌNH mà chính prop đó sinh ra").
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="IconTile.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state — the tile draws its own shimmer at its own box size instead of a shared skeleton component."
                note="The shimmer keeps whatever shape/size the tile would render — the three pills below are the same sm/md/lg boxes as the Sizes leaf, just filled with shimmer instead of an icon."
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
