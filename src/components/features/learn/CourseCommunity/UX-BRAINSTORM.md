# UX Brainstorm — Không gian xã hội TRONG khóa học ("cảm giác active, đẩy nhau học")

> `/starci-fe-ux-brainstorm` · 2026-07-06 · Opus. Feature MỚI (chưa có route/component). Course-scoped, KHÔNG global.

## Mục tiêu (thầy)
Học viên của CÙNG 1 khóa thấy nhau đang học → cảm giác cohort/đồng hành → **đẩy nhau học** (social accountability), giảm cảm giác học một mình. Ưu tiên số 1 = **cảm giác "active"**, KHÔNG phải thêm 1 kênh Q&A nữa.

## Ground truth — ĐÃ CÓ GÌ (đọc source thật, tránh trùng)
| Thứ đã có | Scope | Dùng cho | KẾT LUẬN |
|---|---|---|---|
| **Global community** (`/community`, `/community/chat`) — `CommunityPostEntity` (channel enum: General/Problems/FounderQa) + `ChatConversationEntity` (community room + founderDm) | **PLATFORM-WIDE** (author_id, KHÔNG course) | Feed + chat toàn nền tảng, mọi người trộn | KHÔNG phải cohort của "khóa tôi" → **gap thật** |
| **Per-lesson discussion** — `content-comment` + `content-reaction` + `content-discussion` gateway ("Thảo luận · N" dưới mỗi bài) | **content_id** (1 bài) | Hỏi đáp về ĐÚNG 1 bài | Quá vi mô, không tạo "không gian chung của khóa" |
| **Per-lesson AI tutor** — `content-ai-session/message` + gateway | enrollment | Chat AI theo bài | Khác mục đích (AI, không phải người-người) |
| **Leaderboard khóa** — course-scoped, `myRank` badge ở sidebar | course_id | Xếp hạng XP trong khóa | Đã có tín hiệu cạnh tranh/xã hội per-course (tái dùng được) |
| **Realtime infra** — Socket.IO gateways (community-chat, community-feed, content-discussion, content-ai, mock-interview): pattern room-join-per-scope + broadcast | — | — | **Primitive đã giải quyết** → course-room = cùng pattern, key mới = course/enrollment |
| **Presence** — CHỈ có `login_session.last_seen_at` / `device.last_seen_at` (auth-level) | — | — | KHÔNG có "ai đang học khóa X". Suy từ **socket room membership** (gateway biết ai connect) → presence rẻ, không cần bảng mới |
| **Signal hoạt động THẬT/khóa** (nuôi feed): challenge pass, XP/leaderboard, streak (flashcard), capstone milestone, flashcard due | course/enrollment | — | Rất giàu → biến thành social layer, KHÔNG cần bịa |

**Kết luận gap:** thiếu **1 KHÔNG GIAN XÃ HỘI SCOPE THEO KHÓA** (cohort của khóa này) — global community (mọi người) + per-lesson discussion (1 bài) đều KHÔNG cung cấp. Đây là thứ cần build.

## Ràng buộc thiết kế (từ rules + data thật)
- **Dead-room problem là rủi ro SỐ 1**: StarCi cohort NHỎ (landing: 3–7 học viên/khóa; System Design chỉ 3). 1 phòng chat trống = "phòng ma", tệ hơn không có. → thiết kế PHẢI **tự-nuôi** (self-populate) để không bao giờ trống.
- **KHÔNG fake social proof** ([[landing-sample-card-static-not-api]] / grounded-in-data): cấm "Lora from Auckland vừa tham gia" kiểu bịa. Mọi event xã hội = event THẬT của học viên thật trong khóa.
- **KHÔNG trùng surface đã có** ([[course-home-no-duplicate-surfaces]]): không lặp lại global community, không lặp "Thảo luận" per-lesson.
- **Course-scoped = key theo enrollment** (course-scoped-data-joins-by-enrollment): bảng mới FK `enrollment_id` (hoặc `course_id`), không `user_id` trần.
- **Nhà của feature = tab mới trong LearnShell sidebar**, nhóm `track` (orientation + motivation) — cạnh Leaderboard. Badge (tone mới, vd "active"/unread count) như Leaderboard `myRank` / Flashcard `due`.
- Realtime dùng lại pattern gateway sẵn có (room = `course:<id>`), presence suy từ room membership.

## 3 HƯỚNG (xem widget)
### A — Phòng cohort (chat-first)
1 phòng chat realtime/khóa + rail "đang học". **Ref:** Discord study-room (voice/text presence = accountability).
- ✅ Đơn giản, "active" rõ khi có người. ❌ **Dead-room**: cohort 3 người → chat vắng = phản tác dụng. ❌ Chat đồng bộ đòi nhiều người online cùng lúc (khó với cohort nhỏ, khác múi giờ).

