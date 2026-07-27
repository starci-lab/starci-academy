import type { Meta, StoryObj } from "@storybook/nextjs"
import { DeadlineCallout } from "@sb-components/_legacy/designs/stats/DeadlineCallout/DeadlineCallout"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof DeadlineCallout> = {
    title: "Legacy/Design/Stats/DeadlineCallout",
    component: DeadlineCallout,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DeadlineCallout>

// DOM thật: Panel (count+title+hint, tinted warning-soft) LUÔN có mặt · Forecast
// (hàng bar 7-ngày) + Caption đều optional, ẨN hẳn (không render rỗng) khi thiếu data.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Panel", tier: "composite", role: "count lớn + title + hint, nền warning-soft" },
    { name: "Forecast", tier: "composite", role: "hàng bar dự báo theo ngày (1 bar spike → danger)" },
    { name: "Caption", tier: "composite", role: "dòng kết luận dưới forecast" },
]

const PANEL_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Panel", tier: "composite", role: "count lớn + title + hint, nền warning-soft" },
]

/** Full shape: panel + 7-day forecast (Friday spikes danger) + closing caption. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="DeadlineCallout"
                    tier="design"
                    leaf="Full"
                    parts={FULL_PARTS}
                    reason="Verdict (count+sentence trong Panel) → evidence (Forecast) → Caption kết luận. Khác Callout chung: LUÔN mang countdown."
                >
                    <DeadlineCallout
                        showAnatomy
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
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Panel only — not enough history to forecast; forecast + caption are dropped instead of rendering empty rows. */
export const PanelOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="DeadlineCallout"
                    tier="design"
                    leaf="PanelOnly"
                    parts={PANEL_ONLY_PARTS}
                    note="Không đủ lịch sử để dự báo → Forecast/Caption KHÔNG render (không phải hàng rỗng)."
                >
                    <DeadlineCallout
                        showAnatomy
                        count={3}
                        title="3 thẻ sẽ tuột khỏi trí nhớ trước Thứ 3"
                        hint="Ôn ngay hôm nay để giữ."
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
