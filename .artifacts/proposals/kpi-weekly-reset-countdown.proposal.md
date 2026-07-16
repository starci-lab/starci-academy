# Proposal — KPI tuần: reset thật Thứ 2 8h GMT+7 + render countdown

**Surface:** `/vi/dashboard?tab=overview` (WeeklyGoals card) + `/vi/kpi` · **Nguồn:** feedback/layout lane (prototype `.artifacts/prototypes/kpi-page/` — thầy duyệt) · **Ngày chốt:** 2026-07-17

## Bối cảnh — quyết định của thầy
Thầy yêu cầu render thêm "reset mỗi thứ 2 đầu tuần GMT+7 8h". Deep-scan phát hiện: **TOÀN BỘ 6 chỉ số KPI hiện tính bằng cửa sổ TRƯỢT `now() - interval '7 days'`** (`user-stats-projection.service.ts:150-186`) — không có mốc reset thật nào. Đã hỏi thầy 3 hướng, **thầy chọn: đổi thật BE sang tuần lịch** (Mon 8h GMT+7 → Mon 8h tuần sau), chấp nhận ảnh hưởng lan ra ngoài phạm vi KPI.

## Data-ceiling map (deep-scan cả 2 repo)
- **(A) Đang render:** 6 KPI hiện current = COUNT/SUM trong 7 ngày trượt kể từ lúc query chạy.
- **(B) Đã có SẴN, TÁI DÙNG ĐƯỢC:** `league-reset.service.ts` đã dùng ĐÚNG timezone `Asia/Ho_Chi_Minh` (GMT+7, không DST) cho weekly reset của League (cron Chủ nhật 00:00) — xác nhận GMT+7 platform-wide đã có tiền lệ. `WeeklyBoard` (`league/League/WeeklyBoard/index.tsx:55-68`) đã có ĐÚNG pattern FE cần: field `weekEndAt` (BE trả real timestamp) → FE `useMemo` tính `{days, hours}` còn lại → hiển thị qua i18n `resetIn` ("Reset sau {days} ngày {hours} giờ" — `vi.json:3503`). **Tái dùng NGUYÊN pattern này cho KPI**, không tự chế UI mới.
- **(C) Compute MỚI cần thêm (BE):** đổi 6 subquery trong `buildUpsertSql()` (`weeklyXp/Lessons/Challenges/Coding/Flashcards/Milestones`) từ `created_at >= now() - interval '7 days'` sang cửa sổ tuần lịch:
  ```sql
  created_at >= (date_trunc('week', (now() AT TIME ZONE 'Asia/Ho_Chi_Minh') - interval '8 hours')
                 + interval '8 hours') AT TIME ZONE 'Asia/Ho_Chi_Minh'
  ```
  (dịch -8h trước khi trunc-về-Thứ-2-00h rồi +8h lại — cho ra đúng mốc "Thứ 2 gần nhất lúc 8h" theo giờ VN, xử lý đúng case đang ở Thứ 2 sáng SỚM trước 8h vẫn thuộc tuần trước).
- **⚠️ Cạnh riêng — `studyDays` KHÔNG dùng chung field trên:** KPI `studyDays` hiện lấy từ `last7Days` (7-ngày-trượt, PHỤC VỤ streak-strip — KHÔNG được đổi, streak strip vẫn phải là rolling 7 ngày thật). Cần **field MỚI riêng** `weeklyStudyDays` (COUNT DISTINCT ngày có hoạt động, lọc theo MỐC TUẦN LỊCH ở trên) — KHÔNG tái dùng `last7Days` cho KPI nữa.
- **⚠️ Ripple ngoài phạm vi KPI (đã báo thầy, thầy chấp nhận):** `user-weekly-stats.resolver.ts` + `my-weekly-stats.resolver.ts` đọc CHUNG `weeklyXp`/`weeklyLessons`/`last7Days` từ projection này (public-profile "weekly stats" + dashboard tương tự) → tự động chuyển sang tuần-lịch theo. `last7Days` (streak strip) trong 2 resolver này giữ nguyên (không đổi field đó). **Đã KIỂM `loyalty-discount.service.ts` — AN TOÀN, không đụng** (chỉ đọc `stats.streak` + `user.totalPoints`, không đọc field weekly nào).

