import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { FilePlusIcon } from "@phosphor-icons/react"
import { DashedPlaceholderCard } from "./DashedPlaceholderCard"

const meta: Meta<typeof DashedPlaceholderCard> = {
    title: "Primitives/Cards/DashedPlaceholderCard",
    component: DashedPlaceholderCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DashedPlaceholderCard>

/**
 * Fills the available height of a grid cell — every story pins the tile
 * inside a fixed-size box (matches the ~19rem CV gallery cell it was ported
 * from) so `h-full w-full` has something to fill.
 */
const Cell = ({ children }: { children: ReactNode }) => (
    <div className="p-8">
        <div className="h-80 w-64">{children}</div>
    </div>
)

/** Default — bare `PlusIcon` + label, ready to drop at the end of any "add new" grid. */
export const Default: Story = {
    render: () => (
        <Cell>
            <DashedPlaceholderCard label="Tạo CV mới" onPress={() => {}} />
        </Cell>
    ),
}

/** Custom icon — the caller can swap the leading glyph (e.g. a file-plus for a document-specific grid). */
export const CustomIcon: Story = {
    render: () => (
        <Cell>
            <DashedPlaceholderCard icon={<FilePlusIcon />} label="Nhập từ file" onPress={() => {}} />
        </Cell>
    ),
}

/** `isSelected` — the chosen tile in a selectable grid (accent ring), same contract as `PressableCard`. */
export const Selected: Story = {
    render: () => (
        <Cell>
            <DashedPlaceholderCard label="Tạo CV mới" isSelected onPress={() => {}} />
        </Cell>
    ),
}

/** `isDisabled` — e.g. while the create mutation is in flight, or a plan limit is reached. */
export const Disabled: Story = {
    render: () => (
        <Cell>
            <DashedPlaceholderCard label="Tạo CV mới" isDisabled onPress={() => {}} />
        </Cell>
    ),
}

/** `isSkeleton` — self-drawn mirror (icon block + one text bar), same dashed frame. */
export const Skeleton: Story = {
    render: () => (
        <Cell>
            <DashedPlaceholderCard label="Tạo CV mới" isSkeleton onPress={() => {}} />
        </Cell>
    ),
}
