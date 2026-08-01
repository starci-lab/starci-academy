import { Button, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import type { IconComponent } from "@/components/atoms/buttons/Button/button-tokens"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { StackH } from "@/components/frames/Stack"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `InputButtonLike`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 */

export type InputButtonLikeSize = "sm" | "md" | "lg"

// Field height + min-height per size (§6: its own field shape — does not compose the base Button).
const HEIGHT_CLS: Record<InputButtonLikeSize, string> = {
    sm: "h-8 min-h-8",
    md: "h-9 min-h-9",
    lg: "h-10 min-h-10"}
// Placeholder text size per size.
const TEXT_CLS: Record<InputButtonLikeSize, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"}
// icon-size §5a: the block forces the icon/suffix svg size itself — the caller passes a bare icon.
const ICON_CLS: Record<InputButtonLikeSize, string> = {
    sm: "[&_svg]:size-4",
    md: "[&_svg]:size-4",
    lg: "[&_svg]:size-5"}
// Placeholder text-size expressed as a `Typography` size (matches TEXT_CLS 1:1) — lets
// the skeleton branch hand the SAME scale to the atom instead of a hand-copied class.
const TYPOGRAPHY_SIZE: Record<InputButtonLikeSize, "xs" | "sm" | "base"> = {
    sm: "xs",
    md: "sm",
    lg: "base"}

/**
 * Props for the {@link InputButtonLike} block.
 */
export interface InputButtonLikeProps {
    /**
     * Placeholder-style label, rendered muted like an empty input value. Plain
     * text — the block wraps it itself, so it can also draw the skeleton bar
     * in its place.
     */
    placeholder: string
    /**
     * Optional leading icon (e.g. a magnifier), passed as a COMPONENT reference
     * (not built JSX) — the block calls it itself and owns its size (§5a) and
     * muted color.
     */
    icon?: IconComponent
    /**
     * Optional trailing region pinned to the right (e.g. a Kbd shortcut hint),
     * passed as a COMPONENT reference so the block can withhold it while loading.
     */
    suffix?: ComponentTypeWithSkeleton
    /** Control height/typography scale. Defaults to `md` (field height h-9). */
    size?: InputButtonLikeSize
    /**
     * Accessible label for the control. Falls back to {@link placeholder} when omitted.
     */
    ariaLabel?: string
    /**
     * Press handler — opens whatever the field stands in for (e.g. a search overlay).
     */
    onPress: () => void
    /** `true` → skeleton mirror (field-shaped bar, same height per size). */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * A button disguised as an input field. It carries the native HeroUI field
 * look — rounded-field shell, field background + border,
 * muted placeholder text — but behaves as a single press target with no inner
 * dividers, so it can trigger an overlay/command palette instead of accepting
 * typed input. Pure and props-only: the block owns the entire look — including
 * icon size (§5a) and muted color; consumers pass only raw content + a press
 * handler (and placement via classNames).
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "InputButtonLike" } as const

export const InputButtonLike = ({
    placeholder,
    icon: Icon,
    suffix: Suffix,
    size = "md",
    ariaLabel,
    onPress,
    isSkeleton = false,
    classNames}: InputButtonLikeProps) => {
    // NOTE: left as raw HeroUI <Button> (not the Button port,
    // ../../buttons/Button/Button.tsx) — three real gaps vs the port's API:
    //  1. `variant="outline"` isn't in the port's ButtonVariant union (only
    //     primary/secondary/tertiary/ghost/danger) — no value maps onto it.
    //  2. This control needs a LEADING icon + a separate trailing `suffix`
    //     section; the port's `icon` slot is trailing-only (single icon next
    //     to the label), it has no leading-icon or third-slot concept.
    //  3. The port auto-sizes descendant svgs via §5a (`[&_svg]:size-4/5/6`
    //     keyed to button `size`), which would override this component's own
    //     ICON_CLS scale (sm/md→size-4, lg→size-5) at higher CSS specificity.
    // Deferred — swapping would change rendered variant/icon-size/layout.
    //
    // ONE render path (§12c): the field shell stays real throughout — same
    // height/border/shadow whether loading or not, "a field that is loading is
    // still a field". Only the placeholder LABEL keeps its own bar via
    // `Typography` while loading; the leading icon and trailing `suffix` are
    // omitted while loading (their shape isn't known yet — the composite's
    // call on how many parts shimmer), and the press is locked.
    return (
        <Button
            variant="outline"
            aria-label={ariaLabel ?? placeholder}
            onPress={isSkeleton ? undefined : onPress}
            isDisabled={isSkeleton}
            data-tier="composite"
            data-component="InputButtonLike"
            className={cn(
                "w-full justify-between rounded-field border-[var(--field-border)] bg-field px-3 font-normal text-field-foreground shadow-[var(--field-shadow)] hover:bg-field",
                HEIGHT_CLS[size],
                ICON_CLS[size],
                classNames)}
        >
            <StackH
                gap={3}
                classNames={["min-w-0"]}
                body={
                    <>
                        {!isSkeleton && Icon ? (
                            <span className="inline-flex shrink-0 items-center text-field-placeholder">
                                <Icon />
                            </span>
                        ) : null}
                        {isSkeleton ? (
                            <Typography size={TYPOGRAPHY_SIZE[size]} isSkeleton classNames={["min-w-0", "flex-1"]} />
                        ) : (
                            <span className={cn("truncate text-field-placeholder", TEXT_CLS[size])}>
                                {placeholder}
                            </span>
                        )}
                    </>
                }
            />
            {!isSkeleton && Suffix ? (
                <StackH gap={3} classNames={["shrink-0"]} body={<Suffix isSkeleton={isSkeleton} />} />
            ) : null}
        </Button>
    )
}
