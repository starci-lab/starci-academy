# UX Brainstorm — Coin Shop / Voucher (RewardsPage redesign)

> `/starci-fe-ux-brainstorm voucher` — 2026-07-05. Legacy `RewardsPage` = inventory only, không phải design authority.

## 1. Mục tiêu trang
Người dùng vào đây để (≤30s):
1. Biết mình có bao nhiêu **Coin** để tiêu.
2. Đổi Coin lấy 1 trong 5 loại thưởng (streakFreeze, aiCreditBoost, voucher10, sticker, tshirt).
3. **Kiểm tra/dùng lại** voucher đã đổi (mã, giảm bao nhiêu, còn hạn không) — đây là nhu cầu quay lại nhiều nhất sau lần đổi đầu.

## 2. Grounded — dữ liệu BE/DB thật (đã build ở BE session này)
| Field | Nguồn | Ghi chú |
|---|---|---|
| `coinBalance` | `myRewardWallet.balance` (derived, không đổi) | Số dư khả dụng |
| `rewards[]` — 5 item, `kind: digital\|physical\|voucher\|aiCredit` | `rewards` query | Mỗi item có `voucher{discountType,value,validityDays}` hoặc `aiCredit{amount5h,amountWeek}` khi tương ứng |
| `redeemReward` response | mutation | `{balance, streakFreezes, voucherCode?, aiCreditGranted?}` — **đây là khoảnh khắc "đây là mã của bạn"** |
| `myRewardWallet.redemptions[]` | query có sẵn | rewardKey, cost, status, createdAt — CHƯA có `voucherCode` |
| `CourseVoucherEntity` (BE, chưa có query) | DB | code, discountType, value, courseId (null=mọi khóa), status (unused/reserved/used/expired), expiresAt, usedAt |
| `coursePricePreview(courseId, voucherCode?)` | query đã sửa | trả `voucherDiscountedPriceVnd` khi có mã hợp lệ |
| `CourseEnrollRequest.voucherCode` | mutation input | Sepay + PayOS đã áp; PayPal/Stripe/Crypto CHƯA |

**⚠️ BE GAP cần build TRƯỚC KHI `/starci-fe-ux-apply`:** chưa có query `myVouchers` (list voucher của user). Không có nó thì KHÔNG có gì để hiển thị ở tab "Ví của tôi" ngoài redemption history cũ (không show code/status/expiry). Đây là điều kiện tiên quyết.

## 3. Vấn đề của trang legacy (chỉ liệt kê, không copy cấu trúc)
- Dùng `SectionCard` + `<span>` tay, KHÔNG theo canon hiện tại (`elements/card.md`, `elements/chip.md`, `elements/list.md`).
- Redemption history là list phẳng, không phân biệt trạng thái bằng chip màu semantic.
- Không có nơi nào cho "voucher của tôi" — vì trước đây chưa có khái niệm voucher.
- Catalog + wallet + history dồn 1 cuộn dài — sẽ càng dài khi catalog thêm item.

## 4. Ba hướng (xem widget đã vẽ) — CHỐT hướng B

**A. Catalog-first, 1 trang (nâng cấp legacy)** — mọi thứ trong 1 cuộn dài: balance → catalog → voucher của tôi → lịch sử. Đơn giản, không cần điều hướng, nhưng dài dần theo catalog + làm loãng "voucher của tôi" (thứ user quay lại tìm nhiều nhất) xuống giữa trang.

**B. Tab "Cửa hàng" / "Ví của tôi" (ĐỀ XUẤT)** — tách MUA (catalog) khỏi SỞ HỮU (balance + voucher + AI-credit đã nhận + lịch sử). Neo theo pattern Duolingo Shop (mua bằng gems, tách khỏi inventory) và Steam Store/Inventory. Đúng luật app hiện có `single-select-among-options-use-tabs` (2 view khác nhau về dữ liệu → tab, không cuộn liền). Trade-off: thêm 1 cú click, nhưng đúng mental model "shop ≠ ví" và tab "Ví của tôi" có thể gắn badge số lượng voucher unused (nhắc quay lại dùng).

**C. Wallet-first, catalog sau CTA** — land thẳng vào ví (balance + voucher), catalog giấu sau nút "Đổi thưởng ›" (Drawer). Ưu tiên user quay lại (session thứ 2+) nhưng làm giảm khả năng khám phá catalog ở lần đầu ghé trang — rủi ro cho conversion đổi thưởng.

