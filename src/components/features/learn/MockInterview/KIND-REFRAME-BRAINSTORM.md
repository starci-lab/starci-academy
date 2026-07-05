# KIND-REFRAME — Phỏng vấn thử: hỏi từ CONTENT, tách nhiều KIND bài tập (2026-07-06)

> Thầy: *"hỏi từ content đi · tách ra nhiều kind bài tập: bài tập lý thuyết, bài tập tư duy, … · brainstorm rồi
> suy nghĩ đi"*. Đây là REFRAME bản chất "Phỏng vấn thử" (không chỉ đổi nguồn đề) — vá SD-monoculture (CRITIQUE
> V2-H2) tận gốc. NO code — brainstorm để thầy thông suốt + chốt hướng.

## 0. Phát hiện đổi cả bài toán (grounded)
- **Content không có type-enum** (markdown monolithic) NHƯNG có SECTION đã parse sẵn: `# outcomes`
  (`ContentLearningOutcomeEntity` — mục tiêu "bạn sẽ nắm được") · `# codeExplaining` (`CodeExplainingEntity` —
  code + explain 3 câu "vì sao pattern này quan trọng") · `# codeImplementations`. RAG có
  **`retrieveContentExcerpt(contentId)` = scope ĐÚNG 1 lesson** (không chỉ course) → generate câu hỏi từ 1
  module/lesson đã học được.
- **⭐ FLASHCARD THỰC RA ĐÃ LÀ QUESTION BANK phỏng vấn author-viết:** mỗi card = `question` (markdown) +
  `answer` (model answer) + `explanation` + **`level` junior→staff** + `tags` + **`:::chip` "Từ khoá ăn điểm"**.
  Tức StarCi đã có **ngân hàng câu hỏi phỏng vấn có đáp án mẫu + keyword chấm + phân cấp**, grounded per-content.
  "Hỏi nhanh" (cloze) chỉ là 1 CHẾ ĐỘ CHƠI (non-AI) trên chính flashcard đó.
- KHÔNG có Quiz/MCQ entity. Challenge = code per-lesson (AI chấm rubric).

## 1. Vị trí ĐÚNG của "Phỏng vấn thử" — thang 3 tầng SÂU DẦN (phân vai, KHÔNG trùng)
Cùng 1 NGUỒN (flashcard/content) nhưng khác ĐỘ SÂU kiểm tra:
1. **Ôn tập (SRS)** = **NHỚ** — lật thẻ, tự chấm, lịch lặp lại (SM-2). "Có thuộc không."
2. **Hỏi nhanh (cloze)** = **NHẬN RA** — điền chỗ trống từ word-bank, non-AI tất định. "Có nhận ra từ khoá không."
3. **Phỏng vấn thử** = **DIỄN ĐẠT** — nói/viết ra, AI chấm mở. "Có GIẢI THÍCH/LẬP LUẬN được không." ← reframe ở đây.
→ Đây là lý do tồn tại riêng: articulation dưới áp lực phỏng vấn — thứ flashcard/cloze/challenge KHÔNG test.
Các "KIND" thầy nói = các CHIỀU của diễn đạt.

## 2. KIND taxonomy (grounded Bloom + phỏng vấn thật — Kaplan-Moss)
| Kind (StarCi) | Bloom | Câu hỏi kiểu | Nguồn câu | Trả lời (transfer-appropriate) | Chấm |
|---|---|---|---|---|---|
| **Lý thuyết** | Understand | "JWT là gì? Khác session chỗ nào?" | flashcard authored (có sẵn) + outcomes | nói/viết ngắn | AI **coverage** (so `:::chip` keyword + model answer — rẻ, tin cậy) |
| **Tư duy** | Analyze/Evaluate | "Khi nào Redis thay Postgres cache? Đánh đổi?" | AI-gen grounded từ `codeExplaining`/content | nói/viết | AI **lập luận** (rubric) |
| **Tình huống** | Apply | "Prod API chậm 3s, mày debug sao?" | AI-gen scenario grounded content | nói/viết | AI **cách tiếp cận** |
| **Thiết kế** | Create | "Thiết kế X" (5-phase HIỆN CÓ) | capstone/module lớn | whiteboard + nói | AI 5-phase (đã build) |
| *(Code)* | Apply | *đã có ở **Thử thách** → LINK sang, KHÔNG làm lại* | — | code editor | test/AI |

