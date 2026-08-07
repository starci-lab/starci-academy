import { FieldSkeleton, type FrameProps } from "@/components/atoms/forms"
import { useId, useState } from "react"
import { cn } from "@heroui/react"
import { Chip } from "@/components/atoms/chips/Chip"
import { FieldFrame, fieldName } from "@/components/composites/form/_field/FieldFrame"

import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"

/**
 * `InputTags` — token input row: `value` a string[], add with Enter, remove with ×.
 *
 * Moved out of `atoms/forms/Input/Input.tsx` (ATOM-8, 2026-07-31): it rebuilt one
 * `Chip` per tag, which is the composite signal (rendering another house atom once
 * per item), not the atom one. It still carries the same label/hint/error frame
 * every other `Input.*` member does via {@link FrameProps}, and still draws the
 * same field-box shimmer via `FieldSkeleton` while loading — both stayed behind at
 * the atom tier and are imported back in here rather than redrawn.
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
    
    label,
    hint,
    errorMessage,
    isRequired}: InputTagsProps) => {
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
            skeletonControl={FieldSkeleton}
        >
            <Box
                principle="control-pad"
                explain="Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row."
                className={cn(
                    "bg-default-100 w-full rounded-xl border px-3 py-2",
                    invalid ? "border-danger" : "border-default-200",
                    isDisabled && "pointer-events-none opacity-50")}
            >
                <Cluster
                    gap={3}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    align="center"
                    items={[
                        ...value.map((tag, index) => () => (
                            <span className="inline-flex">
                                <Chip
                                    text={tag}
                                    onRemove={isDisabled ? undefined : () => removeAt(index)}
                                    removeLabel={removeLabel}
                                />
                            </span>
                        )),
                        () => (
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
                                className="min-w-24 flex-1 bg-transparent px-1 py-0 text-sm outline-none"
                            />
                        ),
                    ]}
                />
            </Box>
        </FieldFrame>
    )
}
