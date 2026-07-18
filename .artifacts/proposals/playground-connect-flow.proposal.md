# Playground Connect Flow — BYOM agent install-gate + real connection status

**Route:** `/courses/[courseId]/learn/playground/[slug]` (Docker/K8s labs) · **Prototype:** `.artifacts/prototypes/playground-connect-flow/index.html` (host :8087)

## Ý thầy
"sửa ui bắt cài, check xem cài chưa" — flow "Connect your machine" của `PlaygroundSession`:
1. **Bắt cài (install-gate):** hướng dẫn cài + chạy **`npx @starciacademy/playground-agent <code>`** (BARE — KHÔNG `--server`; agent 0.1.1 default = prod `wss://api.academy.starci.org`) rõ ràng, **GATE** các bước + terminal tới khi máy kết nối.
2. **Check cài chưa:** phát hiện + hiện trạng thái AGENT: chưa nối → đang chờ → đã kết nối; agent ngắt → về chờ.

## 🔴 BUG cốt lõi phát hiện
`byomState.connected` trong FE hook = **browser socket TỰ connect** (`usePlaygroundByomSocketIo.ts:68` `onConnect`), KHÔNG phải agent pair. → UI hiện "đã kết nối" ngay khi browser vào namespace, **cả khi máy học viên chưa cài gì**. "Check cài chưa" hiện tại SAI hoàn toàn.

## Data-ceiling map
| Cần | Trạng thái | Việc |
|---|---|---|
| Trạng thái AGENT-connected THẬT | ❌ CHƯA — BE không báo browser | **aggregate-BE**: BE emit `agent:connected`/`agent:disconnected` cho browser room khi `agent:pair` + thêm `OnGatewayDisconnect` (flip `session.connected=false` + emit); thêm `SubscriptionEvent.PlaygroundAgent{Connected,Disconnected}`. FE hook nghe 2 event này → `agentConnected` THẬT (tách khỏi browser-socket-connected). Khi browser subscribe: BE ack/emit `session.connected` hiện tại (agent có thể pair trước khi browser mở). |
| install-gate (lệnh BARE) | ✅ **render-là-xong** (sau khi agentConnected thật) | FE gate bước/terminal theo `agentConnected`; lệnh copy = bare `npx @starciacademy/playground-agent <code>` (KHÔNG --server) |
| Pairing code, mode select, terminal | ✅ đã có | giữ |

## Flow + shell
1 surface, shell GIỮ nguyên (full-bleed 2-pane work surface — trái=guide/connect, phải=terminal/resources). Pha đổi theo `(sessionId, agentConnected, isRag)`:
- **Setup** (`!sessionId`): step guide + **1 nút "Kết nối máy thật →"** → tạo session + vào thẳng pha "chờ". *(terminal gated)*
  - ⚠️ **ĐÍNH CHÍNH v3 (thầy 2026-07-18):** **BỎ mode select Guided/Free** (`SelectableCardGroup` gỡ) — lab luôn Guided. Nút kết nối "hiển thị ra đang chờ luôn" (không có bước chọn mode trung gian).
- **Cài + chờ máy** (`sessionId && !agentConnected`): **install-card nổi bật** (lệnh bare `npx @starciacademy/playground-agent <code>` + copy) + `StatusChip warning` "Đang chờ máy kết nối…" (dot pulse); **bước + terminal KHOÁ** (gate overlay 🔒).
- **Đã kết nối** (`agentConnected`): `StatusChip success` "Máy đã kết nối" **+ ping badge latency (ms)** live; bước + terminal MỞ.
- **Máy ngắt** (`agentConnected` → false): `StatusChip warning` "Máy vừa ngắt" + **Callout "Kết nối lại"** (lệnh bare + gợi ý service-mode). **Tiến độ chương đã pass GIỮ NGUYÊN** (BE `session.passedStepIndexes` bền, không reset khi agent rớt).
- **RAG** (`isRag`): KHÔNG agent, KHÔNG gate (widget browser) — giữ nguyên.

## 🔁 Reconnect + invariant "pass hết 20 chương" (thầy v3: "cho user lựa chọn connect lại, làm sao pass hết 20 chương")
- **Reconnect luôn sẵn:** ở pha "Đã kết nối" có nút phụ **"Kết nối lại / đổi máy"** (tertiary) → về pha chờ/lost (re-show lệnh pair, cùng pairing code). User chủ động nối lại máy cũ HOẶC máy khác bất kỳ lúc nào — không bị khoá cứng vào 1 máy.
- **Gate KHÔNG bao giờ trap:** overlay 🔒 chỉ khoá khi `!agentConnected`; agent nối lại → mở ngay, tiến độ `passedStepIndexes` (0..19) đã bền ở BE nên đi tiếp đúng chương đang dở. Máy rớt giữa chương 12 → reconnect → vẫn ở chương 12.
- **20 chương:** step indicator + verify chạy theo `session.currentStepIndex`/`passedStepIndexes` sẵn có (không hardcode 5); pass đủ 20 = hoàn thành lab. Service-mode (agent tự restart) là đường dự phòng để không đứt giữa chừng.

