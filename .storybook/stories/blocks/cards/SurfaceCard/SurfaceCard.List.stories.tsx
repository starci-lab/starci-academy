import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Chip } from "@heroui/react"
import { CaretRightIcon, CreditCardIcon, TrayIcon, WalletIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardListItem } from "@sb-components/blocks/cards/SurfaceCard/SurfaceCard"
import { Feedback } from "@sb-components/blocks/feedback/Feedback/Feedback"
import { Skeleton } from "@sb-components/blocks/skeleton/Skeleton/Skeleton"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` nhận icon là COMPONENT ref và tự ép `size-8` (§4/§5) — phosphor
// `weight="duotone"` không đi kèm được nữa, nên bọc thành component để GIỮ NGUYÊN nét vẽ.
const TrayDuotone = (props: SVGProps<SVGSVGElement>) => <TrayIcon {...props} weight="duotone" />

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.List` là khung DANH SÁCH LẶP nên
 * `items` BẮT BUỘC là dữ liệu (cấm children). Story ở đây chỉ render state do CHÍNH nó đẻ:
 * hai shape hàng (`title` cố định vs `content` tự do), các cờ hàng (`selected`/`isDisabled`/
 * `hover`/`tone`), biên rỗng + 1 hàng, và mirror loading.
 *
 * Bộ header section (`label`/`labelEnd`/`onSeeMore`/`action`/`subtleLabel`/`description`)
 * dùng CHUNG `SurfaceCardHeader` với `SurfaceCard.Base` — ở đây chỉ giữ MỘT leaf `WithLabel`
 * để chứng minh header bật được; cả bộ state của header sống ở story `SurfaceCard.Base`.
 */
const meta: Meta<typeof SurfaceCard.List> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.List",
    component: SurfaceCard.List,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.List>

const caret = <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" />

/**
 * Mock-content chuẩn (C-fixture) cho ô `content` TỰ DO của item: avatar + title +
 * description. Item ĐÃ LÀ hộp row (padding + hover + separator riêng) nên KHÔNG bọc thêm
 * `Card` ngoài (tránh card-in-card) — chỉ giữ row.
 */
const profileRow = (initials: string, title: string, description: string) => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="truncate text-xs text-muted">{description}</span>
        </div>
    </div>
)

const courseItems: ReadonlyArray<SurfaceCardListItem> = [
    { key: "fundamentals", title: "Programming fundamentals", subtitle: "12 lessons · 4 hours", onPress: () => {}, trailing: caret, anatPart: "Row" },
    { key: "dsa", title: "Data structures & algorithms", subtitle: "18 lessons · 7 hours", onPress: () => {}, trailing: caret, anatPart: "Row" },
    { key: "system-design", title: "System design", subtitle: "9 lessons · 5 hours", onPress: () => {}, trailing: caret, anatPart: "Row" },
]

/** Bare list (không label): Surface + Row (lặp ×N). */
const BARE_PARTS: Array<AnatomyNode> = [
    {
        name: "Surface",
        tier: "primitive",
        role: "khung bo góc lớn, các Row cạnh nhau + separator full-bleed",
        children: [{ name: "Row", tier: "primitive", role: "1 hàng CỐ ĐỊNH (lặp ×N) — leading · title+subtitle · meta+trailing" }],
    },
]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Default"
                parts={BARE_PARTS}
                reason="Khung danh sách BOUNDED: một surface bo góc lớn ôm các hàng sát mép, mỗi hàng một separator full-bleed (hàng cuối tự ẩn). Không `label` → render trần (bare), không Header."
                code={`<SurfaceCard.List
  items={[
    { key: "fundamentals", title: "Programming fundamentals", subtitle: "12 lessons · 4 hours", onPress: () => {}, trailing: caret },
    { key: "dsa", title: "Data structures & algorithms", subtitle: "18 lessons · 7 hours", onPress: () => {}, trailing: caret },
  ]}
/>`}
            >
                <SurfaceCard.List items={courseItems} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Có label: Header (SurfaceCardHeader) + Surface + Row. Cả bộ slot header xem ở `SurfaceCard.Base`. */
const WITH_LABEL_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "nhãn phần (SurfaceCardHeader) phía trên surface" },
    ...BARE_PARTS,
]

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="WithLabel"
                parts={WITH_LABEL_PARTS}
                note="`label` bật Header phía trên (gap-3). Bỏ cả `label` lẫn `description` → khung trả về THẲNG div surface (bare). Bộ slot header đầy đủ (see-more/action/labelEnd/subtleLabel) diễn ở story SurfaceCard.Base."
                code={`<SurfaceCard.List
  label="Lộ trình của tôi"
  items={[…]}
/>`}
            >
                <SurfaceCard.List label="Lộ trình của tôi" items={courseItems} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** `leading` (thumbnail/icon) + `meta` (tag ngắn theo hàng) + `trailing` — hàng là một composition, không phẳng. */
