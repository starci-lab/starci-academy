import type { Meta, StoryObj } from "@storybook/nextjs"
import { Table } from "@sb-components/composites/data/Table/Table"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Table` — a table frame. Owns the column configuration (`columns`: alignment + width),
 * building rows from `items`, and the three frame states of a list: empty (`emptyContent`),
 * loading (`isSkeleton`), and pressable rows (`onRowPress`). Does not format content — every
 * cell is a `ReactNode` the consumer passes in.
 */
const meta: Meta<typeof Table> = {
    title: "Composites/Data/Table/Table",
    component: Table,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Table>

/** Shared column configuration — this is DATA, not a JSX child (§13b). */
const COLUMNS = [
    { key: "name", header: "Student" },
    { key: "status", header: "Status" },
    { key: "lessons", header: "Lessons completed" },
] as const

/** A cell = an already-formatted node (a string, or an atom like `Chip`) — the frame doesn't generate one itself. */
const ITEMS = [
    { key: "an", name: "Alex Nguyen", status: <Chip tone="success" text="In progress" />, lessons: "12/40" },
    { key: "binh", name: "Jordan Tran", status: <Chip tone="warning" text="Paused" />, lessons: "31/40" },
    { key: "chi", name: "Chi Le", status: <Chip text="Not started" />, lessons: "0/40" },
]

/**
 * ANATOMY IS PER-LEAF, one shared whitelist. Structure is always derived from
 * DOM; this table is only WHY + tier + storyId per name.
 *
 * The real DOM tree is the HeroUI `Table` compound AS-IS: `Table` (root) →
 * `Table.ScrollContainer` → `Table.Content` → `Table.Header` (holds N `Table.Column`)
 * + `Table.Body` (holds N `Table.Row`). Every one of these nodes is HeroUI's OWN
 * component, not ours ⇒ tier `heroui`, with NO `storyId` (no story of our own to
 * point to) — the panel still accepts it because `tier: "heroui"` alone is enough
 * to qualify for the tree.
 *
 * The cell (`Table.Cell`) is not badged on its own because it is only a slot the
 * consumer drops a node into (badge the DIRECT child) — the same reason
 * `emptyContent` below (`renderEmptyState`) is also not badged: both are caller
 * slots.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Table": { tier: "heroui", role: "HeroUI's own table root — canvas, variant skin." },
    "Table.ScrollContainer": { tier: "heroui", role: "Horizontal scroll wrapper around the table." },
    "Table.Content": { tier: "heroui", role: "The real `<table>` (`ariaLabel` lives here)." },
    "Table.Header": { tier: "heroui", role: "The header row, built entirely from `columns` — stays exactly as is regardless of `items`, since columns are configuration." },
    "Table.Column": { tier: "heroui", role: "One column: its header text, alignment, and width." },
    "Table.Body": { tier: "heroui", role: "The table body — real rows, the skeleton mirror, or `emptyContent`, depending on state." },
    "Table.Row": { tier: "heroui", role: "One row; each cell reads `item[column.key]`, or is a skeleton bar while loading." },
    "Typography": {
        tier: "atom",
        role: "isSkeleton bar filling each cell so the row's shape doesn't jump when data lands.",
        storyId: "atoms-text-typography-typography--overview",
    },
}

/** Default — `columns` + `items` are DATA; the frame builds its own header/rows/cells. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Table"
                tier="composite"
                leaf="Default"
                annotate={ANNOTATE}
                reason="A table is a repeating list, so §13b requires items as data and forbids children: a caller who cannot hand-place a Column or a Row can never let the cell count drift from the column count. The frame only lays cells out; content such as the Chip below is a node the caller already formatted, so the frame itself knows nothing about the domain."
                states={[
                    {
                        name: "items = 3 students, columns = 3",
                        why: "The frame builds a three-column header from columns and three rows from items, dropping each caller-formatted cell, including a Chip status badge, straight into place. Both columns and items arrive as data rather than JSX children, so their counts can never come apart.",
                        code: `<Table
    ariaLabel="Student list"
    columns={[
        { key: "name", header: "Student" },
        { key: "status", header: "Status" },
        { key: "lessons", header: "Lessons completed" },
    ]}
    items={[
        { key: "an", name: "Alex Nguyen", status: <Chip tone="success" text="In progress" />, lessons: "12/40" },
        …
    ]}
