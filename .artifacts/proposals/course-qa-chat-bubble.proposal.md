# Proposal — CourseQa: không gian hỏi-đáp SOCIAL (chat bubble + tương tác cả lớp)

> Prototype bấm-được: `.artifacts/prototypes/course-qa-chat-bubble/index.html`, host **http://localhost:8080**
> (4 màn: 1· Danh sách social · 2· Hội thoại đầy đủ · 3· Tương tác 6-cảm-xúc + chấm data · 4· Mobile).

## Định vị (thầy chốt hướng 2026-07-19)

Không phải "kênh chat riêng với founder". Đây là **không gian hỏi-đáp XÃ HỘI của cả lớp**: đặt câu hỏi ·
cả lớp + founder cùng trả lời · thả cảm xúc · theo dõi người · thấy ai đang tham gia. Founder chỉ là **một
người tham gia nổi bật** (badge verified), không phải trục duy nhất. Toàn bộ render như một dòng hội thoại
(chat bubble), phủ đầy đủ lớp social — nhưng CHỈ những social layer có **dữ liệu thật** chống lưng.

## Data ceiling — deep-scan 2 repo (grounded, không bịa)

Đã fan-out deep-scan FE (`starci-academy`) + BE (`starci-academy-backend`). Phát hiện cốt lõi: **hệ 6-cảm-xúc
Facebook + comment phân luồng + đồ thị follow ĐÃ TỒN TẠI và ĐÃ nối mutation thật** — roll-up Q&A chỉ đang
KHÔNG dùng phần lớn nó. Cấu trúc: câu hỏi = top-level `content_comment`; answer = reply. Node roll-up
(`CourseQuestionNodeObject`) MỎNG, còn node comment bài học (`CommentNodeObject`) GIÀU (đã có `reactions`,
`isDeleted`) — cùng 1 bảng, khác selection.

### 🟢 CÓ NGAY (persisted + đã có mutation — thiết kế thoải mái)
- **Reaction 6-cảm-xúc trên câu TRẢ LỜI** — `comment_reactions` (like/love/haha/wow/sad/angry), aggregator
  `ReactionService.summarizeComments()` trả `{counts[], total, myReaction}`; mutation `reactToComment`.
  Block FE sẵn: `features/community/Discussion/ReactionBar` + `FacebookReactionSelector` (SVG Fluent Emoji
  `/public/reactions/*.svg`, không lib ngoài) + `blocks/feed/ReactionBar`.
- **Thread nhiều người**: reply/edit/delete/nest, `editedAt`, `isDeleted` (soft), `replyCount`,
  `answeredByFounder`, `isFounderAuthor` — mutation `createComment/updateComment/deleteComment` đủ.
- **Theo dõi người** — `setFollow` mutation + `FollowButton` block (có `quiet` mode) + `UserEntity`
  `followerCount/isFollowedByMe`.
- **Social proof** — `course_stats_projections.enrollmentCount` ("N học viên") + course leaderboard.
- Filter chưa/đã/của-tôi + search + pager (đã có).

### 🟠 BE RẺ (persisted rồi, chỉ chưa expose/emit — 1 file, KHÔNG migration)
- **Reaction trên chính CÂU HỎI** (node roll-up chưa select `reactions`) — enrich
  `CourseQuestionNodeObject` cho khớp `CommentNodeObject` + gọi `summarizeComments` trong
  `course-questions.service.ts` (y hệt `content-comments.service.ts:63-76` đã làm). Không bảng mới.
- **Filter "Sôi nổi nhất"** — sort theo (reaction + reply). Cần thêm 1 sort option ở resolver.
- **Notify-khi-được-trả-lời** — `NotificationType.CommentReply` đã định nghĩa nhưng **chưa bao giờ emit**;
  chỉ cần nối listener trên `EventName.CommentCreated` (đã có event) → `createNotification`. Không bảng mới.

### 🔴 SCHEMA MỚI (chưa persisted — HỎI THẦY có làm không, hay để sau)
- Chấp-nhận-câu-trả-lời (best/accepted answer) — không có cột `isAccepted`.
- Upvote/điểm kiểu StackOverflow — không có cột score/bảng vote (reaction ≠ vote).
- Ghim câu hỏi — pin chỉ có ở `community_posts`, không ở `content_comments`.
- @mention — body là text thô, không parse/join mention.
- Người-đang-online / typing / presence — KHÔNG tồn tại (chỉ có content mock dạy học, không nối user thật).
- Đếm share — `shareCount` là field reserved luôn = 0.

## Luồng + shell (job → shell)

| Surface | Job | Shell | Ghi chú |
|---|---|---|---|
| Danh sách câu hỏi | duyệt N hội thoại + đặt câu hỏi | centered reading column trong learn shell (giữ `max-w-3xl`) + composer pill trên + toolbar filter | KHÔNG đổi shell ngoài (vẫn `search-filter-list-surface`), chỉ đổi HÌNH item |
| 1 hội thoại | đọc + tham gia 1 cuộc trao đổi xã hội | cùng cột, header hội thoại (asker + follow + participant count) → mạch bubble → composer đáy | Xem "chờ chốt" #1: route riêng vs expand-inline |

