import React from "react"
import {
    ConsultantDirectoryHeader,
    type ConsultantDirectoryHeaderCrumb,
} from "@sb-components/starci/blocks/consultant/ConsultantDirectoryHeader/ConsultantDirectoryHeader"
import {
    ConsultantDirectoryCompanySearch,
    type ConsultantCompanySuggestion,
} from "@sb-components/starci/blocks/consultant/ConsultantDirectoryCompanySearch/ConsultantDirectoryCompanySearch"
import {
    ConsultantDirectoryGrid,
} from "@sb-components/starci/blocks/consultant/ConsultantDirectoryGrid/ConsultantDirectoryGrid"
import { type ConsultantCardConsultant } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `HeadhuntingsPage` — the screen to browse the consultant directory for a
 * course and jump either to a listed consultant's profile or to a recruiting
 * company's page. A screen owns a list of functions: it calls blocks, places
 * them in frames, and hands each typed data. Three functions, in reading order:
 * orient · deep-link to a company already in mind · browse the consultant
 * roster and open one. The company search is not a grid filter — picking a
 * suggestion fires `onSelectCompany` with an id, which the real page turns into
 * a route push, and never changes `consultants`/`consultantCount`. Only
 * `isSkeleton` forks into its own leaf; everything else is a data state of the
 * one `Default` leaf.
 */

/** Props for {@link HeadhuntingsPage}. */
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
const HeadhuntingsPage = ({
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
    const headhuntingsBody = (
        <StackV
            gap={6}
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <ConsultantDirectoryHeader

                        breadcrumbItems={breadcrumbItems}
                        title={title}
                        description={description}
                        isSkeleton={isSkeleton}

                    />
                ),
                () => (
                    <StackV
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <ConsultantDirectoryCompanySearch

                                    query={companyQuery}
                                    onQueryChange={onCompanyQueryChange}
                                    suggestions={companySuggestions}
                                    isLoadingSuggestions={isLoadingCompanySuggestions}
                                    onSelectCompany={onSelectCompany}

                                />
                            ),
                            () => (
                                <ConsultantDirectoryGrid

                                    consultants={consultants}
                                    count={consultantCount}
                                    isLoading={isLoadingConsultants}
                                    onOpenConsultant={onOpenConsultant}
                                    emptyTitle={consultantsEmptyTitle}
                                    ariaLabel={consultantsAriaLabel}

                                />
                            ),
                        ]}
                    />
                ),
            ]}
        />
    )

    return <Container size="md" padding={6} body={() => headhuntingsBody} />
}

export { HeadhuntingsPage }
