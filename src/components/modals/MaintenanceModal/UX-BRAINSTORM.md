# UX Brainstorm — Modal chặn khi backend 502 (maintenance takeover)

> `/starci-fe-ux-brainstorm` — 2026-07-04. Scope: app-wide (không phải 1 trang) — chặn tương tác khi API trả 502,
> giữ nguyên hành vi hiện tại khi là network error (mất mạng/offline/timeout).

## 1. Yêu cầu gốc (thầy)
- Thêm modal "Website đang bảo trì, quay lại sau 20-30 phút".
- **502 (Bad Gateway) → modal CHẶN** (không cho tắt/bypass).
- **Network error (mất mạng, không phải 502 từ server) → GIỮ NGUYÊN** hành vi hiện tại (không đổi, không thêm modal).

## 2. Research — kiến trúc lỗi hiện tại (4 agent song song)

### 2.1 Apollo GraphQL (nguồn lỗi chính — đa số data đi qua đây)
- Link chain: `C:\Repositories\starci-academy\src\modules\api\graphql\clients\clients\auth.ts` (+ `no-auth.ts`) —
  `ApolloLink.from([createRetryLink(), createErrorLink(debug), createTimeoutLink(), ...auth links, createHttpLink()])`.
- **`createRetryLink()` đứng ĐẦU chain** (`links/retry.ts`) — retry MỌI lỗi (`retryIf: () => true`) với backoff
  jittered, `attempts.max` đọc từ `publicEnv().graphql.maxRetry`. → `ErrorLink` **chỉ nhận lỗi SAU KHI retry cạn**,
  nghĩa là 1 lần 502 thoáng qua tự phục hồi qua retry, modal chỉ bật khi 502 **dai dẳng** (đúng tinh thần best-practice
  "đừng chặn vì 1 lần chớp nhoáng").
- `createErrorLink()` (`links/error.ts`) hiện tại: bắt `CombinedGraphQLErrors` (check "superseded"/"Unauthorized"),
  `CombinedProtocolErrors` (console.log debug), còn lại → `console.error("[Network error]: ...")`. **KHÔNG hề soi
  `networkError.statusCode`** — đây là chỗ cần thêm logic.
- **Cách phân biệt 502 vs network error thật:** Apollo có 2 type từ `@apollo/client`:
  - `ServerError` — HTTP non-2xx nhưng body VẪN là JSON hợp lệ. Có `.statusCode`.
  - `ServerParseError` — HTTP non-2xx VÀ body KHÔNG phải JSON (vd nginx/gateway trả HTML lỗi mặc định — **502 thực tế
    hay rơi vào case này**). Cũng có `.statusCode`.
  - Network error THẬT (offline/DNS/CORS/timeout) → KHÔNG có `.statusCode` (chỉ `TypeError`/`AbortError` trần).
  - → Điều kiện chốt: `(ServerError.is(error) || ServerParseError.is(error)) && error.statusCode === 502`. Còn lại
    (không statusCode, hoặc statusCode khác 502) → **giữ nguyên** `console.error` như cũ.

### 2.2 SWR layer
- Không có fetcher tập trung — mỗi `useQueryXxxSwr` gọi thẳng Apollo (GraphQL) hoặc Axios (REST) bên trong.
- `SwrProvider` (`components/providers/SwrProvider.tsx`): `errorRetryCount: 2`, KHÔNG có `onError` global → lỗi
  bubble lên từng hook. Nghĩa là: chặn ở tầng Apollo `ErrorLink` là đúng — 1 điểm chặn DUY NHẤT phủ mọi SWR hook
  dùng GraphQL (đa số hook), không cần sửa từng hook.
- **REST (Axios)**: 6 chỗ tự `axios.create()` riêng (login/register/logout/process-video/presigned-url/fingerprint)
  — **KHÔNG có interceptor chung**. Đây là gap: nếu 502 xảy ra đúng lúc user login/upload, KHÔNG bắt được qua cùng
  1 điểm. → **Quyết định scope**: MVP chỉ bắt 502 qua GraphQL (phủ ~toàn bộ app, vì hầu hết page dùng SWR+GraphQL).
  REST là nhóm nhỏ (chủ yếu auth flow) → để **follow-up riêng** (thêm 1 axios response-interceptor dùng chung), không
  âm thầm mở rộng scope hôm nay.
- Không có `/health`/`/api/health` endpoint nào có sẵn để poll.

### 2.3 Hệ thống overlay/modal + Alert
- `InnerLayout.tsx`: thứ tự mount — theme→HeroUI→Redux→Swr→(`AppSplash` z-[70] → `TopLoader` z-[60] → navbar z-50 →
  `SocketConnectionStatus` → `ModalContainer` + `DrawerContainer` → `{children}` → Footer) → ToastProvider.
