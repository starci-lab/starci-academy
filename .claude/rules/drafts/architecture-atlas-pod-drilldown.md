# Draft — Trang `/architecture` (System Atlas): POD chức năng + drill-down 2 tầng + roll-up trạng thái (pass→xanh / ≥75% fail→đỏ / còn lại→vàng) + logo THẬT + khu "Tương lai" Coming soon (2026-07-04)

- File/§ đích khi `/merge`: `concepts/` (system/status visualization) + nối tiếp
  [[system-map-conceptual-nodes-not-containers]] + brainstorm `src/components/layouts/blog/SYSTEM-ATLAS-UX-BRAINSTORM.md`.
- Bối cảnh: trang `/[locale]/architecture` ("Hệ thống StarCi, đang sống") — MVP đã dựng (sidebar 17 component + 1
  map 3D phẳng `ArchitectureScene` + poll `systemHealthStatus` live + curl tester). Thầy soi thấy **17 node nhồi 1
  mặt phẳng isometric bị ĐÈ NHAU** (keycloak đè redis, nhãn chồng). Chốt: **gom node thành POD chức năng + drill-down
  vào sub-scene 3D riêng cho từng pod**, và thêm khu "Tương lai — microservices" (Coming soon). Ghi rule để build sau
  đúng.

## Luật 1 (STRICT) — Overview = POD chức năng (mặc định), KHÔNG phải 17 node phẳng
- **Trang mặc định render OVERVIEW = ~8 POD chức năng xếp quanh 1 lõi `Core API` ở giữa**, KHÔNG dàn 17 node trên 1
  mặt phẳng (đè nhau, rối). Pod = **1 nhóm năng lực** (payment, auth, AI, data…), có **dot sức khoẻ GỘP** (§Luật 3).
- **Giữ nút "Xem toàn bộ"** = map phẳng 17 node hiện tại làm **god-view** cho power-user — nhưng pod-view là DEFAULT
  (nó làm overview thở ra: 8 pod thay vì 17 node).
- **Sidebar theo POD** (accordion: pod → thành viên), rail và map đồng bộ. Mobile → chip-row cuộn ngang
  ([[master-detail-rail-as-filter-and-mobile-chips]]).
- **Overview xếp pod QUANH Core ở giữa** → tự đọc ra "1 hệ thống", chống fragmentation (mỗi pod thành 1 hòn đảo rời).

## Luật 2 (STRICT) — Drill-down 2 TẦNG (dừng ở 2), sub-scene = lõi + thành viên + edge THẬT
- **Click pod → chuyển sang 1 SUB-SCENE 3D RIÊNG** (không phải highlight trên map cũ): vẽ **lõi nối gần nhất
  (thường là Core API) + các thành viên pod + edge thật**. Ví dụ chuẩn (thầy chốt): payment pod →
  `Core API ↔ {Stripe, PayPal, PayOS, SePay}` + **mũi tên webhook chạy NGƯỢC về** (SePay IPN, PayOS callback — payment
  thật là 2 chiều).
- **DỪNG ở 2 tầng** (overview pod → pod detail). KHÔNG tầng 3 (rối). "Bóc tách sâu" = làm sub-scene GIÀU CHI TIẾT thật,
  KHÔNG phải thêm cấp nav.
- **Sub-scene LUÔN vẽ kèm lõi Core** (không vẽ 4 payment lơ lửng) → giữ mạch "thuộc về 1 hệ".
- **Chuyển cảnh = semantic zoom** (lerp camera R3F từ vị trí pod ở overview bay vào sub-scene), gate
  `prefers-reduced-motion` → cắt cứng khi reduce.
- **State qua URL `?pod=payment`** (khớp `?node=` sẵn có) → deep-link/share. Breadcrumb "‹ Về toàn hệ thống".

### Nội dung sub-scene từng pod (grounded từ 17 component + edge thật)
| Pod | Lõi nối | Thành viên + edge cần vẽ |
|---|---|---|
| **Thanh toán** | Core API | Stripe · PayPal · PayOS · SePay + **webhook ngược** (IPN/callback) |
| **Xác thực** | Client/Gateway | Keycloak (OIDC issuer) → GitHub (OAuth IdP) |
| **AI** | Core API | aiBalancer → {OpenAI · Gemini · Claude} + Ollama (local) + Qdrant (RAG vectors) |
| **Dữ liệu + CDC** ⭐ | Core API | Postgres → Debezium → Kafka → Elasticsearch (CQRS read-model, chuỗi CDC — quân bài flex nhất) |
| **Sự kiện / job** | Core API · Postgres | Kafka (event bus) · NATS (jetstream job-status) |
| **Media** | Core API | MinIO/S3 (+ ffmpeg/DASH pipeline) |
| **Chấm code** | Core API | Judge0 (+ Redis/BullMQ queue) |
| **Thông báo** | Core API | Mail (Brevo SMTP) |
- (Có thể gộp "Sự kiện" vào "Dữ liệu + CDC" nếu thấy rối — thầy để 8 pod, cân nhắc khi dựng.)

