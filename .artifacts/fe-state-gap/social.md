# FE state-coverage gaps — SOCIAL cluster

Read-only audit of the FE (`C:/Repositories/starci-academy`) against the BE state SSOT
(`.artifacts/states/<domain>/business.md`). Only verified gaps listed.

Routes covered: `community`, `community/chat`, `notifications`, `blog`, `blog/[slug]`, `review`.
BE domains read: `chat`, `community`, `notification`, `discussion`, `activity`.

### Summary

| Severity | Count |
|---|---|
| high | 1 |
| med  | 6 |
| low  | 4 |

Scope notes:
- **`blog` / `blog/[slug]`** have **no BE state SSOT** among the 5 assigned domains — cannot be verified against a state machine (see section).
- **`review`** mounts `FlashcardReviewPage` (**flashcard** domain), which is **not** in the assigned set — out of scope, not analyzed.
- **`activity`** domain (my-feed / user-feed) is **not rendered by any route in this cluster** (home feed lives in dashboard; user timeline in profile) — no gap to report here.

---

## community  (BE domain: `community`)

Mounted: `src/app/[locale]/community/page.tsx` → `components/features/community/CommunityFeed/index.tsx`
→ `CommunityPost` → `blocks/feed/CommunityPostCard` / `CommunityCommentThread` → `CommunityCommentItem` → `blocks/feed/CommunityCommentRow`.

The feed itself is well-covered: loading skeleton, platform-empty vs filtered-empty, error+retry, cursor pagination, channel tabs, reaction-then-revalidate. Gaps are all in the **comment lifecycle and post/comment management transitions**.

1. **[high] Render-wrong — soft-deleted comment shown as a live comment.**
   `components/blocks/feed/CommunityCommentRow/index.tsx:70` renders `comment.body` (which BE returns **empty when `isDeleted`**, per `types/community-comments.ts:9`) with the full author header, founder badge, an **active reaction bar**, and reply affordances. BE community `business.md` comment lifecycle + invariant 6: comment listings do **NOT** filter `isDeleted`; the client must render a **`[deleted]` placeholder**. The node carries `isDeleted` (`types/community-comments.ts:11`) but **no component ever reads it** — not `CommunityCommentRow`, not `CommunityCommentItem`, not `CommunityCommentThread`.
   *Fix:* branch on `comment.isDeleted` in `CommunityCommentRow` → render a muted `"[deleted]"` placeholder, suppress the reaction bar and reply/edit controls.

2. **[med] Missing transition — post edit / soft-delete (author).**
   BE post lifecycle: `create → live → (edit ⇄ live, stamps editedAt) → soft-delete → deleted`, author-only (invariant 1). FE receives `isMine` on every post (`types/community-feed.ts:55`) but `blocks/feed/CommunityPostCard/index.tsx` renders **no author menu**; there is **no `editCommunityPost` / `deleteCommunityPost` mutation** in `hooks/swr/api/graphql/mutations/` or `modules/api/graphql/mutations/` (only create/react exist). An author cannot edit or delete their own post from the feed.
   *Fix:* add an author-only (`post.isMine`) overflow menu wired to new edit/delete mutations, refreshing via the existing `onChanged`.

3. **[med] Missing transition — comment edit / soft-delete (author).**
   Same lifecycle for comments (BE: `edit ⇄ live → soft-delete → deleted`, `comment.userId === user.id`). `CommunityCommentItem` / `CommunityCommentThread` offer only create + react + reply. Note `useMutateDeleteCommentSwr.ts` exists but is the **discussion** delete (imports `mutations/types/discussion`) and is **not** wired into any community comment component. Community comments cannot be edited or deleted in FE.
   *Fix:* add author-only edit/delete on `CommunityCommentRow`/`CommunityCommentItem` with community-scoped mutations.

4. **[med] Missing transition — founder pin / unpin.**
   BE: `isPinned` is a founder-only toggle on `live` posts (invariant 2). FE renders the `isPinned` badge **read-only** (`blocks/feed/CommunityPostCard/index.tsx:96-98`); there is no pin/unpin control and no pin mutation hook. The founder cannot pin from this surface.
   *Fix:* founder-gated pin toggle in the post card wired to a new pin mutation. (Downgrade to low only if pinning is intentionally done via separate admin tooling.)

5. **[low] `editedAt` never surfaced.**
   BE stamps `editedAt` on every edit. Both `QueryCommunityFeedItemData.editedAt` (`types/community-feed.ts:44`) and `QueryCommunityCommentNode.editedAt` (`types/community-comments.ts:13`) are fetched, but neither `CommunityPostCard` nor `CommunityCommentRow` renders an "edited" marker — an edited post/comment is indistinguishable from an untouched one.
   *Fix:* append a `"· edited"` meta token when `editedAt != null`.

