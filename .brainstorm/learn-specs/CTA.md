# CTA.md — Toàn bộ "trick" thúc đẩy mua khóa (grounded, có ranh giới đạo đức)

> Đi kèm `TRIAL-CONVERSION-LAYOUT-BRAINSTORM.md` + `CRITIQUE.md` (mock-interview). File này liệt kê **từng đòn tâm lý**
> dùng để urge user mua khóa — mỗi đòn neo vào **field/cơ chế BE THẬT** (không bịa), kèm **ranh giới**: đòn nào hợp lệ
> (persuasion honest) và đòn nào **CẤM** (dark pattern, phá fair-monetization + lòng tin dài hạn).
>
> **Nguyên tắc gốc:** mọi đòn dưới đây chỉ được dùng khi **nội dung nó nói là THẬT** (số thật, giá thật, tiến độ thật).
> Bịa số / giả khan hiếm / doạ mất cái chưa từng có = dark pattern → CẤM, dù "hiệu quả" tới đâu.

---

## 1. LOSS AVERSION — "bạn đã xây X, đừng để mất"
**Cơ chế tâm lý:** con người sợ MẤT cái đã có hơn thích được cái tương đương chưa có (Kahneman/Tversky, prospect
theory). Show tiến độ đã xây → tạo cảm giác "sunk" → không nỡ bỏ.

**Field BE grounded (đã có, chưa dùng):**
- `user_course_progress_projections.value.{totalXp, completedChallenges, lessonsRead, milestoneProgress}` — tiến độ
  free đã tích luỹ.
- `jobReadinessBand` (per-course depth score, job-readiness.service.ts) — vị trí trên thang "sẵn sàng đi làm".

**Cách dùng (honest):**
- "Bạn đã đọc 8/45 bài · 240 XP · rank #50 — mở khóa để KHÔNG MẤT tiến độ này, tiếp tục xây capstone + interview."
- KHÔNG BAO GIỜ nói "tiến độ sẽ bị xoá nếu không mua" (progress KHÔNG bị xoá — chỉ phần MỞ RỘNG bị khoá). Nói đúng
  sự thật: *"mở tiếp"*, không phải *"giữ lại"* (giữ lại ngụ ý sắp mất, mà nó không mất).
- **CẤM:** hiển thị đồng hồ đếm ngược "tiến độ hết hạn sau 24h" nếu KHÔNG có cơ chế hết hạn thật ở BE.

---

## 2. SCARCITY (khan hiếm) — pricing-phase giá tăng THẬT
**Cơ chế tâm lý:** con người định giá cao hơn cho thứ SẮP HẾT (Cialdini, Influence — scarcity principle).

**Field BE grounded (đã có, THẬT — không phải giả):**
- `PricingPhase` enum: `Pioneer → EarlyBird → Regular` (`pricing-phase.ts`). Giá **THẬT SỰ TĂNG** qua từng phase.
- `enroll-step.service.ts:260-290`: `nextPricingPhase()` tự động đẩy phase khi
  `enrollmentCount (isEnrolled=true) > phase.slotAvailable` — seat cap **THẬT**, đếm bằng SQL COUNT thật, không phải
  con số trang trí.
- Trial (`isEnrolled=false`) **KHÔNG tính vào seat count** — nghĩa là scarcity chỉ đúng cho slot MUA THẬT.

**Cách dùng (honest):**
- "Đang ở giai đoạn Pioneer · {enrollmentCount}/{slotAvailable} suất · giá tăng lên {nextPhasePrice} khi hết slot."
- Số liệu **PHẢI lấy trực tiếp từ `course.metadata.currentPhase` + `phase.slotAvailable`** — KHÔNG hardcode UI.
- **CẤM:** "chỉ còn 2 suất!" nếu slot thật còn nhiều. CẤM tạo phase/countdown ảo không tồn tại ở BE (fake scarcity =
  vi phạm FTC dark-pattern guideline + phá lòng tin ngay khi user F5 thấy số không đổi).

---

## 3. SOCIAL PROOF — enrollment count thật, KHÔNG bịa
**Cơ chế tâm lý:** hành vi đám đông — "nhiều người đã mua" giảm rủi ro cảm nhận.

**Field BE grounded:** `enrollmentCount` (đã dùng cho seat-check, `enroll-step.service.ts`) — số enrollment
`isEnrolled=true` THẬT của khóa.

