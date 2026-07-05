# Business Critique — "Hỏi nhanh" (Quick Answer) Flashcard Feature

> Run via `/starci-fe-critique`. Grounded in real BE (`completeFlashcardQuizSession`, `GraphQLEnrollmentGuard`, `writeXpHistory`) + FE (`InterviewSession/index.tsx`, `UX-BRAINSTORM.md`) source — see citations inline. Questions in English per skill convention; framing in Vietnamese.

## Business job (1 câu)
"Cho MỌI người dùng đã đăng nhập (kể cả chưa mua khóa thật) 1 vòng luyện nhanh (cloze fill-in-blank) miễn phí, không tốn AI credit, trên flashcard content sẵn có — nhằm tăng thói quen (streak) + tín hiệu tương tác (XP → leaderboard), làm cầu nối kéo họ quay lại học."

## Grounded facts (đọc source thật, không đoán)
- **100% free, zero AI**: không gọi `AiInvokeService`/balancer nào (`flashcard.module.ts:19-21`). Cloze sinh + chấm hoàn toàn client-side.
- **XP thật, có trần**: `PER_CARD_XP=3`, `MAX_XP_PER_SESSION=15`, `min(15, round(coverage×cards×3))`, cards clamp [0,10]. Ghi qua `writeXpHistory` idempotent theo `(source=FlashcardQuiz, refId=sessionId)` — feed **leaderboard course + `totalPoints` lifetime + streak**.
- **KHÔNG đụng SM-2**: `completeFlashcardQuizSession` hoàn toàn tách khỏi `reviewFlashcard` — không tạo `FlashcardReviewEventEntity`, không đổi due-date/ease/interval. Quick-quiz là mini-game riêng, không phải review thật.
- **Guard KHÔNG chặn**: `GraphQLEnrollmentGuard` (khác `GraphQLMustEnrolledGuard`) **tự tạo trial enrollment** cho user chưa enroll — bất kỳ ai đăng nhập đều vào được, feed XP vào leaderboard của 1 khóa họ chưa từng mua.
- **Không trần/ngày**: chỉ trần MỖI SESSION (10 câu/15XP); số session/ngày = KHÔNG GIỚI HẠN.
- **End-of-session CTA = loop-back duy nhất**: recap hiện Best combo/XP earned/Avg coverage → nút **"Practice more"** quay lại setup. KHÔNG có link tới lesson cụ thể, CV, job-readiness, hay bất kỳ surface monetize nào khác.
- **History/weak-tags insight CHƯA build**: i18n keys tồn tại, nhưng component `InterviewHistory` không tồn tại trong FE — cầu nối "yếu chỗ nào → học lại chỗ đó" chưa có.
- **Copy gate sai lệch thực tế**: FE hiện "Quick quiz is for enrolled learners" nhưng guard thật tự-enroll-trial âm thầm — không thực sự chặn ai.
- **Tách biệt khỏi AI Mock Interview thật** (`features/learn/MockInterview`) — feature này (`InterviewSession`) chỉ còn là bản "Hỏi nhanh" nhẹ, không AI, sau khi tính năng AI thật bị tách ra riêng.

---

## 8-Lens Critique Questions

### 1. Business job & fit
- *"This module costs zero AI credit and has an enrollment guard that auto-creates a trial for anyone logged in — so what, concretely, does this feature do FOR THE BUSINESS that a static 'flip a flashcard' page wouldn't? If you removed the cloze/combo/streak machinery entirely and just kept plain flip-cards, what specific business metric would drop?"*
- *"The UX-BRAINSTORM frames this as 'closer to real interview retrieval' — but the actual AI-graded mock interview lives in a separate module (`MockInterview`) that costs real AI credit. Doesn't naming this 'Hỏi nhanh' next to the real mock-interview risk cannibalizing attention FROM the differentiated (AI-graded, defensible) feature TOWARD a generic keyword-matching quiz that any flashcard app already does?"*

### 2. Demand-generation loop
- *"After a session ends, the only CTA is 'Practice more,' which resets to the SAME setup screen. If a user scores low on a specific tag/topic, where does the flow tell them 'go re-read lesson X'? Convince me this is a real demand loop and not just a closed loop that burns engagement without ever pointing back at content that needs (re-)learning."*
- *"The UX-BRAINSTORM planned a `myInterviewHistory` weak-tags surface specifically to power this nudge, and it was never shipped (no `InterviewHistory` component exists). Isn't the ONE mechanism designed to create real demand the exact piece that's missing?"*

