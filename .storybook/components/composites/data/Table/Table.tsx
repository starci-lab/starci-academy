import type { ReactNode } from "react"
import { Table as HeroTable, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE TIER (§13) — `Table.*`: KHUNG bảng dữ liệu, bọc HeroUI `Table`.
 *
 * | Member | Hình thái | Kênh nội dung |
 * |---|---|---|
 * | `.Base` | 1 bảng cột–hàng | **`columns` + `items` DỮ LIỆU — CẤM children** |
 *
 * KHUNG API LAW (§13b):
 *   • Bảng là DANH SÁCH LẶP (N hàng cùng kiểu) ⇒ **BẮT BUỘC `items`**, `children`
 *     bị CẤM. Cấu hình cột đi bằng `columns` (không phải JSX `<Column>` con).
 *   • Khung KHÔNG mang nội dung domain: nó KHÔNG format tiền/ngày/trạng thái —
 *     consumer truyền `ReactNode` đã format vào ô (`items[i][column.key]`).
 *   • Khung KHÔNG đẻ chức năng: không sort/filter/paginate/select nội tại. Ô
 *     tương tác (nút, chip) là node consumer truyền vào.
 *
 * COMPOSE (§13c): dùng THẲNG HeroUI `Table` compound (alias `HeroTable`) —
 * `Table.ScrollContainer` → `Table.Content` → `Header/Column` + `Body/Row/Cell`;
 * skeleton mirror dùng `Skeleton.Typography` (scaffold structural, §12c).
 *
 * ⚠️ ALIGNMENT qua SPAN BỌC, không qua class trên `<th>/<td>`: CSS HeroUI
 * (`.table__column { text-align: left }`) là un-layered nên THẮNG utility Tailwind
 * v4 (nằm trong `@layer utilities`). Khai báo `text-align` trên chính con (span)
 * luôn thắng giá trị KẾ THỪA → không cần `!important`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Cạnh canh nội dung trong một cột (đầu dòng đọc, hoặc mép phải cho số/hành động). */
export type TableAlign = "start" | "end"

/** Khai báo MỘT cột — cấu hình dữ liệu, không phải JSX con. */
export interface TableColumnSpec {
    /** Khoá cột: vừa là React key, vừa là khoá đọc ô trong mỗi `item`. */
    key: string
    /** Tiêu đề cột (node đã format — khung không tự sinh chữ). */
    header: ReactNode
    /** Canh nội dung cột (áp cho CẢ header và ô). Default `start`. */
    align?: TableAlign
    /** Bề rộng CSS cố định cho cột (`"96px"`, `"20%"`). Bỏ trống = tự co theo nội dung. */
    width?: string
}

/**
 * MỘT hàng: `key` (React key + id hàng) + một node cho MỖI `column.key`.
 * Node đã format sẵn — khung không biết gì về domain.
 */
export type TableRowItem = Record<string, ReactNode> & { key: string }

/** Props for {@link Table}. */
export interface TableBaseProps {
    /** Cấu hình cột, theo thứ tự đọc. Cột đầu = row-header (a11y). */
    columns: ReadonlyArray<TableColumnSpec>
    /** Các hàng. BẮT BUỘC — danh sách lặp = dữ liệu, không bao giờ children (§13b). */
    items: ReadonlyArray<TableRowItem>
    /**
     * Tên gọi của bảng cho screen-reader. BẮT BUỘC: react-aria `Table` không có
     * nhãn ngầm — thiếu thì cả bảng đọc lên vô danh (tsc/eslint KHÔNG bắt).
     */
    ariaLabel: string
    /** Node hiển thị TRONG thân bảng khi `items` rỗng — để "rỗng" đọc ra chủ ý. */
    emptyContent?: ReactNode
    /**
     * `true` → giữ NGUYÊN khung + header thật, thay mỗi ô bằng thanh skeleton
     * (§8 giữ container thật). Số hàng mirror = `items.length`, rỗng thì 3.
     */
    isSkeleton?: boolean
    /** Có handler → mỗi hàng thành press target (react-aria row action), nhận `item.key`. */
    onRowPress?: (key: string) => void
    /** Extra classes trên root bảng. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
}

/** Số hàng mirror mặc định khi chưa có dữ liệu nào để đếm. */
const SKELETON_ROWS_FALLBACK = 3

/** Canh nội dung — đặt trên SPAN con (thắng kế thừa), xem ghi chú đầu file. */
const ALIGN_CLS: Record<TableAlign, string> = {
    start: "text-start",
    end: "text-end",
}

/** Bọc nội dung một ô/header để khung SỞ HỮU canh lề (§4), không rơi vào call-site. */
/** Props for the local {@link CellBox} — one table cell's alignment wrapper. */
interface CellBoxProps {
    /** Horizontal alignment of the cell content. */
    align?: TableAlign
    /** Cell content. */
    children: ReactNode
}

const CellBox = ({ align, children }: CellBoxProps) => (
    <span className={cn("block", ALIGN_CLS[align ?? "start"])}>{children}</span>
)

/**
 * Khung bảng: một cấu hình `columns` + một mảng `items`, khung tự dựng
 * header/hàng/ô. Rỗng → `emptyContent`; đang tải → mirror skeleton cùng khung;
 * có `onRowPress` → hàng thành press target (a11y do react-aria lo).
 *
 * @param props - {@link TableBaseProps}
 */
const TableBase = ({
    columns,
    items,
    ariaLabel,
    emptyContent,
    isSkeleton = false,
    onRowPress,
    className,
    showAnatomy = false,
}: TableBaseProps) => {
    // Header là CẤU HÌNH (biết trước cả khi có dữ liệu) → skeleton giữ header THẬT,
    // chỉ ô mới thành thanh; khung/độ rộng cột không nhảy khi dữ liệu về (§8).
    const header = (
        <HeroTable.Header data-anat-part={showAnatomy ? "Table.Header" : undefined}>
            {columns.map((column, index) => (
                <HeroTable.Column
                    key={column.key}
                    id={column.key}
                    isRowHeader={index === 0}
                    style={column.width != null ? { width: column.width } : undefined}
                    data-anat-part={showAnatomy ? "Table.Column" : undefined}
                >
                    <CellBox align={column.align}>{column.header}</CellBox>
                </HeroTable.Column>
            ))}
        </HeroTable.Header>
    )

    const body = isSkeleton ? (
        <HeroTable.Body data-anat-part={showAnatomy ? "Table.Body" : undefined}>
            {Array.from({ length: items.length || SKELETON_ROWS_FALLBACK }).map((_, rowIndex) => (
                <HeroTable.Row key={rowIndex} id={`skeleton-${rowIndex}`} data-anat-part={showAnatomy ? "Table.Row" : undefined}>
                    {columns.map((column) => (
                        <HeroTable.Cell key={column.key}>
                            {/* Thanh cao 14px < line-height 20px của ô thật → bọc trong hộp
                                `h-5` để hàng mirror CAO ĐÚNG bằng hàng thật (§8, không nhảy
                                layout). Căn bằng chiều cao + `items-center`, KHÔNG bằng margin (§10a).
                                Tag NGOÀI atom (atom không nhận rest props) — cùng lý do như CellBox. */}
                            <span className="flex h-5 items-center" data-anat-part={showAnatomy ? "Typography" : undefined}>
                                <Typography size="sm" isSkeleton classNames={["w-2/3"]} />
                            </span>
                        </HeroTable.Cell>
                    ))}
                </HeroTable.Row>
            ))}
        </HeroTable.Body>
    ) : (
        <HeroTable.Body
            data-anat-part={showAnatomy ? "Table.Body" : undefined}
            renderEmptyState={
                emptyContent != null
                    ? () => (
                        // No `data-anat-part` here: `emptyContent` is an arbitrary node the CALLER
                        // supplies, so there is no ONE fixed component for a panel link to point to
                        // (§11a.1 LOẠI 3 — caller slot, stop badging).
                        <div className="p-8 text-center">
                            {emptyContent}
                        </div>
                    )
                    : undefined
            }
        >
            {items.map((item) => (
                <HeroTable.Row
                    key={item.key}
                    id={item.key}
                    onAction={onRowPress != null ? () => onRowPress(item.key) : undefined}
                    data-anat-part={showAnatomy ? "Table.Row" : undefined}
                >
                    {columns.map((column) => (
                        <HeroTable.Cell key={column.key}>
                            <CellBox align={column.align}>{item[column.key]}</CellBox>
                        </HeroTable.Cell>
                    ))}
                </HeroTable.Row>
            ))}
        </HeroTable.Body>
    )

    return (
        <HeroTable variant="primary" className={className} data-anat-part={showAnatomy ? "Table" : undefined}>
            <HeroTable.ScrollContainer data-anat-part={showAnatomy ? "Table.ScrollContainer" : undefined}>
                <HeroTable.Content aria-label={ariaLabel} data-anat-part={showAnatomy ? "Table.Content" : undefined}>
                    {header}
                    {body}
                </HeroTable.Content>
            </HeroTable.ScrollContainer>
        </HeroTable>
    )
}

/**
 * `Table.*` — khung bảng dữ liệu (tầng COMPOSITE §13). `Base` là hình thái duy nhất;
 * biến thể (canh lề, bề rộng, rỗng, tải, hàng bấm được) là PROP của nó (§6b).
 */
export { TableBase as Table }
