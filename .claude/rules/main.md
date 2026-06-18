---
alwaysApply: true
---
# StarCi FE Rules — MAIN (SSOT)

Bản chốt cách dựng UI + tư duy + quy ước engineering cho FE `C:\Repositories\starci-academy`
(Next.js App Router · React 19 · Tailwind v4 · HeroUI v3 · SWR · Redux · zustand · Phosphor).
**`main.md` = luật + mindset; `starci-<element>.md` = styling từng element; `drafts/` = rule mới chờ merge.**

## 0. Cách rule vận hành (versioning)
- **`main.md` + `starci-<element>.md` = STABLE** — không sửa lặt vặt trực tiếp.
- **Thầy dạy/chốt/sửa 1 điều, hoặc feedback sau khi trò làm xong → GHI vào `drafts/<temp-name>.md`** (1 file/1 ý,
  gọn: ngày · bài học · file/§ sẽ đổi · luật mới + nguyên nhân gốc + cách đúng). Drafts `alwaysApply`, mới nhất thắng.
- **`/fe`** = đọc & ÁP main.md + starci-*.md + tất cả `drafts/*`.
- **`/merge`** = audit `drafts/*` → fold vào ĐÚNG file (**mindset/luật chung → main.md; styling 1 element → starci-<element>.md**)
  → xoá drafts đã gộp. **Chỉ chạy khi thầy gõ `/merge`.** KHÔNG tự merge.

## 1. Triết lý (kim chỉ nam)
- **Mỗi loại quyết định sống ở ĐÚNG 1 tầng. Style chảy 1 chiều — feature chỉ GHÉP, không vẽ.** Cần `!important`
  đè CHÍNH code mình = quyết định nằm SAI tầng (repo cũ: "card trông thế nào" rải 9 nơi → vá `.card{!important}`).
- **Ràng buộc giải phóng:** khoá lựa chọn (variant cố định, spacing 5 mức, 3 radius) → hết phân vân, nhanh + đẹp.
- **Thiết kế XÁM trước:** layout + thứ bậc đúng ở mức xám (chưa màu/ảnh) rồi mới tô; mỗi màn **1 hành động chính**.
- **Empty/Loading/Error = trạng thái THẬT**, thiết kế từ đầu (§7) — 80% khác biệt "chỉn chu vs amateur".
- **Văn bản LÀ giao diện:** label rõ thắng icon đẹp; microcopy tốt giảm đồ hoạ.
- **Ăn cắp pattern đã chứng minh** (dashboard→Duolingo, profile→GitHub); sáng tạo cho nội dung, không cho khung.
- **Nhất quán > thông minh; A11y là #1** (không phải bước cuối).
- **Trò CHỈ code — KHÔNG chạy server / verify bằng mắt.** Môi trường thầy = Cursor chạy sẵn, tự hot-reload. Trò
  KHÔNG `preview_start`/`npm run dev`/chụp màn hình/"chạy→soi→sửa". **Định nghĩa "xong" = `npx tsc --noEmit` +
  `npm run lint` SẠCH** (baseline 4 lỗi blog WIP) → giao code, thầy tự soi ở Cursor. Vẫn giữ mọi luật chất lượng.

**7 câu hỏi khi 1 idea rơi xuống:** (1) để LÀM GÌ? (purpose trước pixel; không gọi tên được nhiệm vụ → cắt;
nội dung > vanity). (2) TÁI DÙNG → **block** / WIRING (đọc store) → **feature** ("nó cần biết user là ai không?").
(3) Style thuộc TẦNG nào? (toàn cục→globals BEM; 1 cụm→block; CẤM style ở feature). (4) HeroUI có chưa? dùng ĐÚNG
SLOT (không chắc API → fetch docs). (5) Có FETCH? → `AsyncContent` luôn. (6) PHÂN CẤP: 1 primary, variant ngữ nghĩa.
(7) ĐẶT TÊN & GẤP gọn (folder=tên component, nest sub vào cha).

## 2. Kiến trúc 4 tầng (style không rò xuống)
1. **Tokens** — `globals.css`: CSS vars semantic (accent/surface/muted/separator/danger… auto light-dark) **+
   override BEM component HeroUI** (cách → §3). KHÔNG `@layer components` thừa / safelist rác.
2. **HeroUI v3 + globals** — dùng HeroUI thẳng (`@heroui/react`); đổi "trông thế nào" toàn cục → override BEM trong globals.
3. **Blocks** (`components/blocks/<category>/<Block>/index.tsx`) — đồ ghép tái dùng, **OWN toàn bộ style**, props-only,
   CẤM store/SWR. Category: feedback/stats/identity/chips/cards/lists/feed/layout/buttons/navigation/async/skeleton.
4. **Features** (`components/features/**`) — đọc store/SWR + logic; **chỉ GHÉP** block + HeroUI; **KHÔNG style**.

> ⚠️ `components/reuseable/**` + `components/layouts/**` = **LEGACY**, KHÔNG thêm code mới (migrate dần sang blocks/features).

