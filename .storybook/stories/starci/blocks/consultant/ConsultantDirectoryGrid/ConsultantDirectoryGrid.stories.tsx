import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConsultantDirectoryGrid } from "@sb-components/starci/blocks/consultant/ConsultantDirectoryGrid/ConsultantDirectoryGrid"
import { type ConsultantCardConsultant } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ConsultantDirectoryGrid`: the consultant directory's BROWSE surface —
 * how many consultants matched, then the cards themselves, across the full
 * loading → empty → content lifecycle.
 *
 * REUSE, NOT A REBUILD. `AsyncContent` owns the error/loading/empty/content
 * switch, `Grid` owns the responsive tile track, `ConsultantCard` owns one
 * tile — this block only decides how many tiles, in what shape, and what the
 * count line says.
 *
 * ⭐ THE COUNT LINE ONLY SHOWS BESIDE REAL CARDS. It lives inside
 * `AsyncContent`'s `content` branch, not as chrome above the whole switch — a
 * "0 chuyên viên tư vấn" line stacked on top of the empty message would say
 * the same thing twice.
 *
 * 📐 ONE LEAF (`Default`). `isLoading`/`isEmpty` swap which `AsyncContent`
 * branch renders, but the block's own shape never changes — always "a count
 * line above one grid-shaped region" — so loading/empty/content are STATES of
 * the one leaf, not leaves of their own.
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
        fullName: "Trần Minh Khôi",
        jobTitle: "Senior IT Recruiter",
        companyTitle: "TalentBridge",
        description: "6 năm tuyển dụng backend & DevOps cho các công ty product Đông Nam Á.",
    },
    {
        id: "c2",
        fullName: "Nguyễn Hải Yến",
        jobTitle: "Tech Recruitment Lead",
        companyTitle: "HireStack",
        description: "Chuyên tuyển frontend & mobile cho startup Series A trở lên.",
    },
    {
        id: "c3",
        fullName: "Phạm Đức Anh",
        jobTitle: "IT Headhunter",
        companyTitle: "NextRole",
        description: "Kết nối kỹ sư data/AI với các công ty đang mở rộng đội ngũ.",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame separating the count line from the grid below it, owning the seam between the two", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "the count line's own text, real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
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
        <div className="p-8">
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
    emptyTitle="Chưa có chuyên viên tư vấn nào trong khoá học này"
    ariaLabel="Danh sách chuyên viên tư vấn"
/>`,
                        render: (
                            <ConsultantDirectoryGrid
                                anatPart="ConsultantDirectoryGrid"
                                showAnatomy
                                isLoading
                                onOpenConsultant={() => {}}
                                emptyTitle="Chưa có chuyên viên tư vấn nào trong khoá học này"
                                ariaLabel="Danh sách chuyên viên tư vấn"
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
    emptyTitle="Chưa có chuyên viên tư vấn nào trong khoá học này"
    ariaLabel="Danh sách chuyên viên tư vấn"
/>`,
                        render: (
                            <ConsultantDirectoryGrid
                                consultants={[]}
                                count={0}
                                isLoading={false}
                                onOpenConsultant={() => {}}
                                emptyTitle="Chưa có chuyên viên tư vấn nào trong khoá học này"
                                ariaLabel="Danh sách chuyên viên tư vấn"
                            />
                        ),
                    },
                    {
                        name: "consultants.length = 3",
                        why: "The common case: a resolved, non-empty list. The count line ('3 chuyên viên tư vấn') rides above the grid inside the same content branch, and the grid lays the three cards out on the container's own width.",
                        code: `<ConsultantDirectoryGrid
    consultants={consultants}
    count={3}
    isLoading={false}
    onOpenConsultant={openConsultant}
    emptyTitle="Chưa có chuyên viên tư vấn nào trong khoá học này"
    ariaLabel="Danh sách chuyên viên tư vấn"
/>`,
                        render: (
                            <ConsultantDirectoryGrid
                                consultants={CONSULTANTS}
                                count={CONSULTANTS.length}
                                isLoading={false}
                                onOpenConsultant={() => {}}
                                emptyTitle="Chưa có chuyên viên tư vấn nào trong khoá học này"
                                ariaLabel="Danh sách chuyên viên tư vấn"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
