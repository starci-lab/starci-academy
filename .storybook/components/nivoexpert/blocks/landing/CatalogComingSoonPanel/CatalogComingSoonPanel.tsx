import { HourglassIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import type { SkeletonProps } from "@sb-components/frames/_slot"

/**
 * `CatalogComingSoonPanel` -- the honest 0-course empty state for a brand-new
 * tenant's catalog section, per `nivo-expert-landing.proposal.md` §3/§5/§6.
 * Built on the shared `EmptyState` composite -- a grid with one "no items"
 * caption inside it reads as a broken grid, so the empty case gets this
 * purpose-built panel instead, with one onward action that routes into the
 * page's lead capture section so the empty catalog is never a dead end.
 */

/** Props for {@link CatalogComingSoonPanel}. */
export interface CatalogComingSoonPanelProps {
    /** Panel heading -- already-resolved copy (e.g. "First course coming soon"). */
    title: string
    /** Supporting line under the heading -- honest, never a fabricated launch date. */
    description: string
    /** Onward CTA label -- routes into the page's lead capture section, never a dead end. */
    onwardLabel: string
    /** Fires on press -- the connected layer scrolls/navigates to the page's lead capture section. */
    onExploreLead: () => void
}

/**
 * The catalog's zero-course arrangement. See the file header for why this
 * reuses the shared `EmptyState` composite instead of a bespoke shape.
 *
 * @param props - {@link CatalogComingSoonPanelProps}
 */
const CatalogComingSoonPanel = ({ title, description, onwardLabel, onExploreLead }: CatalogComingSoonPanelProps) => (
    <div data-tier="block" data-component="CatalogComingSoonPanel">
        <EmptyState
            icon={HourglassIcon}
            title={title}
            description={description}
            action={({ isSkeleton }: SkeletonProps) =>
                isSkeleton ? (
                    <Button isSkeleton label={onwardLabel} />
                ) : (
                    <Button label={onwardLabel} onPress={onExploreLead} />
                )
            }
        />
    </div>
)

export { CatalogComingSoonPanel }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CatalogComingSoonPanel" } as const
