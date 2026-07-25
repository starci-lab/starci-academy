import type { Meta, StoryObj } from "@storybook/nextjs"
import { StepBadge } from "@sb-components/atoms/display/StepBadge/StepBadge"

const meta: Meta<typeof StepBadge.Base> = {
    title: "Atoms/Display/StepBadge",
    component: StepBadge.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StepBadge.Base>

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <StepBadge.Base number={1} />
        </div>
    ),
}

export const Active: Story = {
    render: () => (
        <div className="p-8">
            <StepBadge.Base number={2} state="active" />
        </div>
    ),
}

export const Done: Story = {
    render: () => (
        <div className="p-8">
            <StepBadge.Base number={1} state="done" />
        </div>
    ),
}

export const Muted: Story = {
    render: () => (
        <div className="p-8">
            <StepBadge.Base number={3} state="muted" />
        </div>
    ),
}

export const SizeMd: Story = {
    render: () => (
        <div className="p-8">
            <StepBadge.Base number={1} size="md" />
        </div>
    ),
}

/** A 3-step guided flow (mirrors the `GithubTeamGate` join modal): step 1 done, step 2 the current step, step 3 not yet reached. */
export const Sequence: Story = {
    render: () => (
        <div className="flex gap-3 p-8">
            <StepBadge.Base number={1} state="done" />
            <StepBadge.Base number={2} state="active" />
            <StepBadge.Base number={3} state="muted" />
        </div>
    ),
}

export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <StepBadge.Base number={1} isSkeleton />
        </div>
    ),
}
