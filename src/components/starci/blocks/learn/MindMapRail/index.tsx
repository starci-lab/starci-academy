import { FunnelSimpleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { InputSearch } from "@/components/atoms/forms/Input"
import { Popover } from "@/components/atoms/overlay/Popover"
import { ButtonRadioGroup } from "@/components/composites/buttons/ButtonRadioGroup"
import { Badge } from "@/components/atoms/display/Badge"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
} from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import type { VerdictBandVariant } from "@/components/composites/cards/verdict-band"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `MindMapRail` — the keyword lookup pane beside a mind-map canvas: search a term,
 * narrow by popularity tier, pick a result. Two shapes: `Default` (funnel popover
 * closed — loading/empty/populated are states of the single region below the header
 * row, swapped by `AsyncContent`) and `FilterOpen` (the popover panel open, so the
 * tier `ButtonRadioGroup` becomes a real node). The open panel renders through a
 * portal, outside the box `BlockAnatomy` scans.
 */

/** The popularity-tier filter this rail's result list is narrowed by. */
export type MindMapRailTier = "all" | "medium" | "high"

/** One keyword result — plain DATA; the block builds the row's tone and check. */
export interface MindMapRailItem {
    /** Stable id — the React key, and what `onPick` fires with. */
    id: string
    /** The keyword's display label. */
    label: string
    /** Relevance/popularity score in the map (0–100, higher = more central). Drives the row's tone via {@link popularityTone}. */
    popularity: number
    /** Where this keyword sits in the map's hierarchy, e.g. "Networking > TCP > Handshake". */
    breadcrumb: string
}

/** Props for {@link MindMapRail}. */
export interface MindMapRailProps {
    /** Current search text (controlled). */
    query: string
    /** Fired on every keystroke in the search field. */
    onQuery: (query: string) => void
    /** Current popularity-tier filter. */
    tier: MindMapRailTier
    /** Fired with the tier the reader picked in the funnel popover. */
    onTier: (tier: MindMapRailTier) => void
    /** The current query+tier's matching keywords, in display order. */
    items: Array<MindMapRailItem>
    /** Which result is currently focused on the canvas, if any. */
    selectedId?: string
    /** Fired with a result's id when its row is pressed. */
    onPick: (id: string) => void
    /** `true` → this rail's own query/tier fetch is in flight. */
    isLoading: boolean
    /** Accessible name for the search field. */
    ariaLabel: string
    /** Accessible name for the tier radio group inside the funnel popover. */
    tierAriaLabel: string
    /** `true` → the result list renders its own mirror (see file header's loading judgement call). */
    isSkeleton?: boolean
    /** Dev/spec only: pins the funnel popover open (see file header's judgement call). */
    defaultFilterOpen?: boolean
}

/** The block's own wording for the tier filter — never handed in by the caller (§14d.1). */
const TIER_LABEL: Record<MindMapRailTier, string> = {
    all: "All",
    medium: "Medium",
    high: "High",
}

const TIER_ORDER: Array<MindMapRailTier> = ["all", "medium", "high"]

/** Popularity score at/above which a row earns the "hub term" accent band. */
const POPULARITY_HIGH_THRESHOLD = 70
/** Popularity score at/above which a row earns the quieter "worth a look" band. */
const POPULARITY_MEDIUM_THRESHOLD = 35

/** Popularity → row tone — see file header's judgement call for why only two bands exist. */
const popularityTone = (popularity: number): VerdictBandVariant | undefined => {
    if (popularity >= POPULARITY_HIGH_THRESHOLD) return "accent"
    if (popularity >= POPULARITY_MEDIUM_THRESHOLD) return "warning"
    return undefined
}

const FILTER_TRIGGER_LABEL = "Filter"
const FILTER_HEADING = "Popularity"
const SEARCH_PLACEHOLDER = "Search keywords..."
const EMPTY_TITLE_NO_QUERY = "No keywords in this map yet"
const EMPTY_DESCRIPTION_WITH_QUERY = "Try a different keyword or loosen the filter."

/** How many placeholder rows mirror the list while `items` hasn't landed yet. */
const SKELETON_ROW_COUNT = 5

/** Placeholder rows for the loading mirror — no data, no press handler (§12c). */
const skeletonRows = (): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        title: "",
        subtitle: "",
    }))

/** One real row: label + breadcrumb subtitle, popularity tone band, selection check. */
const resultRow = (item: MindMapRailItem, selectedId: string | undefined, onPick: (id: string) => void): SurfaceCardListItem => ({
    key: item.id,
    title: item.label,
    subtitle: item.breadcrumb,
    metaText: String(item.popularity),
    tone: popularityTone(item.popularity),
    selected: item.id === selectedId,
    onPress: () => onPick(item.id),
})

/**
 * The keyword lookup pane. See the file header for the full contract, the
 * two-leaf boundary, and the judgement calls (tone bands, `defaultFilterOpen`,
 * never-skeletonised header row).
 *
 * @param props - {@link MindMapRailProps}
 */
const MindMapRail = ({
    query,
    onQuery,
    tier,
    onTier,
    items,
    selectedId,
    onPick,
    isLoading,
    ariaLabel,
    tierAriaLabel,
    isSkeleton = false,
    defaultFilterOpen = false,
}: MindMapRailProps) => {
    const hasQuery = query.trim().length > 0
    const isFiltered = tier !== "all"

    const emptyContent: AsyncContentEmptyProps = hasQuery
        ? {
            icon: MagnifyingGlassIcon,
            title: `No keywords match "${query}"`,
            description: EMPTY_DESCRIPTION_WITH_QUERY,

        }
        : {
            title: EMPTY_TITLE_NO_QUERY,

        }

    const rows: Array<SurfaceCardListItem> = items.map((item) => resultRow(item, selectedId, onPick))

    const filterTrigger = (
        <Popover
            triggerLabel={FILTER_TRIGGER_LABEL}
            triggerIcon={FunnelSimpleIcon}
            heading={FILTER_HEADING}
            defaultOpen={defaultFilterOpen}

            content={
                <div>
                    <ButtonRadioGroup
                        ariaLabel={tierAriaLabel}
                        value={tier}
                        onChange={onTier}

                        items={TIER_ORDER.map((key) => ({ value: key, content: TIER_LABEL[key] }))}
                    />
                </div>
            }
        />
    )

    const searchRow = (
        <>
            <div className="min-w-0 flex-1">
                <InputSearch
                    value={query}
                    onValueChange={onQuery}
                    placeholder={SEARCH_PLACEHOLDER}
                    ariaLabel={ariaLabel}

                />
            </div>
            <div>
                {/* `Badge` only wraps the trigger when a non-default tier is active — `dot` has
                    no built-in "hide me" reading the way `count` does (§ Badge file header: count
                    ≤ 0 hides itself, a bare dot has no such signal), so the ON/OFF state is this
                    block's own condition instead of a prop the atom could resolve alone. */}
                {isFiltered ? <Badge dot>{filterTrigger}</Badge> : filterTrigger}
            </div>
        </>
    )

    const railBody = (
        <>
            <StackH gap={3} principles={["flex-action"]} at="sm" isSkeleton={isSkeleton} items={[() => searchRow]} />
            <AsyncContent
                isLoading={isLoading || isSkeleton}
                skeleton={() => <SurfaceCardList items={skeletonRows()} isSkeleton />}
                isEmpty={items.length === 0}
                emptyContent={emptyContent}

                content={() => <SurfaceCardList items={rows} />}
            />
        </>
    )

    return <StackV gap={3} isSkeleton={isSkeleton} items={[() => railBody]} />
}

export { MindMapRail }
