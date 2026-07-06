# Layout Brainstorm — Architecture Atlas v2: bỏ pod + bỏ 3D · 1 BOARD phẳng · Core API → modules (2026-07-06)

> `/starci-fe-layout-brainstorm` · MAX effort · KHÔNG code. Trang `/architecture` ("Hệ thống StarCi, đang sống").
> Thầy: *"nhìn xấu + rối"* + chốt 3 hướng: **(1) bỏ pod · (2) render tất cả element trên 1 BLOCK LỚN · (3) bỏ Core
> API → tách thành từng module trong features.** Đây là ĐẢO hướng so với brainstorm 2026-07-04 (giữ pod + snap 3D):
> giờ **bỏ hẳn 3D isometric + pod grouping** (chính là cái "xấu rối" — card isometric chồng lấn), về 1 board phẳng.

## 0. Chẩn (soi trang thật :3000)
- Hiện tại: shell docs-style = **rail trái** (list 17 component + live dot) + **map 3D R3F** (pod overview isometric,
  8 pod hex quanh 1 node "Core API" ở tâm) + `[Hiện tại|Tương lai]` + `[Xem theo nhóm]` + NodeDissectionPanel + CurlTester.
- **Xấu/rối = map 3D isometric:** các card pod ("Media/Chấm code/Thông báo/Sự kiện/Core API/Thanh toán/Dữ liệu+CDC/
  AI/Xác thực") chồng lấn, chữ nhỏ, khó đọc trong 30s. + rail LẶP list với map (2 chỗ cùng danh sách component).
- **Grounded BE (agent):** `systemHealthStatus` probe **17 hạ tầng/external THÔI** (postgres·redis·kafka·nats·minio·
  qdrant·elasticsearch·keycloak·judge0·ollama·mail·aiBalancer + github·stripe·paypal·payos·sepay) — **KHÔNG probe
  feature module nào**. ⇒ module KHÔNG có health signal → tile module = **neutral, KHÔNG dot** (honesty, đừng tô xanh giả).

## 1. Quyết định layout (CHỐT 2026-07-06 — GIỮ 3D flex, 1 TẦNG phẳng, contain + snap, bỏ pod)
> Thầy: *"có 3d dc không, để flex"* → *"xúc 3d 1 tầng"*. → **GIỮ map 3D isometric** (flex chính đáng — [[interactive-showpiece-contain-dont-kill-flex]]:
> showpiece 3D trên trang bán "chất lượng kỹ thuật" = flex, KHÔNG vanity). Cái "xấu rối" KHÔNG phải 3D mà là **CHAOS
> của pod-scenes**.

- **Gốc "xấu rối" (soi code):** `pod-scene.ts`/`pod-detail-scene.ts` đặt node ở toạ độ **PHÂN SỐ** (`RING_D*cos`) → tâm
  rơi GIỮA ô → **chồng lấn**. Còn `buildLiveScene` (bản phẳng 17-node) **đã snap 1-node-1-ô SẠCH**. ⇒ fix = **contain
  + nắn về grid sạch**, KHÔNG giết 3D.
- **CHỐT:** GIỮ board 3D isometric, render **1 TẦNG PHẲNG** — **MỌI element** (17 infra/external + ~10 module) snap
  **đúng 1 ô** trên **cùng 1 lưới**, bounded trong 1 khung (contain). = "1 block lớn" đúng nghĩa (tất cả trên 1 board).
- **BỎ pod** = xoá hẳn pod-scene/pod-detail-scene/`pods.ts`/toggle "Xem theo nhóm"/`useArchitecturePod`. Nhóm bằng
  **vùng SÀN có nhãn** trên board (Hạ tầng StarCi · Dịch vụ ngoài · Ứng dụng), KHÔNG cụm pod scatter.
- **Core API → modules**: thêm ~10 tile module lên **cùng board 3D phẳng** đó (Core tách ra). Module = tile **neutral,
  KHÔNG dot** (không probe được — honesty). Chỉ 17 infra/external mang dot live.
- **KHÔNG drill 2 tầng** (thầy chốt "1 tầng"): tất cả hiện ngay trên 1 board, không click-Core-mở-scene-con.
- **Rail GIỮ** (khác Hướng-bỏ-rail): list navigator bổ trợ 3D + a11y — bấm rail row → highlight node trên board 3D;
  thêm nhóm "Ứng dụng · N module" vào rail. 3D lo flex, rail lo chọn-nhanh + screen-reader.
- **Vì sao 1 tầng phẳng + snap:** đọc được ≤30s (mọi thứ 1 ô, không chồng) MÀ vẫn giữ wow-3D. Ref: Cloudcraft/Arcentry
  (isometric snap-to-tile, 1 resource/ô, contained). Đổi so với brainstorm 2026-07-04 (giữ pod + drill Core): giờ
  **bỏ pod + 1 tầng phẳng + Core-là-module-first-class** (gần "Hướng C" cũ nhưng vẫn 3D + vẫn trung thực monolith qua
  vùng-sàn "Ứng dụng" = các module CỦA 1 Core, không phải service rời — bản service rời để ở tab Tương lai).

## 2. Khung màn (shell) + thứ tự vùng (WHY)
**Shell = GIỮ docs-style rail trái** (list navigator, bổ trợ board 3D) + cột content. Rail: 3 nhóm — Hạ tầng · Ngoài ·
**Ứng dụng (module)** — bấm row → highlight node trên board. Cột content các vùng dọc:
| # | Vùng | Ở đâu | Vai | Vì sao chỗ này |
|---|---|---|---|---|
| 1 | **PageHeader** | trên cùng cột content `mx-auto max-w-5xl` | breadcrumb + title + subtitle + actions | identity trước (F-pattern) |
| — | actions: `[Xem source ↗]` tertiary · **`[Vào khóa học →]` PRIMARY accent** | góc phải header | **CTA-khóa (phễu) #1** | 1 primary action/màn = vào khóa |
| 2 | **`[Hiện tại · Tương lai]`** TabsCard underline | dưới header | đổi view (present board / future microservices) | nav đổi-nội-dung = underline ([[single-select-among-options-use-tabs]]); **bỏ "Xem theo nhóm"** (pod) |
| 3 | **★ THE BOARD (1 block)** `bg-surface rounded-3xl border p-6` | hero, dưới toggle | **1 primary object** | hệ thống LÀ nội dung chính |
| 4 | **NodeDissectionPanel** | dưới board | detail element đang chọn | select-then-detail |
| 5 | **CurlTester** `LabeledCard` | dưới panel | bằng chứng "đang sống" | proof sau khi thấy hệ |
| 6 | **★ Course-CTA band** `bg-accent/10 rounded-3xl` | đáy | **CTA-khóa (phễu) #2** | đóng vòng: "hệ thật này = thứ bạn sẽ học dựng → Vào khóa học" |

## 3. THE BOARD — 3 lớp, tile, không pod
- **§ Ứng dụng · N module** (feature module, **KHÔNG dot** — neutral): curate ~10 domain nhận-diện-được từ BE thật
  (`src/modules/bussiness/*` + graphql): **Xác thực · Học tập (content/course/module) · Chấm code (challenge/coding) ·
  AI (ai-lab/rag) · Thanh toán (checkout/membership/installment) · Cộng đồng (discussion/chat) · Nghề nghiệp (cv/job/
  interview) · Thông báo · Xếp hạng (league/reward/achievement) · Media**. Đây là "Core API tách ra" (C4: Container →
  Component). Mỗi module = tile: icon + tên + sub 1 dòng.
- **§ Hạ tầng StarCi · 12** (own infra, **LIVE dot**): postgres redis kafka nats minio qdrant elasticsearch keycloak
  judge0 ollama mail aiBalancer. Tile: icon + tên + mono sub + chip status (dot + text).
- **§ Dịch vụ ngoài · 5** (external, **LIVE dot**): github stripe paypal payos sepay.
- **Grid** `auto-fit minmax(~150px,1fr)` → wrap sạch, responsive (mobile 2 cột · desktop nhiều cột). Board tự lo, KHÔNG rail.
- **Chọn tile → highlight + (module) DIM board chỉ chừa infra module đó dùng** (module→infra usage map curated) → kể
  chuyện "kiến trúc" (module nào chạy trên infra nào) mà KHÔNG cần dây 3D. Chọn infra → highlight module dùng nó.

## 4. Ma trận STATE (board luôn render — structure là giá trị)
| State | Board | Dot | Phễu-khóa |
|---|---|---|---|
| **loading** (poll đầu, chưa data) | render đủ (structure có giá trị) | infra dot = "checking…" xám pulse; module neutral | CTA-khóa (header + band) vẫn hiện |
| **healthy** (all up) | đủ | infra dot xanh; module neutral | ↑ |
| **degraded** (vài down) | đủ, vẫn đọc được | tile lỗi dot đỏ/vàng + chip; header §infra roll-up "11/12 up" | ↑ |
| **fetch error** (no cache) | **vẫn render** (không giấu) | note nhỏ trên board "Không lấy được trạng thái · [Thử lại]"; dot = "unknown" | ↑ |
| **overflow (N tile)** | ~34 tile cố định → grid wrap, KHÔNG phân trang | — | ↑ |
| **"empty"** | trang KHÔNG bao giờ rỗng data (structure tĩnh) → **phễu = course-CTA band** (luôn hiện) = lời mời "học để dựng hệ này" | — | band accent đáy |
| **Tương lai tab** | board morph → bản microservices (module tách thành service riêng) — view nhẹ, cùng funnel | infra dot vẫn live | ↑ |

## 5. Cắt / Giữ / Thêm
- **CẮT:** `pod-scene.ts` · `pod-detail-scene.ts` · `pods.ts` (pod grouping + roll-up) · toggle "Xem theo nhóm" ·
  `useArchitecturePod` · (cân nhắc `core-detail-scene.ts` — không drill nữa). **KHÔNG cắt 3D**, KHÔNG cắt rail.
- **GIỮ 3D + tái dùng:** `ArchitectureMap` (R3F) + `ArchitectureScene` — nhưng đổi scene builder về **1 tầng phẳng
  snapped** (mở rộng `buildLiveScene`: thêm ~10 module node + zone-nhãn sàn, KHÔNG pod). `constants.ts` (17 component) ·
  `useSystemHealthPoll` · `useArchitectureNode` (`?node=`) · `NodeDissectionPanel` · `CurlTester` · `statusVisual` ·
  `MetricsInline` · `ArchitectureRail` (+ nhóm module) · `ArchitectureMobileNav` (+ module chips) · PageHeader.
- **THÊM:** `modules.ts` (curate ~10 feature module + `usesInfra: string[]` cho highlight + role blurb) · scene builder
  1-tầng-phẳng gộp infra+external+module snap integer cell theo 3 zone sàn · course-CTA band + i18n · rail nhóm "Ứng dụng".
- **Honesty (STRICT):** module tile/node KHÔNG dot (không probe được). Chỉ 17 infra/external mang dot thật.
- **Tương lai tab:** GIỮ (bản microservices — module tách thành service rời) = nơi kể chuyện "hôm nay monolith → mai tách".

## 6. Refs
- Software/service catalog phẳng: [Backstage catalog](https://backstage.io/docs/features/software-catalog/) ·
  [statuspage component list](https://support.atlassian.com/statuspage/docs/create-and-manage-components/).
- Core API → modules (Container→Component): [C4 model](https://c4model.com/).
- Nội bộ: [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]] · [[when-rail]] (default no-rail) ·
  [[single-select-among-options-use-tabs]] · [[concepts/card]] · `system-map-conceptual-nodes-not-containers`.
