# CV Builder — block editor + live preview + deterministic trust score (2026-07-05)

> `/starci-fe-ux-brainstorm`. Nối tiếp toàn bộ chuỗi brainstorm/critique CV trong session (Round 1/2 critique,
> Hướng A revert, "rối rối" simplification). Đây là **thiết kế CHỐT cuối cùng** — thay thế mô hình "AI đọc CV rồi
> chấm điểm" bằng mô hình đơn giản hơn hẳn: **CV = tài liệu block-editor do user điền + AI chỉ hỗ trợ viết; điểm/
> trust = đếm hoạt động thật, tách biệt hoàn toàn khỏi nội dung CV.** KHÔNG code ở bước này.

## Business job (1 câu)
Giúp học viên biến thành tích StarCi thật thành 1 bản CV trình bày đẹp, đồng thời cho recruiter 1 tín hiệu tin cậy
**khách quan, không thể bịa qua văn phong** — vì tín hiệu đó không đến từ việc AI đọc CV, mà từ đếm trực tiếp dữ
liệu hoạt động thật.

## Vì sao bỏ hẳn "AI chấm CV" (quyết định đã chốt trong session)
- Toàn bộ 2 vòng phản biện (`CRITIQUE.md`) + phát hiện "Hướng A bị đảo ngầm" (`CV-VERIFIED-TRUST-TIER-WORKFLOW.md`)
  đều xoay quanh 1 câu hỏi gốc: *AI-judged prose score có đáng tin không, có gaming được không, source nào được
  tính*. **Câu trả lời cuối: bỏ hẳn AI-judged score, thay bằng đếm số** — mọi câu hỏi ở trên tự biến mất (không có
  gì để hallucinate vào, không có "revise bypass", không cần phân biệt verified/external LÚC CHẤM vì không còn
  chấm-bằng-AI nữa).
- `cv-scoring.service.ts` (rubric prose-quality) **KHÔNG dùng làm gate/trust nữa**. Có thể giữ lại làm feedback viết
  (bonus, không bắt buộc) hoặc bỏ hẳn — quyết định khi vào `/starci-fe-ux-apply`.

## Grounded — dữ liệu THẬT map vào block editor
| Block | Nguồn dữ liệu | Nhãn |
|---|---|---|
| Header (tên, liên hệ) | `users` (displayName, email, githubUsername, linkedinUrl, location) | — |
| **Kinh nghiệm/Dự án — pick từ StarCi** | `user_milestone_task_attempts` (passed=true) + `user_challenge_submission_attempts` (score not null) — ĐÚNG 2 nguồn `CvVerificationService` đã dùng | **Đã xác thực** |
| **Kinh nghiệm/Dự án — tự thêm** | Free text user gõ | **Tự khai** |
| Mô tả dự án (kể cả dự án pick từ StarCi) | Free text bổ sung trên mô tả gốc | Giữ nhãn của dự án gốc |
| Học vấn | Free text hoàn toàn | — (StarCi không có data học vấn) |
| Kỹ năng | Gợi ý từ tech-stack khóa đã học (`selectedLang` trên challenge submissions, course tags) + tự thêm | — (luôn tự khai, rủi ro thấp, không cần nhãn) |
| **Điểm/Trust** | `count(passed milestone tasks) + count(passed challenge submissions)` — TÁI DÙNG signal `CvVerificationService` đã build, đổi từ enum 3-mức sang số đếm | Điểm StarCi (internal) → Điểm tổng (public, fair, không show số thô) |
| Style/Theme | Font + accent color, áp vào **1 template LaTeX DUY NHẤT** (`latex.ts`) qua theme params | — |

## 3 hướng — chốt hướng 2