- **Thấy cụm UI dùng ≥2 nơi (hoặc rõ sẽ tái dùng) → TÁCH ngay thành BLOCK** (props-only, own style). Block GIỮ state
  UI-ephemeral nội bộ (vd picker mở/đóng) nhưng props-only về DATA (KHÔNG store/SWR); hành động qua **callback prop**
  (`onReact`/`onResolve` — feature mới gọi mutation); **KHÔNG nhúng i18n** (text từ feature; cần độc-lập-i18n → icon/emoji/số);
  mở rộng block cũ bằng **slot optional** (`FeedItem.footer`), đừng tạo bản sao. (vd `ActivityAvatar/ReactionBar/SegmentBar`.)
- **Đụng/redesign 1 route của 1 domain → migrate HẾT trang anh em cùng domain ra `features/`** (vd course = detail+list);
  đừng để trang này ở `features/` còn trang kia kẹt `layouts/`. Tách đúng tầng (trình bày→block, wiring→feature) +
  repoint importer + **xoá HẲN folder legacy** đã thay (grep 0 import). Audit 1 trang → liệt kê luôn route cùng domain (đừng migrate nửa vời).

## 3. Luật style (chỗ được viết style)
- Style (bg/border/shadow/rounded/text-size/font/padding/colour) **chỉ ở**: blocks (tầng 3) hoặc globals (tầng 1).
- Features/layouts: `className` = **chỉ PLACEMENT** (`w/h/size`, `flex/grid/col-span/row-span/order`, `gap/m-*`,
  `justify/items/place`, `md:/lg:/xl:`). ❌ CẤM `bg-* border* shadow* rounded* text-{size} font-* truncate opacity p-*`.
- Đổi look 1 HeroUI component dùng-nhiều-nơi → override `.bem__class` trong globals (vd `.switch__control{...}`).
  Look riêng 1 cụm → tạo **block**. Element tự chế cần khung → gắn class `.card`.
- ⚠️ **Slot class HeroUI internal GIÒN khi upgrade** (v3 từng đổi `divider`→`separator` hỏng 35 chỗ): giữ override
  globals tối thiểu, ưu tiên CSS var HeroUI cho sẵn; nâng HeroUI → kiểm lại slot.
- Ngoại lệ DUY NHẤT màu chữ ở feature: accent/success/warning/danger qua `text-{token}` (+ màu data-driven từ domain
  util như SegmentBar/MascotBadge nhận qua data).

## 4. Component conventions — STRICT
- **1 component = 1 folder + `index.tsx`**; CẤM file `.tsx` rời / define component inline trong render.
- **Tên folder Y CHANG tên component** (`DarkLightModeSwitch/` không `DarkLightMode/`).
- **Sub-component nested trong folder cha** (chỉ-1-cha dùng); promote `blocks/` khi dùng nhiều nơi.
- **Hook trong `hooks/`**: feature-local → `<Feature>/hooks/useXxx.ts`; chung → `src/hooks/<kind>/` (rhf/swr/zustand/effects/socketio).
- **Mọi `*Props extends WithClassNames`** (rỗng → `type XProps = WithClassNames<undefined>`). Container: props CHỈ
  `className/classNames` (+`children`); tự đọc store/SWR/`useParams`; CẤM data/callback/id props. **Ngoại lệ nhận props:**
  (1) `children`+`className`; (2) **list-item** trong `.map`; (3) **block** giữ value+callback props (cha wiring, CẤM store/SWR);
  (4) props do lib định nghĩa.

## 5. Text & Icons
- **Text = HeroUI `Typography`** (`type/weight/color/truncate/align` qua PROP; `color` chỉ `default|muted` — màu nhấn
  `text-{token}`, ngoại lệ duy nhất). CẤM `<div>/<span>`+text class, CẤM `text-[Npx]`.
- **`type` CHỈ có:** `body | body-sm | body-xs | code | h1 | h2 | h3 | h4 | h5 | h6` (KHÔNG `body-lg/body-md/body-base/
  caption/button/label`); `weight` = `normal|medium|semibold|bold`. Map text-class: `text-3xl/2xl bold`→`h3` (H1
  trang→`h2`) · `text-xl bold`→`h4` · `text-lg semibold`→`h5` · `text-base semibold` (nhãn mục con trong card)→**`Label`**
  · `text-sm`→`body-sm` · `text-xs/[10px]`→`body-xs` · `font-mono`→`type="code"`.
- **`PageHeader` title = `Typography.Heading level={3} weight="bold"`** (nhỏ-gọn + đậm), KHÔNG level2/medium.
- **Canh chữ = prop `align`** (`center|end`), KHÔNG dựa `text-center` cha — Typography mặc định `align="start"` BAKE
  class text-align (đè inherit). Gotcha hay dính ở empty/error state.
- **Nhãn ĐẦU MỤC CON trong card (sub-section label) = HeroUI `Label`** (đồng bộ `LabeledCard.label` cũng `Label`),
  KHÔNG `Typography.Heading`/`<h_>`. Skeleton mirror = `Skeleton.Typography type="body-sm"` (không `h4`).
- **Icon common/UI = phosphor `@phosphor-icons/react` export `*Icon`** (bare name `Moon`/`MagnifyingGlass` deprecated
  ts6385 → `MoonIcon`/`MagnifyingGlassIcon`/`GlobeIcon`/`TranslateIcon`/`CaretRightIcon`…). KHÔNG `@gravity-ui`/`lucide`.
