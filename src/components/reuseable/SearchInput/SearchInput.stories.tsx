import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"

import { SearchInput } from "./index"

const meta: Meta<typeof SearchInput> = {
    title: "Core/Form/SearchInput",
    component: SearchInput,
}

export default meta

type Story = StoryObj<typeof SearchInput>

const SUGGESTIONS = [
    { id: "1", label: "React hooks" },
    { id: "2", label: "React Server Components" },
    { id: "3", label: "React Query" },
]

/** Ô tìm kiếm controlled (value + onValueChange). Parent sở hữu query. */
export const Default: Story = {
    parameters: { usage: "Controlled (value + onValueChange). Parent sở hữu query." },
    render: () => {
        const [q, setQ] = useState("")
        return (
            <div className="w-80">
                <SearchInput value={q} onValueChange={setQ} placeholder="Tìm khóa học, bài học…" />
            </div>
        )
    },
}

/** Có typeahead: `suggestions` + `onSelectSuggestion` → dropdown listbox hiện khi focus & query khác rỗng. Parent lo nguồn dữ liệu (VD Elasticsearch). Gõ để thấy gợi ý. */
export const WithSuggestions: Story = {
    parameters: { usage: "Typeahead: suggestions + onSelectSuggestion → dropdown khi focus & query khác rỗng. Parent lo nguồn dữ liệu." },
    render: () => {
        const [q, setQ] = useState("Re")
        return (
            <div className="w-80">
                <SearchInput
                    value={q}
                    onValueChange={setQ}
                    placeholder="Tìm khóa học, bài học…"
                    suggestions={SUGGESTIONS}
                    onSelectSuggestion={(s) => setQ(s.label)}
                />
            </div>
        )
    },
}

/** `variant="secondary"` — nền field mờ, cho ô tìm nằm trên surface sáng (VD trong card/toolbar). */
export const Secondary: Story = {
    parameters: { usage: "variant=secondary: nền field mờ, cho ô tìm trên surface sáng (card/toolbar)." },
    render: () => {
        const [q, setQ] = useState("")
        return (
            <div className="w-80">
                <SearchInput value={q} onValueChange={setQ} placeholder="Lọc danh sách…" variant="secondary" />
            </div>
        )
    },
}
