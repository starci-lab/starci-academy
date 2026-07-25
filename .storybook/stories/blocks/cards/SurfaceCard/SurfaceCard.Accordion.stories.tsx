import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Chip } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardAccordionItem } from "@sb-components/blocks/cards/SurfaceCard/SurfaceCard"
import { Feedback } from "@sb-components/blocks/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` nhận icon là COMPONENT ref và tự ép `size-8` (§4/§5) — phosphor
// `weight="duotone"` không đi kèm được nữa, nên bọc thành component để GIỮ NGUYÊN nét vẽ.
const FolderOpenDuotone = (props: SVGProps<SVGSVGElement>) => <FolderOpenIcon {...props} weight="duotone" />

/**
 * KHUNG (Layouts) — một khung `bg-surface` bounded ôm các section GẬP ĐƯỢC, separator chạy
 * full-bleed tới mép card: cùng skin với `SurfaceCard.List`, khác ở chỗ mỗi hàng mở ra được.
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): story ở đây chỉ render state do CHÍNH nó đẻ —
 * `items` (danh sách LẶP → dữ liệu, cấm children), `titleEnd`, chế độ mở
 * (`allowsMultipleExpanded` / `defaultExpandedKeys`), `bordered`, rỗng, và mirror loading.
 * Bộ slot header section dùng chung `SurfaceCardHeader` với `SurfaceCard.Base` → ở đây chỉ
 * giữ MỘT leaf `WithLabel`, không lặp cả bộ.
 *
 * ANATOMY IS PER-LEAF: mỗi story là leaf riêng, mang BlockAnatomy riêng.
 */
const meta: Meta<typeof SurfaceCard.Accordion> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Accordion",
    component: SurfaceCard.Accordion,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Accordion>

/**
 * Mock-content chuẩn (C-fixture) = ProfileCard: avatar + title + description. `items[].body`
 * mở ra BÊN TRONG khung accordion (đã là 1 `bg-surface`) nên KHÔNG bọc thêm `Card` ngoài —
 * tránh card-in-card (§1a) — chỉ giữ row avatar+title+desc.
 */
const panel = () => (
    <div className="flex flex-row items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Học fullstack, system design và DevOps theo lộ trình phỏng vấn.
            </span>
        </div>
    </div>
)

const items: ReadonlyArray<SurfaceCardAccordionItem> = [
    { id: "rest", title: "REST semantics", subtitle: "3 tài nguyên", body: panel() },
    { id: "input", title: "Input contract", subtitle: "2 tài nguyên", body: panel() },
    { id: "error", title: "Error handling", subtitle: "4 tài nguyên", body: panel() },
]

const ROW: AnatomyNode = { name: "Row", tier: "primitive", role: "1 hàng accordion (lặp ×3) — tiêu đề+phụ đề, mở ra body panel khi expand" }
const SURFACE_WITH_ROWS: AnatomyNode = {
    name: "Surface",
    tier: "primitive",
    role: "khung bg-surface bo góc lớn, các Row cạnh nhau + separator full-bleed",
    children: [ROW],
}
const HEADER: AnatomyNode = { name: "Header", tier: "primitive", role: "nhãn phần (SurfaceCardHeader) phía trên surface" }

/** Bare (không label, không description): Surface + Row (lặp ×3). */
const BARE_PARTS: Array<AnatomyNode> = [SURFACE_WITH_ROWS]

