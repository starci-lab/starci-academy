import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { ChipBase, type ChipTone } from "./ChipBase"
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `ChipGroup`: HÀNG chip (cluster) mô tả bằng `items` DỮ LIỆU, cắt bớt khi tràn.
 *
 * ⭐ COMPONENT DUY NHẤT trong họ Chip CÓ DEPS: nó `import { ChipBase }` + `Tooltip` ở
 * trên. Trước 2026-07-26 hàng chip này sống ở một component RIÊNG tên `TagChips`, tự
 * gọi thẳng HeroUI Chip — nên nó trôi khỏi atom (chip trong hàng không có ô ×, không
 * theo tone, skeleton tự vẽ một cỡ khác). Giờ hàng chip dựng lại đúng `ChipBase`.
 *
 * HÀNH VI giữ nguyên của `TagChips`: hiện tối đa `maxVisible` chip, phần còn lại gom
 * thành một chip `+N`; rê vào `+N` thì Tooltip liệt kê ĐỦ danh sách. Đây mới là lý do
 * cụm này tồn tại (đếm · cắt · tràn) — khác `StatusChip`, thứ chỉ khoá cứng một prop
 * nên đã bị xoá.
 *
 * Group KHÔNG đẻ nghĩa mới: chỉ layout gap + dựng lại `ChipBase`. State của TỪNG chip
 * (`icon`/`onRemove`/chấm màu) thuộc về `ChipBase` (§12f) — story của cụm KHÔNG lặp lại.
 *
 * ⚠️ ĐÃ BỎ so với `TagChips`: prop `classNames.{trigger,content}` (mở CSS nội bộ của
 * tooltip cho caller — đúng thứ §4 cấm) và `variant` truyền thẳng xuống HeroUI (giờ đi
 * qua `tone` của atom). Cả hai không phải hành vi, chỉ là lối vá từ ngoài.
 * ─────────────────────────────────────────────────────────────────────────────
 */
/** Một chip trong {@link ChipGroup} — mô tả bằng DỮ LIỆU, không phải JSX (§12b). */
export interface ChipGroupItem {
    /** Khoá React. Đặt tay để hai chip trùng chữ không đụng nhau. */
    key: string
    /** Nhãn chip. */
    text: ReactNode
}
/** Props for {@link ChipGroup} — a row of chips that collapses overflow into "+N". */
export interface ChipGroupProps {
    /**
     * Hàng chip mô tả bằng DỮ LIỆU (§4 STRICT — consumer KHÔNG truyền structure/JSX con).
     */
    items: Array<ChipGroupItem>
    /**
     * Bao nhiêu chip hiện ra trước khi phần còn lại gom vào `+N`. Default `3`.
     */
    maxVisible?: number
    /**
     * Tone CHUNG cả hàng (default `neutral`) — hàng token phải ĐỒNG MÀU thì mới đọc ra là
     * một tập; mỗi chip một tone là hàng cầu vồng. Vì thế `tone` ở cụm, không ở từng item
     * (cùng lý do `size` nằm ở cụm bên `ButtonGroup`, §12d).
     */
    tone?: ChipTone
    /** `true` → skeleton mirror đúng số ô lúc nghỉ (mỗi ô là một `ChipBase` tự vẽ). */
    isSkeleton?: boolean
    showAnatomy?: boolean
    /** Tên `data-anat-part` gắn ở GỐC hàng, cho component bọc ngoài gọi tên cụm này. */
    anatPart?: string
    className?: string
}
export const ChipGroup = ({
    items,
    maxVisible = 3,
    tone = "neutral",
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
}: ChipGroupProps) => {
    // Nhãn deps: cây đọc từ DOM nên cụm phải GỌI TÊN cái nó dựng lại.
    const chipPart = showAnatomy ? "Chip" : undefined
    if (isSkeleton) {
        return (
            <div className={cn("flex flex-wrap items-center gap-2", className)} data-anat-part={anatPart}>
                {/* Giữ đúng footprint lúc nghỉ: `maxVisible` viên, mỗi viên tự vẽ shimmer
                    của CHÍNH nó (§12c) — cụm không vẽ hộ, nếu không hai hình sẽ trôi khỏi nhau. */}
                {Array.from({ length: maxVisible }).map((_, index) => (
                    // Shimmer không mang tone (viên xám thuần) nên KHÔNG truyền `tone` xuống —
                    // truyền một prop không có tác dụng chỉ làm người đọc tưởng nó có.
                    <ChipBase key={index} isSkeleton anatPart={chipPart} />
                ))}
            </div>
        )
    }
    const visibleItems = items.slice(0, maxVisible)
    // Chỉ > 0 mới có tràn THẬT để hiện `+N` (tránh số âm khi hàng ngắn hơn maxVisible).
    const overflowCount = Math.max(0, items.length - maxVisible)
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)} data-anat-part={anatPart}>
            {visibleItems.map(({ key, text }) => (
                <ChipBase key={key} text={text} tone={tone} anatPart={chipPart} />
            ))}
            {overflowCount > 0 ? (
                <Tooltip
                    showAnatomy={showAnatomy}
                    label={
                        // Tooltip liệt kê ĐỦ hàng, kể cả phần đang hiện — người đọc mở ra để
                        // xem "tất cả là những gì", không phải "phần bị giấu là gì".
                        <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
                            {items.map(({ key, text }) => (
                                <span key={key}>{text}</span>
                            ))}
                        </div>
                    }
                >
                    <ChipBase text={`+${overflowCount}`} tone={tone} anatPart={chipPart} />
                </Tooltip>
            ) : null}
        </div>
    )
}