# CourseCatalog (/courses) — UX brainstorm: bo góc · sort lộ trình · cart + bulk discount (2026-06-30)

> Thầy yêu cầu 3 việc trên trang danh sách khóa. Grounded từ BE (`courses` ES query, `CoursePricingService`, `LoyaltyDiscountService`) + FE (`CourseCatalog`, `CourseCard`, `PriceTag`, `PaymentModal`). Ref web: Udemy bundle + cart coupon · Coursera Plus subscription · "buy more save more" tiered.

## Grounded findings
- **#1 bo góc**: `CourseCard` grid variant (`blocks/cards/CourseCard/index.tsx:203`) KHÔNG có `rounded-*` (ăn default HeroUI); cover div (`:206`) cũng không. → thêm `rounded-3xl` card + `rounded-2xl` cover (concentric nhà). Card global giờ = shadow + no-border → hợp.
- **#2 sort**: list 100% ES-driven — `CourseCatalog` gửi `sorts: []` (`useQueryCoursesSwr`), render `payload.data` verbatim, KHÔNG reorder client. BE `SortBy` enum chỉ `Title|CreatedAt|UpdatedAt` (không `sortIndex` dù entity CÓ `sortIndex`/`orderIndex`). → **FE client-side sort** theo mảng slug curated (nhanh, 0 BE). ⚠️ FE `LANDING_TRACK_COURSE_SLUG` chỉ có 3 slug (fullstack/systemDesign/devops); **AI & LLM + Claude chưa có slug FE** → phải lấy slug thật từ DB + thêm hằng thứ tự 5 khóa.
- **#3 cart + bulk discount**: **KHÔNG tồn tại** (FE: 0 cart store/hook/UI; BE: `courseEnroll` single `courseId`, 5 provider hard-code 1 khóa). Chỉ có `LoyaltyDiscountService` (per-user: +5%/khóa-đã-mua + 5% streak, cap 30%) — không phải cart. → **net-new**. NHƯNG chi phí BE **medium** (không khổng lồ): bulk = **1 payment tổng đã-giảm** (provider chỉ charge 1 số) + webhook enroll N khóa — KHÔNG cần line-item hoá 5 provider.

## 3 hướng cơ chế giảm giá (widget đã vẽ)
| | Cơ chế | UX | BE |
|---|---|---|---|
| **A · đề xuất (đúng ý thầy)** | **Giỏ + tiered**: nút "+ Giỏ" mỗi card → cart drawer → mua càng nhiều càng giảm (2 −10% · 3 −15% · 4 −20% · 5 −25%) + nudge "thêm 1 khóa → −X%" | Cart store (zustand) + drawer + subtotal + PriceTag subtotal | **Medium**: entity order+lines · mutation `enrollBulk(courseIds:[ID!])` · pricing aggregation (base = mỗi khóa discountedVnd, bulk% trên subtotal) · **1 payment tổng** · webhook loop-enroll N |
| **B** | **Combo dựng sẵn** (Udemy-style): "Backend Pro = FS+SD −15%", "All-access 5 khóa −30%" là SKU riêng | Combo card/strip, không cart | **Nhẹ**: combo = 1 "course-like SKU" giá gộp → **reuse checkout ĐƠN** hiện có; on-success enroll các khóa trong combo |
| **C** | **Lai**: giỏ (A) + gợi ý combo ("thêm SD để −15%") | Cart + nudge | Nặng nhất (A + combo logic) |

## Chốt đề xuất
- **A** khớp nhất yêu cầu "add to cart" + BE medium (không phải làm lại 5 provider) → nếu muốn UX giỏ hàng thật thì A.
- **B** là bản **nhẹ nhất, ship nhanh nhất** (reuse checkout đơn, không cart) mà vẫn "giảm khi mua nhiều" — nếu ưu tiên tốc độ + ít rủi ro BE thì B.
- **#1 (bo góc) + #2 (sort)** = quick win, ship ngay bất kể chọn A/B/C.

