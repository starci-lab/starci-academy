# 13 — Conventions & Gotchas

> Rule enforced (alwaysApply): `.cursor/rules/starci-academy-fe.mdc` + `design-pattern.mdc` + `component.mdc`. File này tóm tắt.

## File splitting STRICT (như backend Kani)
- Tách **`types/` · `enums/` · `constants/` · `utils/`** ra folder riêng (1 file/feature, `index.ts` re-export). Chỉ 4 folder này (+ route segment Next) ở feature root.
- File `page.tsx`/`layout.tsx`/hook/`query-*.ts`/`mutation-*.ts`/service **chỉ import** type/enum/constant — KHÔNG declare inline.
  - **Component Props: giữ trong `index.tsx`** theo pattern `{Component}Props` (KHÔNG ép ra `types/`; chỉ tách khi nhiều sub-type).
  - GraphQL `XxxRequest/Response/Data` → `types/` của op (chỉ giữ `gql` document trong file op).
- KHÔNG nested object type inline → tách interface riêng. Param hàm reuse = `XxxParams`, kết quả = `XxxResult`.

## Comments STRICT
- **JSDoc cho TẤT CẢ**: component/hook/util/function/type/interface/field/enum+member/constant/map/config/op. Hook/util/op kèm `@param` + `@returns`.

## Hooks STRICT
- **Ưu tiên `useMemo`** cho mọi giá trị derived (filter/sort/map list, build object/option, tính toán).
- **Ưu tiên `useCallback`** cho handler truyền xuống child / dùng trong deps. Object/array literal làm prop hoặc trong `useEffect` deps → memo hoá.
- Dependency array đầy đủ + đúng.

## Component decomposition & nesting STRICT
- Tách nhỏ, **mỗi component 1 chức năng/1 file**; không define component inline trong body component khác.
- **Nested ASAP**: sub-component chỉ 1 parent dùng → lồng trong folder parent (`Page/Button/index.tsx`). Dùng chung → promote ra `components/` thành sibling.
- **Nhóm theo chức năng** (cả layouts/ lẫn reuseable/): `<area>/<category>/<Component>`. **Casing: PascalCase = component, lowercase = nhóm** → `reuseable/buttons/ButtonA`.
- **`layouts/`** = container (logic/hook/state). **`reuseable/`** = render-only (không hook/logic/state). Container truyền props + handler `onXXX` xuống reuseable.

## Actions / Handlers
- Handler đặt tên pattern **`onXXX`** (`onPress`, `onSubmit`, `onSelect`…), KHÔNG `handleXxx`. Tạo bằng `useCallback` rồi **push xuống child qua prop `onXXX`**. Không arrow inline có logic trong JSX.
- HeroUI v3 dùng `onPress` (không `onClick`). Prop callback của component cũng khai `onXXX`.

## Map & Config
- **Lookup map / record** (Record<Enum,X>, icon/label/color map) → file riêng **`map.ts`** ở feature (không inline trong component). Key dùng enum.
- **Object config dùng chung nhiều nơi** → **`src/config/`** (1 file/feature, `as const`, re-export ở `config/index.ts`). Khác `resources/constants` (hằng nguyên thuỷ + env/path) và `*/map.ts` (map cục bộ).
- **Import object/array tĩnh (config/map) VÀO component → bọc `useMemo(() => ..., [])`** giữ tham chiếu ổn định.

## Đặt tên
- Component: folder + file PascalCase + `index.ts` re-export.
- Hook: `useXxx`. SWR singleton: `useXxxSwr` (impl, dùng ở component) / `useXxxSwrCore` (core, chỉ trong SwrContext).
- GraphQL op file: `query-<name>.ts` / `mutation-<name>.ts`; hàm `queryXxx` / `mutateXxx`.

## Import
- Alias `@/...` → `src/...` (KHÔNG `../../..`).
- **Barrel có giới hạn:** mọi folder có `index.ts` (`index.tsx` cho component) re-export `export * from "./x"`. Import qua barrel ở mức **category**. ⚠️ KHÔNG mega-barrel `@/components/index.ts` gom hết (chậm compile + bundle to + circular + rò `"use client"`); KHÔNG trộn client+server trong 1 barrel. Thêm file mới → thêm `export *` ngay.
- Component import SWR từ `hooks/singleton/swr` (impls), KHÔNG import `core`.
- Env qua `publicEnv()/internalEnv()`; URL qua `pathConfig()`; KHÔNG hardcode.

## UI
- Ưu tiên **HeroUI v3** + Tailwind v4. Dark mode qua `next-themes`. Animation `framer-motion`.
- Text hiển thị → i18n key (`messages/{en,vi}.json`), không hardcode chữ.

## Data
- GraphQL **luôn `cache: false`** (cache = SWR). Response bọc `{ success, message, error, data }` → unwrap `.data.<field>.data`.
- Fetch + share state = singleton SWR hook (core dispatch redux). SWR key trả `null` để skip khi chưa đủ điều kiện.

## Gotchas
- ⚠️ **Enum value phải khớp BE** `createEnumType` (thường chữ thường). Sai value → lỗi GraphQL enum. Khi thêm enum mới (vd `AiMode`) định nghĩa lại ở FE đúng value.
- ⚠️ `"use client"` bắt buộc cho component dùng hook/redux/swr/state. Quên → lỗi RSC.
- ⚠️ Thêm SWR op mới phải đăng ký ở `SwrContext.tsx` (3 chỗ: import core, gọi, thêm vào object) + tạo impl, nếu không component không lấy được.
- ⚠️ Sửa BE entity/enum → đồng bộ `src/modules/types` + `XxxRequest` input trong `modules/api`.
