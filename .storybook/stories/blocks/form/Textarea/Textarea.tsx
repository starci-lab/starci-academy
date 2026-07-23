import React, { useId } from "react"
import { TextArea as HeroTextarea, TextField as HeroTextField, cn } from "@heroui/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the multi-line text input, cloned from the
 * golden {@link ../TextField/TextField.tsx | TextField}. Authored in Storybook
 * (not `src`); synced to `src` later. No `@/components` import — self-contained.
 *
 * Textarea composes {@link FieldShell} (label / hint / error / skeleton column,
 * canon §4/§8) with HeroUI's `<TextField><TextArea/></TextField>` — the same
 * field wrapper the golden TextField uses, just swapping the single-line
 * `Input` control for the multi-line `TextArea` control. The consumer passes a
 * bare `value` + `onValueChange` (canon §4 Ownership) — never structure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link Textarea}. */
export interface TextareaProps {
    /** Label rendered above the field (`text-sm font-medium`). */
    label?: React.ReactNode
    /** Hint under the label (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the field (`text-sm text-danger-soft-foreground`). When
     * present the field is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** Placeholder inside the empty field. */
    placeholder?: string
    /** Current value (controlled). */
    value: string
    /** Fires with the new value on every keystroke. */
    onValueChange: (value: string) => void
    /** Disables the field. */
    isDisabled?: boolean
    /** Renders the loading mirror — label bar + field-box skeleton (canon §8). */
    isSkeleton?: boolean
    /**
     * Visible text-row count (native `<textarea rows>`). Defaults to 3, matching
     * {@link Skeleton.TextArea}'s default so the loading mirror never shifts the
     * field's height when the real control arrives.
     *
     * NOTE: HeroUI's `TextArea` is a thin wrapper over react-aria-components'
     * `TextArea`, which only forwards the native `rows` attribute — there is no
     * `minRows`/auto-grow prop on the real control, so this input does not
     * invent one.
     */
    rows?: number
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * Textarea is the multi-line text input, cloned from the golden {@link TextField}:
 * a controlled field wrapped in {@link FieldShell} so its label, hint, error, and
 * loading skeleton all come for free. It threads `value`/`onValueChange` straight
 * into HeroUI's `TextArea`, marks the field invalid whenever
 * {@link TextareaProps.errorMessage} is set, and mirrors its own row height while
 * {@link TextareaProps.isSkeleton}.
 *
 * @param props - {@link TextareaProps}
 */
export const Textarea = ({
    label,
    description,
    errorMessage,
    placeholder,
    value,
    onValueChange,
    isDisabled,
    isSkeleton,
    rows = 3,
    className,
}: TextareaProps) => {
    // one id shared by the FieldShell label (htmlFor) and the TextArea (focus wiring)
    const id = useId()
    const isInvalid = errorMessage != null

    return (
        <FieldShell
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.TextArea rows={rows} />}
            id={id}
            className={className}
        >
            {/* HeroUI TextField owns invalid/disabled state; TextArea is the multi-line box. */}
            <HeroTextField
                aria-label={typeof label === "string" ? label : undefined}
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                className="w-full"
            >
                <HeroTextarea
                    id={id}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    className={cn("w-full")}
                />
            </HeroTextField>
        </FieldShell>
    )
}
