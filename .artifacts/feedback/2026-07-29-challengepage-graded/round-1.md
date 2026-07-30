# Vòng 1 — 2026-07-30

> Chạy bằng Workflow 15 agent (mỗi trục một agent, `sonnet`, không effort override), quét đủ 5
> vùng × 15 trục = 75 ô. Dữ liệu: `dom-full.json` (77 node, đo trên viewport 1280×900 sau khi ép
> vì lần đo đầu degenerate) + 6 file source thật. Chạy TRƯỚC khi cơ chế triage B2a/B2b được viết
> vào skill — vòng này là một-nhịp đầy đủ, không phải hai-nhịp.

## Ma trận

| Vùng | flow | prom | async | frame | naming | seam | inset | surf | skel | text | icon | color | button | press | md |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ChallengeHeader | ĐẠT | **CÂM** | N/A | ĐẠT | ĐẠT | ĐẠT | N/A | N/A | ĐẠT | ĐẠT | ĐẠT | ĐẠT | N/A | ĐẠT | **LỆCH** |
| ChallengeBrief | ĐẠT | **LỆCH** | ĐẠT | ĐẠT | ĐẠT | ĐẠT | N/A | ĐẠT | **CÂM** | ĐẠT | **LỆCH** | **LỆCH** | N/A | ĐẠT | ĐẠT |
| ChallengeDeliverableList | ĐẠT | ĐẠT | N/A | ĐẠT | **LỆCH** | ĐẠT | N/A | ĐẠT | ĐẠT | **LỆCH** | ĐẠT | **LỆCH** | ĐẠT | ĐẠT | **LỆCH** |
| ChallengeScoreCard | ĐẠT | ĐẠT | N/A | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | ĐẠT | **LỆCH** | N/A | ĐẠT | N/A | ĐẠT | **LỆCH** |
| SplitWorkspace | ĐẠT | N/A | N/A | ĐẠT | **LỆCH** | ĐẠT | N/A | N/A | ĐẠT | N/A | N/A | N/A | N/A | N/A | N/A |

**75/75 ô có phán quyết, không ô trống. 11 LỆCH · 2 CÂM · còn lại ĐẠT/N/A.**

## Chi tiết 11 ô LỆCH

### Cụm A — slot `titleEnd` của `Accordion.Trigger` dính 3 lỗi khác nhau, cùng một chỗ

Ba trục (`prominence`, `color`, `text`) đều chỉ vào cùng một composite `ScoreValue` khi nó đứng
trong `titleEnd` của accordion — không phải trùng hợp, cùng một chỗ code sai theo ba góc nhìn.

**1. `ChallengeBrief` × `prominence` — LỆCH**
- Đang: `ScoreValue` (điểm mỗi yêu cầu) màu accent hồng bão hoà cao (`oklch(0.7003 0.2092 …)`)
- Đúng: `muted` — cùng trang, `ChallengeHeader` giữ đúng "N điểm" ở `muted` với docstring tự
  giải thích *"a raw number is not a classifying fact"*. Hai chỗ cùng loại thông tin đang lệch
  quy ước với nhau.
- Sửa ở: `composites/text/ScoreValue/ScoreValue.tsx:42`, đổi `color="accent"` → bỏ hẳn (mặc định
  đã đúng theo phán quyết trục `color` bên dưới)
- Còn giống: `ChallengeDeliverableList.tsx:199` dùng lại đúng component này

