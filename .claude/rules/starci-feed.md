---
alwaysApply: true
---
# StarCi — Activity / social feed (render NTN)

Feed hoạt động (wall) + avatar-có-huy-hiệu. Blocks: `FeedItem` (`blocks/feed`), `ActivityAvatar`. (Mindset chung → `main.md`.)

## 1. Feed = kiểu Facebook/LinkedIn
- Mỗi dòng = **avatar + huy hiệu icon-type nhỏ** (góc dưới-phải avatar) + câu (**actor** đậm-`Link` · verb ·
  **target** đậm-`Link`) + **thời gian TƯƠNG ĐỐI** ("2 giờ trước", dùng `getTimeAgoMessage`/`getTimeAgoLabel` đã có)
  kèm `title=` datetime tuyệt đối. Phân tách bằng spacing/divider mảnh + hover nền nhẹ — KHÔNG border dày.
- Build trên block **`FeedItem`** (leading/children/timestamp). Dài → header **nhóm theo ngày** ("Hôm nay/Hôm qua/Tháng…").
- **CẤM datetime tuyệt đối dài** trong feed ("01:56 13 tháng 6, 2026") → relative.
- Bỏ legacy `layouts/shell/Dashboard/Feed` + `EntityToken` → block-based (`FeedItem` + `Link`).

## 2. Never-blank target (STRICT)
- **KHÔNG BAO GIỜ render token/target RỖNG.** `targetLabel` nullable → template i18n `<target></target>` rỗng ("đã đọc ▢").
  Khi `targetLabel == null` → câu **fallback danh từ chung** (key `<type>NoTarget`: "đã đọc một bài học", "đã hoàn thành
  một milestone"…), KHÔNG để trống.

## 3. ActivityAvatar (avatar + badge góc)
- **Huy hiệu icon-type góc avatar = soft-accent NHƯNG OPAQUE.** `bg-accent/10` đơn lẻ trên avatar → trong suốt, lộ
  avatar (xấu). Đúng: **lớp nền `bg-surface` (opaque) + lớp trong `bg-accent/10` + `text-accent`** → soft-accent đặc.
  Giữ `ring-2 ring-surface` cắt khỏi avatar. (Gốc: tint `/10` chỉ "đặc" khi nằm trên nền solid → trên avatar màu phải
  tự dựng nền solid trước.)
- **Avatar CHÍNH theo loại hành động:** mặc định = **actor**; riêng **"theo dõi người khác" (`userFollowed`) → avatar
  chính = NGƯỜI ĐƯỢC FOLLOW** (entity thú vị), badge góc = icon `UserPlus`. Badge LUÔN là icon-type.
- ⚠️ **BE gap:** feed item hiện chỉ có `actorAvatar`, KHÔNG có `targetAvatar` → avatar người-được-follow đang là
  GENERATED (seed username), không phải ảnh upload thật. Muốn ảnh thật → BE thêm `targetAvatar` (ít nhất cho `userFollowed`).

## 4. Activity tab
- **Bỏ section "Khóa học"** ở Activity (đã có ở Overview) — không lặp.
