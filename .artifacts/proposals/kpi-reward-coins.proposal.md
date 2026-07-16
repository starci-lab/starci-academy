# Proposal — KPI tuần: claim coin, thưởng scale theo target (target càng cao thưởng càng nhiều)

**Surface:** `/vi/dashboard?tab=overview` (WeeklyGoals card) + `/vi/kpi` · **Nguồn:** feedback/layout lane · **Ngày chốt:** 2026-07-17

## Bối cảnh + quyết định của thầy
Thầy: "hoàn tất được nhận coins nữa, đặt kpi càng hăng càng kiếm được nhiều coins". Trước khi thiết kế, soi hạ tầng thưởng coin CÓ SẴN (`DailyQuestService.claimReward` — flat 20 điểm, claim 1 lần/ngày, chống double-claim bằng dòng completion unique) để KHÔNG dựng lại từ đầu. Phát hiện 1 lỗ hổng game-design (thưởng scale theo target thì có thể "chờ đạt rồi mới nâng target để ăn thưởng cao") → đã hỏi thầy 2 quyết định:
1. **Chống lách:** khoá theo **target THẤP NHẤT từng có hiệu lực trong tuần** (không phải target lúc claim).
2. **Granularity:** claim **từng KPI riêng** (không gộp 1 nút như DailyQuest).

## Data-ceiling map
- **(A) Đang có sẵn, TÁI DÙNG:** `writeXpHistory({source, amount, points, refId})` — helper ghi ledger + cộng `coinBalance` idempotent qua `refId` (dùng bởi `DailyQuestService`/`StreakMilestone`). `XpSource` enum pattern (thêm 1 value mới). `daily_quest_completions` table = mẫu cho idempotency-row-per-period.
- **(B) CẦN MỚI (BE):**
  1. **Bảng `kpi_weekly_reward_floors`** — `(user_id, kpi_key, week_start_at, floor_target int, claimed_at timestamptz null, coin_reward int null)`, unique `(user_id, kpi_key, week_start_at)`. Đây là NƠI DUY NHẤT lưu cả 2 việc: track "floor" (chống lách) VÀ trạng thái claim (idempotency) — 1 bảng, không tách 2.
  2. **`week_start_at`** dùng CHUNG biểu thức tuần-lịch với proposal `kpi-weekly-reset-countdown` (Mon 8h GMT+7) — **PHỤ THUỘC proposal đó build TRƯỚC** (cùng khái niệm tuần, tránh 2 nguồn định nghĩa "tuần" lệch nhau).
  3. **Hook vào `setKpiTarget` mutation:** mỗi lần user đổi target trong tuần → UPSERT `kpi_weekly_reward_floors` với `floor_target = LEAST(existing.floor_target, new_target)` (tạo mới nếu tuần này chưa có dòng, floor = giá trị đang set). Tuần user KHÔNG hề đổi target (giữ nguyên từ tuần trước) → không có dòng → lúc claim, floor = `user.weeklyKpiTargets[key]` hiện tại (đúng vì suốt tuần không đổi, không có gì để lách).
  4. **Mutation mới `claimKpiReward(key: KpiKey)`:** transaction — đọc `current` (từ `UserStatsProjectionService.getStats`) + floor hiệu lực (dòng ở trên hoặc fallback current target) → check `current >= floor` (chưa đạt → throw) → check `claimed_at IS NULL` (đã claim → throw) → `writeXpHistory({source: XpSource.KpiReward, amount:0, points: coinReward, refId: 'kpi:${key}:${weekStartAt}'})` → UPDATE dòng `claimed_at=now(), coin_reward=coinReward`.
  5. **`XpSource` thêm value `KpiReward`** — ⚠️ theo runbook đã biết (`typeorm-synchronize-enum-add-value-trap`): cột `source` dùng chung ≥2 bảng → phải `ALTER TYPE xp_source_enum ADD VALUE 'kpiReward'` TAY trước khi deploy, KHÔNG để synchronize tự DROP/CREATE type (crash boot).
- **(C) Compute công thức thưởng — ĐỀ XUẤT, CẦN THẦY TUNE SỐ:**
  ```ts
  // kpi-reward.catalog.ts — mirror daily-quest.catalog.ts pattern
  export const KPI_REWARD_PER_UNIT_TARGET: Record<KpiKey, number> = {
      lessons: 2,       // target 5  → 10 coin
      studyDays: 4,      // target 5  → 20 coin
      challenges: 5,     // target 3  → 15 coin
      coding: 5,         // target 3  → 15 coin
      flashcards: 0.3,   // target 20 → 6 coin (làm tròn)
      milestones: 10,    // target 2  → 20 coin
  }
  // coinReward = Math.round(floorTarget * KPI_REWARD_PER_UNIT_TARGET[key])
  ```
  Số trên CHỈ LÀ KHUNG để có công thức chạy được — thầy cần tune lại theo cân bằng kinh tế thật (coin hiện đổi được gì trong `RewardCatalog`, giá voucher bao nhiêu) trước khi ship, đừng lấy nguyên số này làm final.

