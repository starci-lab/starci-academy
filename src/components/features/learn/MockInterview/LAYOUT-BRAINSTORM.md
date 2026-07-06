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

---
---

# VÒNG 2 (2026-07-05) — setup "3 MỨC RANDOM" + session workspace "TOOL TABS" (thầy chốt từ critique V2)

> Thầy: (1) *"chọn nhiều đề tài quá, chia thành 3 mức random"* · (2) *"render ra cái tab. Cho user chọn
> whiteboard, live coding,… y như phỏng vấn thật"*. Ref sản phẩm thật: **CoderPad** — tab navigation đổi mode
> Code ↔ Drawing (Excalidraw) trong cùng pad (https://coderpad.io/resources/docs/interview/drawing-mode/) ·
> HackerRank interview whiteboard mode. Vòng 2 SUPERSEDE 2 vùng của vòng 1: **A4 config card** + quyết định
> "KHÔNG động MockInterviewDiagram". Mọi phần khác vòng 1 (A1–A3, A5–A6, B1–B8, teaser gate) GIỮ NGUYÊN.

## A4' — Config card MỚI: ĐÚNG 1 quyết định = MỨC (xóa prompt picker + level selector)
| Khối | Vị trí | Vai | Lý do |
|---|---|---|---|
| **Mức** = `SegmentedControl` 3 nấc **Sơ · Trung · Cao** | trong config card, control DUY NHẤT | — | thang ordinal → segmented ([[single-select-among-options-use-tabs]]); 1 knob thay 2 (prompt difficulty + level trùng nghĩa) |
| Caption dưới mức: "Đề được chọn ngẫu nhiên như phỏng vấn thật" | trong card, body-xs muted | — | expectation-setting: user hiểu vì sao không được chọn đề |
| Model chấm (Auto) | DƯỚI CTA, de-emphasized | phụ | giữ nguyên vòng 1 / precedent InterviewSession |
- **Map mức → pool + rubric:** Sơ = difficulty Easy + rubric junior · Trung = Medium + middle · Cao = Hard/Insane + senior.
- **Pool random = capstone-first, PROGRESS-AWARE** (chỉ draw milestone ≤ tiến độ hiện tại, từ `myCourseOutline`;
  classic làm filler khi pool mỏng/progress=0) → không random đề module 18 cho người ở module 3.
- **Đề CHỈ LỘ sau khi bấm "Bắt đầu"** (như thi thật) — chống comfort-zone picking (CRITIQUE V2-H1).
- Mode phụ (defer): "luyện đề này" deep-link từ trang milestone → vào interview với promptId cố định (deliberate
  practice không nhiễm default random).

## SESSION' — 2-pane CoderPad-style, workspace = TOOL TABS
Khung session (active phase): **SPLIT 2 pane** (full-bleed sẵn):
- **PANE TRÁI = cuộc phỏng vấn (primary axis):** phase stepper 5 bước → interviewer stream → transcript →
  composer (mic + text) + [Chuyển phase] + [Kết thúc và chấm]. *(CoderPad để question/hội thoại trái, pad phải.)*
- **PANE PHẢI = WORKSPACE `TabsCard` — tool tabs, "y như phỏng vấn thật":**
  | Tab | Surface | Serialize khi chấm |
  |---|---|---|
  | **Whiteboard** | xyflow canvas (tái dùng `MockInterviewDiagram`) | `[Whiteboard] boxes/edges` |
  | **Code** | code editor (lang select; monaco/textarea-code) | `[Code lang=…] …` |
  | **Ghi chú** | plain textarea (estimation, API sketch) | `[Notes] …` |
  - **Artifact PERSIST per tab** (đổi tab không mất; tất cả fold vào transcript lúc chấm, label rõ).
  - **Default tab theo TRACK** (vá SD-monoculture phần surface): SD → Whiteboard · FS → Code · DevOps → Code.
    Mọi tab vẫn đủ cho mọi khóa — ứng viên TỰ chọn tool, đúng "như thật".
  - **Grader-aware (vá diagram-theater V2-H3):** grading prompt KHAI BÁO các section `[Whiteboard]/[Code]/[Notes]`
    + chấm artifact theo loại. BE delta = prompt service + serialize label (schema turns text-only GIỮ NGUYÊN).
  - Tab kiểu underline `TabsCard` (đổi work-surface = nav); tab có artifact → dot indicator nhỏ.

## Ma trận STATE bổ sung vòng 2
- **Session · từng tool tab** — bung cả 3 tab ở widget (whiteboard canvas / code editor / notes).
- **Pool rỗng theo mức** (vd progress=0 + mức Cao không còn capstone hợp lệ) → draw classic cùng difficulty;
  0 tuyệt đối → empty card "Vào học để mở đề capstone →" (phễu-khóa).
- **Mixed prompt source** — scorecard + history chip nguồn đề: `capstone` (accent, link milestone) vs `classic` (muted).

## Cắt / Thêm (delta vòng 2)
- **CẮT:** prompt picker (~34 lựa chọn) · level selector · whiteboard-always-on.
- **THÊM:** SegmentedControl mức · random progress-aware pool (client-side phase 1 từ `mockInterviewPrompts` +
  `myCourseOutline`; server-pick phase 2 gộp integrity V1-H2) · tool tabs (Code + Notes mới) · label serialize +
  grader-aware prompt · source chip.

## ĐÃ ÁP DỤNG 2026-07-05 (workflow `mock-interview-v2-tabs-random`, verify PASS — tsc/eslint/JSON sạch cả 2 repo)
- FE: setup 3 mức (`TIER_CONFIG`) + `drawRandomPrompt` (capstone-first, fallback không dead-end) + `MockInterviewWorkspace`
  (TabsCard 3 tool, panes mount-sẵn toggle hidden, dot indicator, default theo track) + serialize label + retry re-draw +
  level vào ask payload. BE: turn prompt nhận level + artifact-labels ở CẢ turn lẫn grading prompt; JSON contract giữ nguyên.
- ~~Nợ phase 2~~ **PHASE 2 ĐÃ XONG** (workflow `mock-interview-phase2-server-pick`, verify PASS): server-side pick
  (`startMockInterviewSession` + bảng `mock_interview_sessions` enrollment-keyed, pool progress-aware capstone-first)
  + grade lookup `resolveTrustedPromptIdentity` (hết tin client promptTitle/level). Nợ phase 3: transcript vẫn
  client-sent (server reconstruct từ socket stream).

## Refs vòng 2
- CoderPad Drawing mode / digital whiteboard — https://coderpad.io/resources/docs/interview/drawing-mode/ ·
  https://coderpad.io/features/digital-whiteboard/
- HackerRank Interviewing with Whiteboards — https://support.hackerrank.com/hc/en-us/articles/360048201413
- CRITIQUE.md VÒNG 2 (V2-H1..H4, R1/R2/R3) · [[single-select-among-options-use-tabs]] · [[tabscard-two-secondary-groups]]

---
---

# VÒNG 3 (2026-07-06) — KIND reframe: hỏi từ CONTENT (flashcard authored), chọn KIND × MỨC (thầy chốt "xúc")

> Dựng trên `KIND-REFRAME-BRAINSTORM.md`. Resolution CHỐT: (1) reframe TẠI CHỖ trong Phỏng vấn thử; (2) nguồn =
> flashcard authored (150/track, có level + đúng kind) + AI-gen bù; (3) P1 = 3 kind Lý thuyết/Tư duy/Tình huống;
> (4) Thiết kế = kind riêng giữ 5-phase (SD/module lớn). VÒNG 3 SUPERSEDE nguồn đề của vòng 2 (capstone → flashcard)
> + đổi luồng interviewer. GIỮ: tool tabs, `mock_interview_sessions`, scorecard shell, socket, RAG.

## ⭐ CHỐT thiết kế (2026-07-06) — KIND = KHUNG áp lên câu, KHÔNG phải nhãn trên card
- **Bỏ hẳn việc gán `kind` cho 450 flashcard + cột kind trên flashcard.** 1 card = 1 CHỦ ĐỀ (grounded content); `kind`
  chọn ở setup = CÁCH HỎI chủ đề đó (controlled-prompting theo Bloom — cùng nội dung, khác tầng nhận thức). Vd card
  "OAuth PKCE": Lý thuyết="PKCE là gì" · Tư duy="khi nào/đánh đổi" · Tình huống="PKCE sai thì vỡ gì".
- **Chấm theo kind:** Lý thuyết = hỏi đúng dạng tự nhiên của card → coverage vs `answer`+`:::chip` (có ground-truth).
  Tư duy/Tình huống = card reframe → KHÔNG dùng card-answer, chấm rubric mở. Thiết kế = 5-phase.
- **Scorecard KHÔNG cần branch:** `phaseScores` = mảng "bar có nhãn" → non-design cho nhãn "Câu 1/2/3" (BE set), design
  cho nhãn phase. FE render bars generic → 0 đổi schema scorecard. `kind` chỉ lưu ở `mock_interview_sessions`.
- **Hệ quả:** nợ "classify flashcard" GỠ BỎ. Chỉ còn cột `kind` trên session + logic pick/prompt/grade per-kind.

## VÒNG 6 (2026-07-06) — SCORECARD re-audit (phèn/sai rules) + feature NÂNG TẦM (đáp án mẫu per-câu)
> Thầy: *"ux ui phèn quá và sai rules hết"* + *"thêm tính năng gì để nâng tầm hơn là copy paste từ chatgpt"*.
> Ref: interviewing.io/Pramp/Revarta — ChatGPT NỊNH ("great answer") → tự tin ảo → fail thật; sản phẩm xịn:
> honest calibrated feedback + speech delivery metrics + **model-answer comparison**.

### Sai rules ở SCORECARD (grounded từ audit) — phải fix
| # | Vi phạm | Rule | Fix |
|---|---|---|---|
| 1 | Verdict hero = `div bg-default/40 p-8` tự chế | [[verdict-banner-and-separated-finding-cards]] / [[grading-result-page-labeled-cards-verdict-hero-findings-accordion]] | **`Alert status=success/danger/warning`** + `Alert.Indicator` phosphor + Title (score) + Description (verdict · cần N · chấm theo khóa) |
| 2 | 2 Chip DÍNH ("Chưa đạt" + "Chưa xác thực server") | [[elements/chip]] §3 (chip-cạnh-chip) | "chưa xác thực" → 1 dòng trong `Alert.Description` (hoặc tooltip trên score), KHÔNG chip thứ 2 |
| 3 | Section "Điểm theo từng **phase**" nhưng nội dung "Câu 1-5" | label đúng nghĩa | i18n `perPhaseTitle` → "Điểm theo từng **câu**" cho qna (branch design vs qna) |
| 4 | Link "Xem trong bài học" floating `ml-40` giữa row | layout (no dead/floating) | đưa link VÀO panel accordion của câu đó (xem nâng tầm) |
| 5 | Bars luôn `color="accent"` (điểm 12/100 vẫn hồng) | semantic score | bar **semantic theo tỉ lệ**: <50% danger · 50-75% warning · ≥75% success |
| 6 | Scorecard = 1 khối dài các Label+list | [[grading-result-page…]] (LabeledCard tách vùng) | 3 `LabeledCard`: "Kết quả" (Alert verdict) · "Chi tiết từng câu" (accordion) · "Góp ý" (strengths/gaps) |

### ❌ BỎ — feature "đáp án mẫu per-câu" (thầy chốt 2026-07-06)
> Thầy: *"luồng phỏng vấn là AI thuần thôi, cắm RAG để tạo câu hỏi và chấm câu trả lời. đừng vẽ thêm đáp án."*
> Lý do (grounded): câu hỏi = AI **REFRAME** flashcard topic theo kind (`QNA_KIND_FRAMING_MAP` "reframe the seed
> topic into…") → `card.answer` (đáp án câu GỐC) KHÔNG khớp câu đã reframe → "đáp án mẫu = card.answer" sẽ lệch.
> Thầy chốt: **KHÔNG hiển thị đáp án.** Luồng = AI thuần + RAG (tạo câu hỏi + chấm câu trả lời). Workflow v6
> đã DỪNG (TaskStop). CHỈ giữ phần rule-fix scorecard (dưới). Nếu sau muốn per-câu review thì chỉ câu+điểm+feedback,
> KHÔNG đáp án.

### ✅ ĐÃ LÀM 2026-07-06 (FE-only, tsc/eslint/JSON sạch) — rule-fix scorecard
- **Verdict `div bg-default/40` → `Alert`** status theo verdict (pass=success/borderline=warning/fail=danger) +
  `Alert.Indicator` phosphor (CheckCircle/Warning/XCircle) + Title (score `text-2xl` + verdict) + Description (moat
  grounding line + server-unverified text). **Bỏ 2 chip dính** (verdict + "chưa xác thực" giờ = text trong Description).
- **Bars semantic** (`ProgressMeter` thêm prop `color`; scorecard tính `scoreColorOf` = <50% danger · <75% warning ·
  else success) — điểm 12/100 giờ đỏ, không hồng-cứng. Áp cả phase/câu LẪN attribute bars.
- **Section title branch:** qna → "Điểm theo từng câu" (`perQuestionTitle` mới) · design → "…từng phase" (`isDesignScore`).
- **Bỏ floating link** "Xem trong bài học" (ml-40/ml-6 giữa row) — đường về bài = CTA chính "Ôn lại [pha yếu]" cuối.
- Giữ Label + whitespace giữa section (KHÔNG bọc LabeledCard mỗi cái — tránh card chồng, [[whitespace-over-dividers]]).

### ~~⭐ NÂNG TẦM (anti-ChatGPT) — REVIEW TỪNG CÂU kèm ĐÁP ÁN MẪU~~ (BỎ — xem trên)
- **Mỗi câu = 1 Accordion item** (thay list phase bar phẳng): trigger = "Câu N · kind · bar semantic · điểm"; panel =
  **câu hỏi + câu BẠN trả lời + ĐÁP ÁN MẪU (từ flashcard authored answer) + "thiếu gì" + link ôn bài**.
- **Vì sao khác ChatGPT:** StarCi có **đáp án chuẩn author-viết của CHÍNH khóa** (flashcard `answer` + `:::chip`) →
  so sánh "bạn nói vs chuẩn"; ChatGPT KHÔNG có chân lý cho khóa của bạn → chỉ nịnh. Đây là moat thật.
- **Vá luôn #4** (floating link vào panel) + **#3/#6** (accordion = pattern chuẩn findings).
- **CẦN BE delta:** grade trả **per-question** `{questionIndex, kind, seedTitle, candidateAnswer, modelAnswer (fetch card.answer by cardId), feedback, score, max, matchedContentId?}` — hiện chỉ có `{phase,score,max}` tổng. Grading prompt đã có card answer làm reference (theory) → mở rộng trả về client per-câu.

### Feature nâng tầm khác (ưu tiên)
- **P1 rẻ — "chấm thẳng không nịnh":** copy nhấn grounded curriculum ("sai so với Module 7"), + badge "chấm theo khóa" (đã có moat citation, làm nổi hơn).
- **P2 — Đo cách nói** (khi answerMode voice): tốc độ nói (từ/phút) · từ đệm ("ừm/à" count) · thời lượng/câu — **FE tính từ STT transcript + timer**, không cần BE (STT đã có). Chỉ hiện khi trả lời bằng giọng.
- **P2 — Xu hướng readiness:** TB 5 gần nhất + band + "còn X lên jobReady" (mechanic WF-09 có sẵn, UI chưa hiện — brainstorm vòng 1 B3).
- **Defer — interviewer persona** (dễ/khó tính), **replay annotate** (drawer đã có).

### SESSION (screenshot 2) — khá ổn, chỉ polish nhẹ
- Question card `div bg-default/40` → cân nhắc `bg-surface` reading card (nhẹ). Composer + progress dots + workspace-toggle OK. 1 cột (không 2-pane) hợp qna.

### Cần thầy chốt
1. **Đáp án mẫu per-câu (P1)** — làm ngay? (cần BE trả per-question + fetch card answer). Đây là feature nâng tầm chính.
2. **Đo cách nói (P2)** — FE-only, làm kèm hay để sau?
3. Scorecard rule-fix (Alert/semantic bar/accordion) — apply chung với per-câu.

## VÒNG 5 (2026-07-06) — meta chips → OPTIONS cấu hình (All vs Configurable) + Mức = WrapButton
> Thầy: *"biến thành option: chọn câu, chọn mode nói/gõ/cả 2, chọn mỗi câu 1 kiểu hoặc 1 category hay nhiều
> category… 1 là all hai là configurable"* + *"mức đừng render tab, render WrapButton"*.

### Concept: sensible-default (All) + progressive configure
- **Mặc định = Tự động (All):** random hết (5 câu · mọi kiểu · nói/gõ) → **thi thử**, đúng critique (random như thật,
  tín hiệu sạch, feed readiness). Màn gọn: chỉ toggle + Mức + CTA.
- **Tùy chỉnh (Configurable):** mở ra các option → **luyện tủ** (deliberate practice). Grounded: chọn CATEGORY ≠ chọn
  ĐỀ (đề vẫn random trong category) → KHÔNG vi phạm "không tự chọn đề" (critique V2-H1). Đây là 2 job khác nhau
  (mock-exam vs targeted-practice = đúng tension Q3 critique — cả 2 hợp lệ).
- **⚠️ Cần chốt:** buổi Tùy chỉnh (luyện tủ, category-filtered) có nên feed job-readiness KHÔNG? Đề xuất: **All feed
  readiness bình thường; Configurable = practice, KHÔNG feed readiness** (hoặc gắn cờ "luyện") — giữ readiness = tín
  hiệu từ buổi random-thật, tránh inflate bằng luyện tủ category dễ.

### Options (đều WrapButton/chip — `FlexWrapButtonRadio` / multi-select chips, KHÔNG segmented tab)
| Option | Control | Giá trị | Default |
|---|---|---|---|
| **Số câu** | WrapButton single | 3 / 5 / 10 | 5 |
| **Kiểu câu** | multi-select chip | Tất cả · Lý thuyết · Tư duy · Tình huống (chọn 1+ hoặc Tất cả) | Tất cả |
| **Cách trả lời** | WrapButton single | Nói / Gõ / Cả hai | Cả hai |
| **Mức** | **WrapButton single** (đổi từ SegmentedControl) | Sơ / Trung / Cao | (none — bắt chọn) |
- **Value:** Kiểu câu = luyện đúng chỗ yếu · "Nói" = ép speaking (kỹ năng phỏng vấn thật) · Số câu = độ dài buổi.
- **UI mode-switch:** toggle **[Tự động] [Tùy chỉnh]** (2 WrapButton) đầu block. Tự động → ẩn options (chỉ Mức + caption
  read-only "5 câu · mọi kiểu · nói hoặc gõ"). Tùy chỉnh → hiện 4 control. (Hoặc option-always-visible-with-defaults —
  hỏi thầy; đề xuất toggle để giữ màn mặc định gọn.)

### BE delta
- `startMockInterviewSession` thêm: `questionCount?` (thay QNA_SEED_COUNT hardcode) + `kinds?: string[]` (rỗng/absent =
  random 3; có = chỉ random trong các kind chọn). **`answerMode` = FE-ONLY** (nắn composer: ẩn mic / ẩn text / cả 2),
  BE không cần biết. Draw: mode=qna gán mỗi seed kind random TRONG `kinds` (thay vì luôn 3).
- Nếu chốt "config không feed readiness" → thêm cờ `isPractice`/`countsToReadiness` trên session.

### Cần thầy chốt (trước apply)
1. **Config có feed readiness không?** (đề xuất: KHÔNG — giữ readiness sạch từ buổi Tự động).
2. **UI:** toggle Tự động/Tùy chỉnh (màn mặc định gọn) hay options-luôn-hiện (defaults = All)?
3. **Số câu** 3/5/10 OK? Cách trả lời "Nói/Gõ/Cả hai" OK?

## VÒNG 4 (2026-07-06) — GOM kind (random per-câu) + RE-AUDIT layout setup theo rules
> Thầy soi màn chạy thật: *"gom 4 cái lại 1, từng câu random 1 trong 4 kind"* + *"reaudit lại layout, xấu quá,
> sai concept hết, áp rules .claude/rules"*. SUPERSEDE setup của vòng 3 (bỏ KIND selector).

### Rule vi phạm ở setup hiện tại (audit)
- **`split-config-card-by-meaning-not-per-control`:** `LabeledCard label="Chấm điểm"` (gradingLabel) BAO TRỌN Kiểu-câu + Mức
  + Model + CTA → (a) label sai nghĩa (cụm này là *cấu hình phiên*, không phải "chấm điểm"); (b) gom mọi thứ 1 card;
  (c) Model (control PHỤ, Auto) nằm chung control chính thay vì DƯỚI CTA.
- **choice-overload / `selectable-card-group`:** 4 kind card 2×2 nặng + "Thiết kế" disabled mờ lệch → BỎ hẳn kind picker.
- **Thiếu meta-intro strip;** subtitle "5 bước" sai (Q&A không còn 5 bước).

### Concept mới: KIND random PER-CÂU (bỏ khỏi setup)
- **Setup KHÔNG còn chọn kind.** Mỗi câu trong buổi tự **random 1 trong 3 kind Q&A** (Lý thuyết/Tư duy/Tình huống) —
  đúng phỏng vấn thật (interviewer hỏi lẫn lộn). Câu hiện **NHÃN kind** ("Câu 2/5 · Tình huống") → user học nhận diện loại câu.
- **⚠️ THIẾT KẾ KHÔNG TRỘN ĐƯỢC (cần thầy chốt):** Thiết kế = 5-phase CẢ BUỔI (1 hệ thống), không thể là "1 câu" trong
  buổi trộn. → đề xuất: random **3 kind Q&A** per-câu; **Thiết kế = nút riêng "Luyện thiết kế hệ thống"** (5-phase, chỉ
  SD/module lớn), KHÔNG nhét vào pool random. (Nếu thầy muốn ép 4: Thiết kế thành "design-lite 1 câu" mất trải nghiệm 5-phase.)

### Setup MỚI (phẳng, theo split-config)
```
PageHeader "Phỏng vấn thử" + subtitle (đổi khỏi "5 bước")
[meta strip PHẲNG: chips "~5 câu · giọng nói/gõ · mỗi câu 1 kiểu ngẫu nhiên"] — KHÔNG card
<Label>Mức</Label> + SegmentedControl Sơ/Trung/Cao + helper "Đề & kiểu câu chọn ngẫu nhiên" — 1 control PHẲNG (không bọc card)
[CTA "Bắt đầu phỏng vấn" lg phẳng]
[Chấm bằng: Tự động ⌄ — DƯỚI CTA, self-label sparkle, BỎ Label "Model chấm điểm" thừa]
[Lịch sử phỏng vấn]
(+ MockInterviewTrackSnapshot trên đầu khi có attempt — giữ)
```
- Bỏ `LabeledCard "Chấm điểm"`; Mức là 1 control lẻ → phẳng (rule: 1 control không bọc card). Model xuống dưới CTA.

### Session (đổi theo random-kind)
- Mỗi câu: **"Câu i/N · <kind>"** badge. Default nháp = **Ghi chú** (đa số Q&A trả lời bằng lời) — hết whiteboard chình
  ình vô nghĩa (thầy bắt vòng trước). Whiteboard/Code = tab mở khi câu cần vẽ/code (gợi ý theo kind câu hiện tại).
- Chấm: mỗi câu theo kind của nó (lý thuyết→coverage, tư duy/tình huống→rubric); scorecard bars nhãn "Câu N · kind".

### Cần thầy chốt trước khi apply
1. **Thiết kế:** tách nút riêng (đề xuất) hay ép thành design-lite trộn vào 4?
2. **Workspace ở Q&A:** giữ 3 tab (default Ghi chú) hay thu gọn (chỉ hiện nháp khi bấm "cần vẽ/code")?

## Grounded chốt (query DB 2026-07-06)
- `flashcard_cards` = **150 câu/track ĐỀU** (FS/SD/DevOps) — có `level` (junior/middle/senior/staff), `tags`, `answer`,
  `:::chip` keyword. Gắn content qua `flashcard_deck_contents` / deck↔module qua `flashcard_deck_modules`.
- Câu THẬT module Auth (FS) đã đúng kind: junior="auth vs authz"(Lý thuyết) · middle="OAuth PKCE chống gì"(Tư duy) ·
  senior="JWT bị đánh cắp, thiệt hại"(Tình huống) · staff="thiết kế remember-me"(Thiết kế). → phủ mọi track NGAY.
- **`outcomes` = 0** ở module Auth (chưa seed) → KHÔNG dựa outcomes; nguồn = flashcard (chính) + RAG content body (bù).
- **Nợ data:** flashcard chưa gắn `kind` → cần (a) cột `kind` seed, hoặc (b) AI-classify 1 lần + cache. `mức→level`
  map thẳng (đã có `level`).

## SETUP mới — 2 trục: KIND × MỨC (KHÔNG module picker)
| Khối | Vai | Lý do |
|---|---|---|
| **Kind** = `SegmentedControl`/`SelectableCardGroup` 4: Lý thuyết · Tư duy · Tình huống · Thiết kế | control 1 | chọn LOẠI câu (đây là "chọn phần muốn luyện", hợp lệ — khác chọn ĐỀ) |
| **Mức** = `SegmentedControl` Sơ/Trung/Cao (đã build) → level filter | control 2 | độ khó, map `level` flashcard |
| Caption: "Câu bốc ngẫu nhiên từ các bài bạn đã học" | — | expectation, giữ "không tự chọn đề" (critique V2-H1) |
| CTA "Bắt đầu" phẳng + model Auto dưới (đã build) | PRIMARY | 1 primary/màn |
- **KHÔNG module picker:** đề (module) vẫn RANDOM progress-aware (chỉ module đã học) — giữ nguyên tắc "không tự chọn đề".
  Nhu cầu "luyện đúng bài vừa học" = **mode phụ deep-link từ trang module** ("Luyện phỏng vấn bài này"), không nhiễm default.
- Thiết kế disabled/ẩn nếu track không hợp (non-SD + không module đủ lớn) → hoặc để P2.

## SESSION — luồng ĐỔI THEO KIND (điểm layout lớn nhất)
| Kind | Luồng interviewer | Default tool | Scorecard |
|---|---|---|---|
| Lý thuyết · Tư duy · Tình huống | **N câu (3–5), mỗi câu = 1 flashcard/gen + AI follow-up 1–2 nhịp** (KHÔNG 5-phase) | viết/nói (whiteboard/code phụ) | **per-question** score + strengths/gaps (KHÔNG phase bars) |
| Thiết kế | **5-phase hiện có** (requirements→…→tradeoffs) | whiteboard | phase bars (giữ nguyên) |
- Tool tabs (Whiteboard/Code/Ghi chú) GIỮ cho mọi kind (minh hoạ khi trả lời); chỉ đổi default theo kind.
- Chấm: Lý thuyết = **coverage** (so `:::chip` keyword + `answer` model — rẻ, đỡ gaming) · Tư duy/Tình huống = rubric mở ·
  Thiết kế = 5-phase rubric. `job-readiness` vẫn feed (điểm 0–100 thống nhất).

## Ma trận STATE (delta vòng 3)
- **Setup**: kind×mức picker; kind "Thiết kế" disabled+tooltip nếu không hợp track.
- **Pool 1 kind × mức rỗng** (module đã học không có flashcard kind đó ở level đó) → AI-gen bù từ RAG content; 0 tuyệt đối
  → phễu "học thêm bài để mở câu {kind}".
- **Session per-kind**: Q&A flow (non-design) vs 5-phase (design) — 2 wireframe.
- **Scorecard per-kind**: per-question (non-design) vs phase-bars (design).

## Cắt / Thêm (delta vòng 3)
- **THÊM:** trục KIND (setup + `mock_interview_sessions.kind` col) · nguồn flashcard (BE pick theo module-reached×level×kind) ·
  Q&A interviewer flow (non-design) · coverage grading (lý thuyết) · scorecard per-question variant · flashcard `kind` classify.
- **ĐỔI:** nguồn đề capstone→flashcard; `startMockInterviewSession` request thêm `kind`; interviewer/grading prompt per-kind.
- **GIỮ:** tool tabs · 3 mức · session table · socket · RAG · scorecard shell · 5-phase (chỉ kind Thiết kế).
- **Nợ:** flashcard `kind` classify (seed/AI) = việc rẻ làm 1 lần TRƯỚC khi pick chạy.

## Refs
- [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]] (ma trận state + CTA-khóa bắt buộc) ·
  [[solving-surface-fullbleed-no-course-rails]] · [[progress-block-growing-quantity-headline-not-vanity-strip]] ·
  [[attempt-history-selector-adaptive-and-grading-model-chip]] (+N drawer) · [[grading-result-page-labeled-cards-verdict-hero-findings-accordion]].

---

## Vòng 5 — Đơn giản hoá phiên Q&A: "hỏi từng câu" (2026-07-06)

> Thầy soi màn thật (`/mock-interview` mode qna) + chốt: *"cái này ui ux lòng vòng khó hiểu quá"* → yêu cầu
> *"nghĩ lại cách phỏng vấn sao cho bình thường, kiểu hỏi từng câu thôi"*. Root cause (đọc code thật, không đoán):
> câu hỏi bị lặp (preview + full), **ô trả lời TEXT không tồn tại** (chỉ có mic + nút "Gửi câu trả lời" — voice-first,
> không có fallback gõ), 3-tab workspace (Whiteboard/Code/Ghi chú) luôn hiện dù câu không cần vẽ/code, và 2 nút rời
> (nộp câu / sang câu tiếp) không rõ thứ tự bắt buộc.
> **QUAN TRỌNG:** BE ĐÃ đúng "hỏi từng câu" từ trước (`mode="qna"` = N flashcard-seed, mỗi seed 1 kind random
> deterministic, chấm 1 lần cuối theo `questionIndex` — xem BE explore 2026-07-06). Đây THUẦN là lỗi TRÌNH BÀY/FE,
> KHÔNG đổi contract `startMockInterviewSession`/`gradeMockInterviewSession`.

### Ref grounded — Google Interview Warmup (closest match, [designer.tips](https://www.designer.tips/practices/google-interview-warmup))
Mẫu chuẩn "hỏi từng câu, bình thường": show **1 câu** → **1 ô trả lời** (nói HOẶC gõ vào **CÙNG 1 ô**, không tách 2
luồng) → nộp → câu kế. Không chat-thread nhiều bong bóng, không workspace phụ bắt buộc.

### Quyết định — CHỈ đổi TRÌNH BÀY của `mode="qna"` (giữ nguyên `mode="design"` 2-pane 5-phase)
| # | Đổi | Trước | Sau | Vì sao |
|---|---|---|---|---|
| 1 | **Bỏ 2-pane, về 1 CỘT** cho `mode="qna"` | conversation-pane trái + workspace-tab phải | 1 cột: câu → ô trả lời → CTA | Q&A không cần vẽ sơ đồ; 2 pane chiếm nửa màn vô nghĩa cho câu lý thuyết/tư duy/tình huống |
| 2 | **Câu hỏi hiện ĐÚNG 1 LẦN** (card tĩnh, không chat-bubble) | preview "Câu i/N" + full-text bên dưới trùng lặp | 1 card duy nhất: badge "Câu i/N · `<kind>`" + progress-dot bar + text câu | hết lặp, hết mơ hồ "cái nào là câu thật" |
| 3 | **1 Ô TRẢ LỜI DUY NHẤT — text field, mic là ICON BÊN TRONG** (không phải 2 luồng tách biệt) | mic riêng + nút Gửi riêng + không textarea | `TextField` full-width, mic-icon `absolute right` toggle ghi-âm → transcribe **VÀO CÙNG Ô** (sửa được trước khi gửi) | vá đúng lỗi nặng nhất: trước đây KHÔNG có nơi gõ tay; giờ gõ HOẶC nói đều ra cùng 1 ô, luôn xem lại được |
| 4 | **Gộp 2 nút thành 1** ("Trả lời & câu tiếp theo") | "Gửi câu trả lời" + "Câu tiếp theo →" tách rời | 1 nút primary: submit + auto-advance; câu cuối đổi nhãn "Trả lời & nộp bài" → tự chuyển "Đang chấm…" | hết mơ hồ thứ tự bắt buộc; hành vi = trả lời xong thì đi tiếp, không cần bấm 2 lần |
| 5 | **Workspace (Whiteboard/Code) → ẨN MẶC ĐỊNH, mở khi cần** | 3-tab luôn hiện, chiếm nửa màn | 1 dòng link nhỏ "+ Thêm sơ đồ / code (tuỳ chọn)" dưới ô trả lời → bấm mới bung `TabsCard` cũ (giữ nguyên logic fold-vào-transcript khi grade) | đa số câu Q&A trả lời bằng chữ; ép hiện workspace = nặng vô cớ. KHÔNG xoá tính năng — chỉ đổi mặc định ẩn/hiện |
| 6 | **Progress = dot/segment bar** (5 ô, ô hiện tại tô accent) thay "Câu i/N" đứng 1 mình | chỉ có text counter | text counter GIỮ + thêm segment bar ngay dưới (visual, không cần đọc số) | quét nhanh "còn mấy câu", đúng pattern reading-progress đã dùng nơi khác |

### `mode="design"` (5-phase capstone) — KHÔNG đụng ở vòng này
Giữ nguyên 2-pane (conversation + whiteboard) + phase-stepper — bản chất multi-turn Socratic thật sự cần workspace
+ hội thoại nhiều lượt. Thầy soi màn qna trước ("Câu 1/3") — thiết kế không phải màn bị phàn nàn.

### Ma trận STATE (đủ nhánh, theo layout-must-funnel rule)
| State | Setup | Session (qna) | Scorecard |
|---|---|---|---|
| **Rỗng** | Chưa có lịch sử → card mời "Bắt đầu phỏng vấn" (CTA duy nhất) | — | — |
| **1** | 1 lần trước → hiện gọn, không cần pager | Câu 1/N — mở workspace tuỳ chọn để đóng | — |
| **N** | N lần, xếp mới→cũ | Câu giữa (2..N-1) — cùng khuôn với câu 1, không đổi UI giữa câu | Verdict + per-question rows (đã có, giữ) |
| **Overflow** | >5 lần → 5 gần nhất + "+N xem hết ›" (mirror [[attempt-history-selector-adaptive-and-grading-model-chip]]) | Câu cuối (N/N) — nút đổi nhãn "…& nộp bài", tự chuyển Grading | — |
| **Mixed** | Lịch sử xen kẽ Q&A/Thiết kế → badge phân biệt loại mỗi dòng | 3 kind (lý thuyết/tư duy/tình huống) cùng 1 khuôn ô trả lời — chỉ badge đổi, KHÔNG đổi input theo kind | Weak-phase CTA về đúng bài trong khoá (giữ, CTA-khóa) |
| **Đặc biệt** | — | Bốc câu thất bại (chưa đọc đủ bài ở mức) → card phễu "Học thêm bài để mở câu hỏi" (KHÔNG lỗi trơ) | Session <100 ký tự (guard BE có sẵn) → callout "chưa đủ nội dung để chấm", KHÔNG charge |

### CTA-khóa (giữ, không đổi vị trí)
- **Trial chưa enroll** → `EnrollGate` chặn cả feature (đã có, A2 ở Vòng 1-4).
- **Sau chấm** → Scorecard "Ôn lại `<bài yếu nhất>` trong khoá →" (đã có, giữ nguyên — vòng khép: điểm ⇐ trả lời ⇐
  phải học, không đổi).
- **Bốc câu thất bại** (đặc biệt, mới) → phễu "Học thêm bài để mở câu hỏi" thay vì lỗi câm.

### Widget
Đã vẽ (show_widget `mock_interview_one_question_layout`): legend 4 loại khối · khung 1-cột A→D · state Setup
(rỗng/N/overflow) · state Session (câu 1, câu cuối, đặc biệt bốc-lỗi) · state Scorecard (verdict + CTA-khóa).

### Cắt / Giữ
- **CẮT:** 2-pane cho qna · chat-bubble nhiều tin nhắn cho 1 câu · workspace luôn-hiện · 2 nút rời (gửi/tiếp).
- **GIỮ nguyên 100% contract BE:** `startMockInterviewSession`/`gradeMockInterviewSession`, per-question kind random
  deterministic, chấm cuối-phiên, fold artifact `[Whiteboard]/[Code]/[Notes]` khi có mở workspace.
- **GIỮ:** `mode="design"` 2-pane 5-phase nguyên trạng, `MockInterviewScorecard` nguyên trạng, `EnrollGate`,
  `MockInterviewHistory`/drawer, `GradeModelDropdown`.

### Refs vòng 5
- [Google Interview Warmup UI flow](https://www.designer.tips/practices/google-interview-warmup) (1 câu · 1 ô trả
  lời nói-hoặc-gõ chung · feedback sau mỗi câu) · [[interactive-needs-hover]] (nút gộp vẫn cần hover/cursor rõ) ·
  [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]] (ma trận state).
