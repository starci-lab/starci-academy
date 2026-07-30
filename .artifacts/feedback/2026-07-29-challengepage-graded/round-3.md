# Vòng 3 — 2026-07-30

Ba lượt ảnh liên tiếp trên cùng story. Việc lớn nhất vòng này không phải sửa content nữa, mà là
một **bug atom lõi** lộ ra khi soi kỹ khối "Phản hồi" mới dựng ở vòng 2.

## Điểm 1 — vị trí chip meta (CAM, còn treo)

Thầy khoanh đường cong từ tiêu đề sang cụm chip bên phải: *"ý là bên trái hết chứ?"* — em hỏi
lại xác nhận đây có phải đảo lại quyết định `justify="between"` của vòng 2 không.
**Chưa có câu trả lời — chưa động vào.**

## Điểm 2 — "Nghiêm trọng" là Chip, đúng lỗi

Đọc `SubmissionFindingsList.tsx` (tiền lệ CÓ SẴN trong cùng codebase, chính file
`ChallengeDeliverableList.tsx` tự trích dẫn nó làm nguồn `SubmissionFeedbackSeverity`) —
severity ở đó render bằng **ICON có màu tone**, không phải Chip. Thầy tự chỉ đích danh muốn
"chữ có màu + dấu `|`" (pattern mới, không phải icon) — áp đúng theo lời thầy, không theo
tiền lệ icon.

**Áp:** `titleStart` đổi từ `<EnumChip>` sang `<Typography color={SEVERITY_MAP[...].color}>` +
`<span>|</span>`. "Phản hồi" đổi từ Typography thủ công (`weight="medium" color="muted"` — tự
chế, không khớp cả `label` lẫn `subtleLabel`) sang prop `label` thật của `SurfaceCardAccordion`.

## Điểm 3 — outputs/prerequisites render markdown, đúng lỗi thật

Thầy: *"đỏ bị lệch thấy không, với không render kiểu markdown nhé."* Kiểm backend
(`.claude/docs/rules/fullstack/challenges.md` §3): outputs/prerequisites đặt tên field là
**"text"**, khác hẳn requirements/steps ("body", cho phép markdown + callout `:::muted`) —
ranh giới CỐ Ý ở tầng content, khớp đúng ý thầy dù NGƯỢC với `src/ChallengeView` (nơi vẫn giữ
`MarkdownContent` — comment thật trong `src` nói "keeps inline code" là chủ ý CŨ, giờ thầy chốt
lại hướng khác cho bản vẽ). `.storybook` được quyền dẫn trước khi thầy chốt lại.

**Áp:** `ChallengeBrief.tsx` — `outputItems`/`prerequisiteItems` đổi từ `markdownBody()` (qua
`MarkdownContent`) sang `<Typography text={item.body}>` trần, không markdown.

## Điểm 4 (mới, phát hiện giữa chừng) — bug atom thật: `default` color không phải foreground

Thầy soi kỹ ảnh vòng 3.1 rồi bắt: "Phản hồi" và message vẫn **muted**, phải là
**text-foreground**. Đo DOM: **mọi title accordion khác trên trang đều foreground
(`oklch(0.2103...)`), CHỈ riêng khối "Phản hồi" mới dựng là muted (`oklch(0.5517...)`).**

Truy ngược ancestry 20 cấp, tìm ra vendor CSS thật:
```
.accordion__body-inner { color: var(--muted) }
```
HeroUI áp muted mặc định cho **mọi nội dung trong panel accordion**. `Typography.tsx`'s
`COLOR_CLS.default` từng là `null` (comment: *"foreground — not declared (§9a)"*) — dựa vào kế
thừa CSS thay vì tự khai lớp tường minh. Đúng **CÙNG LỚP BUG** với `weightCls` (round-1 #4):
atom giả định "không cha nào ghi đè", và vendor phá đúng giả định đó.

**Áp — sửa ở ATOM, áp toàn app:**
```diff
- default: null, // foreground — not declared (§9a)
+ default: "text-foreground",
```

⚠️ **Đây là fix rộng nhất trong cả 3 vòng** — mọi `Typography` không khai `color` trên toàn bộ
app giờ tường minh `text-foreground`, không còn phụ thuộc kế thừa CSS. Về mặt hình ảnh không
đổi gì cho phần lớn chỗ (foreground vốn đã là màu kế thừa mặc định ở hầu hết context), CHỈ đổi
ở những chỗ có vendor/ancestor âm thầm ghi đè — đúng những chỗ đang có bug thật.

## Điểm 5 (mới) — lib `stripMarkdown`, áp 3 field

Thầy khoanh đen lên message "Phản hồi": *"đen là text-muted, và viết cái lib chuyển toàn bộ
markdown -> plain text, bỏ \`\`, bỏ \*\*"*. Hai việc tách biệt trong một câu — màu muted đã xử lý
ở Điểm 4 (atom fix); còn lại là việc MỚI: một lib chuyển đổi, không phải chỉnh component render.

Tra trước khi viết mới — `src/hooks/useSpeechSynthesis.ts:44-55` đã có đúng phép biến đổi này
(text đọc bằng giọng nói cũng không thể mang `` ` ``/`**`, cùng vấn đề một tầng khác). Copy verbatim
theo `§14d.1` (gần giống thì áp dụng lại pattern, không xây mới), không tự viết lại regex.

