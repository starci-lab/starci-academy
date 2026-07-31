import type { ReactNode } from "react"
import { Button as HeroUIButton, Spinner, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import {
    ALIGN_CLS,
    HERO_VARIANT,
    ICON_CLS,
    ICON_WEIGHT,
    SKELETON_H,
    SKELETON_SQUARE,
    SKELETON_W,
    VARIANT_CLS,
    type ButtonAlign,
    type ButtonSize,
    type ButtonVariant,
    type IconComponent,
} from "./button-tokens"

/**
 * `ButtonBase` — the one button in the system. Wraps HeroUI's `Button`.
 *
 * An icon-only button is not a different shape — it's the same button with the
 * label dropped, selected via `isIconOnly` rather than a separate component.
 *
 * Rules:
 *   - Props stay narrow; no `children` — the label goes through the `label` prop.
 *   - `isIconOnly` requires `prefixIcon` + `ariaLabel` (a screen reader needs a
 *     name when there is no visible text); `label` is meaningless in that mode.
 *   - `isSkeleton` renders a shimmer co-located with the real button: a pill when
 *     labeled, a square when icon-only.
 *   - `isPending`: react-aria does not draw its own spinner, so the atom renders
 *     one itself and locks the press handler.
 *   - Glyph scale and stroke weight are derived from `size`; the caller only picks which icon.
 */

/** Props shared across all three shapes below — see {@link ButtonBaseProps} for the `label`/`isIconOnly`/`isSkeleton` union. */
interface ButtonBaseOwnProps {
    /**
     * Leading glyph passed as a component (`prefixIcon={PlusIcon}`, not JSX). When
     * `isIconOnly` this is the button's only glyph. Scale and stroke weight are derived from `size`.
     */
    prefixIcon?: IconComponent
    /**
     * Trailing glyph, after the label. Same scale/weight rule as `prefixIcon`.
     * Meaningless when `isIconOnly` — the button has only one glyph slot then.
     */
    suffixIcon?: IconComponent
    /**
     * Slides the glyph on hover: `prefixIcon` retreats left, `suffixIcon` advances
     * right. Use only for navigation arrows — a static caret/glyph gains nothing from it.
     */
    iconSlide?: boolean
    /** Action intent → HeroUI variant. Default `primary`. */
    variant?: ButtonVariant
    /** Button scale. Default `md`. Glyph size follows automatically — the caller does not set it. */
    size?: ButtonSize
    /**
     * `true` adds `shadow-lg`, for a button that floats above its background (e.g.
     * a floating action button). HeroUI's default has no shadow — only a
     * `transition: box-shadow` prepared for one (see `button.css`).
     */
    isElevated?: boolean
    /** Where the glyph+label row sits inside the button. Default centered (HeroUI's own default). See {@link ButtonAlign}. */
    align?: ButtonAlign
    onPress?: () => void
    /** `true` disables the button (forwarded to HeroUI, OR'd with `isPending`). */
    isDisabled?: boolean
    /** `true` marks the button busy: a spinner replaces the leading glyph and the press handler locks. */
    isPending?: boolean
    /** `true` tags the rendered part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /**
     * `data-anat-part` name attached at the button's root. A wrapping component
     * (e.g. `ButtonGroup`) passes `"ButtonBase"` down so the deps tree — which is
     * built from the DOM — can recognize this node as a `ButtonBase` and link to its story.
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
 * Three mutually exclusive shapes, enforced at compile time:
 *   - skeleton — no label needed (a shimmer has no text).
 *   - icon-only — `prefixIcon` + `ariaLabel` required, no label.
 *   - labeled — `label` required.
 */
export type ButtonBaseProps = ButtonBaseOwnProps &
    (
        | { isSkeleton: true; isIconOnly?: boolean; label?: ReactNode; ariaLabel?: string }
        | { isSkeleton?: false; isIconOnly: true; prefixIcon: IconComponent; ariaLabel: string; label?: never }
        | { isSkeleton?: false; isIconOnly?: false; label: ReactNode; ariaLabel?: string }
    )

export const ButtonBase = ({
    label,
    prefixIcon: PrefixIcon,
    suffixIcon: SuffixIcon,
    iconSlide = false,
    isIconOnly = false,
    ariaLabel,
    variant = "primary",
    size = "md",
    isElevated = false,
    align,
    onPress,
    isDisabled = false,
    isPending = false,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
    classNames,
}: ButtonBaseProps) => {
    if (isSkeleton) {
        // Square when icon-only, pill when labeled.
        return (
            <HeroSkeleton
                className={cn(
                    "rounded-full",
                    isIconOnly ? SKELETON_SQUARE[size] : cn(SKELETON_W[size], SKELETON_H[size]),
                    className,
                    classNames,
                )}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }

    /** Leading glyph — or a spinner in its place when busy, never both at once. */
    const leading = isPending ? (
        <span aria-hidden className="inline-flex shrink-0">
            <Spinner size="sm" color="current" data-anat-part={showAnatomy ? "Spinner" : undefined} />
        </span>
    ) : PrefixIcon ? (
        <span
            aria-hidden
            className={cn(
                "inline-flex shrink-0",
                ICON_CLS[size],
                // Tailwind v4 treats `translate` as its own property — needs `transition-[translate]`, not `-transform`.
                iconSlide && "transition-[translate] group-hover:-translate-x-0.5",
            )}
        >
            <PrefixIcon weight={ICON_WEIGHT[size]} />
        </span>
    ) : null

    return (
        <HeroUIButton
            isIconOnly={isIconOnly}
            variant={HERO_VARIANT[variant]}
            size={size}
            aria-label={ariaLabel}
            onPress={onPress}
            isPending={isPending}
            isDisabled={isDisabled || isPending}
            className={cn("group", VARIANT_CLS[variant], isElevated && "shadow-lg", align && ALIGN_CLS[align], className, classNames)}
            data-anat-part={anatPart ?? (showAnatomy ? "Button" : undefined)}
        >
            {leading}
            {isIconOnly ? null : <span>{label}</span>}
            {!isIconOnly && SuffixIcon ? (
                // Trailing glyph — advances right on hover when iconSlide is set.
                <span
                    aria-hidden
                    className={cn(
                        "inline-flex shrink-0",
                        ICON_CLS[size],
                        iconSlide && "transition-[translate] group-hover:translate-x-0.5",
                    )}
                >
                    <SuffixIcon weight={ICON_WEIGHT[size]} />
                </span>
            ) : null}
        </HeroUIButton>
    )
}