## Element-aware — block THẬT dùng để build

| Khối | Block thật | Ghi chú |
|---|---|---|
| Bubble trái/phải (câu hỏi + answer) | `blocks/feed/ChatBubble` | `role: isMine ? "user" : "assistant"`; áp cho CẢ câu hỏi lẫn answer |
| Reaction bar 6-cảm-xúc + summary | `features/community/Discussion/ReactionBar` + `FacebookReactionSelector` (đã có) | bê thẳng vào từng bubble; câu hỏi cần BE rẻ để có `reactions` |
| Reaction chip neo góc bubble (messenger-style) | nhỏ, dựng từ summary có sẵn | hiển thị top-emoji + total dưới góc bubble |
| Avatar + tên + badge + giờ quanh bubble | `blocks/identity/UserAvatar` + text, wrapper ngoài ChatBubble | ChatBubble không tự vẽ identity |
| Participant avatar group (header hội thoại + inbox row) | `blocks/identity/AvatarGroup` (đã có) | "ai đã tham gia trả lời" |
| Follow người hỏi | `features/community/FollowButton` (đã có, `quiet`) | header hội thoại + hover inbox row |
| Status badge (đã/chưa trả lời, founder-đã-trả-lời) | `Chip` HeroUI, logic hiện tại `replyCount>0` + `answeredByFounder` | đặt dưới bubble câu hỏi + chấm màu ở inbox |
| Dòng inbox | tái cấu trúc `QuestionRow` collapsed: 1 card bọc N-row flush (chuẩn `fe-card-padding-p3-rule`) | thay N-`Card` rời |
| Composer (đặt câu hỏi + trả lời) | `blocks/feed/Composer` (chat pill, dùng trong `ChatPanel`) | thay `CommentComposer` — xem chờ-chốt #2 |
| Reaction/reply/edit/xoá dưới bubble | logic `CommentItem` hiện tại | chỉ đổi chỗ đặt |
| Reply-to-reply | tag `↳ trả lời {tên}`, flatten theo thời gian | tránh bubble bóp hẹp khi lồng sâu |

### Cần MỚI (feature-local, KHÔNG canonical block)
- **`QaMessageBubble`** (`CourseQa/QaMessageBubble/`) — wrapper DUY NHẤT cho mọi tin nhắn (câu hỏi + answer):
  `ChatBubble` + `UserAvatar` + identity + reaction bar/summary + slot status-badge (câu hỏi) + hàng
  reply/edit/xoá. Nhận `node`, `isMine`, `isFounder`, `reactions`, callbacks.
- **`QaInboxRow`** (`CourseQa/QaInboxRow/`) — dòng preview: avatar + tên/giờ + preview 2 dòng + participant
  avatar-group + reaction summary + reply count + status badge + chấm màu + follow (hover).
- **`QaConversationHeader`** (`CourseQa/QaConversationHeader/`) — header hội thoại: asker identity + follow +
  "N người tham gia · M cảm xúc".

## State-matrix

- **Danh sách rỗng** — giữ invitation card funnel-vào-nội-dung hiện tại.
- **Danh sách N** — inbox row + chấm màu quét nhanh trạng thái; filter "Sôi nổi nhất" (BE rẻ).
- **Hội thoại 0 answer** — bubble câu hỏi + status "Chưa trả lời" + composer.
- **Hội thoại N answer nhiều người** — bubble xen trái/phải, founder viền, reaction/follow, reply flatten.
- **Overflow** — `max-w-[85%]`.

## Files to touch (FE + BE rẻ)

**FE**
- `CourseQa/index.tsx` — composer top → `Composer` pill; danh sách N-Card → 1 card N-`QaInboxRow`; thêm sort
  "Sôi nổi nhất" vào toolbar.
- `CourseQa/QuestionRow/index.tsx` — collapsed → `QaInboxRow`; expanded → `QaConversationHeader` + mạch
  `QaMessageBubble` (câu hỏi + answers) + reaction wiring.
- `CourseQa/QaMessageBubble/`, `QaInboxRow/`, `QaConversationHeader/` — MỚI.
- `QuestionRow/hooks/useQuestionAnswers.ts` — flatten theo thời gian; nối `reactToComment`.
- Query types: thêm `reactions` vào `CourseQuestionNode` (khớp BE khi expose).

**BE (nếu thầy duyệt lớp reaction-trên-câu-hỏi + sort + notify)**
- `course-question-node.object.ts` — thêm `reactions` (mirror `comment-node.object.ts`).
- `course-questions.service.ts` — gọi `summarizeComments`; thêm sort "engagement".
- Listener `CommentCreated` → `createNotification(CommentReply)` (nối emit, không bảng mới).

**KHÔNG đụng** `CommentItem`/`CommunityCommentItem` (community post — job khác, giữ forum).

