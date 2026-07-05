# CV Templates — UX brainstorm (2026-07-06)

> Thầy: *"thêm vài cái template cv nữa xem này, này chỉ có 1 template à"* — hiện CV chỉ có **1 template duy nhất**
> (`CvHtmlDocument`, 1 cột, accent cho heading + rule). Cần: **nhiều template** để user chọn "bộ mặt" CV khác nhau.

## 0. Kiến trúc HIỆN TẠI (grounded)
- **1 renderer duy nhất** `CvBlocksWorkspace/CvHtmlDocument/index.tsx`: map `doc.blocks` (đã sort theo `order`) →
  các section 1 CỘT, mỗi block 1 sub-component (`PersonalBlock`, `ExperienceBlock`, `SkillsBlock`, …). Style chỉ có
  **2 knob**: `accent` (màu heading + đường rule) + `scale` (cỡ chữ sm/md/lg). `font` + `language` là knob phụ.
- **1 nguồn HTML → 3 đầu ra**: `buildCvExportHtml(doc)` = `renderToStaticMarkup(<CvHtmlDocument>)` bọc `<!doctype>` +
  `@page A4`. Preview (client) + PDF (Puppeteer) + Word (html-to-docx) ĐỀU đi qua đúng renderer này → không lệch.
- **`CvStyle` = JSONB opaque ở BE** (`cv_blocks.style`). FE sở hữu shape (`types.ts`). → **thêm 1 field style KHÔNG
  cần đụng BE** (chỉ FE + đổi `DEFAULT_CV_STYLE`).
- Prior decision (CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md) từng chốt *"1 template dùng chung, KHÔNG tạo nhiều template
  cấu trúc khác nhau"* — **giờ ĐẢO**: thầy muốn nhiều template. Reconcile bên dưới (giữ invariant "1 nguồn HTML").

## 1. Mục tiêu + ràng buộc (grounded-in-data + North Star)
- **Job:** cho user 1 bộ "bộ mặt" CV để chọn (giống Canva/Novoresume/FlowCV/Reactive Resume) — cùng DỮ LIỆU block,
  khác LAYOUT. Tăng cảm giác "sản phẩm xịn" + để CV nổi bật khi gửi nhà tuyển dụng.
- **Ràng buộc cứng #1 — ATS (two-sided value):** CV StarCi feed cho **nhà tuyển dụng** (recruiter-gate,
  headhunting). Nghiên cứu 2026: **1 cột = an toàn ATS nhất**; **2 cột làm parser (Taleo/iCIMS/Workday) đảo thứ tự
  đọc → điểm parse rớt còn ~52%**. Template icon/table/2-cột = rủi ro. → template phải **cân bằng đẹp vs
  parse-được**; mặc định phải là bản ATS-safe, bản 2-cột phải **gắn cảnh báo**.
- **Ràng buộc cứng #2 — 1 nguồn HTML → PDF+Word:** template mới vẫn phải serialize qua `buildCvExportHtml`. **Word
  (html-to-docx) YẾU về flex/grid** → template 2-cột (flexbox) render đẹp ở PDF (Puppeteer=Chromium) nhưng có thể
  **lệch/sập cột ở Word**. → hoặc chấp nhận "2 cột chỉ đẹp bản PDF", hoặc dựng bản 2-cột bằng `<table>` (docx hiểu
  table) — cần chốt.
- **Ràng buộc #3 — badge "✓ StarCi" (verified):** mỗi template phải render được dấu verified (bằng chứng từ khóa =
  moat của StarCi vs Canva) — không được mất khi đổi template.

## 2. Kiến trúc TEMPLATE (cốt lõi — "renderer strategy trên 1 data model")
- **Thêm `CvStyle.template: CvTemplate`** (`"classic" | "modern" | "sidebar" | "minimal"`), default `"classic"`.
- **`CvHtmlDocument` thành DISPATCHER:** đọc `doc.style.template` → chọn 1 component template (`ClassicTemplate`,
  `ModernTemplate`, …). MỌI template nhận CÙNG props (`blocks` + `accent` + `scale` + `fontFamily`), chỉ khác cách
  **XẾP** section + "da" heading.
