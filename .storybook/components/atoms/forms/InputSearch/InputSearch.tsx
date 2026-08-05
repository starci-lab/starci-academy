import { useId } from "react"
import { SearchField as HeroSearchField, cn } from "@heroui/react"
import { FieldFrame, fieldName } from "@sb-components/atoms/forms/_field/FieldFrame"
import type { StringFieldProps } from "../_input/types"
import { FieldSkeleton } from "../_input/FieldSkeleton"

/** `InputSearch` — search field (HeroUI SearchField: leading icon + built-in clear). */
export const InputSearch = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel = "Search",
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: StringFieldProps) => {
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
            <HeroSearchField
                data-tier="atom"
                data-component="InputSearch"
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                className={cn("w-full", classNames)}
            >
                <HeroSearchField.Group>
                    <HeroSearchField.SearchIcon />
                    <HeroSearchField.Input id={controlId} placeholder={placeholder} />
                </HeroSearchField.Group>
            </HeroSearchField>
        </FieldFrame>
    )
}

/** Tier metadata for `InputSearch`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "InputSearch" } as const