## Verify plan
- FE `tsc --noEmit` + eslint sạch; BE `tsc` sạch file đụng, **KHÔNG migration** (chỉ expose/emit).
- Runtime `/vi/courses/<slug>/learn/qa`: đặt câu hỏi mới → dòng inbox chấm cam. Mở hội thoại ≥2 answer đa tác
  giả (mình/người khác/founder): bubble đúng phía, reaction thả được + summary cập nhật, follow người hỏi,
  status-badge đúng, reply/edit/xoá chạy. Mobile ~375px.

## ✅ CHỐT (thầy "xúc hết đi" 2026-07-19) — LÀM TẤT CẢ, phân pha

Thầy duyệt maximal: build cả 3 tầng data (🟢🟠🔴). Quyết định các nhánh treo:
1. **Mở 1 hội thoại = EXPAND-INLINE** (không route riêng) — giữ ngữ cảnh danh sách, cho mở nhiều thread song
   song, rủi ro thấp; cảm giác chat vẫn đủ nhờ mạch bubble.
2. **Đổi `CommentComposer` → `Composer` block** — giữ collapsible + currentUser avatar (build đọc API 2 bên).
3. **Reply-to-reply = FLATTEN theo thời gian + tag `↳`.**
4. **Founder = viền accent mảnh + badge verified** (không đổi vị trí bubble).

### Phân pha build (bàn giao `starci-fe-build`, tuần tự — KHÔNG song song shared worktree)

- **PHA 1 — FE chat-bubble social (🟢 zero-migration, phần lớn redesign nhìn thấy):**
  `QaInboxRow` · `QaMessageBubble` · `QaConversationHeader` · Composer pill · reaction 6-cảm-xúc trên
  ANSWER (live) · follow người hỏi · avatar-group participant · status-badge + chấm màu · expand-inline
  hội thoại. Không đụng schema. → build TRƯỚC, verify runtime.
- **PHA 2 — 🟠 BE rẻ (không migration):** enrich `CourseQuestionNodeObject` + `summarizeComments` (reaction
  trên CÂU HỎI) · sort "Sôi nổi nhất" · emit `CommentReply` notification khi có trả lời. FE nối `reactions`
  vào bubble câu hỏi + option sort.
- **PHA 3 — 🔴 schema nhẹ (1 cột/feature + migration cẩn thận — ⚠️ prod synchronize=true, xem
  [[prod-synchronize-drop-type-crashloop]] / [[typeorm-synchronize-enum-add-value-trap]]):**
  accept/best-answer (`isAcceptedAnswer` trên reply, người hỏi hoặc founder chọn) · ghim câu hỏi
  (`isPinned` trên content_comment, mirror community-post) · upvote (dùng `question_votes` mới HOẶC quy ước
  `like`-reaction = upvote — build chốt rẻ nhất khi tới pha này).
- **PHA 4 — 🔴 nặng (infra mới, làm CUỐI, tái thẩm trước khi vào):** @mention (parse body + join
  `comment_mentions` + notify) · presence/typing (socket presence store — subsystem real-time mới,
  nặng nhất) · share tracking. Mỗi cái là 1 mảng infra; vào từng cái một, không gộp.

> Nguyên tắc: mỗi pha verify (tsc/eslint + runtime) rồi mới sang pha sau. BE migration chạy local trước,
> soi kỹ enum/DROP TYPE trap trước khi để prod synchronize đụng.

## Bảng component → Storybook (sau khi build)

| Component | Story | Mới/Sửa | State demo thêm |
|---|---|---|---|
| `QaMessageBubble` · `QaInboxRow` · `QaConversationHeader` | — | feature-local, không cần story | — |
| `blocks/feed/ChatBubble` | `ChatBubble.stories` | không đổi API | — |
| `blocks/feed/Composer` | `Composer.stories` | kiểm nếu build phát sinh prop (collapsible/avatar) | + state nếu có |
| `blocks/identity/AvatarGroup` | `AvatarGroup.stories` | không đổi | — |

## Nguồn tham khảo
- Deep-scan FE (agent): `Discussion/*`, `discussion.ts`, `course-questions.ts`, `blocks/feed/*`,
  `blocks/identity/*`, `FollowButton`, `mutations/mutation-react-to-comment.ts`, `mutation-set-follow.ts`.
- Deep-scan BE (agent): `comment-reaction.entity.ts`, `reaction.service.ts:397-470`,
  `content-comments.service.ts:63-76`, `course-questions.service.ts:66-91`, `course-question-node.object.ts`,
  `comment-node.object.ts`, `content-comment.entity.ts`, `notification-type.ts:26-28`, `user-follow.entity.ts`,
  `course-stats-projection.entity.ts`.
- Canon: `.claude/fe/patterns/search-filter-list-surface.md`, `.claude/fe/layouts/surface-job-drives-layout.md`,
  `.claude/fe/principles/grounded-in-data.md`, `.claude/fe/components/entity-result-row-and-chat-tool-result.md`,
  `.claude/fe/engineering/storybook-taxonomy-core-block-rendering.md`.
- Không có `.artifacts/concepts/course-qa.md` — grounding từ source thật.