- **`ModalContainer`/`DrawerContainer`** = 1 nơi mount ~20+ modal, đọc zustand `overlay` store (33 key, mỗi key 1
  boolean `isOpen` + payload riêng). Pattern: `useXxxOverlayState()` → `{isOpen, open, close, setOpen}`.
- **CHƯA có modal nào `isDismissable={false}`** — mọi modal hiện tại đều tắt được (X + backdrop + ESC). HeroUI
  `Modal` HỖ TRỢ `isDismissable`/`isKeyboardDismissDisabled` nhưng chưa ai dùng → tiền lệ trống, đây sẽ là modal
  non-dismissable ĐẦU TIÊN của app.
- **`AppSplash`** (`blocks/layout/AppSplash`) là tiền lệ GẦN NHẤT cho "full-screen chặn toàn app": `fixed inset-0
  z-[70] bg-background`, mount thẳng trong `InnerLayout` (KHÔNG qua `ModalContainer`/33-key store), tự quản state
  riêng. Maintenance modal có bản chất giống AppSplash hơn là giống 1 modal thông thường trong danh sách 33 key
  (nó là SYSTEM STATE, không phải "user bấm mở 1 overlay").
- **`Callout`** (`blocks/feedback/Callout`, bọc HeroUI `Alert`): props `{status, title, description, icon, action,
  onClose}` — icon+title+description đúng hình dạng cần cho nội dung modal, tái dùng được.

### 2.4 Web research — pattern maintenance/outage đầu ngành
- **Full-page takeover** = pattern chuẩn cho **maintenance CÓ CHỦ ĐÍCH** (Vercel maintenance-page template, Atlassian
  Statuspage maintenance examples) — không phải cho lỗi thoáng qua. Thầy xác nhận muốn CHẶN cho 502 → coi 502-dai-
  dẳng tương đương "đang bảo trì/deploy" trong hạ tầng thật (khớp memory: VPS hay redeploy core) → full-block ĐÚNG
  cho case này, dù best-practice chung khuyên "banner không chặn" cho lỗi 5xx bất ngờ.
- **Auto-recovery**: health-check nhẹ mỗi 5-10s, exponential backoff cho client retry (TanStack Query mặc định
  `min(1000*2^n, 30000)`). App chưa có `/health` → poll bằng cách gọi lại 1 query GraphQL nhẹ có sẵn (không cần BE
  mới cho v1).
- **Không được chặn 100% vô hiệu** — luôn có 1 hành động thủ công ("Thử lại") dù có auto-poll, để tránh bẫy a11y/
  false-positive (web.dev offline-UX guideline + WebSocket reconnection guide đều khuyên vậy).
- **A11y cho modal không tắt được**: `role="alertdialog"` (không phải `dialog` trần) + `aria-modal="true"` + focus
  trap + LUÔN có ít nhất 1 control tương tác được (nút Thử lại) — nếu không, vi phạm APG dialog pattern nghiêm trọng.
- **Copy tone**: bình dân, trấn an, không thuật ngữ kỹ thuật cho phần chính; chi tiết lỗi (nếu cần) giấu sau 1 dòng
  phụ, không nhồi mã lỗi vào headline.
- Nguồn: Vercel maintenance template · Atlassian Statuspage · web.dev offline-UX · WebSocket.org reconnection guide ·
  TanStack Query retry docs · MDN `aria-modal` · Deque ARIA alertdialog · UXPin focus-trap.

## 3. Ba hướng (widget đã vẽ)
| | Mô tả | Ưu | Nhược |
|---|---|---|---|
| **A** | Full-screen takeover, mirror y hệt `AppSplash` (icon+title+desc, không card) | Chặn tuyệt đối, không nhầm là "modal tắt được" | Dựng ngoài hệ `ModalContainer`, không tái dùng `Callout` |
| **B** | HeroUI `Modal` chuẩn, card nhỏ + backdrop mờ (thấy content phía sau) | Đúng hệ modal 33-key sẵn có | Dáng "card nhỏ + backdrop mờ" theo phản xạ user = "bấm ra ngoài để tắt được" → dùng cho tình huống PHẢI chặn tuyệt đối là sai tín hiệu thị giác |
| **C (chốt)** | Full-screen chặn (như A) NHƯNG nội dung là 1 card dựng bằng ngôn ngữ `Callout` (icon tròn + title + desc + divider + trạng thái poll + nút Thử lại) | Chặn tuyệt đối (đúng yêu cầu) + tái dùng `Callout`/token màu sẵn có (đúng ý "tái dùng Alert/Modal block sẵn có") + cùng z-layer chiến lược với `AppSplash` (tiền lệ đã chứng minh) | Không đi qua `ModalContainer`/overlay store 33-key (chủ đích — đây là SYSTEM state, không phải user-toggle overlay, giống `AppSplash`/`SocketConnectionStatus`/`TopLoader`) |

