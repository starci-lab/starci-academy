# UX Brainstorm — "Hỏi nhanh" (Quick Quiz): bỏ AI + gamify học-hiệu-quả (2026-07-05, Opus)

> `/starci-fe-ux-brainstorm`. Route `/learn/flashcards/interview` = tab **"Hỏi nhanh"** trong "Ôn tập".
> ⚠️ SUPERSEDE phần "2026-06-25" bên dưới: các API nó dựng trên (`gradeInterviewAnswer`/`drawInterviewCard`/
> `myInterviewHistory`) NAY ĐÃ BỊ GỠ khỏi BE (grep `mtp` = 0). Feature AI-mock-interview thật đã tách sang
> `features/learn/MockInterview` (`/learn/mock-interview`, `gradeMockInterviewSession`) + lấy tên "Phỏng vấn thử".
> `InterviewSession` này giờ = "Hỏi nhanh" orphan gọi API chết (→ toast "Mất kết nối"). Làm lại KHÔNG-AI, cô lập.

## 0. Hai phát hiện quyết định (grounded)
- **0a. Gọi API chết:** `gradeInterviewAnswer`/`drawInterviewCard`/`myInterviewHistory` không còn trên `starci-academy-backend@mtp`
  (0 grep). BE chỉ còn `gradeMockInterviewSession` + FE riêng `MockInterview`. → "Phỏng vấn thử" (AI, sâu, capstone) ≠
  "Hỏi nhanh". Redesign "Hỏi nhanh" cô lập, KHÔNG đụng `MockInterview`.
- **0b. Content flashcard = câu hỏi phỏng vấn higher-order**, đáp án 5 tầng (`Trả lời thẳng`→`Cơ chế`→`Trade-off`→
  `Bẫy`→`Đào sâu tiếp`) + chip **`Từ khoá ăn điểm`**. KHÔNG phải fact-recall → mọi cơ chế chấm phải bám cấu trúc này.

## 1. Bằng chứng learning-science (quyết định "cách", có nguồn — §Nguồn cuối)
| Nguyên tắc | Hệ quả cho "Hỏi nhanh" |
|---|---|
| **Transfer-appropriate processing** (Agarwal 2019): luyện chỉ chuyển hoá khi format luyện KHỚP đích; luyện fact ≠ cải thiện higher-order | mục tiêu = trả lời phỏng vấn (higher-order) → **phải luyện higher-order retrieval** → **GIẾT multiple-choice** |
| **Testing effect** (Roediger–Karpicke; Dunlosky 2013 high-utility): short-answer bắt nhớ-lại-hoàn-toàn > recognition; biến số = NỖ LỰC | **bắt gõ/nói TRƯỚC khi lật** → **GIẾT tự-chấm nhị phân nhìn-xong-bấm-Đúng** |
| **Elaborative interrogation / self-explanation** (Dunlosky 2013): tự sinh why/how bền hơn nhận thụ động | **"Đào sâu tiếp"** (viết sẵn trong content) = vòng bonus |
| **Spacing** (Dunlosky 2013 high-utility) | **streak NGÀY** là hook gamify CHÍNH; vẫn nuôi SM-2 |
| **Interleaving** (Dunlosky 2013) | phiên **trộn thẻ across tag/deck**, không blast 1 deck |
| **Gamification meta** (Zeng 2024; SDT 2023; overjustification): tăng động lực nhưng **tối thiểu lên competency**; điểm kỳ vọng có thể **giết** động lực học | **thưởng ĐỘ PHỦ (keyword/tầng) + THÓI QUEN (streak ngày), KHÔNG tốc độ tap**; điểm ở "equilibrium"; recap khung theo MASTERY không raw points |

## 2. Phương pháp chốt (không AI, tái dùng content + SRS)
**Nhớ lại (gõ/nói) → lật đối chiếu keyword + tầng → tự chấm SM-2 (`reviewFlashcard`) → bonus "đào sâu" → interleave → quay lại mai (streak).**
Chấm KHÔNG AI = **string-match** câu trả lời với chip `Từ khoá ăn điểm` (đã fetch sẵn trong `answer`) → "nhắc 3/6 từ khoá".
1 engine SRS (không hệ điểm song song); XP qua `writeXpHistory` (+1 `XpSource`, `refId=sessionId` idempotent) → leaderboard sẵn có.

## 3. Ba hướng "cách" — khác ở ĐỘ ÉP cấu trúc (widget đã vẽ trong chat)
- **A — Recall + chấm từ khoá (ĐỀ XUẤT):** 1 câu → gõ/nói → lật → keyword-coverage + tick tầng → SM-2 4 mức. Higher-order thật + chấm khách quan + ship nhẹ + nuôi SRS. Rủi ro: tự-tick tầng (keyword khách quan gánh).
- **B — Phỏng vấn tầng:** tách đáp án 5 phần (theo `:::muted` header sẵn có) thành 2-3 micro-recall nối tiếp ("cơ chế"→reveal→"1 trade-off"→reveal→"1 bẫy"). Sát phỏng vấn thật nhất; nặng eng hơn, ít "nhanh".
- **C — Triage nhanh:** vuốt "nói được / chưa chắc", warm-up + streak. Thành thật KHÔNG dạy sâu (đã có "Học thẻ" lo lật nhanh) → quá nhẹ cho content này.
- **Chốt: A**, mượn "Đào sâu tiếp" của B làm bonus elaborative-interrogation. B để dành làm chế độ "drill sâu" tách riêng sau.

## 4. Gamify layer (bọc trên A, đúng §1 hàng cuối)
- Hook CHÍNH = **streak NGÀY** (map hệ streak/leaderboard sẵn có), to nhất trên setup.
- **XP = f(độ phủ keyword + tầng)**, KHÔNG f(tốc độ); combo-trong-phiên = gia vị.
- Progress bar fill theo câu (X/N). Recap khung mastery ("N/M thẻ trả lời được không cần gợi ý · streak +1").
- Bỏ dropdown model AI (`GradeModelDropdown`) — ngừng render tại đây, KHÔNG sửa file gốc (dùng chung nơi khác).

## 5. Việc khi `/starci-fe-ux-apply`
- **FE:** viết lại `InterviewSession` theo vòng A; bỏ 3 mutation/query chết + `GradeModelDropdown`; nguồn thẻ + mastery từ query flashcard course sẵn có; parse `Từ khoá ăn điểm` từ `answer`; tự chấm qua `reviewFlashcard`.
- **BE (nhỏ, 0 AI):** `XpSource.FlashcardQuiz` + mutation "hoàn tất phiên" → `writeXpHistory(refId=sessionId)`; nếu chưa có query "rút N thẻ ngẫu nhiên theo course+level+interleave" thì thêm (kiểm module `flashcard-decks` trước).
- **Verify:** hết toast mất-kết-nối · XP đúng 1 lần/phiên · "Độ thuộc" khớp Học thẻ · streak ngày đúng.

## Nguồn
- Agarwal 2019, Retrieval Practice & Bloom's Taxonomy, J.Ed.Psych 111 — https://pdf.poojaagarwal.com/Agarwal_2018_JEdPsych.pdf
- Dunlosky et al. 2013, Improving Students' Learning With Effective Learning Techniques — https://www.aft.org/ae/fall2013/dunlosky
- Roediger & Karpicke, repeated retrieval / testing effect — https://www.sciencedirect.com/science/article/abs/pii/S0749596X06001367
- Zeng et al. 2024, Gamification meta-analysis (BJET) — https://bera-journals.onlinelibrary.wiley.com/doi/full/10.1111/bjet.13471
- Gamification & intrinsic motivation, SDT meta 2023 — https://link.springer.com/article/10.1007/s11423-023-10337-7
- Overjustification effect — https://en.wikipedia.org/wiki/Overjustification_effect

---

# UX Brainstorm — Phỏng vấn thử: RANDOM toàn khóa (bỏ chọn chủ đề) + chặn chưa-enroll (2026-06-25)

> `/starci-fe-ux-brainstorm`. Trang: `/learn/flashcards` tab **"Phỏng vấn thử"**. Thầy: *"random câu hỏi, không cho users chọn theo chủ đề; có attempts; dùng Web Voice; gửi BE chấm = AI + feedback; KHÔNG mua khóa khỏi xài; nhớ chặn nếu chưa enroll"*. KHÔNG code (chờ `/starci-fe-ux-apply`).

