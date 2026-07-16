# patterns-audit-fe — log (append-only)
> Ghi bởi `starci-fe-patterns-audit`. Mỗi lần audit = 1 block ngày (vi phạm patterns/fe + nợ). Chưa có = chưa audit lần đầu.

---

## 2026-07-16 — full-scan 8 trục patterns/fe (commit `9db6f33`, branch mtp)

Tổng hợp 8 brief Sonnet (`_audit/fe-*.md`), ground thật (grep + đọc xác nhận call-site), đã gộp trùng + bỏ nhiễu (false-positive grep, design-exception có JSDoc).

### Tổng quan — vi phạm theo mảng (cao→thấp về mức)

| mảng (rubric) | # vi phạm | mức | ghi chú |
|---|---|---|---|
| **async-data** (runGraphQL + SWR tiers) | ~90 call-site / ~55 file (Rule 3) + 3 Rule 1 + 2 Rule 5 | **CAO** | nợ kiến trúc lan rộng; 1 ca nuốt lỗi mạng/auth im lặng = bug UX thật |
| **props-and-types** | 26 / 13 file | TB | `T[]`→`Array<T>` (15), `className?` tự khai thay `WithClassNames` (9), `type`→`interface` (2) |
| **structure-and-naming** | ~20+ / nhiều cụm | TB | sub-component phẳng thay folder-lồng (§2), hook rải phẳng thay `hooks/` (§4), Props không `export` (§5, 6 file) |
| **type-safety** | 7 / 6 file | TB | `as X` ép mù response GraphQL (5 call-site systemic) + `setValue` mất correlation field↔value (signIn/signUp). CẤM `any`/`!` bừa = SẠCH |
| **comments** | 7 / 2 file | THẤP | §1 WHAT-thuần + §2 lặp tên; 6/7 khu trú `CourseProjectForm`. §3/§4/§5 sạch |
| **loading-and-skeleton** | 5 | TB | 2 ca bỏ qua `AsyncContent` (§1), 3 ca `isLoading` trần trên query có revalidate nền (§2 → nháy skeleton đè content) |
| **styling-tailwind** | 9 vị trí / ~7 file | THẤP | phần lớn arbitrary-px CÓ CHỦ Ý (skeleton pixel-match, contribution-graph gutter) → đề xuất mở rộng rubric; chỉ 2 chỗ đáng patch thật (`p-0.5`/`gap-0.5`) |
| **i18n** | 3 | THẤP | ternary locale hardcode metadata title (contact/status/architecture). react-i18next/nối-chuỗi = 0 |

**Tổng ~167 vi phạm** (đa số cơ học lint-được). 2 rule nghiêm nhất (`any`, `!` non-null bừa) SẠCH toàn `src/`. Nợ thật tập trung ở async-data (kiến trúc) + 1 bug UX (nuốt lỗi).

### TOP findings — RANKED (cao→thấp)

**CAO — sửa sớm (bug/lỗ hổng thật):**
1. `src/components/features/practice/PracticeProblem/index.tsx:220-226` · async-data §1 (WRITE nuốt lỗi) · `onToggleSolution` gọi `mutateRevealCodingSolution` trong `try/catch{}` rỗng → lỗi mạng/auth IM LẶNG, panel giữ đóng, user không biết. Fix: bọc `runGraphQL` (có toast) hoặc SWR-mutation hook.
2. `src/components/features/learn/CourseQa/QuestionRow/index.tsx:19-23,70,97,103,108,114` · async-data §3+§1+§5 (nặng nhất — cả file không SWR) · `import { queryContentComments }` + `await mutateCreateComment({...})` không `runGraphQL`/toast, state tự `useState`. Fix: dựng SWR-hook tier `content-comments` + facade, bọc mutation qua `runGraphQL`.
3. `src/components/features/practice/PracticeProblem/index.tsx:228-259` · async-data §1+§3+§5 · `onSubmit` gọi thẳng `mutateSubmitCodingSolution`, tự `useState submitting`, không `runGraphQL`. Fix: `useSWRMutation` facade + `runGraphQL` + `isMutating`.
4. `hooks/zustand/signIn/store.ts:33,57` (+ `signUp/store.ts:59`) · type-safety §2 · `setValue(field, value: string|boolean|undefined)` mất correlation → `setValue("rememberMe","abc")` PASS type-check dù sai. Fix: generic `<K extends Field>(field:K, value:State[K])`.

