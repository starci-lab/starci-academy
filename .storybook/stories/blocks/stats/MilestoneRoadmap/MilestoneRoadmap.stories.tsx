import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { MilestoneRoadmap } from "@/components/blocks/stats/MilestoneRoadmap"

const meta: Meta<typeof MilestoneRoadmap> = {
    title: "Features/Progress/MilestoneRoadmap",
    component: MilestoneRoadmap,
}
export default meta
type Story = StoryObj<typeof MilestoneRoadmap>

/**
 * Use to summarize a course's milestone journey as a strip of connected dots, colored by completion: done
 * (solid dot), in progress (outlined dot), not started (faded dot). A quick glance shows where you are on the
 * roadmap without taking up space. Hovering a dot reveals its name + the number of tasks passed.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use to summarize a course's milestone journey as a strip of connected dots, colored by " +
            "completion: done (solid dot), in progress (outlined dot), not started (faded dot). A quick glance " +
            "shows where you are on the roadmap without taking up space. Hovering a dot reveals its name + the " +
            "number of tasks passed.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mixed roadmap</Label>
                <Typography type="body-sm" color="muted">
                    Use when milestones are at various levels — a solid dot is done, an outlined dot is in
                    progress, a faded dot is not started, and a quick glance shows exactly where you are.
                </Typography>
            </div>
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

/** A long roadmap scrolls horizontally inside a narrow block instead of cramming the dots together — check that the dots keep their size and only overflow sideways. */
export const LongRoadmap: Story = {
    parameters: {
        usage: "A long roadmap scrolls horizontally inside a narrow block instead of cramming the dots together — check that the dots keep their size and only overflow sideways.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long roadmap</Label>
                <Typography type="body-sm" color="muted">
                    When there are many milestones, the strip scrolls horizontally inside a narrow block instead
                    of cramming the dots together — the dots keep their size and only overflow sideways.
                </Typography>
            </div>
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
