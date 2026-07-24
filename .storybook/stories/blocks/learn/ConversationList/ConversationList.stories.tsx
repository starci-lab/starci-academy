import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConversationList, type ConversationListItem } from "./ConversationList"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the conversation-picker REGION inside the AI-chat drawer
 * (`ContentAiChat/index.tsx:1044-1197`): a self-scrolling, bounded list of chat
 * sessions driven by `AsyncContent` (error → loading → empty → content), each
 * row switchable to an inline rename `<input>`, with a ⋯ menu for
 * Đổi tên / Lưu trữ / Xoá.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ConversationList> = {
    title: "Block/Learn/ConversationList",
    component: ConversationList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof ConversationList>

/** Frame each leaf with breathing room + a bounded width (mirrors the real drawer column). */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-sm p-8">{node}</div>

const noop = () => {}

const SESSIONS: Array<ConversationListItem> = [
    { id: "1", title: "Ôn tập Big-O trước phỏng vấn", subtitle: "Độ phức tạp thuật toán · 12 lượt", isActive: false },
    { id: "2", title: "Giải thích join bảng SQL", subtitle: "Cơ sở dữ liệu & ORM · 8 lượt", isActive: false },
    { id: "3", title: null, subtitle: "Cả khoá · 3 lượt", isActive: false },
]

// ── content leaf — chrome: ScrollShadow → AsyncContent(content) → SurfaceListCard → rows. ──
const DATA_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn tự giới hạn 55vh" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "switch error → loading → empty → content",
        state: "content",
        children: [
            {
                name: "SurfaceListCard",
                tier: "design",
                role: "khung surface bordered chứa các phiên",
                children: [
                    {
                        name: "SurfaceListCardItem",
                        tier: "design",
                        role: "một phiên trò chuyện (lặp ×N)",
                        children: [
                            { name: "TitledText", tier: "design", role: "tiêu đề (body-sm, rỗng → \"Chưa đặt tên\") + phụ đề (body-xs muted)" },
                            {
                                name: "Dropdown",
                                tier: "primitive",
                                role: "menu ⋯ ẩn khi đang đổi tên",
                                children: [
                                    { name: "Button · ⋯", tier: "primitive", role: "nút kích hoạt menu (size-sm, icon tự ép cỡ)" },
                                    { name: "DropdownItem · Đổi tên", tier: "primitive", role: "vào chế độ sửa tên" },
                                    { name: "DropdownItem · Lưu trữ", tier: "primitive", role: "lưu trữ phiên" },
                                    { name: "DropdownItem · Xoá", tier: "primitive", role: "xoá phiên (tô danger)", state: "danger" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

// loading leaf — AsyncContent falls to its loading branch → a bordered
// SurfaceListCard of skeleton rows (same footprint as a real row).
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn (vẫn hiện)" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh loading",
        state: "loading",
        children: [
            {
                name: "SurfaceListCard",
                tier: "design",
                role: "khung surface bordered — skeleton mirror",
                children: [
                    {
                        name: "SurfaceListCardItem",
                        tier: "design",
                        role: "hàng skeleton ×3 (source :1049 `[0, 1, 2]`)",
                        children: [
                            { name: "Skeleton.Typography · tiêu đề", tier: "primitive", role: "mirror body-sm, rộng 2/3" },
                            { name: "Skeleton.Typography · phụ đề", tier: "primitive", role: "mirror body-xs, rộng 1/2" },
                            { name: "Skeleton · nút ⋯", tier: "primitive", role: "mirror size-8 rounded-xl" },
                        ],
                    },
                ],
            },
        ],
    },
]

// empty leaf — chrome stays, AsyncContent falls to EmptyContent → EmptyState.
// SAME copy as the error leaf (source :1063-1070), no retry button.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh empty",
        state: "empty",
        children: [
            {
                name: "EmptyContent",
                tier: "design",
                role: "khung rỗng của region",
                children: [
                    { name: "EmptyState", tier: "primitive", role: "\"Chưa có cuộc trò chuyện\" — KHÔNG nút thử lại" },
                ],
            },
        ],
    },
]

// error leaf — chrome stays, AsyncContent falls to ErrorContent → EmptyState
// (tone danger). Source dùng CÙNG câu với empty, không có onRetry/retryLabel
// nên KHÔNG có nút thử lại — anatomy phản ánh đúng thực tế đó.
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh error",
        state: "error",
        children: [
            {
                name: "ErrorContent",
                tier: "design",
                role: "khung lỗi của region",
                children: [
                    { name: "EmptyState", tier: "primitive", role: "\"Chưa có cuộc trò chuyện\" (cùng câu empty) — KHÔNG nút thử lại", state: "danger" },
                ],
            },
        ],
    },
]

// active-row leaf — SAME shape as DATA_PARTS, plus the accent-tint wrapper
// (source :1075-1079) around the open session's title+menu.
const ACTIVE_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh content",
        state: "content",
        children: [
            {
                name: "SurfaceListCard",
                tier: "design",
                role: "khung surface bordered",
                children: [
                    {
                        name: "SurfaceListCardItem",
                        tier: "design",
                        role: "phiên ĐANG MỞ",
                        children: [
                            {
                                name: "row · đang mở",
                                tier: "design",
                                role: "bọc `text-accent-soft-foreground` (source :1078) — Typography vẫn giữ màu prop riêng, xem note file header",
                                state: "accent",
                                children: [
                                    { name: "TitledText", tier: "design", role: "tiêu đề + phụ đề của phiên đang mở" },
                                    { name: "Dropdown", tier: "primitive", role: "menu ⋯ của phiên đang mở" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

// renaming leaf — the ⋯ menu is HIDDEN (source :1135); the title/subtitle
// column is replaced by a single bare `<input>` (source :1081-1102).
const RENAMING_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh content",
        state: "content",
        children: [
            {
                name: "SurfaceListCard",
                tier: "design",
                role: "khung surface bordered",
                children: [
                    {
                        name: "SurfaceListCardItem",
                        tier: "design",
                        role: "phiên ĐANG ĐỔI TÊN — cột title/subtitle rút còn 1 input, KHÔNG có menu ⋯",
                        children: [
                            { name: "input · đổi tên", tier: "primitive", role: "input trần, autoFocus; Enter/blur lưu, Escape huỷ" },
                        ],
                    },
                ],
            },
        ],
    },
]

// paginating leaf — SAME as DATA_PARTS, plus a TRAILING skeleton row.
// IMPROVEMENT over source (:1189-1197 rendered a bare "đang tải" Typography
// line): the trailing row mirrors the real row footprint instead — no jump.
const PAGINATING_PARTS: Array<AnatomyNode> = [
    { name: "ScrollShadow", tier: "primitive", role: "khung cuộn" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh content",
        state: "content",
        children: [
            {
                name: "SurfaceListCard",
                tier: "design",
                role: "khung surface bordered",
                children: [
                    { name: "SurfaceListCardItem", tier: "design", role: "các phiên đã tải" },
                    {
                        name: "SurfaceListCardItem · đang tải thêm",
                        tier: "design",
                        role: "hàng skeleton mirror NỐI THÊM cuối danh sách — cải thiện so với source (dòng chữ trần)",
                        state: "loading",
                        children: [
                            { name: "Skeleton.Typography · tiêu đề", tier: "primitive", role: "mirror body-sm" },
                            { name: "Skeleton.Typography · phụ đề", tier: "primitive", role: "mirror body-xs" },
                            { name: "Skeleton · nút ⋯", tier: "primitive", role: "mirror size-8" },
                        ],
                    },
                ],
            },
        ],
    },
]

// subtitle-variants leaf — SAME composition as DATA_PARTS; the point of this
// leaf is the DATA (4 branches of source :1123-1129), not a new shape.
const SUBTITLE_VARIANTS_PARTS: Array<AnatomyNode> = DATA_PARTS

/** DATA — the real region with sessions loaded, none active. */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Danh sách"
                parts={DATA_PARTS}
                reason="Gộp ScrollShadow (tự giới hạn 55vh) + AsyncContent (error/loading/empty/content) + SurfaceListCard vào MỘT region, mỗi phiên là 1 SurfaceListCardItem tái dùng TitledText cho cụm tiêu đề/phụ đề thay vì rải Typography tay."
            >
                <ConversationList
                    items={SESSIONS}
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** SKELETON — first load, nothing cached yet. */
export const Skeleton: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="AsyncContent nhánh loading → 3 hàng skeleton mirror đúng footprint hàng thật (source :1047-1062)."
            >
                <ConversationList
                    items={[]}
                    isLoading
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** EMPTY — loaded, zero sessions. */
export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Không có phiên nào → AsyncContent rơi về EmptyContent, câu 'Chưa có cuộc trò chuyện', KHÔNG nút thử lại (source :1063-1066)."
            >
                <ConversationList
                    items={[]}
                    isEmpty
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** ERROR — load failed, nothing cached. SAME copy as Empty, no retry (source gap, ported as-is). */
export const ErrorState: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Lỗi"
                parts={ERROR_PARTS}
                note="Tải hỏng, không cache → AsyncContent rơi về ErrorContent → EmptyState tone danger, nhưng dùng CÙNG câu 'Chưa có cuộc trò chuyện' với Empty và KHÔNG có nút thử lại — port trung thực source :1067-1070 (không phải audit ẩu, đây thực sự là 1 gap của source)."
            >
                <ConversationList
                    items={[]}
                    hasError
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** ACTIVE ROW — one session is the currently-open one (accent-tinted wrapper). */
export const ActiveRow: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Có hàng đang mở"
                parts={ACTIVE_PARTS}
                note="Phiên #1 isActive=true → wrapper của hàng đó nhận text-accent-soft-foreground (source :1078). Typography bên trong (qua TitledText) KHÔNG override màu — xem note ở đầu file ConversationList.tsx về việc Typography luôn tự set màu explicit, nên tint này port ĐÚNG vị trí source đặt (wrapper), không đặt lên Typography (cấm theo canon §1)."
            >
                <ConversationList
                    items={SESSIONS.map((session) => (session.id === "1" ? { ...session, isActive: true } : session))}
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** RENAMING — one row swapped into its inline-rename `<input>`; its ⋯ menu is hidden. */
export const Renaming: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Đang đổi tên"
                parts={RENAMING_PARTS}
                note="renamingId khớp phiên #2 → cột title/subtitle rút thành 1 input trần (autoFocus), menu ⋯ ẩn hoàn toàn (source :1081-1102, :1135)."
            >
                <ConversationList
                    items={SESSIONS}
                    renamingId="2"
                    renameValue="Giải thích join bảng SQL (đang sửa)"
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** PAGINATING — sessions already showing, next page loading below (skeleton row, not bare text). */
export const Paginating: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Đang tải thêm"
                parts={PAGINATING_PARTS}
                note="CẢI THIỆN so với source (:1189-1197 chỉ có dòng chữ 'đang tải' trần, không giữ layout): ở đây nối thêm 1 hàng skeleton mirror cuối danh sách — cùng footprint hàng thật nên không giật khi trang kế tới."
            >
                <ConversationList
                    items={SESSIONS}
                    isPaginating
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}

/** SUBTITLE VARIANTS — the 4 branches source resolves at :1123-1129, side by side. */
export const SubtitleVariants: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ConversationList"
                tier="block"
                leaf="Subtitle biến thể"
                parts={SUBTITLE_VARIANTS_PARTS}
                note="Subtitle đến từ 4 nhánh nguồn (source :1123-1129): snippet khi đang search · 'tên bài · N lượt' · 'Cả khoá · N lượt' · chỉ 'N lượt' (không có nguồn). ConversationList CHỈ render chuỗi đã resolve — logic rẽ nhánh thuộc về caller."
            >
                <ConversationList
                    items={[
                        { id: "s1", title: "Ôn tập Big-O trước phỏng vấn", subtitle: "…độ phức tạp trung bình của quicksort là O(n log n)…", isActive: false },
                        { id: "s2", title: "Giải thích join bảng SQL", subtitle: "Cơ sở dữ liệu & ORM · 8 lượt", isActive: false },
                        { id: "s3", title: "Hỏi đáp tự do", subtitle: "Cả khoá · 5 lượt", isActive: false },
                        { id: "s4", title: null, subtitle: "3 lượt", isActive: false },
                    ]}
                    showAnatomy
                    onSelect={noop}
                    onRenameStart={noop}
                    onRenameChange={noop}
                    onRenameCommit={noop}
                    onRenameCancel={noop}
                    onArchive={noop}
                    onDelete={noop}
                />
            </BlockAnatomy>,
        ),
}
