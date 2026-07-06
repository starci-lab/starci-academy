# Layout Brainstorm — Course Q&A ("Hỏi đáp khóa": compounding + founder-anchored)

> `/starci-fe-layout-brainstorm` · 2026-07-06 · Opus. Hướng đã chốt sau `/starci-fe-critique` (bỏ FOMO/feed/chat-bubble; social layer = Q&A tích luỹ, neo founder). NO code.

## Scope = CẢ feature (2 surface) + quyết routing
| # | Surface | Route/vị trí | "Rời hay không rời"? |
|---|---|---|---|
| **S1** | **"Hỏi bài" tại bài học** (contextual ask) | SECTION trong lesson reader (nâng cấp "Thảo luận" đã có: `content-comment`) — cùng shell bài học | **KHÔNG rời** — hỏi là 1 TRẠNG THÁI của bài (hỏi tại chỗ kẹt). Giữ trong lesson reader, KHÔNG tách route. |
| **S2** | **"Hỏi đáp khóa"** (roll-up + trả lời + archive) | **Route MỚI** `/courses/[id]/learn/qa` + tab sidebar nhóm `track` (cạnh Bảng xếp hạng) | **RỜI** — là 1 collection duyệt-được của cả khóa, ngang hàng Leaderboard/Mind-map (đều là route riêng trong learn shell). Nhất quán scheme "1 learn-surface = 1 route" đã có. |

**URL scheme: KHÔNG có xung đột cần vá** — learn shell đã nhất quán "mỗi surface = 1 route dưới `/learn/`" (content, flashcards, leaderboard, mind-map…). Chỉ THÊM `/learn/qa`, không đụng cái cũ. (Khác vụ CV `?tab=` vs `/cv/edit` — ở đây không lệch.)

## Khung màn (shell)
Cả 2 surface dùng `LearnShell` (sidebar icon-rail trái đã có). **KHÔNG thêm left-rail thứ 2** ([[when-rail]]: default không rail; chưa "kiếm được" — filter đủ dùng bằng toolbar). Cột nội dung `p-6` centered `max-w-3xl` ([[three-tier-page-layout]] / [[learn-content-padding-shell-p6]]).

### S2 — Route `/learn/qa` (surface chính, MỚI) — bố cục dọc
| Vùng | Ở đâu | Vai | Tại sao chỗ này |
|---|---|---|---|
| **A · PageHeader** | trên cùng | — | breadcrumb (`Home › Course › Hỏi đáp`) + title "Hỏi đáp khóa này" + desc 1 dòng. [[elements/header]]. |
| **B · "Không học một mình" strip** (honest, KHÔNG FOMO) | dưới header, PHẲNG (không card) | secondary | 1 dòng aggregate THẬT: "12 người đã học khóa này · N câu đã được founder trả lời". Con số TỔNG (không concurrent). Đây là cảm giác đồng hành trung thực còn lại sau critique. |
| **C · Toolbar** (filter + search + count) | dưới B | — | `TabsCard` filter **[Chưa trả lời · Đã trả lời · Của tôi · Tất cả]** (single-select đổi list → underline nav, [[single-select-among-options-use-tabs]]) + search + result-count phải ([[list-surface-anatomy-search-count-list-pagination]]). "Chưa trả lời" = queue của founder. |
| **D · Composer "hỏi chung khóa"** | dưới toolbar, avatar-led collapse→expand | **secondary** | Câu hỏi KHÔNG thuộc bài nào (lộ trình/capstone/chung). Câu về-1-bài thì hỏi ở S1. Reuse `CommunityComposer` pattern. |
| **E · List câu hỏi** (thread cards) | thân trang | **PRIMARY** | Mỗi item: câu hỏi (clamp) + người hỏi (avatar) + **tag nguồn** ("Bài: Indexing…" ↔ "Chung") + **status chip** (Đã/Chưa trả lời) + số trả lời + **badge founder** nếu founder đã đáp (reuse `isFounderAuthor`) + reactions. Bấm → mở thread. |
| **F · Pagination** | cuối list | — | căn trái + hover, ẩn khi 1 trang ([[list-pager-left-align-and-hover]]). |
| **CTA-KHÓA (bắt buộc)** | (1) mỗi item lesson-scoped **link về bài** → kéo vào HỌC; (2) empty-state → [Vào nội dung khóa] | phễu | Vòng: kẹt→hỏi→được đáp→**học tiếp**. Mọi item là cửa vào 1 bài. |

### S1 — Section "Hỏi bài" trong lesson reader (nâng cấp cái đã có)
| Vùng | Ở đâu | Vai | Tại sao |
|---|---|---|---|
| **Archive line** (compound) | đầu section | secondary | "12 người đã học bài này · **3 câu hỏi đã được trả lời**" → click xổ các câu cohort TRƯỚC đã hỏi+được đáp. **Đây là engine thắng bài toán mật độ**: cohort sau hưởng lợi từ trước. |
| **Composer** | dưới archive | secondary | avatar-led "Kẹt chỗ này? Hỏi cả lớp + founder…" |
| **Thread list** | dưới | PRIMARY của section | câu hỏi về ĐÚNG bài này + badge founder + status answered. |
| **CTA-khóa** | section chỉ hiện khi đã enrolled/login; trial chưa enroll → "Đăng ký khóa để hỏi + xem giải đáp" (premium-gate = enroll, [[premium-gate-is-enrollment-not-vip]]) | phễu | |