### 3. Conversion & funnel leak
- *"`GraphQLEnrollmentGuard` silently auto-creates a trial enrollment for ANY logged-in user — no purchase required — and that trial user can then farm XP into that course's leaderboard indefinitely (no daily cap, only a 15-XP-per-session ceiling with unlimited sessions/day). What stops a user from just doing 50 quick-quiz sessions on a course they never intend to buy, purely to sit near the top of its leaderboard?"*
- *"If the trial-enrollment path is meant to be a conversion funnel (try before you buy), where in this specific flow does the trial user ever get told 'you're capped, upgrade to keep going / unlock the real content'? Right now nothing in the quiz UI signals they're on a trial at all — how does this convert anyone?"*

### 4. Monetization & fairness
- *"Per the platform's own fair-monetization rule, engagement signals (XP/streak) are allowed to sum freely as long as they never gate a real opportunity. But this XP is completely decoupled from `reviewFlashcard`/SM-2 — i.e., from any measure of ACTUAL learning. A user who never opens a real lesson can out-rank a diligent learner on pure quiz-spam volume. Isn't a leaderboard rank that's this disconnected from real mastery itself a fairness problem, even if it doesn't literally 'gate' anything today?"*
- *"If this leaderboard XP is ever surfaced as a signal of competence (to peers, to the learner's own profile, to a future recruiter-facing surface), how do you defend a number that's mechanically farmable via an ungated, AI-free, unlimited loop?"*

### 5. Retention & progression
- *"Streak + combo are the only retention hooks here, and both are purely cosmetic (no tie to a course milestone, no unlock, no visible payoff beyond 'a bigger number'). Why would a user come back on day 8 of a streak instead of just... stopping, given the reward is only more of the same loop?"*
- *"This session is completely disconnected from the SRS due-queue (`myDueFlashcards`). So a user can build a long streak and high XP total on 'Hỏi nhanh' while their REAL due-cards pile up untouched. Doesn't that actively let users feel productive while making zero real progress — the opposite of what a retention mechanic should do?"*

### 6. Two-sided value (learner ↔ recruiter/employer)
- *"If a recruiter or another learner ever looks at this leaderboard and reads XP as 'this person studies hard,' what in the current architecture stops that signal from being pure noise — since it's earnable by an unenrolled trial user spamming a client-graded quiz with no AI check and no daily cap?"*
- *"Is there ANY plan to keep this XP source out of any employer/recruiter-facing surface specifically because it's this gameable — or is that a gap nobody has flagged yet?"*

### 7. Abuse / gaming (business)
- *"Coverage scoring is 'self-graded via keyword match, computed client-side, then just the number is sent to the mutation' (`answeredCount`, `coverageScore` — not the actual answers). What stops a user (or a script) from calling `completeFlashcardQuizSession` directly with `coverageScore: 1.0` and `answeredCount: 10` on repeat, farming the max 15 XP per call, unlimited times per day, without ever answering a real question?"*
- *"Idempotency is scoped to `(FlashcardQuiz, sessionId)` — a fresh `sessionId` is trivial for the client to mint. Doesn't that mean the ONLY thing stopping infinite XP farming is client-side rate-limiting that doesn't exist in this codebase?"*

### 8. Positioning & defensibility
- *"A no-AI, client-side, keyword-match cloze quiz with a streak counter is architecturally identical to what Anki/Quizlet already offer for free, at scale, with a much bigger card library. What does StarCi's course-grounded content actually buy the learner here that a general flashcard app doesn't — and is that advantage visible ANYWHERE in this UI, or only implicit in 'the cards happen to be about System Design'?"*
- *"The real differentiator StarCi has — AI-graded whole-session mock interviews — lives in a SEPARATE module (`MockInterview`) that this feature doesn't link to, mention, or upsell toward. If a learner finishes 'Hỏi nhanh' feeling good about their streak, what tells them the AI mock-interview (the actually-differentiated, credit-costing feature) even exists?"*

---

## Holes Found (nếu thầy không phản biện nổi → phải sửa thiết kế)

1. **Trial-enrollment loophole feeds a real, public leaderboard with zero purchase and zero daily cap.** Guard is non-enforcing (auto-trial), unlimited sessions/day, only per-session (15 XP) cap → farmable indefinitely on a course never bought.
2. **Client-computed score, no server-side verification.** Mutation trusts client-sent `coverageScore`/`answeredCount` directly — trivially scriptable for infinite XP.
3. **Dead-end demand loop.** The only post-session CTA is "Practice more" (loop-back); no bridge to a specific lesson, the real AI mock-interview, CV/job-readiness, or any monetizable surface.
4. **Decoupled from real learning state.** Session never touches `reviewFlashcard`/SM-2 — streak/XP/leaderboard rank can be built entirely without any real spaced-repetition progress.
5. **Planned insight never shipped.** `myInterviewHistory`/weak-tags (the one mechanism meant to convert a poor score into a demand signal) has i18n keys + BE groundwork but no FE component.
6. **Gate copy vs. real enforcement mismatch.** UI says "for enrolled learners"; backend silently auto-enrolls anyone — messaging doesn't match the actual (permissive) gate.
7. **Cannibalizes the real differentiator.** Sits under the same "interview practice" umbrella as the AI-graded `MockInterview` feature with zero cross-link, risking learners mistaking the free keyword-quiz for StarCi's actual edge.

