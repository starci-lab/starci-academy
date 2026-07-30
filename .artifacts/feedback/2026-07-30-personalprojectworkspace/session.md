# Phiên feedback — PersonalProjectWorkspace (trang personal project / milestone)

> Thầy gõ "trang milestone", được hỏi lại thì chốt: **"trang personal project ấy"**.
> Đích dịch ra: `PersonalProjectWorkspace` — page tra ra 4 storyId thật, dispatch THUẦN TUÝ
> (không có DOM riêng — xem source `PersonalProjectWorkspace.tsx`) sang 3 bề mặt đã tự đứng
> story riêng: `PersonalProjectDashboard` (khối "milestone" — bảng điều khiển đồ án, đúng nghĩa
> milestone thầy hỏi ban đầu), `PersonalProjectTaskPage` (đề + nộp một nhiệm vụ), phần
> `PersonalProjectResultScreen` (kết quả chấm nhiệm vụ).

- storyId (tra thật từ `index.json`, không đoán):
  - `starci-pages-personalprojectworkspace-personalprojectworkspace--dashboard`
  - `starci-pages-personalprojectworkspace-personalprojectworkspace--task`
  - `starci-pages-personalprojectworkspace-personalprojectworkspace--result`
  - (kèm 3 bề mặt con tự đứng story riêng, dùng khi cần leaf khác `Dashboard`/`Task`/`Result`
    mặc định: `personalprojectdashboard--full/--all-done/--loading/--empty`,
    `personalprojecttaskpage--schema-v-2/--schema-v-2-graded/--legacy-schema/--locked/--skeleton`,
    `personalprojectresultscreen--passing/--failing/--passing-no-next-task/--skeleton`)
- file screen (dispatch, không DOM riêng): `.storybook/components/starci/pages/PersonalProjectWorkspace/PersonalProjectWorkspace.tsx`
- file 3 bề mặt thật:
  - `.storybook/components/starci/blocks/learn/PersonalProjectDashboard/PersonalProjectDashboard.tsx`
  - `.storybook/components/starci/pages/PersonalProjectTaskPage/PersonalProjectTaskPage.tsx`
  - `.storybook/components/starci/blocks/learn/PersonalProjectResultScreen/PersonalProjectResultScreen.tsx`
- mở: 2026-07-30       trạng thái: **ĐANG CHẠY**
- tồn đọng tìm thấy ở B0: không — chưa có phiên nào trên đích này trong `.artifacts/feedback/`,
  chưa có `audit.md` cache.

## Nghiệp vụ đã nạp (B0, trước khi quét)

Miền: **`challenge-and-milestone.md`** — ĐÃ đọc đủ cho phiên `ChallengePage/Graded` trước, lần
này đọc lại đúng phần **Milestone/Đồ án cá nhân** (khác phần Challenge đã dùng trước đó).

### Thực thể lõi (Milestone, khác Challenge)

| Thực thể | Là gì | Trạng thái thật |
|---|---|---|
| `Milestone` | Cột mốc đồ án, gom nhiều nhiệm vụ | không enum |
| `MilestoneTask` | Nhiệm vụ của cột mốc | `type`: `design`·`techIntegrate`·`business`; `difficulty`: 5 tier (có thể null) |
| `MilestoneTaskBrief` | Đề bài theo ngôn ngữ lập trình (hoặc `agnostic`), markdown | — |
| `UserMilestoneTaskAttempt` | Một lần chấm nhiệm vụ | không enum, cờ `passed` boolean |
| Enrollment (phần đồ án) | Repo GitHub, nhánh, token riêng, `taskPlanStatus` | `locked`·`in_progress`·`completed` |

### Ba route thật khớp 3 bề mặt của `PersonalProjectWorkspace`

| Route | ↔ storyId | Phục vụ |
|---|---|---|
| `.../personal-project` | `--dashboard` | Nhiệm vụ kế tiếp, thanh tiến độ, lưới nhiệm vụ cột mốc hiện tại, chip GitHub |
| `.../personal-project/tasks/[taskId]` | `--task` | Đề nhiệm vụ trái, panel nộp + chấm phải |
| `.../personal-project/tasks/[taskId]/result` | `--result` | Kết quả chấm: chọn lần, điểm, đạt/trượt, góp ý |

### Luật nghiệp vụ đáng nhớ — riêng phần Milestone (§4 domain doc)

