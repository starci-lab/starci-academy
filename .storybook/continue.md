# continue — bàn giao tầng vocabulary (chốt 2026-07-31)

> Đọc mục **0** và **1** trước khi gõ dòng code nào. File này thay
> `starci-academy-backend/.claude/fe/continue.md` (đường dẫn đó **không còn tồn tại** — bộ skill
> mới đã thay `.claude/fe/`). Chỗ nào đá với `NEXT-STEPS.md` (2026-07-26) thì **file này đúng**.

---

## 0. Phân vai — ĐÃ ĐỔI so với bản 2026-07-26

| Cây | Vai | Trạng thái |
|---|---|---|
| `.storybook/components` | **BẢN VẼ** — nơi luật được thử và chốt | 3 tầng đáy đã có luật + gate |
| `src/components/{atoms,frames}` | **BẢN SAO của bản vẽ trong app** | 61 file, cắt anatomy, **chưa ai import** |
| `src/components/{blocks,features,…}` | **CÔNG TRÌNH** — app thật | 714/829 file còn chạm thẳng `@heroui/react` |

🔴 **Luật "CẤM codemod `src/`" trong `NEXT-STEPS.md` đã hết hiệu lực.** Thầy chốt 2026-07-31: chép
atom + frame sang `src/`, cắt khái niệm anatomy (nó nuôi BlockAnatomy panel mà chỉ Storybook mới có).

⚠️ **Hai cây giờ là hai bản sao và sẽ trôi khỏi nhau.** Chưa có luật nào nói thay đổi phải hạ cánh
ở đâu trước. Đó là câu cần thầy trả lời sớm — xem khoản nợ `src-tier-ported-but-unused`.

---

## 1. Ba tầng đã có luật viết ra và gate chạy được

Canon ở repo khác: `starci-academy-backend/.claude/design/storybook/architecture/`
— `concept.md` (7 tầng, chiều import) và `elements/<tier>.md` (luật đánh số) + `examples/<tier>.md`.

```bash
CLAUDE=C:/Repositories/ac/starci-academy-backend/.claude
node $CLAUDE/scripts/audit-atoms.mjs      C:/Repositories/starci-academy
node $CLAUDE/scripts/audit-frames.mjs     C:/Repositories/starci-academy
node $CLAUDE/scripts/audit-composites.mjs C:/Repositories/starci-academy
```

Số đo lúc bàn giao:

| Gate | Trạng thái |
|---|---|
| ATOM-3 · ATOM-4 | ok |
| ATOM-5 | **2** — `composites/layout/Page/Page.tsx` vẽ skeleton tay, là ca COMPOSITE-10 chưa sửa |
| ATOM-5-type | **32** — `className` vẫn *khai báo*, chờ 6 forward có chỗ đáp |
| ATOM-8 | **2** — `Input`, `Choice` |
| FRAME-3/4/8/9/11 | ok |
| FRAME-10 | **2** — `wrap` trên `StackH`/`Flex` |
| COMPOSITE-3 | **12** |
| COMPOSITE-4 | **45** |
| COMPOSITE-8 | **16** file / 80 prop |
| COMPOSITE-10 | **17** |
| COMPOSITE-3-missing-atom | **30** — *thông tin, KHÔNG tính là vi phạm* |

**tsc baseline = đúng 2 lỗi**, cả hai trong `.next/` (`rag-playground/page.js`). Bất kỳ số nào khác
là do bạn.

---

## 2. Luật chốt trong lượt này — đừng làm ngược

| Luật | Nội dung | Vì sao |
|---|---|---|
| ATOM-5 / FRAME-4 / COMPOSITE-4 | `classNames: Array<AllowedClassName>` — union **ĐÓNG** | mở một lối tuỳ ý là mọi số đo bằng mắt theo lối đó mà vào |
| **không có `@deprecated`** | prop cũ xoá trong cùng thay đổi tạo prop mới | prop deprecated là cửa vẫn mở treo biển; gate xanh cạnh nó đọc ra là "đã tuân thủ" |
| FRAME-9 | frame nhận `items` hoặc slot có tên — **không bao giờ `children`** | `children: ReactNode` là cửa vĩnh viễn không siết được: không có tên thì không có chỗ treo type |
| ATOM-8 | atom render atom **khác** một lần cho mỗi phần tử ⇒ composite | nhận `items` không phải dấu hiệu; **render một atom** mới là |
| COMPOSITE-3 | vendor **dừng** ở tầng atom | thư viện UI không phải một tầng, nên "import đi xuống" không chạm tới nó |
| COMPOSITE-10 | composite quyết **cái nào** shimmer và **bao nhiêu**; atom quyết **hình dạng** | danh sách đang tải là ba hàng, và không tầng nào dưới đẻ ra được số ba |
| COMPOSITE-8 | composite nhận `ComponentType`, không nhận `ReactNode` | node đã **được gọi** rồi — không với vào trong được, trừ `cloneElement` |
| ATOM-10 / FRAME-11 | atom **tự** đặt tên; frame **nhận** tên từ caller | tên thuộc về ai biết mình là gì |

---

## 3. Việc tiếp theo, theo thứ tự

### 3.1 Chạy lại workflow đã dừng giữa chừng
`composites-2.js` (15 agent) — 10 nhóm file làm COMPOSITE-10 + thêm `classNames`, rồi 4 nhánh call
site, rồi đóng cửa. Script còn nguyên trong scratchpad phiên; args là 10 nhóm file composite.

