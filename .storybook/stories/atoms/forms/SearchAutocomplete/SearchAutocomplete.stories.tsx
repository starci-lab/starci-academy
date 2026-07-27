import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { userEvent, within } from "storybook/test"
import { SearchAutocomplete } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import type { SearchAutocompleteItem } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — a suggest-as-you-type search field built on HeroUI `ComboBox`. Real
 * free-text anatomy: `ComboBox.InputGroup` (Input + leading icon) plus
 * `ComboBox.Popover` (ListBox of suggestion rows / spinner / empty state).
 *
 * Atom lá (§12g cuối bài): `InputGroup`/`Popover`/`Skeleton` là span nội bộ,
 * không component nào có story riêng để nhảy tới ⇒ KHÔNG dùng `annotate`, bỏ
 * hẳn prop. Tier sửa lại `atom` (trước là `primitive` — tên cũ của tầng KHUNG
 * §13, sai vì đây là atom thật, title đã là `Atoms/Forms/SearchAutocomplete`).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy reflecting the parts THAT leaf composes — the field +
 * dropdown shape is constant across WithSuggestions/Loading/NoResults (only the
 * dropdown's INTERNAL content changes, which is the Popover's own concern);
 * `Skeleton` collapses to a single field-box mirror with no dropdown at all.
 */
const meta: Meta<typeof SearchAutocomplete.Base> = {
    title: "Atoms/Forms/SearchAutocomplete",
    component: SearchAutocomplete.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SearchAutocomplete.Base>

const CATALOG: Array<SearchAutocompleteItem> = [
    { id: "fullstack", label: "Fullstack Mastery", description: "Comprehensive web development course" },
    { id: "system-design", label: "System Design Mastery", description: "Designing systems at large scale" },
    { id: "devops", label: "DevOps Mastery", description: "CI/CD, infrastructure and operations" },
    { id: "tag-react", label: "React", description: "Topic" },
    { id: "tag-kafka", label: "Kafka", description: "Topic" },
]

/** Props for the `openPopover` interaction helper. */
interface OpenPopoverProps {
    /** root DOM element the story rendered into */
    canvasElement: HTMLElement
}

/** Focus the field so its ComboBox popover opens on the canvas. */
const openPopover = async ({ canvasElement }: OpenPopoverProps) => {
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
                    <BlockAnatomy
                        name="SearchAutocomplete"
                        tier="atom"
                        leaf="WithSuggestions"
                        code={"<SearchAutocomplete.Base items={items} inputValue={q} onInputChange={setQ} onSelect={fn} />"}
                        reason="Suggest-as-you-type needs the real free-text anatomy of the HeroUI ComboBox — InputGroup (field + icon) and Popover (dropdown) are the two top-level parts; the parent only hands over items/inputValue, and the block does no filtering itself, so it stays reusable for any data source."
                    >
                        <SearchAutocomplete.Base
                            items={items}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSelect={() => undefined}
                            showAnatomy
                        />
                    </BlockAnatomy>
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
                    <BlockAnatomy
                        name="SearchAutocomplete"
                        tier="atom"
                        leaf="Loading"
                        code={"<SearchAutocomplete.Base isLoading items={[]} inputValue={q} onInputChange={setQ} onSelect={fn} />"}
                        note="isLoading only changes what the Popover shows inside — a spinner instead of rows — same InputGroup + Popover shape as the WithSuggestions leaf."
                    >
                        <SearchAutocomplete.Base
                            items={CATALOG}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSelect={() => undefined}
                            isLoading
                            showAnatomy
                        />
                    </BlockAnatomy>
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
            <BlockAnatomy
                name="SearchAutocomplete"
                tier="atom"
                leaf="Skeleton"
                code={"<SearchAutocomplete.Base isSkeleton />"}
                note="isSkeleton swaps the whole ComboBox for a single field-box mirror — the dropdown has no resting shape, so nothing mirrors it."
            >
                <SearchAutocomplete.Base
                    items={[]}
                    inputValue=""
                    onInputChange={() => undefined}
                    onSelect={() => undefined}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>
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
                    <BlockAnatomy
                        name="SearchAutocomplete"
                        tier="atom"
                        leaf="NoResults"
                        code={"<SearchAutocomplete.Base items={[]} inputValue={q} onInputChange={setQ} onSelect={fn} />"}
                        note="Empty items with no loading flag makes the Popover show emptyLabel instead of rows — same InputGroup + Popover shape as the other leaves."
                    >
                        <SearchAutocomplete.Base
                            items={[]}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSelect={() => undefined}
                            emptyLabel="No matching course or topic found"
                            showAnatomy
                        />
                    </BlockAnatomy>
                </div>
            </div>
        )
    },
    play: openPopover,
}
