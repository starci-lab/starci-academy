import type { Meta, StoryObj } from "@storybook/nextjs"
import { MetaRow } from "./MetaRow"
import { StatusChip } from "../../chips/StatusChip/StatusChip"

const meta: Meta<typeof MetaRow> = {
    title: "Primitives/List/MetaRow",
    component: MetaRow,
    tags: ["autodocs", "news"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MetaRow>

/** Leading warning `StatusChip` (the one signal) + dot-joined muted meta segments. */
export const WithChip: Story = {
    name: "Có chip signal",
    render: () => (
        <div className="w-96 p-8">
            <MetaRow
                chip={
                    <StatusChip tone="warning">
                        2 phút còn lại
                    </StatusChip>
                }
                items={["Question 7 / 8", "Middle"]}
            />
        </div>
    ),
}

/** No chip — a plain muted dot-joined meta line. */
export const MetaOnly: Story = {
    name: "Chỉ meta (không chip)",
    render: () => (
        <div className="w-96 p-8">
            <MetaRow items={["Question 2 / 8", "Middle", "40 minutes left"]} />
        </div>
    ),
}

/** Narrow container — the muted meta line truncates instead of wrapping/overflowing. */
export const Overflow: Story = {
    name: "Tràn — truncate",
    render: () => (
        <div className="w-64 p-8">
            <MetaRow items={["Building a scalable distributed rate limiter", "Middle", "40 minutes left"]} />
        </div>
    ),
}
