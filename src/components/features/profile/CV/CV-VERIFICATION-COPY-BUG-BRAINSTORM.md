# CV scorecard — "xác minh" vs "liên hệ NTD" bị gộp làm 1 (2026-07-05)

> `/starci-fe-ux-brainstorm`. KHÔNG code ở bước này. Grounded từ code thật (`CvWorkspace`, `CvScorecard`) + BE
> commit `04e403dc` (`CvVerificationLevel`). Layout tổng (header → recruiter-line → dial → tabs) đã qua 9-10 vòng
> brainstorm trước (`UX-BRAINSTORM-V3-LAYOUT.md`) — KHÔNG đá lại quyết định đó. Chỉ sửa đúng phần thầy chỉ ra.

## Root cause — đây là BUG COPY, không chỉ dài dòng
`CvScorecard/index.tsx`:
- L152–153: `unlocked = score !== null && score >= CV_SCORE_UNLOCK_THRESHOLD` — **không hề đọc `source`**.
- L216–218 (comment của chính code): *"an uploaded CV can unlock it too, which is exactly why the demand-bridge
  callout nudges toward a generated (verified) one instead"*.
- BE commit `04e403dc`: `CvVerificationLevel` là **thang xếp hạng marketplace** (self_reported/activity_backed/
  capstone_verified) — *"does NOT touch the CV-score contact gate"*.

**Nhưng copy đang hiện đang NÓI NGƯỢC LẠI:**
- Chip: `cv.scorecard.sourceUploaded` = **"Chưa xác minh · không tính điểm"**.
- Banner: `cv.scorecard.sourceUploadedHint` = *"CV tải lên chưa được đối chiếu với thành tích thật trên StarCi, nên
  **không tính vào điểm sẵn sàng đi làm hay mở khoá nhà tuyển dụng**."*

→ Cả 2 câu đều khẳng định "chưa xác minh = không tính điểm/không mở khoá liên hệ" — **SAI so với chính hệ thống
đang chạy**. Đây chính là ý thầy: *"không xác minh liên hệ chi"* — xác minh (verification/trust-tier) và liên hệ
NTD (score gate) là **2 trục độc lập**, nhưng UI đang kể như 1 câu chuyện, khiến người đọc (và chính người review)
thấy vô lý.

## Vì sao nguy hiểm hơn "chỉ dài dòng"
Nếu để nguyên, học viên **hiểu sai**: "CV tải lên vô nghĩa, đừng dùng" — trong khi thực tế **CV tải lên VẪN tính
điểm + VẪN mở khoá liên hệ NTD nếu đủ ngưỡng** (chính CvWorkspace đã tính `bestScore` không phân biệt nguồn).
Copy sai lệch kỳ vọng → học viên có thể bỏ lỡ cơ hội liên hệ NTD dù đã đủ điểm, chỉ vì tưởng CV "không được tính".

## Đề xuất — tách đúng 2 trục, xoá tuyên bố sai (xem widget before/after)
| Trục | Đại diện UI | Sự thật cần nói |
|---|---|---|
| **Điểm / gate liên hệ NTD** (thật, đã đúng) | Verdict chip "Chưa đủ điều kiện liên hệ NTD" + dòng "Cần thêm N điểm" | Giữ nguyên — đây là câu chuyện DUY NHẤT về điểm/gate. |
| **Xác thực / trust-tier marketplace** (đang SAI) | Source chip + banner | Đổi hẳn giọng: KHÔNG còn chữ "tính điểm"/"mở khoá" — chỉ nói về **được NTD tin/nổi bật hơn khi xếp hạng**. |

### Copy đề xuất (đợi thầy duyệt câu chữ, đây là social nguồn: [trust-badge research](https://www.userintuition.ai/reference-guides/trust-ux-badges-proof-and-the-research-behind-them/) — badge lặp/mơ hồ làm mất tín hiệu, phải rõ 1 nghĩa)
- Chip: ~~"Chưa xác minh · không tính điểm"~~ → **"Tự khai · chưa đối chiếu"** (mô tả trạng thái, không claim hệ quả sai).
- Banner title: ~~"Chưa xác minh · không tính điểm"~~ → **"Được StarCi xác thực để nổi bật hơn"**.
- Banner body: ~~"...không tính vào điểm sẵn sàng đi làm hay mở khoá nhà tuyển dụng"~~ →
  **"CV này do bạn tự khai — vẫn tính điểm và mở khoá liên hệ bình thường. Tạo CV từ thành tích thật (capstone,
  challenge đã chấm) để nhà tuyển dụng thấy nhãn 'Đã xác thực', xếp hạng cao hơn khi so ứng viên."**
- CTA: ~~"Tạo CV từ thành tích để tính điểm"~~ → **"Tạo CV từ thành tích →"** (bỏ "để tính điểm" — lý do sai; nếu
  muốn giữ lý do thì đổi thành "để được xác thực").
- Chip "Đã xác minh" (Generated) → cân nhắc đổi luôn thành **"Đã xác thực"** cho khớp giọng "trust", tránh chữ
  "xác minh" gợi liên tưởng compliance/KYC nặng nề hơn thực tế.

## Về "layout phần màu đỏ" (vùng header + dial)
Đọc lại `UX-BRAINSTORM-V3-LAYOUT.md`: cấu trúc header→recruiter-line→dial→tabs đã chốt sau 9-10 vòng, **không đề
xuất đổi lại**. Điều khiến vùng đó "chưa ổn" trong screenshot phần lớn đến từ chính bug copy ở trên: recruiter-line
("CV tốt nhất... còn 12 điểm") + verdict chip + source chip + banner **cùng nói về "điểm/mở khoá" 4 lần** trên cùng
1 màn hình → mắt đọc ra "sao lặp/rối vậy" dù mỗi khối riêng lẻ đúng vai. Sau khi tách rõ 2 trục (trên), số lần nhắc
"điểm/mở khoá" giảm còn đúng 2 (recruiter-line + verdict chip/needMore) — cụm màu đỏ sẽ đọc gọn hơn NGAY CẢ KHI
không đổi 1 dòng layout. Nếu sau khi sửa copy vẫn thấy chật, đề xuất nhỏ thêm: giảm `gap` giữa recruiter-line và
dial từ `gap-6` xuống `gap-3` (chúng cùng 1 nhóm "về CV đang có", không phải 2 vùng khác chức năng — ref [[gap]]).

## Việc cần làm khi `/starci-fe-ux-apply`
1. Đổi 4 key i18n (`sourceUploaded`, `sourceUploadedHint`, `demandBridgeCta`, cân nhắc `sourceGenerated`) — vi + en.
2. Không đổi logic (điểm/gate vốn đã đúng) — chỉ đổi STRING.
3. (optional) `gap-6` → `gap-3` giữa recruiter-line và dial trong `CvWorkspace`.
4. Theo `CV-VERIFIED-TRUST-TIER-WORKFLOW.md` §F4: khi FE thêm badge verification-level lên chip lịch sử CV, dùng
   ĐÚNG giọng mới này (trust/ranking), không lặp lại lỗi "không tính điểm".

## Refs
- [Trust UX: badges lặp/mơ hồ làm mất tín hiệu](https://www.userintuition.ai/reference-guides/trust-ux-badges-proof-and-the-research-behind-them/)
- Code: `CvWorkspace/index.tsx` L117–125, 218 · `CvScorecard/index.tsx` L150–271 · BE commit `04e403dcb7be`.
- `[[fair-monetization-axiom]]` (đúng tinh thần: verification không được gate cơ hội theo count/nguồn — chỉ ranking).
