# UX Brainstorm — Atlas: snap 1-node-1-ô + drill Core API thành modules (2026-07-04)

> `/starci-fe-ux-brainstorm` · MAX effort · KHÔNG code. Trang `/architecture` (System Atlas) đã dựng (sidebar +
> live dot + map R3F: pod overview / pod-detail / toàn-bộ / tương-lai + curl). Thầy chốt 2 hướng cần brainstorm:
> **(1)** mỗi instance/node phải nằm gọn trên ĐÚNG 1 ô của lưới isometric; **(2)** breakdown Core API thành các
> MODULE bên trong (drill vào Core như 1 "pod" của chính nó). Bỏ logo (giữ Phosphor).

## 0. Chẩn đoán "node không nằm 1-ô" (grounded từ code)
- Floor của `ArchitectureScene` là **lưới VUÔNG isometric**: node đặt ở **integer cell `[col,row]`** → tâm rơi đúng
  giữa 1 ô rhombus (`buildCentres`: `cell[0] * board.cell`). `buildLiveScene` (flat 17-node) đặt integer cells ⇒ mỗi
  node ĐÃ nằm 1 ô đúng.
- **Bug ở pod scenes:** `pod-scene.ts` + `pod-detail-scene.ts` đặt pod ở **toạ độ PHÂN SỐ** (`RING_D*cos(angle)`,
  `.toFixed(3)`) → tâm pod **rơi GIỮA các ô**, không snap → đó là cái thầy thấy "lệch, không nằm 1 ô". Core-detail
  payment cũng vậy (member + Core toạ độ lẻ).
- ⇒ **Fix gốc: snap MỌI node về integer cell.** Đây là điều kiện, không phải lựa chọn thẩm mỹ. Câu hỏi thiết kế còn
  lại: **lưới nào** (vuông vs tổ-ong) + **xếp pod ở ô nào** cho đẹp mà vẫn 1-node-1-ô.

## 1. Mục tiêu trang (≤30s) — không đổi
Khách (recruiter / dev / học viên) thấy: *"StarCi chạy hệ thật — đây là nó, đang sống, bạn tự ping được."* Hai hướng
này phục vụ mục tiêu đó rõ hơn: (1) sơ đồ **sạch, đọc được** (mỗi thứ 1 ô, không chồng lấn — như Cloudcraft/Arcentry);
(2) chứng minh **chiều SÂU kỹ thuật** — không chỉ "có Postgres/Kafka" mà "Core của tôi có 10 domain rõ ràng" (tiền đề
cho câu chuyện tách microservices ở tab Tương lai).

## 2. Ask (2) — Core API = C4 "Container", drill vào = "Component level" (grounded)
- **Mô hình chuẩn: C4 model** (Simon Brown). Core API là **Container** (1 đơn vị deploy = monolith THẬT hôm nay);
  drill vào Container → **Component diagram** = các **module/domain bên trong**. Đây đúng câu chuyện thầy muốn: Core
  là 1 khối, mở ra thấy các module. (Ref C4 "zoom như Google Maps: quốc gia → thành phố → toà nhà".)
- **Core = node DRILLABLE ở TÂM overview** (peer với 8 pod). Click Core → **Core-module scene** (các domain), song song
  với click pod → pod-detail (infra members). Vẫn **2 tầng** (overview → detail), Core chỉ là 1 loại detail khác.
- **Domain THẬT trong Core** (từ `src/modules/bussiness/` + GraphQL queries/mutations) — curate ~10 cái đáng kể nhất,
  mỗi cái nối tới infra nó dùng:

  | Module (domain) | Vai trò | Nối infra |
  |---|---|---|
  | **auth** (authentication) | đăng nhập, phiên, quyền | keycloak |
  | **user** | hồ sơ, follow | postgres |
  | **transactions** | thanh toán, đối soát | stripe · payos · sepay · paypal |
  | **coding** | luyện & chấm code | judge0 · redis |
  | **flashcard** | ôn tập SRS | postgres |
  | **progress** | tiến độ học, enroll | postgres · kafka (CDC) |
  | **discussion** | bình luận, reaction | postgres · socketio |
  | **ai-lab** | chấm AI, playground | aiBalancer · qdrant |
  | **league** | bảng xếp hạng | postgres · redis |
  | **notification** | thông báo, email | nats · mail |
  | *(còn: achievement · daily-quest · community/chat · jobs/headhunting · loyalty — gộp/ẩn bớt cho đọc được)* | | |

  → Core-detail vẽ **Core ở giữa/đỉnh + ~10 module trên các ô + dây tới infra liên quan**. Đây cũng là **bản đồ dẫn
  sang tab Tương lai**: mỗi module này chính là ứng viên 1 microservice (order/payment/ai/grading… ở scene tương lai).

