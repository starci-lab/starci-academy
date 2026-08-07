import { InputOTP as HeroInputOTP, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { FieldFrame, fieldName } from "@sb-components/composites/form/_field/FieldFrame"
import type { FrameProps } from "../_input/types"

/** Default OTP row shimmer — six digit cells (InputOtp `length` default). */
const InputOtpSkeleton = () => (
    <div className={cn("flex items-center gap-2")}>
        {Array.from({ length: 6 }, (_, index) => (
            <HeroSkeleton key={index} className="h-10 w-9 rounded-xl" />
        ))}
    </div>
)

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
            skeletonControl={InputOtpSkeleton}
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
