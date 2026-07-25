import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { GAP_CLASS, type SpaceScale } from "@sb-components/layouts/_spacing"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT TIER (§13) — `KeyValue.*`: KHUNG cặp NHÃN–GIÁ TRỊ.
 *
 * | Member | Hình thái | Kênh nội dung |
 * |---|---|---|
 * | `.Row`  | MỘT cặp nhãn–giá trị | prop dữ liệu (`label`/`value`/`hint`) |
 * | `.List` | N cặp xếp dọc | **`items` DỮ LIỆU — CẤM children** (§13b) |
 *
 * Dùng cho bảng thông số, tóm tắt đơn hàng, hoá đơn — chỗ nào "một cái tên, một
 * con số" lặp lại thành khối.
 *
 * KHUNG API LAW:
 *   • Khung KHÔNG mang nội dung domain và **KHÔNG tự format** tiền/ngày/đơn vị —
 *     consumer truyền node ĐÃ format vào `value` (`"1.200.000 ₫"`, `<Chip.Base/>`…).
 *   • Khung KHÔNG đẻ chức năng (không tự tính tổng): `emphasis` chỉ là NHẤN thị
 *     giác cho hàng tổng, con số vẫn do consumer đưa vào.
 *   • `.List` là danh sách lặp ⇒ BẮT BUỘC `items`, cấm children.
 *
 * COMPOSE (§13c): chữ đi HẾT qua atom `Typography.*` (§9 — không rải `text-*`/
 * `font-*`), đường kẻ qua atom `Divider.Base`. Khung chỉ lo BỐ CỤC + thang spacing.
 *
 * §10 — thang gap bị ÉP BẰNG TYPE ({@link KeyValueGap}): chỉ `0·1·2·3·6·8`, khung
 * không nhận số tuỳ ý nên không thể trôi khỏi thang.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Thang §10c dùng CHUNG toàn tầng khung — import từ SSOT `blocks/_spacing.ts`.
 * KHÔNG khai lại tại chỗ (mỗi bản sao là một nguồn lệch tiềm tàng).
 */
export type KeyValueGap = SpaceScale
const GAP_CLS = GAP_CLASS

