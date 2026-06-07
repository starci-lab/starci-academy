# 06 — Skeleton / Loading States

Grounded từ code. Phần A = thực trạng + convention, B = canonical (dùng khi build mới), C = gaps cần sửa.

---
## A. Thực trạng + convention

### Primitive
- **Chỉ dùng HeroUI `Skeleton`** (`import { Skeleton } from "@heroui/react"`, v3) — gọi **chỉ với `className`** (không dùng API `isLoaded`/wrap children). KHÔNG có wrapper skeleton dùng chung trong repo.
- Mỗi feature tự viết component `XSkeleton/index.tsx` cạnh component thật, **mô phỏng layout thật** (mirror).
- ⚠️ **KHÔNG có `loading.tsx`** (App Router) ở đâu → không có skeleton tức thì lúc điều hướng; loading xử lý **client-side** sau hydrate.

### Khi nào hiện skeleton
→ **Loading gate là CODE PATTERN, không phải UI** — xem `.claude/pattern/05-singleton-hooks.md` (skeleton khi và chỉ khi `isLoading || !data || error` — KHÔNG `isValidating`). File này chỉ lo **hình hài** skeleton.
- Tạo nhiều dòng: `Array.from({ length: N }).map(...)` hoặc constants array; nhận `count` prop (vd `ModulesSkeleton`).

### Breadcrumb + header KHÔNG skeleton-hoá
Chrome tĩnh (breadcrumbs, page header / `SubPageHeader`) phụ thuộc i18n/router chứ KHÔNG phụ thuộc SWR data → render thật **ngoài** gate, hiện ngay. ⇒ `XSkeleton` **chỉ mirror phần content** (grid/list/detail), **KHÔNG** chứa breadcrumb skeleton hay header skeleton. Logic gate xem `.claude/pattern/05-singleton-hooks.md`.

### Convention shape (quan sát)
- Pill/avatar: `rounded-full`. Card/ảnh: `rounded-2xl`/`rounded-3xl`/`rounded-xl` (chưa thống nhất — xem C).
- Dòng chữ: `h-[14px]` hoặc `h-3`/`h-4`, width bậc thang `w-full → w-5/6 → w-2/3 → w-1/2` (giả text). **Corner text: `rounded-sm` (xs/sm) hoặc `rounded` (base+)** — KHÔNG `rounded-full` cho text.
- Rhythm bằng `<div className="h-3" />` / `my-1`.

### Archetype learn/content (`layouts/Content/index.tsx`)
- `isLoading = useQueryContentSwr().isLoading || !content`.
- Loading: render **`ContentHeaderSkeleton` + `ContentTabBar` thật (tab bar hiện ngay) + body placeholder**. Mỗi tab body **tự giữ nhánh loading riêng** (đọc lại `isLoading`): ContentBody (Skeleton rows), ChallengeBody (`ChallengeCardSkeleton` ×2), LessonBody (`LessonCardSkeleton`).

### Mẫu tốt để copy
- `MilestoneSidebar/MilestoneSidebarSkeleton` — copy nguyên class container (`lg:sticky lg:top-16…`) → mirror chuẩn nhất.
- `Course/Modules/ModulesSkeleton` — dựng nguyên `Accordion` + `count` prop.
- `Content/ChallengeBody/ChallengeCardSkeleton` — mirror sát `ChallengeCard` (title + chip + lines + buttons).

---
## B. Canonical (build mới)
1. **Dùng HeroUI `Skeleton` + className** — KHÔNG tự viết `animate-pulse` div, KHÔNG dùng `Spinner` cho list/detail.
2. **Mirror layout thật**: skeleton phải copy khung/class của component thật (size, rounded, spacing) → không nhảy layout khi data về. Ưu tiên copy class container như `MilestoneSidebarSkeleton`.
3. **Đặt cạnh component**: `XSkeleton/index.tsx`, export qua barrel. Tên `*Skeleton` (không `LoadingState`).
4. **Khi nào hiện** (loading gate) = **code pattern** → `.claude/pattern/05-singleton-hooks.md`. UI doc này không lặp lại logic gate.
5. **Shape chuẩn**: text line `h-[14px]` width bậc thang; pill `rounded-full`; card/ảnh `rounded-xl` (theo canonical radius [05/01]); **text line `rounded-sm` (xs/sm) hoặc `rounded` (base+)** — KHÔNG `rounded-full` cho text; nhiều item qua `count` prop.
6. **Spinner** chỉ cho action ngắn (nút mid-submit, mutation), KHÔNG cho tải nội dung trang/list.
7. Cân nhắc thêm `loading.tsx` route-level cho trang nặng (vd learn/content) để có skeleton tức thì khi điều hướng.