- **Brand/social logo = `react-icons/fa6`** (`FaGithub/FaLinkedin/FaXTwitter/FaFacebook` — 1 family đủ LinkedIn+X).
  KHÔNG dùng `@icons-pack/react-simple-icons` (thiếu LinkedIn). Thiếu icon → đổi lib xịn, đừng chế. Icon map → `map.tsx`.
- **Icon trang trí:** `aria-hidden` + `focusable="false"`. **Icon ĐẠI DIỆN entity** (course/project/section) → block
  **`IconTile`** (`blocks/identity/IconTile`: frame `bg-{tone}/10`, mặc định w-16 h-16), KHÔNG icon trần.
- **Brand lockup (logo + wordmark) = block `BrandLogo`** (`blocks/identity`, own look); feature (navbar `Logo`) chỉ bọc
  `Link`+onPress (wiring, KHÔNG style). In-app logo = **PNG** (`/logo-icon.png`), KHÔNG SVG component. **Ngoại lệ
  `text-[Npx]`:** tagline wordmark (vd "ACADEMY" dưới brand) ĐƯỢC dùng px chính xác `<12` (`text-[10px]`) + `uppercase`
  + `tracking-widest` **CHỈ trong block thương hiệu** (chi tiết typographic của logo, không có Typography type) — KHÔNG mở cho UI thường.
- **Kích thước icon mặc định = `size-5` (20px)** — icon UI đứng/đi-kèm-text (nav row, nút icon-only, status/meta line,
  brand logo fa6). **`size-4` (16px) = NGOẠI LỆ** chỉ khi chật/inline text nhỏ: **caret/chevron** see-more
  (`group-hover:translate-x`) + disclosure (`data-[open=true]:rotate-180`) giữ `size-4`. **`size-3`** cho icon trong
  **Chip**. Skeleton control-mirror (checkbox/radio/select 16px) ≠ icon (giữ `size-4`). IconTile (frame) = riêng.

## 6. HeroUI v3 (chi tiết từng element → file riêng, xem §13)
- Compound + đúng slot (`Card.Header`, `Switch.Control/Thumb/Icon`); KHÔNG dựng lại / bọc (`<MyButton>` bọc `<Button>`).
- **`onPress`** (không `onClick`); loading=`isPending`; active=data-attr (`data-[selected=true]:text-accent`).
- **Dropdown/Menu/Popover = compound đúng slot**: trigger=`Button` con đầu `Dropdown`; `Dropdown.Item`+`Dropdown.ItemIndicator`
  (check tự theo selection)+`Label`; group=`Dropdown.Section`>`Header` (KHÔNG `Separator` thủ công giữa section). → `starci-dropdown.md`.
- **Tabs = block `ExtendedTabs`** (secondary, indicator accent, bỏ baseline). Feature giữ `Tabs.ListContainer/List/Tab/Indicator`.
- **Text bấm được = HeroUI `Link`** (href→navigate; `onPress`→modal/overlay), KHÔNG `<button>/<span>`+onClick. Nút KHỐI (CTA/submit) = `Button`.
- **Tên ENTITY trong list (khóa/lesson/challenge/project) = LINK vào entity** (KHÔNG text trơ): block `EntityToken`
  (`globalId`→`queryResolveRoute`→navigate; hoặc `href` trực tiếp khi đã biết route — vd course `displayId`, khỏi resolve).
- **`Card` v3 = `<div>` TĨNH** (KHÔNG `isPressable`/`onPress`) → card cả-thẻ-bấm = block `PressableCard` (→ `starci-card.md`).
- **Chọn SURFACE theo việc** (đừng nhồi mọi thứ vào modal): **Popover** anchored = menu/picker nhanh (mất focus=đóng:
  account/notif/lang); **Modal** centered nhỏ = **1 QUYẾT ĐỊNH** ngắn (confirm/auth/pay/share/form nhỏ — 1 primary,
  KHÔNG cuộn 3 màn); **Drawer** (desktop `right` / mobile `bottom`-sheet) = INSPECT/master-detail giữ ngữ cảnh
  (**KHÔNG mở modal con TRONG drawer** — swap detail tại chỗ); **Route trang thật** = IMMERSE/primary/deep-link
  (challenge/đọc dài/dashboard/CV full — cần URL/back/share thì ĐỪNG full-screen-modal); **In-place panel framer** =
  co/giãn tại chỗ (sidebar collapse — KHÔNG Drawer, xem `starci-navigation.md`). Cờ đỏ: full-screen-modal thay trang ·
  modal-trong-drawer · modal cuộn dài · form lớn trong modal · drawer `right` trên mobile. (brainstorm: `src/components/modals/UX-BRAINSTORM.md`.)
- **`TextField` con phải có `slot` hợp lệ** (text phụ/counter = `slot="description"`); **Checkbox = compound** (`Checkbox.Content>Control>Indicator`), KHÔNG `<input>` trần. Chi tiết → `starci-form.md`.
- Trước khi dùng component lạ → fetch docs `https://heroui.com/docs/react/components/<name>.mdx`.

## 7. States — MỌI fetch PHẢI dùng `AsyncContent` (STRICT)
- Component đọc SWR/query → vùng render data **PHẢI bọc `AsyncContent`** (`blocks/async`). CẤM ternary `isLoading?`,
  `Spinner` trần, `data?.x ?? []` thẳng, rải `EmptyState/ErrorState/Skeleton` ngoài AsyncContent.
