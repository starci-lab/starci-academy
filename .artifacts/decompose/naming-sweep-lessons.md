# Storybook Naming Sweep — Kinh nghiệm

Sweep NAMING theo canon `.claude/fe/storybook-naming.md`: chỉ sửa giá trị chuỗi `title:` (meta) và `name:` (mỗi story) trong `*.stories.tsx`, KHÔNG đụng import/export/logic/JSX/props.

## 1. Bảng slice PASS/FAIL + số file sửa

| Slice | Verify | File sửa / File quét | Ghi chú |
|---|---|---|---|
| cards | pass | 16 / ~20 | 9 file đổi `Card`→`Cards`; 33 dòng `name:` xoá (trùng export) |
| stats+buttons | pass | 4 / ~20 | stats/ đã chuẩn sẵn (0 sửa); buttons/ 4 file đổi `Button`→`Buttons`, 12 `name:` xoá |
| learn+grading | pass | 2 / 20 | title đã chuẩn cả slice; chỉ 2 file có `name:` override thật cần dịch/xoá |
| form+feedback | pass | 15 / 20 | form/ 15 file đổi `Form`→`Forms`; feedback/ 5 file đã chuẩn (0 sửa) |
| marketing+commerce+text | pass | 0 / 18 | Toàn bộ đã chuẩn sẵn — không sửa gì |
| feed+rendering+typography | pass | 1 / 18 | Chỉ 1 dòng `name:` (RagSourceGraph) cần xoá |
| navigation+media+async | pass | 0 / 17 | Toàn bộ đã chuẩn sẵn — không sửa gì |
| identity+code+notifications+skeleton | pass | 2 / 18 | Skeleton title đổi số nhiều; NotificationItem 3 `name:` |
| chips+lists+list+rewards+profile | pass | 16 / 16 | Chip→Chips (10 file), List→Lists (4 file), RewardItemCard+FeedbackListItem name dedupe |
| layout+layouts+overlays | pass | 9 / 12 | layout/ (8 file) `Layout`→`Layouts`; overlays/ContentAiChatDrawer 4 `name:` VN dịch |
| fixrefs (post-hoc) | pass | 1 | `_shared.tsx` — 4 storyId hardcode lệch theo title đổi ở các slice trước |

**Tổng: 66 file sửa thật / ~177 file quét, 0 slice FAIL, không cần soi tay slice nào.**

## 2. Pattern dịch hay gặp + chỗ khó

- **Family số nhiều (§1)**: lỗi phổ biến nhất là segment family số ít đứng NGAY SAU Tier-1 (`Primitives/Card/X`, `Primitives/Button/X`, `Primitives/Form/X`, `Primitives/List/X`, `Primitives/Chip/X`, `Primitives/Skeleton/X`, `Primitives/Layout/X`) — luôn nằm ở vị trí segment thứ 2 (giữa Tier-1 và Component). Domain family (Feed, Rendering, Typography, Navigation, Media, Async, Profile, Rewards, Feedback, Identity, Code, Notifications) GIỮ SỐ ÍT dù nghe giống — dễ nhầm áp nhầm luật.
- **`name: == export const` → xoá hẳn field**: case phổ biến nhất trong toàn bộ sweep. Dịch VN→EN rồi so với export const cùng story; nếu trùng, xoá `name:` để Storybook tự suy tên (giảm dòng, tránh drift 2 nguồn sự thật). Ví dụ: "Chưa có tiến độ"→NotStarted (=export) → xoá; "Không đủ Coin"→CannotAfford (=export) → xoá.
- **`name: != export const` → giữ field, chỉ dịch**: khi tên hiển thị mong muốn khác định danh export (vd export `Skeleton` nhưng muốn hiển thị "Loading" cho nhất quán UX-label toàn hệ), GIỮ `name:` nhưng thay chuỗi VN bằng English Title Case — không xoá vì sẽ đổi ý nghĩa hiển thị.
- **DEDUPE 2 story cùng nghĩa (VN+EN)**: không gặp case thật nào cần merge 2 export trong sweep này (dedupe chỉ dùng ở dạng "xoá `name:` trùng export", không phải xoá cả story).
- **Compound identifier dùng dot**: `Parent.Variant` (`Skeleton.Typography`, `Loading.Grid`) khi tên gốc có ` · ` hoặc cấu trúc phân cấp rõ (vd "Khung chờ · lưới"→`Loading.Grid`).
- **Chỗ DỄ NHẦM PHẠM VI nhất**: nhiều file có RẤT NHIỀU khoá `name:` không liên quan story — nằm trong `AnatomyNode` (cây mô tả DOM cho panel audit anatomy) hoặc props `BlockAnatomy name=".."`/`leaf=".."`. Những khoá này VN, có ` · `, giống hệt pattern story `name:` nhưng là DATA cấu trúc UI thật — sửa chúng = đổi logic/JSX, VI PHẠM canon. Phải phân biệt bằng vị trí cú pháp: `name:` hợp lệ CHỈ xuất hiện ngay sau `export const X: Story = {` (top-level CSF field), không phải bên trong object literal lồng nhau.
- **Ký tự nguy hiểm**: canh `"` lồng trong chuỗi (SWC parser Storybook reject) — không gặp case thật nào cần nháy kép lồng trong sweep, nhưng đã luôn kiểm tra trước khi ghi.

## 3. Slice cần soi tay / FAIL

Không có slice nào FAIL hay cần soi tay lại — toàn bộ 10 slice + fixrefs đều verify `pass` bằng `npx tsc --noEmit`, chỉ còn 2 lỗi nền tiền tồn tại không liên quan (`.next/.../validator.ts` thiếu `rag-playground/page.js`).

**1 hạng mục hậu-kiểm phát sinh ngoài 10 slice gốc**: đổi `title:` gãy tham chiếu `storyId` hardcode ở nơi khác trong repo (không phải trong chính file `.stories.tsx`) — phát hiện ở `_shared.tsx` (data cho `CourseContents` panel), phải grep riêng `storyId` xuyên toàn `.storybook/` sau khi xong hết slice để bắt kịp reference lag. Đây là điểm cần nhớ cho lần sweep sau: **luôn có 1 pass fixrefs cuối cùng** sau khi đổi title, vì Storybook storyId = `kebab(title) + kebab(story-name)`.

## 4. Nhắc verify sau sweep

- **Restart Storybook** (dev server) để re-index — storyId đổi theo title/name, cache cũ sẽ hiển thị sai đường dẫn hoặc 404 story.
- **Verify index**: sau restart, kiểm tra sidebar Storybook load đủ family mới (`Cards`, `Buttons`, `Forms`, `Chips`, `Lists`, `Skeletons`, `Layouts`) — không còn family số ít cũ nào sót, và các dashboard/panel dùng `storyId` hardcode (như `CourseContents/_shared.tsx`) trỏ đúng.
- `npx tsc --noEmit` tại `C:/Repositories/starci-academy` là gate rẻ đã dùng xuyên suốt — đủ bắt lỗi cú pháp string nhưng KHÔNG bắt lỗi storyId-runtime (đó là lý do cần thêm bước restart + soi mắt sidebar).
