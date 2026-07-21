import type { Meta, StoryObj } from "@storybook/nextjs"
import { SearchBar } from "./SearchBar"

const meta: Meta<typeof SearchBar> = {
    title: "Primitives/Form/SearchBar",
    component: SearchBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SearchBar>

/**
 * Default: full width — sits in a page header/toolbar, filling its parent
 * (fullWidth on TextField + Autocomplete). Click to open the suggestions popover,
 * type to filter; the filters icon button trails the field.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <SearchBar />
        </div>
    ),
}

/**
 * NarrowFrame: constrained by a max-width parent (sidebar / narrow card) — the
 * InputGroup and filters icon keep their proportions without breaking layout.
 */
export const NarrowFrame: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-64">
                <SearchBar className="w-full" />
            </div>
        </div>
    ),
}