**TRUNG BÌNH — nợ hệ thống lan rộng:**
5. async-data §3 diện rộng · ~90 call-site / ~55 file import thẳng `queryX`/`mutateX` tầng module (bỏ qua SWR-hook tier) → khó revalidate cache chéo (§6 hệ luỵ). Đại diện: `learn/Flashcards/*`, `community/*`, `navbar/NotificationBell:32`, `learn/Flashcards/DueReview:106,392`. Cần sweep có kế hoạch, không patch lẻ.
6. type-safety §4 · `as X` ép mù payload GraphQL không validate, 5 call-site systemic: `app/[locale]/{courses/[courseId]:46, blog/[slug]:48, profile/[username]:52}/page.tsx`, `app/sitemap.ts:59,70`. Fix: 1 helper `parseGraphqlPayload<T>()` + type-guard/zod dùng chung.
7. props-and-types §1 · `className?: string` tự khai thay `extends WithClassNames<...>`: `blocks/marketing/{TrackCard:18, ShowcaseMockup:35}`, `blocks/feedback/Callout:55`, `blocks/grading/GradingByline:16`, + 5 `reuseable/*` tự khai lại dù đã extends (thừa). Fix cơ học.
8. props-and-types §4 · `T[]`→`Array<T>` 15 chỗ/8 file: `blocks/stats/SegmentBar:21`, `blocks/learn/QuizCard:57,67,72`, `blocks/commerce/PricingTable:36,54`, `blocks/notifications/*`, `blocks/grading/DiffViewer:27,44`, `features/legal/content/types.ts:20,22,30`.
9. structure-and-naming §5 · Props interface không `export` dù component chính export: `reuseable/Spacer:30`, `reuseable/AiBalancer/KeyStatusChip:17`, `layouts/admin/AdminAiBalancer/ProviderSection{:20,/KeyRow:16}`, `modals/FeedbackDetailsModal/FeedbackCard:16`, `modals/GlobalSearchModal/Content/Block:25`.
10. structure-and-naming §2 · sub-component phẳng cạnh `index.tsx` thay folder-lồng: `reuseable/Discussion/{CommentItem,ReactionBar,...}.tsx`, `blocks/layout/AmbientBackground/effects/*` (9 file), `Flashcards/*Skeleton.tsx`, `profile/CV/.../shared/{AiRewriteButton,RepeatableItemCard}.tsx`. §4 hook rải phẳng: `Flashcards/useX.ts` (3), `PublicProfileLegacy/useX.ts` (2) → gom `hooks/`.
11. loading-and-skeleton §2 · `isLoading` trần trên query có revalidate nền → skeleton nháy đè content: `dashboard/StreakFreezeCard:90`, `drawers/MiniCartDrawer:154`, `dashboard/ContinueLearning:64` (+`useResumeItems.ts:60`). Fix: `isLoading && !data` / `&& length===0`.
12. loading-and-skeleton §1 · bỏ qua `AsyncContent`, tự if/else: `learn/Playground/PlaygroundSession:175-207` (loading không cả skeleton, chỉ text), `learn/LessonReader/LessonPager:43-64`.
13. type-safety §4 · `hooks/rhf/useEditSubmissionForm.ts:93` · spread-override rồi `as ChallengeSubmissionEntity` không comment lý do.

**THẤP — style/nợ nhỏ:**
14. comments · `modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:60,65,70,72,78,93` (6 comment WHAT-thuần/lặp-tên) + `learn/Challenge/ChallengeSubmissionPanel:307` → xoá.
15. i18n §3 · ternary locale hardcode metadata title: `app/[locale]/{contact:22, status:22, architecture:22}/page.tsx` → đẩy `messages/{vi,en}.json` + `getTranslations`.
16. styling §3 (đáng patch thật, còn lại là design-exception): `reuseable/AIProcessingText:136` `p-[2px]`→`p-0.5`; `learn/MockInterview/InterviewerPresence:76` `gap-[2px]`→`gap-0.5`.
17. styling §1 hex-ma (khả năng MỞ RỘNG rubric hơn là sửa): `modals/ShareModal:30,35,40,45` (brand-icon), `landing/Landing/constants:53-56` (lang-badge).
Rubric = `.claude/patterns/fe/`. App = `D:\Repositories\starci-academy` (branch `mtp`). Incremental theo git; `openViolations` = nợ tay chưa xử, `mechanizableDelegated` = đẩy lint.

