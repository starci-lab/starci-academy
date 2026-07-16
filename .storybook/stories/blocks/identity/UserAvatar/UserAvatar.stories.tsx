import type { Meta, StoryObj } from "@storybook/nextjs"

import { UserAvatar } from "@/components/reuseable/UserAvatar"

const meta: Meta<typeof UserAvatar> = {
    title: "Core/Identity/UserAvatar",
    component: UserAvatar,
}

export default meta

type Story = StoryObj<typeof UserAvatar>

/** A resilient fallback chain: uploaded image → auto-generated avatar (DiceBear, seeded by identity) → the first two initials. With no `avatar`, it shows the generated avatar based on `seed`/username. */
export const Default: Story = {
    parameters: { usage: "Resilient fallback: uploaded image → generated avatar (DiceBear, seeded by identity) → initials. Same seed → same face everywhere." },
    args: { username: "Ben Turner", seed: "tranbinh@example.com" },
}

/** 3 size presets — pick by context: `sm` for dense list rows, `md` the default, `lg` for the profile header. */
export const Sizes: Story = {
    parameters: { usage: "3 size presets: sm (dense list) · md (default) · lg (profile header)." },
    render: () => (
        <div className="flex items-center gap-4">
            <UserAvatar username="Anna" seed="an@example.com" size="sm" />
            <UserAvatar username="Ben" seed="binh@example.com" size="md" />
            <UserAvatar username="Chris" seed="cuong@example.com" size="lg" />
        </div>
    ),
}