- `<AsyncContent isLoading={isLoading && !cached} skeleton={<Skeleton.* mirror layout/>} isEmpty={list.length===0}
  emptyContent={{title,description?,onRetry?,retryLabel?}} error={error} errorContent={{...}}>{content}</AsyncContent>`.
  **emptyContent/errorContent = PROPS object** (không node); ưu tiên **error→loading→empty→content**.
- **Empty = `TrayIcon` (text-muted) LUÔN** (đừng override icon); **Error = `WarningOctagonIcon` (text-danger)**.
- **`emptyContent` bỏ trống → rỗng tự ẩn** (khách xem profile rỗng). Text empty/error từ caller qua `t(...)`. Nút thử lại = `onRetry`+`retryLabel` (`()=>mutate()`).
- **`skeleton` MIRROR layout thật** (compound `Skeleton.*`, giữ node cấu trúc Separator/spacer/grid, chỉ thay content;
  text bar = `Skeleton.Typography type=`). KHÔNG `<Spinner>` trần. SWR key `null` khi thiếu id. Cụ thể (STRICT):
  - **Giữ MỌI node cấu trúc**: `Separator`/divider giữa item PHẢI mirror (`{i>0?<Separator/>:null}`) + cùng `gap`/số ô.
  - **List dài chưa biết → giả định SỐ ĐẠI DIỆN** (mặc định **3** item) để không trống lốc.
  - **`Link` → skeleton là `Skeleton.Typography`** (type khớp), không vẽ bar kiểu khác.
  - **Bar `Skeleton.*` width phân số (`w-1/2`) PHẢI có cha bề-rộng-xác-định** (`flex-1`/width cố định) — trong cụm
    content-sized phân số tính theo 0 → **xẹp mất**.
  - **`Skeleton.SegmentBar`** (gồm legend) cho SegmentBar — KHÔNG `Skeleton.ProgressBar` (thiếu legend). **`Skeleton.ListRow`**
    khớp slot (`withLeading={false}` khi không icon; `withTrailing` khi có meta/repo).
- **`debug` hold (gotcha):** `AsyncContent debug` (+ `env.debug`) giữ skeleton ~3s MỖI LẦN MOUNT. Panel tab render điều
  kiện (`tab===x?…:null`) → chuyển tab = unmount, quay lại = remount → hold chạy lại; **đây KHÔNG phải mất cache** (SWR
  cache theo key vẫn còn). Tắt `debug` → quay lại tab thấy data tức thì. Build thật phải bỏ `debug`.
- **Phân trang/cuộn vô hạn → BẮT BUỘC `useSWRInfinite`** (`swr/infinite`): getKey trả `null` để dừng/thiếu-id/ẩn;
  flatten `(data??[]).flat()`; nạp thêm = IntersectionObserver sentinel `setSize(s=>s+1)` (block `InfiniteScrollSentinel`).
  Slice nhỏ cố định → `useSWR` thường. CẤM `useState`+offset tay, CẤM `useEffect` trong hook SWR.
- **`debug` prop** (test skeleton ~3s, cần `env.debug`): **AGENT KHÔNG TỰ GỠ** — chỉ gỡ khi thầy yêu cầu rõ.

## 8. Async feedback
- Phản hồi <100ms: nút `isPending` (chặn double-submit); auto-save/debounce → text inline "đang lưu/đã lưu"; vùng load
  lại → spinner/skeleton TRÊN ĐÚNG vùng (không full-page); ưu tiên optimistic (toggle follow/bookmark) rồi rollback nếu lỗi.
- **API qua wrapper:** GraphQL write → `useGraphQLWithToast()`; REST write → `useRestWithToast()`. Read/query KHÔNG toast.
  CẤM `toast.*` thô. Message qua i18n. Toast = KẾT QUẢ, không thay pending-state.

## 9. Tokens & spacing
- **Màu = token semantic** (CẤM hex/`slate-*`/`cyan-500`): `bg-background` · `bg-surface(-secondary/-tertiary)` ·
  `text-foreground` · `text-muted` · `bg-accent`/`text-accent` · `border-separator` · `text-{success,warning,danger}` ·
  field `--field-*`. Brand ngoài (FB/GitHub) → token `--brand-*`. Màu phân loại → map về success/warning/danger/accent.
  - **`--difficulty-insane`** (tím, light+dark) = tông thứ 4 của thang ĐỘ KHÓ (easy/medium/hard = success/warning/danger).
    Chi tiết thang + cách dùng → `starci-stats.md` §4.
  - **Màu brand NGÔN NGỮ** (TypeScript/Go/…) = ngoại lệ "no hex" hợp lệ, để ở `src/modules/utils/language.ts` (KHÔNG token
    globals) — xem `starci-stats.md` §5.
