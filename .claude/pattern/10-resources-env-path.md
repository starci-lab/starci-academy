# 10 — Resources (env / path / constants)

`src/resources/` — config & hằng số runtime.

## env — `resources/env/`
- `public.ts` → `publicEnv()`: đọc `NEXT_PUBLIC_*`, có default localhost:
  - `api`: `{ http: NEXT_PUBLIC_API_HTTP_BASE_URL (…/api/v1), socketIo: NEXT_PUBLIC_API_WEBSOCKET_BASE_URL, graphql: NEXT_PUBLIC_API_GRAPHQL_BASE_URL }`
  - `graphql`: `{ maxRetry, maxRetryDelay, initialRetryDelay, timeout }`
  - `minio`: `{ url, bucket }`, `computation`: …
- `internal.ts` → `internalEnv()`: `{ isProduction: VERCEL_ENV === "production" }` (server-only).
- **Luôn lấy env qua `publicEnv()/internalEnv()`, KHÔNG đọc `process.env` rải rác.**

## path — `resources/path/`
- `pathConfig()` — builder lồng nhau, có locale: `pathConfig().locale(l).profile().bookmarks().build()` → string path.
- **Build URL bằng cái này, KHÔNG hardcode** `/vi/profile/...`.

## constants / assets
- `constants/` (`lang.ts` danh sách ngôn ngữ…), `assets/` (đường dẫn ảnh/logo). Export gom ở `resources/index.ts`.
