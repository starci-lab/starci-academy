# Proposal — Chốt SỐ cho nền kinh tế XP/Coin (tune placeholder → final)

**Surface:** toàn hệ reward economy (activity coin · daily quest · streak · weekly challenge · KPI · shop) · **Nguồn:** design/balancing (thầy chốt luật "XP+Coin chung khi first-time · bonus task = coin-only") · **Ngày:** 2026-07-17

## Bối cảnh
Luật lõi thầy vừa chốt (đã ghi memory): trong học BÌNH THƯỜNG, XP + Coin cộng CÙNG NHAU ở **lần ĐẦU** làm 1 action đủ điều kiện (đọc lesson, qua challenge, qua milestone, giải coding) — track qua `refId` unique nên làm lại KHÔNG cộng lại. Làm task PHỤ/bonus (daily quest, weekly-challenge claim, KPI claim, streak bonus) = **COIN-ONLY** (không XP). Đã tách code: `XpSource` (XP thật) vs `CoinSource` (coin-only), 2 bảng `xp_histories`/`coin_histories`.

Nhiệm vụ đợt này: **tune 8 số placeholder** vừa thêm session này (`streakDailyBonus`, `weeklyChallengeReward`, 6 hệ số `kpiReward`) thành final + rationale, sau khi kiểm pacing so với giá shop. KHÔNG đụng số REAL/shipped trừ khi phát hiện lỗi pacing nghiêm trọng (chỉ flag, không đổi).

## Số REAL/SHIPPED (KHÔNG đổi — chỉ tham chiếu)
| Cơ chế | Số | Nguồn |
|---|---|---|
| lessonRead (first-time) | 5 coin + XP | `points-config.ts` FLAT_POINTS |
| challengePassed (first-time) | 20 coin + XP | `points-config.ts` |
| milestonePassed (first-time) | 30 coin + XP | `points-config.ts` |
| codingSolved (first-time) | 20 coin + XP | `points-config.ts` |
| dailyQuest (claim ≥3/5 tasks, 1×/ngày) | 20 coin | `points-config.ts` / DailyQuestService |
| streakMilestone 7d / 30d / 100d | 30 / 100 / 300 coin | one-time/milestone |
| **Shop:** streak-freeze / sticker / AI-credit / voucher-10% / t-shirt | 100 / 300 / 500 / 800 / 1500 coin | `rewards.catalog.ts` |

## Phân tích pacing — 3 persona (thu nhập coin/tuần)

Tính THEO số final đề xuất bên dưới (streakDailyBonus 5, weekly 40, KPI flashcards 0.2, còn lại giữ placeholder).

### Casual (3–4 ngày học/tuần, ~4 lesson, ~1 challenge, daily quest ~3 ngày, weekly ~50%)
| Dòng | Coin |
|---|---|
| Lessons 4×5 | 20 |
| Challenge 1×20 | 20 |
| Daily quest 3×20 | 60 |
| Streak daily bonus ~4×5 | 20 |
| Weekly challenge (~50%) | ~20 |
| KPI (hầu như không đạt default; nếu set preset thấp) | ~6 |
| **Tổng ≈** | **~146 / tuần → ~584 / tháng** |

→ streak-freeze <1 tuần · sticker ~2 tuần · AI-credit ~3.5 tuần · voucher ~5.5 tuần · **t-shirt ~10 tuần (~2.5 tháng)**. Phù hợp: casual chậm nhưng shop KHÔNG xa tầm với; món to là mục tiêu dài hạn.

### Consistent (6 ngày, ~8 lesson, ~3 challenge, ~2 coding, ~1 milestone, daily quest 6×, weekly ✓, đạt ~4 KPI default)
| Dòng | Coin |
|---|---|
| Lessons 8×5 | 40 |
| Challenges 3×20 | 60 |
| Coding 2×20 | 40 |
| Milestone 1×30 | 30 |
| Daily quest 6×20 | 120 |
| Streak daily bonus 7×5 | 35 |
| Weekly challenge | 40 |
| KPI: lessons(10)+studyDays(20)+challenges(15)+flashcards(4) | ~49 |
| **Tổng ≈** | **~414 / tuần → ~1656 / tháng** |

