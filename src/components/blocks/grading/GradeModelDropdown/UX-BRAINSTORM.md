# GradeModelDropdown — UX brainstorm: filter options + warn-not-hide (2026-06-30)

> Popover chọn model (dùng chung chat + grading). Thầy chốt 3 việc: (1) thêm **filter options bên phải thanh search**, (2) model **không phù hợp task → cảnh báo VÀNG** (như model dưới sàn) thay vì ẩn, (3) BE **filter model theo task trong "work"** (auto-lane không tự chọn model sai task).

## Mục tiêu (≤30s)
User mở popover → chọn nhanh 1 model (hoặc giữ **Tự động**). Cần: quét nhanh, biết model nào **phù hợp/không** với việc đang làm (chat vs chấm), lọc bớt khi list dài. KHÔNG cần: thấy mọi field kỹ thuật.

## Dữ liệu THẬT có (`gradableModels`)
| Field | Dùng cho |
|---|---|
| `model` / label | tên hiển thị + search |
| `category` (Free/Economy/Balanced/Premium/Frontier) | chip tier + filter + so sánh `floor` |
| `complimentary` | filter "miễn phí / trả phí" |
| `available` | khoá (no key) → disabled |
| `supportedTasks` (chatting/grading) | **phù hợp task hay không** → warn vàng |
| `floor` (prop) | dưới sàn → warn vàng (đã có) |
| `selection` | đang chọn cái nào |

→ Đủ field cho filter theo **tier · free/paid · phù-hợp-task**. KHÔNG bịa thêm.

