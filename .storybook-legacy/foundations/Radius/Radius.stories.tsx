import type { Meta, StoryObj } from "@storybook/nextjs"
import { Table } from "@heroui/react"

import { Swatch } from "./components"
import type { RadiusItem, ConcentricItem } from "./components"

/**
 * RADIUS scale — source: canon `foundations/radius.md` + `globals.css` (`--radius: 0.5rem` = 8px base;
 * `@heroui/styles` derives `xl=1.5× · 2xl=2× · 3xl=3× · 4xl=4×`; `--field-radius: 0.75rem` = `rounded-field`).
 * Pick the step by the ROLE/NESTING DEPTH of the element — the component ↔ radius mapping is grounded in real source.
 */
const meta: Meta = {
    title: "Legacy/Foundations/Radius",
}
export default meta
type Story = StoryObj

/** Corner-radius scale — derived from `--radius: 8px`. Each token → the specific component that uses it. */
export const Scale: Story = {
    render: () => {
        const rows: Array<RadiusItem> = [
            { token: "rounded-full", px: "∞", swatchCls: "rounded-full", use: "Chip · badge · avatar · switch · pill button / icon button (fully round)." },
            { token: "rounded-3xl", px: "24px (3×)", swatchCls: "rounded-3xl", use: "Top-level CARD · panel · modal · outermost surface-list." },
            { token: "rounded-2xl", px: "16px (2×)", swatchCls: "rounded-2xl", use: "Media · a block NESTED inside a card (concentric — one step in)." },
            { token: "rounded-field", px: "12px (=xl)", swatchCls: "rounded-field", use: "INPUT · select · textarea · search · BUTTON (its own --field-radius token)." },
            { token: "rounded-lg", px: "8px", swatchCls: "rounded-lg", use: "Small cell · tag · compact cell (Tailwind default, NOT a multiple of --radius)." },
        ]
        return (
            <Table variant="primary" className="w-full">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Radius scale">
                        <Table.Header>
                            <Table.Column isRowHeader>Token</Table.Column>
                            <Table.Column>px</Table.Column>
                            <Table.Column>Example</Table.Column>
                            <Table.Column>Used for</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.token}>
                                    <Table.Cell>
                                        <code className="text-xs font-semibold text-foreground">{row.token}</code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-xs tabular-nums text-muted">{row.px}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Swatch cls={row.swatchCls} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-muted">{row.use}</span>
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
        usage: "One BASE token `--radius: 0.5rem` (8px) is the SINGLE SOURCE; heroui derives `xl=1.5× · 2xl=2× · 3xl=3× · 4xl=4×`. Input/select/button use their own `--field-radius: 0.75rem` token (the `rounded-field` utility, = xl). DON'T hand-set a one-off radius for a new block — pick the step by role (card 3xl · media/nested-block 2xl · field/button `rounded-field` · chip/avatar/switch full).",
    },
}

/** Concentric — FORMULA: `inner radius = outer radius − padding` (in the table, padding is uniformly `p-2` = 8px). */
export const Concentric: Story = {
    render: () => {
        const rows: Array<ConcentricItem> = [
            { layer: "Outer card", token: "rounded-3xl", px: "24px", calc: "base" },
            { layer: "Nested block (p-2)", token: "rounded-2xl", px: "16px", calc: "24 − 8" },
            { layer: "Core (p-2)", token: "rounded-lg", px: "8px", calc: "16 − 8" },
        ]
        return (
            <Table variant="primary" className="w-full">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Concentric radius">
                        <Table.Header>
                            <Table.Column isRowHeader>Layer</Table.Column>
                            <Table.Column>Token</Table.Column>
                            <Table.Column>px</Table.Column>
                            <Table.Column>How it's computed (outer − padding)</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((row) => (
                                <Table.Row key={row.layer}>
                                    <Table.Cell>
                                        <span className="text-sm text-foreground">{row.layer}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <code className="text-xs font-semibold text-foreground">{row.token}</code>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-xs tabular-nums text-muted">{row.px}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="text-sm text-muted">{row.calc}</span>
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
        usage: "TRUE concentric: `inner radius = outer radius − padding` (Cloud Four / BetterCorners). Larger padding → a MUCH smaller inner radius (card `rounded-3xl` 24px + `p-3` 12px → inner = 12px `rounded-xl`, NOT 3xl 24px); if it goes ≤0 → SQUARE corners. The demo uses `p-2` (8px), so the chain is 24→16→8. Chip/avatar/switch are always `rounded-full`. DON'T add `rounded-*` via className to a HeroUI component that already bakes its radius (`.card`/`.modal`…) — the utility loses to the baked CSS, silently useless.",
    },
}
