# Proposal — Sơ đồ tư duy KHÁI NIỆM cho khóa (author vào `.mount`)

> Mind-map = cây **keyword/khái niệm** của domain (không theo module). 1 keyword cắt ngang nhiều nguồn (lesson · flashcard · interview · milestone). Click keyword → nhảy tới surface dạy/ôn/thi nó. Render bằng **React Flow** (auto-layout, robust — bỏ serpentine chế). Data = **authored `.mount`**.

## 1. Vị trí file
`.mount/data/courses/<course>/mind-map.json` — **1 file/khóa**, cấu trúc + label song ngữ inline (author 1 lần, không lệch vi/en như 2 file rời).

## 2. Schema
```jsonc
{
  "root": { "vi": "Kỹ sư Fullstack", "en": "Fullstack Engineering" },
  "children": [ /* Node[] — cây lồng nhau */ ]
}

// Node:
{
  "id": "db-caching",                         // slug ổn định, unique trong khóa (key + anchor)
  "label": { "vi": "…", "en": "…" },          // KEYWORD hiển thị trên node
  "desc":  { "vi": "…", "en": "…" },           // (optional) chú thích 1 dòng, hiện ở tooltip/popover
  "links": [ /* Link[] — 0..N surface dạy/ôn/thi khái niệm này */ ],
  "children": [ /* Node[] — khái niệm con */ ]
}

// Link — ref bằng SLUG (.mount displayId); BE resolve slug → routable id + href:
{ "kind": "lesson",    "module": "1-database-integration-and-caching", "ref": "3-caching-with-redis" }
{ "kind": "challenge", "module": "1-database-integration-and-caching", "ref": "<challenge-slug>" }
{ "kind": "milestone", "ref": "11-caching-with-redis" }        // → personal-project
{ "kind": "flashcard", "ref": "0-module-1" }                    // → deck
{ "kind": "interview", "ref": "1-database-integration-and-caching" }  // → mock-interview bank
```
**Quy ước:**
- Node **0 link** = khái niệm gom nhóm (chỉ để phân cấp) → click = expand/collapse.
- Node **1 link** → click nhảy thẳng. **N link** → popover nhỏ: "📖 Học ở… · 🃏 Ôn ở… · 🎤 Thi ở… · 🏗️ Làm ở…".
- `lesson`/`challenge` cần `module` (slug) để resolve route; `milestone`/`flashcard`/`interview` chỉ cần `ref` (course-level).
- Cây lồng nhau (v1, dễ author + render). Quan hệ chéo (concept A "see-also" B) = **phase 2** (thêm `"see": ["id"]`).

