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
