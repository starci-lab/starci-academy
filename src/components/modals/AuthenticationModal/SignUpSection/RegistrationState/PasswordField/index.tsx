"use client"

import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
    useState,
} from "react"
import {
    Button,
    cn,
    FieldError,
    Input,
    Label,
    TextField,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PasswordField}. */
export interface PasswordFieldProps extends WithClassNames<undefined> {
    /** DOM id / `name` for the input (e.g. `sign-up-password`). */
    fieldId: string
    /** Form field name passed to the underlying input. */
    name: string
    /** Label text shown above the input. */
    label: string
    /** Placeholder text shown inside the input. */
    placeholder: string
    /** Current password value. */
    value: string
    /** Validation error message, if any. */
    error?: string
    /** Whether the field has been touched (controls error visibility). */
    touched?: boolean
    /** Fired with the new password value on change. */
    onChangeValue: (value: string) => void
    /** Fired when the field loses focus. */
    onBlurField: () => void
    /** aria-label shown when the password is currently plaintext (defaults to the sign-up password copy). */
    hideLabel?: string
    /** aria-label shown when the password is currently masked (defaults to the sign-up password copy). */
    showLabel?: string
}

/**
 * Reusable password input row for the sign-up step, used for both the password
 * and confirm-password fields, with an independent show/hide toggle.
 *
 * Presentational: owns only the local plaintext-visibility toggle (UI state);
 * everything else is prop-driven. No business logic.
 * @param props - field identity, label/placeholder, value, validation, callbacks
 */
export const PasswordField = ({
    fieldId,
    name,
    label,
    placeholder,
    value,
    error,
    touched,
    onChangeValue,
    onBlurField,
    className,
    hideLabel,
    showLabel,
}: PasswordFieldProps) => {
    // local UI-only state: whether this field is shown as plaintext
    const [showPassword, setShowPassword] = useState(false)
    const onToggleVisibility = useCallback(
        () => setShowPassword((shown) => !shown),
        [],
    )

    return (
        <TextField variant="secondary" className={cn(className)} isInvalid={!!(touched && error)}>
            <Label htmlFor={fieldId} className="text-sm">
                {label}
            </Label>
            <div className="relative">
                <Button
                    isIconOnly
                    variant="ghost"
                    aria-label={showPassword ? hideLabel : showLabel}
                    className="absolute right-2 top-1/2 -translate-y-1/2 min-w-8 h-8 border-none text-muted hover:text-foreground"
                    onPress={onToggleVisibility}
                >
                    {showPassword ? (
                        <EyeIcon className="size-4" />
                    ) : (
                        <EyeSlashIcon className="size-4" />
                    )}
                </Button>
                <Input
                    id={fieldId}
                    required
                    variant="secondary"
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    name={name}
                    className="w-full"
                    value={value}
                    onChange={(event) => onChangeValue(event.target.value)}
                    onBlur={onBlurField}
                />
            </div>
            <FieldError>{error}</FieldError>
        </TextField>
    )
}
