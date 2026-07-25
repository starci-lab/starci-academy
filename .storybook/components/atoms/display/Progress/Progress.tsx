import {
    ProgressBar as HeroProgressBar,
    ProgressCircle as HeroProgressCircle,
    Meter as HeroMeter,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Progress.*`: the progress-indicator atom namespace (bọc HeroUI).
 *
 * Members theo HÌNH + NGỮ NGHĨA:
 *   • `Progress.Bar`    — thanh tuyến tính, TIẾN TRÌNH (task đang chạy). Có xác định
 *                          (value) hoặc `isIndeterminate` (không rõ thời lượng).
 *   • `Progress.Circle` — vòng tròn, cùng ngữ nghĩa tiến-trình như Bar.
 *   • `Progress.Meter`  — ĐO LƯỜNG tĩnh (dung lượng, mức pin, điểm). LUÔN có giá trị
 *                          xác định → KHÔNG `isIndeterminate` (react-aria Meter không có).
 *
 * Bar/Circle bọc react-aria ProgressBar (hỗ trợ indeterminate); Meter bọc react-aria
 * Meter (đo lường, không indeterminate). Atom tự ép size/màu, tự vẽ leaf skeleton
 * (`isSkeleton`). Track/Fill là part nội tại — atom sở hữu, consumer không chèn.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Fill tone shared by all three members. */
export type ProgressColor = "accent" | "success" | "warning" | "danger" | "default"

/** Size preset shared by all three members. */
export type ProgressSize = "sm" | "md" | "lg"

/** Shared props for the DETERMINATE-or-indeterminate members (Bar · Circle). */
interface ProgressTrackProps {
    /** Current value in `[0, max]`. Ignored when `isIndeterminate`. */
    value?: number
    /** Maximum value = 100% completion. Default `100`. */
    max?: number
    /** Ongoing work of unknown duration — the fill animates instead of measuring a value. */
    isIndeterminate?: boolean
    /** Fill tone. Default `accent`; pass a semantic tone when the VALUE carries meaning. */
    color?: ProgressColor
    /** Size preset. Default `md`. */
    size?: ProgressSize
    /** Accessible name (announced by screen readers). */
    ariaLabel?: string
    /** Render the leaf skeleton instead of the indicator. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/** Per-size circle diameter (skeleton match + `ProgressCircle` doesn't force a box). */
const CIRCLE_BOX: Record<ProgressSize, string> = { sm: "size-10", md: "size-14", lg: "size-20" }

/** `Progress.Bar` — linear progress (HeroUI ProgressBar). Determinate or indeterminate. */
const ProgressBar = ({
    value = 0,
    max = 100,
    isIndeterminate = false,
    color = "accent",
    size = "md",
    ariaLabel = "Tiến trình",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ProgressTrackProps) => {
    if (isSkeleton) {
        return <HeroSkeleton className={cn("h-2 w-full rounded-full", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
    }
    return (
        <HeroProgressBar
            aria-label={ariaLabel}
            value={value}
            maxValue={max}
            isIndeterminate={isIndeterminate}
            color={color}
            size={size}
            className={cn("w-full", className)}
        >
            <HeroProgressBar.Track data-anat-part={showAnatomy ? "Track" : undefined}>
                <HeroProgressBar.Fill data-anat-part={showAnatomy ? "Fill" : undefined} />
            </HeroProgressBar.Track>
        </HeroProgressBar>
    )
}

/** `Progress.Circle` — circular progress (HeroUI ProgressCircle). Determinate or indeterminate. */
const ProgressCircle = ({
    value = 0,
    max = 100,
    isIndeterminate = false,
    color = "accent",
    size = "md",
    ariaLabel = "Tiến trình",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: ProgressTrackProps) => {
    if (isSkeleton) {
        return <HeroSkeleton className={cn("rounded-full", CIRCLE_BOX[size], className)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
    }
    return (
        <HeroProgressCircle
            aria-label={ariaLabel}
            value={value}
            maxValue={max}
            isIndeterminate={isIndeterminate}
            color={color}
            size={size}
            className={cn(className)}
        >
            <HeroProgressCircle.Track data-anat-part={showAnatomy ? "Track" : undefined}>
                <HeroProgressCircle.TrackCircle />
                <HeroProgressCircle.FillCircle data-anat-part={showAnatomy ? "Fill" : undefined} />
            </HeroProgressCircle.Track>
        </HeroProgressCircle>
    )
}

/** Props chung của {@link Meter} — TRỪ cặp `value`/`isSkeleton`. */
interface MeterOwnProps {
    /** Maximum value = full. Default `100`. */
    max?: number
    /** Tone. Default `accent`; pass success/warning/danger to signal a threshold band. */
    color?: ProgressColor
    /** Size preset. Default `md`. */
    size?: ProgressSize
    /** Accessible name (announced by screen readers). */
    ariaLabel?: string
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * `value` BẮT BUỘC khi meter sống (đo cái gì thì phải có số), KHÔNG cần khi
 * `isSkeleton` — track shimmer chưa đo gì. Cùng khuôn với `TypographyProps`.
 */
type MeterProps = MeterOwnProps &
    (
        | { isSkeleton: true; value?: number }
        | { isSkeleton?: false; value: number }
    )

/** `Progress.Meter` — static gauge (HeroUI Meter). Always determinate; tone signals a band. */
const Meter = ({
    value,
    max = 100,
    color = "accent",
    size = "md",
    ariaLabel = "Mức đo",
    isSkeleton = false,
    showAnatomy = false,
    className,
}: MeterProps) => {
    if (isSkeleton) {
        return <HeroSkeleton className={cn("h-2 w-full rounded-full", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
    }
    return (
        <HeroMeter aria-label={ariaLabel} value={value} maxValue={max} color={color} size={size} className={cn("w-full", className)}>
            <HeroMeter.Track data-anat-part={showAnatomy ? "Track" : undefined}>
                <HeroMeter.Fill data-anat-part={showAnatomy ? "Fill" : undefined} />
            </HeroMeter.Track>
        </HeroMeter>
    )
}

/**
 * `Progress.*` — progress-indicator atom namespace. `Bar`/`Circle` = tiến trình
 * (determinate/indeterminate), `Meter` = đo lường tĩnh (chỉ determinate).
 */
export const Progress = Object.assign(ProgressBar, {
    Bar: ProgressBar,
    Circle: ProgressCircle,
    Meter: Meter,
})
