import type { Meta, StoryObj } from "@storybook/nextjs"
import { RelatedContentList } from "./RelatedContentList"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof RelatedContentList> = {
    title: "Block/Learn/RelatedContentList",
    component: RelatedContentList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RelatedContentList>

const ANATOMY = {
    primitives: [
        { name: "LabeledCard", role: "nhãn section ngoài khung (frameless — nội dung tự là card)" },
        { name: "SurfaceListCard", role: "khung surface bordered ôm các hàng edge-to-edge" },
        { name: "EntityResultRow", role: "mỗi hàng kết quả (breadcrumb + tiêu đề, mặc định không chip/snippet)" },
        { name: "Skeleton", role: "bars mirror hàng lúc đang tải" },
    ],
    reason:
        "Gợi ý nội dung liên quan cuối một bề mặt học cần một nhãn section (LabeledCard) trên một khung list bordered (SurfaceListCard) chứa các EntityResultRow dùng chung. Gói nhãn + khung + danh sách + skeleton + logic tự-ẩn (query rỗng / rỗng kết quả → null) + lọc excludeId + limit vào một block, để mỗi bề mặt chỉ truyền query ngữ cảnh — không dựng lại khung và cơ chế tự-ẩn.",
}

const LABEL = "Nội dung liên quan"
const QUERY = "Access token JWT hết hạn thì xử lý thế nào"

const ITEM_REFRESH_TOKEN: SearchCourseContentItem = {
    kind: "content",
    title: "Refresh token xoay vòng để giữ phiên đăng nhập",
    breadcrumb: "Module 6 · Xác thực & phân quyền",
    snippet: "Access token sống ngắn, refresh token xoay vòng mỗi lần dùng để giảm rủi ro bị đánh cắp lâu dài.",
    score: 0.88,
    moduleId: "module-6",
    contentId: "content-refresh-token",
    deckId: null,
    taskId: null,
    isLocked: false,
}

const ITEM_PROACTIVE_REFRESH_CHALLENGE: SearchCourseContentItem = {
    kind: "challenge",
    title: "Viết middleware tự làm mới access token sắp hết hạn",
    breadcrumb: "Module 6 · Xác thực & phân quyền",
    snippet: "Kiểm tra TTL còn lại của JWT trước khi gọi request, chủ động refresh nếu dưới ngưỡng an toàn.",
    score: 0.81,
    moduleId: "module-6",
    contentId: "challenge-proactive-refresh",
    deckId: null,
    taskId: null,
    isLocked: false,
}

const ITEM_JWT_FLASHCARD: SearchCourseContentItem = {
    kind: "flashcard",
    title: "JWT hết hạn khác gì với JWT bị revoke?",
    breadcrumb: null,
    snippet: "",
    score: 0.74,
    moduleId: null,
    contentId: null,
    deckId: "deck-jwt-lifecycle",
    taskId: null,
    isLocked: false,
}

const ITEM_SSO_MILESTONE_LOCKED: SearchCourseContentItem = {
    kind: "milestone",
    title: "Đồ án: hệ thống đăng nhập SSO đa dịch vụ",
    breadcrumb: "Milestone 3 · Đồ án xác thực tập trung",
    snippet: "",
    score: 0.69,
    moduleId: null,
    contentId: null,
    deckId: null,
    taskId: "task-sso-capstone",
    isLocked: true,
}

const ITEM_OAUTH_CONTENT: SearchCourseContentItem = {
    kind: "content",
    title: "OAuth2 authorization code flow — vì sao cần PKCE",
    breadcrumb: "Module 6 · Xác thực & phân quyền",
    snippet: "PKCE chặn kẻ tấn công chặn được authorization code đổi lấy token trên client public.",
    score: 0.62,
    moduleId: "module-6",
    contentId: "content-oauth-pkce",
    deckId: null,
    taskId: null,
    isLocked: false,
}

/** query="" → block self-hides (renders null); empty/error results self-hide identically. */
export const SelfHidden: Story = {
    render: () =>
        blockShell(
            <RelatedContentList results={[]} query="" label={LABEL} className="w-full max-w-xl" />,
            ANATOMY,
        ),
}

export const Loading: Story = {
    render: () =>
        blockShell(
            <RelatedContentList results={[]} query={QUERY} label={LABEL} isLoading className="w-full max-w-xl" />,
            ANATOMY,
        ),
}

export const SingleResult: Story = {
    render: () =>
        blockShell(
            <RelatedContentList
                results={[ITEM_PROACTIVE_REFRESH_CHALLENGE]}
                query={QUERY}
                label={LABEL}
                className="w-full max-w-xl"
            />,
            ANATOMY,
        ),
}

export const MultipleMixed: Story = {
    render: () =>
        blockShell(
            <RelatedContentList
                results={[ITEM_REFRESH_TOKEN, ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_JWT_FLASHCARD]}
                query={QUERY}
                label={LABEL}
                className="w-full max-w-xl"
            />,
            ANATOMY,
        ),
}

export const WithLockedRow: Story = {
    render: () =>
        blockShell(
            <RelatedContentList
                results={[ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_SSO_MILESTONE_LOCKED]}
                query={QUERY}
                label={LABEL}
                className="w-full max-w-xl"
            />,
            ANATOMY,
        ),
}

export const ExcludeCurrentSource: Story = {
    render: () =>
        blockShell(
            <RelatedContentList
                results={[ITEM_REFRESH_TOKEN, ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_JWT_FLASHCARD]}
                query={QUERY}
                label={LABEL}
                excludeId="content-refresh-token"
                className="w-full max-w-xl"
            />,
            ANATOMY,
        ),
}

export const LimitedRows: Story = {
    render: () =>
        blockShell(
            <RelatedContentList
                results={[
                    ITEM_REFRESH_TOKEN,
                    ITEM_PROACTIVE_REFRESH_CHALLENGE,
                    ITEM_JWT_FLASHCARD,
                    ITEM_SSO_MILESTONE_LOCKED,
                    ITEM_OAUTH_CONTENT,
                ]}
                query={QUERY}
                label={LABEL}
                limit={2}
                className="w-full max-w-xl"
            />,
            ANATOMY,
        ),
}
