# Chromatic — visual-regression setup (cần tài khoản của thầy)

Storybook + axe (a11y) đã chạy LOCAL. Chromatic thêm **snapshot regression** (diff ảnh mỗi PR — bắt vỡ dark-mode, contrast, fill-chồng-fill mà lint không thấy). Đây là bước duy nhất cần **tài khoản + token của thầy**.

## Kích hoạt (1 lần)
1. Tạo project trên https://www.chromatic.com (login GitHub, chọn repo `starci-academy`) → lấy **project token**.
2. **CI (GitHub Actions):** repo → Settings → Secrets and variables → Actions → thêm secret `CHROMATIC_PROJECT_TOKEN` = token. Workflow `.github/workflows/chromatic.yml` tự chạy từ đó (đang gate `if secret != ''` nên chưa có token thì no-op, không fail).
3. **Local (tuỳ):** `npx chromatic --project-token=<token>` — hoặc `npm run chromatic` sau khi set `CHROMATIC_PROJECT_TOKEN` env.

## Lần chạy đầu
Chromatic lấy toàn bộ story hiện có làm **baseline**. Từ PR sau, mọi thay đổi pixel của 13 story (Primitives + 12 block canonical) sẽ hiện diff để review/approve.

## Mở rộng coverage
Thêm story cho block/surface mới → tự vào snapshot. Ưu tiên story-ize thêm các block canonical còn thiếu + các surface hay đổi.

> Ghi chú: repo hiện **chưa có CI khác** trong `.github` — nếu team dùng Vercel/khác thay GitHub Actions, chạy `npm run chromatic` trong pipeline đó với token là đủ.
