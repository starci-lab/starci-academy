import type { Meta, StoryObj } from "@storybook/nextjs"
import { MilestoneRoadmap } from "./MilestoneRoadmap"

const meta: Meta<typeof MilestoneRoadmap> = {
    title: "Block/Stats/MilestoneRoadmap",
    component: MilestoneRoadmap,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MilestoneRoadmap>

/** Mixed states: solid = done, outlined = in progress, faded = not started. */
export const Mixed: Story = {
    render: () => (
        <div className="p-8">
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
        </div>
    ),
}

/** Long roadmap — the strip scrolls horizontally inside a narrow block; dots keep their size. */
export const Long: Story = {
    render: () => (
        <div className="p-8">
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
        </div>
    ),
}
