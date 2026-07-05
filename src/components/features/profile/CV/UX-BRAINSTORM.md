# UX-BRAINSTORM — Công cụ CV: từ "hộp đen upload/generate" thành scorecard có nghĩa

> Trang: `/profile/cv` + tab "CV" trong `PublicProfile` (owner-only). Cây component: `CV/index.tsx` → `CvWorkspace` → `CVUpload` (`CvFileCard`+`UploadSection`+`GenerateSection`) + `CVPreview`. Vừa xong pha trước: hợp nhất preview thành 1 khung PDF thật (tectonic). Brainstorm này đi tiếp: **nội dung/IA** của công cụ, KHÔNG động preview nữa.

## 1. Mục tiêu trang (≤30s)
Người dùng vào đây để trả lời đúng 1 câu: **"CV của tôi đang ổn chưa, cụ thể cần sửa gì, và có đủ điều kiện để nhà tuyển dụng liên hệ chưa?"** Hiện công cụ không trả lời được câu này — nó chỉ là 1 form upload/generate + xem trước.

## 2. Đã đào ra gì (grounded — field CÓ nhưng chưa dùng)

| Field/asset | Trạng thái hiện tại |
|---|---|
| `cv_generations.score` (0–100) | Có trong schema GraphQL, nhưng **KHÔNG render ở đâu trong công cụ CV** — user tạo/tải CV xong không hề thấy điểm của chính mình. |
| `cv_generations.feedback` (jsonb) | Cột **CHẾT hoàn toàn** — AI chấm điểm xong tính ra `{shortFeedback, templateLevel, items:[{severity, section, message, suggestion}]}` rất chi tiết, nhưng **chưa từng được thêm vào GraphQL response** (`cvGeneration`/`myCvGenerations` đều thiếu field này) → không FE nào đọc được. |
| `cv_generations.courseId`/`targetRole`/`language` | 3 field mutation ĐẦY ĐỦ (`generateCv`/`reviseCv`/`uploadCv` đều nhận), nhưng **không component nào cho user set** → mọi CV tạo ra đều `courseId: null` → làm CV pillar của `JobReadinessService` (tính theo từng track) bị "đói" dữ liệu âm thầm. |
| Ngưỡng 70 điểm mở khoá liên hệ NTD (`ConsultantContactGateService`) | Tồn tại + đang gate thật, nhưng **hoàn toàn vô hình trong công cụ CV** — user chỉ biết khi vào trang headhunter thấy contact bị ẩn. |
| `myCvGenerations` (tối đa 100 dòng, mới nhất trước) | Chỉ đọc `data?.[0]` ("CV mới nhất") — 99 dòng còn lại (lịch sử CV cũ) chưa từng hiển thị. |
| `templateCvs` (rubric 3 mức Junior/Mid/Senior) | Fetch bởi 1 modal KHÁC (`CvReviewLevelDetailsModal`, thuộc luồng "nộp CV chấm điểm" cũ, tách biệt) — **không liên quan** tới Generate/Upload hiện tại (mức rubric BE tự suy, user không chọn). |
| **3 điểm vào (entry point) ngoài trang** đều kỳ vọng user "sửa điểm CV" | Navbar link · `JobReadinessWidget` ("thiếu pillar CV" → CTA vào đây) · `HeadhunterModal` ("nâng điểm CV để mở khoá liên hệ" → CTA vào đây). Cả 3 đưa user vào 1 trang **không hề cho thấy điểm** — vỡ kỳ vọng ngay khi đến. |

