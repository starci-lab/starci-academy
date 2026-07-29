import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConsultantDirectoryCompanySearch } from "@sb-components/starci/blocks/consultant/ConsultantDirectoryCompanySearch/ConsultantDirectoryCompanySearch"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ConsultantDirectoryCompanySearch`: a typed, debounced DEEP-LINK to one
 * recruiting company's page, sitting above the consultant grid on the directory
 * screen.
 *
 * ⚠️ NOT A GRID FILTER. The real query has no server-side search over
 * consultants — only an ES company-suggester — so this row can only jump the
 * visitor straight to a company page it already knows about. See
 * `ConsultantDirectoryCompanySearch.tsx`'s file header for the exact naming
 * mistake this block is careful not to repeat (`ContentModeNav`'s history).
 *
 * 📐 ONE LEAF. The field + suggestion popover is a single structural shape;
 * `isLoadingSuggestions` only swaps which content the SAME popover shell shows,
 * which is a DATA condition, not a new shape — so it lives as a `why` inside the
 * one `Default` leaf rather than splitting into its own leaf.
 */
const meta: Meta<typeof ConsultantDirectoryCompanySearch> = {
    title: "StarCi/Blocks/Consultant/ConsultantDirectoryCompanySearch/ConsultantDirectoryCompanySearch",
    component: ConsultantDirectoryCompanySearch,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConsultantDirectoryCompanySearch>

const SUGGESTIONS = [
    { id: "shopee-vn", label: "Shopee Việt Nam" },
    { id: "tiki", label: "Tiki Corporation" },
    { id: "fpt-software", label: "FPT Software" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SearchAutocomplete": { tier: "atom", role: "the controlled suggest-as-you-type field this block drives, owning its own field-box and popover anatomy", storyId: "atoms-forms-searchautocomplete--overview" },
}

/** LEAF — full set: static field, typed query with matches, and the empty/loading data conditions inside the one popover shell. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ConsultantDirectoryCompanySearch"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "query = \"\" (resting)",
                        why: "Nothing has been typed yet, so the field shows only its owned placeholder — worded as a company lookup, not a grid filter, so a visitor never mistakes it for narrowing the consultants below.",
                        code: `<ConsultantDirectoryCompanySearch
    query=""
    onQueryChange={setQuery}
    suggestions={[]}
    onSelectCompany={(id) => router.push(\`/companies/\${id}\`)}
/>`,
                        render: (
                            <ConsultantDirectoryCompanySearch
                                anatPart="ConsultantDirectoryCompanySearch"
                                showAnatomy
                                query=""
                                onQueryChange={() => {}}
                                suggestions={[]}
                                onSelectCompany={() => {}}
                            />
                        ),
                    },
                    {
                        name: "query = \"Shopee\", suggestions matched",
                        why: "The screen has already round-tripped the ES company-suggester for the current query and hands the matches down as data — this block never fetches. Picking a row is the whole point of the control: the screen turns the id into a route push, not a grid re-filter.",
                        code: `<ConsultantDirectoryCompanySearch
    query="Shopee"
    onQueryChange={setQuery}
    suggestions={suggestions}
    onSelectCompany={(id) => router.push(\`/companies/\${id}\`)}
/>`,
                        render: (
                            <ConsultantDirectoryCompanySearch
                                query="Shopee"
                                onQueryChange={() => {}}
                                suggestions={SUGGESTIONS}
                                onSelectCompany={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isLoadingSuggestions = true",
                        why: "The suggester round-trip has not landed yet, so the SAME popover shell swaps its content to a spinner instead of a stale or empty list — the shape does not change, only what fills it, which is why this stays a state rather than its own leaf.",
                        code: `<ConsultantDirectoryCompanySearch
    query="Shop"
    onQueryChange={setQuery}
    suggestions={[]}
    isLoadingSuggestions
    onSelectCompany={(id) => router.push(\`/companies/\${id}\`)}
/>`,
                        render: (
                            <ConsultantDirectoryCompanySearch
                                query="Shop"
                                onQueryChange={() => {}}
                                suggestions={[]}
                                isLoadingSuggestions
                                onSelectCompany={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