**Cách dùng (honest):** "{N} học viên đã enroll khóa này" — chỉ hiện khi N đủ lớn để không phản tác dụng (N=2 hiện ra
phản tác dụng, làm khóa trông vắng). Ngưỡng tối thiểu nên thầy chốt (vd chỉ hiện khi N ≥ 20).

**CẤM:** bịa số "1000+ học viên" khi thật sự N nhỏ. Bịa review/testimonial giả.

---

## 4. ANCHORING — giá gốc gạch ngang trước giá thật
**Cơ chế tâm lý:** con số ĐẦU TIÊN nhìn thấy neo (anchor) nhận thức giá trị — giá gốc cao làm giá sau trông "hời".

**Field BE grounded:** `coursePricePreview` đã trả **3 mức**: `originalPriceVnd` (list/MSRP) → `phasePriceVnd`
(giá phase, chưa loyalty) → `discountedPriceVnd` (phase × loyalty = giá charge cuối). Đã render qua block `PriceTag`
(struck + %). **Đây là cơ chế ĐÃ CÓ, đã dùng đúng** — không cần thêm.

**Ranh giới:** `originalPriceVnd` phải là giá **THẬT ĐÃ TỪNG BÁN** (list price), không phải giá bịa ra để tạo ảo giác
giảm giá (dark pattern "giá gốc giả" — phổ biến ở e-commerce, FTC đã phạt vụ này).

---

## 5. GOAL-GRADIENT EFFECT — càng gần đích càng đẩy mạnh
**Cơ chế tâm lý:** động lực tăng phi tuyến khi gần hoàn thành mục tiêu (Kivetz et al., "The Goal-Gradient Hypothesis").
Coffee-shop stamp-card kinh điển: 10 tem cách 2 tem còn lại → tăng tốc độ ghé quán.

**Field BE grounded:** `lessonsRead / totalLessons`, `completedChallenges / total`, `milestoneProgress` — có đủ để
tính "% còn lại tới 1 cột mốc" (vd "còn 3 bài nữa là hết phần free — enroll để không đứt mạch").

**Cách dùng (honest):** hiện % framing theo HƯỚNG GẦN ĐÍCH ("còn 3/10 bài free") thay vì xa đích ("7/10 đã đọc") —
cùng số liệu, khác khung nhìn, hợp lệ vì KHÔNG nói sai sự thật.

**CẤM:** giả lập tiến độ ("bạn gần đạt rồi!") khi không gần.

---

## 6. RECIPROCITY — cho trước, xin sau (Coursera-audit logic)
**Cơ chế tâm lý:** Cialdini — nhận ân huệ trước tạo nghĩa vụ đáp lại. Coursera: free lecture trước, certificate/graded
sau. Duolingo: học free thật sự có ích trước khi chạm Plus.

**Cơ chế BE grounded:** premium content **preview cắt tại heading "Kiểm thử"** (`lockPremiumContent`, giữ đủ code +
lý thuyết, chỉ cắt phần verify) — đã là 1 dạng reciprocity: cho đủ để HỌC ĐƯỢC THẬT trước khi khoá.

**Mở rộng (đề xuất từ brainstorm trước, chờ chốt):** teaser 1 lần mock-interview Qwen (miễn phí, dùng đề
course-agnostic để không rò nội dung khóa) → cho nếm DỊCH VỤ trước, rồi mới hỏi mua. Đây là **taste dịch vụ-không-copy-
được**, KHÔNG phải reverse-trial nội dung (đã bàn: nội dung KHÔNG được reverse-trial vì copy được = rò IP).

---

## 7. AUTHORITY / DEFENSIBILITY FRAMING — "cái người khác không có"
**Cơ chế tâm lý:** giá trị cảm nhận tăng khi user hiểu "chỉ ở đây mới có" (unique authority, không phải giá rẻ).

**Grounded:** StarCi moat thật = **chấm theo ĐÚNG khóa học** (RAG-matched content, mock-interview grade dựa trên
capstone/module thật) + **bằng chứng đi làm** (job-readiness, recruiter thấy) — thứ ChatGPT/Pramp free KHÔNG làm
được vì không có ground-truth curriculum.

**Cách dùng:** làm nổi rõ "chấm theo bài Module X bạn học" thay vì giấu trong prompt kỹ thuật (đã ghi ở
CRITIQUE.md V3-H liên quan "invisible moat").

