import { useState } from "react"

import { Pagination } from "@/components/blocks/navigation/Pagination"

/** Page control (controlled, 1-based). Click a number / prev-next to change page — the parent holds the state. */
export const Demo = ({ total, start }: { total: number; start: number }) => {
    const [page, setPage] = useState(start)
    return <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
}