## Change 1 — BE: floor-tracking + claim mutation
- **File mới:** `src/modules/databases/postgresql/primary/entities/kpi-weekly-reward-floor.entity.ts` (bảng ở trên).
- **File:** `xp-source.ts` — thêm `KpiReward = "kpiReward"` (+ ALTER TYPE tay, xem trên).
- **File:** `set-kpi-target.resolver.ts` (hoặc service nó gọi) — thêm UPSERT floor sau khi ghi target.
- **File mới:** `claim-kpi-reward/claim-kpi-reward.resolver.ts` (+ module) — mutation `claimKpiReward(key: KpiKey)`, mirror cấu trúc `claim-daily-quest-reward/`.
- **File mới:** `kpi-reward.catalog.ts` — bảng hệ số trên.
- **File:** `my-kpis.resolver.ts` — mỗi `KpiItemData` thêm `coinReward: number | null` (null khi chưa set target) + `claimed: boolean` + `canClaim: boolean` (`current >= floorTarget && !claimed`), đọc từ floor table.

## Change 2 — FE: nút "Nhận thưởng" + badge coin (mirror DailyQuest CTA)
- **File:** `WeeklyGoals/index.tsx` + `kpi/Kpi/index.tsx` — mỗi hàng KPI thêm badge `🪙 +{coinReward} coin` (muted khi chưa đạt) + nút claim khi `canClaim` (variant primary nhỏ, mirror nút "Nhận thưởng" của DailyQuest). Claim xong → `mutate()` revalidate, badge chuyển "Đã nhận" (mirror DailyQuest done-state).
- **Hook mới:** `useMutateClaimKpiRewardSwr` (mirror `useMutateClaimDailyQuestRewardSwr` nếu có, hoặc mirror `useMutateSetKpiTargetSwr`).
- **Types:** `QueryKpiItemData` thêm `coinReward: number | null`, `claimed: boolean`, `canClaim: boolean`.
- **i18n:** `dashboard.kpi.claimReward` ("Nhận thưởng"/"Claim reward"), `dashboard.kpi.claimed` ("Đã nhận"/"Claimed"), `dashboard.kpi.coinReward` ("+{count} coin"/"+{count} coins").

## Phụ thuộc + thứ tự build
1. **`kpi-weekly-reset-countdown` build TRƯỚC** (cùng khái niệm "tuần" — reward floor cần `week_start_at` nhất quán với reset).
2. Rồi mới build proposal này.

## Files to touch
- BE: `kpi-weekly-reward-floor.entity.ts` (mới), `xp-source.ts`, `set-kpi-target.resolver.ts`, `claim-kpi-reward/*` (mới), `kpi-reward.catalog.ts` (mới), `my-kpis.resolver.ts` (+ `graphql-types/response.ts`)
- FE: `WeeklyGoals/index.tsx`, `kpi/Kpi/index.tsx`, `my-kpis.ts` (types), hook mới, `vi.json`/`en.json`

## Verify plan
- BE: unit-test formula + floor-LEAST logic (đổi target lên rồi xuống trong cùng tuần → floor giữ giá trị THẤP NHẤT, không phải mới nhất). Runtime: set target thấp → đạt → claim → sau đó nâng target cao → claim lại phải THẤT BẠI (đã claimed_at) — xác nhận lỗ hổng đã bịt.
- FE: nút claim chỉ hiện khi `canClaim`, disable sau khi claim, coin cộng đúng vào ví (`RewardsPage` wallet balance tăng).

## Bảng component → Storybook
| Component | Story | Mới/Sửa | Ghi chú |
|---|---|---|---|
| Claim button/badge | — | không cần block mới | mirror DailyQuest CTA — nút HeroUI thường (`variant="primary" size="sm"`), không phải component tách; feature `WeeklyGoals`/`Kpi` không có story riêng |

## Nguồn tham khảo
- `daily-quest.service.ts` (toàn bộ — claim pattern, idempotency, `writeXpHistory`) · `daily-quest.catalog.ts` (mẫu catalog số) · `xp-source.ts` (thêm value) · `[[typeorm-synchronize-enum-add-value-trap]]` (memory — ALTER TYPE tay) · `set-kpi-target.resolver.ts`/`my-kpis.resolver.ts` (nơi mở rộng).
- Prototype: `.artifacts/prototypes/kpi-page/index.html` (http://127.0.0.1:8083) — 2 hàng ví dụ: "Nội dung" (chưa đạt, badge mờ) và "Ngày học" (đạt, nút "Nhận thưởng" active), đánh dấu MỚI.
