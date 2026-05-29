# 07 — Types (mirror backend)

`src/modules/types/` — type FE mirror entity/enum của backend.

## Cấu trúc
- `base/` — type nền (`class-name.ts`…).
- `entities/` — mirror BE entity: `course, content, challenge (+ step/requirement/output/reference/prerequisite + *-translation), module, milestone, lesson-video, livestream-session, enrollment, user, foundation (+category/tag), headhunting-company, consultant, code-explaining, code-implementation, job…`.
- `enums/` — mirror BE enum: `challenge-difficulty, payment-type, job-status, job-category, submission-type, submission-feedback-severity, lesson-video-kind/type, milestone-severity/status, pricing-phase, resource-type, personal-project-task-state/type, video-host-platform, foundation-kind, day-of-week…`.

## ⚠️ Quy tắc khớp BE
- **Enum value PHẢI khớp value BE `createEnumType`** — thường là **chữ thường**: `"economy"`, `"premium"`, `"auto"`, `"easy"`. Sai value → GraphQL trả/nhận lỗi enum.
- Khi BE thêm/sửa entity hoặc enum → cập nhật file tương ứng ở đây (giữ field + value khớp).
- GraphQL `XxxRequest` input (trong `modules/api`) cũng phải khớp tên/field input BE.

## Khi thêm type mới
1. Tạo file ở `entities/` hoặc `enums/` → export ở `index.ts`.
2. Đối chiếu trực tiếp entity/enum BE (`starci-academy-backend/src/modules/databases/postgresql/primary/{entities,enums}`).
