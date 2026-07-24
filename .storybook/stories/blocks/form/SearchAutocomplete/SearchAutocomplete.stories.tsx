import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { userEvent, within } from "storybook/test"
import { SearchAutocomplete } from "./SearchAutocomplete"
import type { SearchAutocompleteItem } from "./SearchAutocomplete"

const meta: Meta<typeof SearchAutocomplete> = {
    title: "Primitives/Forms/SearchAutocomplete",
    component: SearchAutocomplete,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SearchAutocomplete>

const CATALOG: Array<SearchAutocompleteItem> = [
    { id: "fullstack", label: "Fullstack Mastery", description: "Comprehensive web development course" },
    { id: "system-design", label: "System Design Mastery", description: "Designing systems at large scale" },
    { id: "devops", label: "DevOps Mastery", description: "CI/CD, infrastructure and operations" },
    { id: "tag-react", label: "React", description: "Topic" },
    { id: "tag-kafka", label: "Kafka", description: "Topic" },
]

/** Focus the field so its ComboBox popover opens on the canvas. */
const openPopover = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("combobox"))
}

/**
 * WithSuggestions: the parent owns `inputValue` + the `items` list (filtered
 * here to mimic real suggestions — the block renders `items` as-is). Picking a
 * row returns its id through `onSelect`. Each row has a label + optional muted
 * description.
 */
export const WithSuggestions: Story = {
    render: () => {
        const [inputValue, setInputValue] = useState("")
        const items = useMemo(() => {
            const query = inputValue.trim().toLowerCase()
            if (query.length === 0) {
                return CATALOG
            }
            return CATALOG.filter((item) => item.label.toLowerCase().includes(query))
        }, [inputValue])
        return (
            <div className="p-8">
                <div className="max-w-sm">
                    <SearchAutocomplete
                        items={items}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSelect={() => undefined}
                    />
                </div>
            </div>
        )
    },
    play: openPopover,
}

/**
 * Loading: while the parent fetches results for the current query, `isLoading`
 * swaps the suggestion list for a spinner until data arrives.
 */
export const Loading: Story = {
    render: () => {
        const [inputValue, setInputValue] = useState("system")
        return (
            <div className="p-8">
                <div className="max-w-sm">
                    <SearchAutocomplete
                        items={CATALOG}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSelect={() => undefined}
                        isLoading
                    />
                </div>
            </div>
        )
    },
    play: openPopover,
}

/**
 * Skeleton: the loading mirror — a field-box skeleton matching the search
 * field's resting shape (no dropdown, canon §8).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <SearchAutocomplete
                items={[]}
                inputValue=""
                onInputChange={() => undefined}
                onSelect={() => undefined}
                isSkeleton
            />
        </div>
    ),
}

/**
 * NoResults: when `items` is empty and not loading, the dropdown shows
 * `emptyLabel` in place of the suggestion list.
 */
export const NoResults: Story = {
    render: () => {
        const [inputValue, setInputValue] = useState("no-results")
        return (
            <div className="p-8">
                <div className="max-w-sm">
                    <SearchAutocomplete
                        items={[]}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSelect={() => undefined}
                        emptyLabel="No matching course or topic found"
                    />
                </div>
            </div>
        )
    },
    play: openPopover,
}
