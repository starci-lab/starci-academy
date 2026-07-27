# `components/` — hai vùng, một ranh giới đo được

```
atoms · frames · composites      ← DÙNG CHUNG, không biết miền
starci · miamia · nivo           ← MỖI APP một miền, không dùng chung
  └─ blocks · screens · overlays
```

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
- `overlays` = thứ mở ĐÈ lên màn (drawer, modal toàn cục). Nó không phải một chức năng
  của screen — screen chỉ giữ cái nút mở nó. Neo: `E2eResultButton` chỉ gọi `open()`
  cho một drawer toàn cục, nên nút thuộc screen còn drawer thuộc `overlays`.

## Cái bẫy khi thêm app

Cổng nào đi tìm block bằng MỘT đường dẫn cố định (`components/blocks`) sẽ **im lặng
không kiểm gì** vào ngày app thứ hai xuất hiện. `check-passthrough-block` đã dính đúng
lỗi đó lúc tách và nay duyệt mọi thư mục app. Thêm app ⇒ đọc lại các cổng trước.
