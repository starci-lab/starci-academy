"use client"

import React from "react"
import { type AnatomyTier } from "./anatomy-context"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ĐỒ NGHỀ — AnatomyOverlay: đánh dấu MỘT part để cây anatomy nhận ra nó.
 *
 * Rút gọn 2026-07-26 (thầy chốt): anatomy chỉ còn là CÔNG CỤ XEM CÂY DOM, nên
 * overlay KHÔNG vẽ gì lên hình nữa — không viền nét đứt, không nhãn góc, không
 * badge số, không bấm. Nó chỉ còn phát một marker VÔ HÌNH mang `data-anat-part`.
 *
 * Vì sao bỏ: nhãn phủ đè lên chính component nó chú thích (neo: trùm kín một cái
 * chip 60px, chữ không đọc nổi) — rối hơn là giúp.
 *
 * Vì sao GIỮ component thay vì xoá: ~20 call-site đang gọi nó, và cây vẫn cần
 * marker để nhận diện part. Muốn đảo lại thì chỉ sửa MỘT chỗ.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type { AnatomyTier }

/** Props for the {@link AnatomyOverlay}. */
export interface AnatomyOverlayProps {
    /** Tên part — hiện trong cây anatomy. */
    label: string
    /** Giữ cho tương thích call-site cũ; cây lấy tier từ `annotate`. */
    tier?: AnatomyTier
    /** Giữ cho tương thích call-site cũ; overlay không còn vẽ link. */
    href?: string
}

/** Marker vô hình đánh dấu part cho cây anatomy. */
export const AnatomyOverlay = ({ label }: AnatomyOverlayProps) => (
    <span aria-hidden data-component={label} className="pointer-events-none absolute inset-0" />
)