→ voucher ~2 tuần · **t-shirt ~3.6 tuần (~1 tháng)** · AI-credit ~1 tuần. Điểm ngọt: người học đều đặn kiếm được 1 món merch to sau ~1 tháng cày thật — đáng, không trivial.

### Hardcore (7 ngày, ~15 lesson, ~6 challenge, ~5 coding, ~3 milestone, daily quest 7×, set target KPI cao & ĐẠT)
| Dòng | Coin |
|---|---|
| Activity (lesson/challenge/coding/milestone) | 385 |
| Daily quest 7×20 | 140 |
| Streak daily bonus 7×5 | 35 |
| Weekly challenge | 40 |
| KPI (target cao, all hit): 20+28+50+50+60+50 | ~258 |
| **Tổng ≈** | **~658 / tuần → ~2632 / tháng** |

→ t-shirt ~2.3 tuần. Nhanh, nhưng đây là cày thật-sự-nhiều (15 lesson + 6 challenge + 5 coding + 3 milestone/tuần); merch vật lý còn cổng `pending` ops-fulfill nên không "tràn kho". Chấp nhận được.

### Kết luận pacing
Mọi món shop earnable ở nhịp thoả mãn; món to (voucher/t-shirt) KHÔNG trivial-trong-vài-ngày với người học thật, cũng không xa vời với casual. **Không có lỗi pacing nghiêm trọng** ⇒ không đổi số shipped.

## ⭐ Insight lớn nhất: trọng tâm kinh tế là DAILY QUEST, không phải placeholder
Với người dùng gắn bó, **daily quest (20×7 = 140 coin/tuần tiềm năng) là dòng thu LỚN NHẤT** — lớn hơn TỔNG mọi KPI reward ở target default, và lớn hơn coin activity first-time. Hệ quả:
- 8 số placeholder tôi đang tune là **đòn bẩy THỨ CẤP** — sai lệch vài coin gần như không dịch chuyển tổng thể. Đừng agonize; chỉ cần coherent + fair per-effort.
- Nếu SAU NÀY tổng nhịp cần siết/nới, **cần lever chính là `dailyQuest` (20, shipped)** — vòi nước thống trị. Nhưng nó đã live prod ⇒ chỉ FLAG (xem cuối), không đổi ở proposal số này.

## Chốt SỐ placeholder + rationale

### 1. `streakDailyBonus` = **5 coin** (CONFIRM placeholder)
Nudge nhỏ mỗi-ngày-giữ-streak. Cố ý THẤP hơn dailyQuest (20) vì "streak còn sống" là ngưỡng dễ hơn "hoàn thành 3/5 task". Trần 35/tuần ⇒ chỉ là lớp consistency mỏng phủ lên daily quest + milestone (đã thưởng consistency nặng). Giữ 5.

### 2. `weeklyChallengeReward` = **40 coin** (đề xuất nâng từ 30) ⚠️ low-stakes
Neo = 2× challenge thường (20) ⇒ đánh dấu rõ đây là "thử thách tuần đặc biệt/khó" mà không lấn cơ chế hằng ngày. 30 (placeholder cũ) là số tuỳ ý; 40 có mốc neo sạch. **⚠️ Chênh 30↔40 gần như vô nghĩa về tổng (10 coin/tuần)** — nếu muốn tránh churn số đã ship, giữ 30 cũng CHẤP NHẬN được. Khuyến nghị 40 cho tín hiệu "headline".