## Thay đổi cốt lõi: HIDE → WARN
- Bản hiện tại: model thiếu `supportedTasks` của picker → **ẩn** (`task` prop lọc khỏi list).
- Bản mới (thầy chốt): **hiện hết**, model không-phù-hợp → **WarningIcon vàng** (`text-warning`) + tooltip "Không tối ưu cho {chat/chấm} — có thể chọn nhưng kết quả kém". **Vẫn chọn được** (user tự chịu, giống dưới-sàn). Gộp 2 lý do warn (sai-task + dưới-sàn) thành 1 ngôn ngữ "amber soft-warning".
- Lợi: minh bạch (thấy mọi model), không "giấu" → user hiểu vì sao nên/không nên; vẫn nhả lựa chọn. Ref: OpenRouter picker hiện full catalog + cảnh báo/score, không ẩn ([nguồn](https://openrouter.ai/models)).

## Filter options (bên phải thanh search) — 3 facet từ data
- **Tier** (category): Tất cả / Miễn phí / Tiết kiệm / Cân bằng / Cao cấp / Đỉnh.
- **Giá**: Tất cả / Miễn phí / Trả phí (`complimentary`).
- **Chỉ hiện phù hợp**: toggle → ẩn lại các model warn-sai-task (cho ai muốn list gọn). Mặc định TẮT (hiện hết + warn).

## Các hướng (chốt A)
**A — Filter icon-button → facet menu (ĐỀ XUẤT).** Hàng search = `[ô search flex-1] [nút icon funnel]`. Bấm funnel mở menu nhỏ: nhóm Tier (radio) + Giá (radio) + "Chỉ hiện phù hợp" (switch). Badge số khi có filter active. Gọn 1 dòng, mở rộng khi cần — hợp popover hẹp. Khớp OpenRouter (filter facet ẩn sau nút).
**B — Select tier inline.** Phải search = 1 `Select` tier luôn hiện (Tất cả/Free/…). Đơn giản, 1 facet thường dùng; nhưng chỉ 1 chiều (thiếu free/paid + phù-hợp) → phải nhồi thêm → chật.
**C — Hàng chip filter dưới search.** Search 1 dòng, dưới là dải chip tier. Tốn chiều dọc trong popover; thầy muốn "bên phải search" nên loại.

→ **CHỐT A**: nút funnel bên phải search + facet menu (tier · giá · chỉ-phù-hợp). Đúng "bên phải thanh search", đa-facet, không chiếm chỗ.

## IA popover (sau redesign)
1. **Tự động** ghim trên cùng (đã có).
2. Hàng: `[search secondary flex-1] [funnel icon-button + badge]`.
3. `ScrollShadow` → list model: mỗi row = tên + chip tier + (lock nếu !available) + **WarningIcon vàng** nếu (sai-task ‖ dưới-sàn), tooltip lý do. Row đang chọn = accent ở chi tiết.
4. Empty (search/filter ra rỗng) = dòng muted "Không có model khớp" (đã có) + gợi ý xoá filter.

## Section → field
| Khối | Field |
|---|---|
| Auto ghim | `selection` (model null) |
| Search | client filter `model`/label |
| Funnel facets | `category` · `complimentary` · `task`(phù hợp) |
| Model row | `model` · `AiCategoryChip(category)` · `available`(lock) · warn = `!supportedTasks.includes(task)` ‖ below-`floor` |

## Cắt / thêm
- **Bỏ**: hard-hide theo task (đổi sang warn).
- **Thêm**: funnel facet menu (tier/giá/chỉ-phù-hợp); amber-warn cho sai-task (tái dùng style dưới-sàn).
- **Giữ**: Auto ghim, search secondary, ScrollShadow, lock cho !available.

## BE follow-up (BẮT BUỘC — "filter model trong work")
FE warn = mềm (user vẫn chọn được). Nhưng **AUTO lane (balancer) PHẢI hard-filter theo task**: khi chạy chat → chỉ xét model `supportedTasks ⊇ chatting`; khi chấm → `⊇ grading`. Hiện `enabledModels()` chỉ lọc theo category → cần truyền `task` xuống `runAuto`/`AiTaskModelService` + lọc catalog theo `supportedTasks`. → tránh auto fallback vào model sai task. (Thầy: *"trò nhớ filter models trong work nhé"*.) Làm ở `/starci-fe-ux-apply` (FE) + 1 task BE riêng.

## Empty/loading/a11y
- Loading: skeleton trigger (đã có qua AsyncContent ở caller).
- Empty: "Không có model khớp" + nút xoá filter.
- a11y: funnel `aria-label`; warn icon có tooltip text (không chỉ màu); facet menu keyboard-nav (HeroUI).

## Refs
- [OpenRouter models / picker](https://openrouter.ai/models) — filter provider/specs/pricing, full catalog + score (không ẩn).
- [OpenRouter Auto Router cost-quality dial](https://openrouter.ai/docs/guides/routing/routers/auto-router) — "phù hợp/sàn" là khái niệm quen.

---

# VÒNG 2 (2026-06-30) — ĐẢO hướng: ẩn rác + filter tối giản ("trang filter lệch")

> Thầy: *"trang filter đang lệch layout quá... nghĩ cái filter hợp lý hơn, ẩn model fail, ẩn model không hợp lý cho tác vụ"*. **ĐẢO** quyết định vòng 1 (warn-not-hide) → giờ **HIDE** down + off-task.

## Root cause "lệch"
- Filter = panel viền pop-xuống (`mx-2 rounded-2xl border border-default bg-default/40`) chứa 6 chip Tier (wrap 2 hàng) + 3 chip Price + switch → trong popover `w-80` = chật/nặng/đẩy list = lệch.
- `FilterChip` = `<button>` hand-rolled (vi phạm [[elements/chip]]).
- List hiện cả model **down** (`!available`) + **off-task** (warning amber) = noise không ai chọn.

## Nguyên tắc mới
- **Ẩn mặc định:** `!available` (down) + off-task (`task && supportedTasks?.length && !includes(task)`). "Chỉ hợp tác vụ" thành DEFAULT (bỏ switch `onlySuited`).
- **GIỮ hiện:** locked (premium chưa mở → upsell) + below-floor (yếu nhưng chọn được, cảnh báo). Không phải rác.
- **Escape hatch:** link mờ cuối list "Hiện N model đã ẩn" → reveal down/off-task (giữ tính năng, chỉ dọn default). State `showHidden`.

## 3 hướng (widget đã vẽ)
- **A (CHỐT đề xuất)** — bỏ nút phễu + panel. **Tier inline** dưới search = dải chip (chỉ render hạng CÓ model, [[single-select-among-options-use-tabs]] dạng chip/segmented). Bỏ Price (trùng tier). + escape link. → nhẹ nhất, hết lệch.
- **B** — giữ phễu nhưng panel bỏ box viền (whitespace [[whitespace-over-dividers]]), Chip thật, Tier 1 hàng + 1 toggle "Chỉ miễn phí".
- **C** — bỏ filter, list chia **section theo Hạng** (DropdownSection header), search lọc.

## Khi /apply (hướng A)
- Bỏ: `FunnelIcon` button, `showFilters`, `FilterChip` (hand-roll), `priceFilter`, `onlySuited` switch, panel `border bg-default/40`.
- Thêm: `hiddenCount` (down + off-task), `showHidden` state, escape link cuối ScrollShadow.
- Tier filter inline: dùng **Chip thật** (HeroUI) hoặc `SegmentedControl`/`FlexWrapButtonRadio insideCard` — chỉ render `TIER_FILTERS` có model. Selected = `bg-accent/10 text-accent` ([[highlight-accent-as-detail-not-block-fill]]). Đặt giữa search ↔ list, gap-3 whitespace ([[picker-popover-pin-default-search-below-scroll-results]]).
- `filteredModels`: thêm gate `if (!showHidden && (!available || offTask)) return false`.
- BE (vòng 1 đã có/định): auto-lane filter theo task — giữ.

## ĐÃ ÁP DỤNG hướng A — 2026-06-30
- Ẩn mặc định: `!available` (down) + off-task → `visibleModels`; `hiddenCount` đếm số ẩn. Bỏ `priceFilter`/`onlySuited`/`showFilters`/`activeFilterCount` + panel viền + nút phễu (`FunnelIcon`, `Button`, `Switch` gỡ khỏi import).
- Tier filter inline: dải `FilterChip` (`flex flex-wrap gap-2 px-2 pt-2`) NGAY dưới search, chỉ render `tierChips` = hạng CÓ trong catalog (ẩn khi chỉ có "all"). Selected = `bg-accent/10 text-accent`.
- Escape hatch: nút `text-xs text-muted` cuối popover (ngoài ScrollShadow) — `showHiddenModels {count}` ⇄ `hideHiddenModels`. Reset `showHidden` khi đóng.
- GIỮ: Auto pinned · locked rows (upsell) · below-floor warning. i18n `aiSettings.showHiddenModels`/`hideHiddenModels` (vi+en). tsc/eslint/JSON sạch.
- **Nợ nhỏ:** `FilterChip` vẫn hand-roll `<button>` (interactive choice-chip — borderline [[elements/chip]]); i18n cũ `filterModels/filterTier/filterPrice/filterFree/filterPaid/filterOnlySuited` giờ mồ côi (để lại, vô hại).