## 0. PHÁT HIỆN LỚN — tính năng ĐÃ DỰNG gần đủ (FE + BE)
Voice + AI chấm + attempts + history **đã có sẵn**, KHÔNG phải làm lại:
- **FE** `InterviewSession/index.tsx`: 3 phase setup→active→summary, 5 câu, `useSpeechRecognition` (Web Speech client-side STT), mic record + transcript live, submit → grade, verdict + strengths/gaps/modelAnswerHint/followUpQuestion, summary (avg + pass/borderline/fail + weak tags). `useMutateGradeInterviewAnswerSwr`.
- **BE**: `drawInterviewCard(flashcardDeckId!, level?)` (bốc random card có `answer != null`, GIẤU answer) · `gradeInterviewAnswer(flashcardDeckId, flashcardCardId, transcript)` → AI chấm (prompt theo level + rubric, model tier `Grade`, charge 10 credit auto, parse score/verdict/strengths/gaps/hint/followUp) · `myInterviewHistory(flashcardDeckId?)` (avg, pass/borderline/fail, weakTags) · `InterviewAttemptEntity` (log score/verdict/level/tags/user/deck).

→ **Việc THỰC SỰ phải làm CHỈ là 2 thứ:** (1) bỏ bước chọn chủ đề → random **xuyên toàn khóa**; (2) **chặn chưa-enroll**.

## 1. Mục tiêu trang
Học viên (đã mua) vào "Phỏng vấn thử" → bấm 1 nút → AI hỏi NGẪU NHIÊN (mọi chủ đề của khóa) → trả lời bằng giọng nói → chấm + góp ý → câu kế. Như app phỏng vấn thật (Final Round / Huru): KHÔNG bắt chọn topic, KHÔNG menu.

## 2. Đổi gì (cắt/thêm)
- **CẮT:** topic picker (`FlashcardDeckList` ở tab interview) + state `interviewDeckId` + nút "back to topics" + nhãn "Chọn chủ đề để phỏng vấn". Người dùng KHÔNG còn chọn bộ thẻ.
- **THÊM:** (a) **interview landing** = stats history (course-wide) + level selector + 1 CTA "Bắt đầu phỏng vấn"; (b) **enroll gate** bọc cả tab.
- **GIỮ NGUYÊN:** toàn bộ session (mic/transcript/verdict/summary), attempts, voice, AI grading.

## 3. IA mới (tab "Phỏng vấn thử")
```
tab=interview →
  CHƯA enroll → <EnrollGate>  (lock + "Đăng ký khóa học để luyện phỏng vấn với AI") 
  ĐÃ enroll →
    landing (phase setup):
      • intro 1 dòng ("AI hỏi ngẫu nhiên — trả lời bằng giọng nói, nhận chấm điểm + góp ý")
      • stats card (myInterviewHistory course-wide, auto-hide nếu 0 attempt): điểm TB (lớn) · đã trả lời · Đạt/Tạm/Trượt chips · chủ đề yếu chips
      • cấp độ: [Tất cả · Junior · Middle · Senior · Staff]  (đã có, drives độ khó)
      • CTA "Bắt đầu phỏng vấn" (icon mic, lg)  → session
    session (phase active): random draw toàn khóa → mic → submit → verdict → câu kế (random lại)
    summary (phase summary): avg + breakdown + weak tags + "Phỏng vấn lại"
```
→ Lần đầu (0 attempt): landing chỉ còn intro + level + CTA (sạch). Có lịch sử: thêm stats card.

## 4. Hướng (chốt A)
| Hướng | Là gì | ✅ | ❌ |
|---|---|---|---|
| **A — landing stats + Start** ✅ đề xuất | vào tab thấy stats + level + 1 nút Start → session random | rõ "đang ở đâu / luyện tiếp"; tái dùng phase setup sẵn có; 1 primary action | thêm 1 màn trước session (nhưng đáng — cho chọn level + xem tiến bộ) |
| B — vào thẳng câu hỏi | click tab = câu hỏi đầu hiện luôn, stats chỉ ở summary | nhanh nhất | mất chỗ chọn level + mất "tiến bộ"; giật (đang load câu đã vào session) |
| C — hội thoại liên tục | hỏi→đáp→feedback→hỏi mãi, không cố định 5 | giống chat phỏng vấn thật | mất ranh giới "phiên" + summary; refactor nhiều |
→ **A** (đúng tinh thần app phỏng vấn: 1 nút Start, random, theo dõi tiến bộ). Refs: Final Round AI · Huru · Interviews.chat (Q-by-Q feedback + score + voice).

## 5. Section → dữ liệu BE
| Section | Nguồn (đã có / CẦN ĐỔI) |
|---|---|
| Enroll gate | trạng thái enrolled (FE `ENROLL_REQUIRED_SURFACES` + BE guard) — **CẦN: thêm interview vào enrolled-only** |
| Stats landing | `myInterviewHistory(flashcardDeckId: null)` — **CẦN: scope theo course khi deckId null** (giờ chỉ scope deck) |
| Level selector | `FlashcardLevel` (đã có) |
| Random draw | `drawInterviewCard` — **CẦN: bỏ bắt buộc `flashcardDeckId`** → bốc random xuyên MỌI deck của course (filter answer!=null + level) |
| Chấm + feedback | `gradeInterviewAnswer(flashcardDeckId, flashcardCardId, transcript)` (card trả về đã kèm deckId → grade chạy như cũ) |
| Attempts | `InterviewAttemptEntity` (đã log) |

## 6. ⚠️ BE phải đổi (báo thầy — cần backend)
1. **`drawInterviewCard`: `flashcardDeckId` từ required → optional**, thêm scope `courseId` → khi không có deck thì bốc random card gradable (answer!=null + level) **trên TẤT CẢ deck của course**. (Hoặc query mới `drawInterviewQuestion(courseId, level?)`.) Card vẫn mang `deckId` để grade.
2. **`myInterviewHistory`: scope theo COURSE khi `flashcardDeckId` null** (giờ chỉ aggregate theo deck) → stats course-wide.
3. **Enrollment guard cho 3 resolver interview** (`drawInterviewCard`, `gradeInterviewAnswer`, `myInterviewHistory`): thêm `GraphQLMustEnrolledGuard`. **Đây là NGOẠI LỆ có chủ đích, ĐÍNH CHÍNH [[trial-preview-enrollment-optional]]** (mở flashcards cho trial): **interview = enrolled-only** vì tốn AI credit thật. "Học thẻ" (review SM-2) vẫn mở cho trial; chỉ "Phỏng vấn thử" khóa.

## 7. FE phải đổi
- `Flashcards/index.tsx`: tab interview → bỏ `FlashcardDeckList`/`interviewDeckId`; bọc bằng **enroll gate** (`enrolled ? <InterviewSession courseId/> : <EnrollGate/>`). `InterviewSession` nhận `courseId` thay `deckId`.
- `InterviewSession`: `drawInterviewCard` bỏ deckId (truyền courseId); `myInterviewHistory` course-wide; grade dùng `card.deckId`+`card.id` (đã có trong card trả về). Giữ nguyên phần voice/verdict/summary.
- SWR gate interview hooks theo `enrolled` (KHỚP BE guard) — đây là chiều NGƯỢC [[fe-swr-gate-must-match-be-enroll-guard]]: surface này CÓ gate enrolled.
- i18n: tái dùng `enrollGate.*` + `flashcard.interview.*` (bỏ key `pickLabel`/`backToTopics`/`start` của topic picker).

## 8. States / a11y
- Web Speech KHÔNG hỗ trợ (Firefox…) → fallback "trình duyệt không hỗ trợ" (đã có). Mic permission error (đã có).
- Enroll gate: lock icon + nhãn rõ "Phỏng vấn thử dành cho học viên" + CTA "Đăng ký khóa học".
- AI quota hết → `AiQuotaExhaustedException` (BE đã chặn) → FE hiện thông báo hết hạn mức (cần thêm copy nếu chưa có).

