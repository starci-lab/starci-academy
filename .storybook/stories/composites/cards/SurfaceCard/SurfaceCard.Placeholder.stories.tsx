import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { FilePlusIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"

/**
 * FRAME (Layouts) — the "add new" tile: a `rounded-3xl` card with a DASHED border, pressable,
 * icon + label centered, muted. Carries no function beyond "this spot is empty, press to create."
 *
 * Press contract §7: only `active:scale`, NO hover-bg — the dashed tile sits still both at rest
 * and on hover, the only feedback is the press itself.
 *
 * ⚠️ STATE SCOPE (teacher's call 2026-07-25): this is the ONLY member that takes no content
 * (no slot, no `items`) — the story only has its OWN state: default icon vs. swapped icon,
 * `isSelected`, `isDisabled`, `isSkeleton`. No BlockAnatomy since this frame doesn't expose
 * `showAnatomy`/`anatPart` (§11a: only attach an anatomy tree when there's a real `data-anat-part`).
 *
 * 2026-07-26 (teacher, THREE INDEPENDENT AXES): `.Placeholder` is NOT on the list of members
 * that change `bordered`/`flushContent`/`compact` — `SurfaceCardPlaceholderProps` has none of
 * the props in those three axes (only `icon`/`label`/`onPress`/`isSelected`/`isDisabled`/
 * `isSkeleton`/`className`), so this story changes nothing in the prop codemod.
 */
const meta: Meta<typeof SurfaceCard.Placeholder> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard.Placeholder",
    component: SurfaceCard.Placeholder,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Placeholder>

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
    <div className="p-8">
        <div className="h-80 w-64">{children}</div>
    </div>
)

/** Default — bare `PlusIcon` + label, can be dropped at the end of any "add new" grid. */
export const Default: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" onPress={() => {}} />
        </Cell>
    ),
}

/** Custom icon — the caller swaps the leading glyph (e.g. file-plus for a document grid). The icon goes in BARE, the frame forces `size-8` itself (§4). */
export const CustomIcon: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder icon={<FilePlusIcon />} label="Import from file" onPress={() => {}} />
        </Cell>
    ),
}

/** `isSelected` — the tile is selected within a selection grid (accent ring), same contract as `SurfaceCard.Pressable`. */
export const Selected: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" isSelected onPress={() => {}} />
        </Cell>
    ),
}

/** `isDisabled` — e.g. while a create mutation is running, or the plan's limit has been hit. */
export const Disabled: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" isDisabled onPress={() => {}} />
        </Cell>
    ),
}

/** `isSkeleton` — a self-drawn mirror (icon block + 1 text bar), same dashed frame, same footprint. */
export const Loading: Story = {
    render: () => (
        <Cell>
            <SurfaceCard.Placeholder label="Create new CV" isSkeleton onPress={() => {}} />
        </Cell>
    ),
}