export const LeadingMeta: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="LeadingMeta"
                parts={BARE_PARTS}
                note="Row nhận thêm `leading` (icon tròn) + `meta` (Chip) — vẫn 1 node Row (leading/meta là slot NỘI TẠI của Row, không phải part riêng của khung)."
                code={`<SurfaceCard.List
  items={[
    { key: "once", leading: <IconCircle/>, title: "One-time payment", subtitle: "Pay the full tuition now",
      meta: <Chip size="sm" variant="soft" color="success">Save 10%</Chip>, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        {
                            key: "once",
                            leading: (
                                <div className="flex size-10 items-center justify-center rounded-full bg-default">
                                    <CreditCardIcon className="size-5 text-muted" aria-hidden focusable="false" />
                                </div>
                            ),
                            title: "One-time payment",
                            subtitle: "Pay the full tuition now",
                            meta: <Chip size="sm" variant="soft" color="success" className="shrink-0">Save 10%</Chip>,
                            onPress: () => {},
                            anatPart: "Row",
                        },
                        {
                            key: "installments",
                            leading: (
                                <div className="flex size-10 items-center justify-center rounded-full bg-default">
                                    <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                                </div>
                            ),
                            title: "Installments over 3 months",
                            subtitle: "No interest",
                            trailing: caret,
                            onPress: () => {},
                            anatPart: "Row",
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

const ITEM_PARTS: Array<AnatomyNode> = [
    {
        name: "Surface",
        tier: "primitive",
        role: "khung bo góc lớn",
        children: [{ name: "Item", tier: "primitive", role: "1 hàng TỰ DO (lặp ×2, item có `content`) — nội dung bất kỳ, không slot cố định" }],
    },
]

/**
 * Shape thứ hai của item: `content` thay cho bộ slot cố định — khung vẫn giữ padding +
 * separator inset, caller tự bố trí bên trong. `content` THẮNG `title` khi truyền cả hai.
 */
export const FreeForm: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="FreeForm"
                parts={ITEM_PARTS}
                note="Item có `content` (khác Row có `title`) không ép leading/title/subtitle — nội dung hoàn toàn tự do (đây: avatar+title+description, C-fixture)."
                code={`<SurfaceCard.List
  items={[
    { key: "starci", content: profileRow("SC", "StarCi Academy", "…"), onPress: () => {} },
    { key: "quang", content: profileRow("QN", "Thầy Quang", "…"), onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        {
                            key: "starci",
                            content: profileRow("SC", "StarCi Academy", "Học fullstack, system design và DevOps theo lộ trình phỏng vấn."),
                            onPress: () => {},
                            anatPart: "Item",
                        },
                        {
                            key: "quang",
                            content: profileRow("QN", "Thầy Quang", "Mentor fullstack — review dự án và mock interview."),
                            onPress: () => {},
                            anatPart: "Item",
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `selected` — lựa chọn ĐANG DÙNG trong nhóm single-select: CheckCircleIcon accent ở cuối hàng (không tint cả hàng). */
export const Selected: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Selected"
                parts={BARE_PARTS}
                note="Row `selected` → CheckCircleIcon trailing accent + `aria-current` — vẫn 1 node Row, không drill xuống icon."
                code={`<SurfaceCard.List
  items={[
    { key: "vi", title: "Vietnamese", onPress: () => {} },
    { key: "en", title: "English", selected: true, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "vi", title: "Vietnamese", onPress: () => {}, anatPart: "Row" },
                        { key: "en", title: "English", selected: true, onPress: () => {}, anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `isDisabled` — một lựa chọn TỒN TẠI nhưng chưa mở khoá: dim + tắt tương tác, vẫn hiện (không ẩn khỏi danh sách). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Disabled"
                parts={BARE_PARTS}
                note="1 Row `isDisabled` — vẫn hiện, dimmed + non-interactive (không ẩn khỏi danh sách)."
                code={`<SurfaceCard.List
  items={[
    { key: "pdf", title: "Export PDF invoice", onPress: () => {} },
    { key: "xlsx", title: "Export Excel report (coming soon)", isDisabled: true, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "pdf", title: "Export PDF invoice", onPress: () => {}, anatPart: "Row" },
                        {
                            key: "xlsx",
                            title: "Export Excel report (coming soon)",
                            subtitle: "Not yet available on the current plan",
                            isDisabled: true,
                            onPress: () => {},
                            anatPart: "Row",
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `hover="underline"` — hàng LÀ một link (điều hướng đi): TITLE underline khi hover, không tint nền hàng. */
export const HoverUnderline: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="HoverUnderline"
                parts={BARE_PARTS}
                note={"`hover=\"underline\"` + `href` → Row render `<a>`, title underline khi hover (không tint nền hàng)."}
                code={`<SurfaceCard.List
  items={[
    { key: "dropout", title: "Why do learners drop out of courses?", subtitle: "12.4k reads", hover: "underline", href: "#" },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "dropout", title: "Why do learners drop out of courses?", subtitle: "12.4k reads", hover: "underline", href: "#", anatPart: "Row" },
                        { key: "senior", title: "The path to becoming a Senior Backend engineer", subtitle: "9.1k reads", hover: "underline", href: "#", anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Static (chỉ đọc): không `onPress`/`href` → `<div>` thuần, không hover/focus/cursor (đừng giả vờ bấm được). */
export const Static: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Static"
                parts={BARE_PARTS}
                note="Không `onPress`/`href` → Row render `<div>` tĩnh (không hover/focus/cursor giả)."
                code={`<SurfaceCard.List
  items={[
    { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger">nhớ 25%</Chip> },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger" className="shrink-0">nhớ 25%</Chip>, anatPart: "Row" },
                        { key: "errors", title: "Error Handling", meta: <Chip size="sm" variant="soft" color="warning" className="shrink-0">nhớ 33%</Chip>, anatPart: "Row" },
                        { key: "authz", title: "Authorization", meta: <Chip size="sm" variant="soft" color="success" className="shrink-0">nhớ 57%</Chip>, anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `tone` — dải inset bên trái mang NGHĨA TỪ DATA (một tier / vùng promote-demote). Rút gọn của `withVerdict`. */
export const Verdict: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Verdict"
                parts={BARE_PARTS}
                note="`tone` = rút gọn của `withVerdict={{ enable: true, variant: tone }}` → dải inset-shadow trái ngay trên Row, không phải part riêng."
                code={`<SurfaceCard.List
  items={[
    { key: "shell", title: "Shell & hệ thống file", tone: "success", onPress: () => {} },
    { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {} },
    { key: "perm", title: "Quyền file cơ bản", tone: "danger", onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "shell", title: "Shell & hệ thống file", tone: "success", onPress: () => {}, anatPart: "Row" },
                        { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {}, anatPart: "Row" },
                        { key: "perm", title: "Quyền file cơ bản", tone: "danger", onPress: () => {}, anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Biên: đúng 1 hàng — separator tự ẩn ở hàng cuối (không cần ≥2 hàng để hợp lệ). */
export const SingleRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="SingleRow"
                parts={BARE_PARTS}
                note="Chỉ 1 Row — separator tự ẩn ở hàng cuối (biên: không cần ≥2 hàng để hợp lệ)."
                code={`<SurfaceCard.List
  items={[{ key: "only", title: "Chỉ một mục", onPress: () => {}, trailing: caret }]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[{ key: "only", title: "Chỉ một mục", subtitle: "Separator tự ẩn ở row cuối", onPress: () => {}, trailing: caret, anatPart: "Row" }]}
                />
            </BlockAnatomy>
        </div>
    ),
}

const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "nhãn phần" },
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
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Empty"
                parts={EMPTY_PARTS}
                note="`items={[]}` → `emptyState` lấp đầy Surface (p-8) thay vì bỏ trống."
                code={`<SurfaceCard.List
  label="Khoá của tôi"
  items={[]}
  emptyState={<Feedback.Empty icon={TrayDuotone} title="Chưa có khoá nào" … />}
/>`}
            >
                <SurfaceCard.List
                    label="Khoá của tôi"
                    items={[]}
                    emptyState={
                        <Feedback.Empty
                            icon={TrayDuotone}
                            title="Chưa có khoá nào"
                            description="Ghi danh một khoá để thấy nó ở đây."
                            action={<Button variant="primary" size="sm">Khám phá khoá học</Button>}
                            anatPart="Feedback.Empty"
                        />
                    }
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "primitive", role: "nhãn phần (giữ nguyên, KHÔNG skeleton hoá)" },
    {
        name: "Surface",
        tier: "primitive",
        role: "khung bo góc lớn (giữ nguyên frame thật)",
        children: [{ name: "Row", tier: "primitive", role: "1 hàng THẬT (lặp ×3), title thay bằng Skeleton bar" }],
    },
]

/**
 * Loading: khung danh sách KHÔNG có cờ `isSkeleton` — caller MIRROR cây thật: vẫn cùng
 * `SurfaceCard.List` + item THẬT (giữ separator full-bleed + frame), chỉ `title` đổi thành
 * một thanh `Skeleton` (skeleton.md: mirror cây layout, giữ node cấu trúc — list skeleton =
 * card liền khối, KHÔNG rã thành hàng rời rạc).
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="Skeleton MIRROR cây thật: Header + Surface + Row THẬT vẫn đứng nguyên, chỉ title bên trong Row đổi thành Skeleton bar."
                code={`<SurfaceCard.List
  label="Khoá của tôi"
  items={[0, 1, 2].map((i) => ({ key: String(i), title: <Skeleton className="h-[14px] w-1/2 rounded" /> }))}
/>`}
            >
                <SurfaceCard.List
                    label="Khoá của tôi"
                    showAnatomy
                    items={[0, 1, 2].map((i) => ({
                        key: String(i),
                        title: <Skeleton className="h-[14px] w-1/2 rounded" />,
                        anatPart: "Row",
                    }))}
                />
            </BlockAnatomy>
        </div>
    ),
}