### 3. `kpiReward` — GIỮ shape per-unit-multiplier, tune 1 hệ số
**Xác nhận GIỮ công thức `round(floorTarget × multiplier)`** (không đổi sang flat-per-tier): vì coin activity nền cũng scale tuyến tính theo target, tỉ lệ bonus/effort GIỮ hằng số ở mọi mức target ⇒ shape lành mạnh, và giữ đúng ý thầy "đặt KPI càng hăng càng kiếm nhiều". Floor-target đã chặn lách "đạt-rồi-mới-nâng".

Kiểm tỉ lệ bonus-KPI / coin-activity-nền (ở target default) để cân per-effort:
| KPI | multiplier | default target → coin | coin activity nền để đạt | tỉ lệ | verdict |
|---|---|---|---|---|---|
| lessons | **2** | 5 → 10 | 5 lesson = 25 | 40% | giữ ✓ |
| studyDays | **4** | 5 → 20 | (meta, 0 nền) | — | giữ ✓ (đồng cỡ dailyQuest, trần max 7→28) |
| challenges | **5** | 3 → 15 | 3×20 = 60 | 25% | giữ ✓ |
| coding | **5** | 3 → 15 | 3×20 = 60 | 25% | giữ ✓ |
| flashcards | **0.2** ⬇ | 20 → 4 | (meta, 0 nền/coin; chỉ XP) | — | **HẠ từ 0.3** |
| milestones | **10** | 2 → 20 | 2×30 = 60 | 33% | giữ ✓ |

**Vì sao HẠ flashcards 0.3 → 0.2:** flashcard là action THẤP-effort NHẤT + volume CAO nhất (preset tới 300 review/tuần = 43/ngày) và là KPI DUY NHẤT có multiplier phân số. 0.3 cho preset 50/150/300 → 15/45/90 coin; ở 300-review-grind, 90 coin ≈ 1/3 sticker là hơi hào phóng cho review lặp giá-trị-thấp (và có vector grind lặp thẻ cũ). 0.2 → preset **10/30/60**, default 20→**4**, max 1000→200: giữ flashcards vẫn có thưởng (vì không có coin nền) nhưng ghìm grind. ⚠️ Đây là hệ số DUY NHẤT tôi đổi.

## Bảng SỐ FINAL
| Tham số | Placeholder cũ | **FINAL** | Ghi chú |
|---|---|---|---|
| `streakDailyBonus` | 5 | **5** | confirm |
| `weeklyChallengeReward` | 30 | **40** ⚠️ | nâng nhẹ; 30 vẫn OK, low-stakes |
| `kpiReward.lessons` | 2 | **2** | confirm |
| `kpiReward.studyDays` | 4 | **4** | confirm |
| `kpiReward.challenges` | 5 | **5** | confirm |
| `kpiReward.coding` | 5 | **5** | confirm |
| `kpiReward.flashcards` | 0.3 | **0.2** ⬇ | hạ — anti-grind action thấp-effort |
| `kpiReward.milestones` | 10 | **10** | confirm |
| công thức KPI | per-unit × floorTarget | **GIỮ NGUYÊN** | shape lành mạnh, đúng ý thầy |

## ⚠️ Ghi chú "số shipped có thể cần soi lại"
1. **`dailyQuest` = 20 là vòi thống trị** (140/tuần) — nếu tổng nhịp economy cần chỉnh về sau, đây là lever chính, KHÔNG phải placeholder. Đang live prod ⇒ chỉ flag, chưa đổi.
2. **⚠️ Data lệch: flashcards dashboard default target = 20 < preset thấp nhất 50.** Default nằm DƯỚI quick-pick thấp nhất — nghi cấu hình lệch, đội nên soi (không phải số của proposal này để chốt).

