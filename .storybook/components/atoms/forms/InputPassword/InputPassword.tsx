import { useId, useState } from "react"
import { Input as HeroInput, TextField as HeroTextField, cn } from "@heroui/react"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { FieldFrame, fieldName } from "@sb-components/composites/form/_field/FieldFrame"
import type { StringFieldProps } from "../_input/types"
import { FieldSkeleton } from "@sb-components/atoms/forms/_input/FieldSkeleton"

/** Props for {@link InputPassword}. */
type InputPasswordProps = StringFieldProps & {
    /** Accessible name for the toggle when it would reveal the password. */
    revealLabel: string
    /** Accessible name for the toggle when it would hide the password. */
    hideLabel: string
}

/** `InputPassword` — masked text with a reveal/hide button (Phosphor EyeIcon/EyeSlashIcon). */
export const InputPassword = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    
    label,
    hint,
    errorMessage,
    isRequired,
    revealLabel,
    hideLabel,
}: InputPasswordProps) => {
    const [reveal, setReveal] = useState(false)
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            id={controlId}
            skeletonControl={<FieldSkeleton />}
        >
            <HeroTextField data-tier="atom" data-component="InputPassword" aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full")}>
                <div className="relative">
                    <HeroInput
                        id={controlId}
                        type={reveal ? "text" : "password"}
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onValueChange?.(event.target.value)}
                        className="w-full pr-9"
                    />
                    <button
                        type="button"
                        aria-label={reveal ? hideLabel : revealLabel}
                        onClick={() => setReveal((r) => !r)}
                        className="text-muted absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer [&_svg]:size-4"
                    >
                        {reveal ? <EyeSlashIcon weight="bold" aria-hidden /> : <EyeIcon weight="bold" aria-hidden />}
                    </button>
                </div>
            </HeroTextField>
        </FieldFrame>
    )
}

/** Tier metadata for `InputPassword`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputPassword" } as const
