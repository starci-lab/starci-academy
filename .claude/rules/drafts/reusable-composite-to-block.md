# Draft: UI composite xài-chung → tách thành BLOCK (thầy chốt 2026-06-18)

**File-§ đích:** `main.md` §kiến-trúc 4 tầng (Blocks) — chọn khi `/merge`.

**Bài học:** làm reaction trên feed, thầy chốt "mấy cái này xài chung trong block nhé — trong quá trình làm thấy
cái nào xài chung được gom vào block". (Vd composite avatar + badge activity = `ActivityAvatar` đã là block sẵn.)

**Luật mới:**
- **Trong lúc build feature, hễ thấy 1 cụm UI dùng ≥2 nơi (hoặc rõ ràng sẽ tái dùng) → TÁCH ngay thành BLOCK**
  (`components/blocks/<category>/<Block>`), props-only, own style. ĐỪNG để inline lặp ở feature.
  Ví dụ đã có: `ActivityAvatar` (avatar + icon-badge), `FeedItem` (row + slot footer), `ReactionBar` (đếm + picker
  6 cảm xúc), `SegmentBar`, `StatStrip`, `InfiniteScrollSentinel`.
- **Block tự giữ state UI ephemeral nội bộ** (vd picker mở/đóng của ReactionBar) — vẫn props-only về DATA (KHÔNG
  store/SWR); hành động (react/navigate) nhận qua **callback prop** (`onReact`, `onResolve`), feature mới gọi mutation.
- **Block KHÔNG nhúng i18n** → text/nhãn truyền từ feature; nếu cần "không phụ thuộc i18n" thì dùng icon/emoji/số
  (vd ReactionBar dùng emoji + số, không chữ).
- Mở rộng block cũ bằng **slot optional** (vd `FeedItem.footer`) thay vì tạo bản sao.

**Đã áp:** feature activity-reaction — `ReactionBar` (block mới), `FeedItem.footer` (slot), `ActivityFeed` nhận
`onReact` + auto read-only khi `item.isMine` (không react chính mình). Cùng 1 `ActivityFeed` chạy 2 nơi (dashboard
feed active + profile activity read-only-nếu-own).
