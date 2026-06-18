# Draft: giá tiền — VND là chính, USD chỉ "xấp xỉ" dòng phụ

**File-§ đích:** `main.md` (mindset i18n/format/tiền tệ) — chọn khi `/merge`.

**Bài học (2026-06-17):** trang Membership ("Thành viên") hiển thị "$5 / month" (hardcode i18n). Sản phẩm
hướng VN → thầy chốt: **đổi sang tiền Việt thay đô, dòng dưới ghi "xấp xỉ"**.

**Luật mới:**
- Sản phẩm/khách VN → **giá VND là CHÍNH** (số to), **USD chỉ là dòng phụ "xấp xỉ $X"** (body-xs muted) bên dưới.
  KHÔNG để USD làm giá chính. Format VND: `amount.toLocaleString("vi-VN")+"₫"` (reuse `formatVnd`).
- **Nguồn giá = BE config, KHÔNG hardcode i18n.** SSOT là `.mount/config/app.yaml › membership.priceVnd / priceUsd`
  (vnd 129000 / usd 5). FE đang **hardcode chuỗi "$5" trong messages** → lệch khi giá đổi.
  → Lý tưởng: FE query membership config rồi `formatVnd(priceVnd)` + `formatUsd(priceUsd)`. Tạm thời đã cập nhật
  i18n cho khớp (129.000₫ + "xấp xỉ $5"), nhưng đây là **nợ**: số hardcode 2 nơi.

**Đã áp (tạm, i18n):** `Membership/index.tsx` price block = VND (h3) + "/ tháng" + dòng `priceApprox` "Xấp xỉ $5/tháng".
**TODO khi rảnh:** thêm query membership-config (priceVnd/priceUsd/enabled) → bỏ hardcode i18n, format runtime.