- **Nhiệm vụ mở TUẦN TỰ.** "Nhiệm vụ hiện tại" = nhiệm vụ chưa hoàn thành đầu tiên theo thứ tự
  cột mốc rồi thứ tự nhiệm vụ. Nhiệm vụ SAU vẫn đọc được nhưng KHÔNG chấm được (khoá nộp, không
  khoá đọc).
- **Toàn bộ đồ án cá nhân đòi ĐÃ GHI DANH** — là bề mặt học DUY NHẤT bị cổng ghi danh chặn (khác
  Challenge, không cần ghi danh). Học thử thấy thẻ mời ghi danh + bản xem thử mờ dùng TÊN NHIỆM
  VỤ THẬT của khoá (không phải placeholder).
- **Đạt/trượt = tỉ lệ so ngưỡng config**, không phải điểm tuyệt đối — giống hệt luật Challenge,
  và có cùng cạm bẫy "ngưỡng chưa về (=0) thì phải coi là CHƯA đạt".
- **Bài nộp đồ án là của CẢ ĐỒ ÁN**, không phải từng nhiệm vụ — một repo/nhánh/token dùng chung
  mọi nhiệm vụ trong khoá. Đổi nhiệm vụ chỉ đổi cột đọc bên trái, panel nộp bên phải GIỮ NGUYÊN.
- **Token repo chỉ ghi được, không đọc lại** — backend chỉ trả 4 ký tự cuối để nhận diện. Đừng
  dựng ô kiểu "đọc rồi sửa".
- **Rubric nội bộ, không lộ GraphQL** — chỉ hiện đề/brief/góp ý sau khi chấm, không hiện tiêu chí
  approach/outcome thô.
- Job chấm chạy NỀN — 4 trạng thái `queued`·`processing`·`completed`·`failed`, giống Challenge.

### State đáng chú ý cho 3 bề mặt (trích §3 domain doc, dòng 69-87)

| Bề mặt | State | Điều kiện | Hình đổi gì |
|---|---|---|---|
| mọi màn đồ án | chỉ học thử | biết trạng thái ghi danh, chưa ghi danh | Thẻ mời ghi danh + bản xem thử mờ, tên nhiệm vụ thật |
| mọi màn đồ án | chưa biết ghi danh | query ghi danh chưa xong | Spinner căn giữa, KHÔNG được nháy thẻ mời trước |
| Dashboard | chưa nối GitHub | enrollment chưa có URL repo | Chip GitHub mặc định "chưa kết nối" |
| Dashboard | chưa có cột mốc nào | query milestone xong, rỗng, không lỗi | Khối trống thay thẻ tiếp tục + lưới |
| Dashboard | đang tải lần đầu | chưa có milestone redux, query chưa xong | Skeleton |
| Dashboard | đã xong hết | `currentTask` null | Thẻ tiếp tục biến mất → dòng "đã hoàn thành hết" |
| Thẻ nhiệm vụ trong lưới | bị khoá | chưa hoàn thành và không phải nhiệm vụ hiện tại | Dòng phụ đổi "đang khoá" |
| Đề nhiệm vụ (Task) | xem trước bản bị khoá | đang mở nhiệm vụ bị khoá | Alert vàng đầu cột đọc + nút nhảy về nhiệm vụ hiện tại (chỉ hiện khi khác nhiệm vụ đang xem) |
| Đề nhiệm vụ | nhiệm vụ đời cũ | không có brief nào | Ẩn khối brief, thay tiêu chí công khai + hướng dẫn theo ngôn ngữ |
| Hàng nút hành động | bị khoá / chưa từng chấm / đang chấm | — | 3 state nút khác nhau, xem domain doc dòng 80-82 |
| Khối kết quả nhiệm vụ (panel phải, trong Task) | chưa có lần chấm | query xong, không attempt | Tự ẩn hoàn toàn |
| Result | chưa có lần chấm · lỗi · rỗng góp ý | — | 3 khối riêng; rỗng/lỗi thì thẻ BỎ khung, có góp ý mới đóng khung |
| Result | đạt | `attempt.passed` true | Chip xanh "đạt" + lối đi tiếp nhiệm vụ kế |

⚠️ Không thấy mục "backend-FE nói ngược" nào riêng cho Milestone trong `domain/INDEX.md` §5 —
khác Quiz (có 1 mục) — không có nghĩa là sạch, chỉ chưa ai ghi.

