# Phiên feedback — MockInterviewPage (phần phỏng vấn thử)

- storyId: 4 entry, tra thật từ `index.json` (không đoán) — 3 leaf thật + 1 `overview`:
  `starci-pages-mockinterviewpage-mockinterviewpage--setup` ·
  `--live` · `--result` · `--overview`
- file story: `.storybook/stories/starci/pages/MockInterviewPage/MockInterviewPage.stories.tsx`
- file component: `.storybook/components/starci/pages/MockInterviewPage/MockInterviewPage.tsx`
- mở: 2026-07-30       trạng thái: **ĐANG CHẠY**

## Nghiệp vụ đã nạp (B0, trước khi quét)

Miền: **`mock-interview.md`** — dày nhất trong 9 miền đã đọc qua (97 dòng), **~50 state phải vẽ**
riêng cho miền này. Nạp trước khi soi bất kỳ pixel nào.

### Thực thể lõi

| Thực thể | Trạng thái thật |
|---|---|
| `mock_interview_sessions` | `status`: `in_progress` · `completed` · `abandoned`; `mode`: `qna` · `design`; `difficulty`/`source`/`level` — **varchar, không phải enum DB** |
| `mock_interview_attempts` (lượt đã chấm) | `verdict`: `pass` · `borderline` · `fail` (`MockInterviewVerdict`) |
| Khung nhận thức câu Q&A | `MockInterviewKind`: `theory` · `reasoning` · `scenario` |
| Pha thiết kế hệ thống | `MockInterviewPhase`: `requirements` · `estimation` · `highLevel` · `deepDive` · `tradeoffs` (5 chặng CỐ ĐỊNH) |

### Ba route thật

`.../mock-interview` (phòng chờ, 3 tab Bắt-đầu/Lịch-sử/Thống-kê, nhớ qua `?tab=`) →
`.../interview/[sessionId]` (live, 2 cột) → `.../interview/[sessionId]/result` (bảng điểm,
**route này trả lời "đã xong chưa", không suy ra từ state client**).

### Luật nghiệp vụ đáng nhớ — dễ dựng sai nhất nếu không đọc trước

- **Chấm CẢ PHIÊN một lần ở cuối, không chấm từng câu.** Cần một pha `grading` riêng giữ nguyên
  thanh đầu, không nhảy màn khác.
- **Đồng hồ suy từ `deadlineAt` server**, không tự đếm từ lúc mount. Hạn = 1 giờ từ lúc bốc đề.
- **Hết giờ suy ra lúc ĐỌC, không do cron.** Một phiên `in_progress` quá hạn vẫn nằm DB nhưng bị
  loại khỏi danh sách làm-tiếp — FE phải chịu được CẢ HAI kiểu hiện.
- **Chỉ làm tiếp được nếu sync trong 24 giờ gần nhất** — ngoài cửa sổ đó, thẻ "làm tiếp" biến mất
  dù `status` vẫn `in_progress`.
- **Mỗi người một phiên làm-tiếp tại một thời điểm** — bốc đề mới tự lật phiên cũ sang `abandoned`.
  Đừng dựng UI hai thẻ "làm tiếp" song song.
- **Server chặn bài quá ngắn (<100 ký tự) TRƯỚC KHI trừ credit** — lỗi này hiện y hệt lỗi chấm
  thường, dễ nhầm là bug chấm.
- **Hết hạn mức AI ≠ lỗi chấm thường** — FE phải gọi lại quota SAU KHI chấm hỏng rồi mới quyết
  hiện khối nâng cấp gói hay khối lỗi đỏ, không đoán bằng khớp chuỗi.
- **"Tuỳ chỉnh" KHÔNG tính vào chỉ số sẵn sàng đi làm** — chỉ "Tự động" + mọi phiên `design` mới
  tính. Màn khoe điểm sẵn sàng phải nói rõ điều này.
- **Đề lộ ra CHỈ SAU khi bấm vào phòng** — phòng chờ không được hiện trước tên đề/câu hỏi.
- **Lịch sử + Thống kê phải GIỮ MOUNT khi đổi tab**, không render có điều kiện — trước đây đổi
  tab mất sạch danh sách đã tải.

⚠️ Không thấy mục "backend-FE nói ngược" nào cho miền này trong `domain/INDEX.md` §5 (khác
`QuizPage` vừa mở, có 1 mục TTL 60-phút-vs-24-giờ) — không có nghĩa là sạch, chỉ là chưa ai ghi.

## Vùng

Thầy chốt **"làm hết đi"** — cả màn, cả 3 pha. Chia theo đúng 8 node `data-anat-part` mà chính
`MockInterviewPage.tsx` khai trong JSX (không tự vạch ranh giới khác cây thật):

| id | Vùng (component thật) | Pha | Ý định thầy |
|---|---|---|---|
| R1 | `PlaygroundSetupHeader` (`blocks/learn/PlaygroundSetupHeader`) | setup | thầy chưa nói — em tự soi |
| R2 | `MockInterviewSetup` (`blocks/learn/MockInterviewSetup`) | setup | thầy chưa nói — em tự soi |
| R3 | `WorkSessionHeader` (`blocks/navigation/WorkSessionHeader`) | live | thầy chưa nói — em tự soi |
| R4 | `InterviewerPresence` (`blocks/learn/InterviewerPresence`) | live | thầy chưa nói — em tự soi |
| R5 | `VoiceHero` (`blocks/learn/VoiceHero`) | live | thầy chưa nói — em tự soi |
| R6 | `MockInterviewAnswerAction` (`blocks/learn/MockInterviewAnswerAction`) | live | thầy chưa nói — em tự soi |
| R7 | `SubmissionResultHeader` (`blocks/learn/SubmissionResultHeader`) | result | thầy chưa nói — em tự soi |
| R8 | `MockInterviewScorecard` (`blocks/learn/MockInterviewScorecard`) | result | thầy chưa nói — em tự soi |

Ma trận B2 sẽ là **8 vùng × 15 trục = 120 ô**.

## Vòng

### Vòng 1 — 2026-07-30
Ma trận đầy đủ ở `round-1.md`: 66 ĐẠT · 21 LỆCH · 2 CÂM · 31 N/A. Trình thầy, **CHỜ PHẢN HỒI**
trước khi áp bất kỳ ô nào (chưa duyệt/bác cái nào).

## Ngoài phạm vi

Chưa có.

## Còn treo

- Chưa đọc `MockInterviewPage.tsx` (component thật) để dịch cấu trúc 3 pha (`setup`/`live`/
  `result`) sang danh sách vùng — cần làm trước khi thầy khoanh ở B1, hoặc song song lúc thầy
  khoanh ảnh.