## ⚡ Ping/latency (thầy v3: "kết nối xong ra ping UI, ping 5s mỗi lần + ghi latency ra")
Đo **round-trip THẬT tới máy học viên** (browser → BE relay → agent → BE relay → browser), hiện ms cạnh StatusChip "Máy đã kết nối", refresh mỗi 5s.
- **Agent** (`src/index.ts`): thêm echo `socket.on("agent:ping", p => socket.emit("agent:pong", p))` — trả nguyên payload `{t}`. → BẬT phiên bản agent mới (thầy publish lại; bundle chung 0.2.0 chưa publish).
- **BE gateway** (`playground-byom.gateway.ts`): 2 handler relay giống `command:run`/`command:output`:
  - `agent:ping` (browser→BE): `@SubscribeMessage` → `client.to(room).emit("agent:ping", { t })` (tới agent trong room).
  - `agent:pong` (agent→BE): `sessionId=client.data.sessionId` → `client.to(room).emit("agent:pong", { t })` (tới browser). Thêm `PublicationEvent.PlaygroundAgentPing` + `SubscriptionEvent.PlaygroundAgentPong`.
- **FE hook** (`usePlaygroundByomSocketIo.ts`): khi `connected===true` → `setInterval` 5s emit `agent:ping { sessionId, t: Date.now() }`; nghe `agent:pong { t }` → `latencyMs = Date.now() - t`; clear interval khi disconnect/unmount. Expose `latencyMs` trong state.
- **FE render**: badge `· {latencyMs} ms` cạnh StatusChip success (xanh nếu thấp, warning nếu cao). Chưa có pong đầu tiên → "— ms".

## State-matrix + conversion lens (work surface, không phễu marketing)
- 1 primary/pha: Setup=tạo phiên · Chờ=copy lệnh (install-card là tâm điểm) · Connected=Bước sau.
- **HONEST:** status kết nối là THẬT (từ BE), không giả "connected". Gate = nudge cài đúng, không dark-pattern.
- Không ngõ cụt: pha chờ, install-card chính là đường đi tiếp.

## Block briefs (element-aware) — ĐÍNH CHÍNH v2 (thầy: "render xấu, font không nhất quán, bên phải sai concept — tham khảo storybook")
Gốc lỗi = **hand-roll** (`<pre>`, `Typography h6-mono`, `Chip bg-*`, overlay 🔒, `EmptyContent`) → font lệch + right-pane 2 render khác nhau. Thay HẾT bằng block canonical:
| Khối | Block THẬT (canonical) | Ghi chú |
|---|---|---|
| **MỌI lệnh** (`docker run` step + `npx …` install) | **`MarkdownContent`** code fence (```bash) | 1 style DUY NHẤT: header lang-label + copy `SnippetIcon` built-in + mono. Bỏ `<pre>` + `h6-mono` hand-roll → hết font-inconsistency (rule §"mono chỉ qua MarkdownContent") |
| **Trạng thái kết nối** | **`StatusChip`** tone=`warning` "Đang chờ máy…" / `success` "Máy đã kết nối" | thay raw `Chip bg-warning-soft`/`bg-success-soft` |
| **Install-card** (hướng dẫn + lệnh npx) | **`Callout`** (info) bọc MarkdownContent-command | thay div hand-roll; **KHÔNG** tạo block mới `AgentConnectCard` |
| **RIGHT pane — pre-connected (setup + waiting)** | **`EmptyState`** (icon terminal, "Kết nối máy để mở workspace") bọc `<Card><CardContent>` | **1 CONCEPT DUY NHẤT** thay overlay-🔒-hack (waiting) + Terminal-empty `EmptyContent` (setup). Bỏ gate-overlay + `sessionId &&` — chỉ cần `!isRag && !connected` → EmptyState |
| **RIGHT pane — connected** | `CodeConsole` (Terminal \| Tài nguyên) HOẶC giữ `TabsCard` + output | workspace thật khi máy nối |
| Mode select | `SelectableCardGroup` | giữ |
| Step guide | `MarkdownContent` (body) + `Typography` scale nhất quán | giữ, chuẩn hoá cỡ |

## Files to touch (cho apply)
- **BE (trước):** `src/features/socketio/core/playground-byom/playground-byom.gateway.ts` (emit agent:connected khi pair + `OnGatewayDisconnect` flip+emit) · `src/features/socketio/core/enums/{publication,subscription}-event.ts` (thêm event) · payload types.
- **FE:** `src/hooks/socketio/usePlaygroundByomSocketIo.ts` (SỬA: `connected` = agent-paired thật, nghe `agent:connected/disconnected`; tách `socketConnected` riêng nếu cần) + `types/playground-byom.ts` · `src/components/features/learn/Playground/PlaygroundSession/index.tsx` (pha install-gate + status; lệnh copy BARE, KHÔNG --server) · (tuỳ) block `AgentConnectCard` · i18n `playground.session.*`.

## Verify plan (apply)
- BE trước: agent pair → browser room nhận `agent:connected`; agent Ctrl-C → nhận `agent:disconnected` + session.connected=false. Verify runtime thật (agent đã có + tunnel sống).
- FE: mở lab → pha Setup → tạo → pha "chờ" (gate 🔒, lệnh bare) → chạy agent thật → chuyển "Đã kết nối" (mở terminal) → Ctrl-C agent → về "chờ". tsc+eslint sạch.
