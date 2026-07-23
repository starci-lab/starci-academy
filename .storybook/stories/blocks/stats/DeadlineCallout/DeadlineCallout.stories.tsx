import type { Meta, StoryObj } from "@storybook/nextjs"
import { DeadlineCallout } from "./DeadlineCallout"

const meta: Meta<typeof DeadlineCallout> = {
    title: "Design/Stats/DeadlineCallout",
    component: DeadlineCallout,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DeadlineCallout>

/** Full shape: panel + 7-day forecast (Friday spikes danger) + closing caption. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <DeadlineCallout
                    count={12}
                    title="12 thẻ sẽ tuột khỏi trí nhớ trước Thứ 5"
                    hint="Ôn ngay hôm nay để giữ — để qua ngưỡng là phải học lại từ đầu."
                    forecast={[
                        { label: "T4", ratio: 0.3 },
                        { label: "T5", ratio: 0.45 },
                        { label: "T6", ratio: 1, spike: true },
                        { label: "T7", ratio: 0.38 },
                        { label: "CN", ratio: 0.22 },
                        { label: "T2", ratio: 0.3 },
                        { label: "T3", ratio: 0.18 },
                    ]}
                    caption="Thứ 6 dồn 34 thẻ — làm bớt 15 hôm nay để san phẳng."
                />
            </div>
        </div>
    ),
}

/** Panel only — not enough history to forecast; forecast + caption are dropped instead of rendering empty rows. */
export const PanelOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <DeadlineCallout
                    count={3}
                    title="3 thẻ sẽ tuột khỏi trí nhớ trước Thứ 3"
                    hint="Ôn ngay hôm nay để giữ."
                />
            </div>
        </div>
    ),
}
