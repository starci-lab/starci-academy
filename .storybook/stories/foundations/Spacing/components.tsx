import { Table } from "@heroui/react"

export interface ScaleItem {
    token: string
    px: number
    note: string
}

/** A scale table using HeroUI `Table` (full-width): Token · px · When to use. */
export const ScaleTable = ({ rows, ariaLabel }: { rows: Array<ScaleItem>; ariaLabel: string }) => (
    <Table variant="primary" className="w-full">
        <Table.ScrollContainer>
            <Table.Content aria-label={ariaLabel}>
                <Table.Header>
                    <Table.Column isRowHeader>Token</Table.Column>
                    <Table.Column>px</Table.Column>
                    <Table.Column>When to use</Table.Column>
                </Table.Header>
                <Table.Body>
                    {rows.map((row) => (
                        <Table.Row key={row.token}>
                            <Table.Cell>
                                <code className="text-xs font-semibold text-foreground">{row.token}</code>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-xs tabular-nums text-muted">{row.px}px</span>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-sm text-muted">{row.note}</span>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
    </Table>
)

export interface PadItem {
    token: string
    note: string
}
