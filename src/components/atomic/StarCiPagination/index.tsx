import { Pagination, PaginationProps } from "@heroui/react"
import React from "react"

export const StarCiPagination = (props: PaginationProps) => {
    return <Pagination showControls={true} variant="flat" {...props} />
}