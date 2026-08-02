import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/button-tokens"
import { ResponsiveCluster, type ResponsiveClusterItem } from "@sb-components/frames/ResponsiveCluster/ResponsiveCluster"
import type { ResponsiveRowSwitch } from "@sb-components/frames/ResponsiveRow/ResponsiveRow"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE — `ActionBar`: the `primary` · `secondary` · `dismiss` row that ends
 * a form, a modal, a drawer. THREE DIFFERENT ROLES, never N of the same kind —
 * that is the whole reason this is not `ButtonGroup`. `examples/composite.md`'s
 * own test: "is the content N elements of the SAME kind repeating?" A filter
 * row answers yes → `ButtonGroup.items`. Submit / Save draft / Cancel answers
 * NO → three named slots, here.
 *
 * NAMED SLOTS, NOT A LIST. `primary` is the one slot every caller must fill;
 * `secondary`/`dismiss` are optional. A list has no way to say "at most one of
 * these is primary" — two primary actions would just be two items with the
 * same variant. A named slot makes that unrepresentable instead of merely
 * discouraged: there is exactly one prop called `primary`, so a second one has
 * nowhere to go.
 *
 * THE SLOT DECIDES THE VARIANT — never the caller. `primary` → variant
 * `"primary"`, `secondary` → `"secondary"`, `dismiss` → `"ghost"`. Two screens
 * cannot disagree about what a cancel button looks like, because there is
 * nowhere on this component to tell it otherwise.
 *
 * LAYOUT, BUILT ON `ResponsiveCluster` (Wave 3, 2026-08-01) — the same frame
 * `ButtonGroup` was just rebuilt on, offered by that change for exactly this
 * second caller: a full-width column below the named container step in `at`,
 * a packed row from it up, ONE gap on both sides (FRAME-10: the threshold is a
 * prop the frame reads, never a class string). Step `3` (`gap-2`) is the
 * fixed, internal seam — see `principles/gap.md`'s own canonical case for this
 * exact component: "`primary`, `secondary` and `dismiss` at step `3` in a row
 * while the container is wide, stacking full-width when it is narrow." `gap`
 * is not a prop here for the same reason it is not one on `ButtonGroup`: the
 * seam between action roles is not a call-site decision.
 *
 * ORDER: `dismiss`, `secondary`, `primary`, left to right, with the row pinned
 * to the end (`justify="end"`) — the exit action reads first, the strongest
 * action sits last, closest to the edge the reading eye lands on. Not
 * specified upstream; recorded here as the decision this file makes.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

export const meta = { tier: "composite", name: "ActionBar" } as const

/** A slot → its rendered `Button`, or `null` when the slot was not passed. */
const renderSlot = (
    key: string,
    slot: ActionBarSlot | undefined,
    variant: ActionBarVariant,
    isSkeleton: boolean,
): ResponsiveClusterItem | null => {
    if (!slot) return null
    return {
        key,
        content: (
            <Button
                label={slot.label}
                prefixIcon={slot.prefixIcon}
                variant={variant}
                onPress={slot.onPress}
                isDisabled={slot.isDisabled}
                isPending={slot.isPending}
                isSkeleton={isSkeleton}

            />
        ),
    }
}

/**
 * The `primary` · `secondary` · `dismiss` row. See the file header for why the
 * roles are named slots instead of a list, and why the seam has no prop.
 *
 * @param props - {@link ActionBarProps}
 */
export const ActionBar = ({
    primary,
    secondary,
    dismiss,
    isSkeleton = false,
    at = "md",
    classNames,
}: ActionBarProps) => {
    const items = [
        renderSlot("dismiss", dismiss, "ghost", isSkeleton),
        renderSlot("secondary", secondary, "secondary", isSkeleton),
        renderSlot("primary", primary, "primary", isSkeleton),
    ].filter((item): item is ResponsiveClusterItem => item != null)

    return (
        <ResponsiveCluster
            data-tier="composite"
            data-component="ActionBar"
            at={at}
            gap={3}
            justify="end"
            classNames={classNames}
            items={items}
        />
    )
}
