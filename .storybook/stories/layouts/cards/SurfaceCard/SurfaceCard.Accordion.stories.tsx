import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Chip } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardAccordionItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import type { SurfaceCardVariant } from "@sb-components/layouts/cards/surface-card-header"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` nhận icon là COMPONENT ref và tự ép `size-8` (§4/§5) — phosphor
// `weight="duotone"` không đi kèm được nữa, nên bọc thành component để GIỮ NGUYÊN nét vẽ.
const FolderOpenDuotone = (props: SVGProps<SVGSVGElement>) => <FolderOpenIcon {...props} weight="duotone" />

/**
 * KHUNG (Layouts) — một khung `bg-surface` bounded ôm các section GẬP ĐƯỢC, separator chạy
 * full-bleed tới mép card: cùng skin với `SurfaceCard.List`, khác ở chỗ mỗi hàng mở ra được.
 *
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): story ở đây chỉ render state do CHÍNH nó đẻ —
 * `items` (danh sách LẶP → dữ liệu, cấm children), `titleEnd`, chế độ mở
 * (`allowsMultipleExpanded` / `defaultExpandedKeys`), `variant`, rỗng, và mirror loading.
 * Bộ slot header section dùng chung `SurfaceCardHeader` với `SurfaceCard.Base` → ở đây chỉ
 * giữ MỘT leaf `WithLabel`, không lặp cả bộ.
 *
 * ⭐ 2026-07-26 (thầy): `bordered?: boolean` đổi thành `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`, một trong BA TRỤC ĐỘC LẬP cùng `SurfaceCard.Base`/`.List`/
 * `.CrossList`). Leaf `Bordered` (chỉ diễn nửa union) gộp thành `Variants` — render ĐỦ
 * union `surface`/`nested` cạnh nhau thay vì tách theo GIÁ TRỊ boolean cũ.
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
                Learn fullstack, system design, and DevOps along an interview-prep path.
            </span>
        </div>
    </div>
)

const items: ReadonlyArray<SurfaceCardAccordionItem> = [
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: panel() },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: panel() },
    { id: "error", title: "Error handling", subtitle: "4 resources", body: panel() },
]

/**
 * `Feedback.Empty` là DEP THẬT của leaf `Empty` (story riêng, bấm nhảy được) — khớp shape
 * icon+title+description (KHÔNG action) đang render ở leaf này ⇒ trỏ đúng leaf `Description`
 * bên đó. Mọi part khác của khung (`Surface`/`Header`/`Row`) KHÔNG có story riêng nên KHÔNG
 * khai — đường cũ `parts={...}` từng khai chúng chỉ tạo entry chết (không bấm được).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the Surface when items is empty — icon + title + description.",
    tier: "primitive",
    storyId: "layouts-feedback-feedback-feedback-empty--description",
}

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Default"
                reason="No `label`/`description` (bare) → renders the Surface wrapping the Rows directly, no Header. Default `allowsMultipleExpanded=false`: opening another Row auto-closes the one that was open."
                code={`<SurfaceCard.Accordion
  items={[
    { id: "rest", title: "REST semantics", subtitle: "3 resources", body: <Panel /> },
    { id: "input", title: "Input contract", subtitle: "2 resources", body: <Panel /> },
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
                note="`label` turns on the Header above (gap-3 between Header and Surface). The full header slot set (see-more/action/labelEnd/subtleLabel/description) is demonstrated in the SurfaceCard.Base story."
                code={`<SurfaceCard.Accordion
  label="Resources"
  items={[…]}
  defaultExpandedKeys={new Set(["rest"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Resources" items={items} defaultExpandedKeys={new Set(["rest"])} />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `variant` — TRỤC surface-in-surface (§1a), độc lập với mọi trục khác. Render ĐỦ union
 * `"surface"` (mặc định, `shadow-surface` trên nền trơn) / `"nested"` (border thay shadow,
 * khi khung này nằm TRONG một mặt cha) cạnh nhau — thay cho leaf `Bordered` cũ chỉ diễn
 * một nửa union.
 *
 * 2026-07-26 (thầy): gộp từ leaf `Bordered` (đổi từ `bordered?: boolean` sang
 * `variant?: SurfaceCardVariant`).
 */
const VARIANTS: ReadonlyArray<{ variant: SurfaceCardVariant; hint: string }> = [
    { variant: "surface", hint: "on bare bg-background — the default shadow-surface frame" },
    { variant: "nested", hint: "inside a parent surface — a border replaces the shadow (surface-in-surface, §1a)" },
]

export const Variants: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Prop `variant`"
                note={"`variant=\"surface\"` (default) draws shadow-surface on bare bg-background; `variant=\"nested\"` swaps that shadow for a border when this frame sits inside another surface (a panel/modal/drawer) — shadow is nearly invisible there (§1a)."}
                code={`<SurfaceCard.Accordion label="Resources" items={[…]} />
<SurfaceCard.Accordion label="Resources" variant="nested" items={[…]} />`}
            >
                <div className="flex flex-col gap-6">
                    {VARIANTS.map(({ variant, hint }, index) => (
                        variant === "nested" ? (
                            <div key={variant} className="rounded-3xl bg-surface p-3 shadow-surface" title={hint}>
                                <SurfaceCard.Accordion
                                    showAnatomy={index === 0}
                                    label="Resources"
                                    variant={variant}
                                    items={items}
                                    defaultExpandedKeys={new Set(["rest"])}
                                />
                            </div>
                        ) : (
                            <SurfaceCard.Accordion
                                key={variant}
                                showAnatomy={index === 0}
                                label="Resources"
                                variant={variant}
                                items={items}
                                defaultExpandedKeys={new Set(["rest"])}
                            />
                        )
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

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
                note="`titleEnd` (a status Chip) shows before the caret; the title truncates itself to make room."
                code={`<SurfaceCard.Accordion
  label="Milestones"
  items={[
    { id: "m1", title: "1/1. Project kickoff", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>, body: <Panel /> },
  ]}
/>`}
            >
                <SurfaceCard.Accordion
                    showAnatomy
                    label="Milestones"
                    defaultExpandedKeys={new Set(["m2"])}
                    items={[
                        { id: "m1", title: "1/1. Project kickoff", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Done</Chip.Label></Chip>, body: panel() },
                        { id: "m2", title: "2/2. Build the API", titleEnd: <Chip size="sm" variant="soft" color="warning"><Chip.Label>In progress</Chip.Label></Chip>, body: panel() },
                        { id: "m3", title: "3/3. Deploy", titleEnd: <Chip size="sm" variant="soft" color="default"><Chip.Label>Not started</Chip.Label></Chip>, body: panel() },
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
                note="`allowsMultipleExpanded` → more than one Row can be open at once; the composition doesn't change."
                code={`<SurfaceCard.Accordion
  label="Multiple open"
  allowsMultipleExpanded
  items={[…]}
  defaultExpandedKeys={new Set(["rest", "error"])}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Multiple open" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
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
                note="An empty `defaultExpandedKeys` — every Row starts collapsed on mount."
                code={`<SurfaceCard.Accordion
  label="All collapsed"
  items={[…]}
  defaultExpandedKeys={new Set()}
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="All collapsed" items={items} defaultExpandedKeys={new Set()} />
            </BlockAnatomy>
        </div>
    ),
}

/** Empty: `items` rỗng → {@link Feedback.Empty} lấp đầy surface (không để card trắng trơn). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Empty"
                annotate={{ "Feedback.Empty": PART_FEEDBACK_EMPTY }}
                note="`items={[]}` → `emptyState` fills the Surface (p-8) instead of leaving it blank."
                code={`<SurfaceCard.Accordion
  label="Resources"
  items={[]}
  emptyState={<Feedback.Empty icon={FolderOpenDuotone} title="No resources yet" … />}
/>`}
            >
                <SurfaceCard.Accordion
                    showAnatomy
                    label="Resources"
                    items={[]}
                    emptyState={
                        <Feedback.Empty
                            icon={FolderOpenDuotone}
                            title="No resources yet"
                            description="Docs for this topic will show up here."
                            anatPart="Feedback.Empty"
                        />
                    }
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading: `isSkeleton` tự vẽ mirror `Skeleton.Accordion` (giữ vỏ surface) — không dựng Skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.Accordion"
                tier="primitive"
                leaf="Loading"
                note="`isSkeleton` swaps the ENTIRE Surface/Row for `Skeleton.Accordion` (one mirror node); the Header above stays unchanged (still the real label)."
                code={`<SurfaceCard.Accordion
  label="Resources"
  items={[…]}
  isSkeleton
/>`}
            >
                <SurfaceCard.Accordion showAnatomy label="Resources" items={items} isSkeleton />
            </BlockAnatomy>
        </div>
    ),
}
