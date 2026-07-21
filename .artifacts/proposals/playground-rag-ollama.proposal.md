# Proposal — RAG playground: Ollama machine-backed (docker-shell + Q&A pane)

> Brainstorm 2026-07-19 · prototype `.artifacts/prototypes/playground-rag-ollama/` (host :8090) · SPEC cho `starci-fe-build`.
> Chốt của thầy: (1) render **y chang docker/k8s** shell, tab phải = **Hỏi đáp + Nguồn** thay Terminal/Resources · (2) onboarding Ollama = **màn "Chuẩn bị máy" (bước 0)** riêng · (3) tab **Nguồn 2 kiểu render**: plain document + bong bóng **xyflow**.

## Flow + shell (job → shell)
Route: `/[locale]/courses/[slug]/learn/playground/[slug]` (kind `rag`) — **cùng route/shell với docker/k8s**, phân nhánh theo `playground.kind`.

| Pha | Job | Shell | Trái | Phải | ConnectSheet |
|---|---|---|---|---|---|
| **setup** | mời chuẩn bị | work-surface 2-pane | intro "chạy trên máy bạn + Ollama" + CTA | `EmptyState` khoá | peek "Máy chưa nối · cần Ollama" + CTA |
| **prepare (bước 0)** ⭐ | onboarding máy | 2-pane (guide · readiness) | 3 việc: ① cài Ollama (tab OS) · ② `ollama pull` embed+gen · ③ nối agent | **`ReadinessChecklist`** live (agent/serve/embed/gen) → "Bắt đầu lab" (gated) | ẩn (readiness ở right) |
| **work (1..20)** | làm RAG | work-surface full-bleed 2-pane | step guide + `actionHint` | tab **Hỏi đáp** (bong bóng) + **Nguồn** (2 render) | collapsed: "Máy + Ollama sẵn sàng · ping" + reconnect |
| **ollama-dropped** | khôi phục | như work, workspace khoá mờ | tiến độ giữ | workspace `locked` | warn "Ollama đã dừng" + `ollama serve` |
| **agent-dropped** | khôi phục | (tái dùng docker) | — | — | warn "Máy ngắt" + pair (như docker hiện có) |

- **Phân biệt 2 kiểu ngắt** (mới của RAG): **agent-dropped** (máy off — như docker) vs **ollama-dropped** (agent còn nối, chỉ LLM :11434 tắt).
- Routing: **cùng shell, phân nhánh theo `kind`** — KHÔNG route riêng.

## Zones (work pha)
- Header band: `BackLink` + `ProgressMeter` (sticky).
- LEFT (`bg-background` canvas): step guide — `Typography` h6 + `MarkdownContent` (body/actionHint) + verify CTA.
- RIGHT (`bg-surface`): workspace — `ExtendedTabs` [Hỏi đáp | Nguồn] + ask bar.
- ConnectSheet docked (absolute bottom), auto-snap theo pha.

## State-matrix + conversion lens
- **setup/empty** = lời mời chuẩn bị → CTA "Chuẩn bị máy" (không ngõ cụt).
- **prepare** = goal-gradient (checklist tick dần 0→4, số THẬT do agent dò), 1 primary "Bắt đầu lab" gated.
- **work** = 1 primary "Đánh dấu xong bước"; onward = step kế; honest (Ollama thật, local, miễn phí — không fake).
- **dropped** = "tiến độ GIỮ" (giảm lo mất công) + lệnh khôi phục rõ.

