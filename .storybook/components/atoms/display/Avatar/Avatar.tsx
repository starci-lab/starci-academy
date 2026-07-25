import type { ComponentType, SVGProps } from "react"
import { Avatar as HeroAvatar, AvatarImage as HeroAvatarImage, AvatarFallback as HeroAvatarFallback, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Avatar.Base`: the ONE constrained avatar atom over HeroUI Avatar.
 *
 * Gom mọi biến thể avatar vào MỘT atom, phân biệt bằng PROP (leaf = composition):
 *   • ảnh thật             → `<Avatar.Base src="…" name="Mai" />`
 *   • initials fallback     → `<Avatar.Base name="Mai Chi" />` (không src → 2 chữ cái)
 *   • icon fallback         → `<Avatar.Base icon={UserIcon} />` (không src/name → glyph)
 *   • + status dot          → `<Avatar.Base src="…" status="online" />`
 *
 * Chuỗi fallback ĐÚNG thứ tự (atom sở hữu §4): ảnh → initials(name) → icon. Atom tự
 * ép size (sm/md/lg), tự vẽ status-dot + leaf skeleton (`isSkeleton`, hybrid C).
 * Icon nhận **COMPONENT** (`icon={UserIcon}`), KHÔNG JSX — atom render trong Fallback.
 *
 * Icon lib = `@phosphor-icons/react` — MỘT BỘ DUY NHẤT (§5.0), không trộn lib khác.
 * Weight theo size (§5.0a): glyph `size-5` trở lên → `regular` (KHÔNG truyền
 * `weight`); glyph nhỏ hơn `size-5` (avatar `sm` → `size-4`) → `weight="bold"` để
 * bù nét mảnh đi khi thu nhỏ. Atom tự suy weight từ `size`, consumer không đặt.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Bề dày nét icon (§5.0a) — CHỈ hai nấc, atom tự chọn theo `size`.
 * Khai tại chỗ thay vì import `IconWeight` của phosphor: khai kiểu của một thư
 * viện là khoá cả cây vào một nhà cung cấp (§5.0a).
 */
export type IconWeight = "regular" | "bold"

/**
 * An icon passed as a COMPONENT (e.g. `UserIcon`), rendered by the atom at avatar scale.
 * Kiểu giữ nguyên `SVGProps` (không phụ thuộc lib), chỉ nới thêm `weight` để atom
 * bù nét ở cỡ nhỏ.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Presence status → status-dot tone (the SINGLE source for status colour). */
export type AvatarStatus = "online" | "offline" | "busy" | "away"

/** Avatar size preset. */
export type AvatarSize = "sm" | "md" | "lg"

/** Fallback tint when initials/icon show (HeroUI avatar `color`). */
export type AvatarColor = "accent" | "danger" | "default" | "success" | "warning"

const STATUS_TONE: Record<AvatarStatus, string> = {
    online: "bg-success",
    offline: "bg-default-400",
    busy: "bg-danger",
    away: "bg-warning",
}

/**
 * Per-size chrome: skeleton box · status-dot diameter · fallback glyph scale + weight.
 *
 * `glyphWeight` theo §5.0a: `size-4` (< `size-5`) phải `bold`, từ `size-5` trở lên
 * để `regular` — `undefined` nghĩa là KHÔNG truyền prop `weight` (dùng mặc định).
 */
const SIZE_MAP: Record<AvatarSize, { box: string; dot: string; glyph: string; glyphWeight?: IconWeight }> = {
    sm: { box: "size-8", dot: "size-2", glyph: "size-4", glyphWeight: "bold" },
    md: { box: "size-10", dot: "size-2.5", glyph: "size-5" },
    lg: { box: "size-12", dot: "size-3", glyph: "size-6" },
}

/** Props for {@link AvatarBase}. */
export interface AvatarBaseProps {
    /** Uploaded image URL. Absent → the atom falls back to initials, then icon. */
    src?: string
    /** Display name: drives image `alt` + the initials fallback (first two letters). */
    name?: string
    /** Fallback glyph as a COMPONENT reference (shown only when there is no src AND no name). */
    icon?: IconComponent
    /** When set → renders a presence dot at the bottom-right, tinted by status. */
    status?: AvatarStatus
    /** Size preset. Default `md`. */
    size?: AvatarSize
    /** Fallback tint (initials/icon). Default `default`. */
    color?: AvatarColor
    /** Render the leaf skeleton (a circle shimmer) instead of the avatar. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The base avatar atom. See file header for the strict fallback-chain + icon contract.
 *
 * @param props - {@link AvatarBaseProps}
 */
const AvatarBase = ({
    src,
    name,
    icon: Icon,
    status,
    size = "md",
    color = "default",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: AvatarBaseProps) => {
    const { box, dot, glyph, glyphWeight } = SIZE_MAP[size]
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — a circle matched to the size box.
        return <HeroSkeleton className={cn("rounded-full", box, className)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
    }
    const initials = (name ?? "").trim().slice(0, 2).toUpperCase()
    return (
        // Relative wrapper so the status dot can anchor to the avatar's bottom-right corner.
        <span className={cn("relative inline-flex", className)}>
            <HeroAvatar size={size} color={color} className="rounded-full" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                {src ? <HeroAvatarImage src={src} alt={name ?? ""} data-anat-part={showAnatomy ? "Image" : undefined} /> : null}
                <HeroAvatarFallback data-anat-part={showAnatomy ? "Fallback" : undefined}>
                    {initials ? (
                        initials
                    ) : Icon ? (
                        <span aria-hidden className="inline-flex">
                            <Icon className={glyph} weight={glyphWeight} />
                        </span>
                    ) : null}
                </HeroAvatarFallback>
            </HeroAvatar>
            {status ? (
                <span
                    aria-hidden
                    data-anat-part={showAnatomy ? "Status" : undefined}
                    className={cn(
                        "ring-background absolute bottom-0 right-0 rounded-full ring-2",
                        dot,
                        STATUS_TONE[status],
                    )}
                />
            ) : null}
        </span>
    )
}

/* ───────────────────────── Avatar.Group ─────────────────────────────────────
 * Cụm avatar chồng mép ("who follows"): hàng avatar viền `ring` + chip "+N" đếm
 * phần dư. Khung `blocks/identity/AvatarGroup` xoá 2026-07-25 (§13c — chỉ là
 * atom mặc áo), năng lực chuyển XUỐNG đây thành MEMBER của atom.
 *
 *   • §12b — `items` DỮ LIỆU, cấm `children`; atom tự dựng từng `Avatar.Base`.
 *   • §12d — `size` đặt ở CẤP CỤM (hàng avatar luôn đồng cỡ), item không mang size.
 *   • §12c — `isSkeleton` truyền xuống, mỗi item tự mirror → giữ nguyên footprint.
 * ─────────────────────────────────────────────────────────────────────────── */

/** One avatar in an {@link AvatarGroup} row. */
export interface AvatarGroupItem {
    /** Stable key for the list. */
    key: string
    /** Uploaded image URL. Absent → initials from `name`, then `icon`. */
    src?: string
    /** Display name: image `alt` + the initials fallback. */
    name?: string
    /** Fallback glyph as a COMPONENT reference (only when no `src` and no `name`). */
    icon?: IconComponent
}

/** Props for {@link AvatarGroup}. */
export interface AvatarGroupProps {
    /** Avatars in display order. */
    items: Array<AvatarGroupItem>
    /** How many avatars to show before the "+N" overflow chip. Default `5`. */
    max?: number
    /**
     * Real total the row stands for — drives "+N" when the caller only loaded the
     * first page of members. Defaults to `items.length`.
     */
    total?: number
    /** Size preset for EVERY avatar in the row (§12d, cluster-level). Default `sm`. */
    size?: AvatarSize
    /** Render the row skeleton — each visible slot mirrors as a circle shimmer. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/** Ring that separates one overlapping avatar from the one beneath it. */
const GROUP_RING = "rounded-full ring-2 ring-background"

/**
 * Overlapping avatar row with an optional "+N" overflow chip.
 *
 * @param props - {@link AvatarGroupProps}
 */
const AvatarGroup = ({
    items,
    max = 5,
    total,
    size = "sm",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: AvatarGroupProps) => {
    const visible = items.slice(0, max)
    const extra = Math.max((total ?? items.length) - visible.length, 0)

    return (
        <div className={cn("flex -space-x-2", className)}>
            {visible.map((item) => (
                // One badge per MEMBER (§11a): the row names each avatar as ONE opaque
                // part instead of drilling into Avatar.Base's own Image/Fallback parts.
                <span key={item.key} className="inline-flex" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                    <AvatarBase
                        src={item.src}
                        name={item.name}
                        icon={item.icon}
                        size={size}
                        isSkeleton={isSkeleton}
                        className={GROUP_RING}
                    />
                </span>
            ))}
            {extra > 0 ? (
                // "+N" is a COUNT, not a person — rendered here rather than through
                // Avatar.Base, whose initials fallback would clip "+12" to "+1".
                <HeroAvatar size={size} className={GROUP_RING} data-anat-part={showAnatomy ? "Overflow" : undefined}>
                    <HeroAvatarFallback>+{extra}</HeroAvatarFallback>
                </HeroAvatar>
            ) : null}
        </div>
    )
}

/**
 * `Avatar.*` — the avatar ATOM namespace. `Avatar.Base` is the single constrained
 * avatar (image / initials / icon / status are LEAVES of it, prop-driven);
 * `Avatar.Group` is the overlapping row of them (+ "+N" overflow).
 */
export const Avatar = Object.assign(AvatarBase, {
    Base: AvatarBase,
    Group: AvatarGroup,
})
