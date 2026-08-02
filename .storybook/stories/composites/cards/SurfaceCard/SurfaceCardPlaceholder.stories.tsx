import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { FilePlusIcon } from "@phosphor-icons/react"
import { SurfaceCardPlaceholder } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
/**
 * `SurfaceCardPlaceholder` — the "add new" tile: a `rounded-3xl` card with a dashed border,
 * pressable, icon + label centered, muted. Press feedback is `active:scale` only, no hover-bg.
 * The only card member that takes no content. Props: `icon`, `label`, `onPress`, `isSelected`,
 * `isDisabled`, `isSkeleton`.
 */
const meta: Meta<typeof SurfaceCardPlaceholder> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCardPlaceholder",
    component: SurfaceCardPlaceholder,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SurfaceCardPlaceholder>
/**
 * A cell that fills the height of a grid slot — every story pins the tile inside a fixed box
 * (matching the ~19rem cell of the CV gallery it was ported for) so `h-full w-full` has room to fill.
 */
/** Props for the `Cell` demo wrapper below. */
interface CellProps {
    /** placeholder tile rendered inside the fixed-size grid slot */
    children: ReactNode
}
const Cell = ({ children }: CellProps) => (
    <div data-tier="fixture" className="p-8">
        <div className="h-80 w-64">{children}</div>
    </div>
)
/** Default — bare `PlusIcon` + label, can be dropped at the end of any "add new" grid. */
export const Default: Story = {
    render: () => (
        <Cell>
            <SurfaceCardPlaceholder label="Create new CV" onPress={() => {}} />
        </Cell>
    ),
}
/** `icon` slot fixture for {@link CustomIcon} — a component reference (COMPOSITE-8), not a built node. */
const FilePlusFixture = () => <FilePlusIcon data-tier="fixture" />

/** Custom icon — the caller swaps the leading glyph (e.g. file-plus for a document grid). The frame forces `size-8` itself (§4). */
export const CustomIcon: Story = {
    render: () => (
        <Cell>
            <SurfaceCardPlaceholder icon={FilePlusFixture} label="Import from file" onPress={() => {}} />
        </Cell>
    ),
}
/** `isSelected` — the tile is selected within a selection grid (accent ring), same contract as `SurfaceCard`'s pressable states. */
export const Selected: Story = {
    render: () => (
        <Cell>
            <SurfaceCardPlaceholder label="Create new CV" isSelected onPress={() => {}} />
        </Cell>
    ),
}
/** `isDisabled` — e.g. while a create mutation is running, or the plan's limit has been hit. */
export const Disabled: Story = {
    render: () => (
        <Cell>
            <SurfaceCardPlaceholder label="Create new CV" isDisabled onPress={() => {}} />
        </Cell>
    ),
}
/** `isSkeleton` — a self-drawn mirror (icon block + 1 text bar), same dashed frame, same footprint. */
export const Loading: Story = {
    render: () => (
        <Cell>
            <SurfaceCardPlaceholder label="Create new CV" isSkeleton onPress={() => {}} />
        </Cell>
    ),
}