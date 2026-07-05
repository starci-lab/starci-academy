# UX-BRAINSTORM V2 — Từ "3 widget rời rạc trên 1 trang" thành "1 workspace có nghĩa"

> Vòng 2, sau khi hướng A (score hero + findings accordion) đã lên hình với DATA THẬT (user `cuongnvtse160875`: 3 CV — 58/18/18 điểm). Thầy gửi screenshot hiện trạng, hỏi *"thế này mà coi dc à… sửa layout cho gọn gàng chứ"* rồi yêu cầu đọc lại luồng + đề xuất hướng mới có cơ sở (không tweak vặt).

## 1. Đọc lại: hiện trạng render đúng data thật, nhưng có 1 bug kiến trúc + 1 lỗi copy

Đối chiếu code (`CvScorecard`, `CvFileCard`, `CVPreview`, `CvWorkspace`, `Cv/index.tsx`) với schema BE (`UserCvGenerationEntity`/`CvGenerationPayload`/`CvFeedback`) và ref ngành đã tra ở vòng 1 (Rezi/Teal/Kickresume — điểm-hero + checklist theo hạng mục, luôn hiện cạnh CV). Vòng 1 đã đúng IA lớn (score-hero trên, findings-accordion dưới, config CUỐI). Vòng 2 lộ ra 2 vấn đề THẬT khi có ≥2 CV — đúng tình huống của user trong screenshot:

