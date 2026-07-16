# Audit code-style: comments (rubric `patterns/fe/comments.md`)

Nguồn rule: `/d/Repositories/starci-claude-canon/patterns/fe/comments.md` (5 mục: §1 WHY-not-WHAT, §2 không lặp tên đã rõ, §3 JSDoc props, §4 cấm code comment-out, §5 TODO có ngữ cảnh).
Scope quét: `/d/Repositories/starci-academy/src` (grep diện rộng + đọc xác nhận).

## Theo mục rule

- **§3 JSDoc props** — SẠCH. Sample 6 file block (`StatusChip`, `PricingCard`, `CommunityPostCard`, `OtpInput`, `BackLink`, `PitchCard`) + 1 modal (`CourseProjectForm`): mọi prop export đều có `/** */` 1+ dòng, có default/khi-nào-ẩn. Có vẻ lint-gated (khớp memory "eslint-plugin-starci-fe 4 rule 'error'").
- **§4 code comment-out** — SẠCH. Grep `// const`, `{/* <Component` không ra hit nào.
- **§5 TODO/FIXME** — SẠCH. Toàn repo chỉ có đúng 1 TODO (`MockInterviewSession/index.tsx:481`) và nó CHÍNH LÀ ví dụ chuẩn trong rubric (đã có ngữ cảnh + điều kiện gỡ).
- **§1 WHY-không-WHAT** — CÓ VI PHẠM, tập trung ở 2 file (xem bảng). Đa số các "reset X khi Y" / "set khi Z fail" khác trong repo đạt chuẩn (nêu rõ trigger/lý do), nên đây là vệt lệch cục bộ chứ không phải hệ thống.

## Findings

| file:line | rule vi phạm | trích | fix |
|---|---|---|---|
| `src/components/modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:65` | §2 lặp tên đã rõ | `// the SWR mutation that calls pinCourseProject on the backend` (ngay trên `useMutatePinCourseProjectSwr()`) | xoá — tên hook đã nói hết |
| `src/components/modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:70` | §1 WHAT thuần | `// prevent native form navigation` (ngay trên `e.preventDefault()`) | xoá |
| `src/components/modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:72` | §1 WHAT thuần | `// require a capstone to be selected before submitting` (ngay trên `if (!selectedEnrollmentId) return`) | xoá — code đã tự nói |
| `src/components/modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:78` | §1 WHAT thuần | `// call the pinCourseProject GraphQL mutation` (ngay trên `pinSwr.trigger(...)`) | xoá |
| `src/components/modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:93` | §1 WHAT thuần | `// reset form state to blank` (ngay trên `setSelectedEnrollmentId(null); setDescription("")`) | xoá |
| `src/components/modals/ManagePinnedProjectsModal/CourseProjectForm/index.tsx:60` | §2 lặp tên đã rõ | `// optional description the user types in` (ngay trên `const [description, setDescription] = useState("")`) | xoá — tên biến đã rõ |
| `src/components/features/learn/Challenge/ChallengeSubmissionPanel/index.tsx:307-308` | §1 WHAT thuần | `// call the submit mutation with the typed URL + this row's chosen grading lane + model` (ngay trên `submitChallengeSubmissionSwr.trigger(...)`) | xoá, hoặc nếu có lý do CHỌN lane/model cụ thể thì viết lại thành WHY |

## Tổng

**7 vi phạm** (đều §1/§2, mức NHẸ — style/nợ nhỏ, không phá chức năng), khu trú chủ yếu 1 file (`CourseProjectForm`, 6/7 vi phạm) + 1 điểm lẻ. §3/§4/§5 sạch.
