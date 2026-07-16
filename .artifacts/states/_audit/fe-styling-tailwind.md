# Audit code-style: Styling & Tailwind

Rubric: `/d/Repositories/starci-claude-canon/patterns/fe/styling-tailwind.md`
Scan: `/d/Repositories/starci-academy/src/components` (grep-sample, không đọc hết cây)

Report-only — KHÔNG sửa code trong lượt này.

## Findings

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `modals/ShareModal/index.tsx:30,35,40,45` | §1 hex ma ngoài 3 file exception (ArchitectureScene/LogoMark/CvHtmlDocument) | `className="size-6 text-[#1877F2]"` (+ `#1DA1F2`, `#0088cc`, `#0A66C2`) | Nếu là brand-color hợp lệ (Facebook/Twitter/Telegram/LinkedIn icon) → cân nhắc thêm 1 exception rõ ràng vào rubric (brand-logo icon) thay vì token semantic; nếu không thì đổi sang token gần nhất |
| `features/landing/Landing/constants/index.ts:53-56` | §1 hex ma ngoài 3 file exception | `className: "bg-[#3178C6]/10 text-[#3178C6]"` (TypeScript/Java/C#/Go badge) | Cùng dạng brand-color như trên — case lặp lại 2 chỗ, gợi ý cần rule riêng cho "brand/lang badge" thay vì generic UI tone |
| `blocks/skeleton/Skeleton/{Paragraph,Table,Card,ListRow,Metric,RadioGroup,Breadcrumbs,Disclosure,Accordion,Checkbox,Typography}/index.tsx` + `reuseable/SkeletonText/map.ts` | §3 arbitrary spacing cấm (`h-[14px] my-[3px]` …) | vd `blocks/skeleton/Skeleton/Card/index.tsx:20`: `"my-[5px] h-[14px] w-1/2 rounded"` | Toàn bộ họ Skeleton (11+ file) dùng `h-[Npx] my-[Npx]` để khớp pixel chiều cao dòng chữ thật — đây là pattern CÓ CHỦ Ý (JSDoc giải thích lý do), không phải lỗi copy-paste, nhưng literal rule §3 vẫn cấm. Cần rubric bổ sung ngoại lệ "skeleton pixel-match text metrics" thay vì đổi code (đổi sẽ vỡ căn giữa) |
| `reuseable/ContributionCalendarView/index.tsx:291,302,304,326` | §3 arbitrary spacing (`gap-[3px]`) | `className="flex gap-[3px] pl-8"` | Gutter ô contribution-graph cần khớp pixel grid GitHub-style — cùng nhóm ngoại lệ như Skeleton, không phải typo |
| `features/dashboard/OverviewTab/OverviewContributions/OverviewContributionsSkeleton/index.tsx:43,46` | §3 arbitrary spacing (`gap-[3px]`) | `className="flex gap-[3px] overflow-hidden"` | Cùng nhóm contribution-graph skeleton |
| `reuseable/AIProcessingText/index.tsx:136` | §3 arbitrary spacing (`p-[2px]`) | `className="relative overflow-hidden rounded-2xl p-[2px]"` | Padding-viền gradient border 2px — không có step Tailwind tương đương (`p-0.5`=2px thực ra CÓ, có thể đổi sang `p-0.5` step chuẩn) |
| `features/learn/MockInterview/InterviewerPresence/index.tsx:76` | §3 arbitrary spacing (`gap-[2px]`) | `className="flex items-end gap-[2px]"` | Voice-bar visualizer cần gap rất nhỏ — `gap-0.5` (2px) là step Tailwind chuẩn có sẵn, nên đổi được |
| `features/course/CourseDetail/CoursePricingRail/index.tsx:66` | §3 arbitrary trên offset sticky (`top-[88px]`) | `className="md:sticky md:top-[88px] md:self-start"` | Offset khớp chiều cao navbar cố định — không có step chuẩn tương ứng, cần token riêng nếu muốn hết arbitrary |

## Sạch (không vi phạm trong sample)

- `cn()` từ `@heroui/react`: KHÔNG thấy import `clsx`/`tailwind-merge` trong `src/components` — tuân §2.
- `rounded-[Npx]`: 0 match — tuân §5.
- Phosphor icon `size={number}` prop: 0 match — tuân §7.
- `bg-accent text-white` / hardcode `text-white` cặp với nền tone: không tìm thấy call-site thật khớp — tuân §4 (case ban đầu nghi ngờ trong `MarkdownContent/map.tsx`, `InterviewSessionDetailDrawer/index.tsx` không tái hiện khi grep chính xác).

## Tổng

**9 vị trí / ~7 file nhóm vi phạm thật** (2 nhóm rule): (a) hex-ma ngoài exception — 2 file/8 chỗ (brand-color icon + lang-badge, khả năng cần MỞ RỘNG rubric hơn là sửa code); (b) arbitrary px spacing — lan rộng ~13 file/~40 chỗ, phần lớn là pattern CÓ CHỦ Ý (skeleton pixel-match, contribution-graph gutter) nên mức nghiêm trọng THẤP-TRUNG BÌNH, đề xuất bổ sung ngoại lệ vào rubric thay vì patch hàng loạt; 2 chỗ (`AIProcessingText p-[2px]`, `InterviewerPresence gap-[2px]`) có step Tailwind thay thế trực tiếp (`p-0.5`/`gap-0.5`) nên đáng patch thật.
