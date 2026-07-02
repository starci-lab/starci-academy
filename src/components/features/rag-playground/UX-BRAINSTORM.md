# UX Brainstorm — RAG Playground CÔNG KHAI (import code → hỏi, chạy model LOCAL của StarCi) — 2026-06-30

> `/starci-fe-ux-brainstorm`. Thầy: *"thêm RAG Playground là trò dùng model local của thầy và import code vào và chơi. public nhé để mkt"*. Feature MỚI (không phải redesign). KHÔNG code (chờ `/starci-fe-ux-apply`). Widget: `rag_playground_public_layouts`.

## 0. Mục tiêu + định vị (MARKETING)
Trang CÔNG KHAI (không cần đăng nhập) cho bất kỳ ai: **dán/upload code (hoặc dùng repo mẫu) → hệ index (chunk+embed+Qdrant) → hỏi/chat, câu trả lời GROUNDED vào code + trích NGUỒN (đoạn code)** — chạy trên **model LOCAL của StarCi (qwen, GPU thầy, MIỄN PHÍ)**. Đây là **build-in-public**: showcase CHÍNH cái RAG engine + GPU local đang chạy grading + tutor của StarCi → proof năng lực kỹ thuật, thu hút (đúng họ [[engineering-blog-reframe-and-public-infra-showcase-no-prod-leak]] · [[landing-grounded-real-courses-and-systems]] · [[interactive-showpiece-contain-dont-kill-flex]]).

## 1. GROUNDED — hạ tầng THẬT (3 Explore agent)
**RAG engine (BE) tái dùng gần hết:**
- Chunk `RecursiveCharacterTextSplitter` · embed **`EmbeddingModelService.getViaBalancer()` (local-first, free $0)** · Qdrant **ephemeral per-run** (`GradingRetrievalService`: tạo `grading-${runKey}` → dùng → **drop trong `finally`**) · invoke `AiInvokeService.run({ floor: Free, surface: Chatbot, onChunk })` → **qwen local, cost=0, streaming token**.
- Model local: Ollama `OLLAMA_BASE_URL` (prod = Cloudflare tunnel `qwen.starci.org`), Bearer từ `qwen7b.key`. Pin Free tier → luôn chạy local, $0.
- **Public precedent:** `publicContent` query KHÔNG auth + soft throttle (100/min). → public GraphQL khả thi. Throttle per-endpoint opt-in (Soft/Medium/Strict), IP-based qua X-Forwarded-For.

**Playground precedent (AI Lab) — reuse patterns:**
- Đã có `aiLabPlayground` (config) + **`runPlaygroundPrompt`** (mutation → `runId`, **stream token qua Socket.IO `/ai_lab`**, cache theo `inputHash`) + `myAiLabRuns` + eval. Kind `prompt|rag|comparison` — **RAG schema-ready** (`ragCollectionSlug`) nhưng FE fallback prompt. NHƯNG: **auth-gated + nhúng lesson tab + không code-import + không pin-local + không public.**
- Reuse: streaming Socket.IO (per-run room, token delta, abort), run/prompt UI, `ParamControls`, cache.

**FE blocks tái dùng:**
- Route public: `/[locale]/rag-playground` — tự PUBLIC (không nằm trong `PROTECTED_PATTERNS` của `proxy.ts`). Đặt cạnh `/home` `/blog` `/courses`.
- Code-input: **`SandpackPanel`** (editor sống) / **`CodeToHtml`** (Shiki highlight) / **`Dropzone`** (upload file). Chat: **`ContentAiChat`** pattern (composer + ChatBubble + stream + MarkdownContent). Marketing: **`HeroBanner`** · **`ShowcaseMockup`** · **`ArchitectureScene`** (3D RAG-flow). Không cần dep mới.

## 2. IA mới — trang `/rag-playground`
```
Hero (marketing): HeroBanner — eyebrow "RAG · Model local" · headline "Hỏi codebase của bạn — chạy trên GPU StarCi, miễn phí" · sub (1 dòng: engine đang chạy grading/tutor) · CTA cuộn xuống playground · (optional) ArchitectureScene mini RAG-flow.
Playground (core):
  ① Import code — dán (Sandpack/CodeToHtml) · upload file (Dropzone) · "dùng repo mẫu" (curated, index sẵn) · chọn ngôn ngữ
  ② Index status — "đã index N đoạn" (RAG transparency, nhẹ)
  ③ Hỏi & đáp — composer → stream answer từ local model + hiện ĐOẠN CODE trích nguồn (citations, như Elastic playground) + badge model "qwen local · miễn phí" + token/latency (build-in-public proof)
Footer CTA: "Muốn RAG chấm bài của bạn? → Khóa học / Đăng ký"
```

