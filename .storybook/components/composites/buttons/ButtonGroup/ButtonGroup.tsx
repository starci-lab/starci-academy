import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ALIGN_CLS, type ButtonAlign, type ButtonSize, type ButtonVariant, type IconComponent } from "@sb-components/atoms/buttons/Button/button-tokens"

/**
 * `ButtonGroup` — a row of buttons described by `items` data.
 *
 * Imports `Button` and renders one per item; it adds only row layout (gap),
 * nothing else. Per-button state (`variant`/`isPending`/`isDisabled`) is a
 * pass-through prop that belongs to `Button`.
 */

/** One button in a {@link ButtonGroup} — described as data, not JSX. */
export interface ButtonGroupItem {
    /** React key + action identifier. */
    key: string
    /** Button label. Omit for an icon-only button (then `prefixIcon` + `ariaLabel` are required). */
    label?: ReactNode
    /** Icon component — leading glyph when `label` is set, sole glyph otherwise. */
    prefixIcon?: IconComponent
    /** Accessible name — required when there is no `label`. */
    ariaLabel?: string
    /** Action intent → variant. Default `primary`. */
    variant?: ButtonVariant
    onPress?: () => void
    isDisabled?: boolean
    /** `true` marks this button busy: spinner + locked press, scoped to this button only. */
    isPending?: boolean
}

/** Props for {@link ButtonGroup} — a row cluster of buttons. */
export interface ButtonGroupProps {
    /** The row's buttons, described as data. An item with `label` renders labeled; without, icon-only. */
    items: Array<ButtonGroupItem>
    /** Scale shared by the whole row (default `md`) — every button in a cluster is the same size. */
    size?: ButtonSize
    /** `true` renders a skeleton mirroring the item count (pill/square per item). */
    isSkeleton?: boolean
    showAnatomy?: boolean
    /**
     * Where this row of buttons sits inside its parent's width — `justify-start` /
     * `justify-end` / `w-full justify-between` (`between` also claims the full
     * width, else `justify-between` has no room to spread). Same vocabulary as `Button`'s own `align`.
     */
    align?: ButtonAlign
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

export const ButtonGroup = ({
    items,
    size = "md",
    isSkeleton = false,
    showAnatomy = false,
    align,
    className,
    classNames,
}: ButtonGroupProps) => (
    <div className={cn("flex items-center gap-2", align && ALIGN_CLS[align], className, classNames)}>
        {items.map(({ key, label, prefixIcon, ariaLabel, variant, onPress, isDisabled, isPending }) => {
            // Deps tree is built from the DOM, so each rendered Button must be tagged by name.
            const anatPart = showAnatomy ? "Button" : undefined
            const shared = { variant, size, onPress, isDisabled, isPending, anatPart } as const
            if (label != null) {
                return <Button key={key} label={label} prefixIcon={prefixIcon} isSkeleton={isSkeleton} {...shared} />
            }
            if (prefixIcon == null) return null
            return (
                <Button
                    key={key}
                    isIconOnly
                    prefixIcon={prefixIcon}
                    ariaLabel={ariaLabel ?? ""}
                    isSkeleton={isSkeleton}
                    {...shared}
                />
            )
        })}
    </div>
)
