# Decompose (audit): ContentAiChatDrawer — CÂY LÝ TƯỞNG (top-down)

> Step 1 = **vẽ cây feature nên-có**, đọc source để hiểu feature LÀM GÌ + tư duy xây app để **hoàn thiện**.
> KHÔNG đánh dấu có/thiếu/drift, KHÔNG so với port — đó là việc step sau.
> Nguồn hiểu biz: `src/components/features/learn/ContentAiChat/index.tsx` + `drawers/ContentAiChatDrawer/index.tsx`. Pull FE @ `1783ee63`.

## Feature là gì (1 câu)
Cửa sổ **hỏi-AI ngay trong bài học** — trò chuyện có ngữ cảnh (bám scope: bài/khoá/thử thách…), có lịch sử nhiều phiên, tìm được nội dung khoá, và hỏi riêng về đoạn văn bôi đen.

## Chrome chung (mọi leaf)
- **Overlay:** side-drawer phải (mobile = bottom sheet), surface vuông.
- **Header:** `Title` (tên bài/khoá) · `ModeSwitch` (rail↔drawer) · `ScopePill` (đang bám scope nào — danh tính hội thoại).

---

## CÂY

```
OVERLAY  ContentAiChatDrawer
│  header: Title · ModeSwitch · ScopePill
│
├─ LEAF 1 · Chat thường                    (đang trò chuyện, không đoạn chọn)
│  ├─ nav: HistoryLink  (→ mở Lịch sử phiên)
│  ├─ BLOCK ChatThread                     (luồng tin nhắn cuộn)
│  │    states: rỗng(hint + gợi ý theo scope) · đang-gõ(streaming) · có-tin(markdown)
│  │            · tool-result(tìm nguồn: loading/rỗng/danh sách) · quota-error(CTA nâng cấp)
│  │  ├─ DESIGN ChatBubble        (turn: user | assistant)
│  │  ├─ DESIGN ChatToolResult    (danh sách nguồn pickable + "xem tất cả")
│  │  └─ PRIMITIVE MarkdownContent · Skeleton · Button · ChipButtonList
│  └─ BLOCK ChatComposer                   (soạn câu hỏi)
│       states: idle · đang-gửi(pending) · skill-menu mở
│     ├─ DESIGN ModelPicker       (chọn model AI)
│     └─ PRIMITIVE input · Button(tìm nguồn · gửi)
│
├─ LEAF 2 · Chat bôi đen                   (hỏi riêng đoạn văn đã chọn)
│  ├─ nav: HistoryLink
│  ├─ BLOCK SelectionBanner                (ghim đoạn trích + note "lưu riêng")
│  │    states: có-đoạn (tĩnh, có nút bỏ chọn)
│  ├─ BLOCK ChatThread                     (như Leaf 1)
│  └─ BLOCK ChatComposer  (mode selection)  input dời vào hộp quick-ask + chip gợi ý
│
├─ LEAF 3 · Lịch sử phiên                  (đổi/quản lý cuộc trò chuyện)
│  ├─ nav: BackLink  (→ về Chat)
│  └─ BLOCK ConversationList
│       states: loading(skeleton) · rỗng · danh sách · đổi-tên inline
│               · tìm-kiếm · bật "hiện đã lưu trữ" · cuộn-vô-hạn
│     ├─ DESIGN ConversationRow   (tên · nguồn·số lượt · menu ⋯: đổi tên/lưu trữ/xoá)
│     └─ PRIMITIVE SearchBar · Switch · Button(+ tạo mới)
│
├─ LEAF 4 · Tìm nội dung khoá              (RAG tìm bài/thẻ/thử thách để chèn ngữ cảnh)
│  ├─ nav: BackLink
│  └─ BLOCK ContentSearchList
│       states: chờ-nhập(hint) · loading · rỗng · kết-quả
│     ├─ DESIGN EntityResultRow   (bài/flashcard/challenge — chip loại · snippet · khoá)
│     └─ PRIMITIVE SearchBar
│
└─ LEAF 5 · Cài đặt AI  ★HOÀN THIỆN        (biz mới khai `view:"settings"` nhưng chưa dựng)
   ├─ nav: BackLink
   └─ BLOCK AiSettingsPanel
        states: loading · có-data · đang-lưu
      ├─ DESIGN ModelDefaultRow  (model mặc định cho chat · toggle premium)
      ├─ DESIGN MemoryToggleRow  (bật/tắt nhớ hội thoại làm ngữ cảnh)
      └─ PRIMITIVE SettingToggleRow · Button(lưu)
```

---

## Ghi chú tư duy xây app (chỗ em HOÀN THIỆN, không chỉ chép code)
1. **Leaf 5 "Cài đặt AI"** — source đã khai `PanelView "settings"` + `useQueryMyAiSettingsSwr` (canPremium) nhưng **chưa có màn**. Feature đang nửa vời: người dùng đổi model per-message ở composer nhưng không có nơi đặt **mặc định**. Cây lý tưởng nên có leaf này (BackLink · no composer — cùng họ list-leaf).
2. **State đầy đủ cho mỗi block** — ví dụ `ContentSearchList` phải có `chờ-nhập(hint)` tách khỏi `rỗng(không thấy)`; `ChatThread` phải tách `streaming` khỏi `có-tin`. Vẽ đủ để step dựng không sót state.
3. **`ConversationRow` tách thành DESIGN riêng** — hàng phiên có menu ⋯ + inline-rename + nguồn/số lượt = một mẩu dữ liệu có vai, không nên để `ConversationList` tự vẽ hàng trong thân (§6c: 1 mẩu dữ liệu = design).

## Câu hỏi chờ thầy trước khi qua step sau
- Leaf 5 (Cài đặt AI) — em **thêm vào cây** đúng ý thầy chứ, hay để feature dừng ở 4 leaf?
- Có leaf nào thầy thấy còn thiếu trong tư duy hoàn thiện không (vd "chia sẻ hội thoại", "xoá cả lịch sử")?
