# PremiumGateModal — UX brainstorm (2026-06-24)

> KHÔNG code — brainstorm + chốt hướng. Target: `components/modals/PremiumGateModal/index.tsx`.

## Inventory hiện tại
- Gate hiện khi click feature premium trên bài "đọc thử". Dismissable (giữ teaser).
- Nội dung: lock icon (warning) + `course.paywall.title` + `course.paywall.description` + 1 nút "Mua" → `close()` + mở PaymentModal (CourseEnroll).
- **Rất mỏng** — chỉ tiêu đề + 1 dòng + nút.

## Pain
1. **Không bán giá trị** — gate là **conversion surface** nhưng không nói mở khoá ĐƯỢC GÌ, không neo giá. Chỉ "Mua".
2. Bỏ phí data sẵn có: `myCourseOutline` (số bài/challenge/capstone) + `coursePricePreview` (giá + loyalty discount) → có thể làm value list + price anchor mà KHÔNG cần BE mới.
3. **Vi phạm rule:** icon `@gravity-ui` (`Lock`, `ShoppingCart`) → **phosphor** (`LockIcon`, `ShoppingCartIcon`). `gap-1.5` ở header → cấm (→ `gap-2`).

## Refs ngành (paywall / upgrade modal)
- SaaS upgrade modal value-first (Notion/Linear/Figma "what you unlock"); [Baymard](https://baymard.com/learn/checkout-flow-ux-optimization) (anchor giá + 1 CTA rõ); giá có discount = đòn bẩy mua ngay.

## Hướng
- **A — Polish:** đổi icon phosphor + fix gap. Tối thiểu, vẫn không bán giá trị.
- **B — Value-first paywall (CHỐT):** lock header → 1 dòng value prop ("đang đọc thử, mở khoá để học trọn") → **bullet "bạn mở khoá"** (N bài · M challenge · dự án cá nhân — đọc từ outline) → **price anchor** (`discountedPriceVnd` struck `originalPriceVnd` + chip `−% loyalty` từ `coursePricePreview`) → 1 CTA "Mở khoá khóa học" → PaymentModal. Giữ dismissable.
- **C — Bảng so sánh free vs premium:** nặng cho 1 modal; để dành landing page.

## Section → data
| Section | Field BE | Ghi chú |
|---|---|---|
| Header | `course.paywall.title` (i18n) | + lock phosphor |
| Value prop | `course.paywall.description` | giữ |
| Unlock bullets (MỚI) | `myCourseOutline` (counts bài/challenge/milestone) | reuse query |
| Price anchor (MỚI) | `coursePricePreview` (`discountedPriceVnd`/`originalPriceVnd`/`discountPercent`) | đòn bẩy mua |
| CTA | mở PaymentModal CourseEnroll | giữ |

## Cắt / thêm
- **Cắt:** `@gravity-ui` import · `gap-1.5`.
- **Thêm:** unlock bullets · price anchor (loyalty). KHÔNG cần BE mới (đều reuse query có sẵn).
- Lưu ý: cần `course` trong store để lấy id cho `coursePricePreview` (PaymentModal đã đọc `state.course.entity` → cùng nguồn).

→ Widget đã vẽ trong chat. CHỐT hướng → `/starci-fe-ux-apply`.
