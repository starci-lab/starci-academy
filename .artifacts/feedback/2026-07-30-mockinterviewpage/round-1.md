# Vòng 1 — 2026-07-30 (MockInterviewPage)

## Ma trận cuối (8 vùng × 15 trục = 120 ô, không ô trống)

| Vùng | flow | prom | async | frame | naming | seam | inset | surf | text | icon | color | button | press | md | skel |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 PlaygroundSetupHeader | ĐẠT | ĐẠT | N/A | ĐẠT | ĐẠT | N/A | N/A | N/A | ĐẠT | ĐẠT | ĐẠT | N/A | ĐẠT | **LỆCH** | ĐẠT |
| R2 MockInterviewSetup | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | N/A | ĐẠT | **LỆCH** |
| R3 WorkSessionHeader | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | **LỆCH** | N/A | **LỆCH** | ĐẠT | **LỆCH** | ĐẠT | **LỆCH** | ĐẠT | **LỆCH** |
| R4 InterviewerPresence | ĐẠT | ĐẠT | N/A | **LỆCH** | **LỆCH** | **LỆCH** | N/A | N/A | **LỆCH** | ĐẠT | ĐẠT | **CÂM** | N/A | **LỆCH** | N/A |
| R5 VoiceHero | **CÂM** | ĐẠT | N/A | ĐẠT | **LỆCH** | ĐẠT | N/A | N/A | ĐẠT | ĐẠT | ĐẠT | **LỆCH** | ĐẠT | N/A | N/A |
| R6 MockInterviewAnswerAction | ĐẠT | ĐẠT | N/A | N/A | ĐẠT | N/A | N/A | **LỆCH** | ĐẠT | ĐẠT | N/A | ĐẠT | ĐẠT | N/A | N/A |
| R7 SubmissionResultHeader | ĐẠT | ĐẠT | N/A | ĐẠT | ĐẠT | N/A | N/A | N/A | ĐẠT | ĐẠT | ĐẠT | N/A | ĐẠT | **LỆCH** | ĐẠT |
| R8 MockInterviewScorecard | ĐẠT | ĐẠT | ĐẠT | ĐẠT | **LỆCH** | **LỆCH** | N/A | ĐẠT | **LỆCH** | ĐẠT | ĐẠT | ĐẠT | N/A | **LỆCH** | **LỆCH** |

**Đếm:** 66 ĐẠT · **21 LỆCH** · **2 CÂM** · 31 N/A. (Kiến trúc quét: B2a theo TRỤC — 15 agent, mỗi
agent đọc 1 file canon một lần, phán cho cả 8 vùng — B2b gom NGHI NGỜ theo trục — 15 agent, mỗi
agent đọc Phần A+B một lần cho mọi vùng nghi của trục đó. Không phải một-ô-một-agent.)

---

## Chi tiết 21 ô LỆCH

### R4 InterviewerPresence × frame
- đang: `InterviewerPresence.tsx` có 2 chỗ dùng `StackH ... justify="between"` bọc đúng 2 phần tử
  vai trò cố định đầu↔cuối (header-row: identity-block↔nút TTS, dòng 144; identity-block:
  Avatar↔StackV(name,role), dòng 145) — một phía cần co, phía kia cỡ cố định.
- đúng: cây §2 câu 2 (N=2, vai cố định đầu↔cuối, một phía co) ⇒ `Split`. Cặp `Stack.H↔Split` đã
  chốt ở §3a; bẫy §4 mục 2 ghi đúng: `Split` 0 người dùng thật ngoài story của chính nó.
- sửa ở: block — `InterviewerPresence.tsx`, 2 chỗ: header-row và identity-block.
- chỗ khác giống: `QuotaBar.tsx:131-134` (chính ví dụ canon tự trích).

### R4 InterviewerPresence × naming
- đang: `speaking`, `ttsSupported`, `ttsEnabled` không có tiền tố `is-`, trong khi `isAsking` ở
  CÙNG interface có.
