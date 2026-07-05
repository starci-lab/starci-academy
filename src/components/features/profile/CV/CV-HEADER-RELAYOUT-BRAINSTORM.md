# CV header region ("Các CV của bạn" + best-score line + dial) — relayout (2026-07-05)

> `/starci-fe-ux-brainstorm`, scoped tới đúng vùng thầy khoanh đỏ trong screenshot. KHÔNG code ở bước này.
> **Đè lại** phần "layout đã chốt, không đụng" trong `CV-VERIFICATION-COPY-BUG-BRAINSTORM.md` — thầy xác nhận muốn
> relayout đúng vùng này (không phải chỉ sửa copy). Không đụng phần dưới (`CvScorecard`/tabs/Góp ý) — cái đó giữ
> nguyên như đã áp.

## Vấn đề — 3 hàng rời, không surface, sai trọng số
Hiện `CvWorkspace` render đúng 3 hàng phẳng nối tiếp (`gap-3` sau khi sửa gap):
1. `Label` "Các CV của bạn" + nút "+ Thêm CV mới".
2. 1 dòng text thường: "CV tốt nhất: 58/100 · còn 12 điểm để mở khoá recruiter" + link "Học nâng cao →".
3. `FlexWrapButtonRadio` (dial các CV).

**Vấn đề:** cả 3 hàng cùng cỡ chữ nhỏ (`body-sm`/`Label`), KHÔNG có ranh giới (border/surface) nào gom chúng lại
thành "1 khối quản lý CV" → mắt đọc ra 3 dòng rời rạc, không phân cấp. Đặc biệt **con số "58" (điểm CV tốt nhất) —
đại lượng quan trọng NHẤT màn hình — lại có trọng lượng thị giác NHỎ NHẤT** (chữ thường, lẫn trong 1 câu dài), trong
khi nút "+ Thêm CV mới" (hành động phụ, không phải điều thầy tới đây để xem) lại nổi bật nhất vì là 1 button.

## Đề xuất — gom vào 1 `LabeledCard` (bounded module), nâng trọng số điểm
- Bọc **CẢ 3 phần vào 1 `LabeledCard`** (`label="Các CV của bạn"`, `action={addNewButton}` — dùng đúng slot `action`
  sẵn có của `LabeledCard`, pattern đã dùng ở `AiUsage` page cho tier chip). → block canonical có sẵn, KHÔNG tự chế
  card mới. Card ở đây XỨNG đáng là bounded object (danh sách CV + stat), không vi phạm luật "card cho thứ xứng
  đáng" ([[concepts/card]]).
- **Bên trong card**, sau divider `border-t` (ranh giới card↔stat, theo [[concepts/card]] §chia cụm bằng divider +
  gap-3 quanh divider):
  - **Điểm tốt nhất = số LỚN** (`text-2xl font-medium`, tint theo verdict success/warning — mirror cách `CvScorecard`
    hero hiện điểm, nhưng nhỏ hơn vì đây là bản tóm tắt, không phải hero đầy đủ) + `/100 · CV tốt nhất` nhỏ cạnh bên.
  - **Phải:** "Còn N điểm để mở khoá recruiter" (dòng phụ nhỏ) + "Học nâng cao →" ngay dưới, gộp cùng 1 cụm bên phải
    thay vì kéo dài thành 1 câu ngang cả hàng.
  - **Dial** (`FlexWrapButtonRadio`, giữ nguyên y hệt) nằm dưới cùng, trong card.
- **Kết quả:** con số quan trọng nhất được đúng trọng lượng thị giác của nó; "+ Thêm CV mới" lùi về đúng vai phụ
  (nút nhỏ ở label-row, không phải điểm nhấn); cả khối đọc ra "1 module quản lý CV" thay vì 3 câu rời.

## Phương án nhẹ hơn (nếu thầy muốn ít blast-radius, không thêm card)
- **B — nén còn 2 hàng, không bọc card:** hàng 1 gộp label + stat ngắn ("Các CV của bạn · 58/100") + nút; hàng 2 =
  dial, với "Còn 12 điểm · Học nâng cao →" chuyển thành **trailing** bên trong chính hàng dial (cạnh chip overflow),
  không còn là 1 dòng riêng. Ít thay đổi hơn A nhưng KHÔNG giải quyết được vấn đề "điểm to nhất nhưng chữ nhỏ nhất"
  triệt để bằng A.

**Đề xuất chọn A** (widget trên) — giải đúng gốc "trọng số sai" + tận dụng `LabeledCard.action` sẵn có, tsc/eslint
rủi ro thấp (đổi cấu trúc JSX, không đổi logic/props của `FlexWrapButtonRadio`).

## Việc cần làm khi `/starci-fe-ux-apply`
1. `CvWorkspace/index.tsx`: bọc label-row + recruiter-stat + dial vào `LabeledCard` (`action={addNewButton}`), xoá
   `addNewButton` khỏi vị trí cũ trong label-row tay (chuyển thành prop `action`).
2. Recruiter-stat viết lại thành 2 cụm (số lớn trái · "còn N điểm" + "Học nâng cao" phải), dùng chung dữ liệu/logic
   `bestScore`/`recruiterUnlocked`/`CV_SCORE_UNLOCK_THRESHOLD` hiện có — KHÔNG đổi tính toán, chỉ đổi trình bày.
3. Giữ nguyên `FlexWrapButtonRadio` (dial) y hệt bên trong card.
4. Verify tsc/eslint + xem mắt (thầy F5 do session preview của em bị khoá bởi server khác).
