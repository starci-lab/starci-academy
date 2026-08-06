/** @noSkeleton an on/off control — the checked value is owned by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { Switch as HeroSwitch } from "@heroui/react"

/** Props for {@link Switch}. */
export interface SwitchProps extends Omit<ComponentProps<typeof HeroSwitch>, "className" | "classNames"> {
    /** Compound switch parts. */
    children?: ReactNode
}

/** House switch over HeroUI `Switch`. */
export const Switch = ({ children, ...props }: SwitchProps) => (
    <HeroSwitch data-tier="atom" data-component="Switch" {...props}>{children}</HeroSwitch>
)

/** House content over HeroUI `Switch.Content`. */
export const SwitchContent = HeroSwitch.Content
/** House control over HeroUI `Switch.Control`. */
export const SwitchControl = HeroSwitch.Control
/** House thumb over HeroUI `Switch.Thumb`. */
export const SwitchThumb = HeroSwitch.Thumb

/** Tier metadata for `Switch`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "Switch" } as const
