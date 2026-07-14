import type { Meta, StoryObj } from "@storybook/nextjs"
import { PressableCard } from "./index"

const meta: Meta<typeof PressableCard> = {
    title: "Blocks/PressableCard",
    component: PressableCard,
    parameters: {
        layout: "centered",
    },
}

export default meta

type Story = StoryObj<typeof PressableCard>

/** Generic navigation-tile content — icon + title + subtitle. */
const NavTileContent = () => (
    <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-surface-secondary text-lg">
            🚀
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
                Lộ trình Fullstack Mastery
            </span>
            <span className="text-xs text-muted">
                12 module · 48 bài học
            </span>
        </div>
    </div>
)

/** Generic option-card content — used for "pick a card" (lift) demos. */
const OptionCardContent = ({ label, price }: { label: string; price: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted">{price}</span>
    </div>
)

export const Default: Story = {
    args: {
        hoverVariant: "fill",
        onPress: () => {},
        children: <NavTileContent />,
    },
}

export const HoverFill: Story = {
    name: "Hover variant — fill (navigation tile)",
    args: {
        hoverVariant: "fill",
        onPress: () => {},
        children: <NavTileContent />,
    },
}

export const HoverLift: Story = {
    name: "Hover variant — lift (pick-a-card)",
    args: {
        hoverVariant: "lift",
        onPress: () => {},
        children: <OptionCardContent label="Gói 6 tháng" price="1.990.000đ" />,
    },
}

export const AsLink: Story = {
    name: "As link (href navigation)",
    args: {
        href: "/courses/0-fullstack-mastery",
        hoverVariant: "fill",
        children: <NavTileContent />,
    },
}

export const Disabled: Story = {
    args: {
        hoverVariant: "lift",
        isDisabled: true,
        onPress: () => {},
        children: <OptionCardContent label="Gói 12 tháng (đã hết slot)" price="3.490.000đ" />,
    },
}
