# Proposal — Mock Interview "Interview" surface: workspace fill-height (fix "chưa gọn/cân đối")

> Status: ⏳ PENDING (thầy chưa duyệt) · Trigger: thầy gửi screenshot màn Phỏng vấn thử (Dockerfile debug question), pain point chốt qua AskUserQuestion = "bố cục chưa gọn/cân đối".

## Chẩn đoán (root cause, không phải content bug)
Surface `interview` (`qna` + `design`) đã là full-bleed 2-pane đúng canon [[full-bleed-work-surface]], khoá
`h-[calc(100dvh-4rem)]` từ 2026-07-13. Nhưng **workspace bên phải là hộp CAO CỐ ĐỊNH**, không fill hết cell đã bị
khoá full-viewport:
- `MockInterviewWorkspace/index.tsx:144` — Monaco editor bọc trong `<div className="h-72 ...">` (288px cố định).
- `MockInterviewDiagram/index.tsx:116` — whiteboard bọc `<div className="... h-64 w-full ... sm:h-80">` (256/320px cố định).

Grid cell (CSS Grid default `align-items:stretch`) đã tự cao bằng row, nhưng NỘI DUNG bên trong (hộp cố định) không
fill theo → khoảng trắng thừa dưới hộp, đọc lệch/không cân đối so với cột trái. Đây là gap CHƯA từng sửa (canon
`full-bleed-work-surface.md` mới sửa chiều cao ROOT + divider→gap, chưa từng đụng tới chiều cao BÊN TRONG mỗi tool).

## Đề xuất (SHAPE only, không đổi nội dung/nghiệp vụ)
1. **Workspace fill-height** — đổi `h-72` (editor) và `h-64 sm:h-80` (whiteboard) → `flex-1 min-h-0` bên trong 1
   wrapper `flex h-full flex-col`, để tool luôn lấp đầy chiều cao cell đã khoá viewport (không còn khoảng trắng thừa
   dưới). Áp cho CẢ 2 tool (Code + Whiteboard), cả `qna` lẫn `design`.
2. **Cột trái (hội thoại) center theo chiều dọc** — `justify-center` cho nhánh flex-col trái, cap `max-w-xl` cho
   bubble câu hỏi, để nội dung không đọc như bị ghim-trên-đỉnh của 1 cột rất cao khi bên phải đã fill full.
3. **Tỉ lệ cột — giữ 1:1 làm mặc định**, đề xuất thêm biến thể **2:3** (hội thoại : workspace) CHỈ khi câu hỏi có
   tool thật (Code/Whiteboard) — mirror CoderPad/interviewing.io đã dẫn trong canon. Khi KHÔNG có tool (EmptyState)
   → giữ nguyên 1:1 (không có lý do skew). Prototype cho thầy so 2 tỉ lệ trực tiếp, tự chọn.
4. Case EmptyState (câu không cần tool) — không đổi, giữ nguyên như canon 2026-07-13 đã chốt.

## Prototype :8080 (HTML bấm-được) — GHI RÕ 3 THỨ
1. **Prototype** — `.artifacts/prototypes/mock-interview-workspace-fill/index.html`, hiện host tại
   `http://localhost:8084/` (port 8080/8081/8082/8083 đều đang bị session khác giữ, scan +1 theo đúng luật skill).
   Toggle: **Bản** (Hiện tại / Đề xuất — bật/tắt fill-height + center cột trái) · **Công cụ** (Không cần / Code /
   Whiteboard) · **Tỉ lệ** (1:1 / 2:3, disable khi "Không cần") · **Máy** (Desktop/Mobile — 2-pane stack dọc).
   Verified: click "Đề xuất" → editor mở rộng thêm dòng (chứng minh JS + layout logic chạy đúng), `read_page`/
   `get_page_text` xác nhận nội dung đổi, không chỉ HTTP 200.
2. **Bảng component → Storybook** — KHÔNG có dòng nào: `MockInterviewWorkspace`/`MockInterviewDiagram` là
   feature-local (`features/learn/MockInterview/`), không phải canonical `blocks/`, hiện KHÔNG có `.stories` (đã
   grep xác nhận) → sửa này không đụng Storybook.
3. **Nguồn tham khảo** — `src/components/features/learn/MockInterview/MockInterviewSession/index.tsx:1854`
   (grid 2-pane) · `MockInterviewWorkspace/index.tsx:144` · `MockInterviewDiagram/index.tsx:116` ·
   `.claude/fe/layouts/full-bleed-work-surface.md` (lịch sử quyết định đầy đủ, đọc trước khi tự chế) ·
   `.claude/fe/prototypes/mock-interview.html` (bản wireframe flow cũ, kế thừa style hệ thống legend/blocktag).
   KHÔNG search web.

## Self-verify checklist
- [x] Không phải page-level route mới → KHÔNG áp yêu cầu PageHeader/breadcrumb.
- [x] Shell theo JOB — không đổi, vẫn full-bleed 2-pane work-surface đúng canon.
- [x] 1 primary action/màn — không đổi (CTA "Trả lời & câu tiếp theo" vẫn duy nhất).
- [x] Conversion lens (CTA/link/psych/honest) — không đổi, đã compliant từ trước; brainstorm lần này chỉ SHAPE.
- [x] Mobile cover — 2-pane vẫn stack dọc (không đổi hành vi responsive hiện có).
- [x] Brief map block THẬT — `MockInterviewWorkspace`, `MockInterviewDiagram`, `InterviewerPresence`, `VoiceHero`
  (đều là component thật đã tồn tại, không bịa tên).
- [x] Flow-first — đã soát cả 2 nhánh (`qna` VÀ `design`), cả 3 state tool (empty/code/whiteboard).

## Files to touch (khi build)
- `src/components/features/learn/MockInterview/MockInterviewWorkspace/index.tsx` — đổi `h-72` → wrapper
  `flex-1 min-h-0` trong `flex h-full flex-col`.
- `src/components/features/learn/MockInterview/MockInterviewDiagram/index.tsx` — đổi `h-64 sm:h-80` → `h-full`
  (đã có sẵn `flex flex-col` + `min-h-0 flex-1` cho canvas con, chỉ cần bỏ chiều cao cố định ở wrapper ngoài).
- `src/components/features/learn/MockInterview/MockInterviewSession/index.tsx` — nhánh `qna` (dòng ~1854-1960):
  thêm `justify-center` cột trái + (nếu thầy chọn 2:3) đổi `lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]` →
  điều kiện theo `workspaceOpen`/tool. Nhánh `design` (dòng ~1991+): tương tự cho cột trái, workspace vốn đã luôn
  2-pane cứng.

## Verify plan (khi build)
- `npx tsc --noEmit` + eslint 2 file component + session.
- Không có story → không cần cập nhật Storybook.
- Runtime: dev server đang bị session khác giữ port thường dùng — báo thầy tự soi HMR, hoặc build session sẽ tự
  scan port khác.

## Quyết định còn chờ thầy
- **Tỉ lệ cột khi có tool: giữ 1:1 hay đổi 2:3?** (prototype cho so trực tiếp — mặc định đề xuất 1:1 trước, 2:3 là
  optional nếu thầy thấy 1:1 sau khi fill-height vẫn chưa đủ "gọn").
- Build luôn session này, hay để BACKLOG cho session sau?
