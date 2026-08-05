import { useId, useState } from "react"
import { cn } from "@heroui/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { FieldFrame, fieldName } from "@sb-components/atoms/forms/_field/FieldFrame"
import { FieldSkeleton, type FrameProps } from "@sb-components/atoms/forms"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Box } from "@sb-components/frames/Box/Box"

/**
 * `InputTags` — a tag-input field where each token is a removable `Chip` (`<Chip onRemove … />`),
 * rebuilt one per tag. Wraps `FieldFrame`, whose `Label`/`Skeleton` are real heroui components.
 */
export interface InputTagsProps extends FrameProps {
    /** Tags in order. */
    value: string[]
    /** Fires with the full set after an add or a remove. */
    onValueChange: (value: string[]) => void
    /** Placeholder shown only while `value` is empty. */
    placeholder?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Accessible name used when there's no `label` (otherwise the label handles it). */
    ariaLabel?: string
    /** Accessible name on each tag's remove button. */
    removeLabel?: string
    /** Render the field-box skeleton instead of the box. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "InputTags" } as const

/** `InputTags` — token input: builds one removable `Chip` per tag, plus a draft text cell. */
export const InputTags = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel = "Tags",
    removeLabel = "Remove tag",
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: InputTagsProps) => {
    // Ephemeral draft text — NOT part of the semantic value.
    const [draft, setDraft] = useState("")
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    const commit = () => {
        const token = draft.trim()
        if (token && !value.includes(token)) {
            onValueChange([...value, token])
        }
        setDraft("")
    }
    const removeAt = (index: number) => onValueChange(value.filter((_, i) => i !== index))
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}

            id={controlId}
            skeletonControl={<Box className={cn(classNames)}><FieldSkeleton /></Box>}
        >
            <Box
                principles="control-pad"
                className={cn(
                    "bg-default-100 flex w-full flex-wrap items-center gap-2 rounded-xl border px-3 py-2",
                    invalid ? "border-danger" : "border-default-200",
                    isDisabled && "pointer-events-none opacity-50",
                    classNames,
                )}
            >
                {value.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="inline-flex">
                        <Chip
                            text={tag}
                            onRemove={isDisabled ? undefined : () => removeAt(index)}
                            removeLabel={removeLabel}

                        />
                    </span>
                ))}
                {/* `px-1 py-0` is the native `<input>`'s own inline text-inset, not a layout
                    div — `Box` can only wrap `div`/`span`/… (not stand in for a form
                    control's own attributes), so this stays a bare `<input>`; nearest
                    token by intent (a control holding short text), data-principles
                    hand-set directly since there is no exact padding-xy shape for it. */}
                <input
                    id={controlId}
                    aria-label={fieldName(label, ariaLabel)}
                    value={draft}
                    disabled={isDisabled}
                    placeholder={value.length === 0 ? placeholder : undefined}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                            commit()
                        } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
                            removeAt(value.length - 1)
                        }
                    }}
                    // not a wrappable layout div (see the comment above this element) —
                    // inset-exception: native <input> text-inset, a form control's own attribute
                    data-principles="control-pad" className="min-w-24 flex-1 bg-transparent px-1 py-0 text-sm outline-none"
                />
            </Box>
        </FieldFrame>
    )
}
