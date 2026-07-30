# Phiên feedback — QuizPage

- storyId: 5 leaf, tra thật từ `index.json` (không đoán):
  `starci-pages-quizpage-quizpage--setup-enrolled` · `--setup-trial` · `--setup-loading` ·
  `--active` · `--recap`
- file story: `.storybook/stories/starci/pages/QuizPage/QuizPage.stories.tsx`
- file component: `.storybook/components/starci/pages/QuizPage/QuizPage.tsx`
- mở: 2026-07-30       trạng thái: **ĐANG CHẠY**

## Nghiệp vụ đã nạp (B0, trước khi quét)

Miền: **`flashcard.md`** — quiz ở đây là **"Hỏi nhanh"** (`FlashcardQuizSession`), không phải một
loại quiz riêng. Nạp đúng một miền, không nạp cả chín.

| Thực thể / luật | Nội dung |
|---|---|
| `FlashcardQuizSession.status` | `in_progress` · `completed` · `abandoned` |
| `.mode` | `quick` · `deep` |
| `.level` | một trong bốn mức của thẻ, **hoặc rỗng = mọi mức** |
| Ba route thật | `…/flashcards/quiz` (chuẩn bị + 2 tab Lịch sử/Thống kê) · `…/quiz/sessions/[id]` (đang chạy, toàn màn) · `…/quiz/sessions/[id]/result` (tổng kết) |

**Luật nghiệp vụ đáng nhớ (rút từ `flashcard.md` §4):**

- **Trần XP: 15/phiên, 60/ngày** (giờ VN, mỗi cặp người-khoá). Chơi lại vẫn có thể nhận **0 XP** ⇒
  màn kết quả **phải chịu được con số 0**.
- **Điểm do SERVER tính lại** từ tập trả lời gửi lên, không lấy số client. Ước lượng XP hiện trong
  lúc chơi chỉ là **tạm**, kết quả cuối có thể khác.
- **Mỗi người đúng MỘT phiên dở dang mỗi loại** — bắt đầu phiên mới tự đẩy phiên cũ sang
  `abandoned`. ⇒ UI **không được vẽ hai thẻ "Tiếp tục" cùng lúc**.
- Phiên quá hạn **không có cron dọn**, suy ra lúc đọc: hỏi nhanh sống **60 phút** kể từ lúc bốc.
  Phiên hết hạn **vẫn mang `in_progress`** trong DB.

⚠️ **Trúng một trong 15 chỗ backend-FE nói ngược nhau** mà `domain/INDEX.md` đã ghi sổ (số 13):
*TTL phiên quiz — comment ghi 24 giờ, hằng số backend ghi 60 phút.* Theo luật của
`story-create/step-1-intent.md`: **KHÔNG tự chọn bên nào**, ghi cả hai và nêu cho thầy.

## Vùng

Thầy chốt **"full"** — cả màn. Chia theo đúng ranh giới PHA của chính component (`phase` quyết
cluster nào trên màn, ba pha không bao giờ chồng nhau), vì đó là ranh giới thật của code, không
phải ranh giới em tự vạch.

| id | Vùng (component thật) | Pha | Ý định thầy |
|---|---|---|---|
| R1 | `FlashcardModeSwitch` (`blocks/learn/FlashcardModeSwitch`) | setup (cả 2 nhánh) | thầy chưa nói — em tự soi |
| R2 | `QuizEnrollGate` (`blocks/learn/QuizEnrollGate`) | setup · nhánh CHƯA ghi danh | thầy chưa nói — em tự soi |
| R3 | `QuizSetup` (`blocks/learn/QuizSetup`) | setup · nhánh ĐÃ ghi danh | thầy chưa nói — em tự soi |
| R4 | `QuizProgressPanel` (`blocks/learn/QuizProgressPanel`) | setup · nhánh ĐÃ ghi danh | thầy chưa nói — em tự soi |
| R5 | `WorkSessionHeader` (`blocks/navigation/WorkSessionHeader`) | active + recap (dùng chung, 2 lần khai) | thầy chưa nói — em tự soi |
| R6 | `QuizQuestion` (`blocks/learn/QuizQuestion`) | active | thầy chưa nói — em tự soi |
| R7 | `QuizRecapList` (`blocks/learn/QuizRecapList`) | recap | thầy chưa nói — em tự soi |
| R8 | `Container` + `StackV` của chính screen | cả 3 pha | thầy chưa nói — em tự soi |

⚠️ Cột "ý định" để trống ĐÚNG NGHĨA "thầy chưa nói, trò tự soi" — không bịa ý định rồi quét theo
nó. Thầy nói "full" là chọn PHẠM VI, không phải nêu triệu chứng.

Ma trận B2 sẽ là **8 vùng × 15 trục = 120 ô**.

## Vòng

### Vòng 1 — 2026-07-30
- B2a triage (8 agent song song, Phần A + baseline.json) chạy đủ 8 vùng × 15 trục = 120 ô. Xem
  chi tiết `round-1.md`.
