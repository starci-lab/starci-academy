# Vòng 1 — 2026-07-30 — B2a (triage) + đo bổ sung leaf-level

## Triage B2a (8 agent song song, chỉ Phần A + baseline.json, không đọc source)

| Vùng | flow | prom | async | frame | naming | seam | inset | surf | text | icon | color | button | press | md | skel |
|------|------|------|-------|-------|--------|------|-------|------|------|------|-------|--------|-------|----|----- |
| R1 FlashcardModeSwitch | NGHI | NGHI | N/A | NGHI | N/A | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | N/A | NGHI | NGHI | NGHI |
| R2 QuizEnrollGate | NGHI | ĐẠT | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | ĐẠT | NGHI | NGHI |
| R3 QuizSetup | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | N/A | NGHI | NGHI |
| R4 QuizProgressPanel | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | N/A | NGHI | NGHI | NGHI |
| R5 WorkSessionHeader | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI |
| R6 QuizQuestion | NGHI | NGHI | NGHI | ĐẠT | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | ĐẠT | NGHI |
| R7 QuizRecapList | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | NGHI | N/A | NGHI | ĐẠT | NGHI |
| R8 khung page | ĐẠT | N/A | NGHI | ĐẠT | NGHI | ĐẠT | ĐẠT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ĐẠT |

95/120 ô NGHI NGỜ — cao bất thường. Nguyên nhân: `baseline.json` (B0) chỉ chụp `rect`+`computed` của
NÚT NGOÀI CÙNG mỗi vùng, không chụp từng phần tử con (Typography/Button/Chip riêng lẻ) — nên phần lớn
agent B2a không đủ dữ liệu để trả lời câu hỏi cây của các trục cần biết size/color/weight TỪNG phần
tử (`text`, `color`, `icon`, `button`, `prom`). Đẩy thẳng 95 ô vào B2b (đọc source đầy đủ) sẽ tái lập
đúng vụ ~1,7 triệu token mà kiến trúc B2a/B2b dựng ra để tránh.

**Bài học ghi vào `còn treo`:** B0 lần sau nên chụp `baseline.json` ở mức LEAF (từng `data-anat-part`
con), không chỉ mức vùng — vẫn rẻ (không đọc source), nhưng giảm hẳn tỉ lệ NGHI giả do thiếu dữ liệu.

## Đo bổ sung leaf-level (vẫn KHÔNG đọc source, chỉ đo thêm DOM con) — dùng để lọc bớt trước B2b

Đo `getComputedStyle` của từng `data-anat-part` con trong mỗi vùng (script ở cuối file). Từ đó:

### Cells có thể đóng ngay thành ĐẠT (không cần B2b nữa)

