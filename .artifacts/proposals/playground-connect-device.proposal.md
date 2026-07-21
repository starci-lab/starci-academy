# Playground ConnectSheet — connected-state: latency + device config + agent log

**Route:** `/courses/[courseId]/learn/playground/docker` (+kubernetes) · **Prototype:** `.artifacts/prototypes/playground-connect-device/index.html` (:8082)

## Ý thầy
Khi "Máy đã kết nối" hiện thêm: (1) **latency ping ms live**, (2) **log của agent** stream, (3) **cấu hình thiết bị** (RAM/CPU/GPU/OS). Data đến từ **AGENT** (plain Node CLI trên máy học viên — KHÔNG phải BE query); Nest gateway chỉ **relay** (như `command:output`), FE hiển thị.

## Shell (không đổi)
Giữ ConnectSheet dock đáy. Chỉ bồi **connected-state**: peek + body giàu hơn. Right pane workspace (Terminal/Tài nguyên) KHÔNG đụng — agent-log ≠ command-output (log = lifecycle/diagnostic, để trong SHEET = mối lo kết nối).

## State-matrix (connected)
| Vùng | Nội dung | Block |
|---|---|---|
| **peek** (thu) | `StatusChip success` "Máy đã kết nối" + **latency badge** `· {ms}` (màu theo ngưỡng: <55 xanh/<120 vàng/else đỏ, ping 5s) + `Button` "Kết nối lại/đổi máy" | StatusChip · Button |
| **body › Máy của bạn** | grid 4 tile: **OS** (win/linux/mac + arch/hostname) · **CPU** (N nhân + model) · **RAM** (total + free) · **GPU** (tên + VRAM, hoặc "—" nếu N/A) | **StatGridCard** (grid stat-item icon+value+label) hoặc IconTile+value |
| **body › Nhật ký agent** | mono scroll compact (max ~150px, auto-scroll): connecting/paired/device/ready/command-echo/errors (warn vàng, err đỏ) | mono ScrollShadow (kiểu Terminal thu nhỏ) — **cần block nhẹ `AgentLog`** (reuse styling terminal) |
| body › reconnect | lệnh pair (đổi máy) — giữ như hiện | Callout + CodeToHtml recessed |

Mobile: device grid 4→2×2, log full-width. GPU N/A → tile "—" (honest, không giả).

## ⭐ Data-ceiling (AGENT gửi được gì — không phải BE)
| Data | Agent thu qua | Mức |
|---|---|---|
| latency ms | ping/pong RTT (FE emit `agent:ping{t}`, agent echo `agent:pong{t}`) | ✅ **agent code ĐÃ CÓ** (chưa publish) + FE `latencyMs` đã code |
| OS/platform | `os.platform()/release()/arch()/hostname()` | ✅ trivial |
| CPU model+cores | `os.cpus()[0].model` + `.length` | ✅ trivial |
| RAM total/free | `os.totalmem()/os.freemem()` | ✅ trivial |
| GPU | win: `wmic path win32_VideoController get name` · linux: `lspci\|grep -Ei 'vga\|3d'` · mac: `system_profiler SPDisplaysDataType` | ⚠️ **best-effort** (spawn+parse, fail→"—") |
| (bonus) docker/kubectl ver | `docker version`/`kubectl version --client` | ⚠️ optional |
| agent log lines | wrap `log()` → `socket.emit("agent:log",{line,level})` mỗi dòng | ✅ trivial |

## Ma trận build
| Việc | Mức |
|---|---|
| FE render latency badge | **render-là-xong** (code có, chờ agent publish) |
| Agent: `device:info` (collect os+gpu on pair, emit 1 lần) + `agent:log` (wrap log) + ping (đã có) | **agent code** (+ thầy republish) |
| BE gateway: relay `device:info` + `agent:log` → browser room (2 handler như command:output) + 2 enum event | **BE relay** (không aggregate) |
| FE hook: nhận `agent:device`/`agent:log` → state (deviceInfo, logLines[]) | render-là-xong |
| FE ConnectSheet body: device tiles (StatGridCard) + AgentLog block | render (+ có thể tạo `AgentLog` block nhẹ) |

## Files to touch
- **Agent** `starci-playground-agent/src/index.ts`: `collectDeviceInfo()` (os + spawn GPU per-platform) emit `device:info` sau pair · wrap `log()` emit `agent:log`.
- **BE** `playground-byom.gateway.ts` + enums + types: relay `device:info`→browser (`agent:device`), `agent:log`→browser; owner KHÔNG cần (agent→browser, room-scoped như command:output).
- **FE** `usePlaygroundByomSocketIo.ts` (state deviceInfo+logLines, listen 2 event) · `PlaygroundSession`/ConnectSheet body (device tiles + AgentLog) · i18n.

## Verify plan
tsc/eslint sạch · runtime: pair agent thật (WSL/host) → device tiles hiện đúng OS/CPU/RAM/GPU máy đó · agent-log stream các dòng lifecycle · latency badge live. GPU N/A → tile "—".

## Ghi chú kiến trúc (thầy hỏi)
Agent = **plain Node socket.io-client CLI** (KHÔNG NestJS — chạy máy học viên). Log KHÔNG do Nest sinh; agent thu thập (os/gpu/log) → **Nest gateway RELAY** → FE hiện. Nest là ống, không phải nguồn log.
