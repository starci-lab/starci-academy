# GlobalSearchModal — course result: icon + real price + CTA · UX-BRAINSTORM (2026-07-02)

> Follow-up brainstorm (KHÔNG code). Thầy chỉ 1 ảnh: search "Claude", 2 course hit hiện ra
> chỉ có title + 1 dòng snippet trong đó tình cờ có chuỗi số trông như giá ("10.625đ") — không
> icon, không giá thật, không CTA. Kiến trúc lõi (command palette, footer key-hints, popular
> fallback) đã CHỐT ở `UX-BRAINSTORM.md` (2026-06-24); icon-per-kind + empty-state fallback đã
> CHỐT nhưng CHƯA build ở `ICON-AND-EMPTY-STATE-UX-BRAINSTORM.md` (2026-06-29). Bài này GỘP 2
> việc: (1) áp nốt hướng B đã chốt trước đó, (2) thêm giá thật + CTA cho riêng course row.

## Xác minh gốc (không đoán — đã đọc source FE+BE)

1. **"10.625đ" KHÔNG phải trường giá** — `CourseGlobalSearchService` (BE, Elasticsearch) chỉ
   `_source: ["id", "displayId", "title", "description"]` và trả `texts` = snippet highlight từ
   `title`/`description`. Con số đó là TÌNH CỜ nằm trong text mô tả, không do 1 field `price` nào
   sinh ra. `AutocompleteGlobalSearchItem` (FE type) xác nhận: chỉ có
   `id · displayId · title · texts · parentPath · path` — **0 field thương mại** (không giá,
   không ảnh cover, không kind marker).
2. **Row hiện tại = text thuần, 0 affordance thị giác** (`GlobalSearchContentBlock`): 1
   `ListBox.Item` chỉ có `title` (`text-sm`) + list `texts` (`text-xs text-muted`). Không icon,
   không button, không hint — cả hàng chỉ ngầm định "bấm vào thì đi tới" (đúng, `onItemPress` →
   `router.push(item.path)`), nhưng **không nhìn ra được** là bấm được cho tới khi hover.
3. **Icon-per-kind đã CHỐT nhưng CHƯA code** (doc 2026-06-29): 8 kind thật (course/module/
   content/challenge/flashcardDeck/milestone/milestoneTask/foundation), map icon phosphor sẵn.
   Bài này THỪA KẾ đúng map đó, không vẽ lại.
4. **`PriceTag`** (`blocks/commerce/PriceTag`) đã là NGUỒN DUY NHẤT render giá toàn app
   (modal thanh toán, paywall, rail pricing) — props `discounted/original?/currency?/size?/
   breakdown?`. Đây là block PHẢI dùng lại, không tự vẽ giá lần nữa (ref
   [[concepts/single-source-render]]).
5. **PaymentModal là zustand overlay TOÀN CỤC** (`usePaymentOverlayState().open({flow})`) NHƯNG
   `CoursePaymentContext` **KHÔNG nhận `courseId`** — nó tự đọc course đang xem từ course-detail
   page (Redux). Nghĩa là: **hiện tại KHÔNG THỂ mở PaymentModal thẳng từ 1 hàng kết quả search**
   (search modal không phải course-detail page, không có course Redux state) mà không refactor
   `CoursePaymentContext` để nhận `courseId` tường minh. Đây là ranh giới kỹ thuật thật, không
   phải e ngại — quyết định CTA phải tôn trọng nó (xem §Hướng).
6. **CTA "mua" toàn app đã có ĐÚNG 1 lối vào chuẩn:** mọi bề mặt khám phá khóa (catalog card,
   landing) đều chỉ có nút **"Xem khóa" (Link + `CaretRightIcon`, KHÔNG phải nút mua)** → điều
   hướng tới CourseDetail; enroll/thanh toán thật chỉ xảy ra ở `CourseCtaButtons` trên trang chi
   tiết khóa (nơi mở PaymentModal). "Mua" luôn có ĐÚNG 1 cửa ngõ — search không nên tự chế 1 cửa
   thứ hai (vỡ single-source-of-truth của luồng thanh toán).

## Mục tiêu (≤30s)
Gõ tên khóa vào search → **thấy giá thật NGAY** (không đợi mở trang chi tiết) + biết chắc **bấm
vào là đi mua được** (không mơ hồ "đây có phải link không"). Các loại kết quả KHÁC (module/
lesson/challenge…) không phải đối tượng bán được → không nhồi giá/CTA vào chúng.

## ĐÍNH CHÍNH 2026-07-02 (thầy: *"nhưng nội dung free trong khóa thì sao"*) — bỏ live-price, chuyển sang STATE-AWARE + FREE-CONTENT-FIRST