## Vùng

Thầy chốt **"full"** — cả 3 bề mặt. Chia theo đúng node `anatPart` mà chính mỗi bề mặt khai
trong JSX (đọc source thật, không tự vạch), gom nhánh con lồng bên trong một compose làm CHUNG
một vùng với node cha (đúng luật hạt "node = component TRỰC TIẾP compose" đã chốt trước đó —
`SurfaceCard "Tiêu chí"` ôm 2 `SurfaceCardAccordion` bên trong thì tính 1 vùng, không tách 3).

### Dashboard — milestone landing (`PersonalProjectDashboard.tsx`)

| id | Vùng (component thật) | Ý định thầy |
|---|---|---|
| D1 | `PageHeader` (breadcrumb + title + chip GitHub) | thầy chưa nói — em tự soi |
| D2 | `ContinueCardHero` (hoặc dòng "đã hoàn thành hết" khi rỗng) | thầy chưa nói — em tự soi |
| D3 | `ProgressMeter` + dòng thống kê | thầy chưa nói — em tự soi |
| D4 | `SurfaceCard` (lưới `ContinueCardItem` — KeepGoingGrid) | thầy chưa nói — em tự soi |

### Task — đề + nộp nhiệm vụ (`PersonalProjectTaskPage.tsx`)

| id | Vùng (component thật) | Ý định thầy |
|---|---|---|
| T1 | `PageHeader` (title/description nhiệm vụ) | thầy chưa nói — em tự soi |
| T2 | `FeedbackCallout` (banner xem-trước-bản-khoá) | thầy chưa nói — em tự soi |
| T3 | `SurfaceCard "Hướng dẫn"` (brief markdown) | thầy chưa nói — em tự soi |
| T4 | `SurfaceCard "Tiêu chí đánh giá (bản cũ)"` (ôm 2 `SurfaceCardAccordion`) | thầy chưa nói — em tự soi |
| T5 | `ContentRelatedList` | thầy chưa nói — em tự soi |
| T6 | `SurfaceCard "Github dự án"` (ôm ô nhập repo + `ListRow` cài đặt + 3 `Button`) | thầy chưa nói — em tự soi |
| T7 | `SubmissionScoreCard` | thầy chưa nói — em tự soi |
| T8 | `SplitWorkspace` (khung 2 cột chính nó) | thầy chưa nói — em tự soi |

### Result — kết quả chấm nhiệm vụ (`PersonalProjectResultScreen.tsx`)

| id | Vùng (component thật) | Ý định thầy |
|---|---|---|
| R1 | `SubmissionResultHeader` | thầy chưa nói — em tự soi |
| R2 | `SubmissionAttemptSelector` | thầy chưa nói — em tự soi |
| R3 | `SubmissionScoreCard` | thầy chưa nói — em tự soi |
| R4 | `SubmissionFindingsList` | thầy chưa nói — em tự soi |
| R5 | `ContentRelatedList` | thầy chưa nói — em tự soi |

Tổng **17 vùng × 15 trục = 255 ô**. B2a chạy **theo TRỤC** (15 agent cố định, mỗi agent phán cả
17 vùng trong 1 lượt), đúng kiến trúc vừa chốt ở
[`step-2-sweep-15-axes.md` § "Chạy B2 qua Workflow"](../../../../starci-academy-backend/.claude/skills/starci-fe-story-feedback-start/step-2-sweep-15-axes.md) — KHÔNG dựng 17 agent theo vùng.

## Vòng

### Vòng 1 — 2026-07-30
Ma trận đầy đủ ở `round-1.md`: 156 ĐẠT · 35 LỆCH · 1 CÂM · 63 N/A = 255/255 ô (không ô trống).
Chạy qua Workflow B2a+B2b (fan-out theo TRỤC, 30 agent). ⚠️ Không có baseline pixel thật (Browser
pane không hiển thị lúc B0/B1) — mọi LỆCH dựa trên đọc source thật, không phải đo DOM. Trình
thầy, **CHỜ PHẢN HỒI** trước khi áp bất kỳ ô nào (chưa duyệt/bác cái nào).

## Ngoài phạm vi

Chưa có.

## Còn treo

- Chưa nhận được xác nhận vùng (B1) từ thầy — đã đề xuất khung 3 bề mặt, chờ chốt phạm vi
  (toàn bộ hay một bề mặt cụ thể).
