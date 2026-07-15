import type { Meta, StoryObj } from "@storybook/nextjs"
import { CommunityPostCard } from "./index"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { CommunityChannel } from "@/modules/api/graphql/queries/types/community-feed"
import type { QueryCommunityFeedItemData } from "@/modules/api/graphql/queries/types/community-feed"

const meta: Meta<typeof CommunityPostCard> = {
    title: "Blocks/Feed/CommunityPostCard",
    component: CommunityPostCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CommunityPostCard>

const basePost: QueryCommunityFeedItemData = {
    id: "post-1",
    body: "Hôm nay mình vừa fix xong bug memory leak trong service Node.js, hoá ra do quên `removeListener` khi component unmount. Chia sẻ cho anh em rút kinh nghiệm!",
    channel: CommunityChannel.General,
    isPinned: false,
    editedAt: null,
    createdAt: "2026-07-10T08:30:00.000Z",
    author: {
        id: "user-1",
        username: "hai.tran",
        displayName: "Hải Trần",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    commentCount: 4,
    reactions: {
        total: 12,
        myReaction: null,
    },
    isMine: false,
    isFounderAuthor: false,
}

/** Dùng cho một bài đăng cộng đồng bình thường, có đầy đủ tương tác reaction và mở luồng bình luận. */
export const Default: Story = {
    parameters: { usage: "Dùng cho một bài đăng cộng đồng bình thường, có đầy đủ tương tác reaction và mở luồng bình luận." },
    render: () => (
        <CommunityPostCard
            post={basePost}
            onReact={() => {}}
            onToggleComments={() => {}}
        />
    ),
}

/** Dùng khi bài đăng được ghim lên đầu kênh và tác giả là nhà sáng lập, để làm nổi bật huy hiệu ghim và huy hiệu xác thực. */
export const PinnedFounderPost: Story = {
    parameters: { usage: "Dùng khi bài đăng được ghim lên đầu kênh và tác giả là nhà sáng lập, để làm nổi bật huy hiệu ghim và huy hiệu xác thực." },
    render: () => (
        <CommunityPostCard
            post={{
                ...basePost,
                id: "post-2",
                channel: CommunityChannel.FounderQa,
                isPinned: true,
                isFounderAuthor: true,
                author: {
                    id: "user-founder",
                    username: "founder",
                    displayName: "Nguyễn Văn Founder",
                    avatar: "https://i.pravatar.cc/150?img=5",
                },
                body: "Chào cả nhà, đây là bài Q&A định kỳ — mọi người cứ để lại câu hỏi bên dưới, mình sẽ trả lời trong tuần này nhé.",
                reactions: { total: 48, myReaction: ReactionType.Love },
                commentCount: 21,
            }}
            onReact={() => {}}
            onToggleComments={() => {}}
        />
    ),
}

/** Dùng khi người xem chưa đăng nhập, ẩn khả năng bấm reaction và mở bình luận, chỉ hiển thị số liệu tĩnh. */
export const ReadOnlyForSignedOutViewer: Story = {
    parameters: { usage: "Dùng khi người xem chưa đăng nhập, ẩn khả năng bấm reaction và mở bình luận, chỉ hiển thị số liệu tĩnh." },
    render: () => (
        <CommunityPostCard
            post={{
                ...basePost,
                id: "post-3",
                reactions: { total: 7, myReaction: null },
            }}
        />
    ),
}

/** Dùng khi bài đăng thuộc kênh nhờ hỗ trợ và có nội dung dài, để kiểm tra cách phần thân markdown xuống dòng tự nhiên. */
export const LongBodyInProblemsChannel: Story = {
    parameters: { usage: "Dùng khi bài đăng thuộc kênh nhờ hỗ trợ và có nội dung dài, để kiểm tra cách phần thân markdown xuống dòng tự nhiên." },
    render: () => (
        <CommunityPostCard
            post={{
                ...basePost,
                id: "post-4",
                channel: CommunityChannel.Problems,
                body: "Mình đang gặp lỗi `CORS` khi gọi API từ frontend Next.js sang backend NestJS, đã set `origin` đúng domain rồi mà vẫn bị chặn. Đã thử thêm `credentials: true` ở cả hai phía, kiểm tra header `Access-Control-Allow-Origin` trả về đúng domain, nhưng preflight request `OPTIONS` vẫn trả về 500. Có ai từng gặp case tương tự với `class-validator` interceptor chưa, mình nghi là exception filter đang nuốt mất header CORS trước khi response trả về trình duyệt.",
                editedAt: "2026-07-10T09:15:00.000Z",
                reactions: { total: 3, myReaction: null },
                commentCount: 9,
            }}
            onReact={() => {}}
            onToggleComments={() => {}}
        />
    ),
}

/** Dùng khi luồng bình luận đang mở bên dưới bài đăng, để đặt vùng nội dung con vào đúng vị trí trong thẻ. */
export const WithExpandedComments: Story = {
    parameters: { usage: "Dùng khi luồng bình luận đang mở bên dưới bài đăng, để đặt vùng nội dung con vào đúng vị trí trong thẻ." },
    render: () => (
        <CommunityPostCard
            post={basePost}
            onReact={() => {}}
            onToggleComments={() => {}}
        >
            <div className="rounded-lg border border-default bg-default/20 p-3 text-body-xs text-muted">
                Khu vực danh sách bình luận sẽ hiển thị ở đây.
            </div>
        </CommunityPostCard>
    ),
}
