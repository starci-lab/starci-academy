# FE state-coverage gaps — JOBS / HEADHUNTING cluster

Scope: FE `C:/Repositories/starci-academy`, routes `jobs`, `jobs/post`, `jobs/[displayId]`,
`headhunting-companies/[companyId]`, `talents`. BE SSOT: `.artifacts/states/{jobs,headhuntings}/business.md`.

> Domain-mapping note: the `jobs` business.md documents **background-job orchestration**, NOT a job
> board. The FE `/jobs*` board is backed by a *separate, undocumented* BE surface
> (`src/features/api/core/graphql/{queries,mutations}/job-postings/**` + `JobPostingEntity`). Findings
> below were derived by reading that real surface directly. The `headhuntings` business.md IS the SSOT
> for the consultant contact-reveal gate.

### Summary

| Severity | Count |
|----------|-------|
| High     | 2 |
| Medium   | 5 |
| Low      | 4 |

Headline defects:
- **HIGH** — `/jobs/post` success "view posting" link always 404s (BE returns row `id`, FE routes by `displayId`).
- **HIGH** — the consultant **contact-reveal gate** (the headhuntings domain's ONLY state machine) is never rendered in the app; the component that renders it is imported nowhere.

---

## /jobs — `components/features/careers/Jobs/JobList/index.tsx`

Query: `jobPostings` → `job-postings.handler.ts` (public, offset-paged, `createdAt DESC`, `ILike` title
search, `workMode`/`employmentType` filters). FE list is otherwise a faithful render — loading skeleton,
platform-empty vs filtered-empty (two distinct states), and error+retry are all handled correctly.

1. **Missing state — expired / closed posting.** `med` — `JobList/index.tsx` (whole list) + BE
   `job-postings.handler.ts:74-98`.
   `JobPostingEntity.expiresAt` exists (`job-posting.entity.ts:244-256`) and the FE entity type documents
   it as "after which the posting should be treated as closed" (`modules/types/entities/job-posting.ts:37-38`).
   The BE list handler applies **no `expiresAt` filter**, and `JobListRow` renders no expired/closed badge —
   so an expired posting shows in the board as a live row. Fix: BE should exclude/flag expired rows (or FE
   should filter + badge on `expiresAt`). Cross-cutting with `/jobs/[displayId]`.

2. **Render-wrong — `source` provenance never surfaced.** `low` — informational only. `JobPostingSource`
   (`seeded` vs `submitted`) is fetched but never shown; acceptable per the BE note ("not a moderation
   state"). No action needed unless a "curated" badge is desired.

---

## /jobs/post — `components/features/careers/Jobs/JobPostForm/index.tsx`

Mutation: `submitJobPosting` → `submit-job-posting.resolver.ts` (auth-required, live immediately, no
approval queue). Cross-field rules (exactly-one-of company/newCompany; applyUrl XOR applyEmail) are
mirrored client-side in `useSubmitJobPostingForm.ts` — good.

1. **API-shape mismatch — success link routes by the wrong identifier (404).** `high` —
   `JobPostForm/SubmitSuccess/index.tsx:42` vs BE `submit-job-posting.resolver.ts:168`.
   `submitJobPosting` returns `saved.id` (the **UUID primary key**). `SubmitSuccess` receives it as
   `jobDisplayId` and builds `pathConfig().locale(locale).jobs(jobDisplayId)` → `/jobs/<uuid>`. The detail
   route queries by **`displayId`** (`job-posting.handler.ts:53-63`, `WHERE displayId = <uuid>`), which never
   matches → `JobPostingNotFoundException`. The "View posting" CTA after a successful submit is therefore
   permanently broken. Fix: have the mutation return the new row's `displayId` (rename `data` semantics), or
   return both id+displayId; FE routes by `displayId`.

2. **Missing state — auth expiry between load and submit.** `low` — `JobPostForm/index.tsx:63-74`.
   The form gates render on `state.keycloak.authenticated`, but the BE mutation guard is
   `KeycloakAuthGraphQLGuard`. If the token lapses after load, BE rejects and the FE only shows a generic
   error toast (no re-auth prompt). Acceptable, noted.

---

## /jobs/[displayId] — `components/features/careers/Jobs/JobDetail/index.tsx`

Query: `jobPosting` → `job-posting.handler.ts` (public, eager company).

1. **Missing state — expired posting still shows a live Apply CTA.** `med` — `JobDetail/index.tsx:222-233`.
   The detail page renders the primary Apply button purely off `applyMethod`/`applyUrl`/`applyEmail`; it
   never consults `expiresAt`. An expired posting (BE serves it — no expiry filter, see /jobs #1) renders as
   fully applicable. Fix: when `expiresAt` is in the past, replace the Apply CTA with a "no longer accepting
   applications" state.

2. **Render-wrong — not-found renders as a generic error, not the "not found" empty.** `low` —
   `JobDetail/index.tsx:134-141`.
   A missing `displayId` comes back as an *error envelope* (`JobPostingNotFoundException` → `success:false` →
   the SWR fetcher throws), so `AsyncContent` takes the `error` branch (`jobs.detail.error` + retry). The
   `emptyContent: jobs.detail.notFound` branch (`!isLoading && !job`, no error) is effectively dead code —
   a deleted/typo'd posting shows "something went wrong, retry" instead of "this posting no longer exists".
   Fix: detect the not-found error code and route it to the empty/not-found state.

3. **Render-wrong — company deep link silently absent off-course.** `low` — `JobDetail/index.tsx:49,73-75`.
   `companyHref` only resolves when a course happens to be in redux (`state.course.displayId`); otherwise the
   company name is plain text. There is no global company route (see headhunting section). Expected given the
   architecture, but means the same posting is a link or not depending on unrelated redux state.

---

## headhunting-companies/[companyId] — redirect page + `components/features/careers/Headhunting/HeadhuntingCompany/**`

The route file (`app/[locale]/headhunting-companies/[companyId]/page.tsx`) is a pure **redirect** to the
course-scoped `/[locale]/.../headhunting-companies/[companyId]`. The real detail UI is `HeadhuntingCompany`,
fed from Redux by two full-list queries (`useQueryHeadhunterCompaniesSwr`, `useQueryHeadhuntersSwr`) and
filtered client-side. Consultant rows carry the BE contact-gate fields (`consultants` query selects
`contactUnlocked` + `cvScoreUnlockThreshold` + `email`/`phoneNumber`/`zaloNumber`/`linkedinUrl`,
`query-consultants.ts:23-46`).

1. **Missing state — the consultant contact-reveal gate is never rendered anywhere in the app.** `high` —
   `Headhunting/Headhuntings/ConsultantCard/index.tsx` (whole) + orphaned
   `components/starci/blocks/consultant/ConsultantProfileBody/index.tsx`.
   The headhuntings domain's ONLY real state machine (`business.md` §"The one real state machine") is the
   per-viewer locked/unlocked contact reveal. In the app:
   - `ConsultantCard` renders name / jobTitle / company / description only — **no contact, no lock state, no
     onPress**. Its doc says "opens the profile modal", but it is a bare `PressableCard` with no handler and
     no modal is wired.
   - `ConsultantProfileBody` — the only component that renders the locked callout vs. real contact links — is
     **imported by nothing** (grep `ConsultantProfileBody` across `src` = 1 hit, itself).
   Net: `contactUnlocked`, `cvScoreUnlockThreshold`, and the four contact fields are fetched over the wire and
   discarded. Both BE states (`locked` and `unlocked`) are invisible; the entire monetization gate is dark.
   Fix: wire a consultant profile modal from `ConsultantCard` that renders `ConsultantProfileBody`, mapping
   `contactUnlocked`/contact fields.

2. **Render-wrong — locked state would not show the required-score threshold.** `med` —
   `ConsultantProfileBody/index.tsx:64-66,156-167`.
   Even once wired, the locked branch uses hardcoded English copy (`LOCKED_DESCRIPTION = "Improve your CV to
   unlock..."`) and never renders `cvScoreUnlockThreshold`. The BE deliberately echoes that number on every
   consultant (locked or not) precisely so the FE can render "cần điểm CV ≥ 70" without hardcoding
   (`business.md` §gate, bullet 2). Fix: pass `cvScoreUnlockThreshold` into the locked callout and localize
   the copy.

3. **Render-wrong — no error state; an errored query hangs on the skeleton forever.** `med` —
   `Headhunting/HeadhuntingCompany/index.tsx:29-31`, `HeadhuntingCompanyConsultants/index.tsx:41-51`,
   `Headhuntings/ConsultantGrid/index.tsx:37-47`.
   All three gate loading on `!consultants` / `!companies` (redux is `undefined` until the query lands). If the
   SWR query errors, redux stays `undefined`, so `isLoading` stays `true` → the skeleton renders indefinitely.
   There is no error/retry branch. Fix: surface the SWR error into an error+retry state instead of an infinite
   skeleton.

4. **Render-wrong — legacy redirect dead-ends without an active course.** `low` —
   `app/[locale]/headhunting-companies/[companyId]/page.tsx:23-33`.
   The company detail only exists course-scoped; if no `course.displayId` is in redux, the redirect drops the
   user on the generic course list rather than the requested company. Expected given there is no global company
   route, but a shared/bookmarked `/headhunting-companies/<id>` link is effectively unreachable cold.

---

## talents — `components/features/careers/Headhunting/TalentDirectory/index.tsx`

Query: `talentCandidates(courseId)` → `talent-candidates.resolver.ts` (optional-auth, per-track ranking,
`band`/`isQualified` per item). The FE faithfully renders per-track qualitative badges only (no blended
score, no raw number) — matches the fairness invariant in the resolver/service docs.

1. **Missing state — no error branch; an errored query shows "no candidates".** `med` —
   `TalentDirectory/index.tsx:83-104`.
   The `AsyncContent` here passes only `isLoading` / `isEmpty` / `emptyContent` — no `error` / `errorContent`.
   `useQueryTalentCandidatesSwr` can fail (network, or the BE ranking query throws), and on failure `candidates`
   is `[]`, so the viewer sees the empty state ("no open-to-work candidates for this track") — a factual lie
   about the track — instead of an error+retry. Contrast `JobList`, which handles `error` correctly. Fix: add
   an `error`/`errorContent` retry branch.

2. **Render-wrong — no-courses case sticks on the skeleton.** `low` — `TalentDirectory/index.tsx:48-54,84`.
   `isLoading` includes `!selectedCourseId`, and `selectedCourseId` is only set once `courses.length > 0`. If
   the courses query returns zero courses (or errors — it has no error handling either), the page shows the
   candidate skeleton forever with no track tabs. Fix: handle empty/errored courses explicitly.
