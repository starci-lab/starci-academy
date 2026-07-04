# Cart / Add-to-cart UX — brainstorm (2026-07-04)

> `/starci-fe-ux-brainstorm`. Feature "mua nhiều khóa 1 lúc". Không code — chốt hướng rồi `/starci-fe-ux-apply`.

## Mục tiêu bề mặt
Người duyệt catalog (đa số là **khách chưa đăng nhập**) phải: (1) thấy rõ có giỏ hàng + đang có mấy khóa, (2) khi bấm "Thêm vào giỏ" nhận phản hồi **bền, tại chỗ** (không phải toast thoáng qua), (3) thấy ngay **ưu đãi combo** ("thêm 1 khóa để giảm thêm") — đây là điểm bán hàng riêng của StarCi (progressive loyalty + bundle bonus đã build ở BE).

## Hiện trạng (inventory — KHÔNG phải design authority)
| Thứ | Trạng thái | Vấn đề |
|---|---|---|
| Cart entry (nav) | `CartButton` gate cứng `if (!authenticated) return null` (`Navbar/CartButton/index.tsx:35`) | **Khách không bao giờ thấy giỏ** → đúng "cart đâu" trong screenshot. Icon nằm giữa theme ↔ notification bell. |
| Add-to-cart button | `AddToCartButton` chỉ ẩn khi `isEnrolled \|\| !isPaid` — **hiện cho cả khách** | Khách thấy nút Thêm nhưng không có giỏ → lệch. |
| Phản hồi add | 1 `toast` (`useCart.addToCart` → `useGraphQLWithToast`, `cart.added`) | NN/G: add-to-cart cần feedback **bền/overlay**, toast là yếu nhất; không có "add more to save" tại thời điểm quyết định. |
| Cart view | **Chỉ trang `/cart`** (`CartView`), không mini-cart | Không có slide-out; ưu đãi combo chỉ thấy sau khi rời trang sang /cart. |
| Nút trên card catalog | "Xem khóa học ›" (link accent) + "Thêm vào giỏ" (tertiary, cùng hàng) | 2 hành động **cạnh tranh trọng lượng** → "cái này mà được à?". |
| Rail course-detail | "Đăng ký" (primary) + "Thêm vào giỏ" (secondary) + "Học thử" (tertiary) | 3 nút full-width — chấp nhận được (chuẩn purchase-rail), có thể hạ "Học thử" thành link. |
| Hạ tầng Drawer | ĐÃ CÓ: HeroUI `Drawer` + zustand overlay (`OverlayKey`) + `DrawerContainer` (right desktop / bottom mobile) | → thêm `MiniCartDrawer` rẻ, đúng pattern sẵn. |
| Checkout | `PaymentModal` `PaymentFlow.CoursesCheckout` (đã có) + `coursesCheckoutPreview` (giá thật) | Drawer chỉ cần gọi `openPayment(...)` như `/cart` đang làm. |

## Ref (grounded — có search mạng)
- **Mini-cart / slide-out = chuẩn hiện đại**: drawer xác nhận add-to-cart tại chỗ, trang cart để review cuối; hai cái bổ trợ. Slide-cart nâng conversion desktop ~17%, AOV +$7.5 (Vervaunt, ecomhint A/B, Oxify). Mobile: drawer có thể giảm CR → **hybrid: right desktop / bottom-sheet mobile** (app đã làm sẵn `placement`).
- **NN/G — "Adding an item… provide clear, persistent feedback"**: overlay/thay đổi icon giỏ/animation, KHÔNG chỉ toast (toast không interactive, không bền).
- **Free-shipping meter → +~5% AOV** (Rebuy). StarCi thay bằng **bundle-discount meter** ("thêm 1 khóa để giảm 10%").
- **Udemy/Amazon**: "Add to cart" + "Buy now" cùng chỗ; card action-row ở đáy; cart icon **luôn hiện** ở header.

Nguồn: vervaunt.com/ecommerce-cart-drawers · ecomhint.com/cart-drawer-vs-cart-page · oxify.app/slide-cart-vs-mini-cart · nngroup.com/articles/cart-feedback · rebuyengine.com/blog/cart-flyouts-we-love · support.udemy.com Shopping-Cart-FAQ.

## Các hướng (cart-view + feedback)

### ★ Hướng A — Mini-cart drawer (ĐỀ XUẤT)
- Cart icon **luôn hiện trên nav** (cả khách); badge count khi >0.
- **Bấm "Thêm vào giỏ" → drawer trượt ra phải** (bottom-sheet mobile): khóa vừa thêm + list giỏ + **thanh ưu đãi combo** + tạm tính giá-thật (`coursesCheckoutPreview`) + "Tiết kiệm X" + **"Thanh toán"** (→ PaymentModal) + link "Xem giỏ đầy đủ" (→ /cart).
- Bấm icon giỏ trên nav → mở CÙNG drawer. Trang `/cart` GIỮ làm review sâu / shareable URL.
- **Được**: feedback bền đúng NN/G · "add more to save" đúng lúc quyết định (kéo AOV) · tái dùng Drawer + PaymentModal sẵn · responsive sẵn.
- **Mất**: thêm 1 component drawer + wiring overlay key.

