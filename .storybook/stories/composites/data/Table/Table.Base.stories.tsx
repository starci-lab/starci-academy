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
        role: "hàng tiêu đề — khung dựng từ `columns`",
        children: [
            { name: "Column", tier: "composite", role: "một cột: `header` + canh lề + bề rộng" },
        ],
    },
    {
        name: "Body",
        tier: "composite",
        role: "thân bảng — khung dựng từ `items`",
        children: [
            { name: "Row", tier: "composite", role: "một hàng; mỗi ô đọc `item[column.key]`" },
        ],
    },
]

/** Leaf RỖNG: `Body` không có `Row` nào, thay bằng node `Empty`. */
const EMPTY_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "hàng tiêu đề vẫn giữ nguyên (cột là cấu hình, không phụ thuộc dữ liệu)",
        children: [{ name: "Column", tier: "composite", role: "một cột" }],
    },
    {
        name: "Body",
        tier: "composite",
        role: "thân bảng rỗng",
        children: [{ name: "Empty", tier: "composite", role: "`emptyContent` trải hết bề ngang thân bảng" }],
    },
]

/** Leaf ĐANG TẢI: khung + header THẬT giữ nguyên, mỗi ô thành một thanh skeleton. */
const SKELETON_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "header THẬT (không skeleton hoá) — cột đã biết trước khi dữ liệu về",
        children: [{ name: "Column", tier: "composite", role: "một cột" }],
    },
    {
        name: "Body",
        tier: "composite",
        role: "thân bảng mirror",
        children: [{ name: "Row", tier: "composite", role: "hàng mirror — mỗi ô là một thanh `Skeleton.Typography`" }],
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
                reason="Bảng là DANH SÁCH LẶP ⇒ §13b bắt buộc `items`, cấm children: consumer không lắp `<Column>`/`<Row>` bằng tay nên không thể lệch số ô với số cột. Khung chỉ bố trí — nội dung ô là node đã format (ở đây có `Chip.Base`), khung không biết gì về domain."
                code={`<Table.Base
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
/>`}
            >
                <Table.Base showAnatomy ariaLabel="Danh sách học viên" columns={COLUMNS} items={ITEMS} />
            </BlockAnatomy>
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
                note="`align: end` dồn cột số về mép phải (đọc số so cột dễ hơn), `width` khoá bề ngang. Khai báo MỘT LẦN ở `columns` — không call-site nào tự canh lề từng ô (§4)."
                code={`columns={[
  { key: "name", header: "Học viên" },
  { key: "status", header: "Trạng thái", width: "160px" },
  { key: "lessons", header: "Bài đã học", align: "end", width: "120px" },
]}`}
            >
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
            </BlockAnatomy>
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
                note="Rỗng phải ĐỌC RA CHỦ Ý, không phải một khung trắng: khung giữ header (cột là cấu hình, không phụ thuộc dữ liệu) và trải `emptyContent` hết bề ngang thân bảng."
                code={`<Table.Base
  ariaLabel="Danh sách học viên"
  columns={COLUMNS}
  items={[]}
  emptyContent={<Typography.Base size="sm" color="muted" text="Chưa có học viên nào." />}
/>`}
            >
                <Table.Base
                    showAnatomy
                    ariaLabel="Danh sách học viên"
                    columns={COLUMNS}
                    items={[]}
                    emptyContent={<Typography.Base size="sm" color="muted" text="Chưa có học viên nào." />}
                />
            </BlockAnatomy>
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
                note="Số hàng mirror = `items.length` (rỗng → 3), nên footprint không nhảy khi dữ liệu về. Consumer chỉ bật cờ — mirror KHÔNG phụ thuộc nội dung ô thật."
                code={`<Table.Base
  isSkeleton
  ariaLabel="Đang tải danh sách học viên"
  columns={COLUMNS}
  items={ITEMS}
/>`}
            >
                <Table.Base
                    showAnatomy
                    isSkeleton
                    ariaLabel="Đang tải danh sách học viên"
                    columns={COLUMNS}
                    items={ITEMS}
                />
            </BlockAnatomy>
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
                note="Hàng nhận `item.key` khi bấm. ROW ≠ CARD (§7b): hàng KHÔNG lún/scale — phản hồi là tô nền hover + focus ring, a11y do react-aria row action lo (Enter/Space, con trỏ bàn phím)."
                code={`<Table.Base
  ariaLabel="Danh sách học viên"
  columns={COLUMNS}
  items={ITEMS}
  onRowPress={(key) => console.log(key)}
/>`}
            >
                <Table.Base
                    showAnatomy
                    ariaLabel="Danh sách học viên bấm được"
                    columns={COLUMNS}
                    items={ITEMS}
                    onRowPress={() => {}}
                />
            </BlockAnatomy>
        </div>
    ),
}
