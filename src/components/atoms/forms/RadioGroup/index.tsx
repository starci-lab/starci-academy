/** @noSkeleton groups radios — the selected value is owned by the caller. */
import type { ComponentProps, ReactNode } from "react"
import { RadioGroup as HeroRadioGroup } from "@heroui/react"

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps extends Omit<ComponentProps<typeof HeroRadioGroup>, "className" | "classNames"> {
    /** Radio rows. */
    children?: ReactNode
}

/** House radio group over HeroUI `RadioGroup`. */
export const RadioGroup = ({ children, ...props }: RadioGroupProps) => (
    <HeroRadioGroup data-tier="atom" data-component="RadioGroup" {...props}>{children}</HeroRadioGroup>
)

/** Tier metadata for `RadioGroup`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "RadioGroup" } as const
