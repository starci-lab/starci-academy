# 01 — Overview

## Stack
- **Next.js 16** (App Router, RSC) + **React 19**.
- **HeroUI v3** (`@heroui/react` + `@heroui/styles`) + **Tailwind v4** (PostCSS). UI library chính — KHÔNG tự viết primitive nếu HeroUI có sẵn.
- **Apollo Client 4** cho GraphQL; **axios** cho REST/MinIO.
- **SWR** cho data-fetching cache (KHÔNG dùng Apollo cache — luôn `cache: false`).
- **Redux Toolkit** (`@reduxjs/toolkit` + `react-redux`) cho client state.
- **next-intl** (i18n + locale routing) + **i18next/react-i18next**.
- **keycloak-js** (auth) + **socket.io-client** (realtime jobs).
- **Formik** (forms), **next-themes** (dark mode), **framer-motion**, **@xyflow/react** (mind map), **mermaid**, **react-pdf/pdfjs/pdf-lib** (CV), **dashjs** (video MPEG-DASH).
- Path alias: `@/*` → `src/*`. Lint: ESLint flat config (`eslint.config.mjs`).

## Cây thư mục `src/`
```
src/
├─ app/                    # Next.js App Router (xem 02)
│  ├─ layout.tsx, InnerLayout.tsx, globals.css
│  └─ [locale]/            # route prefix theo locale
├─ components/             # React component (xem 08)
│  ├─ layouts/ modals/ drawers/ providers/ reuseable/ pallettes/ svg/ utils/
├─ modules/                # logic layer, KHÔNG phải component
│  ├─ api/                 # tầng gọi API (xem 03, 04)
│  ├─ types/               # entities/enums mirror BE (xem 07)
│  ├─ keycloak/ payment/ milestone/ storage/ toast/ dayjs/ superjson/ utils/  (xem 12)
├─ hooks/
│  ├─ singleton/           # core+impls+Context (xem 05)
│  ├─ effects/ reuseables/ + useSmViewpoint, useSidebar, useExchangeCodeForToken…
├─ redux/                  # store + slices (xem 06)
├─ config/                # shared config object dùng chung (as const); import vào component → useMemo
├─ resources/              # env / path / constants nguyên thuỷ / assets (xem 10)
├─ i18n/                   # next-intl config (xem 11)
├─ messages/               # en.json, vi.json
├─ data/ proxy.ts utils/ types/
```

## Điều hướng nhanh
- Thêm data mới? → `03-data-graphql.md` (tạo query/mutation) + `05-singleton-hooks.md` (wrap SWR).
- Thêm trang? → `02-app-router.md`.
- Thêm UI? → `08-components.md` (ưu tiên HeroUI).
- Enum/entity? → `07-types.md` (phải khớp BE).
