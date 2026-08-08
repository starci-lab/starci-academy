import React from "react"
import { Breadcrumbs } from "@/components/atoms/navigation/Breadcrumbs"
import { PageHeader } from "@/components/composites/layout/Page"

/**
 * `FoundationCategoryHeader` — the Foundations-hub identity cluster: a breadcrumb
 * trail above a title and description, nothing more. Sibling of `ContentHeader`
 * but thinner — a Foundations category carries no read state, reading time, or
 * outcomes, so it stops at the description. The breadcrumb slot is optional and
 * simply drops out when absent.
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface FoundationCategoryHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link FoundationCategoryHeader}. */
export interface FoundationCategoryHeaderProps {
    /**
     * Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. Empty
     * or omitted (and not loading) → the whole breadcrumb slot is left out: a
     * root category reached directly has nothing above it to trail through.
     */
    breadcrumbItems?: Array<FoundationCategoryHeaderCrumb>
    /** Category title. */
    title: string
    /** One-sentence summary of the category. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c), so the shimmer keeps the exact box of the thing it replaces.
     */
    isSkeleton?: boolean
}

/**
 * Foundations-hub identity cluster: trail, title, description. See the file
 * header for why this stops short of `ContentHeader`'s meta row and outcomes
 * card, and why it still earns its own layer above `PageHeader`.
 *
 * @param props - {@link FoundationCategoryHeaderProps}
 */
const FoundationCategoryHeader = ({
    breadcrumbItems,
    title,
    description,
    isSkeleton = false,
}: FoundationCategoryHeaderProps) => {
    return (
        // Identity hold: PageHeader does not accept CallerIdentity (ledger PageHeader gap).
        <PageHeader
            isSkeleton={isSkeleton}
            breadcrumb={() =>
                isSkeleton || breadcrumbItems?.length ? (
                    // Hold: no hug-width frame for breadcrumb measure (`w-fit` parent placement).
                    <div className="w-fit">
                        <Breadcrumbs
                            collapseOnMobile
                            collapseFrom={4}
                            items={breadcrumbItems ?? []}
                            isSkeleton={isSkeleton}
                        />
                    </div>
                ) : undefined
            }
            title={title}
            description={description}
        />
    )
}

export { FoundationCategoryHeader }
