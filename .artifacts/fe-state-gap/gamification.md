# FE state-coverage gaps — GAMIFICATION / DASHBOARD cluster

Read-only audit. FE repo `C:/Repositories/starci-academy`. BE state SSOT
`C:/Repositories/ac/starci-academy-backend/.artifacts/states/<domain>/business.md`.
Cluster routes: `dashboard`, `home`, `kpi`, `status`, `admin`, `admin/tools`.
BE domains: daily-quest, streak, kpi-reward, achievements, anti-cheat, activity.

### Summary

| Severity | Count |
|---|---|
| high | 0 |
| med | 2 |
| low | 5 |

Verified defects: 7. No high-severity user-blocking gap in a core flow; the two
med findings are a fully-built-but-unmounted streak-freeze surface and a
missing error state on `/kpi`.

Domains with **no** gap: **activity** (feed renders faithfully). Domains
**correctly absent** by design: **anti-cheat** (BE has no read surface, so FE
rightly has none). **achievements** wall/badges belong to profile, out of this
cluster (see cross-cutting note).

---

## dashboard

Route: `src/app/[locale]/dashboard/page.tsx` → `@/components/features/dashboard`
(`Dashboard` → `OverviewTab` mounts DailyQuest, StreakStrip, WeeklyGoals;
`ExploreTab` → `FeedTabs`). DailyQuest, feed, and StreakStrip states are handled
well through `AsyncContent` (loading / empty / error / retry / revalidate-after-
mutation all present).

**[med] Streak-freeze inventory is never rendered on any mounted page**
`src/components/features/dashboard/StreakFreezeCard/index.tsx` (whole file).
The component is fully built (owned count of 3, buy action, full/disabled state,
skeleton, error/retry, revalidates `myWeeklyStats`) but is imported **nowhere** —
grep for `StreakFreezeCard` across `src` returns only its own file. BE `streak`
models the freeze inventory as a first-class buy/spend state (owned 0–3, cap
before affordability, `STREAK_FREEZE_MAX=3`); the BE ships both a
`buy-streak-freeze` resolver and a `redeem-reward` path returning `streakFreezes`,
and `my-weekly-stats` exposes `streakFreezes`. The only mounted streak surface,
`StreakStrip/index.tsx:51`, reads `myWeeklyStats` but never displays
`streakFreezes` — so the freeze count and buy action are unreachable from the UI.
Fix: mount `StreakFreezeCard` in `OverviewTab`'s streak section (or fold the
owned-count + buy into `StreakStrip`).
Note: `StreakFreezeCard/index.tsx:66` buys via `redeemReward({rewardKey:"streakFreeze"})`,
which IS a valid BE mutation (rewards domain). The `streak/business.md` claim
that "no mutation calls buyStreakFreeze" is stale — a `buy-streak-freeze.resolver.ts`
now exists in BE; not a FE defect.

**[low] WeeklyGoals fabricates a target when BE returns `target: null`**
`src/components/features/dashboard/WeeklyGoals/index.tsx:88` and `:154`
(`const target = item?.target ?? DEFAULT_KPI_TARGETS[key]`). BE kpi-reward state 1:
an untouched KPI has `target: null` (never committed, no floor). FE renders an
invented default target and a filling progress bar as if a goal exists, so the
"no goal set this week" state is never visually distinct. The coin reward is
correctly gated (`item?.coinReward != null`, line 184) so no false reward leaks —
this is why it is low, not med, and the code comments mark it deliberate. Fix
direction: if intended keep it; otherwise render null-target rows as an explicit
"no goal — pick one" rather than a fake meter.

**[low] DailyQuest shows a live Claim button beside still-incomplete rows with no "any 3 of 5" hint**
`src/components/features/dashboard/DailyQuest/index.tsx:85` (claim CTA gated on
`data.allDone`) vs `:134` (rows render an empty circle for unmet tasks). BE
daily-quest invariant 2: `allDone` means **3 of 5** tasks (not all 5). Behaviour
is correct (FE trusts the BE flag), but a checklist showing 2 unchecked rows next
to an active "Claim" button reads as a bug to the user. Fix: copy hint that only
3 of 5 are required.

