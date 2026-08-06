/** @noSkeleton a single radio control — the selected value is owned above. */
import type { ComponentProps, ReactNode } from "react"
import { Radio as HeroRadio } from "@heroui/react"

/** Props for {@link Radio}. */
export interface RadioProps extends Omit<ComponentProps<typeof HeroRadio>, "className" | "classNames"> {
    /** Optional visible label beside the radio. */
    children?: ReactNode
}

/** House radio over HeroUI `Radio`. */
export const Radio = ({ children, ...props }: RadioProps) => (
    <HeroRadio data-tier="atom" data-component="Radio" {...props}>{children}</HeroRadio>
)

/** House radio content slot over HeroUI `Radio.Content`. */
export const RadioContent = HeroRadio.Content

/** Tier metadata for `Radio`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "Radio" } as const
