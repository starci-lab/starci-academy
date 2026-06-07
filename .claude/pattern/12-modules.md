# 12 — Modules (logic, non-component)

`src/modules/` ngoài `api/` (xem 03,04) và `types/` (xem 07) còn các module logic:

- `keycloak/` — keycloak-js init, token, login/logout, trạng thái lưu slice `keycloak`. Bearer token gắn vào Apollo client (`createAuthApolloClient`).
- `payment/` — luồng thanh toán (PayOS/Sepay): build checkout, mở `PaymentModal`, redirect. Enum `payment-type`.
- `socketio` (qua `hooks/singleton/socketio/`) — socket.io-client; realtime job status → slice `job`/`socketio`. URL từ `publicEnv().api.socketIo`.
- `milestone/` — logic milestone/task client-side.
- `storage/` — `local/` + `session/` wrapper (localStorage / sessionStorage typed).
- `toast/` — wrapper thông báo (HeroUI/sonner-like).
- `dayjs/` — cấu hình dayjs (locale, plugin).
- `superjson/` — serialize/deserialize (khớp BE superjson cho payload phức tạp).
- `utils/` — `computations/` + helper chung.

## Quy tắc
- Module = logic thuần, KHÔNG render JSX. Component gọi vào module hoặc qua singleton hook.
- Side-effect cần state app → đi qua redux slice / singleton hook, không giữ state cục bộ rải rác.

## Import discipline (RULE — tránh circular qua barrel)
Barrel `export *` (vd `@/modules/api`, `@/modules/storage`) rất dễ tạo **import vòng**: file leaf trong barrel A import từ barrel B, trong khi B (qua leaf khác) import ngược barrel A → vòng kéo theo toàn bộ leaf.
- **Leaf file KHÔNG import ngược barrel cha của chính nó.** Import **trực tiếp file định nghĩa** thay vì qua barrel khi nguồn nằm trong cùng cụm vòng. Vd `oauth-idp-hint.ts` cần `KeycloakIdentityProvider` → import từ `@/modules/api/graphql/mutations/types/exchange-code-for-token`, KHÔNG `@/modules/api`.
- **Chỉ import type → dùng `import type`**: TS xóa lúc compile, không tạo cạnh runtime, vòng type-only vô hại. Cạnh **value** (class/enum/hàm như `LocalStorage`) thì không xóa được → phải bỏ barrel, import file thật.
- KHÔNG để **self-barrel cycle**: leaf `import { x } from "."` trong khi `index.ts` `export * from "./leaf"` → import trực tiếp file định nghĩa `x`, không qua `.`.
- Kiểm nhanh trước khi merge thay đổi tầng `modules/`: `npx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/`.
