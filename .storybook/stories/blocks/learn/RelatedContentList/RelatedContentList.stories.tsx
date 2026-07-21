import React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SWRConfig, unstable_serialize } from "swr"
import { RelatedContentList } from "@/components/blocks/learn/RelatedContentList"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof RelatedContentList> = {
    title: "Blocks/Learn/RelatedContentList",
    component: RelatedContentList,
}
export default meta
type Story = StoryObj<typeof RelatedContentList>

const COURSE_ID = "course-fullstack-mastery"
const COURSE_DISPLAY_ID = "fullstack-mastery"
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

/**
 * Seed the SWR cache the real `useQuerySearchCourseContentSwr` hook reads from,
 * keyed EXACTLY the way the hook builds it, then disable every revalidation
 * trigger — so `RelatedContentList` renders the given `results` synchronously
 * and never actually calls the RAG endpoint (no Apollo auth/csrf/retry chain to
 * fake, no dependency on a live backend). This only wraps the story; the real
 * component and hook are untouched.
 */
const MockSearchResults = ({
    courseId,
    query,
    results,
    children,
}: {
    courseId: string
    query: string
    results: Array<SearchCourseContentItem>
    children: React.ReactNode
}) => (
    <SWRConfig
        value={{
            fallback: {
                [unstable_serialize(["QUERY_SEARCH_COURSE_CONTENT_SWR", courseId, query.trim()])]: results,
            },
            revalidateOnMount: false,
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }}
    >
        {children}
    </SWRConfig>
)

