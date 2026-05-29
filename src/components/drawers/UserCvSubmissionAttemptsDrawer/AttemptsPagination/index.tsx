"use client"

import React from "react"
import {
    Pagination,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link AttemptsPagination}. */
export interface AttemptsPaginationProps {
    /** 1-based current page. */
    currentPage: number
    /** Total number of pages. */
    totalPages: number
    /** Page numbers to render as links (1-based). */
    pageNumbers: Array<number>
    /** Fired with a 1-based page number when the user picks a page. */
    onPageChange: (pageNumber: number) => void
    /** Fired when the user requests the previous page. */
    onPrevious: () => void
    /** Fired when the user requests the next page. */
    onNext: () => void
}

/**
 * Pagination control for the attempts drawer.
 *
 * Presentational: renders page links + prev/next, delegates navigation via props.
 * @param props - {@link AttemptsPaginationProps}
 */
export const AttemptsPagination = ({
    currentPage,
    totalPages,
    pageNumbers,
    onPageChange,
    onPrevious,
    onNext,
}: AttemptsPaginationProps) => {
    const t = useTranslations()
    return (
        <div className="shrink-0 border-t bg-content1 px-3 py-3">
            <Pagination
                aria-label={t("common.pagination.navAria")}
                className="w-full justify-center"
                size="sm"
            >
                <Pagination.Content className="flex flex-wrap justify-center gap-1">
                    <Pagination.Item>
                        <Pagination.Previous
                            aria-label={t("common.pagination.previous")}
                            isDisabled={currentPage <= 1}
                            onPress={onPrevious}
                        >
                            <Pagination.PreviousIcon />
                        </Pagination.Previous>
                    </Pagination.Item>
                    {pageNumbers.map((pageNumber) => (
                        <AttemptsPaginationLink
                            key={pageNumber}
                            pageNumber={pageNumber}
                            isActive={pageNumber === currentPage}
                            onPageChange={onPageChange}
                        />
                    ))}
                    <Pagination.Item>
                        <Pagination.Next
                            aria-label={t("common.pagination.next")}
                            isDisabled={currentPage >= totalPages}
                            onPress={onNext}
                        >
                            <Pagination.NextIcon />
                        </Pagination.Next>
                    </Pagination.Item>
                </Pagination.Content>
            </Pagination>
        </div>
    )
}

/** Props for {@link AttemptsPaginationLink}. */
interface AttemptsPaginationLinkProps {
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
 * @param props - {@link AttemptsPaginationLinkProps}
 */
const AttemptsPaginationLink = ({
    pageNumber,
    isActive,
    onPageChange,
}: AttemptsPaginationLinkProps) => {
    /** Navigate to this link's page. */
    const onPress = React.useCallback(
        () => onPageChange(pageNumber),
        [
            pageNumber,
            onPageChange,
        ],
    )
    return (
        <Pagination.Item>
            <Pagination.Link
                isActive={isActive}
                onPress={onPress}
            >
                {pageNumber}
            </Pagination.Link>
        </Pagination.Item>
    )
}