## Change 1 — BE: cửa sổ tuần lịch + field reset
- **File:** `src/modules/bussiness/projections/user-stats/user-stats-projection.service.ts`
  - 6 subquery weekly* đổi điều kiện thời gian như công thức trên (thay `now() - interval '7 days'`).
  - Thêm subquery MỚI `weeklyStudyDays` (COUNT DISTINCT `created_at::date` từ `xp_histories` theo cùng mốc tuần).
  - Thêm 1 giá trị tĩnh `weekResetAt` vào jsonb (= mốc-tuần-lịch-hiện-tại + interval 7 days — SQL literal, không cần cột riêng) để FE tính countdown, mirror `weekEndAt` bên League.
  - `types/index.ts` (`UserStatsResult`): thêm `weeklyStudyDays: number`, `weekResetAt: string`.
- **File:** `src/features/api/core/graphql/queries/dashboard/my-kpis/my-kpis.resolver.ts`
  - `studyDays` đổi từ `stats.last7Days.filter(...).length` → `stats.weeklyStudyDays`.
  - `MyKpisData` (`graphql-types/response.ts`) thêm field `resetAt: string` = `stats.weekResetAt`.

## Change 2 — FE: render countdown (mirror WeeklyBoard, KHÔNG tự chế)
- **File:** `src/components/features/dashboard/WeeklyGoals/index.tsx` — thêm `useMemo` tính `{days, hours}` từ `kpis.resetAt` (copy nguyên pattern `WeeklyBoard/index.tsx:56-68`), nối vào cuối dòng `Typography` summary hiện có: `"{percent}% tuần này · đạt {completed}/{total} mục tiêu · " + t("dashboard.kpi.resetIn", {days, hours})`.
- **File:** `src/components/features/dashboard/kpi/Kpi/index.tsx` — cùng countdown, nối vào `description` của `PageHeader` (sau `dashboard.kpi.summary`/`subtitle`).
- **i18n:** thêm `dashboard.kpi.resetIn` — reuse NGUYÊN văn league đã có: vi `"Reset sau {days} ngày {hours} giờ"`, en `"Resets in {days}d {hours}h"` (namespace riêng vì khác feature, không sửa `dashboard.league.resetIn`).
- **Types FE:** `QueryMyKpisData` (`my-kpis.ts`) thêm `resetAt: string`.

## KHÔNG đổi
- `last7Days` / streak-strip (`Đà học`) — giữ NGUYÊN rolling 7-ngày, không liên quan tuần-lịch.
- `loyalty-discount.service.ts` — xác nhận không đọc field weekly nào, không cần sửa.

## Files to touch
- BE: `user-stats-projection.service.ts` (+ `types/index.ts`), `my-kpis.resolver.ts` (+ `graphql-types/response.ts`)
- FE: `WeeklyGoals/index.tsx`, `kpi/Kpi/index.tsx`, `my-kpis.ts` (types), `vi.json`/`en.json`

## Verify plan
- BE: `npx tsc --noEmit` sạch + chạy runtime thật (query trực tiếp hoặc qua GraphQL playground) tại 1 thời điểm TRƯỚC và SAU 8h sáng Thứ 2 giả lập (set giờ hệ thống/test) để xác nhận biên tuần đúng — KHÔNG dừng ở "tsc sạch".
- FE: countdown hiển thị đúng cả 2 nơi, khớp số với BE `resetAt`; `user-weekly-stats`/`my-weekly-stats` (public profile) vẫn trả dữ liệu hợp lệ sau đổi (không lỗi field thiếu).

## Bảng component → Storybook
| Component | Story | Mới / Sửa | Ghi chú |
|---|---|---|---|
| `WeeklyGoals`/`Kpi` | — | sửa | feature-component, không story riêng (như trước) |
| Countdown text | — | không cần block mới | copy pattern INLINE từ `WeeklyBoard`, không phải 1 component tách — không thêm story |

## Nguồn tham khảo
- BE: `user-stats-projection.service.ts:143-186` (6 subquery hiện tại) · `league-reset.service.ts:39-44` (tiền lệ `Asia/Ho_Chi_Minh`) · `loyalty-discount.service.ts:224-246` (xác nhận an toàn, đã đọc) · `user-weekly-stats.resolver.ts` + `my-weekly-stats.resolver.ts` (ripple).
- FE: `WeeklyBoard/index.tsx:55-68` (countdown pattern gốc) · `vi.json:3503`/`en.json:3494` (`resetIn` wording).
- Prototype: `.artifacts/prototypes/kpi-page/index.html` — hosted http://127.0.0.1:8083 (đã thêm dòng "Reset sau 2 ngày 14 giờ" ở cả 2 surface, đánh dấu "MỚI").
