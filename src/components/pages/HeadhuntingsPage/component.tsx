import React from "react"
import {
    ConsultantDirectoryHeader,
    type ConsultantDirectoryHeaderCrumb,
} from "@/components/blocks/consultant/ConsultantDirectoryHeader"
import {
    ConsultantDirectoryCompanySearch,
    type ConsultantCompanySuggestion,
} from "@/components/blocks/consultant/ConsultantDirectoryCompanySearch"
import {
    ConsultantDirectoryGrid,
} from "@/components/blocks/consultant/ConsultantDirectoryGrid"
import { type ConsultantCardConsultant } from "@/components/blocks/consultant/ConsultantCard"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `_HeadhuntingsPage` — the SRC TWIN of `.storybook/components/starci/pages/
 * HeadhuntingsPage/HeadhuntingsPage.tsx`. Presentational: typed props, already
 * resolved; no fetch/store/i18n (that's the connected half, `./index.tsx`).
 *
 * Same three functions, same reading order as the blueprint: orient ·
 * deep-link to a company already in mind · browse the consultant roster and
 * open one. The company search is not a grid filter — picking a suggestion
 * fires `onSelectCompany` with an id, which the connected half turns into a
 * route push, and never changes `consultants`/`consultantCount`. Only
 * `isSkeleton` forks into its own leaf; everything else is a data state of the
 * one `Default` leaf.
 */

// re-exported so the connected file (and anything downstream) can build data
// against the SAME types the blueprint's blocks define, rather than
// redeclaring shape that already exists.
export type {
    ConsultantDirectoryHeaderCrumb,
    ConsultantCompanySuggestion,
    ConsultantCardConsultant,
}

/** Props for {@link _HeadhuntingsPage}. */
export interface HeadhuntingsPageProps {
    /** Breadcrumb trail above the directory title. */
    breadcrumbItems?: Array<ConsultantDirectoryHeaderCrumb>
    /** Directory title. */
    title: string
    /** One-sentence summary of what the directory lists. */
    description?: string

    /** Current text in the company search field (controlled, debounced upstream). */
    companyQuery: string
    /** Fired with the new query on every keystroke. */
    onCompanyQueryChange: (query: string) => void
    /** Company matches for the current query, already fetched by the caller. */
    companySuggestions: Array<ConsultantCompanySuggestion>
    /** `true` while the caller is waiting on the ES company-suggester. */
    isLoadingCompanySuggestions?: boolean
    /** Fired with the picked company's id; the caller owns the route push. */
    onSelectCompany: (companyId: string) => void

    /** The current page's consultants, already fetched by the caller. `undefined` ⇒ not resolved yet. */
    consultants?: Array<ConsultantCardConsultant>
    /** How many consultants the directory lists in total. `undefined` ⇒ not known yet. */
    consultantCount?: number
    /** `true` while the consultant list's own fetch has not resolved. */
    isLoadingConsultants: boolean
    /** Fired with a consultant's id when their card is opened; the caller owns the route push. */
    onOpenConsultant: (id: string) => void
    /** The empty-roster message, already localized by the caller. */
    consultantsEmptyTitle: string
    /** Accessible name for the consultant roster region. */
    consultantsAriaLabel: string

    /** `true` → every block that can mirror itself does. */
    isSkeleton?: boolean
}

/**
 * The consultant directory browse screen. See the file header for the
 * function list and the two seams' separate owners.
 *
 * @param props - {@link HeadhuntingsPageProps}
 */
const _HeadhuntingsPage = ({
    breadcrumbItems,
    title,
    description,
    companyQuery,
    onCompanyQueryChange,
    companySuggestions,
    isLoadingCompanySuggestions,
    onSelectCompany,
    consultants,
    consultantCount,
    isLoadingConsultants,
    onOpenConsultant,
    consultantsEmptyTitle,
    consultantsAriaLabel,
    isSkeleton = false,
}: HeadhuntingsPageProps) => {
    const directorySection = (
        <>
            <ConsultantDirectoryCompanySearch

                query={companyQuery}
                onQueryChange={onCompanyQueryChange}
                suggestions={companySuggestions}
                isLoadingSuggestions={isLoadingCompanySuggestions}
                onSelectCompany={onSelectCompany}

            />
            <ConsultantDirectoryGrid

                consultants={consultants}
                count={consultantCount}
                isLoading={isLoadingConsultants}
                onOpenConsultant={onOpenConsultant}
                emptyTitle={consultantsEmptyTitle}
                ariaLabel={consultantsAriaLabel}

            />
        </>
    )

    const headhuntingsSections = (
        <>
            <ConsultantDirectoryHeader
                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}

            />
            <StackV gap={4} isSkeleton={isSkeleton} items={[() => directorySection]} />
        </>
    )

    const headhuntingsBody = <StackV gap={6} isSkeleton={isSkeleton} items={[() => headhuntingsSections]} />

    return (
        <Container
            size="md"
            padding={6}
            body={() => headhuntingsBody}
            identity={{ tier: "page", component: "HeadhuntingsPage" }}
        />
    )
}

export { _HeadhuntingsPage }
