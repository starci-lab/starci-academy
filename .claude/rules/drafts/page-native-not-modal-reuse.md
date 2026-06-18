# Draft: trang đầy đủ ≠ phóng to modal — dựng component page-native

**File-§ đích:** `main.md` (mindset kiến trúc/IA) — chọn khi `/merge`.

**Bài học (2026-06-17):** trang `/profile/ai-usage` trước = wrapper ghép thẳng `QuotaLane` + `AiQuotaHistoryTab`
của **AiQuotaModal** → bị giới hạn theo modal (history nạp cứng 100, không filter/infinite, chart sai cửa sổ).

**Luật mới:**
- Khi 1 TRANG dùng lại mảnh của MODAL nhưng cần nhiều hơn (filter, infinite, insight) → **dựng component
  page-native riêng** (`<Feature>/<Part>`), ĐỪNG nhồi thêm vào component modal dùng-chung (sẽ phình + rủi ro vỡ modal).
  Giữ reuse cho mảnh đủ dùng (vd `QuotaLane` pool), tách cái cần khác (vd history → `AiUsageHistory`).
- Component modal dùng-chung GIỮ NGUYÊN (không đụng) → tránh regression cho modal.

**Đã áp:** tạo `AiUsage/AiUsageHistory` (chart 14d fix + SegmentBar per-provider + filter lane Select + history
`useSWRInfinite` + ScrollShadow) thay `AiQuotaHistoryTab` TRÊN TRANG; modal vẫn dùng `AiQuotaHistoryTab` cũ.
**Nợ BE (đã nêu, không fake):** expose `attemptId(+displayId)` để link dòng history→challenge; aggregate
"đã tiêu toàn thời gian" (giờ chỉ tính trên trang đã tải; KPI tổng chính xác cần BE).
