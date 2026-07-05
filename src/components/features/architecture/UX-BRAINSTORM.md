# UX Brainstorm — Architecture page (`/architecture`) pod-detail & flow rendering

> Trigger: thầy hỏi 4 việc — (1) CPU/RAM instance được không, (2) mỗi instance 1 ô như landing, (3) nghiên cứu vẽ chuẩn luồng, (4) redesign trang pod. Screenshot: `?pod=data` — node "elasticsear[ch]" và "[C]ore API" bị cắt chữ, các box chồng lên nhau.

## 1. Hiện trạng (grounded — đọc source thật)

- **Route:** `src/app/[locale]/architecture/page.tsx` → `<Architecture/>` (`src/components/features/architecture/index.tsx`).
- **Diagram engine hiện tại = React Three Fiber / Three.js** (`blocks/marketing/ArchitectureScene`, isometric 3D boxes + `<Html>` label overlay + `<Line>` edges), KHÔNG phải `@xyflow/react` như landing (`KnowledgeGraph`) hay CSS-flow như `MicroservicesDiagram`. 3 scene: pod-overview (8 pod hex) · pod-detail (members của 1 pod + Core API) · flat "toàn bộ" · future roadmap.
- **Bug đang thấy:** ở pod-detail (`?pod=data` = postgres+kafka+elasticsearch+Core API), label bị cắt ("elasticsear", "ore API") và box chồng nhau. Nguyên nhân bản chất: **isometric 3D không phải công cụ đúng cho "luồng có hướng"** — góc nghiêng làm khó đặt nhãn dài + khó tính spacing tự động khi số node/cạnh thay đổi theo từng pod (data có 3 node hàng ngang + fan-in/out Core API; payment có 4 gateway + webhook-return) → mỗi pod cần layout khác nhau, code hiện tại không auto-layout được nên vỡ.
- **Data model đã ĐÚNG, chỉ RENDER sai:** mỗi component (`constants.ts`) có `name/icon/kind/mapSub/roleKey`; mỗi pod (`pods.ts`) có `members[]` + **`flow?: PodFlowEdge[]`** (cạnh có hướng, sẵn rồi) + `computePodStatus()` roll-up màu. Live health qua `systemHealthStatus` (poll 7s+jitter): `name/status/latencyMs/message/checkedAt` — **KHÔNG có field CPU/RAM nào**.

## 2. Câu hỏi 1 — CPU/RAM: KHÔNG khả dụng thật, và KHÔNG nên public

- Grep toàn repo: không có `dockerode`, không gọi `docker stats`, không mount `/var/run/docker.sock`, không có Prometheus/cAdvisor/Grafana. `.docker/compose.yaml` cũng không set `cpus:`/`mem_limit:` cho service nào → **không có cả một con số "budget" tĩnh để hiển thị**.
- Muốn có THẬT: phải tự dựng 1 endpoint mới (`docker stats --no-stream` shell-out hoặc `dockerode`) — rẻ (~50-200 dòng) nhưng **đây là dữ liệu vận hành nhạy cảm**. Rule sẵn có trong repo ([[engineering-blog-reframe-and-public-infra-showcase-no-prod-leak]]) nói thẳng: showcase công khai không được phơi trạng thái vận hành live (CPU/RAM thấp/cao = tín hiệu cho ai muốn tấn công lúc hệ yếu).
- **Đề xuất: KHÔNG thêm CPU/RAM vào trang này.** Trang đã trung thực bằng cách khác (status lấy từ chính request thật — đúng tinh thần "không có gì giả lập" mà không cần lộ tài nguyên). Nếu sau này thầy muốn xem CPU/RAM cho chính mình → làm 1 trang `/admin/status` riêng, sau auth, dùng đúng cơ chế "docker stats endpoint" — KHÔNG chung route với trang public này.

## 3. Câu hỏi 2 & 3 — mỗi instance 1 ô + vẽ luồng chuẩn

