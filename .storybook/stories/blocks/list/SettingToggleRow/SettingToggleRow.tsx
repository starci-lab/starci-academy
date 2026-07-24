import React from "react"
import { Switch, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { TitledText } from "../../text/TitledText/TitledText"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `SettingToggleRow`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in the hand-roll toggle rows in
 * `src/components/features/profile/PrivacySettings` (the "Khoá hồ sơ" lock row
 * + the per-section visibility rows): `Label` + a muted hint stacked on the
 * left, a `Switch` pinned to the right, `gap-3` between them. This primitive
 * GENERALISES that repeated shape — label/description/checked/onCheckedChange
 * all become plain props so any settings surface (privacy, notifications,
 * appearance…) can reuse ONE row instead of hand-rolling the flex/Label/Switch
 * triplet again.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Props for the {@link SettingToggleRow} primitive.
 */
export interface SettingToggleRowProps {
    /**
     * Row label — short, single line (e.g. "Khoá hồ sơ").
     */
    label: string
    /**
     * Optional muted hint under the label explaining what the toggle does.
     */
    description?: string
    /**
     * Current toggle state (controlled).
     */
    checked: boolean
    /**
     * Fires with the next state when the switch is toggled.
     */
    onCheckedChange: (checked: boolean) => void
    /**
     * Disables the switch (e.g. a lock row overriding a whole group). The row
     * also dims to signal it's inert, matching the hand-roll's
     * `aria-disabled` + opacity treatment on the gated section-visibility group.
     */
    isDisabled?: boolean
    /** Extra classes on the row root. */
    className?: string
    /** `true` → render the skeleton mirror (label + desc bars, switch pill). Consumer just flips the flag. */
    isSkeleton?: boolean
}

/**
 * Generic settings row: a label (+ optional muted description) on the left, a
 * HeroUI `Switch` pinned to the right. Presentational — the caller owns
 * persistence/state; this row only reports the next boolean via
 * {@link SettingToggleRowProps.onCheckedChange}.
 */
export const SettingToggleRow = ({
    label,
    description,
    checked,
    onCheckedChange,
    isDisabled = false,
    className,
    isSkeleton = false,
}: SettingToggleRowProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                {/* title↔description stack = TitledText (skeleton mirror delegated) */}
                <TitledText title={label} subtitle={description} isSkeleton className="flex-1" />
                <Skeleton.Switch className="shrink-0" />
            </div>
        )
    }
    return (
        <div className={cn("flex items-center gap-3", isDisabled && "opacity-50", className)}>
            {/* label (body-sm medium) + muted description = one TitledText row */}
            <TitledText title={label} subtitle={description} className="flex-1" />
            <Switch
                className="shrink-0"
                isSelected={checked}
                isDisabled={isDisabled}
                onChange={onCheckedChange}
                aria-label={label}
            >
                <Switch.Content>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                </Switch.Content>
            </Switch>
        </div>
    )
}