---

## 2026-07-16 — Audit đầu (baseline `5dc1fc02`)

**Scope thật:** baseline cũ `a03213a2` diff ra 337 file, nhưng lọc còn **26 file đổi nội dung >6 dòng** đáng chấm:
- 191 file = **rename thuần** (refactor flatten `5dc1fc02`: `reuseable/`+`layouts/` → `blocks/`+`features/`) — nội dung y hệt, bỏ.
- 140 file = **import-path churn** (`@/components/reuseable/*` → `@/components/blocks/*`) — cơ học, bỏ.
- Fan-out 5 shard (sonnet) chấm 26 file → opus synthesize.

**Kết quả: 52 vi phạm, verdict = `minor-debt`.** Codebase khá sạch — ~30/52 là nhiễu cơ học (thứ tự import, inline/multiline named-import, JSDoc/@default, tên handler) → **đẩy lint, không audit tay lặp**. Nợ THẬT hẹp + gom cụm ở vài feature.

### Nợ THẬT (openViolations — cần tay)

1. **[HIGH/async-data] `CourseQa/QuestionRow/index.tsx:19` — NGHIÊM TRỌNG NHẤT.** Component gọi THẲNG tầng module cho cả WRITE (`mutateCreateComment/Update/Delete/ReactToComment`) không qua `runGraphQL`/`useGraphQLWithToast` (§1 write phải qua runGraphQL, §3). **Hệ quả thật:** mutate fail = im lặng, không toast, không rollback UI. Thêm `:63` tự dựng `useState isLoadingAnswers/answers` song song thay vì SWR (§5). → proposal: bọc write `runGraphQL`+toast, đọc loading/data từ hook.

2. **[HIGH/forms] `CVSubmissionForm/index.tsx:9` — còn Formik.** `<Formik>` + `CvSubmissionFields:11` import `Form/FormikErrors/FormikTouched`. `forms.md §1` STRICT cấm formik, stack cố định RHF+zod+zodResolver. → proposal migrate: logic vào `hooks/rhf/useCvSubmissionForm.ts` (§2), thay `<Formik>`/`<Form>` bằng RHF, giữ upload File. 1 feature, 2 file — contained nhưng phải tay + verify runtime.

3. **[HIGH/async-data] `blog/BlogPost/index.tsx:31` — bypass 3-tầng.** `useSWR` + import `queryBlogPost` tầng module thẳng trong component (§3). → tách `useQueryBlogPostSwr` (hooks/swr), component chỉ đọc `{data,isLoading,error,mutate}`. Nhỏ, làm cùng QuestionRow.

4. **[HIGH/loading-and-skeleton] 4 vùng data tự `if/else` thay `<AsyncContent>`** (§1 STRICT) + skeleton generic không mirror row thật (§3): `WeeklyBoard:63`, `GlobalBoard/index.tsx:44` (high), `FoundationsCategoryGrid:171`, `Foundations/index.tsx:189` (medium). → 1 proposal: bọc AsyncContent + skeleton mô phỏng LeagueRow/card thật. Contained ở league + foundations.

5. **[MED/react-idioms] `auth/OauthRedirect/index.tsx:61` — BUG TIỀM ẨN.** `useEffect` gọi `sleep(1000).then(router.push)` KHÔNG cleanup; `sleep()` (modules/utils/misc) không expose handle để clear → unmount trong 1s vẫn `router.push` sau unmount. → `setTimeout` có ref + clear trong cleanup, hoặc cancel-token cho `sleep`.

6. **[LOW/structure] sub-component phẳng → folder/index** (CommentItem, CommentComposer) + **export trùng tên folder** (Foundations→FoundationsLearnLayout, FoundationsCategoryGrid→...GridLayout). Cơ học → lint.

