# LAYOUT-BRAINSTORM — Feature CV (CẢ HỆ: xem + sửa + routing)

> `/starci-fe-layout-brainstorm` 2026-07-05. Khoanh **CẢ FEATURE CV** (mọi route/tab/mode), quyết **routing** + 1 hệ
> layout NHẤT QUÁN. KHÔNG code. Đã vẽ widget "cv_feature_layout_system_view_edit". Nối tiếp: V3-LAYOUT §10 (view-only,
> ma trận state) + CRITIQUE.md (verified-only + demand-bridge). Bối cảnh: fix trước chỉ đụng `?tab=cv` (view) → `/cv/edit`
> vẫn route rời phẳng cũ → **lệch** (thầy: *"sao tab lộn xộn"*). Vòng này giải ở tầng HỆ.

## 1. Khoanh CẢ FEATURE — surfaces + URL scheme hiện tại
| Surface | Route hiện tại | Component | Layout | Vấn đề |
|---|---|---|---|---|
| Xem (trong hồ sơ) | `/profile/[u]?tab=cv` | `ProfileCvTab`→`CvWorkspace` | tabbed (đã đẹp) | — |
| Xem (standalone) | `/profile/cv` | `Cv`→`CvWorkspace`(breadcrumb) | tabbed | — |
| **Sửa/Tạo** | **`/profile/cv/edit`** | `CVUpload` (CvFileCard+CourseTrackPicker+Upload+Generate) | **form PHẲNG rời rạc** | route RỜI + layout chỏi với view |
→ **RỜI/lệch:** view = `?tab=` (mode trên surface), edit = route riêng layout khác hẳn. Đây là chỗ phải hợp nhất.

## 2. QUYẾT ĐỊNH ROUTING (mới) — hợp nhất `/cv/edit` → `?tab=cv&edit=true`
- **Hỏi:** sửa CV là "1 trạng thái của surface" hay "1 việc tách hẳn"?
- **Trả lời: TRẠNG THÁI.** Compose CV (tạo/tải) gắn chặt với xem (tạo xong → xem điểm/preview ngay), cùng object, cùng
  ngữ cảnh. KHÔNG phải leaf-solve full-bleed tách biệt. → **hợp nhất thành MODE query-param, cùng shell:**
  - `?tab=cv` (hoặc `/profile/cv`) = **mode XEM** (review).
  - **`?tab=cv&edit=true`** (thay `/profile/cv/edit`) = **mode SỬA** (compose) — CÙNG shell + ngôn ngữ layout.
- **Toggle:** Xem có `[Chỉnh sửa CV]` → Sửa; Sửa có `[← Xem kết quả]`; tạo/tải xong (job Done) tự về Xem.
- **WHY:** nhất quán shell (hết cú nhảy "tabbed đẹp → form phẳng"); vẫn deep-link được (`?edit=true`); là 1 object 1 surface.
  Ref: LinkedIn/Notion (sửa = mode cùng surface, không trang khác kiểu khác). Giữ route rời CHỈ cho việc-tập-trung
  tách hẳn (leaf solve/canvas — [[when-rail]]/[[leaf-page-one-nav-and-combined-tab-toolbar]]); CV compose không thuộc loại đó.
- **Đổi routing (impl khi apply):** gộp `app/[locale]/profile/cv/edit/page.tsx` vào `profile/cv` đọc `searchParams.edit`;
  `pathConfig().profile().cv().edit()` → giữ builder nhưng trỏ `?edit=true` (mọi entry point navbar/JobReadiness/Headhunter
  vẫn hoạt động). `CvWorkspace` render mode theo `edit` flag: false→review (hiện tại), true→compose (`CVUpload` redesign).

## 3. Zone map — mode XEM (`?tab=cv`) — giữ V3 §10
A header ("Các CV của bạn" + `[Chỉnh sửa CV]`→mode Sửa) · **B** recruiter-line (best **verified** /100 · unlock ≥70 ·
"còn N→học") · C dial chọn CV (chip ⚡verified/⬆unverified · +N khi >6) · D tabs Kết quả|Xem trước · E nội dung CV đang
chọn. (Đã dựng ở workflow trước; rỗng→card lời mời `[Vào khóa học]`; uploaded đang chọn→Callout demand-bridge.)

