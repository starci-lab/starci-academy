# Audit code-style: Cấu trúc thư mục & đặt tên (FE)

Rubric: `/d/Repositories/starci-claude-canon/patterns/fe/structure-and-naming.md`
Scope: `/d/Repositories/starci-academy/src/components` (sample scan, không đọc hết mọi file)

## Findings

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `src/components/reuseable/Discussion/CommentItem.tsx:51` | §2 sub-component phải là folder con lồng, không phải file phẳng cạnh `index.tsx` | `export const CommentItem = ({` — nằm phẳng cạnh `CommentComposer.tsx`, `FacebookReactionSelector.tsx`, `InteractionBar.tsx`, `ReactionBar.tsx`, `ReactionEmoji.tsx` trong `reuseable/Discussion/` | Mỗi cái → `Discussion/CommentItem/index.tsx`, `Discussion/ReactionBar/index.tsx`, … |
| `src/components/features/profile/PublicProfileLegacy/ProfileCapstone/ChallengeChips.tsx:40` và `ProjectCard.tsx` | §2 | `export const ChallengeChips = ({` — 2 sub-component phẳng cạnh `index.tsx` | → `ProfileCapstone/ChallengeChips/index.tsx`, `ProfileCapstone/ProjectCard/index.tsx` |
| `src/components/features/learn/LessonReader/ContentBody/ContentBodyV2/Discussion/ContentReactionBar.tsx:24` | §2 | `export const ContentReactionBar = ({ className }: WithClassNames<undefined>) => {` — sub-component duy nhất trong folder nhưng vẫn để phẳng thay vì `Discussion/ContentReactionBar/index.tsx` | Chuyển vào folder con |
| `src/components/features/landing/Landing/KnowledgeGraph/ConceptNode.tsx:40` và `ShuffleBeacon.tsx` | §2 | `export const ConceptNode = ({ id, data }: NodeProps) => {` — 2 node component phẳng cạnh `index.tsx` + `data.ts` | → `KnowledgeGraph/ConceptNode/index.tsx`, `KnowledgeGraph/ShuffleBeacon/index.tsx` |
| `src/components/blocks/layout/AmbientBackground/effects/*.tsx` (9 file: Aurora/Bubbles/Circuit/Ember/Fireflies/Rain/Snow/Stars/WaveEffect) | §2 | vd `effects/AuroraEffect.tsx:24 export const AuroraEffect = () => (` | Mỗi effect → folder riêng `effects/AuroraEffect/index.tsx`, hoặc nếu coi `effects/` là 1 barrel-module đặc thù thì cần ghi ngoại lệ rõ trong rubric — hiện rubric không có exception này |
| `src/components/features/learn/Flashcards/FlashcardQuizResult/FlashcardQuizResultSkeleton.tsx:10` (+ tương tự `CourseQaSkeleton.tsx`, `FlashcardSessionStatsSkeleton.tsx`) | §2 | `export const FlashcardQuizResultSkeleton = () => {` — skeleton component phẳng cạnh `index.tsx` | → `FlashcardQuizResult/FlashcardQuizResultSkeleton/index.tsx` |
| `src/components/features/profile/CV/CvBlocksWorkspace/CvBlockStack/shared/AiRewriteButton.tsx:10,26` và `RepeatableItemCard.tsx:37` | §2 + §5 (props) | `export interface AiRewriteButtonProps …` / `export const AiRewriteButton = (…)` — cả 2 export component thật, phẳng trong `shared/`, không có `index.tsx` nào ở `shared/` cả | → `shared/AiRewriteButton/index.tsx`, `shared/RepeatableItemCard/index.tsx` |
| `src/components/features/learn/Flashcards/{useFlashcardNav.ts, useStartFlashcardDueReviewSession.ts, useStartFlashcardReviewSession.ts}` | §4 — nhiều hook (3) phải gom `hooks/` barrel, đang rải phẳng cạnh `index.tsx` | 3 file `useX.ts` nằm ngang hàng `index.tsx`, không có folder `hooks/` | Gom vào `Flashcards/hooks/{useFlashcardNav.ts,…}` + `hooks/index.ts` barrel |
| `src/components/features/profile/PublicProfileLegacy/{useProfileFollow.ts, useProfileUsername.ts}` | §4 — 2 hook rải phẳng, không có `hooks/` | tương tự | Gom vào `PublicProfileLegacy/hooks/` + barrel |
| `src/components/reuseable/Spacer/index.tsx:30` | §5 — Props phải EXPORT | `interface SpacerProps extends WithClassNames<undefined> {` — không có `export`, trong khi `Spacer` (component chính của folder) export named | Thêm `export` trước `interface SpacerProps` |
| `src/components/reuseable/AiBalancer/KeyStatusChip/index.tsx:17` | §5 | `interface KeyStatusChipProps extends WithClassNames<undefined> {` — component chính `KeyStatusChip` export nhưng Props không export | Thêm `export` |
| `src/components/layouts/admin/AdminAiBalancer/ProviderSection/index.tsx:20` | §5 | `interface ProviderSectionProps extends WithClassNames<undefined> {` — cùng lỗi | Thêm `export` |
| `src/components/layouts/admin/AdminAiBalancer/ProviderSection/KeyRow/index.tsx:16` | §5 | `interface KeyRowProps extends WithClassNames<undefined> {` — cùng lỗi | Thêm `export` |
| `src/components/modals/FeedbackDetailsModal/FeedbackCard/index.tsx:16` | §5 | `interface FeedbackCardProps extends WithClassNames<undefined> {` — component chính `FeedbackCard` export, Props không export | Thêm `export` |
| `src/components/modals/GlobalSearchModal/Content/Block/index.tsx:25` | §5 | `interface GlobalSearchContentBlockProps extends WithClassNames<undefined> {` — cùng lỗi | Thêm `export` |

## Tổng

**~20+ vi phạm xác nhận thật** (đã đọc code, không phải đoán qua tên file), across §2 (sub-component nhét phẳng thay vì folder-lồng: ~30 file thật là component, đã list đại diện ~8 cụm), §4 (hook rải phẳng thay vì gom `hooks/`: 2 cụm, 5 file), §5 (Props không export dù component chính có export: 6 file). Mức nghiêm trọng: **trung bình** — không vỡ build/runtime (đây là convention/tổ chức, TS vẫn compile), nhưng lệch rõ so với idiom trội của repo (764 `index.tsx` đúng luật) và tích lũy thành nợ tái cấu trúc khi các "sub-component phẳng" này tiếp tục phình to. Rule §1 (1-folder-index chính), §3 (category top-level), §6 (hậu tố Modal/Drawer) đều SẠCH trong sample quét (modals/drawers 100% đúng hậu tố; không thấy component đặc-thù-feature lạc vào `blocks/`).

*Lưu ý:* các file `map.tsx` / `data.ts` / `statusVisual.tsx` / `nav.tsx` / `kpiMeta.tsx` tìm thấy cùng đợt grep là data-map/constant thuần (không phải React component export), nên KHÔNG tính vi phạm §1/§2.