Đọc kỹ code (2 explore agent FE+BE) phát hiện 3 sự thật làm SAI hướng "nút mua" ban đầu:
1. **Per-content `isPremium`** (`ContentEntity.isPremium`, default false) — 1 khóa TRẢ PHÍ vẫn có
   thể có **bài free** (`isPremium=false`), vào học được **KHÔNG cần enroll** (trial-preview,
   [[trial-preview-enrollment-optional]]). → gắn "Mua ngay" lên 1 bài free = SAI bản chất.
2. **CTA course toàn app branch theo `isEnrolled`, KHÔNG theo giá** (`CourseCtaButtons`):
   enrolled → "Tiếp tục học" (→ /learn/content) · chưa enroll → primary "Đăng ký" (PaymentModal)
   + secondary **"Học thử"** (`startTrial` → vào thẳng nội dung free). Đây LÀ phễu chuyển đổi thật:
   nếm free → mua ở trang chi tiết.
3. **Không có `isFree` flag** — free = `originalPrice` 0/null. `PriceTag` KHÔNG tự render "Miễn
   phí" (caller phải tự bỏ block khi giá 0). Và **live-price trong search = N+1 + dễ stale** (giá
   đổi theo phase/loyalty; BE chưa có batch method) → **loại live-price khỏi search**.

→ **"Hỗ trợ mua khóa" làm ĐÚNG = giảm ma sát tới lần-nếm-đầu-tiên + phơi rõ trạng thái, KHÔNG
nhồi nút mua vào dropdown.** Chip trạng thái (Free/Đã đăng ký) là THÔNG TIN MỚI giúp quyết định;
"mua" thật vẫn ở trang chi tiết (single-source phễu thanh toán).

## Hướng CHỐT (đã vẽ 2 widget, thầy duyệt "xúc")
- **Course row:** icon `GraduationCapIcon` + title + **chip trạng thái** + trailing CTA (hint thị
  giác, cả row vẫn là 1 target nav qua `item.path`):
  - `isEnrolled` → chip "Đã đăng ký" (success) · CTA khớp đích thật của `coursePath`.
  - chưa enroll + `isFree` → chip "Miễn phí" (success) · CTA "Học ngay".
  - chưa enroll + trả phí → KHÔNG chip (vắng = trả phí) · CTA "Học thử".
- **Content (lesson) row:** icon `FileTextIcon` + title + course cha:
  - `isPremium=false` → chip "Miễn phí" (success), vào thẳng.
  - `isPremium=true` + guest/chưa enroll → **1 icon khóa** (`LockIcon` muted,
    [[status-icon-overrides-base]]) — KHÔNG nút mua lạc chỗ.
- **Kind khác** (module/challenge/flashcardDeck/milestone/milestoneTask/foundation): CHỈ icon.
- **KHÔNG live-price** trong search (tránh N+1/stale). Giá đầy đủ vẫn ở CourseCard/trang chi tiết.

**BE enrich (batch, không re-index ES, không N+1):** thread `user` qua service (đang bị DROP) →
course hits gắn `isEnrolled` (1 lần load enrolled-set cache) + `isFree` (1 query load N course
theo id) · content hits gắn `isPremium` (1 `IN` query). Guest → isEnrolled=false. Non-fatal.

## Hướng CŨ đã LOẠI (giữ hồ sơ)
| | Hướng | Vì sao loại |
|---|---|---|
| A | Chỉ thêm icon | Không giải quyết free-content vs premium, không state |
| B (cũ) | icon + `PriceTag` live-price + "Xem khóa" | Live-price N+1/stale + coi mọi course là "để mua", bỏ qua free lesson + enrolled state |

## Vì sao KHÔNG mở PaymentModal thẳng từ search (đã cân nhắc, loại)
Về mặt kỹ thuật làm được (PaymentModal vốn là overlay toàn cục) nhưng **phải sửa
`CoursePaymentContext` để nhận `courseId` tường minh** — một thay đổi kiến trúc thật (không chỉ
UI), và tạo ra **cửa mua thứ 2** song song với `CourseCtaButtons`, dễ lệch (giá/enroll-state/gói
phải đồng bộ 2 nơi). "Hỗ trợ mua khóa" ở đây nên hiểu là **rút ngắn đường tới quyết định mua**
(thấy giá thật ngay trong lúc gõ tìm) chứ không phải **mua ngay trong hộp search** — điều đó để
dành cho 1 lần brainstorm riêng NẾU thầy thật sự muốn (sẽ cần: courseId trong PaymentContext +
kiểm tra enrollment-state trước khi mở + xử lý trường hợp search mở giữa lúc đang ở trang khác).

