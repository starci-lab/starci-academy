import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { SearchAutocomplete } from "@/components/blocks/form/SearchAutocomplete"
import { CATALOG } from "./components"

const meta: Meta<typeof SearchAutocomplete> = {
    title: "Core/Form/SearchAutocomplete",
    component: SearchAutocomplete,
}
export default meta
type Story = StoryObj<typeof SearchAutocomplete>

/** Use when you need a per-keystroke autocomplete search field for a course or topic — the parent holds the input and the suggestion list, the component only displays. Each row has a label and an optional muted description line. */
export const Default: Story = {
    parameters: {
        usage: "Use when you need a per-keystroke autocomplete search field for a course or topic. The parent holds inputValue and the items list (no filtering inside the component); selecting a row returns its id via onSelect. Here the list filters by the typed string to simulate real suggestions.",
    },
    render: () => {
        const [inputValue, setInputValue] = useState("")
        const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
        // parent-owned filtering — the block renders `items` as-is
        const items = useMemo(() => {
            const query = inputValue.trim().toLowerCase()
            if (query.length === 0) {
                return CATALOG
            }
            return CATALOG.filter((item) => item.label.toLowerCase().includes(query))
        }, [inputValue])
        return (
            <div className="flex max-w-sm flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>With suggestions</Label>
                    <Typography type="body-sm" color="muted">
                        Type to filter the list of courses and topics. Selecting a row records the chosen id.
                    </Typography>
                    {selectedId ? (
                        <Typography type="body-xs" color="muted">
                            Selected: {selectedId}
                        </Typography>
                    ) : null}
                </div>
                <SearchAutocomplete
                    items={items}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSelect={setSelectedId}
                />
            </div>
        )
    },
}

/** Use to check the loading state — while the parent fetches results, the list is replaced by a spinner until data arrives. */
export const Loading: Story = {
    parameters: {
        usage: "Use to check the loading state: set isLoading while the parent fetches suggestions for the current query, and the suggestion grid is replaced by a spinner until data arrives.",
    },
    render: () => {
        const [inputValue, setInputValue] = useState("system")
        return (
            <div className="flex max-w-sm flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Loading</Label>
                    <Typography type="body-sm" color="muted">
                        While the parent fetches results, the dropdown shows a spinner instead of the list.
                    </Typography>
                </div>
                <SearchAutocomplete
                    items={CATALOG}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSelect={() => undefined}
                    isLoading
                />
            </div>
        )
    },
}

/** Use to check the empty state — when the query matches no suggestions, the dropdown shows an empty message instead of the list. */
export const Empty: Story = {
    parameters: {
        usage: "Use to check the empty state: when items is empty and not loading, the dropdown shows emptyLabel instead of the suggestion list.",
    },
    render: () => {
        const [inputValue, setInputValue] = useState("no-results")
        return (
            <div className="flex max-w-sm flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Empty</Label>
                    <Typography type="body-sm" color="muted">
                        When no suggestion matches, the dropdown shows an empty message.
                    </Typography>
                </div>
                <SearchAutocomplete
                    items={[]}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSelect={() => undefined}
                    emptyLabel="No matching course or topic found"
                />
            </div>
        )
    },
}
