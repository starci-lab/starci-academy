# Proposal — Mind-map node card+ring (theo mức độ phổ biến) + cụm nút lookup

> Nối tiếp [`mind-map-concept-redesign`](./mind-map-concept-redesign.proposal.md) (DONE). Thầy: *"mỗi cái là card với ring, tô ring theo mức độ phổ biến"* + *"thêm cụm nút support cho việc lookup diagram"*. Chốt nguồn = **A (author weight tay, Sonnet, theo bối cảnh thực chiến)**; màu ring: **rất phổ biến = xanh · phổ biến = vàng · chuyên sâu = đỏ**.
>
> **Prototype:** `.artifacts/prototypes/mind-map-node-ring/index.html` (host :8096) — card+ring 3 tier + toolbar (search→focus · filter tier · fit/gom · minimap). Slice devops thật.

## JOB → SHELL
- **JOB (thêm):** trên bản đồ keyword đã đọc-được, (1) NHẬN NGAY concept nào quan trọng/phổ biến (ring màu), (2) TÌM 1 keyword giữa ~200 node (search → nhảy tới), (3) giảm nhiễu (lọc theo tier).
- **SHELL:** giữ full-bleed React Flow; thêm `Panel` toolbar + `MiniMap`.

## Data — thêm `popularity` mỗi keyword (nguồn A)
- **Field mới:** `popularity: "high" | "medium" | "low"` trên mỗi node (trừ root). Author qua **Sonnet** (3 khóa, theo tần suất thực tế/phỏng vấn) — đang chạy, ghi `weight-{fs,do,sd}.json`, tôi merge vào JSON. (fullstack xong: high 55 / med 89 / low 42.)
- **BE:** `CourseMindMapNode` (entity jsonb type) + `MindMapNodeData` (response) + FE `CourseMindMapNodeData` type + `query-course-mind-map.ts` — thêm `popularity` (optional). `buildConceptGraph` map `node.popularity ?? null` → `data.popularity`. Root = null.
- **DB:** re-inject 3 khóa (như desc) — UPDATE `courses.mind_map` từ JSON (Redis đã bỏ, khỏi purge).

## FE — node card+ring + toolbar
| File | Vai |
|---|---|
| `MindMap/ConceptMap/index.tsx` (`ConceptNode`) | Card + **ring màu theo `popularity`** (`high→success/xanh · medium→warning/vàng · low→danger/đỏ`) qua `ring-2 ring-<tone>` (node là div thường, không dính `.card{border:none}`) + **chấm tier trong card** (a11y: không chỉ dựa màu ring — [[accent-system]] "màu mang nghĩa data" hợp lệ, nhưng thêm kênh phi-màu). Root giữ accent. |
| `MindMap/MindMapToolbar/index.tsx` (MỚI, bespoke feature) | React Flow `Panel` top-left: **search keyword** (HeroUI `Input` typeahead lọc `data.nodes` theo label → chọn = `useReactFlow().setCenter(x,y,{zoom,duration})` focus + highlight transient) · **filter tier** (chip Tất cả/≥Phổ biến/Chỉ Core → dim node tier thấp, giữ layout) · **Fit** (`fitView`). |
| `MindMap/ConceptMap/index.tsx` | Thêm `<MiniMap>` (node color theo popularity) cạnh `<Controls>` sẵn có; bọc toolbar trong `<ReactFlowProvider>` (đã có) để `useReactFlow` hoạt động. |

## State-matrix + conversion
- Search rỗng-kết-quả → dòng "không thấy keyword" (không ngõ cụt). Filter "Chỉ Core" khi 0 core → vẫn hiện root + hint. Loading/empty/error giữ như `mind-map-concept-redesign`.
- 1 primary/màn = mỗi keyword click → drawer (desc + RAG). Toolbar là aid, không cạnh tranh CTA. HONEST: popularity là editorial (author), KHÔNG bịa "X% học viên" — chỉ tier định tính.

## Block canonical
Node/toolbar/minimap = **bespoke** (feature canvas riêng, tiền lệ). Dùng lại: `@xyflow/react` (`Panel`/`MiniMap`/`Controls`/`useReactFlow`), HeroUI `Input`+chip (`FlexWrapButtonRadio`? — hoặc chip thường trong Panel), `Typography`, Phosphor icon (Magnifying/Funnel).

## Ring color mapping (chốt)
`high` → `success` (xanh) · `medium` → `warning` (vàng) · `low` → `danger` (đỏ). Ring `ring-2` + `ring-success/warning/danger` (hoặc box-shadow token); chấm `bg-success/warning/danger`. Selected/hover giữ ring accent (đè tier tạm khi tương tác).

## Verify plan
- `tsc` + eslint FE + BE.
- Runtime: `/vi/courses/<slug>/learn/mind-map` — node có ring đúng màu tier; search "VPC"/"Redis" → nhảy+focus node; chip Core → dim tier thấp; minimap phản chiếu; click node → drawer.
- Data: 3 JSON có `popularity` mọi node, DB re-inject, BE serve `popularity`.

## Story
Feature-comp canvas → không story. `MindMapToolbar` nếu tách presentational → cân nhắc story news (search/filter state).

## Rủi ro
- `setCenter` cần vị trí node (có từ `data.nodes`) — map id→position sẵn.
- Ring 200 node nhiều màu → có thể "rối"; filter tier + minimap là để giảm. Nếu vẫn rối, cân nhắc chỉ ring core/low (bỏ ring medium = mặc định) — để thầy soi rồi quyết.
