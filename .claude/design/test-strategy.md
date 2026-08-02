# Test strategy — hợp đồng DOM, không phải pixel

> Canon. Test của design-system khẳng định **cấu trúc + ý đồ** đã được mã hoá vào DOM
> qua `data-*`, KHÔNG so ảnh (snapshot giòn, chết khi restyle). Một component "đúng"
> khi cây render mang đúng tier, đúng component, đúng **pattern layout**, đúng anatomy.

## 1. Nguyên lý

Mỗi node render mang `data-*` mã hoá quyết định thiết kế của nó. Test đọc các `data-*`
đó + đo computed-style, so với những gì component **KHAI**. Vì token là *khái niệm*
(`card-padding`) chứ không phải pixel (`p-4`), test sống sót mọi lần đổi class/skin.

## 2. Từ vựng — 4 `data-attribute`

| attr | nghĩa | ai phát |
|---|---|---|
| `data-tier` | tầng: `atom·frame·composite·block·page` | tự phát (atom/frame/…) |
| `data-component` | component nào (frame → `"Flex"`; atom → tên atom) | tự phát |
| `data-principles` | token(s) layout/seam từ `patterns.mjs`, space-separated như `class` | **CALLER khai** qua prop `principles={[…]}` |
| `data-anat-part` | part của `BlockAnatomy` | atom tự phát khi `showAnatomy` |

`data-tier`/`data-component`/`data-anat-part` **tự động**. `data-principles` **chỉ có
khi caller truyền `principles={[…]}`** — vì chỉ caller biết *tại sao* một seam là như
vậy (giống `anatPart`). Frame không tự biết principles của mình.

### `principles` prop + `Box` + `PrincipleToken`

- **`principles?: Array<PrincipleToken>`** — prop trên MỌI frame (Stack/Cluster/Grid/…);
  tự build `data-principles={principles.join(" ")}`. Không ai gõ `data-principles="…"` thô.
- **`PrincipleToken`** (`components/frames/_principles.ts`) — union đóng LẤY từ `patterns.mjs`
  → `tsc` chặn token bịa (guard compile-time trên cả gate runtime).
- **`Box`** (`components/frames/Box`) — escape-hatch primitive: div nhận raw `className`
  (appearance/mount 3rd-party) + `principles`. Dùng ở COMPOSITE bọc thư viện (Mermaid/PDF/
  code). Block/page KHÔNG dùng Box — chúng ghép frame + atom (`Divider` cho kẻ, `SurfaceCard`
  cho skin); raw skin box trong block = dấu hiệu phải là atom/composite.

## 3. Registry pattern — `.storybook/test-runner/patterns.mjs`

Nguồn-sự-thật của mọi token. Mỗi token khai: nó chi phối CSS-property nào và phải
compute ra giá trị nào. `test-runner.ts` mount story, query `[data-principles~="token"]`,
đo property đó, so với registry.

- **SPACING/seam tokens** (caller khai): gap `name-handle·icon-text·title-subtitle·
  flex-action·identity·value-row·chip-row·sibling-stack·label-field·content-row·
  card-caption·group-boundary·block-boundary·layout-split·marketing-beat`; padding
  `cell-pad·card-padding·page-pad·control-pad·row-pad·pill-pad`; margin `push-end·
  pin-bottom·center-measure`.
- **STRUCTURAL tokens** (frame tự phát, phase 2): `reel·sticky-top·fixed-bar·stack-below`.

Token = KHÁI NIỆM, không bao giờ pixel: `data-principles="card-padding"`, không phải `"p-4"`.

## 4. Luật pattern-coverage ⭐

**Mọi frame call-site realise một seam CÓ NGHĨA phải khai `principles`.** Một `StackH/StackV/
Cluster/Grid/Split` set `gap`+`justify`/`align`/`wrap` = một quyết định layout → phải
đặt tên nó bằng token → mới có `data-principles` → mới nằm trong lưới test.

- Frame CÓ `gap`+ (justify hoặc align hoặc wrap) mà THIẾU `principles` = **seam hở** (không test được).
- Chọn token theo Ý ĐỒ seam (hàng control → `flex-action`; label↔field → `label-field`;
  hàng chip → `chip-row`; title↔subtitle → `title-subtitle`; block↔block → `block-boundary`…).
- Nhiều token trong mảng: `principles={["content-row", "push-end"]}`.
- ⭐ **Block/page KHÔNG có raw `<div>`** — mọi layout qua frame; `border`/`bg`/skin → atom
  (`Divider`) hoặc composite. Composite bọc 3rd-party dùng `Box principles={[…]}`. **Atom
  MIỄN** `data-principles` (chrome cố định của primitive).

Gate `check-pattern-coverage.mjs` flag frame set layout thiếu `principles` + raw-spacing div
trong tier design-system.

## 5. Sáu tầng test → gate

| Tầng | Khẳng định | Gate |
|---|---|---|
| Identity | cây đúng tier/component + nesting | `check-story-ids` · `check-no-namespace` |
| **Pattern** | `data-principles` khớp CSS thật | `test-runner` (patterns.mjs) · `check-seams` · `check-padding` · **`check-pattern-coverage`** |
| Anatomy | mọi part khai báo có trong DOM | `check-orphan-parts` · `check-deps-coverage` |
| State | đủ state · 1 instance/state · skeleton MỘT cây | `check-one-instance-per-state` · `check-member-as-state` · `check-skeleton-prop` |
| Story | mọi component có story + doc khớp | `check-story-coverage` · `check-doc-parity` |
| Source | src ko import `@sb` · type inline hợp lệ | `check-src-sb-import` · `check-inline-types` · `check-passthrough-block` |

## 6. Ba luật kiến trúc (P1/P2/P3)

- **P1 — Skeleton:** cờ SHIMMER = `isSkeleton` (thread xuống). `isPending` (nút chạy →
  Spinner) và `isLoading` (data đang tải / switch AsyncContent) là khái niệm KHÁC, hợp lệ.
  Connected tính điều kiện (local `isLoading`…) rồi bơm `isSkeleton={…}`. Gate `check-skeleton-prop`.
- **P2 — Src import twin:** file `src/` import `@/components/*` (twin), KHÔNG `@sb-components/*`
  (cây storybook dev-only). Gate `check-src-sb-import`.
- **P3 — Tier folder:** page↔page, layout↔layout; mỗi tầng 1 folder (`page·blockv2·
  modalsv2·drawersv2·layoutsv2`), mỗi component = cặp `_X` (presentational) + `X` (connected).

## 7. Plan triển khai

1. **Pattern-coverage** — thêm `pattern` cho mọi seam hở ở src mapped component; gate `check-pattern-coverage`.
2. **Rendered-tree runner** — mount mỗi story → đọc DOM `data-*` → assert khớp anatomy + pattern KHAI.
3. **Pattern ↔ CSS invariants** — mỗi token trong patterns.mjs ⇒ bất biến CSS phải thoả, runner đo thật.
4. **v2 wiring** — `data-tier="page"` là điểm vào test; khi v2 lên route, contract-test áp thẳng.
