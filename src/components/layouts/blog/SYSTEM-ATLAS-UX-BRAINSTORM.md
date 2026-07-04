# System Atlas — UX Brainstorm (redesign trang `/blog` "Hệ thống StarCi, mổ xẻ")

> `/starci-fe-ux-brainstorm` · MAX effort · KHÔNG code. Thầy chốt hướng: **sidebar component thật + healthcheck ping
> liên tục (xanh=ngon/đỏ=bug) + cho user chạy curl để test.** Đây là pattern **status-page + API explorer + build-in-public**,
> KHÔNG còn là blog editorial. Legacy blog (text-first list) = content layer treo dưới mỗi node, KHÔNG vứt.

## 0. Sự thật grounded (đọc source — quyết định thiết kế, chặn fake)
- **Component list = THẬT** (`.docker/compose.yaml` + `src/modules/env/config.ts` + `apps/core/src/app.module.ts`).
- **Healthcheck "xanh/đỏ" per-node CHƯA tồn tại ở BE.** KHÔNG có `/health` thống nhất, KHÔNG có query per-dependency.
  - Cái DUY NHẤT live thật giờ: query GraphQL **`aiBalancerHealth`** (`features/.../system/ai-balancer-health`) → per-provider AI key (totalKeys/activeKeys/disabledKeys, keySuffix, status, failCount). Public, read-only, safe.
  - Docker healthcheck có cho **4/9** service (postgres `pg_isready`, redis `ping`, elasticsearch `_cluster/health`, minio `/minio/health/live`) — nhưng app/FE **không đọc được** (chỉ container-level).
- **Public endpoint an toàn cho curl = THẬT:** `POST /graphql` với query public: `platformStats`, `systemConfig`, `aiBalancerHealth`, `blogPosts`, `blogPost(slug)`, `publicContent(id)`. Read-only, no-auth, throttled. **CẤM expose:** mọi mutation, admin REST, payment webhook, auth callback.

### Nguyên tắc xanh/đỏ KHÔNG fake (chốt)
**Dot xanh/đỏ phải do 1 request THẬT chứng minh — chính cái curl user chạy LÀ cái probe.**
- Trang auto-ping **public `/graphql`** mỗi N giây bằng query thật:
  - `platformStats` đi xuyên **Client → API Gateway → Core API → Postgres** → có data ⇒ cả path đó **xanh**; lỗi ⇒ **đỏ**.
  - query search/suggestions chạm **Elasticsearch** ⇒ xanh/đỏ ES.
  - `aiBalancerHealth` ⇒ **AI Balancer** xanh/đỏ thật (per-provider).
- Node **không** probe được từ public (Redis · Kafka · NATS · Qdrant · Keycloak) ⇒ để **xám "unknown"** + nhãn *"cần `systemHealth`"*, **TUYỆT ĐỐI không tô xanh giả**. Mở xanh/đỏ thật cho nhóm này = **BE delta** (xem §5).

## 1. Danh sách component (sidebar) — grounded
| # | Component | Vai trò (thật) | Live status nguồn | Dot khả thi NGAY? |
|---|---|---|---|---|
| 1 | **Client** (web/mobile) | FE Next.js | self (trang đang chạy) | 🟢 hiển nhiên |
| 2 | **API Gateway** (graphql · ws) | Apollo `/graphql` + socket | ping `/graphql` | 🟢 (probe path) |
| 3 | **Core API** (nestjs) | business logic | `platformStats` trả data | 🟢 (probe path) |
| 4 | **Postgres** (source of truth) | TypeORM primary | `platformStats` đọc Postgres | 🟢 (probe path) |
| 5 | **Elasticsearch** | search content/course | query search public | 🟢 (probe path) |
| 6 | **AI Balancer** (multi-provider) | route OpenAI/Gemini + rotate key | `aiBalancerHealth` → `activeKeys` | 🟢 **live thật (key liveness)** |
| 7 | **Redis** | cache · queue · throttler · socket adapter | — | ⚪ cần `systemHealth` |
| 8 | **Kafka** (debezium · cdc) | event bus + CDC projection | — | ⚪ cần `systemHealth` |
| 9 | **NATS** (jetstream) | job-status streaming | — | ⚪ cần `systemHealth` |
| 10 | **Qdrant** (vectors · rag) | embeddings LangChain | — | ⚪ cần `systemHealth` |
| 11 | **Keycloak** (auth · oidc) | OIDC issuer + OAuth | — | ⚪ cần `systemHealth` |
| 12 | **MinIO / S3** (media) | CDN asset/cover | (HEAD bucket) | 🟡 gần (cần BE/proxy) |
| 13 | **Judge0** (code runner) | chấm coding submission | — | ⚪ optional (không trong compose) |

