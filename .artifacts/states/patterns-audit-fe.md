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