---

## 8. FRAMING theo OUTCOME thay vì FEATURE
**Cơ chế:** copy nói KẾT QUẢ user nhận (được tuyển, có bằng chứng) thuyết phục hơn nói CƠ CHẾ (tốn AI credit, mở
tính năng X). Đây không phải "trick" tâm lý riêng — là nguyên tắc copywriting outcome-first áp lên mọi CTA khác.

**Áp dụng cụ thể (đã liệt ở phân tích mảng CTA):**
- ❌ "Phỏng vấn tốn AI credit — enroll" → ✅ "Mở khóa để dựng bằng chứng đi làm — recruiter thấy điểm"
- ❌ "Đăng ký khóa" (generic) → ✅ "Mở phần còn lại — 18 bài + 6 challenge + capstone"
- ❌ "spends AI credits" (flashcard interview gate) → ✅ "Luyện phỏng vấn thật — điểm tính vào hồ sơ ứng tuyển"

---

## 9. EARNED-MOMENT TRIGGER — bắn CTA đúng lúc "vừa chứng minh nghiêm túc"
**Cơ chế tâm lý:** commitment & consistency (Cialdini) — người vừa hành động nhất quán (đọc N bài, làm M challenge)
dễ tiếp nhận bước tiếp theo (mua) hơn là bị mời ngay từ đầu (chưa đầu tư gì).

**Grounded:** trigger dựa `completedChallenges`/`lessonsRead` đạt 1 ngưỡng (vd đọc 5 bài free HOẶC pass 2 challenge)
→ bắn 1 lần, KHÔNG lặp lại (nag = phản tác dụng, mất trust).

**CẤM:** bắn popup mua hàng NGAY LẦN ĐẦU mở app (chưa earned gì) — đây là lý do "chưa ăn thua": ép mua trước khi
chứng minh giá trị = phản-persuasion.

---

## 10. AMBIENT / EVERYWHERE PRESSURE — spine thường trực (dùng ĐÚNG liều)
**Cơ chế:** mere-exposure — thấy lặp lại nhiều lần tăng tin tưởng/quen thuộc, nhưng QUÁ NHIỀU → banner blindness
(phản tác dụng, user học cách lờ đi).

**Cách dùng:** 1 strip MẢNH, không phải popup/modal lặp lại. Chỉ 1 dòng, luôn same-position (không nhấp nháy/animate
giật), để không bị "quen mắt bỏ qua" hay bị coi là spam.

---

---

# PHẦN B — Tâm lý CTA "RUNG KẾ" TRONG khóa (learn-loop handoff, KHÁC 10 đòn bán ở trên)

> 10 đòn trên = làm user **MUA** (trial→enroll). Phần này = làm CTA "đi tiếp" TRONG lúc học **gõ vào tự nhiên** (đọc
> bài → làm challenge → phỏng vấn thử → capstone). Đã dựng: block `UpNextCard` + 3 cạnh loop (LessonReader,
> DueReview, MockInterviewScorecard). Ranh giới đạo đức bên dưới phủ CẢ phần này.

## Khung nền — Fogg Behavior Model: **B = M · A · P**
Click xảy ra khi **Motivation × Ability × Prompt** cùng đủ cao 1 thời điểm (BJ Fogg). CTA = **Prompt**; bắn khi
**M thấp** (chưa muốn) hoặc **A thấp** (khó) → trượt dù nút đẹp. → 2 đòn bẩy: **(1) bắn đúng lúc M cao** (khoảnh khắc
hoàn thành) + **(2) làm hành động DỄ** (1 click, đích rõ).

## B1. Completion momentum — *Zeigarnik · Goal-Gradient · Peak-End*
- **Zeigarnik:** việc chưa xong tạo căng thẳng; **hoàn thành = giải toả** → ngay sau completion, M cho rung kế cao NHẤT.
- **Peak-End (Kahneman):** người nhớ đỉnh + KẾT → đặt CTA-next ở "end" mỗi surface = cưỡi cái kết tích cực.
- **→ Đã dựng:** `UpNextCard` bắn NGAY khi đọc xong bài / xong phiên flashcard, KHÔNG nằm trong menu sidebar.

## B2. Micro-feedback & dopamine — *habit loop (cue-routine-reward)*
- Dấu **✓** = reward signal → não dự đoán reward kế → kéo sang rung tiếp (vòng Duolingo).
- **→ Đã dựng:** check ✓ + eyebrow "Đã đọc xong · Tiếp theo" trong `UpNextCard`.