## 4. Zone map — mode SỬA (`?tab=cv&edit=true`) — REDESIGN chỗ lộn xộn
Bỏ form phẳng (CvFileCard→CourseTrackPicker→Upload→Generate xếp phẳng, gap to, không cấu trúc) → **2 card có THỨ BẬC:**
- Header: "Chỉnh sửa CV" + `[← Xem kết quả]`.
- **Card 1 — PRIMARY "Tạo CV từ thành tích"** (đường CHÍNH): badge "tính điểm recruiter" (verified) · body "dựng từ
  capstone/thử thách/coding · gắn khoá học" (CourseTrackPicker + context textarea bên trong) · **rỗng-thành-tích →
  phễu `[Vào khóa học]`** · `[Tạo CV]` primary. Nhấn nhất (viền success, trên cùng).
- **Card 2 — SECONDARY "Tải CV có sẵn"** (công cụ phụ): badge "chưa xác minh · chỉ để soi" (warning) · note "chấm +
  góp ý cùng rubric NHƯNG không mở gate recruiter — muốn tính điểm thì Tạo ở trên" · dropzone + label + `[Tải lên & chấm]`.
  Quiet (dưới, viền warning nhạt).
- (Card "CV hiện tại" chỉ hiện khi đang sửa 1 CV cụ thể `?cvId=`.)
- **WHY:** generate = đường verified + tạo demand-học → **PRIMARY** (trên, nhấn); upload = phụ → **dưới, quiet, khung
  unverified** (khớp CRITIQUE resolution: generate là cái "counts"). Hết flat scattered; thứ bậc = thông điệp business.

## 5. Ma trận STATE × MODE (phễu-khóa mọi ô) — xem widget
| State | Xem | Sửa | Phễu khóa |
|---|---|---|---|
| Rỗng | card lời mời | card Tạo "cần thành tích" | **[Vào khóa] PRIMARY** (cả 2 mode) |
| 1 CV | dial ẩn · Kết quả+Xem trước | CV hiện tại + tạo lại/tải | dòng B "còn N→học" |
| 5 CV | dial 5 chip | list sửa/xoá + Tạo mới | B (best verified) |
| >6 overflow | 4-5 chip + `+N` drawer | list cuộn | B |
| Mix ⚡+⬆ | chip verified/unverified | 2 card tạo/tải | uploaded→"Tạo để tính điểm →" |
| Pending | skeleton/AI đang chấm | status job | — |

## 6. Cắt / Thêm / Đổi (so với hiện tại)
- **ĐỔI routing:** `/cv/edit` route rời → `?tab=cv&edit=true` mode (hợp nhất shell).
- **REDESIGN mode Sửa:** form phẳng → 2 card thứ bậc (Tạo primary verified / Tải phụ unverified) + phễu.
- **GIỮ** mode Xem (đã dựng V3 §10): recruiter-line, verified/unverified chip, empty→courses, demand-bridge.
- **THÊM** toggle Xem⇄Sửa (thay nút "+ Thêm CV mới" điều hướng route rời → chuyển mode).
- Không cần BE mới cho layout (gate verified-only đã fix; `source`/`score`/`courseId` đã có).

## 7. Empty/loading/error/a11y
- Rỗng: cả 2 mode = lời mời học (KHÔNG "Nothing here"). Loading: skeleton mirror (dial+tabs / 2 card). Error: retry
  per-surface. a11y: mode toggle có `aria`; ô trống/unverified badge có text (không chỉ màu).

## Nguồn
- V3-LAYOUT §10 (view state matrix) · CRITIQUE.md (verified-only + demand-bridge) · [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]] · [[fair-monetization-axiom]] · [[single-select-among-options-use-tabs]] · [[concepts/card]] · LinkedIn/Notion (edit = mode cùng surface).

→ Thầy duyệt hệ layout (routing hợp nhất + redesign mode Sửa) → `/starci-fe-ux-apply` để dựng (đúng gate: chốt rồi mới xúc).
