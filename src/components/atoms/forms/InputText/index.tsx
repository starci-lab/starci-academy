import { useId } from "react"
import { Input as HeroInput, TextField as HeroTextField, cn } from "@heroui/react"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"
import type { StringFieldProps } from "../_input/types"
import { FieldSkeleton } from "../_input/FieldSkeleton"

/** Props for {@link InputText}. */
type InputTextProps = StringFieldProps & {
    /** HeroUI field variant — `"secondary"` for a field sitting inside a card/modal surface. @default "primary" */
    variant?: "primary" | "secondary"
}

/** `InputText` — single-line text (HeroUI TextField+Input) with label/hint/error. */
export const InputText = ({ value, onValueChange, placeholder, isDisabled, isInvalid, ariaLabel, isSkeleton, classNames, label, hint, errorMessage, isRequired, variant = "primary" }: InputTextProps) => {
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
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroTextField data-tier="atom" data-component="InputText" variant={variant} aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", classNames)}>
                <HeroInput
                    id={controlId}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    className="w-full"
                />
            </HeroTextField>
        </FieldFrame>
    )
}

/** Tier metadata for `InputText`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputText" } as const
