# Mock Interview — Artifact-seeded workspace (câu có code/diagram → nạp vào CÔNG CỤ, sửa luôn)

> `/starci-fe-ux-brainstorm` 2026-07-07. Thầy: *"sao phần này không viết code vào công cụ bắt user sửa luôn?"*
> (screenshot = câu `debug` có `givenCode`, code render read-only trong bubble chat, trả lời bằng voice).
> KHÔNG code — brainstorm + chốt hướng.

## Vấn đề (grounded từ source thật)
- Câu `debug`/`review`/`optimize` mang `givenCode` (+ `givenLang`) → hiện tại render **read-only trong bubble chat**
  (`MarkdownContent`, deliver verbatim). Người dùng trả lời **bằng voice** (nói ra chỗ sai + cách sửa).
- Đã CÓ `MockInterviewWorkspace` (tool tabs Whiteboard/Code/Notes) NHƯNG:
  1. Tab **Code = `<TextArea font-mono>` thường** (không phải editor thật — không số dòng, không highlight).
  2. Code tool **khởi tạo RỖNG** (`MOCK_INTERVIEW_CODE_STATE_DEFAULT.code = ""`) — KHÔNG nạp `givenCode`.
  3. Ở QnA mode, workspace **COLLAPSED** sau nút "+ Thêm bản nháp" (`workspaceOpen=false` mặc định).
- → **Code hỏng (read-only ở chat) và chỗ-để-sửa (tool rỗng, ẩn) là 2 thứ rời nhau** → không ai copy code sang tool
  để sửa → affordance chết. Đúng chỗ thầy chỉ.
- Monaco **đã là dep** (`@monaco-editor/react` + `monaco-editor` trong package.json) → editor thật khả thi ngay.

## Insight cốt lõi — `kind` ĐÃ quyết định modality trả lời → BIND + SEED tool theo kind
Field `kind` (đã author trong bank) nói rõ câu này trả lời bằng gì. Dùng nó để **tự chọn tool + NẠP artifact**:

| `kind` | Có gì kèm | Tool auto | Seed | Chấm |
|---|---|---|---|---|
| `debug` / `review` / `optimize` | `givenCode`+`givenLang` | **Code (Monaco)** promoted | **nạp code hỏng, editable** | code đã-sửa **diff vs given** + voice |
| `coding` | (không given) | **Code (Monaco)** promoted | rỗng / stub | code viết ra + voice |
| `scenario` / `design` | `diagram` (mermaid) | **Whiteboard** promoted | mở sẵn (nạp diagram = defer, xyflow khó) | sketch + voice |
| `theory` / `reasoning` / `behavioral` / `situational` / `culture` | — | (không) collapsed | — | voice thuần (Notes tùy chọn) |

→ Voice-first VẪN giữ (express-tier, transfer-appropriate — [[learning-surface-grounded-in-pedagogy-not-superficial-gamify]]).
Tool KHÔNG thay voice — nó là **chất liệu bạn SỬA + nói đè lên** (đúng phỏng vấn thật: sửa trong editor while
explaining). Cả artifact LẪN articulation đều được chấm.

## 3 hướng
### A — Artifact-seeded workspace (ĐỀ XUẤT) ⭐
Giữ nguyên "phòng" hiện tại, nhưng **`kind` quyết định workspace được PROMOTE + SEED hay xếp gọn**:
- Câu artifact (debug…) → workspace **mở sẵn**, tab **Code (Monaco)** active, **nạp code hỏng editable**. Bubble
  chat chỉ hiện **câu hỏi (prose)** + 1 chip "Code đã nạp vào Editor →" — **KHÔNG** đổ lại nguyên code read-only
  (tránh 2 bản: 1 read-only chat + 1 editable tool = rối, [[concepts/card]]).
