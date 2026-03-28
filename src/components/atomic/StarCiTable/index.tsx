import {
    Table, 
    TableProps, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell
} from "@heroui/react"
import React, { forwardRef } from "react"

export const StarCiTable = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
    return <Table {...props} ref={ref} />
})
StarCiTable.displayName = "StarCiTable"

export const StarCiTableHeader = TableHeader
export const StarCiTableColumn = TableColumn
export const StarCiTableBody = TableBody
export const StarCiTableRow = TableRow
export const StarCiTableCell = TableCell