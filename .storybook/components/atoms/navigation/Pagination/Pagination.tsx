import React, { useCallback, useMemo } from "react"
import { Pagination as HeroPagination, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Pagination.Base`: the ONE constrained page-nav atom over HeroUI
 * `Pagination`.
 *
 * Controlled + presentational: the caller passes `currentPage` / `totalPages` and
 * a raw `onPageChange`; the atom renders the FULL HeroUI compound —
 * `Pagination.Content > Item > (Previous | Link | Ellipsis | Next)` — and owns
 * prev/next clamping and the windowing. When the page count is large it collapses
 * distant pages behind `Pagination.Ellipsis` (first · … · current±siblings · … ·
 * last); a short list shows every page. The window is a LEAF of the same atom
 * (§6 granularity), not a separate component.
 *
 * Rules (Chip/Input):
 *   • NAMESPACE bắt buộc — chỉ export `Pagination = { Base }`, không export
 *     component trần (thầy chốt 2026-07-25).
 *   • KHÔNG `children` — pager hoàn toàn dữ liệu (`currentPage`/`totalPages`).
 *   • Bọc HeroUI TỐI ĐA (`Pagination`), alias `Hero*`.
 *   • STRICT §4: `currentPage` + `totalPages` + `onPageChange` TRẦN — the atom
 *     owns clamping/windowing/aria; the consumer never touches the compound.
 *   • `isSkeleton` → control skeleton co-located (HeroSkeleton, hybrid C).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** A rendered slot: a concrete 1-based page, or a collapsed gap. */
type PageSlot = number | "ellipsis"

/** Props for {@link PaginationBase}. */
export interface PaginationBaseProps {
    /** 1-based current page. */
    currentPage: number
    /** Total number of pages (>= 1). */
    totalPages: number
    /** Fired with a 1-based page number when the user changes page. */
    onPageChange: (pageNumber: number) => void
    /**
     * How many page links to keep on EACH side of the current page before
     * collapsing into an ellipsis. Default `1`. Larger = a wider live window.
     */
    siblings?: number
    /** Render the control skeleton (a row of square shimmers) instead of the pager. */
    isSkeleton?: boolean
    /** When on, emit `data-anat-part` on this control's own sub-parts (Previous · PageLink · Ellipsis · Next). */
    showAnatomy?: boolean
    className?: string
}

/**
 * Compute the visible page slots. Always keeps page 1 and the last page, plus a
 * `siblings`-wide window around `currentPage`; gaps become a single "ellipsis".
 * Below the collapse threshold every page is shown (no ellipsis).
 */
const buildSlots = (currentPage: number, totalPages: number, siblings: number): Array<PageSlot> => {
    // first + last + current + siblings*2 + two ellipses — below this, show all.
    const threshold = siblings * 2 + 5
    if (totalPages <= threshold) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    const left = Math.max(currentPage - siblings, 1)
    const right = Math.min(currentPage + siblings, totalPages)
    const slots: Array<PageSlot> = [1]
    if (left > 2) {
        slots.push("ellipsis")
    }
    for (let page = Math.max(left, 2); page <= Math.min(right, totalPages - 1); page += 1) {
        slots.push(page)
    }
    if (right < totalPages - 1) {
        slots.push("ellipsis")
    }
    slots.push(totalPages)
    return slots
}

/**
 * The page-nav atom. See file header for the strict data-driven contract.
 *
 * @param props - {@link PaginationBaseProps}
 */
const PaginationBase = ({
    currentPage,
    totalPages,
    onPageChange,
    siblings = 1,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: PaginationBaseProps) => {
    const slots = useMemo(() => buildSlots(currentPage, totalPages, siblings), [currentPage, totalPages, siblings])

    /** Go to the previous page, clamped to the first page. */
    const onPrevious = useCallback(() => onPageChange(Math.max(1, currentPage - 1)), [currentPage, onPageChange])
    /** Go to the next page, clamped to the last page. */
    const onNext = useCallback(() => onPageChange(Math.min(totalPages, currentPage + 1)), [currentPage, totalPages, onPageChange])

    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — prev + a few page squares + next.
        return (
            <div className={cn("flex items-center justify-center gap-1", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                {Array.from({ length: 5 }, (_, index) => (
                    <HeroSkeleton key={index} className="size-9 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className={cn("flex justify-center", className)}>
            <HeroPagination aria-label="Phân trang" size="sm">
                <HeroPagination.Content className="flex flex-wrap justify-center gap-1">
                    <HeroPagination.Item>
                        <HeroPagination.Previous
                            data-anat-part={showAnatomy ? "Previous" : undefined}
                            aria-label="Trang trước"
                            isDisabled={currentPage <= 1}
                            onPress={onPrevious}
                        >
                            <HeroPagination.PreviousIcon />
                        </HeroPagination.Previous>
                    </HeroPagination.Item>
                    {slots.map((slot, index) =>
                        slot === "ellipsis" ? (
                            <HeroPagination.Item key={`ellipsis-${index}`}>
                                <HeroPagination.Ellipsis data-anat-part={showAnatomy ? "Ellipsis" : undefined} />
                            </HeroPagination.Item>
                        ) : (
                            <PaginationLink
                                key={slot}
                                pageNumber={slot}
                                isActive={slot === currentPage}
                                onPageChange={onPageChange}
                                showAnatomy={showAnatomy}
                            />
                        ),
                    )}
                    <HeroPagination.Item>
                        <HeroPagination.Next
                            data-anat-part={showAnatomy ? "Next" : undefined}
                            aria-label="Trang sau"
                            isDisabled={currentPage >= totalPages}
                            onPress={onNext}
                        >
                            <HeroPagination.NextIcon />
                        </HeroPagination.Next>
                    </HeroPagination.Item>
                </HeroPagination.Content>
            </HeroPagination>
        </div>
    )
}

/** Props for {@link PaginationLink}. */
interface PaginationLinkProps {
    /** 1-based page number this link targets. */
    pageNumber: number
    /** Whether this link is the active page. */
    isActive: boolean
    /** Fired with this link's page number on press. */
    onPageChange: (pageNumber: number) => void
    /** When on, emit `data-anat-part="PageLink"` for the parent `BlockAnatomy` panel. */
    showAnatomy?: boolean
}

/**
 * A single page link; isolates its press handler so no inline arrow lives in the map.
 *
 * @param props - {@link PaginationLinkProps}
 */
const PaginationLink = ({ pageNumber, isActive, onPageChange, showAnatomy }: PaginationLinkProps) => {
    const onPress = useCallback(() => onPageChange(pageNumber), [pageNumber, onPageChange])
    return (
        <HeroPagination.Item>
            <HeroPagination.Link data-anat-part={showAnatomy ? "PageLink" : undefined} isActive={isActive} onPress={onPress}>
                {pageNumber}
            </HeroPagination.Link>
        </HeroPagination.Item>
    )
}

/**
 * `Pagination.*` — the page-nav ATOM namespace. `Pagination.Base` is the single
 * constrained pager (windowing / ellipsis are LEAVES of it, prop-driven).
 */
export const Pagination = {
    Base: PaginationBase,
}
