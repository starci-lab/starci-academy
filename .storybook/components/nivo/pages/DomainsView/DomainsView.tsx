import {
    DomainList,
    type DomainListLabels,
    type DomainRow,
} from "@sb-components/nivo/blocks/domains/DomainList/DomainList"

/**
 * `DomainsView` — the PAGE at `/domains`: a list of functions, not a shape of
 * its own. A page's story is one complete STATE per story — `loading`,
 * `content`, `empty` — not a leaf-per-prop map. Grounded in the real
 * `DomainEntity`.
 */

/** Props for {@link DomainsView}. */
export interface DomainsViewProps {
    /** The account's domains, newest first. */
    domains: Array<DomainRow>
    /** Open the `RegisterDomainModal` flow (an overlay this page never mounts itself). */
    onAddDomain: () => void
    /** Open one domain's `DomainDetailModal` (an overlay this page never mounts itself). */
    onOpenDomain: (domainId: string) => void
    /** `true` → the page's own first fetch is in flight; the skeleton mirror is shown. */
    isSkeleton?: boolean
    /** Already-localized copy, forwarded to the embedded `DomainList`. */
    labels: DomainsViewLabels
}

/** Already-localized copy for the one block this page arranges. */
export interface DomainsViewLabels {
    /** Forwarded to `DomainList`. */
    domainList: DomainListLabels
}

/**
 * The domains page. See the file header for why it composes `DomainList`
 * directly rather than rebuilding a title/add-button/empty-state this block
 * already owns.
 *
 * @param props - {@link DomainsViewProps}
 */
const DomainsView = ({ domains, onAddDomain, onOpenDomain, isSkeleton = false, labels }: DomainsViewProps) => (
    <div
        data-tier="page"
        data-component="DomainsView"
        className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8"
    >
        <DomainList
            domains={domains}
            onAddDomain={onAddDomain}
            onOpenDomain={onOpenDomain}
            isSkeleton={isSkeleton}
            labels={labels.domainList}
        />
    </div>
)

export { DomainsView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "DomainsView" } as const
