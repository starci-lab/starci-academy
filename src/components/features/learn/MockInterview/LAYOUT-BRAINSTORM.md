# Layout Brainstorm — Mock Interview: đóng vòng demand-loop + surface moat + gate trial/quota (2026-07-05)

> `/starci-fe-layout-brainstorm` · dựng trên `CRITIQUE.md` (6 hole, thầy thua tất) — đây là bản đồ layout cho các
> resolution ĐÃ CHỐT. Route: `pathConfig().course(id).learn().mockInterview()` = `/courses/[displayId]/learn/mock-interview`.

## Grounded facts (đọc source thật)
- Cây hiện tại: `index.tsx` (bọc `EnrollGate`) → `MockInterviewSession` (state machine setup→active→grading→scorecard)
  → `MockInterviewScorecard` (7 section readonly) + `MockInterviewHistory` (list lần trước, ở màn setup).
- `MockInterviewGradeSessionData` (mutation response) **CHƯA có field RAG-match** (`matchedContentIds`/`ragSources`)
  — deep-link theo module cần **BE delta** (đính contentId lúc `retrieveCourseExcerpt` vào response). Layout dưới
  vẽ CẢ 2 nhánh: **có match** (sau BE delta) và **chưa có match** (fallback ngay, không chặn ship UI).
- `EnrollGate` hiện chỉ có 1 state (lock cứng). Cần thêm nhánh **teaser cho trial-viewer**.
- Job-readiness đã có pattern hiển thị band (`StatPair` + `Chip` màu theo band + `ProgressMeter`) ở
  `JobReadinessWidget` — **tái dùng đúng pattern này** cho rolling-5 strip (single-source-render).
- AI subscription route xác nhận tồn tại: `/profile/settings/ai-subscription`.

## Khung màn (theo [[when-rail]])
**KHÔNG rail.** Đây là surface "làm 1 việc tập trung" (rehearse phỏng vấn), giống challenge-solve
([[solving-surface-fullbleed-no-course-rails]]) — active/grading phase full-bleed, KHÔNG course rail. Setup/Scorecard
là 1 cột `max-w-3xl` centered (đọc [[three-tier-page-layout]]).

## KHÔNG có tab — đây là 1 FLOW tuyến tính (setup→active→grading→scorecard)
Không dùng TabsCard (không phải "đổi view cùng dữ liệu"). Setup screen có **2 khu vực xếp dọc** (config + lịch sử),
KHÔNG phải 2 tab — cả 2 luôn thấy cùng lúc (whitespace phân tách, không segmented).

---

## A. Bản đồ vùng — màn SETUP

| Khối | Vị trí | Vai | Lý do |
|---|---|---|---|
| **A1 PageHeader** | trên cùng | — | breadcrumb + title, [[three-tier-page-layout]] |
| **A2 Gate/Teaser banner** | ngay dưới header, CHỈ khi chưa enroll | — | chặn sớm trước khi thấy config (tránh set up rồi mới biết bị khoá) |
| **A3 Job-readiness snapshot strip** | trên config, CHỈ khi N≥1 lần trước | secondary | "đang ở đâu" trước khi bắt đầu lần mới — [[progress-block-growing-quantity-headline-not-vanity-strip]] |
| **A4 Config card** (level + model) | giữa | — | [[split-config-card-by-meaning-not-per-control]] |
| **A5 CTA "Bắt đầu phỏng vấn"** | dưới config, phẳng | **PRIMARY (duy nhất)** | 1 primary/màn |
| **A6 Lịch sử phỏng vấn** | dưới cùng | secondary | list SurfaceListCard, xem lại kết quả cũ |

**CTA-khóa ở màn này** = nằm TRONG A2 (trial-viewer chưa enroll → "Vào khóa học" chính là CTA khóa) — KHÔNG có anchor
khóa riêng khi ĐÃ enroll (đúng ngữ cảnh, học viên đã ở trong khóa; CTA-khóa thật sự nằm ở màn Scorecard, xem B).

