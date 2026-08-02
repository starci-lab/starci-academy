# split — presentational `_X` ↔ connected `X`

> Canon. Mỗi component "sống" (có dữ liệu/tương tác) tách làm HAI file trong cùng
> folder: `component.tsx` export `_X` (presentational) + `index.tsx` export `X`
> (connected). Storybook chỉ render `_X` (fixture-fed); app dùng `X`.

## Hai nửa

### `component.tsx` → `_X` — presentational
- **Data-only.** Props đã resolve; KHÔNG fetch/store/i18n bên trong.
- Compose tầng dưới qua twin `@/components/*` (hoặc `@sb-components/*` phía storybook).
- **Một cây** `spine(isSkeleton)` — không mirror skeleton vẽ tay. `AsyncContent
  skeleton={() => spine(true)} content={() => spine(false)}`.
- Slot buildable: `body={() => …}` / `items={[() => …]}` (uncalled ComponentType),
  thread `isSkeleton` xuống con; cond `...(c ? [() => X] : [])`; text qua atom
  `Typography text=` / string prop (đã localize).
- Bọc root `<div data-tier="…" data-component="X">`.
- **Được phép render connected children** (self-fetching, vd `GithubTeamGate`,
  `LearnBreadcrumb`) — một presentational screen vẫn có thể mount con connected.

### `index.tsx` → `X` — connected (`"use client"`)
- Đọc SWR · redux · zustand overlay · `useTranslations()` → resolve MỌI thứ thành data.
- **Sở hữu "khi nào shimmer".** Tính điều kiện (local tên theo bản chất: `isLoading`
  = data đang tải…) rồi bơm vào đỉnh: `<_X … isSkeleton={isLoading} />`.
- Trả `<_X … />`. Không chứa layout/JSX trình bày (đã ở `_X`).

## Vì sao tách
Real `_X` ghép **connected children** dùng Socket.IO + redux + SWR. Storybook preview
chỉ có NextIntl + HeroUI → render `_X` thật = phải mock cả redux/swr/socket (nặng,
giòn). Nên storybook giữ blueprint `_X` fixture-fed song song; test contract chạy trên đó.

## Skeleton = MỘT cây
Cấm file skeleton copy tay layout bằng raw div. Đúng: `spine(isSkeleton)` thread
`isSkeleton` vào từng part shimmer-được (PageHeader/ProgressMeter/SurfaceCardList/
Typography tự shimmer). `spine(true)` = nhánh loading, `spine(false)` = content — cùng
code, không lệch. Xem [gap](principles/gap.md), [test-strategy](../../test-strategy.md).

## P1 — một prop shimmer
Presentational chỉ nói `isSkeleton` (universal, thread xuống). `isPending` (nút đang
chạy → Spinner) và `isLoading` (data đang tải / switch AsyncContent) là khái niệm KHÁC.
Connected mới quyết định *khi nào* → `isSkeleton={điều-kiện}`.
