import type { Meta, StoryObj } from "@storybook/nextjs"
import { MilestoneRoadmap } from "@sb-components/blocks/stats/MilestoneRoadmap/MilestoneRoadmap"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

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

// Both leaves compose the same two repeated direct parts: a Node dot per
// milestone (coloured by completion) and a Connector between consecutive nodes
// (none before the first node).
const NODE: AnatomyNode = { name: "Node", tier: "block", role: "chấm milestone — done=success đặc / partial=viền success / chưa=muted" }
const CONNECTOR: AnatomyNode = { name: "Connector", tier: "block", role: "đường nối giữa 2 node liên tiếp" }
const PARTS: Array<AnatomyNode> = [NODE, CONNECTOR]

/** Mixed states: solid = done, outlined = in progress, faded = not started. */
export const Mixed: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <BlockAnatomy name="MilestoneRoadmap" tier="block" leaf="Mixed" parts={PARTS} note="5 Node nối bằng 4 Connector — màu Node phản ánh done/partial/chưa bắt đầu.">
                    <MilestoneRoadmap
                        showAnatomy
                        milestones={[
                            { title: "Web foundations", passedTasks: 5, totalTasks: 5 },
                            { title: "React basics", passedTasks: 4, totalTasks: 4 },
                            { title: "State & data", passedTasks: 2, totalTasks: 5 },
                            { title: "Backend API", passedTasks: 0, totalTasks: 6 },
                            { title: "Deployment", passedTasks: 0, totalTasks: 3 },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Long roadmap — the strip scrolls horizontally inside a narrow block; dots keep their size. */
export const Long: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-72">
                <BlockAnatomy name="MilestoneRoadmap" tier="block" leaf="Long" parts={PARTS} note="9 Node/Connector — composition giống leaf Mixed, chỉ nhiều hơn nên strip scroll ngang.">
                    <MilestoneRoadmap
                        showAnatomy
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
                </BlockAnatomy>
            </div>
        </div>
    ),
}