/>`,
                        render: <Table ariaLabel="Student list" columns={COLUMNS} items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Alignment — `align`/`width` are COLUMN configuration: the frame applies them to BOTH the header and every cell. */
export const Alignment: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Table"
                tier="composite"
                leaf="Alignment"
                annotate={ANNOTATE}
                reason="align and width are declared once on the column, in columns, and the frame applies them to the header and to every cell beneath it, so no call site ever aligns one cell by hand while its neighbours drift."
                states={[
                    {
                        name: "columns[2].align = \"end\", columns[1].width and columns[2].width set",
                        why: "The lessons column pins its numbers to the right edge while status gets a fixed width, and both rules apply to the header and every row cell alike. Right-aligning a number column makes the digits easier to compare down the list than a left-aligned one would.",
                        code: `columns={[
    { key: "name", header: "Student" },
    { key: "status", header: "Status", width: "160px" },
    { key: "lessons", header: "Lessons completed", align: "end", width: "120px" },
]}`,
                        render: (
                            <Table

                                ariaLabel="Student list with right-aligned column"
                                columns={[
                                    { key: "name", header: "Student" },
                                    { key: "status", header: "Status", width: "160px" },
                                    { key: "lessons", header: "Lessons completed", align: "end", width: "120px" },
                                ]}
                                items={ITEMS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Empty state renderer — a COMPONENT reference (COMPOSITE-8), not a built node: the frame calls it and can forward `isSkeleton`. */
const EmptyStudents = () => <Typography size="sm" color="muted" text="No students yet." />

/** Empty — `items` is empty: the header stays, the body renders `emptyContent`. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Table"
                tier="composite"
                leaf="Empty"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "items = []",
                        why: "The header stays because columns is configuration, unrelated to how many rows exist, while the body drops every Row and renders emptyContent spread across the full width instead. An empty state has to read as intentional, not as a blank frame the reader has to guess about.",
                        code: `const EmptyStudents = () => <Typography size="sm" color="muted" text="No students yet." />

<Table
    ariaLabel="Student list"
    columns={COLUMNS}
    items={[]}
    emptyContent={EmptyStudents}
/>`,
                        render: (
                            <Table

                                ariaLabel="Student list"
                                columns={COLUMNS}
                                items={[]}
                                emptyContent={EmptyStudents}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading — `isSkeleton` mirrors N rows INSIDE the real frame (§8), header stays put. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Table"
                tier="composite"
                leaf="Loading"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The real header stays put while the body mirrors items.length rows of shimmer bars, three here because items still holds three entries even though isSkeleton is on. Mirroring the real row count keeps the table's footprint from jumping the moment the real data lands.",
                        code: `<Table
    isSkeleton
    ariaLabel="Loading student list"
    columns={COLUMNS}
    items={ITEMS}
/>`,
                        render: (
                            <Table

                                isSkeleton
                                ariaLabel="Loading student list"
                                columns={COLUMNS}
                                items={ITEMS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Pressable — with `onRowPress` set, every row becomes a press target (hover + keyboard). */
export const Pressable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Table"
                tier="composite"
                leaf="Pressable"
                annotate={ANNOTATE}
                reason="A row is not a card (§7b): it never lifts or scales on press, its feedback is a hover background plus a focus ring, and the keyboard behaviour comes from react-aria's row action rather than a hand-rolled handler."
                states={[
                    {
                        name: "onRowPress set",
                        why: "Every row becomes a press target that hands item.key to onRowPress when clicked or activated from the keyboard, on the exact same header and cell composition as Default. Making the whole row pressable, not just one cell, is what lets a learner open a student's detail from anywhere in the row.",
                        code: `<Table
    ariaLabel="Student list"
    columns={COLUMNS}
    items={ITEMS}
    onRowPress={(key) => console.log(key)}
/>`,
                        render: (
                            <Table

                                ariaLabel="Clickable student list"
                                columns={COLUMNS}
                                items={ITEMS}
                                onRowPress={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
