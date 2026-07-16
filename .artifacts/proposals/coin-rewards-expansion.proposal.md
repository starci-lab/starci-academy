# Proposal — Coin rewards: bỏ icon badge KPI + streak daily bonus + weekly-challenge claim

**Surface:** dashboard (WeeklyGoals, WeeklyChallengeCard, streak — không có UI riêng) + `/kpi` · **Nguồn:** feedback trực tiếp (không qua brainstorm chính thức) · **Ngày chốt:** 2026-07-17

## Bối cảnh
Thầy: "bỏ cái logo coin / đà học cũng cộng coin / xong nhiệm vụ cũng cộng coin / làm thử thách tuần cũng cộng coin / nghiên cứu và thêm coin vào backend fe". Research TRƯỚC khi build (không đoán bừa vì đụng economy):
- **Đọc bài/qua challenge/qua milestone/coding**: ĐÃ cộng coin sẵn (`FLAT_POINTS`: 5/20/30/20) — không phải gap.
- **Nhiệm vụ hằng ngày**: ĐÃ cộng 20 coin (`DailyQuestService`, mirror cho KPI reward trước đó) — không phải gap.
- **Thử thách tuần**: XÁC NHẬN GAP thật — `WeeklyChallengeService` doc gốc ghi rõ "Read-only... No write path", chưa có cơ chế thưởng nào.
- Đã hỏi thầy 2 quyết định: (1) v ẫn muốn thêm bonus RIÊNG mỗi-ngày-giữ-streak (ngoài coin/hoạt-động đã có) → CÓ; (2) thử thách tuần theo claim-button hay tự động → claim-button, mirror DailyQuest/KPI.

## Change 1 — Bỏ icon coin khỏi badge KPI
- `WeeklyGoals/index.tsx` + `kpi/Kpi/index.tsx`: bỏ `<CoinsIcon>` khỏi badge "+N coin", giữ text thuần.

## Change 2 — Streak daily bonus (MỚI)
- **BE:** `STREAK_DAILY_BONUS_COIN = 5` (⚠️ placeholder, cần thầy tune) trong `streak-milestone.service.ts`. Method mới `checkAndGrantDailyBonus(userId)`: đọc `last7Days` (đã có sẵn từ projection, KHÔNG query mới), lấy entry CUỐI (= hôm nay VN) — active thì cộng coin 1 lần/ngày, idempotent qua `(source, refId)` như các mechanic khác. Hook vào `UserStatsProjectionListener.recomputeTarget` — CHẠY CÙNG chỗ với `checkAndGrant` (milestone) hiện có, không cần listener/CDC mới.
- **XpSource** thêm `StreakDailyBonus = "streakDailyBonus"`.
- Không có notification riêng (tránh spam mỗi ngày) — khác với milestone (hiếm, đáng thông báo).
- **KHÔNG có UI riêng** — thầy chỉ yêu cầu cơ chế cộng coin, không yêu cầu hiển thị; StreakStrip giữ nguyên.

## Change 3 — Weekly-challenge claim (MỚI, đóng gap)
- **BE:**
  - Bảng mới `weekly_challenge_claims` (user_id, challenge_id, week_start_at unique-per-user-per-week, coin_reward, claimed_at) — reuse ĐÚNG biên "tuần" ISO đã có sẵn (`date_trunc('week', now())`, KHÔNG phải biên Thứ-2-8h-GMT7 của KPI — 2 hệ thống độc lập, giữ nguyên biên gốc của từng cái).
  - `WeeklyChallengeService` thêm `claimReward(userId)` — check pass + chưa-claim → grant qua `writeXpHistory` (idempotent, `refId` unique/user/week) + insert claim row, 1 transaction.
  - `getWeeklyChallenge` thêm field `claimed`/`coinReward` (chỉ có ý nghĩa khi viewer đã pass).
  - `WEEKLY_CHALLENGE_REWARD_COIN = 30` (⚠️ placeholder, cần thầy tune) trong `weekly-challenge.catalog.ts`.
  - **XpSource** thêm `WeeklyChallenge = "weeklyChallenge"`.
  - Mutation mới `claimWeeklyChallengeReward` (không cần arg — chỉ có 1 thử thách/tuần), mirror cấu trúc `claimDailyQuestReward`/`claimKpiReward`.
- **FE:** `WeeklyChallengeCard` — khi `viewerPassed && !claimed` → nút "Nhận +N coin" thay cho Chip xanh; claim xong → Chip xanh như cũ. Hook `useMutateClaimWeeklyChallengeRewardSwr` mirror pattern KPI.

## Change 4 — Tách hẳn `CoinSource`/`coin_histories` khỏi `XpSource`/`xp_histories` (thầy chốt sau khi review, ĐẢO Change 2/3's cách ghi)
Thầy chỉ ra: `kpiReward`/`streakDailyBonus`/`weeklyChallenge` (và 2 cái cũ `dailyQuest`/`streakMilestone`) **không có XP thật** (amount luôn 0) — không nên nằm chung `XpSource` (enum vốn nghĩa "XP source"). Research xác nhận: KHÔNG có rule/mechanism tách sẵn nào — đây là ruling MỚI. Đã hỏi thầy 2 câu (tách CẢ 5 hay chỉ 3 mới; trang "Lịch sử XP" có nên gộp hiển thị coin-only không) — thầy chọn: **tách cả 5** + **KHÔNG gộp vào Lịch sử XP** (trang đó chỉ nên là XP thật).
- **Enum mới `CoinSource`** (`coin-source.ts`): `DailyQuest`/`StreakMilestone`/`StreakDailyBonus`/`KpiReward`/`WeeklyChallenge`.
- **Bảng mới `coin_histories`** (`CoinHistoryEntity`) — SONG SONG `xp_histories`, KHÔNG có `amount`/`course_id` (coin-only luôn course-agnostic). `source` cố tình để **`varchar`** (KHÔNG native Postgres enum) — né hẳn lớp rủi ro enum-ADD/DROP-VALUE cho MỌI coin-source tương lai (giống lựa chọn đã áp cho `kpi_key`).
- **Helper mới `writeCoinHistory`** (song song `writeXpHistory`, không có tham số `amount`/`courseId`) — cả 4 chỗ gọi cũ (`DailyQuestService`, `StreakMilestoneService` ×2, `KpiRewardService`, `WeeklyChallengeService`) đều chuyển sang gọi cái này.
- **`XpSource` RÚT GỌN còn 6 value THẬT SỰ có XP**: Challenge/LessonRead/Milestone/Coding/FlashcardQuiz/FlashcardFirstReview.
- **`myXpHistory` KHÔNG sửa** — theo đúng ý thầy, giữ nguyên chỉ đọc `xp_histories` (XP thật), không union thêm `coin_histories`.

