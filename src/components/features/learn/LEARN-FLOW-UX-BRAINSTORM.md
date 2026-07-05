# LEARN-FLOW — UX Brainstorm: đồng bộ quy trình 7 surface trong khu "learn"

> `/starci-fe-ux-brainstorm` · Opus/MAX · 2026-07-05. Phạm vi: TOÀN khu `learn` (không phải 1 trang) — 7 mục sidebar.
> Repo FE: `D:\Repositories\starci-academy` (mtp). BE: `D:\Repositories\starci-academy-backend`.
> **Chưa code.** Doc để chốt hướng → `/starci-fe-ux-apply`.

## 0. Vấn đề (thầy nêu)
Việc học "không liên quan lắm": 7 mục sidebar (Sơ đồ tư duy · Học phần · Nền tảng · Ôn tập · Phỏng vấn thử · Dự án cá nhân · Bảng xếp hạng) là **7 đảo NGANG HÀNG**, không có mạch nối thành 1 quy trình. Kỹ thuật sidebar (thu/giãn/scroll/active) ĐỀU ỔN — vấn đề là **cấu trúc thông tin + thiếu cầu nối**.

## 1. Chẩn đoán gốc (3 lỗi)
1. **7 mục bằng vai** → học viên không đọc ra đâu là đường chính (lõi bắt buộc) vs bổ trợ. Thực chất chỉ có **1 lõi tuyến tính** (Học phần → Dự án); 5 mục kia xoay quanh.
2. **"Đang ở đâu / việc kế" chỉ sống ở Học phần + Sơ đồ.** Vào Ôn tập/Phỏng vấn/Nền tảng là mất mạch — không biết học tới đâu, xong về đâu.
3. **Bổ trợ không bám lõi đúng lúc.** Flashcard/Phỏng vấn/Nền tảng lẽ ra được gợi ý NGAY tại bài đang học, thay vì để học viên tự mò sang tab.

Sản phẩm đã tự hứa loop ở landing (`LearnLoopScroll`: **đọc → làm → AI chấm → leo hạng**) nhưng in-app không thấy loop đó, chỉ thấy 7 icon.

## 2. Phân loại lại 7 surface theo VAI TRÒ (taxonomy)
| Nhóm | Surface | Vai | Data nền |
|---|---|---|---|
| **LÕI** (bắt buộc, tuyến tính) | **Học phần** | đọc → làm challenge (AI chấm) | `myCourseOutline` (tree + `isRead` + challenge status + `progress` + `nextContentTask`) |
| | **Dự án cá nhân** | capstone cuối, milestone tasks | `myCourseOutline.milestones[].tasks[]` (`completed`, `lastScore`) + `currentTask` |
| **BỔ TRỢ** (ôn/luyện/tra cứu) | **Ôn tập** | flashcard SRS ôn bài đã học | `myDueFlashcards(courseId, contentId?)` → `dueCount`/`newCount`; reverse deck→bài qua `flashcard_deck_contents` |
| | **Phỏng vấn thử** | mock interview, **grounded từ capstone** | `mockInterviewPrompts` = **các capstone task** + classic → THỰC RA đã bám lõi! |
| | **Nền tảng** | thư viện tài liệu **GLOBAL** | `foundationCategories`/`foundations` — **KHÔNG gắn khoá/module/bài** (orphan thật) |
| **THEO DÕI** (định hướng/động lực) | **Sơ đồ tư duy** | map "đang ở đâu" | `myCourseOutline` (đã có nút Continue → `nextContentTask`) |
| | **Bảng xếp hạng** | rank/XP động lực | `courseLeaderboard.myRank` (rẻ, projection-cached); XP = score + reads×3 + milestone×10 |

