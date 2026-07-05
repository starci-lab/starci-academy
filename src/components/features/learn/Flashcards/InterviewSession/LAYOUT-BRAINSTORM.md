# Layout Brainstorm — "Hỏi nhanh" Recap screen (post-CRITIQUE redesign)

> Chạy `/starci-fe-layout-brainstorm`. Scope: implement 5 resolution đã chốt ở `CRITIQUE.md` — vẽ layout cho phase `recap`
> của `InterviewSession/index.tsx` (mode+level setup và active phase GIỮ NGUYÊN, không đụng). Grounded từ 2 Explore
> agent (BE data feasibility + FE component structure) — trích dẫn file:line trong bảng bên dưới.

## Khung màn (không đổi)
- **Không rail** (đã chốt ở `when-rail`/`rating-scale-row-and-page-internal-rail-layout` — mode Phỏng vấn không có list đủ nuôi rail). 1 cột centered `max-w-3xl`, đứng trong pane của `Flashcards` (mode tabs Study/Rapid-recall nằm Ở TRÊN, không đổi).
- **Recap KHÔNG có tab con** — 1 stack dọc các card, KHÔNG chia tab. (Khác giả định ban đầu — recap chỉ cần đủ layout 1-cột, không cần cấu trúc tab.)

## Grounded data (từ 2 agent, dùng để quyết layout)
| Cần | Trạng thái | Nguồn |
|---|---|---|
| Trial vs enrolled thật | ✅ có sẵn | `EnrollmentEntity.isEnrolled` (enrollment.entity.ts:126) |
| Readiness threshold cho AI Mock Interview | ✅ tái dùng | job-readiness bands (`JOB_READINESS_BUILDING_THRESHOLD=40`, `JOB_READY=70`, window 5 attempts) — MVP dùng `myFlashcardStats` mastery/retention (đã có, rẻ) làm proxy thay vì tạo tracking mới |
| Daily XP cap pattern | ✅ tái dùng | `DAILY_NEW_LIMIT=20` (flashcard-review.service.ts:55) → mirror thành `DAILY_QUIZ_XP_CAP` |
| Weak-tag per-card breakdown | ❌ THIẾU — cần field mới | `CompleteFlashcardQuizSessionRequest` hiện chỉ có aggregate `answeredCount`+`coverageScore` (flashcard-quiz-session.ts:5-15), KHÔNG có per-card. → Phase 1 (MVP) dùng fallback "chưa đủ dữ liệu chi tiết"; Phase 2 (sau khi BE thêm per-card payload) mới hiện weak-tag cụ thể. |
| Session history/coverage theo thời gian | ⚠️ 1 phần | `myXpHistory` có sẵn nhưng thiếu `metadata` jsonb lưu coverage/tag — cần thêm cột (nullable, additive, không breaking) |
| Component tái dùng cho nudge | ✅ | `Callout` (blocks/feedback/Callout) — tint + action button, không card-in-card |
| Component tái dùng cho upsell | ✅ | Anatomy `EnrollGate` (icon badge + title + desc + CTA), nhưng render TRONG recap card (không full-page) |
| Route "học lại bài" | ✅ | `pathConfig().locale().course(displayId).learn().module(moduleId).content(contentId).build()` |
| Route AI Mock Interview | ✅ | `pathConfig().locale().course(displayId).learn().mockInterview().build()` |

