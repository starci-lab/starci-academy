import type { Meta, StoryObj } from "@storybook/nextjs"
import { SearchBar } from "@sb-components/_legacy/designs/form/SearchBar/SearchBar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy — there is no separate consolidated "Anatomy" story.
 * SearchBar directly composes a sr-only `Label`, the `Autocomplete` combobox
 * (its own root is a context wrapper with no DOM — cut from the tree like
 * `Popover` in `PriceTag`, leaving `Autocomplete.Trigger`/`Autocomplete.Popover`
 * as the DOM-bearing siblings) and a trailing filters `Button` — the Filter/
 * SearchField/ListBox rows inside the popover are the suggestions-dropdown's
 * OWN internal shape (§11a: not drilled here, only the popover container itself).
 */
const meta: Meta<typeof SearchBar> = {
    title: "Legacy/Design/Forms/SearchBar",
    component: SearchBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SearchBar>

/** Live field: sr-only label + Autocomplete (trigger + suggestions popover) + trailing filter Button. */
const PARTS_MAIN: Array<AnatomyNode> = [
    { name: "Label", tier: "primitive", role: "nhãn 'Tìm kiếm' sr-only (a11y)" },
    { name: "Autocomplete.Trigger", tier: "primitive", role: "ô nhập + giá trị + nút xoá + mũi tên (combobox trigger)" },
    { name: "Autocomplete.Popover", tier: "primitive", role: "dropdown gợi ý (filter field + ListBox) — không đào sâu ở đây" },
    { name: "Button", tier: "primitive", role: "nút icon 'Bộ lọc' (trailing suffix)" },
]

/** Loading mirror: one field-box skeleton, no popover/filter button ever renders. */
const PARTS_SKELETON: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "khung ô tìm kiếm (h-10)", state: "skeleton" },
]

/**
 * Default: full width — sits in a page header/toolbar, filling its parent
 * (fullWidth on TextField + Autocomplete). Click to open the suggestions popover,
 * type to filter; the filters icon button trails the field.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SearchBar"
                tier="design"
                leaf="Default"
                parts={PARTS_MAIN}
                reason="Ô tìm kiếm gói 3 phần: nhãn a11y ẩn, combobox Autocomplete (trigger + popover gợi ý), và nút bộ lọc trailing — TextField/InputGroup chỉ là khung bố cục, không phải part riêng."
            >
                <SearchBar showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * NarrowFrame: constrained by a max-width parent (sidebar / narrow card) — the
 * InputGroup and filters icon keep their proportions without breaking layout.
 */
export const NarrowFrame: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-64">
                <BlockAnatomy
                    name="SearchBar"
                    tier="design"
                    leaf="NarrowFrame"
                    parts={PARTS_MAIN}
                    note="Container hẹp hơn — CÙNG composition với leaf 'Default', chỉ đổi độ rộng khung ngoài."
                >
                    <SearchBar className="w-full" showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * Skeleton: `isSkeleton` renders the loading mirror — the same full-width bar
 * footprint (h-10) as the real field, no popover/filter button ever renders.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="SearchBar"
                tier="design"
                leaf="Skeleton"
                parts={PARTS_SKELETON}
                note="isSkeleton → chỉ một khung bar mirror (h-10); popover/nút lọc không có hình dạng chờ để mirror."
            >
                <SearchBar isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