### Hướng B — Toast + badge + trang /cart (tối giản, gần hiện tại)
- Cart icon luôn hiện. Add → toast "Đã thêm" + badge++ + nút morph "Đã thêm · Xem giỏ". Review chỉ ở /cart.
- **Được**: ít việc nhất. **Mất**: feedback yếu (toast), không nudge combo tại chỗ → phí điểm bán hàng chính.

### Hướng C — Drawer-only (bỏ trang /cart)
- Mọi thứ trong drawer, không trang riêng. **Được**: gọn. **Mất**: mất URL /cart shareable/deep-review; mobile giỏ dài trong bottom-sheet kém; lệch [[when-drawer]] (checkout là primary flow nên vẫn cần bề mặt đầy đủ).

→ **CHỐT A** (drawer chính + giữ /cart review). Combo-meter trong drawer = đòn bẩy AOV riêng của StarCi.

## Sub-decisions cần thầy chốt
1. **Khách chưa đăng nhập** (BE cart auth-only): **giữ cart icon + nút Thêm hiển thị cho khách**, bấm → mở `AuthenticationModal`, login xong tự chạy tiếp add + mở drawer (giống Udemy hiện feature để dụ đăng ký). *(vs. ẩn hết cho khách — kém conversion.)*
2. **Card catalog**: đáy card = "Xem khóa học ›" (link, chính) + **cart icon-button** (secondary, tooltip "Thêm vào giỏ") thay cho nút chữ full → hết cạnh tranh. Cả card click → detail (title underline hover).
3. **Rail detail**: giữ "Đăng ký" primary + "Thêm vào giỏ" secondary; hạ **"Học thử" → text-link** (bớt 1 nút full-width). Add xong → mở mini-cart drawer.
4. **Giữ trang /cart**: có (review sâu + URL). Drawer là lối chính.

## Map dữ liệu (đã có, không cần BE mới)
- Drawer list + giá: `myCart` + `coursesCheckoutPreview(courseIds)` (đã build) → per-line charged/list + total + `savingsVnd` + `bundleBonusPercent` + `itemCount` → thanh combo + "thêm N để giảm".
- Checkout: `openPayment({ flow: CoursesCheckout, courseIds, lines })` (y như `CartView` đang gọi).
- Empty/loading/error: `AsyncContent` trong drawer (skeleton mirror list) + empty ("Giỏ trống" + CTA duyệt khóa).

## ✅ CHỐT (thầy duyệt 2026-07-04) → chờ `/starci-fe-ux-apply`
- **Hướng A — mini-cart drawer** (right desktop / bottom mobile), tái dùng HeroUI `Drawer` + zustand overlay key mới `miniCart` + mount ở `DrawerContainer`.
- **Guest**: GIỮ cart icon + nút "Thêm vào giỏ" hiển thị cho khách (bỏ gate `!authenticated` ở `CartButton`; badge chỉ ẩn khi count 0). Bấm khi chưa login → mở `AuthenticationModal`, login xong tự chạy tiếp add-to-cart + mở drawer (lưu pending intent).
- **Nav**: cart icon luôn hiện, badge count khi >0 (giữ vị trí cạnh notification/account).
- **Add-to-cart → mở mini-cart drawer** (thay vì chỉ toast); drawer = feedback + review + combo-meter + "Thanh toán" (→ PaymentModal `CoursesCheckout`) + link "Xem giỏ đầy đủ" (→ /cart). Icon nav bấm → mở cùng drawer.
- **Card catalog**: đáy = "Xem khóa học ›" (link chính) + **cart icon-button** secondary (tooltip "Thêm vào giỏ"), bỏ nút chữ full cạnh tranh.
- **Rail detail**: giữ "Đăng ký" primary + "Thêm vào giỏ" secondary; hạ **"Học thử" → text-link**.
- **Giữ trang `/cart`** làm review sâu + shareable URL (drawer là lối chính).
- Combo-meter trong drawer đọc `coursesCheckoutPreview` (`bundleBonusPercent`/`savingsVnd`/`itemCount`) → "Đang giảm X% · thêm 1 khóa để giảm Y%".

## Widget
Đã vẽ mockup mini-cart drawer (viền hồng = đề xuất) trong chat: nav-icon + thanh combo + list + tạm tính + Thanh toán.