---

## kpi

Route: `src/app/[locale]/kpi/page.tsx` → `@/components/features/dashboard/kpi/Kpi`
(`kpi/Kpi/index.tsx`). The claim flow IS present here (unlike the dashboard
WeeklyGoals card): `claimed` / `canClaim` / not-claimable states and `setKpiTarget`
are all rendered (`:262`–`:286`), and it revalidates after both mutations. Good.

**[med] `/kpi` has no error state — permanent skeleton on query failure**
`src/components/features/dashboard/kpi/Kpi/index.tsx:152`
(`if (!data) { return <skeleton> }`). On a first-load `useQueryMyKpisSwr` error,
`data` stays `undefined`, so the page renders the loading skeleton forever with no
message and no retry — unlike every sibling gamification component, which routes
through `AsyncContent` + `errorContent`. Fix: wrap the body in `AsyncContent` with
an `errorContent` retry (mirror `WeeklyGoals/index.tsx:103`).

**[low] KPI target cannot be cleared back to "no goal" (0)**
`src/components/features/dashboard/kpi/kpiMeta.tsx:29` (all presets ≥1) +
`kpi/Kpi/index.tsx:250` (`FlexWrapButtonRadio`, single-select, "no clear"). BE
kpi-reward: `setKpiTarget(0)` clears the target (returns to state 1, `target: null`).
Once a user sets any target, the editor offers no path back to null. Fix: add an
"off"/clear option if the un-commit transition is meant to be reachable.

---

## home

Route: `src/app/[locale]/home/page.tsx` → `@/components/features/landing/Landing`.
Marketing landing; renders no gamification state machine. **No gap** (out of scope
for the 6 domains).

---

## status

Route: `src/app/[locale]/status/page.tsx` → `@/components/features/status/SystemStatus`.
Public "build in public" system-status page (component health/uptime), unrelated to
any of the 6 gamification domains. **No gap** (out of scope).

---

## admin + admin/tools

Route: `src/app/[locale]/admin/page.tsx` → `admin/AdminLogin` (API-key gate);
tools = `admin/tools/{ai-balancer,mpeg-dash,upload-video}` (infra utilities).
None of the 6 domains has an admin surface, and none should.

**[not a gap — confirmed correct absence] Anti-cheat has no FE surface**
BE anti-cheat writes `flaggedForReview` / `suspicionScore` / `clientTelemetry`
onto `coding_submissions` but, per `anti-cheat/business.md`, **no resolver reads
them back** — the output is a dead end with no reviewer API. FE correctly exposes
no "flagged submissions" admin view. Documented here so the absence isn't later
mistaken for a missing-state gap: a reviewer surface can only be built after BE
adds the read API. The anti-cheat `flagged` / `suspended` states are therefore
un-renderable by design today.

---

## Cross-cutting

**[low] Achievements congrats-modal (`newAchievements`) is not wired in the dashboard cluster**
BE `achievements/business.md`: `myAchievements` is the sole surface returning
`newAchievements` (the freshly-awarded subset) to pop a congratulations modal;
only a stale/miss recompute-on-read can populate it. Grep for
`newAchievements`/`myAchievements` across `src/components/features/dashboard`
returns nothing — the logged-in landing surface (where users arrive right after
completing activity) never queries it, so a newly-earned badge may pop nowhere on
the dashboard. The achievements wall (locked/unlocked badges, tiers, rarity) is a
**profile** concern, out of this cluster — verify profile owns both the wall and
the congrats trigger. Flagged as a scope/coverage note, not a hard dashboard defect.

**[info] Streak milestone progress (7/30/100) has no indicator**
BE streak grants one-time milestone bonuses at 7/30/100 consecutive days (auto-
granted + notified, no claim). `StreakStrip` shows current + longest streak but no
"next milestone" progress. Not a broken state (nothing to claim), so no severity —
noted only as an optional coverage improvement.
