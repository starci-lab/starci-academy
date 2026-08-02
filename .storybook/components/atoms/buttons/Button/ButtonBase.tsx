import type { ReactNode } from "react"
import { Button as HeroUIButton, Spinner, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import {
    ALIGN_CLS,
    HERO_VARIANT,
    ICON_CLS,
    ICON_WEIGHT,
    LABEL_SIZE,
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
 * `ButtonBase` — the one button in the system, wrapping HeroUI's `Button`.
 *
 * An icon-only button is the same button with the label dropped, selected via
 * `isIconOnly` (which requires `prefixIcon` + `ariaLabel`) rather than a separate
 * component. Props stay narrow with no `children` — the label goes through `label`.
 *
 * `isSkeleton` renders a shimmer co-located with the real button (a pill when
 * labeled, a square when icon-only). `isPending` draws its own spinner and locks
 * the press handler. Glyph scale and stroke weight derive from `size`.
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
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
    classNames,
}: ButtonBaseProps) => {
    if (isSkeleton) {
        // Square when icon-only, pill when labeled.
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="Button"
                className={cn(
                    "rounded-full",
                    isIconOnly ? SKELETON_SQUARE[size] : cn(SKELETON_W[size], SKELETON_H[size]),
                    classNames,
                )}

            />
        )
    }

    /** Leading glyph — or a spinner in its place when busy, never both at once. */
    const leading = isPending ? (
        <span aria-hidden className="inline-flex shrink-0">
            <Spinner size="sm" color="current" />
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
            data-tier="atom"
            data-component="Button"
            isIconOnly={isIconOnly}
            variant={HERO_VARIANT[variant]}
            size={size}
            aria-label={ariaLabel}
            onPress={onPress}
            isPending={isPending}
            isDisabled={isDisabled || isPending}
            className={cn("group", VARIANT_CLS[variant], isElevated && "shadow-lg", align && ALIGN_CLS[align], classNames)}

        >
            {leading}
            {isIconOnly ? null : (
                // Raw `<span>` — ATOM-3 forbids an atom from importing another house
                // atom (`Typography`), so the label cannot go through it. `truncate`
                // clips the label at an ellipsis; `min-w-0` is required on the
                // label's own flex-row slot: flex items default to `min-width: auto`,
                // which floors them at their content's natural width and blocks
                // `text-overflow: ellipsis` from ever firing.
                //
                // Size/weight/color are spelled out explicitly rather than left to
                // inherit from `.button`: `LABEL_SIZE[size]` mirrors `button.css`'s
                // own rule (`.button` is `text-sm`, `.button--lg` overrides to
                // `text-base`); `font-medium` mirrors `.button`'s base weight;
                // `text-[var(--button-fg)]` reads the same per-variant CSS custom
                // property `.button--<variant>` sets (see `button.css` in
                // `@heroui/styles`) that the label inherited for free before this
                // ever went through Typography — so every variant (not just
                // `secondary`) gets its real foreground back.
                <span className={cn(LABEL_SIZE[size], "font-medium truncate min-w-0 text-[var(--button-fg)]")}>{label}</span>
            )}
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

export const meta = { tier: "atom", name: "Button" } as const
