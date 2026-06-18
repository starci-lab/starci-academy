# Draft: indicator "đang dùng" = banner full-width + free tier nêu rõ credit

**File-§ đích:** `main.md` (mindset state-indicator) hoặc `starci-card.md` — chọn khi `/merge`.

**Bài học (2026-06-17, trang Gói AI):** "Đang dùng" của tier hiện tại là `Chip` success self-center; gói Miễn phí
footer để trống không nêu credit. Thầy chốt: đang-dùng render **full-width, text-success, nền giống input nhưng
`bg-accent/10`**; gói miễn phí **ghi rõ credit** như các gói trả phí.

**Luật mới:**
- **Indicator "đang dùng / plan hiện tại" trong list lựa-chọn (tier/plan) = banner FULL-WIDTH** (không chip nhỏ):
  `flex w-full justify-center rounded-large bg-accent/10 px-3 py-2` + chữ **`text-success`** weight medium.
  (Khối active = `bg-accent/10` đồng bộ active-state toàn app; chữ success = "đang ở gói này".)
- **Mọi phương án trong bảng so sánh (kể cả FREE/0đ) phải NÊU RÕ thông số** (credit/limit) — đừng để card free
  trống/placeholder ẩn trong khi card trả phí liệt kê. Free base = config `systemConfig.ai.auto` (default 50/5h · 500/tuần);
  card free là static nên hằng số mirror config + comment (đừng để drift âm thầm).
- **Provider/selector BYOK chốt dùng `Select` dropdown** (thầy chọn dropdown trong 2 option "primary tab | dropdown"
  ở [[settings-form-controls]]).

**Đã áp:** `AiSubscription/FreeTierCard` (banner + credits 50/500) + `TierGrid/TierCard` (banner đồng bộ);
`AiSettings/ByokForm` provider → `Select` dropdown.
