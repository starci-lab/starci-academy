# LINK các phần trong 1 khóa — connective UX + "next" CTA tự nhiên

> Brainstorm 2026-07-07. Thầy: *"UX thế nào để link tất cả các phần trong 1 khóa với nhau — đang học thì làm
> challenge, xong qua phỏng vấn thử… làm sao CTA tự nhiên nhất."* Grounded: surfaces THẬT của learn-shell + resume
> data (`myCourseOutline`/`currentTask`/`nextContentTask`) + mock-interview scorecard→module deep-link (đã có).
> Web refs: contextual "next up" + CTA specific dần theo hành trình + guided-path.

## Vấn đề
Course có ~8 surface (Nội dung · Thử thách · Flashcard · Phỏng vấn thử · Dự án/capstone · Practice · Leaderboard ·
Foundations/mind-map) — đều vào được qua icon-rail nhưng **siloed**. Đọc xong bài → KHÔNG gì bảo "làm challenge của
bài"; xong chương → KHÔNG gì bảo "phỏng vấn thử về nó". "Tiếp tục học" chỉ resume **nội dung**, không nối cross-surface.
Mỗi surface là 1 ốc đảo; học viên phải TỰ biết đường.

## Mental model — biến LOOP thành điều hướng
StarCi đã MARKET loop ở landing (`LearnLoopScroll`: đọc → chấm → capstone → rank). Fix = biến loop đó thành **spine
điều hướng THẬT trong khóa** — mỗi surface HAND-OFF sang rung kế ở đúng khoảnh khắc hoàn thành. Loop chuẩn per-module:

**Đọc bài → làm challenge của bài → (hết bài trong chương) → ôn flashcard chương → phỏng vấn thử chương → capstone
chương → chương kế → … → Job-ready.**

Mỗi "→" = **1 handoff CTA bắn ngay lúc hoàn thành**, gắn với việc vừa làm.

## 2 cơ chế (kết hợp)
1. **"Up Next" handoff card (decentralized → momentum):** mỗi surface KẾT bằng 1 card next-rung tính từ progress+
   context. Đây là cái làm CTA TỰ NHIÊN (đúng lúc + đúng ngữ cảnh + 1 primary). = đúng ví dụ của thầy.
2. **Course JOURNEY MAP (centralized → orientation):** 1 path có thứ tự (reframe content-home / mind-map, kiểu
   Duolingo/boot.dev) với surface = NODE, "bạn ở đây" + "kế tiếp". Backbone cho handoff card cưỡi lên.

## Chuỗi handoff CTA (grounded — mỗi cái bắn ở đâu)
| Vừa xong | Handoff CTA (contextual, primary) | Nguồn data |
|---|---|---|
| Đọc xong 1 bài (Content) | "Làm {N} thử thách của bài này →" (tab Challenges của bài) | lesson ↔ challenges của nó |
| Pass challenge của bài | bài kế OR (hết challenge chương) → "Ôn nhanh {N} thẻ của chương →" | outline + progress |
| Xong flashcard chương | "Phỏng vấn thử về chương này →" (mock-interview grounded chương) | module scope |
| Xong phỏng vấn thử (scorecard) | "Ôn lại {phase yếu} trong khóa →" (đã có) + "Làm capstone chương →" | scorecard→module deep-link (đã có) |
| Nộp capstone task | chương kế: "Bắt đầu chương {N+1} →" | milestone → next module |
| Hết khóa | "Khoe hồ sơ / recruiter thấy →" (Job-ready) | job-readiness band |
| Trial đụng tường | → ENROLL (nối brainstorm conversion) | isEnrolled gate |

## Nguyên tắc "CTA tự nhiên" (lõi câu hỏi thầy)
1. **Timed to completion** — hiện NGAY lúc xong (cưỡi momentum), không nằm trong menu.
2. **Contextual, không generic** — "Làm thử thách CỦA BÀI NÀY", không "Đến Thử thách". (web: descriptive CTA.)
3. **1 primary rõ** — 1 rung kế; lựa chọn khác để quiet. Không phải menu.
4. **Framed theo OUTCOME** — rung kế nhích meter Job-ready / capstone ("1 phỏng vấn nữa → lên band Job-ready").
   Nối Proof-to-Hire spine (brainstorm trước).
5. **Specific dần** — sớm "bắt đầu chương", muộn "hoàn thành capstone để xong track". (web: CTA specific dần.)
6. **Không dead-end** — mọi completion hand-off đi đâu đó (hoặc chương kế / showcase).

## 3 HƯỚNG (thầy chọn)
- **A — "Up Next" handoff cards** (decentralized momentum): mỗi surface kết bằng 1 next-rung card. Ít đổi cấu trúc,
  đúng "CTA tự nhiên" nhất, = đúng ví dụ thầy. ⭐ lõi.
- **B — Course JOURNEY MAP** (centralized spine): reframe content-home/mind-map thành path Duolingo/boot.dev, surface
  = node, "bạn ở đây/next". Orientation.
- **C — HYBRID (đề xuất):** MAP = home/backbone (orientation) + "Up Next" card ở mỗi completion (momentum). Ví dụ
  thầy (học→challenge→phỏng vấn) = đúng chuỗi handoff của A; MAP làm chuỗi đó legible.

## Grounding data lái "next"
`myCourseOutline`/`currentTask`/`nextContentTask` (content-first resume, đã có) · lesson↔challenges · module/milestone
(biết khi chương "xong") · mock-interview scorecard→weak module deep-link (đã có) + RAG chương · job-readiness band
(meter outcome) · capstone milestone task/chương. → có thể cần 1 BE resolver nhẹ `nextAction(position) → {kind,
target, reason}` (nhiều cái derive FE-side từ outline+progress).

## Refs
- [Learning platform CTA — contextual "next up", specific dần theo journey](https://medium.com/@taraneyarahmadi/the-ux-of-elearning-platforms-designing-for-engagement-clarity-and-outcomes-b33c5353b79b)
  · [Descriptive CTA ("Learn more" is not enough)](https://uxcontent.com/learn-more-is-not-enough-a-case-for-descriptive-cta/)
  · [Class Central guided-discovery / role-based path](https://www.feelpixel.in/blog/edtech-ux-design-class-central-case-study/)
  · Duolingo path / boot.dev skill-tree (guided path + momentum).
- Rules: [[resume-cta-only-when-away]] · [[continue-resumes-content-not-capstone]] · [[layout-must-funnel-to-courses-and-cover-full-data-state-matrix]]
  · [[course-home-no-duplicate-surfaces]] · [[single-select-among-options-use-tabs]] · Proof-to-Hire spine
  (TRIAL-CONVERSION-LAYOUT-BRAINSTORM.md).
