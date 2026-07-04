# Draft — Bản đồ hệ thống = node KHÁI NIỆM (theo năng lực + health độc lập), KHÔNG 1:1 container (2026-06-28)

- File/§ đích khi `/merge`: `concepts/` (system/status visualization) hoặc `main.md` §14 + liên quan
  System-Atlas brainstorm (`layouts/blog/SYSTEM-ATLAS-UX-BRAINSTORM.md`).
- Bối cảnh: redesign trang "Hệ thống StarCi, mổ xẻ" thành live status atlas. Trò liệt kê node theo `docker-compose`
  → coi **AI Balancer** là sub-module của Core API (vì nó chạy in-process, không phải container riêng). Thầy:
  *"AI balancer thầy nằm trong core api, thầy muốn AI như component riêng của hệ thống (key còn sống là còn xanh)"*.

## Luật (STRICT)
- **Node trên bản đồ hệ thống/status = ĐƠN VỊ KHÁI NIỆM (năng lực có nghĩa), KHÔNG buộc map 1:1 docker container/process.**
  1 node tách riêng khi nó **(a)** đáng kể về mặt sản phẩm (người xem cần thấy nó là 1 thứ), HOẶC **(b)** có **tín hiệu
  health ĐỘC LẬP** đo được — kể cả khi nó chạy **in-process** bên trong service khác.
  - Vd: **AI Balancer** chạy in-process trong Core API (không phải container) nhưng vẫn là **node first-class** vì có
    health riêng = **key pool liveness** (`aiBalancerHealth.activeKeys`). Gộp nó vào "Core API" sẽ giấu mất một tín
    hiệu/đánh-đổi mà hệ thật sự có.
- **Dot xanh/đỏ của node map vào TÍN HIỆU THẬT của node đó, không phải trạng thái container:**
  - AI: 🟢 `activeKeys > 0` (còn ≥1 key sống) · 🟡 có key disable nhưng còn sống · 🔴 `activeKeys === 0` (chết hết key).
  - Node "đường dẫn" (Core/Gateway/Postgres): xanh khi 1 request public đi xuyên path đó trả data thật (probe), đỏ khi lỗi.
- **Trung thực về phụ thuộc ẩn:** node in-process phụ thuộc host của nó (AI chết theo nếu Core chết) → ghi rõ trong
  panel "mổ xẻ", nhưng dot vẫn đo tín hiệu RIÊNG của node (key), không đo host. Đừng để node khái niệm che giấu phụ thuộc.
- **CẤM tô xanh khi chưa có tín hiệu thật** (đã chốt ở brainstorm): node không probe được + chưa có health query → để
  **xám "unknown"**, không giả lập. (Cùng tinh thần [[no-generic-docs-site-patterns]]: đừng dựng affordance/giá-trị giả.)

## Nguyên tắc rút ra
- Khi vẽ "kiến trúc/hệ thống" cho người xem, hỏi **"đơn vị có NGHĨA + có tín hiệu đo được là gì?"** trước, rồi mới
  tới "nó chạy ở container nào". Tài nguyên hạ tầng (container) là chi tiết triển khai; node là **năng lực + sức khỏe**.
- Áp đầu: System Atlas — AI Balancer = node riêng (key-liveness health), thuộc nhóm đã-live không cần `systemHealth`.
