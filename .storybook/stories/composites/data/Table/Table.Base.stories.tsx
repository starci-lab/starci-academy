import type { Meta, StoryObj } from "@storybook/nextjs"
import { Table } from "@sb-components/composites/data/Table/Table"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (§12f/§13) — `Table.Base` là KHUNG bảng: nó SỞ HỮU cấu hình cột
 * (`columns`: canh lề + bề rộng), việc dựng hàng từ `items`, và ba trạng thái KHUNG
 * của một danh sách: RỖNG (`emptyContent`) · ĐANG TẢI (`isSkeleton`) · HÀNG BẤM ĐƯỢC
 * (`onRowPress`). Đó đúng là bộ state phải render đủ ở đây (§11g).
 *
 * KHÔNG có state nào ở đây thuộc về nội dung: khung không format tiền/ngày/trạng thái
 * — mọi ô là `ReactNode` consumer truyền vào (dưới đây là `Chip.Base`, một atom).
 * State của chính `Chip` sống ở story `Chip.Base`, không lặp lại ở đây.
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a). Chữ hiện ra panel
 * (`why`/`reason`/`role`) viết TIẾNG ANH theo luật B; JSDoc/comment giữ nguyên tiếng Việt.
 */
const meta: Meta<typeof Table.Base> = {
    title: "Composites/Data/Table/Table.Base",
    component: Table.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Table.Base>

/** Cấu hình cột dùng chung — đây là DỮ LIỆU, không phải JSX con (§13b). */
const COLUMNS = [
    { key: "name", header: "Học viên" },
    { key: "status", header: "Trạng thái" },
    { key: "lessons", header: "Bài đã học" },
] as const

/** Ô = node ĐÃ format (chuỗi, hoặc atom như `Chip.Base`) — khung không tự sinh. */
const ITEMS = [
    { key: "an", name: "Nguyễn Văn An", status: <Chip.Base tone="success" text="Đang học" />, lessons: "12/40" },
    { key: "binh", name: "Trần Thanh Bình", status: <Chip.Base tone="warning" text="Tạm dừng" />, lessons: "31/40" },
    { key: "chi", name: "Lê Ngọc Chi", status: <Chip.Base text="Chưa bắt đầu" />, lessons: "0/40" },
]

/**
 * ANATOMY IS PER-LEAF. Cây DOM thật của khung: `Header` chứa N `Column` (dựng từ
 * `columns`), `Body` chứa N `Row` (dựng từ `items`). Ô nằm trong `Row` — chi tiết ô
 * không badge riêng vì nó chỉ là chỗ đổ node của consumer (§11a: badge con TRỰC TIẾP).
 */
const TABLE_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "The header row, built entirely from columns.",
        children: [
            { name: "Column", tier: "composite", role: "One column: its header text, alignment, and width." },
        ],
    },
    {
        name: "Body",
        tier: "composite",
        role: "The table body, built entirely from items.",
        children: [
            { name: "Row", tier: "composite", role: "One row; each cell reads item[column.key]." },
        ],
    },
]

/** Leaf RỖNG: `Body` không có `Row` nào, thay bằng node `Empty`. */
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "The header row stays exactly as is, since columns are configuration and never depend on the data.",
        children: [{ name: "Column", tier: "composite", role: "One column." }],
    },
    {
        name: "Body",
        tier: "composite",
        role: "An empty table body.",
        children: [{ name: "Empty", tier: "composite", role: "emptyContent spans the full width of the body." }],
    },
]

/** Leaf ĐANG TẢI: khung + header THẬT giữ nguyên, mỗi ô thành một thanh skeleton. */
const SKELETON_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "The real header, not skeletoned, since the columns are already known before the data arrives.",
        children: [{ name: "Column", tier: "composite", role: "One column." }],
    },
    {
        name: "Body",
        tier: "composite",
        role: "A mirror table body.",
        children: [
            {
                name: "Row",
                tier: "composite",
                role: "A mirror row; each cell is a Skeleton.Typography bar.",
                children: [
                    {
                        name: "Typography",
                        tier: "atom",
                        role: "Typography.Base isSkeleton bar filling each cell so the row's shape doesn't jump when data lands.",
                        storyId: "atoms-text-typography-typography-base--loading",
                    },
                ],
            },
        ],
    },
]

