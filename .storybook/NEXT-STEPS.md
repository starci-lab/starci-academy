# NEXT STEPS — bản vẽ Storybook (chốt 2026-07-26)

> Bàn giao để máy khác làm tiếp. Đọc mục **0** và **1** trước khi gõ dòng code nào.

---

## 0. Phân vai — đọc trước, sai chỗ này thì mọi thứ dưới vô nghĩa

| Cây | Vai | Ai sửa |
|---|---|---|
| `starci-academy/.storybook` | **BẢN VẼ** — atom · layout · design · block · screen + story | **agent kẻ ở đây** |
| `starci-academy/src` | **CÔNG TRÌNH** — app thật | **THẦY** restructure, sau khi duyệt bản vẽ |

- ⛔ **CẤM codemod `src/`** trong lane design/audit. Cấm cả "sync cho khớp".
- ⛔ **CẤM đòi sync.** Spec lệch app là trạng thái BÌNH THƯỜNG — file port ghi sẵn *"synced to `src` later"*.
- ✅ Số liệu đếm trong `src` chỉ dùng để **chọn mặc định cho bản vẽ** (vd `max-w-3xl` 72 lần ⇒ default của `Container`), KHÔNG phải danh sách phải sửa.
- ⭐ Gom họ · dời tầng · đặt lại category = **DESIGN, thầy chốt**. Agent chỉ kẻ bản vẽ + chỉ chỗ đá nhau.

**Canon SSOT** nằm ở repo KHÁC: `starci-academy-backend/.claude/fe/principles.md` (§0 · §12 atom · §13 layout) và `.claude/skills/starci-fe-atom-audit/SKILL.md`.

---

## 1. Luật MỚI chốt trong lượt này (đã bake vào canon, đừng làm ngược)

| § | Luật | Neo |
|---|---|---|
| **§0** | `.storybook` = bản vẽ, `src` = công trình | mục 0 ở trên |
| **§12g.1** | **"Có hình" = ĐỔI PIXEL.** Prop chỉ chạy vào `aria-*` (`label`, `ariaLabel`, `removeLabel`) **KHÔNG có leaf** | mở leaf cho chúng ⇒ leaf render ra hai ô y hệt = chính dấu hiệu lỗi atom |
| **§12g.2** | `items`/`options` **CÓ** leaf và leaf đó **chính là `Default`** (đừng đẻ thêm leaf `Items`); `text`/`amount` **KHÔNG** leaf riêng | `Button.Group` → `Default` ghi *"Prop `items`"* · `Chip.Base` → *"Bare chip"*. Hai kiểu này khác nhau là HỢP LỆ |
| panel | **Tab States đã BỎ.** `BlockAnatomy` còn 2 tab: `Deps` · `Code`. Type `AnatomyStateCell` + prop `states` đã xoá — **thêm lại là vỡ tsc** | soi thật thấy nó chỉ lặp bằng chữ đúng thứ khung render đã hiện bằng hình |
| deps | Deps chỉ nhận node **có `storyId` thật** (bấm nhảy được). Rỗng ⇒ **tab không hiện** | `Spinner.Base` từng tự khai part trỏ vào chính nó, không `storyId` |
| UI text | Chữ hiện ra màn hình = **TIẾNG ANH**; JSDoc/comment = **tiếng Việt** (neo § nằm ở đó) | |

---

## 2. Đã xong (đừng làm lại)

**Tầng atom** — 41 atom trong 7 category (Display · Feedback · Forms · Media · Navigation · Overlay · Text):
- Panel chuyển hết `parts=` (deprecated) → `annotate` + `storyId` thật.
- Bộ leaf phủ đủ prop có hình. Gộp các leaf từng tách theo GIÁ TRỊ (`Horizontal`/`Vertical` → `Orientation`, `OneColumn`/`ThreeColumns` → `Columns`).
- `UserAvatar` **gộp vào `Avatar.Base`** (DiceBear + tụt chặng khi ảnh **lỗi tải**, không chỉ khi thiếu URL). Thư mục `UserAvatar/` đã xoá.
- Xoá 9 file story pre-canon ở `stories/atoms/identity/` + `stories/atoms/commerce/` (hai folder không có category component tương ứng — đó là lý do bản kiểm kê đầu tiên trượt hết).
- Dọn 13 chuỗi UI tiếng Việt lọt ra màn hình qua **giá trị mặc định của prop** (`"Đang tải"`, `"Trở lại"`, `"Chọn ngày"`, `"Đã chọn n"`…).

