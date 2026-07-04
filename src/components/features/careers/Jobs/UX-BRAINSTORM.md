# UX Brainstorm — Tuyển dụng (Jobs) — 2026-07-03

> Feature MỚI hoàn toàn (BE chưa có entity/mutation/query nào cho "job posting"). Brainstorm này cover CẢ data
> model lẫn IA/UX vì không có gì sẵn để "grounded" theo query có sẵn — chỉ có 2 entity liền kề để tái dùng
> (`HeadhuntingCompanyEntity`, `ConsultantEntity`) + 1 công ty đã seed (Pegasi, `.mount/data/headhuntings/0-pegasi`).

## 0. Chốt với thầy (không bàn lại)
- **KHÔNG làm kiểu lướt Tinder/swipe.** Case study thất bại: Jobr (bị Monster mua rồi khai tử) + Switch (tăng
  trưởng dừng 2021) — nguyên nhân thật KHÔNG phải "swipe chán" mà là **thiếu lọc/qualify** (ứng viên bất kỳ được
  match với job bất kỳ, tuyển dụng tốn công sàng lọc lại từ đầu) + phụ thuộc API bên thứ 3 (LinkedIn khoá API).
  → Bài học: **giữ filter/list thật, swipe không thay được bước "đọc kỹ trước quyết định"** vốn cần cho tuyển dụng
  (lương/remote/culture fit) — khác hẹn hò (low-stakes, quyết định tức thời chấp nhận được).
  Nguồn: [Switch and Jobr - Tinder for Jobs](https://hub.jobtrain.co.uk/blog/switch-and-jobr-tinder-for-jobs) ·
  [Monster snaps up Jobr — TechCrunch](https://techcrunch.com/2016/06/08/monster-snaps-up-tinder-for-jobs-app-jobr/)
- **Chia 2 PHẦN RÕ RÀNG** (thầy chốt):
  1. **Headhunt** — tư vấn tuyển dụng kiểu "freestyle" (không gắn 1 job cụ thể, quan hệ cố vấn nghề nghiệp mở) —
     dùng ĐÚNG hạ tầng `HeadhuntingCompanyEntity`/`ConsultantEntity` đã có, KHÔNG phải job posting.
  2. **IT job positions** — tin tuyển dụng CÓ CẤU TRÚC (title/lương/địa điểm/hình thức/apply) — entity MỚI.
  - Data cho phần 2 chấp nhận **CẢ HAI nguồn**: (a) **hardcode/seed** qua `.mount/data/` (như cách Pegasi được
    seed hôm nay — admin/content-team viết tay, tin cậy cao) VÀ (b) **form công khai** → ghi thẳng vào DB (như
    `UserPinnedProjectEntity` — self-serve, KHÔNG cần hàng đợi duyệt cho v1; ref [[submit-requires-valid-input-fe-disable-be-throw]] chỉ validate input hợp lệ, không cần workflow approve/reject).
  - **Headhunt phải "đủ điểm mới được connect"** — gate quyền xem thông tin liên hệ consultant theo 1 ngưỡng điểm
    của chính học viên (xem §3).

## 1. Research song song (đã chạy)
- **BE** (`starci-academy-backend`): `HeadhuntingCompanyEntity` (title/displayId/description/websiteUrl/logoUrl/
  address/phone/email/facebookUrl/linkedinUrl/orderIndex/sortIndex/defaultLocale + translations + consultants
  1:N) · `ConsultantEntity` (fullName/displayId/jobTitle/description/linkedinUrl/email/phoneNumber/zaloNumber/
  avatarUrl/orderIndex/sortIndex/defaultLocale + company N:1 + translations). Query CHỈ ĐỌC: `headhuntingCompanies`/
  `headhuntingCompany`/`headhuntingCompanySuggestions` (ES typeahead) — KHÔNG mutation nào. **0 hit** cho
  `jobPosting|jobListing|opening|vacancy` toàn repo. **Không có role/account "company"** — `UserEntity` là bảng
  user DUY NHẤT, không có `role`/`accountType`. Precedent form-tự-đăng-không-duyệt: `UserPinnedProjectEntity`
  (self-serve, unmoderated, max 6/user). Precedent "card + link ra ngoài + kind discriminator":
  `FoundationKind` enum (ExternalLink/Video/Document). **`WorkMode`** enum đã có sẵn (Remote/Hybrid/Onsite,
  dùng cho `users.work_mode`) — TÁI DÙNG y hệt cho job posting, không bịa enum mới. **`UserCVSubmissionAttemptEntity.score`**
  (0-100, AI chấm CV) là field điểm THẬT duy nhất khớp ngữ nghĩa "đủ điểm để headhunter xem hồ sơ".
- **FE** (`starci-academy`): `careers/Headhunting/Headhuntings` (grid consultant + search company debounced ES
  typeahead, block `SearchInput`/`PageHeader`) — route COURSE-SCOPED (`/courses/[id]/learn/headhuntings`).
  `careers/Headhunting/TalentDirectory` (route GLOBAL `/talents`, grid `PressableCard` — recruiter browse
  candidate open-to-work). `landing/Landing/TalentMarketplace` — pitch 2 chiều nhưng **CTA "engineer" chỉ trỏ
  course catalog** (build portfolio), KHÔNG có CTA "tìm việc" — gap thật, feature này lấp đúng gap. Card mẫu
  candidate = STATIC (`LANDING_SAMPLE_CANDIDATE`, đúng rule [[landing-sample-card-static-not-api]]).
  `pathConfig` đã có `.talents()` (global) + `.course(id).headhuntingCompanies(id)`/`.headhuntings()`
  (course-scoped) — namespace mới cho jobs nên đi GLOBAL như `.talents()` (job không thuộc riêng 1 course).
- **Web (case study swipe thất bại):** xem §0.

## 2. IA — 2 phần tách bạch, KHÔNG trộn chung 1 list

### Phần A — "Việc làm IT" (job board có cấu trúc, mở cho tất cả)
- **Entity mới `JobPostingEntity`**: `title`, `company` (FK → `HeadhuntingCompanyEntity` — company đăng job VÀ
  company headhunting là CÙNG 1 khái niệm "tổ chức có logo/website/social", không tách entity `Company` riêng —
  tránh nhầm mô hình), `description` (markdown), `location`, `workMode` (tái dùng `WorkMode`), `employmentType`
  (enum mới: Fulltime/Parttime/Internship/Contract), `salaryMin`/`salaryMax` (nullable, null = "Thoả thuận"),
  `requirements` (markdown), `applyMethod` (enum mới, mirror `FoundationKind`: ExternalUrl | Email), `applyUrl`/
  `applyEmail`, `expiresAt` (nullable), `source` (enum: Seeded | Submitted — phân biệt tin admin curate vs form
  công khai, KHÔNG phải trạng thái duyệt — cả 2 đều live ngay). KHÔNG có bảng `translations` (giống
  `UserPinnedProjectEntity` — nội dung user-submitted, đơn ngữ theo locale người đăng chọn).
- **2 nguồn ghi data (cả hai chấp nhận, không có hàng đợi duyệt cho v1):**
  1. Seed qua `.mount/data/jobs/` (mirror cấu trúc `headhuntings/`: `{orderIndex}-{displayId}/{locale}.md`) —
     cho tin admin/content-team tuyển chọn tay (chất lượng cao, ví dụ đầu tiên trước khi có form submission).
  2. Form công khai `/jobs/post` → mutation `submitJobPosting` ghi thẳng DB, `source = Submitted` — validate
     input hợp lệ (URL/email đúng định dạng, required field) nhưng KHÔNG workflow approve/reject (mirror
     `pinExternalProject`). Nếu sau này cần chống spam thì thêm `status` — chưa cần cho v1.
- **Trang browse `/jobs`**: search + filter chip (workMode/employmentType) + **DANH SÁCH DÒNG** (không phải lưới
  thẻ) + phân trang. Chi tiết ở §4 (đã vẽ widget so 3 hướng, chốt A).
- **Trang chi tiết `/jobs/[id]`**: full posting + link ra `headhuntingCompanies(companyId)` (trang company đã có)
  + CTA "Ứng tuyển" (mở `applyUrl` hoặc `mailto:applyEmail`).
- **Trang đăng `/jobs/post`**: form nhiều section theo NGHĨA (ref [[split-config-config-card-by-meaning-not-per-control]]):
  "Công ty" (search+chọn `HeadhuntingCompanyEntity` có sẵn qua typeahead ES đã có, HOẶC "công ty mới" nếu không
  tìm thấy) → "Vị trí tuyển dụng" (title/employmentType/workMode/location/salary/description/requirements) →
  "Cách ứng tuyển" (ExternalUrl | Email, discriminator giống `FoundationKind`). Field pattern = mirror
  `ExternalProjectForm` (`TextField variant="secondary"` + RHF + `Label`/`TextArea`).

### Phần B — "Headhunt" (tư vấn tuyển dụng freestyle, GATED theo điểm)
- **KHÔNG entity mới** — dùng nguyên `HeadhuntingCompanyEntity`/`ConsultantEntity` đã có. Đây là **quan hệ cố
  vấn mở** (không gắn 1 job cụ thể) — khác hẳn "ứng tuyển 1 vị trí" của Phần A.
- **Cái MỚI = GATE "đủ điểm mới được connect"**: hôm nay trang consultant hiện contact info (`email`/
  `phoneNumber`/`zaloNumber`/`linkedinUrl`) CÔNG KHAI cho mọi người xem — cần đổi thành **khoá theo điểm**:
  - **Đề xuất ngưỡng = `UserCVSubmissionAttemptEntity.score` (điểm CV, 0-100)** — field THẬT duy nhất khớp
    đúng ngữ nghĩa "hồ sơ đủ tốt để giới thiệu cho headhunter". Đúng logic nghiệp vụ tuyển dụng thật (agency
    không muốn tốn thời gian xem hồ sơ chưa chỉn chu) + tạo động lực dùng tính năng chấm CV sẵn có của StarCi.
  - **Thay thế/bổ sung có thể cân nhắc:** XP tổng hoặc `LeagueTier` (đã có trong enums) nếu muốn gate theo
    "mức độ học tập" thay vì "chất lượng hồ sơ" — hoặc kết hợp OR (`CV score ≥ X` HOẶC `League tier ≥ Y`).
    **Cần thầy CHỐT ngưỡng cụ thể** (số điểm CV bao nhiêu, có kết hợp XP/league không) — đây là quyết định
    nghiệp vụ, brainstorm không tự bịa số.
  - **Trạng thái khoá/mở** (đã vẽ widget): dưới ngưỡng → card consultant hiện `LockIcon` + "Cần điểm CV ≥ X để
    mở thông tin liên hệ" + CTA "Cải thiện CV" (route sang `/profile/cv`, feature ĐÃ CÓ). Đạt ngưỡng → hiện đủ
    contact info (mail/zalo/linkedin) như bình thường. Ref [[status-icon-overrides-base]] (icon khoá thay icon
    gốc, không hiện cả 2) + [[disable-vs-lock-and-perrow-autosave]] (Lock = chưa đủ điều kiện, khác Disable =
    lỗi hệ thống).
  - **KHÔNG cần workflow "gửi yêu cầu kết nối" (request/notify) cho v1** — không có hạ tầng thông báo tới
    consultant ngoài (không phải user StarCi). MVP = **hiện/ẩn contact info**, học viên tự liên hệ khi đã mở khoá.
    Nâng cấp v2 (nếu cần): thêm mutation "gửi hồ sơ" ghi log + email tới consultant.
  - Trang route: giữ nguyên `careers/Headhunting/Headhuntings` (course-scoped, ĐÃ ĐÚNG chỗ — tư vấn theo
    ngành/khoá học) + `HeadhuntingCompany` detail, chỉ đổi UI phần consultant card (thêm gate).

## 3. Vì sao 2 phần TÁCH, không gộp 1 list
- **Bản chất khác nhau:** Phần A = ứng tuyển 1 VỊ TRÍ CỤ THỂ (có lương/deadline/mô tả công việc) — giao dịch
  1-lần. Phần B = quan hệ CỐ VẤN MỞ với 1 NGƯỜI (headhunter) — không gắn công việc cụ thể, có thể kéo dài.
  Trộn chung 1 list "tuyển dụng" sẽ nhầm lẫn 2 loại hành động khác nhau (ứng tuyển vs xin tư vấn).
- **Điều kiện truy cập khác nhau:** Phần A mở cho TẤT CẢ (không gate), Phần B gate theo điểm. Trộn chung khiến
  UI phải xử lý 2 trạng thái khoá/mở trên CÙNG 1 danh sách → rối theo đúng luật [[status-icon-overrides-base]]/
  accent-system (đang-chọn ≠ trạng thái, ở đây là mở ≠ khoá — cũng không nên trộn 2 ngữ nghĩa trên 1 hàng).
- **Entry point:** hub "Tuyển dụng" (route mới `/careers` hoặc thẳng landing) hiện **2 THẺ LỰA CHỌN** dẫn 2
  hướng — "Việc làm IT" (badge: mở cho tất cả) và "Kết nối Headhunter" (badge: cần đủ điểm CV), KHÔNG gộp
  filter chung.

## 4. Đã vẽ widget (không lặp lại bằng chữ)
- **`job_board_layout_directions`** — so 3 hướng layout cho trang browse `/jobs`: (A) **Danh sách dòng** — khớp
  MỌI job board thật (LinkedIn/Indeed/ITviec/Wellfound đều dùng row-list vì job nhiều thuộc tính cần đọc, không
  hợp lưới ảnh); (B) Lưới thẻ — khớp thị giác `/talents` nhưng chật khi nhồi lương+địa điểm+hình thức; (C)
  Master-detail 2 cột — chuyên nghiệp nhưng cột phải trống khi chỉ có 1-2 tin thật (rail phải "kiếm được" bằng
  list đủ dài — ref [[when-rail]], data hiện tại CHƯA đủ). **→ CHỐT A.**
- **`headhunter_connect_gate_states`** — 2 trạng thái card consultant: khoá (điểm CV 52/100, LockIcon + CTA cải
  thiện CV) vs mở (điểm CV 87/100, hiện contact info).

## 5. Early-stage / data thật ít (chỉ 1 company Pegasi, 1 consultant, 0 job posting hôm nay)
- Mirror pattern đã áp cho `/blog` (coverless/ít bài → text-first, KHÔNG lưới card rỗng-nhìn-buồn): trang `/jobs`
  khi 0-2 tin → **text-first row-list vẫn đẹp** (khác lưới thẻ sẽ lộ ô trống — đúng lý do chọn Kiểu A ở §4).
- **Empty-state 2 lớp:** (a) rỗng vì filter → "Không có tin khớp bộ lọc" + nút xoá filter; (b) rỗng TOÀN BỘ
  (chưa có tin nào) → biến thành **funnel 2 chiều** (playbook cold-start marketplace chuẩn): "Chưa có tin tuyển
  dụng nào — Công ty của bạn? Đăng tin miễn phí →" (CTA sang `/jobs/post`) — dùng sự trống của 1 bên để mời bên
  kia, KHÔNG để trống trơ.
- Phần B (Headhunt) hiện đã có 1 consultant thật (My Hạnh, Pegasi) — không rỗng, chỉ cần thêm gate.

## 6. Cắt / KHÔNG làm
- **KHÔNG swipe/Tinder** (đã chốt §0).
- **KHÔNG workflow duyệt/approve job posting** cho v1 (chấp nhận form → DB thẳng, mirror `UserPinnedProjectEntity`).
- **KHÔNG entity `Company` riêng** — dùng `HeadhuntingCompanyEntity` cho cả 2 vai (company tự đăng job VÀ
  company headhunting) — 1 khái niệm "tổ chức", tránh 2 mô hình chồng chéo.
- **KHÔNG hệ thống "gửi yêu cầu kết nối" có thông báo** cho v1 (không có hạ tầng notify recruiter ngoài) — chỉ
  gate hiện/ẩn contact info.
- **KHÔNG account "company/employer"** riêng — form đăng job vẫn dùng auth Keycloak sinh viên hiện có (chỉ cần
  biết AI submit, không cần role mới) — hoặc cho phép ẨN DANH tuỳ thầy quyết (cần chốt).

## 7. Câu hỏi CẦN THẦY CHỐT trước khi `/starci-fe-ux-apply`
1. **Ngưỡng gate Headhunt**: điểm CV bao nhiêu (vd ≥70? ≥80?) — có kết hợp XP/League tier không, hay CV score
   là đủ?
2. **Ai được đăng job qua form** — cần đăng nhập (Keycloak, biết ai submit) hay cho ẩn danh hoàn toàn?
3. **Route hub**: "Tuyển dụng" có cần 1 trang hub riêng (`/careers`) giới thiệu 2 nhánh, hay chỉ cần 2 mục nav
   riêng (`/jobs` + `/talents`/`headhuntings` như hiện tại, không cần trang gộp)?
4. **Tên hiển thị**: "Việc làm IT" hay "Việc làm"/"Tuyển dụng" (tránh nếu sau này mở rộng ngoài IT)?

## Liên quan
[[when-rail]] (rail phải kiếm được bằng list đủ dài) · [[landing-sample-card-static-not-api]] · [[status-icon-overrides-base]] ·
[[disable-vs-lock-and-perrow-autosave]] · [[split-config-card-by-meaning-not-per-control]] (form nhiều section theo nghĩa) ·
[[submit-requires-valid-input-fe-disable-be-throw]] (validate không cần workflow duyệt).