**Tạo:** `atoms/text/_markdown.ts` — export `stripMarkdown(markdown: string): string`, dọn code
span/fence, bold/italic/strike, heading, list marker, link/image, gộp whitespace.

**Áp — 3 field, cả ba đều thuộc tier "text" (cấm markdown theo schema backend, không phải tier
"body"):**
- `ChallengeBrief.tsx` — `outputItems`/`prerequisiteItems`: `item.body` → `stripMarkdown(item.body)`
  (tiếp nối Điểm 3 — trước đó mới đổi RENDERER từ `MarkdownContent` sang `Typography` trần, nay
  strip luôn CONTENT phòng ca tác giả gõ backtick ra ngoài thói quen dù field không hiển thị markdown).
- `ChallengeDeliverableList.tsx` — `entry.message` (title accordion feedback, tier title vốn đã
  cấm markdown từ Điểm 2/vòng-2, nay strip nốt phần content để nhất quán): `entry.message` →
  `stripMarkdown(entry.message)`.

**Verify:** `tsc --noEmit` 0 lỗi · 10/10 cổng xanh (không cổng nào bắt vì đây là content strip,
không đổi cấu trúc component) · eslint sạch cả 3 file (`_markdown.ts` mới, 2 file gọi).

## Sản phẩm phụ — `onSeeMore` đã có sẵn nhưng KHÔNG phải thứ cần

Thầy hỏi brainstorm "xem thêm" cho message bị cắt. Tìm thấy `SurfaceCardAccordionProps` đã có
`onSeeMore`/`seeMoreLabel` — đọc kỹ thì đó là "xem thêm ITEM" ở HEADER card (dạng "hiện 3/10 →"),
khác hẳn nhu cầu "mở rộng MỘT dòng chữ bị cắt". Không dùng được thẳng.

**Brainstorm — 3 hướng, chưa chốt:**
1. **Lặp lại message ĐẦY ĐỦ trong body accordion** (không truncate), cùng với location/suggestion
   khi mở ra. Tận dụng accordion sẵn có — click hàng = "xem thêm", không thêm component nào.
2. Nút "..." / link "xem thêm" RIÊNG cạnh title, bấm là mở rộng TẠI CHỖ (không cần mở cả accordion).
3. `lineClamp={2-3}` thay vì `truncate` 1 dòng — giảm tần suất cần "xem thêm" ngay từ đầu, chỉ
   thật sự rất dài mới cần.

Đo thực tế: ở viewport 1280px, message hiện tại KHÔNG bị cắt (`scrollWidth` = `clientWidth`) —
chưa chắc đây là vấn đề cấp bách ngay, nhưng đáng chốt hướng trước khi message dài hơn xuất hiện.

## Điểm 6 (mới) — cả khối "Phản hồi" phải ẩn sau một click, không chỉ từng dòng bên trong nó

Thầy khoanh 2 vùng trên một ảnh mới: xanh = cả card yêu cầu (đã đúng), đen = khối "Phản hồi"
đang render THẲNG RA, không giấu. Ba lượt trao đổi để hiểu đúng ý:

1. Lần đầu tưởng là "xem thêm" cho MỘT DÒNG chữ bị cắt (message dài) — vẽ 3 phương án truncate,
   thầy sửa lại: không phải truncate, đo thực tế message hiện không cắt.
2. Lần hai tưởng là accordion-từng-dòng chưa có click-to-expand — hoá ra CÓ SẴN rồi (component
   thật `SurfaceCardAccordion` đã có `Accordion.Trigger`+caret, bấm hàng là mở/đóng, ảnh thầy gửi
   xác nhận đúng: caret hướng xuống = đóng, chưa bấm).