## Chốt tiếp — thầy 2026-07-17 (lượt sau): T-shirt = cày 6 THÁNG (đã áp)
Thầy chỉnh: t-shirt phải là mục tiêu DÀI HẠN thật sự, không phải ~1 tháng như ghi chú #2 (bản gốc) cảnh báo. Tính lại theo persona Consistent (~414 coin/tuần, dùng làm mốc "người học thật, đều đặn"):
```
414 coin/tuần × ~26 tuần (6 tháng) ≈ 10,764 → làm tròn 11,000
```
**Đã áp vào `rewards.catalog.ts`: `tshirt.cost` 1500 → 11000.** Casual (~146/tuần) sẽ mất ~75 tuần (~17 tháng) — chấp nhận được vì đây là mục tiêu "cày thật", không phải hàng ai cũng lấy nhanh; Hardcore (~658/tuần) mất ~17 tuần (~4 tháng) — vẫn dài, đúng tinh thần flagship. Sticker (300)/voucher (800)/AI-credit (500)/streak-freeze (100) giữ nguyên — chỉ t-shirt là mục tiêu dài hạn, các món khác vẫn đúng nhịp ngắn/trung hạn như phân tích gốc.

## Bổ sung — vá lỗ hổng Flashcard (chỉ có XP, thiếu Coin) — thầy 2026-07-17 (lượt sau)

Audit bảng lộ 2 action HỌC first-time chỉ cấp XP mà **Coin = 0**, phá luật lõi "XP + Coin cộng cùng nhau khi first-time làm action đủ điều kiện" (mọi action khác — lessonRead/challengePassed/milestonePassed/codingSolved — đều cấp cả hai). Coin là tiền TỆ TOÀN CỤC, phẳng, luôn cộng dồn ⇒ số phải comparable với 5/20/20/30 hiện có, KHÔNG scale theo XP per-course.

### A. `flashcardQuizSession` (hoàn thành 1 session quiz, `XpSource.FlashcardQuiz`) = **5 coin/session**
- **Neo = lessonRead (5).** Hoàn thành 1 session quiz ≈ "học xong 1 đơn vị" như đọc xong 1 lesson ⇒ cùng tier hoạt-động 5. Session-level (không phải per-card), cadence "complete something" đúng như tier lesson.
- **Trần chống grind = KẾ THỪA cap XP sẵn có, KHÔNG cần cap coin mới:** chỉ cấp coin cho session NÀO còn ĂN XP (dưới `DAILY_QUIZ_XP_CAP=60`, tức `60/15 ≈ 4` session/ngày). Session thứ 5+ trong ngày đã 0 XP ⇒ cũng 0 coin. Trần cứng **≈20 coin/ngày = 140/tuần** chỉ với người chạy đủ 4 session MỖI ngày (hiếm); thực tế ~1 session/ngày.
- Cố ý ĐỂ dưới dailyQuest (20): quiz là 1 lát study đơn, nhẹ hơn "hoàn thành 3/5 task ngày".

### B. `flashcardFirstReview` (lần ĐẦU chấm 1 card cụ thể, `XpSource.FlashcardFirstReview`) = **1 coin/card**
- **Đặt ở SÀN nguyên >0** (1 coin) — đủ giữ luật lõi (>0, đi kèm), không hơn. Lý do: đây là action **thấp-effort NHẤT** (chấm 1 thẻ) + **volume CAO nhất** (hàng trăm card distinct/user). Cùng logic đã HẠ multiplier KPI flashcards 0.3→0.2 ở trên.
- **Là POOL HỮU HẠN once-per-card-ever, KHÔNG phải vòi tái tạo:** tổng coin trọn đời = (số card distinct user chạm) × 1 — vd ~500 card toàn khóa ⇒ trần trọn-đời ~500 coin, trải nhiều tháng, front-loaded rồi tắt dần về 0 khi hết thẻ mới. Không có nhịp thu bền vững để grind.
- 1 là số integer nhỏ nhất >0; đặt cao hơn (vd 5 như lesson) thì 100 card = 500 coin = trọn 1 AI-credit chỉ từ việc chạm-thẻ-lần-đầu ⇒ hào phóng sai cho action nhẹ nhất.

