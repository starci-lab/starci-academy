# UX Brainstorm — "Đã lưu" / Bookmarks page

> Scope: trang `/profile/bookmarks` (`Bookmarks/index.tsx` → `BookmarksList` → `BookmarkCard`). Thầy:
> *"để ý header và breadcrumbs; render sao để XEM HẾT được; ít ra cũng có thanh search."* KHÔNG code.

## Hiện trạng (grounded)
- Chrome: `max-w-4xl p-6` + **plain `<Typography type="h2">` "Đã lưu"** — KHÔNG breadcrumb, KHÔNG `PageHeader`,
  KHÔNG count, KHÔNG search. (Lệch với sibling: EditProfile dùng `Breadcrumbs` + block `PageHeader{title,description,breadcrumb,actions}`.)
- List: `BookmarksList` → `BookmarkCard` (PressableCard to, full-width: title h5 + desc 2 dòng + "N phút đọc" + challenge count + arrow), `gap-3` dọc.
- Data: `useQuerySavedContentsSwr()` → `savedContents(request:{})` trả `{ contents, count }`. Field/item:
  `id, displayId, title, description, minutesRead, isPremium, challenges[].id`.
- **CHẶN "xem hết": BE mặc định `skip=0, take=20`, FE gửi `{}` + KHÔNG phân trang** → chỉ 20 mục hiện ra, quá 20 KHÔNG tới được. Đây là lỗi chính của "xem hết".
- Empty: `AsyncContent` + `EmptyContent`. Search: chưa có block filter inline (có `InputButtonLike` cho modal; inline thì dùng HeroUI `Input` + filter).

## Mục tiêu trang
Kho "đã lưu để học sau" → user phải **TÌM nhanh** + **DUYỆT hết** + **mở** đúng bài. Ưu tiên: tìm (search) > duyệt hết (density + load-all) > nhất quán chrome (header/breadcrumb như sibling).

## IA mới
1. **Breadcrumbs** (Trang chủ › Hồ sơ › Đã lưu) + **`PageHeader`** title "Đã lưu" + description = "**N mục đã lưu**" (dùng `count`).
2. **Toolbar**: ô **Search** (lọc theo title/description) + (tuỳ) sort "Mới lưu / Thời lượng" + (tuỳ) filter type/premium.
3. **List xem-hết**: hàng **gọn** (dày hơn card to) + **infinite scroll** (tải hết, không kẹt 20).
4. States: loading=skeleton mirror hàng gọn · empty=EmptyContent + CTA "Khám phá khoá học" · error=retry.

## Hướng (≥3)

### Hướng A ⭐ — Library: header + search toolbar + hàng gọn + infinite scroll
- Header/breadcrumb như sibling (`PageHeader`+`Breadcrumbs`) + count.
- **Search inline** (HeroUI `Input`, icon kính lúp) lọc **client-side** theo title/desc trên tập đã tải (đủ cho vài chục mục; nhiều hơn → server-search, BE việc sau).
- Card → **hàng gọn** (title + meta inline `phút đọc · N challenge · chip Premium` + arrow), bỏ desc 2 dòng (hoặc 1 dòng) → **nhiều mục/màn hình**, dễ lướt.
- **Infinite scroll** = `useSWRInfinite` + sentinel (đúng rule async §infinite) → **xem HẾT**. **Cần BE**: `savedContents(request)` nhận `skip/take` (hoặc cursor) và FE truyền vào (hiện FE gửi `{}`).
- ✅ Trả lời đủ 3 ý thầy, ít field mới nhất; ⚠️ cần BE mở phân trang (đừng fake).

### Hướng B — Grid card 2–3 cột + search
- Cùng header+search, nhưng render **grid card** (2 cột desktop) cho "xem nhiều hơn/màn hình".
- ✅ Trực quan; ⚠️ card vẫn tốn chỗ, text-heavy lướt kém hơn list; vẫn cần phân trang để xem hết.

### Hướng C — Gom theo khoá/module (collapsible) + search
- Group bookmark theo **khoá/module cha** (như tab Challenges gom theo course), mỗi nhóm gập được.
- ✅ Có tổ chức; ⚠️ **cần field `module`/courseTitle per item** (query `savedContents` CHƯA trả → BE thêm), nặng hơn.

## CHỐT: Hướng A
Đáp thẳng 3 yêu cầu (header+breadcrumb · search · xem-hết) với chi phí dữ liệu thấp nhất. Density (hàng gọn) +
infinite scroll trị "không xem hết được"; search client-side trị "tìm". Nâng cấp dần: server-search + sort-by-saved
+ group-by-course khi cần.

## Section → dữ liệu BE/DB (+ khoảng trống)
| Phần | Field/nguồn | Trạng thái |
|---|---|---|
| Count header | `data.count` | ✅ có |
| Search (title/desc) | `title`, `description` (client filter) | ✅ có (server-search = BE sau) |
| Hàng gọn | `title`, `minutesRead`, `challenges.length`, `isPremium` | ✅ có |
| Mở bài | `displayId` → route content | ✅ có |
| **Infinite scroll** | `savedContents(request:{skip,take})` + FE `useSWRInfinite` | ⚠️ **CẦN BE mở param** (FE đang gửi `{}`, BE chốt take=20) |
| Sort "Mới lưu" | `user_contents.created_at` (savedAt) | ⚠️ BE chưa trả → thêm nếu cần sort |
| Group theo khoá (Hướng C) | `module`/courseTitle per content | ⚠️ BE chưa trả |

## Cắt / thêm
- **Thêm**: Breadcrumbs, PageHeader+count, thanh Search, infinite scroll, hàng gọn.
- **Cắt/giảm**: card to 2 dòng desc → hàng gọn 1 dòng (đỡ chiếm chỗ). Bỏ `max-w-4xl` quá hẹp nếu cần list rộng hơn.
- Hàng = pressable **Link** (điều hướng) theo rule nav-item (drafts/nav-item-link-not-listbox), chỉ active/hover nhẹ.

## States / a11y
- Loading: skeleton MIRROR hàng gọn (`Skeleton.ListRow` ×N). Empty: `EmptyContent` "Chưa lưu gì" + CTA. Error: retry `mutate`.
- Search `Input` có `aria-label`; danh sách role=list; sentinel infinite có `disabled` khi hết trang / đang tải.

---
*→ Thầy duyệt → `/ux-apply`. **Phụ thuộc BE**: muốn "xem hết" thật phải mở `savedContents(skip/take|cursor)` — trò nêu rõ
sẽ cần đụng BE, không fake. Nếu chốt A, trò ghi draft rule "list trang đầy đủ (bookmark/feed/history) = header+breadcrumb
sibling + search + infinite scroll + hàng gọn".*