## 3. MẪU THẬT — cắt từ `0-fullstack-mastery` (ref đều tồn tại)
```jsonc
{
  "root": { "vi": "Kỹ sư Fullstack", "en": "Fullstack Engineering" },
  "children": [
    {
      "id": "backend-core",
      "label": { "vi": "Lõi backend & vòng đời request", "en": "Backend core & request lifecycle" },
      "children": [
        { "id": "framework", "label": { "vi": "Framework & vòng đời request", "en": "Framework & request lifecycle" },
          "links": [
            { "kind": "lesson", "module": "0-nestjs-core-and-request-lifecycle", "ref": "1-request-response-lifecycle" },
            { "kind": "flashcard", "ref": "0-module-1" },
            { "kind": "interview", "ref": "0-framework-foundation" } ] },
        { "id": "config", "label": { "vi": "Cấu hình đa môi trường", "en": "Multi-environment config" },
          "links": [ { "kind": "lesson", "module": "0-nestjs-core-and-request-lifecycle", "ref": "2-multi-environment-configuration" } ] },
        { "id": "logging", "label": { "vi": "Logging production", "en": "Production logging" },
          "links": [
            { "kind": "lesson", "module": "0-nestjs-core-and-request-lifecycle", "ref": "3-production-grade-logging" },
            { "kind": "interview", "ref": "16-observability-logs-tracing-errors" } ] },
        { "id": "error-shape", "label": { "vi": "Xử lý lỗi & định dạng response", "en": "Error handling & response shaping" },
          "links": [ { "kind": "lesson", "module": "0-nestjs-core-and-request-lifecycle", "ref": "4-error-handling-and-response-shaping" } ] }
      ]
    },
    {
      "id": "data-layer",
      "label": { "vi": "Tầng dữ liệu & Caching", "en": "Data layer & caching" },
      "children": [
        { "id": "sql-vs-nosql", "label": { "vi": "SQL vs NoSQL", "en": "SQL vs NoSQL" },
          "links": [ { "kind": "lesson", "module": "1-database-integration-and-caching", "ref": "0-sql-vs-nosql-in-nestjs" } ] },
        { "id": "typeorm-pg", "label": { "vi": "TypeORM + PostgreSQL", "en": "TypeORM + PostgreSQL" },
          "links": [ { "kind": "lesson", "module": "1-database-integration-and-caching", "ref": "1-typeorm-and-postgresql" } ] },
        { "id": "indexing", "label": { "vi": "Indexing & tối ưu truy vấn", "en": "Indexing & query optimization" },
          "desc": { "vi": "B-tree, covering index, EXPLAIN", "en": "B-tree, covering index, EXPLAIN" },
          "links": [
            { "kind": "milestone", "ref": "10-database-indexing-and-query-optimization" },
            { "kind": "interview", "ref": "1-database-integration-and-caching" } ] },
        { "id": "caching", "label": { "vi": "Caching với Redis", "en": "Caching with Redis" },
          "links": [
            { "kind": "lesson", "module": "1-database-integration-and-caching", "ref": "3-caching-with-redis" },
            { "kind": "milestone", "ref": "11-caching-with-redis" },
            { "kind": "interview", "ref": "1-database-integration-and-caching" } ] }
      ]
    },
    {
      "id": "security",
      "label": { "vi": "Bảo mật đầu-cuối", "en": "End-to-end security" },
      "links": [
        { "kind": "milestone", "ref": "17-security-hardening" },
        { "kind": "interview", "ref": "17-security-end-to-end" } ]
    }
  ]
}
```
→ 3 nhánh · ~10 keyword · link tới **lesson · flashcard · interview · milestone** đều là slug THẬT trong khóa.

## 4. Render (FE) + resolve (BE)
- **BE**: `courseMindMap` (đã có, đang build từ module) → **đổi nguồn**: đọc `.mount/.../mind-map.json` (mirror pattern content-read-from-MinIO), resolve mỗi `link.ref` (slug) → routable id + href sẵn (lesson→`learn.module.content`, milestone→`personalProject`, flashcard→deck route, interview→bank route). Trả `{ nodes, edges, links }`.
- **FE**: React Flow + auto-layout (dagre dọc/radial) — node = keyword, click 1-link→push, N-link→popover. Bỏ `SerpentineTrack` chế. (Progress overlay "concept đã chín" = phase 2: chín nếu lesson đã đọc + flashcard mastered.)

## 5. Authoring (crux) — bán tự động rồi curate
Không hand 100% (chậm). Đề xuất skill `starci-mindmap-generate`: RAG/LLM quét lesson+flashcard+interview+milestone của khóa → đề xuất keyword + link ứng viên (theo `# moduleRefs`/nội dung) → thầy CURATE/sửa → ghi `.mount/mind-map.json`. Giống bộ `starci-*-generate` sẵn có.

## 6. Câu hỏi mở cho thầy (chốt schema trước khi build)
1. **Node không-link** (chỉ gom nhóm) — cho phép chứ? (đề xuất: có).
2. **Link kinds** đủ chưa: lesson · challenge · milestone · flashcard · interview — thêm `playground`/`foundation` không?
3. **Interview/challenge ref tới câu cụ thể** (`bank#q7`) hay chỉ tới bank/lesson là đủ? (đề xuất v1: tới bank/lesson).
4. **Cây thuần** (v1) hay cần **quan hệ chéo** (DAG, `see-also`) ngay? (đề xuất: cây trước, chéo phase 2).
5. **Bán-tự-động** author OK chứ, hay thầy muốn hand-author mẫu đầu?
