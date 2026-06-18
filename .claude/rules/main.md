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

## 6. HeroUI v3 (chi tiết từng element → file riêng, xem §13)
- Compound + đúng slot (`Card.Header`, `Switch.Control/Thumb/Icon`); KHÔNG dựng lại / bọc (`<MyButton>` bọc `<Button>`).
- **`onPress`** (không `onClick`); loading=`isPending`; active=data-attr (`data-[selected=true]:text-accent`).
- **Dropdown/Menu/Popover = compound đúng slot**: trigger=`Button` con đầu `Dropdown`; `Dropdown.Item`+`Dropdown.ItemIndicator`
  (check tự theo selection)+`Label`; group=`Dropdown.Section`>`Header` (KHÔNG `Separator` thủ công giữa section). → `starci-dropdown.md`.
- **Tabs = block `ExtendedTabs`** (secondary, indicator accent, bỏ baseline). Feature giữ `Tabs.ListContainer/List/Tab/Indicator`.
- **Text bấm được = HeroUI `Link`** (href→navigate; `onPress`→modal/overlay), KHÔNG `<button>/<span>`+onClick. Nút KHỐI (CTA/submit) = `Button`.
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
  ⚠️ Nợ migrate ~453 `gap-1.5` → `gap-2` (làm dần, đụng file nào sửa file đó).
- **Padding card = `px-4 py-3` CỐ ĐỊNH** (sống ở `.card` globals). **Radius concentric** `rounded-2xl`(16,khung)→
  `rounded-xl`(12,ô/field)→`rounded-full`; con<cha; component KHÔNG tự gõ `rounded-*` cho khung. **Shadow flat** (chỉ overlay).

## 10. Bố cục trang hồ sơ (concept "trái không card, phải card")
- Trang = **flex 2 cột** desktop / stack mobile: **TRÁI = identity BARE** (avatar/tên/@handle/bio/meta/CTA render trần,
  KHÔNG `Card`) — danh tính là nền, không phải khối nội dung; **PHẢI = nội dung, MỖI section 1 card** (`LabeledCard`).
- Khung: `<div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-6 md:flex-row md:items-start"><aside
  className="flex w-full flex-col gap-4 md:w-72 md:shrink-0">…</aside><main className="flex min-w-0 flex-1 flex-col gap-6">…</main></div>`.
- **Sticky:** tab-strip/sub-header NGANG đầu trang = STICKY (`sticky top-16 z-40` + nền). **Sidebar identity = KHÔNG sticky**
  (chiều cao bám nội dung → sticky để trống lửng = xấu; cuộn cùng trang). Gutter trái↔phải `gap-8`; section phải `gap-6`; cụm trái `gap-4`/`gap-0`.
- **Tab = URL state**: đổi tab ⇒ sửa `?tab=` (`router.replace {scroll:false}`); vào URL kèm query ⇒ chỉnh tab. Gói trong 1 hook (`fromUrl` ref chống echo). (mẫu `useProfileTabUrlSync`).

## 11. i18n & a11y
- Mọi chữ qua `t("...")` (`src/messages/*.json`). Workflow song song: KHÔNG sửa messages JSON (race) → trả key, thêm tay sau.
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
- **Data:** SWR fetch→hydrate Redux (key `null` khi thiếu id); Redux lưu **id** (entity suy qua SWR); form = `src/hooks/rhf/useXxxForm` (rhf+zod, component chỉ bind, KHÔNG `useState` cho form value); overlay = 1 zustand store `useXxxOverlayState()` + mount `ModalContainer`; routing qua `pathConfig()`.
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

## 14. Heuristics khi dựng (cách LÀM)
- **"Vẫn vậy" = đổi layout nhưng giữ skin** → phải đổi token/card/typography, không phải đổi chỗ. Đừng churn cấu trúc khi vấn đề là "da".
- **Tự hỏi "UX chuẩn nhất nên thế nào"** (recruiter/user-first), đề xuất — nhưng **đừng tự ý vượt scope**: chốt hướng trước khi quất.
- **Nội dung tràn ngang = KÉO** (framer-motion `drag="x"` + `dragConstraints` viewport, `cursor-grab`), KHÔNG scrollbar trần. (mẫu `ContributionCalendarView`).
- **Meta phụ = GỘP 1 dòng, ngăn `·`** (`flex items-center gap-1`), đừng xếp chồng cho trống.
- **1 màu nổi / cụm — còn lại muted**; màu mẩu nổi lấy theo DỮ LIỆU thật (rank → màu ring badge qua `style`), KHÔNG token lệch nghĩa.
- **Hạn chế BORDER** — phân tách bằng tint/spacing/đổi nền nhẹ; border chỉ cho divider 1 nét / input / focus ring.
- **CTA trùng → giữ 1, ưu tiên cái GẦN ngữ cảnh** (rỗng→CTA trong empty-state, ẩn header; có data→header đổi "Quản lý"). (mẫu `ProfilePinned`).
- **Container HeroUI tự pad rồi → KHÔNG bọc thêm `p-*`** (double padding). Nội dung trong chỉ `flex flex-col gap-*`. Hỏi "container ngoài pad chưa?" trước khi gõ `p-*`.
- **Branding-first — đừng attribute tên brand chưa có uy tín.** Nhãn tín hiệu/uy tín (verified · powered-by · "by X")
  chỉ ghi **CHỨC NĂNG** ("Đã xác minh"/"Verified"), KHÔNG "bởi StarCi". Gốc: gắn tên vào cái chưa có sức nặng = rỗng,
  phản tác dụng — xây identity trước, gắn tên sau (khi thầy chốt).
- **Row/list item** (vd bài nộp): **chip (độ khó+ngôn ngữ) xuống DƯỚI title**, cùng dòng ngày — **ngày trái, chip đẩy
  phải** (`ml-auto`); cụm phụ (điểm·repo) `items-center` canh giữa dọc với title+meta; **điểm đổi màu theo band**
  (≥90 success/≥70 warning/<70 danger); **BỎ divider** giữa row khi không cần (dùng spacing); **link thứ cấp
  (show-more/thu gọn) = `text-muted`** (chỉ link chính mới accent).
- **Redesign 1 metric/viz → đồng bộ MỌI nơi render nó** (teaser/snapshot Overview + tab đầy đủ): cùng chart + cùng
  legend (label+màu từ 1 nguồn chung). Chỉ đổi tab sâu, bỏ teaser → user vào từ teaser thấy y cũ. (chi tiết `starci-stats.md` §9).
- **Đổi code → đồng bộ DOC/rule ngay** (no drift): grep + cập nhật rule/docstring cho khớp.

## 15. Mùi cần dừng (smells)
`<div>/<span>`+text class · `bg/border/rounded/text-size/p-*` trong feature · `isLoading?`/Spinner/`data??[]` trần ·
nhiều nút primary · folder ≠ tên component · sub-component ngang hàng · `@gravity-ui`/`lucide` (→ phosphor `*Icon`) ·
tô màu nút bằng className · skeleton ô-xám không khớp layout · chip/badge có `border` · viền quanh mọi khối ·
1 bảng màu hex cứng cho cả light+dark (→ token theme-aware) · sửa main.md/starci-*.md trực tiếp (→ drafts/) · `gap-1.5` (→ `gap-2`).
