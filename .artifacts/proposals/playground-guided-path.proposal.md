# Proposal — Playground Guided Path (lộ trình từng-bước chung, nội dung ở `.mount`)

> Status: ⏳ PENDING · Trigger: thầy `/starci-fe-layout` — "3 playground (Docker/K8s/RAG) xây kiểu lộ trình học chung chung, từng bước hướng dẫn một, lưu vào `.mount`". Thiết kế schema `.mount` + FE shell CHUNG cho cả 3.

## Hiện trạng (deep-scan 2 repo)
- **Docker/K8s** = ĐÃ là step-path trong `.mount` (`courses/2-devops-mastery/playgrounds/{0-docker,1-kubernetes}/steps/`). Step = `title · body · commandHint · verifyResourceKind/NamePattern/ExpectedStatus`. Entity `playground`/`playground-step`/`playground-session`. FE `Playground/PlaygroundSession` (guided/free mode + Terminal + Resources live).
- **RAG** = tool marketing RIÊNG (`rag-playground/RagPlayground`, entity `ai-lab-playground`/`rag-playground-session`), 2-pane import-code→hỏi→trích-dẫn. **KHÔNG step, KHÔNG `.mount`.**
- Meta playground hiện có `slug/title/description/icon/sortIndex` — **chưa có `kind`**.

## Ý tưởng chốt: 1 schema path chung + field `kind` đa hình
Nâng model step-path hiện tại thành **generic**: thêm `kind` ở meta (terminal | rag | future) → quyết **pane phải** (widget interaction) + **họ verify**. Step giữ envelope chung (`title/body/mode`), hint + verify **đa hình theo kind**. RAG được **script thành path có bước** (nạp mẫu → hỏi → soi trích dẫn → hỏi khó hơn), driving `RagPlayground` làm widget của bước.

## Prototype (bấm được)
`.artifacts/prototypes/playground-guided-path/index.html` — host `http://localhost:8081/`. Toggle **Playground** (Docker/K8s/RAG) — CÙNG 1 shell step-path, pane phải + hint + verify đổi theo `kind`; **Guided/Free** mode; **Máy**. Bảng dưới = schema `.mount` (🟩 field mới).

## Schema `.mount` (element-aware)
**Meta** `playgrounds/<slug>/{vi,en}.md`: giữ `slug/title/description/icon/sortIndex` + **`# kind`** (`terminal`|`rag`) MỚI.
**Step** `steps/<N>-<slug>/{vi,en}.md`:
- Chung: `# title` · `# body`.
- **Hint (đa hình):** `# commandHint` (terminal, đã có) · **`# actionHint`** (rag: "Dán code mẫu bên trái", MỚI) · **`# sampleRef`**/**`# askPrefill`** (rag prefill, MỚI optional).
- **Verify (đa hình):** `# verifyResourceKind/NamePattern/ExpectedStatus` (terminal, đã có) · **`# verifyKind`** (rag: `imported`|`asked`|`answered`, MỚI).

## FE shell CHUNG (`PlaygroundPath`)
- Header band: ← Thoát · tiêu đề bước · Bước N/M + progress. Guided/Free toggle (đã có).
- Pane TRÁI (chung mọi kind): step title + body + hint (command HOẶC action) + verify note.
- Pane PHẢI (theo `kind`): `terminal` → PlaygroundSession Terminal+Resources (đã có) · `rag` → RagPlayground 2-pane nhúng (import→ask→cite) làm widget bước.
- Full-bleed 2-pane work-surface (đúng `full-bleed-work-surface.md`).

## Ma trận build (field sẵn / mở BE / đổi schema)
- **render-là-xong / gần free**: Docker/K8s đã chạy — chỉ thêm đọc `kind` (default `terminal` cho playground cũ). FE shell tách `kind`→widget.
- **aggregate/parser BE**: parser `playground.ts` + entity thêm `kind` (playground) + `actionHint`/`sampleRef`/`askPrefill`/`verifyKind` (step, jsonb/varchar — cân nhắc migration nếu là cột enum; nên **varchar** né enum-trap). RAG verify (`imported/asked/answered`) cần BE hook vào rag-session state.
- **content `.mount`**: author RAG playground MỚI (`courses/ai-llm-mastery/playgrounds/rag/steps/…`) — 3-4 bước script hoá flow RAG.
- **⚠️ quyết định**: RAG marketing landing (public, "miễn phí không đăng nhập") GIỮ hay THAY bằng path? → đề xuất GIỮ landing + THÊM path-mode trong khoá (2 lối vào cùng widget), không phá demo public.

## Files to touch (khi build — sau khi thầy chốt schema)
- BE: `parsers/types/playground.ts` + `playground.service.ts`/`playground-step.service.ts` (đọc field mới) · entity `playground`/`playground-step` (+ `kind`/`actionHint`/`verifyKind`) · RAG verify hook.
- FE: tách `PlaygroundPath` shell (render pane phải theo `kind`); nhúng `RagPlayground` làm widget bước.
- `.mount`: author RAG path steps.

## Bàn giao (3 thứ)
1. **Prototype**: `http://localhost:8081/` · file `.artifacts/prototypes/playground-guided-path/index.html`.
2. **Component → Storybook** (khi build): playground là FEATURE-component (`Playground/*`, `rag-playground/*`) — không phải block canonical → KHÔNG story. Nếu tách primitive chung (StepHeader/ModeToggle) mới cân nhắc.
3. **Nguồn**: `.mount/…/playgrounds/{0-docker,1-kubernetes}` · BE `parsers/types/playground.ts` + entity `playground*`/`ai-lab-playground`/`rag-playground-session` · FE `Playground/PlaygroundSession` + `rag-playground/RagPlayground` · [[playground-mount-pipeline]] memory. KHÔNG web.

## Chờ thầy chốt
1. Duyệt schema `kind`-đa-hình (meta `kind` + step hint/verify polymorphic)?
2. RAG: GIỮ landing marketing + thêm path-mode, hay THAY hẳn bằng path trong khoá?
3. `verifyKind` cho RAG dừng ở `imported`/`asked`/`answered`, hay cần sâu hơn (số câu hỏi, có trích dẫn…)?
4. Build luôn hay để BACKLOG bàn giao?
