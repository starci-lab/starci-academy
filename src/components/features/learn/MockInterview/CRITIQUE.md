# Business Critique — "Phỏng vấn thử" (Mock Interview)

> Devil's-advocate BUSINESS critique. Grounded in the real source (BE + FE). NOT a UI review.
> Each question takes a pointed stance ("here's why this might break") for the teacher to rebut.
> Feature = the socket-streamed, voice-first, whole-session mock interview (`MockInterviewSession` →
> `gradeMockInterviewSession`), 5-phase rubric, RAG-grounded, feeds job-readiness at weight 0.3.
> (The older flashcard `InterviewSession` / cloze "Hỏi nhanh" is out of scope unless a hole spans both.)

## Business job (one-liner)
**Give an enrolled learner a realistic, course-grounded rehearsal of a system-design interview — voice-first,
end-of-session graded against a 5-phase rubric — so they (a) discover exactly which parts of the curriculum they
can't yet TALK through, (b) are pulled back into those course modules to fix it, and (c) accumulate a
recruiter-credible "can interview right now" signal (job-readiness interview pillar, 0.3).**

If that's the real job, the feature is currently strong on (a) and (c) but **structurally weak on (b) — the
demand loop back into courses** — and has an **integrity gap on (c)** because the graded transcript is
client-supplied. Those are the two load-bearing holes.

## Grounded facts (verified in source)
- **Grading**: `MockInterviewGradingService.grade()` — RAG-retrieves course excerpt (`retrieveCourseExcerpt`,
  topK 10), builds a 5-phase rubric prompt (`grade-mock-interview-session-prompt.service.ts`), invokes shared AI
  lane, parses strict JSON. Charges the **unified AI credit pool** (`assertNotOverQuota` → `consume`,
  `AiCeilSurface.Interview`) BEFORE parsing. Deterministic (temp 0).
- **Gate**: resolver = `KeycloakAuthGraphQLGuard` + `GraphQLMustEnrolledGuard`. FE also gates behind
  `EnrollGate` (enrolled-only, "spends AI credits"). Model pick validated via `GradingLaneValidationService`
  (paid-tier models require entitlement); no pick → balancer default.
- **Transcript is CLIENT-SUPPLIED**: FE builds `turns` (candidate turns from browser STT + a synthetic
  `[Diagram]` turn) and sends the whole array to `gradeMockInterviewSession`. Server does NOT reconstruct the
  transcript from the socket stream — it grades whatever `turns` the client sends, plus a client-sent
  `promptTitle` and `level`.
- **Prompts** (`mock-interview-prompts.service.ts`): course capstone `milestone_tasks` FIRST (course-grounded),
  then a STATIC list of `MOCK_INTERVIEW_CLASSIC_PROMPTS` (URL shortener, rate limiter…) shared across all courses.
- **Job-readiness linkage** (`bands.ts`): track depth = capstone 0.4 · **interview 0.3** · cv 0.3 (renormalized).
  Interview pillar = **AVG of the 5 MOST RECENT attempts** per enrollment (`JOB_READINESS_INTERVIEW_RECENT_WINDOW`).
  The team deliberately chose recent-AVG (not all-time-AVG, not best-of-N MAX) to resist gaming — documented in
  `WF-09-interview-recent-window.md`. This depth feeds `jobReady`/`building`/`needsWork` bands recruiters see.
- **Scorecard terminal state** (`MockInterviewScorecard/index.tsx`): renders overall score, verdict, per-phase
  bars, attributes, strengths, gaps, followUpQuestion. **No CTA. No link back to a course/module. No
  "study your weak phase" action.** The screen just ends.
- **Level** (`junior/middle/senior/staff/all`) is a free-form string chosen by the learner, only scaling rubric
  strictness in the prompt. `all` → "grade the substance on its own merits."

---

## Lens 1 — Business job & fit
1. **If you deleted mock interview tomorrow, what does the business measurably lose that capstone + CV + coding
   practice don't already cover?** Capstone (0.4) already proves they BUILT it; CV (0.3) already proves they can
   PRESENT it. Convince me the 0.3 interview pillar isn't just re-measuring "can they talk about systems" — a
   thing the capstone review arguably already tests — rather than opening a genuinely new job/skill.
