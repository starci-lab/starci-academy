# 03 — Data Layer: GraphQL

`src/modules/api/graphql/` — tầng gọi GraphQL (Apollo Client 4). Export gom ở `graphql/index.ts` → `clients`, `types`, `queries`, `mutations`.

## Quy ước file (1 file = 1 operation)
- `queries/query-<name>.ts`, `mutations/mutation-<name>.ts`. Đăng ký export ở `index.ts` cùng folder.
- Mỗi file gồm:
  1. `const query1 = gql\`...\`` (document). Có thể nhiều variant → `enum QueryX { Query1 }` + `queryMap: Record<QueryX, DocumentNode>`.
  2. Interface `XxxRequest` (input) — đặt ngay trong file.
  3. Interface `XxxResponse` = `{ <field>: GraphQLResponse<TData> }`.
  4. Hàm `queryXxx(params)` / `mutateXxx(params)`.

## Ví dụ (mutation)
```ts
import { createAuthApolloClient } from "../clients"
import { MutateParams, type GraphQLResponse } from "../types"
import { gql } from "@apollo/client"

const mutation = gql`mutation ToggleFavourite($request: ToggleFavouriteRequest!) {
  toggleFavourite(request: $request) { success message error }
}`

export interface ToggleFavoriteRequest { contentId: string; isFavorite: boolean }
export type MutateToggleFavoriteParams = MutateParams<MutateToggleFavoriteResponse, ToggleFavoriteRequest>
export interface MutateToggleFavoriteResponse { toggleFavourite: GraphQLResponse<ToggleFavoriteData> }

export const mutateToggleFavorite = async ({ request, debug, headers, signal }: MutateToggleFavoriteParams) => {
    const apollo = createAuthApolloClient({ cache: false, debug, headers, signal })
    const result = await apollo.mutate<MutateToggleFavoriteResponse>({ mutation, variables: { request } })
    return result.data?.toggleFavourite
}
```

## Quy tắc
- **Luôn `cache: false`** — cache do SWR lo, không dùng Apollo cache.
- Client: `createAuthApolloClient({ cache, debug, signal, headers })` (gắn Bearer token). `clients/` có links (retry/timeout từ `publicEnv().graphql`).
- Param type chuẩn: `QueryParams<EnumKey, Request>` / `MutateParams<Response, Request>` (từ `../types`).
- Response BE luôn bọc `GraphQLResponse<T> = { success, message, error, data }`. Entity thật ở `result.data.<field>.data`.
- ⚠️ GraphQL input type tên/field phải khớp BE (vd `ToggleFavouriteRequest`). Enum value khớp BE (xem 07).

## Thêm operation mới
1. Tạo `query-x.ts` / `mutation-x.ts` theo mẫu trên + export ở `index.ts`.
2. Nếu cần cache/share state → wrap bằng singleton SWR hook (xem 05).