**Tầng layout** — mới dựng + hợp nhất:
- ⭐ **`Container.Base`** (mới): `mx-auto` + `size` + `padding: SpaceScale` + slot, và **MỞ `@container`**.
- `Grid.Base`: thêm `span?: 1 | 2` cho ô lưới.
- `Page.Container` **XOÁ**, gộp vào `Container.Base` (§13c).
- `SurfaceCard`: 3 boolean → **3 trục có tên** — `bordered` → `variant: "surface" | "nested"` · `flushContent` → `padding: SpaceScale` · `compact` → `radius: "xl" | "3xl"`.
- `SurfaceCard.PressableGroup` bỏ hệ lưới riêng, dựng bằng `Grid.Base`.
- `PADDING_CLASS` gom về SSOT `layouts/_spacing.ts` (cùng chỗ với `SpaceScale`/`GAP_CLASS`).

### Số đo đã verify (không phải suy đoán)
| Kiểm | Kết quả |
|---|---|
| `max-w-app-sm/md/lg/xl` có compile? | **640 / 768 / 1024 / 1280px** |
| `Container` có mở container? | `containerType: inline-size` |
| Mở `@container` có tác dụng? | cùng `Grid` + cùng `columns` → khổ `md` **2 cột**, khổ `xl` **4 cột** |
| `Grid` `span` | ô đầu `span 2 / span 2` = 743px, ba ô sau 365px |
| `PressableGroup` sau khi đổi ruột | 1 lưới, 2 cột, gap 12px, 4 ô |

---

## 3. NEXT STEPS — xếp theo thứ tự nên làm

### 3.1 🔴 `stories/layouts/**` vẫn dùng API panel CŨ
Mới chỉ dọn `stories/atoms/**`. Bên `layouts` còn nhiều file dùng `parts={...}` + `type AnatomyNode`.

```bash
grep -rl "parts={" .storybook/stories/layouts
```

Việc: chuyển sang `annotate`, **chỉ giữ entry có `storyId` thật**, không có deps thì bỏ hẳn prop (tab Deps tự ẩn). Dịch chữ UI sang tiếng Anh. Xem file mẫu `stories/atoms/chips/Chip/Chip.Base.stories.tsx`.

Còn sót ngoài vùng đã dọn: `stories/atoms/form/Form/Form.{Base,Section}.stories.tsx` — hai file này title là `Layouts/Form/…` (tầng khung) nhưng **nằm nhầm trong thư mục `atoms/`**. Dời hay để tuỳ thầy chốt.

### 3.2 🟠 `Cluster` vs `Stack.H` — có phải một khung không?
Cả hai đều là "hàng ngang". `Stack.H` nhận `children` (arbitrary), `Cluster` nhận `items` (N phần tử cùng kiểu) + wrap. Header của chúng tự phân biệt, nhưng đáng soi lại xem ranh giới có thật hay chỉ là hai lần dựng cùng một thứ. **Gom hay giữ = thầy chốt.**

### 3.3 🟠 F3 — 5 atom cùng trả lời "chọn 1 trong N" (CHƯA chốt, treo từ trước)
`Tabs` · `ExtendedTabs` · `SegmentedToggle` · `FlexWrapButtonRadio` · `SelectableCardGroup`.

Chia hai nhóm WHY: **đổi vùng xem** (Tabs, ExtendedTabs) vs **chọn giá trị** (3 cái còn lại). Ba chỗ chồng lấn:
1. `Tabs` vs `ExtendedTabs` — cùng hình, khác đường vào (`items` vs `children`); bù trừ nhau (`Tabs` có `isSkeleton` không có `size`, `ExtendedTabs` ngược lại).
2. `SegmentedToggle` vs `FlexWrapButtonRadio` — cùng hàng pill chọn-1.
3. `SelectableCardGroup` đứng cạnh `Choice.RadioGroup` (forms) chứ không phải navigation ⇒ xếp nhầm category.