**2 phát hiện đắt:**
- **Phỏng vấn thử KHÔNG phải đảo lẻ** — BE `mockInterviewPrompts` lấy chính các **capstone task** làm đề → nó vốn đã gắn lõi (luyện nói cho đúng capstone mình sắp làm). Chỉ là UI chưa thể hiện quan hệ đó.
- **Nền tảng là thư viện GLOBAL** (không FK tới course/module/lesson) → nó là mục **lạc lõng thật sự** trong sidebar per-course. Đây là điểm cần quyết: giữ như "thư viện tra cứu" hay tách khỏi nav per-course.

## 3. Ba CƠ CHẾ đồng bộ (cái tạo ra "mạch")
Đây là phần "liên quan" thật sự — độc lập với việc chọn hướng nav:

### C1 — "Việc kế" xuyên suốt (persistent resume) · **data SẴN, rẻ**
1 dòng ghim đầu sidebar (hoặc top-bar) hiện ở **MỌI surface**: `▶ Tiếp tục · <tên bài/challenge kế>` từ `nextContentTask`. Đang ở Ôn tập/Phỏng vấn/Nền tảng vẫn thấy "đường về lõi". + mini progress ring `completionPercent` cạnh nó. → hết lỗi #2.

### C2 — Hub nudge gated-by-state trên "Học phần" · **data SẴN**
Trang Học phần home (đã có continue + progress + path) thêm 1 dải **nudge theo trạng thái THẬT** (ẩn khi = 0, KHÔNG phải grid link tĩnh — tuân [[course-home-no-duplicate-surfaces]]):
- `12 thẻ đến hạn hôm nay` → Ôn tập (`myDueFlashcards.dueCount`)
- `Luyện phỏng vấn capstone sắp tới` → Phỏng vấn (`mockInterviewPrompts` theo capstone kế)
- `Hạng #3 tuần này` → Xếp hạng (`myRank.rank`)

### C3 — Cầu nối contextual đúng lúc (bridges)
| Bridge | Trạng thái data |
|---|---|
| Bài học → flashcard bài đó (`LessonFlashcards` rail) | ✅ có sẵn |
| Flashcard → **quay lại bài nguồn** (đang THIẾU) | ✅ reverse `FlashcardDeckEntity.contents` có → làm được |
| Xong module → nudge "luyện phỏng vấn chủ đề vừa xong" | ✅ mock prompt theo capstone; cần map module→prompt (nhẹ) |
| Capstone task → "đọc lại bài liên quan" | ⚠️ **cần BE mới** (milestone không có FK tới content) |
| Bài học → "nền tảng liên quan" (Docker/K8s…) | ⚠️ **cần BE mới** (foundation global, không link bài) |

## 4. Ba HƯỚNG (IA/nav) + chốt

### Hướng A — Hub-only (bảo thủ, đụng nav ít nhất)
Giữ nguyên sidebar 7-flat. Chỉ làm **C1 + C2 + C3(phần có sẵn)**. Học phần thành nhạc trưởng qua nudge.
- ✅ Rẻ nhất, blast radius nhỏ. ✅ Fix lỗi #2, #3.
- ❌ Sidebar vẫn nhìn "7 đảo bằng vai" → **không fix lỗi #1** (perception).
- Ref: Codecademy "new dashboard" (gom progress + browse về 1 chỗ).

### Hướng B — Regroup theo VAI + C1/C2/C3 ⭐ **CHỐT**
Sidebar chia **3 nhóm CÓ NHÃN** (thay 2 nhóm study/practice không nhãn hiện tại):
- **Lộ trình** — Học phần · Dự án cá nhân
- **Ôn & Luyện** — Ôn tập · Phỏng vấn thử · Nền tảng
- **Theo dõi** — Sơ đồ tư duy · Bảng xếp hạng