2. **The prompt bank front-loads course capstone tasks, but then appends STATIC course-agnostic classics
   (URL shortener, rate limiter).** For a learner enrolled in, say, DevOps, why does "Design a URL shortener"
   belong in THEIR interview surface at all? Isn't every classic prompt a small leak away from the one thing that
   makes StarCi defensible — that the rehearsal is grounded in THIS course's curriculum?
3. **Is the job "rehearse to get better at interviewing" or "generate a recruiter-facing score"?** Those pull the
   design in opposite directions (a rehearsal tool wants low friction + infinite retries; a credential wants
   scarcity + integrity). The feature currently tries to be both. Which one is it, and what did you give up on the
   other axis?

## Lens 2 — Demand-generation loop (the weakest lens)
4. **The scorecard is a dead-end.** It renders `gaps` ("what to add") and a weak per-phase bar (e.g. `deepDive
   16/25`) — the single most demand-rich moment in the whole product — and then **just ends with no CTA, no link
   to the course module that teaches deepDive, nothing.** A learner who just discovered they can't talk through
   trade-offs has NOWHERE to click. Explain how this creates any demand to go back and study, versus being an
   emotional dead-stop.
5. **The gaps are free-text strings, not linked to curriculum.** Even if you added a CTA, the AI's `gaps` are prose
   ("You didn't discuss idempotency"). There's no mapping from a gap → the specific lesson/module that covers it.
   Without that mapping, "study your weak area" is a vague nudge, not a funnel. Why isn't a weak phase score
   deep-linking to the exact course content (you already have the RAG index over that content — the retrieval
   knows which chunks are relevant)?
6. **What concretely makes a learner come back for interview #2?** Not "it's free" — an actual pull. Right now the
   loop is: interview → score → (nothing). Where's the "your interview score is 62, do 3 more and it climbs the
   readiness band" hook that the recent-5-window mechanic could power but the UI never surfaces?

## Lens 3 — Conversion & funnel leak
7. **This surface is enrolled-only (`EnrollGate` + `MustEnrolled`).** So it can NEVER convert a trial viewer into an
   enroller — the person most valuable to convert can't even see it. Is that deliberate (interview = post-purchase
   retention only), or a missed top-of-funnel? A single locked/teaser mock-interview run for trial users
   ("here's what a real StarCi interview feels like") could be the strongest enroll CTA you have, and you've
   walled it off.
8. **It spends AI credits but there's no visible bridge from "ran out of interview credits" → "upgrade tier".**
   When `assertNotOverQuota` throws, what does the learner see, and does that moment route them to the AI
   subscription page, or just dead-error? A credit wall is a conversion trigger only if it points somewhere.
9. **Model-picker leak**: the grading model dropdown lets paid-tier users pick better models. For a FREE-tier user
   who sees the good models locked, is there a clear "these gradings are done by a stronger model on Pro" upsell,
   or do they just see disabled rows? (Locked-without-a-path is a leak, per `disable-vs-lock`.)

## Lens 4 — Monetization & fairness (fair-monetization-axiom)
10. **The interview pillar is a recent-AVG, not a sum — good.** But job-readiness is `interview 0.3` renormalized.
    Does running the mock interview MORE times mechanically raise readiness independent of getting better? The
    recent-5 window says no (WF-09) — but confirm: a learner who does 5 mediocre interviews and a learner who does
    50 mediocre interviews land on the SAME interview pillar, right? If not, that's a scalar inflating with
    activity, not skill — an axiom violation.
11. **Does the AI-credit spend push toward LEARNING or toward SPEND?** The fair axiom says "learn to earn proof,
    don't pay to inflate a number." Here credits gate *grading a rehearsal* — is a learner ever incentivized to
    BUY more credits to re-grade until the number looks good, rather than to go study? (Tied to the gaming lens —
    if a re-run can raise the pillar, credits become a pay-to-inflate lever.)
12. **Grading is charged even on a hollow answer.** `consume()` fires for any session that produces parseable JSON,
    including a 30-second "I don't know" run. Is charging a credit for a rehearsal the user learned nothing from
    the right monetization posture, or does it train users to avoid the feature (defeating retention)?

