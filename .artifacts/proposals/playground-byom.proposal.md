# Proposal — Playground BYOM flow (setup-first, 3 lab)

> Chốt từ `/starci-fe-layout`. Prototype: `.artifacts/prototypes/playground-byom/index.html` (đối chiếu 6 màn).
> FE source `D:\Repositories\starci-academy` (branch mtp). Ground: source thật + BE gateway + `.mount` step DSL.

## Flow + shell per surface (job → shell)

| Surface | Route/mode | Job | Shell |
|---|---|---|---|
| **Hub** | `/courses/[courseId]/learn/playground` | duyệt & chọn lab | cột đọc `max-w-3xl` + grid `PlaygroundCard` |
| **Setup** (step-0 gate) | `.../playground/[slug]` pha `prepare` | cài + pair trước khi vào | **full-bleed 2-pane** (`PlaygroundPrepare`) |
| **Lab Docker/K8s** | `.../playground/[slug]` pha `session` | làm 20 bước, verify tài nguyên | **full-bleed 2-pane** + `ConnectSheet` đáy |
| **Lab RAG** | `.../playground/[slug]` pha `session` kind=rag | 20 bước hỏi/đáp, verify event | 2-pane, RIGHT = `RagPlayground` |

Routing: **cùng route `[slug]`, đổi PHA bằng state** (`prepare` → `session`), không tách route rời. Gate `prepare` mở khi `allReady=false`; `onEnter` → pha `session`.

## Quyết định lõi — Setup = 1 block, 2 flavor

`PlaygroundPrepare` nhận thêm prop **`flavor: "infra" | "ollama"`** (suy từ playground kind: docker/k8s→infra, rag→ollama):

| | `infra` (docker/k8s) | `ollama` (rag) — bản hiện có |
|---|---|---|
| Steps (LEFT) | ① cài engine (Docker Desktop / kind+kubectl, OS tabs) · ② pair agent | ① cài Ollama · ② pull models (sized-VRAM) · ③ pair agent |
| Callout máy | CPU/RAM (`status=accent`); không GPU | GPU/VRAM → `recommendGenModel` |
| Readiness (RIGHT) | engine chạy · agent paired · máy nhận diện | ollama serving · models pulled · agent paired |
| CTA | "Bắt đầu lab →" | "Vào workspace →" |

## Zones + state-matrix + conversion (đủ mỗi state)

- **Hub**: grid `PlaygroundCard` (docker/k8s/rag, stepCount). *Rỗng* → `EmptyContent` (lời mời, không ngõ cụt). CTA = card→setup `[link]`.
- **Setup**: LEFT `bg-background` canvas (steps numbered + `MarkdownContent codeElevated` + `ExtendedTabs` OS + `Callout`). RIGHT `bg-surface` (`ReadinessChecklist` + primary CTA). *pending* → CTA disabled + hint "còn N bước" `[state]`; *all-ready* → CTA enabled `[CTA 1 primary]`. `[psych]` = model khít VRAM / máy nhận diện = an tâm (số THẬT từ device:info).
- **Lab Docker/K8s**: header `BackLink`+`ProgressMeter`. LEFT `MarkdownContent(step.body)` + `Callout` verify (verifyAbsent-aware). RIGHT `ExtendedTabs`[Terminal(command:output) | Resources(`ListRow`+`IconTile`+`StatusChip`)]. *Resources rỗng* → `EmptyState` "chưa có tài nguyên". Đáy `ConnectSheet`: *chưa kết nối* `StatusChip warning` ↔ *đã kết nối* `StatusChip success` + `StatRibbon`(CPU/GPU/RAM) + agent log + "đổi máy".
- **Lab RAG**: header + chip `ollama:status`. LEFT `MarkdownContent(actionHint)` + `Callout` verify (event imported/asked/answered). RIGHT `RagPlayground`: `TabsCard` nguồn (Dán/Mẫu/Tải lên/GitHub) + chat streaming (`rag:answer`) + Nguồn/Graph `ExtendedTabs`. *trước import* → empty invite.

## Block briefs (element-aware — dùng block THẬT, không hand-roll)

`PlaygroundCard` · `PlaygroundPrepare` (+ `flavor`) · `ReadinessChecklist` · `Callout` · `ExtendedTabs` · `MarkdownContent(codeElevated)` · `PlaygroundSession` · `ConnectSheet` · `StatRibbon` · `ProgressMeter` · `ListRow` · `IconTile` · `StatusChip` · `EmptyState`/`EmptyContent` · `BackLink` · `RagPlayground`/`PlaygroundRagWorkspace` · `TabsCard`.

## Files to touch (build)

- `src/components/features/learn/Playground/PlaygroundPrepare/index.tsx` — thêm `flavor` prop; infra branch (2 step, Callout CPU/RAM, readiness engine/pair); giữ ollama branch hiện có.
- `src/components/features/learn/Playground/PlaygroundSession/index.tsx` — bật gate `prepare` cho MỌI kind (không chỉ rag); truyền `flavor` + readiness từ `usePlaygroundByomSocketIo`.
- `src/components/features/learn/Playground/PlaygroundHub/index.tsx` — đảm bảo card RAG hiện; cân nhắc `PageHeader`+`ResponsiveBreadcrumb` (xem mở).
- (nếu cần) `.../playground/[slug]/page.tsx` — nối pha prepare↔session.
- i18n `messages/{vi,en}.json` — `playground.prepare.*` cho flavor infra (engine step, no-gpu callout).

## Verify plan

- `tsc --noEmit` + eslint sạch.
- Chạy app: Hub → mỗi lab → Setup gate hiện đúng flavor → readiness gating (CTA disabled khi pending) → vào Session → ConnectSheet pair state → Docker/K8s tab Resources có `ListRow`; RAG chat streaming.
- Story `news` cho `PlaygroundPrepare` (2 flavor) + `PlaygroundSession` (tab Resources rỗng↔N).

## Mở (cần thầy chốt lúc build)
- `PlaygroundHub` có thêm `PageHeader`/breadcrumb không, hay đã nằm trong shell learn có header sẵn.
