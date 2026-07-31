import type { ComponentType, ReactNode, SVGProps } from "react"
import { Chip as HeroChip, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CircleIcon, XIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `ChipBase` — the single chip in this design system. Wraps HeroUI's `Chip`.
 *
 * The status dot is not a separate chip shape: pass `dotColor`/`dotClassName` for a
 * leading dot instead of `icon` (same idea as `Button`'s `isIconOnly`). Label content
 * goes through the `text` prop, not `children`.
 *
 * The leading-glyph cell holds only one thing: `icon` and `dotColor`/`dotClassName`
 * are mutually exclusive, enforced at compile time rather than left to the caller.
 * `isSkeleton` draws its own shimmer, sized to the chip's real box and cell count.
 * Glyph scale and weight are controlled by the atom — the caller only picks which icon.
 */

/**
 * Chip's semantic tone → HeroUI's soft color.
 *
 * Kept as its own type rather than aliased to `AlertStatus`: `tone` flows straight into
 * HeroUI's `HeroChip.color`, a vendor prop with a closed union that has no `"info"`.
 * `ChipTone` must stay in sync 1:1 with that real union (5 values, no `info`).
 */
export type ChipTone = "default" | "accent" | "success" | "warning" | "danger"

/**
 * Icon passed as a COMPONENT (e.g. `CheckCircleIcon`); the atom renders it at chip scale.
 *
 * The type stays open (`SVGProps` + optional `weight`) instead of declaring Phosphor's
 * `Icon` type, so it doesn't lock the tree to one icon library. `weight` lets the atom
 * force the stroke weight on whatever icon is passed — only `regular`/`bold`.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * Icon scale matches the chip's font scale: HeroUI's chip renders `text-xs` (12px) at
 * `md`, so the glyph is `size-3`. No `!important` needed here (unlike `Button`) —
 * `chip.css` has no `.chip svg` rule to out-specify.
 */
const ICON_CLS = "size-3"

/** 6px dot — under the `size-5` threshold, so it renders at heavy weight (`fill`). */
const DOT_PX = 6

/**
 * Skeleton width by slot count: label only · label + one cell (leading glyph or ×
 * button) · label + both. Must match the real chip's footprint, or the row jumps when
 * data loads.
 */
const SKELETON_W = ["w-16", "w-20", "w-24"] as const

/** Shared props — excludes `text`/`isSkeleton` and the leading-glyph slot; see {@link ChipBaseProps}. */
interface ChipBaseOwnProps {
    /** Semantic tone → soft color. Default `default` (neutral). */
    tone?: ChipTone
    /** When provided, the chip renders a trailing × button that calls this on click. */
    onRemove?: () => void
    /** Accessibility label for the × button (caller supplies the translated string). */
    removeLabel?: string
    /** `true` → tags each part with `data-anat-part` for the BlockAnatomy badge. */
    showAnatomy?: boolean
    /**
     * `data-anat-part` name on the chip's root. A wrapping component (e.g. `ChipGroup`)
     * passes `"Chip"` down so the dependency tree recognizes this as a Chip and links to
     * its story — that tree is built from the DOM, so without the label it's invisible.
     */
    anatPart?: string
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The leading-glyph cell has one slot, so `icon` and the dot are mutually exclusive at
 * compile time. The dot shows only when the caller gives it a color — an uncolored dot
 * is meaningless, so there's no separate `hasDot` boolean (that would allow the
 * nonsensical state of `hasDot` true with no color).
 */
type ChipLeadingProps =
    | { icon?: IconComponent; dotColor?: never; dotClassName?: never }
    | {
          icon?: never
          /**
           * Raw hex color for the dot (e.g. `#3178c6`, GitHub's language color) — for
           * colors outside the Tailwind token palette. Takes precedence over
           * `dotClassName`; both use the same `currentColor` mechanism.
           */
          dotColor?: string
          /**
           * Tailwind text-color class for the dot (e.g. `text-success`). The dot is a
           * `CircleIcon weight="fill"` that reads `currentColor`, so this class on the
           * parent span sets its color; the chip's own text still follows `tone`.
           */
          dotClassName?: string
      }

/**
 * `text` is required when rendering a real chip; not needed when `isSkeleton` — the
 * pill shimmer has no label.
 */
export type ChipBaseProps = ChipBaseOwnProps &
    ChipLeadingProps &
    ({ isSkeleton: true; text?: ReactNode } | { isSkeleton?: false; text: ReactNode })

export const ChipBase = ({
    tone = "default",
    text,
    icon: Icon,
    dotColor,
    dotClassName,
    onRemove,
    removeLabel,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
    classNames,
}: ChipBaseProps) => {
    // The dot appears only when the caller gives it a color (see {@link ChipLeadingProps}).
    const hasDot = dotColor != null || dotClassName != null

    if (isSkeleton) {
        // Skeleton branch checked before any shape branch. Renders the real `HeroChip`
        // with shimmer content inside, so height/radius/padding come straight from
        // `.chip` instead of a hand-copied constant that could drift out of sync.
        const slots = (hasDot || Icon ? 1 : 0) + (onRemove ? 1 : 0)
        return (
            <HeroChip
                color={tone}
                variant="soft"
                className={cn("w-fit", className, classNames)}
                // Node name = the REAL component rendered here (HeroUI `Chip`, in its
                // loading look) — NOT the word "Skeleton" (that's a STATE, not an
                // identity, and this element is the same `HeroChip` the real branch
                // below renders).
                data-anat-part={anatPart ?? (showAnatomy ? "Chip" : undefined)}
            >
                {hasDot || Icon ? <HeroSkeleton className="size-3 shrink-0 rounded-full" /> : null}
                <HeroChip.Label>
                    {/* Width is guessed (text length unknown). Height is not: it must equal
                        `leading-5`, the line-height `.chip` sets for real text — a shimmer
                        bar has no line-height of its own, so without this the box renders
                        shorter than the real chip (16px vs 24px), and `.chip` still adds
                        its own `py-0.5` on top. */}
                    <HeroSkeleton className={cn("h-5 rounded", SKELETON_W[slots])} />
                </HeroChip.Label>
                {onRemove ? <HeroSkeleton className="size-3 shrink-0 rounded-full" /> : null}
            </HeroChip>
        )
    }

    /** Leading glyph: colored dot or icon — never both (enforced by the type). */
    const leading = hasDot ? (
        <span
            aria-hidden
            className={cn("inline-flex shrink-0", dotClassName)}
            style={dotColor ? { color: dotColor } : undefined}
        >
            {/* Solid dot = `CircleIcon weight="fill"` (Phosphor has no separate `*Fill`
                variant); fill defaults to `currentColor`, so the color set on the parent
                span carries through. */}
            <CircleIcon weight="fill" width={DOT_PX} height={DOT_PX} />
        </span>
    ) : Icon ? (
        <span aria-hidden className="inline-flex shrink-0">
            {/* The atom owns glyph scale: matches the chip's font size, and since it's
                under `size-5` it renders bold. */}
            <Icon className={ICON_CLS} weight="bold" />
        </span>
    ) : null

    return (
        <HeroChip
            color={tone}
            variant="soft"
            // No `size` passed — this is HeroUI's base size already. `chipVariants
            // .defaultVariants` doesn't declare `size`, and `.chip--md` only adds
            // `text-xs`, which `.chip` already has — so `size="md"` would be a no-op
            // that reads as a real decision but isn't.
            //
            // Don't lower the size to fix how one chip looks: the atom uses one scale
            // everywhere, so a chip that looks too big at some call site belongs in a
            // different context there, not a smaller `size`.
            //
            // w-fit: chip is a content-hugging pill — without it, `align-items: stretch`
            // on a flex-col parent stretches the chip the full row.
            className={cn("w-fit", className, classNames)}
            data-anat-part={anatPart}
        >
            {leading}
            {/* Real component rendered here is HeroUI's `Chip.Label` compound member —
                name the node after it, not the generic slot word "Label". */}
            <HeroChip.Label data-anat-part={showAnatomy ? "Chip.Label" : undefined}>{text}</HeroChip.Label>
            {onRemove ? (
                // × button sized to the chip (size-4 hit area, size-3 glyph), takes the
                // chip's tone via `currentColor` — not `Button isIconOnly` (that's ~32px,
                // too big for a 24px chip). This is an action (remove), so it must be a
                // real `<button>`, not a link.
                <button
                    type="button"
                    aria-label={removeLabel ?? "Remove"}
                    onClick={onRemove}
                    className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition hover:bg-current/15 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-3"
                >
                    {/* × is forced to size-3 (< size-5), so it renders bold. */}
                    <XIcon aria-hidden weight="bold" />
                </button>
            ) : null}
        </HeroChip>
    )
}
