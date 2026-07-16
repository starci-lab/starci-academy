# Audit: async-data (runGraphQL + SWR) — code-style vs rubric

Rubric: `/d/Repositories/starci-claude-canon/patterns/fe/async-data.md`
Scope: `src/components/features/**` (sample-scan, không đọc hết; grep tìm vi phạm rồi đọc xác nhận từng ca thật).

## Tổng quan

Rule 1 (mọi WRITE qua `runGraphQL`) và rule 2 (action trả `GraphQLResponse`) **nhìn chung sạch** ở phần lớn codebase — không tìm thấy import `runGraphQLWithToast` (bản pure) trong `src/components/features`.

Rule 3 (component KHÔNG được gọi thẳng tầng module `@/modules/api/graphql/{mutations,queries}/*`, phải qua facade/SWR hook) là **vi phạm lan rộng nhất**: grep thấy **~90 call-site import hàm `queryX`/`mutateX` trực tiếp** (không phải `import type`) trải trên **~55 file** dưới `src/components/features`. Một số ca còn kéo theo vi phạm rule 1 + rule 5 luôn (component tự fetch bằng tay, không qua SWR gì cả).

## Findings (đã đọc xác nhận thật)

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `src/components/features/learn/CourseQa/QuestionRow/index.tsx:19-23,70,97,103,108,114` | Rule 3 + Rule 1 + Rule 5 (nặng nhất — cả file không dùng SWR) | `import { queryContentComments } ...`; `await mutateCreateComment({...})` (không `runGraphQL`, không toast); state `isLoadingAnswers`/`answers` tự `useState` thay vì SWR hook | Dựng SWR-hook tier cho `content-comments` (nếu chưa có) + facade hook trả `data/isLoading/error`; bọc 4 mutation qua `runGraphQL`; xoá `useState` thủ công |
| `src/components/features/practice/PracticeProblem/index.tsx:220-226` (`onToggleSolution`) | Rule 1 (WRITE không qua `runGraphQL`, lỗi bị nuốt) | `try { const response = await mutateRevealCodingSolution(...) } catch { // reveal failed... keep panel closed }` — lỗi mạng/auth im lặng, không toast | Bọc `mutateRevealCodingSolution` qua `runGraphQL` (đã có sẵn `useGraphQLWithToast` idiom trong app) hoặc SWR-mutation hook tương ứng |
| `src/components/features/practice/PracticeProblem/index.tsx:228-259` (`onSubmit`) | Rule 1 + Rule 3 + Rule 5 | gọi thẳng `mutateSubmitCodingSolution` trong `try/finally`, tự `useState submitting` thay vì `isMutating` từ SWR-mutation hook, không `runGraphQL` | Chuyển sang `useSWRMutation` facade + `runGraphQL`, đọc `isMutating` |
| `src/components/features/practice/PracticeProblem/index.tsx:133-147` | Rule 3 (query gọi thẳng module tier trong `useSWR` inline, không qua SWR-hook riêng file `hooks/`) | `useSWR(..., async () => { const response = await queryCodingProblem(...) })` | Tách thành `useQueryCodingProblemSwr`/`useQueryCodingProblemHintSwr` trong `src/hooks/swr/api/graphql/queries/`, mirror `useQueryMyCartSwr` |
| `src/components/features/navbar/Navbar/NotificationBell/index.tsx:32-33,106,133` | Rule 3 (rule 1/2/6 ở đây thì ĐÚNG — có `runGraphQL`, action trả `.data`, có `await mutate()` sau) | `import { mutateMarkNotificationAsRead } from "@/modules/api/graphql/mutations/..."` gọi thẳng trong `runGraphQL(async () => {...})` | Bọc bằng SWR-mutation hook (`useMutateMarkNotificationAsReadSwr`) rồi facade gọi hook đó, thay vì import module fetcher thẳng |
| `src/components/features/learn/Flashcards/DueReview/index.tsx:106-109` (query) và `:392` (`mutateReviewFlashcard`) | Rule 3 (file NÀY vốn đã dùng đúng SWR-hook tier cho 4 action khác — session start/sync/complete — nên phần còn lại lệch chuẩn ngay trong cùng file) | `useSWR(dueKey, async () => { const response = await queryMyDueFlashcards(...) })`; `const response = await mutateReviewFlashcard({...})` trong `runGraphQL` | Thêm `useQueryMyDueFlashcardsSwr` + `useMutateReviewFlashcardSwr`, dùng nhất quán như các hook session khác trong cùng file |

## Diện rộng (chưa đọc từng file, chỉ liệt kê import trực tiếp để thầy chọn ưu tiên)

Cùng pattern rule-3 (import `queryX`/`mutateX` thẳng, không phải `import type`) còn thấy ở (representative, không đầy đủ):
`community/CommunityCommentItem`, `community/CommunityFeed/CommunityComposer`, `community/CommunityPost`, `contact/Contact/ContactForm`, `dashboard/ContinueLearning/ResumeCard`, `dashboard/EntityToken/useResolveRouteNavigation`, `dashboard/FeedTabs`, `architecture/CurlTester`, `architecture/hooks/useSystemHealthPoll`, `learn/ContentAiChat`, `learn/Flashcards/{FlashcardReviewer,FlashcardDeckList,FlashcardReviewHistory,FlashcardReviewStats,FlashcardStatsStrip,FlashcardStudyRail,index,QuizSession/*}`, `learn/Leaderboard/useLeaderboardSwr`, `learn/LessonReader/ContentBody/ContentBodyV2/Discussion/*`, `learn/LessonReader/ContentBody/useAutoMarkContentRead`, `learn/OnThisPage/LessonChallenges`, `notifications/NotificationCenter`, `practice/CodingLeaderboard`, `practice/hooks/{useCodingProblemsSwr,useMyCodingProgressSwr}` (tên hook đúng chuẩn nhưng BODY gọi thẳng module — cần đọc lại), `profile/CvSubmission`, `profile/PublicProfile{,Legacy}/ProfileActivity*`.

Không đọc xác nhận hết các file này — chỉ grep import. Một phần trong đó CÓ THỂ hợp lệ (vd hook đặt đúng tên/đúng thư mục `hooks/swr/` mirror rule 3's tầng-2 nhưng vẫn import trực tiếp thay vì qua tầng-1 module riêng — cần đọc kỹ hơn từng cái mới kết luận chắc).

## Tổng kết mức nghiêm trọng

**~90 call-site (≈55 file) vi phạm Rule 3** (component/hook gọi thẳng tầng module, bỏ qua SWR-hook tier); trong đó **3 call-site xác nhận thật cũng vi phạm luôn Rule 1 (WRITE không qua `runGraphQL`, có ca nuốt lỗi im lặng)** và **2 call-site vi phạm Rule 5** (tự dựng `useState` loading song song SWR). Mức nghiêm trọng: TRUNG BÌNH-CAO — rule 3 lan rộng là nợ kiến trúc (khó revalidate cache chéo — rule 6 hệ luỵ), còn 3 ca rule-1 (đặc biệt `PracticeProblem.onToggleSolution` nuốt lỗi mạng/auth im lặng) là bug UX thật cần vá sớm.