3. Lần ba, thầy chỉ rõ: **KHÔNG PHẢI từng dòng bên trong — mà là CẢ khối "Phản hồi" (nhãn + toàn
   bộ danh sách) phải ẩn hoàn toàn cho tới khi bấm gì đó.** Brainstorm 2 hướng (A: chữ "Xem phản
   hồi" rời cạnh chip điểm · B: chính "Phản hồi" là MỘT accordion đệ quy). **Thầy chọn B.**

**Áp — `ChallengeDeliverableList.tsx`:** bọc lồng `SurfaceCardAccordion` vào chính nó — outer có
1 item duy nhất (`id: "feedback"`, `title: "Phản hồi (n)"`), `body` của item đó là accordion danh
sách feedback CŨ (không đổi cấu trúc bên trong, chỉ bỏ prop `label="Phản hồi"` vì nhãn giờ do
outer đảm nhiệm). Không component mới — tái dùng đúng `SurfaceCardAccordion` đã khai trong
registry (`storyId: composites-cards-surfacecard-surfacecardaccordion--with-title-end`).

## Điểm 7 (mới) — Phản hồi không render dạng card, đổi outer sang `Disclosure`

Thầy xem lại kết quả Điểm 6 (accordion đệ quy) qua browser thật, chốt tiếp: *"phản hồi không
render dạng card được không? tạo component accordion-like với behavior của accordion. kiểu
ToggleWithArea"*. Đúng — outer `SurfaceCardAccordion` mang `variant="nested"` = `rounded-3xl
border`, ra card thật, trong khi thầy chỉ muốn HÀNH VI toggle (bấm nhãn → hiện/ẩn), không muốn
chrome card.

Tra trước khi xây — có sẵn đúng thứ thầy mô tả: `composites/layout/Disclosure/Disclosure.tsx`,
namespace khung `Disclosure.*` (canon §13a/§13b, dựng 2026-07-25, ground truth
`MockInterviewSession`'s "Tùy chỉnh phiên" row) — trigger row (caret trần + nhãn `text-muted
hover:text-foreground`, `w-fit`) toggle MỘT vùng nội dung, không mang surface/border/shadow nào.
Đã có story thật (`composites-layout-disclosure-disclosure--default`), chỉ chưa có consumer thật
nào dùng tới. Đúng luật `§14d.1` — tái dùng, không xây `ToggleWithArea` mới.

**Áp — `ChallengeDeliverableList.tsx`:** outer đổi từ `SurfaceCardAccordion` (1 item, đệ quy) sang
`<Disclosure title={`Phản hồi (${n})`}>` bọc `SurfaceCardAccordion` (danh sách feedback thật) làm
`children`. Card thật CHỈ còn ở tầng trong (đúng vai — đó là danh sách các dòng), tầng ngoài giờ
chỉ là một hàng chữ + caret trần, không border/shadow nào bọc quanh.

Đăng ký thêm `"Disclosure"` vào registry `ChallengeDeliverableList.stories.tsx` (tier composite,
storyId thật tra qua `index.json` sống, không đoán); sửa luôn mô tả `EnumChip` đã lạc hậu từ
round-3 (severity đã đổi sang Typography có màu từ trước, registry vẫn ghi "feedback item's
severity chip" — dọn cho khớp render thật).

## Điểm 8 (mới) — round-3's `default` color fix was HALF a fix

Sau round-5, thầy soi kỹ severity row lần nữa: text "Nghiêm trọng | ..." vẫn muted, không
foreground — đúng bug Điểm 4 vẫn còn đó, dù `COLOR_CLS.default` đã sửa từ round-3. Đọc lại
`Typography.tsx` toàn bộ: **round-3 chỉ sửa GIÁ TRỊ trong bảng** (`null` → `"text-foreground"`),
nhưng CẢ BỐN nhánh render (`heading`/`code`/`isButton`/body-span) đều đọc bảng qua
`color ? COLOR_CLS[color] : null` — khi caller KHÔNG truyền `color` (case phổ biến nhất, ví dụ
chính title accordion đang lỗi, `SurfaceCard.tsx:1656` không hề có prop `color`), điều kiện
`color ?` fail ngay từ đầu, code không bao giờ chạm tới bảng đã sửa, vẫn trả `null` y hệt lúc
trước. Root cause thật không nằm ở GIÁ TRỊ mà ở CỔNG kiểm tra trước khi tra bảng.

**Áp — `Typography.tsx`, cả 4 nhánh:** `color ? COLOR_CLS[color] : null` → `COLOR_CLS[color ?? "default"]`
(nhánh `isLink` GIỮ NGUYÊN — mặc định cố ý là accent, có tài liệu riêng, không phải bug). Đúng
với JSDoc gốc của prop `color` ("Default = `default`") — giờ hành vi khớp lời khai.

## Điểm 9 (mới) — message dài bị CLIP THẲNG, không có `…`

Thầy khoanh dòng "Nghiêm trọng | Không có test cho route DELETE /ta" cắt cụt giữa từ, không có
dấu `…`: *"dài quá thì ... chứ?"*. `title` (message) đã có `truncate` sẵn qua `Typography` của
`.Accordion` (`SurfaceCard.tsx:1656`), nhưng `titleStart` (severity + `|`, ở
`ChallengeDeliverableList.tsx`) không có `shrink-0` — mặc định flex vẫn CÓ THỂ co giãn/tranh
chỗ với cột message thay vì giữ nguyên độ rộng của chính nó, khiến hàng vượt quá bề ngang thẻ và
bị cắt bởi `overflow-hidden` của khung card TRƯỚC KHI `truncate` của message kịp có bề rộng giới
hạn để chạy `text-overflow: ellipsis`.

**Áp:** thêm `className="shrink-0"` vào `StackH` bọc `titleStart` (severity+`|`) — cột đó giữ
nguyên độ rộng, toàn bộ phần co lại dồn về cột message, `truncate` giờ chạy đúng, ra `…`.

## Điểm 10 (mới) — chốt điểm-1-còn-treo: meta row gộp về bên trái

Thầy trả lời dứt điểm câu hỏi treo từ round-3 Điểm 1 ("ý là bên trái hết chứ?"): *"đỏ dời qua bên
trái, vàng dời qua sát đó, rồi gap đều 3 cái này."* Đỏ = cụm status+difficulty (`Trượt`/`Trung
bình`, đang ở mép phải qua `justify="between"`), vàng = score (`70 điểm`, đang ở mép trái tách
riêng). **Áp — `ChallengeHeader.tsx` `meta`:** bỏ `justify="between"` + StackH lồng hai tầng, gộp
thành MỘT `StackH gap="related"` chứa 3 phần tử ngang hàng (score, status chip, difficulty chip),
đứng sát nhau bên trái — gap đều nhau vì giờ chỉ còn MỘT tầng `gap="related"`, không còn hai tầng
gap khác scope.

## Điểm 11 (mới) — 4 số điểm không cùng weight

Thầy: *"sao 4 cái xanh không cùng size thế"* — so 4 chỗ hiển thị điểm: `40/32`/`12/24` (graded
score, `ChallengeDeliverableList.tsx` `scoreEnd`) vs `40 điểm`/`30 điểm` (`ScoreValue.tsx`, dùng
ở cả `ChallengeBrief`'s Yêu cầu VÀ `scoreEnd`'s nhánh ungraded). Cả hai đều `size="xs"` (cùng cỡ
chữ thật) nhưng `scoreEnd`'s nhánh graded THIẾU `weight="medium"` (rơi về `font-normal` mặc định)
trong khi `ScoreValue` luôn `weight="medium"` — khác weight đọc như khác cỡ.

**Áp:** thêm `weight="medium"` vào nhánh graded của `scoreEnd` — đồng bộ với `ScoreValue`, đúng
lý lẽ "cùng info-type (điểm số) → cùng kiểu chữ" (§2d).

## Điểm 12 (mới, lớn nhất phiên) — thầy bắt "chế" business, phải dựng lại theo neo thật

Thầy: *"thầy bảo trò render các field dựa vào BUSSINESS mà chế nhiều quá, đọc database trong
postgresql của con này để xác định field nào, và đọc code fe để render ra layout chuẩn. chứ đừng
chế nữa."* Cho agent đọc đủ hai nguồn:

- Backend (`starci-academy-backend/.../entities/`): `ChallengeEntity` không có `status`; requirement
  điểm nằm ở `ChallengeRequirementLangEntity.score` (không phải field `points` riêng); submission
  tách 2 tầng (`ChallengeSubmissionEntity` định nghĩa, `UserChallengeSubmissionEntity` join-per-user,
  field URL tên `submissionUrl`); GRADING tách attempt (`UserChallengeSubmissionAttemptEntity`:
  `score`, `shortFeedback`) + feedback-per-finding (`UserChallengeSubmissionFeedbackEntity`: `message`,
  `detail`, `severity` chỉ 3 mức Low/Medium/High, `location`, `suggestion`) — **không có** entity
  `Verdict`, không có field `earnedScore`/`requiredScore` riêng per-finding.
- FE thật (`src/components/features/learn/Challenge/ChallengeSubmissionPanel/SubmissionRow/
  LastAttemptResult/index.tsx`) — ĐÚNG khối "đã nộp, đã chấm" trong CÙNG trang solve (không phải
  `SubmissionResult`, trang kết quả riêng — hai component khác nhau, khác hình). Đối chiếu: severity
  round 4-7 dựng "chữ màu + `|`" — KHÔNG có neo, thật là DOT tròn nhỏ. Toggle "Phản hồi (n)" (round
  5-7, `Disclosure`) — KHÔNG có neo, thật là danh sách phẳng LUÔN HIỆN dưới nhãn tĩnh "Phản hồi gần
  nhất". Điểm "40/32" trần — thật là CÂU ĐẦY ĐỦ ("Điểm lần thử gần nhất của bạn là N/M. Yêu cầu tối
  thiểu R."), không phải cụm số. `stripMarkdown(message)` — thật KHÔNG cần, field vốn plain.

**Áp — `ChallengeDeliverableList.tsx`:** bỏ hẳn `Disclosure` + `SurfaceCardAccordion` lồng +
severity chữ-màu. Dựng lại: verdict Chip + câu điểm số đầy đủ, danh sách feedback phẳng (dot màu
severity + message + location font-mono + gợi ý), tất cả LUÔN HIỆN dưới nhãn tĩnh. Dọn import
(`stripMarkdown`, `Disclosure`, `RichText` không còn dùng), dọn registry story (bỏ entry
`Disclosure`).

**Sửa hụt lần đầu, thầy bắt tiếp:** lúc đầu chỉ COPY THẲNG `bg-info`/màu severity `low` từ `src`
không phân tích — thầy chặn: *"code ở src là để tham khảo hiểu k?"* — copy máy móc y như "chế"
kiểu cũ, chỉ khác là chế ở tầng thấp hơn (token màu) thay vì tầng UI. Hỏi lại, thầy chọn: thêm
hẳn tone `info` vào hệ màu (không né bằng neutral giả). Việc này lộ ra `--info` **chưa từng tồn
tại ở bất cứ đâu, kể cả trong chính `src`** (bug tiềm ẩn có sẵn, khớp đúng insight "src chỉ để
tham khảo, không phải chân lý tuyệt đối") — phải TỰ CHỌN giá trị OKLCH mới (hue 250, theo khuôn
`--success`/`--warning`: giống nhau ở light/dark, pastel + foreground tối), không có gì để chép.
Lan toả: `AlertStatus` (`Alert.tsx`) + `TypographyColor` (`Typography.tsx`) nhận thêm `"info"` —
NHƯNG `ChipTone` (`ChipBase.tsx`) và `EnumChipColor` (`EnumChip.tsx`) từng ALIAS thẳng
`AlertStatus` phải TÁCH RA thành union riêng (không nhận `info`), vì `tone` đổ thẳng vào
`HeroChip.color` — prop VENDOR đóng cứng, không thể mở rộng. `HeroAlert.status` cùng ràng buộc,
xử bằng cách map `"info"` → `"default"` chỉ khi gọi vendor (màu thật vẫn đến từ className riêng
của atom). Sửa dây chuyền 6 file khác có `Record<AlertStatus,...>` thiếu entry `info`
(`IconTile.tsx`, `SurfaceCard.tsx`, `Feedback.tsx`, `InlineIconLabel.tsx`) — thêm entry theo đúng
khuôn từng bảng, không đụng gì khác.

**Thầy chốt tiếp, sửa lệch hiểu:** *"trò hiểu ý không? thầy phân tích biz để cải tiến ui, render
field thiếu chứ không revert toàn bộ."* — nghĩa là đọc `src` để lấy ĐÚNG field/cấu trúc rồi CẢI
TIẾN bằng chất lượng dựng của hệ này (atom/frame nhà, spacing scale), không phải hạ xuống y hệt
bản `src` thô. Hỏi field còn thiếu cụ thể — thầy chọn `shortFeedback` (tóm tắt cả lượt chấm,
`UserChallengeSubmissionAttemptEntity.shortFeedback`) — field THẬT chưa render ở đâu trong bản vẽ.
**Áp:** thêm `ChallengeDeliverableGrade.shortFeedback?: string`, render ngay dưới verdict+score,
TRÊN danh sách feedback từng dòng, cỡ `size="sm"` foreground (câu học viên đọc đầu tiên, không phải
chi tiết phụ nên không muted). Cập nhật fixture 2 story item.

## Điểm 13 (mới) — gói lại phần phụ trong `Disclosure`, KHÔNG phải quay lại "chế"

Thầy: *"nhưng mà LastAttemptResult trò render trong Disclosure không được à? nó là nội dung phụ
mà."* Khác điểm 12 ở chỗ đây là quyết định TRÌNH BÀY (ẩn/hiện theo click), không phải field/cấu
trúc bịa — nội dung bên trong Disclosure vẫn đúng nguyên field thật (không đổi gì so với Điểm
12), chỉ đổi CHỖ ĐẶT. `.storybook` được quyền dẫn trước ở quyết định trình bày kiểu này
(`boundary.md`).

**Áp:** verdict Chip + câu điểm số vẫn LUÔN HIỆN (thông tin cần thấy ngay, không phải phụ).
`shortFeedback` + danh sách feedback từng dòng gói vào `Disclosure title="Phản hồi gần nhất"` —
nhãn này trước đứng tĩnh lặp lại trong danh sách, giờ dùng làm title của trigger luôn, không lặp
hai lần. Đăng ký lại `Disclosure` vào registry story (đã gỡ ở round-8, nay quay lại — lý do khác
hẳn: round-5 gói TOÀN BỘ kể cả verdict+score không neo, round-10 chỉ gói phần phụ, có neo thầy
chốt tường minh).

## Điểm 14 (mới) — trò lỡ sửa `src` thật, revert; rồi soi lại danh sách bổ sung bằng Postgres thật

Thầy: *"trò làm gì thế, scope trong storybook thôi mà, sao cứ làm mọi thứ rối tung lên thế."`

Sau khi được duyệt "render ra prototype 8080 cho thầy xem", em hiểu lầm thành SỬA THẲNG `src`
thật (GraphQL query 2 file + entity type 2 file) — sai phạm vi lane (`.storybook` only). Revert
sạch cả 4 file (`git checkout --`, xác nhận diff trước đó chỉ có đúng phần em thêm, không đụng gì
khác). Thầy chỉnh lại ý: *"chưa sửa, lên proposal render HTML"* — nghĩa là mockup tĩnh để duyệt
trước, không code thật.

Trước khi mockup, dùng `docker exec starci-postgres psql` soi TRỰC TIẾP dữ liệu thật (không chỉ
đọc entity source) cho 6 field đề xuất trước đó — phát hiện quan trọng: `approach_score`/
`outcome_score` LUÔN 70/30 ở mọi dòng (không biến thiên — chữ trang trí, không phải thông tin
thật khác nhau từng nơi); `detail` (feedback) RỖNG ở mọi dòng đã sample (cột có thật nhưng chưa
từng được ghi — build UI cho nó sẽ ra ô trống, lại rơi vào "chế"); `resources` — bảng có thật
nhưng 0 DÒNG trong toàn DB. Ba trong sáu ứng viên ban đầu bị loại vì tuy SCHEMA thật nhưng DỮ LIỆU
không thật/không đáng render.

Thầy hỏi tiếp *"display id render làm chi?"* — đúng, `displayId` là slug routing nội bộ, không có
giá trị đọc cho học viên — loại. Tự soi lại `verified` bằng câu hỏi tương tự — kết luận hợp với
trang danh sách khoá học hơn là giữa lúc giải bài — loại luôn. Còn lại đúng MỘT ứng viên có giá
trị thật: `attemptNumber`+`processedAt`.

**Áp — trong `.storybook`, đúng phạm vi:** thêm `attemptNumber?`/`processedAt?` vào
`ChallengeDeliverableGrade`, render "Lần #N · chấm lúc HH:mm" ngay dưới verdict+score. Đồng thời
xử luôn "description của submission" thầy nhắc — `ChallengePage.stories.tsx`'s `unit-test` item
(cả TODO lẫn GRADED) thiếu `description` từ đầu (bug fixture gốc của điểm feedback trước đó) —
thêm, dùng ĐÚNG text đã có sẵn ở `ChallengeBrief.stories.tsx` cho cùng yêu cầu ("Ít nhất một test
integration cho mỗi route, chạy được bằng `npm test`.") thay vì tự viết câu mới.

## Verify

- `tsc --noEmit`: 0 lỗi (14 lượt, sau mỗi cụm fix — kể cả sau khi lan `info` tone qua 8 file)
- 10/10 cổng xanh (2 lần bắt orphan-parts, đã sửa cả hai)
- eslint: sạch trên mọi file mới đụng
- Đo DOM: severity không còn Chip, có dấu `|` · outputs/prerequisites không còn `<code>` · sau
  restart server thật (không chỉ HMR), location/suggestion xác nhận foreground qua tab mới
- ⚠️ **"Phản hồi"/message sau fix atom CHƯA đo lại được** — Browser pane bị lỗi CDP/timeout liên
  tiếp sau khi restart server (server tự xác nhận 200 qua `curl`, không phải server treo — lỗi
  ở tooling trình duyệt). Thầy dừng, tự soi mắt trực tiếp thay vì chờ em navigate lại.

## Còn treo sang vòng sau

- Điểm 1 (vị trí chip meta) — chưa có câu trả lời.
- Hướng "xem thêm" — thầy chốt thêm: **"vẽ ra widget"** (không chỉ brainstorm text) — cần dựng
  mockup/component thật, chưa làm.
- Chưa tự-đo-được màu foreground của "Phản hồi"/message sau restart — thầy đã tự xác nhận qua
  refresh tay (không dùng Browser pane), không báo lại lỗi màu nữa → coi Điểm 4 là ĐÃ ĐÓNG.
- `RichText.tsx` dùng `Typography` thô từ `@heroui/react`, không phải atom nhà vừa sửa — CHƯA
  kiểm RichText có dính đúng bug `default color` này không (ghi từ vòng 1, vẫn treo).
- ⚠️ **Luật thao tác mới, thầy chốt:** *"khoong can navigate, fix xong la dc, thay tu nhin = mat"*
  — từ đây về sau trong phiên này, KHÔNG dùng Browser pane để verify (navigate/screenshot/đo
  DOM qua trình duyệt). Verify bằng `tsc`/10 cổng/eslint, báo bằng chữ, để thầy tự xem bằng mắt.

---

## Điểm 15-20 — chặng cuối vòng 3 (2026-07-30, sau khi B4 đã đóng 3 mục treo)

Sáu việc nữa landed SAU khi sổ đã lật `ĐÃ ĐÓNG` lần đầu. Ghi lại vì phần lớn là **GỠ BỎ** —
loại thay đổi mà phiên sau đọc code không suy ra được lý do, dễ dựng lại đúng thứ vừa gỡ.

### Điểm 15 — "Gợi ý" đi qua BA hình trong một ngày, chốt ở `SurfaceCard` trần

`SurfaceCardAccordion` bare (bản port từ `src`) → `SurfaceCardList` + `label` → **`SurfaceCard`
+ `label`**, và **bỏ `LightbulbIcon`**.

Thầy chốt hai nhịp: *"gợi ý render dạng SurfaceCard with label, bỏ icon bóng đèn"*, rồi bắt tiếp
*"sao lại là SurfaceCardList mà không render SurfaceCard và bỏ text vào thôi? nó phải list đâu?"*

Lý lẽ đọng lại: hint là MỘT đoạn văn ⇒ `items` độ dài luôn bằng 1 là **sai khái niệm ngay ở kiểu
dữ liệu** (kéo theo divider-giữa-hàng + `key` vô nghĩa). Và nếu giữ accordion mà thêm `label` thì
chữ "Gợi ý" hiện HAI LẦN (header card + trigger của item duy nhất, vì item accordion buộc có
`title`). Icon bỏ vì ba nhãn cùng cấp (Yêu cầu · Đầu ra mong đợi · Gợi ý) mà một cái đeo icon là
lệch nhịp cả cụm.

⚠️ **Phiên sau đừng gắn lại icon đèn** dù `src` vẫn có — đây là quyết định của bản vẽ, có neo.

### Điểm 16 — khối chấm điểm gọn còn MỘT hàng meta (thầy chọn phương án B)

Thầy: *"phần xanh rườm rà quá"*. Ba tầng chồng nhau nói cùng một fact. Brainstorm 3 phương án
bằng widget, thầy chọn B.

**Bỏ hẳn** câu `"Điểm lần thử gần nhất của bạn là N/M. Yêu cầu tối thiểu R."` — con số N/M đã nằm
ở `titleEnd` của hàng accordion ngay trên, và chip đã trả lời "đạt hay chưa"; câu đó nói lại lần
thứ hai bằng cả hai dòng chữ. Còn lại: `EnumChip` verdict + `lần #N · HH:mm dd/MM` một hàng.

### Điểm 17 — GỠ HẲN danh sách feedback từng dòng khỏi panel (nguy nhất nếu không ghi)

Thầy: *"ở đây thì shortFeedback thôi là được"*.

Gỡ: mảng `feedback[]` khỏi `ChallengeDeliverableGrade`, type `ChallengeDeliverableFeedbackItem`,
bảng `SEVERITY_DOT`, import `SubmissionFeedbackSeverity`/`cn`, và toàn bộ nhánh render dot+message
+location+suggestion. Giữ lại: `shortFeedback` một câu, trong `Disclosure`.

**Đo Postgres thật làm căn cứ** (`docker exec starci-postgres psql`): 111/111 attempt CÓ
`short_feedback` (không dòng nào null), một attempt tới **8 finding × 3 field** ⇒ render hết ở
panel nộp bài thì chôn form dưới hai chục dòng. Chi tiết thuộc trang kết quả riêng
(`src`'s `SubmissionResult`, vào từ nút "Xem lịch sử" ngay trên).

⚠️ **Phiên sau đọc `.artifacts/domain/challenge-and-milestone.md` §3 sẽ thấy "từng dòng góp ý là
state PHẢI VẼ" — ĐÚNG cho `src`, nhưng bản vẽ đã chốt khác.** Đã ghi rõ ở §5 của chính domain doc
đó. Đừng dựng lại.

### Điểm 18 — cặp nút bám lề trái, cả hai ôm chữ

Bỏ `justify="end"`. Mọi thứ khác trong panel (description · ô URL · chip verdict · trigger "Phản
hồi gần nhất") đều bám lề trái, chỉ hàng nút dạt phải nên đọc như của khối khác.

**KHÔNG** dùng `flex-1` dù `src`'s `SubmissionRow` làm vậy (primary `shrink-0` + secondary
`min-w-0 flex-1`) — cách đó làm nút PHỤ rộng hơn nút CHÍNH, ngược trọng số thị giác. Em phản biện
trước, thầy chốt bỏ.

### Điểm 19 — `ChallengeScoreCard` + `ProgressMeterTargetMark`: màu mang nghĩa, vạch thôi to

Thầy: *"cái anchor có vẻ hơi dài, với màu sắc không make sense lắm"*.

- Thanh: `accent` cố định → `success`/`danger` theo `earnedScore >= targetScore`. Trước đó một
  attempt 52/70 (74%, DƯỚI mốc 80%) trông y hệt một attempt đã đạt — thanh chở tỉ lệ mà không chở
  phán quyết.
- Vạch mốc: `h-5 w-1 bg-accent` → **`h-1 w-0.5 bg-muted rounded-none`**. Cũ cao gấp **5 lần**
  track 4px nó đánh dấu, và CÙNG màu với fill ⇒ một màu chở hai nghĩa ("được bao nhiêu" vs "cần
  bao nhiêu"), mắt không tách được. Nhãn `80%` bỏ offset (`bottom-full`, sát vạch) sau khi em thử
  giữ nhãn cố định so với thanh làm nó trôi lơ lửng — thầy bắt *"lệch rồi ông"*.

### Điểm 20 — ba state job/autosave còn thiếu (quét domain doc mới lộ)

Đối chiếu `.artifacts/domain/challenge-and-milestone.md` §3 phát hiện bản vẽ thiếu 3 state PHẢI
VẼ. Thầy chốt "dựng luôn cả 3".

| State | Dựng bằng | Ground |
|---|---|---|
| `jobStatus` 4 ngả (queued/processing/completed/failed) | `FeedbackCallout` giữa ô URL và hàng nút | `JobStatus` thật + vị trí `AIProcessingText` trong `SubmissionRow:173-195` |
| `jobError` | `body` của callout, in **THÔ không dịch** | `activeJobError` là chuỗi server chưa dịch |
| `autosaveStatus` | `Typography` xs muted/danger, **PANEL-level** trên accordion | `AutosaveStatus` gộp mọi ô URL, `ChallengeSubmissionPanel:388-398` |

Hai thứ chỉ đọc source mới biết: `action` **THẮNG** `labelEnd` (`surface-card-header.tsx:90-104`)
nên không nhét autosave vào hàng nhãn được; và `"idle"` cố ý KHÔNG là member — không-có-dòng diễn
đạt bằng omit prop, không phải bằng một giá trị nghĩa "đừng vẽ gì".

⚠️ **KHÔNG bê viền conic-gradient xoay** của `AIProcessingText` (một `motion.div` gradient quay
2.8s) — đó là implementation riêng của `src`, chép sang là đúng Bẫy 3 `boundary.md`.