## 3. Ask (1) — 3 HƯỚNG lưới (chọn 1)

### Hướng A ✅ (ĐỀ XUẤT) — Giữ lưới VUÔNG, snap tất cả về integer cell
- **Mọi node (pod, member, module, infra) đặt ở integer `[col,row]`** → 1 node = 1 ô rhombus, không bao giờ chồng.
  Pod overview xếp thành **cụm so-le (staggered) quanh Core** bằng integer cells (gợi tổ-ong mà vẫn 1-ô-mỗi-pod).
- **Ít churn nhất** (chỉ đổi toạ độ trong 3 scene builder về số nguyên + 1 helper layout), **một hệ lưới duy nhất** cho
  cả overview/detail/flat/tương-lai → nhất quán. Pod hex ngồi trên ô vuông vẫn đọc tốt (Cloudcraft trộn nhiều khối
  trên lưới ô vuông). **Ref:** Cloudcraft, Arcentry (isometric, snap-to-tile, 1 resource/ô).
- *Trade-off:* mất hình "bông hoa tổ-ong" hoàn hảo (hex trên ô vuông hơi lệch chất honeycomb) — nhưng đúng "1 ô 1 node".

### Hướng B — Lưới TỔ ONG (hex floor) cho overview
- Đổi **floor overview thành lưới lục giác**; mỗi hex pod = **đúng 1 hex cell** (tổ-ong thật, pod khít nhau). Detail/
  flat/tương-lai vẫn lưới vuông (component shapes ngồi ô vuông hợp hơn).
- **Đẹp & đúng "tổ ong" nhất** cho overview. *Trade-off:* thêm geometry (hex floor + axial→world coords), **2 hệ lưới**
  (overview hex / detail vuông) → phức tạp hơn. **Ref:** honeycomb dashboard (Weave Scope, hexagon status boards).

### Hướng C — Bỏ Core-blob, module là first-class (module map)
- Không còn node "Core" đơn khối; **luôn hiện ~10 module** như node chính, pod chỉ là nhãn nhóm. Gần "preview
  microservices" nhất. *Trade-off:* **mất câu chuyện trung thực "hôm nay = monolith"** (tab Tương lai đã lo phần
  microservices rồi) → lẫn lộn hiện tại/tương lai. **Không đề xuất.**

**CHỐT: A + drill Core (mục 2).** A sửa đúng ask (1) với ít rủi ro nhất, 1 hệ lưới, giữ trung thực monolith; Core-drill
sửa ask (2). B để dành như nâng cấp thị giác cho riêng overview nếu sau thầy muốn "tổ ong thật".

## 4. IA mới (sau 2 hướng)
- **Overview (present · theo nhóm):** lưới vuông, **Core DRILLABLE ở tâm** + 8 pod hex trên cụm ô so-le quanh Core
  (mỗi thứ 1 ô). Dây Core→pod.
- **Drill:** click **pod** → pod-detail (Core + infra members, 1-ô-mỗi-node); click **Core** → **Core-module scene**
  (Core + ~10 module + dây tới infra, 1-ô-mỗi-node). Breadcrumb "‹ Về toàn hệ thống" cho cả hai.
- **Toàn bộ / Tương lai:** giữ như hiện tại (đều snap integer cell).
- **Sidebar:** thêm mục **"Core API — N module"** (hoặc 1 nhóm) để rail cũng vào được Core-detail, đồng bộ URL
  (`?core=1` hoặc `?pod=core`).

## 5. Section → dữ liệu (grounded)
| Phần | Nguồn thật |
|---|---|
| 8 pod + roll-up | `pods.ts` (đã có) — infra members từ `constants.ts` (17 component `systemHealthStatus`) |
| Core modules | `src/modules/bussiness/*` + `features/api/core/graphql/{queries,mutations}/*` (curate ~10) |
| Dây module→infra | suy từ vai trò domain (transactions→gateways, coding→judge0, ai-lab→aiBalancer/qdrant…) — curated, không query |
| Dot sức khoẻ | `systemHealthStatus` (infra thật); **module KHÔNG có health riêng** → module node = neutral, KHÔNG dot (honesty — chỉ infra mới có probe thật) |

