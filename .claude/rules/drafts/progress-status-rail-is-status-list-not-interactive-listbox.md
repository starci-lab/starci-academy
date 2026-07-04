# Draft — Rail hiển thị TRẠNG THÁI tiến trình (driven, không click) = STATUS LIST (icon mang màu), KHÔNG `ListBox` interactive (2026-07)

- File/§ đích khi `/merge`: `elements/list.md` (phân biệt với §4 ListBox rail) + [[accent-system]] §2/§4 (status = icon, không tint row).
- Bối cảnh: System Design mock interview — rail 5 phase (Yêu cầu → Ước lượng → Tổng thể → Đào sâu → Tradeoff). Phase **do buổi phỏng vấn điều khiển** (AI/nút chuyển), **người dùng KHÔNG click để nhảy phase**. Ban đầu định dùng `ListBox` (theo [[elements/list]] §4 "rail chọn item").

## Quy tắc (STRICT)
- **Rail thể hiện TRẠNG THÁI của 1 tiến trình có thứ tự (stepper phase, các bước job, timeline) mà item KHÔNG click-được → render STATUS LIST** (`<ul>` rows), KHÔNG `ListBox` (HeroUI). `ListBox` = control **CHỌN item** (selectionMode + onSelectionChange); ép nó lên nội dung không-tương-tác = sai affordance (đọc "bấm được" trong khi không).
- **Trạng thái do ICON mang màu, KHÔNG tint cả row** ([[accent-system]] §2 · §4): done = `CheckCircleIcon text-success` · current = `CircleIcon text-accent` + label `text-accent` · todo = `CircleIcon text-muted` + label `text-muted`. Row nền trong suốt. (Khác "đang chọn" persistent selection vốn tint `bg-accent/10` — phase-current là STATUS, không phải selection.)
- **a11y:** phase hiện tại `aria-current="step"`; nhãn phase có TEXT (không chỉ màu).
- **Phân biệt (đừng nhầm):**
  - **Rail CHỌN item** (deck/category/lần-thử — user click để đổi view) → `ListBox` §4 (selected = `bg-accent/10`). Có tương tác.
  - **Rail TRẠNG THÁI** (phase interview, bước pipeline — hệ điều khiển, user không click) → status list, icon mang màu. Không tương tác.
  - Hỏi: item này user **click để chọn/đổi** (→ ListBox) hay chỉ **hiển thị hệ đang ở đâu** (→ status list)?

## Áp đầu (2026-07)
- `SystemDesignInterview` (scaffold Pha 1): rail 5 phase = status list (icon done/current/todo) + timer, KHÔNG ListBox. Thầy chọn "ListBox dọc + marker trạng thái" nhưng phase không click-được → giữ tinh thần "dọc + marker" bằng status list (đúng affordance hơn). Ref [[accent-system]] §2.
