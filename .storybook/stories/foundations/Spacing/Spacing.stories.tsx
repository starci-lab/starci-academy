import type { Meta, StoryObj } from "@storybook/nextjs"
import { Table } from "@heroui/react"

import { ScaleTable } from "./components"
import type { PadItem } from "./components"

/**
 * SPACING scale (gap + padding) — source: canon `foundations/gap.md` (LOCKED 2026-06-24).
 * The standard scale `0 · 2 · 3 · 6 · 8` for ALL spacing; anything off the scale is FORBIDDEN (except named exceptions).
 *
 * Presented with a HeroUI `Table` (the way large design systems document a space scale —
 * Atlassian, Carbon, Polaris): each token is one row with name · px · a "when to use" line.
 */
const meta: Meta = {
    title: "Core/Foundations/Spacing",
}
export default meta
type Story = StoryObj

/** Standard gap scale — 5 steps, pick the step by the RELATIONSHIP between two elements. */
export const GapScale: Story = {
    render: () => (
        <ScaleTable
            ariaLabel="Standard gap scale"
            rows={[
                { token: "gap-0", px: 0, note: "Touching — number ↔ unit, characters forming one cluster." },
                { token: "gap-2", px: 8, note: "Tight sub-cluster — icon ↔ label, chip ↔ chip." },
                { token: "gap-3", px: 12, note: "Within one block — label ↔ control, row ↔ row." },
                { token: "gap-6", px: 24, note: "Between two blocks — section ↔ section." },
                { token: "gap-8", px: 32, note: "Between two wide regions — a large beat between two large clusters." },
            ]}
        />
    ),
    parameters: {
        usage: "Standard gap scale `0 · 2 · 3 · 6 · 8` (canon foundations/gap). Values off the scale are FORBIDDEN (1/1.5/4/5/7…). Pick the step by the RELATIONSHIP: touching(0) · sub-cluster(2) · within a block(3) · between blocks(6) · between wide regions(8). gap-6 goes by the SIZE of the block — three small components stacked vertically still use gap-3, NOT gap-6.",
    },
}

/** NAMED exceptions — use only in their own context, don't let them spread to the general scale. */
export const NamedExceptions: Story = {
    render: () => (
        <ScaleTable
            ariaLabel="Named spacing exceptions"
            rows={[
                { token: "gap-10", px: 40, note: "APP — PageHeader → content. A large breathing space after the header." },
                { token: "gap-16", px: 64, note: "LANDING — SectionHeading → content (landing-style breathing room)." },
                { token: "gap-3 (divider)", px: 12, note: "Above/below a divider in a card — the divider already carries the separation." },
            ]}
        />
    ),
    parameters: {
        usage: "NAMED exceptions: `gap-10` (app, PageHeader→content) · `gap-16` (landing, SectionHeading→content) · `gap-3` around a divider in a card. Each is used only in its own context, not spread to the general scale.",
    },
}

/** Padding — a block OWNS its own padding (following the 0/2/3/6/8 scale). */
export const Padding: Story = {
    render: () => {
        const rows: Array<PadItem> = [
            { token: "p-3", note: "Card / LabeledCard — the default card padding (the block owns it). List-with-divider = a flush card + each row p-3." },
            { token: "p-6", note: "Panel / modal body — a large area breathing evenly on all four sides." },
            { token: "p-3", note: "Small cell — thumbnail, icon-tile, compact row." },
        ]
        return (
            <Table variant="primary" className="w-full">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Padding scale">
                        <Table.Header>
                            <Table.Column isRowHeader>Token</Table.Column>
                            <Table.Column>When to use</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.token}>
                                    <Table.Cell>
                                        <code className="text-xs font-semibold text-foreground">{row.token}</code>
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
    },
    parameters: {
        usage: "Padding also follows the `0/2/3/6/8` scale. Default card `p-3` (the block owns its padding — the feature doesn't set it; list-with-divider = a flush card + each row p-3). Panel/modal body `p-6`. Don't scatter gap-6 everywhere (too sparse) or force everything to gap-3 (losing region boundaries).",
    },
}
