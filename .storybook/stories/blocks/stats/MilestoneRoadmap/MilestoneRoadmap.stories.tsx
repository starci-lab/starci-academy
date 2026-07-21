import type { Meta, StoryObj } from "@storybook/nextjs"
import { MilestoneRoadmap } from "@/components/blocks/stats/MilestoneRoadmap"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof MilestoneRoadmap> = {
    title: "Features/Progress/MilestoneRoadmap",
    component: MilestoneRoadmap,
}
export default meta
type Story = StoryObj<typeof MilestoneRoadmap>

/**
 * Toàn bộ trạng thái của MilestoneRoadmap: cụm mốc ở mức độ hoàn thành khác
 * nhau (done/in-progress/not-started) và một dải mốc dài phải cuộn ngang.
 * Dùng để tra khi nào các dấu chấm hiển thị đúng và khi nào dải mốc tràn ra
 * ngoài khối hẹp.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mixed roadmap"
                hint="Use when milestones are at various levels — a solid dot is done, an outlined dot is in progress, a faded dot is not started, and a quick glance shows exactly where you are."
            >
                <div className="w-96">
                    <MilestoneRoadmap
                        milestones={[
                            { title: "Web foundations", passedTasks: 5, totalTasks: 5 },
                            { title: "React basics", passedTasks: 4, totalTasks: 4 },
                            { title: "State & data", passedTasks: 2, totalTasks: 5 },
                            { title: "Backend API", passedTasks: 0, totalTasks: 6 },
                            { title: "Deployment", passedTasks: 0, totalTasks: 3 },
                        ]}
                    />
                </div>
            </Variant>
            <Variant
                label="Long roadmap"
                hint="When there are many milestones, the strip scrolls horizontally inside a narrow block instead of cramming the dots together — the dots keep their size and only overflow sideways."
            >
                <div className="w-72">
                    <MilestoneRoadmap
                        milestones={[
                            { title: "Milestone 1", passedTasks: 4, totalTasks: 4 },
                            { title: "Milestone 2", passedTasks: 3, totalTasks: 3 },
                            { title: "Milestone 3", passedTasks: 5, totalTasks: 5 },
                            { title: "Milestone 4", passedTasks: 2, totalTasks: 4 },
                            { title: "Milestone 5", passedTasks: 0, totalTasks: 5 },
                            { title: "Milestone 6", passedTasks: 0, totalTasks: 3 },
                            { title: "Milestone 7", passedTasks: 0, totalTasks: 6 },
                            { title: "Milestone 8", passedTasks: 0, totalTasks: 4 },
                            { title: "Milestone 9", passedTasks: 0, totalTasks: 2 },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của MilestoneRoadmap: cụm mốc ở mức độ hoàn thành khác nhau " +
            "(done/in-progress/not-started) và một dải mốc dài phải cuộn ngang. Dùng để tra khi nào các " +
            "dấu chấm hiển thị đúng và khi nào dải mốc tràn ra ngoài khối hẹp.",
    },
}