## 3. Ba HƯỚNG bố cục (widget) — chốt
| Hướng | Là gì | ✅ | ❌ |
|---|---|---|---|
| **A — Split 2-pane IDE-style** ✅ ĐỀ XUẤT | trái = code (editor/dán/upload/mẫu) · phải = chat + trích nguồn | kể chuyện "RAG" rõ NHẤT (thấy code ↔ câu hỏi ↔ nguồn); import front-and-center; repo mẫu load sẵn → thử ngay; đậm chất "playground" | 2-pane hẹp trên mobile (fold dọc) |
| **B — Wizard dọc từng bước** | Hero → ① import → ② index ✓ → ③ chat | tuyến tính, rõ cho người mới, mobile mượt | kém "wow" tức thì; nhiều cuộn |
| **C — Chat-first, repo mẫu sẵn** | vào là chat trên repo mẫu; import ẩn (collapse) | 0-friction, wow ngay | "import code" (ý chính của thầy) bị mờ/thứ yếu |
→ **Đề xuất A**: đúng ý "import code vào và chơi" (import là nửa trái, nổi bật) + kể chuyện RAG trực quan (code → hỏi → nguồn) + **repo mẫu load sẵn** để khách chưa có code vẫn thử ngay (giải "friction" mà C giải nhưng không hy sinh import). Mobile: fold dọc (code trên / chat dưới, hoặc tab). Refs: [Elastic RAG Playground](https://www.elastic.co/search-labs/blog/rag-playground-introduction) (low-code thử grounding + hiện nguồn) · [chat-with-codebase RAG](https://github.com/codingwithsurya/chat-with-your-code-with-rag) · Cursor/Sourcegraph "ask your repo".

## 4. Section → dữ liệu/engine
| Phần | Nguồn | Trạng thái |
|---|---|---|
| Import code (dán/upload/mẫu) | FE state + `Dropzone`/`SandpackPanel` | ✅ FE có |
| Index (chunk+embed+qdrant ephemeral) | RAG engine (chunk/embed-local/Qdrant `playground-${sessionId}`) | ⚠️ **BE mới** (wrap engine sẵn, không auth) |
| Hỏi + retrieve + invoke local stream | `AiInvokeService.run({floor:Free, onChunk})` + retrieval | ⚠️ **BE mới** (public endpoint) |
| Trích nguồn (chunk hiển thị) | retrieved chunks (payload filePath/lang) | ✅ engine trả (chỉ cần expose) |
| Badge model local + token/latency | `result.provider===Local`, cost=0, tokens | ✅ có |

## 5. ⚠️ BE phải add (báo thầy)
- **Module MỚI `public-rag-playground`** (KHÔNG extend ai-lab để tránh coupling auth/entitlement/lesson). Public GraphQL:
  - `indexRagPlayground(input:{sessionId, code|files[], language}) → {sessionId, chunkCount}` — chunk+embed(local)+upsert ephemeral `playground-${sessionId}`.
  - `askRagPlayground(input:{sessionId, question}) → {runId}` (stream qua **public Socket.IO namespace `/rag_playground`**, KHÔNG auth middleware) HOẶC (MVP) trả full `{answer, sources[]}` không stream.
- **Public + chống abuse:** KHÔNG Keycloak; `@UseThrottler(Strict)` (10/min, 100/hr) IP-based; **cap kích thước** (max code ~50KB, max chunks ~40, max question len); ephemeral collection **TTL/cron cleanup** (hoặc drop khi index mới cùng session).
- **Pin LOCAL/free:** `floor: AiModelCategory.Free` + không entitlement gate → luôn qwen local ($0). Embedding qua `getViaBalancer` (local-first).
- **Repo mẫu:** 1 collection curated pre-index (vd mini-repo StarCi) để "thử ngay" — hoặc index-on-first-load session mẫu.
- **Anonymous session:** `sessionId` FE tự sinh (uuid, lưu localStorage) gửi kèm; không cần cookie auth.

## 6. States / a11y / abuse
- Empty (chưa import + chưa mẫu) → nudge "Dán code hoặc dùng repo mẫu". Indexing → progress "đang index…". Ask khi chưa index → disable + hint. Local model down → fallback message (không leo cloud để giữ $0, hoặc leo Economy có cảnh báo — chốt sau). Rate-limit hit → "thử lại sau" (throttle). Size vượt cap → "code quá lớn cho demo, thử đoạn nhỏ hơn".
- Không leak: public → chỉ code user tự nhập; không đụng data nội bộ. Ephemeral, không lưu lâu.

## 7. Cần thầy chốt
- Hướng **A/B/C**?
- **Import method** hỗ trợ: (a) dán code + upload file + repo mẫu (đề xuất) · (b) thêm GitHub repo URL (clone — nặng, abuse, defer) · (c) chỉ dán + mẫu (gọn nhất).
- **Streaming** (đẹp, reuse Socket.IO — cần public namespace) hay **MVP non-stream** (trả full answer, đơn giản, làm nhanh)?
- Route tên `/rag-playground` hay `/playground` hay khác?