## Lens 5 — Retention & progression
13. **Is mock interview ON the learning path, or a side pond?** It lives under Flashcards, gated post-enroll, with
    a terminal scorecard. Nothing in the main course progression ("Tiếp tục học") points into it, and it points
    nothing back out. Argue it's a progression step and not an optional detour most learners run once and never
    return to.
14. **The 5-most-recent window is a beautiful retention mechanic that the UI throws away.** "Your last 5 average
    68 — one more good run bumps you to jobReady" is a perfect reason to return. But the scorecard never shows the
    rolling average, the band, or the delta. Why build the count-independent fairness mechanic and then hide the
    exact number that would make people come back?

## Lens 6 — Two-sided value (learner ↔ recruiter)
15. **The graded transcript is CLIENT-SUPPLIED (`turns` sent from FE), and the server grades whatever it receives**
    — it does not reconstruct the transcript from the authoritative socket stream. A determined user can POST a
    hand-crafted, flawless transcript (bypassing the mic entirely) and get a 95 that feeds their recruiter-facing
    job-readiness. If recruiters trust this signal, isn't the whole interview pillar forgeable by anyone who opens
    devtools? Convince me this isn't a hole in "learn to earn proof."
16. **`promptTitle` and `level` are also client-sent.** A user can grade a "staff" transcript as `level=junior` (or
    `all`), getting lenient grading, or spoof the prompt title. The rubric strictness the recruiter-facing score
    depends on is set by the graded party. Why is the difficulty of the exam chosen (and forgeable) by the
    examinee?
17. **Recruiter-facing readiness never distinguishes "graded a real spoken session" from "graded a pasted essay."**
    STT transcripts and typed/synthetic transcripts are structurally identical to the grader (the prompt even says
    "ignore STT noise"). So a polished written answer scores like a fluent spoken one — but the job the recruiter
    cares about is *speaking* under pressure. Doesn't that make the interview pillar measure writing, not
    interviewing?

## Lens 7 — Abuse / gaming (business)
18. **Level self-selection**: a learner picks `junior` or `all` → lenient rubric → higher score → higher readiness
    pillar. The recruiter sees "jobReady" without knowing it was earned at junior difficulty. Why isn't the level
    baked into the score's meaning (a 90 at junior ≠ a 90 at staff), or the readiness band gated to senior+ runs?
19. **Retry-until-lucky within the window**: recent-5-AVG resists best-of-N spam, but a user can still do many runs
    and let only the good ones fall in the recent-5 (do 5 great runs after 20 practice runs → window = the 5
    great ones). Is 5 wide enough to smooth that, or does a motivated gamer just "warm up off the record" then
    stack a clean 5?
20. **Whole-session grading with no mid-session feedback** is realistic, BUT it also means a user who doesn't care
    can mumble filler through all 5 phases at zero cognitive cost and still get a scored attempt. Does the
    mechanic reward *engaging* or merely *completing*? (A completion that costs a credit but teaches nothing is
    the worst of both worlds.)

## Lens 8 — Positioning & defensibility
21. **Why here instead of Pramp / interviewing.io / Google Interview Warmup — all free?** The ONLY defensible answer
    in the source is RAG-grounding into THIS course's curriculum ("weight correctness against what THIS COURSE
    taught"). But the classics are course-agnostic, and the scorecard never says "graded against Module 7 of your
    course." If the grounding is invisible to the learner, does the defensibility exist in perception, or only in
    the prompt?
22. **The single biggest moat you're NOT using**: you can grade an answer as *right or wrong per THIS course's
    stated approach* — a generic tool literally cannot (it has no ground truth for what "correct" means in your
    curriculum). Yet the scorecard shows a generic rubric (communication, structuredThinking…) that Pramp also
    shows. Where is the "you contradicted what Module X taught about sharding" — the one output no competitor can
    produce?
23. **Voice-first is a differentiator only if voice is enforced.** Since the transcript is client-supplied
    (Lens 6), the voice requirement is cosmetic — anyone can bypass the mic. So the headline differentiator
    ("voice-first mock interview") isn't actually load-bearing. Is voice a real feature or a demo flourish?