## Section → data
| Phần | Data |
|---|---|
| Card | `course.{coverImageUrl,title,enrollmentCount,valuePropositions}` + `coursePricePreview(id)` (discounted/original/percent) |
| Sort | FE hằng `COURSE_ORDER = [fullstack-mastery, system-design-mastery, devops-mastery, <ai-slug>, <claude-slug>]` (lấy 2 slug mới từ DB) |
| Cart (A) | client state courseIds[] · subtotal = Σ discountedVnd · bulk% theo count · total |
| Checkout (A) | net-new `enrollBulk(courseIds)` → 1 payment tổng → webhook enroll N |
| Combo (B) | net-new bundle entity (title, courseIds[], price gộp) → reuse `courseEnroll`-style single SKU |

## Cần thầy chốt
1. **Cơ chế**: A (cart tiered) / B (combo SKU nhẹ) / C (lai)?
2. **Bậc giảm** (nếu A): 2→−10% · 3→−15% · 4→−20% · 5→−25% ok? Stack với phase/loyalty thế nào (bulk% trên subtotal-đã-loyalty, hay thay loyalty)?
3. **Sort**: FE client-sort (nhanh) hay wire `sortIndex` vào ES (đúng bài, cần BE + reindex)?

## Refs
Udemy bundles + cart coupon · Coursera Plus subscription · tiered "buy more save more" (getbridged/thecoursescout). [Udemy pricing](https://www.udemy.com/pricing/) · [Coursera pricing](https://open2study.com/coursera/pricing/).

---

# Round 2 (2026-07-02) — pagination + list/grid view toggle

Sau vòng apply thêm toggle Lưới/Danh sách + pager. Thầy feedback: (1) "pagination đâu? sửa backend", (2) "list view xem ntn mà được à" (render vỡ), (3) "image grid không rounded như line".

## Findings (grounded)
- **Pagination KHÔNG phải bug BE.** `CoursesHandler` (ES) phân trang đúng (`from/size`), `count = hits.total.value` thật, **không filter** loại khóa. Catalog có **đúng 5 khóa** → `count=5` ≤ `PAGE_SIZE=9` → 1 trang → pager ẩn (đúng, `[[list-pager-left-align-and-hover]]`). Ép hiện = giảm page size (5→4+1) = giả tạo → KHÔNG. Nếu kỳ vọng >5 khóa = content/indexing (publish + sync ES), không phải query.
- **Line view VỠ = root cause `Card.Content`.** Line bọc `<Card.Content className="flex items-center">`; `.card__content` bake `flex-direction:column` (unlayered → utility thua) → `items-center` trên column = căn giữa NGANG → thumbnail giữa trên, mọi thứ xếp dọc căn giữa (đúng screenshot). **Fix: plain `<div className="flex items-center gap-4 p-3">` trong `<Card>`** (KHÔNG Card.Content), y `FlashcardDeckList` line. Gotcha `[[elements/card]]` (HeroUI unlayered đè utility).
- **Rounding**: đã ghi ở #1 (bo góc) phía trên — áp cho CẢ 2 view: grid cover `rounded-2xl`, line thumb `rounded-xl` (concentric card `rounded-3xl`). Media luôn là hình chữ nhật bo góc.

## Hướng list-row (widget round-2 đã vẽ) — CHỐT **A**
| | Layout | Trade-off |
|---|---|---|
| **A ⭐ media-left** | ảnh trái bo góc · tên+desc 1 dòng+chip giữa (`flex-1 min-w-0`) · giá+CTA phải (`shrink-0`) | chuẩn catalog trả phí (Udemy/Coursera), giữ cover, 1 khóa=1 hàng · mirror `FlashcardDeckList` line |
| B text-first | bỏ ảnh, dày hơn | mất cover, kém "sang" |
| C media + value-props | A + chip value-prop | hàng cao, bớt list-y |

## Apply (sau duyệt)
1. `CourseCard` line: `Card.Content` → plain `<div flex items-center gap-4 p-3>` (fix bug vỡ).
2. Cover bo góc cả 2 view (grid `rounded-2xl`, line `rounded-xl`) — gộp với #1.
3. Pager: giữ ẩn-khi-1-trang (honest). KHÔNG ép page size.
4. tsc/lint + soi mắt.

## Nợ round-2 → rule
- Ghi `drafts/*`: (a) "hàng ngang trong Card → plain `<div>`, KHÔNG `Card.Content` (bake flex-col)"; (b) "pager/pagination chỉ có nghĩa khi count > pageSize — đừng ép hiện khi data ít (grounded-in-data)".