- Câu voice-only (theory/behavioral) → workspace collapsed như cũ, VoiceHero là chính.
- Chấm: gửi **cả `givenCode` gốc** cho grader → nó diff code-đã-sửa vs given → chấm **CÁI FIX** (không chỉ code cuối).
- **Ref-real:** CoderPad templates/snippets + HackerRank "debug a complete program" = nạp sẵn code hỏng vào editor,
  chấm fix + approach + communication (nguồn dưới). Reuse tool-tabs + Monaco (đã có dep). **Blast nhỏ nhất.**

### B — "IDE room" đầy đủ cho câu code
Câu debug/coding → cả phòng thành 2-pane `[đề | Monaco + Run/Submit]` (LeetCode/HackerRank). Sửa mạnh nhất NHƯNG:
phá cảm giác "phòng phỏng vấn" thống nhất + phá voice-first; cần hạ tầng **chạy code** (StarCi chấm *articulation*,
không chấm runtime) → over-scope. Loại.

### C — Code block edit-tại-chỗ trong bubble
Làm chính block code trong message editable (CodeMirror inline), không cần tab riêng. Ít friction NHƯNG trộn
"transcript" với "artifact trả lời", không generalize sang diagram/notes, state model rối. Loại.

## Chốt: **Hướng A**

### A kéo theo (secondary)
1. **Tab Code: `<TextArea>` → Monaco** (`@monaco-editor/react`, dep sẵn) — editing thật, highlight, số dòng.
2. **Seed-on-deliver:** khi giao câu, `givenCode` có → `setCodeState({lang: givenLang, code: givenCode})` +
   `setWorkspaceTool("code")` + `setWorkspaceOpen(true)`. `diagram` có → whiteboard + open (nạp diagram = pha sau).
3. **Reset seed mỗi câu MỚI** — đừng để code câu trước dính sang câu theory sau (clear khi câu không có artifact).
4. **Bubble chat:** câu artifact → chỉ prose ask + chip "→ Editor"; KHÔNG đổ code read-only (1 bản, editable).
5. **Chấm (BE):** grounding chở thêm `givenCode`/`givenLang` → prompt chấm có "Code gốc (hỏng)" + "Code ứng viên
   sửa" để grader **diff**. BE đã có fold `[Code lang=]` + section "Workspace artifacts" → mở rộng, KHÔNG dựng mới.
   ⚠️ Đụng BE grading → **verify BE runtime** ([[fe-change-touching-backend-must-verify-backend-runtime]]).
6. **Guardrail pedagogy:** voice vẫn chính; sửa rỗng KHÔNG zero nếu giải thích tốt (giữ "vắng artifact không trừ
   điểm") — nhưng câu debug thì **nudge** "Sửa trong editor + giải thích".

### Ma trận state
- **artifact/code (debug):** workspace promoted · Code tab · Monaco nạp code hỏng (editable) · chip "→ Editor" ·
  submit chấm edit+voice.
- **artifact/design (scenario):** whiteboard promoted/mở · (diagram seed = pha sau) · chấm sketch+voice.
- **voice-only (theory/behavioral):** workspace collapsed · VoiceHero primary · Notes tùy chọn.
- **submit khi chưa sửa gì:** cho phép (voice được chấm) + nudge; không chặn.

## Nguồn (ref-grounded)
- CoderPad — pre-loaded/snippet code, review & fix bug in interview; chấm quality/approach/communication:
  https://coderpad.io/resources/docs/interview/more-interview-resources/troubleshooting/ ·
  https://coderpad.io/versus/hackerrank/
- HackerRank — "Debugging a Complete Program" (code hỏng nạp sẵn, sửa + test):
  https://candidatesupport.hackerrank.com/articles/1404575144-debugging-a-complete-program
- Repo: `interview-setup-one-tier-knob-random-and-workspace-tool-tabs` (tool-tabs + artifact grader-aware) ·
  `learning-surface-grounded-in-pedagogy-not-superficial-gamify` (transfer-appropriate: voice-first có chủ đích).

→ Thầy chốt A → `/starci-fe-ux-apply` để dựng (kind→tool seed + Monaco code tab + BE grounding givenCode).