### Pacing sanity-check — 3 persona
Bảng persona hiện KHÔNG itemize coin flashcard (trước đây = 0). Thêm A+B:
- **A (quiz 5/session, kế thừa cap):** thực tế ~1 session/ngày. Consistent +~30/tuần (414→~444, +7%) · Casual +~15 (146→~161) · Hardcore thực tế ~35 (658→~693); trần grind lý thuyết +140/tuần chỉ với case 4-session-mỗi-ngày (không realistic).
- **B (1 coin/card):** front-loaded lúc khám phá thẻ mới (~20–40 coin/tuần đầu), TẮT DẦN về 0 (pool hữu hạn) — không phải dòng thu đều.
- **Kết luận:** dịch chuyển tổng chỉ single-digit → low-double-digit %, **KHÔNG đổi verdict shop-timing nào** (t-shirt vẫn ~6 tháng cho Consistent, voucher/sticker/AI-credit vẫn đúng band ngắn/trung hạn). **Không món shipped nào cần soi lại.** dailyQuest (140/tuần) vẫn là vòi thu lớn nhất — 2 số này là lớp mỏng vá đúng-luật, không phải faucet mới.

### Bảng SỐ FINAL (bổ sung)
| Tham số | Cũ | **FINAL** | Ghi chú |
|---|---|---|---|
| `flashcardQuizSession` coin | 0 (thiếu) | **5** | neo lessonRead; chỉ cấp khi session còn ăn XP (kế thừa cap 60 XP/ngày ⇒ ≤4 session ⇒ trần ~20 coin/ngày) |
| `flashcardFirstReview` coin | 0 (thiếu) | **1** | sàn >0; pool hữu hạn once-per-card; action thấp-effort + high-volume nhất |

**Đã áp code:** `points-config.ts` thêm `flashcardQuizSession: 5`, `flashcardFirstReview: 1` (+ bỏ `dailyQuest` dead entry — DailyQuestService dùng `DAILY_QUEST_REWARD` riêng, không đọc FLAT_POINTS.dailyQuest); `flashcard-quiz-session.service.ts` + `flashcard-review.service.ts` đổi `points: 0` → `points: FLAT_POINTS.xxx`. tsc/eslint sạch.

## Bổ sung — kiến trúc XP/Points/Coin, sửa lệch tên biến (thầy 2026-07-17, lượt cuối)

Thầy chốt 3 tầng đúng: **XP** = trong 1 khóa (`xp_histories.amount` lọc `course_id`) · **Points** = TOÀN CỤC, cộng dồn TẤT CẢ khóa + coding (`SUM(amount)` KHÔNG lọc) · **Coins** = field độc lập hoàn toàn (`user.coin_balance`), không suy ra từ XP/Points. Xác nhận qua `user-xp-projection.service.ts` (`user_xp_projections`) — nơi này ĐÃ tính `challengeXp`/`milestoneXp`/`codingXp`/`lessonXp` bằng `SUM(amount) FROM xp_histories GROUP BY source` (per-course/per-nguồn), nhưng `totalPoints` (Points toàn cục) lại ĐANG đọc field đếm-dồn `users.total_points` thay vì cũng `SUM(amount)` không lọc như 4 dòng kia — LỆCH nhất quán.

**Đã sửa:**
1. `user-xp-projection.service.ts` — `totalPoints` đổi sang `SUM(amount) FROM xp_histories WHERE user_id=$1` (không lọc source/course) — khớp pattern 4 dòng per-source phía trên, 1 nguồn sự thật duy nhất = ledger.
2. `write-xp-history.ts` — BỎ hẳn dòng `increment(UserEntity, "totalPoints", amount)` — không còn field đếm-dồn nào cần maintain nữa, Points luôn tính live từ ledger.
3. `loyalty-discount.service.ts` — đổi chỗ đọc trực tiếp `user.totalPoints` (ngưỡng "diligent" ≥1000) sang đọc qua `UserXpProjectionService.getXp()` (đã tính đúng, cached TTL).
4. `user.entity.ts` — field `total_points` gắn cảnh báo ⚠️ LEGACY/KHÔNG CÒN maintain, đóng băng giá trị cũ — **KHÔNG xoá cột** (né rủi ro `synchronize` DROP COLUMN đụng schema thật, giữ tinh thần thận trọng đã áp cho XpSource/CoinSource lượt trước) — cột an toàn để drop sau này qua migration thật nếu thầy muốn.
5. Cập nhật mọi doc-comment liên quan (`xp-source.ts`, `user-xp-projection.entity.ts`, `user-xp-projection.listener.ts`, `types/index.ts`, `judge-coding-submission-judge-step.service.ts`) cho khớp thực tế mới.

