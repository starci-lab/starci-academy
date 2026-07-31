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
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `HeadhuntingsPage`: browse the consultant directory for a course
 * and jump either to a listed consultant's profile or to a recruiting
 * company's page.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks, places
 * them in frames, and hands each one typed data. It draws no shape of its own —
 * every `div` here would be a shape it had no right to decide, same discipline
 * `FoundationsGridPage` documents in its own file header.
 *
 * THREE FUNCTIONS, in the order the reader meets them:
 *   1. Orient — the breadcrumb trail + directory title/description.  → `ConsultantDirectoryHeader`
 *   2. Deep-link straight to one recruiting company already in mind. → `ConsultantDirectoryCompanySearch`
 *   3. Browse the consultant roster and open one.                    → `ConsultantDirectoryGrid`
 *
 * CUT PER §B1 (state, not function): loading/empty/populated are STATES of
 * function 3 (`ConsultantDirectoryGrid`'s own `AsyncContent` branch), not
 * their own function — they never appear independent of browsing, so there is
 * no fourth block here.
 *
 * TWO SEAMS, TWO OWNERS (§10a). The outer `StackV gap="section"` separates the
 * TWO regions of the page — identity, and the "search & browse" cluster. The
 * inner `StackV gap="grouped"` is its own separate owner for that cluster —
 * the company deep-link row sits one `grouped` seam above the roster it does
 * NOT filter, mirroring the same seam `FoundationsGridPage` draws between
 * its search row and its list.
 *
 * ⛔ NO "open a company" chrome beyond firing the callback. The company search
 * is a DEEP-LINK, not a grid filter (see `ConsultantDirectoryCompanySearch`'s
 * own file header) — the screen wires `onSelectCompany` straight to real
 * navigation and never touches `query`/`consultants` from that callback,
 * because narrowing the roster is not this control's job.
 *
 * ⭐ THE SCREEN DECIDES WHAT "OPEN" MEANS (rule #7 / ContentModeNav's rule):
 * `ConsultantCard.onOpen` and `ConsultantDirectoryCompanySearch.onSelectCompany`
 * both bubble a bare id up to this screen's own `onOpenConsultant` /
 * `onSelectCompany` props — neither block decides what happens next, the real
 * page (route push) does.
 *
 * ⚠️ `isSkeleton` flows to every block uniformly. `ConsultantDirectoryCompanySearch`
 * has no `isSkeleton` prop at all (it is static chrome, never skeletonised —
 * see that block's own file header), so the screen does not pass it there.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each block emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
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
    showAnatomy = false,
}: HeadhuntingsPageProps) => {
    const directorySection = (
        <>
            <ConsultantDirectoryCompanySearch
                anatPart="ConsultantDirectoryCompanySearch"
                query={companyQuery}
                onQueryChange={onCompanyQueryChange}
                suggestions={companySuggestions}
                isLoadingSuggestions={isLoadingCompanySuggestions}
                onSelectCompany={onSelectCompany}
                showAnatomy={showAnatomy}
            />
            <ConsultantDirectoryGrid
                anatPart="ConsultantDirectoryGrid"
                consultants={consultants}
                count={consultantCount}
                isLoading={isLoadingConsultants}
                onOpenConsultant={onOpenConsultant}
                emptyTitle={consultantsEmptyTitle}
                ariaLabel={consultantsAriaLabel}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const headhuntingsSections = (
        <>
            <ConsultantDirectoryHeader
                anatPart="ConsultantDirectoryHeader"
                breadcrumbItems={breadcrumbItems}
                title={title}
                description={description}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} body={directorySection} />
        </>
    )

    const headhuntingsBody = <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={headhuntingsSections} />

    return <Container size="md" padding="roomy" body={headhuntingsBody} />
}

export { HeadhuntingsPage }