- **Tách render THÀNH 2 tầng (DRY):**
  - **Field-level render dùng chung** (cách 1 experience item / 1 skill line hiển thị) — mọi template gọi chung, để
    dữ liệu 1 block trông nhất quán.
  - **Layout-level riêng mỗi template** (1 cột? header band? 2 cột? section nào ở sidebar?).
- **Invariant giữ nguyên:** tất cả template funnel qua `renderToStaticMarkup` → `buildCvExportHtml` → preview/PDF/Word
  không đổi đường. Thêm template = thêm 1 nhánh switch, KHÔNG đụng export pipeline, KHÔNG đụng BE.
- **Phân loại block cho template 2-cột** (sidebar vs main): "compact" (personal · skills · languages · certification ·
  interest) → **sidebar**; "narrative" (summary · experience · project · education · achievement) → **main**. 1 map
  cố định, template sidebar đọc map này.

## 3. Bộ template đề xuất (4 mẫu, grounded ATS)
| Mẫu | Layout | ATS | Word export | Vai |
|---|---|---|---|---|
| **Cổ điển** (classic) | 1 cột, accent rule dưới heading (HIỆN TẠI) | ✅ an toàn | ✅ ổn | **Default** — nộp ATS/khối lớn |
| **Hiện đại** (modern) | Header band tint accent (tên + liên hệ) + thân 1 cột | ✅ an toàn (thân 1 cột) | ✅ ổn | Punchy mà vẫn parse được |
| **Hai cột** (sidebar) | Sidebar trái (liên hệ/kỹ năng/ngôn ngữ/chứng chỉ) + main phải | ⚠️ rủi ro | ⚠️ có thể lệch | Đẹp/nổi — gắn cảnh báo |
| **Tối giản** (minimal) | 1 cột, KHÔNG màu (all foreground), serif, nhiều whitespace | ✅ an toàn | ✅ ổn | Senior/editorial, sạch |
- **3/4 mẫu là 1-cột ATS-safe** (classic/modern/minimal) — đúng ràng buộc recruiter. **Hai cột = tùy chọn "đẹp"**
  kèm badge "Đẹp mắt · có thể khó qua ATS / Word" (honest, không giấu — giữ [[disable-vs-lock-and-perrow-autosave]]
  tinh thần "nói rõ trạng thái").
- Bắt đầu 4; kiến trúc switch cho phép thêm mẫu sau mà không refactor.

## 4. UI CHỌN template — 3 hướng
### Hướng A — Thumbnail grid TRONG sidebar, section "Mẫu" đặt TRÊN CÙNG ⭐ (đề xuất)
- Thêm section **"Mẫu"** (`<Label>`) ở **đầu** sidebar (trên Phông chữ) — vì template là lever THÔ nhất, font/accent/
  cỡ chữ chỉ tinh chỉnh cái đã chọn (thứ tự này = FlowCV/Reactive Resume).
- Render **grid 2 cột thumbnail SỐNG** = `CvHtmlDocument` thu nhỏ (`transform: scale`) theo từng template + data thật
  của user → thấy CV MÌNH trông sao ở mỗi mẫu. Dùng `SelectableCardGroup` (card chọn-1, [[elements/card]] §3e):
  chọn = `border-accent` + tint. Mẫu 2-cột có chip cảnh báo góc.
- **Pro:** in-context, đổi là preview lớn + export đổi ngay, thumbnail DRY (tái dùng renderer thật). **Con:** sidebar
  hẹp (256px) → thumbnail nhỏ (~110px) hơi bé; nhưng đủ để phân biệt bố cục.