## 6. Cắt / Thêm / Đừng-vỡ
- **THÊM:** integer-snap layout helper (axial/staggered → integer cells); `core-detail-scene.ts` (Core→modules);
  Core node drillable + `?core`/`?pod=core`; rail mục Core.
- **Honesty (STRICT):** module node **KHÔNG có status dot** (Core modules không probe được riêng — chỉ Core-as-path).
  Đừng tô xanh giả cho module. Chỉ infra (17 component) mới mang dot thật.
- **ĐỪNG:** đừng để 2 hệ lưới nếu chọn A (nhất quán); đừng nhồi cả 17 domain (curate ~10, gộp phần lẻ) — quá nhiều ô =
  rối, phản mục tiêu "đọc trong 30s".

## Ask (3) — pod-detail = LUỒNG THẬT có hướng, KHÔNG fan-out Core→member (thầy chốt 2026-07-04)
- **Bug hiện tại:** `buildPodDetailScene` nối generic **Core → từng member** (3 nhánh rời vào Core). SAI. Thầy:
  *"đâu phải nối 3 cái vô main — phải có pg nối cdc chứ"*.
- **Luật:** mỗi pod-detail vẽ **topology THẬT có hướng** (authored per-pod), node xếp theo HÌNH luồng (**chuỗi** vs
  **quạt**). Được phép **"mượn" node của pod khác** để vẽ đúng luồng (vd data-pod hiện cả Kafka lẫn ES; coding-pod
  hiện Redis) — pod là khái niệm, detail cần node nào để luồng đúng thì hiện.
- **Luồng thật từng pod (grounded):**

  | Pod | Luồng (có hướng) | Hình |
  |---|---|---|
  | **Dữ liệu + CDC** | `Core → Postgres` (ghi) `→ Kafka` (Debezium CDC) `→ Elasticsearch` (read-model); Core ⇠ ES (đọc, mờ) | CHUỖI |
  | **Thanh toán** | `Core → {Stripe·PayPal·PayOS·SePay}` + `gateway → Core` (webhook/IPN ngược) | QUẠT + về |
  | **AI** | `Core → aiBalancer → Ollama` (local); `Core → Qdrant` (RAG); aiBalancer → cloud providers | CÂY |
  | **Xác thực** | `Core → Keycloak → GitHub` (OAuth IdP federation) | CHUỖI |
  | **Sự kiện** | `Core → NATS` (job status); `Postgres → Kafka` (CDC) — cân nhắc GỘP vào Dữ liệu | QUẠT |
  | **Media** | `Core → MinIO` | ĐƠN |
  | **Chấm code** | `Core → Redis` (BullMQ queue) `→ Judge0` | CHUỖI |
  | **Thông báo** | `Core → NATS` · `Core → Mail` (Brevo) | QUẠT |

- **Layout theo hình luồng:** CHUỖI → xếp node stepwise (chéo/ngang) để mũi tên đọc tuần tự; QUẠT → Core giữa + member
  quanh. Edge mang **semantic** (`flow` = đồng bộ, `eventual` dashed = CDC/async, webhook = mũi tên ngược). → sửa
  `pods.ts` (thêm `flow: edges[]` per pod) + `buildPodDetailScene` (đọc flow + layout theo hình, snap integer cell).

## Refs
- Isometric, snap-to-tile (1 resource/ô): [Cloudcraft](https://www.cloudcraft.co/) · [Arcentry (Azure)](https://arcentry.com/for/azure/).
- Core→modules zoom: **C4 model** — [levels of abstraction](https://www.baeldung.com/cs/c4-model-abstraction-levels) · [container→component, monolith → modules](https://visual-c4.com/blog/what-is-c4-model-complete-guide) (monolith = 1 Container ở L2, mở ra module ở L3 "Component").
- Nội bộ: [[system-map-conceptual-nodes-not-containers]] · [[architecture-atlas-pod-drilldown]] · `layouts/blog/SYSTEM-ATLAS-UX-BRAINSTORM.md`.
