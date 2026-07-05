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

---

# ROUND 2 — 2026-07-05 (sau khi commit `524e0389` vá Round 1)

> Trigger: thầy hỏi trực tiếp (1) có luồng nào biến CV upload thành CV generate không? (2) nếu đã generate rồi,
> viết thêm extraPrompts có ăn thêm điểm không? Đã đọc lại source THẬT (2 Explore agent song song, BE+FE) sau khi
> commit `524e0389` (cùng ngày) đã vá 4/5 hole của Round 1 bằng cách filter `consultant-contact-gate.getBestCvScore`
> + `job-readiness.computeCvScore`/`loadTrackCvScores` xuống `source = 'generated'`. Round 2 kiểm tra cái vá đó có
> THẬT SỰ kín không — và tìm ra **1 lỗ MỚI Round 1 chưa từng xét** cộng **2 bug cụ thể** (không phải philosophy, là
> code thật lệch nhau) sinh ra từ việc vá nửa vời.

## Trả lời thẳng 2 câu hỏi của thầy (trước khi phản biện)

**(1) Có luồng upload → generate không?** **CÓ — qua `reviseCv`.** `revise-cv.handler.ts:81-89` chấp nhận
`cvSubmissionId` trỏ tới BẤT KỲ row `cv_generations` nào thuộc về user, KHÔNG phân biệt `source` (comment dòng
77-80 nói thẳng: "covers both `Generated` and `Uploaded` sources"). Và `enqueue-generate-cv.service.ts:130-132`:
*"Both generate + revise flow through here, so this row is always `source = Generated`"* — nghĩa là **bấm "Chỉnh
sửa CV của tôi" trên 1 CV đã UPLOAD sẽ tạo ra 1 row MỚI với `source='generated'`**, dù nội dung gốc (từ file upload)
CHƯA HỀ được đối chiếu với hoạt động thật. Đây CHÍNH LÀ luồng "biến upload thành generate" — nhưng nó là **lỗ hổng**,
không phải tính năng cố ý (§Hole mới bên dưới).

**(2) ExtraPrompts nhiều hơn có ăn thêm điểm không?** **KHÔNG trực tiếp — nhưng có gián tiếp, và đây là thiết kế ĐÚNG.**
`generate-cv-score-step.service.ts:130-142` gọi `cvScoringService.score({ structuredData, ... })` — **chỉ truyền CV
JSON đã dựng xong, KHÔNG truyền `extraPrompts`** vào bước chấm. Bước chấm không biết prompt gốc dài hay ngắn, chỉ
chấm SẢN PHẨM cuối. `extraPrompts` chỉ ảnh hưởng ở bước COMPOSE (dệt thêm 1 dự án ngoài StarCi vào CV) — nếu điều đó
làm CV thật sự đầy đủ/thuyết phục hơn thì điểm có thể lên, nhưng đó là "viết prompt tốt hơn → CV tốt hơn → điểm cao
hơn vì CV tốt hơn", KHÔNG PHẢI "prompt dài → cộng điểm trực tiếp". Không có cách "spam chữ vào ô notes" để ăn điểm
không qua nội dung CV thật. **Thiết kế này ĐÃ ĐÚNG, không cần sửa.**

## Grounded — cái Round 1 KHÔNG xét tới (2 Explore agent xác nhận, file:line)

1. **"Revise an upload" = bypass 1-click cho đúng cái gate vừa vá sáng nay.** User upload 1 CV bịa hoàn toàn (bịa
   công ty, năm kinh nghiệm) → bấm "Chỉnh sửa CV của tôi" (không cần điền extraPrompts) → `generate-cv-compose-step
   .service.ts` (nhánh Revise) đọc `sourceCvText` (chính văn bản bịa) với chỉ dẫn *"Preserve any real experience...
   do not fabricate BEYOND what the original CV... supports"* — tức AI được lệnh **GIỮ NGUYÊN** nội dung bịa gốc,
   chỉ văn phong hoá + dệt thêm vài dòng verified data thật. Row kết quả `source='generated'` → **lọt thẳng qua
   filter `source='generated'` mà commit `524e0389` vừa dựng lên** → tính vào job-readiness + mở gate recruiter,
   y hệt lỗ Round 1 đã chỉ ra, chỉ khác 1 bước bấm nút.
2. **FE tự tính "Eligible for recruiter contact" SOURCE-BLIND, lệch với gate BE thật (post-fix).**
   `CvWorkspace/index.tsx:122-126`: `bestScore = MAX(score)` qua MỌI CV (không filter source) → hiện badge
   "Eligible"/"Not yet eligible" cho CHÍNH CHỦ dựa trên số này. Nhưng gate THẬT (`consultant-contact-gate.service
   .ts`) giờ chỉ tính `source='generated'`. Hệ quả: **user upload CV 85 điểm sẽ thấy badge "Eligible for recruiter
   contact" trong dashboard của họ — nhưng khi recruiter thật bấm "liên hệ", BE từ chối** (vì CV đó `source=uploaded`
   không qua filter). Đây là bug lệch FE/BE THẬT, không phải câu hỏi triết lý — cần sửa code.
