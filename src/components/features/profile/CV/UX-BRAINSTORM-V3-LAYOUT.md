# UX-BRAINSTORM V3 — Bố cục TOÀN TRANG (macro layout), không chỉ phần selection

> Vòng 3. Thầy chốt rõ: *"cả trang lớn luôn ý, không phải 1 phần nhỏ, thầy muốn làm layout trước"*. V1/V2 đã đúng nội dung từng phần (score hero + findings accordion + fix state đồng bộ), nhưng CHƯA đặt lại câu hỏi lớn hơn: **toàn trang nên xếp theo bố cục nào** — hiện đang là "3 khối full-width xếp chồng rồi mới rẽ 2 cột" (score → findings → heading sai → 2-col upload/preview). Vòng này brainstorm lại đúng tầng macro.

## 1. Vấn đề bố cục hiện tại (không phải vấn đề nội dung từng phần)
- Trang hiện là **1 cột dài**: Score hero (full width) → Góp ý (full width) → heading "Lộ trình CV" (sai ngữ cảnh, xem V2) → **chỉ TỚI ĐÂY** mới rẽ 2 cột (upload/generate trái, preview phải).
- Hệ quả macro: **khung xem trước CV (bằng chứng — "CV thật trông ra sao") nằm tít dưới**, người dùng đọc điểm + đọc góp ý ("mô tả mơ hồ", "mốc thời gian bất hợp lý"…) mà KHÔNG thấy CV ngay cạnh để đối chiếu — phải cuộn xuống mới thấy preview. Đây là lệch so với pattern đã tra cứu ở vòng 1 (Rezi/Teal/Kickresume: panel gợi ý LUÔN cạnh bản xem/trình soạn) và xác nhận lại ở vòng này (Resume.io, Novoresume: desktop = sidebar/preview LUÔN thường trực, chỉ mobile mới xếp chồng).
- Trang cũng **dài bất thường** vì mọi phần (kết quả, góp ý, upload, generate) đều full-width/luôn-hiện — không có cơ chế thu gọn phần ít dùng (upload/generate không phải việc làm mỗi lần vào trang).

## 2. Ba hướng bố cục toàn trang (xem widget)

