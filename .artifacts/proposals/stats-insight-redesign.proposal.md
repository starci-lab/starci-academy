# Proposal — Stats Insight Redesign (Ôn tập · Phỏng vấn · Hỏi nhanh)

> Status: ⏳ PENDING · Trigger: thầy "thống kê xàm quá, deep-think nên render gì, lên mạng điều tra để có insight". Brainstorm DATA-surface (3 tab Thống kê) với web research (thầy chỉ định) + deep-scan trần dữ liệu 2 repo.

## Vấn đề (chẩn đoán)
Các tab Thống kê hiện render **số vanity ngang hàng**: `39%` trơ · thanh Again/Hard/Good/Easy · count due `23` · forecast rỗng "không có thẻ" (đọc như HỎNG) · streak. Không con nào **diễn giải** hay **dẫn hành động** → thầy đúng: "xàm".

## Nguyên tắc (từ điều tra web — Anki/Duolingo/SuperMemo/LeetCode/interviewing.io/Exercism)
Một con số thành **insight** khi được 1 trong 4: **◎ so với TARGET** · **⏰ chiếu tương lai + hạn chót** · **▽ bổ nhỏ ra để lộ điểm yếu** · **→ gắn hành động cụ thể**. Mỗi zone = **Phán xử → Bằng chứng → Hành động**, KHÔNG scroll số.

## Prototype (bấm được)
`.artifacts/prototypes/stats-insight-redesign/index.html` — host `http://localhost:8093/`. Toggle **Màn** (Ôn tập/Phỏng vấn/Hỏi nhanh) · **Bản** (Insight mới ↔ Xàm hiện tại, chỉ Ôn tập) · **Máy**. Mỗi zone gắn khung-insight (◎⏰▽→) + nguồn-dữ-liệu (🟢 vẽ-được/gần-free · 🟡 đã-lưu-chưa-vẽ · 🟠 cần-aggregate-mới) + tên block thật.

## THIẾT KẾ per-surface (verdict → evidence → action)

### A. Ôn tập (Học thẻ) — surface "xàm" chính, ưu tiên 1
| Zone | Insight (thay số trơ) | Block | Nguồn |
|---|---|---|---|
| **Sức khoẻ trí nhớ** (hero) | "Bạn đang QUÁ TẢI — 39% vs mốc 85%" + split **mature 72% / young 31%** (vấn đề là nạp nhanh, không phải quên cái đã học) | `VerdictHeroCard` (mới, feature-comp) | 🟠 mature retention = events JOIN reviews(interval) |
| **Điểm yếu theo chủ đề** | full per-tag retention worst-first, "TB 71% giấu React Hooks 52%" → drill tag | `SurfaceListCard` | 🟢 query đã `GROUP BY tag`, chỉ **bỏ `LIMIT 1`** (proj L890) |
| **Sắp quên** | "12 thẻ sẽ tuột trước Thứ 5" + forecast có cảnh báo spike | `DeadlineCallout` (mới) | 🟠 đường suy giảm = interval + lastReviewed; forecast đã có (mở >7 ngày) |
| **Độ chín** | ladder non/đang-chín/chín, "chỉ 8% chín = tiến độ THẬT" | `MaturityLadder` (mới) | 🟠 bucket theo `intervalDays` |
| **Leech tập trung** | lapsed-sau-khi-học + stuck-Hard, "9 thẻ ăn 30% lần Quên → viết lại" | `SurfaceListCard` | 🟠 lapse (grade=0 khi reps>0) — hiện leech đếm mọi Again |
| **Thói quen** (hạ cấp) | streak→badge nhỏ + "nhớ tốt nhất buổi sáng 82%" + heatmap | `HabitCard` | 🟠 time-of-day từ `reviewedAt` (EXTRACT hour) |

### B. Phỏng vấn — đã giàu, thêm khung insight
| Zone | Insight | Nguồn |
|---|---|---|
| **Độ sẵn sàng** (hero) | "64/100, pass-bar 70, 3 phiên tăng đều → còn ~1 phiên" | 🟠 readiness curve (verdict+createdAt) + pass-bar const |
| **Chiều nào kéo xuống** | byAttribute + **lever**: "nâng tư duy-giải-quyết trước, đòn bẩy mạnh hơn giao tiếp" | 🟢 byAttribute đã có, thêm framing |
| **Theo NGÔN NGỮ** ⭐ | "TS 78 vs Go 45 — luyện Go" (hợp multi-lang vừa làm) | 🟠 nối `seedQuestions[i].givenCodes[0].lang` ↔ `questionReviews[i].score` theo index (hoặc thêm field `lang` vào questionReviews lúc write) |
| **Điểm yếu LẶP LẠI** | gộp `gaps[]` tần suất: "3/5 phiên đều thiếu bàn trade-off" | 🟡/🟠 `gaps[]` jsonb đã lưu mỗi attempt, cần cluster tần suất |
| byLevel (opt) | "mức Trung đạt, mức Cao mới 48" | 🟠 fold theo `level` (đã lưu) |

