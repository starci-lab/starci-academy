# UX Brainstorm — Phỏng vấn thử: từ FORM → PHÒNG PHỎNG VẤN (interview room) (2026-07-06)

> `/starci-fe-ux-brainstorm` · Opus · MAX. Thầy: *"luồng phỏng vấn thử hơi xàm… kiểu cái room phỏng vấn í. có ai
> làm cái này chưa?"* → research reference thật + thiết kế lại UX thành 1 **phòng phỏng vấn** có interviewer hiện
> diện + voice-hero + nghi thức bước vào. KHÔNG code. (Nối tiếp `LAYOUT-BRAINSTORM.md` Vòng 5 — đây là pass PRESENTATION
> của phase `interview`, tập trung "cảm giác phòng", không đụng logic mode/random/kind đã chốt.)

## 0. Chẩn — vì sao "xàm" (dù hạ tầng đã đủ ~70%)
Feature ở `src/components/features/learn/MockInterview/`. Scan FE+BE: **cơ chế phòng phỏng vấn ĐÃ có gần đủ**, cái
xàm nằm ở **CÁCH TRÌNH BÀY**, không phải thiếu tính năng:
- ✅ State machine 4 phase (`setup | interview | grading | scorecard`), 2 mode (`qna` 5 câu · `design` 5-phase).
- ✅ Câu hỏi **STREAM token-by-token** qua socket `/mock_interview` — interviewer "gõ" câu hỏi ra dần (live).
- ✅ **Web Speech STT** (`useSpeechRecognition`, vi-VN/en-US, interim) — trả lời bằng GIỌNG → transcript.
- ✅ Workspace Whiteboard(xyflow)/Code/Notes → fold vào transcript lúc chấm.
- ✅ Scorecard giàu: verdict, per-question review **kèm đáp án mẫu** (`modelAnswer`), attributeScores, strengths/gaps,
  follow-up, RAG citation. History → drawer.

**4 lý do đọc ra "xàm":**
1. **Mở ra là 1 FORM config** (mode/mức/số câu/kind/model + history) → như bảng cài đặt, thiếu **nghi thức bước vào phòng**.
2. **Câu hỏi trong 1 hộp xám vô hồn** (`bg-default/40 p-4`) — interviewer **KHÔNG có mặt** (không tên/vai/avatar/"đang nói").
3. **Voice bị GIẤU** — mic là icon nhỏ góc textarea (`answerMode=both`). "Nói" (chữ ký của phỏng vấn) không phải hero.
4. **Không sân khấu / không khí** — vẫn trong shell thường (navbar + breadcrumb + sidebar). Không "bước vào" đâu.

→ Redesign KHÔNG build phòng từ đầu — mà **biến các mảnh đã có thành 1 PHÒNG**: interviewer **hiện diện** (tên/vai/
avatar + "đang nói"), **voice làm hero**, **nghi thức vào phòng** + **sân khấu full-bleed** (giảm chrome). Tận dụng
socket-stream = "đang nói" · STT = "bấm-để-nói".

## 1. Reference — "có ai làm cái này chưa?" (có, nhiều)
| Sản phẩm | Lấy gì |
|---|---|
| **Google Interview Warmup** | 1 câu / 1 màn · trả lời bằng giọng · transcript real-time · insight tại-chỗ. Clean single-focus. |
| **Exponent / Pramp** | Layout **video-call**: interviewer tile + shared code editor · control bar dưới. "Nhận diện = phòng". |
| **JobMojito · AMA Interview** | **Interviewer AVATAR/persona** nói từng câu, thích ứng câu trả lời, giữ nhịp. |
| **Final Round AI** | Sân khấu tập trung, timed response, feedback tức thì. |
| **interviewing.io** | Debrief scorecard theo rubric thật (content/clarity/structure/confidence). |