**Chốt hướng C.**

**ĐÍNH CHÍNH 2026-07-04 (thầy chốt sau khi thấy hướng C):** dùng THẲNG HeroUI `<Modal isDismissable={false}
isKeyboardDismissDisabled>` (đi ĐÚNG qua hệ `Modal`/`ModalContainer` sẵn có), KHÔNG dựng bespoke `fixed inset-0` div
ngoài hệ modal như bản C gốc mô tả ở nhược điểm. "Chặn tuyệt đối" đạt được bằng chính prop `isDismissable={false}`
(bỏ `Modal.CloseTrigger`, bỏ backdrop-click-to-close, bỏ ESC) — KHÔNG cần tự dựng full-screen div riêng. Nội dung
(icon+title+desc+poll+nút Thử lại theo ngôn ngữ `Callout`) giữ nguyên như §4.3, chỉ đổi PHƯƠNG TIỆN render.

## 4. Thiết kế chi tiết hướng C

### 4.1 Điểm chặn lỗi (detection)
- Sửa `createErrorLink` (`links/error.ts`): thêm nhánh đầu tiên
  `if ((ServerError.is(error) || ServerParseError.is(error)) && error.statusCode === 502) { <trigger maintenance> ; return }`
  — đặt TRƯỚC nhánh `console.error` hiện tại, KHÔNG đụng nhánh `CombinedGraphQLErrors`/`CombinedProtocolErrors`/
  network-error-thường (giữ nguyên y hệt).
- `<trigger maintenance>` = set 1 module-level store (KHÔNG phải React hook, vì `ErrorLink` chạy ngoài cây React) —
  zustand cho phép gọi `.getState().setX(true)` ngoài component, dùng được thẳng ở đây.
- Vì `RetryLink` đứng trước, lỗi chỉ tới `ErrorLink` sau khi hết `maxRetry` → modal không nhấp nháy vì 1 lần 502
  thoáng qua.

### 4.2 State — thêm 1 key `"maintenance"` vào overlay store sẵn có (ĐÍNH CHÍNH)
- Thêm `"maintenance"` vào danh sách `OverlayKey` của `useOverlayStore` (`hooks/zustand/overlay/store.ts`) — cùng
  hạ tầng với 33 key hiện có (`payment`, `authentication`...). Khác biệt DUY NHẤT: nơi TRIGGER không phải 1
  component React bấm nút, mà là `createErrorLink` gọi thẳng `useOverlayStore.getState().open("maintenance")` (zustand
  cho phép gọi ngoài React tree, `ErrorLink` chạy ngoài cây component nên đây là cách hợp lệ, không cần hook).
- `MaintenanceModal` render trong `ModalContainer` như mọi modal khác (đọc `useMaintenanceOverlayState()` theo đúng
  pattern `useXxxOverlayState()`), KHÔNG mount rời trong `InnerLayout` như bản gốc từng đề xuất.

### 4.3 Nội dung + hành vi
- **HeroUI `<Modal isOpen isDismissable={false} isKeyboardDismissDisabled>`** — đúng compound quen thuộc
  (`Modal.Backdrop` → `Modal.Container` → `Modal.Dialog`), CHỈ khác: **bỏ hẳn `Modal.CloseTrigger`** (không có nút
  X), và 2 prop trên tắt cả backdrop-click lẫn ESC. Đây là modal `isDismissable={false}` ĐẦU TIÊN của app — dùng
  đúng khả năng có sẵn của component, không cần tự chế z-index/full-screen div riêng (HeroUI Modal tự portal +
  quản overlay-layer, đã cao hơn nội dung trang theo mặc định).
- Nội dung `Modal.Dialog` = ngôn ngữ `Callout`: icon tròn cảnh báo + "Website đang bảo trì" + "Quay lại sau 20-30
  phút" + divider + dòng trạng thái poll ("Đang kiểm tra kết nối…", icon xoay nhẹ) + nút **"Thử lại"** (gọi lại 1
  query nhẹ ngay lập tức, không chờ interval).
- **Auto-poll**: mỗi 8-10s, gọi lại 1 query GraphQL nhẹ sẵn có qua Apollo client trực tiếp (không cần `/health` mới).
  Thành công → `close("maintenance")` qua store (không cần user làm gì). Thất bại → im lặng, chờ vòng poll tiếp.
