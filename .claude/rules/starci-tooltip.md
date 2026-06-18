# StarCi Tooltip Convention

Cách gắn **giải thích plain-language** cho 1 thuật ngữ khó (rank, tier, KPI, streak, league, p99…).
Đi kèm `starci-ui.rules` + `starci-ui-mindset.md` ("thuật ngữ khó → Tooltip"). STRICT.

## Luôn dùng block `InfoTooltip` (`blocks/feedback/InfoTooltip`)
KHÔNG ráp HeroUI `Tooltip` thẳng trong feature (sẽ nhét style tooltip vào feature — vi phạm §2). Block
`InfoTooltip` **ÔM toàn bộ chrome** (`max-w-[260px]`, arrow, `cursor-help`); feature chỉ
truyền nội dung + trigger:

> ⚠️ **Padding tooltip = 1 LẦN.** `Tooltip.Content` đã tự pad — content bên trong **CẤM** bọc thêm
> `p-*` wrapper (gây double padding). Stack title/description = `flex flex-col gap-2`, KHÔNG `p-2`.
```tsx
// Term/label đơn giản → title + description
<InfoTooltip title={t("dashboard.kpi.title")} description={t("dashboard.kpi.help")}>
  {t("dashboard.kpi.title")}     {/* trigger = chính nhãn đó */}
</InfoTooltip>

// Trigger là 1 component (chip/badge) → mô tả only
<InfoTooltip description={t("dashboard.league.tierHelp")}>
  <LeagueTierBadge tier={tier} />
</InfoTooltip>

// Nội dung giàu (nhiều dòng, số nhấn) → content override (compose Typography)
<InfoTooltip content={<>
  <Typography type="body-sm" weight="semibold">{rankLabel}</Typography>
  <Typography type="body-xs" color="muted">{whyLine}</Typography>
  <Typography type="body-xs" color="muted">{nextStepLine}</Typography>
</>}>
  <RankBadge label={rankLabel} color={color} />
</InfoTooltip>
```
Props: `children` (trigger) · `title?` · `description?` · `content?` (override title/description) ·
`placement?` (default `top`).

## Nội dung tooltip
- **Plain-language, ngắn**: 1–3 câu, không jargon chồng jargon. Giải thích "cái này là gì + tính sao".
- **Ưu tiên CÁ NHÂN HOÁ** khi có dữ liệu: "vì sao BẠN ở mức này" + "cần gì để lên mức kế" (mẫu rank:
  `explainSeniority(earnedTiers)` → `ranks.explain.why/next/maxed`). Hơn hẳn định nghĩa generic.
- **Text qua i18n** (`t(...)`), thêm key `*.help` / `*.explain.*` ở **cả** `vi.json` + `en.json`. Block
  KHÔNG nhúng i18n.

## Khi nào gắn
Bất cứ nhãn người dùng có thể không hiểu: rank (Junior/Middle/Senior), **tier**, **KPI tuần**, **streak/
chuỗi**, **league**, rarity %, p99, "milestone"… Nhãn hiển nhiên (Tên, Email) thì KHÔNG cần.

## Tham chiếu
- Block: `blocks/feedback/InfoTooltip`. Logic giải thích rank: `modules/utils/rank.ts` (`explainSeniority`).
- Mẫu: `features/profile/.../ProfileRankAvatar` (rank, cá nhân hoá), `layouts/kpi/Kpi` +
  `layouts/shell/Dashboard/{LeagueCard,StreakStrip}` (term đơn giản).
- Liên quan: `starci-ui-mindset.md`, `starci-chip.md`.
