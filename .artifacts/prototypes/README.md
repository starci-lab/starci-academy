# prototypes/ — prototype flow bấm-được

Prototype HTML **tĩnh, tự chứa** (1 file/flow) để thầy đi thử flow như slide
trước khi chốt proposal. Host bằng static server tại **:8080**:

```sh
npx serve .artifacts/prototypes -l 8080
# → http://localhost:8080/<feature-slug>.html
```

## Quy ước

- Tên file: `<feature-slug>.html` — copy từ `_TEMPLATE.html`.
- Tự chứa 100%: inline CSS/JS, KHÔNG CDN, KHÔNG fetch — mở file là chạy.
- Prototype = khung IA + điều hướng giữa surface (bấm được), KHÔNG cần pixel-perfect;
  màu/spacing mô phỏng token là đủ.
- Mỗi surface phủ đủ state matrix chính (empty/N/error) nếu flow phụ thuộc data.
- Chốt xong flow → ghi proposal vào `../proposals/`, prototype GIỮ LẠI làm tham chiếu.
- Cập nhật `INDEX.md` khi thêm prototype.