### Hướng B — Modal "Thư viện mẫu" (Canva/Novoresume)
- 1 nút "Đổi mẫu CV" ở sidebar → mở **modal** grid thumbnail LỚN + tên + badge ATS. Chọn → apply → đóng.
- **Pro:** thumbnail to, chỗ cho metadata (ATS badge, "2 cột"). **Con:** không live-in-place, thêm 1 click + 1 modal;
  đổi mẫu là việc "thường làm 1 lần" nên modal chấp nhận được.

### Hướng C — Strip thumbnail NGANG trên preview
- Dải thumbnail cuộn ngang ghim đầu pane preview. **Con:** ăn chiều cao preview + **cuộn ngang** (thứ thầy vừa chê ở
  chỗ khác) → **loại**.

**Đề xuất: Hướng A** (thumbnail grid sidebar, section "Mẫu" trên cùng) — hợp mental model "sidebar = mọi lever style",
in-context + live. Khi số template > ~6 (thumbnail tràn sidebar) → **nâng lên B** (modal thư viện). Ghi nợ đó.

## 5. Map dữ liệu (không cần field BE mới)
| Thứ | Nguồn | Ghi chú |
|---|---|---|
| `template` | `cv_blocks.style` JSONB (FE-owned `CvStyle`) | **KHÔNG cần đổi BE** — chỉ thêm field TS + `DEFAULT_CV_STYLE` |
| Thumbnail | `CvHtmlDocument` thu nhỏ + data thật | tái dùng renderer, không asset tĩnh |
| Export | `buildCvExportHtml` (nguyên) | template mới tự đi qua; **caveat Word 2-cột** |
| Badge verified | `item.source === Verified` (đã có) | mỗi template phải render |

## 6. State (empty/loading/a11y)
- **Chưa chọn** → `template` undefined → default "classic" (không có state rỗng — luôn có 1 mẫu).
- **Thumbnail loading:** render ngay (client-side, data đã có) — không cần fetch.
- **a11y:** `SelectableCardGroup` = RadioGroup (roving arrow-key) + mỗi option `aria-label` tên mẫu; badge cảnh báo có
  text (không chỉ màu).

## 7. Việc BE / defer
- **KHÔNG cần BE** cho bản cơ bản (style JSONB opaque). ✅
- **Caveat Word 2-cột** = quyết định: (a) chấp nhận "sidebar chỉ đẹp bản PDF, Word có thể 1 cột" (rẻ) HOẶC (b) dựng
  bản docx riêng cho sidebar bằng `<table>` (đắt) → **hỏi thầy**. Đề xuất (a) + badge.
- Thumbnail nhiều mẫu × data lớn = N lần `renderToStaticMarkup` mini → nhẹ (React render, không ảnh) — OK.

## ✅ CHỐT (thầy duyệt 2026-07-06)
- **Kiến trúc:** `CvStyle.template: CvTemplate` (`"classic"|"modern"|"sidebar"|"minimal"`, default `"classic"`) +
  `CvHtmlDocument` DISPATCHER. 3 tầng: field-render dùng chung (per-block) / layout riêng mỗi template / 1 nguồn export
  (`buildCvExportHtml` nguyên). **KHÔNG đụng BE** (style JSONB opaque, chỉ thêm field TS + `DEFAULT_CV_STYLE`).
- **Bộ mẫu = 4:** Cổ điển (default, 1 cột ATS-safe = renderer hiện tại) · Hiện đại (header band accent, 1 cột) ·
  **Hai cột** (sidebar trái compact + main phải — **kèm badge cảnh báo** "đẹp · có thể khó qua ATS/Word") · Tối giản
  (không màu, serif, whitespace). 3 single-column ATS-safe + 1 hai-cột-flag.
- **UI chọn = Hướng B — Modal "Thư viện mẫu":** 1 nút "Đổi mẫu CV" ở sidebar (mục "Mẫu") → mở **modal** grid
  thumbnail LỚN (CvHtmlDocument thu nhỏ + data thật) + tên mẫu + **badge ATS** (success cho 1-cột / warning cho 2-cột).
  Chọn → apply `template` → đóng. (KHÔNG dùng thumbnail-grid-in-sidebar — thầy chọn modal cho thumbnail to + chỗ cho
  badge.) Modal theo [[modal-body-no-padding-override-heroui-idiom]] + [[modal-header-tabs-indicator]] (header body-semibold).
