# 04 — Data Layer: REST / MinIO / Redirect

`src/modules/api/` ngoài `graphql/` còn có `rest/`, `minio/`, `redirect/`, `constants.ts`, `types.ts`.

## REST — `api/rest/`
- 1 folder = 1 endpoint group: `admin-presigned-url/`, `admin-process-video/`, `keycloak/`, `keycloak-auth/`.
- Dùng **axios**. Base URL từ `publicEnv().api.http` (default `http://localhost:3001/api/v1`).
- Dùng cho thứ không qua GraphQL: upload video admin, presigned URL, keycloak token exchange…

## MinIO — `api/minio/`
- `build.ts` build URL object MinIO từ `publicEnv().minio` (`url`, `bucket`). Dùng để render asset/CV/video.

## Redirect — `api/redirect/`
- `github.ts`, `keycloak.ts` — build URL redirect OAuth (login GitHub, Keycloak).

## Khi nào dùng REST vs GraphQL
- Mặc định dùng **GraphQL** (xem 03).
- REST chỉ cho: file upload/presigned, video processing admin, OAuth token exchange — những thứ BE expose qua `/api/v1`.