\+ đủ C1 (resume ghim) + C2 (hub nudge) + C3 (bridges).
- ✅ Fix cả 3 lỗi: nhãn nhóm cho học viên đọc ra hierarchy (lỗi #1); resume xuyên suốt (lỗi #2); bridges (lỗi #3).
- ✅ `SidebarNavGroup` đã hỗ trợ group + label (element/sidebar.md §2) → regroup là đổi data hook + thêm nhãn, blast radius vừa.
- ⚖️ Trade-off: đổi thứ tự/nhãn nav (học viên quen layout cũ). Chấp nhận được vì rõ hơn hẳn.
- Ref: NN/g contextual navigation; goal-driven coherent path (arxiv 2510.13215); mindset "1 primary action + hierarchy".

### Hướng C — Single-spine "Lộ trình một trục" (radical, Duolingo-path)
Gộp sidebar về 1 surface CHÍNH "Lộ trình" = timeline liền mạch đọc→làm→capstone; bổ trợ thành rail phụ/contextual; meta (sơ đồ/xếp hạng) thành chip top-bar.
- ✅ Cảm giác "1 hành trình" mạnh nhất.
- ❌ Rebuild lớn; khoá có nhiều nội dung song song (mind-map, foundations, 95 bài) không nhét vừa 1 trục tuyến tính; over-reach cho giờ.
- Ref: Duolingo learning path — nhưng khoá StarCi rộng hơn 1 path đơn.

**→ CHỐT: Hướng B.** Fix cả 3 lỗi, phần lớn data sẵn, blast radius vừa. Làm theo lớp: **C1 + C3(có sẵn) trước** (rẻ, tác động nhanh) → **B regroup + C2 nudge** → sau cùng cân nhắc BE mới cho 2 bridge còn thiếu.

## 5. Quyết định cần thầy chốt
1. **Nền tảng (global) đặt đâu?** Giữ trong "Ôn & Luyện" như thư viện tra cứu (de-emphasize) HAY tách khỏi nav per-course? (Trò nghiêng: giữ, nhưng cần BE link foundation→bài sau này mới thật sự "liên quan".)
2. **Resume ghim ở đâu?** Đầu icon-sidebar (luôn thấy, kể cả collapsed → chỉ icon ▶) HAY 1 dải top-bar mỏng?
3. **Phỏng vấn thử** đổi tên/định vị thành "Luyện phỏng vấn (capstone)" để lộ quan hệ với Dự án cá nhân?

## 6. Cắt / Thêm
- **Thêm:** resume rail ghim (C1) · hub nudge strip (C2) · nút "quay lại bài" ở flashcard (C3) · nhãn 3 nhóm sidebar (B).
- **Cắt:** không thêm grid link tĩnh trên home (tránh duplicate sidebar — [[course-home-no-duplicate-surfaces]]); nudge phải gated-by-state (ẩn khi 0).
- **BE mới (defer, chỉ khi thầy muốn "liên quan" sâu):** `MilestoneTask.relatedContentIds` (đọc lại bài trước capstone) · foundation→lesson link (nền tảng theo bài).

## 7. Empty/loading/error
- Resume: `nextContentTask` null (học hết) → "Hoàn thành tất cả" thay vì ▶.
- Nudge: mỗi cái tự ẩn khi state = 0 (0 thẻ đến hạn → ẩn dòng flashcard).
- Rank nudge: chưa có XP → ẩn (đừng show "#—").
- Skeleton mirror dải nudge; a11y: resume rail có `aria-label`, nudge là link có label rõ.

## Ref
- [Codecademy — The New Dashboard](https://news.codecademy.com/the-new-dashboard) (gom progress + browse)
- [NN/g — Contextual menus/navigation](https://www.nngroup.com/articles/contextual-menus/)
- [Goal-driven learner path modeling (arXiv 2510.13215)](https://arxiv.org/pdf/2510.13215)
- Memory rules: [[course-home-no-duplicate-surfaces]] · [[three-tier-page-layout]] · [[elements/sidebar]] · [[continue-resumes-content-not-capstone]] · landing `LearnLoopScroll` (loop read→build→grade→rank).