- Vì `baseline.json` gốc chỉ đo mức VÙNG (không đo từng phần tử con), 95/120 ô ra NGHI NGỜ — đo bổ
  sung leaf-level (vẫn không đọc source) để lọc bớt trước khi vào B2b. Sau lọc: 4 ô đóng thành ĐẠT,
  5 mục có bằng chứng cụ thể ưu tiên B2b, ~90 ô còn NGHI chờ quyết định phạm vi.
- còn treo: xem mục dưới.
- canon có cần đổi: có — B0 nên chụp `baseline.json` ở mức LEAF, không chỉ mức vùng, để giảm NGHI
  giả do thiếu dữ liệu (chưa trình thầy).

### Vòng 1 — áp sửa (2026-07-30, tiếp theo)
- duyệt và đã áp: R5 × button (`WorkSessionHeader.tsx:133`) — `variant="secondary"` → `variant="danger-soft"`,
  vì nút "Kết thúc"/"Xong" là hành động chấm dứt phiên giữa chừng (docstring source tự ghi "END IT
  NOW"). Thầy chốt: *"2 danger soft ok"*.
- thầy quyết TTL: **60 phút** đúng (không phải 24 giờ). Không có gì để sửa trong `.storybook` —
  cơ chế đồng hồ đã ĐẠT sẵn (B2b). Việc còn lại là dòng comment sai "24h" trong `src` thật
  (`QuizSession/index.tsx:291-292`) — NGOÀI phạm vi sửa của phiên này (`.storybook` mới là bản vẽ
  được sửa, `src` là công trình cần xin phép riêng từng lượt) — xem mục Ngoài phạm vi.
- còn treo: R7 state "chưa tự chấm" (chưa hỏi thầy), 90/120 ô B2a chưa rõ nguyên do.
- verify: `tsc` sạch · 10/10 cổng xanh (nợ cũ không liên quan) · eslint sạch · DOM đo lại
  `bg: oklab(0.6532 0.184551 0.143049 / 0.15)` (tint danger, alpha 0.15) so với trước
  `oklch(0.94 0.0015 354.13)` (xám trung tính) — đổi đúng hướng, khác đúng chỗ đã sửa.
- canon có cần đổi: không — đây là quyết định thiết kế cho một component cụ thể, không phải lỗ
  hổng canon.

## Ngoài phạm vi

- `src/components/features/learn/Flashcards/QuizSession/index.tsx:291-292` — comment tiếng Anh ghi
  sai "24h TTL" trong khi hằng số enforce thật (FE lẫn BE) là 60 phút (đã xác nhận với thầy). Đây
  là sửa `src` thật, ngoài ranh giới `.storybook` của phiên này — cần xin phép riêng hoặc mở phiên
  khác.

## Còn treo

- **[cần thầy quyết] TTL phiên hỏi nhanh: 60 phút hay 24 giờ?** B2b đọc cả FE lẫn BE: hằng số
  `FLASHCARD_QUIZ_SESSION_DURATION_MS = 60 phút` là con số DUY NHẤT dùng để enforce thật (tạo
  deadline + kiểm lazy-expiry) ở cả hai phía; "24 giờ" chỉ là 1 dòng comment lẻ mô tả sai chính cơ
  chế 60-phút đang chạy. Bằng chứng nghiêng hẳn về 60 phút nhưng không tự chọn — chờ thầy xác
  nhận. Xem `round-1.md` mục B2b.
- **[cần thầy quyết] `WorkSessionHeader` nút "Kết thúc"/"Xong": `secondary` hay `danger-soft`?**
  Màu `oklab(...)` đã xác nhận là token hệ thống thật (không phải hard-code) — nhưng B2b lộ ra câu
  hỏi trục `button` thật: nút này chấm dứt phiên giữa chừng (docstring source tự ghi "END IT NOW"),
  đang dùng `variant="secondary"` trung tính, nghi nên là `danger-soft`.
- `R7 QuizRecapList`: phát hiện một state CHƯA có trong bảng vùng B1 — dòng "Còn 2/2 thẻ chưa tự
  chấm" (trạng thái "chưa tự chấm"), xuất hiện trước các thẻ câu hỏi. Baseline gốc chỉ chụp thẻ đã
  có đủ đáp án — cần thầy xác nhận có nằm trong phạm vi phiên này không trước khi vẽ thêm.
- 90/120 ô B2a vẫn NGHI NGỜ không có bằng chứng cụ thể mới sau vòng lọc leaf-level — chưa quyết
  định phạm vi B2b tiếp theo (chạy hết một lượt rất tốn, đề xuất ưu tiên theo lô nếu thầy muốn quét
  tiếp).
- Đã đóng (không còn treo): R3×color, R3×text (ĐẠT — SSOT `FieldFrame.tsx`), R5×color (N/A —
  token hệ thống thật), R5×text (ĐẠT — khớp `src`), R5×async cơ chế (ĐẠT), R4×async (N/A), R4×
  skeleton (ĐẠT — xác nhận lại bằng DOM sau khi restart Storybook, DOM lệch trước đó là do HMR ôi
  sau đổi tên `QuizScreen`→`QuizPage`).