## 3. Bốn TRỤC tách bạch (đừng gộp nhầm)
- **KIND** = tầng nhận thức (hỏi gì) — trục thầy vừa mở.
- **NGUỒN** = *authored flashcard* (ưu tiên: chất lượng cao + có đáp án mẫu + keyword) **vs** *AI-generate grounded*
  (bù cho kind flashcard chưa phủ — tư duy/tình huống). "Hỏi từ content" = qua CẢ HAI (flashcard vốn gắn content).
- **FORMAT** trả lời = nói/viết/whiteboard/code = **TOOL TABS vừa build** — chỉ đổi: default tool theo **KIND**
  thay vì theo track (lý thuyết→viết · thiết kế→whiteboard · code→editor).
- **CHẤM** = *coverage* (khi có đáp án — kind lý thuyết, tái dùng `parseAnswerKeywords`) vs *rubric mở* (tư duy/
  tình huống/thiết kế). Kind có đáp án → chấm rẻ + đỡ gaming.

## 4. Buổi phỏng vấn mới (tận dụng lại, KHÔNG đập đi)
`setup: chọn KIND + MỨC (SegmentedControl 3 mức đã build) → server random 3–5 câu kind đó từ MODULE đã học
(progress-aware, retrieveContentExcerpt/flashcard theo content) → trả lời (tool tab theo kind) → AI chấm →
scorecard (giữ) + feed job-readiness`.
Tái dùng nguyên: tool tabs · 3 mức · bảng `mock_interview_sessions` · grading pipeline · RAG lesson-scope ·
scorecard · socket stream. "Thiết kế" = kind đặc biệt giữ đúng 5-phase hiện tại.

## 5. Hướng SHIP phased (đừng làm hết 1 lần — rủi ro chất lượng generate)
- **P1 (vá SD-monoculture NGAY):** kind **Lý thuyết** + **Tư duy** — mọi track có ngay vì nguồn = flashcard
  authored (+ content sections). Lý thuyết chấm coverage (có đáp án). Đây là cái làm FS/DevOps hết "đề ngớ ngẩn".
- **P2:** kind **Tình huống** (AI-gen scenario grounded — cần review/cache chất lượng).
- **P3:** **Thiết kế** = giữ 5-phase, chỉ hiện cho track/module hợp (SD, hoặc module đủ lớn).
- **Code** → link "Thử thách", không dựng lại.

## 6. RỦI RO phải chốt trước khi build
- **AI-generate câu tư duy/tình huống = dễ nhảm** → BẮT BUỘC grounded (`retrieveContentExcerpt(contentId)` +
  `codeExplaining.explain` + `outcomes`) + cân nhắc PRE-GEN + cache + review, KHÔNG generate mù mỗi lần (đúng
  rule [[learning-surface-grounded-in-pedagogy-not-superficial-gamify]]).
- **Coverage flashcard per-track lệch:** nếu track X ít flashcard → kind Lý thuyết mỏng ở track đó → phải
  fallback AI-gen từ outcomes/content. Cần đo số flashcard/track trước khi hứa "mọi track đủ".
- **Đừng đẻ surface thứ 6:** reframe TRONG "Phỏng vấn thử" (mọi kind ĐỀU là loại câu phỏng vấn thật), KHÔNG tách
  trang "Luyện tập" mới cạnh Ôn tập/Hỏi nhanh/Thử thách (loãng IA).

## 7. Câu hỏi cho thầy (chốt để thông suốt)
1. **Reframe TRONG "Phỏng vấn thử"** (em nghiêng cái này — mọi kind là câu phỏng vấn) hay tách surface "Luyện tập" mới?
2. **Nguồn câu:** ưu tiên *flashcard authored* rồi AI-gen bù (chất lượng + có đáp án) — đồng ý? hay muốn *AI-gen thuần từ content*?
3. **Kind ship P1** = Lý thuyết + Tư duy đủ chưa, hay cần cả Tình huống ngay?
4. **"Thiết kế" (5-phase):** giữ là 1 kind (chỉ SD/module lớn) trong Phỏng vấn thử, hay tách hẳn về capstone?

## Refs
- Bloom's Taxonomy in assessment — https://assess.com/blooms-taxonomy-cognitive-levels-assessment/
- LLM + Bloom để tạo quiz (controlled prompting theo taxonomy) — https://arxiv.org/pdf/2401.05914
- Types of interview questions (lý thuyết/tư duy/tình huống là loại câu thật) — https://jacobian.org/2021/mar/1/types-of-interview-questions/
- Rules: [[learning-surface-grounded-in-pedagogy-not-superficial-gamify]] · [[single-select-among-options-use-tabs]] ·
  CRITIQUE.md V2 (SD-monoculture) · LAYOUT-BRAINSTORM.md (tool tabs, 3 mức).