- **R3×prom, R3×button** — 6 nút chọn (Nhanh/Sâu, Junior/Middle/Senior/Staff) dùng bg xám nhạt/trong
  suốt + chữ tối (kiểu "tonal", đã chọn thì bg `oklch(0.94...)`, chưa chọn thì trong suốt); nút CTA
  "Bắt đầu · 5 câu" dùng bg đặc `oklch(0.7003 0.2092 354.13)` (accent thật) + chữ trắng — rõ ràng khác
  hẳn cấp độ, không trùng variant với 6 nút chọn. Nghi vấn ban đầu ("6 nút chọn có thể cùng variant
  với CTA, phá trọng số hành động") **không đúng** — dữ liệu cho thấy đã phân cấp rõ.
- **R2×inset** — `FeedbackEmpty` có `padding: 24px 0px` (không phải flush) — có số thật, khớp cây
  §2 nhánh "empty-state cần thở" đã chốt trong `inset/context.md` (theo tóm tắt Phần A).
- **R4×text, R4×color** (4 hàng StatGridCard) — cả 4 hàng đều đúng một khuôn: label `12px/400/muted
  oklch(0.5517)` + value `18px/500/default oklch(0.2103)` — nhất quán tuyệt đối, không có hàng nào
  lệch khuôn hay chen accent lạ.

### Cells nâng lên nghi cụ thể / khả năng LỆCH thật — ưu tiên B2b trước 90 ô còn lại

1. **R5×color (`WorkSessionHeader`, dùng chung active+recap)** — nút "Kết thúc" (active) và "Xong"
   (recap) đều có `color: oklab(0.5533 0.14612 -0.0150227)`. Đây là giá trị **DUY NHẤT trong toàn bộ
   dữ liệu đã đo** ở định dạng `oklab(...)` — mọi màu khác trong app đều `oklch(...)`. Giống hệt kiểu
   "vendor ghi đè im lặng" mà `step-2-sweep-15-axes.md` đã cảnh báo (Select/`size-4` 2026-07-29) —
   nghi là màu hard-code (có thể copy từ công cụ chọn màu khác) chứ không qua token hệ thống. Cần
   B2b đọc source `WorkSessionHeader.tsx` xác nhận.
2. **R5×text/async (Typography thứ 3, chỉ có ở leaf `active`)** — xác nhận đây là **đồng hồ đếm
   ngược sống**: nội dung đo được là `"2:14"` (định dạng M:SS). Đây **chạm thẳng** vào mâu thuẫn TTL
   số 13 trong `domain/INDEX.md` (comment 24 giờ vs hằng số backend 60 phút). Theo luật của
   `story-create/step-1-intent.md`, **không tự chọn bên nào** — cần B2b đọc source để biết đồng hồ
   đếm từ đâu (60 phút hay 24 giờ) rồi **trình cả hai khả năng cho thầy**, không tự quyết định định
   dạng/ngưỡng hiển thị.
3. **R4×async/skel** — leaf `setup-loading` cho `StatGridCard` vẫn hiện đủ 4 hàng số liệu **giống
   hệt** leaf `enrolled` (`82%`, `7 ngày`, `126`, `7.4/10`) thay vì shimmer — trong khi `Tabs` ngay
   phía trên CÓ 2 `Skeleton` riêng. Nghi vấn từ B2a ("StatGridCard không có skeleton") giờ có **bằng
   chứng cụ thể**: số liệu y hệt bản đã tải, không phải hình rỗng — khả năng cao là `isSkeleton`
   không được truyền xuống `StatGridCard`, hoặc chính story `setup-loading` build fixture sai. Ưu
   tiên B2b.
4. **R3×color/text (field-label)** — "Tên phiên"/"Độ dài"/"Cấp độ" dùng màu **default**
   `oklch(0.2103)`, trong khi các nhãn phụ tương tự ở nơi khác trong CÙNG trang (tab không active ở
   R1/R4, "Câu 3/5" và "Xem lại N câu" ở R5) đều dùng **muted** `oklch(0.5517)`. Có thể đây là hai
   VAI khác nhau (nhãn trường nhập liệu vs nhãn phụ điều hướng) nên hợp lệ khác màu — nhưng cần B2b
   đối chiếu cây `color/context.md` để xác nhận không phải lệch ngẫu nhiên.
5. **R7 — sub-state chưa từng thấy trong baseline gốc**: leaf `recap` có dòng
   `"Còn 2/2 thẻ chưa tự chấm"` xuất hiện TRƯỚC các thẻ câu hỏi — nghĩa là tồn tại trạng thái "chưa
   tự chấm" chưa được B1 liệt vào bảng vùng (baseline gốc chỉ chụp 2 thẻ đã có đủ đáp án+đánh giá).
   Đây là lỗ hổng PHẠM VI (thiếu 1 state), không phải lỗi 15 trục — ghi vào `còn treo` của
   `session.md`, không tự vẽ thêm state ngoài kế hoạch B1.

### 90 ô NGHI còn lại (không có bằng chứng cụ thể mới)

Giữ nguyên NGHI NGỜ, chờ quyết định phạm vi B2b với thầy (chạy hết 90 ô rất tốn — xấp xỉ đúng quy mô
neo 2026-07-29 mà kiến trúc 2 nhịp này dựng ra để tránh). Đề xuất: B2b ưu tiên 5 mục có bằng chứng cụ
thể ở trên trước, các ô NGHI còn lại xử lý theo lô nhỏ nếu thầy muốn quét tiếp, thay vì bung hết một
lượt.

## B2b — kết quả đào sâu 5 mục ưu tiên (đọc Phần A+B + source thật)

| Ô | Phán quyết | Ghi chú |
|---|---|---|
| R3 × color | **ĐẠT** | nhãn trường form ("Tên phiên"/"Độ dài"/"Cấp độ") đúng SSOT `FieldFrame.tsx:129` (chốt 2026-07-25) — vai khác nhãn phụ, không phải lệch. |
| R3 × text | **ĐẠT** | cùng SSOT trên, đúng Tier B (`sm`/`medium`) cho "tên trường", khác Tier D của nhãn phụ. |
| R5 × color | **N/A** (không thuộc trục này) | `oklab(0.5533 0.14612 -0.0150227)` là token hệ thống thật: HeroUI `--accent-soft-foreground: color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%)`, dùng cho MỌI `variant="secondary"` (86 call-site) — Chrome serialize theo `oklab` vì `color-mix` khai `in oklab`. Không phải hard-code, không lệch thang màu. |
| **R5 × button (MỚI, chưa có trong triage gốc)** | **CẦN THẦY QUYẾT** | nút "Kết thúc"/"Xong" đang `variant="secondary"` (trung tính), nhưng docstring `WorkSessionHeader.tsx:19-22` tự ghi rõ ý nghĩa hành động là "chấm dứt phiên NGAY" — nghi nên là `variant="danger-soft"` theo cây `button/context.md` §2a nhánh DANGER. Đây là câu hỏi trục `button`, không phải `color` — B2a ban đầu đã đánh NGHI ô này, giờ có bằng chứng cụ thể. |
| R5 × text | **ĐẠT** | `WorkSessionHeader.tsx:129` khớp 1:1 với `src` thật (`QuizSession/index.tsx:1070-1072`) — `sm`/`medium`/`tabular-nums`. Theo luật NEO THẬT (src thắng cây tier trừu tượng khi PORT một dòng chữ đã tồn tại). |
| R5 × async (cơ chế) | **ĐẠT** | đồng hồ là `setInterval` client-side độc lập tính từ `deadlineAt` do SERVER phát — không đi qua `AsyncContent`, đúng luật (một tick liên tục không phải trạng thái fetch). |
| **R5 × async (giá trị TTL) — chạm mâu thuẫn domain #13** | **CÂM — không tự chọn, cần thầy** | Cả FE (`QuizSession/index.tsx:579-581`, comment ghi rõ *"thầy 2026-07-11: 'thêm thời gian mỗi phiên là 60 phút'"*) lẫn BE (`flashcard-quiz-session.entity.ts:28` → `FLASHCARD_QUIZ_SESSION_DURATION_MS = 60 phút`, dùng cả để tạo deadline lẫn kiểm lazy-expiry) đều thống nhất **60 phút** — đây là con số DUY NHẤT có mặt trong code enforce thật. "24 giờ" chỉ là MỘT dòng comment khác (`QuizSession/index.tsx:291-292`) mô tả sai chính cơ chế 60-phút đang chạy. Bằng chứng nghiêng mạnh về 60 phút, nhưng theo luật `story-create/step-1-intent.md` vẫn không tự chọn — trình cả hai cho thầy. |
| R4 × async | **N/A** | `StatGridCard` chỉ shimmer từng phần, không đổi cấu trúc — không đi qua `AsyncContent`, đúng nhánh loại trừ #3. |
| R4 × skeleton | **ĐẠT** (xác nhận lại bằng DOM sau khi restart Storybook) | Nguồn: `QuizProgressPanel.tsx:127-183` có `SKELETON_STATS` cố định 4 ô + `isSkeleton` chảy đúng xuống cả `Tabs` lẫn từng `Typography` trong `StatGridCard`; `Typography.tsx:329` nhánh skeleton đứng đầu tiên. DOM đo lần đầu (số liệu thật hiện ở leaf loading) là do **Storybook HMR ôi** sau khi `QuizScreen`→`QuizPage` đổi tên (commit `cb01d7d0`) — đã `preview_stop`+`preview_start` lại, đo lại: leaf `setup-loading` giờ `Typography` bên trong `StatGridCard` đều RỖNG (shimmer đúng), khớp phán quyết ĐẠT. |

### Việc thầy cần quyết (2 mục, không tự chọn)

1. **TTL phiên hỏi nhanh: 60 phút hay 24 giờ?** Bằng chứng code nghiêng hẳn về 60 phút (hằng số +
   2 nơi enforce, cả FE lẫn BE) — "24 giờ" chỉ là 1 dòng comment lẻ. Nếu thầy xác nhận 60 phút,
   việc còn lại là sửa dòng comment sai, không phải sửa hành vi.
2. **Nút "Kết thúc"/"Xong" nên `variant="secondary"` (đang có) hay `"danger-soft"`** — vì đây là
   hành động chấm dứt phiên giữa chừng (docstring source tự ghi "END IT NOW"), giống nhóm hành
   động cần cảnh báo hơn là trung tính.

## Script đo leaf-level đã dùng (tham khảo, không phải phần trình bày)

```js
(function () {
  function leaf(el) {
    const cs = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(), part: el.getAttribute('data-anat-part'),
      text: (el.textContent || '').trim().slice(0, 40),
      fontSize: cs.fontSize, fontWeight: cs.fontWeight, color: cs.color,
      display: cs.display, gap: cs.gap, padding: cs.padding, borderRadius: cs.borderRadius,
      bg: cs.backgroundColor
    }
  }
  const root = document.querySelector('[data-anat-part="<vùng>"]')
  return JSON.stringify([...root.querySelectorAll('[data-anat-part]')].map(leaf), null, 1)
})()
```
