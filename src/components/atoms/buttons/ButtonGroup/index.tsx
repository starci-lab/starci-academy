/** @noSkeleton fused chrome around caller-supplied buttons — there is no fetched value. */
import type { ComponentProps, ReactNode } from "react"
import { ButtonGroup as HeroButtonGroup } from "@heroui/react"

/** Props for {@link ButtonGroupRoot}. */
export interface ButtonGroupRootProps {
    /** Fused segments — house `Button` atoms, not vendor buttons. */
    children: ReactNode
    /** Shared size for every segment. */
    size?: ComponentProps<typeof HeroButtonGroup>["size"]
}

/** Vendor fused button group — edge-joined segments with a shared separator. */
export const ButtonGroupRoot = ({ children, size }: ButtonGroupRootProps) => (
    <HeroButtonGroup data-tier="atom" data-component="ButtonGroupRoot" size={size} className="w-fit">
        {children}
    </HeroButtonGroup>
)

/** Seam injected inside the following segment of a fused group. */
export const ButtonGroupSeparator = () => (
    <HeroButtonGroup.Separator className="!top-0 !h-full !bg-border !opacity-100" />
)

export const meta = [
    { tier: "atom", name: "ButtonGroupRoot" },
    { tier: "atom", name: "ButtonGroupSeparator" },
] as const