**→ Chốt hướng B.** Lý do: trang này có ĐÚNG 2 tác vụ khác hẳn nhau (mua thưởng mới vs kiểm tra/dùng thưởng đã có), tab cho cả 2 "chỗ đứng" ngang nhau (không thiên vị lần-đầu hay lần-quay-lại như A/C), khớp research (Voucherify: "tạo không gian RIÊNG cho check voucher status, đừng chôn trong cài đặt chung").

## 5. IA chi tiết (hướng B)

```
PageHeader "Cửa hàng Coin"
  breadcrumb: Home › Cửa hàng Coin
  meta chip: "Số dư · {coinBalance} Coin" (HighlightChip)

TabsCard: [Cửa hàng] [Ví của tôi (badge = voucher unused count)]

── Tab "Cửa hàng" ──
  LabeledCard "Đổi thưởng" (frameless) → SelectableCardGroup hoặc grid card
    mỗi item: icon (theo kind) + title + desc + cost chip + nút "Đổi"
    physical → mở inline shipping form (giữ hành vi cũ)
    voucher/aiCredit → redeem xong → Modal/Toast "Đây là mã của bạn: XXXX-XXXX [copy]"
      (voucher code hiển thị font-mono — ngoại lệ hợp lý như inline-code, cần thầy duyệt riêng theo chip.md)

── Tab "Ví của tôi" ──
  LabeledCard "Voucher của tôi" → SurfaceListCard rows
    mỗi row: code (mono) + discount ("-10%") + scope ("Mọi khóa học" / tên khóa) + Chip trạng thái
      unused → Chip accent "Khả dụng" · reserved → Chip warning "Đang giữ" · used → Chip muted "Đã dùng" · expired → Chip danger "Hết hạn"
    empty → EmptyContent "Chưa có voucher nào" + CTA "Đổi thưởng" nhảy sang tab Cửa hàng
  LabeledCard "Lịch sử đổi thưởng" (giữ nguyên, nâng cấp da theo SurfaceListCardItem)
```

## 6. State
- **Loading**: skeleton mirror đúng cấu trúc (PageHeader chip skeleton, 5 card skeleton, list skeleton) — KHÔNG debug-hold (rule đã xoá cơ chế đó).
- **Empty**: catalog luôn có (server-side constant) nên không cần empty; "Voucher của tôi" cần empty state riêng (trên).
- **Error**: AsyncContent retry chuẩn.
- **A11y**: nút "Đổi" disable khi `coinBalance < cost` kèm lý do (không ẩn nút — user vẫn thấy được cái mình chưa mua nổi, theo Restraint rule "tránh disabled không giải thích" — thêm tooltip/caption "Cần thêm N Coin").

## 7. Việc cần làm trước khi `/starci-fe-ux-apply`
1. **BE: thêm query `myVouchers`** (auth) trả `Array<{code, discountType, value, courseId, courseTitle, status, expiresAt, usedAt}>` — nếu không có, tab "Ví của tôi" không có gì để render thật.
2. **BE (optional nhưng nên làm):** thêm `voucherCode` vào `RewardRedemptionEntity`/`myRewardWallet.redemptions[]` HOẶC chấp nhận chỉ hiện code ở `myVouchers` (không lặp ở lịch sử) — quyết định 1 nguồn hiển thị (ref `single-source-render`).
3. **FE hook**: `useQueryCoursePricePreviewSwr` + `PaymentModal` cần thêm ô "Có mã giảm giá?" (voucherify: đặt CÀNG SỚM CÀNG TỐT trong luồng checkout, label rõ ràng, feedback ngay cạnh ô nhập) — việc này nằm ngoài scope trang Coin Shop nhưng LÀ nơi tiêu voucher, brainstorm riêng khi `/starci-fe-ux-apply` PaymentModal.

## Nguồn tham khảo
- [Voucherify — Gift card UX/UI best practices](https://www.voucherify.io/blog/gift-cards-ux-and-ui-best-practices) — đặt ô nhập mã sớm, feedback tại chỗ, dễ copy code.
- Duolingo Shop (gems → streak freeze / XP boost) — tách mua khỏi sở hữu, xem [Duolingo gamification](https://www.orizon.co/blog/duolingos-gamification-secrets).
- Steam Store vs Inventory — cùng pattern tab tách 2 vai.
