import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CommunityPostCard } from "@/components/blocks/feed/CommunityPostCard"
import { CommunityChannel } from "@/modules/api/graphql/queries/types/community-feed"
import type { QueryCommunityFeedItemData } from "@/modules/api/graphql/queries/types/community-feed"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CommunityPostCard> = {
    title: "Legacy/Blocks/Feed/CommunityPostCard",
    component: CommunityPostCard,
}
export default meta
type Story = StoryObj<typeof CommunityPostCard>

/** Bài đăng bình thường trong kênh Chung, đã có vài lượt reaction và bình luận. */
const defaultPost: QueryCommunityFeedItemData = {
    id: "post-1",
    body: "Mọi người ơi, ai đã dùng thử useTransition của React 19 chưa, so với useDeferredValue thì nên chọn cái nào cho form tìm kiếm nhé.",
    channel: CommunityChannel.General,
    isPinned: false,
    editedAt: null,
    createdAt: "2026-07-20T02:30:00.000Z",
    author: {
        id: "author-1",
        username: "quochuy_backend",
        displayName: "Quốc Huy",
        avatar: "https://i.pravatar.cc/150?img=33",
    },
    commentCount: 4,
    reactions: {
        total: 12,
        myReaction: ReactionType.Like,
    },
    isMine: false,
    isFounderAuthor: false,
}

/** Bài trả lời của founder trong kênh Hỏi founder, được ghim lên đầu danh sách. */
const founderPinnedPost: QueryCommunityFeedItemData = {
    id: "post-2",
    body: "Câu hỏi hay, mình khuyên các bạn cứ đi theo lộ trình Fullstack trước rồi mới rẽ sang System Design, đừng học nhảy cóc.",
    channel: CommunityChannel.FounderQa,
    isPinned: true,
    editedAt: null,
    createdAt: "2026-07-19T08:00:00.000Z",
    author: {
        id: "author-2",
        username: "starci_founder",
        displayName: "Thầy StarCi",
        avatar: "https://i.pravatar.cc/150?img=5",
    },
    commentCount: 21,
    reactions: {
        total: 58,
        myReaction: ReactionType.Love,
    },
    isMine: false,
    isFounderAuthor: true,
}

/** Bài mới đăng, chưa có ai reaction hay bình luận — trạng thái rỗng của phần tương tác. */
const freshPost: QueryCommunityFeedItemData = {
    id: "post-3",
    body: "Em vừa deploy xong dự án capstone đầu tiên, ai có kinh nghiệm review giúp em với ạ.",
    channel: CommunityChannel.General,
    isPinned: false,
    editedAt: null,
    createdAt: "2026-07-21T01:05:00.000Z",
    author: {
        id: "author-3",
        username: "thuha_ux",
        displayName: "Thu Hà",
        avatar: "https://i.pravatar.cc/150?img=45",
    },
    commentCount: 0,
    reactions: {
        total: 0,
        myReaction: null,
    },
    isMine: false,
    isFounderAuthor: false,
}

/** Bài viết dài trong kênh Vấn đề, dùng để kiểm tra phần thân markdown xuống dòng đúng, không tràn khỏi card. */
const longBodyPost: QueryCommunityFeedItemData = {
    id: "post-4",
    body: "Em đang gặp lỗi CORS khi gọi API từ Next.js sang NestJS ở môi trường staging, dù local chạy bình thường. Em đã thêm origin vào whitelist trong main.ts rồi nhưng vẫn bị chặn ở preflight OPTIONS. Có phải do reverse proxy Nginx ở giữa chưa forward header Access-Control-Allow-Origin không, hay em cần cấu hình thêm ở phía gateway. Ai từng gặp case tương tự chỉ em cách debug với ạ, em cảm ơn nhiều.",
    channel: CommunityChannel.Problems,
    isPinned: false,
    editedAt: "2026-07-18T10:00:00.000Z",
    createdAt: "2026-07-18T09:15:00.000Z",
    author: {
        id: "author-4",
        username: "minhanh_dev",
        displayName: "Minh Anh",
        avatar: "https://i.pravatar.cc/150?img=12",
    },
    commentCount: 9,
    reactions: {
        total: 3,
        myReaction: null,
    },
    isMine: false,
    isFounderAuthor: false,
}