---

## HOLES FOUND (ranked)

### HOLE 1 — Dead-end scorecard: zero demand loop back into courses (Lens 2, 5 — the worst)
The most demand-rich moment in the product (a fresh, specific list of what the learner can't do) terminates with
**no CTA, no course deep-link, no "study this" action**. The `gaps` are prose unmapped to curriculum. This is the
single biggest miss against StarCi's North Star (every surface must funnel to learning). It ALSO wastes the
retention mechanic — the rolling-5 average / readiness band that would pull people back is computed but never shown.
- **Resolution directions**: (a) Add a scorecard CTA that deep-links each weak phase / gap to the RAG-matched
  course module (you already have the index — attach `contentId`s to the retrieval used at grade time). (b) Surface
  the rolling-5 interview average + current job-readiness band + "one more strong run → jobReady" delta on the
  scorecard. (c) At minimum, a primary "Ôn lại [weakest phase] trong khóa →" button routing to `/learn/content`.

### HOLE 2 — Forgeable recruiter signal: client-supplied transcript + self-chosen difficulty (Lens 6, 7)
`turns`, `promptTitle`, and `level` are all client-sent; the server grades whatever it's handed. Anyone can POST a
perfect transcript at `level=junior` and inflate the job-readiness interview pillar (0.3) that recruiters trust.
The "voice-first" differentiator is cosmetic because voice isn't enforced. This directly breaks "learn to earn
proof."
- **Resolution directions**: (a) Server reconstructs the transcript from the authoritative socket stream / a
  server-held session record, not from client `turns`. (b) Bind `level` and `promptId` to a server-created session
  so the examinee can't pick the exam's difficulty at grade time. (c) If full server-auth is too heavy short-term,
  at least mark recruiter-facing readiness "self-reported" until the transcript is server-verified, and bake level
  into the score's meaning (a 90@junior ≠ 90@staff).

### HOLE 3 — Invisible moat: course-grounding + curriculum-truth grading never shown (Lens 1, 8)
The one thing no free competitor can do — grade against THIS course's stated correct approach and cite the specific
module — is buried in the prompt and never surfaced. The learner sees a generic Pramp-style rubric. Perceived
defensibility ≈ 0.
- **Resolution directions**: (a) Show "graded against your course curriculum" + cite the matched module(s) on the
  scorecard. (b) For capstone-sourced prompts, grade explicitly against the task's approach/outcome criteria and
  show "you diverged from what Module X taught." (c) Drop or clearly quarantine the course-agnostic classics from
  the course-scoped surface (they dilute the grounding claim).

### HOLE 4 — Walled off from top-of-funnel conversion (Lens 3)
Enrolled-only means the highest-value conversion target (trial viewer) never experiences the feature, and there's
no visible credit-wall → upgrade bridge. A teaser run is one of the strongest possible enroll CTAs and it's locked.
- **Resolution directions**: (a) One free/teaser mock-interview run for trial users, ending in an enroll CTA.
  (b) Route the `assertNotOverQuota` wall to the AI-subscription page with a clear "stronger grading on Pro" upsell.
  (c) Make the locked grading models a visible upsell path, not a dead disabled row.

### HOLE 5 — Charged completion without engagement (Lens 4, 7)
A credit is consumed for any parseable session, including a hollow "I don't know" run. This both spends the
fair-monetization budget on non-learning and risks training users to avoid the feature — while whole-session
grading gives disengaged users a scored attempt for free effort.
- **Resolution directions**: (a) Gate the credit charge / the recorded attempt on a minimum substantive-answer
  threshold (e.g. total candidate content length, or a cheap pre-check). (b) Don't feed near-empty sessions into
  the readiness pillar. (c) Consider a lightweight per-phase nudge so completion correlates with engagement.

### HOLE 6 — Retention mechanic built but hidden (Lens 5)
`JOB_READINESS_INTERVIEW_RECENT_WINDOW = 5` is a deliberate, well-reasoned come-back-and-practice engine, but the
UI never shows the rolling average, the band, or the "one more run" delta — so its retention value is unrealized.
- **Resolution directions**: fold into HOLE 1's resolution (surface rolling-5 + band + delta on the scorecard and
  on any interview-history view).