## B3. Contextual specificity — *Processing Fluency*
- Não thích cái dễ xử lý. **"Làm 2 thử thách CỦA BÀI NÀY"** fluent hơn generic "Đến Thử thách" → ít ma sát → A cao.
  ("'Learn more' is not enough".)
- **→ Đã dựng:** CTA loop dùng SỐ + "của bài này / về khóa này / {phase} yếu".

## B4. Một hành động rõ — *Hick's Law · decision fatigue*
- Thời gian quyết định tăng theo log(số lựa chọn). 1 **primary** rõ → quyết nhanh; nhiều CTA ngang hàng → tê liệt.
- **→ Đã dựng:** scorecard = ôn-phase-yếu **primary** · capstone + retry hạ **tertiary quiet**; flashcard-done =
  phỏng-vấn primary · về-nhà tertiary.

## B5. Outcome framing (competence) — *Self-Determination + goal-gradient*
- Hành động mạnh hơn khi thấy tiến tới **OUTCOME** (nhu cầu năng lực), không "làm thêm 1 việc". (= đòn #8 ở trên, áp
  cho loop.) **→** frame "nhích Job-ready", "tính vào tiến độ".

## B6. Salience — *Von Restorff (1 điểm nổi/màn)*
- Cái nổi bật được click; nhưng **1 điểm/màn** (nổi mọi thứ = không nổi gì). **→** CTA primary = accent solid, đúng
  `accent-system`.

## Bảng map — CTA loop đã dựng → đòn tâm lý
| CTA (đã build) | Đòn chính |
|---|---|
| `UpNextCard` cuối bài → "Làm N thử thách của bài này" | B1 momentum · B2 ✓ · B3 specificity · B4 |
| Flashcard done → "Phỏng vấn thử về khóa này" | B1 · B5 outcome · B4 |
| Scorecard → "Ôn {phase yếu}" + capstone tertiary | B5 · #9 earned-moment · B4 |

## Checklist viết 1 CTA-loop mới (6 câu)
1. **Đúng lúc?** bắn ở completion (M cao) hay chen ngang? 2. **Dễ?** 1 click, đích rõ (A cao)? 3. **Cụ thể?** nói đúng
việc + ngữ cảnh, không generic? 4. **1 primary?** cái khác quiet? 5. **Framed outcome?** nhích Job-ready/capstone?
6. **Fair?** không dark pattern (ranh giới dưới)?

---

## RANH GIỚI ĐẠO ĐỨC — CẤM TUYỆT ĐỐI (dark patterns, theo FTC + Cialdini "unethical influence")

| Trick CẤM | Vì sao |
|---|---|
| **Fake scarcity** (đếm ngược giả, "còn 2 suất" khi thật ra còn 50) | Lộ ra khi user F5/thử lại → phá trust vĩnh viễn, dễ bị report/phạt (FTC 2023 dark-pattern rule) |
| **Fake social proof** (review giả, số học viên bịa) | Vi phạm quảng cáo gian dối |
| **Confirmshaming** ("Không, tôi không muốn giỏi hơn" làm nút từ chối) | Vi phạm autonomy, StarCi bán cho người học nghiêm túc — coi thường họ = mất khách hàng tốt nhất |
| **Forced continuity** (tự động gia hạn không rõ ràng, khó huỷ) | Vi phạm pháp lý nhiều nước, tạo oán giận |
| **Hidden fees** (giá hiện 1 kiểu, tính tiền 1 kiểu khác) | Đã tránh — `PriceTag` show đủ 3 mức minh bạch |
| **Progress-loss threat giả** ("mất tiến độ nếu không mua" khi progress KHÔNG mất) | Nói sai sự thật — phần Loss Aversion ở trên đã ghi rõ CHỈ nói "mở tiếp", không nói "giữ lại" |
| **Nag loop** (bắn CTA lặp lại liên tục không dismissible) | Banner blindness + annoyance, giảm conversion dài hạn dù tăng ngắn hạn |
| **Roach motel** (dễ vào khó ra — hủy enroll/refund cực khó) | Ngoài scope file này nhưng note: chính sách refund phải rõ ràng, dễ tìm |