## Refs
- [Final Round AI](https://www.finalroundai.com/) · [Huru](https://huru.ai/) · [Interviews.chat](https://www.interviews.chat/) — voice answer + Q-by-Q structured feedback (score · strengths · gaps · improved answer).

## Cần thầy chốt / đã chốt
- ✅ Random toàn khóa (bỏ chọn chủ đề) · ✅ chặn chưa-enroll.
- Hỏi: giữ **5 câu/phiên** (như hiện tại) hay cho chọn số câu? (đề xuất giữ 5, đơn giản).
- Hỏi: stats landing hiện luôn hay chỉ sau phiên đầu? (đề xuất auto-hide khi 0 attempt).

---

## VÒNG 2 — 2026-06-25: setup screen đẹp hơn + level = tabs BLOCK (không underline)
> Thầy: *"chọn cấp độ nhớ là dùng tabs dạng block, không phải dạng underline; nghĩ giao diện gì hay hơn đi"*. Hiện setup quá trống (title + hint + underline tabs + 1 nút) — và level đang là `TabsCard` (underline), sai kiểu.

### Pain
- Level selector = `TabsCard` underline → thầy muốn **block/segmented** (pill, active = khối nền).
- Màn setup sparse/trống: chỉ title + hint + tabs + button, không kỳ vọng, không thành tích (stats chưa hiện vì BE chưa restart — nhưng kể cả có thì layout vẫn nhạt).

### Phân biệt 2 kiểu tabs (đính chính rule single-select→tabs)
- **Underline tabs (`TabsCard`)** = NAVIGATION / lọc nội dung phía dưới (đổi panel). Vd tab Nội dung/Thử thách, scope feed.
- **Block/segmented tabs (`SegmentedControl`)** = chọn 1 OPTION/SETTING gọn tại chỗ (không đổi panel lớn). Vd cấp độ phỏng vấn, công tắc tiền tệ. Active = khối nền (pill `bg-surface` trên track `bg-default`).
- → Level phỏng vấn là **setting pick** (không phải nav) → **`SegmentedControl` (block)**, KHÔNG underline. Bỏ giới hạn "chỉ 2–3 cái" của SegmentedControl: 5 lựa chọn gọn vẫn dùng block.

### Hướng (chốt A) — widget vòng 2
| Hướng | Là gì | ✅ |
|---|---|---|
| **A — card "sẵn sàng" gọn** ✅ đề xuất | hero mic + headline + 3 chip kỳ vọng (5 câu · giọng nói · AI chấm) + **level block-tabs** + stats gọn (best/avg/đã luyện) + 1 CTA lớn | rõ ràng, 1 primary action, có "what to expect" như app thật |
| B — stats-forward | dẫn bằng "điểm cao nhất" lớn + breakdown + weak chips, rồi level block + Start | hợp khi đã luyện nhiều; người mới ẩn stats |
→ **A** (gọn, kỳ vọng rõ). Refs: [Final Round AI](https://www.finalroundai.com/ai-mock-interview) · [Exponent](https://www.tryexponent.com/practice/ai-mock-interviews) · Codecademy interview simulator (chọn level + Begin nổi bật).

### Áp (sau khi thầy duyệt)
- `InterviewSession` setup: bọc trong **1 card** (`<Card><CardContent>`), thêm hero mic + headline `setupTitle` + 3 chip kỳ vọng; **level `TabsCard` → `SegmentedControl`** (block); stats row giữ (best/avg/đã luyện + breakdown chip) trong card; CTA "Bắt đầu phỏng vấn" `size="lg"` + icon mic.
- Block `SegmentedControl` (`blocks/navigation/SegmentedControl`) nhận `{items:[{value,label}], value, onChange, ariaLabel}` — generic, đã có.

---

## VÒNG 3 — 2026-06-27: "đơn giản quá + UI lệch → thêm tính năng, sáng tạo lên"
> Thầy: *"thêm tính năng chứ này có đơn giản quá không, với ui ux lệch quá — sáng tạo lên"*. Vòng 2 đã làm setup gọn (card + hero + 3 chip + segmented + CTA) NHƯNG: vẫn là wizard 1 bước, **nửa phải trống hoác** ("lệch"), và **đổ đi gần hết data giàu của BE**.

### Phát hiện: BE đã giàu, UI mới xài ~10%
Inventory lại (FE+BE+DB) → data đã có sẵn, chưa render:
| Nguồn | Field CHƯA dùng | Cơ hội |
|---|---|---|
| `gradeInterviewAnswer` | **`followUpQuestion`** · `modelAnswerHint` · `strengths[]`/`gaps[]` | đào sâu ADAPTIVE + scorecard |
| `myInterviewHistory` | **`weakTags[]`** · `bestScore` · pass/borderline/fail · `lastAttemptAt` | readiness hub + drill |
| `FlashcardCardEntity` | `level` (junior→staff) · `tags[]` · `answer`/`explanation` | thang cấp độ · reveal model answer |
| DB `InterviewAttemptEntity` | mỗi attempt: score/verdict/level/tags/createdAt | timeline "xem lại câu đã trả lời" |
| SRS `reviewFlashcard`/`myDueFlashcards` | — | **nối interview→flashcard** (câu trượt → ôn thẻ) |

### 3 hướng (widget đã vẽ — `show_widget interview_redesign_directions`)
- **A — Readiness Hub (ĐỀ XUẤT chính):** trang chờ thành **bento 2 cột** = (trái) hero + **mode picker** (Nhanh 5 / Sâu 10 / Điểm yếu / Leo cấp) + cấp độ segmented + CTA pink `lg`; (phải) **ring độ sẵn sàng** (`averageScore`/`bestScore`) + **thang cấp độ** (Junior/Mid/Senior/Staff) + **chủ đề cần ôn** (`weakTags` → chip drill). → sửa "đơn giản" (+mode/+readiness/+drill/+ladder) & "lệch" (dùng hết bề ngang bằng khối CÓ NGHĨA). User mới: ring 0% + nudge (không ẩn câm).
- **B — Phòng phỏng vấn nhập vai (in-session):** panel giám khảo (persona + câu + chip level/tag) | panel trả lời (mic + waveform + transcript live); sau chấm = **scorecard** (ring verdict + strengths/gaps 2 cột) + **`followUpQuestion` thành bước THẬT** ("Trả lời tiếp →") = adaptive (Skillora). Data đã có, chỉ chưa render như 1 bước.
- **C — Vòng khép kín interview↔flashcard:** trượt câu → "Thêm vào ôn tập" → câu (vốn là flashcard card) vào hàng đợi Học thẻ đến hạn (`reviewFlashcard`) → master → tái phỏng vấn → đạt. Nối 2 mode đang rời.

### Chốt
- **A + C** trước (A sửa đúng trang thầy chỉ; C = chiều sâu, low-BE). **B** vòng sau (đẹp nhất, đụng nhiều state in-session + cần persona).
- Giữ design-system StarCi (surface card + token + segmented + pink) — KHÔNG bê glassmorphism/orbs của ref. "Sáng tạo" = readiness ladder + drill + adaptive follow-up + loop SRS, KHÔNG phải hiệu ứng. Grounded, không vanity ([[progress-block-growing-quantity-headline-not-vanity-strip]]).

### BE add nhỏ (HỎI THẦY — không entity mới, chỉ mở rộng query)
1. `myInterviewHistory` breakdown theo `level` → cho thang cấp độ.
2. `drawInterviewCard` filter theo `tag` → mode "Điểm yếu" (drill weakTags) + "Leo cấp".
3. Expose `answer`/`explanation` post-grade → reveal model answer.
4. Query list `InterviewAttemptEntity` → timeline xem lại.
→ Lựa chọn: làm A bằng **data hiện có trước** (ring `averageScore`/`bestScore` + `weakTags` chip + mode Nhanh/Sâu) — thang-cấp-độ + tag-drill để vòng sau khi thầy duyệt BE add.

### Refs vòng 3
- [Google Interview Warmup](https://grow.google/) (RIP 2026-04 — model 5-câu/voice ta đang copy) · [Skillora](https://skillora.ai/) (adaptive follow-up + scorecard nhiều chiều) · [Exponent](https://www.tryexponent.com/practice) · [Huru](https://huru.ai/) · [Final Round AI](https://www.finalroundai.com/blog/best-ai-interview-practice-tools).

### ✅ CHỐT (thầy 2026-06-27) — làm Hướng A
- **Hướng A — Readiness Hub** (bento 2 cột). Bắt đầu bằng **data hiện có** (ring `averageScore`/`bestScore` + `weakTags` chip drill + mode Nhanh/Sâu/Điểm yếu/Leo cấp + cấp độ segmented); thang-cấp-độ + tag-drill chờ BE-add vòng sau.
- **DIRECTIVE UI:** nhãn "Kiểu luyện" + "Cấp độ" = block **`<Label>`** (HeroUI), KHÔNG `text-sm text-muted`/`text-xs text-muted` tay. Thầy: *"kiểu luyện cấp độ dùng Label nhé, không dùng text-sm text-muted"*. → rule: [[control-group-label-uses-label-block]] + `elements/label.md` §1b.
- Cấp độ giữ `SegmentedControl` (block, không underline — vòng 2). CTA "Bắt đầu phỏng vấn" `size="lg"` + icon mic.
- Next: `/starci-fe-ux-apply` để dựng.

### ĐÃ ÁP DỤNG 2026-06-27 (FE) — `/starci-fe-ux-apply`
- `InterviewSession` setup → **bento 2 cột** (`lg:grid-cols-[1.5fr_1fr]`):
  - **Trái** (Card): hero mic + 3 chip kỳ vọng + **Kiểu luyện** (`<Label>` + tile grid 2×2: Nhanh·5 / Sâu·10 bấm được, Điểm yếu / Leo cấp **disabled "Sắp có"**) + **Cấp độ** (`<Label>` + `SegmentedControl`) + CTA `lg` mic.
  - **Phải** (Card): **Độ sẵn sàng** (`<Label>` + headline `averageScore` + `ProgressMeter` + breakdown chip pass/borderline/fail) + **Chủ đề cần ôn** (`weakTags` chip, `border-t`). Loading = `Skeleton.Typography`+`Skeleton.Meter`; user mới (0 attempt) = meter 0 + nudge `readinessEmpty` (không ẩn câm).
- **Mode driver:** `SESSION_LENGTH` cố định → `mode` state (`quick`5 / `deep`10) → `sessionLength` (đổi expectCount + progress + isLastQuestion + advance).
- **Nhãn group = `<Label>`** (Kiểu luyện · Cấp độ · Độ sẵn sàng · Chủ đề cần ôn) — KHÔNG `text-sm/xs text-muted` (per [[control-group-label-uses-label-block]] · `elements/label.md` §1b).
- i18n thêm `flashcard.interview.{modeLabel,modeQuick,modeDeep,modeWeak,modeLadder,comingSoon,readinessTitle,readinessEmpty}` (vi+en). tsc + eslint + JSON sạch (baseline landing/blog WIP không liên quan).
- **Vòng sau (chờ BE-add):** mode Điểm yếu (tag-filter draw) + Leo cấp (per-level history) đang disabled "Sắp có"; weakTags chip hiện display-only (chưa drill). Active khi BE mở 4 query đã ghi ở §"BE add nhỏ".

---

## VÒNG 4 — 2026-06-27: bỏ chia đôi cột hẹp (1 cột) + block dùng chung `SelectableCardGroup` (HeroUI RadioGroup)
> Thầy: *"layout nhỏ rồi còn chia nữa; kiểu selectable card theo dạng tabs? 1 đống card chọn 1 cái sáng lên — nền tảng chưa có. Đọc code heroui rồi đề xuất component chung."*

### Pain
- **Bento 2 cột trong cột `max-w-3xl` (768px) = chia cái đã hẹp** → setup bị bóp, panel readiness bên phải hẹp/trống → "nhỏ rồi còn chia". Bố cục split chỉ hợp khi container RỘNG; 768px thì KHÔNG.
- **Mode tiles vòng 3 = `<button aria-pressed>` tự chế** (button-group toggle), KHÔNG phải single-select radio thật → a11y yếu (không arrow-key roving, role sai) + style lặp ở feature. Nền tảng **chưa có** component "chọn 1 card trong N".

### Đọc HeroUI (grounded — `node_modules/@heroui/react/dist/components`)
- Có sẵn: **`radio` + `radio-group`** (built trên `react-aria-components` `RadioGroup`/`Radio`). Cũng có `progress-circle` (RING native cho readiness), `button-group`, `tag-group`, `list-box`.
- `RadioRoot` (radio.js): `className: composeTwRenderProps(className, slots.base())` → **className NHẬN HÀM** `(values) => string` với `values.isSelected/isFocusVisible/isDisabled`; root mang **`data-selected="true"`**. → 1 `<Radio>` style được thành CARD: `data-[selected=true]:border-accent data-[selected=true]:bg-accent/10`, content tuỳ ý (icon + label + mô tả + badge), KHÔNG cần dot indicator.
- Đây là primitive ĐÚNG cho "chọn 1 trong N card sáng lên": RadioGroup = role radiogroup + arrow-key + single-select chuẩn. Hơn hẳn button-grid tự chế.

### ★ Đề xuất block chung — `blocks/navigation/SelectableCardGroup`
- **API:** `{ items: Array<{ value: T, label, description?, icon?, isDisabled?, badge? }>, value, onChange, ariaLabel, columns?: 1|2|3, className? }`.
- **Impl:** bọc HeroUI `RadioGroup` (`value`/`onChange` controlled, `aria-label`) + map item → `<Radio value isDisabled>` với className-hàm:
  - base: `flex items-center gap-2 rounded-xl border border-default px-3 py-3 text-sm cursor-pointer transition-colors hover:bg-default`
  - `isSelected` → `border-accent bg-accent/10 font-medium text-accent`
  - `isDisabled` → `cursor-not-allowed opacity-60 hover:bg-transparent` + render `badge` (vd "Sắp có") góc phải
  - `isFocusVisible` → `ring-2 ring-accent`
  - RadioGroup root className = `grid gap-2` + `columns` → `grid-cols-{n}`.
- **Khác `SegmentedControl`** (pill nhỏ, 1 hàng, chọn setting gọn) — `SelectableCardGroup` = card TO (icon + mô tả + badge), cho lựa chọn "nặng" hơn. **Khác `TabsCard`** (underline nav, đổi panel). Đây là single-select CONTROL dạng card.
- **Tái dùng:** kiểu luyện (interview) · cổng thanh toán (PaymentModal — hiện là list-card interactive tự chế, có thể chuyển) · chọn gói · bất kỳ "chọn 1 trong N card". 1 nguồn render ([[single-source-render]]).
- **Skeleton:** repo đã có `Skeleton/RadioGroup` → mirror.

### Layout fix — 1 CỘT (bỏ bento)
- `InterviewSession` setup về **1 cột** (full `max-w-3xl`), 1 Card, các section ngăn bằng gap/divider:
  hero → chip kỳ vọng → **readiness STRIP ngang** (full-width: ring `progress-circle` avg + cao nhất + breakdown chip — KHÔNG phải cột phải) → **Kiểu luyện** (`<Label>` + `SelectableCardGroup` columns=2) → **Cấp độ** (`<Label>` + SegmentedControl) → CTA `lg`.
- Readiness từ "cột phải hẹp" → "strip ngang gọn" → hết bóp. User mới: strip 0 + nudge (không ẩn câm).
- **Hỏi thầy:** readiness strip đặt TRÊN (status header, dưới chip kỳ vọng) hay DƯỚI CTA? (đề xuất: TRÊN — "đang ở đâu" rồi mới "cấu hình + bắt đầu").

### Refs
- HeroUI v3 RadioGroup/Radio (react-aria-components) — card-as-radio pattern (React Aria "RadioGroup" cards example) · [[single-select-among-options-use-tabs]] (phân biệt: setting nhỏ → segmented; card group → SelectableCardGroup) · [[control-group-label-uses-label-block]] (nhãn group = Label).

### Chốt (thầy duyệt 2026-06-27)
- Da card = **list-card surface** (`bg-surface` + `border-default`). **Selected = `bg-accent/10` + `border-accent`, CHỮ GIỮ `text-foreground` (đen) — KHÔNG `text-accent`** (thầy: *"text giữ màu đen tạm"*). Rule: [[selectable-card-group-surface-select-state]].

### ĐÃ ÁP DỤNG 2026-06-27 (FE)
- **Block mới `blocks/navigation/SelectableCardGroup`** (HeroUI `RadioGroup`/`Radio`): item `{value,label,description?,icon?,isDisabled?,badge?}` + `value/onChange/ariaLabel/columns`. Card-visual ở **inner `<div>`** (style theo render-prop `isSelected/isDisabled/isFocusVisible`) → KHÔNG fight `.radio` base unlayered (`flex items-start gap-3`). Selected `bg-accent/10 border-accent` (chữ foreground); disabled `opacity-60` + badge; focus `ring-2 ring-accent`. Da `rounded-xl border bg-surface`.
- `InterviewSession` setup → **1 CỘT** (bỏ bento `lg:grid-cols`): hero → chip kỳ vọng → **readiness STRIP ngang** (avg + `ProgressMeter` flex-1 + breakdown + weakTags, full-width) → **Kiểu luyện** = `SelectableCardGroup` columns=2 (thay button-grid tự chế) → **Cấp độ** SegmentedControl → CTA `lg`. Readiness đặt TRÊN (status header).
- tsc + eslint sạch (block + feature). i18n không đổi (đã thêm vòng 3).
- **Còn ngỏ:** thầy chưa chốt readiness TRÊN vs DƯỚI CTA — tạm để TRÊN, đổi dễ. weak/ladder vẫn disabled "Sắp có" (chờ BE-add).

---

## VÒNG 5 — 2026-06-30: TÁCH CARD (setup là 1 Card khổng lồ) + RENDER LỊCH SỬ phỏng vấn (seed + hiện list)
> Thầy: *"brainstorm lại trang này để render cho đẹp, tách card ra được không, tại còn lưu lịch sử phỏng vấn nữa. seed lịch sử và render ra"*. KHÔNG code (chờ `/starci-fe-ux-apply`). Widget đã vẽ (`interview_vong5_tach_card_history_directions`).

### Pain (đo lại FE/BE/DB qua 3 Explore agent)
1. **Setup = 1 `<Card>` khổng lồ** nhồi: hero + 3 chip + readiness strip + mode (`SelectableCardGroup`) + level (`SegmentedControl`) + model (`GradeModelDropdown`) + CTA. → 1 cột cao ngoằng, mọi field cùng trọng số, không phân cấp, mobile cuộn mệt, không quét nhanh được "tôi cần làm gì". Vi phạm tinh thần [[concepts/card]] (1 card = 1 bounded object có nghĩa, không nhồi mọi thứ).
2. **Lịch sử CHƯA render đúng nghĩa** — `myInterviewHistory` (aggregate) chỉ hiện ở readiness strip (avg/best/breakdown/weakTags). KHÔNG có: list per-attempt, ngày, trend, `lastAttemptAt` (fetch mà không hiện), retry. i18n `historyTitle`/`historyAnswered` ĐÃ có nhưng **unused** (chừa sẵn cho 1 history view chưa dựng).
3. **i18n key thiếu hiện raw:** `modelLabel`, `finishAndGrade`, `gradingSession`, `gradingProgress`, `perQuestionTitle`, `questionN` (code gọi `t(...)` nhưng key chưa có trong en/vi.json → hiện nguyên `flashcard.interview.modelLabel`).

### ⚠️ Ràng buộc DỮ LIỆU THẬT (grounded — quyết định cốt lõi của vòng này)
- **`myInterviewHistory(courseId?, flashcardDeckId?)` = AGGREGATE-ONLY**: `totalAnswered · averageScore · bestScore · passCount · borderlineCount · failCount · weakTags[≤6] · lastAttemptAt`. **KHÔNG có per-attempt list query.**
- **DB `interview_attempts`** (append-only log) CÓ ĐỦ data per-row: `score · verdict(pass/borderline/fail) · level · tags[] · createdAt · deck/card/enrollment` — NHƯNG **chưa expose ra GraphQL dạng list.**
- **Mỗi row = 1 CÂU TRẢ LỜI, KHÔNG group thành "phiên"** (không có `InterviewSessionEntity` / sessionId / startedAt-group). → "Lịch sử phỏng vấn" theo data thật = **timeline per-câu-đã-trả-lời**, KHÔNG phải "list các phiên 5/10 câu". (Group theo phiên = cần entity mới → defer, ngoài scope.)
- **KHÔNG persist:** transcript, strengths/gaps/hint, model đã chấm (ở `credit_usage_histories` rời), duration. → history list chỉ render được field ĐÃ lưu (ngày/điểm/verdict/level/tags). Đừng vẽ trend-chart/replay-answer (data không có).

### → 2 việc thầy yêu cầu, map ra hành động grounded
| Yêu cầu | Cách làm (grounded) |
|---|---|
| **"tách card ra"** | Bổ 1 Card khổng lồ → **3 `LabeledCard` dọc** cách `gap-6` (KHÔNG bento split — vòng 4 thầy đã bác chia đôi trong cột hẹp `max-w-3xl`): **(1) Bắt đầu phỏng vấn** (hero + chip kỳ vọng + mode + level + model + CTA `lg`) · **(2) Độ sẵn sàng** (readiness aggregate: điểm TB + ring + breakdown + weakTags) · **(3) Lịch sử phỏng vấn** (list). Mỗi card = 1 LabeledCard (label ngoài), tránh card-in-card. |
| **"lưu lịch sử + seed + render"** | History = **list per-câu-đã-trả-lời** (mỗi row: verdict icon + điểm + cấp độ chip + tag + thời gian tương đối; group header theo NGÀY cho ra "timeline"). **Cần 1 BE query MỚI** `interviewAttempts(courseId, limit, offset)` (DB có data, chỉ thiếu resolver) + **seed** rows `interview_attempts` (script kiểu `scratch/seed-leaderboard.cjs`: enrollment + cardIds + score/verdict/level/tags/createdAt rải vài ngày). Phân trang theo [[list-surface-anatomy-search-count-list-pagination]]. |

### 3 HƯỚNG (widget đã vẽ — chọn order + cách render history)
| Hướng | Thứ tự card | ✅ | ❌ |
|---|---|---|---|
| **A — Bắt đầu trước** | Start → Readiness → History | CTA lên đầu (1 primary action, quét nhanh "làm gì") | lịch sử ở đáy, người quay lại phải cuộn |
| **B — Độ sẵn sàng dẫn** ✅ ĐỀ XUẤT | Readiness → Start → History | vào thấy "tôi tới đâu" trước (động lực, đúng [[surface-lands-on-dashboard-no-auto-forward]] + [[progress-block-growing-quantity-headline-not-vanity-strip]]); user mới (0 attempt) → readiness rỗng tự thu gọn → CTA nổi lên | CTA dưới fold 1 chút cho người quay lại |
| **C — Start gọn + tab Lịch sử** | Start + 1 card 2 tab (Tổng quan ⇄ Lịch sử) | gọn nhất; lịch sử có "nhà" riêng + phân trang trong tab | thêm 1 lớp tab; readiness + history chen 1 card |
→ **CHỐT B** (progress-led): khối **Độ sẵn sàng** = headline có nghĩa (điểm TB + ring + breakdown + weakTags) dẫn đầu → "đang ở đâu / luyện tiếp", đúng họ dashboard-land + meter-có-nghĩa. **Start** giữ 1 primary action (CTA `lg` mic). **Lịch sử** = timeline per-câu (group theo ngày) + phân trang. User mới: readiness 0 + nudge (không ẩn câm — [[labeled-section-render-empty-not-self-hide]]), history empty-state "Chưa có lần phỏng vấn nào".
- **Refs:** [Interview Prep AI](https://apps.apple.com/us/app/interview-prep-ai-practice/id6756488628) (full history mọi phiên + review) · [Score My Interview](https://www.scoremyinterview.com/) (mọi câu đã chấm vào library, mở lại/sửa/nộp lại) · [Exponent](https://www.tryexponent.com/practice) · [Huru](https://huru.ai/) · readiness "proficiency matrix" (green ≥85 / amber 70-84 / red <70) [Mock interview tracker](https://medium.com/@codegrey/i-built-a-coding-interview-tracker-using-what-i-learned-from-pal-7605812dc7d5).

### Section → dữ liệu BE/DB
| Section (card) | Nguồn | Trạng thái |
|---|---|---|
| Bắt đầu (mode/level/model/CTA) | FE state + `drawInterviewCard` + `gradeInterviewAnswer` | ✅ có sẵn |
| Độ sẵn sàng | `myInterviewHistory(courseId)` (aggregate) | ✅ có sẵn (đang dùng) |
| **Lịch sử (list)** | **query MỚI `interviewAttempts(courseId, limit, offset)`** → mỗi item `{id, score, verdict, level, tags, createdAt, deckTitle?, question?}` | ⚠️ **BE-add** (DB `interview_attempts` đã có cột; chỉ thiếu resolver + response type) |
| Seed | script ghi thẳng `interview_attempts` (enrollment + card thật + score/verdict/level/tags/createdAt rải ngày) | ⚠️ **cần viết** (kiểu `scratch/seed-leaderboard.cjs`; local KHÔNG cần CDC vì là bảng thường, direct-insert OK) |

### ⚠️ BE phải add (báo thầy — KHÔNG entity mới, chỉ thêm 1 query + seed)
1. **Query `interviewAttempts(courseId?: ID, flashcardDeckId?: ID, limit: Int = 10, offset: Int = 0)`** → `[InterviewAttemptItem]` + `totalCount` (cho phân trang). Resolver scan `interview_attempts` theo `enrollmentId` (course) hoặc `userId`, order `createdAt DESC`, join `flashcard_decks.title` + (optional) `flashcard_cards.question`. Tái dùng `InterviewHistoryService` (cùng nguồn aggregate). Enrolled-only guard (như 3 resolver interview hiện có).
2. **Seed script** `scratch/seed-interview-history.cjs`: chọn 1 user + course enrolled → bốc N card gradable thật → insert ~15-25 rows `interview_attempts` (score 40-95, verdict suy từ score, level/tags từ card, `createdAt` rải 7-14 ngày) → để readiness + history list có data render ngay.

### FE phải đổi (sau khi BE add)
- `InterviewSession` setup: bổ 1 Card → **3 LabeledCard** (Độ sẵn sàng · Bắt đầu · Lịch sử), gap-6. Readiness tách khỏi card config.
- **Khối Lịch sử mới:** `LabeledCard "Lịch sử phỏng vấn"` (label + `lastAttemptAt` ở `labelEnd`?) → `SurfaceListCard` + `SurfaceListCardItem` rows (verdict icon + điểm + level chip + tags + relative-time), group header theo ngày, `Pagination` (ẩn khi ≤1 trang, căn trái + hover — [[list-pager-left-align-and-hover]]). Hook mới `useQueryInterviewAttemptsSwr(courseId, page)`. Empty/loading/error chuẩn `AsyncContent`.
- **Sửa i18n thiếu** (`modelLabel/finishAndGrade/gradingSession/gradingProgress/perQuestionTitle/questionN`) + thêm `history*` (vi+en) — fix luôn bug raw-key.
- Mode "Điểm yếu"/"Leo cấp" vẫn "Sắp có" (chờ BE tag-filter draw — vòng sau).

### A11y / states
- History empty (0 attempt) → `EmptyContent` "Chưa có lần phỏng vấn nào" + hint "Bắt đầu phỏng vấn để theo dõi tiến bộ" (KHÔNG ẩn câm card — [[labeled-section-render-empty-not-self-hide]]); readiness 0 + nudge (giữ vòng 4).
- Loading → skeleton mirror list rows. Error → retry.
- Verdict màu = semantic (pass success / borderline warning / fail danger), KHÔNG accent ([[elements/color]] §status).

### ✅ CHỐT (thầy 2026-06-30)
1. **Hướng B** — thứ tự card: **Độ sẵn sàng → Bắt đầu → Lịch sử** (3 LabeledCard dọc, gap-6).
2. **Lịch sử GROUP THEO PHIÊN** (không per-câu): mỗi dòng lịch sử = 1 phiên (5/10 câu) với điểm TB + breakdown + ngày + cấp độ + mode.
3. **BE add query + seed** — đồng ý.

### Cách làm GROUP-THEO-PHIÊN — NHẸ NHẤT, KHÔNG entity mới (chốt kỹ thuật)
Group theo phiên KHÔNG cần `InterviewSessionEntity` đầy đủ. Mỗi attempt đã append-only → chỉ cần **1 cột nhóm chung**:
- **DB:** thêm cột **nullable `interview_session_id` (uuid)** vào `interview_attempts` (+ index `(interview_session_id)`) + migration. KHÔNG bảng mới.
- **FE:** `startSession` sinh 1 `sessionId` (uuid client) → truyền vào MỌI `gradeInterviewAnswer` của phiên đó (thêm field `interviewSessionId` vào request). BE ghi vào cột mới mỗi row. (Phiên = các attempt cùng `interview_session_id`.)
- **BE query MỚI `interviewSessions(courseId?, limit, offset)`** → `{ items: [InterviewSessionSummary], totalCount }`, mỗi item GROUP BY `interview_session_id` trên `interview_attempts`:
  `{ sessionId, startedAt(min createdAt), questionCount(count), averageScore(avg), passCount/borderlineCount/failCount, level(mode của level trong phiên), weakTags[] }`. Aggregate tính lúc đọc (GROUP BY) — không materialize. Order `startedAt DESC`. Enrolled-only guard.
  - Legacy rows (seed cũ / trước khi có cột) `interview_session_id = null` → gom thành 1 nhóm "Trước đây" HOẶC bỏ qua (chốt lúc apply; đề xuất: bỏ qua null cho list, vẫn tính vào aggregate readiness).
- **Seed `scratch/seed-interview-history.cjs`:** 1 user+course enrolled → bốc card gradable thật → tạo ~5-8 PHIÊN, mỗi phiên 5-10 attempt CHUNG `interview_session_id`, `createdAt` rải 7-14 ngày, score 40-95 (verdict suy từ score), level/tags từ card. → readiness + list phiên có data render ngay.
- `myInterviewHistory` (aggregate readiness) **GIỮ NGUYÊN** (không cần đổi — vẫn quét toàn bộ attempts của course).

### FE render khối Lịch sử (sau BE add)
- `LabeledCard "Lịch sử phỏng vấn"` → list các **phiên** = `SurfaceListCard` + `SurfaceListCardItem` (mỗi row: ngày/relative-time + điểm TB lớn + breakdown chip đạt/cận/chưa + cấp độ chip + `questionCount` câu). `Pagination` căn trái + hover, ẩn khi ≤1 trang ([[list-pager-left-align-and-hover]] + [[list-surface-anatomy-search-count-list-pagination]]). Hook `useQueryInterviewSessionsSwr(courseId, page)`. Empty `EmptyContent` "Chưa có lần phỏng vấn nào" + hint; loading skeleton mirror; error retry.
- (Tùy chọn pha sau) bấm 1 phiên → drawer chi tiết per-câu của phiên (data per-attempt vẫn có) — như [[attempt-history-selector-adaptive-and-grading-model-chip]] drawer. Defer.

### Việc cho `/starci-fe-ux-apply` (tổng hợp)
1. **BE:** cột `interview_session_id` + migration · request `gradeInterviewAnswer` thêm `interviewSessionId?` · query `interviewSessions` (resolver + service GROUP BY + response type) · seed script. **Restart backend** (đổi schema).
2. **FE:** tách 3 LabeledCard (Độ sẵn sàng → Bắt đầu → Lịch sử) · `startSession` sinh sessionId truyền vào grade · khối Lịch sử list-phiên + pagination + hook · fix i18n thiếu (`modelLabel/finishAndGrade/gradingSession/gradingProgress/perQuestionTitle/questionN`) + thêm `history*` (vi+en).

### ✅ ĐÃ ÁP DỤNG 2026-06-30 (`/starci-fe-ux-apply`)
**BE (`starci-academy-backend`):**
- `InterviewAttemptEntity` + cột `interview_session_id` (nullable uuid) + index `idx_interview_attempts_session` + migration `1720500000000-AddSessionIdToInterviewAttempts` (dev tự synchronize).
- `gradeInterviewAnswer` request + `GradeInterviewAnswerParams` + handler + `InterviewGradingService.grade`/`recordAttempt` → thread `interviewSessionId` → lưu lên attempt.
- Query MỚI `interviewSessions(courseId?, flashcardDeckId?, limit=10, offset=0)` → module `interview-sessions` (resolver + response type `InterviewSessionItem`/`InterviewSessionsData`) đăng ký trong `flashcard-decks.module`. `InterviewHistoryService.getSessions` GROUP BY `interview_session_id` (window 1000) → summary mỗi run (questionCount/avg/best/verdict breakdown/level mode) + `resolveScope` dùng chung.
- Seed `scratch/seed-interview-history.cjs`: 3 user THẬT enrolled FS × 6 phiên (45 answers/người, score trending up, rải 7-14 ngày). ĐÃ CHẠY.
- tsc `src/` sạch (lỗi còn lại = baseline Stripe/.spec, không phải file interview).

**FE (`starci-academy`):**
- `InterviewSession` setup → **3 `LabeledCard`** dọc gap-6: **Độ sẵn sàng** (`GaugeIcon`, ẩn khi 0 attempt → CTA nổi) → **Bắt đầu phỏng vấn** (`MicrophoneIcon`: subtitle + chips + mode `SelectableCardGroup` + level `SegmentedControl` + model `GradeModelDropdown` + CTA `lg`) → **`InterviewHistory`**. Bỏ hero mic to + `Card`/`CardContent`.
- `startSession` sinh `sessionId = crypto.randomUUID()` (ref) → truyền `interviewSessionId` vào mỗi `gradeAnswer`.
- Component MỚI `InterviewHistory/` = `LabeledCard frameless` + `AsyncContent` + `SurfaceListCard`/`SurfaceListCardItem` (mỗi row: ngày locale + N câu + verdict chips non-zero + level chip + điểm TB lớn) + `Pagination` (trái + hover, ẩn ≤1 trang, page-size 5). Hook `useQueryInterviewSessionsSwr` + query `queryInterviewSessions` + types.
- Fix 6 i18n key thiếu + thêm `historyTitle`(repurpose)/`historyEmpty`/`historyEmptyHint`/`historyError`/`historyQuestionCount` (vi+en). JSON valid.
- **tsc 0 lỗi · eslint sạch** (file đụng tới).

### ⚠️ CHẠY ĐƯỢC cần (runtime, CHƯA verify mắt)
1. **Restart backend** (`npm run start:dev`) — Nest watch KHÔNG tự nạp module query mới; schema hiện chưa có `interviewSessions` (probe `false`). Restart → synchronize thêm cột + resolver đăng ký.
2. **Đăng nhập 1 user đã seed** (`pakoohacha588` / `cuongnvtse160875` / `levan020305`) ở khóa **Fullstack Mastery** → trang Ôn tập › Phỏng vấn thử để thấy 3 card + readiness có số + list 6 phiên.
- Chưa verify mắt (cần BE restart + login seeded-user). Mode "Điểm yếu"/"Leo cấp" vẫn "Sắp có". Drawer chi tiết per-câu của 1 phiên = defer (pha sau).

---

## VÒNG 6 — 2026-06-30: tách tiếp card CẤU HÌNH thành các labeled card (thầy soi bản vòng 5 live)
> Thầy (screenshot bản vòng 5 đã live): *"kiểu thầy bảo em tách layout thằng này ra thành các labeled card ấy"*. Card "Bắt đầu phỏng vấn" hiện vẫn gộp chips + Kiểu luyện + Cấp độ + Model chấm + CTA = 1 khối to → tách tiếp.

### Tension (rule)
[[concepts/card]] cho phép **nhiều LabeledCard ngang hàng** (mỗi cái nhãn riêng, gap-6) — KHÁC "2 box dính không nhãn" (cấm). NHƯNG "card chỉ cho thứ XỨNG là bounded object; 1 control/hành động đơn → KHÔNG phải card". → tách per-control (Cấp độ 1 segmented, Model 1 dropdown thành card riêng) = card mỏng/thừa. Cần gộp theo NGHĨA.

### 3 hướng (widget `interview_setup_split_into_labeled_cards`)
| Hướng | Cách tách | ✅ | ❌ |
|---|---|---|---|
| **A — gộp theo nghĩa · 2 card** ✅ ĐỀ XUẤT | Readiness · **"Cấu hình phiên"** (Kiểu luyện + Cấp độ) · **"Chấm điểm"** (Model + ghi chú) · CTA phẳng · Lịch sử | mỗi card 1 ý rõ (phiên gì / chấm sao); không card 1-control; đúng "card xứng đáng" | "Chấm điểm" chỉ 1 dropdown → thêm 1 dòng helper cho có thân |
| **B — mỗi nhóm 1 card · 3 card** | Readiness · Kiểu luyện · Cấp độ · Model chấm · CTA · Lịch sử | sát nghĩa "tách hết"; mỗi nhãn 1 card | Cấp độ/Model = 1 control → card mỏng; 5-6 card xếp dọc (nặng) |
| **C — giữ 1 card cấu hình** (bản vòng 5) | Readiness · Bắt đầu (gộp) · Lịch sử | gọn, cấu hình = 1 việc = 1 card | thầy thấy còn to |
→ Đề xuất **A**: tách card cấu hình thành **2 card có nghĩa** ("Cấu hình phiên" = mode+level · "Chấm điểm" = model), CTA phẳng dưới (lone CTA không bọc card). Chips kỳ vọng (5 câu/giọng/AI) + subtitle → strip phẳng dưới header trang (meta, không card). Giữ Readiness (ẩn khi 0) + Lịch sử.

### ✅ CHỐT + ĐÃ ÁP DỤNG 2026-06-30 (thầy chọn A + chips strip phẳng)
- `InterviewSession` setup giờ: **meta strip phẳng** (subtitle + 3 chip kỳ vọng, KHÔNG card) → **Độ sẵn sàng** (LabeledCard, ẩn khi 0) → **"Cấu hình phiên"** (LabeledCard `SlidersHorizontalIcon`: Kiểu luyện + Cấp độ) → **"Chấm điểm"** (LabeledCard `RobotIcon`: Model dropdown + helper 1 dòng cho thân card) → **CTA `lg` phẳng** (không bọc card) → **Lịch sử phỏng vấn**.
- Bỏ `setupTitle` khỏi label (page header đã frame); helper `gradeHelper` cho card "Chấm điểm" đỡ mỏng. i18n thêm `configTitle/gradeTitle/gradeHelper` (vi+en). tsc 0 · eslint sạch. BE KHÔNG đổi.
- Nguyên tắc rút ra (cho `/merge`): tách 1 card cấu hình → các LabeledCard ngang hàng **gộp theo NGHĨA** (what-to-practice vs how-graded), KHÔNG per-control (1 segmented/1 dropdown thành card = mỏng, vi phạm "card xứng đáng"); control lẻ mỏng → thêm 1 dòng helper cho thân; CTA đơn để **phẳng** ngoài card; meta "trò chơi này là gì" (subtitle + chips kỳ vọng) = **strip phẳng dưới header**, không bọc card.

---

## VÒNG 7 — 2026-06-30: BỎ meta strip + thống nhất control card "Cấu hình phiên" = button radio (insideCard)
> Thầy (screenshot bản vòng 6): *"xóa cái xanh trên"* (= meta strip subtitle+chips) + *"render 1 là button radio hết cả 2 chứ? dùng insideCard nhé. thầy đề xuất vậy, trò có phương án nào hay hơn k"*.

### Chốt cứng
- **XÓA meta strip** (subtitle "Câu hỏi ngẫu nhiên..." + 3 chip 5câu/giọng/AI) — thầy thấy thừa. (Đính chính vòng 6: strip phẳng → bỏ hẳn.)
- **Cả Kiểu luyện + Cấp độ → `FlexWrapButtonRadio insideCard`** (selected=primary, còn lại=tertiary) trong card "Cấu hình phiên". Thay `SelectableCardGroup` (card to) + `SegmentedControl` → đồng nhất 1 kiểu control, gọn.

### 3 phương án (widget `interview_config_control_type_options`) — khác ở "Sắp có" + Cấp độ
| Hướng | Kiểu luyện | Cấp độ | Ghi chú |
|---|---|---|---|
| **A — thầy đề xuất** | 4 pill (2 disabled "Sắp có") | 5 pill | đúng ý; nhưng 2 pill "Sắp có" = nút ma mờ, hơi rối |
| **B — ĐỀ XUẤT (hay hơn)** | 2 pill (Nhanh/Sâu) | 5 pill | cùng button-radio insideCard NHƯNG **bỏ 2 mode chưa làm** → sạch, hết nút ma; re-add khi BE xong (tag-draw/per-level). FE pain "disabled options waste space" được giải. |
| **C — theo ngữ nghĩa** | 2 pill | **GIỮ SegmentedControl** | Cấp độ là **thang ordinal** (Tất cả→Staff) → segmented (track liền) đọc ra "thang" tốt hơn nút rời. Nhưng 2 control khác kiểu (mất đồng nhất thầy muốn). |
→ **Đề xuất B**: theo đúng thầy (button-radio cả 2, insideCard) + nâng = **bỏ 2 pill "Sắp có"** (nút disabled mờ trong dải pill trông rối hơn là trong card-grid; và đó là clutter đã ghi nhận). "Điểm yếu"/"Leo cấp" re-add khi mở BE. Lưu ý C: nếu thầy coi trọng "Cấp độ = thang" thì giữ segmented cho Cấp độ (nhưng thầy muốn đồng nhất → B thắng).
- Block: `FlexWrapButtonRadio` ([[elements/card]] §3f) — đã có. BE KHÔNG đổi.

### ✅ ĐÃ ÁP DỤNG 2026-06-30 (thầy chốt B)
- **Bỏ meta strip** (subtitle + 3 chip) khỏi setup.
- Card "Cấu hình phiên": **Kiểu luyện** + **Cấp độ** đều → `FlexWrapButtonRadio insideCard` (selected=primary, còn lại=tertiary). Kiểu luyện = **2 pill Nhanh/Sâu** (bỏ "Điểm yếu"/"Leo cấp" disabled — re-add khi BE tag-draw/per-level); Cấp độ = 5 pill (Tất cả/Junior/Middle/Senior/Staff). content = `<span flex gap-2>` icon+label (mode) / text (level).
- Dọn: bỏ `SelectableCardGroup`/`SegmentedControl`/`comingSoonBadge` + icon `TargetIcon`/`StairsIcon`/`ListNumbersIcon` (unused). i18n `expectCount/expectVoice/expectAiGrade/comingSoon/modeWeak/modeLadder/setupSubtitle/setupTitle` còn nhưng mồ côi (giữ, re-add khi cần). tsc 0 · eslint sạch · BE KHÔNG đổi.
- Setup giờ: **Độ sẵn sàng** → **Cấu hình phiên** (2 dải button-radio) → **Chấm điểm** (model + helper) → **CTA phẳng** → **Lịch sử**.

---

## VÒNG 8 — 2026-06-30: GOM cả setup về 1 card + Độ sẵn sàng (kết quả+progress) LUÔN hiện + Chấm điểm xuống dưới CTA
> Thầy (screenshot + chat): *"gom lại 1 card với show ra kết quả phỏng vấn với progress"* → chốt (qua hỏi): **gom CẢ setup về 1 card**; **"kết quả phỏng vấn với progress" = khối Độ sẵn sàng LUÔN hiện** (kể cả user mới = 0% + nudge). Rồi: *"chấm điểm bỏ dưới bắt đầu phỏng vấn, dùng component xài chung ấy, không cần giải thích tự động ="*.

### Đảo hướng (có chủ đích) — gom thay vì tách
- Vòng 5-7 TÁCH setup thành nhiều LabeledCard; vòng 8 thầy đổi ý → **GOM CẢ setup về 1 `<Card>`** (Độ sẵn sàng + Kiểu luyện + Cấp độ + CTA + Chấm điểm). Section trong card ngăn bằng `<Label>` + 1 divider `border-t` (tách "kết quả" với "cấu hình"). **"Lịch sử phỏng vấn" GIỮ card riêng** (gom = chỉ khu setup).
- **Độ sẵn sàng = LUÔN hiện** (bỏ gate ẩn-khi-0 của vòng 5): có data → điểm TB + `ProgressMeter` + breakdown + weakTags; user mới (0) → meter 0% + nudge (`readinessEmpty`); loading → skeleton. Đây là "kết quả phỏng vấn với progress" thầy muốn — đặt TRÊN đầu card (where am I) rồi mới cấu hình + bắt đầu.

### Thứ tự trong card (CHỐT)
Độ sẵn sàng (kết quả+progress) → `border-t` → Kiểu luyện (button-radio) → Cấp độ (button-radio) → **CTA "Bắt đầu phỏng vấn"** → **Chấm điểm** (xuống DƯỚI CTA). Chấm điểm = control phụ (Auto mặc định, ít đổi) → để cuối, dưới CTA; dùng **`GradeModelDropdown` (component model chung)** — dropdown tự self-label (sparkle + tên model) nên **bỏ dòng helper "Tự động = ..."** (thầy: *"không cần giải thích"*).

### ĐÃ ÁP DỤNG 2026-06-30
- `InterviewSession` setup: 3-4 LabeledCard → **1 `<Card><CardContent gap-6>`** (Độ sẵn sàng luôn-hiện + `border-t pt-6` wrapper cho config) + `<InterviewHistory>` card riêng dưới. Chấm điểm chuyển xuống dưới CTA, bỏ helper.
- Dọn import: bỏ `LabeledCard` + icon `GaugeIcon`/`SlidersHorizontalIcon`/`RobotIcon` (section giờ chỉ `<Label>`, không icon). Re-add `Card`/`CardContent`. i18n `gradeHelper` còn nhưng mồ côi. tsc 0 · eslint sạch · BE KHÔNG đổi.
- **Nguyên tắc (cho `/merge`):** "tách" hay "gom" card tùy thầy theo từng màn — đây là đảo hướng có chủ đích (không phải lỗi). Khi gom 1 card: section trong card = `<Label>` + whitespace (+1 divider tách 2 cụm nghĩa lớn: kết quả ↔ cấu hình); control PHỤ (model, Auto-default) đặt **dưới CTA** + dropdown chung tự-label (bỏ helper thừa). Readiness/kết-quả-có-progress đặt TRÊN ĐẦU card (status "đang ở đâu").

### Tinh chỉnh cuối 2026-06-30 (model row kiểu submit-panel + divider gap-3 + footer)
- **Divider trong card = gap-3 hai bên** (CardContent `gap-3` trên + wrapper `pt-3` dưới = 12px mỗi bên), KHÔNG gap-6 (thầy: *"hai block gap-6 thấy xa"*). → canon [[gap]] §divider.
- **Bỏ label "Chấm điểm".** Model render **giống panel Nộp bài** (`như hình bên phải`): `GradeModelDropdown` + `text-sm text-muted` "tier • used/quota credit" (reuse `useQueryMyCreditUsageSwr` + i18n `challenge.quota.laneUsage.{auto,premium,byok}`) trên 1 hàng `justify-between`.
- **Cấu trúc card cuối:** Độ sẵn sàng (kết quả+progress) → *divider gap-3* → **Cấu hình** (Kiểu luyện + Cấp độ) → *divider gap-3* → **footer** (model row compact + credit · CTA "Bắt đầu phỏng vấn"). Footer = model NGAY TRÊN CTA (như submit-panel), divider phía trên footer. Lịch sử = card riêng dưới.
- i18n `gradeTitle`/`gradeHelper` giờ mồ côi (giữ). tsc 0 · eslint sạch · BE KHÔNG đổi.
- **Fix bug runtime:** `enrollmentId` là `@RelationId` (virtual) → KHÔNG dùng được trong `where` (lỗi `EntityPropertyNotFound`). Sửa `getSummary` + `resolveScope` dùng `where: { enrollment: { id } }` (lọc qua relation), KHÔNG thêm `@Column`. Áp cho cả `myInterviewHistory` (bug latent cũ) lẫn `interviewSessions`.

---

## VÒNG 9 — 2026-06-30: Lịch sử phỏng vấn → thêm "xem chi tiết phỏng vấn" (drawer per-câu)
> Thầy (trang đã chạy end-to-end): *"lịch sử phỏng vấn thêm xem chi tiết phỏng vấn"*. Bấm 1 phiên → xem các câu đã trả lời của phiên đó.

### ⚠️ Ràng buộc data (grounded)
- `interview_attempts` lưu per-câu: **score · verdict · level · tags · createdAt · flashcard_card_id**. Question text join từ **`flashcard_cards.question`**.
- **KHÔNG lưu**: strengths/gaps/modelAnswerHint/followUpQuestion/transcript (transient — chỉ trả ngay sau phiên ở màn summary, không persist). → Chi tiết phiên CŨ chỉ render được **câu hỏi · verdict · điểm · level/tag**, KHÔNG có góp ý chi tiết.

### Đề xuất (widget `interview_session_detail_drawer`)
- **Mở = DRAWER** (phải desktop / bottom mobile) — bấm cả dòng phiên (cursor + chevron). Theo [[when-drawer]] + pattern `SubmissionResultHistoryDrawer`/`SubmissionAttemptsDrawer`. Tách component `components/drawers/InterviewSessionDetailDrawer/` (props-driven: open + sessionId + summary). KHÔNG inline.
- **Nội dung drawer:** header (ngày · N câu · level) + summary (điểm TB + breakdown chip) + **danh sách câu** = mỗi câu: "Câu N" + verdict chip + điểm + question (`MarkdownContent` compact) + level/tag. Empty/loading/error chuẩn.
- **BE: query MỚI `interviewSessionAttempts(courseId?, sessionId: ID!)`** → các attempt của session (order createdAt ASC) join `flashcard_cards.question`; mỗi item `{ id, score, verdict, level, tags, question, createdAt }`. Scope qua `enrollment`/`userId` như getSessions. Enrolled-only guard.

### 2 mức chi tiết (cần thầy chốt)
| Mức | Là gì | BE | Áp cho data cũ? |
|---|---|---|---|
| **A — grounded (ĐỀ XUẤT)** | câu hỏi · verdict · điểm · level/tag | 1 query mới (join card) | ✅ mọi phiên (kể cả seed cũ) |
| **B — full feedback** | thêm strengths/gaps/hint mỗi câu (như màn summary) | A + **persist** cột strengths/gaps/hint vào `interview_attempts` + ghi lúc grade + migration | ❌ chỉ phiên MỚI (cũ không có → vẫn chỉ A) |
→ **A trước** (universal, ship ngay). B chỉ giúp phiên tương lai (data cũ/seed không có feedback) → defer, làm khi thầy muốn richer.

### Refs
- [Interview Prep AI](https://apps.apple.com/us/app/interview-prep-ai-practice/id6756488628) · [Score My Interview](https://www.scoremyinterview.com/) (mở lại từng câu đã chấm) · pattern drawer repo: `SubmissionResultHistoryDrawer`.
- Chờ thầy chốt A/B + drawer/page → áp.

### ✅ CHỐT + ĐÃ ÁP DỤNG 2026-06-30 (thầy chọn B + drawer)
**BE:**
- `InterviewAttemptEntity` + 3 cột `strengths`/`gaps` (jsonb `[]`) + `model_answer_hint` (varchar nullable) + migration `1720600000000-AddFeedbackToInterviewAttempts`.
- `recordAttempt` persist `result.strengths/gaps/modelAnswerHint` lúc grade (feedback giờ lưu, không còn transient).
- Query MỚI **`interviewSessionAttempts(sessionId!, courseId?, flashcardDeckId?)`** → module `interview-session-attempts` + `InterviewHistoryService.getSessionAttempts` (relations `flashcardCard` → question, order createdAt ASC, scope qua `enrollment`). Đăng ký `flashcard-decks.module`.
- **Backfill** feedback mẫu (vi) vào 137 attempt đã seed (theo verdict) → drawer của user seeded hiện đủ.
- tsc `src/` sạch · reboot clean · `interviewSessionAttempts` trong schema.

**FE:**
- Drawer MỚI `components/drawers/InterviewSessionDetailDrawer/` (props-driven: isOpen/onOpenChange/courseId/session). Shell chuẩn (Drawer.Backdrop/Content placement right·bottom/Dialog p-0/Body + ScrollShadow h-full). Summary header (avg + breakdown) + danh sách câu = `AttemptCard` (verdict chip + điểm + question `MarkdownContent` + level/tag + strengths/gaps/hint khi có). `AsyncContent` loading/empty/error.
- `InterviewHistory`: row → `SurfaceListCardItem onPress` + `CaretRightIcon` → mở drawer (`selectedRun` state). Hook `useQueryInterviewSessionAttemptsSwr` (chỉ fetch khi drawer mở).
- i18n `detailTitle/detailEmpty/detailError` (vi+en). tsc 0 · eslint sạch.

**Data cũ (không backfill):** strengths/gaps `[]` → drawer chỉ hiện verdict/điểm/question (graceful). Phiên MỚI (grade sau đổi) tự có feedback đầy đủ.
- Em chưa push gì.