## Bảng khối → vị trí → vai → lý do
| # | Khối | Vị trí | Vai | Lý do (WHY) |
|---|---|---|---|---|
| A | Header (title "Kết quả phiên" + headline) | Trên cùng | — | Không đổi (đã đúng) |
| B | 3-metric grid (Best combo · XP earned · Avg coverage) | Dưới A | Info readout | Không đổi — nhưng khi daily-cap chạm trần, XP earned hiện `+0` kèm muted note "Đã đạt giới hạn hôm nay" (minh bạch, không để user tưởng lỗi) |
| **C (MỚI)** | Weak-tags insight card | Ngay dưới B | **Chứa PRIMARY CTA** (khi có data) | Đây là demand-bridge — kéo user từ "chơi xong" sang "học tiếp". Đặt NGAY dưới metric (đọc liền mạch: "bạn vừa làm được gì" → "vậy giờ làm gì tiếp") — theo F-pattern đọc trên-xuống. |
| **D (MỚI, conditional)** | AI Mock Interview readiness Callout | Dưới C | Secondary/tertiary (locked) hoặc nổi bật hơn (unlocked) | Đặt SAU weak-tags vì đây là bước "tiến xa hơn" (interview thật), không phải bước ngay-lập-tức. Locked-state vẫn hiện (minh bạch ngưỡng), không ẩn hẳn. |
| **E (MỚI, chỉ trial)** | Enroll-upsell card | Trên cùng nội dung phụ (ngay dưới B, TRÊN C nếu trial) | **PRIMARY khi trial** | Trial user: mở khóa đầy đủ quan trọng hơn "học lại 1 bài" (họ chưa sở hữu khóa) → CTA-khóa phải là hành động nổi bật nhất. Đây chính là course-CTA funnel bắt buộc của mindset. |
| F | Footer note + "Practice more" | Dưới cùng | Secondary (đổi từ Primary cũ) | Hạ cấp: lặp lại quiz không còn là hành động được khuyến khích nhất — ưu tiên đẩy user về học thật (C) hoặc enroll (E). |

## CTA-khóa nằm ở đâu (bắt buộc theo mindset)
- **User TRIAL** → Zone E (Enroll-upsell) = PRIMARY button "Mở khóa đầy đủ khóa {course}" → `PaymentFlow.CourseEnroll`. Đây LÀ course-CTA funnel trực tiếp.
- **User ĐÃ ENROLL** → Zone C (weak-tag lesson-link) = PRIMARY "Học lại bài {lesson}" → kéo về nội dung khóa thật (tinh thần "vòng khép luôn kéo về học", dù không phải `/courses` catalog literal vì đã trong khóa rồi).
- **Không có weak-tag data (rỗng)** → Zone C fallback PRIMARY "Tiếp tục học" → `learn().module()` tổng quát (an toàn, vẫn kéo về khóa).

## MA TRẬN STATE ĐẦY ĐỦ (6 state, xem widget)
1. **Rỗng** — chưa có weak-tag insight (session đầu / Phase-1 chưa có per-card data) + dưới ngưỡng readiness + đã enroll → Zone C = generic "Tiếp tục học", Zone D = locked.
2. **1** — đúng 1 weak-tag → Zone C = 1 card "Học lại bài X" (PRIMARY).
3. **N (+ unlocked)** — 2-3 weak-tag (ranked) + đã đạt ngưỡng readiness → Zone C list top-3, Zone D = unlocked bright Callout "Sẵn sàng thử AI Mock Interview →".
4. **Overflow** — >3 weak-tag → Zone C hiện top-3 + `ScrollShadow` cuộn nhẹ trong CÙNG card cho phần còn lại (KHÔNG cắt câm, KHÔNG cần drawer riêng vì card đã đủ chỗ).
5. **Mixed (trial)** — user trial → Zone E xuất hiện là PRIMARY, Zone C xuống secondary (link nhỏ hơn), Zone D ẩn (chưa liên quan khi chưa enroll thật).
6. **Special (daily-cap)** — đã chạm trần XP/ngày → Zone B hiện `+0 XP` kèm ghi chú minh bạch, Zone D locked kèm % hiện tại vs ngưỡng.

## Nguồn tham chiếu
- [[when-rail]] (không rail cho mode Phỏng vấn) · [[when-drawer]] (cân nhắc nhưng KHÔNG cần — card đủ chỗ cho overflow) · [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]] (mọi rỗng = phễu, ma trận đủ state) · [[fair-monetization-axiom]] (upsell = "học để kiếm", không phải "trả tiền tắt" — copy phải giữ giọng này).