/** Cùng bài của Quốc Huy nhưng xem ở trạng thái chưa đăng nhập — không có quyền react hay mở bình luận. */
const readOnlyPost: QueryCommunityFeedItemData = {
    ...defaultPost,
    id: "post-5",
}

/**
 * Gallery phủ hết state-matrix hiển thị của CommunityPostCard: bài thường, bài
 * founder ghim + huy hiệu, bài chưa ai tương tác (rỗng), bài dài test overflow
 * thân markdown, và bản đọc chỉ xem khi chưa đăng nhập (không có onReact /
 * onToggleComments nên nút bình luận bị khoá, reaction bar chỉ hiển thị).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng CommunityPostCard cho mỗi bài đăng trong feed cộng đồng: header tác giả (avatar, tên, thời gian tương đối, kênh, huy hiệu founder/ghim), thân bài markdown, và footer reaction + số bình luận. Bỏ onReact khi người xem chưa đăng nhập để reaction bar chuyển về chỉ đọc, bỏ onToggleComments khi feature không mở thread bình luận tại chỗ.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Bài đăng thường"
                hint="Trạng thái mặc định: đã có reaction và vài bình luận, người xem có quyền react và mở thread."
            >
                <div className="w-full max-w-xl">
                    <CommunityPostCard
                        post={defaultPost}
                        onReact={() => {}}
                        onToggleComments={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Founder + được ghim"
                hint="Bài của founder có huy hiệu xác thực bên tên, và bài được ghim có icon pin ở góc phải header — thường thấy ở kênh Hỏi founder."
            >
                <div className="w-full max-w-xl">
                    <CommunityPostCard
                        post={founderPinnedPost}
                        onReact={() => {}}
                        onToggleComments={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Chưa ai tương tác (rỗng)"
                hint="Reaction total và số bình luận đều bằng 0 — dùng cho bài vừa đăng, không cần ẩn footer, vẫn hiện nút react/bình luận bình thường."
            >
                <div className="w-full max-w-xl">
                    <CommunityPostCard
                        post={freshPost}
                        onReact={() => {}}
                        onToggleComments={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Thân bài dài (overflow)"
                hint="Thân markdown nhiều câu để kiểm tra chữ xuống dòng đúng trong card, không đẩy footer lệch hay tràn ngang."
            >
                <div className="w-full max-w-xl">
                    <CommunityPostCard
                        post={longBodyPost}
                        onReact={() => {}}
                        onToggleComments={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Chỉ xem (chưa đăng nhập)"
                hint="Bỏ onReact và onToggleComments: reaction bar chuyển về chỉ đọc, nút bình luận bị khoá (disabled), dùng khi người xem chưa đăng nhập."
            >
                <div className="w-full max-w-xl">
                    <CommunityPostCard post={readOnlyPost} />
                </div>
            </Variant>
        </Gallery>
    ),
}

/** Wrapper giữ state reaction + trạng thái mở/đóng thread bình luận cho story tương tác thật. */
const Controlled = () => {
    const [myReaction, setMyReaction] = useState<ReactionType | null>(null)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const post: QueryCommunityFeedItemData = {
        ...defaultPost,
        reactions: {
            total: defaultPost.reactions.total + (myReaction ? 1 : 0),
            myReaction,
        },
    }

    return (
        <div className="w-full max-w-xl">
            <CommunityPostCard
                post={post}
                onReact={(_postId, type) => setMyReaction(type)}
                onToggleComments={() => setCommentsOpen((open) => !open)}
            >
                {commentsOpen ? (
                    <div className="rounded-2xl bg-default/40 p-3 text-sm text-muted">
                        Thread bình luận sẽ hiển thị ở đây khi được bấm mở.
                    </div>
                ) : null}
            </CommunityPostCard>
        </div>
    )
}

/**
 * Bấm vào reaction để đổi lựa chọn (tổng số cập nhật theo), bấm vào nút bình
 * luận để bật/tắt khối thread ở dưới footer — dùng khi cần xác nhận hành vi
 * bấm thật thay vì chỉ nhìn hình.
 */
export const Interactive: Story = {
    parameters: {
        usage: "Dùng story này khi cần xác nhận hành vi bấm thật của CommunityPostCard: bấm reaction đổi myReaction và cộng vào tổng, bấm nút bình luận bật/tắt khối children — khác AllVariants chỉ để soi hình tĩnh.",
    },
    render: () => <Controlled />,
}