- **Spacing `0/2/3/4/6`** (lưới 4px, cả `gap` LẪN `padding`, **CẤM `1.5`/`p-1/5/8/11`**): `0` dính 1 khối · `2` coupled
  (icon↔text, label↔input) · `3` cùng chức năng (item cùng loại, gap trong card) · `4` container thoáng · `6` khác chức
  năng (block↔CTA, giữa 2 card, padding section). section `gap-6`; gutter page-level `gap-8/10/12` (ngoại lệ).
  ⚠️ Nợ migrate ~387 `gap-1.5` → `gap-2` (làm dần, đụng file nào sửa file đó). **KHÔNG còn ngoại lệ `gap-1`**
  (thầy chốt 2026-06-18: ép `gap-2` hết, kể cả cụm meta `·`). **`gap-1` đã dọn xong ở tầng active** (features/blocks/
  modals); còn lại CHỈ ở legacy (`reuseable/`, `layouts/`) + 3 skeleton mirror HeroUI-primitive (ListBox/Menu/Pagination —
  giữ vì bám spacing nội bộ HeroUI).
- **Padding card = `px-4 py-3` CỐ ĐỊNH** (sống ở `.card` globals). **Radius concentric** `rounded-2xl`(16,khung)→
  `rounded-xl`(12,ô/field)→`rounded-full`; con<cha; component KHÔNG tự gõ `rounded-*` cho khung. **Shadow flat** (chỉ overlay).
  - **Bo góc CON hài hoà với KHỐI CHA bao nó**: block bên trong 1 card (vd banner "đang dùng" trong tier Card
    `rounded-3xl`) bám radius của CARD cha, KHÔNG ép field-radius. Control field (Input/Select) mới dùng `--field-radius`
    (`rounded-xl`). Đừng trộn lung tung.
- **Vùng scroll dọc (list trong card/panel) → bọc HeroUI `ScrollShadow`** (fade trên/dưới, biết còn nội dung) thay
  `div overflow-y-auto` trần; `max-h-*` đặt trên `ScrollShadow`, bỏ `overflow-y-auto` thủ công.

## 10. Bố cục trang hồ sơ + home/hub cá nhân (concept "trái không card, phải card")
- Trang = **flex 2 cột** desktop / stack mobile: **TRÁI = identity BARE** (avatar/tên/@handle/bio/meta/CTA render trần,
  KHÔNG `Card`) — danh tính là nền, không phải khối nội dung; **PHẢI = nội dung, MỖI section 1 card** (`LabeledCard`).
- **Shell này TÁI DÙNG cho mọi home/hub cá nhân (dashboard, profile)** — **KHÔNG layout 3-rail `[300_1fr_320]`**
  (pattern legacy đã bỏ). Tab = **store zustand + URL-sync** (`useXxxTabStore`+`useXxxTabUrlSync` ↔ `?tab=`, `fromUrl`
  ref chống echo); panel render điều kiện theo tab active (lazy mount → lazy fetch). Mobile = STACK (identity trên,
  content dưới), **KHÔNG rail/drawer** (drawer-cho-rail là vá của 3-rail legacy).
- **Standing/status ở cột HẸP (sidebar ~288px) = dòng `icon + label + value`** (label muted + value đậm), KHÔNG dãy
  `Chip` soft (chip chật → wrap, value↔nhãn mờ; vd "357 điểm" thiếu nhãn). Mirror meta-rows ProfileHero.
- **Identity column đã có avatar+tên → BỎ greeting "Chào mừng X"** (đừng nhân đôi danh tính 2 nơi).
- Khung: `<div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-6 md:flex-row md:items-start"><aside
  className="flex w-full flex-col gap-4 md:w-72 md:shrink-0">…</aside><main className="flex min-w-0 flex-1 flex-col gap-6">…</main></div>`.
- **Sticky:** tab-strip/sub-header NGANG đầu trang = STICKY (`sticky top-16 z-40` + nền). **Sidebar identity = KHÔNG sticky**
  (chiều cao bám nội dung → sticky để trống lửng = xấu; cuộn cùng trang). Gutter trái↔phải `gap-8`; section phải `gap-6`; cụm trái `gap-4`/`gap-0`.
- **Tab = URL state**: đổi tab ⇒ sửa `?tab=` (`router.replace {scroll:false}`); vào URL kèm query ⇒ chỉnh tab. Gói trong 1 hook (`fromUrl` ref chống echo). (mẫu `useProfileTabUrlSync`).
- **Shell "sidebar + content"** (settings…): 1 scroll context (body) + sidebar STICKY (KHÔNG khoá-viewport 2-pane);
  nav row = `Link` (KHÔNG 1-item `ListBox`); KHÔNG per-page back-arrow khi đã có breadcrumb+sidebar. Chi tiết → `starci-navigation.md`.
- **Trang top-level content full-width (grid/list/cards) bọc `mx-auto w-full max-w-[1280px] px-6 py-6`** — đừng full-bleed
  (card phình theo màn 1920). **NGOẠI LỆ: trang CÓ SIDEBAR** (home/profile 2-cột, settings) giữ layout/width riêng — đừng ép `max-w-[1280px]` lên khung sidebar.
- **Meta phụ cột identity** (link social, joined, dòng phụ sidebar/card) = **dòng GỌN** (`py-0.5`, ~24–28px), **KHÔNG ép
  `min-h-11`/44px** (44px tap-target dành cho NÚT hành động, không phải mọi link text → tránh sprawl). Mọi dòng cùng cụm
  PHẢI nhất quán **1 leading icon + text** (joined cũng có icon, vd `CalendarBlankIcon`) thẳng hàng. Link cá thể hoá:
  hiện **handle/host** (LinkedIn `/in/<handle>`, website host) thay label generic. Vẫn `<a>` + focus-ring (gọn ≠ mất a11y).