**2. `ChallengeBrief` × `color` — LỆCH** (cùng dòng code với #1, khác lý lẽ)
- Đang: `ScoreValue.tsx:42` hard-code `color="accent"`
- Đúng: `default` — số dính liền một control đang active (`Accordion.Trigger`) và mang giá trị
  thông tin thật, đúng khuôn tiền lệ `ReactionButton.tsx:182`
- Sửa ở: cùng `ScoreValue.tsx:42`, bỏ `color="accent"`

**3. `ChallengeDeliverableList` × `color` — LỆCH** (hướng ngược lại #2, cùng gốc slot)
- Đang: nhánh đã chấm dùng `Typography color="muted"` cho "earned/required" — **thiếu nổi**
- Đúng: `default`, cùng lý lẽ với #2
- Sửa ở: `ChallengeDeliverableList.tsx:194`

**4. `ChallengeDeliverableList` × `text` — LỆCH**
- Đang: `Typography` trong cùng slot `titleEnd` đo ra `font-weight: 500` dù source **không khai
  `weight`**
- Đúng: `regular` (400) — chứng minh bằng đối chứng: cùng component, cùng file, đặt NGOÀI slot
  trigger thì đo đúng 400
- Đây là **bug vendor CSS bleed**: `.accordion__trigger { font-medium }` của HeroUI tràn vào mọi
  con bên trong, không phải lỗi chọn giá trị
- Sửa ở: `Typography.tsx:417-423` (không phát `font-normal` để chặn bleed) **hoặc**
  `SurfaceCard.tsx:1656` (slot `titleEnd` không reset weight) — hai lựa chọn tầng, cần thầy chọn

### Cụm B — Tier A thiếu `weight="bold"`

**5. `ChallengeScoreCard` × `text` — LỆCH**
- Đang: `earnedScore` (`h3`, tâm điểm của card) đo `font-weight: 600`
- Đúng: `700` (bold) — Tier A *"đứng riêng làm tâm điểm"* luôn bold. Đối chứng: `ChallengeHeader`
  cùng vai trò khai đúng `weight="bold"`, đo ra 700
- Sửa ở: `ChallengeScoreCard.tsx:97-103`, thêm `weight="bold"`

### Cụm C — icon size-5 bị gán `bold` sai lưới size×weight

**6. `ChallengeBrief` × `icon` — LỆCH**
- Đang: `LightbulbIcon` (size-5, vị trí DIV trong accordion trigger) gán cứng `weight="bold"`
- Đúng: `regular` — lưới size×weight ghi rõ size-5+bold = *"nét quá nặng, lệch nhịp hàng"*
- Đối chứng: `CheckCircleIcon` cùng file, cùng size-5, không gán weight ⇒ đúng
- Sửa ở: `ChallengeBrief.tsx` dòng ~230-237, bỏ `weight="bold"`

### Cụm D — field `richtext nhỏ` đang render Typography trần thay vì `RichText`

Ba ô, cùng một lỗ hổng hệ thống: composite `RichText` có **0 consumer thật** trong toàn repo.

**7. `ChallengeHeader` × `markdown` — LỆCH** — field `description` qua `PageHeader` → Typography trần. Sửa ở `Page.tsx:172-179` (điểm chốt dùng chung mọi consumer `PageHeader`).

**8. `ChallengeDeliverableList` × `markdown` — LỆCH** — `feedback[].message/location/suggestion` qua Typography trần. Sửa ở `ChallengeDeliverableList.tsx:267,269,272`.

**9. `ChallengeScoreCard` × `markdown` — LỆCH** — `description` cố định qua `SurfaceCard.tsx:478`. Cùng pattern lặp ở `SurfaceCard.tsx:1512` (variant `.List`).

### Cụm E — sai tên/tầng

**10. `ChallengeDeliverableList` × `naming` — LỆCH**
- `ChallengeDeliverableFeedback` là phần tử mảng nhưng thiếu hậu tố `Item`. File liền kề
  (`ChallengeBrief.tsx`) đặt đúng 4/4 lần — xác nhận quy ước thật của repo.
- Sửa ở: dòng 81 + 103, đổi thành `ChallengeDeliverableFeedbackItem`

**11. `SplitWorkspace` × `naming` — LỆCH**
- JSDoc tự gắn nhãn `LAYOUT (khung)` nhưng file nằm ở `frames/` ⇒ đúng bẫy §4.6 "tier trong bài
  viết không khớp tier trên đĩa". Đồng thời JSDoc mô tả namespace `.Base` nhưng export lại BARE.
- Sửa ở: dòng 6 (`LAYOUT`→`FRAME`), dòng 42 (`SplitWorkspaceBaseProps`→`SplitWorkspaceProps`),
  dòng 62-93 (bỏ khai báo namespace giả)

## 2 ô CÂM — B4 tra ngành (2026-07-30, cuối phiên), cả hai ra ĐẠT

**`ChallengeHeader` × `prominence`** — `LinkBack` màu `muted`, nhưng canon nói mặc định `isLink`
là `accent`; đồng thời canon cũng ghi ngoại lệ hợp lệ khi link cần "hoà vào tông hàng nó đứng".
Không đủ để phân định LinkBack thuộc diện nào.

→ **ĐẠT.** Đọc `LinkBack.tsx` (đúng nguồn ưu tiên #1 của `prominence/context.md` §5 — "src thật
của CHÍNH component đang xét"): docstring chính atom viết thẳng *"A quiet text link (muted), NOT
a pill/button"* — quyết định CỐ Ý, không phải mặc định trôi từ đâu. `LinkBack` không đi qua
`Typography.isLink` (cái quy tắc "mặc định accent" áp cho PROP đó) — nó tự dựng `HeroUILink` +
`text-muted` tay. Đúng khớp ngoại lệ canon tự ghi ("hoà vào tông hàng nó đứng"): một link "quay
lại" là điều hướng/chrome đầu trang, không phải tín hiệu nội dung cần nổi. Không sửa gì.

**`ChallengeBrief` × `skeleton`** — hai hằng số `PREREQUISITE_SKELETON_ROWS`/`OUTPUT_SKELETON_ROWS`
đứng cấp module để giả lập số dòng shimmer cho danh sách độ dài phụ thuộc dữ liệu. Cây quyết
định hỏi "danh sách lặp mà số lượng phụ thuộc dữ liệu" nhưng không nói dứt khoát cách xử đúng là
gì.

→ **ĐẠT.** Cây `skeleton/context.md` §2 Q3 xác nhận đúng HÌNH (hình 4 — "ĐẾM HÀNG THEO PROP
RIÊNG", ví dụ `Legend.tsx skeletonCount=3`/`KeyValue.tsx skeletonRows=3"), không lệch hình. Chỗ
canon chưa nói dứt khoát là **PROP hay HẰNG SỐ NỘI BỘ** — hai ví dụ neo (`Legend`/`KeyValue`) đều
ở tầng composite/atom DÙNG LẠI NHIỀU NƠI nên số dòng hợp lý là prop caller chỉnh được;
`ChallengeBrief` là BLOCK riêng cho MỘT trang, "2 dòng" là phỏng đoán content-authoring cố định
(chính file đã tự ghi rõ lý do trong comment "SKELETON SHAPE IS A JUDGEMENT CALL"), không phải
thứ caller (`ChallengePage`) cần hoặc nên tinh chỉnh — biến nó thành prop sẽ rò rỉ chi tiết dựng
hình vào bề mặt prop vốn phải toàn nghiệp vụ. Đúng tinh thần hình 4 (đếm được, không bịa), chỉ
khác cấp — hợp lệ. Không sửa gì.

## Đã áp — 2026-07-30

Cả 11 ô LỆCH đã sửa (2 ô CÂM giữ nguyên, chưa qua B4). File đã đụng:

| File | Fix |
|---|---|
| `composites/text/ScoreValue/ScoreValue.tsx` | gỡ `color="accent"` (#1, #2) |
| `starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList.tsx` | gỡ `color="muted"` scoreEnd (#3) · rename `ChallengeDeliverableFeedback→…Item` (#7) · 3 field feedback sang `RichText` (#9) |
| `atoms/text/Typography/Typography.tsx` | `weightCls` fallback `null→"font-normal"`, chặn vendor bleed (#4) |
| `starci/blocks/learn/ChallengeScoreCard/ChallengeScoreCard.tsx` | thêm `weight="bold"` cho `earnedScore` (#5) |
| `starci/blocks/learn/ChallengeBrief/ChallengeBrief.tsx` | gỡ `weight="bold"` khỏi `LightbulbIcon` (#6) |
| `starci/blocks/learn/ChallengeHeader/ChallengeHeader.tsx` | description sang `RichText`, isSkeleton chảy prop không branching (#10) |
| `composites/cards/SurfaceCard/SurfaceCard.tsx` | 2 điểm caption sang `RichText`, cùng pattern isSkeleton-chảy-prop (#11) |
| `frames/SplitWorkspace/SplitWorkspace.tsx` | `LAYOUT→FRAME`, gỡ namespace giả, `SplitWorkspaceBase→SplitWorkspace` (#10 naming) |
| `stories/.../ChallengeDeliverableList.stories.tsx`, `ChallengeHeader.stories.tsx`, `stories/composites/cards/SurfaceCard/SurfaceCard.stories.tsx` | thêm/đổi `ANNOTATE["RichText"]`, gate `check-orphan-parts` bắt 2 lượt liên tiếp |

## Verify

- `tsc --noEmit`: **0 lỗi**
- 10/10 cổng: **xanh** (2 lượt — lượt đầu `check-orphan-parts` bắt 2 badge `RichText` chưa khai, sửa xong xanh lại)
- `eslint`: sạch trên mọi file em sửa. **4 lỗi `showAnatomy` unused ở `SurfaceCard.tsx` dòng 666/1132/1706/1986 là NỢ CÓ SẴN** — xác nhận bằng `git diff`, diff của em chỉ chạm dòng 476 và 1513. Không sửa, ghi vào ngoài phạm vi.
- Đo lại DOM thật (không tin cổng): `ScoreValue` color → default (đúng, trước là accent hồng) · `earnedScore` fw 700 (đúng, trước 600) · titleEnd Typography fw 400 (đúng, trước 500, vendor bleed đã chặn) + color default (đúng, trước muted) · 5 node `RichText` đang render thật trong DOM (trước 0 consumer thật).

## Cần thầy soi

Storybook đang chạy HMR, không cần restart (chỉ sửa nội dung file có sẵn, không thêm/xoá story). Mở lại `--graded` để soi mắt xác nhận hình.
