# proposals/ — hàng đợi CHỐT → BUILD

Proposal = spec đã CHỐT với thầy sau brainstorm, chờ 1 phiên apply riêng dựng.
`BACKLOG.md` là bảng hàng đợi duy nhất — mọi proposal PHẢI có 1 dòng ở đó.

## Vòng đời

1. Brainstorm chốt với thầy → ghi `<feature-slug>.proposal.md` + thêm dòng `⏳ PENDING` vào `BACKLOG.md`.
2. Apply skill đọc proposal → dựng code → đẩy story `news` "Chờ duyệt" lên Storybook.
3. Apply xong → flip dòng backlog thành `✅ DONE` (không xóa dòng — backlog là sử ký).
4. Proposal hủy/thay thế → `❌ DROPPED` kèm lý do ngắn trong cột tóm tắt.

## Quy ước

- 1 proposal = 1 file `<feature-slug>.proposal.md`, slug trùng concept nếu có.
- Proposal chứa: flow · shell per surface · zones · state matrix · block briefs ·
  files-to-touch · verify plan (theo format của brainstorm skill).
- Apply có thể chạy KHÁC phiên với brainstorm — backlog là điểm bàn giao.