/** Default — `columns` + `items` là DỮ LIỆU; khung tự dựng header/hàng/ô. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Table.Base"
                tier="composite"
                leaf="Default"
                parts={TABLE_PARTS}
                reason="A table is a repeating list, so §13b requires items as data and forbids children: a caller who cannot hand-place a Column or a Row can never let the cell count drift from the column count. The frame only lays cells out; content such as the Chip.Base below is a node the caller already formatted, so the frame itself knows nothing about the domain."
                states={[
                    {
                        name: "items = 3 students, columns = 3",
                        why: "The frame builds a three-column header from columns and three rows from items, dropping each caller-formatted cell, including a Chip.Base status badge, straight into place. Both columns and items arrive as data rather than JSX children, so their counts can never come apart.",
                        code: `<Table.Base
    ariaLabel="Danh sách học viên"
    columns={[
        { key: "name", header: "Học viên" },
        { key: "status", header: "Trạng thái" },
        { key: "lessons", header: "Bài đã học" },
    ]}
    items={[
        { key: "an", name: "Nguyễn Văn An", status: <Chip.Base tone="success" text="Đang học" />, lessons: "12/40" },
        …
    ]}
/>`,
                        render: <Table.Base showAnatomy ariaLabel="Danh sách học viên" columns={COLUMNS} items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Alignment — `align`/`width` là cấu hình CỘT: khung áp cho CẢ header lẫn mọi ô. */
export const Alignment: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Table.Base"
                tier="composite"
                leaf="Alignment"
                parts={TABLE_PARTS}
                reason="align and width are declared once on the column, in columns, and the frame applies them to the header and to every cell beneath it, so no call site ever aligns one cell by hand while its neighbours drift."
                states={[
                    {
                        name: "columns[2].align = \"end\", columns[1].width and columns[2].width set",
                        why: "The lessons column pins its numbers to the right edge while status gets a fixed width, and both rules apply to the header and every row cell alike. Right-aligning a number column makes the digits easier to compare down the list than a left-aligned one would.",
                        code: `columns={[
    { key: "name", header: "Học viên" },
    { key: "status", header: "Trạng thái", width: "160px" },
    { key: "lessons", header: "Bài đã học", align: "end", width: "120px" },
]}`,
                        render: (
                            <Table.Base
                                showAnatomy
                                ariaLabel="Danh sách học viên theo cột canh phải"
                                columns={[
                                    { key: "name", header: "Học viên" },
                                    { key: "status", header: "Trạng thái", width: "160px" },
                                    { key: "lessons", header: "Bài đã học", align: "end", width: "120px" },
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

/** Empty — `items` rỗng: header ở lại, thân bảng render `emptyContent`. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Table.Base"
                tier="composite"
                leaf="Empty"
                parts={EMPTY_PARTS}
                states={[
                    {
                        name: "items = []",
                        why: "The header stays because columns is configuration, unrelated to how many rows exist, while the body drops every Row and renders emptyContent spread across the full width instead. An empty state has to read as intentional, not as a blank frame the reader has to guess about.",
                        code: `<Table.Base
    ariaLabel="Danh sách học viên"
    columns={COLUMNS}
    items={[]}
    emptyContent={<Typography.Base size="sm" color="muted" text="Chưa có học viên nào." />}
/>`,
                        render: (
                            <Table.Base
                                showAnatomy
                                ariaLabel="Danh sách học viên"
                                columns={COLUMNS}
                                items={[]}
                                emptyContent={<Typography.Base size="sm" color="muted" text="Chưa có học viên nào." />}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading — `isSkeleton` mirror N hàng TRONG khung thật (§8), header giữ nguyên. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Table.Base"
                tier="composite"
                leaf="Loading"
                parts={SKELETON_PARTS}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The real header stays put while the body mirrors items.length rows of shimmer bars, three here because items still holds three entries even though isSkeleton is on. Mirroring the real row count keeps the table's footprint from jumping the moment the real data lands.",
                        code: `<Table.Base
    isSkeleton
    ariaLabel="Đang tải danh sách học viên"
    columns={COLUMNS}
    items={ITEMS}
/>`,
                        render: (
                            <Table.Base
                                showAnatomy
                                isSkeleton
                                ariaLabel="Đang tải danh sách học viên"
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

/** Pressable — có `onRowPress` thì mỗi hàng thành press target (hover + bàn phím). */
export const Pressable: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Table.Base"
                tier="composite"
                leaf="Pressable"
                parts={TABLE_PARTS}
                reason="A row is not a card (§7b): it never lifts or scales on press, its feedback is a hover background plus a focus ring, and the keyboard behaviour comes from react-aria's row action rather than a hand-rolled handler."
                states={[
                    {
                        name: "onRowPress set",
                        why: "Every row becomes a press target that hands item.key to onRowPress when clicked or activated from the keyboard, on the exact same header and cell composition as Default. Making the whole row pressable, not just one cell, is what lets a learner open a student's detail from anywhere in the row.",
                        code: `<Table.Base
    ariaLabel="Danh sách học viên"
    columns={COLUMNS}
    items={ITEMS}
    onRowPress={(key) => console.log(key)}
/>`,
                        render: (
                            <Table.Base
                                showAnatomy
                                ariaLabel="Danh sách học viên bấm được"
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