**KHÔNG đụng:** `coding-progress.service.ts`'s field `totalPoints` (đây là 1 field TÊN GIỐNG nhưng thực chất đọc `coin_balance`, chính comment gốc trong file đã cảnh báo "NOTE: totalPoints here is the whole Coin balance, not a coding-only figure") — vấn đề tên khác, không thuộc phạm vi sửa lần này, ghi nhận riêng nếu thầy muốn dọn sau.

tsc/eslint sạch (baseline lỗi cũ không đổi, +6 lỗi thấy ở lần chạy này đều thuộc file KHÔNG liên quan — do 1 phiên khác đang sửa song song cùng repo).

### Dọn tàn dư — thầy chốt "xóa hết" (lượt cuối cùng)
- **Xoá HẲN field `totalPoints`** khỏi `UserEntity` (bỏ `@Column`+`@Field`, không chỉ đánh dấu legacy nữa) — không còn field đếm-dồn nào tồn tại trong code.
- **Migration mới** `1723900000000-DropLegacyUserTotalPoints.ts` — `ALTER TABLE users DROP COLUMN total_points` (mirror đúng style migration cũ trong repo, có `down()` backfill lại từ ledger nếu cần rollback). **CHƯA CHẠY trên DB thật** — file đã viết sẵn, chờ thầy áp (`npm run migration:run` hoặc tương đương) khi thầy sẵn sàng; dev local `synchronize=true` sẽ tự DROP COLUMN khi server khởi động lại (an toàn — khác hẳn rủi ro DROP TYPE của enum, cột thường Postgres cho DROP COLUMN trực tiếp không cần dựng lại type).
- **Đã tìm thêm "bảng tàn dư" khác nhưng KHÔNG đụng:** đào ra `cv_submissions`/`cv_submission_attempts` — có comment cũ trong migration `BackfillLegacyCvIntoUnified` ghi rõ "dropping the legacy tables themselves is a separate, later migration" (nghe giống ứng viên). Nhưng grep xác nhận **VẪN ĐANG ACTIVE** — `revise-cv.handler.ts`, query `cv-url`, query `user-cv-submission-attempts`, `enqueue-generate-cv.service.ts` đều còn đọc/ghi 2 bảng này (phục vụ luồng "xem/sửa CV cũ", khác với luồng chấm điểm job-readiness đã chuyển sang bảng hợp nhất). **KHÔNG an toàn để xoá** — ngoài phạm vi câu hỏi Points/XP/Coin, để nguyên, chỉ báo cáo lại cho thầy biết đã thấy.

### Đợt dọn tiếp — thầy "xóa hết tàn dư đi, lỗi sửa sau" (lượt cuối cùng)
Thầy cho phép xoá RỘNG hơn, chấp nhận rủi ro/lỗi tạm thời để dọn sạch. Fan-out research trước khi xoá (không xoá mù) để biết chính xác cái gì còn sống:

