import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { userEvent, within } from "storybook/test"
import { SearchInput } from "./SearchInput"
import type { SearchInputSuggestion } from "./SearchInput"

const meta: Meta<typeof SearchInput> = {
    title: "Primitives/Form/SearchInput",
    component: SearchInput,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SearchInput>

/** A handful of typeahead suggestions — enough to see the dropdown without scrolling. */
const SUGGESTIONS: Array<SearchInputSuggestion> = [
    { id: "1", label: "React hooks" },
    { id: "2", label: "React Server Components" },
    { id: "3", label: "React Query" },
    { id: "4", label: "React Testing Library" },
    { id: "5", label: "React Router" },
]

/** A long suggestion list — exceeds the dropdown's `max-h-72` so it has to scroll. */
const OVERFLOW_SUGGESTIONS: Array<SearchInputSuggestion> = [
    { id: "1", label: "Node.js Streams" },
    { id: "2", label: "TypeScript Generics" },
    { id: "3", label: "Next.js Middleware" },
    { id: "4", label: "GraphQL Federation" },
    { id: "5", label: "Redis Caching" },
    { id: "6", label: "Kubernetes Deployments" },
    { id: "7", label: "Docker Compose" },
    { id: "8", label: "PostgreSQL Indexes" },
    { id: "9", label: "Elasticsearch Queries" },
    { id: "10", label: "WebSocket Events" },
    { id: "11", label: "Server-Sent Events" },
    { id: "12", label: "OAuth2 Flows" },
    { id: "13", label: "JWT Refresh Tokens" },
    { id: "14", label: "Rate Limiting Strategies" },
    { id: "15", label: "Message Queues" },
    { id: "16", label: "Event Sourcing" },
    { id: "17", label: "CQRS Pattern" },
    { id: "18", label: "Database Sharding" },
    { id: "19", label: "Load Balancing" },
    { id: "20", label: "CDN Edge Caching" },
    { id: "21", label: "Webhook Delivery" },
    { id: "22", label: "gRPC Streaming" },
    { id: "23", label: "Microservices Testing" },
    { id: "24", label: "Serverless Functions" },
]

/** Local controlled wrapper — holds `value` so the field is typeable on the canvas. */
const Controlled = ({
    initialValue = "",
    placeholder,
    variant,
    suggestions,
    withSelect,
}: {
    initialValue?: string
    placeholder?: string
    variant?: "primary" | "secondary"
    suggestions?: Array<SearchInputSuggestion>
    withSelect?: boolean
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <SearchInput
            value={value}
            onValueChange={setValue}
            placeholder={placeholder}
            variant={variant}
            suggestions={suggestions}
            onSelectSuggestion={withSelect ? (s) => setValue(s.label) : undefined}
        />
    )
}

/**
 * Default: empty query, unfocused — the bare search field with icon + placeholder.
 * The dropdown never opens here: it requires a non-empty value AND suggestions.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <Controlled placeholder="Search courses, lessons…" />
        </div>
    ),
}

/**
 * Secondary: `variant="secondary"` — a muted field background, for a search box
 * sitting on a light surface (e.g. inside a card/toolbar).
 */
export const Secondary: Story = {
    render: () => (
        <div className="p-8">
            <Controlled variant="secondary" placeholder="Filter the list…" />
        </div>
    ),
}

/**
 * DataSuggestions: `suggestions` + `onSelectSuggestion` → a listbox dropdown
 * renders once focused and the query is non-empty, with the matched substring
 * styled. The play step focuses the field to reveal it.
 */
export const DataSuggestions: Story = {
    render: () => (
        <div className="p-8">
            <Controlled initialValue="Re" suggestions={SUGGESTIONS} withSelect />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("searchbox"))
    },
}

/**
 * Overflow: a long suggestions list exceeds the dropdown's `max-h-72` and
 * scrolls. Arrow keys move the keyboard highlight and scroll it into view.
 */
export const Overflow: Story = {
    render: () => (
        <div className="p-8">
            <Controlled initialValue="e" suggestions={OVERFLOW_SUGGESTIONS} withSelect />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole("searchbox")
        await userEvent.click(input)
        await userEvent.keyboard("{ArrowDown}".repeat(15))
    },
}
