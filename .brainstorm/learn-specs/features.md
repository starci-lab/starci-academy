# Các feature học trong 1 khóa StarCi — nội dung THẬT + quan hệ (grounded) + phán connective UX

> Map chính xác từ source (BE entities + job-readiness.service). Mục đích: sửa lỗi gộp **challenge ≠ task**, hiểu
> đúng feature nào NỐI với feature nào TRƯỚC khi dựng CTA "đi tiếp". Mọi quan hệ trích từ FK thật.

## Nội dung từng feature (grounded)
| Feature | Là gì | Entity | Thuộc về (parent) | Chấm | Feed gì | Phạm vi |
|---|---|---|---|---|---|---|
| **Content (Bài học)** | Đơn vị đọc (markdown + code) | `ContentEntity` | **Module** | không (đọc) | XP `lessonRead` (3) · RAG-seed cho interview | per-module |
| **Challenge** | Bài tập tự-chấm GẮN THEO BÀI | `ChallengeEntity` | **Content** (FK `content_id`) | **auto** (pass/fail) | XP `challenge` · **global** coding-percentile | per-content |
| **Milestone + Task (Capstone / Dự án cá nhân)** | Dựng HỆ THỐNG thật, nộp GitHub, AI review | `MilestoneEntity`→`MilestoneTaskEntity` | **Course**→Milestone (FK `milestone_id`) | **AI review** | **Job-readiness capstone pillar (40%)** · XP `milestone` (10) | per-course |
| **Flashcard** | Thẻ hỏi-đáp SRS (SM-2) | `FlashcardDeckEntity`→`Card` | **Course** (M2M optional → Content) | tự-chấm SM-2 | **KHÔNG feed gì** (aid ôn) | per-course |
| **Mock interview** | Phỏng vấn 5-phase, AI chấm cả buổi | `MockInterviewAttemptEntity` | **Enrollment** | **AI holistic** (0-100) | **Job-readiness interview pillar (30%)** | per-course |
| **Coding problem** | Drill thuật toán kiểu LeetCode | `CodingProblemEntity` | **GLOBAL** (không thuộc khóa) | auto-judge | **global** coding-percentile · XP `coding` | toàn hệ |
| **Leaderboard** | Xếp hạng XP | (tính từ `xp_histories`) | Course | — | (chính nó) | per-course |
| **Foundation** | Thư viện tham chiếu (link/video) | `FoundationEntity` | Category | không | không | per-course |
| **Mind-map** | KHÔNG phải entity — chỉ nav Module→Content | — | — | — | — | — |

## 4 NHÓM (quan trọng — đừng trộn)
1. **LEARN-CONTENT (học + luyện theo bài):** Module → **Content (bài)** → **Challenge** (per-lesson). Đây là trục
   ĐỌC-rồi-LÀM, tuyến tính theo thứ tự bài.
2. **CAPSTONE (chứng minh bằng dựng thật):** Course → **Milestone** → **Task** (GitHub, AI review). Trục RIÊNG,
   cấp-khóa, KHÔNG gắn bài nào. Feed job-readiness 40%.
3. **PRACTICE-AID (bổ trợ, quỹ đạo):** Flashcard (feed 0) · Mock-interview (feed 30%) · Coding-problem (global). Là
   công cụ ÔN/CHỨNG-MINH, không phải bước tuyến tính.
4. **META:** Leaderboard · Foundation · Mind-map (điều hướng/tham chiếu/đo).

## Quan hệ THẬT — 2 TRỤC leo về 1 ĐỈNH (KHÔNG phải 1 loop tuyến tính)
```
                         ┌──────────────── ĐỈNH: JOB-READINESS (band) ────────────────┐
                         │  depth = capstone×0.4  +  interview×0.3  +  cv×0.3          │
                         └───────────▲───────────────────▲──────────────▲────────────┘
                                     │                    │              │
   TRỤC 1 · LEARN-CONTENT     TRỤC 2 · CAPSTONE      PRACTICE-AID      (CV — ngoài scope học)
   Module→Content→Challenge   Course→Milestone→Task   Mock-interview
   (đọc → làm challenge →      (dựng hệ thống thật,    (chứng minh nói),
    bài kế)                     nộp GitHub, AI review)  Flashcard/Coding (ôn)
   feed: global coding %       feed: capstone 40%       feed: interview 30%
```
- **Challenge ⟂ Task:** KHÔNG có field nối. Challenge = luyện per-bài (auto); Task = capstone per-khóa (AI review).
- **Mock-interview ground vào capstone tasks + content (RAG)** — nó "hỏi về" trục 1+2, nhưng bản thân là aid feed 30%.
- **Cái NỐI mọi thứ KHÔNG phải 1 chuỗi — mà là ĐỈNH job-readiness** (3 pillar: capstone/interview/cv).