- **"1 ô/instance" = tile card**, đúng hướng, mirror `MicroservicesDiagram` (landing): icon + tên + `mapSub` (vai trò) + status pill (màu từ `statusVisual`) + latency (nếu có) — KHÔNG còn box 3D nghiêng dễ chồng chữ.
- **"Vẽ chuẩn luồng" = layered auto-layout có hướng, KHÔNG phải 3D isometric.** Nghiên cứu (React Flow docs + cộng đồng): với đồ thị có HƯỚNG/phân lớp (client → gateway → service → DB), chuẩn ngành là **Dagre** (layout nhanh, tối ưu cho hierarchical/tree — [React Flow: Dagre layout](https://reactflow.dev/examples/layout/dagre)), không phải d3-force (d3-force hợp cho mạng "cùng cấp" như `KnowledgeGraph`, không hợp cho pipeline có hướng). ELK.js mạnh hơn nhưng phức tạp hơn mức cần cho ≤6 node/pod.
- Repo đã có `@xyflow/react` làm dep (mind-map + `KnowledgeGraph`) — thêm `dagre` (~10kb) là đủ, **không cần lib WebGL mới** (đúng luật sẵn có [[marketing-graph-viz-xyflow-d3force-not-new-webgl-lib]]: graph 2D dùng xyflow, 3D chỉ dành cho 1 "wow-hero" duy nhất).
- **Data đã sẵn cho việc này:** `pod.flow` (`PodFlowEdge[]`) → feed thẳng vào Dagre để tính vị trí + vẽ mũi tên `<Handle>` nối tâm. Không cần BE mới.

## 4. Câu hỏi 4 — redesign trang pod: 3 hướng

| # | Hướng | Mô tả | Trade-off |
|---|---|---|---|
| **A** | Thay 3D toàn bộ | Mọi view (overview 8-pod, pod-detail, flat) đều 2D tile + dagre | Nhất quán tuyệt đối, dễ bảo trì (1 renderer) — nhưng **mất luôn "wow" 3D ở overview** (vốn là 1 flex kỹ thuật hợp lệ cho trang showcase, không phải vanity — theo [[interactive-showpiece-contain-dont-kill-flex]]) |
| **B** | Vá 3D | Giữ nguyên isometric, chỉ tăng spacing + auto-fit camera + cho pan/zoom | Rẻ nhất, giữ 100% wow — nhưng **không giải quyết triệt để** "luồng có hướng" (góc nghiêng + fan-edge vẫn khó đọc mũi tên khi pod đông node) |
| **C ⭐ (đề xuất)** | Hybrid theo TẦNG | **Overview** (8 pod-hex, ít node, mục đích là ấn tượng đầu tiên) → **GIỮ 3D** (chỉ fix bug spacing). **Pod-detail + "Xem toàn bộ"** (mục đích là ĐỌC chính xác 1 luồng cụ thể — đúng lúc thầy đang than phiền) → **chuyển 2D tile + dagre** | Đúng công cụ cho đúng mục đích: overview = trải nghiệm marketing (giữ 3D, đã có precedent "3D chỉ cho wow-hero"); drill-down = tác vụ đọc-hiểu chính xác (2D luôn thắng 3D cho việc này). Chi phí vừa phải — chỉ viết renderer 2D mới cho 2 trong 3 scene, không đụng scene overview đang ổn |

**Chốt đề xuất: Hướng C.** Vì: (1) đúng NGUYÊN NHÂN gốc — bug + độ khó đọc chỉ xảy ra ở pod-detail/flat (nhiều node + cạnh có hướng), overview 8-hex chưa ai than phiền; (2) tận dụng đúng data sẵn có (`pod.flow`) mà không cần BE mới; (3) tôn trọng cả 2 giá trị — showcase gây ấn tượng (3D) VÀ đọc-hiểu chính xác (2D dagre) — thay vì hy sinh 1 trong 2.

## 5. Bảng section → dữ liệu

| Khối UI | Nguồn dữ liệu | Field dùng |
|---|---|---|
| Tile 1 instance | `constants.ts` (`ArchitectureComponent`) | `name, icon, kind, mapSub, roleKey, blogSlug?` |
| Status pill trên tile | `useSystemHealthPoll()` → `systemHealthStatus` | `status, latencyMs, message, checkedAt` (giữ nguyên `statusVisual.tsx` map màu) |
| Mũi tên/luồng | `pods.ts` (`PodFlowEdge[]`) | `from, to, label?` → input cho Dagre |
| Roll-up màu pod (ở overview 3D) | `computePodStatus()` | không đổi |
| Breadcrumb / toggle Hiện tại-Tương lai / theo nhóm-toàn bộ | giữ nguyên, không đổi hành vi |

## 6. Empty / loading / error (không đổi hành vi, chỉ đổi khung render)

- Loading: skeleton tile (giữ chrome tile, xám mờ) thay vì "checking" 3D box.
- Poll lỗi mạng: `status: unknown` (đã có nhánh `statusVisual`) → tile màu xám + icon `WarningCircle`.
- Pod rỗng (0 members — không xảy ra với data hiện tại nhưng phòng hờ): fallback "chưa có thành phần".

## 7. Đã vẽ widget mockup 3 scenario cho thầy chọn (xem chat) — chưa code, chờ chốt hướng trước khi `/starci-fe-ux-apply`.
