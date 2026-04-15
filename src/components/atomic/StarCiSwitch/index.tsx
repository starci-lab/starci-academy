import { Switch } from "@heroui/react"
import type { SwitchRootProps } from "@heroui/react"
import React from "react"
/**
 * StarCiSwitch is a wrapper component for the Switch component.
 * @param props - The props for the Switch component.
 * @returns The StarCiSwitch component.
 */
export const StarCiSwitch = (props: SwitchRootProps) => {
    return <Switch {...props} />
}
/**
 * StarCiSwitchControl is a wrapper component for the Switch.Control component.
 * @param props - The props for the Switch.Control component.
 * @returns The StarCiSwitchControl component.
 */
export const StarCiSwitchControl = Switch.Control
/**
 * StarCiSwitchThumb is a wrapper component for the Switch.Thumb component.
 * @param props - The props for the Switch.Thumb component.
 * @returns The StarCiSwitchThumb component.
 */
export const StarCiSwitchThumb = Switch.Thumb
/**
 * StarCiSwitchContent is a wrapper component for the Switch.Content component.
 * @param props - The props for the Switch.Content component.
 * @returns The StarCiSwitchContent component.
 */
export const StarCiSwitchContent = Switch.Content
/**
 * StarCiSwitchIcon is a wrapper component for the Switch.Icon component.
 * @param props - The props for the Switch.Icon component.
 * @returns The StarCiSwitchIcon component.
 */
export const StarCiSwitchIcon = Switch.Icon