---

# PHÁN — connective UX phải sửa lại (đừng ép 1 loop tuyến tính giả)

## Sai của mô hình loop cũ
Tôi vẽ "đọc bài → challenge → flashcard → phỏng vấn → capstone → lặp" như 1 spine tuyến tính. **SAI**: capstone
(task) không nằm "sau flashcard/phỏng vấn"; nó là TRỤC RIÊNG cấp-khóa. Flashcard feed 0. Ép chúng thành 1 chuỗi =
bịa quan hệ không có thật.

## Đúng: 2 loại hand-off KHÁC BẢN CHẤT
**(A) Hand-off TRONG-TRỤC (tuyến tính thật — CTA mạnh, đúng):**
- Learn-content: **đọc bài → làm challenge của bài → (đạt hết) → bài kế**. (= cạnh 1 + cạnh 4 tôi đã/định dựng — ĐÚNG,
  vì cùng trục Content→Challenge→Content.)
- Capstone: **task → task kế cùng milestone → (hết milestone) → milestone kế**. (Trục riêng, tuyến tính trong nó.)

**(B) Nudge CROSS-TRỤC (KHÔNG tuyến tính — theo NGƯỠNG tiến độ, không per-step):**
- "Học kha khá module này rồi → **thử phỏng vấn** về nó" (learn → prove). Bắn theo NGƯỠNG (đọc/challenge đủ), 1 lần,
  không phải sau mỗi thẻ/mỗi bài.
- "Đủ vững → **làm capstone task** cho chặng này" (learn → capstone).
- Mock-interview scorecard → "ôn phase yếu trong khóa" (prove → learn, đóng vòng chẩn-đoán). ĐÚNG.
- **capstone và interview là ANH EM (2 pillar), không tuần tự.** Nudge interview→capstone chỉ là "làm nốt pillar kia",
  không phải "bước kế". Giữ được nhưng đừng khung như sequence.

## Cái NỐI thật = ĐỈNH job-readiness (đây mới là connective tissue)
Thay vì giả-loop, thứ nối mọi surface = **meter job-readiness 3 pillar** hiện diện xuyên suốt:
- Mỗi surface framing "**cái này nhích pillar nào**": challenge→(luyện, coding%) · capstone task→capstone 40% ·
  phỏng vấn→interview 30%. → user hiểu MỌI việc leo về 1 đỉnh (được tuyển).
- CTA "đi tiếp" tự nhiên = **within-trục sequential** (mạnh) + **cross-trục nudge theo ngưỡng** (nhẹ, đúng lúc) +
  **luôn quy chiếu về đỉnh** ("còn X% lên band Job-ready").

## Chốt lại 3 cạnh ĐÃ dựng (đánh giá lại theo sự thật)
| Đã dựng | Bản chất | Verdict |
|---|---|---|
| Cạnh 1: bài → challenge của bài | within-trục learn-content | ✅ ĐÚNG (giữ) |
| Cạnh 3: flashcard done → phỏng vấn | cross-trục aid→prove | 🟡 OK như nudge, KHÔNG phải rung tuần tự (flashcard feed 0) — giữ nhưng đừng khung "loop" |
| Cạnh 2: scorecard → capstone (tertiary) | cross-trục 2 pillar anh-em | 🟡 OK như "làm nốt pillar kia" — giữ tertiary, đừng làm primary sequence |

## Việc nên làm tiếp (đúng cấu trúc)
1. **Hoàn thiện within-trục learn:** cạnh 4 (challenge đạt hết → bài kế) — chắc, nên xúc.
2. **Within-trục capstone:** task → task kế / milestone kế (cần ground màn capstone result — chưa làm).
3. **Cross-trục nudge theo NGƯỠNG** (không per-step): 1 nudge "prove it" khi module đủ tiến độ (đã có mầm ở
   `LearnNudges` — mock-interview nudge gate `hasCapstone`). Nâng: gate theo tiến-độ-module.
4. **Đỉnh job-readiness làm thread xuyên suốt** (framing "+X% pillar" trên các CTA) — nối bằng ĐỈNH, không bằng spine.

## Refs
- Entity FK trích ở trên (content/challenge/milestone/milestone-task/flashcard/mock-interview/coding/foundation).
- `job-readiness.service.ts` + `constants/bands.ts` (capstone 0.4 · interview 0.3 · cv 0.3 · band 70/40 · window 5).
- Liên quan: `COURSE-CONNECTIVE-UX-BRAINSTORM.md` (SỬA lại theo 2-trục) · `cta.md` Phần B · `TRIAL-CONVERSION-LAYOUT-BRAINSTORM.md`.
