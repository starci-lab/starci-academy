# `components/` — hai vùng, một ranh giới đo được

```
atoms · frames · composites            ← DÙNG CHUNG, không biết miền
starci · miamia · nivo                 ← MỖI APP một miền, không dùng chung
  └─ blocks · pages · layouts · overlays/{modals,drawers}
```

✅ **`screens/` → `pages/` đã đổi** (2026-07-28). Dừng workflow đang ghi trước (`TaskStop`), đợi
kho sạch + 9/9 cổng xanh, rồi mới `git mv` + remap storyId qua chính `toId` của Storybook — không
đoán chuỗi tay. `starci/pages/` đã đổi xong; `miamia/`, `nivo/` chưa có nội dung nên chỉ có khung
`pages/` rỗng, không cần đổi gì.

`pages` = khớp `page.tsx` của Next.js (nội dung MỘT route, unmount khi rời route).
`layouts` = khớp `layout.tsx` (khung BỌC QUANH N route con, sống qua nhiều route, có khe
`children` bắt buộc — chỗ DUY NHẤT `ReactNode` hợp lệ trên tầng frame). `overlays` tách
`modals/` + `drawers/` — khớp đúng cách `src` tự tách (`ModalContainer`/`DrawerContainer`).

## Vì sao cắt ở đúng chỗ này

Ranh giới này **không mới** — canon đã vẽ nó từ trước, thư mục chỉ đang giấu đi:

> frame không biết NỘI DUNG · composite biết nội dung nhưng **không biết MIỀN** ·
> **block biết MIỀN** · screen ghép block.

Đo lúc tách (2026-07-28): **89 file** ở ba tầng chung không dính từ vựng miền nào;
**25/26** file block+screen có (`lesson` · `course` · `price` · `enroll`…). Đúng một
file không dính. Nói cách khác, cắt theo app ở tầng block/screen chỉ làm HIỆN RA
cái ranh giới vốn đã có.

## Luật

- **App không dùng block của app khác** (thầy chốt 2026-07-28). `miamia` không import
  `starci`, và ngược lại. Muốn dùng chung ⇒ thứ đó không biết miền ⇒ nó thuộc
  `composites`, không thuộc `blocks`.
- **Ba tầng chung không được biết app nào tồn tại.** Một `composite` nhắc tới `course`
  hay `deck` là một block đứng nhầm chỗ.
- `overlays/{modals,drawers}` = thứ mở ĐÈ lên màn, mount MỘT LẦN ở gốc app, gọi được từ
  BẤT KỲ đâu qua store. Không phải một chức năng của screen — screen chỉ giữ cái nút mở
  nó. Neo: `E2eResultButton` chỉ gọi `open()` cho một drawer toàn cục, nên nút thuộc
  `pages`, drawer thuộc `overlays`. Đo thật trong `src`: 26 cái (21 modal + 5 drawer)
  mount ở `InnerLayout` — xem `steps/11-overlays-layouts-brainstorm.md` §2.
  ⚠️ Không phải cứ vẽ ra hình modal/drawer là vào đây — bốn hình dạng khác nhau, đọc §2
  trước khi xếp bất kỳ cái nào.
- `layouts` = khung bọc N route con (Navbar, section rail, gate) — KHÔNG phải `pages`
  dù cùng gọi block+frame. Phép thử: trả lời "trang này làm gì" ⇒ `pages`; trả lời
  "cái gì bọc quanh mọi trang trong phạm vi này" ⇒ `layouts`. Xem
  `steps/11-overlays-layouts-brainstorm.md` §4.

## Cái bẫy khi thêm app

Cổng nào đi tìm block bằng MỘT đường dẫn cố định (`components/blocks`) sẽ **im lặng
không kiểm gì** vào ngày app thứ hai xuất hiện. `check-passthrough-block` đã dính đúng
lỗi đó lúc tách và nay duyệt mọi thư mục app. Thêm app ⇒ đọc lại các cổng trước.