## 11. i18n & a11y
- Mọi chữ qua `t("...")` (`src/messages/*.json`). Workflow song song: KHÔNG sửa messages JSON (race) → trả key, thêm tay sau.
- **Tiền tệ (khách VN): VND là CHÍNH** (số to), USD chỉ dòng phụ "≈/xấp xỉ $X" (`body-xs muted`) bên dưới — KHÔNG để USD
  làm giá chính. Format `formatVnd` (`amount.toLocaleString("vi-VN")+"₫"`). **Nguồn giá = BE config** (`app.yaml`), KHÔNG
  hardcode chuỗi trong i18n (lệch khi đổi giá → nợ nếu tạm hardcode).
- **Render TIME (locale-aware) — CẤM `date.toLocaleString(locale)` trần** (có giây, thứ tự lộn xộn):
  - **Tương đối** (feed/hoạt động) → `getTimeAgoMessage`/`getTimeAgoLabel` + `title=` datetime tuyệt đối (xem `starci-feed.md`).
  - **Tuyệt đối** (sessions/"lần cuối"/ngày pass) → **`HH:mm MMM DD, YYYY`**: `HH:mm` 24h pad-0 KHÔNG giây + tháng ngắn
    theo LOCALE (`toLocaleString(locale,{month:"short"})`) + ngày pad-0 + `, YYYY`. Thứ tự field CỐ ĐỊNH (locale chỉ
    áp tên tháng). **KHÔNG icon đồng hồ** cạnh timestamp. Chỉ-ngày ("Tháng 6 2026") → `toLocaleDateString(locale,{month,year})`.
    (Nợ: gom util chung `formatDateTime(iso,locale)` thay lặp `formatSeen`.)
- **Thuật ngữ domain: đơn vị học = "nội dung" / "content", KHÔNG "bài học" / "lesson"** (entity DB là content;
  course progress đo bằng `contentCompleted/contentTotal`). VI "nội dung", EN "content"; comment/identifier mới dùng
  `content`. **NGOẠI LỆ — KHÔNG rename khoá BE-bound đã tồn tại** (`myLearnedLessons`, `KpiKey 'lessons'`): giữ KEY,
  chỉ đổi LABEL value hiển thị → "Nội dung"/"Content".
- A11y #1: contrast ≥4.5:1 (phụ ≥3:1), focus ring, touch ≥44px, semantic HTML + heading đúng cấp, aria-label icon-only, `prefers-reduced-motion`.

## 12. Engineering (mọi `.ts(x)` trong `src/`)
- **File splitting:** mỗi feature chỉ `types/ enums/ constants/ utils/` (+ `map.ts`), mỗi cái `index.ts` re-export. `constants/`
  cấm magic number/string rải. Config dùng-nhiều-nơi → `src/config/` (`as const`, bọc `useMemo` khi import).
- **No inline nested object types (STRICT):** cấm object literal `{…}` ở vị trí TYPE (generic arg/field/return/param/cast) → tách
  `interface` có tên + JSDoc. Không tính `Pick/Record/Partial/Omit/ReturnType/Array/Promise` + object *value*.
- **Framework files chỉ IMPORT** type/enum/const (`page/layout/useXxx/query-*/mutation-*`/service); ngoại lệ `{Component}Props` ở `index.tsx`.
- **Types:** `Array<T>` (không `T[]`); `import type`; JSDoc mọi type/field/enum/const; `XxxParams`/`XxxResult`; `src/types/`=UI-facing, `src/modules/types/`=mirror backend.
- **Hooks:** `useMemo` cho derived, `useCallback` cho handler truyền xuống; handler `onXXX` (không `handleXxx`); CẤM arrow-logic inline JSX; 1 concern/file.
- **App Router:** `page.tsx` chỉ `return` 1 component từ `components/`; Server Component mặc định, `"use client"` đẩy xuống subtree nhỏ nhất; `layout.tsx` chỉ ráp provider.
- **Import 1 hướng:** `modules/types ← modules/utils ← modules/api ← redux/slices ← hooks ← components`; alias `@/`; barrel dừng ở category (CẤM mega-barrel / trộn client+server).
- **Data:** SWR fetch→hydrate Redux (key `null` khi thiếu id); Redux lưu **id** (entity suy qua SWR); form = `src/hooks/rhf/useXxxForm` (rhf+zod, component chỉ bind, KHÔNG `useState` cho form value); overlay = 1 zustand store `useXxxOverlayState()` + mount `ModalContainer`/`DrawerContainer` (open-state MỌI overlay ở
store, **CẤM `useState` cục bộ**; **ngoại lệ**: overlay TRẢ KẾT QUẢ một-lần cho đúng 1 form — vd `AvatarUploadModal`
đưa `File` về `useEditProfileForm` — ĐƯỢC mount cục bộ trong feature MIỄN LÀ open-state vẫn ở store); routing qua `pathConfig()`.
- **Secret (API key/token):** encrypt at rest ở BE, **plaintext KHÔNG BAO GIỜ trả FE**; FE input write-only
  (`type=password`, không prefill); đã lưu → hiển thị masked `••••{last4}` (BE trả cột `*_last4`). Chi tiết → `starci-form.md` §5.
