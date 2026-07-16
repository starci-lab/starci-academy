# Audit: FE code-style — type-safety (đối chiếu `.claude/patterns/fe/type-safety.md`)

Scope: `src/**/*.{ts,tsx}` (2166 file). Method: grep toàn bộ cho `any`, `!` non-null assertion bừa, `as X` không comment, `[key: string]: any`, index-signature lỏng — rồi đọc thật từng call-site nghi vấn.

Kết quả tổng quan: **CẤM `any`** (rule 1) và **`!` non-null bừa** (rule 3) — SẠCH, 0 vi phạm tìm thấy trong toàn bộ `src/`. Vi phạm thật nằm ở **rule 2** (discriminated union / correlated field-value) và **rule 4** (`as X` ép mù payload không validate, không lý do).

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `hooks/zustand/signIn/store.ts:33,57` | §2 discriminated union — API công khai `setValue` KHÔNG correlate field↔value | `setValue: (field: keyof Omit<...>, value: string \| boolean \| undefined) => void` … `set({ [field]: value } as Partial<SignInStoreState>)` | Đổi `setValue` thành union field-value tương ứng (overload hoặc generic `<K extends SignInField>(field: K, value: SignInStoreState[K])`) thay vì value union rộng `string \| boolean \| undefined` — hiện tại `setValue("rememberMe", "abc")` type-check PASS dù sai kiểu |
| `hooks/zustand/signUp/store.ts:59` (tương tự signIn) | §2 discriminated union — cùng pattern `setValue` mất correlation | `setValue: (field, value) => set({ [field]: value } as Partial<SignUpStoreState>)` | Cùng fix như trên |
| `app/[locale]/courses/[courseId]/page.tsx:46` | §4 CẤM `as X` ép mù response — khớp gần khớp ví dụ ❌ chuẩn trong rubric (`const data = response as CourseData`) | `return (payload?.data?.course?.data as CourseMeta \| undefined) ?? null` (payload từ `response.json()` không kiểu, không validate) | Validate tối thiểu bằng type-guard/`zod` trước khi cast, hoặc ít nhất comment lý do runtime chắc chắn đúng shape |
| `app/[locale]/blog/[slug]/page.tsx:48` | §4 (cùng pattern) | `return (payload?.data?.blogPost?.data as BlogPostMeta \| undefined) ?? null` | Cùng fix |
| `app/[locale]/profile/[username]/page.tsx:52` | §4 (cùng pattern) | `return (payload?.data?.userProfile?.data as ProfileMeta \| undefined) ?? null` | Cùng fix |
| `app/sitemap.ts:59,70` | §4 (cùng pattern, 2 chỗ) | `) as { data?: { courses?: {...} } } \| null` / `) as { data?: { blogPosts?: {...} } } \| null` | Cùng fix — cân nhắc 1 helper `parseGraphqlPayload<T>()` dùng chung cho cả 5 chỗ thay vì lặp cast tay |
| `hooks/rhf/useEditSubmissionForm.ts:93` | §4 `as X` không comment (spread + override rồi ép nguyên khối về entity) | `{...submission, userSubmission: {...submission.userSubmission, submissionUrl: overridden}} as ChallengeSubmissionEntity` | Thêm comment lý do (vì sao TS không tự suy được đây vẫn đúng shape `ChallengeSubmissionEntity`), hoặc kiểu hoá `userSubmission` chặt hơn để bỏ cast |

**Tổng: 7 vi phạm** (2 file `as X` ép mù response lặp lại ở 5 call-site cùng 1 pattern hệ thống + 2 store dùng `setValue` mất correlation field↔value — cùng 1 pattern lặp ở signIn/signUp). Mức nghiêm trọng: **trung bình** — không có `any`/`!` bừa (2 rule nghiêm nhất SẠCH), nhưng pattern response-cast không validate là hệ thống (5 nơi) và đáng gộp thành 1 helper dùng chung; `setValue` mất correlation là lỗ hổng kiểu thật (không phải chỉ style).