- đúng: §2 câu 7 + Cặp 7 — boolean cùng interface phải đối xứng `is-`. Neo: ≥20 ca boolean dạng
  -ing/-ed trong `.storybook/components` đều `is-`.
- sửa ở: block — `InterviewerPresence.tsx` (props+destructure+JSDoc) + `MockInterviewPage.tsx`
  (đang giữ nguyên tên không `is-` ở tầng page — cùng lỗi lặp).
- chỗ khác giống: `InterviewerPresence.stories.tsx`.

### R5 VoiceHero × naming
- đang: `sttSupported`, `listening` không có tiền tố `is-`.
- đúng: cùng luật §2 câu 7. Neo: `isDesignAvailable` (cùng feature, cùng hình `-Available`) dùng
  đúng `is-`; đây không phải quy ước riêng được chấp nhận (khác `showAnatomy`, ≥40 chỗ nhất quán).
- sửa ở: block — `VoiceHero.tsx` + story + `MockInterviewPage.tsx`.
- chỗ khác giống: `VoiceHero.stories.tsx`.

### R8 MockInterviewScorecard × naming
- đang: prop tên `phaseOrQuestionScores`.
- đúng: JSDoc đầu file tự nhận "verbatim" theo BE contract, nhưng nguồn thật
  `src/components/features/learn/MockInterview/types.ts:140` tên là `phaseScores` — đã tự mâu
  thuẫn với lời khai của chính nó.
- sửa ở: block — `MockInterviewScorecard.tsx` (interface+destructure+`.map`+JSDoc).
- chỗ khác giống: `MockInterviewScorecard.stories.tsx` (call-site).

### R4 InterviewerPresence × seam
- đang: `<StackV gap="related">` (8px) bọc [identity-row][question-region].
- đúng: bẫy §4 mục 3 (`seam/context.md`) — "hai composite mà một cái là caption của cái kia ⇒
  grouped". Identity-row là caption của question-region, không phải 2 peer ngang hàng.
- sửa ở: block — `InterviewerPresence.tsx` dòng 143, đổi `gap="related"` → `gap="grouped"`.
- chỗ khác giống: `MockInterviewSetup`, `WorkSessionHeader` — chỉ nêu tên, chưa kiểm.

### R8 MockInterviewScorecard × seam
- đang: dòng 265 `gap="grouped"` cho [promptTitle, createdAt]; dòng 356 `gap="grouped"` cho hàng
  3 nút CTA.
