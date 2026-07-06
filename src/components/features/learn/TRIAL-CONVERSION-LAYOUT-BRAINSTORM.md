# FULL LEARN FEATURE — trial (học thử) → enroll (mua khóa) CONVERSION LAYOUT

> `/starci-fe-layout-brainstorm`, 2026-07-07. Thầy: *"brainstorm cho full tính năng học — làm sao khách học thử
> PHẢI mua khóa. Hiện tại có unlock khóa nhưng chưa ăn thua."* Grounded: BE entitlement + FE mọi surface trial
> (2 Explore 2026-07-07) + patterns edtech thật (Coursera audit / Duolingo loss-aversion / reverse-trial).
> KHÔNG code — brainstorm + chốt hướng.

## Business job
Biến TRẢI NGHIỆM HỌC THỬ thành 1 phễu chuyển đổi thật: người học thử **phải** mua khóa — không phải vì bị chặn
cứng, mà vì họ THẤY giá trị đã xây + hiểu cái bị khóa là BẰNG CHỨNG ĐI LÀM + cảm được khan hiếm thật (giá tăng).

## Chẩn đoán "chưa ăn thua" (grounded)
Kiến trúc paywall ĐÚNG (BE): `isEnrolled` gate · body premium cắt tại heading "Kiểm thử" · mock-interview/capstone/
personal-project/job-readiness/premium-AI đều gate `isEnrolled=true` · pricing-phase scarcity thật (Pioneer→EarlyBird
→Regular, giá TĂNG khi hết slot) · loyalty +5%/khóa + bundle +5-10%. **NHƯNG tầng CHUYỂN ĐỔI thiếu** — trial =
"wall-less but benefit-less", KHÔNG có narrative arc. 6 đòn bẩy có sẵn trong data, chưa dùng:
1. **Loss-aversion chưa bắn** — progress%/XP/rank/partial job-readiness hiện ra nhưng KHÔNG khung "của bạn — giữ/mở
   tiếp/mất" (đúng engine Duolingo).
2. **Scarcity thật vô hình** — giá TĂNG khi slot phase hết (`nextPricingPhase`), trial không bao giờ thấy "Pioneer
   12/50 · người sau trả cao hơn".
3. **Surface OUTCOME bị khóa = tường mờ đục, không phải preview** — mock-interview/capstone/personal-project = full-page
   `EnrollGate` generic ("tốn AI credit"). Đây là MOAT (bằng chứng đi làm) mà trial không thấy được mình mất gì.
4. **Surface free = ngõ cụt không payoff** — flashcard study XP, leaderboard rank → không gì kéo mua.
5. **Copy gate feature-framed, không outcome-framed** ("tốn AI credit" vs "chứng minh phỏng vấn được → được tuyển").
6. **Field pitch chưa dùng**: `completedChallenges/total` · `lessonsRead/total-premium` · `milestoneProgress` ·
   `jobReadinessBand` · phase seat capacity · loyalty %.

## Reframe cốt lõi — LOGIC COURSERA-AUDIT
Coursera: audit bài giảng FREE, TRẢ TIỀN cho **graded work + certificate** (bằng chứng đi làm). StarCi analog CHÍNH
XÁC: **nội dung free DẠY bạn; enroll mở BẰNG CHỨNG được tuyển** (capstone + mock-interview + job-readiness recruiter
thấy) — mà đúng bộ đó đã enroll-gated sẵn. Fair-monetization-sạch: trả tiền mở CÔNG VIỆC (capstone/interview/project),
rồi vẫn phải TỰ LÀM → không mua được con số. Vòng khép: **được tuyển ⇐ bằng chứng thật ⇐ phải học + phải enroll.**