## Cấu trúc TAB (S2) — render nội dung từng tab
Toolbar filter = 4 tab (đổi CÙNG list E, khác query):
- **Chưa trả lời** (default): list các câu `status=unanswered`, sort cũ→mới (queue) → founder/peer thấy việc cần làm. Empty tab → "Cả lớp đã được giải đáp hết 🎉".
- **Đã trả lời**: list `answered`, founder-answer nổi lên đầu mỗi thread. Đây là kho tham khảo.
- **Của tôi**: câu người dùng đã hỏi (theo dõi được đáp chưa).
- **Tất cả**: gộp, sort recency.

## MA TRẬN STATE (S2 roll-up — cover all test case)
| State | Layout |
|---|---|
| **Rỗng (0 câu)** | Ẩn toolbar/list. Card LỜI MỜI: "Chưa có câu hỏi nào trong khóa. Mở một bài và hỏi khi bạn kẹt — founder sẽ trả lời." + **[Vào nội dung khóa] PRIMARY** (phễu). KHÔNG để trống câm ([[labeled-section-render-empty-not-self-hide]]). |
| **1 câu** | Ẩn pager; filter tabs vẫn hiện (nhẹ); 1 thread card + composer. |
| **N câu** | Đủ: strip B + toolbar C (filter+search+count) + composer D + list E + pager F. |
| **Overflow (>1 trang)** | Pager F hiện (căn trái, hover). Search/filter thu hẹp. |
| **Mixed-variant** | (a) **nguồn**: lesson-scoped (tag "Bài: …", link về bài) ↔ course-general (tag "Chung") — icon/tag phân biệt. (b) **status**: answered (chip success + founder-badge nếu có) ↔ unanswered (chip muted). Xử lý hiển thị GIỐNG nhau, chỉ khác tag+chip. |
| **Đặc biệt — founder view** | Cùng layout; "Chưa trả lời" là queue hành động; founder có nút **Ghim/Phong** (founder-only, reuse `set-community-post-pinned`) đưa 1 câu trả lời hay thành FAQ đầu bài. |
| **Đặc biệt — trial chưa enroll** | Đọc được (archive + đã trả lời) nhưng composer/hỏi → "Đăng ký khóa để hỏi" (enroll-gate). Phễu vào checkout khóa. |
| **Loading / error** | skeleton mirror list (thread card rows) ; error → retry. `AsyncContent`. |

## BE cần thêm (nêu rõ, KHÔNG fake — quyết lúc apply / hỏi BE)
1. **`content-comment` course-scoped roll-up query** — `courseQuestions(courseId, filter, search, page)` gom câu hỏi mọi bài của khóa (+ câu "chung khóa"). *Chưa có* (chỉ có per-post comments + discussion per-content).
2. **`isFounderAuthor` cho content-comment** — hiện chỉ community mới có (mapper `community-comment-node`). Thêm badge founder cho discussion comment (reuse `envConfig().community.founderUsername`).
3. **Trạng thái `answered`/`resolved`** trên câu hỏi (hoặc suy: có ≥1 reply của founder = answered). Cột mới HOẶC derive-on-read.
4. **Câu hỏi "chung khóa"** (không thuộc content): cần 1 chỗ chứa — hoặc `content-comment` với `content_id` null + `course_id`, hoặc reuse `CommunityPost` scope course + channel "courseQa". Quyết ở apply.
5. **Aggregate counts** cho strip B + archive line (đếm learner đã học bài/khóa + số câu đã trả lời) — reuse projection/enrollment.
6. Realtime prepend (câu mới / founder vừa đáp) — reuse `content-discussion` gateway pattern (room `course:<id>`). Notification "founder trả lời câu của bạn" → reuse `NotificationType.CommunityReply`/`CommentReply`.

## CẮT (so với hướng FOMO cũ)
- ❌ FOMO engine · ❌ presence "đang học" realtime · ❌ chat bong bóng course riêng · ❌ feed page vanity.
- (Optional, defer) strip "ăn mừng capstone" opt-in — KHÔNG thuộc MVP Q&A.

## Refs
- Udemy Q&A (per-lecture, instructor-answered, upvote) · Coursera course forums (per-course roll-up) — https://www.coursera.support/s/article/learner-000001210
- StackOverflow answered/accepted + unanswered-queue pattern (status chip, founder = accepted-answer authority).
- Activity-feed pattern (aggregate honest, không FOMO) — https://learningplatforms.org/activity-feed-design-pattern/

## Bước tiếp
Thầy duyệt layout (widget dưới) → `/starci-fe-ux-apply CourseCommunity` (dựng S1 nâng cấp + S2 route mới + BE roll-up query). Verify tsc/eslint + mắt.