- đúng: thang §1 liệt tường minh cả hai ví dụ này ở bậc `related` (8px: "hai nút", "tên và mốc
  thời gian"). Đối chiếu chéo: `MockInterviewSetup` (cùng nhóm) dùng đúng `related` cho hàng nút.
- sửa ở: block — `MockInterviewScorecard.tsx` dòng 265, 356.
- chỗ khác giống: không, các seam khác trong cùng file đã đúng cây.

### R3 WorkSessionHeader × inset
- đang: `border-b border-default bg-surface` bọc 2 `StackH`, không `p-*` nào — nội dung chạm sát
  mép trái/phải.
- đúng: đã tự vẽ biên (border+bg khác nền trang) ⇒ Q2 cây §2 = "mặt trong đã có biên nhìn thấy
  ngay" ⇒ `cozy`. Neo: `Navbar.tsx:375-380` cùng nhóm `navigation`, cùng tổ hợp class, đã tự cấp
  `px-3`.
- sửa ở: block — `WorkSessionHeader.tsx`, thêm `className="px-3"` lên `StackH` đầu tiên.
- chỗ khác giống: không có trong batch, đã có neo `Navbar` đối chiếu.

### R3 WorkSessionHeader × text
- đang: title dòng 125: `size="sm" weight="bold"` (14px + font-bold thật).
- đúng: §1b — `bold` chỉ đi với heading, không bao giờ ở body-sm. Title đứng chung hàng với
  backLabel/counter/timeLeft (không phải tâm điểm riêng) ⇒ Tier B (sm+medium), khớp `timeLeft`
  cùng hàng (dòng 129).
- sửa ở: block — `WorkSessionHeader.tsx` dòng 125, `weight="bold"` → `weight="medium"`.
- chỗ khác giống: chưa grep ngoài batch này.

### R4 InterviewerPresence × text
- đang: persona.name không khai `size` (mặc định base+medium — tổ hợp ngoài bảng); persona.role
  `size="sm"` (đáng lẽ `xs`).
- đúng: Tier B (sm+medium, neo `ListRow`/`UserCell`) cho name; Tier D (xs regular, neo
  `FeedItem`) cho role. Sibling `MockInterviewSetup` (cùng feature, cùng vai) đã đúng cả hai.
- sửa ở: block — `InterviewerPresence.tsx`: thêm `size="sm"` cho name, đổi `sm`→`xs` cho role.
- chỗ khác giống: `MockInterviewSetup` dùng làm neo đối chiếu (đã đúng, không sửa).

### R8 MockInterviewScorecard × text
- đang: `ScoreRow.label`/`ScoreRowSkeleton` (dòng 198, 207) không khai `weight` ⇒ regular.
- đúng: Tier B (sm+medium) cho "1 hàng trong list dày đặc" — neo `ListRow`/`UserCell` cùng prop
  `truncate`.
- sửa ở: block — `MockInterviewScorecard.tsx` dòng 198, 207, thêm `weight="medium"`.
- chỗ khác giống: không, cùng 1 hàm `ScoreRow` dùng chung cho cả 2 loại hàng.

### R3 WorkSessionHeader × color
- đang: `timeLeft` (dòng 129) không khai `color` ⇒ luôn default bất kể còn bao lâu; props không
  có `urgent`/`isUrgent`.
- đúng: neo `ContinueCard.timeLeft` (dòng 60,113,145-149) leo tone `neutral→warning` khi urgent —
  "dữ liệu sắp hết giờ thì màu PHẢI đổi theo".
- sửa ở: block — thêm prop `urgent?: boolean`, đổi `color={urgent ? "warning" : "default"}`.
- chỗ khác giống: `QuizPage`/`FlashcardReviewPage`/`MockInterviewPage` đều truyền `timeLeft` vào
  `WorkSessionHeader` — cả 3 caller hưởng lợi nếu thêm prop.

### R5 VoiceHero × button
- đang: `onToggleListen` đổi `variant` sang `danger` khi `listening=true` ("mic color carries
  the state").
- đúng: §1a — `danger` CHỈ cho phá huỷ/không hoàn tác. Toggle mic có thể đảo ngược ⇒ câu 1 = NO
  ⇒ không bao giờ vào nhánh danger. §3c: phân vân 2 họ chéo (primary↔danger) = cây vẽ sai, quay
  lại §2 câu 2 (mic là con đường duy nhất tới mục tiêu chính) ⇒ luôn `primary`.
- sửa ở: block — `VoiceHero.tsx`, giữ `variant="primary"`, truyền tín hiệu "đang ghi âm" qua
  kênh khác (không phải `variant`).
- chỗ khác giống: không có trong batch.

### R3 WorkSessionHeader × press
- đang: step-marker rail (dòng 157-166) là `<button>` HTML trần, không class press nào.
- đúng: cây §2 — có tương tác thật, không phải Button component, không phải chip, là ROW ⇒
  `fill`. Bẫy §4.4: "hand-roll press cho row thay vì compose khung có sẵn".
- sửa ở: atom/frame — nên đưa xuống một primitive sở hữu cơ chế `fill` (kiểu `List.Row`), không
  vá className trong block.
- chỗ khác giống: `List.tsx:161-162`, `ChipBase.tsx:242` (neo cơ chế `fill`).

### R1 PlaygroundSetupHeader × markdown
- đang: `description` (khi có) truyền raw string thẳng vào `PageHeader.description` → Typography
  trần, không qua `RichText`.
- đúng: tầng đúng là `richtext nhỏ` (§3c) nhưng cơ chế thật là Typography trần — khớp Vạch cấm #3
  + bẫy #2 (RichText chưa có consumer thật nào).
- sửa ở: composite/frame — `composites/layout/Page/Page.tsx`'s `Header` (dòng ~172-179), KHÔNG
  sửa ở block.
- chỗ khác giống: R7 (cùng path, cùng bug) — nên sửa gộp 1 lần ở `Page.tsx`.

### R4 InterviewerPresence × markdown
- đang: `questionMarkdown` render qua `MarkdownContent` bản FULL (mọi remark plugin bật).
- đúng: production thật (`MockInterviewSession/index.tsx:1945,1957,2155,2164`) dùng `plain`
  ("render thô", thầy chốt 2026-07-17). Composite Storybook tự ghi "Still NOT ported: plain mode".
- sửa ở: composite — `MarkdownContent.tsx` cần port `plain` trước, rồi block mới truyền được.
- chỗ khác giống: R8 (cùng gap, strengths/gaps/followUpQuestion).

### R7 SubmissionResultHeader × markdown
- đang: cấu trúc y hệt R1 — description raw string → Typography trần qua `Page.tsx`.
- đúng: giống R1.
- sửa ở: composite/frame — cùng chỗ R1 (`Page.tsx`), nên gộp sửa 1 lần.
- chỗ khác giống: R1.

### R8 MockInterviewScorecard × markdown
- đang: strengths/gaps/followUpQuestion render qua `MarkdownContent` bản FULL.
- đúng: production thật (`MockInterviewScorecard/index.tsx:405,421,433`) dùng `plain`.
- sửa ở: composite — same as R4, chờ `MarkdownContent.tsx` port `plain`.
- chỗ khác giống: R4 — cùng 1 gap ở tầng composite lộ qua 2 block trong batch này.

### R2 MockInterviewSetup × skeleton
- đang: (a) `ButtonRadioGroup` (chọn Cấp độ) không nhận `isSkeleton` — không có prop này trong
  type. (b) 2 nút CTA không truyền `isSkeleton={isSkeleton}` xuống `Button` dù `ButtonBase` có
  union hỗ trợ.
- đúng: (a) Q2=KHÔNG, Q5=nhiều node cố định ⇒ tự vẽ ~3 HeroSkeleton pill thay chỗ. (b) Q2=CÓ ⇒
  bắt buộc truyền `isSkeleton` xuống, giống cách `MockInterviewScorecard` đã làm cho 3 nút CTA.
- sửa ở: block — `MockInterviewSetup.tsx`: (1) thêm `isSkeleton={isSkeleton}` vào 2 lời gọi
  `Button`; (2) `ButtonRadioGroup` — tự vẽ mirror HAY nâng cấp atom thêm `isSkeleton` riêng, **cần
  thầy chọn** vì đụng atom dùng chung nhiều nơi.
- chỗ khác giống: `MockInterviewScorecard.tsx` (ScoreRowSkeleton, đã làm đúng mẫu này).

### R3 WorkSessionHeader × skeleton
- đang: nhánh `isSkeleton` (dòng 104-116) vẽ 2 HeroSkeleton bar vô danh, BỎ HẲN
  LinkBack/title/timeLeft/finish Button — dù JSDoc chính file (dòng 65-68) ghi rõ chỉ
  counter/total/current phụ thuộc dữ liệu, còn lại luôn có sẵn.
- đúng: neo chính là JSDoc tự source — chỉ counter/rail cần mirror; backLabel/title/timeLeft nên
  render SỐNG (hoặc dùng `isSkeleton` riêng của Typography/Button để mirror nhất quán).
- sửa ở: block — `WorkSessionHeader.tsx` nhánh dòng 104-116.
- chỗ khác giống: `PlaygroundSetupHeader.tsx` (breadcrumbLabel/onBack giữ sống qua loading, cùng
  tính chất "luôn sẵn").

### R8 MockInterviewScorecard × skeleton
- đang: `SKELETON_SCORE_ROWS = 3`/`SKELETON_ATTRIBUTE_ROWS = 3` là hằng số cứng, không phải prop
  — không override được dù số hàng thật phụ thuộc mode (Q&A vs Design).
- đúng: cây §2 Q3 — danh sách lặp chưa biết số lượng ⇒ hình 4, số đếm PHẢI là prop có mặc định
  (neo `Legend.tsx skeletonCount=3`, `KeyValue.tsx skeletonRows=3`).
- sửa ở: block — thêm `scoreSkeletonRows?`/`attributeSkeletonRows?` (mặc định 3), thay hằng số
  cứng bằng giá trị prop.
- chỗ khác giống: `Legend.tsx`, `KeyValueList`/`KeyValue.tsx`.

---

## 2 ô CÂM (đã kiểm §5 NEO THẬT, thật sự không tìm thấy — cần thầy quyết hoặc B4)

### R5 VoiceHero × reading-flow
Component tự vẽ `align="center"` cho cả nút mic lẫn transcript, LẶP LẠI mỗi câu hỏi trong phiên
(khác `EnrollGate` — neo duy nhất canon có, là thẻ quyết định MỘT LẦN, toàn màn). Cây §2 chỉ cho
phép center khi khớp 1/4 ngoại lệ đã liệt — VoiceHero không khớp rõ ràng cái nào, và tên gọi
"Hero" không phải neo canon. **Cần thầy quyết**: đây có được công nhận là ngoại lệ hero-focal thứ
4 (mở rộng), hay phải đổi về `start` mặc định?

### R4 InterviewerPresence × button
`onToggleTts` là nút icon DUY NHẤT trong toàn khối (không có cụm nút khác để so bậc) — đang
`variant="ghost"`. Context.md tự loại `src` làm neo cho cặp `ghost↔tertiary` (không nhất quán ở
`src`). Cây §2 câu 5 (secondary) và câu 6 (tertiary, catch-all) đều CÓ THỂ áp cho một nút icon lẻ,
không câu nào loại trừ câu kia bằng props hiện có — đúng bẫy §4 mục 2 nêu tên thẳng ("2 tác giả
chọn 2 variant khác nhau cho cùng ca"). **Không tìm được neo phân định `ghost` đúng hay phải là
`tertiary`/`secondary`.**

---

## 31 ô N/A — xem lý do đầy đủ trong `mockinterview-b2-result.json` (đã tóm ở đây các ca đáng chú ý)

Phần lớn N/A rơi vào 3 nhóm hợp lý, không phải bỏ sót:
- **Khối "identity/text thuần" không tự vẽ biên** (R1/R4/R5/R7 × `inset`/`surface`/`seam`) — các
  block này chỉ compose vào slot của `PageHeader`/`Container` cha, không tự khai `p-*`/`border`/
  `bg`/`gap` nào ở tầng của chính nó.
- **File tự ghi "NO isSkeleton, deliberate"** (R4/R5/R6 × `skeleton`) — neo thật mạnh nhất, đã
  kiểm §5.
- **Mọi control đều là NÚT** (R2/R4/R8 × `press`; R1/R7 × `button` — compose `Link`/`LinkBack`
  chứ không phải `Button`) — nằm ngoài thang theo đúng định nghĩa trục.

Danh sách đủ 31 dòng (vùng × trục — lý do rút gọn 1 câu) đã lưu trong file JSON kèm phiên, không
lặp lại ở đây để đỡ dài.
