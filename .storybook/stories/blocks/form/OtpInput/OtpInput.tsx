import React from "react"
import { cn, InputOTP, Label, Typography } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/form/OtpInput`.
 * Authored in Storybook (not `src`); synced to `src` later. Faithful port of the
 * whole prop API + every legacy state; no `@/components` import.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Props for the {@link OtpInput} block.
 *
 * A controlled one-time-code field (2FA / email verification) built on HeroUI
 * {@link InputOTP}. Tier-3 presentational — the value and every state arrive via
 * props; the block owns no state, store, or fetch.
 */
export interface OtpInputProps {
    /**
     * Number of code slots to render (also the `maxLength` of the underlying
     * input). Default `6` — the common 2FA / email-verification length.
     */
    length?: number
    /**
     * Current code value (controlled). A string of the digits entered so far;
     * its length must not exceed {@link length}.
     */
    value: string
    /**
     * Fires with the full string on every change. Wire it to the caller's state
     * setter — the block never mutates the value itself.
     */
    onChange: (value: string) => void
    /**
     * When `true`, paints the slots in the error style and reveals
     * {@link errorMessage} (if provided) below the field.
     */
    isInvalid?: boolean
    /**
     * Error line shown under the field while {@link isInvalid} is `true`. Prefer
     * a message that says how to fix it ("Mã không đúng, kiểm tra lại email"),
     * not just "sai". Rendered `body-xs` in the danger token.
     */
    errorMessage?: React.ReactNode
    /**
     * Auto-focuses the first slot on mount — handy when the field is the only
     * action on a verification screen. Default `false`.
     */
    autoFocus?: boolean
    /**
     * Optional label rendered above the slots (e.g. "Mã xác minh"). Omit for a
     * bare field.
     */
    label?: React.ReactNode
    /** Extra classes on the outer wrapper. */
    className?: string
}

/**
 * OtpInput is a controlled one-time-code field for 2FA and email verification,
 * built on HeroUI {@link InputOTP}. It renders {@link length} individual slots
 * (default `6`) driven by a single `value` string, an optional {@link label}
 * above, and an optional {@link errorMessage} below that only appears while
 * {@link isInvalid} is `true`.
 *
 * @param props - {@link OtpInputProps}
 */
export const OtpInput = ({
    length = 6,
    value,
    onChange,
    isInvalid,
    errorMessage,
    autoFocus,
    label,
    className,
}: OtpInputProps) => {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {/* Optional field label above the slots */}
            {label != null ? <Label>{label}</Label> : null}

            {/* HeroUI InputOTP: `maxLength` = slot count; value/onChange are
                threaded straight through (controlled). One Slot per index. */}
            <InputOTP
                maxLength={length}
                value={value}
                onChange={onChange}
                isInvalid={isInvalid}
                autoFocus={autoFocus}
            >
                <InputOTP.Group>
                    {Array.from({ length }, (_, index) => (
                        <InputOTP.Slot key={index} index={index} />
                    ))}
                </InputOTP.Group>
            </InputOTP>

            {/* Error line — only while invalid, mirrors the TextField error slot */}
            {isInvalid && errorMessage != null ? (
                <Typography type="body-xs" className="text-danger-soft-foreground">
                    {errorMessage}
                </Typography>
            ) : null}
        </div>
    )
}
