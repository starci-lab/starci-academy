# GlobalSearchModal — icon + empty-state polish · UX-BRAINSTORM (2026-06-29)

> Follow-up brainstorm (KHÔNG code). Kiến trúc lõi (command palette hướng B: flat grouped list,
> keyboard nav, footer key-hints, popular-on-idle) **đã CHỐT + đã build** — xem `UX-BRAINSTORM.md`
> (2026-06-24) cùng thư mục. Bài này chỉ polish tiếp 2 điểm thầy vừa chỉ ra qua ảnh so sánh.

## Vấn đề (từ 2 ảnh thầy gửi)
1. **Ảnh HeroUI docs search** (heroui.com Kbd page, Cmd-K palette): mọi item đều có **icon leading** phân loại
   (Introduction/Quick Start/Design Principles/Colors/Theming — mỗi cái 1 icon khác) → quét cực nhanh.
2. **Ảnh StarCi hiện tại**: gõ "aas" (garbage 3 ký tự) → **"Không tìm thấy kết quả."** trơ trọi, không có gì khác.

## Xác minh gốc (không đoán)
- `fuzziness: AUTO` (Elasticsearch) trên field title: query 3 ký tự → edit-distance cho phép = 1. "aas" không
  khớp bất kỳ token thật nào trong index (course/module/challenge/...) → **0 hit là hành vi ĐÚNG**, không phải bug
  relevance. Vấn đề thật nằm ở **UI khi rỗng**, không phải engine tìm kiếm.
- Đã đọc `AutocompleteGlobalSearchService` (BE): **8 kind** thật — `course · module · content · challenge ·
  flashcardDeck · milestone · milestoneTask · foundation`.
- **Phát hiện 2 gap kỹ thuật (grounded, không phải suy đoán):**
  1. BE đã trả bucket `foundations` (đã wire đủ ở service + entity) nhưng **FE `Content/index.tsx` không liệt kê
     section `foundation`** → bucket này vô hình dù BE có data.
  2. FE `useAutocompleteGlobalSearchSwr.ts` `DEFAULT_ENTITIES` request **`"LessonVideoEntity"`** — entity này
     **KHÔNG tồn tại** trong BE `DEFAULT_ENTITIES` (Course/Module/Challenge/Content/FlashcardDeck/Milestone/
     MilestoneTask/Foundation) → request chết, không trả gì, chỉ tốn 1 dòng.

## Mục tiêu (≤30s)
Khi search KHÔNG khớp (garbage query / typo nặng), user KHÔNG được đứng ngõ cụt — phải luôn có lối đi tiếp. Khi
search CÓ khớp, phải phân biệt LOẠI kết quả (course vs challenge vs flashcard...) trong <1s bằng mắt.

## 3 hướng (đã vẽ widget)
| | Hướng | Việc | Trade-off |
|---|---|---|---|
| — | **Hiện tại** | Chỉ text, không icon; rỗng = dead-end | Baseline, đang là pain |
| A | **Chỉ thêm icon** | Leading icon theo `kind` trên mọi row (kết quả thật + popular) | Quét nhanh hơn ngay, nhưng KHÔNG giải quyết ngõ-cụt |
| **B ✅** | **Icon + luôn có lối ra** | A + khi 0 kết quả: giữ dòng "Không tìm thấy X" nhưng **fallback NGAY xuống "Danh mục phổ biến"** (tái dùng đúng list Popular đang có ở nhánh idle) | Cần sửa `GlobalSearchEmpty` (bỏ early-return chặn fallback ở nhánh có-query); KHÔNG cần BE mới |

**Chốt B** — đúng tinh thần ảnh HeroUI thầy chỉ (dù gõ gì, palette vẫn luôn có sẵn quick-nav hữu ích), và tận
dụng đúng data + component đã có (`useQueryRecommendedCoursesSwr`, `ListBox` pattern trong `GlobalSearchEmpty`).

## Icon map (grounded — 8 kind thật, phosphor, size-4 khớp `FlameIcon` hiện có trong `Empty/index.tsx`)
| kind | icon phosphor | lý do |
|---|---|---|
| course | `GraduationCapIcon` | motif khóa học đã dùng nơi khác trong hệ |
| module | `StackIcon` | 1 module = 1 lớp trong chồng nội dung |
| content | `FileTextIcon` | bài đọc |
| challenge | `PuzzlePieceIcon` | motif challenge đã chốt (ref item-card-meta rule) |
| flashcardDeck | `CardsIcon` | bộ thẻ |
| milestone | `FlagIcon` | cột mốc capstone |
| milestoneTask | `CheckSquareIcon` | task trong capstone |
| foundation | `LightbulbIcon` | tài liệu nền tảng |

**Vai trò icon ở đây KHÁC** luật "bỏ icon eyebrow câm" ([[challenge-section-labeledcard-quiet-eyebrow-icon-once]]):
đó là icon TRANG TRÍ tĩnh trên 1 label; đây là icon **PHÂN LOẠI bắt buộc** trong 1 danh sách HỖN HỢP nhiều kind —
không có nó thì không phân biệt được course với milestoneTask khi đọc lướt. Giữ `size-4` (khớp `FlameIcon` sẵn có
trong `Empty/index.tsx`, không đổi cỡ hệ thống).

## Cắt / Thêm
- **Thêm:** icon leading theo `kind` ở `GlobalSearchContentBlock` (mỗi bucket đã biết `kind` từ `Content/index.tsx`
  section, truyền xuống Block) + `GlobalSearchEmpty` (đã có FlameIcon cho Popular, giữ nguyên).
- **Sửa hành vi rỗng:** `GlobalSearchEmpty` nhánh `hasQuery` hiện `return` sớm chỉ với text → đổi thành: hiện
  dòng "Không tìm thấy X" **rồi fall-through** xuống render CÙNG khối Popular (không return sớm nữa).
- **Fix gap data (đi kèm, nhỏ):** thêm section `foundation` vào `Content/index.tsx` (BE đã trả) + bỏ
  `"LessonVideoEntity"` khỏi `DEFAULT_ENTITIES` của `useAutocompleteGlobalSearchSwr.ts` (entity không tồn tại BE).

## Section → data (không đổi so với brainstorm 2026-06-24, chỉ thêm foundation)
| Section | Nguồn |
|---|---|
| 8 bucket kết quả (thêm `foundation`) | `autocompleteGlobalSearch` (ES fuzzy, đã có) |
| Popular fallback (idle VÀ no-results) | `useQueryRecommendedCoursesSwr` (đã có, chỉ đổi ĐIỀU KIỆN render) |
| Icon theo kind | hằng số FE mới (không cần BE) |

## Refs
- Ảnh HeroUI Kbd/search palette (thầy cung cấp) — icon-led curated list, không bao giờ "trơ".
- Kế thừa refs đã cite trong brainstorm 2026-06-24: Algolia DocSearch · Linear cmd-k · GitHub cmd-k · Raycast.

## Bước sau
Thầy duyệt hướng B → `/starci-fe-ux-apply` (or trò code trực tiếp nếu thầy chốt luôn trong chat).
