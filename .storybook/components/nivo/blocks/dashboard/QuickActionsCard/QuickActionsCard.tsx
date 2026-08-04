import type { ComponentType, SVGProps } from "react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `QuickActionsCard` — the dashboard's shortcut list: one full-width button
 * per destination the operator reaches for most. One shape, `isSkeleton` is
 * the only state, since every account gets the same shortcut set once it has
 * something to manage.
 */

/** An icon component (e.g. a phosphor `*Icon`), not JSX — the atom scales it itself. */
export type QuickActionIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One shortcut row. */
export interface QuickActionItem {
    /** Stable id. */
    id: string
    /** Visible label (e.g. "Manage AI Agent"). */
    label: string
    /** Leading glyph. */
    icon: QuickActionIcon
    /** Fired when the shortcut is pressed — the connected layer routes to the destination. */
    onPress: () => void
}

/** Props for {@link QuickActionsCard}. */
export interface QuickActionsCardProps {
    /** The shortcuts, in reading order. */
    items: Array<QuickActionItem>
    /**
     * `true` → the card's own first fetch is in flight (e.g. the shortcut set
     * itself is account-scoped): the title and every button shimmer, and the
     * presses lock. Threaded straight down — never fed to a separate skeleton
     * tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: QuickActionsCardLabels
}

/** The already-resolved copy the card renders. */
export interface QuickActionsCardLabels {
    /** Card title (e.g. "Quick actions"). */
    title: string
}

/**
 * The shortcut list. See the file header for why there is no empty leaf.
 *
 * @param props - {@link QuickActionsCardProps}
 */
const QuickActionsCard = ({ items, isSkeleton = false, labels }: QuickActionsCardProps) => (
    <div data-tier="block" data-component="QuickActionsCard">
        <SurfaceCard
            padding={3}
            label={labels.title}
            isSkeleton={isSkeleton}
            body={() => (
                <StackV
                    gap={2}
                    isSkeleton={isSkeleton}
                    items={items.map((item) => () => (
                        <Button
                            variant="secondary"
                            prefixIcon={item.icon}
                            isSkeleton={isSkeleton}
                            label={item.label}
                            onPress={isSkeleton ? undefined : item.onPress}
                            classNames={["w-full"]}
                        />
                    ))}
                />
            )}
        />
    </div>
)

export { QuickActionsCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "QuickActionsCard" } as const