---
## D. Bộ skeleton chuẩn — text metric (Tailwind v4.2.1 defaults)

Nguyên tắc: **skeleton bar cao = font-size**, phần dư line-height chia đều thành `my` (trên+dưới) để chiếm đúng line-box của text thật → không nhảy layout. **Text dùng `rounded-sm` (xs/sm) hoặc `rounded` (base+)** — KHÔNG `rounded-full` cho text.

`h = font-size`, `my = (line-height − font-size) / 2` (px, 1rem=16px):

| Token | font | line-height | Skeleton class |
|-------|------|-------------|----------------|
| `text-xs` | 12 | 16 | `h-[12px] my-[2px] rounded-sm` |
| `text-sm` | 14 | 20 | `h-[14px] my-[3px] rounded-sm` |
| `text-base` | 16 | 24 | `h-[16px] my-[4px] rounded` |
| `text-lg` | 18 | 28 | `h-[18px] my-[5px] rounded` |
| `text-xl` | 20 | 28 | `h-[20px] my-[4px] rounded` |
| `text-2xl` | 24 | 32 | `h-[24px] my-[4px] rounded` |
| `text-3xl` | 30 | 36 | `h-[30px] my-[3px] rounded` |
| `text-4xl` | 36 | 40 | `h-[36px] my-[2px] rounded` |
| `text-5xl` | 48 | 48 | `h-[48px] rounded` |
| `text-6xl` | 60 | 60 | `h-[60px] rounded` |

### Component chuẩn (`src/components/reuseable/SkeletonText`)
Bọc HeroUI `Skeleton`, nhận `size` (token type-scale, map ↔ canonical role ở [05]) + `width` (class `w-*`, mặc định `w-full`). **`rounded-sm` cho xs/sm, `rounded` cho base+.**
```tsx
<SkeletonText size="sm" width="w-5/6" />        // 1 dòng body
<SkeletonText size="2xl" width="w-2/3" />       // title phụ
<SkeletonParagraph size="sm" lines={3} />       // 3 dòng → width mặc định bậc thang w-full → w-3/4 → w-1/2 (100/75/50)
```
- `SkeletonText` = 1 dòng đúng metric trên. `SkeletonParagraph` = N dòng, width giảm dần (mặc định 3 dòng = w-full/w-3/4/w-1/2), dòng cuối ngắn nhất.
- Map size→{h,my,rounded} ở `SkeletonText/map.ts` (lookup record, key = token). Block/ảnh (không phải text) vẫn dùng `Skeleton` trực tiếp với `rounded-xl`.
- Khớp typography: dùng đúng `size` bằng size của text thật mà nó thay (title `text-2xl`→`size="2xl"`, body `text-sm`→`size="sm"`).

---
## C. Gaps cần sửa (file:ref)
- **Raw `animate-pulse` → `Skeleton`**: `Content/CodeLessonBody:67`, `Content/CodeExplainingBody:30`, `Content/CodeImplementationBody:30`, `drawers/UserCvSubmissionAttemptsDrawer/AttemptsSkeleton`, `drawers/PersonalProjectTaskAttemptsDrawer`. (Các `animate-pulse` ở `AIProcessingText`/`AIProcessingModal`/`MethodologySection` là hiệu ứng chủ ý — giữ.)
- **`Spinner` → skeleton** (list/detail): `Practice/PracticeList:84`, `Practice/PracticeProblem:198`, và tab Quiz (`Content/QuizBody/QuizDeckList`/`QuizFlashcards`/`QuizLearn`/`QuizTest`) — lệch với các tab khác cùng route dùng skeleton.
- **Blank khi loading**: `ModuleSidebar/index.tsx` render `ModuleAccordion modules={[]}` (trống) → nên dùng `ModulesSkeleton` (đã có sẵn). Sibling `MilestoneSidebar` đã làm đúng.
- **`rounded-*` drift** trong skeleton (full/lg/xl/2xl/3xl lẫn lộn) → theo canonical radius. **Text skeleton cụ thể: đổi `rounded-full` → `rounded-sm` (xs/sm) hoặc `rounded` (base+)**; giữ `rounded-full` CHỈ cho pill/avatar/badge, `rounded-xl` cho card/ảnh.
- **Granularity**: vài skeleton chỉ là block thô (`StarciAiSkeleton` h-48, `HeadhuntingCompany/LoadingState`, `ContentDetailSkeleton` h-64) → nên mirror nội dung khi có thể.
- **Naming/vị trí**: gộp về `*Skeleton/index.tsx` (đổi `HeadhuntingCompany/LoadingState`; bỏ skeleton inline rải rác ở `QnA`/`ValuePropositions`/`ConsultantGrid`/`FoundationsList`).
