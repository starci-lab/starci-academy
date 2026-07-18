# Proposal — Mind-map concept graph: keyword-tree + clustered layout (B) + RAG drawer

> Thầy chỉ ảnh `/vi/courses/devops-mastery/learn/mind-map`: render VỠ — chuỗi node dọc bé xíu, nửa trái trống. Chốt: **StarCi = learn by keyword** → sơ đồ chỉ là **cây keyword ngắn**, bấm keyword → **RAG** lo nội dung liên quan. Layout chốt = **B · cây gom nhánh**, render đẹp.
>
> **Prototype:** `.artifacts/prototypes/mind-map-concept-redesign/index.html` (host :8095) — switcher A/B/C + Rỗng; B đã polish (keyword-pill + dải nền nhánh + chấm màu), bấm keyword → RAG drawer trượt phải. Gộp với proposal cũ [`mind-map-rag-drawer`](./mind-map-rag-drawer.proposal.md) (drawer đã có sẵn).

## JOB → SHELL
- **JOB:** ĐỊNH HƯỚNG bằng khái niệm — thấy bản đồ keyword của khóa, bấm 1 keyword → tới nơi học/ôn/thi/làm nó. Không phải work-surface.
- **SHELL:** full-bleed canvas (`MindMap/index.tsx` giữ route mount) → trong đó là **clustered keyword tree** (thay dagre rank-packing) + **RAG drawer** khi click node.

## Nguyên nhân màn đang vỡ (2 agent scan)
- Route `/learn/mind-map` = `ConceptMap` (dagre `rankdir:LR`). **Config đúng chiều nhưng topology sụp:** mọi node cùng depth dồn 1 rank dọc → cột cao ngàn px → `fitView` zoom ra → node bé, 2 bên trống. `layout.ts:37` `nodesep:18` càng ép sát.
- **devops KHÔNG có mind-map authored** → BE `buildGraph` fallback derived course→module→lesson (rank-2 = mọi lesson) → đúng "chuỗi dọc bên phải".
- ⇒ Render đẹp KHÔNG nằm ở JSON; nằm ở **code layout**. JSON chỉ là nội dung keyword.

## Đổi SCHEMA — `course.mind_map` = cây keyword thuần (bỏ links + desc)
Cũ (`CourseMindMapNode`): `{id,label,desc?,links?,children?}`. **Mới dùng: chỉ `{id,label,children?}`** — bỏ `links[]` (RAG thay) + `desc` (tách thành keyword con). `links`/`desc` là optional trên entity nên **KHÔNG cần đổi entity/GraphQL type** — chỉ ngừng author chúng, và BE `buildConceptGraph` khi thiếu `links` → `links:[]` (drawer không dùng authored link, dùng RAG).
- **JSON regen (đang chạy, 2 Opus agent, mỗi con 1 file):** `0-fullstack` (viết lại old→keyword-tree, split desc→keyword con) + `2-devops` (author mới, ground module thật). SD/ai-llm/claude → lượt sau (lane auto-gen keyword tree).

## Data ceiling — RENDER-LÀ-XONG (0 BE mới)
| Cần | Có? | Nguồn |
|---|---|---|
| Cây keyword (nodes+edges) | ✅ | `courseMindMap` query; BE `buildConceptGraph` walk tree → nodes/edges (`type:"concept"`) |
| Click keyword → content liên quan | ✅ | `searchCourseContent(courseId, keyword)` (RAG Qdrant) → gom theo kind |
| Drawer render | ✅ ĐÃ BUILD | `MindMapNodeDrawer` (dùng `useQuerySearchCourseContentSwr(keyword)`, bucket kind) + `EntityResultRow` |
- **Prereq:** content phải index Qdrant (đã cần sẵn cho Gợi ý học/chat) — **job idempotent riêng, KHÔNG nhét init** (init reindex từng crash boot — `content-rag-dup-index-bug`).

## Layout B — clustered tree (files to touch)
| File | Vai |
|---|---|
| `MindMap/ConceptMap/layout.ts` | **Đổi core:** thay dagre rank-packing → **tree phân cụm**: con GOM cạnh cha (concept của 1 theme xếp thành cụm ngay phải theme đó), không dồn chung 1 rank. Root trái, theme cột giữa, keyword phải theo cụm. Giãn `nodesep`/cụm; `fitView` theo bề rộng thật. |
| `MindMap/ConceptMap/index.tsx` (`ConceptNode`) | Node = **keyword trần** (bỏ desc/link-chip trên mặt node); pill có chấm màu nhánh; theme node màu; root nổi. onNodeClick → mở `MindMapNodeDrawer` với `keyword=node.label`. |
| `drawers/MindMapNodeDrawer` | Đã có — verify feed `keyword` + bucket kind + empty/error. |
| `MindMap/index.tsx` | Empty-state: khóa **chưa authored** (mind_map null) → KHÔNG đổ derived graph xấu → EmptyContent "Sơ đồ chưa biên soạn" + CTA phễu "Vào học phần". (Quyết định (a) đã chốt.) |
| BE `course-mind-map.service` | Khi `course.mindMap == null` → trả rỗng (để FE ra empty-state) thay vì build derived module graph. |

## State-matrix + conversion
- **Loading** → skeleton canvas. **Empty (chưa authored / chưa enroll)** → EmptyContent + CTA "Vào học phần" (phễu, không ngõ cụt).
- **1 primary/màn** = drawer CTA "Tiếp tục học" không áp; primary thực = mỗi keyword → drawer → row jump. Mọi row → surface đúng (`resolveSearchResultHref`). HONEST: RAG thật, không fake.
- **Responsive:** desktop = clustered tree pan/zoom; **mobile = cột chủ đề (hướng C)** (tree ngang khó trên mobile) — build C làm mobile fallback của cùng data.

## Block canonical
Canvas/node = **bespoke** (feature canvas riêng, tiền lệ React-Flow). Dùng lại: `@xyflow/react`, `MindMapNodeDrawer` (đã có), `EntityResultRow`, `RelatedContentList` idiom, `AsyncContent`, `EmptyContent`, `PageHeader`+`ResponsiveBreadcrumb` (route page-level).

## Verify plan
- `tsc --noEmit` + eslint mọi file đổi.
- Runtime: `/vi/courses/<slug>/learn/mind-map` — fullstack: cây gom nhánh đọc được, không strand; bấm keyword → drawer RAG gom kind, row jump đúng; devops (sau khi có JSON) tương tự; khóa chưa authored → empty-state phễu.
- JSON: 2 file parse OK, schema đúng (chỉ id/label/children), không còn links/desc.

## Story
Feature-comp canvas → không story (MindMap vốn không). Drawer nếu tách state mới → cân nhắc story sau.

## Rủi ro
- Clustered layout là phần dễ sai runtime (đo cụm, fitView) → verify kỹ.
- `StandaloneMindMap` (public `/mind-map`, dùng `Canvas`/`build.ts`) là hệ RIÊNG — không đụng ở proposal này (chỉ sửa `ConceptMap`).
