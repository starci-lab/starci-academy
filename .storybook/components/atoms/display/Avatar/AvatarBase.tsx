"use client"

import { useMemo, useState } from "react"
import type { ComponentType, SVGProps } from "react"
import { Avatar as HeroAvatar, AvatarImage as HeroAvatarImage, AvatarFallback as HeroAvatarFallback, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Avatar.Base`: the ONE constrained avatar atom over HeroUI Avatar.
 *
 * Gộp 2026-07-26: atom này trước có bộ khung (size/status/color/isSkeleton) nhưng
 * THIẾU DiceBear; atom anh em `UserAvatar` có DiceBear + xử lý ảnh lỗi nhưng trần
 * trụi không bộ khung. Thầy chốt DiceBear là MẶT MẶC ĐỊNH — gộp năng lực về đây,
 * `UserAvatar` bị xoá.
 *
 * Chuỗi fallback ĐÚNG thứ tự (atom sở hữu §4):
 *   ảnh thật (`src`) → ảnh sinh (DiceBear, seed `seed ?? name`) → initials(`name`) → icon
 *
 * Prop `fallback` chọn MẶT khi không có `src`:
 *   • `"generated"` (default) — DiceBear vào chuỗi ảnh; hết ảnh mới rớt initials/icon.
 *   • `"initials"` / `"icon"` — DiceBear KHÔNG vào chuỗi ảnh, atom bỏ qua bước ảnh
 *     sinh và hiện thẳng initials/icon.
 *
 * ⭐ Chuỗi ảnh tụt chặng khi ảnh LỖI TẢI, không chỉ khi thiếu URL (port từ
 * `UserAvatar` cũ): HeroUI/Radix chỉ mount `<img>` sau khi load xong nên `onError`
 * trên phần tử không bao giờ bắn — phải nghe `onLoadingStatusChange` thay vào đó.
 *
 * Atom tự ép size (sm/md/lg), tự vẽ status-dot + leaf skeleton (`isSkeleton`, hybrid
 * C). Icon nhận **COMPONENT** (`icon={UserIcon}`), KHÔNG JSX — atom render trong
 * Fallback.
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

/**
 * Mặt hiện khi KHÔNG có `src` — `"generated"` (DiceBear, mặc định) đưa ảnh sinh vào
 * chuỗi ứng viên; `"initials"`/`"icon"` bỏ qua bước ảnh sinh, hiện thẳng chữ/glyph.
 */
export type AvatarFallback = "generated" | "initials" | "icon"

export const STATUS_TONE: Record<AvatarStatus, string> = {
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
export const SIZE_MAP: Record<AvatarSize, { box: string; dot: string; glyph: string; glyphWeight?: IconWeight }> = {
    sm: { box: "size-8", dot: "size-2", glyph: "size-4", glyphWeight: "bold" },
    md: { box: "size-10", dot: "size-2.5", glyph: "size-5" },
    lg: { box: "size-12", dot: "size-3", glyph: "size-6" },
}

/**
 * Sinh URL avatar DiceBear "thumbs" ổn định từ một seed — cùng seed thì cùng mặt ở
 * mọi nơi. Mirror của `src/utils/avatar.ts#dicebearAvatarUrl` — chép tại chỗ thay
 * vì `import` từ `@/` để atom Storybook tự đủ (self-contained).
 *
 * @param seed - chuỗi định danh ổn định (email/username ưu tiên, rồi tới name)
 * @returns URL ảnh SVG DiceBear
 */
export const dicebearAvatarUrl = (seed: string): string =>
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed || "anonymous")}`

/** Props for {@link AvatarBase}. */
export interface AvatarBaseProps {
    /** Uploaded image URL. Absent → the atom falls back per `fallback`. */
    src?: string
    /**
     * Stable identity used to seed the generated (DiceBear) avatar — email or
     * username, so the same person always gets the same generated face. Falls
     * back to `name` when omitted.
     */
    seed?: string
    /** Display name: drives image `alt` + the initials fallback (first two letters). */
    name?: string
    /** Fallback glyph as a COMPONENT reference (shown per the `fallback` chain). */
    icon?: IconComponent
    /** What to show when there is no `src`. Default `"generated"` (DiceBear). */
    fallback?: AvatarFallback
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
export const AvatarBase = ({
    src,
    seed,
    name,
    icon: Icon,
    fallback = "generated",
    status,
    size = "md",
    color = "default",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: AvatarBaseProps) => {
    const { box, dot, glyph, glyphWeight } = SIZE_MAP[size]

    // §12c: isSkeleton xét TRƯỚC mọi nhánh rẽ hình — leaf skeleton OWNED bởi atom
    // (hybrid C), circle khớp size box, không đụng tới chuỗi ứng viên ảnh bên dưới.
    // ⭐ Vẫn giữ wrapper `relative` + vẫn vẽ chấm status: chấm là HÌNH THẬT của atom
    // lúc loading (không phải nội dung), thiếu nó thì ô "có status" và ô "không
    // status" ra pixel y hệt nhau. Tone chấm lúc skeleton TRUNG TÍNH (`bg-default-300`)
    // — chưa có dữ liệu thì chưa biết online hay không, không đoán màu trạng thái.
    if (isSkeleton) {
        return (
            <span className={cn("relative inline-flex", className)}>
                <HeroSkeleton className={cn("rounded-full", box)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                {status ? (
                    <span
                        aria-hidden
                        data-anat-part={showAnatomy ? "Status" : undefined}
                        className={cn("ring-background absolute bottom-0 right-0 rounded-full ring-2", dot, "bg-default-300")}
                    />
                ) : null}
            </span>
        )
    }

    // Chuỗi ứng viên ẢNH, đúng thứ tự: src (nếu có) → DiceBear sinh từ seed ?? name.
    // fallback="initials"/"icon" ⇒ KHÔNG đưa DiceBear vào chuỗi (chỉ còn src, nếu có).
    const candidates = useMemo(() => {
        const uploaded = src?.trim()
        if (fallback !== "generated") return uploaded ? [uploaded] : []
        const generated = dicebearAvatarUrl(seed ?? name ?? "")
        return uploaded ? [uploaded, generated] : [generated]
    }, [src, seed, name, fallback])

    // Index ứng viên đang thử; tụt chặng khi ảnh LỖI TẢI, không chỉ khi thiếu URL
    // (port từ `UserAvatar` cũ). HeroUI/Radix chỉ mount `<img>` sau khi load xong nên
    // `onError` trên phần tử không bao giờ bắn — nghe `onLoadingStatusChange` thay vào.
    // Keyed theo "signature" của chuỗi ứng viên nên đổi src/seed/name/fallback → reset về 0.
    const signature = candidates.join("|")
    const [state, setState] = useState({ signature, index: 0 })
    const index = state.signature === signature ? state.index : 0
    const imageSrc = candidates[index]

    // Hết ứng viên ảnh → initials hay icon. fallback="icon" ưu tiên glyph ngay;
    // các trường hợp còn lại ưu tiên initials, hết `name` (initials rỗng) mới rớt
    // xuống icon — giữ đúng chuỗi cũ (ảnh → initials → icon) khi fallback mặc định.
    const initials = (name ?? "").trim().slice(0, 2).toUpperCase()
    const iconGlyph = Icon ? (
        <span aria-hidden className="inline-flex">
            <Icon className={glyph} weight={glyphWeight} />
        </span>
    ) : null
    const fallbackContent = fallback === "icon" && iconGlyph ? iconGlyph : initials || iconGlyph

    return (
        // Relative wrapper so the status dot can anchor to the avatar's bottom-right corner.
        <span className={cn("relative inline-flex", className)}>
            <HeroAvatar size={size} color={color} className="rounded-full" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                {imageSrc ? (
                    <HeroAvatarImage
                        src={imageSrc}
                        alt={name ?? ""}
                        data-anat-part={showAnatomy ? "Image" : undefined}
                        onLoadingStatusChange={(loadStatus) => {
                            if (loadStatus === "error") {
                                setState({ signature, index: index + 1 })
                            }
                        }}
                    />
                ) : null}
                <HeroAvatarFallback data-anat-part={showAnatomy ? "Fallback" : undefined}>{fallbackContent}</HeroAvatarFallback>
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