## Resolution directions (nếu thầy thua 1/nhiều hole trên)
- **#1/#2 (farming/no server-check):** server-side re-derive `coverageScore` from actual answer payload (not trust client score) OR at minimum add a per-user-per-course DAILY XP cap from this source (mirrors Duolingo daily-cap pattern already used elsewhere in the codebase for new-card limits).
- **#3/#5 (dead-end/missing insight):** ship the planned weak-tags history + turn recap's low-coverage tags into a concrete "review this lesson" link (demand-bridge pattern already used elsewhere per [[fair-monetization-axiom]] spirit — course-grounded, not "pay to fix").
- **#4 (decoupled from real learning):** consider optionally counting a HIGH-coverage quick-quiz answer as a light-touch SRS signal (not full SM-2 grade override, but nudge due-date), so streak effort correlates with at least SOME real progress.
- **#6 (copy mismatch):** either tighten the gate to real enrollment (if trial access is unintended) or fix copy to accurately describe trial access as a deliberate funnel step with a visible upgrade nudge.
- **#7 (cannibalization):** add an explicit cross-link/upsell from "Hỏi nhanh" recap toward the AI Mock Interview for users who show consistent high performance (readiness signal → "ready for the real thing").

*Chờ thầy phản biện từng câu / chọn resolution → nếu thua, bước tiếp theo là `/starci-fe-layout-brainstorm` để chốt layout TRƯỚC khi quất workflow build (theo quy trình skill).*

---

## CHỐT — Thầy thua cả 7 hole (2026-07-05). Resolution ĐÃ CHỌN cho từng hole:

| Hole | Resolution CHỐT |
|---|---|
| **#1 Trial-enrollment loophole** | Server-side re-derive `coverageScore` từ answer payload thật (không tin số client gửi) **+** thêm **daily XP cap** per-user-per-course cho nguồn `FlashcardQuiz` (mirror pattern daily-new-card-cap đã có ở SRS). |
| **#2 Không verify server-side** | Cùng fix với #1 — server tự tính coverage, không nhận `coverageScore` thô từ client nữa. |
| **#3 Ngõ cụt demand loop** | Ship weak-tags insight + recap thêm CTA "Học lại bài {lesson}" cho tag/topic điểm thấp nhất phiên đó. |
| **#4 Tách khỏi SM-2 thật** | **Light-touch SRS nudge**: coverage cao (vd ≥80%) ở 1 thẻ trong quick-quiz → đẩy nhẹ due-date thẻ đó (KHÔNG ghi đè full SM-2 grade/ease/interval) — streak/XP giờ tương quan (dù nhẹ) với tiến độ thật, không tách biệt hoàn toàn. |
| **#5 Insight chưa ship** | Cùng fix với #3 — build `myInterviewHistory`/weak-tags + wiring vào recap. |
| **#6 Copy gate sai lệch** | **Giữ trial-friendly** (không siết guard) — sửa copy đúng sự thật (không nói "for enrolled learners" nếu trial vẫn vào được) **+** thêm 1 touchpoint upsell ("nâng cấp để mở khóa đầy đủ") khi trial user đạt ngưỡng nhất định (vd sau N session hoặc streak N ngày) — biến lỗ hổng thành phễu chuyển đổi thật. |
| **#7 Cannibalize AI Mock Interview** | Cross-link từ recap "Hỏi nhanh" → AI Mock Interview khi performance tốt ổn định (readiness signal "sẵn sàng thử cái thật chưa?"). |

**Bước tiếp theo (BẮT BUỘC theo quy trình, KHÔNG nhảy cóc sang workflow):** chạy `/starci-fe-layout-brainstorm` để vẽ + chốt layout cụ thể cho: (a) recap screen mới (weak-tags + lesson-link + upsell touchpoint + AI-mock-interview cross-link), (b) mọi state (session đầu tiên/nhiều session/đã đạt ngưỡng upsell/đã sẵn sàng cross-link). CHỈ SAU KHI layout được thầy duyệt mới quất Sonnet workflow build (BE: server-side scoring + daily cap + light-touch nudge; FE: layout đã chốt).
