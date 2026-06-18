# Draft — Discount/giá ưu đãi phải THẬT (charged=shown), engagement-based  (2026-06-18)

**File/§ đích khi `/merge`:** `main.md` §14 (branding-first/no-over-claim) + §11 (giá tiền).

## Luật (STRICT)
- **Hiện "−X%"/giá ưu đãi ⇒ user PHẢI trả đúng giá đó.** CẤM fake `price*0.9` ở FE rồi checkout full giá (lừa + vỡ
  contract). Discount tính ở BE (`CoursePricingService`, charged=shown) + lưu `transaction.discountPercent` (audit).
- **Ưu đãi "độc quyền" phải dựa DỮ LIỆU THẬT** (engagement: số khóa đã mua + streak/XP), KHÔNG vanity rỗng. Copy cá
  nhân hoá ("vì bạn chăm chỉ / đã học N khóa") OK **khi** % thật + lý do (`reason`) suy từ data thật. Không có cơ chế
  discount thật → KHÔNG hiện %.
- **Giá hiển thị:** VND chính (gốc gạch + giá giảm to khi có discount) + "≈ $Y" muted (rule price-vnd). Format `formatVnd`.

## Pattern recommended-courses
- "Khóa chưa mua" loại enrolled **ở BE** (enrolled-set), trả giá gốc/giảm + `discountPercent` + `discountReason` +
  `enrolledCount` trong 1 query (`recommendedCourses`) — KHÔNG lọc-theo-title client (mong manh).
- Card khóa = `PressableCard` (cover/IconTile + title + desc + giá + chip −X% + copy reason); section tự bọc
  `LabeledCard frameless` + self-hide khi mua hết.

**Đã áp:** FE MyCoursesProgress → SegmentBar+legend (mirror profile); RecommendedCourses rebuild (PressableCard + giá +
discount chip + reason copy) + query/type/hook `recommendedCourses`. **BE (workflow `loyalty-discount-recommended-courses`):**
`computeLoyaltyDiscount` (+5%/khóa + 5% chăm chỉ, cap 30%) áp ở CoursePricingService (charged=shown) + `transaction.discountPercent`
+ query `recommendedCourses`. Công thức số = mặc định (thầy chưa chốt khác).
