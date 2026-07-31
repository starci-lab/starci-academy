import React, { useCallback, useMemo } from "react"
import { Pagination as HeroPagination, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `Pagination` — the single page-nav atom wrapping HeroUI `Pagination`.
 *
 * Controlled + presentational: pass `currentPage` / `totalPages` and a raw
 * `onPageChange`; the atom renders the full HeroUI compound —
 * `Pagination.Content > Item > (Previous | Link | Ellipsis | Next)` — and owns
 * prev/next clamping and windowing. When the page count is large it collapses
 * distant pages behind `Pagination.Ellipsis` (first · … · current±siblings ·
 * … · last); a short list shows every page.
 *
 * Only `Pagination` is exported — no bare component. No `children` — the
 * pager is fully data-driven (`currentPage`/`totalPages`). The atom owns
 * clamping/windowing/aria; the consumer never touches the compound.
 * `isSkeleton` renders a co-located control skeleton.
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
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    className,
    classNames,
}: PaginationBaseProps) => {
    const slots = useMemo(() => buildSlots(currentPage, totalPages, siblings), [currentPage, totalPages, siblings])

    /** Go to the previous page, clamped to the first page. */
    const onPrevious = useCallback(() => onPageChange(Math.max(1, currentPage - 1)), [currentPage, onPageChange])
    /** Go to the next page, clamped to the last page. */
    const onNext = useCallback(() => onPageChange(Math.min(totalPages, currentPage + 1)), [currentPage, totalPages, onPageChange])

    if (isSkeleton) {
        // Prev + a few page squares + next.
        return (
            <div className={cn("flex items-center justify-center gap-1", className, classNames)}>
                {Array.from({ length: 5 }, (_, index) => (
                    <HeroSkeleton key={index} className="size-9 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className={cn("flex justify-center", className, classNames)}>
            <HeroPagination aria-label="Pagination" size="sm">
                <HeroPagination.Content className="flex flex-wrap justify-center gap-1">
                    <HeroPagination.Item>
                        <HeroPagination.Previous
                            aria-label="Previous page"
                            isDisabled={currentPage <= 1}
                            onPress={onPrevious}
                        >
                            <HeroPagination.PreviousIcon />
                        </HeroPagination.Previous>
                    </HeroPagination.Item>
                    {slots.map((slot, index) =>
                        slot === "ellipsis" ? (
                            <HeroPagination.Item key={`ellipsis-${index}`}>
                                <HeroPagination.Ellipsis />
                            </HeroPagination.Item>
                        ) : (
                            <PaginationLink
                                key={slot}
                                pageNumber={slot}
                                isActive={slot === currentPage}
                                onPageChange={onPageChange}
                            />
                        ),
                    )}
                    <HeroPagination.Item>
                        <HeroPagination.Next
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
}

/**
 * A single page link; isolates its press handler so no inline arrow lives in the map.
 *
 * @param props - {@link PaginationLinkProps}
 */
const PaginationLink = ({ pageNumber, isActive, onPageChange }: PaginationLinkProps) => {
    const onPress = useCallback(() => onPageChange(pageNumber), [pageNumber, onPageChange])
    return (
        <HeroPagination.Item>
            <HeroPagination.Link isActive={isActive} onPress={onPress}>
                {pageNumber}
            </HeroPagination.Link>
        </HeroPagination.Item>
    )
}

/**
 * `Pagination.*` — the page-nav ATOM namespace. `Pagination` is the single
 * constrained pager (windowing / ellipsis are LEAVES of it, prop-driven).
 */
export { PaginationBase as Pagination }