## Refs (patterns thật, grounded)
- [Coursera audit → pay for graded + certificate](https://www.coursera.support/s/article/209818613) (free lectures,
  pay the employable proof) · [Duolingo streak/loss-aversion + ~8% convert](https://medium.com/emerge-edtech-insights/the-essential-guide-to-b2c-edtech-free-trials-3a7e2108f713)
  · [reverse-trial 4-12% convert (loss-aversion features đã trải nghiệm)](https://www.crazyegg.com/blog/free-to-paid-conversion-rate/)
  · [EdTech free→paid features (progress unlock, scarcity, personalized journey)](https://oyelabs.com/features-to-convert-free-users-to-paid-in-an-edtech-platform/).
- Rules: [[fair-monetization-axiom]] (trả để mở LÀM THẬT, không mua số) · [[premium-gate-is-enrollment-not-vip]]
  (gate = enroll khóa) · [[trial-preview-enrollment-optional]] (trial preview) · [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]]
  (rỗng = phễu) · [[resume-cta-only-when-away]] · [[continue-resumes-content-not-capstone]].

## Ý tưởng hệ thống — "SỢI CHỈ tới việc làm" (Proof-to-Hire spine)
1 đại lượng XUYÊN SUỐT = **job-readiness / "đường tới việc làm"** — phần lớn của nó enroll-gated (capstone+interview
+recruiter profile). Trial xây được 1 phần nhỏ (đọc/challenge free) → thấy meter + thấy phần LỚN bị khóa = outcome.
Mọi surface đóng góp vào 1 meter DUY NHẤT → free-surface hết ngõ cụt (study/leaderboard giờ "feed proof"). Kèm
scarcity giá thật. Đây là hệ; 3 hướng dưới = ĐẶT sức ép Ở ĐÂU.

---

## 3 HƯỚNG (đặt sức ép ở đâu) — thầy chọn

### Hướng A — SPINE thường trực trong learn-shell (ambient pressure)
- **1 strip/rail "Đường tới việc làm" THƯỜNG TRỰC** trong `LearnShell` (dưới header hoặc rail): meter job-readiness
  (phần free đã xây vs phần enroll-locked) + dòng scarcity giá (phase X · giá tăng lên Y ở người mua kế) + CTA enroll.
  Luôn thấy ở MỌI surface trial → sức ép ambient (Coursera audit banner + Duolingo progress).
- **Free-surface hook** = mỗi surface đóng góp meter: leaderboard "rank này tính vào recruiter profile khi enroll" ·
  study "đã thuộc X — drill phỏng vấn (enroll) biến thành tín hiệu được tuyển".
- **Trade-off:** phủ đều, thấp-friction, nhưng ambient dễ bị "mù banner" nếu không đủ sắc. Cần loss-aversion mạnh
  (progress "của bạn") để không thành thanh trang trí.
- **Ref:** Coursera audit-strip · Duolingo progress header.

### Hướng B — OUTCOME-PREVIEW tại các bức tường khóa (peak pressure) ⭐ đề xuất kết hợp
- **Biến `EnrollGate` mờ đục → PREVIEW giàu của OUTCOME**: mock-interview gate = "đây là buổi phỏng vấn chấm theo
  chính khóa bạn học · điểm recruiter thấy" + mini-teaser 1 câu · capstone gate = "đây là HỆ THỐNG bạn sẽ dựng
  (screenshot/scope thật) + vào portfolio" · personal-project = preview task + "review AI". KHÔNG generic "tốn credit".
- **Earned-moment trigger**: sau khi trial CHỨNG MINH nghiêm túc (đọc N bài free / xong N challenge) → bắn 1 conversion
  moment "bạn đã chứng minh nghiêm túc — enroll để dựng bằng chứng + mở outcome" (KHÔNG nag sớm, 1 lần, dismissible).
- **Trade-off:** ít điểm nhưng mạnh + narrative; cần build preview per-surface (nặng hơn). Đúng "reverse-trial cho
  cảm outcome trước paywall".
- **Ref:** reverse-trial aha-before-paywall · Coursera "what you'll get: certificate + graded".

### Hướng C — TRIAL-HOME thành CONVERSION DASHBOARD (consolidated)
- **Reframe content-home ("Tiếp tục học") thành trial-dashboard**: 1 màn quyết định — [đã xây free: X% · N XP · N
  challenge] → [khóa outcome: capstone/interview/recruiter profile · PREVIEW + locked] → [scarcity giá: phase, tăng] →
  [ENROLL primary]. 1 surface dồn lực.
- **Trade-off:** 1 điểm quyết định rõ, nhưng chỉ đánh user QUAY VỀ home; user lang thang surface khác không gặp.
- **Ref:** freemium "value dashboard" / audit summary page.

### ĐỀ XUẤT = HYBRID A(spine mảnh) + B(outcome-preview walls) + C(home = moment quyết định)
Spine mảnh giữ loss-aversion + scarcity THƯỜNG TRỰC (rẻ, phủ đều) · walls thành preview biến ngõ cụt → khát khao
(mạnh nhất, đúng moat) · content-home = nơi chốt (đã là surface trial land sau "Học thử"). 3 tầng sức ép: ambient →
peak-at-wall → decision-at-home.

---

## MA TRẬN STATE (trial, xuyên surface)
| State | Layout | Phễu-khóa |
|---|---|---|
| **Trial mới (chưa xây gì)** | spine meter ~0 + "đọc bài free để bắt đầu" · home = "khóa này cho bạn outcome gì" + preview | ENROLL + "học thử tiếp" |
| **Trial đang xây (đọc N/done M)** | spine meter phần free lấp dần + phần locked rõ · earned-moment khi đạt ngưỡng | ENROLL (outcome-framed) |
| **Trial đụng tường outcome** (mock-interview/capstone/PP) | **preview giàu** (không generic gate) + "đây là bằng chứng đi làm" | ENROLL primary + preview |
| **Trial đọc bài premium** | teaser + paywall inline (giữ) NHƯNG thêm "bạn đã đọc N bài · còn M bài + challenge + capstone" | ENROLL |
| **Trial ở free-surface** (leaderboard/study/foundations) | hook "cái này feed proof khi enroll" (hết ngõ cụt) | ENROLL contextual |
| **Scarcity active** (phase gần hết slot) | spine + paywall hiện "phase X · Y slot · giá tăng Z" (thật từ BE) | ENROLL (urgency) |
| **Đã enroll** | spine → "đang xây proof" bình thường (không nag) · resume học | — |
| **Loyalty (đã sở hữu khóa khác)** | paywall hiện "-5%/khóa · bundle" (giá thật) | ENROLL (giá tốt hơn) |

## CTA-khóa (phễu ở mọi state)
- **Ambient:** spine "Đường tới việc làm" (mọi surface) → ENROLL.
- **Peak:** outcome-preview walls → ENROLL (mạnh nhất).
- **Decision:** content-home trial-dashboard → ENROLL.
- **Free-surface:** hook contextual → ENROLL.
- Rỗng/chưa-xây = lời mời "đọc free để bắt đầu xây proof", KHÔNG ngõ cụt ([[layout-must-funnel...]]).

## Field BE dùng (grounded, có sẵn — chỉ FE chưa xài)
`totalXp` · `completedChallenges` + total · `lessonsRead` + total-premium · `milestoneProgress` · `jobReadinessBand`
(per-course depth) · `course.metadata.currentPhase` + `phase.slotAvailable` + `nextPricingPhase` (scarcity) ·
loyalty preview (`coursePricePreview` original→phase→discounted). → có thể cần 1-2 field aggregate mới (vd "N locked
lessons/challenges remaining", phase seat count expose) — flag khi chốt hướng.

## Cắt / Giữ / Thêm
- **GIỮ:** kiến trúc gate BE (đúng) · premium body truncate · PaymentModal/PremiumGateModal/PremiumPaywall (da tốt) ·
  pricing phase/loyalty (chỉ chưa surface) · "Học thử" entry.
- **THÊM:** spine "đường tới việc làm" (loss-aversion + scarcity) · outcome-preview thay generic EnrollGate ·
  free-surface hook · earned-moment trigger · scarcity/loyalty surfaced.
- **CẮT:** copy gate generic feature-framed ("tốn AI credit") → outcome-framed · progress "câm" (hiện số không khung
  loss-aversion).

## Nợ / cần thầy chốt
1. Hướng A / B / C / Hybrid (đề xuất Hybrid).
2. Mức "aggressive" của loss-aversion (StarCi có expiry trial không? hiện KHÔNG — có nên thêm reverse-trial downgrade,
   hay chỉ loss-aversion "mở tiếp" mềm?). Fair-monetization: không doạ mất cái đã học, chỉ "enroll để mở + giữ + đi
   tiếp".
3. Field aggregate mới (locked-count, seat-count) = BE task khi chốt.
