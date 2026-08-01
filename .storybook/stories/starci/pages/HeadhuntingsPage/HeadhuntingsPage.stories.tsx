import type { Meta, StoryObj } from "@storybook/nextjs"
import { HeadhuntingsPage } from "@sb-components/starci/pages/HeadhuntingsPage/HeadhuntingsPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `HeadhuntingsPage`: browse the consultant directory for a course
 * and jump either to a listed consultant's profile or to a recruiting
 * company's page.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * THREE FUNCTIONS, in the order the reader meets them: orient · deep-link to a
 * company already in mind · browse the consultant roster and open one.
 *
 * ⚠️ THE COMPANY SEARCH IS NOT A GRID FILTER. Picking a suggestion never
 * changes `consultants`/`consultantCount` on this screen — it only fires
 * `onSelectCompany` with an id, which the real page turns into a route push.
 * See `ConsultantDirectoryCompanySearch`'s own file header for the exact
 * naming mistake this design is careful not to repeat.
 *
 * ⭐ ONLY `isSkeleton` FORKS INTO ITS OWN LEAF. Whether the search field has a
 * query, whether suggestions are loading, and whether the roster is
 * loading/empty/populated are all DATA the screen hands straight through to a
 * block without branching its OWN render on them — none of them removes a
 * block from the screen's own JSX. So they stay STATES of the one `Default`
 * leaf (§14d.2), matching the same "optional slot presence is a state, not a
 * leaf" precedent `FoundationsGridPage`'s own story sets.
 */
const meta: Meta<typeof HeadhuntingsPage> = {
    title: "StarCi/Pages/HeadhuntingsPage/HeadhuntingsPage",
    component: HeadhuntingsPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HeadhuntingsPage>

const BREADCRUMBS = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "directory", label: "Consultant directory" },
]

const CONSULTANTS = [
    {
        id: "c1",
        fullName: "Tran Minh Khoi",
        jobTitle: "Senior IT Recruiter",
        companyTitle: "TalentBridge",
        description: "6 years recruiting backend & DevOps engineers for Southeast Asian product companies.",
    },
    {
        id: "c2",
        fullName: "Nguyen Hai Yen",
        jobTitle: "Tech Recruitment Lead",
        companyTitle: "HireStack",
        description: "Specializes in frontend & mobile hires for Series A and later startups.",
    },
    {
        id: "c3",
        fullName: "Pham Duc Anh",
        jobTitle: "IT Headhunter",
        companyTitle: "NextRole",
        description: "Connects data/AI engineers with companies growing their teams.",
    },
]

const COMPANY_SUGGESTIONS = [
    { id: "shopee-vn", label: "Shopee Vietnam" },
    { id: "tiki", label: "Tiki Corporation" },
    { id: "fpt-software", label: "FPT Software" },
]

const BASE = {
    breadcrumbItems: BREADCRUMBS,
    title: "Consultant directory",
    description: "Book a 1:1 session with the consultants supporting the DevOps Mastery course.",
    companyQuery: "",
    onCompanyQueryChange: () => {},
    companySuggestions: [],
    onSelectCompany: () => {},
    onOpenConsultant: () => {},
    consultantsEmptyTitle: "No consultants on this course yet",
    consultantsAriaLabel: "Consultant roster",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning every seam on this screen — between identity and the search & browse cluster, and the inner seam between the company search row and the roster", storyId: "frames-stack-stackv--default" },
    "ConsultantDirectoryHeader": { tier: "block", role: "orient: the breadcrumb trail above the directory title and description", storyId: "starci-blocks-consultant-consultantdirectoryheader-consultantdirectoryheader--default" },
    "ConsultantDirectoryCompanySearch": { tier: "block", role: "deep-link straight to one recruiting company already in mind — never a filter on the roster below it", storyId: "starci-blocks-consultant-consultantdirectorycompanysearch-consultantdirectorycompanysearch--default" },
    "ConsultantDirectoryGrid": { tier: "block", role: "browse the consultant roster across its loading → empty → content lifecycle, and open one", storyId: "starci-blocks-consultant-consultantdirectorygrid-consultantdirectorygrid--default" },
}

/** LEAF — the screen's one shape: header, company search row, consultant roster. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="HeadhuntingsPage"
                tier="screen"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "resting search, roster populated",
                        why: "The everyday shape: an untouched company search field above a roster of consultants that has already resolved. Every function of the screen is present, in the order the reader meets them.",
                        code: `<HeadhuntingsPage
    title="Consultant directory"
    companyQuery=""
    companySuggestions={[]}
    consultants={consultants}
    consultantCount={12}
    isLoadingConsultants={false}
    …
/>`,
                        render: (
                            <HeadhuntingsPage
                                {...BASE}
                               
                                consultants={CONSULTANTS}
                                consultantCount={12}
                                isLoadingConsultants={false}
                            />
                        ),
                    },
                    {
                        name: "company query typed, suggestions matched",
                        why: "The visitor is mid-search for a company already in mind — the roster underneath is untouched by this, since the field is a deep-link, not a filter. Picking a suggestion fires `onSelectCompany` with the id; it never changes `consultants`.",
                        code: `<HeadhuntingsPage
    companyQuery="Shopee"
    companySuggestions={suggestions}
    consultants={consultants}
    consultantCount={12}
    isLoadingConsultants={false}
    …
/>`,
                        render: (
                            <HeadhuntingsPage
                                {...BASE}
                                companyQuery="Shopee"
                                companySuggestions={COMPANY_SUGGESTIONS}
                                consultants={CONSULTANTS}
                                consultantCount={12}
                                isLoadingConsultants={false}
                            />
                        ),
                    },
                    {
                        name: "roster empty",
                        why: "The course has no consultants on file yet — `ConsultantDirectoryGrid` falls to its own empty message. Nothing about the surrounding screen reacts to this; it is entirely that block's own state.",
                        code: `<HeadhuntingsPage
    consultants={[]}
    consultantCount={0}
    isLoadingConsultants={false}
    …
/>`,
                        render: (
                            <HeadhuntingsPage
                                {...BASE}
                                consultants={[]}
                                consultantCount={0}
                                isLoadingConsultants={false}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block that can mirror itself does. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="HeadhuntingsPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that has its own skeleton mirror shows it while the directory's first fetch is in flight. `ConsultantDirectoryCompanySearch` has no `isSkeleton` prop at all — it is static chrome the screen never skeletonises — so it stays on its real, resting shape even here.",
                        code: "<HeadhuntingsPage {...props} isSkeleton isLoadingConsultants />",
                        render: (
                            <HeadhuntingsPage
                                {...BASE}
                               
                                isSkeleton
                                isLoadingConsultants
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
