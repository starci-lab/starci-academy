# Mind-Map RAG Drawer — layout proposal

**Route:** `/courses/[courseId]/learn/mind-map` (đã tồn tại) · **Prototype:** `.artifacts/prototypes/mind-map-rag-drawer/index.html` (host :8082)

## Ý đồ (thầy)
Node keyword trên sơ đồ tư duy → **bấm mở drawer** liệt kê nội dung / flashcard / thử thách / milestone **liên quan qua RAG**. Mind-map giữ **render xyflow** + **layout theo level**.

## Phát hiện then chốt — DATA CEILING = gần như RENDER-LÀ-XONG
| Thứ cần | Đã có? | Nguồn |
|---|---|---|
| Render xyflow theo level | ✅ ĐÃ CÓ | `MindMap/Canvas` dùng `@xyflow/react` (`^12.10.2`); BE `course-mind-map.service` build node/edge theo level course→module→lesson/concept (2 mode: authored concept-map keywords, hoặc derived module tree) |
| RAG trả content + flashcard + challenge + milestone | ✅ ĐÃ CÓ | BE `searchCourseContent(courseId, query, kinds?)` → `SearchCourseContentItem[]` {kind, title, breadcrumb, moduleId/contentId/flashcardDeckId/milestoneTaskId} — join tới Content/Challenge/**FlashcardDeck**/MilestoneTask; filter theo kind |
| FE hook gọi RAG | ✅ ĐÃ CÓ | `useQuerySearchCourseContentSwr` + `query-search-course-content.ts` |
| Block render kết quả (row + jump link per kind) | ✅ ĐÃ CÓ | `RelatedContentList` + `EntityResultRow` (đang dùng ở `ContentAiChat`, `LessonFlashcards`) |
| Drawer | ✅ block canon (`components/drawers/*`, HeroUI `Drawer`) |

→ **KHÔNG cần đổi schema, KHÔNG cần mở BE mới.** Feature ≈ thuần FE interaction: đổi `onNodeClick` để mở drawer chạy RAG theo `node.label`.

## Flow + shell
1 surface + 1 overlay:
- **Surface — Mind-map canvas** (job = explore graph) → **full-bleed canvas shell** (giữ nguyên): xyflow, leveled, pan/zoom.
- **Overlay — Node RAG Drawer** (right, HeroUI `Drawer`; mobile → full-screen). Mở khi click node keyword. Query = `node.label` (authored concept = keyword thật; derived = lesson/module title).

## Zones (drawer)
- **Header:** eyebrow "Liên quan tới keyword (RAG)" + node title + close.
- **Body:** kết quả RAG. **2 phương án bố cục (prototype cho bấm thử — cần thầy CHỐT):**
  - **A. Gộp theo loại** — 4 nhóm `LabeledCard subtleLabel` (Nội dung / Flashcard / Thử thách / Milestone), mỗi nhóm 1 `SurfaceListCard` rows. Dễ quét theo loại, MẤT thứ tự relevance toàn cục.
  - **B. Xếp theo độ liên quan** — 1 list phẳng best-match-first, mỗi row có `StatusChip` kind. Giữ đúng ranking RAG, loại lẫn lộn.

## State-matrix (drawer) + conversion lens
- **loading** → skeleton mirror rows (`Skeleton`).
- **results** → grouped/ranked rows; mỗi row = **jump link** (onward, không ngõ cụt) tới lesson/deck/challenge/milestone qua `pathConfig` theo kind.
- **empty** (keyword chưa index / không có gì liên quan) → `EmptyState` "chưa có phần liên quan" + **CTA "Khám phá module ↗"** (phễu vào học, không ngõ cụt).
- **error** → retry.

## Block briefs (element-aware, block THẬT)
| Block | Vai | Mới/Sửa |
|---|---|---|
| `MindMapNodeDrawer` (mới, `components/drawers/`) | vỏ drawer + gọi `useQuerySearchCourseContentSwr(courseId, node.label)` | **cần tạo** |
| `RelatedContentList` | render kết quả RAG (rows + jump link) | **SỬA**: hiện `RelatedContentList` cố tình "im lặng khi blank/loading/empty" (passive aid) → drawer cần STATE HIỆN RÕ (skeleton/empty/error). Thêm prop `variant="surface"` (hiện states) hoặc drawer tự bọc `AsyncContent`. + prop `grouped` nếu chọn phương án A. |
| `EntityResultRow` | 1 row kết quả (chip kind + breadcrumb + title + arrow) | dùng lại (có thể thêm score meta) |
| `StatusChip` | chip kind (Nội dung=info / Flashcard=accent / Thử thách=warning / Milestone=success) | dùng lại |
| `EmptyState` | drawer rỗng | dùng lại |
| `Canvas/onNodeClick` | mở drawer thay-vì/kèm zoom | **SỬA** |

## Quyết định (thầy "ok xúc" 2026-07-17 → chốt default)
1. **Bố cục drawer = A (gộp theo loại)** — 4 nhóm `LabeledCard subtleLabel` (Nội dung/Flashcard/Thử thách/Milestone); trong mỗi nhóm giữ thứ tự relevance RAG. (Khớp cách thầy liệt kê "phần/flashcard/challenges/milestone".)
2. **onNodeClick = mở drawer, KHÔNG zoom camera** (zoom lúc drawer che phải gây giật). Root node → giữ `fitView` như cũ (không drawer).
3. **Clickable = MỌI node trừ root** (concept/lesson/module/challenge/milestone) → drawer RAG theo label.
4. **Query RAG = `node.label`/title hiển thị** (concept map dùng title ngắn; không cần field riêng).

## Files to touch (cho apply)
- `src/components/drawers/MindMapNodeDrawer/index.tsx` (mới)
- `src/components/blocks/learn/RelatedContentList/index.tsx` (thêm variant states/grouped)
- `src/components/features/learn/MindMap/Canvas/index.tsx` (`onNodeClick` → mở drawer, giữ courseId)
- (khả năng) `src/components/features/learn/MindMap/StandaloneMindMap/index.tsx` — mount drawer + state node đang chọn
- i18n `mindMap.drawer.*` (title/nhóm/empty/cta)

## Verify plan (apply)
- tsc + eslint sạch.
- Runtime: mở `/courses/fullstack-mastery/learn/mind-map` → click node → drawer chạy RAG thật trả kết quả (BE :3001) → click row nhảy đúng lesson/deck/challenge/milestone. Empty state với keyword lạ.

## Data-ceiling map
- **render-là-xong:** toàn bộ drawer (RAG endpoint + hook + blocks đã có).
- **aggregate-BE:** không.
- **đổi-schema:** không.
