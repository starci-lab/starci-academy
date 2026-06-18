# Draft — Cách render TIME của StarCi (locale-aware)  (2026-06-17)

- File/§ đích khi `/merge`: `main.md` §11 (i18n & a11y) + §14 (heuristics).
- Bài học: thầy chê `date.toLocaleString(locale)` trần ("00:43:35 18/6/2026" — có giây, ngày dài lộn xộn) +
  bỏ icon đồng hồ thừa cạnh time. Chốt format chuẩn.

## Luật (STRICT)
- **CẤM `date.toLocaleString(locale)` trần** để hiển thị (lộn xộn, có giây, thứ tự theo locale khó đoán).
- **Time tương đối** (feed/hoạt động, "vừa xong/2 giờ trước") → `getTimeAgoMessage`/`getTimeAgoLabel` (đã có),
  kèm `title=` datetime tuyệt đối. (xem `starci-feed.md`.)
- **Timestamp tuyệt đối** (sessions, "lần cuối", ngày pass…) → định dạng **`HH:mm MMM DD, YYYY`**:
  - giờ 24h `HH:mm` (pad 0, KHÔNG giây) + tháng **ngắn theo LOCALE** (`date.toLocaleString(locale,{month:"short"})`
    → "Jun" / "thg 6") + ngày pad 0 + `, YYYY`.
  - Mẫu: `` `${hh}:${mm} ${month} ${day}, ${y}` `` (Sessions `formatSeen`). Locale chỉ áp cho TÊN THÁNG, thứ tự
    field giữ cố định để đồng nhất.
- **KHÔNG kèm icon đồng hồ** cạnh timestamp (thừa, rối) — chữ time đủ tự rõ.
- Chỉ-ngày (joined "Tháng 6 2026") → `toLocaleDateString(locale,{month,year})` (đã dùng) — vẫn locale-aware, KHÔNG raw.
- Nên gom 1 util chung (vd `formatDateTime(iso, locale)`) thay vì lặp `formatSeen` mỗi component (nợ refactor).
