import { ChipBase } from "./ChipBase"
import { ChipGroup } from "./ChipGroup"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Chip.*`: namespace của họ chip. File này CHỈ gom, không có logic.
 *
 * Mỗi member một FILE riêng (tách 2026-07-26) để quan hệ giữa chúng là `import` THẬT,
 * đọc được:
 *   • `Chip.Base`  → ./ChipBase   — viên chip DUY NHẤT; chấm trạng thái là PROP
 *     (`dotColor`/`dotClassName`), không phải member riêng.
 *   • `Chip.Group` → ./ChipGroup  — HÀNG chip cắt tại `maxVisible` + chip `+N` mở
 *     Tooltip; **import ChipBase** ⇒ component duy nhất trong họ có deps.
 *
 * ⚠️ ĐÃ XOÁ 2026-07-26 — ba thứ, ba lý do khác nhau:
 *   • `Chip.Dot` — chấm không phải hình thái chip khác, chỉ là ô glyph dẫn đầu đổi
 *     hình ⇒ `<Chip.Base dotClassName="text-success" text="Đang chạy" />`.
 *   • `StatusChip` — chip này khoá cứng `tone`, không thêm hành vi nào ⇒ gọi thẳng
 *     `<Chip.Base tone="success" … />`.
 *   • `TagChips` — CÓ hành vi thật (đếm · cắt · tràn) nên không xoá mà đưa vào
 *     namespace thành `Chip.Group`.
 *   • `chip-tone.ts` — bảng tone về sống trong `ChipBase.tsx`. File token riêng chỉ có
 *     lý do khi ≥2 component NGANG HÀNG cùng cần; ở đây `ChipGroup` dựng lại `ChipBase`
 *     nên cứ import thẳng, không cần file trung gian.
 *
 * Call-site bên ngoài KHÔNG đổi đường import: vẫn `.../Chip/Chip`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Chip = Object.assign(ChipBase, {
    Base: ChipBase,
    Group: ChipGroup,
})

export type { ChipBaseProps, ChipTone, IconComponent } from "./ChipBase"
export type { ChipGroupItem, ChipGroupProps } from "./ChipGroup"