## Giải phẫu row (hướng CHỐT, trong `GlobalSearchContentBlock`)
- **Mọi kind:** leading icon `size-4` theo map (course `GraduationCapIcon` · module `StackIcon` ·
  content `FileTextIcon` · challenge `PuzzlePieceIcon` · flashcardDeck `CardsIcon` · milestone
  `FlagIcon` · milestoneTask `CheckSquareIcon` · foundation `LightbulbIcon`). Block hiện KHÔNG biết
  `kind` → truyền `kind` từ `Content/index.tsx` (đã có per section) xuống.
- **Course:** title + chip trạng thái (`<Chip>` HeroUI, `bg-<token>/10 text-<token>` — [[elements/chip]])
  + trailing CTA hint (accent text + `CaretRightIcon` slide, KHÔNG nút lồng — cả row vẫn 1 target
  nav `item.path`). Label CTA khớp đích thật `item.path`. Nhánh: enrolled → "Đã đăng ký"(success)/CTA
  theo đích · free → "Miễn phí"(success)/"Học ngay" · trả phí → không chip/"Học thử".
- **Content:** title + course cha. `isPremium=false` → chip "Miễn phí"(success). `isPremium=true` +
  guest/chưa enroll → trailing `LockIcon` muted ([[status-icon-overrides-base]]), KHÔNG nút mua.
- **Kind khác:** chỉ icon.
- **KHÔNG `PriceTag`/live-price** trong search.

## Data thêm (BE, batch, KHÔNG re-index ES, KHÔNG N+1)
- Thread `user` qua `AutocompleteGlobalSearchService.execute` (đang bị DROP dù resolver có sẵn).
- Course hits: `isEnrolled` (load enrolled-course-set cache 1 lần, test N id — `checkEnrollment`
  đã cache set/user) + `isFree` (1 query load N course theo id → derive từ `originalPrice`/
  `pricingPhases`, không có cột `isFree`). Guest → isEnrolled=false.
- Content hits: `isPremium` (1 `IN` query, `ContentEntity.isPremium`).
- Field mới nullable ([[envelope-response-data-must-be-nullable]]); enrich non-fatal (lỗi → trả
  item không field mới, không vỡ search).
- FE type `AutocompleteGlobalSearchItem` + query selection set thêm `isEnrolled?/isFree?/isPremium?`.

## Kèm theo (đã chốt 2026-06-29, chưa build)
- Section `foundation` thiếu ở `Content/index.tsx` (BE đã trả `foundations`) → thêm.
- Gỡ `"LessonVideoEntity"` chết khỏi `DEFAULT_ENTITIES` (FE hook — entity không tồn tại ở BE).
- No-results (`Content/Empty`): giữ dòng "Không tìm thấy" nhưng fall-through xuống Popular list
  (không dead-end).

## Vì sao KHÔNG mở PaymentModal thẳng từ search (loại)
`CoursePaymentContext` KHÔNG nhận `courseId` (tự đọc course đang xem ở trang chi tiết). Mở thẳng =
phải refactor context + tạo cửa mua thứ 2 song song `CourseCtaButtons` (dễ lệch state/giá). "Hỗ trợ
mua" = giảm ma sát tới lần-nếm-đầu (Học thử / bài free) + phơi state; "mua" thật ở trang chi tiết.

## Refs
- `CourseCtaButtons` (state-aware CTA nguồn) · `CourseCard` (affordance "Xem khóa" Link+Caret) ·
  `startTrial` (phễu học thử) · [[trial-preview-enrollment-optional]] · [[status-icon-overrides-base]].
- Kế thừa 2026-06-24/06-29 (Algolia DocSearch · Linear/GitHub/Raycast cmd-k · HeroUI Kbd docs).

## CHỐT UI 2026-07-02 (thầy duyệt mockup full-modal + 2 câu hỏi)
- **Course CTA = "Xem khóa" (`courses.viewCourse`) cho MỌI trạng thái** → tới trang chi tiết (nơi
  có "Đăng ký" + "Học thử"). Lý do: `item.path` là 1 URL cố định (không đổi theo enroll) → 1 label
  khớp đúng đích là chuẩn nhất; KHÔNG label theo-state (sẽ lệch đích). **Trạng thái để CHIP gánh:**
  enrolled → "Đã đăng ký"(success) · free → "Miễn phí"(success) · trả phí → không chip. (Đính chính
  mockup vòng 1 vẽ "Học thử/Tiếp tục học/Học ngay" — thầy chọn thống nhất "Xem khóa".)
- **Bài premium chưa enroll = icon khóa** (`LockIcon` muted, status hint), KHÔNG ẩn khỏi kết quả
  (giữ để user biết khóa dạy gì) — [[status-icon-overrides-base]].

## Trạng thái
Thầy duyệt "xúc" 2026-07-02 → build qua workflow `global-search-course-cta` (BE enrich → FE
rows/chip/CTA + query + foundation/empty fixes → verify). Không migration DB. Sau workflow: gộp
course CTA về "Xem khóa" thống nhất (nếu agent build label theo-state).