**Kim chỉ nam 1 câu:** mọi đòn trong file này CHỈ hợp lệ khi **thông tin nó show là sự thật kiểm chứng được từ BE**
(field thật, số thật, giá thật). Đòn nào cần BỊA số để "mạnh hơn" → dừng, đó là dark pattern, không phải persuasion.

---

## Bảng tổng hợp: đòn → field BE → trạng thái

| # | Đòn | Field BE grounded | Trạng thái |
|---|---|---|---|
| 1 | Loss aversion | `lessonsRead`/`lessonsTotal` (`myCourseOutline`) | ✅ **ĐÃ DỰNG** — `TrialConversionStrip` (content-home) |
| 2 | Scarcity thật | `coursePricePreview.{currentPhase,seatsRemainingInCurrentPhase,nextPhasePriceVnd}` | ✅ **ĐÃ DỰNG** — block `PhaseScarcityNote` (2 paywall + strip) |
| 3 | Social proof | `enrollmentCount` | ⛔ **BỎ** — đã hiện ở header chip + BE đếm CẢ trial (không lọc `isEnrolled`) → không honest, không thêm |
| 4 | Anchoring | `coursePricePreview` (original→phase→discounted) | ✅ ĐÃ dùng đúng (`PriceTag`) |
| 5 | Goal-gradient | free lessons chưa đọc (`modules[].lessons[].{isPremium,isRead}`) | ✅ **ĐÃ DỰNG** — "Còn N bài đọc thử" trong strip |
| 6 | Reciprocity | premium-content preview cắt tại "Kiểm thử" | ĐÃ có (nội dung); mock-interview teaser = thầy đang update |
| 7 | Authority/moat | RAG-matched content citation | ĐÃ có ở scorecard, CHƯA nổi bật |
| 8 | Outcome framing | — (copywriting, không cần field mới) | ✅ **ĐÃ DỰNG** — copy `mockInterview.gate*` + `enrollGate.description` + `tryLearning` + strip CTA |
| 9 | Earned-moment | ngưỡng từ progress | CHƯA có (cần threshold + trigger 1 lần) |
| 10 | Ambient spine | tổng hợp #1+#2+#5 | ✅ **ĐÃ DỰNG (v1)** — `TrialConversionStrip` ở content-home; mở rộng surface khác = sau |

## ĐÃ ÁP DỤNG (2026-07-07) — code thật, verify tsc/eslint/JSON sạch
- **Icon CTA đồng nhất `ArrowRightIcon`** (bỏ cart/rocket): `PremiumPaywall` · `PremiumGateModal` · `CourseMobileEnrollBar` — [[elements/button]] §2.
- **Hierarchy**: `CourseCtaButtons` "Học thử" `tertiary` → **`secondary` + lg + arrow** (mở cửa acquisition).
- **Copy outcome-framed** (vi+en): `course.tryLearning` → "Học thử miễn phí" · `mockInterview.gate{Title,Description}` (bỏ "tiêu tốn tín dụng AI") · `enrollGate.description` (→ "dựng bằng chứng cho hồ sơ đi làm").
- **Scarcity (#2)**: BE `coursePricePreview` +4 field (`currentPhase`/`nextPhase`/`seatsRemainingInCurrentPhase`/`nextPhasePrice{Vnd,Usd}`, qua 1 nguồn `resolveAmountVnd({phase})`) + FE block `blocks/commerce/PhaseScarcityNote` (chỉ hiện khi có seat-cap thật; "Còn N suất giá {phase} · giá tăng lên X").
- **Spine (#1+#5+#10)**: `TrialConversionStrip` (content-home, chỉ trial `enrollKnown && !enrolled`): loss-aversion/goal-gradient ("Còn N bài đọc thử") + `PriceTag` + `PhaseScarcityNote` + CTA "Mở khóa học →". FE-only.
- ⚠️ **Chưa runtime-verify** (cần restart BE cho field scarcity + tài khoản trial để soi mắt).

## Liên quan
- `TRIAL-CONVERSION-LAYOUT-BRAINSTORM.md` (layout Hybrid A+B+C dùng các đòn này)
- `CRITIQUE.md` (mock-interview) — V3-H1..H5 là các lỗ hổng mà 1 số đòn ở đây trực tiếp vá
- [[fair-monetization-axiom]] — mọi đòn phải phục vụ "học để kiếm bằng chứng thật", không "trả tiền để tăng số"
