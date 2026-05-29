# 14 — Backend Link

## Backend repo
`C:\Repositories\ac\starci-academy-backend` (NestJS 11 monorepo).
- GraphQL: `http://localhost:3001/graphql`
- REST: `http://localhost:3001/api/v1`
- WebSocket (socket.io): `ws://localhost:3001`
- Doc kiến trúc BE: `starci-academy-backend/.claude/tech-integration/` (01-overview … 21-gotchas).

## Hợp đồng FE ↔ BE
- **Entity/Enum**: `src/modules/types/{entities,enums}` (FE) mirror `src/modules/databases/postgresql/primary/{entities,enums}` (BE). Value enum khớp `createEnumType` BE.
- **GraphQL op**: FE `modules/api/graphql` gọi đúng query/mutation BE expose ở `src/features/api/core/graphql/{queries,mutations}`. Input type (`XxxRequest`) khớp.
- **Response wrapper**: BE trả `{ success, message, error, data }` (AbstractGraphQLResponse) → FE `GraphQLResponse<T>`.
- **Auth**: Keycloak Bearer token; BE guard `KeycloakAuthGraphQLGuard`. FE gắn token qua `createAuthApolloClient`.

## Khi đổi hợp đồng
Sửa BE GraphQL field/input/enum → cập nhật bên FE: `modules/api/graphql/<op>.ts` + `modules/types`. Chạy được khi cả 2 khớp.

## Workspace
Mở chung 2 repo bằng `C:\Repositories\ac\starci-academy.code-workspace` (multi-root backend + frontend).
