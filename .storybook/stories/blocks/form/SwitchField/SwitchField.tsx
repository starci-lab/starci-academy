import React, { useId } from "react"
import { Switch, Label } from "@heroui/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the boolean toggle field. Authored in Storybook
 * (not `src`); synced to `src` later. No `@/components` import — self-contained.
 *
 * SwitchField composes {@link FieldShell} (hint / error / skeleton column, canon
 * §4/§8) with HeroUI's compound `<Switch><Switch.Content>…</Switch.Content></Switch>`.
 * Unlike TextField/Select, a boolean toggle's label sits BESIDE the control, not
 * above it (FieldShell's own doc comment calls this out for Checkbox/Switch/
 * RadioGroup) — so `label` is rendered by SwitchField itself, as a sibling of the
 * `<Switch>` inside the row, and FieldShell is composed WITHOUT its `label` prop.
 * FieldShell still owns the hint/error/skeleton column around that row.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link SwitchField}. */
export interface SwitchFieldProps {
    /**
     * Label rendered BESIDE the switch (`text-sm font-medium`), not above it —
     * a boolean toggle reads as "[switch] Label", unlike a text field's label-on-top.
     */
    label?: React.ReactNode
    /** Hint under the row (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the row (`text-sm text-danger-soft-foreground`). When
     * present the field reads as invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** Current selected state (controlled). */
    value: boolean
    /** Fires with the new selected state when the switch is toggled. */
    onValueChange: (value: boolean) => void
    /** Disables the switch. */
    isDisabled?: boolean
    /** Renders the loading mirror — a switch-track skeleton (canon §8). */
    isSkeleton?: boolean
    /** Track size — HeroUI's `Switch` meaningfully supports sm/md/lg. */
    size?: "sm" | "md" | "lg"
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * SwitchField is the boolean toggle field: a controlled `<Switch>` with its label
 * rendered BESIDE it (row: switch + label), wrapped in {@link FieldShell} so the
 * hint, error, and loading skeleton all come for free around that row. It threads
 * `value`/`onValueChange` straight into HeroUI's `Switch`, and marks the field
 * invalid whenever {@link SwitchFieldProps.errorMessage} is set.
 *
 * @param props - {@link SwitchFieldProps}
 */
export const SwitchField = ({
    label,
    description,
    errorMessage,
    value,
    onValueChange,
    isDisabled,
    isSkeleton,
    size,
    className,
}: SwitchFieldProps) => {
    // one id shared by the switch row and (were it label-on-top) the FieldShell label;
    // kept for parity with the other field inputs even though the visible label here
    // is a row sibling, not FieldShell's own `label` slot.
    const id = useId()
    const isInvalid = errorMessage != null

    return (
        <FieldShell
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.Switch />}
            id={id}
            className={className}
        >
            {/* NOTE: label text is NOT passed through Switch.Content — the codebase's
                existing Switch usages (PrivacySettings, CvGallery) keep the label a
                SIBLING to dodge a react-aria slot-content requirement on `Switch.Content`
                (same family of gotcha as Radio.Content, see house notes). */}
            <div className="flex items-center gap-3">
                <Switch
                    id={id}
                    size={size}
                    isSelected={value}
                    onChange={onValueChange}
                    isDisabled={isDisabled}
                    isInvalid={isInvalid}
                    aria-label={typeof label === "string" ? label : undefined}
                >
                    <Switch.Content>
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch.Content>
                </Switch>
                {label != null ? (
                    <Label isDisabled={isDisabled} className="text-sm font-medium">
                        {label}
                    </Label>
                ) : null}
            </div>
        </FieldShell>
    )
}