---

## Weakest lens
**Lens 2 — Demand-generation loop.** The feature produces the single richest demand signal in the product (a
concrete, personalized list of curriculum gaps) at the exact moment the learner is most motivated to fix them — and
then does nothing with it. No CTA, no course deep-link, no progress hook. Everything else is fixable polish; this is
a structural failure to convert a "diagnosis" into "go study," which is the whole point of a learning platform.

---
---

# VÒNG 2 (2026-07-05) — thầy's cuts: "chọn nhiều đề tài quá, chia 3 mức random" + "diagram — hình thức khác?"

## Trạng thái các hole VÒNG 1 (re-verify source 2026-07-05)
| Hole V1 | Trạng thái |
|---|---|
| H1 dead-end scorecard | ✅ **ĐÃ VÁ** — scorecard giờ có PRIMARY "Ôn lại {phase yếu} trong khóa" deep-link RAG-matched content + track snapshot |
| H2 forgeable transcript (client-sent `turns`/`promptTitle`/`level`) | ❌ **CÒN NGUYÊN** — server vẫn chấm nguyên văn client gửi |
| H3 invisible moat | 🟡 một phần — scorecard hiện citation matched-content; classics vẫn ngang hàng capstone trong picker |
| H4 walled off trial | ❌ còn (enrolled-only); quota-wall → subscription upsell ĐÃ có |
| H5 charged hollow run | ✅ ĐÃ VÁ — min 100 ký tự (`MockInterviewSessionTooShortException`) trước khi gate quota |
| H6 hidden retention mechanic | 🟡 một phần — recent-5 window tồn tại (WF-09) nhưng scorecard chưa hiện rolling avg + delta band |

## Grounded facts MỚI (neo cho vòng 2)
- **Setup = 3 tầng quyết định:** picker đề = **20 capstone (SD) + 14 classic ≈ 34 lựa chọn** (1-column
  `SelectableCardGroup`) · level 5 lựa chọn (all/junior/middle/senior/staff) · model picker (Balanced/Premium/
  Frontier + Auto). Prompt ĐÃ có `difficulty` (Easy/Medium/Hard/Insane) nhưng picker bắt chọn ĐỀ, không chọn mức.
- **Kịch bản 5 phase HARDCODED thuần System-Design** (estimation = QPS/storage · highLevel = boxes-and-arrows
  5–7 components) — chạy y hệt cho capstone Fullstack/DevOps.
- **Diagram = FE whiteboard (xyflow) LUÔN hiện, mọi khóa**; khi chấm serialize thành text `[Diagram]\n…` append
  làm 1 candidate turn. **BE không có khái niệm diagram** (turns[].content = plain string; grading prompt không
  nói với model "đây là diagram, chấm kiến trúc").

## Lens 3/1 — Choice overload & the random cut (⭐ thầy's point 1)
V2-1. *Real interviews hand you a random question — you never pick.* **Claim: the 34-option picker doesn't just
      add friction, it corrupts the signal: learners rehearse the capstone they already built, job-readiness
      inflates on comfort-zone practice, and the recruiter-facing pillar quietly becomes "practiced their
      favorite topic 5 times."** Why should an examinee EVER choose their own exam question?
V2-2. Thầy's "3 mức random" — stress-testing it back: (a) random from the FULL pool can draw a capstone the
      learner hasn't reached (module-18 system while they're on module 3) → instant fail → churn. Should the
      pool be **progress-aware** (draw ≤ current milestone progress, capstone-first, classics as filler)? The
      progress data already exists. (b) Today there are TWO hardness knobs meaning the same thing to a user —
      prompt `difficulty` (Easy/Hard) and `level` (junior/staff, rubric strictness). **Claim: "3 mức" should
      collapse BOTH into one axis (Sơ/Trung/Cao → drives pool difficulty AND rubric strictness), deleting the
      level selector and the prompt picker in one move.** Any reason two hardness knobs must survive?
