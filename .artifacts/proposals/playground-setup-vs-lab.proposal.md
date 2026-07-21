# Proposal — Playground: tách Setup ↔ Lab thành 2 màn (PA-3, thầy chốt 2026-07-20)

> Prototype: `.artifacts/prototypes/playground-setup-vs-lab/index.html` (:8082) — 4 màn.
> Thay thế phần "Session wiring" đã đóng nhầm ở `playground-byom.proposal.md`.

## Vấn đề (thầy phát hiện qua 3 ảnh thật)

Cùng việc "chuẩn bị máy" nhưng 2 kiểu: **Docker/K8s** ném thẳng vào lab `Bước 1/20` với **pane phải chết** ("Kết nối máy để mở workspace"), setup nhồi ở thanh đáy, **không có bước cài Docker**. **RAG** thì có màn "Chuẩn bị máy" tử tế (3 bước + readiness + CTA). → bất nhất + nửa màn bỏ trống.

## Chốt: PA-3 — 2 màn thật + gate THÔNG MINH

- **Chưa sẵn sàng** → vào màn **Chuẩn bị** (Setup).
- **Đã sẵn sàng** (agent paired) → **vào thẳng Lab**, không bắt bấm qua màn thừa.
- **Switch `Chuẩn bị · Lab`** ở header — quay lại Setup 1 chạm (đổi máy / cài lại / sự cố).

### Hệ quả kiến trúc (thầy đã duyệt)
`ConnectSheet` **thôi làm UI setup** → co thành **dải trạng thái** trong Lab (đã nối · độ trễ · device tiles · agent log · nút "Đổi máy" → về Setup). Toàn bộ *cài engine + pair* dời sang màn Setup = `PlaygroundPrepare` dùng chung với prop `flavor` (`infra` cho docker/k8s, `ollama` cho rag) đã build.

## Shell per surface

| Pha | Job | Shell |
|---|---|---|
| `prepare` | cài + pair | full-bleed 2-pane (`PlaygroundPrepare`): guide trái · readiness+CTA phải |
| `session` | làm 20 bước | full-bleed 2-pane hiện tại (step guide trái · workspace phải) + status strip đáy |

Routing: **cùng route `[slug]`**, đổi bằng state `phase`, không tách route rời.

## State machine

- `phase` init = `"prepare"`; khi `byomState.connected` chuyển false→true **lần đầu** → auto `"session"` (một lần, latch — sau đó thầy/học viên tự switch không bị ghi đè).
- Switch header luôn cho về `"prepare"`.
- RAG: giống hệt (rag hiện đã có Prepare ở route standalone → nay dùng chung trong course session).

## Readiness (neo field THẬT của `usePlaygroundByomSocketIo`)

| flavor | rows | nguồn |
|---|---|---|
| `infra` | agent đã pair · máy nhận diện | `connected` · `deviceInfo != null` |
| `ollama` | agent · Ollama serving · model embedding · model sinh câu | `connected` · `ollamaStatus.serving` · `models` chứa `nomic-embed-text` · có model non-embed |

*(KHÔNG bịa "Docker engine đang chạy" — browser không quan sát được; agent pair thành công là tín hiệu trung thực nhất.)*

## Files to touch

- `src/components/features/learn/Playground/PlaygroundSession/index.tsx` — thêm `phase` + auto-latch + header switch; pha `prepare` render `PlaygroundPrepare`; pha `session` giữ grid cũ, `ConnectSheet` bỏ `installCard` khỏi body (chỉ device+log), peek thêm nút "Đổi máy" → `setPhase("prepare")`.
- `src/messages/{vi,en}.json` — `playground.session.phasePrepare` / `phaseLab` / `switchAria`.
- (dùng lại) `PlaygroundPrepare` + prop `flavor` (đã build lượt trước).

## Verify plan

- `tsc --noEmit` + `eslint` sạch.
- Runtime: mở `/playground/docker` khi CHƯA nối → phải vào màn Chuẩn bị (không phải lab chết); pair agent → tự nhảy Lab; bấm switch → về Chuẩn bị; `/rag` → flavor ollama.
- Story `news`: `PlaygroundPrepare` đã có `Infra`; thêm state cho switch nếu tách được block.

## Rủi ro
`PlaygroundSession/index.tsx` đang **M (chưa commit)** của session `playground-rag-ollama` — thầy xác nhận session đó đã nghỉ. Sửa **additive**, không rewrite cấu trúc grid/RIGHT pane.
