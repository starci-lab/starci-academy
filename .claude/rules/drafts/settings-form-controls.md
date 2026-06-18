# Draft: controls trong form/settings — tabs, nút ngắn, đừng card thừa

**File-§ đích:** `main.md` (mindset form/settings) + `starci-button.md` (size/fullWidth) — chọn khi `/merge`.

**Bài học (2026-06-17):** trang Cài đặt AI: provider render = 3 pill `Button`; nút "Lưu thay đổi" `fullWidth`;
section "Khoá API" bọc `LabeledCard`; "Xem Gói AI" là `Button`; có dòng "Đang dùng:" read-only. Thầy chốt:
provider→**tabs**, nút lưu **ngắn**, **bỏ card** section, "Xem Gói AI"→**Link**, bỏ "Đang dùng".

**Luật mới:**
- **Bộ chọn 1-trong-ít (provider, mode, segmented) trong FORM/input → `Tabs variant="primary"`** (segmented/solid)
  **hoặc `Select` dropdown**, KHÔNG dãy pill `Button`. ⚠️ **`ExtendedTabs` (secondary/underline) CHỈ cho TAB LỚN
  cấp-trang** (page-level nav như tab profile), **KHÔNG dùng cho selector nhỏ trong input/form** (thầy chốt
  2026-06-17: "tab secondary chỉ xài cho tab lớn"). Pill-buttons-as-selector = sai semantics + nhìn như nhiều CTA.
- **Nút submit/save trong form settings = NGẮN** (`className="self-start"`, để width tự co theo chữ), **KHÔNG `fullWidth`**.
  fullWidth chỉ cho CTA chính trong cột hẹp/modal/card, không cho form settings rộng.
- **Đừng bọc `Card`/`LabeledCard` thừa quanh 1 section form đơn** (provider+input). Card chỉ khi cần TÁCH surface
  (nhiều khối, nền nổi). Section thường = heading (`Typography body-sm semibold`) + fields, phẳng. (Lặp lại tinh thần
  "panel co/giãn tại chỗ ≠ card" + thầy nhiều lần "bỏ card chi".)
- **Text điều hướng ("Xem Gói AI", upsell) = `Link`** (đã có rule §text-action). Read-only status thừa ("Đang dùng…")
  → cắt nếu không giúp quyết định.

**Đã áp:** `AiSettings/ByokForm` (LabeledCard→section phẳng + provider ExtendedTabs), `AiSettings/index` (save self-start,
upsell→Link, bỏ `<EffectiveLane/>` + xoá folder orphan), `AiSettingsSkeleton` mirror lại (tabs+input, nút ngắn).