- **A11y**: `role="alertdialog"` (Modal.Dialog thường đã có `role="dialog"` từ React Aria — override/đảm bảo thành
  `alertdialog` cho đúng ngữ nghĩa "cần phản hồi") + focus trap vào nút "Thử lại" (control tương tác duy nhất, tránh
  bẫy "chặn tuyệt đối 0 affordance") + `aria-live="assertive"` khi bật/tắt.

### 4.4 Copy (tiếng Việt, không emoji, không uppercase)
- Title: "Website đang bảo trì"
- Description: "Bọn mình đang khắc phục sự cố. Vui lòng quay lại sau 20–30 phút."
- Poll status: "Đang kiểm tra kết nối…"
- Button: "Thử lại"

### 4.5 Việc KHÔNG làm hôm nay (giữ đúng scope)
- KHÔNG đụng `SocketConnectionStatus` (pill "Connection lost — reconnecting…") — đây là cơ chế network-error hiện
  có, thầy yêu cầu giữ nguyên.
- KHÔNG bắt 5xx qua REST/Axios (6 call site không có interceptor chung) — follow-up riêng nếu cần.
- KHÔNG thêm BE endpoint `/health` mới — poll bằng query GraphQL nhẹ sẵn có cho v1.

**ĐÍNH CHÍNH 2026-07-04 (thầy: "ý là mã lỗi 5xx"):** phạm vi mở rộng từ ĐÚNG 502 → **cả dải 5xx (500–599)** —
`statusCode >= 500 && statusCode < 600` thay vì so sánh `=== 502`. Vẫn CHỈ áp cho `ServerError`/`ServerParseError`
(có `.statusCode`) → network error thật (offline/timeout/CORS, không có statusCode) vẫn giữ nguyên hành vi cũ.

## 5. Việc ĐÃ LÀM khi `/starci-fe-ux-apply` (dùng HeroUI `AlertDialog` — canonical hơn `Modal isDismissable=false`)
- **Đổi primitive so với brainstorm gốc:** HeroUI có sẵn compound **`AlertDialog`** (`@heroui/react`) — chính là
  `Modal` + `role="alertdialog"` baked + **default `isDismissable=false` + `isKeyboardDismissDisabled=true`** (đọc
  source `alert-dialog.js`: đây LÀ hành vi mặc định, không phải override thủ công). Đây đúng primitive cho "modal
  cần phản hồi, không tắt được" mà research a11y đề xuất — dùng thẳng, KHÔNG tự dựng `Modal` + prop `isDismissable`.
- `links/error.ts` — thêm `isMaintenanceError` (`ServerError.is(error) || ServerParseError.is(error)` &&
  `statusCode` trong [500,600)) → gọi `useOverlayStore.getState().openOverlay("maintenance")` (đặt TRƯỚC nhánh
  `console.error` cuối, sau 2 nhánh `CombinedGraphQLErrors`/`CombinedProtocolErrors` — không đụng nhánh nào).
- `hooks/zustand/overlay/store.ts` + `hooks.ts` — thêm key `"maintenance"` vào `OverlayKey` (34 key) + hook
  `useMaintenanceOverlayState()`, đúng pattern base handle (không cần payload).
- `components/modals/MaintenanceModal/index.tsx` — `<AlertDialog isOpen onOpenChange><AlertDialog.Backdrop
  isDismissable={false} isKeyboardDismissDisabled><AlertDialog.Container size="sm"><AlertDialog.Dialog>` (KHÔNG
  `CloseTrigger`) → `Header` (`Icon status="warning"` + `Heading`) → `Body` (description) → `Footer` (poll status +
  Spinner khi đang check, `justify-between` + nút "Thử lại" `variant="primary"`). Auto-poll mỗi 9s (`queryPlatformStats`
  — public, no-auth, đã có sẵn cho landing) qua Apollo trực tiếp; thành công → `close()`; nút "Thử lại" probe ngay
  lập tức, disable khi đang check (chặn double-fire).
- Render trong `ModalContainer` cạnh mọi modal khác (KHÔNG mount rời trong `InnerLayout`).
- i18n `maintenance.{title,description,pollStatus,retry}` (vi+en).
- Verify: `npx tsc --noEmit` sạch (0 lỗi toàn repo) + eslint sạch trên mọi file đụng (1 lỗi `no-unused-vars` ở
  `error.ts:23` là PRE-EXISTING, không liên quan thay đổi này — đã xác nhận qua `git show HEAD` + eslint).
- **Verify hành vi (CHƯA làm — cần môi trường thật):** giả lập 5xx (mock response hoặc chặn network tab set status
   ESC đều vô hiệu), tự tắt khi response OK lại. Giả lập network error (offline) → modal KHÔNG bật, hành vi cũ
   (console.error/pill socket) y nguyên.
