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
 * ATOM — `Avatar.Base`: avatar DUY NHẤT của hệ, bọc thẳng HeroUI Avatar.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Viết lại 2026-07-26 sau khi `AvatarBase` gộp
 * DiceBear vào chuỗi fallback (xem header của `AvatarBase.tsx`):
 *
 * Bản CŨ tách 4 leaf (`Image`/`Initials`/`Fallback`/`Empty`) theo NGUỒN HÌNH —
 * đó là MỘT trục, không phải bốn — nên gộp về một leaf `Source`. Đổi lại bản cũ
 * THIẾU hẳn leaf cho `size` và `color` dù cả hai đều đẻ hình riêng (size đổi cả
 * box lẫn chấm status lẫn weight glyph; color đổi nền fallback).
 *
 * Bộ leaf mới — đúng những prop CÓ HÌNH của `AvatarBaseProps`:
 *   `Default` (trần) · `Source` (chuỗi src→generated→initials→icon, gồm cả ca
 *   src lỗi tải) · `Fallback` (chọn mặt khi không có src) · `Status` (4 tone) ·
 *   `Sizes` (3 bậc) · `Colors` (5 tint) · `Skeleton` (leaf skeleton hybrid C).
 *
 * Prop không sinh hình (`className`, `showAnatomy`) không có leaf.
 *
 * 🎨 Icon = Phosphor (§5.0), truyền COMPONENT (`icon={UserIcon}`) không JSX —
 * atom tự ép scale + weight theo `size` (§5.0a).
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

/** ĐỦ union `AvatarStatus` — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const STATUSES: Array<{ status: AvatarStatus; hint: string }> = [
    { status: "online", hint: "active right now" },
    { status: "offline", hint: "not signed in" },
    { status: "busy", hint: "in a call, do not disturb" },
    { status: "away", hint: "stepped away" },
]

/** ĐỦ union `AvatarSize`. */
const SIZES: Array<{ size: AvatarSize; hint: string }> = [
    { size: "sm", hint: "dense rows — tables, comment threads" },
    { size: "md", hint: "default — cards, lists" },
    { size: "lg", hint: "profile header, hero" },
]

/** ĐỦ union `AvatarColor`. */
const COLORS: Array<{ color: AvatarColor; hint: string }> = [
    { color: "accent", hint: "brand tint" },
    { color: "danger", hint: "something needs attention" },
    { color: "default", hint: "no meaning, plain" },
    { color: "success", hint: "positive signal" },
    { color: "warning", hint: "caution signal" },
]

/** Leaf TRẦN — chưa bật prop nào, để thấy hình mặc định. */
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
 * Leaf `Source` — trục NGUỒN HÌNH (gộp từ 4 leaf cũ). Render đủ chuỗi fallback:
 * ảnh thật → ảnh sinh (DiceBear, seed) → initials → icon, cộng ca src LỖI TẢI
 * tụt xuống ảnh sinh — năng lực vừa gộp vào, phải có mặt ở đây.
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
 * Leaf prop `fallback` — mặt khi KHÔNG có `src`. Cố ý bỏ `src` ở cả 3 ô: có
 * `src` thì cả 3 ra hình giống hệt nhau (ảnh thắng mọi fallback) ⇒ vô nghĩa.
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
 * Leaf prop `status` — chấm hiện diện. Render ĐỦ 4 tone × cả 3 size để lộ bảng
 * đường kính chấm (`SIZE_MAP.dot`: size-2 / 2.5 / 3) nếu nó lệch theo size.
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
 * Leaf prop `size` — 3 bậc, MỖI bậc kèm icon để thấy weight glyph đổi theo
 * size (§5.0a: `sm` → size-4 → `bold`; `md`/`lg` → `regular`). Không icon thì
 * không có gì để so weight.
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
 * Leaf prop `color` — tint của NỀN FALLBACK. Render đủ 5 tint × cả hai fallback
 * mà có nền (initials, icon) — `color` không chạm vào ảnh thật nên không cần
 * ô có `src`.
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
 * Leaf prop `isSkeleton` — shimmer OWNED bởi atom (hybrid C, §12c), render đủ
 * 3 size × (có `status` / không `status`).
 *
 * Atom vẽ chấm status TRUNG TÍNH (`bg-default-300`) ngay trong nhánh skeleton
 * khi `status` có set — chưa biết online/offline nên chưa tô màu trạng thái,
 * nhưng CÓ chấm là hình thật của atom lúc loading (thiếu nó thì ô "có status"
 * và "không status" ra pixel y hệt nhau, sai §D). Vì vậy hai cột mỗi hàng dưới
 * đây PHẢI khác nhau: cột phải luôn có thêm một chấm xám ở góc.
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
