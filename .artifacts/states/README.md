# states/ — snapshot hiện trạng UI

Ảnh chụp component + story của app, do **`starci-fe-sync` GIỮ ĐỘC QUYỀN** —
skill khác chỉ ĐỌC, không ghi (kể cả build/apply: xong việc đẩy story `news`,
đợi lần sync kế ghi lại).

## File

- `snapshot.json` — trạng thái đầy đủ tại commit `lastSyncCommit`:
  `components` (block thật trong src) · `stories` (story hiện có) · `holes`
  (component thiếu story / story drift). fe-sync dùng `git diff <lastSyncCommit>..HEAD`
  để cập nhật **incremental** — khỏi rescan cả `src/`.
- `diff.md` — nhật ký **append-only**, mỗi lần sync thêm 1 section
  (ngày · commit range · gì thêm/đổi/xóa). Brainstorm đọc file này để biết
  UI vừa đổi gì mà không cần đọc snapshot to.

## Luật

- KHÔNG sửa tay 2 file này; sai lệch → chạy lại `starci-fe-sync`.
- `diff.md` chỉ APPEND, không rewrite lịch sử.
