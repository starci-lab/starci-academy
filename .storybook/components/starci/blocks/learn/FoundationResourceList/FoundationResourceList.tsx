import React from "react"
import { CaretRightIcon, MagnifyingGlassIcon, StackIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { Cluster, type ClusterItem } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationResourceList`: the resource BROWSE list — numbered rows of
 * supplementary material (articles, videos, exercises, reference docs) the
 * learner can search and page through.
 *
 * REUSE, NOT A NEW SHAPE (the exact mistake this task exists to avoid — see
 * `ContentModeNav`'s file header). Nothing here is hand-rolled:
 *   • `AsyncContent` (composite)  — the error → loading → empty → content
 *     switch. This block does not track its own "which message am I showing"
 *     state, it just feeds the four branches.
 *   • `SurfaceCardList` (composite) — the bounded row surface, dividers, and
 *     its OWN row mirror while `isSkeleton`. This block never builds a row box
 *     by hand.
 *   • `IconTile` (atom)  — the leading thumbnail. It ALREADY falls back from a
 *     cover image to an icon glyph on its own (`src` fails/absent → `icon`
 *     renders instead), so this block does not need a second "thumbnail or
 *     glyph" component — it just always hands `IconTile` both `src` and a
 *     fallback `icon={StackIcon}` and lets the atom decide which one shows.
 *   • `EnumChip` (composite) — the kind chip. This block only supplies the
 *     kind → label/color map; the composite owns the chip's own shape.
 *   • `Chip` (atom) — the "recommended" chip, `tone="accent"`, plain text.
 *   • `Pagination` (atom) — the page nav, verbatim.
 * None of these get reshaped; this block only decides WHICH ones fire for a
 * given resource and WHAT their numbers/words mean.
 *
 * WHAT THIS BLOCK OWNS (§14d.1 — domain wording the caller must not hand in):
 *   • Position numbering ("1. Title") — see the judgement call below for what
 *     "position" means across pages.
 *   • The kind → chip label lookup (`KIND_CHIP_MAP`).
 *   • The "Đề xuất" recommended-chip text.
 *   • Choosing between "no resources yet" and `no matches for "X"` from the
 *     typed `searchQuery` prop — never a pre-formatted empty-state string
 *     (§14d.1's exact trap: a caller handing over `emptyMessage: string`
 *     would smuggle domain wording past the block that is supposed to own it).
 *
 * LEAF BOUNDARY (canon `2-leaf-states.md` §0's R0 test — "who flips the prop
 * that changes the tree?"):
 *   • `isLoading` — the CALLER sets this boolean and it swaps the whole region
 *     for a skeleton mirror ⇒ its own LEAF (`Prop \`isLoading\``), same
 *     reasoning §1's table gives `isSkeleton` at every tier.
 *   • `error` — optional, and its PRESENCE alone swaps the whole region for a
 *     message ⇒ its own LEAF (`Prop \`error\``, §2②: "optional + presence
 *     grows/removes a node ⇒ exactly one leaf").
 *   • `resources.length === 0` (with or without `searchQuery`) is DATA
 *     returning `0` — R0's own worked example ("0 · 1-3 · nhiều · null ⇒
 *     STATE") — so the two empty messages are STATES of the same `Default`
 *     leaf as a populated page, not leaves of their own. `AsyncContent` still
 *     swaps the rendered branch for this case, same as it does for
 *     `isLoading`/`error` — but the thing DECIDING the swap is the `resources`
 *     array the caller was already required to pass, not a prop the caller
 *     flips on purpose, which is what R0 keys off.
 *
 * ⭐ JUDGEMENT CALL — position numbers are LOCAL to the current page (`1..N`
 * for whatever `resources` holds), not a running count across pages. There is
 * no `pageSize` prop to derive an offset from, and guessing one from
 * `resources.length` would silently break on a short last page. Documented
 * here rather than invented quietly.
 *
 * ⭐ JUDGEMENT CALL — the pager sits INSIDE the same `content` branch as the
 * list, not behind its own extra condition. "Shown only once results exist"
 * is exactly what reaching the content branch already means — `AsyncContent`
 * only renders `content` when it is neither loading, erroring, nor empty — so
 * a second `resources.length > 0` check on top would just repeat the switch
 * `AsyncContent` already made.
 *
 * ⭐ JUDGEMENT CALL — no retry action on the error branch. The prop surface
 * this block was asked for carries no `onRetry`/`retryLabel` pair, so
 * `errorContent` is a bare message; a caller that needs a retry button wraps
 * this block with one at the screen tier instead of this block inventing an
 * unused prop.
 *
 * ⭐ JUDGEMENT CALL — `ariaLabel` names the whole region (`role="region"`) on
 * the block's own root. Unlike sibling list blocks, this one has no visible
 * `label` heading (`SurfaceCardList`'s own `label`/`labelEnd` slots are left
 * unused on purpose — the caller's page already carries a heading for this
 * section), so `ariaLabel` is the only accessible name the region gets.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The kind of resource a row points at — drives the kind chip's label/color. */
export type FoundationKindEnum = "article" | "video" | "exercise" | "reference"

/** One resource row — plain DATA; the block builds the numbering, chips and caret. */
export interface FoundationResourceItem {
    /** Stable id — the React key. */
    id: string
    /** Resource title — the block prefixes it with its position ("1. …"). */
    title: string
    /** One-line blurb under the title. */
    description?: string
    /** Cover thumbnail. Falls back to a `StackIcon` glyph — see file header. */
    thumbnailUrl?: string
    /** Drives the kind chip via {@link KIND_CHIP_MAP}. */
    kind: FoundationKindEnum
    /** `true` → an extra "Đề xuất" chip rides beside the kind chip. */
    isRecommended?: boolean
    /** Fired when the row is pressed. */
    onPress: () => void
}

/** Props for {@link FoundationResourceList}. */
export interface FoundationResourceListProps {
    /** The current page's resources, in display order. REQUIRED — see file header §R0. */
    resources: Array<FoundationResourceItem>
    /** `true` → the list's own fetch is in flight; own LEAF (see file header). */
    isLoading: boolean
    /** Truthy → the list falls to its error message; own LEAF (beats loading/empty). */
    error?: unknown
    /** Current search text, if the list is filtered. Decides which empty message shows. */
    searchQuery?: string
    /** 1-based current page. */
    currentPage: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the viewer picked. */
    onPageChange: (pageNumber: number) => void
    /** Accessible name for the list region — the block has no visible heading of its own. */
    ariaLabel?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** kind → chip label/color — the block's own vocabulary (§14d.1), never handed in by a caller. */
const KIND_CHIP_MAP: Record<FoundationKindEnum, EnumChipEntry> = {
    article: { label: "Bài viết" },
    video: { label: "Video", color: "accent" },
    exercise: { label: "Bài tập", color: "warning" },
    reference: { label: "Tài liệu", color: "success" },
}

/** The block's own wording for the recommended chip. */
const RECOMMENDED_LABEL = "Đề xuất"

const ERROR_TITLE = "Không tải được danh sách tài nguyên"
const EMPTY_TITLE_NO_QUERY = "Chưa có tài nguyên nào ở đây"
const EMPTY_DESCRIPTION_WITH_QUERY = "Thử một từ khoá khác."

/** How many placeholder rows mirror the list while `resources` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** One row's kind chip + optional recommended chip, in that order. */
const resourceMeta = (resource: FoundationResourceItem, showAnatomy: boolean) => {
    const chips: Array<ClusterItem> = [
        {
            key: "kind",
            content: <EnumChip value={resource.kind} map={KIND_CHIP_MAP} anatPart={showAnatomy ? "EnumChip" : undefined} />,
        },
    ]
    if (resource.isRecommended) {
        chips.push({
            key: "recommended",
            content: <Chip tone="accent" text={RECOMMENDED_LABEL} anatPart={showAnatomy ? "Chip" : undefined} />,
        })
    }
    return <Cluster gap="related" items={chips} anatPart={showAnatomy ? "Cluster" : undefined} />
}

/** Placeholder rows for the loading mirror — no data, no press handler (§12c). */
const skeletonRows = (showAnatomy: boolean): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        leading: <IconTile isSkeleton size="sm" showAnatomy={showAnatomy} anatPart={showAnatomy ? "IconTile" : undefined} />,
        title: "",
        subtitle: "",
    }))

