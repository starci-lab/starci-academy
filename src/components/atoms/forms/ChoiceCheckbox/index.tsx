import type { ReactNode } from "react"
import { Checkbox as HeroCheckbox, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CheckIcon, MinusIcon } from "@phosphor-icons/react"
import { SKELETON_TEXT_BAR } from "@/components/atoms/_skeleton-bar"
import { FieldFrame } from "@/components/composites/form/_field/FieldFrame"
import type { InlineFrameProps } from "../_choice/types"
import { withRequired } from "../_choice/with-required"

/** Checkbox control shimmer — square + label bar (label is always present on ChoiceCheckbox). */
const ChoiceCheckboxSkeleton = () => (
    <div data-tier="atom" data-component="ChoiceCheckbox" className={cn("flex items-center gap-3")}>
        <HeroSkeleton className="size-4 shrink-0 rounded-md" />
        <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/2")} />
    </div>
)

/** Props for {@link ChoiceCheckbox}. */
export interface ChoiceCheckboxProps extends InlineFrameProps {
    /** Checked state (controlled). */
    isSelected: boolean
    /** Fires with the new checked state. */
    onValueChange: (value: boolean) => void
    /** Label sits BESIDE the box (Checkbox.Content). */
    label: ReactNode
    isDisabled?: boolean
    isInvalid?: boolean
    /** Render the control-shaped skeleton (square + label bar) instead of the checkbox. */
    isSkeleton?: boolean
}

/** `ChoiceCheckbox` — single boolean checkbox with an inline label (HeroUI Checkbox compound). */
export const ChoiceCheckbox = ({
    isSelected,
    onValueChange,
    label,
    isDisabled,
    isInvalid,
    isSkeleton,
    hint,
    errorMessage,
    isRequired,
}: ChoiceCheckboxProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            hint={hint}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={ChoiceCheckboxSkeleton}
        >
            <HeroCheckbox
                data-tier="atom"
                data-component="ChoiceCheckbox"
                isSelected={isSelected}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
            >
                <HeroCheckbox.Control>
                    <HeroCheckbox.Indicator>
                        {({ isIndeterminate }) =>
                            isIndeterminate ? (
                                <MinusIcon weight="bold" aria-hidden focusable="false" />
                            ) : (
                                <CheckIcon weight="bold" aria-hidden focusable="false" />
                            )
                        }
                    </HeroCheckbox.Indicator>
                </HeroCheckbox.Control>
                <HeroCheckbox.Content>{withRequired(label, isRequired)}</HeroCheckbox.Content>
            </HeroCheckbox>
        </FieldFrame>
    )
}

/** Tier metadata for `ChoiceCheckbox`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "ChoiceCheckbox" } as const