### Quick fixes (nhỏ/an toàn, làm được same-session khi thầy OK)
- `CvSubmissionFields:83` xoá cast thừa `(values.cv as File|null)`.
- `CVSubmissionForm:66` + `PreviewCard:33` bỏ `p-6` override trên `<Card>` (house-rule p-3).
- `PreviewCard` + `KeyRow` raw color → token semantic.
- `E2eBody:84` pill hand-roll → `StatusChip` canon, bỏ `text-[11px]`.
- `KeyRow:34` bỏ `useCallback` quanh `statusLabel` (gọi inline 1 chỗ).

### Đẩy sang `starci-fe-enforce` (lint giữ mãi — KHÔNG audit tay lặp)
`import/order` (~13 chỗ, --fix) · `collapse-short-named-imports` (~9 file) · `no-raw-color-scale` · `no-card-padding-override` · `component-file-must-be-index` · `export-name-matches-folder` · `no-restricted-imports formik` (guard) · zone-rule cấm `src/components/**` import thẳng `@/modules/api/graphql/**` (guard sau khi refactor QuestionRow/BlogPost).

**Khuyến nghị:** #1 (QuestionRow silent-write) là thứ đáng sửa nhất — không chỉ style mà là correctness/UX thật (mutate fail nuốt lỗi). #2–#4 gom 1 proposal refactor async/forms cho cụm learn+careers+league. Phần cơ học chờ lint rule land rồi `eslint --fix` 1 lượt, đừng sửa tay lẻ tẻ.

---

## 2026-07-16 18:20 — FIX (fe-audit-fix workflow, 4 lane song song)

Sửa **5 finding + 5 quick-fix** từ block audit trên. `tsc` SẠCH · eslint sạch mọi file đụng. Opus-verify tự vá 3 lỗi tsc do lane gây (CV container FormikHelpers signature; 2 SWR hook destructure tuple-key → dùng pattern repo `useQueryCourseQuestionsSwr`).

**Đã fix:**
- #1 `QuestionRow` — write route qua facade `useQuestionAnswers` (runGraphQL + SWR trigger, **toast khi fail**, revalidate chỉ khi success); answers đọc `useQueryContentCommentsSwr` (gated by expanded), bỏ useState list tay. 0 gọi thẳng module cho write.
- #2 `CVSubmissionForm`+`CvSubmissionFields` — **Formik→RHF+zod** (logic vào `hooks/rhf/useCvSubmissionForm.ts`), xoá dead `constants/validation.ts`+`index.ts`; 0 'formik'/'yup' trong careers.
- #3 `BlogPost` — dùng `useQueryBlogPostSwr(slug)` (3 tầng), bỏ useSWR+queryBlogPost thẳng.
- #4 4 vùng bọc `<AsyncContent>` + skeleton mirror LeagueRow/card thật (WeeklyBoard/GlobalBoard/Foundations/FoundationsCategoryGrid).
- #5 `OauthRedirect` — `setTimeout`+`clearTimeout` cleanup, bỏ `sleep().then()`+useCallback.
- quick: PreviewCard+KeyRow raw palette→token semantic + Card p-6→p-3; KeyRow useCallback→plain fn; E2eBody pill→StatusChip(success/danger); CVSubmissionForm Card p-6 bỏ.

**CHƯA verify runtime** (6 mục — xem `resolvedThisSession.needsRuntimeCheck` trong json; nhất là CV form + QuestionRow). Uncommitted, chờ thầy soi + commit.

**Mới phát hiện (ngoài scope changed-file, chưa fix):**
- `learn/Challenge/ChallengeSubmissionPanel` còn `import 'formik'` — file không đổi kể từ baseline nên incremental không bắt; Formik debt riêng.
- `skeleton/Skeleton/*` 10 lỗi eslint `no-empty-object-type` (baseline `4f99d9a4`, pre-existing) → lint-fix.

**Còn để LINT (không fix tay):** structure `component-file-must-be-index` (CommentItem/CommentComposer) + `export-name-matches-folder` (Foundations) — đẩy `starci-fe-enforce`.
