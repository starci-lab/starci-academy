import React from "react"
import { Skeleton, Table } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonTable}. */
export interface SkeletonTableProps extends WithClassNames<undefined> {
    /** Number of body rows to render. Defaults to 3. */
    rows?: number
    /** Number of columns per row. Defaults to 3. */
    cols?: number
}

/**
 * Skeleton matching a HeroUI <Table/>: renders the REAL `Table` structure
 * (header + body rows, borders/padding baked in — rule: keep the real container
 * in the skeleton, only cell content becomes bars) with a `body-sm` glyph bar
 * (`h-[14px]` centered `my-[5px]`) in each header column + body cell.
 */
export const SkeletonTable = ({ rows = 3, cols = 3, className }: SkeletonTableProps) => (
    <Table variant="primary" aria-label="Đang tải bảng" className={className}>
        <Table.ScrollContainer>
            <Table.Content aria-label="Đang tải bảng">
                <Table.Header>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <Table.Column key={colIndex} id={`col-${colIndex}`} isRowHeader={colIndex === 0}>
                            <Skeleton className="my-[5px] h-[14px] w-16 rounded" />
                        </Table.Column>
                    ))}
                </Table.Header>
                <Table.Body>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <Table.Row key={rowIndex} id={`row-${rowIndex}`}>
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <Table.Cell key={colIndex}>
                                    <Skeleton className="my-[5px] h-[14px] w-full rounded" />
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
    </Table>
)
