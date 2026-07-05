# CRITIQUE — CV upload & scoring (business phản biện)

> `/starci-fe-critique` 2026-07-05. Câu hỏi phản biện bằng ENGLISH để thầy debate → thông suốt. KHÔNG code, KHÔNG UI.
> Grounded từ code THẬT (Explore scan, file:line dưới). Trọng tâm: upload có phá vòng "học để kiếm bằng chứng" +
> fair-monetization không, và làm sao biến upload thành ON-RAMP tạo demand thay vì cửa tắt.

## Business job (1 câu)
Upload-CV *đáng lẽ* phải là: **cửa vào cho người đã có CV → chấm → lộ khoảng cách → kéo họ vào khóa để có bằng chứng
thật** (on-ramp). Câu hỏi lớn: hiện tại nó đang làm ĐÚNG job đó, hay là **cửa TẮT** cho phép lấy giá trị (recruiter
unlock, job-readiness) mà **không học gì**?

## Grounded — hành vi THẬT hiện tại (đã xác nhận, file:line)
1. **Upload = auth-only, FREE, không enroll-gate, không credit debit.** `upload-cv.resolver.ts:53` chỉ
   `KeycloakAuthGraphQLGuard`; `cv-scoring.service.ts:113` comment "không debit credit". Ghi `cv_generations.source=uploaded`
   (`upload-cv.handler.ts:100`).
2. **Chấm = rubric CHẤT-LƯỢNG-VĂN-BẢN THUẦN, KHÔNG cross-check thành tích.** `cv-scoring.service.ts:202–238`: "strict
   technical recruiter grading a CV" — judge impact/clarity/skills/structure. `score()` KHÔNG nhận enrollment/capstone/
   challenge/coding → **CV viết khéo (kể cả bịa) chấm = CV thật**.
3. **Gate recruiter + job-readiness = SOURCE-BLIND.** `consultant-contact-gate.service.ts:69` `MAX(score)` không filter
   `source`, unlock khi `≥70` (`CV_SCORE_UNLOCK_THRESHOLD`). `job-readiness.service.ts:323` per-course `MAX(score)` cũng
   không filter source → **uploaded CV ≡ generated CV** ở cả gate lẫn pillar.
4. **courseId attach không validate lúc upload** (`upload-cv.handler.ts:101–105`); job-readiness chỉ đọc course
   `isEnrolled=true`, NHƯNG user đã enroll có thể upload 1 CV mạnh gắn course → **CV pillar lên mà không cần làm capstone/
   interview** (depth = trung bình renormalize, pillar thiếu tự rớt).

## Central tension thầy phải giải
Toàn bộ moat StarCi = *"CV/điểm được BẢO CHỨNG bởi việc thật làm trên nền tảng"*. Upload source-blind + chấm-prose làm
điểm đó **tách khỏi việc thật** → vừa phá fairness (lấy giá trị không học), vừa phá niềm tin phía recruiter (điểm không
đáng tin), vừa giết demand (qua gate free rồi thì cần gì học). Upload phải được ĐỊNH NGHĨA LẠI: nó count tới đâu, hiển
thị cho recruiter thế nào, và bắc cầu sang generate/enroll ra sao.

---

## Questions by lens (ENGLISH — thầy phản biện từng câu)

### 1. Business job & fit
- **State the business job of "upload CV" in ONE sentence.** StarCi sells COURSES, not a resume checker. If a user only
  ever uploads and never enrolls, what did the business gain besides an AI bill? Convince me upload isn't a free Rezi
  clone bolted onto a course platform.
- You already have "generate from course achievements" as the differentiator. **What does upload add that generate
  doesn't — other than a door that skips the courses?** If the honest answer is "nothing except onboarding people who
  arrive with a CV", then upload's ONLY job is to convert them — so why does it currently terminate at a score?

### 2. Demand-generation loop
- Upload scores 58, feedback says "quantify impact, add real projects" (confirmed: prose-only feedback). **What in that
  moment makes them ENROLL rather than just reword the bullet and re-upload for free?** Where is the trigger that turns
  "my writing is weak" into "I need to DO more"?
- Worse case: upload scores **82**. We've just told them they're job-ready AND handed them the recruiter unlock, with
  **zero demand created to touch a course**. **Isn't a HIGH upload score the WORST outcome for the business** — a
  satisfied user with no reason to buy? How is upload not a demand-killer at the top end?

### 3. Conversion & funnel leak
- **Walk me through the exact moment + trigger an upload-user becomes a generate-user.** Today there is no bridge —
  upload → score → done. Why would they cross into "generate from achievements" (which forces course work) instead of
  staying in the free upload loop?
