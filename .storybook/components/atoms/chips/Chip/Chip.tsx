import type { ComponentType, ReactNode, SVGProps } from "react"
import { Chip as HeroChip, Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"
import { Xmark, CircleFill } from "@gravity-ui/icons"
import { CHIP_TONE_TO_COLOR, type ChipTone } from "@sb-components/atoms/chips/chip-tone"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Chip.Base`: the ONE constrained chip atom over HeroUI Chip.
 *
 * Gom mọi biến thể chip vào MỘT atom, phân biệt bằng PROP (leaf = composition):
 *   • text only            → `<Chip.Base text="Draft" />`
 *   • + leading icon        → `<Chip.Base icon={CircleCheck} text="Verified" />`
 *   • + removable ×         → `<Chip.Base onRemove={fn} text="React" />`
 *
 * STRICT UI (thầy chốt 2026-07-25): `icon` nhận **COMPONENT** (function reference —
 * `icon={CircleCheck}`), KHÔNG phải ReactNode (`icon={<CircleCheck/>}`). Atom tự
 * render nó ở `size-3` (chip label scale, §4/§5) — caller KHÔNG chèn được sai size/
 * màu. `text` là nhãn, không mở children tự do. Tự sở hữu leaf skeleton (`isSkeleton`).
 *
 * Icon lib = gravity (`@gravity-ui/icons`) — gravity KHÔNG có prop `weight`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `CircleCheck`), rendered by the atom at chip scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** Props for {@link ChipBase}. */
export interface ChipBaseProps {
    /** Semantic tone → HeroUI soft color. Default `neutral`. */
    tone?: ChipTone
    /** Label text. */
    text: ReactNode
    /** Leading icon as a COMPONENT reference (not JSX). Atom renders it at `size-3`. */
    icon?: IconComponent
    /** When set → renders a trailing × and calls this on click. */
    onRemove?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    removeLabel?: string
    /** Render the leaf skeleton (a pill shimmer) instead of the chip. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The base chip atom. See file header for the strict `icon`-as-component contract.
 *
 * @param props - {@link ChipBaseProps}
 */
const ChipBase = ({
    tone = "neutral",
    text,
    icon: Icon,
    onRemove,
    removeLabel,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ChipBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — wider when removable (room for ×).
        return (
            <HeroSkeleton
                className={cn("h-7 rounded-full", onRemove ? "w-20" : "w-16", className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }
    return (
        <HeroChip color={CHIP_TONE_TO_COLOR[tone]} variant="soft" size="md" className={cn("w-fit", className)}>
            {Icon ? (
                // Atom owns the glyph scale (§4) — icon = chip label scale (size-3.5, khớp text-sm của chip).
                <span aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined} className="inline-flex shrink-0">
                    <Icon className="size-3.5" />
                </span>
            ) : null}
            <HeroChip.Label data-anat-part={showAnatomy ? "Label" : undefined}>{text}</HeroChip.Label>
            {onRemove ? (
                <button
                    type="button"
                    aria-label={removeLabel ?? "Remove"}
                    onClick={onRemove}
                    data-anat-part={showAnatomy ? "Remove" : undefined}
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition hover:bg-current/15 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-3"
                >
                    <Xmark aria-hidden />
                </button>
            ) : null}
        </HeroChip>
    )
}

/**
 * Hình của chip chấm. `pill` = viên có nền `bg-default` (chấm 6px) · `bare` = chấm
 * TRẦN + nhãn muted, không nền (chấm 12px) — dùng khi chip nằm trong một hàng dày
 * đặc (row của list) mà thêm nền sẽ thành viên-trong-viên.
 *
 * Thầy chốt 2026-07-25: trước đó bản `bare` sống thành block `DotChip` RIÊNG, tự vẽ
 * `span.rounded-full` + `Typography` — hai bảng "chấm + nhãn" nuôi song song. Gộp về
 * đây làm MỘT trục prop, `DotChip` xoá.
 */
export type ChipDotVariant = "pill" | "bare"

/** Props for {@link ChipDot}. */
export interface ChipDotProps {
    /** Label text (màu foreground ở `pill`, muted ở `bare`). */
    text: ReactNode
    /** Hình chip — viên có nền hay chấm trần. Default `"pill"`. */
    variant?: ChipDotVariant
    /**
     * Tailwind text-color class LÀM MÀU CHO DOT (vd `text-success` · `text-warning`).
     * Dot = gravity `CircleFill` ăn `currentColor` nên className quyết định màu chấm;
     * text của chip vẫn là foreground. Bỏ trống → dot theo màu text.
     */
    dotClassName?: string
    /**
     * Màu chấm dạng HEX thô (vd `#3178c6` của GitHub language colours) — khi màu KHÔNG
     * nằm trong bảng token Tailwind. Thắng `dotClassName`; cùng cơ chế `currentColor`.
     */
    dotColor?: string
    /** When set → renders a trailing × and calls this on click. */
    onRemove?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    removeLabel?: string
    /** Render the leaf skeleton (a pill shimmer) instead of the chip. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    className?: string
}

/**
 * `Chip.Dot` — chip chấm trạng thái. Hai HÌNH qua `variant`, MỘT cơ chế màu:
 *   • `pill` (mặc định) — viên `bg-default` + text foreground, chấm 6px.
 *   • `bare` — chấm 12px + nhãn muted, KHÔNG nền (chip nằm trong row dày đặc).
 *
 * MÀU CHẤM luôn đi qua `currentColor`: `dotClassName` (tailwind text-color) hoặc
 * `dotColor` (hex thô, cho màu ngoài bảng token). Chấm là icon gravity `CircleFill`,
 * KHÔNG phải span bôi background — nên hai variant dùng chung một đường màu.
 *
 * @param props - {@link ChipDotProps}
 */
const ChipDot = ({
    text,
    variant = "pill",
    dotClassName,
    dotColor,
    onRemove,
    removeLabel,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ChipDotProps) => {
    const bare = variant === "bare"
    if (isSkeleton) {
        return bare ? (
            <span className={cn("inline-flex items-center gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                <HeroSkeleton className="size-3 shrink-0 rounded-full" />
                <HeroSkeleton className="h-4 w-16 rounded" />
            </span>
        ) : (
            <HeroSkeleton
                className={cn("h-7 rounded-full", onRemove ? "w-20" : "w-16", className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }
    // Chấm — currentColor lấy từ dotClassName (tailwind text-color) hoặc dotColor (hex).
    const dot = (
        <span
            aria-hidden
            data-anat-part={showAnatomy ? "Dot" : undefined}
            className={cn("inline-flex shrink-0", dotClassName)}
            style={dotColor ? { color: dotColor } : undefined}
        >
            <CircleFill width={bare ? 12 : 6} height={bare ? 12 : 6} />
        </span>
    )
    if (bare) {
        return (
            <span className={cn("inline-flex w-fit items-center gap-2", className)}>
                {dot}
                <HeroTypography type="body-xs" color="muted" data-anat-part={showAnatomy ? "Label" : undefined}>
                    {text}
                </HeroTypography>
            </span>
        )
    }
    return (
        <HeroChip variant="soft" size="md" className={cn("bg-default text-foreground w-fit", className)}>
            {dot}
            <HeroChip.Label data-anat-part={showAnatomy ? "Label" : undefined}>{text}</HeroChip.Label>
            {onRemove ? (
                <button
                    type="button"
                    aria-label={removeLabel ?? "Remove"}
                    onClick={onRemove}
                    data-anat-part={showAnatomy ? "Remove" : undefined}
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition hover:bg-current/15 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-3"
                >
                    <Xmark aria-hidden />
                </button>
            ) : null}
        </HeroChip>
    )
}

/**
 * `Chip.*` — the chip ATOM namespace. `Chip.Base` is the single constrained chip
 * (icon / removable are LEAVES of it, prop-driven); `Chip.Dot` is the neutral
 * status-dot chip (màu chấm qua `dotClassName`).
 */
export const Chip = Object.assign(ChipBase, {
    Base: ChipBase,
    Dot: ChipDot,
})
