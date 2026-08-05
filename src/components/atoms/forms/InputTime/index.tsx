import { TimeField as HeroTimeField, cn } from "@heroui/react"
import type { TimeValue } from "react-aria-components"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { FrameProps } from "../_input/types"
import { FieldSkeleton } from "../_input/FieldSkeleton"

/** `InputTime` — hh:mm segments (HeroUI TimeField). No calendar popover; `value` is a `TimeValue`. */
export const InputTime = ({
    value,
    onValueChange,
    isDisabled,
    isInvalid,
    ariaLabel = "Pick a time",
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: TimeValue | null
    onValueChange: (value: TimeValue | null) => void
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}

            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroTimeField
                data-tier="atom"
                data-component="InputTime"
                aria-label={fieldName(label, ariaLabel)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                fullWidth
                className={cn("w-full", classNames)}
            >
                <HeroTimeField.Group fullWidth variant="secondary">
                    <HeroTimeField.Input>{(segment) => <HeroTimeField.Segment segment={segment} />}</HeroTimeField.Input>
                </HeroTimeField.Group>
            </HeroTimeField>
        </FieldFrame>
    )
}

/** Tier metadata for `InputTime`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputTime" } as const
