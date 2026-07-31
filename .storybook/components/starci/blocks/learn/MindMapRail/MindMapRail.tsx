import { FunnelSimpleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { InputSearch } from "@sb-components/atoms/forms/Input/Input"
import { Popover } from "@sb-components/atoms/overlay/Popover/Popover"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { VerdictBandVariant } from "@sb-components/composites/cards/verdict-band"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MindMapRail`: the keyword LOOKUP PANE beside a mind-map canvas —
 * search a term, narrow by how popular it is in the map, pick one from the
 * result list. This block never touches the canvas: picking a result only
 * fires `onPick`, and drawing/centering the graph on that node is the
 * out-of-reach engine's job (§B3 — this is the CHROME around it, not the
 * canvas itself).
 *
 * ⭐ REUSE, NOT A NEW SHAPE (the exact mistake this task exists to avoid — see
 * `ContentModeNav`'s file header). Every piece here is an existing primitive,
 * unreshaped:
 *   • `InputSearch` (atom)       — the query field, verbatim (same wrapping
 *     `<div className="min-w-0 flex-1">` pattern as `FlashcardDeckList`'s
 *     search row, so the field grows and the funnel trigger stays intrinsic).
 *   • `Popover` (atom)           — the funnel trigger + its panel. This block
 *     does not hand-roll a dropdown; the popularity radio group rides inside
 *     the atom's own `content` slot.
 *   • `ButtonRadioGroup` (atom)  — the tier control INSIDE the popover, same
 *     single-select atom `QuizSetup`/`SubmissionAttemptSelector` already use
 *     for a value + `onChange` pair — not a second toggle-row component.
 *   • `Badge` (atom), `dot`      — a presence signal on the funnel trigger
 *     when a non-default tier is active, so "a filter is on" reads before
 *     the popover is even opened.
 *   • `AsyncContent` (composite) — the loading → empty → content switch. This
 *     block does not track its own "which message am I showing" state, it
 *     just feeds the branches (no `error` prop in this brief, so the error
 *     branch is simply never armed — same shape `FoundationResourceList`
 *     uses when it HAS an error prop, minus the branch this one doesn't need).
 *   • `SurfaceCardList` (composite), bare (no `label`) — the bounded row
 *     surface, its dividers, and its OWN row mirror while loading. This block
 *     never builds a row box by hand.
 * None of these get reshaped; this block only decides the tier vocabulary,
 * the popularity → row-tone mapping, and which of them fires for a result.
 *
 * LEAF BY STRUCTURE (§14d.2), two of them:
 *   1. Default      — funnel popover closed. Loading / empty / populated are
 *      STATES of this SAME tree (`AsyncContent`'s own three branches already
 *      swap the one region under the header row — nothing else in the block
 *      appears or disappears across them).
 *   2. Filter open   — the popover panel is open, so the tier
 *      `ButtonRadioGroup` is now a real node in the tree. That is a genuine
 *      structural difference (a whole control appears), not a data condition
 *      of leaf 1. ⚠️ Same portal limit `Popover`'s own story documents: the
 *      panel (and this `ButtonRadioGroup` inside it) renders into
 *      `document.body`, outside the render box `BlockAnatomy` scans by DOM
 *      ancestry — `data-anat-part="ButtonRadioGroup"` is still emitted (the
 *      honest name for what's there), it just never reaches the Structure tab.
 *
 * ⭐ JUDGEMENT CALL — `defaultFilterOpen` (uncontrolled, optional) exists ONLY
 * to pin leaf 2's popover open for the story, mirroring `Popover`'s own
 * `defaultOpen`/`isOpen` contract ("STORY soak" per that atom's file header).
 * The real screen never needs to force the funnel open, so this is dev/spec
 * plumbing forwarded straight through, the same category as `showAnatomy`.
 *
 * ⭐ JUDGEMENT CALL — the popularity → row tone mapping (`popularityTone`) is
 * this block's own vocabulary (§14d.1), same footing as `ContentModeNav`'s
 * mode labels: a keyword's popularity is a bare number from the caller, never
 * a pre-picked colour. Two bands only (`accent` for a hub term, `warning` for
 * a middling one) — a THIRD band for low-popularity terms would turn a long
 * rail into a wall of colour and defeat the point of highlighting the ones
 * worth noticing first, so the common case stays bare.
 *
 * ⭐ JUDGEMENT CALL — the search field and the funnel trigger are NEVER
 * skeletonised, same reasoning as `ContentModeNav`/`FlashcardDeckList`'s
 * search row: both are usable before any result has loaded (typing a query
 * or opening the tier filter doesn't depend on the list already being
 * there), so only the result list swaps to its mirror.
 *
 * ⭐ JUDGEMENT CALL — `isLoading` (this rail's own in-flight query/tier fetch)
 * and `isSkeleton` (a parent-forced skeleton paint, the canon-standard prop
 * every component carries) both fall into `AsyncContent`'s ONE loading
 * branch via `isLoading || isSkeleton` — same reconciliation
 * `SubmissionAttemptSelector` uses, since `AsyncContent` only exposes a
 * single loading concept.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** The block's own wording for the tier filter — never handed in by the caller (§14d.1). */
const TIER_LABEL: Record<MindMapRailTier, string> = {
    all: "Tất cả",
    medium: "Trung bình",
    high: "Cao",
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

const FILTER_TRIGGER_LABEL = "Lọc"
const FILTER_HEADING = "Độ phổ biến"
const SEARCH_PLACEHOLDER = "Tìm từ khoá..."
const EMPTY_TITLE_NO_QUERY = "Chưa có từ khoá nào trong bản đồ này"
const EMPTY_DESCRIPTION_WITH_QUERY = "Thử một từ khoá khác hoặc bỏ bớt bộ lọc."

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
    showAnatomy = false,
    anatPart,
}: MindMapRailProps) => {
    const hasQuery = query.trim().length > 0
    const isFiltered = tier !== "all"

    const emptyContent: AsyncContentEmptyProps = hasQuery
        ? {
            icon: MagnifyingGlassIcon,
            title: `Không tìm thấy từ khoá nào khớp "${query}"`,
            description: EMPTY_DESCRIPTION_WITH_QUERY,
            anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
            showAnatomy,
        }
        : {
            title: EMPTY_TITLE_NO_QUERY,
            anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
            showAnatomy,
        }

    const rows: Array<SurfaceCardListItem> = items.map((item) => resultRow(item, selectedId, onPick))

    const filterTrigger = (
        <Popover
            triggerLabel={FILTER_TRIGGER_LABEL}
            triggerIcon={FunnelSimpleIcon}
            heading={FILTER_HEADING}
            defaultOpen={defaultFilterOpen}
            showAnatomy={showAnatomy}
            content={
                <div data-anat-part={showAnatomy ? "ButtonRadioGroup" : undefined}>
                    <ButtonRadioGroup
                        ariaLabel={tierAriaLabel}
                        value={tier}
                        onChange={onTier}
                        showAnatomy={showAnatomy}
                        items={TIER_ORDER.map((key) => ({ value: key, content: TIER_LABEL[key] }))}
                    />
                </div>
            }
        />
    )

    const searchRow = (
        <>
            <div className="min-w-0 flex-1" data-anat-part={showAnatomy ? "InputSearch" : undefined}>
                <InputSearch
                    value={query}
                    onValueChange={onQuery}
                    placeholder={SEARCH_PLACEHOLDER}
                    ariaLabel={ariaLabel}
                    showAnatomy={showAnatomy}
                />
            </div>
            <div data-anat-part={showAnatomy ? (isFiltered ? "Badge" : "Popover") : undefined}>
                {/* `Badge` only wraps the trigger when a non-default tier is active — `dot` has
                    no built-in "hide me" reading the way `count` does (§ Badge file header: count
                    ≤ 0 hides itself, a bare dot has no such signal), so the ON/OFF state is this
                    block's own condition instead of a prop the atom could resolve alone. */}
                {isFiltered ? <Badge dot showAnatomy={showAnatomy}>{filterTrigger}</Badge> : filterTrigger}
            </div>
        </>
    )

    const railBody = (
        <>
            <StackH gap="related" wrap anatPart={showAnatomy ? "StackH" : undefined} body={searchRow} />
            <AsyncContent
                isLoading={isLoading || isSkeleton}
                skeleton={<SurfaceCardList items={skeletonRows()} isSkeleton anatPart={showAnatomy ? "SurfaceCardList" : undefined} />}
                isEmpty={items.length === 0}
                emptyContent={emptyContent}
                showAnatomy={showAnatomy}
                content={<SurfaceCardList items={rows} anatPart={showAnatomy ? "SurfaceCardList" : undefined} />}
            />
        </>
    )

    return <StackV gap="related" anatPart={anatPart} body={railBody} />
}

export { MindMapRail }