### B — Dòng động lực (feed-first) ⭐ ĐỀ XUẤT
1 **activity feed course-scoped** TỰ SINH từ **event THẬT** (Minh vừa vượt challenge X · Huyền đạt streak 7 · Thành hỏi… · 4 người đang học hôm nay) **trộn** bài đăng/câu hỏi học viên. Header presence ("N đang học"). **Ref:** activity-feed pattern (learningplatforms.org) + Duolingo friend-streak/clubs (event-driven social) + social-proof feed.
- ✅ **Không bao giờ trống** — event hệ thống nuôi feed dù ít người chat → giải quyết dead-room tận gốc.
- ✅ **Grounded 100%**: tái dùng signal đã có (challenge/XP/streak/capstone) → biến thành lớp xã hội, đúng "đẩy nhau" (thấy người khác tiến bộ → FOMO tích cực).
- ✅ Async-friendly (hợp cohort nhỏ, lệch giờ) — không đòi online đồng thời.
- ✅ Tái dùng hạ tầng: `CommunityPost` (thêm scope course) cho phần người-đăng + broadcast gateway cho realtime prepend.
- ❌ Không "chat tức thời" bằng A (nhưng có thể thêm reply/comment vào post → đủ tương tác).

### C — Lai 2-pane (feed + board)
Rail presence+động lực (như B) + board thảo luận theo thread (kênh Hỏi đáp/Khoe/Chung). **Ref:** Coursera course forum + Circle cohort.
- ✅ Đầy đủ nhất. ❌ Nặng build. ❌ Kênh "Hỏi đáp" **dễ trùng** "Thảo luận" per-lesson đã có + "Problems" channel global → 3 chỗ hỏi đáp = loãng.

## CHỐT (đề xuất): **Hướng B — Dòng động lực**
Vì mục tiêu thầy là **"cảm giác active + đẩy nhau"**, KHÔNG phải thêm forum Q&A. B thắng vì: (1) tự-nuôi → sống cả khi cohort nhỏ (rủi ro chí mạng của A/C ở StarCi); (2) grounded từ signal thật đã có → build rẻ, không bịa; (3) "thấy người khác vượt bài/giữ streak" chính là cơ chế đẩy-nhau mạnh nhất (Duolingo: friend-streak +22% hoàn thành). Chat tức thời (A) có thể thêm sau như 1 lớp phụ nếu cohort lớn lên; giờ chưa cần.

## IA hướng B (chi tiết)
Route: `/courses/[courseId]/learn/community` · tab sidebar nhóm `track` (cạnh Bảng xếp hạng), badge = số hoạt động mới chưa xem.

| Vùng | Nội dung | Nguồn dữ liệu THẬT |
|---|---|---|
| **Header presence** | "N học viên đang học hôm nay" + avatar chồng (chấm xanh = online now) + "M hoạt động tuần này" | socket room membership (online) + đếm event 7 ngày (course-scoped) |
| **Composer** | avatar-led collapse→expand (như CommunityComposer đã có): "Chia sẻ tiến độ / hỏi cả lớp…" | `createCommunityPost` (scope course mới) |
| **Feed (trộn)** | (a) **event tự sinh** (icon + "X vừa vượt/đạt/hỏi") — challenge pass · streak milestone · capstone done · XP level-up; (b) **post người dùng** (text/markdown + react + comment) | (a) từ challenge-submission/xp/streak/milestone (course-scoped); (b) `CommunityPost` scoped |
| **Reactions/reply** | react + comment trên post (tái dùng `community-post-reaction`/`community-post-comment`) | đã có |
| **Realtime** | prepend event/post mới qua gateway room `course:<id>` (không cần refresh) | pattern community-feed gateway |
| **Nudge cross-surface** | Notification "có người vừa hỏi trong khóa của bạn" (dùng `NotificationEntity`) — bắn tiết chế | đã có notification system |

**States:** empty (cohort mới, 0 event) → vẫn hiện "Bạn là người tiên phong · học 1 bài để mở màn" + CTA về nội dung (KHÔNG để trống câm — [[labeled-section-render-empty-not-self-hide]]); loading skeleton mirror feed; error retry. Presence 0 online → "Chưa ai đang học — hãy là người đầu tiên" (honest, không fake).

## Cần BE mới (nêu rõ, không fake)
- **Bảng/emit event xã hội course-scoped**: hoặc bảng `course_activity_events` (enrollment_id, type, ref, created_at) ghi khi challenge pass/streak/capstone; HOẶC aggregate on-read từ các bảng sẵn có (challenge-submission, xp-history, milestone-attempt) filter theo course. → **quyết định ở `/starci-fe-layout-brainstorm` hoặc lúc apply** (hỏi BE).
- **CommunityPost scope theo course**: thêm cột `course_id`/`enrollment_id` nullable (global post = null; course post = set) + query `communityFeed(courseId)`.
- **Presence**: derive từ socket room `course:<id>` (đã có gateway pattern) — không cần bảng.
- Notification course-community: tái dùng `NotificationEntity` (thêm type).

## Nguồn tham khảo
- Activity-feed learning pattern — https://learningplatforms.org/activity-feed-design-pattern/
- Duolingo social (friend-streak +22%, clubs) — https://blog.duolingo.com/friend-streak/ · https://blog.duolingo.com/duolingo-leagues-leaderboards/
- Cohort social accountability (85% completion vs self-paced) — https://buddyboss.com/blog/what-is-a-cohort-based-course/
- Coursera course forums — https://www.coursera.support/s/article/learner-000001210
- Discord study-room presence — https://evepaper.com/discord-study-group-features/

## Bước tiếp
Thầy chọn hướng (đề xuất **B**) → `/starci-fe-layout-brainstorm CourseCommunity` (vẽ full layout + data-state matrix + quyết routing/BE) → `/starci-fe-ux-apply`.
