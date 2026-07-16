# Concept — Landing

> 📝 **Draft do agent gom từ `features/landing` + `product/` — thầy sửa lại định hướng/giọng.**

- **Ý đồ (why)**: cửa công khai của StarCi. Biến khách LẠ (chưa tin) thành người chịu xem khóa /
  đăng ký — bằng cách để họ **tự kiểm chứng** thay vì nghe tuyên bố. Sản phẩm cần landing vừa
  thuyết phục vừa TRUNG THỰC (không bán bằng phồng số).
- **Người dùng + khoảnh khắc**: người mới nghe tới StarCi, đang hoài nghi "lại một khóa học nữa?".
  Tâm thế thủ, cần lý do tin trong vài nhịp cuộn đầu.
- **Kết quả mong muốn**: cuộn hết → hiểu StarCi khác ở đâu (chiều sâu kiến thức + interview-first)
  → bấm vào 1 khóa THẬT. Outcome dẫn đầu = **vào xem khóa**, không phải "đăng ký ngay".
- **Nguyên tắc áp**:
  - Trung thực tuyệt đối — số liệu là proof THẬT (query platformStats), không hard-code phồng.
    Cảnh giác fallback che số thấp → lệch [[fair-monetization-axiom]].
  - Authority = tự-xác-thực (byline founder có link GitHub/LinkedIn để "đi mà kiểm"), không hô khẩu hiệu.
  - Premium = enrollment, không VIP-hoá [[premium-gate-is-enrollment-not-vip]].
- **Hướng phát triển / muốn thành gì**: 1 đích chuyển đổi duy nhất (`#courses`) lặp nhất quán; dramatize
  chiều sâu bằng dữ kiện tương tác thật (knowledge-graph), không bằng animation rỗng; mỗi "beat"
  phải neo 1 cơ chế thật, cắt beat nào chỉ để cho dài.
- **Ràng buộc / KHÔNG làm**: cấm số ma / fake scarcity / social-proof bịa; không nhồi CTA phân tán
  nhiều đích; không hứa nghề nghiệp sáo rỗng.
- **Neo**: `features/landing` (shell/CTA/psych hiện trạng) · Storybook: `Landing/*` stories.
