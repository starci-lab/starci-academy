# Accordion / edge-list trong card → card BỎ padding (2026-06-18)

- File/§ đích khi `/merge`: `starci-card.md` (LabeledCard) + `main.md` §14 (double-padding heuristic).
- Bài học: curriculum/FAQ render `Accordion` BÊN TRONG `LabeledCard` (card có padding) → accordion tự có mép +
  divider riêng, cộng padding card = lệch nhịp + double-pad, item không tràn sát mép.

## Luật (STRICT)
- **Component tự sở hữu mép/divider (Accordion, Table, list có Separator full-width, ScrollShadow) đặt trong card
  → card phải KHÔNG padding** để nó tràn sát mép. Với `LabeledCard` = truyền `contentClassName="p-0"` (hoặc dùng
  biến thể no-pad), KHÔNG để `CardContent` pad mặc định đè lên.
- Tổng quát hoá heuristic "container tự pad rồi → đừng pad thêm" (main.md §14): áp cả CHIỀU NGƯỢC — nếu **con** đã
  tự lo padding mép (accordion/table), thì **cha** (card) nhả padding, đừng để 2 lớp pad chồng.
- Content PHẲNG thường (rows/bars/text) vẫn để card pad mặc định (`px-4 py-3`). Chỉ nhả pad khi con là edge-owning.
