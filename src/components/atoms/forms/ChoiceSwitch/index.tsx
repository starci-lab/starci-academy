import type { ReactNode } from "react"
import { Switch as HeroSwitch, Label as HeroLabel, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { SKELETON_TEXT_BAR } from "@/components/atoms/_skeleton-bar"
import { FieldFrame } from "@/components/composites/form/_field/FieldFrame"
import type { InlineFrameProps } from "../_choice/types"
import { withRequired } from "../_choice/with-required"

/** Props for {@link ChoiceSwitch}. */
export interface ChoiceSwitchProps extends InlineFrameProps {
    /** On/off state (controlled). */
    isSelected: boolean
    /** Fires with the new on/off state. */
    onValueChange: (value: boolean) => void
    /** Label sits BESIDE the track (sibling `<Label>` — NOT via Switch.Content, per house note). */
    label?: ReactNode
    isDisabled?: boolean
    isInvalid?: boolean
    /** Track size — HeroUI Switch supports sm/md/lg. */
    size?: "sm" | "md" | "lg"
    /** Render the control-shaped skeleton — a switch-track pill (+ label bar). */
    isSkeleton?: boolean
}

/** `ChoiceSwitch` — boolean toggle with the label BESIDE the track (HeroUI Switch compound). */
export const ChoiceSwitch = ({
    isSelected,
    onValueChange,
    label,
    isDisabled,
    isInvalid,
    size,
    isSkeleton,
    
    hint,
    errorMessage,
    isRequired,
}: ChoiceSwitchProps) => {
    const invalid = isInvalid || errorMessage != null
    const skeletonControl = (
        <div data-tier="atom" data-component="ChoiceSwitch" className={cn("flex items-center gap-3")}>
            <HeroSkeleton className="h-9 w-16 shrink-0 rounded-full" />
            {label != null ? <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/2")} /> : null}
        </div>
    )
    return (
        <FieldFrame hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} skeletonControl={skeletonControl}>
            <div data-tier="atom" data-component="ChoiceSwitch" className={cn("flex items-center gap-3")}>
                <HeroSwitch
                    size={size}
                    isSelected={isSelected}
                    onChange={onValueChange}
                    isDisabled={isDisabled}
                    isInvalid={invalid}
                    aria-label={typeof label === "string" ? label : undefined}
                >
                    <HeroSwitch.Content>
                        <HeroSwitch.Control>
                            <HeroSwitch.Thumb />
                        </HeroSwitch.Control>
                    </HeroSwitch.Content>
                </HeroSwitch>
                {label != null ? (
                    <HeroLabel isDisabled={isDisabled} className="text-sm font-medium">
                        {withRequired(label, isRequired)}
                    </HeroLabel>
                ) : null}
            </div>
        </FieldFrame>
    )
}

/** Tier metadata for `ChoiceSwitch`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "ChoiceSwitch" } as const