### Hướng A (đề xuất) — Workspace 2 cột NGAY TỪ ĐẦU: trái = điểm + tab (Góp ý/Cấu hình), phải = preview cố định
- Bỏ hẳn mô hình "full-width rồi mới rẽ cột". Ngay dưới `PageHeader`, trang vào thẳng **1 vùng workspace 2 cột**, cao gần hết viewport:
  - **Cột trái** (~60%): 1 dải gọn trên cùng = điểm to + verdict + dải chip chọn CV (đây là phần LUÔN hiện, không tab); dưới đó là **2 tab nội bộ** (`TabsCard`, single-select — đúng [[single-select-among-options-use-tabs]]): **"Góp ý"** (mặc định, mở ngay khi vào trang — vì đọc góp ý là lý do #1 người dùng ghé trang) và **"Cấu hình"** (gom CvFileCard + CourseTrackPicker + Upload + Generate — việc làm KHÔNG PHẢI mỗi lần vào trang, xứng đáng giấu sau 1 click).
  - **Cột phải** (~40%): khung xem trước PDF **sticky full-height** (đúng cơ chế `sticky top-16 h-[calc(100dvh-4rem)]` đã có sẵn ở `CVPreview` — [[sticky]]), **LUÔN hiện bất kể đang ở tab nào bên trái** — vì đây là "bằng chứng" cần đối chiếu liên tục với cả điểm lẫn góp ý lẫn việc sửa.
- **Vì sao đúng:** (1) rút ngắn trang đáng kể (ẩn form upload/generate sau 1 tab, không phải cuộn qua); (2) preview LUÔN cạnh điểm+góp ý ngay từ màn hình đầu — đúng pattern ngành; (3) tab "Cấu hình" ẩn ĐÚNG phần ít dùng (upload/generate), KHÔNG ẩn phần hay dùng (góp ý) — khác hẳn hướng B đã bị bác ở V2 (hướng đó tab hoá luôn cả feedback, sai).
- Bố cục này **ép buộc** đúng luôn fix "1 trạng thái CV-đang-chọn dùng chung" đã brainstorm ở V2 (dải chip + preview nằm cạnh nhau trong cùng 1 workspace → tự nhiên phải chia sẻ `selectedCvId`, không thể lệch như hiện tại).

### Hướng B (cân nhắc, KHÔNG chọn) — Rail lịch sử CV (trái, dọc) + workspace + preview (3 cột)
- Thay dải chip ngang bằng 1 **rail dọc** liệt kê các CV (mirror pattern `ListBox` rail của `SubmissionResult`/Leaderboard trong hệ thống).
- **Trade-off:** đúng [[when-rail]] — rail CHỈ đáng dùng khi có 1 danh sách đủ dài để "nuôi" cả 1 cột (≥~5 item bền). Số CV thực tế hiện tại (3, và dải chip vốn đã chịu được tới ~6 trước khi cần overflow) KHÔNG đủ — rail sẽ trống quá nửa cột, giống lý do Hướng C của V1 (grid card-per-CV) từng bị bác. Không chọn, cùng lý do.

### Hướng C (cân nhắc, KHÔNG chọn) — 1 cột, MỌI THỨ sau tab (kể cả xem trước)
- Đơn giản hoá tối đa: 1 cột, 3 tab ngang hàng "Góp ý | Xem trước | Cấu hình", không cột nào cố định.
- **Trade-off:** gọn nhất về code (không cần lo layout 2 cột responsive), nhưng **quay lại đúng sai lầm** mà cả 2 vòng trước đã tra cứu và bác bỏ: tách preview khỏi góp ý = mất khả năng đối chiếu "góp ý nói vậy, nhìn CV thật xem có đúng không" ngay lập tức — hạ cấp trải nghiệm so với chính bản hiện tại (hiện tại ít nhất preview vẫn ở CÙNG trang, chỉ là dưới xa).

**Chốt: Hướng A.** Giải quyết đúng cả 2 khiếu nại của thầy trong 1 lần: (1) *"cả trang"* — đổi hẳn bộ khung từ 1-cột-dài sang workspace-2-cột-từ-đầu; (2) *"gọn gàng"* — ẩn phần cấu hình ít dùng sau tab, rút ngắn trang, không đụng tới phần đọc-là-chính (góp ý + preview luôn hiện). Đồng thời fold nguyên fix state-sync (V2) vào làm ĐIỀU KIỆN CẦN của bố cục mới (preview phải theo đúng CV đang chọn trong dải chip) và fix heading sai ngữ cảnh (chuyển thành `PageHeader` chuẩn ở đầu trang, trước workspace).

## 3. Ánh xạ khung mới → component/field (không cần BE mới)

| Vùng layout | Component | Field/nguồn |
|---|---|---|
| `PageHeader` đầu trang | `Cv/index.tsx` (mới thêm) | title tĩnh "CV của tôi" + mô tả 1 dòng, thay heading `course.cvTitle` sai ngữ cảnh |
| Dải điểm + verdict + chip chọn CV (LUÔN hiện, cột trái, trên tab) | `CvScorecard` (tách phần score-strip khỏi phần findings) | `cvGeneration(id).score/feedback.shortFeedback`, `myCvGenerations` |
| Tab "Góp ý" (mặc định) | `CvScorecard`'s findings accordion (tách khỏi score-strip, đặt trong tab) | `feedback.items[]` |
| Tab "Cấu hình" | `CvFileCard` + `CourseTrackPicker` + `UploadSection` + `GenerateSection` (gom nguyên, không đổi nội dung) | không đổi |
| Cột phải, sticky full-height | `CVPreview` (giữ nguyên cơ chế, chỉ đổi nguồn `cvId` theo state chung) | `uploadedCvUrl`/`generatedPdfUrl` |
| State dùng chung xuyên workspace | `CvWorkspace` (owner mới) | `selectedCvId` — lift từ local state hiện tại của `CvScorecard` |

## 4. Responsive
- `lg+`: 2 cột thật (60/40 hoặc tương đương 3/5-2/5 hiện có), preview sticky full-height.
- Dưới `lg`: xếp dọc — dải điểm + tab (Góp ý/Cấu hình) TRƯỚC, preview PDF xuống dưới cùng (giữ đúng hành vi hiện tại của `CVPreview` — nó đã có nhánh mobile `h-[300px]` không sticky). Đây là pattern chuẩn ngành đã xác nhận (Resume.io/Novoresume: sidebar/preview thường trực CHỈ trên desktop, mobile luôn xếp chồng).

## 5. Empty/loading/error
- Chưa có CV nào: score-strip hiện empty-state ("Chưa có điểm…"), tab mặc định chuyển thẳng sang **"Cấu hình"** (vì "Góp ý" không có gì để xem — hợp lý hơn mở tab rỗng), preview cột phải hiện empty-state cùng lúc.
- Đang chấm điểm CV vừa tạo: score-strip skeleton, tab "Góp ý" hiện `AIProcessingText`, preview vẫn hiện file đang xử lý nếu có (uploaded) hoặc empty (generated chưa xong).
- Các nhánh error giữ nguyên như V1/V2 đã brainstorm (không đổi).

## 6. Tinh chỉnh CHỐT (thầy, sau khi duyệt A) — tách "Cấu hình" thành TRANG riêng, không phải tab
- Thầy chốt: `/profile/cv` = trang **xem/soát** (score-strip + Góp ý + preview, KHÔNG có form upload/generate). 1 nút **"Chỉnh sửa CV"** → điều hướng sang **trang riêng `/profile/cv/edit`** (route mới, KHÔNG phải tab trong cùng trang) chứa `CvFileCard` + `CourseTrackPicker` + `UploadSection` + `GenerateSection`.
- **Đổi so với §2 Hướng A (tab nội bộ):** bỏ hẳn `TabsCard` "Góp ý/Cấu hình" — cột trái của `/profile/cv` giờ CHỈ còn score-strip + accordion Góp ý (luôn hiện, không cần tab vì không còn gì để chuyển). "Cấu hình" thành 1 **trang riêng đầy đủ** (`/profile/cv/edit`), có breadcrumb lùi về `/profile/cv`.
- **Vì sao route thay vì tab:** soạn/tải CV là 1 THAO TÁC có chủ đích, tách bạch khỏi việc XEM kết quả — xứng đáng 1 trang riêng (giống pattern "leaf page 1 việc" đã dùng cho challenge-solve/task-result trong hệ thống), không phải chuyển tab trong cùng ngữ cảnh. Route cũng cho phép link trực tiếp (`/profile/cv/edit`) từ các entry point khác (navbar, JobReadinessWidget, HeadhunterModal — vốn đang trỏ vào `/profile/cv` mong đợi "sửa điểm CV" — giờ trỏ thẳng vào trang edit đúng ý định).
- Sau khi upload/generate xong (job Done) → tự điều hướng về `/profile/cv` để xem điểm/góp ý/preview mới (đúng cái người dùng thật sự cần thấy sau hành động).
- `CvWorkspace` (dùng chung PublicProfile "CV" tab) giữ vai trò review — cũng có nút "Chỉnh sửa CV" trỏ `/profile/cv/edit`.

## 7. Vòng 4 — tỉ lệ cột PHẢI đảo, preview mới là canvas chính (thầy: *"này có nhỏ quá không?"*)
- **Đo thật:** trong tab "CV" của PublicProfile, `CvWorkspace` KHÔNG chiếm nguyên bề ngang trang — nó nằm trong `main` cạnh sidebar hồ sơ (`aside md:w-72` = 288px) bên trong container `max-w-6xl` (1152px). Sau khi trừ padding + gap: vùng cho workspace chỉ còn **~784px**. Chia 60/40 (col-span-3/2) hiện tại → cột "Kết quả" ~456px, cột **preview chỉ ~304px** — 1 trang A4/Letter dồn vào 304px là quá nhỏ để nhận diện, đúng như thầy thấy trong screenshot.
- **Đối chiếu ref (đã tra ở vòng 1):** Rezi/Enhancv/Kickresume đều để **document/preview là canvas CHÍNH** (chiếm phần lớn khung), checklist/điểm/gợi ý là panel HẸP bên cạnh — NGƯỢC với tỉ lệ hiện tại của trang (đang cho điểm+góp ý chiếm phần lớn, preview bị dồn hẹp).
- **Đề xuất (xem widget):** đảo tỉ lệ — **`CvScorecard` col-span-2 (40%, ~304px) / `CVPreview` col-span-3 (60%, ~456px)**. +50% bề rộng preview, đúng vai "canvas chính" theo ref ngành. Nội dung score-strip (số + chip + verdict) và accordion góp ý vốn ngắn/wrap tốt, KHÔNG cần 60% mới đọc được — chỉ cần đủ hẹp mà không cụt chữ.
- **Không đổi cấu trúc khác:** vẫn cùng 1 workspace, cùng breakpoint `lg`, cùng cơ chế sticky. Đây là tinh chỉnh TỈ LỆ, không phải đổi IA. Trang `/profile/cv` standalone (không có sidebar, container `max-w-[1280px]`) cũng ăn theo tỉ lệ mới — vẫn hợp lý vì preview luôn xứng đáng là canvas chính bất kể context.
- **Cân nhắc bị bác (không chọn):** bỏ sidebar hồ sơ CHỈ riêng tab CV để lấy full-width — đổi hành vi `PublicProfile` DÙNG CHUNG cho 6 tab (blast radius lớn hơn cần thiết), trong khi chỉ cần đảo tỉ lệ là đã giải quyết đúng độ "nhỏ" thầy chỉ ra.

## 8. Vòng 5 — vẫn nhỏ dù đảo tỉ lệ: SPLIT không hợp trong khung hẹp này, chuyển TABS
- Thầy vẫn thấy nhỏ ngay cả khi mới đề xuất đảo tỉ lệ (chưa kịp áp). Đúng — vì gốc rễ không phải "chọn sai %", mà là **tổng ngân sách bề rộng (~784px trong tab hồ sơ) không đủ để chia 2 cột và cột nào cũng đọc thoải mái.** Đảo 40/60 chỉ đổi ai được 456px, ai bị 304px — vẫn có 1 bên nhỏ.
- **Nghiên cứu thêm (2026-07, mới):** container query cho phép 1 component phản hồi theo bề rộng CHÍNH NÓ render ra (không phải viewport) — đúng vấn đề ở đây (nhỏ vì SIBLING sidebar chiếm chỗ, không phải màn hình nhỏ). Tab UX: hợp khi có vài (2–3) mục ngang hàng quan trọng như nhau, cần chuyển qua lại nhanh — đúng "Kết quả" ↔ "Xem trước".
- **Đề xuất (xem widget) — chuyển sang TABS `TabsCard`:** 2 tab "Kết quả" (mặc định — điểm + dial + Góp ý) và "Xem trước" (PDF). Mỗi tab full-width khi mở → preview có nguyên ~784–1230px thay vì bị chia đôi, KHÔNG BAO GIỜ còn nhỏ nữa vì không còn phải chia sẻ hàng ngang với cột kia.
  - **Đánh đổi:** mất "luôn thấy cả 2 cùng lúc" (khác pattern Rezi/Enhancv đã tra ở vòng 1) — nhưng pattern đó giả định 1 workspace ĐỦ RỘNG (dedicated builder app), không phải 1 tool nhúng cạnh sidebar hồ sơ. Trung thực hơn: "cùng lúc nhưng cả 2 đều nhỏ" tệ hơn "lần lượt nhưng cả 2 đều đọc được rõ" — nhất là preview đã có nút "Xem toàn màn hình" bù cho việc không còn thấy cạnh nhau thường trực.
- **Cân nhắc lớn hơn, KHÔNG chọn ngay:** container-query adaptive (chia cột khi component thật sự đủ rộng, tự rơi về tabs khi hẹp) — về lý thuyết là giải pháp "đúng nhất" (giữ split trên trang standalone rộng, tabs trên tab hồ sơ hẹp), nhưng là **kỹ thuật CHƯA từng dùng trong repo** (grep `@container`/`container-type` = 0 kết quả) → thêm 1 tầng phức tạp mới, cần thầy duyệt riêng trước khi đưa vào (theo luật "design mới không rule nào cover → hỏi trước"). Để dành nếu sau này thầy thấy tabs vẫn chưa đủ.
- **Chốt đề xuất vòng này: TABS đơn giản** (`TabsCard`, không container query) — giải quyết dứt điểm độ nhỏ, effort thấp, dùng đúng block đã có sẵn trong hệ.

## 9. Vòng 6 — CHỐT bố cục full trang: dải chọn CV NGOÀI tabs, tabs ngay dưới header
- Thầy duyệt hướng tabs (vòng 5) + chốt 2 điều chỉnh: (1) **dải chọn CV ("Các CV của bạn") kéo RA KHỎI tab "Kết quả"** — nó là 1 control CHUNG, phải áp dụng cho CẢ 2 tab (chọn CV #2 thì cả "Kết quả" lẫn "Xem trước" đều đổi theo, không riêng gì tab đang mở); (2) **tabs đặt NGAY DƯỚI vùng header** (title+desc+CTA) — tabs là trục điều hướng chính của trang, phải lộ diện ngay, không chôn dưới.
- **Cấu trúc CUỐI (xem widget):** `PageHeader` (title "CV" + mô tả + CTA "Chỉnh sửa CV") → divider → **dải chọn CV** (label "Các CV của bạn" + `FlexWrapButtonRadio`, LUÔN hiện, độc lập tab) → **`TabsCard`** ("Kết quả" mặc định | "Xem trước") → nội dung tab full-width (Kết quả = score-hero + Góp ý accordion; Xem trước = `CVPreview` full-width, không còn sticky-cột-2/5 vì giờ nó CHIẾM TRỌN bề rộng khi mở).
- **Hệ quả kiến trúc:** `selectedCvId` giờ sống ở `CvWorkspace` VÀ điều khiển dial NGOÀI 2 tab — cả `CvScorecard` (giờ chỉ còn render score-hero + Góp ý, KHÔNG còn tự vẽ dial nữa — dial chuyển thành block riêng ở `CvWorkspace`) lẫn `CVPreview` đều nhận `selectedId`/`cvId` y như đã lift ở vòng 4, chỉ khác là dial UI không còn nested trong `CvScorecard`.
- Không cần BE mới. Đây là bố cục CUỐI của toàn bộ chuỗi brainstorm (V3 §1→§9) — chốt để `/starci-fe-ux-apply`.

## 10. Vòng 7 — MA TRẬN 4 STATE DỮ LIỆU + bake phễu-vào-khóa (`/starci-fe-layout-brainstorm`)
> Thầy: *"đủ layout nhé — lúc rỗng, có cv, có 5 cv, 1 upload + 1 generate. cover all test case. update rules."*
> Vòng 1→9 đã chốt SKELETON (header → dải chọn CV → tabs Kết quả/Xem trước). Vòng này KHÔNG đổi skeleton — nó
> **định nghĩa skeleton đó render thế nào qua MỌI state dữ liệu** + **bake mindset phễu-vào-khóa** (skill layout mới).
> Đã vẽ widget "cv_tab_layout_all_states" (khung vùng + 4 state cạnh nhau).

### Khung vùng cố định (mọi state) — A→E, xếp dọc trong cột nội dung tab CV
| # | Vùng | Vai | Ẩn/hiện |
|---|---|---|---|
| A | Header: "Các CV của bạn" + `[+ Thêm CV mới]` | tạo (đi `/profile/cv/edit`) | luôn |
| **B** | **Dòng recruiter-unlock: điểm BEST /100 · unlock ≥70 · "còn N → học nâng"** | **outcome + PHỄU khóa (mới, bake vòng này)** | luôn |
| C | Dải chọn CV (`FlexWrapButtonRadio`: nhãn · icon nguồn · điểm) | chọn 1-trong-N, áp cho CẢ 2 tab | ẩn khi 0–1 CV |
| D | `TabsCard`: **Kết quả** (mặc định) \| Xem trước | đổi view của CV đang chọn | ẩn khi 0 CV |
| E | Nội dung tab của CV đang chọn | — | thay theo state |

**Vì sao B+C TRÊN tabs:** dải chọn áp cho cả 2 tab (đúng §9); điểm-best + recruiter là **mức trang** (không theo tab)
→ đặt ngoài tab. B là **anchor phễu bake mới** — mọi lần vào trang đều thấy "recruiter cần ≥70 ⇐ điểm ⇐ học".

### Ma trận STATE → layout (cover all test case)
| State | B recruiter-line | C dải chọn | D tabs | E nội dung | **Phễu khóa nằm đâu** |
|---|---|---|---|---|---|
| **Rỗng (0 CV)** | `0/100 · recruiter khóa` | ẩn | ẩn | **CARD LỜI MỜI** (không "Chưa có CV") | **PRIMARY `[Vào khóa học →]`** trong card + mini-loop học→bằng-chứng→CV≥70→recruiter |
| **1 CV** | điểm CV đó (=best) | ẩn (1 cái, khỏi chọn) | hiện | Kết quả: score-hero + Góp ý · Xem trước: doc/PDF | dòng B "còn N → học" + trong Góp ý: pillar yếu → CTA capstone khóa · ô trống doc → CTA khóa |
| **5 CV** | điểm **BEST** của 5 | hiện: **5 chip inline** (trong cap hiện `CV_CHIPS_MAX=6`) | hiện | như 1-CV, theo CV đang chọn | dòng B + funnel trong Kết quả/Xem trước của CV đang chọn |
| **Mix (1 upload + 1 generate)** | best của 2 | hiện: 2 chip, icon `⚡ tạo` vs `⬆ tải` | hiện | Kết quả GIỐNG NHAU (1 rubric) · Xem trước KHÁC (tạo=doc dựng, tải=PDF gốc) | như trên; CV "tạo" có ô-trống-doc → phễu, CV "tải" không có ô trống nên phễu ở dòng B + Góp ý |

### Chi tiết từng state
- **Rỗng (phễu #1, quan trọng nhất):** §5 cũ ("chuyển sang tab Cấu hình") **ĐÃ SAI với mindset mới** → thay bằng
  **card LỜI MỜI**: headline "CV của bạn bắt đầu từ việc học" + body "CV dựng từ capstone/thử thách/coding trong khóa —
  không viết tay" + **PRIMARY `[Vào khóa học →]` (→ `/courses`)** + secondary `[Tạo từ thành tích]` / `[Tải CV lên]`
  (secondary vì tay-trắng tạo cũng rỗng → học trước) + mini-loop 4 bước. Tab con ẩn (không có gì để tab). Đây là
  ngõ-KHÔNG-cụt: chính sự rỗng LÀ pitch bán khóa (fair: "học để KIẾM bằng chứng", KHÔNG "mua để tăng số").
- **1 CV:** dải chọn ẩn (1 cái không cần chọn — [[single-select-among-options-use-tabs]] chỉ dùng khi ≥2). Kết quả =
  score-hero + Góp ý accordion; Xem trước = doc/PDF full-width. Ô trống trong doc (Kinh nghiệm/Dự án chưa có) = dashed
  + CTA đích danh vào khóa lấp nó.
- **5 CV:** dải chọn bật — chip = verdict icon + nhãn + điểm + kebab (Sửa/Xoá) [đã có ở code]. **5 ≤ cap hiện
  `CV_CHIPS_MAX=6` → cả 5 chip hiện inline, chưa cần overflow.** GAP đề xuất: khi **>6 CV → 5 chip + `+N` mở drawer**
  (pattern chọn-lần-thử [[attempt-history-selector-adaptive-and-grading-model-chip]]) — code hiện chỉ `slice(0,6)`,
  CHƯA có nhánh drawer, cần thêm khi apply. Chip đang chọn = viền accent. Dòng B = điểm **BEST** (gate recruiter theo
  max, không theo count — [[fair-monetization-axiom]]: 5 CV không "cộng điểm", chỉ lấy cái mạnh nhất). Tabs/nội dung =
  như 1-CV cho CV đang chọn.
- **Mix nguồn:** icon `source` phân biệt (`⚡` generated / `⬆` uploaded — field `cv_generations.source`). Cùng 1 rubric
  `CvScoringService` → **tab Kết quả shape GIỐNG HỆT** cho cả 2 nguồn. Khác biệt DUY NHẤT ở tab Xem trước: generated =
  doc dựng-từ-thành-tích (có ô trống → phễu); uploaded = PDF gốc user (không ô trống → phễu qua dòng B + Góp ý).

### CTA-khóa (bắt buộc theo skill) — nằm ở đâu + tại sao
1. **State rỗng:** PRIMARY `[Vào khóa học]` — cả empty-state = phễu. (mạnh nhất, đúng chỗ tay-trắng nhìn đầu tiên.)
2. **Mọi state:** dòng B "còn N điểm → học nâng" link `/courses` — anchor bền, luôn thấy.
3. **Kết quả tab (pillar yếu):** trong Góp ý → "hoàn thành capstone/thử thách trong khóa → nâng điểm".
4. **Xem trước (ô trống doc):** slot dashed → CTA vào khóa cụ thể lấp mục đó.

### Đổi so với V3 §1→§9
- **GIỮ NGUYÊN** skeleton §9 (header → selector → tabs). **THÊM** dòng B (recruiter-unlock + phễu) ngay dưới header.
- **THAY** §5 empty-state ("mở tab Cấu hình") → **card lời mời vào khóa** (bake mindset).
- **ĐỊNH NGHĨA MỚI** state 5-CV (overflow `+N` drawer) + state mix-nguồn (icon source, Kết quả chung / Xem trước khác)
  — V3 chưa cover.
- Không cần BE mới cho layout; field đã có (`source`, `score`, `courseId`, `myCvGenerations`). Dòng B best-score +
  recruiter cần `jobReadiness.foundation.cvScore` / `getBestCvScore ≥ 70` (đã có ở BE).

### Grounded từ code (Explore scan 2026-07-05) — file + gap khi apply
- **Skeleton V3 §9 ĐÃ dựng đúng trong code:** `CvWorkspace/index.tsx:72–194` = header ("Các CV của bạn" +
  "+ Thêm CV mới" → `/profile/cv/edit`) → `FlexWrapButtonRadio` (chỉ khi `>1` CV, chip = VerdictIcon + label + score +
  kebab Sửa/Xoá) → `TabsCard` (Kết quả|Xem trước) → `CvScorecard`(result) / `CVPreview`(preview). Config sống ở route
  riêng `/profile/cv/edit` (`CVUpload` = CvFileCard + CourseTrackPicker + UploadSection + GenerateSection). Nguồn phân
  biệt bằng `cv.source` (`Uploaded`→file gốc / `Generated`→PDF tectonic).
- **GAP 1 (phễu — việc chính vòng này):** empty-state `CvScorecard/index.tsx:162–166` = `AsyncContent` "Chưa có CV
  nào / Tạo hoặc tải CV lên bên dưới" — **KHÔNG có link `/courses`** (agent xác nhận). → thay bằng **card LỜI MỜI vào
  khóa** (state Rỗng ở trên).
- **GAP 2 (dòng B):** chưa có dòng recruiter-unlock + best-score + "còn N → học" ở cấp trang → THÊM ngay dưới header.
- **GAP 3 (overflow):** selector `slice(0, CV_CHIPS_MAX=6)`, chưa có nhánh `+N`→drawer cho `>6` CV → thêm khi apply.
- **KHÔNG đổi:** cấu trúc tabs, route edit, source-detection, kebab — chỉ THÊM 3 gap trên (đều là bake phễu + state).

## Nguồn tham khảo
- Vòng 1: [Rezi Score explained](https://www.rezi.ai/rezi-docs/the-rezi-score-explained) · [Teal resume checker](https://www.tealhq.com/tool/resume-checker) · [Kickresume resume checker](https://www.kickresume.com/en/resume-checker/)
- Vòng 3 (mới, xác nhận pattern desktop-sidebar-thường-trực/mobile-xếp-chồng): tìm kiếm "resume builder app layout live preview sidebar always visible" — kết quả chỉ ra Resume.io/Novoresume giữ preview/sidebar thường trực trên desktop, thu gọn thành 1-lúc-1-vùng trên mobile.
- Vòng 7: LinkedIn profile-strength (ô thiếu = nudge) · Credly/Coursera (thành tích → hồ sơ) · Teal resume library (list nhiều CV) · pattern nội bộ chọn-lần-thử + fair-monetization.
- Nội bộ: `.claude/rules/layouts/sticky.md` · `.claude/rules/drafts/single-select-among-options-use-tabs.md` · `.claude/rules/drafts/when-rail.md` · `.claude/rules/concepts/fair-monetization-axiom.md` · `.claude/rules/drafts/attempt-history-selector-adaptive-and-grading-model-chip.md` · `UX-BRAINSTORM.md` (V1) · `UX-BRAINSTORM-V2.md` (V2).