## B. Bản đồ vùng — màn SCORECARD (trọng tâm sửa — nơi đóng vòng demand-loop)

| Khối | Vị trí | Vai | Lý do |
|---|---|---|---|
| **B1 Verdict Alert** (score-hero) | trên cùng | — | [[grading-result-page-labeled-cards-verdict-hero-findings-accordion]] |
| **B2 "Chấm theo khóa của bạn"** callout | ngay dưới B1 | — | **moat surfacing** (Hole 3) — trích module đã khớp |
| **B3 Rolling-5 + band + delta strip** | dưới B2 | secondary | **retention hook** (Hole 6) — tái dùng pattern JobReadinessWidget |
| **B4 Phase bars** (có link pha yếu) | giữa | — | mỗi bar dưới ngưỡng → mini-link "Ôn lại →" |
| **B5 Gaps list** (matched/unmatched) | giữa | — | gap có RAG-match → chip "Xem trong bài học"; chưa match → text thường (mixed) |
| **B6 CTA "Ôn lại [pha yếu nhất] trong khóa →"** | dưới cùng, phẳng | **PRIMARY (duy nhất, ĐỔI từ "Làm lại")** | **CTA-KHÓA — đây LÀ điểm sửa chính (Hole 1)** |
| **B7 "Làm lại phỏng vấn"** | cạnh B6 | tertiary | hạ cấp — không còn là primary (tránh khuyến khích retry-để-canh-điểm, Hole 7) |
| **B8 badge "Chưa xác thực server"** | cạnh verdict B1 | — | honesty tạm thời (Hole 2, chờ BE fix transcript) |

---

## Ma trận STATE (bắt buộc — xem widget)
1. **Rỗng** (setup, 0 lần trước) — A6 ẩn, A3 ẩn, chỉ A1+A2?+A4+A5.
2. **1 lần** (setup) — A3 hiện dạng "chưa đủ dữ liệu, cần 4 lần nữa"; A6 hiện 1 row.
3. **N lần (≥5, rolling đủ)** — A3 hiện band+delta đầy đủ; A6 hiện tối đa 6 row.
4. **Overflow** (>6 lần) — A6 hiện 6 gần nhất + "+N xem tất cả" → Drawer (pattern có sẵn, [[attempt-history-selector-adaptive-and-grading-model-chip]]).
5. **Mixed-variant** (A6 lẫn lượt teaser + lượt thật) — icon phân biệt "Lượt dùng thử" vs thường.
6. **Đặc biệt — Trial-viewer** (A2 = teaser: "1 lượt miễn phí" + CTA enroll sau khi dùng hết).
7. **Đặc biệt — Quota hết** (A5 CTA đổi thành "Hết credit tháng này — Nâng cấp gói AI →", route `aiSubscription()`).
8. **Scorecard — weak-phase MATCHED** (có contentId, B4/B6 deep-link module cụ thể).
9. **Scorecard — weak-phase UNMATCHED** (BE chưa trả contentId → B6 fallback "Xem lại nội dung khóa" route `content()` chung).

## Cắt / Thêm
- **THÊM:** `EnrollGate` mode `teaser` (mới, prop `allowTeaserRun?: boolean`); job-readiness-snapshot block dùng chung
  setup+scorecard (1 nguồn); BE field `matchedContentIds` trên `MockInterviewGradeSessionData` (delta, defer nếu
  chưa kịp — ship UNMATCHED fallback trước).
- **ĐỔI:** primary CTA scorecard từ "Làm lại" → "Ôn lại [pha yếu]" (retry hạ xuống tertiary).
- **KHÔNG động:** MockInterviewDiagram (whiteboard) — ngoài phạm vi critique này.

## Refs
- [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]] (ma trận state + CTA-khóa bắt buộc) ·
  [[solving-surface-fullbleed-no-course-rails]] · [[progress-block-growing-quantity-headline-not-vanity-strip]] ·
  [[attempt-history-selector-adaptive-and-grading-model-chip]] (+N drawer) · [[grading-result-page-labeled-cards-verdict-hero-findings-accordion]].
