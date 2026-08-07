import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import type { IconComponent } from "@/components/atoms/buttons/Button/button-tokens"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { StackH } from "@/components/frames/Stack"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "InputButtonLike" } as const

/**
 * `InputButtonLike` — a button disguised as an input field: it carries the house
 * `Button` `variant="field"` look (rounded shell, field background + border, muted
 * placeholder) but behaves as a single press target with no inner dividers, so it
 * can trigger an overlay (a global search dialog, a command palette) instead of
 * accepting typed input. Leaves: `icon`, `suffix`, `size`, `isSkeleton`, `placeholder`.
 */

export type InputButtonLikeSize = "sm" | "md" | "lg"

// Placeholder text-size expressed as a `Typography` size — lets the skeleton
// branch hand the SAME scale to the atom instead of a hand-copied class.
const TYPOGRAPHY_SIZE: Record<InputButtonLikeSize, "xs" | "sm" | "base"> = {
    sm: "xs",
    md: "sm",
    lg: "base",
}

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
}

/**
 * A button disguised as an input field. It carries the house `Button`
 * `variant="field"` look — rounded-field shell, field background + border,
 * muted placeholder text — but behaves as a single press target with no inner
 * dividers, so it can trigger an overlay/command palette instead of accepting
 * typed input. Pure and props-only: the block owns the entire look — including
 * icon size (§5a) and muted color; consumers pass only raw content + a press
 * handler (and placement via classNames).
 *
 * ONE render path (§12c): the field shell stays real throughout — same
 * height/border/shadow whether loading or not, "a field that is loading is
 * still a field". Only the placeholder LABEL keeps its own bar via
 * `Typography` while loading; the leading icon and trailing `suffix` are
 * omitted while loading, and the press is locked. House `Button.isSkeleton` is
 * NEVER set here — that would replace the field chrome with a pill shimmer.
 */
export const InputButtonLike = ({
    placeholder,
    icon: Icon,
    suffix: Suffix,
    size = "md",
    ariaLabel,
    onPress,
    isSkeleton = false,
    
}: InputButtonLikeProps) => {
    const placeholderLabel = (
        <Typography
            size={TYPOGRAPHY_SIZE[size]}
            isSkeleton={isSkeleton}
            text={placeholder}
            color="muted"
            truncate
        />
    )

    const label = !isSkeleton && Suffix ? (
        <StackH
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            justify="between"
            align="center"
            classNames={["w-full", "min-w-0"]}
            items={[
                () => placeholderLabel,
                () => (
                    <span className="shrink-0">
                        <Suffix isSkeleton={isSkeleton} />
                    </span>
                ),
            ]}
        />
    ) : (
        placeholderLabel
    )

    return (
        <div data-tier="composite" data-component="InputButtonLike">
            <Button
                variant="field"
                size={size}
                ariaLabel={ariaLabel ?? placeholder}
                onPress={isSkeleton ? undefined : onPress}
                isDisabled={isSkeleton}
                prefixIcon={!isSkeleton && Icon ? Icon : undefined}
                label={label}
            />
        </div>
    )
}
