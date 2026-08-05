import { useId } from "react"
import { TextField as HeroTextField, TextArea as HeroTextArea, cn } from "@heroui/react"
import { FieldFrame, fieldName } from "@sb-components/composites/form/_field/FieldFrame"
import type { StringFieldProps } from "../_input/types"
import { FieldSkeleton } from "../_input/FieldSkeleton"

/** Props for {@link InputTextarea}. */
type InputTextareaProps = StringFieldProps & {
    /** Visible rows. @default 3 */
    rows?: number
    /** HeroUI field variant — `"secondary"` for a field sitting inside a card/modal surface. @default "primary" */
    variant?: "primary" | "secondary"
}

/** `InputTextarea` — multi-line (HeroUI TextArea), `rows` visible lines (default 3). */
export const InputTextarea = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    rows = 3,
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
    variant = "primary",
}: InputTextareaProps) => {
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
            skeletonControl={<FieldSkeleton heightCls="h-24" classNames={classNames} />}
        >
            <HeroTextField data-tier="atom" data-component="InputTextarea" variant={variant} aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", classNames)}>
                <HeroTextArea
                    id={controlId}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    className="w-full"

                />
            </HeroTextField>
        </FieldFrame>
    )
}

/** Tier metadata for `InputTextarea`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputTextarea" } as const