- **Comment ENGLISH ONLY** (comment/JSDoc/identifier); UI text → i18n. JSDoc cho tất cả component/hook/util/type.
- **"Xong" = `npx tsc --noEmit` + `npm run lint` SẠCH** (baseline 4 lỗi blog WIP). KHÔNG tự dựng dev server / chụp /
  verify trực quan — Cursor của thầy hot-reload, thầy tự soi (xem §1).

## 13. Element styling — INDEX (render NTN → đọc file tương ứng)
| Element | File | Tóm |
|---|---|---|
| Button | `starci-button.md` | variant ngữ nghĩa, 1 primary/ngữ cảnh, destructive tách, icon-only cần aria-label, CẤM tô màu className |
| Card | `starci-card.md` | section card = block `LabeledCard` (Label+icon size-5 NGOÀI; content+AsyncContent TRONG; see-more=Link+caret slide). SectionCard=legacy |
| Chip/Badge | `starci-chip.md` | khối màu MỀM, KHÔNG border (`variant="soft"` / `bg-[c]/10`+chữ cùng màu); hex runtime → `color-mix` |
| Dropdown/Menu | `starci-dropdown.md` | compound + slot đúng (Item+ItemIndicator+Label, Section>Header) |
| Popover | `starci-popover.md` | body inset `px-2 py-1`; title=`Header`; nội dung=block; CẤM `<button>/<span>` style tay |
| Tooltip | `starci-tooltip.md` | thuật ngữ khó → block `InfoTooltip` (hover plain-language, ưu tiên cá nhân hoá); KHÔNG ráp HeroUI Tooltip thẳng |
| Stats/Chart | `starci-stats.md` | metric row `MetricCard` top-level; SegmentBar/Legend (dùng chung khi nhiều bar); LanguageDonut (thin px); thang độ khó 4-tông; LanguageChip github; so sánh percentile/rank/XP-thật; badge meta `rank·rarity` |
| Feed | `starci-feed.md` | feed kiểu FB (avatar+badge icon, actor/target `Link`, relative time); never-blank target; ActivityAvatar badge opaque soft-accent |
| Navigation/Shell | `starci-navigation.md` | nav row = `Link` (KHÔNG 1-item ListBox, chỉ active tô); CollapsibleSidebar rail icon-only + Separator nhóm; shell 1-scroll + sidebar sticky; KHÔNG back-arrow khi có breadcrumb+sidebar |
| Form/Field | `starci-form.md` | TextField con `slot`; control nhỏ vô hình → override globals; selector = Select/Tabs (KHÔNG pill); secret masked `••••{last4}`; section phẳng KHÔNG card thừa; save `self-start`; upload = `ImageDropzone` modal |

## 14. Heuristics khi dựng (cách LÀM)
- **"Vẫn vậy" = đổi layout nhưng giữ skin** → phải đổi token/card/typography, không phải đổi chỗ. Đừng churn cấu trúc khi vấn đề là "da".
- **Tự hỏi "UX chuẩn nhất nên thế nào"** (recruiter/user-first), đề xuất — nhưng **đừng tự ý vượt scope**: chốt hướng trước khi quất.
- **Nội dung tràn ngang = KÉO** (framer-motion `drag="x"` + `dragConstraints` viewport, `cursor-grab`), KHÔNG scrollbar trần. (mẫu `ContributionCalendarView`).
- **Meta phụ = GỘP 1 dòng, ngăn `·`** (`flex items-center gap-2`), đừng xếp chồng cho trống. (gap-2, KHÔNG gap-1 — xem §9.)
- **1 màu nổi / cụm — còn lại muted**; màu mẩu nổi lấy theo DỮ LIỆU thật (rank → màu ring badge qua `style`), KHÔNG token lệch nghĩa.
- **Hạn chế BORDER** — phân tách bằng tint/spacing/đổi nền nhẹ; border chỉ cho divider 1 nét / input / focus ring.
- **CTA trùng → giữ 1, ưu tiên cái GẦN ngữ cảnh** (rỗng→CTA trong empty-state, ẩn header; có data→header đổi "Quản lý"). (mẫu `ProfilePinned`).
- **Container HeroUI tự pad rồi → KHÔNG bọc thêm `p-*`** (double padding). Nội dung trong chỉ `flex flex-col gap-*`. Hỏi "container ngoài pad chưa?" trước khi gõ `p-*`.
- **Giá ưu đãi/discount phải THẬT (charged == shown)** — CẤM fake `price*0.9` ở FE rồi charge full (lừa + vỡ contract).
  Discount tính ở BE (`CoursePricingService`, lưu `transaction.discountPercent`), dựa DỮ LIỆU thật (engagement: số khóa
  đã mua + streak/XP); copy "độc quyền vì chăm chỉ / đã học N khóa" OK khi % + `reason` suy từ data thật. KHÔNG có cơ chế
  thật → KHÔNG hiện %. (Recommended-courses: loại enrolled ở BE + 1 query trả giá gốc/giảm + reason; xem `starci-stats`/price §11.)
- **Branding-first — đừng attribute tên brand chưa có uy tín.** Nhãn tín hiệu/uy tín (verified · powered-by · "by X")
  chỉ ghi **CHỨC NĂNG** ("Đã xác minh"/"Verified"), KHÔNG "bởi StarCi". Gốc: gắn tên vào cái chưa có sức nặng = rỗng,
  phản tác dụng — xây identity trước, gắn tên sau (khi thầy chốt).
