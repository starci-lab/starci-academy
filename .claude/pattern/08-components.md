# 08 — Components

`src/components/` — chia theo vai trò, KHÔNG theo trang.

## Nhóm
- `layouts/` — block UI lớn theo trang/khu vực: `Course, Courses, Content, Learn, Module, ModuleSidebar, MilestoneSidebar, Sidebar, Navbar, LandingPage, CV, Foundations, HeadhuntingCompany, Headhuntings, Task, PersonalProjectSubmission, CourseMindMap, UserStreak, Admin*`. Page (`app/[locale]/.../page.tsx`) chỉ ráp các layout này.
- `modals/` — ~30 modal: `AuthenticationModal, AuthenticatedModal, PaymentModal, ChallengeModal, ContentModal, GlobalSearchModal, LanguageModal, LinkGithubModal, Cv*Modal, Foundation*Modal, LessonVideoModal, LivestreamCalendarModal, ShareModal, AIProcessingModal…`. Open state quản qua `hooks/singleton/overlay-state` + slice `modal`.
- `drawers/` — `SubmissionAttemptsDrawer, PersonalProjectTaskAttemptsDrawer, UserCvSubmissionAttemptsDrawer`.
- `reuseable/` — tái dùng nhỏ: `MarkdownContent, Score, Dropzone, PDFView, QRCode, ReferenceLinks, SearchBar, TagChips, VideoRenderer, StarCiAIBadge, AIProcessingText, CVSubmissionForm, HostPlatformChip, LessonVideoKindChip, SnippetIcon, Spacer`.
- `providers/` — xem 09. `pallettes/`, `svg/` (Logo, GithubIcon, GoogleIcon), `utils/`.

## Decomposition & nesting — STRICT
- Tách nhỏ, **mỗi component 1 chức năng / 1 file**. KHÔNG định nghĩa component inline trong body component khác.
- **Nested ASAP:** sub-component chỉ 1 parent dùng → **lồng trong folder parent** (`Page/Button/index.tsx`) để rõ chức năng + sở hữu.
- **Promote khi dùng chung:** dùng ở nhiều nơi mới đưa ra `components/` thành sibling (ngang hàng).
- **Nhóm theo chức năng (cả `layouts/` lẫn `reuseable/`):** `<area>/<category>/<Component>/index.tsx` — vd `layouts/abc/AAAA`, `layouts/bbb/AAAA`, `reuseable/buttons/ButtonA` (ví dụ cách nhóm — KHÔNG dựng lại Button HeroUI).
- Phân loại logic: **`layouts/`** = container (logic/hook/state/orchestration); **`reuseable/`** = presentational — **được dùng hook UI-cục-bộ** (useState/useDisclosure/useId/useMemo format), **cấm logic nghiệp vụ** (SWR/redux/fetch). Container tạo handler `onXXX` + truyền props xuống reuseable.
- **Casing:** PascalCase = component (`ButtonA/index.tsx`); lowercase = folder gom nhóm (`buttons/`). `reuseable` là typo sẵn của repo — giữ nguyên, đừng sửa.

## Quy ước
- Folder + file PascalCase (`CourseMindMap/CourseMindMap.tsx` + `index.ts`).
- **Ưu tiên HeroUI v3** (`@heroui/react`) + Tailwind v4 util class. Không tự dựng primitive (Button, Modal, Input…) nếu HeroUI có.
- Component có state/hook/redux/swr → `"use client"`.
- Markdown render qua `reuseable/MarkdownContent` (react-markdown + remark-gfm + rehype-highlight). Code highlight: react-shiki / mantine code-highlight.
- **CSS global/dùng chung → `src/app/globals.css`** (Tailwind v4 entry), không rải `.css` rời. Style cục bộ = Tailwind util.
- **KHÔNG define lại base component HeroUI** (Button/Input/Modal/Select…); cần biến thể thì compose/wrap + variant/token.
