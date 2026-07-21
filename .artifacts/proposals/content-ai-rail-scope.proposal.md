# Proposal — Content-AI: mô hình PHIÊN-THEO-SCOPE + taxonomy scope + gate assessment

> Nguồn: thầy 2026-07-20 (nhiều vòng). Chốt mô hình: **một phiên = một (scope + đích)**, không carry thread giữa scope. Thay `content-ai-rail-scope` bản cũ (scope 4 lớp) — bản này rộng hơn: 4 scope grounding + đoạn-universal + gate assessment + BE RAG cho foundations + query task-focused.

## 0. Mô hình phiên (thầy duyệt qua prototype `session-model.html`)

**Một phiên = một (scope + đích).** Mỗi cửa vào ngữ cảnh sinh phiên riêng.
1. Phiên **sinh khi hỏi câu ĐẦU** trong scope (không đẻ phiên rỗng lúc vừa vào).
2. Quay lại scope cũ → **mở lại đúng phiên đó** (không tạo trùng).
3. Đổi scope → phiên cũ **giữ trong lịch sử**. Liên tục giữa scope đến từ **danh sách lịch sử**, KHÔNG từ carry-thread.
4. **Bôi đen → phiên riêng, born-archived** (không rác list, search vẫn thấy).

**⚠️ ĐẢO đợt-1:** carry-thread + divider (`contextMarker`, `messagesRef`, `carried` trong `ContentAiChat/index.tsx`) PHẢI GỠ. Liên tục giờ do history lo.

## 1. Taxonomy scope (chốt 2026-07-20)

**Nguyên tắc:** surface có chữ đọc được → có **[scope đầy đủ]** + **[🔖 Đoạn]**. Đoạn kế thừa grounding surface cha + passage, born-archived.

| Surface | Scope | +Đoạn | RAG | Việc |
|---|---|---|---|---|
| Bài đọc (content) | 📖 Bài | 🔖 | ✅ content+code | FE |
| **Foundation (Nền tảng)** | 📖 như bài | 🔖 | ❌ **CHƯA index → mở BE** | **BE + FE** |
| Task capstone (personal-project) | 🎯 Task | 🔖 | ✅ milestone | BE query + FE |
| Thử thách (challenge) | 📖/🎯 | 🔖 | ✅ challenge | FE |
| Mind-map · Leaderboard · Việc làm · Playground · Học thẻ · Trang khoá | ✦ Khoá | — | RAG khoá gồm hết | FE |
| Hỏi nhanh LIVE · Phỏng vấn LIVE | 🔴 chat TẮT | — | — | gate FE |

**4 scope grounding:** 📖 Bài · 🔖 Đoạn · 🎯 Task · ✦ Khoá. **1 gate:** assessment-live.

## 2. BE — RAG cho foundations (⚠️ ĐÍNH CHÍNH: foundation KHÔNG course-scoped)

**Phát hiện khi scan:** foundation KHÔNG như bài. Nó thuộc **CATEGORY** (`@ManyToOne foundation-category`, "Parent category this foundation belongs to"), **không có courseId**, nội dung ở **Postgres** (`foundation-translation` EAV `field`/`value` theo locale), KHÔNG phải MinIO. Route `/courses/[courseId]/learn/foundations/[categoryId]/[foundationId]` duyệt trong khoá nhưng entity là thư viện global.

⇒ Không mirror-milestone-vào-course-RAG được (không có courseId để gắn; course-retrieval lọc `metadata.courseId` sẽ không thấy).

**Cách đúng — course-agnostic, ground theo `foundationId` bằng SINGLE-DOC retrieval:**
1. Indexer: walk `FoundationEntity` + translations (gated `CONTENT_RAG_INDEX_FOUNDATIONS_ENABLED` default true) → `collectFoundationDocs(id)` ghép text từ title + description + `foundation-translation.value` (Postgres, KHÔNG s3) → chunk `kind: "content"`, `metadata.contentId = foundationId`, **KHÔNG courseId** (hoặc sentinel).
2. Grounding: `resolveFoundationGrounding({ foundationId })` = `retrieveExcerpt({ contentId: foundationId })` — dùng lại single-doc retrieval (line 181 `must: metadata.contentId`), KHÔNG cần course. Foundation ≈ "bài lẻ độc lập".
3. `buildSystemPrompt` xử foundation như lesson (đọc 1 tài liệu). FE foundation page → gửi `foundationId`, BE route sang foundation grounding (không phải lesson — foundation không phải ContentEntity).

## 3. BE — query RAG task-focused (viết query)