3. **Copy 2 chỗ mâu thuẫn nhau trong CHÍNH sản phẩm.** `vi.json:793` (`sourceUploadedHint`, hiện trong scorecard
   callout): *"CV này do bạn tự khai — **vẫn tính điểm và mở khoá liên hệ bình thường**."* — > <, `vi.json:899`
   (`unverifiedHint`, hiện ở khu upload): *"CV tải lên... **KHÔNG tính vào điểm sẵn sàng đi làm hay mở khoá nhà
   tuyển dụng**."* Dòng 899 đúng với thực tế MỚI (sau `524e0389`); dòng 793 là copy CŨ từ trước khi vá, giờ SAI —
   trực tiếp nói ngược cái BE vừa sửa.

## Questions by lens (ENGLISH — thầy phản biện tiếp)

### 7. Abuse / gaming (lens nóng nhất Round 2)
- Confirmed: uploading a fabricated CV, then clicking "Revise" ONCE with empty `extraPrompts`, flips `source` to
  `generated` — the exact label `524e0389` just reserved for "achievement-backed, trust it." **The fix filters by a
  column value, not by provenance. Doesn't a 1-click revise completely undo this morning's patch?**
- The compose prompt for Revise mode literally instructs the model to **preserve** the original CV's claims. **If the
  original upload was fabricated, "preserve + don't fabricate beyond it" preserves the fabrication. Whose job is it to
  verify the ORIGINAL claims — and if the answer is "no one's," is `source='generated'` still a meaningful trust label
  after a revise?**

### 6. Two-sided value (trust — same stakes as Round 1)
- Recruiters were just promised (via the same-day fix) that `generated` = backed by real StarCi work. **If a revised
  upload can carry that label with zero verification, what did the fix actually buy — or did it just move the exploit
  one click deeper, past where anyone would think to look?**

### 1. Business job & fit (the FE/BE mismatch specifically)
- The learner's OWN dashboard tells them "Eligible for recruiter contact" (FE, source-blind) while the real gate would
  reject a recruiter's request for that same CV (BE, source-filtered, post-fix). **A user who trusts their own
  dashboard and tells a recruiter "I'm unlocked, go ahead" gets publicly contradicted by the platform. Is that an
  acceptable state to ship, even temporarily?**

## HOLES FOUND — Round 2
6. **Revise-an-upload bypasses the source='generated' gate** — 1 click, 0 verification, 0 extraPrompts required,
   fully undoes `524e0389`'s intent. (Sharpest hole — this is THE loophole in this morning's own fix.)
7. **FE eligibility badge is source-blind, BE gate is now source-filtered** — real functional mismatch, will surface
   as a confusing/broken promise to real users the moment an uploaded-CV owner scores ≥70. Needs a code fix, not a debate.
8. **Contradictory user-facing copy** (`vi.json:793` vs `:899`) about whether upload counts — one of the two strings
   is simply wrong post-fix. Needs a copy fix, not a debate.

## Resolution directions to debate — Round 2
- **(a) Close the loophole at the SOURCE column, not by re-deriving trust from provenance-that-can-be-spoofed:**
  when `mode = Revise` AND the row being revised has `source = Uploaded`, either (i) force the NEW row to inherit
  `source = Uploaded` too (revising an upload never earns "generated"; only a from-scratch `generate` on verified
  achievements does), or (ii) require the revise to be BLENDED-ENOUGH with verified data to count (harder to define,
  gameable by "verified data + 1 bogus line").  **(i) is simpler and closes the hole completely — recommend this.**
- **(b) Fix the FE/BE mismatch immediately regardless of (a):** `CvWorkspace`'s `bestScore`/eligibility computation
  must filter to `source='generated'`, matching `consultant-contact-gate.service.ts` exactly (ideally: FE reads a
  BE-computed `isRecruiterEligible` field instead of re-deriving MAX client-side — single source of truth, avoids
  future drift). This is a straightforward bug fix, not something to debate.
- **(c) Fix the copy contradiction:** delete/rewrite `sourceUploadedHint` (`vi.json:793` + `en.json` counterpart) to
  match `unverifiedHint`'s (now-correct) claim — upload does NOT count toward job-readiness/recruiter-gate.
- Per skill process: (a) needs thầy's decision (a design choice); (b) and (c) are bugs — recommend fixing them
  regardless of how (a) is resolved, since they're wrong under EITHER interpretation of what upload should do.