### Vấn đề 1 (nghiêm trọng) — "chọn CV" là 3 trạng thái độc lập, không đồng bộ
- `CvScorecard` có dải chip `FlexWrapButtonRadio` (CV #1/#2/#3) — chọn 1 chip đổi **điểm + verdict + feedback** hiển thị (đúng, đọc từ `selectedId` local state).
- Nhưng `CvFileCard` (thẻ "Thông tin CV đã nộp") và `CVPreview` (khung PDF bên phải) đều tự fetch riêng và **luôn khoá cứng vào `myCvGenerationsSwr.data?.[0]`** (CV mới nhất) — hoàn toàn phớt lờ chip đang chọn.
- Hệ quả: bấm chip "CV #2 (18/100)" để đọc góp ý → điểm/feedback đổi đúng, nhưng file đang hiện + bản PDF xem trước **vẫn là CV #1** → người dùng đọc góp ý cho CV này, nhìn file lại thấy CV khác → mất lòng tin vào công cụ.
- Sâu hơn: `GenerateSection`'s nút "Chỉnh sửa CV của tôi" gọi `revise(sourceCvGenerationId = latest?.id, ...)` — **luôn revise CV MỚI NHẤT**, dù đang xem góp ý của CV #2. Người dùng đọc góp ý CV #2 rồi bấm sửa → thực ra đang sửa CV #1.
- **Đây là bug kiến trúc, không phải bug hiển thị** — 3 component fetch cùng khái niệm "CV đang xem" nhưng theo 3 nguồn khác nhau (1 state cục bộ + 2 lần "luôn là item [0]").

### Vấn đề 2 (nhỏ nhưng lộ ngay khi có data) — heading giữa trang là copy sai ngữ cảnh
- `CvWorkspace` render `Typography h2` = `t("course.cvTitle")` → **"Lộ trình CV"** + `t("course.cvDescription")` → **"Chuẩn bị và chỉnh sửa CV developer theo hướng dẫn trong khóa học."**
- Đây là copy khoá `course.*` — nghe đúng cho 1 flow "CV theo khoá học cụ thể", KHÔNG đúng cho `/profile/cv` (tool cấp user, không gắn khoá nào — chính field `courseId` mới thêm cũng ghi rõ "tuỳ chọn"). Trang đã có breadcrumb ("Hồ sơ › CV") ở `Cv/index.tsx`, nhưng **không có `PageHeader`/title thật nào khác** — heading sai ngữ cảnh này đang đóng vai trò "tiêu đề trang" duy nhất.
- Vi phạm canon `elements/header.md` (PageHeader: breadcrumb → H3 title + desc) — hiện trang lấy 1 heading giữa thân trang, sai nội dung, làm title.

### Ghi nhận thêm (không phải bug, nhưng đáng cân nhắc)
- 2 `GradeModelDropdown` riêng (Upload dùng `task=Grading`, Generate dùng `task=CvGenerating`) — có lý do kỹ thuật thật (2 task khác nhau), nhưng đọc bằng mắt thấy lặp 1 kiểu control 2 lần trong cùng 1 cột. Mức độ nhẹ, không phải ưu tiên vòng này.
- `CV_SCORE_UNLOCK_THRESHOLD = 70` hardcode ở FE (khớp hằng số BE) — chấp nhận được, không đổi theo user.

## 2. Hướng đề xuất — 3 lựa chọn

### Hướng A (đề xuất) — "1 trạng thái CV-đang-chọn dùng chung" + fix copy tiêu đề
Nâng `selectedCvId` từ local state của riêng `CvScorecard` lên **`CvWorkspace`** (owner chung), truyền xuống:
- `CvScorecard` (dial + score/feedback) — như cũ, chỉ đổi nguồn state.
- `CvFileCard` — hiện file của **CV đang chọn**, không phải luôn-mới-nhất.
- `CVPreview` — hiện PDF của **CV đang chọn**.
- `GenerateSection`'s `sourceCvGenerationId` — trỏ đúng **CV đang chọn**, để "Chỉnh sửa CV của tôi" sửa đúng cái đang xem góp ý.
- Sau khi Upload/Generate xong (job mới) → `selectedCvId` reset về CV mới tạo (giữ hành vi "focus vào kết quả vừa xong" đã có).
- Đồng thời: bỏ heading `course.cvTitle`/`course.cvDescription` sai ngữ cảnh; thay bằng **`PageHeader`** đúng canon (H3 "CV của tôi" + mô tả 1 dòng đúng bản chất: công cụ chấm điểm + góp ý CV, không gắn khoá nào bắt buộc) đặt ở `Cv/index.tsx` (đã có breadcrumb ở đó — gộp cùng 1 slot).
- **Trade-off:** chỉ là lift-state + đổi 1 heading — effort thấp, nhưng giải quyết ĐÚNG bug thật (không tưởng tượng ra vấn đề mới), biến trang từ "3 widget tình cờ đúng khi chỉ có 1 CV" thành "1 workspace nhất quán khi có nhiều CV" — đúng bản chất dữ liệu thật (user có 3 CV, không phải 1).

### Hướng B — Tabs "Kết quả" / "Tải lên & Tạo" (tách theo bước)
Tách trang thành 2 tab: tab 1 = score hero + feedback + preview (đọc); tab 2 = form upload/generate (hành động). Giải quyết được cảm giác "trang dài", nhưng:
- **Trade-off:** đi ngược đúng pattern ngành đã tra ở vòng 1 (Rezi/Teal/Kickresume đều giữ feedback LUÔN hiện cạnh nơi sửa, không giấu sau tab) — muốn sửa 1 gợi ý, user phải nhớ rồi tab qua bên kia, mất ngữ cảnh. Không giải quyết được vấn đề 1 (selection desync) — vẫn cần lift state dù có tab hay không.

### Hướng C (đã cân nhắc lại, vẫn KHÔNG chọn) — Grid card-per-CV kiểu Teal resume-library
Giờ đã có data thật (3 CV) để kiểm chứng — nhưng 3 CV vẫn nằm gọn trong dải chip (`FlexWrapButtonRadio` chịu được tới ~6 trước khi cần overflow). Grid + trang con điều hướng thẻ↔chi-tiết là effort cao hơn nhiều so với lợi ích ở quy mô hiện tại. Giữ nguyên quyết định vòng 1: để dành nếu sau này thấy user thật có >6 CV.

**Chốt: Hướng A.** Sửa đúng root cause (1 khái niệm "CV đang xem" phải có 1 nguồn sự thật), không thêm layout mới, không thêm phức tạp — biến bug ẩn thành hành vi đúng như thầy kỳ vọng khi nhìn dải chip chọn CV.

## 3. Bảng thay đổi → thành phần

| Thay đổi | File | Việc |
|---|---|---|
| Lift `selectedCvId` state | `CvWorkspace/index.tsx` | `useState` mới, truyền xuống 3 con |
| Dial đọc/ghi state chung | `CvScorecard/index.tsx` | Nhận `selectedId`/`onSelect` qua props thay vì tự `useState` |
| File card theo CV đang chọn | `CvFileCard` (qua `CVUpload` hoặc trực tiếp trong `CvWorkspace`) | Nhận `cvId` thay vì tự đọc `data?.[0]` |
| Preview theo CV đang chọn | `CVPreview/index.tsx` | Nhận `cvId` prop thay vì tự đọc `data?.[0]` |
| Revise đúng CV đang chọn | `GenerateSection/index.tsx` | `sourceCvGenerationId` = `selectedCvId` (không phải `latest?.id`) |
| Reset chọn sau khi tạo mới | `CvWorkspace`/`UploadSection`/`GenerateSection` | Sau job Done → `setSelectedCvId(newId)` (mirror `setActiveCvGenerationId` hiện có) |
| Tiêu đề trang đúng ngữ cảnh | `Cv/index.tsx` (+ `CvWorkspace` bỏ heading cũ) | `PageHeader` H3 "CV của tôi" + mô tả 1 dòng; xoá `course.cvTitle`/`course.cvDescription` khỏi CV tool (giữ key cho chỗ dùng đúng nếu còn, hoặc đổi tên key nếu chỉ CV tool dùng) |

Không cần BE mới — mọi field đã có (`cvGeneration(id)` trả đủ cho bất kỳ id nào trong `myCvGenerations`).

## 4. Empty/loading/error (không đổi so với vòng 1, verify lại theo state mới)
- Chưa có CV → `selectedCvId = undefined`, mọi con hiện empty-state riêng (đã đúng).
- Đang chấm CV vừa tạo → `selectedCvId` trỏ vào CV đang `Pending/Processing`; file card + preview cũng phải chịu được "chưa có `uploadedCvUrl`/`generatedPdfUrl`" (đã có nhánh rỗng ở `CVPreview`, chỉ cần đổi nguồn id).
- Chuyển chip nhanh liên tục → mỗi `useQueryCvGenerationSwr(cvId)` là 1 SWR key riêng, cache theo id — không có race điều kiện vì key đổi thì query mới, không cần debounce.

## Nguồn tham khảo (giữ từ vòng 1 + không cần tra thêm — đây là bug kiến trúc grounded từ code thật, không phải pattern mới)
- `.claude/rules/elements/header.md` §1–2 (PageHeader canon) — cơ sở cho việc heading sai ngữ cảnh là vi phạm, không phải gu thẩm mỹ.
- Vòng 1: [Rezi Score explained](https://www.rezi.ai/rezi-docs/the-rezi-score-explained) · [Teal resume checker](https://www.tealhq.com/tool/resume-checker) · [Kickresume resume checker](https://www.kickresume.com/en/resume-checker/) — feedback luôn cạnh nơi sửa, củng cố việc KHÔNG tách tab (bác Hướng B).
