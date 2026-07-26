import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Chip, Skeleton as HeroSkeleton } from "@heroui/react"
import { CaretRightIcon, CreditCardIcon, TrayIcon, WalletIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardListItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 *
 * ⚠️ `variant` (§1a, `.List` cũng có prop này — 2026-07-26) KHÔNG có leaf riêng ở đây: state
 * đó là TRỤC surface-in-surface, cùng leaf `Variants` đã diễn ở `SurfaceCard.Base`/`.Accordion`,
 * không lặp lại một lần nữa cho mỗi member cùng khung.
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

/**
 * `Feedback.Empty` là DEP THẬT của leaf `Empty` (story riêng, bấm nhảy được) — khớp shape
 * icon+title+description+action đang render ở leaf này ⇒ trỏ đúng leaf `Action` bên đó.
 * Mọi part khác của khung (`Surface`/`Header`/`Row`/`Item`) KHÔNG có story riêng nên
 * KHÔNG khai — đường cũ `parts={...}` từng khai chúng chỉ tạo entry chết (không bấm được).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the Surface when items is empty — icon + title + description + action.",
    tier: "primitive",
    storyId: "layouts-feedback-feedback-feedback-empty--action",
}

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Default"
                reason="A BOUNDED list frame: one large-radius surface holds edge-to-edge rows, each separated by a full-bleed divider (the last row hides its own). No `label` → renders bare, no Header."
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
export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="WithLabel"
                note="`label` turns on the Header above (gap-3). Drop both `label` and `description` → the frame returns a bare surface div directly. The full header slot set (see-more/action/labelEnd/subtleLabel) is demonstrated in the SurfaceCard.Base story."
                code={`<SurfaceCard.List
  label="My learning path"
  items={[…]}
/>`}
            >
                <SurfaceCard.List label="My learning path" items={courseItems} showAnatomy />
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
                note="The row also takes `leading` (a round icon) + `meta` (a Chip) — still ONE Row node (leading/meta are INTERNAL slots of Row, not separate frame parts)."
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
                note="An item with `content` (instead of Row's `title`) skips the forced leading/title/subtitle shape — content is entirely free-form (here: avatar + title + description, the C-fixture)."
                code={`<SurfaceCard.List
  items={[
    { key: "starci", content: profileRow("SC", "StarCi Academy", "…"), onPress: () => {} },
    { key: "quang", content: profileRow("QN", "Mentor Quang", "…"), onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        {
                            key: "starci",
                            content: profileRow("SC", "StarCi Academy", "Learn fullstack, system design, and DevOps along an interview-prep path."),
                            onPress: () => {},
                            anatPart: "Item",
                        },
                        {
                            key: "quang",
                            content: profileRow("QN", "Mentor Quang", "Fullstack mentor — reviews projects and runs mock interviews."),
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
                note="Row `selected` → a trailing accent CheckCircleIcon + `aria-current` — still one Row node, no drilling into the icon."
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
                note="One Row with `isDisabled` — stays visible, dimmed + non-interactive (not hidden from the list)."
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
                note={"`hover=\"underline\"` + `href` → the Row renders as an `<a>`, the title underlines on hover (no row background tint)."}
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
                note="No `onPress`/`href` → the Row renders a static `<div>` (no fake hover/focus/cursor)."
                code={`<SurfaceCard.List
  items={[
    { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger">25% recall</Chip> },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger" className="shrink-0">25% recall</Chip>, anatPart: "Row" },
                        { key: "errors", title: "Error Handling", meta: <Chip size="sm" variant="soft" color="warning" className="shrink-0">33% recall</Chip>, anatPart: "Row" },
                        { key: "authz", title: "Authorization", meta: <Chip size="sm" variant="soft" color="success" className="shrink-0">57% recall</Chip>, anatPart: "Row" },
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
                note="`tone` is shorthand for `withVerdict={{ enable: true, variant: tone }}` → a left inset-shadow band right on the Row, not a separate part."
                code={`<SurfaceCard.List
  items={[
    { key: "shell", title: "Shell & file system", tone: "success", onPress: () => {} },
    { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {} },
    { key: "perm", title: "Basic file permissions", tone: "danger", onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "shell", title: "Shell & file system", tone: "success", onPress: () => {}, anatPart: "Row" },
                        { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {}, anatPart: "Row" },
                        { key: "perm", title: "Basic file permissions", tone: "danger", onPress: () => {}, anatPart: "Row" },
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
                note="Just one Row — the separator hides itself on the last row (edge case: no need for ≥2 rows to be valid)."
                code={`<SurfaceCard.List
  items={[{ key: "only", title: "Just one item", onPress: () => {}, trailing: caret }]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[{ key: "only", title: "Just one item", subtitle: "The separator hides itself on the last row", onPress: () => {}, trailing: caret, anatPart: "Row" }]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Empty: `items` rỗng → {@link Feedback.Empty} lấp đầy surface (không để card trắng trơn). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Empty"
                annotate={{ "Feedback.Empty": PART_FEEDBACK_EMPTY }}
                note="`items={[]}` → `emptyState` fills the Surface (p-8) instead of leaving it blank."
                code={`<SurfaceCard.List
  label="My courses"
  items={[]}
  emptyState={<Feedback.Empty icon={TrayDuotone} title="No courses yet" … />}
/>`}
            >
                <SurfaceCard.List
                    label="My courses"
                    items={[]}
                    emptyState={
                        <Feedback.Empty
                            icon={TrayDuotone}
                            title="No courses yet"
                            description="Enroll in a course to see it here."
                            action={<Button variant="primary" size="sm">Explore courses</Button>}
                            anatPart="Feedback.Empty"
                        />
                    }
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

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
                note="Skeleton MIRRORS the real tree: Header + Surface + real Row stay exactly as-is, only the title inside each Row swaps for a Skeleton bar."
                code={`<SurfaceCard.List
  label="My courses"
  items={[0, 1, 2].map((i) => ({ key: String(i), title: <HeroSkeleton className="h-[14px] w-1/2 rounded" /> }))}
/>`}
            >
                <SurfaceCard.List
                    label="My courses"
                    showAnatomy
                    items={[0, 1, 2].map((i) => ({
                        key: String(i),
                        title: <HeroSkeleton className="h-[14px] w-1/2 rounded" />,
                        anatPart: "Row",
                    }))}
                />
            </BlockAnatomy>
        </div>
    ),
}
