import type { Meta, StoryObj } from "@storybook/nextjs"
import { PhaseScarcityNote, PricingPhase } from "./PhaseScarcityNote"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof PhaseScarcityNote> = {
    title: "Block/Commerce/PhaseScarcityNote",
    component: PhaseScarcityNote,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote>

// NOTE: this "block" composes NO primitive — it is a single warning line (icon + text).
// Flagged as "should be Primitive" (see report). ANATOMY kept honest: empty composition.
const ANATOMY = {
    primitives: [] as { name: string; role: string }[],
    reason:
        "Dòng cảnh báo khan-hiếm-suất chỉ gồm một icon cảnh báo + một câu chữ — KHÔNG cấu thành từ primitive nào. Thực chất là một atom trình bày, nên bị đánh dấu \"đáng lẽ là Primitive\". Vẫn port ở tier Block để giữ đủ bộ commerce; số suất + giá đều đến từ backend, block không tự bịa scarcity.",
}

export const ManySeats: Story = {
    render: () =>
        blockShell(
            <PhaseScarcityNote
                currentPhase={PricingPhase.Pioneer}
                seatsRemaining={42}
                nextPhasePriceVnd={2490000}
            />,
            ANATOMY,
        ),
}

export const FewSeats: Story = {
    render: () =>
        blockShell(
            <PhaseScarcityNote
                currentPhase={PricingPhase.EarlyBird}
                seatsRemaining={3}
                nextPhasePriceVnd={2990000}
            />,
            ANATOMY,
        ),
}

export const OneSeatLeft: Story = {
    render: () =>
        blockShell(
            <PhaseScarcityNote
                currentPhase={PricingPhase.EarlyBird}
                seatsRemaining={1}
                nextPhasePriceVnd={2990000}
            />,
            ANATOMY,
        ),
}

export const NoNextPhase: Story = {
    render: () =>
        blockShell(
            <PhaseScarcityNote
                currentPhase={PricingPhase.Regular}
                seatsRemaining={15}
                nextPhasePriceVnd={null}
            />,
            ANATOMY,
        ),
}

export const Unlimited: Story = {
    render: () =>
        blockShell(
            <PhaseScarcityNote
                currentPhase={PricingPhase.Regular}
                seatsRemaining={null}
                nextPhasePriceVnd={null}
            />,
            ANATOMY,
        ),
}
