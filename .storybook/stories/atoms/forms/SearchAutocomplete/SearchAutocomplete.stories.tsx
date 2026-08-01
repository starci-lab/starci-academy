import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { userEvent, within } from "storybook/test"
import { SearchAutocomplete } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import type { SearchAutocompleteItem } from "@sb-components/atoms/forms/SearchAutocomplete/SearchAutocomplete"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — a suggest-as-you-type search field built on HeroUI `ComboBox`. Real
 * free-text anatomy: `ComboBox.InputGroup` (Input + leading icon) plus
 * `ComboBox.Popover` (ListBox of suggestion rows / spinner / empty state).
 *
 * Leaf atom: `ComboBox.InputGroup`/`ComboBox.Popover`/`Skeleton` are REAL heroui
 * components (not hand-rolled internal slots) — none of them has ITS OWN story
 * to jump to here, so `annotate` carries no `storyId`, but they still need the
 * `heroui` tier so the two-law panel doesn't silently skip them (2026-07-28;
 * their names used to be shortened to "InputGroup"/"Popover" — fixed back to
 * the real compound name). Tier corrected to `atom` (it used to be `primitive`
 * — the old name for the frame tier §13, now split into frame/composite as of
 * 2026-07-27 — wrong here since this is a real atom, and the title is already
 * `Atoms/Forms/SearchAutocomplete`).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy reflecting the parts THAT leaf composes — the field +
 * dropdown shape is constant across WithSuggestions/Loading/NoResults (only the
 * dropdown's INTERNAL content changes, which is the Popover's own concern);
 * `Skeleton` collapses to a single field-box mirror with no dropdown at all.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ComboBox.InputGroup": { tier: "heroui", role: "search field + leading icon group" },
    "ComboBox.Popover": { tier: "heroui", role: "suggestion dropdown container" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}
const meta: Meta<typeof SearchAutocomplete> = {
    title: "Atoms/Forms/SearchAutocomplete",
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
            <div data-tier="fixture" className="p-8">
                <div className="max-w-sm">
                    <BlockAnatomy
                        name="SearchAutocomplete"
                        tier="atom"
                        annotate={ANNOTATE}
                        leaf="WithSuggestions"
                        reason="Suggest-as-you-type needs the real free-text anatomy of the HeroUI ComboBox, where InputGroup carries the field and its icon while Popover carries the dropdown. The parent only hands over items and inputValue, and the block does no filtering itself, so it stays reusable for any data source."
                        states={[
                            {
                                name: "items = matching CATALOG rows, isLoading unset",
                                why: "The Popover's ListBox renders one row per item, each with a label and an optional muted description line beneath it. This is the everyday reading state, reached once the parent has filtered the catalog down to whatever the typed query matches.",
                                code: "<SearchAutocomplete items={items} inputValue={q} onInputChange={setQ} onSelect={fn} />",
                                render: (
                                    <SearchAutocomplete
                                        items={items}
                                        inputValue={inputValue}
                                        onInputChange={setInputValue}
                                        onSelect={() => undefined}
                                        showAnatomy
                                    />
                                ),
                            },
                        ]}
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
            <div data-tier="fixture" className="p-8">
                <div className="max-w-sm">
                    <BlockAnatomy
                        name="SearchAutocomplete"
                        tier="atom"
                        annotate={ANNOTATE}
                        leaf="Loading"
                        states={[
                            {
                                name: "isLoading = true",
                                why: "The ListBox's collection is emptied so its renderEmptyState branch fires, swapping in a spinner and a Searching caption in place of the suggestion rows. The InputGroup and Popover shell stay exactly the shape they have in WithSuggestions, since only the dropdown's own content is waiting.",
                                code: "<SearchAutocomplete isLoading items={[]} inputValue={q} onInputChange={setQ} onSelect={fn} />",
                                render: (
                                    <SearchAutocomplete
                                        items={CATALOG}
                                        inputValue={inputValue}
                                        onInputChange={setInputValue}
                                        onSelect={() => undefined}
                                        isLoading
                                        showAnatomy
                                    />
                                ),
                            },
                        ]}
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
        <div data-tier="fixture" className="p-8 max-w-sm">
            <BlockAnatomy
                name="SearchAutocomplete"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Skeleton"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The whole ComboBox is replaced by one field-box skeleton bar, and the dropdown never mounts because a popover has no resting shape to mirror. This is what the field shows before the parent has any query result ready to control it with.",
                        code: "<SearchAutocomplete isSkeleton />",
                        render: (
                            <SearchAutocomplete
                                items={[]}
                                inputValue=""
                                onInputChange={() => undefined}
                                onSelect={() => undefined}
                                isSkeleton
                                showAnatomy
                            />
                        ),
                    },
                ]}
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
            <div data-tier="fixture" className="p-8">
                <div className="max-w-sm">
                    <BlockAnatomy
                        name="SearchAutocomplete"
                        tier="atom"
                        annotate={ANNOTATE}
                        leaf="NoResults"
                        states={[
                            {
                                name: "items = [], isLoading unset",
                                why: "With an empty item list and no loading flag, the ListBox's empty-state branch falls through to the emptyLabel caption instead of the spinner. The parent lands here once a real fetch finishes and turns up nothing for the typed query.",
                                code: "<SearchAutocomplete items={[]} inputValue={q} onInputChange={setQ} onSelect={fn} />",
                                render: (
                                    <SearchAutocomplete
                                        items={[]}
                                        inputValue={inputValue}
                                        onInputChange={setInputValue}
                                        onSelect={() => undefined}
                                        emptyLabel="No matching course or topic found"
                                        showAnatomy
                                    />
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        )
    },
    play: openPopover,
}