---

## community/chat  (BE domain: `chat`)

Mounted: `src/app/[locale]/community/chat/page.tsx` → `components/features/community/CommunityChat/index.tsx`
→ `CommunityChat/ChatPane/index.tsx` (SWR `chatMessages` + Socket.IO room).

6. **[med] Missing state — signed-in non-member gets an infinite skeleton.**
   BE chat invariant 1: chat is **member-only for every read**, including the global room. `hooks/.../useQueryCommunityChatConversationSwr.ts:15` gates the query only on Keycloak `authenticated`, **not** membership. For a signed-in **non-member**, `assertCanAccess` throws server-side; the hook returns `null`/errors, and `CommunityChat/index.tsx:32-38,66-74` destructures only `{ data }` — the error is dropped, `conversationId` stays `undefined`, and the branch renders `<ChatPaneSkeleton withComposer />` **forever**. There is no "membership required" state for a logged-in non-member (the `EmptyState` only covers signed-out).
   *Fix:* surface the conversation query's `error`/`isLoading`; render a members-only `EmptyState` (upsell to membership) when the query fails the membership gate rather than a perpetual skeleton.

7. **[low] Missing per-message sending / failed state; no optimistic bubble.**
   BE message: `draft → send → live`. `ChatPane/index.tsx:86-103` awaits `sendMessage` then refetches; the sender's own message does not appear until the round-trip completes, and failure is surfaced only by a toast (`runGraphQL`) with no inline `failed`/retry affordance on a message bubble.
   *Fix:* optimistic pending bubble reconciled on refetch, with an inline failed+retry state.

8. **[low] Chat history pagination unused.**
   `QueryChatMessagesData.nextCursor` exists (`types/chat.ts:64`) but `ChatPane` reads only the first page (`data?.items`) — no "load older messages". History beyond the first page is unreachable.
   *Fix:* add reverse "load older" using `nextCursor`.

9. **[low] Realtime "connection lost" not surfaced.**
   `ChatPane/index.tsx:53-83` joins the Socket.IO room and refetches on `ChatMessageCreated`, but renders no disconnected/reconnecting indicator. If the socket drops, new messages from others silently stop arriving with no signal to the user.
   *Fix:* render a subtle "reconnecting…" banner off the socket connect/disconnect state.

---

## notifications  (BE domain: `notification`)

Mounted: `src/app/[locale]/notifications/page.tsx` → `components/features/notifications/NotificationCenter/index.tsx`.

Read/unread lifecycle is faithful: unread→read one-directional, mark-one (idempotent) + mark-all, unread badge from `unreadCount`, loading/empty/filtered-empty/error, offset pagination. One gap:

10. **[med] API-shape mismatch — `CommunityReply` notification type missing from FE.**
    BE `NotificationType` has **10** members including **`CommunityReply`** (JSDoc distinguishes it from `CommentReply`: community-post reply vs discussion-comment reply; BE community `business.md` cross-domain confirms community comments fan out notifications). FE `modules/api/graphql/queries/types/notifications.ts:7-26` defines only **9** — **`CommunityReply` is absent**. Consequently in `NotificationCenter/index.tsx`: `TYPE_ICONS` (lines 77-87) has no `CommunityReply` entry, so such a row renders with **no icon** (`TYPE_ICONS[type]` → `undefined`); and the tab strip (lines 234-281) has no `CommunityReply` tab, so those notifications are **unfilterable**, silently folded into "All".
    *Fix:* add `CommunityReply` to the FE enum, `TYPE_ICONS`, and the tab strip.

---

## blog  /  blog/[slug]  (no assigned BE domain)

Mounted: `BlogList/index.tsx` and `BlogPost/index.tsx`. **No `blog` state SSOT exists among the 5 assigned domains**, so no faithful-render check against a BE state machine is possible here. For completeness, the FE internally covers the expected surface states: loading skeleton, platform-empty vs filtered-empty, error+retry, `notFound`, `isPremium` chip, and the server-truncated `isLocked` members-only gate (`BlogPost/index.tsx:110-117`). **No verifiable gap** against the assigned domains.

*(If draft/published or premium-truncation state coverage needs auditing, it requires the `blog`/`content` BE domain SSOT, which is outside this cluster.)*

## review  (flashcard domain — out of assigned scope)

`src/app/[locale]/review/page.tsx` mounts `FlashcardReviewPage` (SM-2 flashcard review). The **flashcard** domain is not among the assigned 5 (`chat`, `community`, `notification`, `discussion`, `activity`). Not analyzed — would need `.artifacts/states/flashcard/business.md`.

## activity domain — no route in this cluster

`activity` (`my-feed` score-ranked home feed, `user-feed` profile timeline) is not rendered by any route in the SOCIAL cluster. No FE surface here to check against it.
