import { InputOTP as HeroInputOTP, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { FrameProps } from "../_input/types"

/** `InputOtp` — bare one-time-code cells (HeroUI InputOTP), `length` slots, `value` a digit string. */
export const InputOtp = ({
    value,
    onValueChange,
    length = 6,
    isDisabled,
    isInvalid,
    autoFocus,
    ariaLabel,
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: string
    onValueChange: (value: string) => void
    /** Slot count (also `maxLength`). Default `6`. */
    length?: number
    isDisabled?: boolean
    isInvalid?: boolean
    autoFocus?: boolean
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
            skeletonControl={
                // Leaf skeleton OWNED by the atom — a row of `length` cell-shaped squares.
                <div className={cn("flex items-center gap-2", classNames)}>
                    {Array.from({ length }, (_, index) => (
                        <HeroSkeleton key={index} className="h-10 w-9 rounded-xl" />
                    ))}
                </div>
            }
        >
            <HeroInputOTP
                data-tier="atom"
                data-component="InputOtp"
                aria-label={fieldName(label, ariaLabel)}
                maxLength={length}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                autoFocus={autoFocus}
                className={cn(classNames)}
            >
                <HeroInputOTP.Group>
                    {Array.from({ length }, (_, index) => (
                        <HeroInputOTP.Slot key={index} index={index} />
                    ))}
                </HeroInputOTP.Group>
            </HeroInputOTP>
        </FieldFrame>
    )
}

/** Tier metadata for `InputOtp`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputOtp" } as const
