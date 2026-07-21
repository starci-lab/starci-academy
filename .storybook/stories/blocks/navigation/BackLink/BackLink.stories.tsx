import type { Meta, StoryObj } from "@storybook/nextjs"
import { BackLink } from "./BackLink"

const meta: Meta<typeof BackLink> = {
    title: "Primitives/Navigation/BackLink",
    component: BackLink,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof BackLink>

/** Generic "Trở lại" — a subpage that only needs one way back, no named destination. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BackLink onPress={() => {}} />
        </div>
    ),
}

/** `target` appends the destination — "Trở lại {target}". */
export const WithTarget: Story = {
    render: () => (
        <div className="p-8">
            <BackLink target="thử thách" onPress={() => {}} />
        </div>
    ),
}

/** `label` overrides the whole text (the caller supplies its own copy). */
export const CustomLabel: Story = {
    render: () => (
        <div className="p-8">
            <BackLink label="Quay lại danh sách khoá học" onPress={() => {}} />
        </div>
    ),
}
