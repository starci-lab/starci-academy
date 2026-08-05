import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConsultantDirectoryGrid } from "@sb-components/starci/blocks/consultant/ConsultantDirectoryGrid/ConsultantDirectoryGrid"
import { type ConsultantCardConsultant } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ConsultantDirectoryGrid` — the consultant directory's browse surface: a
 * match count above the cards, across the loading → empty → content lifecycle.
 * `AsyncContent` owns the branch switch, `Grid` the responsive track,
 * `ConsultantCard` one tile. The count line renders inside the `content` branch
 * only, beside real cards.
 */
const meta: Meta<typeof ConsultantDirectoryGrid> = {
    title: "StarCi/Blocks/Consultant/ConsultantDirectoryGrid/ConsultantDirectoryGrid",
    component: ConsultantDirectoryGrid,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConsultantDirectoryGrid>

const CONSULTANTS: Array<ConsultantCardConsultant> = [
    {
        id: "c1",
        fullName: "Alex Tran",
        jobTitle: "Senior IT Recruiter",
        companyTitle: "TalentBridge",
        description: "6 years recruiting backend & DevOps talent for Southeast Asian product companies.",
    },
    {
        id: "c2",
        fullName: "Yen Nguyen",
        jobTitle: "Tech Recruitment Lead",
        companyTitle: "HireStack",
        description: "Specializes in frontend & mobile hires for Series A and later startups.",
    },
    {
        id: "c3",
        fullName: "Duc Pham",
        jobTitle: "IT Headhunter",
        companyTitle: "NextRole",
        description: "Connects data/AI engineers with companies scaling up their teams.",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame separating the count line from the grid below it, owning the seam between the two", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "the count line's own text, real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "Grid": { tier: "frame", role: "the responsive tile track — real cards or their skeleton mirror, same shape either way", storyId: "frames-grid-grid--default" },
    "ConsultantCard": { tier: "block", role: "one consultant tile — photo, name, role, company, blurb, real or its own skeleton mirror", storyId: "starci-blocks-consultant-consultantcard-consultantcard--default" },
    "AsyncContentEmpty": { tier: "composite", role: "the empty-directory message, replacing the grid entirely when the resolved list has zero consultants", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

/**
 * LEAF — `Default`: loading → empty → content, the full lifecycle this block
 * exists to carry.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConsultantDirectoryGrid"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLoading = true",
                        why: "The directory's own fetch has not resolved yet (`consultants` is `undefined`), so `AsyncContent` falls to the skeleton branch — a grid of placeholder `ConsultantCard` tiles in the exact shape real cards will take, no count line yet since there is nothing to count.",
                        code: `<ConsultantDirectoryGrid
    isLoading
    onOpenConsultant={openConsultant}
    emptyTitle="No consultants yet for this course"
    ariaLabel="Consultant directory"
/>`,
                        render: (
                            <ConsultantDirectoryGrid


                                isLoading
                                onOpenConsultant={() => {}}
                                emptyTitle="No consultants yet for this course"
                                ariaLabel="Consultant directory"
                            />
                        ),
                    },
                    {
                        name: "consultants = []",
                        why: "The fetch resolved and found nobody — `isLoading` is now `false` and `consultants` is a real, empty array, so `AsyncContent` falls to the caller's `emptyTitle` message instead of an empty grid claiming a track with nothing in it.",
                        code: `<ConsultantDirectoryGrid
    consultants={[]}
    count={0}
    isLoading={false}
    onOpenConsultant={openConsultant}
    emptyTitle="No consultants yet for this course"
    ariaLabel="Consultant directory"
/>`,
                        render: (
                            <ConsultantDirectoryGrid
                                consultants={[]}
                                count={0}
                                isLoading={false}
                                onOpenConsultant={() => {}}
                                emptyTitle="No consultants yet for this course"
                                ariaLabel="Consultant directory"
                            />
                        ),
                    },
                    {
                        name: "consultants.length = 3",
                        why: "The common case: a resolved, non-empty list. The count line ('3 consultants') rides above the grid inside the same content branch, and the grid lays the three cards out on the container's own width.",
                        code: `<ConsultantDirectoryGrid
    consultants={consultants}
    count={3}
    isLoading={false}
    onOpenConsultant={openConsultant}
    emptyTitle="No consultants yet for this course"
    ariaLabel="Consultant directory"
/>`,
                        render: (
                            <ConsultantDirectoryGrid
                                consultants={CONSULTANTS}
                                count={CONSULTANTS.length}
                                isLoading={false}
                                onOpenConsultant={() => {}}
                                emptyTitle="No consultants yet for this course"
                                ariaLabel="Consultant directory"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
