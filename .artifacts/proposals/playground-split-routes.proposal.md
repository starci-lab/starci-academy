# Proposal — Playground: tách Setup ↔ Lab thành 2 ROUTE (thầy chốt 2026-07-20)

> Kế thừa `playground-setup-vs-lab.proposal.md` (PA-3, đã build bằng state `phase`). Proposal này **thay cơ chế chuyển pha**: từ state trong 1 component → **2 route thật**.
> Prototype dùng lại: `.artifacts/prototypes/playground-setup-vs-lab/index.html` (:8082) — **hình hài 2 màn KHÔNG đổi**, chỉ đổi URL + nơi giữ state.
> Trạng thái: ⏳ PENDING — thầy chốt (B) "chỉ viết proposal, build session sau".

## 1. Vì sao đổi (state-toggle hiện tại sai ở đâu)

Bản đang chạy dùng `phase: "prepare" | "session"` trong `PlaygroundSession`. 3 khuyết điểm THẬT:

1. **Back trình duyệt**: đang ở Lab bấm Back → thoát hẳn khỏi lab (không lùi về Chuẩn bị) — nghịch kỳ vọng.
2. **Refresh**: `phase` reset → văng về Chuẩn bị dù máy đã pair.
3. **Không deep-link**: không bookmark/gửi link "vào thẳng lab" được.

Tách route sửa cả 3 + đúng `layouts/surface-job-drives-layout.md` (2 job khác nhau → 2 surface). Tab `Chuẩn bị · Lab` khi đó là **điều hướng thật**, không phải toggle giả.

## 2. ⚠️ RÀNG BUỘC LÕI — tách thô sẽ MẤT PAIRING

Đã verify trên source thật:
- `src/app/[locale]/courses/[courseId]/learn/playground/[slug]/page.tsx` render thẳng `PlaygroundSession` / `PlaygroundRagSession` (branch `slug === "rag"`).
- **`usePlaygroundByomSocketIo()` gọi BÊN TRONG component**: `PlaygroundSession/index.tsx:161`, `PlaygroundRagSession/index.tsx:76`.
- **KHÔNG có `layout.tsx`** ở `[slug]`.

⇒ Đổi route = unmount component = **socket đứt + mất `sessionId`/`pairingCode`**. Học viên vừa chạy `npx …<code>` xong, bấm "Bắt đầu lab" → route mới tạo **session mới + mã mới** → phải chạy lại lệnh. **Đây là điều kiện chặn: phải lift state lên layout TRƯỚC khi tách route.**

## 3. Hình dạng route

```
playground/[slug]/
  layout.tsx      ← MỚI  PlaygroundSessionProvider (giữ socket + session, sống xuyên 2 route con)
  page.tsx        ← Chuẩn bị (GIỮ NGUYÊN URL /playground/<slug> = điểm vào)
  lab/page.tsx    ← MỚI  Lab 20 bước
```

- **Giữ `[slug]` làm entry** ⇒ card ở `PlaygroundHub` + mọi link cũ **không phải sửa**.
- "Bắt đầu lab" → `router.push(.../lab)`.
- Pair lần đầu (auto-latch cũ) → `router.replace(.../lab)` (replace, không push — để Back không kẹt vòng).
- Tab switch: `ExtendedTabs variant="primary"` giữ nguyên, `onSelectionChange` → `router.push` thay `setPhase`.
- **Guard `lab`**: chưa pair → `router.replace` về `[slug]`.

## 4. Provider phải expose gì (lift từ `PlaygroundSession`)

| Nhóm | Giá trị |
|---|---|
| socket state | `connected · resources · verifiedStepIndex · latencyMs · deviceInfo · agentLog · ollamaStatus` |
| actions | `subscribe · requestVerify · runCommand · ragIndex · ragAsk` |
| session | `sessionId · pairingCode` + logic tạo session (`onConnectAgent` + effect auto-tạo ref-latched) |
| latch | `everConnected` (khung "reconnect" vs "waiting"), `autoEntered` (chỉ auto-điều-hướng 1 lần) |

**Ở lại page con:** `currentStepIndex` · `workspaceTab` · `sheetOpen` (thuần UI của Lab); `selectedOs` (thuần UI của Setup).

## 5. Files to touch

- **MỚI** `playground/[slug]/layout.tsx` + `src/components/features/learn/Playground/PlaygroundSessionProvider/index.tsx` (context + hook `usePlaygroundSessionContext`).
- **MỚI** `playground/[slug]/lab/page.tsx`.
- `playground/[slug]/page.tsx` — đổi thành Setup (render `PlaygroundPrepare` + wiring readiness/osCommands hiện đang nằm trong `PlaygroundSession`).
- `PlaygroundSession/index.tsx` — **bỏ `phase`/`PlaygroundPrepare`/readiness-builder** (đã chuyển sang page Setup), đọc socket từ context thay vì tự gọi hook. Component gọn lại đáng kể (đang 680 dòng).
- `PlaygroundRagSession/index.tsx` — **cũng phải đọc từ context** (nó đang tự gọi hook ở :76); nếu không, route `rag` sẽ có 2 socket song song.
- `learn/layout.tsx` — kiểm `isPlaygroundSession` (đang match route playground để bỏ rails/padding) có bắt được route con `/lab` không.
- i18n: không thêm key mới (tái dùng `phasePrepare`/`phaseLab`).

## 6. State-matrix + conversion (không đổi so bản đã build)

- Setup: `pending` → CTA disabled + hint "còn N mục" · `all-ready` → CTA primary "Bắt đầu lab" `[CTA]`. Rỗng/lỗi tạo session → thông báo + retry, không ngõ cụt.
- Lab: `chưa pair` (vào thẳng bằng URL) → guard đẩy về Setup `[link]` · `đang chạy` → workspace sống · `mất kết nối` → status strip + "Đổi máy" → Setup.
- Psych: số THẬT từ `device:info` (CPU/RAM/GPU) — không phóng đại.

## 7. Verify plan

- `tsc --noEmit` + eslint sạch.
- **Runtime — kịch bản chốt (chính là cái phải chứng minh):** mở `/playground/docker` → chạy `npx …<code>` → agent pair → **tự nhảy `/lab` mà KHÔNG phải chạy lại lệnh** (mã pairing giữ nguyên) → bấm tab "Chuẩn bị" → quay lại Setup, **vẫn còn pair** → **Back/Forward** đi đúng 2 màn → **F5 ở `/lab`** vẫn ở Lab.
- Vào thẳng `/lab` khi chưa pair → bị đẩy về Setup.
- Lặp cho `slug=kubernetes` và `slug=rag`.

## 8. Rủi ro
- `PlaygroundSession/index.tsx` + `PlaygroundRagSession` đang là file **chưa commit** của session `playground-rag-ollama` — build lượt sau phải đọc HEAD mới nhất, sửa additive, không rewrite.
- Lift socket đụng cả route `rag` → phải test cả 3 slug, không chỉ docker.

## 9. Mở (chốt lúc build)
- `lab` guard: redirect về Setup, hay cho vào Lab ở trạng thái "chưa nối" (giữ status strip)? — đề xuất **redirect**, vì lý do tách route ban đầu chính là "đừng cho vào lab chết".
- Có cần `loading.tsx` cho route `lab` không (tránh nháy trắng khi push).