1. **`users.total_points`** — xoá field khỏi `UserEntity` + viết migration `1723900000000-DropLegacyUserTotalPoints.ts` (DROP COLUMN, `down()` backfill lại từ ledger nếu rollback). **CHƯA CHẠY trên DB thật.**
2. **2 bảng CV cũ `cv_submissions`/`cv_submission_attempts`** — research lại kỹ hơn cho thấy: có 1 phần code vẫn đang đọc (khác đánh giá ban đầu), nhưng TẤT CẢ đều là code CHẾT phía FE (0 consumer thật):
   - Xoá HẲN: query `cvUrl`, query `userCvSubmissionAttempts`, mutation `verifySubmitCvPresignUrl` (cả 3 — 0 người gọi từ FE thật) + 2 exception liên quan (`CvSubmissionNotFoundException`, `UserCVSubmissionNotFoundException` — cái sau vốn đã 0 throw site).
   - **Sửa (không xoá hẳn vì mutation này SỐNG thật):** `generateSubmitCvPresignUrl` — bỏ hẳn phần đọc/ghi bảng cũ (chỉ còn sinh presign URL thuần, FE chưa từng đọc field `cvSubmissionId` trả về) — sửa luôn spec test khớp behavior mới.
   - **Sửa 1 chỗ MẤT tính năng thật (chấp nhận theo "lỗi sửa sau"):** `learning-feedbacks-cms.service.ts` — bỏ nhánh UNION thứ 3 ("cv" — đọc `cv_submission_attempts.detail_feedback`) vì bảng hợp nhất `cv_generations.feedback` là jsonb khác hình dạng, không thay 1-1 ngay được. Feed "học tập" (learner-CMS) **mất tạm mục feedback CV** cho tới khi có người viết lại nhánh mới đọc từ `cv_generations`.
   - Xoá 2 entity (`user-cv-submissions.entity.ts`, `user-cv-submission-attempts.entity.ts`) + enum `CvSubmissionStatus` (0 consumer sau khi xoá) + gỡ khỏi `primary.module.ts` (3 chỗ) + barrel.
   - Migration mới `1724000000000-DropLegacyCvSubmissionTables.ts` — DROP cả 2 bảng, `down()` dựng lại đúng schema gốc (đọc lại từ git history TRƯỚC khi xoá file, không đoán mò cột/kiểu dữ liệu).
   - Dọn luôn 3 doc-comment `{@link UserCVSubmissionEntity}` còn sót ở file khác (không phải phụ thuộc code thật, chỉ là chú thích lỗi thời).

**tsc/eslint sạch** (baseline 250 lỗi cũ y nguyên, không tăng không giảm — có 1 lỗi thật phát sinh từ spec test cũ, đã sửa cùng lượt).

**⚠️ CẢ 2 migration mới ĐỀU CHƯA CHẠY trên DB thật** — file đã viết sẵn (`1723900000000`, `1724000000000`), chờ thầy áp khi sẵn sàng (`npm run migration:run` hoặc tương đương).

## Nguồn tham khảo
- `src/features/api/processors/ai/shared/xp/points-config.ts` (FLAT_POINTS — số activity + dailyQuest shipped)
- `src/modules/bussiness/flashcard/flashcard-quiz-session.service.ts` · `flashcard-review.service.ts` (nơi 2 gap XP-only sinh ra — starci-academy-backend)
- `src/modules/bussiness/rewards/rewards.catalog.ts` (giá shop shipped 100/300/500/800/1500)
- `src/modules/bussiness/projections/user-xp/user-xp-projection.service.ts` (Points = SUM(amount) không lọc — sửa lượt này)
- `src/modules/databases/postgresql/primary/migrations/1718700000000-PointsToTotalAndRewardPlusUserXpProjection.ts` (migration lịch sử — xác nhận công thức `total_points = SUM(amount)` từng dùng để backfill, đúng hướng sửa lần này)
- `.artifacts/proposals/coin-rewards-expansion.proposal.md` (streakDailyBonus + weeklyChallenge placeholder gốc, tách CoinSource)
- `.artifacts/proposals/kpi-reward-coins.proposal.md` (KPI floor-target + per-unit-multiplier gốc + preset/default/max)
- Memory: luật XP+Coin first-time vs bonus coin-only (session này)
