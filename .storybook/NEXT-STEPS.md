# NEXT STEPS — bản vẽ Storybook (chốt 2026-07-26)

> Bàn giao để máy khác làm tiếp. Đọc mục **0** và **1** trước khi gõ dòng code nào.
>
> 🔴 **File này ĐÃ BỊ VƯỢT một phần.** Bàn giao hiện hành là
> `starci-academy-backend/.claude/fe/continue.md` (2026-07-27). Chỗ nào hai bên đá nhau thì
> **continue.md đúng**. Ba chỗ trong file này đã lạc hậu, đã đánh dấu tại chỗ:
>
> | Chỗ | File này ghi | Thật ra |
> |---|---|---|
> | mục 1, dòng `panel` | *"tab States đã BỎ, thêm lại là vỡ tsc"* | **`states[]` là API hiện hành**, 109 story đã di trú. ĐỪNG THÁO |
> | mục 0 + 2 | tầng `layout` | đã tách **`frame` (7) + `composite` (37)** ⇒ 6 tầng |
> | mục 2 + 3.1 | `layouts/_spacing.ts`, `stories/layouts/**` | nay là `frames/_spacing.ts`, `stories/frames/**` + `stories/composites/**` |

---

## 0. Phân vai — đọc trước, sai chỗ này thì mọi thứ dưới vô nghĩa

| Cây | Vai | Ai sửa |
|---|---|---|
| `starci-academy/.storybook` | **BẢN VẼ** — atom · frame · composite · design · block · screen + story | **agent kẻ ở đây** |
| `starci-academy/src` | **CÔNG TRÌNH** — app thật | **THẦY** restructure, sau khi duyệt bản vẽ |

- ⛔ **CẤM codemod `src/`** trong lane design/audit. Cấm cả "sync cho khớp".
- ⛔ **CẤM đòi sync.** Spec lệch app là trạng thái BÌNH THƯỜNG — file port ghi sẵn *"synced to `src` later"*.
- ✅ Số liệu đếm trong `src` chỉ dùng để **chọn mặc định cho bản vẽ** (vd `max-w-3xl` 72 lần ⇒ default của `Container`), KHÔNG phải danh sách phải sửa.
- ⭐ Gom họ · dời tầng · đặt lại category = **DESIGN, thầy chốt**. Agent chỉ kẻ bản vẽ + chỉ chỗ đá nhau.

**Canon SSOT** nằm ở repo KHÁC — `starci-academy-backend/.claude/fe/`:
- `continue.md` — **bàn giao hiện hành, đọc trước file này**
- `principles.md` §0 (bản vẽ vs công trình) · §12 atom · §13 khung
- `rules/1..4` (LUẬT) + `steps/0..5` (TRÌNH TỰ chạy workflow, mỗi bước có cổng đo)

---

## 1. Luật MỚI chốt trong lượt này (đã bake vào canon, đừng làm ngược)

| § | Luật | Neo |
|---|---|---|
| **§0** | `.storybook` = bản vẽ, `src` = công trình | mục 0 ở trên |
| **§12g.1** | **"Có hình" = ĐỔI PIXEL.** Prop chỉ chạy vào `aria-*` (`label`, `ariaLabel`, `removeLabel`) **KHÔNG có leaf** | mở leaf cho chúng ⇒ leaf render ra hai ô y hệt = chính dấu hiệu lỗi atom |
| **§12g.2** | `items`/`options` **CÓ** leaf và leaf đó **chính là `Default`** (đừng đẻ thêm leaf `Items`); `text`/`amount` **KHÔNG** leaf riêng | `Button.Group` → `Default` ghi *"Prop `items`"* · `Chip.Base` → *"Bare chip"*. Hai kiểu này khác nhau là HỢP LỆ |
| panel | ⛔ **LẠC HẬU 2026-07-27.** Câu dưới đây đúng ở ngày 26, sai ở ngày 27: *"Tab States đã BỎ, `states` đã xoá, thêm lại là vỡ tsc"*. Thầy chốt bố cục **C**: panel nay là **tab STATE + khung bên** (why · deps · code), prop `states[]` là API hiện hành và 109 story đã di trú | soi thật thấy nó chỉ lặp bằng chữ đúng thứ khung render đã hiện bằng hình |
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
- `PADDING_CLASS` gom về SSOT `frames/_spacing.ts` (ngày 26 đường dẫn là `layouts/_spacing.ts`) — cùng chỗ với `SpaceScale`/`GAP_CLASS`. ⚠️ Từ 27: `GAP_CLASS` khoá theo **CHỮ** (`SeamScale`), `PADDING_CLASS` vẫn khoá theo SỐ.

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

### 3.1 ✅ XONG 2026-07-27 — `stories/layouts/**` đã dọn (và thư mục đã tách)
`layouts` nay là `stories/frames/**` + `stories/composites/**`; toàn bộ đã sang `annotate` + `states[]`.
Còn đúng **2 helper** đi đường cũ, sửa 2 chỗ này là ~14 story đổi theo:

```bash
.storybook/stories/atoms/text/Typography/_leaves.tsx
.storybook/components/screens/CourseContents/_shared.tsx
```

Cách sửa 2 helper đó: chuyển sang `annotate` + `states[]`, **chỉ giữ entry có `storyId` thật**, không có deps thì bỏ hẳn prop (tab Deps tự ẩn). File mẫu: `stories/designs/commerce/PhaseScarcityNote/PhaseScarcityNote.Base.stories.tsx`.

✅ Nốt "`Form` nằm nhầm trong `atoms/`" cũng xong — nay ở `stories/composites/form/Form/`.

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
