# Playground ConnectSheet — draggable bottom-sheet cho flow nối máy

**Route:** `/courses/[courseId]/learn/playground/[slug]` (Docker/K8s labs) · **Prototype:** `.artifacts/prototypes/playground-connect-sheet/index.html` (host :8093) — ĐÃ DUYỆT (thầy "xúc" 2026-07-18)

## Ý thầy
"cái màu cam stick ở dưới, kéo lên kéo xuống được không" — khối nối-máy (status + lệnh npx + hướng dẫn) đang nằm inline cột trái làm content dài. → Tách RA thành **bottom-sheet dock đáy, persistent, kéo ↕** (peek↔expanded), luôn thấy trạng thái.

## Shell (đổi theo pha)
Giữ full-bleed 2-pane work surface. **Tách concern "kết nối" khỏi cột trái → ConnectSheet dock đáy** (absolute, full-width, đè đáy 2 pane). Cột trái = guide bước sạch (title·body·lệnh·confirm·nav); phải = workspace (EmptyState→terminal). Container 2-pane thêm `relative` để chứa sheet.

## State matrix (sheet open + peek/body) — grounded
| Pha (điều kiện) | Sheet | Peek (collapsed) | Body (expanded) | Auto-snap |
|---|---|---|---|---|
| **setup** `!sessionId` | hiện | `StatusChip neutral` "Máy chưa nối" + **Button primary "Kết nối máy thật →"** | intro lab + connect | thu |
| **waiting** `sessionId&&!connected&&!everConnected` | hiện | `StatusChip warning` (pulse) "Đang chờ máy…" | `Callout` "Kết nối máy" + **CodeToHtml elevated** (npx) + Node≥18 | **BUNG** (attention) |
| **connected** `connected` | hiện | `StatusChip success` "Máy đã kết nối · {latency} ms" (live) + Button tert "Kết nối lại/đổi máy" | latency detail + npx (đổi máy, tiến độ giữ) | **THU** (workspace focus) |
| **disconnected** `everConnected&&!connected` | hiện | `StatusChip warning` (pulse) "Máy vừa ngắt" | `Callout` "Kết nối lại — tiến độ giữ" + npx | **BUNG** |
| **rag** `isRag` | **ẨN** | — | — | — |

**Auto-snap:** pha cần hành động (waiting/disconnected) → `open=true`; pha ổn (connected) → `open=false`. User kéo/tap override. Controlled `open` state ở PlaygroundSession, set qua effect on phase-transition; ConnectSheet gọi `onOpenChange` khi kéo/tap.

**Conversion/HONEST:** 1 primary/pha (connect · copy-lệnh · tiếp-bước+reconnect); không ngõ cụt (lệnh luôn là đường tiếp); latency/status THẬT từ BE; peek giữ trạng thái glanceable (reassurance). Không dark-pattern.

## Block briefs (element-aware)
| Khối | Block THẬT | Ghi chú |
|---|---|---|
| **Sheet dock kéo ↕** | **`ConnectSheet` — TẠO MỚI** (`blocks/layout/ConnectSheet`) | persistent, 2 snap (peek↔expanded, cap ~60vh), grabber pointer-drag + tap-toggle, `rounded-t-3xl bg-surface shadow`. Props: `open`/`onOpenChange` (controlled) · `peek` (ReactNode) · `children` (body) · `hidden`. Dock = absolute bottom trong parent `relative`. KHÔNG framer-motion (pointer events tự đủ, không thêm dep). Ref dock: `StickyBottomBar`; ref drag: `CollapsibleSidebar`. |
| Trạng thái | `StatusChip` (neutral/warning/success) | có sẵn |
| Install/reconnect | `Callout` (accent/warning) | có sẵn |
| Lệnh npx | `MarkdownContent codeElevated` (CodeToHtml elevated) | có sẵn |
| Guide bước | `MarkdownContent` | giữ cột trái |
| Workspace | `EmptyState` / `ExtendedTabs`+console | giữ cột phải |

## Files to touch
- **TẠO:** `src/components/blocks/layout/ConnectSheet/index.tsx` (+ story sau).
- **SỬA:** `src/components/features/learn/Playground/PlaygroundSession/index.tsx` — container 2-pane `relative`; gỡ connect-UI khỏi cột trái → đưa vào ConnectSheet; controlled `sheetOpen` state + effect auto-snap; RAG ẩn sheet.
- i18n: tái dùng `playground.session.*` (agentWaiting/agentConnected(Latency)/agentDisconnected/connectMachineTitle/pairingHint/pairingRequirement/reconnect/reconnectHint/connectAgent) — thêm `machineNotConnected` ("Máy chưa nối").

## Verify plan
- tsc + eslint sạch. Kéo grabber/tap peek → snap peek↔expanded; đổi pha → auto-snap đúng; RAG ẩn sheet; lệnh copy OK; latency live ở peek connected. Thầy tự soi trên :3000 (HMR).

## Radius note
ConnectSheet = card-like → **`rounded-t-3xl`** (top 2 góc); lệnh trong sheet = CodeToHtml elevated 3xl (rule card-radius-3xl).