3/5 file tự khai trong header là *"full port of `@/components/**blocks**/navigation/…"* — tức **block cũ bê thẳng vào `atoms/`**, chưa qua thiết kế atom lần nào.

Ba phương án đã trình thầy: **A** gom theo LÝ DO (5→2 họ) · **B** gom theo HÌNH (5→3) · **C** chỉ gộp cặp trùng rõ (5→3). **Chờ thầy chọn.**

### 3.4 🟠 F4 — atom mang nội dung DOMAIN (§6c: phải tụt xuống `design`)
- `PricePoint` — biết "số tiền + kỳ thanh toán". Header tự thú *"distinct from `commerce/PriceTag`"* ⇒ hai component tiền nong song song.
- `UserCell` — biết "user có username + avatar", lại là một **cụm**.

Dời tầng = đổi thư mục + story title + import ⇒ **thầy chốt**.

### 3.5 🟡 Bộ leaf còn mỏng / lỗi lặt vặt (agent nhặt, chưa xử)
- `Feedback.Confirm` không forward `showAnatomy` xuống `Button.Group` ⇒ nút trong Footer không badge được.
- `Toast` không truyền `anatPart` xuống `Alert.Base`.
- `Choice.Radio` thiếu prop `anatPart` nên `RadioGroup` không tag được từng hàng.
- `Input.Password`: trạng thái "đã hiện mật khẩu" là `useState` nội bộ, **không ghim được thành leaf** — muốn có leaf phải thêm prop điều khiển (như `isCopied` đã làm cho `SnippetIcon`, `isDragActive` cho `ImageDropzone`).
- `Dropzone` (khác `ImageDropzone`): `isDragActive` cũng chưa ghim được.

### 3.6 🟡 Card variant — còn đường mở rộng
`variant` hiện chỉ 2 giá trị (`surface` · `nested`). HeroUI `Card` có sẵn `default | secondary | tertiary | transparent` — nếu cần thêm nấc mặt thì nới union ở đây, đừng đẻ prop boolean mới.

---

## 4. Gotcha khi dựng trên máy khác

**Storybook không boot được — "An Application Control policy has blocked this file … resolver.win32-x64-msvc.node"**
Máy bật Smart App Control (SAC) chặn native `.node` chưa ký của `oxc-resolver`. Lách bằng cài binding WASM (loader napi-rs tự fallback):
```bash
npm install @oxc-resolver/binding-wasm32-wasi@11.24.2 --no-save --force --ignore-scripts
```
Rồi chạy `npm run storybook` **bình thường**. 🚫 ĐỪNG set `NAPI_RS_FORCE_WASI=true` — nó global, kéo luôn `@swc/core` sang WASI và vỡ. ⚠️ `npm ci` sẽ xoá binding này (`--no-save`), cài lại khi cần.

**Watcher Windows kẹt khi THÊM/XOÁ/ĐỔI TÊN file story** — sửa nội dung thì hot-reload ok, nhưng thêm story mới thì index không cập nhật. Phải restart:
```bash
netstat -ano | grep ":6006.*LISTENING"    # lấy PID
```
kill PID đó rồi `npm run storybook` lại. Xác nhận bằng `curl -s http://localhost:6006/index.json`.

**Verify bằng SỐ ĐO, đừng tin báo cáo agent.** Sau mỗi lượt: `npx tsc --noEmit` (bỏ qua 2 lỗi nền `.next/types/validator.ts` về `rag-playground` — cache Next cũ) + `npx eslint ".storybook/**/*.{ts,tsx}"`. Với thứ dính layout/CSS thì đo DOM thật (`getComputedStyle`) — nhiều lỗi ở tầng này **không làm vỡ tsc**: class Tailwind sai tên thì im lặng không sinh CSS, breakpoint sai thang thì bắn sai chỗ mà chẳng ai báo.

**Khi cắm Workflow:** chặn cứng `"KHÔNG đụng src/"` ngay trong spec agent — Sonnet chạy nền không tự suy ra ranh giới §0. Và nhớ: codemod theo TÊN PROP là bẫy (nhiều component dùng chung tên `bordered`; chuỗi `"compact"` còn là **giá trị** của `Page.Header size="compact"`) ⇒ phải giới hạn theo **thẻ JSX của chính component đó**.
