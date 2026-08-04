import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `CategoryTabs` — the catalog category filter row, one tab per category with its
 * product count. `activeKey` is DATA, so which tab is lit is a state of the single
 * shape. Grounded in the real `CatalogCategory` — the streamlined catalog exposes
 * two categories.
 */

/** One category tab — a category key, its localized label, and how many products sit under it. */
export interface CategoryTab {
    /** Stable category key (`CatalogCategory` value, e.g. `"site_from_template"`). */
    key: string
    /** Already-localized category label. */
    label: string
    /** How many products this category holds. */
    count: number
}

/** Props for {@link CategoryTabs}. */
export interface CategoryTabsProps {
    /** The categories, in display order. */
    categories: Array<CategoryTab>
    /** The currently-selected category key. */
    activeKey: string
    /** Select a category — the connected layer re-filters the catalog. */
    onSelect: (key: string) => void
    /**
     * `true` → the catalog's own first fetch is in flight: a fixed count of
     * placeholder tabs render idle and non-interactive with their labels shimmering
     * (§12b), so the row holds its shape until the real categories land. Threaded
     * straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
}

/** Tab chrome, written out per state so the block never composes a class string at runtime. */
const TAB_BASE = "flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
const TAB_ACTIVE = "bg-accent/10"
const TAB_IDLE = "hover:bg-default/40"

/** Count-pill chrome, per state — mirrors the tab's active/idle tone. */
const COUNT_BASE = "rounded-full px-2 text-xs leading-5"
const COUNT_ACTIVE = "bg-accent/15 text-accent"
const COUNT_IDLE = "bg-default text-muted"

/** How many placeholder tabs the loading mirror draws before the categories land. */
const SKELETON_TAB_COUNT = 3

/** Placeholder tabs — a fixed set so the loading row mirrors the loaded row's shape. */
const SKELETON_CATEGORIES: Array<CategoryTab> = Array.from({ length: SKELETON_TAB_COUNT }, (_unused, index) => ({
    key: `skeleton-${index}`,
    label: "Category",
    count: 0,
}))

/**
 * The category filter row. See the file header for why the active tab is a state
 * of one shape rather than a separate leaf.
 *
 * @param props - {@link CategoryTabsProps}
 */
const CategoryTabs = ({ categories, activeKey, onSelect, isSkeleton = false }: CategoryTabsProps) => {
    const tabs = isSkeleton ? SKELETON_CATEGORIES : categories
    return (
        <div
            data-tier="block"
            data-component="CategoryTabs"
            role="tablist"
            aria-label="Catalog categories"
            className="flex flex-wrap gap-1"
        >
            {tabs.map((category) => {
                const isActive = !isSkeleton && category.key === activeKey
                return (
                    <button
                        key={category.key}
                        type="button"
                        role="tab"
                        aria-selected={isSkeleton ? undefined : isActive}
                        disabled={isSkeleton}
                        onClick={isSkeleton ? undefined : () => onSelect(category.key)}
                        className={`${TAB_BASE} ${isActive ? TAB_ACTIVE : TAB_IDLE}`}
                    >
                        <Typography
                            size="sm"
                            weight={isActive ? "medium" : undefined}
                            color={isActive ? "accent" : "muted"}
                            isSkeleton={isSkeleton}
                            text={category.label}
                        />
                        <span className={`${COUNT_BASE} ${isActive ? COUNT_ACTIVE : COUNT_IDLE}`}>
                            {isSkeleton ? (
                                <Typography size="xs" isSkeleton text={String(category.count)} />
                            ) : (
                                category.count
                            )}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export { CategoryTabs }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "CategoryTabs" } as const