// ─────────────────────────────────────────────────────────────────────────────
// .Row — MỘT cặp nhãn–giá trị
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link KeyValue.Row}. */
export interface KeyValueRowProps {
    /** Nhãn (bên trái) — §9a chữ PHỤ ⇒ muted; `emphasis` kéo lên foreground medium. */
    label: ReactNode
    /** Giá trị (bên phải) — node ĐÃ format; khung không format hộ. */
    value: ReactNode
    /** Dòng phụ dưới nhãn (giải thích/đơn vị/điều kiện) — muted, cỡ nhỏ hơn. */
    hint?: ReactNode
    /** `true` → hàng TỔNG: nhãn lên foreground medium, giá trị lên cỡ base + bold. */
    emphasis?: boolean
    /** `true` → kẻ một đường NGĂN dưới hàng (seam giữa hàng này và hàng kế). */
    divider?: boolean
    /** Khoảng giữa nội dung hàng và đường kẻ `divider` (§10). Default `3`. */
    gap?: KeyValueGap
    /** Extra classes trên hàng. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
}

/**
 * Một hàng nhãn–giá trị: nhãn (+`hint`) dạt trái, giá trị dạt phải, `tabular-nums`
 * để các con số thẳng cột khi xếp chồng (§3). `emphasis` là bậc NHẤN cho hàng tổng.
 *
 * @param props - {@link KeyValueRowProps}
 */
const KeyValueRow = ({
    label,
    value,
    hint,
    emphasis = false,
    divider = false,
    gap = 3,
    className,
    showAnatomy = false,
}: KeyValueRowProps) => {
    const row = (
        <div
            className={cn("flex items-start justify-between gap-2", className)}
            data-anat-part={showAnatomy ? "Row" : undefined}
        >
            {/* Cột nhãn: nhãn + hint là một cụm KHÍT (§10b `tight` = gap-1). */}
            <div className="flex min-w-0 flex-col gap-1">
                <span data-anat-part={showAnatomy ? "Label" : undefined}>
                    <Typography.Base size="sm"
                        text={label}
                        color={emphasis ? undefined : "muted"}
                        weight={emphasis ? "medium" : undefined}
                    />
                </span>
                {hint != null ? (
                    <span data-anat-part={showAnatomy ? "Hint" : undefined}>
                        <Typography.Base size="xs" text={hint} color="muted" />
                    </span>
                ) : null}
            </div>
            <span className="shrink-0" data-anat-part={showAnatomy ? "Value" : undefined}>
                {emphasis ? (
                    <Typography.Base text={value} weight="bold" tabularNums />
                ) : (
                    <Typography.Base size="sm" text={value} weight="medium" tabularNums />
                )}
            </span>
        </div>
    )
    if (!divider) {
        return row
    }
    return (
        <div className={cn("flex flex-col", GAP_CLS[gap])}>
            {row}
            <span className="block" data-anat-part={showAnatomy ? "Divider" : undefined}>
                <Divider.Base variant="tertiary" />
            </span>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .List — N cặp xếp dọc (danh sách lặp ⇒ items)
// ─────────────────────────────────────────────────────────────────────────────

/** MỘT hàng trong {@link KeyValue.List} — mô tả bằng DỮ LIỆU, không phải JSX. */
export interface KeyValueListItem {
    /** Khoá React. */
    key: string
    /** Nhãn (bên trái). */
    label: ReactNode
    /** Giá trị (bên phải) — node đã format. */
    value: ReactNode
    /** Dòng phụ dưới nhãn. */
    hint?: ReactNode
    /** `true` → hàng TỔNG (nhấn thị giác). */
    emphasis?: boolean
}

/** Props for {@link KeyValue.List}. */
export interface KeyValueListProps {
    /** Các hàng, theo thứ tự đọc. BẮT BUỘC — danh sách lặp = dữ liệu (§13b). */
    items: ReadonlyArray<KeyValueListItem>
    /** Gap giữa các hàng, ÉP theo thang §10. Default `3` (hàng dọc = `grouped`). */
    gap?: KeyValueGap
    /** `true` → kẻ đường ngăn GIỮA các hàng (hàng cuối không có). */
    divider?: boolean
    /** Extra classes trên cột. */
    className?: string
    /** `true` → gắn `data-anat-part` cho từng part để BlockAnatomy badge. */
    showAnatomy?: boolean
}

/**
 * Cột các hàng {@link KeyValue.Row} dựng từ `items`. Đường ngăn (nếu bật) do LIST
 * quyết định — hàng CUỐI không kẻ, nên seam luôn nằm GIỮA hai hàng chứ không thừa
 * một vạch treo ở đáy. Gap của hàng-và-vạch dùng chung `gap` của list ⇒ nhịp trên/
 * dưới đường kẻ luôn cân (§10a: một seam, một chủ).
 *
 * @param props - {@link KeyValueListProps}
 */
const KeyValueList = ({ items, gap = 3, divider = false, className, showAnatomy = false }: KeyValueListProps) => (
    <div className={cn("flex flex-col", GAP_CLS[gap], className)}>
        {items.map(({ key, ...item }, index) => (
            <KeyValueRow
                key={key}
                {...item}
                divider={divider && index < items.length - 1}
                gap={gap}
                showAnatomy={showAnatomy}
            />
        ))}
    </div>
)

/**
 * `KeyValue.*` — khung cặp nhãn–giá trị (tầng LAYOUT §13). `Row` (một cặp) ·
 * `List` (N cặp, `items`). Biến thể thị giác = PROP (`emphasis`/`divider`), §6b.
 */
export const KeyValue = {
    Row: KeyValueRow,
    List: KeyValueList,
}
