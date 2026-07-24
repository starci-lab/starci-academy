import type { Meta, StoryObj } from "@storybook/nextjs"
import { RelatedContentList } from "./RelatedContentList"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — a passive, self-hiding "related content" list at the tail of a learning
 * surface. It owns the real states: self-hidden (blank/empty query → null) ·
 * loading (skeleton rows) · data (result rows). The list composes the
 * `EntityResultRow` sub-block inside a bordered `SurfaceListCard` under a
 * frameless `LabeledCard` section label.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
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

/** Frame each leaf's anatomy panel with breathing room. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

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

// DATA leaf — the composed list, mirroring the real DOM nesting:
//   LabeledCard (frameless section — its `label` Label is text nội tại, no node)
//     └─ AsyncContent   (content branch)
//          └─ SurfaceListCard (bordered frame)
//               └─ EntityResultRow × N
// Shared by every "has results" leaf (single · mixed · locked · excluded · limited).
const DATA_PARTS: Array<AnatomyNode> = [
    {
        name: "LabeledCard",
        tier: "primitive",
        role: "nhãn section ngoài khung (frameless — nội dung tự là card; nhãn Label là text nội tại, không tách node)",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "switch error → loading → empty → content (empty/error tự-ẩn ở tầng trên)",
                state: "content",
                children: [
                    {
                        name: "SurfaceListCard",
                        tier: "primitive",
                        role: "khung surface bordered ôm các hàng edge-to-edge",
                        children: [
                            { name: "EntityResultRow", tier: "design", role: "mỗi hàng kết quả (breadcrumb + tiêu đề, mặc định không chip/snippet)" },
                        ],
                    },
                ],
            },
        ],
    },
]

// LOADING leaf — chrome stays, AsyncContent switches to its loading branch: the same
// bordered frame, but each row is a SurfaceListCardItem wrapping a 3-line Skeleton mirror.
//   LabeledCard
//     └─ AsyncContent   (loading branch)
//          └─ SurfaceListCard
//               └─ SurfaceListCardItem × N
//                    └─ Skeleton (3 lines)
const LOADING_PARTS: Array<AnatomyNode> = [
    {
        name: "LabeledCard",
        tier: "primitive",
        role: "nhãn section (vẫn hiện — text nội tại, không tách node)",
        children: [
            {
                name: "AsyncContent",
                tier: "primitive",
                role: "nhánh loading → skeleton",
                state: "loading",
                children: [
                    {
                        name: "SurfaceListCard",
                        tier: "primitive",
                        role: "khung bordered giữ đúng footprint",
                        children: [
                            {
                                name: "SurfaceListCardItem",
                                tier: "primitive",
                                role: "mỗi hàng skeleton (bọc item edge-to-edge)",
                                children: [
                                    { name: "Skeleton", tier: "primitive", role: "3 dòng Skeleton.Typography mirror mỗi hàng", state: "skeleton" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

// SELF-HIDDEN leaf — query rỗng / rỗng kết quả → block trả null, không dựng gì.
const SELF_HIDDEN_PARTS: Array<AnatomyNode> = []

/** SELF-HIDDEN — query="" → block self-hides (renders null); empty/error results self-hide identically. */
export const SelfHidden: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="SelfHidden"
                parts={SELF_HIDDEN_PARTS}
                note="Query rỗng (hoặc rỗng kết quả) → block trả null: không nhãn, không khung, không dựng gì — một aid im lặng không chiếm chỗ."
            >
                <RelatedContentList results={[]} query="" label={LABEL} showAnatomy
                    className="w-full max-w-xl" />
            </BlockAnatomy>,
        ),
}

export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="Loading"
                parts={LOADING_PARTS}
                note="isLoading → thân đổi sang hàng Skeleton mirror trong cùng khung bordered, composition khác leaf data (không EntityResultRow thật)."
            >
                <RelatedContentList results={[]} query={QUERY} label={LABEL} isLoading showAnatomy
                    className="w-full max-w-xl" />
            </BlockAnatomy>,
        ),
}

export const SingleResult: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="SingleResult"
                parts={DATA_PARTS}
                note="Một EntityResultRow trong khung — CÙNG composition với leaf nhiều kết quả, chỉ khác số hàng."
            >
                <RelatedContentList
                    results={[ITEM_PROACTIVE_REFRESH_CHALLENGE]}
                    query={QUERY}
                    label={LABEL}
                    showAnatomy
                    className="w-full max-w-xl"
                />
            </BlockAnatomy>,
        ),
}

export const MultipleMixed: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="MultipleMixed"
                parts={DATA_PARTS}
                reason="Gợi ý nội dung liên quan cuối một bề mặt học cần một nhãn section (LabeledCard) trên một khung list bordered (SurfaceListCard) chứa các EntityResultRow dùng chung. Gói nhãn + khung + danh sách + skeleton + logic tự-ẩn (query rỗng / rỗng kết quả → null) + lọc excludeId + limit vào một block, để mỗi bề mặt chỉ truyền query ngữ cảnh — không dựng lại khung và cơ chế tự-ẩn."
            >
                <RelatedContentList
                    results={[ITEM_REFRESH_TOKEN, ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_JWT_FLASHCARD]}
                    query={QUERY}
                    label={LABEL}
                    showAnatomy
                    className="w-full max-w-xl"
                />
            </BlockAnatomy>,
        ),
}

export const WithLockedRow: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="WithLockedRow"
                parts={DATA_PARTS}
                note="Một EntityResultRow ở trạng thái khoá (milestone chưa mở) — CÙNG composition, chỉ khác tone của hàng."
            >
                <RelatedContentList
                    results={[ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_SSO_MILESTONE_LOCKED]}
                    query={QUERY}
                    label={LABEL}
                    showAnatomy
                    className="w-full max-w-xl"
                />
            </BlockAnatomy>,
        ),
}

export const ExcludeCurrentSource: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="ExcludeCurrentSource"
                parts={DATA_PARTS}
                note="excludeId lọc bỏ nguồn đang xem trước khi render — CÙNG composition, chỉ ít đi một hàng."
            >
                <RelatedContentList
                    results={[ITEM_REFRESH_TOKEN, ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_JWT_FLASHCARD]}
                    query={QUERY}
                    label={LABEL}
                    excludeId="content-refresh-token"
                    showAnatomy
                    className="w-full max-w-xl"
                />
            </BlockAnatomy>,
        ),
}

export const LimitedRows: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="RelatedContentList"
                tier="block"
                leaf="LimitedRows"
                parts={DATA_PARTS}
                note="limit cắt danh sách xuống N hàng — CÙNG composition, chỉ khác số EntityResultRow hiển thị."
            >
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
                    showAnatomy
                    className="w-full max-w-xl"
                />
            </BlockAnatomy>,
        ),
}