- **Word 2-cột = chấp nhận PDF-only + badge** (KHÔNG dựng table-docx). Badge/hint mẫu Hai cột ghi rõ "2 cột đẹp nhất
  khi tải PDF; bản Word có thể về 1 cột". Rẻ, làm nhanh.

## ✅ ĐÃ DỰNG (2026-07-06)
- `types.ts`: `CvTemplate` + `CvStyle.template` + `CV_TWO_COLUMN_TEMPLATES` + `DEFAULT_CV_STYLE.template="classic"`.
- `CvHtmlDocument`: dispatcher `TEMPLATES` → 4 component (`ClassicTemplate` = layout cũ; `ModernTemplate` band accent;
  `SidebarTemplate` 2 cột full-width-header + aside 34% / main; `MinimalTemplate` mono `#111`). Padding chuyển từ root
  vào từng template; block-render primitives dùng chung. Backward-compat: doc cũ (`template` undefined) → classic =
  y hệt trước. **KHÔNG serif** cho minimal (tránh vỡ dấu tiếng Việt — [[fe-lint-no-next-img-directive-and-serif-polish]]).
- `CvTemplateGalleryModal` (mới): modal grid 4 thumbnail SỐNG (CvHtmlDocument thu nhỏ scale .34, `pointer-events-none`
  + `aria-hidden`) + tên + Chip ATS (success/warning) + hint Word cho 2-cột. Card = `div role="button"` (KHÔNG
  `<button>` — CvHtmlDocument có `<a>` credential → nested `<a>` trong button = HTML invalid) + Enter/Space.
- `CvEditor`: state `isTemplateModalOpen` + `onTemplateChange`; section "Mẫu" (`<Label>` + nút tertiary hiện tên mẫu)
  đặt TRÊN CÙNG sidebar (trên Phông chữ); render modal. i18n `cv.builder.template.*` vi+en.
- Verify: tsc + eslint + JSON parity sạch. ⚠️ **Chưa verify mắt** — dev-server bị session khác giữ lock (không start
  được server thứ 2); server đang chạy của thầy sẽ hot-reload.

## Kế next (`/starci-fe-ux-apply`) — bản gốc (đã làm theo)
1. `types.ts`: thêm `CvTemplate` + `CvStyle.template` + `DEFAULT_CV_STYLE.template = "classic"`.
2. `CvHtmlDocument/index.tsx`: tách 4 template component (Classic = code hiện tại; Modern/Sidebar/Minimal mới), reuse
   field-render primitives (`ExperienceBlock`/`SkillsBlock`…); root dispatch theo `doc.style.template`. Map block→
   sidebar/main cho template Hai cột (compact: personal/skills/languages/certification/interest → sidebar; narrative:
   summary/experience/project/education/achievement → main).
3. `CvTemplateGalleryModal` (mới, `components/features/profile/CV/CvBlocksWorkspace/CvTemplateGalleryModal`): grid
   thumbnail lớn + tên + `Chip` ATS badge (success/warning). Trigger = nút "Đổi mẫu CV" trong sidebar `CvEditor`
   (mục "Mẫu", đặt trên Phông chữ).
4. i18n `cv.builder.template.*` (tên 4 mẫu + badge ATS + hint Word 2-cột) vi+en.
5. Verify tsc/eslint + JSON parity.

## Refs

## Refs
- [Jobscan — ATS friendly formats 2026](https://www.jobscan.co/blog/20-ats-friendly-resume-templates/) · [Resume.io ATS templates](https://resume.io/resume-templates/ats) · [Novoresume ATS templates](https://novoresume.com/career-blog/ats-friendly-resume-templates) — 1 cột an toàn, 2 cột rủi ro parser.