→ MVP **không-BE**: 6 node xanh/đỏ thật (1–6) + curl playground thật. Full board (7–13) = bật sau khi có `systemHealth`.

### Node KHÁI NIỆM vs container (thầy chốt 2026-06-28)
- **Map là bản đồ KHÁI NIỆM của hệ, KHÔNG phải 1:1 docker container.** 1 node = 1 **năng lực có nghĩa** của hệ thống, đặt riêng khi nó (a) đáng kể về mặt sản phẩm, và/hoặc (b) có **tín hiệu health độc lập**.
- **AI Balancer = node RIÊNG (first-class)** dù chạy **in-process trong Core API** (không phải container riêng). Lý do: nó có health độc lập = **key pool liveness**. Health rule: 🟢 `activeKeys > 0` (còn ≥1 key sống) · 🟡 có key bị disable nhưng còn sống · 🔴 `activeKeys === 0` (chết hết key). = thầy: *"key còn sống là còn xanh"*.
- Lưu ý trung thực: AI in-process → nếu **Core API** chết thì AI cũng không tới được; nhưng khi Core trả lời + `aiBalancerHealth` báo có key active ⇒ node AI **xanh**. Node AI đo **sức khỏe key**, không đo container.
- Hệ quả: AI thuộc nhóm **đã-live (1–6)**, KHÔNG cần `systemHealth`. MVP có sẵn dot xanh/đỏ thật cho AI.

## 2. Mục tiêu trang (≤30s)
Khách (recruiter / dev / học viên) thấy: **"StarCi chạy hệ thống production THẬT — và đây là nó, đang sống, bạn tự ping được."**
Đây là **flex build-in-public** mạnh nhất: không nói "chúng tôi dạy CQRS/Kafka", mà **cho sờ vào hệ thật**. Đồng thời là proof kỹ thuật cho tuyển dụng/bán khóa.

## 3. Ba hướng (đã vẽ widget) → CHỐT D1
- **D1 ✅ Live System Atlas:** sidebar component (dot live) → click node → map highlight + panel "mổ xẻ": vai trò + config (host/port từ compose, đã che secret) + ping live + **curl đã chứng minh nó** (Run → JSON thật + Copy-as-curl) + **bài deep-dive của node đó** (Kafka node → post "Kafka vs RabbitMQ"). Hợp nhất status-page + explorer + API playground + blog. Dùng HẾT tài sản sẵn (map R3F + sidebar + curl + 12 post). *Trade-off:* cần `systemHealth` cho node xám. Ref: GitHub status, Stripe "try it".
- **D2 Status board first:** bảng uptime gọn (row + dot + latency), curl trong expander, map thành strip mảnh. Nhanh nhất, "is it up?" rõ — nhưng phí cái map đẹp, ít chất "mổ xẻ". Ref: Instatus, BetterStack.
- **D3 API playground first:** console query (Run → JSON + copy curl) làm trung tâm, health + map thành side-strip. "Developer wow" cao, chứng minh API sống — nhưng status/map thành phụ, kém legible cho non-dev. Ref: Hoppscotch, GraphiQL.

**CHỐT D1** — là hướng DUY NHẤT fuse được: cái map thầy đã đầu tư (ArchitectureScene R3F) + 3 ask mới (sidebar list, ping xanh/đỏ, curl test) + 12 blog post (thành "lời mổ xẻ" treo dưới mỗi node) thành 1 artifact "hệ thật, đang sống, mổ xẻ được".

## 4. IA mới (D1)
- **Sidebar TRÁI** (`SystemComponentRail`): list 12–13 component (icon + tên + role 1 dòng + **dot live**). Group: *Edge* (Client/Gateway/Core) · *Data* (Postgres/Redis/ES/Qdrant) · *Async* (Kafka/NATS) · *Platform* (Keycloak/AI/MinIO/Judge0). Click → chọn node (URL `?node=postgres`). Mobile → chip-row cuộn ngang (pattern [[master-detail-rail-as-filter-and-mobile-chips]]).
- **MAIN:**
  1. **Header:** "Hệ thống StarCi, mổ xẻ" + overall status pill (xanh "tất cả đang chạy" / vàng "degraded" / đỏ) — consolidate theo màu cao nhất (Carbon rule).
  2. **Architecture map** (ArchitectureScene) — node đang chọn highlight; click node trên map ↔ sync sidebar. Map = chỉ mục không gian.
  3. **Node panel "mổ xẻ"** (đổi theo node chọn): vai trò + config thật (host/port che secret) + **live ping** (dot + latency + "cập nhật mỗi 5s") + **CurlTester** (query public probe node đó → Run → JSON thật + Copy-as-curl) + **deep-dive posts** của node (từ `blogPosts` lọc theo topic node).
