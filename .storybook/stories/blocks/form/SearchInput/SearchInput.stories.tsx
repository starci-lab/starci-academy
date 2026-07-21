import type { Meta, StoryObj } from "@storybook/nextjs"
import { fn, userEvent, within } from "storybook/test"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { OVERFLOW_SUGGESTIONS, SUGGESTIONS } from "./components"

const meta: Meta<typeof SearchInput> = {
    title: "Blocks/Form/SearchInput",
    component: SearchInput,
    args: {
        placeholder: "Search courses, lessons…",
        onValueChange: fn(),
    },
    argTypes: {
        value: {
            control: "text",
            description: "Current search query (controlled) — the parent owns it.",
        },
        variant: {
            control: "select",
            options: ["primary", "secondary"],
            description: "HeroUI input surface variant; `secondary` uses a muted field background for a search box sitting on a light surface (card/toolbar).",
        },
        suggestions: {
            control: false,
            description: "Optional typeahead suggestions. Paired with `onSelectSuggestion`, a listbox dropdown renders while focused and the query is non-empty.",
        },
        onSelectSuggestion: {
            control: false,
            description: "Fired with the chosen suggestion; its presence is what enables the dropdown.",
        },
    },
}

export default meta

type Story = StoryObj<typeof SearchInput>

/**
 * Empty query, unfocused — the bare search field with icon + placeholder. The
 * dropdown never opens here: it requires a non-empty value AND suggestions.
 */
export const Default: Story = {
    parameters: { usage: "Controlled (value + onValueChange). The parent owns the query. Empty and unfocused — the dropdown requires a non-empty value plus suggestions, so it stays closed." },
    args: {
        value: "",
    },
}

/**
 * `variant="secondary"` — a muted field background, for a search box sitting
 * on a light surface (e.g. inside a card/toolbar).
 */
export const Secondary: Story = {
    parameters: { usage: "variant=\"secondary\": a muted field background, for a search box on a light surface (card/toolbar)." },
    args: {
        value: "",
        variant: "secondary",
        placeholder: "Filter the list…",
    },
}

/**
 * With typeahead: `suggestions` + `onSelectSuggestion` → a listbox dropdown
 * renders under the field once focused and the query is non-empty, with the
 * matched substring styled. The parent supplies the data source (e.g. an
 * Elasticsearch-backed query) — the story focuses the field to reveal it.
 */
export const DataSuggestions: Story = {
    parameters: { usage: "Typeahead: suggestions + onSelectSuggestion → a dropdown when focused and the query is non-empty. The parent supplies the data source." },
    args: {
        value: "Re",
        suggestions: SUGGESTIONS,
        onSelectSuggestion: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("searchbox"))
    },
}

/**
 * A long suggestions list exceeds the dropdown's `max-h-72` and scrolls. The
 * keyboard-highlighted row (`activeIndex`) scrolls into view as ArrowDown
 * moves it past the visible area — a real, distinct render from the short list.
 */
export const Overflow: Story = {
    parameters: { usage: "A long suggestions list scrolls past max-h-72; arrow keys move the keyboard highlight and scroll it into view." },
    args: {
        value: "e",
        suggestions: OVERFLOW_SUGGESTIONS,
        onSelectSuggestion: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole("searchbox")
        await userEvent.click(input)
        await userEvent.keyboard("{ArrowDown}".repeat(15))
    },
}
