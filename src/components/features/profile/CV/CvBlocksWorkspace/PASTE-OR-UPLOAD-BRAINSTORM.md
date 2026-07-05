# Brainstorm — "Dán CV có sẵn" + "Chỉnh theo tin tuyển dụng": thêm mode UPLOAD FILE cạnh paste (2026-07-06)

Both modals (`CvSplitFromTextModal` — "Dán CV có sẵn" / `CvTailorToJobModal` — "Chỉnh theo tin tuyển dụng") currently
accept ONLY pasted text. Thầy: cả 2 nên có thêm cách nhập **file** (CV file cho modal 1, JD file cho modal 2), cạnh
"dán văn bản".

## Legacy/BE research (grounded, not invented)
- The OLD "upload CV" flow (`cv_generations.source='uploaded'`) is being phased out (superseded by this block editor —
  `CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md`), but its low-level **text-extraction utility still exists and works**:
  `extract-cv-text.ts` (BE, `src/features/api/processors/ai/generate-cv/steps/`) — `.pdf` → `pdf-parse`, `.docx` →
  `mammoth`, else → raw UTF-8. This is generic (buffer + extension → text), not CV-specific in mechanism — reusable
  for a job-description file too.
- Existing generic upload UI: `components/reuseable/Dropzone` (wraps `react-dropzone`, configurable
  `acceptedMimeTypes`/`maxSizeInBytes`) — already used by the old CV-upload flow (10MB, PDF + text). **Reuse this
  component as-is** (consuming an existing shared primitive, not writing new code into `reuseable/`).
- Existing presigned-URL infra (`useMutateGenerateSubmitCvPresignUrlSwr` → axios PUT → MinIO) can front the raw file
  upload; the NEW piece needed is a small BE mutation that takes the uploaded `cdnKey` and returns extracted text
  (wrap the existing `extractCvText()` util) — kind-agnostic (CV or JD), so ONE new mutation serves both modals.
  **This is genuinely new BE work — flag it, don't fake a client-side PDF parser** (bundle cost + duplicates BE logic).

## Decision — shared "paste or upload" sub-component
- **1 mode toggle inside each modal: "Dán văn bản" | "Tải file lên"** — `SegmentedControl` (2 fixed options, local
  view swap; mirrors the mobile Sửa|Xem toggle already in `CvEditor`). NOT tabs (this isn't navigation, it's an input
  METHOD choice for the same field).
- **Extract ONE shared component** `CvTextOrFileInput` (`CV/CvBlocksWorkspace/shared/`) used by BOTH modals — props:
  `{ mode, onModeChange, textValue, onTextChange, textLabel, textPlaceholder, dropzoneLabel, acceptedKinds, onFileExtracted }`.
  - `mode="paste"` → existing `TextArea` (unchanged).
  - `mode="upload"` → `Dropzone` (existing shared primitive) → on drop: presign → PUT to MinIO → call the NEW
    `extractDocumentText(cdnKey)` mutation → `onFileExtracted(text)` writes the SAME `textValue` state the paste
    mode uses. **User still sees the extracted text and can edit it before submitting** (transparency — same
    "không lưu tự động, bạn xem lại rồi mới lưu" promise both modals already make).
  - Submit button + downstream mutations (`splitCvFromText` / `tailorCvBlocks`) **unchanged** — they only ever see
    text, regardless of which mode produced it.
- File constraints: PDF / DOCX / TXT, 10MB (mirrors the old CV-upload zod limit — same ceiling for JD files).

## Why NOT other options considered
- **2 separate buttons instead of a toggle** — rejected: reads as 2 different actions instead of 1 field with 2 input
  methods; toggle keeps the modal single-purpose.
- **Client-side PDF/DOCX parsing (pdf.js/mammoth-browser)** — rejected: duplicates working BE logic, adds ~200KB+ to
  the client bundle for a rarely-used path, and BE extraction is already proven (used since the old upload flow).

## What's new vs reused
| Piece | New or reuse |
|---|---|
| `Dropzone` (drag-drop UI) | REUSE `reuseable/Dropzone` |
| Presign + PUT to MinIO | REUSE existing CV presign mutation infra |
| Text extraction (PDF/DOCX→text) | REUSE `extractCvText()` util, wrapped in 1 NEW mutation `extractDocumentText(cdnKey)` |
| Mode toggle | REUSE `SegmentedControl` block |
| `CvTextOrFileInput` shared component | NEW (thin composition of the above) |

Apply via `/starci-fe-ux-apply` once thầy confirms the direction.