## Luật 3 (STRICT) — Dot sức khoẻ của POD = ROLL-UP theo NGƯỠNG (thầy chốt 2026-07-04)
- **Pod dot gộp từ status THẬT của thành viên** (worst-of + ngưỡng), tính trên các member đã có status resolved:
  - **Tất cả `up` → XANH** (pass hết).
  - **`(down + unknown) / total ≥ 75% → ĐỎ** (fail 75%).
  - **Còn lại → VÀNG** (degraded/hỗn hợp).
  - `degraded` = không-`up` → kéo pod xuống VÀNG (không bao giờ xanh), chỉ góp vào ĐỎ khi lọt ngưỡng 75% cùng `down`.
- **Trước probe đầu tiên: cả overview XÁM "đang kiểm tra…"** (honesty — KHÔNG tô xanh giả, giữ luật
  [[system-map-conceptual-nodes-not-containers]]). Chỉ áp ngưỡng SAU khi có status thật.
- **A11y**: dot phải kèm **chữ** (up/down/degraded/checking), không chỉ màu. Ngưỡng đặt CONSTANT (`POD_RED_RATIO = 0.75`)
  dễ chỉnh.
- Đây là "consolidate theo severity" (Carbon status-indicator) nhưng dùng NGƯỠNG % thay vì thuần worst-of, để 1 provider
  payment lẻ chết không kéo cả pod thành đỏ ngay (→ vàng), chỉ đỏ khi ≥75% chết.

## Luật 4 — Logo THẬT (không icon generic Phosphor cho brand)
- **Node dùng LOGO BRAND thật nơi có**, fallback Phosphor nơi không — hybrid, đừng để chỗ xịn chỗ generic lệch nhau:
  - **`simple-icons` (SVG monochrome)**: Kafka · Redis · PostgreSQL · Elasticsearch · Stripe · PayPal · GitHub ·
    Keycloak · MinIO · NATS (đều có).
  - **SVG chính chủ / fallback Phosphor**: Judge0 · Ollama · PayOS · SePay · aiBalancer (in-process, không có logo →
    giữ Phosphor `CircuitryIcon`).
- **Render logo trong HTML label của node** (drei `Html`), KHÔNG extrude 3D (nhẹ + rõ). Logo đơn sắc → tint theo tone
  node; logo brand-màu (Stripe/PayPal/Postgres voi/Kafka) → giữ nguyên màu.
- **Pháp lý**: nominative use ("tôi tích hợp với X") — chuẩn cho trang marketing công khai. Không sửa logo Apache
  (Kafka/ES).

## Luật 5 (STRICT) — Khu "TƯƠNG LAI — microservices" = Coming soon, KHÔNG dot sống (honesty)
> Thầy: *"tương lai sẽ triển microservices, thêm phần future render các bức tranh microservices. Ghi comming soon."*
- **Toggle "Hiện tại" (thật, dot live) ⇄ "Tương lai" (roadmap)**.
- **Scene "Tương lai" = topology TỰ VẼ**: tách `Core API` (monolith hiện tại) thành các service dự kiến —
  `order-service · payment-service · ai-service · grading-service · media-service · notification-service` — nối qua
  event bus (Kafka/NATS). Đây là VISION, chưa chạy.
- **BẮT BUỘC honesty**: badge **"Coming soon"** rõ ràng · edge **nét đứt** · tone **ghost/mờ** · **KHÔNG health dot,
  KHÔNG "checking"** (nó không probe được vì chưa tồn tại). Đọc ra "đây là HƯỚNG ĐI", tuyệt đối không giả vờ đang chạy.
  Cùng luật no-fake-status của [[system-map-conceptual-nodes-not-containers]].
- **Đây là flex build-in-public**: "đây là cái tôi chạy HÔM NAY — đây là chỗ tôi SẼ tách." Khi thật sự triển
  microservices → chuyển service từ scene "Tương lai" sang "Hiện tại" + thêm probe thật (bỏ badge Coming soon).
- **Ghi lại để sau build**: topology tương lai + mapping monolith-module → future-service để lúc tách code biết vẽ lại.

## Nguyên tắc rút ra
- Bản đồ hệ thống LỚN → **gom theo NĂNG LỰC (pod) + drill-down 2 tầng** khi 1 mặt phẳng bắt đầu đè nhau (>~10 node).
  Overview = pod (thở), detail = sub-scene giàu (bóc tách sâu). Status gộp theo ngưỡng, không thuần worst-of.
- **Honesty xuyên suốt**: dot chỉ do probe thật (xám trước, màu sau); khu tương lai = Coming soon không dot. Grounded,
  không fake.

## Trạng thái
- MVP flat-map + poll live + curl: ĐÃ dựng (`src/components/features/architecture/*`, `ArchitectureScene` block).
- Pod grouping + drill-down + roll-up ngưỡng + logo thật + khu Tương lai: **CHỜ BUILD** (rule này là spec).