### C. Hỏi nhanh — mượn topic-breakdown + difficulty framing
| Zone | Insight | Nguồn |
|---|---|---|
| **Độ phủ vs mục tiêu** | "61%, còn 6/17 chủ đề chưa đụng, mục tiêu 80%" | 🟢 coverage đã có + target const + concept map |
| **Chủ đề yếu** | byTag worst-first (kèm "chưa làm bao giờ") | 🟢 byTag đã có sẵn ở quiz stats |
| **Độ khó đang làm** | "78% câu mức Dễ — phỏng vấn hỏi Trung/Cao, nâng lên" | 🟡 `level` mỗi quiz session đã lưu |

## Ma trận BUILD (field nào sẵn / mở BE / đổi schema)
- **render-là-xong (🟢, FE-only)**: bỏ `LIMIT 1` per-tag retention (1 dòng SQL), `reviewByDeck` (đã qua wire), trend-split-by-mode (đã trong payload), lever-framing byAttribute, coverage-vs-target, quiz byTag. → **quick win đợt 1**.
- **aggregate-BE (🟠, thêm field vào projection jsonb, KHÔNG migration)**: mature retention, maturity ladder (intervalDays), leech-lapsed, time-of-day, decay-forecast, byLevel, readiness-curve, recurring-gaps cluster. Mirror pattern `computeAggregate`/`computeReview` đã có.
- **đổi-schema**: KHÔNG bắt buộc. `durationMs` KHÔNG lưu (bỏ qua). Model-đã-chấm ở ledger AI riêng (bỏ qua). byLanguage sạch hơn nếu thêm field `lang` vào mỗi `questionReviews[]` lúc write (optional, không phá schema — jsonb).

## Files to touch (khi build)
- FE: `FlashcardReviewStats/index.tsx` (relayout 6 zone) · `MockInterviewStats/index.tsx` · `FlashcardQuizStats/index.tsx` · block mới `VerdictHeroCard`/`DeadlineCallout`/`MaturityLadder` (feature-local hoặc canonical `blocks/stats/*` nếu tái dùng).
- BE: projection services `user-flashcard-course-stats` (bỏ LIMIT 1 + thêm mature/ladder/leech/timeofday fields) · `user-mock-interview-course-stats` (byLevel/byLanguage/gaps-cluster/readiness) · GraphQL response types tương ứng.

## Verify plan
- BE tsc + boot runtime, GraphQL introspection field mới; FE tsc/eslint; runtime đi ma trận state (empty/thin/rich). Chú ý MIN gates (review ≥5 reviews, interview ≥3 attempts) — thin-data vẫn phải đọc như insight, không như tab hỏng.

## Quyết định chờ thầy
1. **Duyệt hướng "verdict→evidence→action" + 6 zone Ôn tập?** (xem prototype).
2. **Làm cả 3 surface hay chỉ Ôn tập trước?** (Ôn tập là "xàm" nhất).
3. **Đợt 1 chỉ quick-win 🟢 (FE-only + bỏ LIMIT 1)** rồi đợt 2 aggregate-BE, hay làm trọn 1 lần?
4. Con số target (retention 85%, pass-bar 70, coverage 80%) — thầy chốt hay để trò đề xuất chuẩn ngành.

## Bàn giao (3 thứ)
1. **Prototype**: `http://localhost:8093/` · file `.artifacts/prototypes/stats-insight-redesign/index.html`.
2. **Component → Storybook** (khi build): `VerdictHeroCard` (mới, story) · `DeadlineCallout` (mới, story) · `MaturityLadder` (mới, story) · `SurfaceListCard`/`SegmentBar`/`ProgressMeter` (tái dùng, +state demo). Chi tiết ở bảng dưới trong tin nhắn chốt.
3. **Nguồn**: web (Anki/Duolingo/SuperMemo/LeetCode/interviewing.io/Exercism — URL trong report agent) · deep-scan `$BE_SOURCE/src` (projection services + entities) + `$FE_SOURCE` stats components · KHÔNG concept doc (chưa có).
