import type { ReactNode } from "react"
import { Radio as HeroRadio, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { SKELETON_TEXT_BAR } from "@/components/atoms/_skeleton-bar"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * Props for {@link ChoiceRadio} — one option row; must live inside a
 * `ChoiceRadioGroup` (composite tier).
 *
 * No `hint`/`errorMessage`/`isRequired`: those describe the group, not a single
 * option, so they live on `ChoiceRadioGroup` instead.
 */
export interface ChoiceRadioProps {
    /** Value reported to the group's `onValueChange` when this option is picked. */
    value: string
    /** Label sits BESIDE the dot (Radio.Content). */
    label: ReactNode
    /** Disable just this option row. */
    isDisabled?: boolean
    /** Render the control-shaped skeleton — one radio-row shimmer (dot + label bar). */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceRadio` — one radio option row (HeroUI Radio compound). Renders inside `ChoiceRadioGroup`. */
export const ChoiceRadio = ({ value, label, isDisabled, isSkeleton, classNames }: ChoiceRadioProps) => {
    if (isSkeleton) {
        return (
            <div data-tier="atom" data-component="ChoiceRadio" className={cn("flex items-center gap-3", classNames)}>
                <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/3")} />
            </div>
        )
    }
    return (
        <HeroRadio data-tier="atom" data-component="ChoiceRadio" value={value} isDisabled={isDisabled} className={cn(classNames)}>
            <HeroRadio.Content>
                <HeroRadio.Control>
                    <HeroRadio.Indicator />
                </HeroRadio.Control>
                <span className="min-w-0">{label}</span>
            </HeroRadio.Content>
        </HeroRadio>
    )
}

/** Tier metadata for `ChoiceRadio`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "ChoiceRadio" } as const
