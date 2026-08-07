import { type SkeletonProps } from "@/components/frames/_slot"
import { Button } from "@/components/atoms/buttons/Button"
import type { IconComponent } from "@/components/atoms/buttons/Button/button-tokens"
import { ResponsiveCluster, type ResponsiveClusterItem } from "@/components/frames/ResponsiveCluster"
import type { ResponsiveRowSwitch } from "@/components/frames/ResponsiveRow"

/**
 * `ActionBar` — the `primary` · `secondary` · `dismiss` row that ends a form, a
 * modal, a drawer. THREE DIFFERENT ROLES, never N of the same kind — that is
 * the whole reason this is not `ButtonGroup`: a filter row is N elements of
 * one kind (`items`), Submit / Save draft / Cancel is three named slots.
 *
 * The slot decides the variant, never the caller: `primary` → `"primary"`,
 * `secondary` → `"secondary"`, `dismiss` → `"ghost"`. Built on `ResponsiveCluster`,
 * the same frame `ButtonGroup` renders through — a full-width column below the
 * named container step in `at`, a packed row from it up, one fixed internal
 * gap (step `3`) on both sides.
 */

/** One action slot of an {@link ActionBar} — `primary`, `secondary`, or `dismiss`. */
export interface ActionBarSlot {
    /** Button text. The slot's variant is fixed by its role — never passed here. */
    label: string
    onPress?: () => void
    /** Leading glyph — same scale/weight rule as `Button`'s own `prefixIcon`. */
    prefixIcon?: IconComponent
    /** `true` disables this one action only. */
    isDisabled?: boolean
    /** `true` marks this one action busy: spinner + locked press, scoped to it alone. */
    isPending?: boolean
}

/** The three roles a slot can render as — fixed by position, never a caller choice. */
type ActionBarVariant = "primary" | "secondary" | "ghost"

/** Props for {@link ActionBar}. */
export interface ActionBarProps {
    /**
     * The row's one emphasized action. Required — every action row has exactly
     * one. Renders `variant="primary"`.
     */
    primary: ActionBarSlot
    /**
     * A second, lower-emphasis action beside `primary` (e.g. "Save draft").
     * Renders `variant="secondary"`.
     */
    secondary?: ActionBarSlot
    /**
     * The row's exit action (e.g. "Cancel"). Renders `variant="ghost"` — never
     * emphasized, so it never competes with `primary`.
     */
    dismiss?: ActionBarSlot
    /** `true` renders every present slot as a skeleton button, mirroring the same roles. */
    isSkeleton?: boolean
    /**
     * Container step this row leaves the full-width column for the packed row
     * at. Default `md` — action labels ("Save draft", "Submit for review") run
     * longer than `ButtonGroup`'s filter pills, so the row waits for more room
     * before packing than `ButtonGroup`'s own default (`sm`) does.
     */
    at?: ResponsiveRowSwitch
}

/** Component-tier metadata for `ActionBar` — registers it as a composite named `ActionBar`. */
export const meta = { tier: "composite", name: "ActionBar" } as const

/** A slot → its buildable `Button`, or `null` when the slot was not passed. */
const renderSlot = (
    key: string,
    slot: ActionBarSlot | undefined,
    variant: ActionBarVariant,
): ResponsiveClusterItem | null => {
    if (!slot) return null
    const { label, prefixIcon, onPress, isDisabled, isPending } = slot
    return {
        key,
        content: ({ isSkeleton }: SkeletonProps) => (
            <Button
                label={label}
                prefixIcon={prefixIcon}
                variant={variant}
                onPress={onPress}
                isDisabled={isDisabled}
                isPending={isPending}
                isSkeleton={isSkeleton}
            />
        ),
    }
}

/**
 * The `primary` · `secondary` · `dismiss` row.
 *
 * @param props - {@link ActionBarProps}
 */
export const ActionBar = ({
    primary,
    secondary,
    dismiss,
    isSkeleton = false,
    at = "md",
    
}: ActionBarProps) => {
    const items = [
        renderSlot("dismiss", dismiss, "ghost"),
        renderSlot("secondary", secondary, "secondary"),
        renderSlot("primary", primary, "primary"),
    ].filter((item): item is ResponsiveClusterItem => item != null)

    return (
        <ResponsiveCluster
            data-tier="composite"
            data-component="ActionBar"
            at={at}
            gap={3}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            justify="end"
            isSkeleton={isSkeleton}
            items={items}
        />
    )
}
