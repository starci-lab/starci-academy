# Draft: bán kính field nhất quán · dropdown w-fit · scroll = ScrollShadow

**File-§ đích:** `main.md` (mindset spacing/shape + scroll) + `starci-<element>` nếu tách — chọn khi `/merge`.

**Bài học (2026-06-17):** thầy chốt trên trang Cài đặt AI / Gói AI.

**Luật mới:**
- **Bán kính theo NGỮ CẢNH KHỐI:** control field (Input, Select dropdown) = token `--field-radius` (0.75rem = `rounded-xl`),
  nhất quán với nhau. NHƯNG **block bên TRONG 1 card** (vd banner "đang dùng" nằm trong tier Card `rounded-3xl`) thì
  bám radius của CARD cha (`rounded-3xl`) cho ăn khớp, KHÔNG ép field-radius. (Thầy tự chỉnh banner → `rounded-3xl`
  2026-06-17.) → quy tắc gốc: **bo góc con hài hoà với bo góc khối cha bao nó**, đừng trộn lung tung.
- **Banner "đang dùng/current"**: full-width, solid block. Màu tint: thầy đang dùng `bg-success/10` (TierCard) — bám
  `text-success` cùng tông "đang ở gói này" (đừng cứng nhắc accent/10).
- **Dropdown/Select chọn 1 giá trị ngắn → `w-fit` (min-w hợp lý)**, KHÔNG full-width. (Full-width chỉ cho input nhập text dài.)
- **Vùng scroll dọc (list trong card/panel) → bọc HeroUI `ScrollShadow`** (fade trên/dưới) thay `div overflow-y-auto`
  trần, để biết còn nội dung. `className` đặt `max-h-*` lên ScrollShadow; bỏ `overflow-y-auto` thủ công.

**Đã áp:** `ByokForm` Select `w-fit min-w-48`; banner "đang dùng" (FreeTier/TierCard) `rounded-3xl` (thầy tinh chỉnh);
`AiQuotaModal/HistoryTab` + `AiUsageHistory` list → `ScrollShadow`.
