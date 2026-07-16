import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"

import { SearchInput } from "@/components/blocks/form/SearchInput"
import { SUGGESTIONS } from "./components"

const meta: Meta<typeof SearchInput> = {
    title: "Blocks/Form/SearchInput",
    component: SearchInput,
}

export default meta

type Story = StoryObj<typeof SearchInput>

/** A controlled search input (value + onValueChange). The parent owns the query. */
export const Default: Story = {
    parameters: { usage: "Controlled (value + onValueChange). The parent owns the query." },
    render: () => {
        const [q, setQ] = useState("")
        return (
            <div className="w-80">
                <SearchInput value={q} onValueChange={setQ} placeholder="Search courses, lessons…" />
            </div>
        )
    },
}

/** With typeahead: `suggestions` + `onSelectSuggestion` → a listbox dropdown appears when focused and the query is non-empty. The parent supplies the data source (e.g. Elasticsearch). Type to see suggestions. */
export const WithSuggestions: Story = {
    parameters: { usage: "Typeahead: suggestions + onSelectSuggestion → a dropdown when focused and the query is non-empty. The parent supplies the data source." },
    render: () => {
        const [q, setQ] = useState("Re")
        return (
            <div className="w-80">
                <SearchInput
                    value={q}
                    onValueChange={setQ}
                    placeholder="Search courses, lessons…"
                    suggestions={SUGGESTIONS}
                    onSelectSuggestion={(s) => setQ(s.label)}
                />
            </div>
        )
    },
}

/** `variant="secondary"` — a muted field background, for a search box sitting on a light surface (e.g. inside a card/toolbar). */
export const Secondary: Story = {
    parameters: { usage: "variant=secondary: a muted field background, for a search box on a light surface (card/toolbar)." },
    render: () => {
        const [q, setQ] = useState("")
        return (
            <div className="w-80">
                <SearchInput value={q} onValueChange={setQ} placeholder="Filter the list…" variant="secondary" />
            </div>
        )
    },
}
