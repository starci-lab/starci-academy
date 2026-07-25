import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardNestedSection } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.Nested` là khung CARD-TRONG-CARD
 * — thứ duy nhất nó đẻ ra so với `.Base` là: một HEADER BAR nằm TRONG khung (eyebrow icon
 * + title + meta), một BODY chia section bằng divider (`items`), một FOOTER bar, và nấc
 * bo góc `compact`. Header section NGOÀI card (label/see-more/action) là tài sản của
 * `.Base` — KHÔNG lặp ở đây.
 */
const meta: Meta<typeof SurfaceCard.Nested> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.Nested",
    component: SurfaceCard.Nested,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.Nested>

// Header bar + Body là hai part LUÔN có khi truyền `title`; `Meta`/`Footer` chỉ tồn tại
// ở leaf thực sự render chúng (§11a: cây anatomy phải khớp render thật).
const HEADER: AnatomyNode = { name: "Header", tier: "primitive", role: "thanh header TRONG khung — eyebrow icon (tuỳ chọn) + title thu gọn" }
const BODY: AnatomyNode = { name: "Body", tier: "primitive", role: "cột section, ngăn nhau bằng divider" }
const SECTION: AnatomyNode = { name: "Section", tier: "primitive", role: "1 section (lặp ×N) — eyebrow + title + content" }
const PARTS: Array<AnatomyNode> = [HEADER, { ...BODY, children: [SECTION] }]

const relatedItems: ReadonlyArray<SurfaceCardNestedSection> = [
    {
        key: "normalization",
        eyebrow: "Relational databases",
        title: "Data normalization and normal forms",
        content: (
            <Typography type="body-sm" color="muted">
                Normalization splits data into multiple tables to reduce redundancy and update anomalies.
            </Typography>
        ),
        anatPart: "Section",
    },
    {
        key: "denormalize",
        eyebrow: "Database review deck",
        title: "When should you denormalize to optimize reads?",
        anatPart: "Section",
    },
]

/**
 * Default — `bordered={false}` (mặc định): card đứng TRỰC TIẾP trên `bg-background` nên
 * tự sở hữu nền + shadow. Body dựng từ `items` (danh sách LẶP → dữ liệu, không children).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Default"
                    parts={PARTS}
                    reason="Khung card-trong-card CÓ HEADER: thanh header thu gọn nằm TRONG khung + một cột section flush ngăn bằng divider (không bo góc từng hàng). `items` là dữ liệu vì Body là danh sách LẶP."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[
    { key: "normalization", eyebrow: "Relational databases", title: "Data normalization…", content: <Typography …/> },
    { key: "denormalize", eyebrow: "Database review deck", title: "When should you denormalize…" },
  ]}
/>`}
                >
                    <SurfaceCard.Nested title="Related lessons" items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * `bordered` — surface-in-surface: card nằm trong một cha ĐÃ CÓ NỀN (chat panel / bubble /
 * modal / page card) nên phân định bằng BORDER, không phải shadow (shadow gần như vô hình).
 */
export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
                <div className="flex flex-col gap-2 p-3">
                    <div className="max-w-[85%] rounded-2xl bg-surface-secondary px-3 py-2">
                        <Typography type="body-sm">
                            It&apos;s usually when you see data repeated across many rows, or a column that depends on a non-primary-key column.
                        </Typography>
                    </div>
                    <div className="max-w-[85%]">
                        <BlockAnatomy
                            name="SurfaceCard.Nested"
                            tier="primitive"
                            leaf="Bordered"
                            parts={PARTS}
                            note="Surface-in-surface: border thay vì shadow vì cha đã có nền. Composition không đổi so với leaf Default."
                            code={`<SurfaceCard.Nested
  title="Related lessons"
  bordered
  items={[…]}
/>`}
                        >
                            <SurfaceCard.Nested title="Related lessons" bordered items={relatedItems} showAnatomy />
                        </BlockAnatomy>
                    </div>
                </div>
            </div>
        </div>
    ),
}

/**
 * Section tương tác (ROW ≠ CARD, principles §7b) — item nhận `onPress` (native `<button>`)
 * hoặc `href` (native `<a>`). Mỗi hàng focusable + điều khiển được bằng bàn phím với
 * `focus-visible` ring và title underline khi hover (nav-link affordance). KHÔNG
 * press-scale/ripple — đó là của card, không phải của row. Tab thử để soi a11y.
 */