## Block briefs (element-aware — tên block THẬT)
| Vùng | Block | Mới/Sửa |
|---|---|---|
| header | `BackLink` · `ProgressMeter` | dùng lại |
| guide | `Typography` · `MarkdownContent` · `Callout` | dùng lại |
| connect | `ConnectSheet` · `StatusChip` · `Button` | **Sửa** ConnectSheet: + state "Ollama ngắt" |
| **readiness** | **`ReadinessChecklist`** = compose `ListRow`+`StatusChip`+`IconTile` | **MỚI** (cần tạo) |
| OS install | `ExtendedTabs` + `MarkdownContent` code | dùng lại |
| workspace tabs | `ExtendedTabs` [Hỏi đáp\|Nguồn] | dùng lại |
| Q&A | RAG chat bong bóng (từ `RagPlayground`) | **Sửa** RagPlayground → biến thể right-pane |
| **Nguồn** | **2 render**: ① plain document (highlight `<mark>`) · ② **`RagSourceGraph`** (xyflow node/edge) | **MỚI** graph (cần tạo, dep `@xyflow/react`) |
| locked | `EmptyState` | dùng lại |

## Data-ceiling map (đang có / persist-chưa-vẽ / phải mở BE)
| Cần | Trạng thái | Ghi chú |
|---|---|---|
| agent connect/latency/command/resources/verify | ✅ có (`/playground_byom`) | dùng lại cơ chế docker |
| RagPlayground import→ask→cite (server) | ✅ có | hiện chạy server `ask-rag-playground` |
| **Ollama readiness (installed/serving/models)** | ❌ **net-new BE+agent** | agent phải dò + báo → socket event mới `ollama:status` |
| **RAG chạy trên Ollama máy học viên** (embed+gen local qua agent) | ❌ **net-new BE+agent** | thay server-side RAG; agent tunnel :11434 |
| **verify-step theo RAG event** (asked/answered) | ❌ net-new | thay "resources report" của docker |
| `@xyflow/react` cho Sơ đồ Nguồn | ❌ chưa cài | dependency mới |

## Ma trận build
- **render-là-xong (FE):** shell rẽ nhánh kind=rag · màn prepare (UI) · tab Hỏi đáp/Nguồn · **Nguồn 2-mode** (plain doc = render-xong; xyflow = +dep `@xyflow/react`).
- **đổi BE/agent (nặng):** `ollama:status` socket + agent dò Ollama · RAG chạy local trên Ollama học viên · verify-by-RAG-event. → **cần spec BE riêng trước khi build phần machine-backed.**

## Files to touch (dự kiến)
- `src/components/features/learn/Playground/PlaygroundSession/index.tsx` — kind=rag → shell docker + prepare gate + right=Q&A/Nguồn.
- `src/components/features/rag-playground/RagPlayground/index.tsx` — biến thể right-pane workspace (Q&A + Nguồn 2-mode).
- **MỚI** `src/components/blocks/.../ReadinessChecklist` · **MỚI** `RagSourceGraph` (xyflow).
- `src/hooks/socketio/types/playground-byom.ts` (+`ollama:status`) — **cần BE trước**.
- i18n `playground.session.*` (+ prepare/ollama keys).

## Verify plan
- tsc + eslint sạch.
- Chạy runtime: kind=rag playground → prepare (checklist mock tick) → work (Q&A bong bóng, Nguồn toggle Tài liệu/Sơ đồ) → dropped.
- FE-only phần đầu (prepare UI + 2-mode Nguồn với data mock) build được ngay; phần machine-backed chờ BE spec.

## Prototype ref
`.artifacts/prototypes/playground-rag-ollama/index.html` (host :8090) — 4 màn seg + Mobile + nút demo readiness tick + Nguồn toggle.

## Bổ sung (thầy 2026-07-19)
- **BỎ cloudflared** — giữ agent-RAG engine (P3). Không tunnel.
- **Agent dò GPU + VRAM còn trống** (nvidia-smi/wmic) → report qua device:info.
- **Màn Chuẩn bị máy KHUYẾN NGHỊ model theo VRAM**: <4GB→qwen2.5:3b · 4-8GB→qwen2.5-coder:7b · >8GB→lớn hơn; + guide cài embedding `nomic-embed-text`. GEN_MODEL động (agent chọn model gen sẵn có, không fix cứng).