Máy đã sẵn: `retrieveExcerpt` filter `must: metadata.contentId = value`. Milestone chunk viết với `contentId = taskId` (chung id-space).
**Việc:** `resolveTaskGrounding({ taskId })` — gọi `retrieveExcerpt({ contentId: taskId })` (hoặc `retrieveCourseExcerpt` + filter kind `milestone` + id) → lấy chunk đề/brief/criteria của task → build context. `buildSystemPrompt` thêm nhánh scope `task`: *"mentor cho ĐÚNG task capstone này, đề + tiêu chí đây, hỗ trợ không làm hộ."* DTO/socket nhận `taskId`. Entitlement: capstone enrolled-only.

## 4. FE — build

### 4a. Mô hình phiên theo scope
- `ChatContextScope`: `"lesson" | "course" | "task" | "outside"` (đoạn là overlay trên lesson/task, không phải scope thứ 5).
- Bỏ carry-thread: `useEffect([scopeKey])` — đổi scope-key → KHÔNG carry, resume phiên của scope đó (auto-select theo scope+đích) hoặc rỗng.
- Scope-key = hàm của `(contentId | taskId | courseId | selection)`. Đổi scope-key ⇒ đổi phiên.

### 4b. Grounding gửi lên đúng scope
`onSend` gửi `{ contentId?, taskId?, courseId? }` theo scope active. Task page → gửi `taskId`.

### 4c. Selection universal (tổng quát binding)
`ContentAiSelectionAsk` hiện hard-bind `#lesson-article` (`ARTICLE_ID`, `article.contains`). Tổng quát → marker dùng chung `[data-ai-selectable]`; gắn attribute vào vùng-chữ của: lesson body, foundation body, task brief, challenge brief. Selection-ask hiện trên mọi vùng có marker.

### 4d. Selection = born-archived
Phiên đoạn tạo với `archived_at = now()` sẵn (cần cột archive — xem 4e). Không hiện list mặc định; search quét cả archived.

### 4e. Rename + Archive (BE + FE)
- Cột `content_ai_sessions.archived_at timestamptz NULL` (synchronize-safe) + mutation `setContentAiSessionArchived` + `renameContentAiSession` (UPDATE title thẳng, rỗng→NULL). `sessions(includeArchived=false)`. Search quét cả archived.
- UI hàng lịch sử: dòng-2 = `originContentTitle ?? "Cả khoá" · N lượt` (đã làm đợt 1); nút xoá hover → overflow menu ⋯ (Đổi tên · Lưu trữ · Xoá).

### 4f. Gate assessment-live
`learn/layout.tsx:213` render `<ContentAiFab />` vô điều kiện. Thêm gate: ẩn FAB + không mở rail khi `isFlashcardQuizLive || isMockInterviewLive` (+ coding solve nếu thầy chốt). Sau buổi (scorecard) mở lại scope ✦ khoá.

### 4g. Chip theo scope + relayout 3 zone
Đã làm đợt 1 (chip `EMPTY_STATE_SKILLS`/`retrievalLabelKey`, pill lên header). Giữ. Thêm chip scope task.

## 5. Files to touch

**BE (`starci-academy-backend/src`):**
- `modules/rag/content-rag-index.service.ts` — index foundation
- `modules/rag/content-rag-retrieval.service.ts` — (nếu cần) helper task retrieval
- `modules/env/config.ts` — flag `indexFoundations`
- `modules/bussiness/content-ai/content-ai.service.ts` — `resolveTaskGrounding` + `resolveFoundationGrounding` (hoặc treat như content) + `buildSystemPrompt` nhánh task + DTO `taskId`
- entity `content-ai-session` — `archived_at` + mutation rename/archive + `includeArchived`

**FE (`starci-academy`):**
- `ContentAiChat/index.tsx` — scope-key model, gỡ carry-thread, gửi taskId, chip task
- `ContentAiChatRail` — (đã 3-zone)
- `ContentAiSelectionAsk/index.tsx` — marker dùng chung
- `app/[locale]/courses/[courseId]/learn/layout.tsx` — gate assessment + `data-ai-selectable` trên các surface
- `ContentAiFab/index.tsx` — gate assessment
- lesson/foundation/task/challenge body components — gắn `data-ai-selectable`
- history row overflow menu (rename/archive/delete)
- `messages/{vi,en}.json`

## 6. Verify plan
- BE: reindex → query "đề task này cần gì" trên task page trả lời đúng brief task (không lẫn bài khác nếu filter taskId). Foundation: hỏi trên foundation trả lời từ nội dung foundation.
- FE: đổi scope (bài→khoá→task→đoạn) mỗi cái một phiên, history tích đúng; đoạn không hiện list (born-archived) nhưng search thấy; quiz/phỏng vấn live KHÔNG có FAB; rename/archive chạy.
- `tsc` + eslint sạch cả 2 repo; BE runtime verify (boot postgres+qdrant+minio).

## 7. Prototype
`.artifacts/prototypes/content-ai-rail-scope/session-model.html` (:8080) — mô hình phiên theo scope, thầy đã duyệt.
