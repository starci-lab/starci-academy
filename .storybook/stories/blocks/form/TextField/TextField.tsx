import React, { useId } from "react"
import { Input, TextField as HeroTextField, cn } from "@heroui/react"
import type { Icon } from "@phosphor-icons/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the GOLDEN single-line text input, the template
 * every other field input clones. Authored in Storybook (not `src`); synced to
 * `src` later. No `@/components` import — self-contained.
 *
 * TextField composes {@link FieldShell} (label / hint / error / skeleton column,
 * canon §4/§8) with HeroUI's `<TextField><Input/></TextField>`. The consumer
 * passes a bare `value` + `onValueChange` (canon §4 Ownership) — never structure.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link TextField}. */
export interface TextFieldProps {
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
     * Optional leading icon (a Phosphor icon component) shown inside the field on
     * the start edge; the input padding is offset to clear it.
     */
    leadingIcon?: Icon
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * TextField is the golden single-line text input: a controlled field wrapped in
 * {@link FieldShell} so its label, hint, error, and loading skeleton all come for
 * free. It threads `value`/`onValueChange` straight into HeroUI's `Input`, marks
 * the field invalid whenever {@link TextFieldProps.errorMessage} is set, and can
 * host an optional {@link TextFieldProps.leadingIcon}.
 *
 * @param props - {@link TextFieldProps}
 */
export const TextField = ({
    label,
    description,
    errorMessage,
    placeholder,
    value,
    onValueChange,
    isDisabled,
    isSkeleton,
    leadingIcon: LeadingIcon,
    className,
}: TextFieldProps) => {
    // one id shared by the FieldShell label (htmlFor) and the Input (focus wiring)
    const id = useId()
    const isInvalid = errorMessage != null

    return (
        <FieldShell
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.Input />}
            id={id}
            className={className}
        >
            {/* HeroUI TextField owns invalid/disabled state; Input is the box. */}
            <HeroTextField
                aria-label={typeof label === "string" ? label : undefined}
                isInvalid={isInvalid}
                isDisabled={isDisabled}
                className="w-full"
            >
                <div className="relative">
                    {LeadingIcon ? (
                        <LeadingIcon className="text-muted pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2" />
                    ) : null}
                    <Input
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onValueChange(event.target.value)}
                        className={cn("w-full", LeadingIcon && "pl-9")}
                    />
                </div>
            </HeroTextField>
        </FieldShell>
    )
}