V2-3. If the prompt is random, the "retry" story changes: today retry = same prompt again (memorize the grader);
      random = new prompt each run (real signal, resists retry-gaming — strengthens the recent-5 window). Is
      there ANY business case for keeping deliberate same-prompt retry (e.g. "practice this capstone before its
      milestone review")? If yes, is that a separate mode rather than the default?

## Lens 1/6 — SD-monoculture format & per-track submission (⭐ thầy's point 2)
V2-4. **The 5-phase script IS a System-Design interview** (QPS estimation, boxes-and-arrows). A Fullstack
      learner interviewing about their CRUD capstone gets scored on "estimation" and "high-level architecture"
      — phases their real job interview may never ask. **Claim: every non-SD score this emits is graded against
      the wrong exam, and since it feeds the same job-readiness pillar, the pillar's meaning silently varies by
      course.** Rebut: what does a 62 mean for a DevOps learner?
V2-5. **The diagram board is grading theater**: 10 minutes of drawing serializes to the same text a learner
      could type, and the rubric is never told it's a diagram. Either the grader SEES the structure (label it
      in the prompt + grade architecture explicitly — SD only), or the board is cut/hidden on non-SD courses.
      Which — and why has "always-on whiteboard for everyone" survived this long?
V2-6. Thầy asks "hình thức khác?" — transfer-appropriate formats per track would be: SD → diagram (rubric-aware),
      FS → code/API-contract pad (endpoint signature, schema sketch), DevOps → pipeline/config sketch or
      incident runbook. **Claim: per-track ANSWER SURFACES are only worth building AFTER the phase script is
      per-track — otherwise we bolt the right answer-box onto the wrong interview.** Build order: script first,
      surface second. Agree, or is there a cheaper cut (hide diagram on non-SD, ship nothing else)?
V2-7. Model picker at setup (3rd decision): does "Balanced vs Frontier" before an interview create business
      value for the LEARNER — and does a Frontier-graded 80 mean the same as an Economy-graded 80 inside one
      recent-5 average? If stronger models grade differently, paid users' readiness numbers drift from free
      users' — a [[fair-monetization-axiom]] smell nobody has measured. Should the score-feeding grade be
      pinned to ONE tier (model choice only upgrades feedback RICHNESS, not the number)?

## HOLES VÒNG 2
- **V2-H1 · Picker corrupts signal + kills starts** — 34 đề × 2 knob độ khó × model = 3 quyết định trước câu
  hỏi đầu tiên; tự chọn đề = luyện vùng an toàn → readiness inflate. (V2-1..3)
- **V2-H2 · SD-monoculture** — 1 kịch bản phỏng vấn SD cho mọi track → điểm non-SD sai nghĩa mà vẫn feed
  chung 1 pillar. (V2-4)
- **V2-H3 · Diagram theater** — effort vẽ không được chấm; whiteboard hiện cả ở khóa không cần. (V2-5, V2-6)
- **V2-H4 · Grader-tier drift** — model mạnh/yếu chấm cùng 1 average; tiền có thể đổi số. (V2-7)

## Resolution directions (chờ thầy chốt → layout-brainstorm → workflow)
- **R1 (3 mức random, sharpened):** setup còn ĐÚNG 1 quyết định = **mức (Sơ/Trung/Cao)** — map junior/mid/senior
  → drive CẢ pool đề (difficulty + progress-aware, capstone-first) LẪN rubric strictness. Bỏ prompt picker, bỏ
  level selector; model → Auto de-emphasized. Đề lộ ra SAU khi bấm bắt đầu (như thi thật). Optional mode phụ
  "luyện đề này" deep-link từ trang milestone (giữ deliberate-practice mà không nhiễm default).
- **R2 (format theo track, phased):** bước 1 = phase script per-track (SD giữ 5 phase; FS/DevOps script riêng
  ngắn hơn); bước 2 = answer surface per-track (SD: diagram rubric-aware; FS: code/API pad; DevOps: config/
  runbook). Ngay lập tức (rẻ): gắn nhãn diagram trong grading prompt + ẨN whiteboard ở khóa non-SD.
- **R3 (signal integrity):** điểm-feed-readiness chấm bằng 1 tier cố định (Economy) — model xịn hơn chỉ nâng
  chất feedback; server tự lookup prompt/level (đừng tin client) — gộp với V1-H2.