export const InteractiveSections: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="InteractiveSections"
                    parts={PARTS}
                    note="Composition không đổi — chỉ Section trong Body chuyển thành <a>/<button> khi item có `href`/`onPress` (ROW ≠ CARD, §7b)."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[
    { key: "normalization", title: "Data normalization…", onPress: () => {} },
    { key: "denormalize", title: "When should you denormalize…", href: "#denormalize" },
  ]}
/>`}
                >
                    <SurfaceCard.Nested
                        title="Related lessons"
                        showAnatomy
                        items={[
                            { ...relatedItems[0], onPress: () => alert("Open: Data normalization") },
                            { ...relatedItems[1], href: "#denormalize" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

const ICON_META_PARTS: Array<AnatomyNode> = [
    HEADER,
    { name: "Meta", tier: "primitive", role: "slot phải của header bar (đếm số / trạng thái)" },
    { ...BODY, children: [SECTION] },
]

/** `icon` + `meta` — hai slot còn lại của header bar: eyebrow icon bên trái, meta ghim bên phải. */
export const WithIconMeta: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="WithIconMeta"
                    parts={ICON_META_PARTS}
                    note="`icon` đi TRẦN — khung tự ép size-4 + màu muted (§4/§5). `meta` là node riêng, ghim phải, không co."
                    code={`<SurfaceCard.Nested
  icon={<FolderOpenIcon />}
  title="Related lessons"
  meta={<Typography type="body-xs" color="muted">2 mục</Typography>}
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested
                        icon={<FolderOpenIcon />}
                        title="Related lessons"
                        meta={<Typography type="body-xs" color="muted">2 mục</Typography>}
                        items={relatedItems}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

const FOOTER_PARTS: Array<AnatomyNode> = [
    HEADER,
    { ...BODY, children: [SECTION] },
    { name: "Footer", tier: "primitive", role: "thanh dưới TRONG khung, ngăn bằng border-t (CTA / caption)" },
]

/** `footer` — thanh cuối NẰM TRONG khung (ngăn bằng `border-t`), khác `description` ở ngoài của `.Base`. */
export const WithFooter: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="WithFooter"
                    parts={FOOTER_PARTS}
                    note="`footer` render TRONG khung (border-t), không phải caption ngoài card — đó là `description` của `.Base`."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[…]}
  footer={<Button size="sm" variant="tertiary">Xem tất cả</Button>}
/>`}
                >
                    <SurfaceCard.Nested
                        title="Related lessons"
                        items={relatedItems}
                        footer={<Button size="sm" variant="tertiary">Xem tất cả</Button>}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

const HEADERLESS_PARTS: Array<AnatomyNode> = [{ ...BODY, children: [SECTION] }]

/** Không `header`/`title`/`icon`/`meta` → thanh header KHÔNG render: còn đúng khung + cột section. */
export const Headerless: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Headerless"
                    parts={HEADERLESS_PARTS}
                    note="Bỏ hết 4 slot header → khung bỏ luôn thanh header (không để lại viền rỗng), cây parts rụng node Header."
                    code={`<SurfaceCard.Nested
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `children` — khung-BỌC vẫn nhận nội dung tự do khi Body KHÔNG phải danh sách lặp (`items` thắng nếu có cả hai). */
export const FreeBody: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="FreeBody"
                    parts={[HEADER, BODY]}
                    note="Body là một khối tự do (không lặp) → dùng `children`/`body`; cây parts không có Section vì không có hàng lặp."
                    code={`<SurfaceCard.Nested title="Ghi chú">
  <div className="p-3">
    <Typography type="body-sm">…</Typography>
  </div>
</SurfaceCard.Nested>`}
                >
                    <SurfaceCard.Nested title="Ghi chú" showAnatomy>
                        <div className="p-3">
                            <Typography type="body-sm">
                                Chuẩn hoá tới 3NF trước, chỉ phi chuẩn hoá khi đã đo được điểm nghẽn đọc.
                            </Typography>
                        </div>
                    </SurfaceCard.Nested>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `compact` — hạ bo góc `rounded-3xl` → `rounded-xl` cho ngữ cảnh hẹp (bong bóng chat). */
export const Compact: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-sm rounded-2xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Compact"
                    parts={PARTS}
                    note="`compact` chỉ đổi nấc bo góc của khung (concentric radius với bubble cha) — composition không đổi."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  compact
  bordered
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested title="Related lessons" compact bordered items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