/** One real row: numbered title, blurb, thumbnail-or-glyph, kind+recommended chips, caret. */
const resourceRow = (resource: FoundationResourceItem, position: number, showAnatomy: boolean): SurfaceCardListItem => ({
    key: resource.id,
    leading: (
        <IconTile
            src={resource.thumbnailUrl}
            icon={StackIcon}
            size="sm"
            showAnatomy={showAnatomy}
            anatPart={showAnatomy ? "IconTile" : undefined}
        />
    ),
    // The block owns the numbering (§14d.1) — see file header for why it is
    // LOCAL to the current page rather than a running count across pages.
    title: `${position}. ${resource.title}`,
    subtitle: resource.description,
    meta: resourceMeta(resource, showAnatomy),
    trailingIcon: CaretRightIcon,
    onPress: resource.onPress,
})

/**
 * The resource browse list. See the file header for the full contract, the
 * leaf boundary reasoning, and the judgement calls (local numbering, pager
 * placement, no retry action, `ariaLabel` as the region's only name).
 *
 * @param props - {@link FoundationResourceListProps}
 */
const FoundationResourceList = ({
    resources,
    isLoading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    onPageChange,
    ariaLabel,
    showAnatomy = false,
    anatPart,
}: FoundationResourceListProps) => {
    const hasQuery = Boolean(searchQuery && searchQuery.trim().length > 0)

    const emptyContent: AsyncContentEmptyProps = hasQuery
        ? {
            icon: MagnifyingGlassIcon,
            title: `Không tìm thấy tài nguyên nào khớp "${searchQuery}"`,
            description: EMPTY_DESCRIPTION_WITH_QUERY,
            anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
            showAnatomy,
        }
        : {
            title: EMPTY_TITLE_NO_QUERY,
            anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
            showAnatomy,
        }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        anatPart: showAnatomy ? "AsyncContentError" : undefined,
        showAnatomy,
    }

    const rows: Array<SurfaceCardListItem> = resources.map((resource, index) => resourceRow(resource, index + 1, showAnatomy))

    return (
        <div data-anat-part={anatPart} aria-label={ariaLabel} role={ariaLabel ? "region" : undefined}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={
                    <SurfaceCardList
                        items={skeletonRows(showAnatomy)}
                        isSkeleton
                        anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                    />
                }
                isEmpty={resources.length === 0}
                emptyContent={emptyContent}
                error={error}
                errorContent={errorContent}
                showAnatomy={showAnatomy}
                content={
                    <StackV
                        gap="related"
                        anatPart={showAnatomy ? "StackV" : undefined}
                        body={
                            <>
                                <SurfaceCardList items={rows} anatPart={showAnatomy ? "SurfaceCardList" : undefined} />
                                <div data-anat-part={showAnatomy ? "Pagination" : undefined}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                        showAnatomy={showAnatomy}
                                    />
                                </div>
                            </>
                        }
                    />
                }
            />
        </div>
    )
}

export { FoundationResourceList }
