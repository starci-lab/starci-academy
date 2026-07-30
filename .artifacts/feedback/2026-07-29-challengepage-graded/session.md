# Phiên feedback — ChallengePage / Graded

- storyId: `starci-pages-challengepage-challengepage--graded` (tra từ `index.json`, không đoán)
- file story: `.storybook/stories/starci/pages/ChallengePage/ChallengePage.stories.tsx`
- file component: `.storybook/components/starci/pages/ChallengePage/ChallengePage.tsx`
- mở: 2026-07-29       trạng thái: **ĐÃ ĐÓNG — 2026-07-30**
- phiên đầu tiên chạy bằng lane `starci-fe-story-feedback-start` (lane vừa dựng cùng ngày)

## Tồn đọng tìm thấy ở B0 — CÓ, và đúng trên màn này

Không coi mấy mục dưới là feedback mới nếu thầy nhắc lại.

| Nguồn | Tồn đọng |
|---|---|
| lượt trước cùng phiên chat | Thầy đưa 4 điểm cho `ChallengePage`. **Đã sửa 2**: ô nhập URL sang `variant="secondary"`; nhãn accordion nhận `parseInlineCode` để backtick không hiện thô. **CHƯA xong 2**: *"vàng phải lệch"* và *"vàng trái render nội dung đàng hoàng hơn"* — trò điều tra rồi báo không tái hiện được, thầy chưa chốt lại. ⚠️ **CẬP NHẬT vòng 2**: `parseInlineCode` ở trên đã bị **ĐẢO NGƯỢC** — thầy chốt lại title accordion không render markdown dưới bất kỳ hình thức nào, xem `round-2.md` #4. Đừng đọc dòng "đã sửa" ở trên như trạng thái hiện tại. |
| `principles/icon` | ca caret `Select`/`Accordion` treo từ đầu phiên: source khai `size-4` nhưng vendor `cloneElement` nuốt class, DOM đo ra 14px. Chưa sửa |

## Vùng

Thầy chọn "gate toàn bộ" — cả 5 vùng, không giới hạn:

| id | Vùng |
|---|---|
| R1 | ChallengeHeader |
| R2 | ChallengeBrief |
| R3 | ChallengeDeliverableList |
| R4 | ChallengeScoreCard |
| R5 | SplitWorkspace |

## Vòng

### Vòng 1 — 2026-07-30
Quét đủ 75 ô (5 vùng × 15 trục). Chi tiết: [`round-1.md`](round-1.md).
- **11 LỆCH**, **2 CÂM**, còn lại ĐẠT/N/A.
- Chạy 2 lượt workflow: lượt đầu (opus, effort-high) **VỨT BỎ** vì race-condition ghi file dữ
  liệu chậm hơn lúc launch — 15/15 agent chạy trên `baseline.json` (số đo gộp, không tách vùng)
  thay vì `dom-full.json` (77 node đủ trường). Lượt hai (sonnet, xác nhận file tồn tại trước khi
  chạy) mới là kết quả dùng được, ghi trong `round-1.md`.
- **Thầy duyệt: "sửa hết đi cho thầy xem đã"** — áp cả 11 ô LỆCH, 2 ô CÂM giữ nguyên (đúng luật
  lane, không đề xuất sửa cho ô CÂM khi chưa qua B4).
- Áp xong: `tsc` 0 lỗi · 10/10 cổng xanh (bắt + tự sửa 1 vòng orphan-parts) · eslint sạch trên
  mọi file đã sửa (4 lỗi unused-var ở `SurfaceCard.tsx` xác nhận là nợ có sẵn, không đụng) · đo
  lại DOM thật khớp cả 5 giá trị đại diện đã kiểm.
- Một quyết định kiến trúc đáng ghi: fix #10/#11 (markdown, `RichText`) ban đầu viết theo kiểu
  cha branch giữa 2 component khác nhau cho 2 trạng thái skeleton/thật — **thầy bắt sai lối**:
  đúng luật `§12c` cờ `isSkeleton` phải CHẢY XUỐNG làm prop của MỘT component, không branching.
  Sửa lại theo đúng pattern `ScoreValue.tsx` đã có sẵn (`isSkeleton={isSkeleton} text={...}`).
