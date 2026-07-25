import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { userEvent, within } from "storybook/test"
import { SearchAutocomplete } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import type { SearchAutocompleteItem } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * PRIMITIVE — a suggest-as-you-type search field built on HeroUI `ComboBox`.
 * Real free-text anatomy: `ComboBox.InputGroup` (Input + leading icon) plus
 * `ComboBox.Popover` (ListBox of suggestion rows / spinner / empty state).
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

/** Focus the field so its ComboBox popover opens on the canvas. */
const openPopover = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("combobox"))
}

// §11a — direct children of the ComboBox root only: InputGroup (field + icon) and
// Popover (dropdown). What the Popover renders INSIDE (rows / spinner / empty
// text) is its own internal concern, not drilled into here.
const FIELD_PARTS: Array<AnatomyNode> = [
    { name: "InputGroup", tier: "primitive", role: "trường nhập liệu (Input search + icon kính lúp)" },
    { name: "Popover", tier: "primitive", role: "dropdown gợi ý — ListBox các row, hoặc spinner, hoặc rỗng, tuỳ state" },
]

const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "mirror khung field lúc đang tải — không có dropdown để mirror" },
]

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
                        tier="primitive"
                        leaf="WithSuggestions"
                        parts={FIELD_PARTS}
                        reason="Suggest-as-you-type cần đúng anatomy free-text của HeroUI ComboBox — InputGroup (field + icon) và Popover (dropdown) là hai part cấp cao nhất; parent chỉ đưa items/inputValue, block không tự filter nên tái dùng được cho mọi nguồn dữ liệu."
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
                        tier="primitive"
                        leaf="Loading"
                        parts={FIELD_PARTS}
                        note="isLoading chỉ đổi NỘI DUNG bên trong Popover (spinner thay vì rows) — cùng shape InputGroup + Popover với leaf 'Có gợi ý'."
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
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="isSkeleton thay TOÀN BỘ ComboBox bằng một field-box mirror — dropdown không có resting shape nên không mirror."
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
                        tier="primitive"
                        leaf="NoResults"
                        parts={FIELD_PARTS}
                        note="items rỗng + không loading → Popover hiện emptyLabel thay rows — cùng shape InputGroup + Popover với các leaf khác."
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
