# Proposal — CV "full LaTeX" render (đảo pivot HTML-first → LaTeX, 1 template, `.tex` sửa được)

> Status: ⏳ PENDING · Trigger: thầy `/starci-fe-feedback` 2026-07-18 — *"tính năng cv mất rồi à? tạo cv ở profile ấy. nhưng mà render full latex nhé"*. Scope chốt qua AskUserQuestion: **LaTeX cho CẢ preview + export** · **1 template thôi, xuất `.tex` để user sửa sau**.

## 1. Trả lời "CV mất rồi à?" — KHÔNG mất
- Route sống: `/profile/cv` (`src/app/[locale]/profile/cv/page.tsx` → `<Cv/>`), components `features/profile/CV/{CvGallery,CvBlocksWorkspace,CvEditor}`.
- Tab "CV" ở `PublicProfile/ProfileTabsBar` là **owner-only** (`filter(tabId !== "cv" || isSelf)`) + route riêng `/profile/cv` (KHÔNG `/profile/<username>/cv`). "Thấy mất" nhiều khả năng do đang xem profile người khác / entry-widget đổi. Tool nguyên vẹn.

## 2. Hiện trạng render — HTML-first (đã PIVOT BỎ LaTeX)
- Data: `cv_blocks` (JSONB block-document: `blocks[]` sections/items + `style{font,accent,fontScale,language,template}`), 4 template HTML (`classic/modern/sidebar/minimal`).
- Render: **`CvHtmlDocument`** = 1 React render inline-style → nguồn CHUNG cho live-preview (`CvHtmlPreview`, client) **và** export.
- Export (BE `render-cv-blocks.handler.ts`): "dumb converter" — FE gửi HTML self-contained → **PDF qua Puppeteer** (`page.setContent`+`page.pdf` A4), **DOCX qua `html-to-docx`**. Upload MinIO, trả presigned URL, lưu `pdfCdnKey` lên row.
- ⚠️ **Đã từng có tectonic/LaTeX rồi BỎ**: handler ghi rõ *"No LaTeX/tectonic anymore — PIVOT: RENDER = HTML-FIRST"* (`CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md`, doc đã xóa). Code tectonic cũ CÒN trong git history (commits chứa `tectonic`/`documentclass`) → **tái dùng làm tham chiếu**.
- ⚠️ **STALE doc-comment**: `mutation-render-cv-blocks.ts` (FE) vẫn ghi *"blocks+style → 1 shared LaTeX template → tectonic → MinIO"* — SAI so với impl thật (Puppeteer). Sẽ đúng lại nếu đảo pivot.

## 3. Target (scope thầy chốt)
**Đảo pivot về full LaTeX**, nhưng gọn hơn bản cũ:
- **1 template `.tex` DUY NHẤT** (không 4 template).
- **`.tex` là artifact user SỬA ĐƯỢC**: sinh `.tex` ban đầu từ block-document (1 template), rồi user chỉnh trực tiếp LaTeX → compile lại. `.tex` được persist.
- **LaTeX cho CẢ preview + export**: preview = PDF compile server-side (debounced khi gõ), export = chính PDF đó (+ tải `.tex`).

## 4. Kiến trúc đề xuất
**BE (đảo pivot):**
1. **Engine LaTeX = `tectonic`** (1 static binary, tự tải package theo nhu cầu — nhẹ để nhét Docker image `core`, KHÁC texlive ~4GB). Thêm vào Dockerfile core. ⚠️ **đổi Docker image = ảnh hưởng deploy** — cần thầy duyệt trước.
2. `render-cv-blocks.handler`: nhận **`.tex`** (thay `html`) → `tectonic` compile → PDF → MinIO → presigned URL. Bỏ nhánh Puppeteer (hoặc giữ DOCX riêng nếu vẫn cần Word — HỎI).
3. `cv_blocks` entity: thêm cột **`tex_source` (text)** — persist LaTeX user đã sửa. Migration additive an toàn (ADD COLUMN nullable).
4. **1 template `.tex`** + generator `block-document → .tex` (chạy 1 lần để seed `tex_source`, sau đó `tex_source` là nguồn sự thật).

**FE:**
1. **Editor `.tex`** (CodeMirror — đã có trong app từ mock-interview) trong `CvBlocksWorkspace`: user sửa LaTeX.
2. **PDF preview** compile-on-change (debounce ~1-2s → `renderCvBlocks` → nhận presigned PDF URL → render qua `<embed>`/`pdf.js`). Thay `CvHtmlPreview`.
3. Block-editor: giữ để sinh `.tex` ban đầu, hay **bỏ hẳn** chuyển sang thuần .tex? → HỎI (xem §6).
4. `CvHtmlDocument`/`CvHtmlPreview` retire hoặc giữ cho "generate initial .tex".

## 5. Files to touch
- **BE**: `render-cv-blocks.handler.ts` (Puppeteer→tectonic) · `graphql-types/request.ts` (`html`→`tex`) · `cv-blocks.entity.ts` (+`tex_source`) + migration · Dockerfile core (+tectonic) · template `.tex` + generator service · (git history: khôi phục logic tectonic cũ).
- **FE**: `CvBlocksWorkspace` (editor .tex + PDF preview) · `mutation-render-cv-blocks.ts` + types (`html`→`tex`) · `cv-blocks.ts` query type (+`texSource`) · retire/repurpose `CvHtmlDocument`/`CvHtmlPreview` · sửa STALE doc-comment.

## 6. Quyết định (thầy CHỐT 2026-07-18 — build luôn)
1. **Block-editor GIỮ** (option a) — "build cv by block trở lại": block-editor sinh `.tex` ban đầu → user sửa `.tex` trực tiếp. 2 chế độ.
2. **BỎ Word** — export chỉ PDF (tectonic) + tải `.tex`. Bỏ nhánh `html-to-docx`/Puppeteer.
3. **DUYỆT đổi Docker core (+tectonic)** — deploy-affecting, thầy OK.
4. **BUILD LUÔN** — BE+FE phối hợp, session này.

## 7. Bàn giao
- Route build: **BE+FE phối hợp** (không thuần `starci-fe-build` — có Docker/entity/migration). Sau khi thầy chốt §6 → build.
- Tham chiếu: git history tectonic (commits `tectonic`/`documentclass`) · `render-cv-blocks.handler.ts` (impl hiện tại) · `CV/types.ts` (data model, doc-comment còn nhắc "LaTeX/PDF mapping").