/** Có label: Header + Surface + Row. */
const WITH_LABEL_PARTS: Array<AnatomyNode> = [HEADER, SURFACE_WITH_ROWS]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Default"
                parts={BARE_PARTS}
                reason="Không có `label`/`description` (bare) → render thẳng Surface bọc các Row, không Header. Mặc định `allowsMultipleExpanded=false`: mở Row khác thì Row đang mở tự đóng."
                code={`<SurfaceCard.Accordion
  items={[
    { id: "rest", title: "REST semantics", subtitle: "3 tài nguyên", body: <Panel /> },
    { id: "input", title: "Input contract", subtitle: "2 tài nguyên", body: <Panel /> },
  ]}
  defaultExpandedKeys={new Set(["rest"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy items={items} defaultExpandedKeys={new Set(["rest"])} />
            </BlockAnatomy>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="WithLabel"
                parts={WITH_LABEL_PARTS}
                note="`label` bật Header phía trên (gap-3 giữa Header và Surface). Bộ slot header đầy đủ (see-more/action/labelEnd/subtleLabel/description) diễn ở story SurfaceCard.Base."
                code={`<SurfaceCard.Accordion
  label="Tài nguyên"
  items={[…]}
  defaultExpandedKeys={new Set(["rest"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Tài nguyên" items={items} defaultExpandedKeys={new Set(["rest"])} />
            </BlockAnatomy>
        </div>
    ),
}

export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            {/* surface-in-surface: khung accordion lồng trong surface khác phân định bằng
                BORDER, không phải shadow (shadow gần như vô hình trên nền surface, dark mode). */}
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Accordion"
                    tier="primitive"
                    leaf="Bordered"
                    parts={WITH_LABEL_PARTS}
                    note="`bordered` → Surface dùng border thay vì shadow-surface (surface lồng surface)."
                    code={`<SurfaceCard.Accordion
  label="Tài nguyên"
  bordered
  items={[…]}
/>`}
                >
                    <SurfaceCard.Accordion showAnatomy label="Tài nguyên" bordered items={items} defaultExpandedKeys={new Set(["rest"])} />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

const TITLE_END_ROW: AnatomyNode = { ...ROW, role: "1 hàng accordion (lặp ×3) — tiêu đề + Chip trạng thái (titleEnd) trước caret" }
const WITH_TITLE_END_PARTS: Array<AnatomyNode> = [HEADER, { ...SURFACE_WITH_ROWS, children: [TITLE_END_ROW] }]

/**
 * `items[].titleEnd` — node bên phải tiêu đề (trái caret): chip trạng thái / điểm số ngay
 * trong trigger đang gập. Tiêu đề tự truncate nhường chỗ; `titleEnd` giữ nguyên bề rộng.
 */
export const WithTitleEnd: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="WithTitleEnd"
                parts={WITH_TITLE_END_PARTS}
                note="`titleEnd` (Chip trạng thái) hiện trước caret; title tự truncate nhường chỗ."
                code={`<SurfaceCard.Accordion
  label="Cột mốc"
  items={[
    { id: "m1", title: "1/1. Khởi tạo dự án", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Xong</Chip.Label></Chip>, body: <Panel /> },
  ]}
/>`}
            >
                <SurfaceCard.Accordion
                    showAnatomy
                    label="Cột mốc"
                    defaultExpandedKeys={new Set(["m2"])}
                    items={[
                        { id: "m1", title: "1/1. Khởi tạo dự án", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Xong</Chip.Label></Chip>, body: panel() },
                        { id: "m2", title: "2/2. Xây API", titleEnd: <Chip size="sm" variant="soft" color="warning"><Chip.Label>Đang làm</Chip.Label></Chip>, body: panel() },
                        { id: "m3", title: "3/3. Triển khai", titleEnd: <Chip size="sm" variant="soft" color="default"><Chip.Label>Chưa bắt đầu</Chip.Label></Chip>, body: panel() },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `allowsMultipleExpanded` — nhiều section mở cùng lúc (mặc định là single-open, xem leaf Default). */
export const MultipleExpand: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="MultipleExpand"
                parts={WITH_LABEL_PARTS}
                note="`allowsMultipleExpanded` → nhiều Row có thể mở cùng lúc; composition không đổi."
                code={`<SurfaceCard.Accordion
  label="Mở nhiều"
  allowsMultipleExpanded
  items={[…]}
  defaultExpandedKeys={new Set(["rest", "error"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Mở nhiều" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
            </BlockAnatomy>
        </div>
    ),
}

/** Đóng hết: `defaultExpandedKeys` rỗng — mọi section gập khi mount. */
export const NoneExpand: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="NoneExpand"
                parts={WITH_LABEL_PARTS}
                note="`defaultExpandedKeys` rỗng — mọi Row đóng khi mount."
                code={`<SurfaceCard.Accordion
  label="Đóng hết"
  items={[…]}
  defaultExpandedKeys={new Set()}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Đóng hết" items={items} defaultExpandedKeys={new Set()} />
            </BlockAnatomy>
        </div>
    ),
}

const EMPTY_PARTS: Array<AnatomyNode> = [
    HEADER,
    {
        name: "Surface",
        tier: "primitive",
        role: "khung bo góc lớn, bọc Feedback.Empty thay vì Row",
        children: [{ name: "Feedback.Empty", tier: "primitive", role: "trạng thái rỗng lấp đầy surface (không phải card trắng trơn)" }],
    },
]

/** Empty: `items` rỗng → {@link Feedback.Empty} lấp đầy surface (không để card trắng trơn). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="`items={[]}` → `emptyState` lấp đầy Surface (p-8) thay vì bỏ trống."
                code={`<SurfaceCard.Accordion
  label="Tài nguyên"
  items={[]}
  emptyState={<Feedback.Empty icon={FolderOpenDuotone} title="Chưa có tài nguyên" … />}
/>`}
            >
                <SurfaceCard.Accordion
                    showAnatomy
                    label="Tài nguyên"
                    items={[]}
                    emptyState={
                        <Feedback.Empty
                            icon={FolderOpenDuotone}
                            title="Chưa có tài nguyên"
                            description="Tài liệu cho chủ đề này sẽ xuất hiện ở đây."
                            anatPart="Feedback.Empty"
                        />
                    }
                />
            </BlockAnatomy>
        </div>
    ),
}

const SKELETON_PARTS: Array<AnatomyNode> = [
    HEADER,
    { name: "Skeleton.Accordion", tier: "primitive", role: "mirror TOÀN BỘ Surface+Row bằng skeleton bar (số dòng = items.length); Header vẫn render THẬT" },
]

/** Loading: `isSkeleton` tự vẽ mirror `Skeleton.Accordion` (giữ vỏ surface) — không dựng Skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="`isSkeleton` thay TOÀN BỘ Surface/Row bằng `Skeleton.Accordion` (1 mirror node); Header phía trên KHÔNG đổi (vẫn nhãn thật)."
                code={`<SurfaceCard.Accordion
  label="Tài nguyên"
  items={[…]}
  isSkeleton
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Tài nguyên" items={items} isSkeleton />
            </BlockAnatomy>
        </div>
    ),
}