## ⚠️ RỦI RO SCHEMA THẬT — đọc kỹ TRƯỚC KHI restart bất kỳ BE dev server nào
`xp_histories.source` hiện là **native Postgres enum** (`enumName: "xp_source"`, xem `xp-history.entity.ts:134`) — cột NÀY đã tồn tại từ trước với DỮ LIỆU THẬT có `source = 'dailyQuest'`/`'streakMilestone'` (2 feature đã chạy sống). TS enum `XpSource` giờ KHÔNG còn 2 value đó nữa → lần tới `synchronize=true` chạy, TypeORM sẽ thấy lệch (DB enum có nhiều value hơn TS enum) và cố **ALTER/DROP type để khớp** — đây CHÍNH XÁC là bẫy đã ghi nhận trước đó (`typeorm-synchronize-enum-add-value-trap` / `prod-synchronize-drop-type-crashloop`), lần này còn nặng hơn vì là **XOÁ value đang có data**, không phải thêm.
- **CHƯA đụng DB thật** — không tự chạy gì. 3 hướng xử lý (thầy chọn):
  1. **Đổi cột `xp_histories.source` từ `enum`→`varchar`** (khuyến nghị) — 1 lần duy nhất, chỉ MỞ RỘNG kiểu dữ liệu (không mất data), diệt hẳn rủi ro enum-churn cho cột này vĩnh viễn — khớp tinh thần đã áp cho `kpi_key`/`coin_histories.source`.
  2. Di chuyển tay các dòng `source IN ('dailyQuest','streakMilestone')` từ `xp_histories` sang `coin_histories` trước (giữ enum Postgres nhỏ lại được), rồi mới cho synchronize chạy.
  3. Tắt `synchronize` tạm thời, tự chạy migration SQL tay có kiểm soát.
- **3 con số placeholder cần tune**: `KPI_REWARD_PER_UNIT_TARGET` (kpi-reward.catalog.ts), `STREAK_DAILY_BONUS_COIN = 5`, `WEEKLY_CHALLENGE_REWARD_COIN = 30`.

## Files to touch
- BE: `streak-milestone.service.ts`, `user-stats-projection.listener.ts`, `weekly-challenge.service.ts` (+ `types/index.ts`, `weekly-challenge.catalog.ts` mới), `weekly-challenge-claim.entity.ts` (mới) + 3 chỗ đăng ký `primary.module.ts` + barrel `entities/index.ts`, `xp-source.ts` (rút gọn), `weekly-challenge/graphql-types/response.ts`, `claim-weekly-challenge-reward/*` (mới) + `profile.module.ts`.
- BE (Change 4 — tách coin/XP): `enums/coin-source.ts` (mới) + `enums/index.ts`, `entities/coin-history.entity.ts` (mới) + `entities/index.ts` + `primary.module.ts` (3 chỗ), `xp/write-coin-history.ts` (mới) + `xp/index.ts`, `daily-quest.service.ts` (refactor), `streak-milestone.service.ts` (refactor cả 2 method), `kpi-reward.service.ts` (refactor), `weekly-challenge.service.ts` (refactor).
- FE: `WeeklyGoals/index.tsx`, `kpi/Kpi/index.tsx` (bỏ icon), `WeeklyChallengeCard/index.tsx`, `query-weekly-challenge.ts` (+ types), mutation+hook mới, `vi.json`/`en.json`.

## Verify plan
- BE+FE `tsc`/`eslint` sạch (đã chạy — 0 lỗi mới, baseline pre-existing không đổi).
- Runtime CHƯA verify (dev server bị phiên khác giữ khoá `.next`, như các lần trước).
- Khi chạy thật: pass thử thách tuần → nút "Nhận +30 coin" hiện → bấm → coin cộng vào ví, nút đổi thành Chip "Đã vượt qua"; claim lại lần 2 → lỗi "already claimed" đúng exception.

## Bảng component → Storybook
| Component | Story | Mới/Sửa | Ghi chú |
|---|---|---|---|
| `WeeklyChallengeCard` | — | sửa | feature-component, không story riêng |
| `WeeklyGoals`/`Kpi` | — | sửa (bỏ icon) | feature-component, không story riêng |

## Nguồn tham khảo
- `points-config.ts` (FLAT_POINTS — xác nhận coin đã có ở activity thường) · `daily-quest.service.ts`/`daily-quest.catalog.ts` (claim pattern mirror) · `streak-milestone.service.ts` (mở rộng) · `weekly-challenge.service.ts` (gap xác nhận từ chính doc comment gốc) · `user-stats-projection.listener.ts` (hook point streak daily bonus).