**1. Free-canvas WYSIWYG (Novoresume-style)** — preview LÀ editor, click thẳng vào preview để sửa.
Ref: [Novoresume — live edit từ preview](https://www.kickresume.com/en/help-center/10-best-resume-builders/).
Trade-off: ít thao tác hơn, nhưng khó nhét UI "pick từ StarCi + nhãn verified" vào 1 mặt giấy in-ready mà không rối.

**2. ⭐ Split-pane: form-trái (block editor) + preview-phải, đồng bộ real-time (Zety/Canva pattern)**
Ref: [Zety — chọn template rồi điền từng section](https://zety.com/) · [Canva — drag-drop editor + Magic Write AI](https://enhancv.com/blog/best-resume-builders/).
Trade-off: 2 pane cần đồng bộ state, nhưng đây **CHÍNH LÀ kiến trúc `CvWorkspace`+`CVPreview` đã có sẵn** trong repo
— rủi ro kỹ thuật thấp nhất, tách bạch rõ "nơi điền + nhãn verified" (form) khỏi "tờ CV sạch để in" (preview).

**3. Step-by-step wizard (Header→Experience→Education→Skills→Review)**
Trade-off: đơn giản cho lần đầu, nhưng mất phản hồi tức thời + không khớp "TopCV" mà thầy chỉ định.

**→ Chốt hướng 2.** Lý do: khớp đúng ref thầy nêu (TopCV/Zety/Canva) + tái dùng khung `CvWorkspace`/`CVPreview` sẵn
có (giảm rủi ro build) + tách bạch sạch "chỗ hiện nhãn verified/tự khai" (form) khỏi "CV sạch để tải" (preview).

## IA mới (thay `GenerateSection`/`UploadSection` cũ)
```
LEFT (form, block editor)                    RIGHT (live preview)
┌─────────────────────────────┐              ┌─────────────────────┐
│ Style: [Font ▾] [Accent ●●●]│              │                      │
├─────────────────────────────┤              │   <CV render live>   │
│ Kinh nghiệm / Dự án      [+]│  ──sync──▶   │   (client-side, KHÔNG│
│  [Pick từ StarCi ✓verified] │              │    chờ AI job)       │
│  [+ Thêm dự án ngoài]       │              │                      │
├─────────────────────────────┤              │                      │
│ Học vấn                  [+]│              │                      │
├─────────────────────────────┤              │                      │
│ Kỹ năng   [gợi ý chip] [+]  │              │                      │
└─────────────────────────────┘              └─────────────────────┘
       Điểm tổng: 82 (fair, mọi user)   ·   N dự án StarCi (badge, không show điểm nội bộ)
```
**Live preview KHÔNG còn phụ thuộc BullMQ job** cho phần cấu trúc — render trực tiếp từ block data (client hoặc
server-render nhanh). AI chỉ còn vai trò TÙY CHỌN: nút "✨ AI viết giúp" trên từng ô mô tả (như Canva Magic Write),
không phải "AI dựng cả CV" như model cũ.

## Empty / loading / error
- **Empty** (chưa có block nào): nudge "Pick 1 dự án StarCi đã hoàn thành" hoặc "Tự thêm kinh nghiệm"; preview hiện
  khung CV rỗng (không phải trắng trơn — có placeholder section).
- **Loading**: KHÔNG có cho phần cấu trúc (render tức thời); chỉ nút "AI viết giúp" per-block có spinner riêng,
  lỗi thì retry tại chỗ, không chặn phần còn lại của form/preview.
- **A11y**: mỗi block "Pick từ StarCi" là 1 combobox thật (không phải div giả); nhãn Verified/Tự khai đọc được bằng
  screen reader (không chỉ màu sắc).

## Cắt / thêm so với hiện tại
- **Cắt**: `extraPrompts` tự do (thay bằng block picker có cấu trúc) · BullMQ 4-step chờ AI cho MỌI lần sửa (chỉ
  còn optional cho "viết giúp" 1 đoạn) · `cv-scoring.service.ts` làm gate (nếu giữ, chỉ còn làm feedback phụ) ·
  `UploadSection` như 1 nhánh riêng (gộp vào — "pick project" thay thế hoàn toàn nhu cầu "upload file rồi AI đọc").
- **Thêm**: block picker "chọn dự án StarCi đã hoàn thành" (data đã có, chưa từng expose ra UI dạng picker) · style/
  theme param cho 1 template chung · điểm đếm hiển thị "Điểm tổng" + badge "N dự án StarCi" (ẩn số nội bộ).

## Nguồn
- [Kickresume — so sánh 10 resume builder 2026, Novoresume live-edit](https://www.kickresume.com/en/help-center/10-best-resume-builders/)
- [Zety — chọn template trước, điền section sau](https://zety.com/)
- [Enhancv — Canva drag-drop + Magic Write AI](https://enhancv.com/blog/best-resume-builders/)
- Nội bộ: `CRITIQUE.md` (Round 1/2) · `CV-VERIFIED-TRUST-TIER-WORKFLOW.md` (Hướng A, `CvVerificationService` signals
  tái dùng cho điểm đếm) · kiến trúc sẵn có `CvWorkspace`/`CVPreview`.

---

## CHỐT CUỐI (2026-07-05, thầy duyệt "xúc") — hệ block lặp-được + verified = capstone-only

Sau nhiều vòng thu hẹp trong session, mô hình **chốt để dựng**:

### Layout — hướng A (toolbar-led, TopCV/Zety)
- **1 form dài bên TRÁI** (block editor) + **preview live bên PHẢI** (client-side, KHÔNG chờ BullMQ cho phần cấu trúc).
- **1 toolbar trên cùng** gánh: `Font ▾` · `Accent ●●●` · badge **Điểm tổng** · nút **Tải PDF**.
- Cột form = **stack các block, mỗi block LẶP ĐƯỢC NHIỀU MỤC** (thêm N dự án, N kinh nghiệm, N học vấn…). Mỗi section
  có "+ Thêm mục"; cuối form có "+ Thêm block" (Chứng chỉ, Ngôn ngữ, Hoạt động…).
- Mobile: split-pane không vừa → tab `Sửa | Xem` (1 form, 1 preview).

### Bộ block + nguồn + điểm (BẢNG CHỐT)
| Block | Nguồn dữ liệu | Nhãn | Tính điểm? |
|---|---|---|---|
| **Dự án** | pick **capstone** (`user_milestone_task_attempts.passed=true`) = **Đã xác thực** · + tự thêm dự án ngoài = **Tự khai** | mỗi mục có nhãn riêng | ✅ **CHỈ block này tính điểm** (chỉ mục Đã xác thực) |
| **Kỹ năng** | gợi ý từ tech-stack khóa đã học (course tags / `selectedLang`) + tự thêm | — | ❌ trình bày |
| **Thông tin cá nhân** (bắt buộc) | `users` (displayName, email, githubUsername, linkedinUrl, location) | — | ❌ |
| **Kinh nghiệm** (công ty A, B…) | tự khai | Tự khai | ❌ |
| **Học vấn** (trường) | tự khai | — | ❌ |
| **Thành tích** | tự khai (giải thưởng ngoài) | Tự khai | ❌ |
| **Tóm tắt / Mục tiêu** | tự khai + ✨ AI viết giúp | — | ❌ |

### Đã LOẠI khỏi CV (thầy chốt — "không legit")
- **Thành tích StarCi** (leaderboard rank · coding count · badge) = vanity, recruiter không tin → **KHÔNG lên CV**
  (chỉ còn "Thành tích" dạng tự-khai cho giải thưởng ngoài). **KHÔNG tính điểm.**
- **Challenge** = bài tập, quá vụn → **KHÔNG ghi vào CV** dưới bất kỳ dạng nào, **KHÔNG tính điểm**.

### Điểm / Trust (verified content = verified score, 1 NGUỒN)
- **Điểm tổng CHỈ đến từ capstone dự án đã pass** (mục "Đã xác thực" trong block Dự án). Không AI đọc CV, không văn
  phong, không challenge, không thành tích, không tự-khai. → gõ thêm chữ / thêm khóa yếu KHÔNG kéo điểm
  (count-independent theo tinh thần `fair-monetization-axiom`; step-value/threshold vẫn placeholder — "khoan check
  điểm thật").
- **Hệ quả BE (phải sửa trong bước dựng):**
  1. `CvVerificationService` — **bỏ nhánh challenge** (`ActivityBacked` từ graded-challenge) khỏi việc feed **điểm**:
     `resolveLevel`/`resolveLevelForCourse` chỉ còn xét capstone (passed milestone task). (rankOf/marketplace tie-break
     có thể giữ enum, nhưng `scoreOf` cho gate/job-readiness chỉ dựa capstone.)
  2. `consultant-contact-gate.service.ts` + `job-readiness.service.ts` — **source-blind** (giữ Hướng A, gỡ filter
     `source='generated'` của commit `524e0389` nếu còn) + điểm = capstone-only score.
  3. Query mới `myPickableCvAchievements` — **CHỈ trả capstone** (milestone task attempts passed); **bỏ phần
     challenge submissions** (đã lỡ thêm vào draft, phải gỡ).
  4. `cv-scoring.service.ts` (AI-judged prose) — **KHÔNG gate gì nữa**; giữ lại chỉ như feedback viết tùy chọn hoặc
     bỏ (quyết trong lúc dựng — mặc định: không gọi ở luồng mới).

### AI thu về vai TÙY CHỌN
- Không còn "AI dựng cả CV". Chỉ còn nút "✨ AI viết giúp" per-block (cải thiện câu chữ mô tả) — spinner riêng,
  lỗi retry tại chỗ, không chặn form/preview.

---

## CHỐT AI + PERSISTENCE (2026-07-05, thầy làm rõ) — entity `cvBlocks`, AI per-block, KHÔNG chấm cả CV

### Persistence — entity MỚI `cvBlocks` (thầy chọn "bảng mới riêng", tên `cvBlocks`)
- **`CvBlocksEntity`** (table `cv_blocks`): 1 row = 1 CV-document user sở hữu (nhiều CV/user, có `label` — khớp
  document-tabs [[cv-document-tabs-combined-toolbar-leftend]]).
  - `user` (FK CASCADE) · `label` (tên CV) · `blocks` (jsonb — mảng block có thứ tự) · `style` (jsonb — `{font, accent}`)
    · `pdfCdnKey` (nullable — PDF render gần nhất) · timestamps (`UuidAbstractEntity`).
  - **`blocks` jsonb** = mảng `{ id, type, title, order, items: [...] }`. FE sở hữu schema block (TS types); BE lưu
    JSONB + validate nhẹ. Item block "Dự án" mang `source: 'verified'|'self'` + `sourceRef` (capstone attempt id khi verified).
- **Tách khỏi `cv_generations` cũ** (đó là AI-job history). `cvBlocks` = document user-authored. `cv_generations` +
  `cv-scoring.service.ts` (AI-judged prose) **không còn gate/score gì** ở luồng mới.

### AI = ĐÚNG 2 việc, đều CẤP BLOCK (bỏ hẳn "AI level/chấm cả CV")
1. **AI TÁCH CV → blocks (ingest path):** user dán CV tự viết (text/upload) → 1 AI step **parse → mảng block có cấu
   trúc** (header/summary/experience/education/skills/project). Cho ai đã có CV sẵn, khỏi gõ lại từ đầu.
2. **AI SỬA nội dung 1 BLOCK, grounded RAG (per-block assist):**
   - Block dự án **tự khai** ("làm dự án A") → AI viết/gọt mô tả block đó (RAG trên input + ngữ cảnh chung).
   - Block dự án **StarCi** (pick capstone) → AI viết mô tả **theo RAG trên dữ liệu capstone THẬT** (moat StarCi:
     Canva/Rezi không có bằng chứng từ khóa học). Dùng `RagModule` (global sẵn) + local-first free tier
     ([[ai-local-first-free-tier-tasks]]).
- **KHÔNG có** AI đọc-chấm-điểm cả CV, KHÔNG có holistic score/level. Điểm = capstone count deterministic
  (`CvVerificationService.scoreOf`, capstone-only — đã sửa BE) → tách hoàn toàn khỏi AI.

### Thứ tự dựng (verify từng bước)
1. **BE `CvBlocksEntity` + enum + CRUD** (create/get/list/update/delete 1 cv-blocks document) — bounded, tsc-verify.
2. **BE AI-split** (text → blocks) + **BE AI-edit-block RAG** (per-block rewrite) — processor/mutation.
3. **FE**: query/hook (đã có pickable capstone) + block editor big-form + live preview client-side + toolbar
   (font/accent + Điểm tổng badge + Tải PDF) + document tabs.
4. **PDF**: map `blocks` → 1 template LaTeX chung → tectonic (tái dùng pipeline compile đã có).

---

## FROZEN CONTRACT (2026-07-05) — cho 2 workflow parallel (BE Opus · FE Sonnet)

### Render = PDF THẬT (thầy: "dùng pdf render")
- Preview + export = **PDF thật**: blocks+style → **1 template LaTeX chung** → **tectonic** (BE, đã verify) → MinIO →
  FE hiển thị bằng **`react-pdf` viewer** (đã có dep). Preview **debounced** (~1-2s sau khi sửa), KHÔNG HTML-mock,
  KHÔNG BullMQ (render đồng bộ, không queue). Deps FE: `react-pdf`/`pdfjs-dist`/`pdf-lib` (KHÔNG tiptap — bỏ tiptap).

### DB (BE workflow tự chọn JSONB vs normalized, MIỄN giữ đúng GraphQL API dưới)
- CV document table (`cvs` hoặc giữ `cv_blocks` doc) — per-user, **nhiều CV/user, KHÔNG course_id**. Mỗi CV = nhiều block.
- Block: `{ id, type, title, order, items[] }`; item dự án mang `source:'verified'|'self'` + `sourceRef`(capstone attempt id).

### GraphQL API ĐÔNG CỨNG (FE code against cái này; BE phải khớp tên + shape)
- **`myCvBlocks: [CvBlocksDocument]`** (đã có) — list CV doc của user. `CvBlocksDocument { id, label, blocks(JSON), style(JSON), pdfCdnKey, createdAt, updatedAt }`.
- **`myPickableCvAchievements: { milestoneTaskAttempts[] }`** (đã có) — capstone pick source.
- **`createCvBlocks(request:{label?,blocks?,style?}) -> CvBlocksDocument`** (đã có).
- **`updateCvBlocks(request:{id,label?,blocks?,style?}) -> CvBlocksDocument`** (đã có, autosave).
- **`deleteCvBlocks(request:{id}) -> {id}`** (đã có).
- **MỚI `splitCvFromText(request:{text}) -> { blocks(JSON) }`** — AI parse CV text → mảng block (KHÔNG persist; FE nhét vào editor).
- **MỚI `rewriteCvBlock(request:{block(JSON), capstoneAttemptId?, instruction?}) -> { block(JSON) }`** — AI RAG rewrite 1 block (RAG trên capstone thật nếu có `capstoneAttemptId`).
- **MỚI `renderCvBlocks(request:{id}) -> { pdfUrl, pdfCdnKey }`** — render doc hiện tại → PDF (LaTeX→tectonic→MinIO presigned url).

### Trust score = capstone count (deterministic, đã xong: `CvVerificationService.scoreOf` capstone-only, gate source-blind).

### Layout = split-pane toolbar-led (hướng A): toolbar[font/accent · badge Điểm tổng · Tải PDF] · form-trái stack block lặp-được · preview-phải react-pdf.
### AI = 2 việc per-block: (1) splitCvFromText ingest · (2) rewriteCvBlock RAG. KHÔNG chấm/level cả CV.

---

## PIVOT: RENDER = HTML-FIRST (2026-07-06, thầy chốt) — PDF + Word + preview tức thì

Bỏ LaTeX/tectonic cho luồng CV (thầy: *"layout đẹp hơn, download pdf + word, opensource như tiptap"*). TipTap tự
export = TRẢ PHÍ → dùng OSS: Puppeteer (PDF) + html-to-docx (Word). BE **đã có `puppeteer` ^24.40.0** (chromium sẵn),
chỉ thêm `html-to-docx`.

### Kiến trúc (1 template HTML = 1 nguồn)
- **FE CV template** = 1 React component self-contained (inline style + font kiểm soát) render block data. **1 NGUỒN duy nhất.**
- **Live preview** = render component đó ở pane phải → **tức thì, client-side** (KHÔNG react-pdf, KHÔNG server round-trip).
- **Export** = FE serialize HTML của template → gửi BE convert (BE = converter "câm", KHÔNG có template riêng → hết drift):
  - **PDF**: Puppeteer (đã có) HTML→PDF (text-based, ATS-friendly) → MinIO → url.
  - **Word**: `html-to-docx` (thêm dep) HTML→.docx → MinIO → url.
- **Rich-text mô tả block** (bullet/bold): TipTap core (MIT, OSS) — output HTML chảy vào template. (Optional pha sau; v1 dùng TextArea thường cũng được.)

### Đổi so với bản LaTeX (chỉ tầng render/preview/export; editor+AI+data+score GIỮ NGUYÊN)
- **BE**: `renderCvBlocks` (LaTeX/tectonic, workflow vừa build) → **thay ruột** thành `exportCvBlocks(id, format: PDF|DOCX)` (hoặc nhận `html`): Puppeteer PDF + html-to-docx DOCX. `map-blocks-to-latex.ts` → bỏ/thay bằng map-blocks-to-html (hoặc FE gửi HTML). Thêm dep `html-to-docx`.
- **FE**: preview react-pdf → **HTML component tức thì**; toolbar "Tải PDF" → thêm "Tải Word"; bỏ setup pdfjs worker.
- **Giữ**: `splitCvFromText`, `rewriteCvBlock` (AI), CRUD, `myPickableCvAchievements`, score capstone-only, block editor form.

### API cập nhật
- Thay `renderCvBlocks -> {pdfUrl,pdfCdnKey}` bằng **`exportCvBlocks(request:{id, format}) -> { url, cdnKey, format }`** (PDF hoặc DOCX). Preview KHÔNG cần API (FE tự render HTML).

### Refactor sau khi FE workflow (đang chạy) xong — tránh giẫm file editor.

---

## CHROME REDESIGN editor (2026-07-06, thầy chốt Direction A) — sidebar full-height + tên CV + funnel khóa

Feedback màu trên ảnh → redesign chrome `CvEditor`:
- **Rail style → SIDEBAR full-height** (`<aside>` bordered `bg-surface` `lg:h-full` scroll riêng): Phông (dropdown) + Màu nhấn + "Dán CV có sẵn" (dời từ top bar xuống) + (ghim đáy `mt-auto`) trust/CTA.
- **Top bar** = `BackLink` + **tên CV sửa được** (TextField giữa, flex-1 — lấp ô trống "nâu", autosave label) + **Tải Word / Tải PDF** (export giữ nổi bật top-right).
- **Trust = empty-state funnel khóa (rule [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]]):** `capstoneCount>0` → Chip "N dự án đã xác thực"; `=0` → **`Callout` CTA** "Chưa có dự án xác thực → Vào khóa học" (`pathConfig().course().build()` = `/courses`). Đúng North Star: rỗng = kéo về học khóa, không ngõ cụt.
- 12 font (dropdown) + 11 block (thêm Chứng chỉ/Ngôn ngữ/Hoạt động/Sở thích) + ScrollShadow (blocks + preview) đã có từ pass trước.

---

## SHELL v2 (2026-07-06, thầy chốt) — toolbar = navbar bottom-layer · sidebar full-height flush · route full-bleed

Tham chiếu = learn shell (Mục lục khoá học). Feedback: bỏ divider giữa navbar và toolbar → toolbar LÀ 1 phần navbar.
- **Toolbar (← Trở lại · tên CV · Word/PDF) → navbar bottom-layer** qua `useRegisterNavbarBottomLayer` (mirror DashboardTabsBar/ProfileTabsBar). Navbar (`<nav>` sở hữu 1 `border-b` dưới lớp cuối) render lớp này dính liền dưới row → KHÔNG divider giữa.
  - Node bottom-layer render TRONG subtree Navbar → chỉ đọc được provider global → **dùng store zustand `cvEditorToolbar`** giữ `{label, canExport, exportingFormat, onBack, onLabelChange, onExport}`. Node = `CvEditorToolbarBar` ĐỨNG YÊN (`useMemo(()=><Bar/>,[])`) đọc store → cập nhật live, KHÔNG remount (giữ focus ô tên). CvEditor sync state vào store + register node; clear on unmount.
- **Sidebar full-height flush-trái** `sticky top-16 h-[calc(100dvh-4rem)] border-r border-separator overflow-y-auto p-6` (kiểu `elements/sidebar.md` §4). Chứa Phông + Màu + Dán CV + CTA khóa (đáy). Route full-bleed → aside chạm mép trái.
- **Content** = blocks + preview (ScrollShadow cuộn riêng), `p-6`.
- **Route `/profile/cv/[cvId]` full-bleed** (bỏ `mx-auto max-w-[1400px] px-6 py-6` — shell tự lo layout + padding).
