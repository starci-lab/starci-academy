import type { ComponentType, ReactNode, SVGProps } from "react"
import { Chip as HeroChip, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { Xmark, CircleFill } from "@gravity-ui/icons"
import { CHIP_TONE_TO_COLOR, type ChipTone } from "../chip-tone"

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

/** Props for {@link ChipDot}. */
export interface ChipDotProps {
    /** Label text (màu foreground). */
    text: ReactNode
    /**
     * Tailwind text-color class LÀM MÀU CHO DOT (vd `text-success` · `text-warning`).
     * Dot = gravity `CircleFill` ăn `currentColor` nên className quyết định màu chấm;
     * text của chip vẫn là foreground. Bỏ trống → dot theo màu text.
     */
    dotClassName?: string
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
 * `Chip.Dot` — neutral chip (bg-default · text foreground) với chấm trạng thái dẫn
 * đầu (gravity `CircleFill` width 6). MÀU CHẤM đi qua `dotClassName` (tailwind
 * text-color, ăn `currentColor`) — như ví dụ status-dot của HeroUI, nhưng chấm là
 * icon gravity, không phải span màu. Body chip trung tính để chấm nói lên trạng thái.
 *
 * @param props - {@link ChipDotProps}
 */
const ChipDot = ({ text, dotClassName, onRemove, removeLabel, isSkeleton = false, showAnatomy = false, className }: ChipDotProps) => {
    if (isSkeleton) {
        return (
            <HeroSkeleton
                className={cn("h-7 rounded-full", onRemove ? "w-20" : "w-16", className)}
                data-anat-part={showAnatomy ? "Skeleton" : undefined}
            />
        )
    }
    return (
        <HeroChip variant="soft" size="md" className={cn("bg-default text-foreground w-fit", className)}>
            {/* Chấm trạng thái — currentColor lấy từ dotClassName (tailwind text-color). */}
            <span aria-hidden data-anat-part={showAnatomy ? "Dot" : undefined} className={cn("inline-flex shrink-0", dotClassName)}>
                <CircleFill width={6} height={6} />
            </span>
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
export const Chip = {
    Base: ChipBase,
    Dot: ChipDot,
}
