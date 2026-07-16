# Audit code-style FE — props-and-types

Rubric: `/d/Repositories/starci-claude-canon/patterns/fe/props-and-types.md`
Scope: `$FE_SOURCE/src/components` (grep + sample-confirm, không đọc hết toàn bộ cây).
Không sửa code — chỉ ghi brief.

## Findings

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `blocks/marketing/TrackCard/index.tsx:18-34` | §1 — component chỉ style root phải `extends WithClassNames<undefined>`, cấm tự khai `className?: string` tay | `export interface TrackCardProps { … className?: string }` (không extends gì cả) | Đổi thành `export interface TrackCardProps extends WithClassNames<undefined> { … }`, bỏ dòng `className?: string` tự khai |
| `blocks/marketing/ShowcaseMockup/index.tsx:35-52` | §1 — có 2 slot thật (root + content) phải dùng `WithClassNames<{ content: string }>`, cấm tự khai | `className?: string` + `contentClassName?: string` tự khai, không extends | Đổi thành `extends WithClassNames<{ content: string }>`, bỏ 2 field tự khai, dùng `classNames?.content` |
| `blocks/feedback/Callout/index.tsx:55-73` | §1 — cấm tự khai `className?: string`, phải extends | `export interface CalloutProps { … className?: string }` không extends | Đổi thành `extends WithClassNames<undefined>` |
| `blocks/grading/GradingByline/index.tsx:16` | §1 + §3 — inline type `{ pass, className }` thay vì `XxxProps extends WithClassNames<undefined>` có JSDoc | `export const VerdictIcon = ({ pass, className }: { pass: boolean, className?: string }) =>` | Tách `interface VerdictIconProps extends WithClassNames<undefined> { pass: boolean }` (mỗi prop JSDoc riêng) |
| `reuseable/ProgrammingLanguageTabs/index.tsx:44` | §1 — đã `extends WithClassNames<undefined>` (dòng 34) nhưng còn tự khai lại `className?: string` — thừa/mâu thuẫn | `export interface ProgrammingLanguageTabsProps extends WithClassNames<undefined> { … className?: string … }` | Xoá field `className?: string` tự khai (đã có sẵn qua extends) |
| `reuseable/PressableCard/index.tsx:9-15` | §1 — cùng lỗi tự khai lại `className` dù đã extends | idem | Xoá field tự khai |
| `reuseable/SearchBar/index.tsx:31-33` | §1 — cùng lỗi | idem | Xoá field tự khai |
| `reuseable/Score/index.tsx:38-49` | §1 — cùng lỗi | idem | Xoá field tự khai |
| `reuseable/PaginationSkeleton/index.tsx:8-10` | §1 — cùng lỗi | idem | Xoá field tự khai |
| `drawers/SubmissionResultHistoryDrawer/index.tsx:17-34` | §2 — prop object thường (7 field tự khai) phải `interface … extends`, không phải `type XxxProps = {…}` | `export type SubmissionResultHistoryDrawerProps = { isOpen: boolean … }` | Đổi `type` → `interface SubmissionResultHistoryDrawerProps extends WithClassNames<undefined> { … }` (hoặc bỏ extends nếu cố tình không nhận className — nhưng vẫn phải là `interface`) |
| `drawers/PersonalProjectTaskResultHistoryDrawer/index.tsx:17-32` | §2 — cùng lỗi | `export type PersonalProjectTaskResultHistoryDrawerProps = { … }` | Đổi `type` → `interface` |
| `blocks/stats/SegmentBar/index.tsx:21` | §4 — `Array<T>` chứ không `T[]` | `segments: SegmentBarSegment[]` | `segments: Array<SegmentBarSegment>` |
| `blocks/learn/QuizCard/index.tsx:57,67,72` | §4 | `options: QuizOption[]`, `selectedIds: string[]`, `onSelectionChange: (ids: string[]) => void` | `Array<QuizOption>`, `Array<string>`, `(ids: Array<string>) => void` |
| `blocks/commerce/PricingTable/index.tsx:36,54` | §4 | `features: PricingTableFeature[]`, `tiers: PricingTableTier[]` | `Array<PricingTableFeature>`, `Array<PricingTableTier>` |
| `features/profile/AiSubscription/TierCardBase/index.tsx:28` | §4 | `features: string[]` | `Array<string>` |
| `blocks/notifications/NotificationList/index.tsx:22,32` | §4 | `items: NotificationItemProps[]`, `groups: NotificationGroup[]` | `Array<NotificationItemProps>`, `Array<NotificationGroup>` |
| `blocks/notifications/NotificationBell/index.tsx:22` | §4 | `groups: NotificationGroup[]` | `Array<NotificationGroup>` |
| `blocks/grading/DiffViewer/index.tsx:27,44` | §4 | `lines: DiffLine[]`, `hunks: DiffHunk[]` | `Array<DiffLine>`, `Array<DiffHunk>` |
| `features/legal/content/types.ts:20,22,30` | §4 | `paragraphs?: string[]`, `items?: LegalListItem[]`, `sections: LegalSection[]` | `Array<string>`, `Array<LegalListItem>`, `Array<LegalSection>` |

## Không phải vi phạm (đã loại trừ, tránh false-positive)

- `React.ComponentType<{ className?: string }>` (icon prop shape trong `kpiMeta.tsx`, `ArchitectureRail/*`) — mô tả chữ ký component ICON ngoài, không phải Props của chính component → §1 không áp dụng.
- `GroupPressableCardItem.className` (`blocks/cards/GroupPressableCard/index.tsx:58`) — field của 1 item trong mảng data (forward xuống 1 card con), không phải root className của chính `GroupPressableCardProps` (đã đúng `extends WithClassNames<undefined>` ở dòng 62).
- `React.JSX.Element` return type (`E2eResultButton`, `E2eBody`) — §4 chỉ cấm `JSX.Element` cho SLOT PROP (`trailing?: ReactNode`), không áp dụng cho kiểu trả về của hàm component.
- Các match `any`/`as any` trong `NestedCard`, `MindMap/progress.ts`, `parse-bank-details.ts` — đều là từ "any" trong câu JSDoc tiếng Anh (false positive của grep), không phải kiểu `any` thật. **Rule "cấm any" — sạch, không tìm thấy vi phạm thật.**
- `classNames?: Record<string, string>` — không tìm thấy file nào vi phạm (rule "cấm Record<string,string> chung chung" — sạch).
- §6 (destructure props ngay signature) — grep sơ bộ có nhiều match nhưng phần lớn là custom node component của react-flow (`ModuleNode`, `RootNode`, `ModuleSlotNode`) nhận `props: NodeProps<...>` theo hợp đồng thư viện ngoài, không đọc kỹ để tránh false-positive — CHƯA audit sâu rule này trong lượt này.

## Tổng

**26 vi phạm** trên **13 file** — mức nghiêm trọng: TRUNG BÌNH (đều là lệch quy ước cơ học/lint-được, không phải bug runtime; nhóm đông nhất là `T[]` thay `Array<T>` — 15 chỗ/8 file, còn lại là className tự khai + `type` thay `interface`).
