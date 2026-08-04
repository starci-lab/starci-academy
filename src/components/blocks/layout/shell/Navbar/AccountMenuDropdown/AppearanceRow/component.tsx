import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    DarkLightModeSwitch,
} from "../DarkLightMode"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _AppearanceRow} — presentational; the label already resolved. */
export interface AppearanceRowProps extends WithClassNames<undefined> {
    /** Already-localized "Appearance" row label. */
    label: string
}

/**
 * Appearance row: label plus the dark/light mode switch.
 *
 * Presentational: composes the existing {@link DarkLightModeSwitch}. Theme
 * state lives inside the switch; no business logic here.
 * @param props - {@link AppearanceRowProps}
 */
export const _AppearanceRow = ({ label, className }: AppearanceRowProps) => (
    <div className={cn("flex items-center justify-between gap-3 py-3 px-4", className)}>
        <div className="text-sm">{label}</div>
        <DarkLightModeSwitch />
    </div>
)