Nguồn: [Exponent/Pramp](https://www.tryexponent.com/practice) · [Google Interview Warmup](https://grow.google/certificates/interview-warmup/) ·
[Final Round AI](https://www.finalroundai.com/ai-mock-interview) · [JobMojito](https://jobmojito.com/) · [techinterview ranked](https://www.techinterview.org/post/3233474681/mock-interview-platforms/).

**Pattern chung "phòng phỏng vấn thật":** (a) nghi thức vào phòng · (b) interviewer HIỆN DIỆN · (c) 1 câu / 1 focus ·
(d) trả lời bằng GIỌNG (mic hero + transcript) · (e) timer + "Câu N/M" HUD · (f) workspace khi cần · (g) debrief scorecard.

## 2. Cơ hội TẬN DỤNG (grounded, ~0 BE mới)
- **TTS interviewer** = Web Speech `speechSynthesis` (client-side, MIỄN PHÍ, cùng họ API với STT đã dùng) → interviewer
  **THẬT SỰ NÓI** câu hỏi khi nó stream về. CHƯA dùng ở đâu (`grep speechSynthesis` = 0). Nâng cấp "room" rẻ + mạnh
  nhất → phỏng vấn 2 chiều bằng giọng.
- **Persona theo MỨC** (grounded nhẹ): BE có `LEVEL_EXPECTATION_MAP` (junior→staff đổi độ gắt). FE cho persona phản
  ánh mức (chọn "Cao" → "Senior/Staff Engineer"). Persona = lớp TRÌNH BÀY FE (tên + vai + monogram), không cần BE trả.
- **Kind badge** đã có (`Câu N/M · Tình huống`) → HUD phòng. **Socket stream** = tín hiệu "đang nói" (pulse) — free.

## 3. Ba HƯỚNG (thầy chọn) — đều share: nghi thức "vào phòng" + interviewer hiện diện + voice-hero + full-bleed
> Full-bleed sân khấu grounded [[solving-surface-fullbleed-no-course-rails]] (bỏ LearnShell rail như trang giải challenge).

### ⭐ Hướng A — "Ghế nóng" (Hot Seat): sân khấu hội thoại, interviewer hiện diện, VOICE-FIRST — ĐỀ XUẤT
- **Phòng chờ (green room):** setup gom 1 card bình tĩnh — *"Bạn sắp được phỏng vấn · N câu · Mức Trung · ~15 phút"*
  + persona interviewer (avatar + tên + vai) + **1 primary "Vào phòng phỏng vấn"**. Config thu vào "Tùy chỉnh phiên"
  (mặc định Auto — de-emphasize). History xuống dưới.
- **Sân khấu (Q&A):** full-bleed. **Panel interviewer trên đầu** (avatar + "đang nói" pulse) — câu hỏi hiện như-đang-nói
  (stream + TTS đọc). Dưới: **nút mic BỰ (push-to-talk) = hero** + transcript live; toggle nhỏ "gõ thay". HUD: timer +
  "Câu N/M · kind". Chip "mở bảng/code" trượt workspace sheet.
- **Design mode:** cùng panel interviewer, whiteboard/code = canvas chính (war-room), interviewer dock góc, phase rail ngang.
- **Kết thúc:** "kết thúc phỏng vấn" → interviewer "rời đi" → scorecard = **buổi debrief**.
- **Ref:** Google Warmup + JobMojito/AMA + Final Round. **Trade-off:** nhiều việc nhất, wow cao nhất, đúng "phòng với
  interviewer" nhất; tái dùng ~toàn bộ wiring.

### Hướng B — "Phòng gọi video" (split room, video-call metaphor)
- Theo **cuộc gọi phỏng vấn** (Zoom/Meet): trái = tile interviewer (avatar + tên + caption câu hỏi + waveform);
  phải = workspace tabs (Trả lời · Bảng · Code · Ghi chú). **Control bar dưới**: [mic] [câu tiếp] [timer] [rời đỏ].
  Q&A + Design CHUNG shell (Q&A ẩn tab workspace mặc định).
- **Ref:** Exponent/Pramp + Zoom bar. **"Nhận ra là phòng" mạnh nhất. Trade-off:** chrome call nặng/skeuomorphic cho
  interviewer chỉ-text (rủi ro giả-video), nhưng đọc "1 phòng" rõ nhất.

### Hướng C — "Teleprompter tập trung" (minimalist stage, chrome-off)
- Cực tối giản: vào phòng → mờ hết trừ sân khấu tối. 1 câu hỏi KHỔNG LỒ giữa (teleprompter). 1 mic đang đập. Chỉ timer
  + progress bé. Workspace gọi bằng nút trượt. Interviewer = giọng/hiện diện ("đang nghĩ…"), KHÔNG avatar.
- **Ref:** Google Warmup single-focus + app tập trung. **Trade-off:** ít "phòng/xã hội" nhất, focus mode nhất; rẻ
  (tái dùng single-column) nhưng ít hiện diện — có thể chưa đã cơn "phòng có interviewer".

## 4. Chốt đề xuất
**A (Hot Seat)** — khớp nhất "phòng phỏng vấn thật với interviewer AI" + voice (STT có) làm hero + hiện diện + tận
dụng ~toàn bộ wiring (socket = "đang nói" · STT = push-to-talk · **TTS free = interviewer nói** · workspace = sheet ·
scorecard = debrief). **B** nếu muốn đúng look "gọi video". **C** nếu muốn tối giản.

## 5. Ma trận STATE (giữ honesty + fair-monetization)
| State | Phòng chờ / Sân khấu |
|---|---|
| **loading** (draw đề) | phòng chờ: "Vào phòng" → spinner "đang chuẩn bị phòng…" (`startMockInterviewSession`) |
| **interview** | sân khấu; interviewer stream + TTS; mic hero + transcript |
| **grading** | "interviewer đang chấm…" (`gradeMockInterviewSession`) |
| **scorecard** | debrief: verdict + per-question (kèm đáp án mẫu) + attributes + strengths/gaps + CTA học lại điểm yếu (reuse `MockInterviewScorecard`) |
| **empty** (chưa phỏng vấn) | history rỗng → phễu "Phỏng vấn thử để biết bạn đứng đâu" + CTA vào phòng; chưa học đủ → nudge học |
| **STT không hỗ trợ** | mic ẩn → fallback gõ (`supported` flag đã có) |
| **Tùy chỉnh** | green-room mở "Tùy chỉnh phiên" (số câu/kind/answerMode) — `countsToReadiness=false` (giữ tín hiệu recruiter sạch) |

## 6. Cắt / Giữ / Thêm
- **CẮT:** cảm giác "form config mở đầu" (→ green-room, config thu gọn); hộp câu hỏi xám vô hồn; mic-trong-textarea.
- **GIỮ:** state machine 4 phase · socket stream · STT hook · workspace · scorecard · history · kind badge · design 5-phase.
- **THÊM:** nghi thức green-room + transition full-bleed · panel interviewer hiện diện (persona theo mức) + "đang nói"
  pulse · **TTS** (`speechSynthesis`, free) đọc câu hỏi · push-to-talk mic hero + live transcript · workspace-as-sheet
  (Q&A) · debrief framing cho scorecard.

## 7. CHỐT 2026-07-06 (thầy duyệt) → `/starci-fe-ux-apply`
- **Hướng A · Ghế nóng** (voice-first, interviewer hiện diện, full-bleed stage).
- **TTS = BẬT MẶC ĐỊNH** (interviewer đọc câu hỏi khi stream, `speechSynthesis` vi-VN/en-US, có nút tắt loa).
- Widget mockup đã vẽ kèm chat. Dựng qua `/starci-fe-ux-apply` (giữ nguyên logic mode/random/kind Vòng 5, chỉ đổi
  PRESENTATION của green-room + phase interview).