Công dở dang của lần chạy đó **đang nằm trong `git stash`** (`stash@{0}`, có
`composites/form/InputTags/` mà agent đã tách được). Không pop — chồng 9 file; làm lại sạch hơn.

### 3.2 COMPOSITE-8 — `ReactNode` → `ComponentType`
16 file / 80 prop. Đổi **kiểu** prop nên cascade ra hàng trăm call site → workflow riêng, đừng trộn
với 3.1.

### 3.3 Hai câu chờ thầy
- `wrap`: hai chỗ `Footer` đã có ngưỡng trong class ⇒ xoá. Hai chỗ còn lại là cặp không đồng nhất
  cần reflow thật — ép đặt tên ngưỡng, hay công nhận reflow hai phần tử không phải breakpoint?
- **30 atom còn thiếu** — `Card` `Modal` `Drawer` `Table` `Switch` `ListBox` `Label` `AlertDialog`.
  Chúng không cùng loại: `Modal`/`Drawer`/`AlertDialog` là **overlay** (đã có tier riêng);
  `Card` không render giá trị nào nên không thoả ATOM-4, nó là chrome mà `SurfaceCard` đã làm.

### 3.4 Việc lớn nhất, chưa động
714 file trong `src/` còn chạm thẳng `@heroui/react`. Tầng đáy đã dựng và đứng được, nhưng công
trình chưa nối vào. Nhánh rẻ nhất để mở hàng: `drawers` (13 file), `modals` (46).

---

## 4. Sổ nợ — đọc TRƯỚC khi động vùng code lạ

```bash
node $CLAUDE/scripts/record-technical-debt.mjs list
node $CLAUDE/scripts/record-technical-debt.mjs --check
```

12 khoản đang mở. Code trông kỳ có thể **đã được cân nhắc rồi gác lại**, chứ không phải chưa ai nhìn.
Một `## Why it was left` là **lời kể**, không phải bằng chứng — nếu nó bảo một chỗ đang bị chặn thì
tự xác nhận cái chặn còn đó.

---

## 5. Bẫy đã dẫm, đừng dẫm lại

**`git stash` nuốt cả một lượt làm việc.** 63 file của một workflow từng biến mất khỏi cây và gate
báo lại y như chưa từng chạy. Nhiều khả năng `lint-staged` sao lưu (`Backing up original state in
git stash`) rồi không khôi phục vì lượt commit bị kill. **Kiểm `git stash list` khi kết quả gate mâu
thuẫn với thứ vừa làm xong.**

**Repo có nhiều hơn hai cổng.** `tsc` xanh + gate kiến trúc xanh **không** đủ: hook story của repo
bắt được 6 `storyId` gãy mà cả hai cổng kia không thấy. Agent báo "chỉ metadata, không ảnh hưởng" —
nó nói thật trong phạm vi nó biết.

**Gate xanh vì luật viết hụt, không vì cây sạch** — dẫm ba lần:
- FRAME-11 viết "mọi frame nhận cả hai" ⇒ gate chỉ kiểm prop *được khai* ⇒ xanh trong khi 5 frame
  mang công tắc không nối vào đâu, và một sweep "chép quy ước sẵn có" nhân bản thêm 3 cái nữa.
- FRAME-9 cũ chỉ báo khi `children` nằm *cạnh* slot ⇒ bỏ lọt `Stack`, thứ có 155 file import.
- ATOM-8 miễn trừ "cùng thư mục" ⇒ xanh trên cả bốn `*Group`, bốn vi phạm rõ nhất của tầng.

**Chia việc theo chữ cái là đoán hình dạng cây.** Chia `blocks/` A–F/G–L/M–Z giả định các folder cỡ
ngang nhau; thực tế `learn/` là **một** folder chứa 59/62 file còn lại. Chia theo **số file**, và
đưa cho mỗi agent **danh sách tường minh**.

**Hai agent một file = tsc dao động không ai chẩn được.** Chia theo **thư mục sở hữu**, không theo
luật — `SurfaceCard` dính cả ba luật composite cùng lúc.

**`args` của Workflow tới script dưới dạng chuỗi JSON**, không phải mảng.
`typeof args === "string" ? JSON.parse(args) : args`.

---

## 6. Cho agent: hai câu đáng viết vào mọi prompt

- **Nếu atom nhà không diễn được thứ vendor đang làm ⇒ DỪNG và báo thiếu gì**, đừng nới atom cho vừa
  một caller. Câu này đã cứu ca `Divider`/`Cluster`: agent dừng, báo `Divider` chỉ vẽ được đường kẻ
  chứ không vẽ glyph theo `currentColor`, nhờ đó `Divider` mọc `shape="inline"` đúng chỗ.
- **Cuối lượt, tự đọc ba file mình không viết và nói thật xem có làm nó tệ đi không.** Câu này moi
  ra `SurfaceCard` — agent tự khai chỗ nó làm chưa tới, đáng hơn một cái gate xanh.

Và một điều cấm: **một cú xoá ép để gate xanh, để lại cast hoặc tsc đỏ, tệ hơn một tồn đọng trung
thực.** Agent đóng cửa lượt `children`→`body` đã từ chối ép FRAME-9 về 0 và liệt kê đủ 58 file chưa
chuyển — đúng.