## 3. Ref ngành (đã tra cứu — không bịa pattern)
- **Rezi**: điểm 0–100 theo 5 hạng mục (Content/Format/Optimization/Best Practices…), panel gợi ý luôn hiện cạnh trình soạn, tick xanh khi đã sửa xong 1 gợi ý, điểm cập nhật real-time. ([rezi.ai/rezi-docs/the-rezi-score-explained](https://www.rezi.ai/rezi-docs/the-rezi-score-explained))
- **Teal**: điểm tổng + 15+ check hiển thị dưới dạng checklist, tab "Matching" riêng cho % khớp job. ([tealhq.com/tool/resume-checker](https://www.tealhq.com/tool/resume-checker))
- **Kickresume**: điểm 0–100 theo 3 nhóm Design/Content/Structure, mỗi nhóm có gợi ý sửa cụ thể. ([kickresume.com/en/resume-checker](https://www.kickresume.com/en/resume-checker/))
- → Pattern chung ngành: **điểm-hero + checklist theo hạng mục, LUÔN hiện cạnh CV, không giấu**. StarCi hiện đi ngược hẳn pattern này (giấu điểm + giấu feedback).
- **Nội bộ StarCi đã có sẵn đúng pattern này** — không cần bịa mới:
  - Trang kết quả chấm challenge/dự án cá nhân (`grading-result-page-labeled-cards-verdict-hero-findings-accordion`): `LabeledCard` "Kết quả" (điểm to + verdict) → `LabeledCard` "Góp ý" (Accordion, mỗi finding = severity + message + suggestion). **`feedback.items[]` của CV khớp GẦN NHƯ Y HỆT shape này** (`severity/section/message/suggestion` ≈ `severity/message/suggestion` của challenge feedback).
  - Bộ chọn "lần thử" (`attempt-history-selector-adaptive-and-grading-model-chip`): dải chip `FlexWrapButtonRadio` cho phép chọn 1-trong-N lần chấm — khớp thẳng với nhu cầu "chọn 1 trong N CV" từ `myCvGenerations`.
  - → Tái dùng 2 pattern ĐÃ CÓ SẴN trong hệ thống, không cần thiết kế block mới.

## 4. IA mới — 2 hướng (đã chốt hướng A, xem widget mockup)

### Hướng A — "Score-first" (đề xuất, viền accent trong mockup)
Công cụ CV trở thành 1 **scorecard thật**, upload/generate lùi xuống thành 1 phần cấu hình:
1. **Score hero** (`LabeledCard` "Kết quả", tái dùng nguyên pattern grading-result) — điểm to + verdict ("Đủ điều kiện liên hệ NTD" khi ≥70, else "Cần thêm N điểm để mở khoá liên hệ NTD") + chip track (nếu `courseId` được set) + dải chip chọn CV (`FlexWrapButtonRadio`, tái dùng attempt-selector, khi có >1 CV).
2. **Góp ý** (`LabeledCard` "Góp ý", Accordion — tái dùng nguyên pattern grading-result) — render `feedback.items[]`: severity icon + section + message, mở ra thấy `suggestion`.
3. **Cấu hình** (upload/generate — y hệt hiện tại, CHỈ thêm 1 chỗ mới: picker chọn track/course, optional — set `courseId` để CV tính vào đúng pillar JobReadiness).
4. Preview PDF giữ nguyên (cột phải, đã xong ở pha trước).

### Hướng B — "Thêm banner nhỏ" (tối giản, KHÔNG chọn)
Giữ NGUYÊN công cụ hiện tại, chỉ thêm 1 dải banner mỏng trên cùng: "Điểm CV: 82/100 · Cần 70 để mở khoá liên hệ NTD". Không có accordion góp ý, không có chọn track, không có lịch sử CV.
- **Trade-off:** effort thấp, nhưng KHÔNG giải quyết được gap lớn nhất (`feedback.items[]` vẫn chết — vẫn không ai biết CỤ THỂ cần sửa gì), không sửa được lỗ hổng `courseId` (JobReadiness vẫn đói dữ liệu), không tận dụng lịch sử CV. Chỉ vá triệu chứng, không vá gốc.

### Hướng C (đã cân nhắc, KHÔNG chọn) — "Portfolio nhiều CV" kiểu Teal resume-library
Biến trang thành lưới N thẻ CV (mỗi thẻ = 1 CV theo track/label), click vào 1 thẻ mới thấy scorecard+feedback+preview.
- **Trade-off:** giải quyết lịch sử CV TỐT HƠN hướng A (grid thay vì dải chip), nhưng effort cao hơn nhiều (cần trang con điều hướng thẻ↔chi-tiết) trong khi dữ liệu thực tế cho thấy đa số user chỉ có 1–2 CV — dễ thành over-build cho use-case hiếm. Để dành làm bước 2 nếu sau này thấy nhiều user thật sự có nhiều CV.

**Chốt: Hướng A.** Giải quyết cả 4 gap chính (điểm ẩn, feedback chết, courseId đói data, ngưỡng vô hình) bằng 2 pattern NỘI BỘ đã có sẵn, effort vừa phải (không cần trang con mới, không cần grid layout mới) — dải chọn CV trong hero đã đủ xử lý "lịch sử" ở quy mô thực tế hiện có.

## 5. Bảng section → dữ liệu BE/DB

| Section | Nguồn dữ liệu | Việc BE cần làm thêm |
|---|---|---|
| Score hero (điểm + verdict) | `cv_generations.score` (đã có) + ngưỡng 70 (hằng số `CV_SCORE_UNLOCK_THRESHOLD`, hiện chỉ ở BE) | Cân nhắc expose ngưỡng qua 1 field nhỏ (hoặc giữ hardcode copy FE, ngưỡng không đổi theo user) |
| Chip track | `cv_generations.courseId` → `course.title` (relation đã có) | **Thêm `courseTitle`/`course{title,slug}` vào `cvGeneration`/`CvGenerationListItem` response** (hiện chỉ có `courseId` thô) |
| Dải chọn CV | `myCvGenerations` (đã có, đủ field nhẹ) | Không cần gì thêm |
| Góp ý (Accordion findings) | `cv_generations.feedback.items[]` | **BẮT BUỘC: thêm `feedback` (hoặc field tách `shortFeedback`/`findings`) vào `cvGeneration` GraphQL response** — hiện hoàn toàn thiếu, đây là việc BE quan trọng nhất của hướng này |
| Picker chọn track khi generate/upload | `courseId` request field (đã có ở cả 3 mutation) | Không cần BE — chỉ thiếu FE picker (dùng danh sách khoá đã enroll, query có sẵn ở dashboard) |

## 6. Empty/loading/error
- Chưa có CV nào → Score hero hiện empty-state ("Chưa có điểm — tạo hoặc tải CV bên dưới"), ẩn hẳn khối Góp ý (không render accordion rỗng).
- Đang chấm điểm (status Pending/Processing) → tái dùng `AIProcessingText` đã có, score hero hiện skeleton.
- Chấm điểm lỗi (score null dù status Done) → verdict "Chưa có điểm" muted, KHÔNG hiện 0 giả.
- A11y: accordion dùng HeroUI `Accordion` (đã có focus/keyboard sẵn theo pattern grading-result); verdict badge có `aria-label` đọc đủ câu ("Điểm 82 trên 100, đủ điều kiện liên hệ nhà tuyển dụng").

## Nguồn tham khảo
- [Rezi Score explained](https://www.rezi.ai/rezi-docs/the-rezi-score-explained) · [Teal resume checker](https://www.tealhq.com/tool/resume-checker) · [Kickresume resume checker](https://www.kickresume.com/en/resume-checker/)
- Nội bộ: `.claude/rules/drafts/grading-result-page-labeled-cards-verdict-hero-findings-accordion.md` · `.claude/rules/drafts/attempt-history-selector-adaptive-and-grading-model-chip.md`

---

# Vòng 2 (2026-07-05) — tầng LAYOUT: CV = GƯƠNG → phễu vào khóa

> Vòng 1 (trên) giải tầng COMPONENT (score hero + feedback accordion — vẫn đúng, giữ). Vòng 2 giải tầng **LAYOUT /
> information-architecture**: sắp xếp cả màn để CV thành **phễu enrollment**. Thầy chốt mindset mới → reframe bố cục.

## Mindset chiến lược (thầy chốt)
- **CV = TẤM GƯƠNG phản chiếu việc đã làm trong khóa** — KHÔNG phải "tính năng viết CV tự do".
- **Chưa enroll → CV rỗng → sự rỗng + các ô thiếu (Kỹ năng / Dự án / Kinh nghiệm) LÀ CTA vào khóa.** Giọng *"enroll để
  KIẾM bằng chứng thật"*, KHÔNG *"mua để tăng số"* (giữ [[fair-monetization-axiom]]).
- **Vòng khép:** recruiter thấy hồ sơ ⇐ CV ≥ 70 ⇐ điểm từ capstone / challenge / coding ⇐ **phải học**.
- **DB:** CV là **projection DOWNSTREAM** của `enrollment → achievement`. `cv_generations` = artifact render + snapshot
  điểm, KHÔNG phải nguồn sự thật. → **không cần cờ `must_enroll`**: sự VẮNG MẶT achievement rows CHÍNH LÀ gate.

## Data thật thêm cho tầng layout (ngoài vòng 1)
| Nguồn | Field | Dùng cho |
|---|---|---|
| `jobReadiness.foundation` | `codingPercentile`, `cvScore` (best global) | rail điểm nền + gate recruiter |
| `jobReadiness.tracks[]` | `capstoneScore`, `interviewScore`, `cvScore`, `band`, `isQualified` | per-track / lineage ô trống |
| generate gather | capstone/challenge/coding passed (scoped enrollment) | "ô trống này lấp bằng bằng chứng nào" |

## 3 hướng LAYOUT (đã vẽ widget cho thầy chọn)

### ⭐ A — Gương soi CV (CV-mirror-first, ô-trống-là-CTA) — ĐỀ XUẤT
- **Bố cục:** header (nguồn: `Tạo từ thành tích` primary · `Tải lên` secondary) → split **2fr / 1fr**:
  - **TRÁI = CV document (hero):** identity rồi các **section slot**. Có data → render; **TRỐNG → dashed + tint accent
    + CTA đích danh** ("Dự án capstone · trống → vào khóa Fullstack", "Kỹ năng · trống → giải thử thách", "Coding ·
    trống → /practice").
  - **PHẢI = readiness rail:** điểm `foundation` (0/100) + **recruiter unlock** (`<70` khóa / `≥70` "recruiter thấy
    bạn") + "việc kế". → đây chính là **score-hero của vòng 1 chuyển thành rail** (không mất, đổi vị trí).
- **Tại sao hợp mindset nhất:** trang CHÍNH LÀ tấm gương; ô trống render đúng chỗ nó sẽ đầy → "khoảng trống = lời mời"
  theo nghĩa đen. Feedback accordion (vòng 1) sống BÊN TRONG CV đã-đầy.
- **3 state / 1 layout:** tay-trắng = CV toàn slot dashed (mỗi slot 1 phễu) · đã-học = slot đầy + rail ≥70 unlock ·
  nguồn = action bar trên (tạo mặc định, tải lên phụ).
- **Trade-off:** rủi ro "trông trống/hỏng" → copy empty-state kiểu *lời mời* ("CV của bạn bắt đầu từ việc học", slot
  nói rõ "hoàn thành X sẽ điền mục này"). Ref: LinkedIn profile-strength (ô thiếu = nudge) · Credly/Coursera (thành
  tích → hồ sơ).

### B — Bảng sẵn-sàng đi làm (readiness-cockpit-first)
- readiness hero (điểm lớn + unlock) → hàng per-track card → CV preview (thu gọn) → panel "cách nâng điểm" (CTA khóa).
- **Ưu:** outcome-first (được tuyển = động cơ). **Nhược:** CV bị đẩy xuống phụ → gương-soi yếu; empty-as-CTA phân tán.

### C — Sổ bằng-chứng → CV (proof-ledger split, lineage)
- split 1fr/1fr: TRÁI "Bằng chứng của bạn" theo track (capstone/challenge/coding, gap → CTA) · PHẢI "CV + điểm".
- **Ưu:** dạy vòng lặp rõ nhất. **Nhược:** 2 cột đầy, tay-trắng "trống đôi" dễ quá tải.

## CHỐT: A + graft lineage của C
- **Chốt A** (đúng mindset nhất), spine = CV document + readiness rail.
- **Graft từ C:** mỗi ô trống nêu **ĐÍCH DANH bằng chứng lấp nó** (từ gather lineage) → CTA chính xác ("Hoàn thành
  capstone *Hệ thống* khóa Fullstack → điền mục Dự án") thay vì chung chung. Giữ layout gọn của A + mạch học→bằng-chứng
  của C mà không cần cột 2.
- **Rail phải của A = mini-cockpit của B** (điểm + unlock + việc kế) → vẫn giữ outcome-framing, không mất B.
- **Quan hệ với vòng 1:** score-hero → rail phải; feedback-accordion → sống trong CV đã-đầy (tab/section của slot);
  attempt-selector chọn-CV → dải chip trên đầu CV document khi có >1 CV. Không mâu thuẫn — vòng 2 sắp lại VỊ TRÍ.

## IA mới (A chốt) — section → data
| Vùng | Vị trí | Data | State rỗng |
|---|---|---|---|
| Header + nguồn | trên | — | `Tạo từ thành tích` primary · `Tải lên` secondary |
| CV · identity | trái đầu | `structuredData.fullName` + targetRole | "Thêm vị trí mục tiêu" |
| CV slot · Dự án | trái | `tracks[].capstoneScore` + gather | dashed → CTA `.learn().personalProject()` |
| CV slot · Kỹ năng | trái | challenge passed | dashed → CTA thử thách trong khóa |
| CV slot · Coding | trái | `foundation.codingPercentile` | dashed → CTA `/practice` |
| Rail · Điểm | phải | `foundation.cvScore` best | "0/100 — chưa có CV chấm" |
| Rail · Recruiter unlock | phải | best ≥ 70 | `<70` khóa + "còn N điểm" |
| Rail · Việc kế | phải | pillar thiếu | "Bắt đầu 1 khóa → capstone" |
| Danh sách CV | trên CV khi >1 | `cv_generations[]` (`source`,`score`,`label`,`courseId`) | ẩn khi 0 |

## Cắt / Thêm (tầng layout)
- **CẮT** empty-state "chỉ tạo CV" (thủng phễu) → CV-với-slot-trống + CTA khóa.
- **CẮT** generate/upload phẳng ngang → tạo = primary (từ thành tích), tải lên = secondary.
- **THÊM** readiness rail (điểm + unlock + việc kế) — `foundation` đã có, chưa dùng.
- **THÊM** lineage đích danh trong mỗi slot trống (từ gather).
- **THÊM (fair)** CV yếu / chưa enroll → CTA `/courses` framing *"lấy bằng chứng thật"*, KHÔNG *"nâng số"*.

## Empty / loading / error / a11y
- **Empty (tay-trắng):** headline *lời mời* (KHÔNG "Nothing here"); mỗi slot dashed = 1 CTA; rail "0/100 · chưa có
  bằng chứng".
- **Loading:** skeleton mirror CV doc (slot xám) + rail — không nhảy layout.
- **Error:** retry per-surface (score fail ≠ mất CV — BE đã tách score best-effort).
- **a11y:** slot trống `aria-label` "mục X chưa có, hành động…"; recruiter-lock có text (không chỉ icon).

## Nợ (không thuộc layout, ghi kẻo quên)
- i18n `jobReadiness.ctaCapstone/ctaInterview/ctaCv/myTitle` thiếu vi/en → CTA vỡ (fix khi apply).
- vòng 1: `cvGeneration` response còn thiếu `feedback` + `courseTitle` (BE) — cần cho slot filled + chip track.
- WF-10 retire legacy: presign còn ghi row `cv_submissions` chết.

→ Thầy duyệt hướng (A / B / C) → `/starci-fe-ux-apply` để dựng.
