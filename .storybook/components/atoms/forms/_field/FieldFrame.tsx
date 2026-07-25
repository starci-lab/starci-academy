import type { ReactNode } from "react"
import { Label, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM-INTERNAL — `FieldFrame`: the label · hint · control · error SCAFFOLD that
 * every form atom composes so the atom itself IS the full field (thầy chốt
 * 2026-07-25: "label/errorMessage tính vào atom", KHÔNG tách Field primitive).
 *
 * Self-contained in the atom layer (chỉ HeroUI — KHÔNG import blocks/, vì atom là
 * tầng thấp nhất). Owns the vertical rhythm (`flex flex-col gap-1.5`): label trên,
 * hint dưới label, control, dòng lỗi cuối — và mirror đúng hình khi `isSkeleton`.
 *
 * "Trần" mode: khi KHÔNG có label/hint/errorMessage/required (và không skeleton),
 * FieldFrame render THẲNG children — zero wrapper, để atom vẫn dùng làm ô trần
 * lồng trong thứ khác.
 *
 * Anatomy parts (§11a — atom tự badge phần trực tiếp): Label · Description ·
 * Error. Ô control tự badge phần của nó (`Field`/`Skeleton`) — FieldFrame KHÔNG
 * badge wrapper Control để tránh nest 2 tầng badge.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface FieldFrameProps {
    /** Nhãn trên control (`text-sm font-medium`). Bỏ trống → không nhãn. */
    label?: ReactNode
    /** Mô tả dưới nhãn (`text-xs text-muted`) — LUÔN hiện (khác errorMessage). */
    hint?: ReactNode
    /** Dòng lỗi dưới control (`text-sm text-danger`) — set → field invalid. */
    errorMessage?: ReactNode
    /** Thêm dấu `*` (text-danger) sau nhãn. */
    isRequired?: boolean
    /** Nhạt nhãn (khoá control là việc của atom). */
    isDisabled?: boolean
    /** Mirror loading: label-width skeleton trên control-skeleton, giữ đúng cột. */
    isSkeleton?: boolean
    /** Control-shaped skeleton khi `isSkeleton` (atom truyền hộp của chính nó). */
    skeletonControl?: ReactNode
    /**
     * Control thật (ô HeroUI đã bọc). Ngoại lệ hợp lệ §12b (atom-WRAPPER thật):
     * `FieldFrame` là khung bọc, phải nhận NGUYÊN control tuỳ ý của atom gọi nó
     * (Input/Select/Choice/…) — không thể thay bằng prop dữ liệu vì control không
     * phải "nội dung" mà là một cây component hoàn chỉnh.
     */
    children?: ReactNode
    /** `id` control để `htmlFor` nhãn trỏ đúng — atom truyền cùng id xuống control. */
    id?: string
    /** Class ngoài cột. */
    className?: string
    /** Storybook: badge Label/Description/Control/Error cho BlockAnatomy. */
    showAnatomy?: boolean
}

/**
 * Accessible NAME cho control: khi `label` là chuỗi thì dùng chính nó (đảm bảo control
 * luôn có tên đọc được — kể cả compound control Number/Date/Otp không nối `htmlFor`
 * được), ngược lại rơi về `fallback` (ariaLabel/placeholder). Tránh a11y-gap "control
 * không tên" khi field có nhãn nhưng nhãn không associate được.
 */
export const fieldName = (label: ReactNode, fallback?: string): string | undefined =>
    typeof label === "string" ? label : fallback

/** Nhãn + dấu `*` khi bắt buộc. */
const withRequired = (label: ReactNode, isRequired?: boolean) =>
    isRequired ? (
        <>
            {label} <span className="text-danger">*</span>
        </>
    ) : (
        label
    )

/**
 * `FieldFrame` — label/hint/control/error column shared by mọi form atom.
 * @param props - {@link FieldFrameProps}
 */
const FieldFrameBase = ({
    label,
    hint,
    errorMessage,
    isRequired,
    isDisabled,
    isSkeleton,
    skeletonControl,
    children,
    id,
    className,
    showAnatomy = false,
}: FieldFrameProps) => {
    const hasFrame = label != null || hint != null || errorMessage != null

    // ── Loading mirror ────────────────────────────────────────────────────────
    if (isSkeleton) {
        // Bare skeleton (no label frame) → chỉ hộp control skeleton (tự badge Skeleton).
        if (!hasFrame && label == null) {
            return <>{skeletonControl}</>
        }
        return (
            <div className={cn("flex flex-col gap-1.5", className)}>
                {label != null ? (
                    <HeroSkeleton className="h-4 w-1/3 rounded-md" data-anat-part={showAnatomy ? "Label" : undefined} />
                ) : null}
                {skeletonControl}
            </div>
        )
    }

    // ── "Trần" — không frame → render thẳng control ────────────────────────────
    if (!hasFrame) {
        return <>{children}</>
    }

    // ── Full field ─────────────────────────────────────────────────────────────
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label != null ? (
                <Label htmlFor={id} isDisabled={isDisabled} className="text-sm font-medium" data-anat-part={showAnatomy ? "Label" : undefined}>
                    {withRequired(label, isRequired)}
                </Label>
            ) : null}

            {hint != null ? (
                <p className="text-muted text-xs" data-anat-part={showAnatomy ? "Description" : undefined}>
                    {hint}
                </p>
            ) : null}

            {children}

            {errorMessage != null ? (
                <p className="text-danger text-sm" data-anat-part={showAnatomy ? "Error" : undefined}>
                    {errorMessage}
                </p>
            ) : null}
        </div>
    )
}

/** `FieldFrame.*` — label/hint/control/error scaffold namespace. */
export const FieldFrame = Object.assign(FieldFrameBase, {
    Base: FieldFrameBase,
})