- Upload, scoring, and recruiter unlock are ALL free + auth-only (confirmed). **Where in this feature does anyone
  convert to paid?** If the recruiter gate was supposed to be the conversion lever ("look good → enroll → improve"),
  but upload already clears the gate at 70 without enrolling — **hasn't the gate stopped being a lever at all?**

### 4. Monetization & fairness  ⟵ luật vàng
- Confirmed: an uploaded CV counts toward the recruiter gate and the job-readiness pillar with no achievement check. So
  a user unlocks recruiter contact at ≥70 **without buying or doing a single course.** **How is this not a direct breach
  of fair-monetization — recruiter reach (real value) granted for zero learning?**
- Two users: **A** finished capstone + challenges, generated CV scored 78. **B** wrote a slick CV in Canva claiming the
  same, uploaded it, scored 80. **B now outranks A and clears the same gate.** Defend why B deserves that — or concede
  the score measures **prose, not proof**.

### 5. Retention & progression
- Upload is terminal — score and stop (confirmed: no course link in scoring or empty-state). **What brings an uploader
  back tomorrow?** If nothing, we acquired a resume-checker user, not a learner. What is the retention hook upload
  itself creates — and if there is none, why is it a first-class tab and not a one-off tool?

### 6. Two-sided value (recruiter trust — poisons the marketplace if wrong)
- The pitch to recruiters is "candidates vetted by REAL work here". Confirmed: an uploaded score is pure text-quality,
  unverified. **The first time a recruiter contacts a "CV 80" candidate who can't do the work, what happens to their
  trust in EVERY StarCi score — generated ones included?** Isn't source-blind upload poisoning the well the whole
  marketplace drinks from?
- **Should a recruiter even SEE an uploaded-CV score?** If uploaded must count, how do we mark it "self-reported,
  unverified" without making the number meaningless — and if we can't, why is it in the gate at all?

### 7. Abuse / gaming
- Confirmed: no verification. Exploit: take a senior engineer's public CV, upload it, score 90, unlock recruiter contact
  + inflate job-readiness — **costs nothing, needs no enrollment.** What in the system stops this? If nothing, is the CV
  score a credential or a formality?
- An enrolled user with **0% capstone** uploads a strong CV tied to that course; the CV pillar lifts their track depth/
  band (renormalized average — confirmed). **Doesn't this let people buy the course but skip the work and still read
  "job-ready"?** Is that the incentive we want to sell?

### 8. Positioning & defensibility
- If upload scoring = "AI grades your CV text", Rezi/Teal/Kickresume do it better and free. StarCi's ONLY moat is "the
  CV is backed by verifiable work you did here". **By letting source-blind upload into the same score + gate, aren't we
  throwing away the exact thing that makes us not a commodity?** What is left to defend?

---

## HOLES FOUND (nếu thầy không phản biện nổi → phải sửa thiết kế)
1. **Upload bypasses the learn→prove loop** — recruiter unlock + job-readiness with zero course work → breaks
   fair-monetization AND demand. (Sharpest hole.)
2. **Score = prose, not proof** — no attestation → gaming trivial (upload anyone's CV) → the credential is a formality.
3. **Recruiter-trust poisoning** — one unverified high score contacted → trust in ALL StarCi scores collapses (kills the
   paying side of the marketplace).
4. **Source-blind gate/pillar neutralizes the differentiator** — generated (achievement-backed) is worth exactly the
   same as uploaded → why build/sell the generate path at all?
5. **No demand bridge** — scoring is terminal; nothing converts upload→generate→enroll; a HIGH score actively removes
   the reason to buy.

## Resolution directions to debate (không prescribe — thầy chọn)
- **(a) Upload does NOT count toward gate/pillar** — upload is a private "improve your writing" nudge whose ONLY output
  is a diff vs a generated CV → CTA "generate from your real work to make this count". (Restores moat + demand + fairness.)
- **(b) Upload counts but flagged "self-reported/unverified"** to recruiters; only GENERATED/achievement-backed CVs are
  "verified" and gate-eligible. (Keeps upload useful without poisoning trust.)
- **(c) Upload scored only as onboarding**, gate/pillar require ≥1 generated CV backed by ≥1 completed capstone/challenge.
- Whichever: **the score a recruiter trusts must be the one tied to verifiable platform work.** Debate which.

## Nguồn
- Code: file:line ở §Grounded (upload-cv.resolver/handler · cv-scoring.service · consultant-contact-gate.service ·
  job-readiness.service). Rule: [[fair-monetization-axiom]] (per-track/gate theo tier·enroll, không theo count; giá trị
  ⇐ việc thật). Business framing: two-sided marketplace trust · freemium conversion lever · Hooked (trigger→demand).
