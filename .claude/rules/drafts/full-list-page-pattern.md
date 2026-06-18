# Draft: trang "list đầy đủ" (bookmark/feed/history) — pattern chuẩn

**File-§ đích:** `main.md` (mindset trang list / settings sub-page) — chọn khi `/merge`.

**Bài học (2026-06-17):** trang "Đã lưu" chỉ có `<h2>` trần + list card to + fetch chốt 20 (không xem hết) +
không search. Thầy: "header + breadcrumbs; render sao XEM HẾT; ít ra có thanh search".

**Luật mới — trang hiển thị 1 danh sách đầy đủ (bookmark, feed, lịch sử, submissions…):**
- **Chrome nhất quán sibling**: `Breadcrumbs` (Trang chủ › Hồ sơ › <trang>) + block **`PageHeader`** (title +
  description = **count**, vd "{n} mục đã lưu"). KHÔNG `<Typography h2>` trần.
- **Xem HẾT = `useSWRInfinite` + `InfiniteScrollSentinel`** (BE phải nhận `skip/take`|cursor; FE truyền vào —
  ĐỪNG để fetch chốt mặc định 20 rồi không phân trang). `hasMore` = `loaded < count`.
- **Search**: ít nhất 1 ô `Input` lọc client-side (title/description) trên tập đã tải. Nhiều dữ liệu thật sự →
  server-search (BE việc sau). Khi search 0 match → `EmptyContent` riêng (khác empty "chưa có gì").
- **Hàng GỌN, không card to**: title `body-sm` + desc 1 dòng (`truncate`/line-clamp-1) + meta inline → nhiều
  mục/màn hình, dễ lướt. Card 2 dòng desc = tốn chỗ, khó "xem hết".
- Container tự đọc SWR + giữ search-state local (UI ephemeral, KHÔNG prop-drill). Gộp toolbar+list vào container,
  bỏ sub-list dư (tránh 2 hook/2 nguồn count).

**Đã áp:** `Bookmarks/index.tsx` (PageHeader+breadcrumb+count+search+infinite+sentinel), `BookmarkCard` gọn,
hook `useQuerySavedContentsInfiniteSwr`. Xoá `BookmarksList`/`BookmarksSkeleton`/`constants` (dead). BE `savedContents`
đã sẵn `skip/take`+`count` → KHÔNG cần đụng. (Nợ: `useQuerySavedContentsSwr` cũ giờ orphan — xoá khi tiện.)