- **Row/list item** (vd bài nộp): **chip (độ khó+ngôn ngữ) xuống DƯỚI title**, cùng dòng ngày — **ngày trái, chip đẩy
  phải** (`ml-auto`); cụm phụ (điểm·repo) `items-center` canh giữa dọc với title+meta; **điểm đổi màu theo band**
  (≥90 success/≥70 warning/<70 danger); **BỎ divider** giữa row khi không cần (dùng spacing); **link thứ cấp
  (show-more/thu gọn) = `text-muted`** (chỉ link chính mới accent).
- **Redesign 1 metric/viz → đồng bộ MỌI nơi render nó** (teaser/snapshot Overview + tab đầy đủ): cùng chart + cùng
  legend (label+màu từ 1 nguồn chung). Chỉ đổi tab sâu, bỏ teaser → user vào từ teaser thấy y cũ. (chi tiết `starci-stats.md` §9).
- **1 section = 1 concern**: đừng nhồi nhiều thứ vào 1 block (streak + daily-goal + 5-KPI + nút Sửa) → tách
  `LabeledCard` riêng (vd "Đà học" vs "Mục tiêu tuần"). Mọi section cột content = `LabeledCard` (content-only — con bỏ
  title nội bộ, đừng để block tự-title rời cạnh LabeledCard lệch nhịp).
- **KHÔNG card lồng card**: content PHẲNG → `LabeledCard` thường; content **tự-là-card** (grid card/`PressableCard`) →
  `LabeledCard frameless` (bỏ `<Card>` bọc, giữ label row). Chi tiết → `starci-card.md`.
- **1 MÔ HÌNH GOAL/TARGET duy nhất** — đừng giữ 2 field trùng nghĩa set độc lập (vd `weeklyGoalLessons` scalar vs
  `weeklyKpiTargets['lessons']` map). Chọn 1 nguồn (map + `setKpiTarget`), bỏ cái kia; UI chỉ đọc 1.
- **Trang "list đầy đủ" (bookmark/feed/lịch sử/submissions)** = `Breadcrumbs` + block `PageHeader` (title + desc =
  **count**) — KHÔNG `<h2>` trần. **Xem HẾT = `useSWRInfinite` + `InfiniteScrollSentinel`** (BE nhận `skip/take`|cursor;
  ĐỪNG fetch chốt 20 không phân trang; `hasMore = loaded < count`). Ít nhất 1 ô search `Input` lọc client-side (0 match
  → `EmptyContent` riêng). Hàng GỌN (title `body-sm` + desc 1 dòng + meta inline), KHÔNG card 2 dòng to. Container tự
  đọc SWR + giữ search-state local. (mẫu `Bookmarks`.)
- **Trang dùng lại mảnh của MODAL nhưng cần hơn (filter/infinite/insight) → dựng component PAGE-NATIVE riêng**
  (`<Feature>/<Part>`), ĐỪNG nhồi vào component modal dùng-chung (phình + rủi ro vỡ modal). Modal giữ nguyên. Giữ reuse
  cho mảnh đủ dùng (vd `QuotaLane`), tách cái cần khác (vd history → `AiUsageHistory`). (mẫu `AiUsage`.)
- **Đổi code → đồng bộ DOC/rule ngay** (no drift): grep + cập nhật rule/docstring cho khớp.

## 15. Mùi cần dừng (smells)
`<div>/<span>`+text class · `bg/border/rounded/text-size/p-*` trong feature · `isLoading?`/Spinner/`data??[]` trần ·
nhiều nút primary · folder ≠ tên component · sub-component ngang hàng · `@gravity-ui`/`lucide` (→ phosphor `*Icon`) ·
tô màu nút bằng className · skeleton ô-xám không khớp layout · chip/badge có `border` · viền quanh mọi khối ·
1 bảng màu hex cứng cho cả light+dark (→ token theme-aware) · sửa main.md/starci-*.md trực tiếp (→ drafts/) ·
`gap-1.5`/`gap-1` (→ `gap-2`) · `Card isPressable`/`onPress` (→ `PressableCard`) · dãy pill Button làm selector
(→ Select/Tabs) · 1-item `ListBox` cho dòng nav (→ `Link`) · `date.toLocaleString()` trần hiển thị (→ format §11) ·
shell khoá-viewport 2-pane `overflow-hidden`+inner-scroll (→ 1-scroll + sidebar sticky) · back-arrow per-page khi đã có breadcrumb+sidebar ·
`fullWidth` save trong form settings (→ `self-start`) · `<input type=checkbox>` trần (→ Checkbox compound) · `<Typography>` trần làm con TextField (→ `slot="description"`) ·
full-screen-modal thay trang / modal-trong-drawer / form lớn trong modal / drawer `right` trên mobile (→ chọn surface §6) ·
overlay dùng `useState` cục bộ (→ store) · standing dùng `Chip` ở cột hẹp (→ dòng icon+label+value) · layout 3-rail cho home cá nhân (→ shell 2-cột §10) ·
icon `size-4` mặc định (→ `size-5`, size-4 chỉ ngoại lệ) · "bài học"/"lesson" trong copy (→ "nội dung"/"content").
