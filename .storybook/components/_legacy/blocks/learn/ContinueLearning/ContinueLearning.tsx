import React from "react"
import { ContinueCard } from "@sb-components/_legacy/designs/cards/ContinueCard/ContinueCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `ContinueLearning`, block QUAY LẠI CHỖ ĐANG DỞ.
 *
 * LÝ DO TỒN TẠI (§14a, thầy soi mắt 2026-07-25): screen `/learn/content` đang gọi
 * THẲNG `ContinueCard` — mà `ContinueCard` là tầng **DESIGN** (`Design/Cards/…`),
 * không phải block. Design là NGUYÊN LIỆU; screen chỉ được ghép BLOCK.
 *
 * Ranh giới: `ContinueCard` (design) trả lời *"một thẻ 'tiếp tục' TRÔNG ra sao"* —
 * nó không biết khoá nào, bài nào. `ContinueLearning` (block) trả lời *"trang này
 * cho người học quay lại chỗ đang dở"* — đó là CHỨC NĂNG.
 *
 * BLOCK SỞ HỮU quyết định dùng nguyên liệu nào: chọn `variant="hero"` (một điểm
 * nhấn duy nhất trên trang) và KHÔNG truyền `eyebrow` (khung hero đã nói thay).
 * Screen không được biết mấy chuyện đó (§14c — block lắp, screen không lắp).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ContinueLearning}. */
export interface ContinueLearningProps {
    /** Tên mục đang dở (bài/chương) — dòng chính. */
    title: string
    /** Phần trăm đã hoàn thành (0–`max`). Bỏ trống ⇒ không hiện thanh tiến độ. */
    value?: number
    /** Mốc 100%. Mặc định 100. */
    max?: number
    /** Các mẩu meta dạng CHỮ (vd "Đã đọc 8/23 bài") — block tự dựng hàng meta. */
    meta?: Array<string>
    /** Nhãn nút. */
    ctaLabel: string
    /** Bấm nút tiếp tục. */
    onContinue?: () => void
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * Quay lại chỗ đang dở — điểm nhấn duy nhất của trang.
 *
 * @param props - {@link ContinueLearningProps}
 */
export const ContinueLearning = ({
    title,
    value,
    max = 100,
    meta,
    ctaLabel,
    onContinue,
    anatPart,
    showAnatomy = false,
}: ContinueLearningProps) => (
    <ContinueCard
        // Block quyết nguyên liệu: hero = MỘT điểm nhấn trên trang; không eyebrow
        // vì khung hero + CTA "Tiếp tục" đã nói rồi (nói hai lần là thừa).
        variant="hero"
        title={title}
        value={value}
        max={max}
        meta={meta}
        ctaLabel={ctaLabel}
        onPress={onContinue}
        anatPart={anatPart}
        showAnatomy={showAnatomy}
    />
)