- Chi tiết đầy đủ từng file/dòng đã sửa: [`round-1.md`](round-1.md) mục "Đã áp".

### Vòng 2 — 2026-07-30
Thầy đưa ảnh khoanh 7 điểm mới trên `--graded`. Chi tiết: [`round-2.md`](round-2.md).
- Dịch cả 7 điểm sang component thật, **hỏi lại xác nhận trước khi động** ở 2 điểm blast-radius
  rộng (đúng luật B1): #4 đảo quyết định `parseInlineCode` cũ (thầy chốt: đảo hẳn, áp 8
  consumer) · #3/#6 mở API `EnumChip` cho icon (thầy bác thiết kế đầu — `icon: IconComponent`
  quá chung — bắt sửa theo tiền lệ `ListMark`/`markIcon` có sẵn, ra `EnumChipIcon = "check"|
  "cross"` union đóng).
- Áp 5/7 điểm: bỏ trophy icon · đổi thứ tự+vị trí chip meta · icon cross cho 2 chip fail-verdict
  · bỏ `parseInlineCode` khỏi accordion title (8 consumer, dọn thêm 4 chỗ backtick trong story
  fixture) · feedback đổi thành accordion `variant="nested"`.
- **#5 (vàng) và "gợi ý" đỏ — ĐÃ ĐÓNG, không sửa gì.** Đọc `src` thật (`ChallengeView/
  index.tsx`): outputs dùng `MarkdownContent` giữ inline-code là CỐ Ý (comment tự giải thích
  trong real source) — giả thuyết ban đầu của trò (tier sai) SAI, neo thật bác trước khi kịp
  sửa. `hint` đọc từ backend/DB (`challenge?.hint`), không có nội dung "thật" nào để đối chiếu —
  mock hợp lệ như mọi field DB-driven khác.
- Verify: `tsc` 0 lỗi · 10/10 cổng xanh · eslint sạch (file mới) · đo DOM thật khớp 5/5.
- **Cả 7/7 điểm vòng 2 đã xử lý** (5 áp sửa, 2 xác nhận không cần sửa).

### Vòng 3 — 2026-07-30
Ba lượt ảnh liên tiếp. Chi tiết: [`round-3.md`](round-3.md).
- Áp: severity "Nghiêm trọng" bỏ Chip, đổi chữ-có-màu+`|` (tiền lệ `SubmissionFindingsList` dùng
  icon nhưng thầy chỉ đích danh muốn pattern khác) · "Phản hồi" dùng `label` thay Typography tự
  chế · outputs/prerequisites bỏ markdown (backend content schema xác nhận field tên "text" khác
  "body" — `.storybook` dẫn trước `src`).
- **Phát hiện giữa chừng — bug atom thật, không phải content:** `Typography.tsx` COLOR_CLS
  `default: null` dựa vào kế thừa CSS; vendor `.accordion__body-inner { color: var(--muted) }`
  phá giả định đó. Sửa `default: "text-foreground"` — **áp toàn app**, cùng lớp bug với
  `weightCls` round-1.
- Restart Storybook thật (không chỉ HMR) vì đổi atom lõi. Sau đó Browser pane lỗi CDP/timeout
  liên tiếp (server tự xác nhận 200 qua `curl`, không phải treo) — **thầy dừng lệnh navigate,
  tự soi mắt thay vì chờ đo tiếp.**
- Còn treo: vị trí chip meta (điểm 1, chưa trả lời) · hướng "xem thêm" (3 phương án, chưa chốt) ·
  `RichText.tsx` chưa kiểm có dính cùng bug `default color` không.
- **Tiếp vòng 3 (2026-07-30, cùng ngày)**: thầy xác nhận Điểm 4 (màu foreground) đã đúng qua tự
  refresh mắt — đóng. Thêm lib `atoms/text/_markdown.ts` (`stripMarkdown`, port từ
  `useSpeechSynthesis.ts`), áp vào 3 field tier "text": `ChallengeBrief` outputs/prerequisites +
  `ChallengeDeliverableList` feedback message. `tsc`/10 cổng/eslint đều sạch.
- ⚠️ **Luật thao tác mới cho phần còn lại của phiên**: thầy cấm dùng Browser pane để verify
  (*"khoong can navigate, fix xong la dc, thay tu nhin = mat"*) — chỉ `tsc`/cổng/eslint, báo chữ.
- Còn treo mới: thầy chốt hướng "xem thêm" phải **vẽ widget thật** (không chỉ liệt kê phương án).
- **Điểm 12 (vòng 3 tiếp, lớn nhất phiên, 2026-07-30):** thầy bắt "chế" business — round 4-7 dựng
  UI (accordion đệ quy, `Disclosure`, severity chữ-màu) không có neo thật. Đọc lại backend entities
  + `src/.../LastAttemptResult/index.tsx` (đúng component, không phải `SubmissionResult`), dựng lại
  đúng field/cấu trúc: verdict Chip + câu điểm đầy đủ + feedback phẳng luôn hiện (dot severity) +
  field mới phát hiện `shortFeedback`. Phát sinh: thêm tone `info` hẳn hoi vào hệ màu (không né bằng
  neutral giả) — `--info` hoá ra CHƯA TỪNG tồn tại kể cả trong `src`; lan toả sửa 8 file
  (`Alert.tsx`/`Typography.tsx` nhận `info`, `ChipBase.tsx`/`EnumChip.tsx` phải TÁCH khỏi alias vì
  vendor `HeroChip.color` đóng cứng). Chi tiết đầy đủ: `round-3.md` Điểm 12.
- ⚠️ **Bài học ghi nhớ cho phiên sau:** đọc `src` để hiểu FIELD/CẤU TRÚC thật, KHÔNG chép nguyên
  giá trị implementation (màu, class) khi hệ đích thiếu — quyết định đó (thêm token mới hay không)
  trả lại cho thầy, không tự vá bằng workaround.

## Ngoài phạm vi

- `SurfaceCard.tsx` dòng 666/1132/1706/1986: eslint `showAnatomy` unused, xác nhận qua `git diff`
  là nợ có sẵn, không phải do lượt sửa này. Không đụng.
- `RichText.tsx` tự import `Typography` từ `@heroui/react` (raw vendor), không phải atom nhà
  `@sb-components/atoms/text/Typography` — nghĩa là atom-fix chặn vendor-bleed (Fix #4) KHÔNG
  áp cho nội dung render bên trong `RichText`. Chưa kiểm `RichText` có dính bug tương tự không.

## Còn treo

- Hai điểm feedback cũ chưa tái hiện được (xem bảng tồn đọng trên) — coi như đã lỗi thời, không
  ai nhắc lại xuyên suốt cả phiên dài này.
- Lượt sweep đầu tiên (opus) tốn ~1,69 triệu token trên dữ liệu sai, hoàn toàn phí phạm — nguyên
  nhân và cách chặn đã ghi vào canon lane (`SKILL.md` mục Model + `step-2` mục B2a/B2b).

## B4 cuối phiên (2026-07-30) — 3 mục treo lâu nhất, tất cả ra ĐẠT

Thầy chốt "xử ngay trong phiên này" trước khi đóng sổ. Không mục nào cần sửa code — cả ba là
canon/breakpoint đọc thiếu ngữ cảnh, không phải bug thật:

- **`ChallengeHeader`×`prominence` (CÂM)** — `LinkBack` muted đúng, atom tự ghi rõ "quiet text
  link", khớp ngoại lệ canon đã có sẵn. Chi tiết: `round-1.md`.
- **`ChallengeBrief`×`skeleton` (CÂM)** — đúng hình 4 (đếm hàng), chỉ khác PROP (composite dùng
  lại nhiều nơi) vs HẰNG SỐ NỘI BỘ (block riêng một trang) — hợp lệ ở cấp block. Chi tiết:
  `round-1.md`.
- **`SplitWorkspace` flex-direction** — `@app-xl` là CONTAINER query (mirror viewport scale,
  xem `globals.css` `--container-app-xl: 80rem`), đo bề ngang CONTAINER thật (1153px lúc đó,
  nhỏ hơn 1280px do chrome/sidebar chiếm chỗ) chứ không phải viewport (1280px) — đúng thiết kế,
  container-query sinh ra chính để bắt đúng ca này. Không sửa.

---

## ĐÃ ĐÓNG — 2026-07-30

> ⚠️ Sổ này từng lật `ĐÃ ĐÓNG` một lần ngay sau khi B4 xử ba mục treo, rồi phiên **vẫn chạy tiếp**
> sáu việc nữa (Điểm 15-20, xem `round-3.md`). Bản ghi dưới là bản chốt THẬT, gộp cả hai chặng.

### Phiên này sửa gì

Đích là `ChallengePage` ở state `Graded` — màn giải thử thách, cột đọc bên trái + rail nộp bài
bên phải. Thầy mở phiên bằng một ảnh khoanh màu, rồi phiên kéo dài **hai mươi điểm feedback qua
ba vòng**, dài hơn mọi phiên trước cộng lại.

Kết cục chia làm ba loại rõ rệt:

**Loại 1 — bug atom thật, sửa một chỗ áp toàn app (2 ca).** Cả hai cùng một lớp: atom `Typography`
dựa vào KẾ THỪA CSS thay vì tự khai lớp tường minh, và vendor HeroUI phá đúng giả định đó
(`.accordion__trigger{font-medium}` cho `weightCls`, `.accordion__body-inner{color:var(--muted)}`
cho `COLOR_CLS.default`). Ca thứ hai còn lộ ra bản sửa đầu **chưa đủ**: sửa GIÁ TRỊ trong bảng mà
mọi nhánh đọc bảng qua `color ? COLOR_CLS[color] : null` ⇒ caller không truyền `color` thì không
bao giờ chạm bảng đã sửa. Phải sửa cả bốn nhánh sang `COLOR_CLS[color ?? "default"]`.

**Loại 2 — chọn sai VỎ, không sai field (nhiều ca, và là bài học lớn nhất phiên).** Field đúng,
nghiệp vụ đúng, `tsc` + 10 cổng + eslint xanh — mà chọn sai component. Ca đậm nhất: một đoạn văn
(hint) nằm trong `SurfaceCardList` với `items` độ dài luôn bằng 1. Loại lỗi này **không cổng nào
bắt được** vì hợp kiểu và render ra vẫn trông được ⇒ sinh ra `.claude/fe/matrix.md`.

**Loại 3 — "chế" business, không đọc nguồn thật trước.** Round 4-7 dựng cả một hệ (accordion đệ
quy → `Disclosure` → severity chữ-màu+`|`) không tra `src`/DB. Thầy bắt, đọc lại thì hoá ra
`.artifacts/domain/challenge-and-milestone.md` **đã có sẵn từ 2026-07-29 — MỘT NGÀY trước phiên
này** — rút sẵn đúng miền đó từ 188 entity + `src`. Đọc file đó trước thì tiết kiệm 2 lượt agent
research + 1 lượt `psql` trực tiếp.

### Số đo, trước và sau

| Thứ | Trước | Sau |
|---|---|---|
| `Typography` `weight` mặc định trong accordion trigger | 500 (vendor bleed) | 400 (`font-normal` tường minh) |
| `Typography` `color` mặc định trong accordion panel | `oklch(0.5517…)` muted | `oklch(0.2103…)` foreground |
| Vạch mốc `ProgressMeterTargetMark` | `h-5 w-1 bg-accent` (20px, gấp 5× track) | `h-1 w-0.5 bg-muted rounded-none` (4px, khớp track) |
| Thanh điểm `ChallengeScoreCard` | `accent` cố định bất kể đạt/rớt | `success`/`danger` theo `earnedScore >= targetScore` |
| Khối chấm điểm | 3 tầng chồng nhau (chip + câu điểm 2 dòng + hàng lần thử) | 1 hàng meta + `Disclosure` một câu |
| Tone hệ màu | 6 (`default·muted·accent·success·warning·danger`) | 7 (thêm `info`, `--info` chưa từng tồn tại kể cả trong `src`) |
| State `ChallengeDeliverableList` diễn đạt được | 4 | 7 (thêm `jobStatus` 4 ngả · `jobError` · `autosaveStatus`) |

### Từng vòng

| Vòng | Duyệt và áp | Thầy bác (kèm lý do) |
|---|---|---|
| 1 | 11/11 ô LỆCH sau sweep 15 trục × 5 vùng (thầy: *"sửa hết đi cho thầy xem đã"*) | — |
| 2 | 5/7 điểm ảnh: bỏ trophy icon · đổi thứ tự chip meta · icon cross cho fail-verdict · bỏ `parseInlineCode` (8 consumer) · feedback thành accordion nested | 2/7: outputs markdown (đọc `src` thật thấy CỐ Ý) · hint mock (field DB-driven, không có "nội dung thật" để đối chiếu) |
| 3 (Điểm 1-14) | severity bỏ Chip · `stripMarkdown` lib · 2 bug atom · `Disclosure` cho khối phụ · `attemptNumber`/`processedAt`/`shortFeedback` · tone `info` | `flex-1` cho cặp nút (em phản biện: làm nút phụ rộng hơn nút chính, thầy chốt bỏ) · `displayId` (slug nội bộ) · `verified` (hợp trang danh sách hơn) · `approachScore`/`outcomeScore` (hằng số 70/30 mọi dòng) · `detail`+`resources` (cột có thật nhưng DB rỗng) |
| 3 (Điểm 15-20) | hint → `SurfaceCard` trần + bỏ icon đèn · khối chấm điểm gọn (phương án B) · **gỡ hẳn** feedback từng dòng · nút bám trái · màu thanh theo kết quả + vạch mốc khớp track · 3 state job/autosave | — |

### Còn treo — thứ CHƯA làm

- **`RichText.tsx` dùng `Typography` thô từ `@heroui/react`**, không phải atom nhà — nghĩa là hai
  bản sửa vendor-bleed (`weightCls`, `COLOR_CLS.default`) **KHÔNG** áp cho nội dung render trong
  `RichText`. Ghi từ vòng 1, treo suốt phiên, chưa kiểm có dính cùng bug không.
- **`ProgressMeter` lệch dọc do CSS Grid ẩn của HeroUI**: `.progress-bar` là grid 2 hàng
  (`"label output"` / `"track track"`) với `gap-1` LUÔN áp dù hàng label không render gì ⇒ track
  thật bị đẩy 4px so với tâm mà `TargetMark` đang canh. Đã tìm ra nguyên nhân
  (`node_modules/@heroui/styles/dist/components/progress-bar.css:6-11`), thầy chốt *"tính sau,
  không quan trọng lắm"*.
- **`ChallengeScoreCard` chưa có state "ngưỡng đạt chưa về config"** (`maxScore=0` → hiện tự
  fallback `safeMax=1`). Domain doc §3 cảnh báo ca này ("coi như CHƯA đạt, không được vẽ chip
  đạt") — card này không có chip đạt/trượt nên chưa gặp đúng lỗi đó, nhưng edge-case vẫn hở.
- **`ChallengeHeader` `difficulty` chỉ khai 3/5 tier thật** (`insane`/`expert` thiếu). Không phải
  bug mới — file tự ghi lý do: `EnumChip` chỉ có 5 tone, `src` dùng palette riêng cyan/vàng/đỏ/
  tím/hồng cho 5 tier. Chờ màn nào thật sự cần.

### Ngoài phạm vi — thấy nhưng cố ý không sửa

- `SurfaceCard.tsx` dòng 666/1132/1706/1988: eslint `showAnatomy` unused × 4. Xác nhận qua
  `git diff` là **nợ có sẵn**, không do phiên này. Không đụng.
- `check-story-coverage.mjs` (cổng thứ 11) đang chết — đòi bản vẽ soi gương công trình, báo thiếu
  162/162 nên không mang tin gì. Không chạy, không sửa cho xanh.
- Hai điểm feedback cũ từ trước vòng 1 chưa tái hiện được — coi như lỗi thời, không ai nhắc lại
  xuyên suốt cả phiên dài này.

### Canon có cần đổi không

**CÓ — và đây là phần nặng nhất của phiên**, vì nửa số lần thầy phải lên tiếng là loại canon
đáng lẽ chặn được. Chi tiết phân loại + nội dung đã ghi: xem mục "Canon đã sửa" ngay dưới.
