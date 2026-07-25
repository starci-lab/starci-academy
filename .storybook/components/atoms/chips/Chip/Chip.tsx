import type { ComponentType, ReactNode, SVGProps } from "react"
import { Chip as HeroChip, Skeleton as HeroSkeleton, Typography as HeroTypography, cn } from "@heroui/react"
import { XIcon, CircleIcon } from "@phosphor-icons/react"
import { CHIP_TONE_TO_COLOR, type ChipTone } from "@sb-components/atoms/chips/chip-tone"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Chip.Base`: the ONE constrained chip atom over HeroUI Chip.
 *
 * Gom mọi biến thể chip vào MỘT atom, phân biệt bằng PROP (leaf = composition):
 *   • text only            → `<Chip.Base text="Draft" />`
 *   • + leading icon        → `<Chip.Base icon={CheckCircleIcon} text="Verified" />`
 *   • + removable ×         → `<Chip.Base onRemove={fn} text="React" />`
 *
 * STRICT UI (thầy chốt 2026-07-25): `icon` nhận **COMPONENT** (function reference —
 * `icon={CheckCircleIcon}`), KHÔNG phải ReactNode (`icon={<CheckCircleIcon/>}`). Atom tự
 * render nó ở `size-3` (chip label scale, §4/§5) — caller KHÔNG chèn được sai size/
 * màu. `text` là nhãn, không mở children tự do. Tự sở hữu leaf skeleton (`isSkeleton`).
 *
 * Icon lib = **`@phosphor-icons/react`**, MỘT BỘ DUY NHẤT (§5⃣0) — không trộn lib
 * trong cùng một màn. Icon ở đây nhỏ hơn `size-5` nên atom tự áp `weight="bold"`
 * (§5⃣0a: nét mảnh đi khi thu nhỏ → nặng weight lên để bù).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * An icon passed as a COMPONENT (e.g. `CheckCircleIcon`), rendered by the atom at chip scale.
 *
 * Kiểu để MỞ (`SVGProps` + `weight` tuỳ chọn), KHÔNG khai `Icon` của Phosphor — khai chặt
 * theo một thư viện là khoá cả cây vào một nhà cung cấp (§5⃣0). `weight` có mặt để ATOM tự
 * áp luật §5⃣0a lên icon caller đưa vào; chỉ HAI nấc `regular`/`bold`.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** Props chung — TRỪ cặp `text`/`isSkeleton`, xem {@link ChipBaseProps}. */
interface ChipBaseOwnProps {
    /** Semantic tone → HeroUI soft color. Default `neutral`. */
    tone?: ChipTone
    /** Leading icon as a COMPONENT reference (not JSX). Atom renders it at `size-3.5` + `weight="bold"`. */
    icon?: IconComponent
    /** When set → renders a trailing × and calls this on click. */
    onRemove?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    removeLabel?: string
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * `text` BẮT BUỘC khi render chip thật, KHÔNG cần khi `isSkeleton` — pill shimmer
 * không có nhãn. Cùng khuôn với `TypographyProps`.
 */
export type ChipBaseProps = ChipBaseOwnProps &
    (
        | { isSkeleton: true; text?: ReactNode }
        | { isSkeleton?: false; text: ReactNode }
    )

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
                // Nhỏ hơn size-5 ⇒ weight="bold" để nét không mảnh đi (§5⃣0a).
                <span aria-hidden data-anat-part={showAnatomy ? "Icon" : undefined} className="inline-flex shrink-0">
                    <Icon className="size-3.5" weight="bold" />
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
                    {/* × bị ép size-3 (< size-5) ⇒ weight="bold" (§5⃣0a). */}
                    <XIcon aria-hidden weight="bold" />
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
     * Dot = Phosphor `CircleIcon weight="fill"` ăn `currentColor` nên className quyết định màu chấm;
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
 * `dotColor` (hex thô, cho màu ngoài bảng token). Chấm là icon Phosphor `CircleIcon`
 * (`weight="fill"`), KHÔNG phải span bôi background — nên hai variant dùng chung một đường màu.
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
            {/* Chấm ĐẶC = `CircleIcon weight="fill"` (Phosphor không có bản `*Fill` riêng);
                fill mặc định = `currentColor` nên đường màu ở span cha giữ nguyên. */}
            <CircleIcon weight="fill" width={bare ? 12 : 6} height={bare ? 12 : 6} />
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
                    {/* × bị ép size-3 (< size-5) ⇒ weight="bold" (§5⃣0a). */}
                    <XIcon aria-hidden weight="bold" />
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