- **Dưới cùng (giữ blog):** "Tất cả bài mổ xẻ" = list `blogPosts` (giữ PostRow text-first) cho ai muốn đọc tuần tự thay vì theo node.

## 5. Section → dữ liệu / BE delta
| Section | Nguồn THẬT giờ | Cần BE? |
|---|---|---|
| Sidebar component list | hardcode từ compose/architecture (FE constant, như `CATEGORY_FILTERS`) | KHÔNG |
| Dot node 1–6 | auto-ping `platformStats`/search/`aiBalancerHealth` (probe thật) | KHÔNG |
| Dot node 7–13 (Redis/Kafka/NATS/Qdrant/Keycloak/MinIO/Judge0) | — | **CÓ: query `systemHealth { services{ name,status,latencyMs } , overall }`** (poll mỗi dep parallel, timeout ngắn). Đây là delta chính. |
| CurlTester | `POST /graphql` public queries (real) | KHÔNG |
| Node → deep-dive posts | `blogPosts` + map **topic→node** (BE chưa có tag → FE constant curate, hoặc thêm field `topic`/`tag` per post) | KHÔNG (curate FE) hoặc delta nhỏ (tag field) |
| AI Balancer panel | `aiBalancerHealth` (live, đã có) | KHÔNG |

## 6. Empty/Loading/Error/A11y (tính từ đầu)
- **Ping pending:** dot **xám pulse** "đang kiểm tra…", KHÔNG mặc định xanh (tránh false-up).
- **Probe fail:** dot **đỏ** + tooltip lỗi thật (status/HTTP) + nút "thử lại" + curl để user tự reproduce.
- **Node xám "unknown":** nhãn rõ *"chưa có healthcheck — cần `systemHealth`"* (honest, không giả lập).
- **CurlTester error:** show GraphQL/HTTP error thật (đừng nuốt).
- **A11y (status indicator, ref Carbon/koruux):** dot phải kèm **≥2 trong {màu, hình, chữ}** — dùng **dot + nhãn text** ("up"/"down"/"unknown"), contrast ≥3:1, KHÔNG chỉ dựa màu (mù màu). Tối đa ~6 dot trong 1 nhóm trước khi gộp.
- **Rate-limit:** ping interval ≥5s + jitter; CurlTester có cooldown (throttler BE soft ~100qps nhưng đừng spam từ FE).

## 7. Cắt / Thêm / Đừng-vỡ
- **THÊM:** `SystemComponentRail` (sidebar) · `ArchitectureScene` (tái dùng, thêm selected-node + click sync) · `NodeDissectionPanel` · `CurlTester` (block) · `useSystemPing` (hook auto-probe public endpoints).
- **GIỮ:** `blogPosts`/`blogPost` + PostRow (thành content layer per-node + list cuối trang). Premium gate giữ.
- **Đừng-vỡ:** (1) **KHÔNG tô dot xanh khi chưa probe** — xám trước, xanh sau khi có data. (2) CurlTester **chỉ** whitelist 5–6 query public read-only; hardcode whitelist, KHÔNG cho gõ query tự do chạm mutation. (3) Map R3F nặng → lazy + `prefers-reduced-motion` fallback (ảnh tĩnh). (4) Secret trong config (password/token) **không** render — chỉ host/port/role.

## 8. Bước tiếp
Thầy chọn layout (D1/D2/D3) → `/starci-fe-ux-apply`. Khuyến nghị **MVP D1 không-BE** trước (6 node live + curl + map + posts), rồi BE thêm `systemHealth` để bật xanh/đỏ thật cho 7 node còn lại.

### Nguồn ground (ref)
- Status-indicator UX: Carbon Design System (status-indicator pattern — gộp theo màu cao nhất, ≥2 chỉ báo, ≤6 dot) · koruux "5 UX best practices for status indicators" · NN/g "indicators vs validations vs notifications".
- Status-page pattern: GitHub status, Instatus, BetterStack. API try-it: Stripe API ref, Hoppscotch/GraphiQL.