/**
 * Toàn bộ trạng thái của RelatedContentList: tự ẩn khi chưa có query, một kết quả,
 * nhiều kết quả trộn loại nguồn, dòng bị khoá vì chưa ghi danh, excludeId loại bỏ
 * nguồn hiện tại, và limit giới hạn số dòng hiển thị. Vì component tự fetch qua
 * `useQuerySearchCourseContentSwr`, mỗi trạng thái có kết quả được seed thẳng vào
 * SWR cache (xem `MockSearchResults`) thay vì gọi RAG thật.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Đặt block ở cuối một bài học, một brief thử thách, hay một thẻ flashcard để gợi ý nội dung liên quan trong cùng khoá — query luôn tự build từ ngữ cảnh (tiêu đề bài, brief, tag yếu…), học viên không gõ tay. Chọn excludeId đúng id của bề mặt hiện tại để khỏi gợi ý lại chính nó, và cân limit theo chỗ đặt (sidebar hẹp thì 1-2, khối cuối trang thì 3).",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Query rỗng — tự ẩn hoàn toàn"
                hint="Khi ngữ cảnh chưa build được câu query (ví dụ trang vừa mount, content.title chưa load xong), block render null ngay — không skeleton nháy, không khung 'không có gợi ý' nào lộ ra. Kết quả rỗng hoặc RAG lỗi cũng render null giống hệt vậy — cả ba trường hợp không phân biệt được trên UI, đây là chủ đích: một gợi ý thụ động tốt hơn hết nên biến mất, hơn là xin lỗi vì không tìm được gì."
            >
                <RelatedContentList
                    courseId={COURSE_ID}
                    courseDisplayId={COURSE_DISPLAY_ID}
                    query=""
                    label={LABEL}
                    className="w-full max-w-xl"
                />
            </Variant>

            <Variant
                label="Một kết quả duy nhất (N=1)"
                hint="Khi RAG chỉ tìm được một nguồn đủ liên quan, danh sách vẫn hiện đúng một dòng trong SurfaceListCard, không co khung lại thành ô rời rạc."
            >
                <MockSearchResults courseId={COURSE_ID} query={QUERY} results={[ITEM_PROACTIVE_REFRESH_CHALLENGE]}>
                    <RelatedContentList
                        courseId={COURSE_ID}
                        courseDisplayId={COURSE_DISPLAY_ID}
                        query={QUERY}
                        label={LABEL}
                        className="w-full max-w-xl"
                    />
                </MockSearchResults>
            </Variant>

            <Variant
                label="Nhiều kết quả (N) — trộn content/challenge/flashcard"
                hint="Ba dòng xếp liền nhau với đường kẻ phân cách mảnh; dòng flashcard không có breadcrumb (đứng lẻ, không thuộc module) nên chỉ còn tiêu đề — đúng hành vi mặc định showKindChip=false, showSnippet=false của EntityResultRow trong danh sách liên quan."
            >
                <MockSearchResults
                    courseId={COURSE_ID}
                    query={QUERY}
                    results={[ITEM_REFRESH_TOKEN, ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_JWT_FLASHCARD]}
                >
                    <RelatedContentList
                        courseId={COURSE_ID}
                        courseDisplayId={COURSE_DISPLAY_ID}
                        query={QUERY}
                        label={LABEL}
                        className="w-full max-w-xl"
                    />
                </MockSearchResults>
            </Variant>

            <Variant
                label="Có dòng bị khoá — chưa ghi danh"
                hint="Dòng milestone khoá vẫn nằm trong danh sách và vẫn bấm điều hướng được — đích đến tự hiện cổng ghi danh; ở đây chỉ báo trước bằng icon khoá, backend cũng đã lược bỏ snippet nên không có gì để đọc trước."
            >
                <MockSearchResults
                    courseId={COURSE_ID}
                    query={QUERY}
                    results={[ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_SSO_MILESTONE_LOCKED]}
                >
                    <RelatedContentList
                        courseId={COURSE_ID}
                        courseDisplayId={COURSE_DISPLAY_ID}
                        query={QUERY}
                        label={LABEL}
                        className="w-full max-w-xl"
                    />
                </MockSearchResults>
            </Variant>

            <Variant
                label="excludeId — loại bỏ nguồn hiện tại khỏi kết quả"
                hint="Học viên đang đọc chính content-refresh-token: truyền excludeId cùng id đó nên dòng của nó biến mất khỏi 3 kết quả seed, chỉ còn 2 dòng — tránh cảnh 'nên đọc: bài chính nó' vì query auto-build từ title luôn ra chính nó là top hit."
            >
                <MockSearchResults
                    courseId={COURSE_ID}
                    query={QUERY}
                    results={[ITEM_REFRESH_TOKEN, ITEM_PROACTIVE_REFRESH_CHALLENGE, ITEM_JWT_FLASHCARD]}
                >
                    <RelatedContentList
                        courseId={COURSE_ID}
                        courseDisplayId={COURSE_DISPLAY_ID}
                        query={QUERY}
                        label={LABEL}
                        excludeId="content-refresh-token"
                        className="w-full max-w-xl"
                    />
                </MockSearchResults>
            </Variant>

            <Variant
                label="limit — giới hạn số dòng hiển thị"
                hint="5 kết quả seed nhưng limit=2 nên chỉ 2 dòng khớp nhất được cắt ra hiển thị; mặc định limit là 3 khi không truyền — dùng limit nhỏ hơn cho ô hẹp như sidebar."
            >
                <MockSearchResults
                    courseId={COURSE_ID}
                    query={QUERY}
                    results={[
                        ITEM_REFRESH_TOKEN,
                        ITEM_PROACTIVE_REFRESH_CHALLENGE,
                        ITEM_JWT_FLASHCARD,
                        ITEM_SSO_MILESTONE_LOCKED,
                        ITEM_OAUTH_CONTENT,
                    ]}
                >
                    <RelatedContentList
                        courseId={COURSE_ID}
                        courseDisplayId={COURSE_DISPLAY_ID}
                        query={QUERY}
                        label={LABEL}
                        limit={2}
                        className="w-full max-w-xl"
                    />
                </MockSearchResults>
            </Variant>
        </Gallery>
    ),
}
