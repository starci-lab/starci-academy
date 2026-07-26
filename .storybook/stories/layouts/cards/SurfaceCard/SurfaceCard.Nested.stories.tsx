import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardNestedSection } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `SurfaceCard.Nested` là khung CARD-TRONG-CARD
 * — thứ duy nhất nó đẻ ra so với `.Base` là: một HEADER BAR nằm TRONG khung (eyebrow icon
 * + title + meta), một BODY chia section bằng divider (`items`), một FOOTER bar, và nấc
 * bo góc `radius`. Header section NGOÀI card (label/see-more/action) là tài sản của
 * `.Base` — KHÔNG lặp ở đây.
 *
 * 2026-07-26 (thầy, BA TRỤC ĐỘC LẬP): `bordered?: boolean` → `variant?: SurfaceCardVariant`
 * (`"surface" | "nested"`), `compact?: boolean` → `radius?: "xl" | "3xl"`. Hai leaf
 * đơn-giá-trị cũ (`Bordered`, `Compact`) gộp thành hai leaf mang TÊN PROP (`Variant`,
 * `Radius`), mỗi leaf render đủ union cạnh nhau thay vì chỉ mỗi giá trị lệch mặc định.
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
 * Default — `variant="surface"` (mặc định): card đứng TRỰC TIẾP trên `bg-background` nên
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
 * `variant` — trục ĐỘC LẬP đầu tiên (§1a): `"surface"` (mặc định) tự có nền + shadow khi
 * đứng TRỰC TIẾP trên `bg-background`; `"nested"` đổi sang border khi mặt này nằm TRONG
 * một mặt cha ĐÃ CÓ NỀN (chat panel / bubble / modal / page card) — shadow gần như vô
 * hình trên nền đó. Gộp từ hai leaf đơn-giá-trị cũ (`Default` ngầm định `surface`,
 * `Bordered`) thành MỘT leaf `Variant` render cả hai cạnh nhau.
 *
 * 2026-07-26 (thầy): đổi từ `bordered?: boolean` (`bordered=true` → `variant="nested"`).
 */
export const Variant: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="max-w-md flex-1">
                <SurfaceCard.Nested title="Related lessons" variant="surface" items={relatedItems} />
            </div>
            <div className="flex max-w-md flex-1 flex-col overflow-hidden rounded-2xl border border-default bg-surface">
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
                            leaf="Variant"
                            note={"`variant=\"nested\"` (phải, trong bubble panel) đổi khung sang border thay shadow (surface-in-surface); `variant=\"surface\"` (trái, mặc định) tự có nền + shadow khi đứng trực tiếp trên bg-background — composition không đổi."}
                            code={`<SurfaceCard.Nested
  title="Related lessons"
  variant="nested"
  items={[…]}
/>`}
                        >
                            <SurfaceCard.Nested title="Related lessons" variant="nested" items={relatedItems} showAnatomy />
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

/** `icon` + `meta` — hai slot còn lại của header bar: eyebrow icon bên trái, meta ghim bên phải. */
export const WithIconMeta: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="WithIconMeta"
                    note="`icon` đi TRẦN — khung tự ép size-4 + màu muted (§4/§5). `meta` là node riêng, ghim phải, không co."
                    code={`<SurfaceCard.Nested
  icon={<FolderOpenIcon />}
  title="Related lessons"
  meta={<Typography type="body-xs" color="muted">2 items</Typography>}
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested
                        icon={<FolderOpenIcon />}
                        title="Related lessons"
                        meta={<Typography type="body-xs" color="muted">2 items</Typography>}
                        items={relatedItems}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `footer` — thanh cuối NẰM TRONG khung (ngăn bằng `border-t`), khác `description` ở ngoài của `.Base`. */
export const WithFooter: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="WithFooter"
                    note="`footer` render TRONG khung (border-t), không phải caption ngoài card — đó là `description` của `.Base`."
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  items={[…]}
  footer={<Button size="sm" variant="tertiary">View all</Button>}
/>`}
                >
                    <SurfaceCard.Nested
                        title="Related lessons"
                        items={relatedItems}
                        footer={<Button size="sm" variant="tertiary">View all</Button>}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Không `header`/`title`/`icon`/`meta` → thanh header KHÔNG render: còn đúng khung + cột section. */
export const Headerless: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Headerless"
                    note="Bỏ hết 4 slot header → khung bỏ luôn thanh header (không để lại viền rỗng), cây DOM rụng node Header."
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
                    note="Body là một khối tự do (không lặp) → dùng `children`/`body`; DOM không có Section vì không có hàng lặp."
                    code={`<SurfaceCard.Nested title="Notes">
  <div className="p-3">
    <Typography type="body-sm">…</Typography>
  </div>
</SurfaceCard.Nested>`}
                >
                    <SurfaceCard.Nested title="Notes" showAnatomy>
                        <div className="p-3">
                            <Typography type="body-sm">
                                Normalize to 3NF first, only denormalize once you&apos;ve measured a real read bottleneck.
                            </Typography>
                        </div>
                    </SurfaceCard.Nested>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/**
 * `radius` — trục ĐỘC LẬP thứ hai: `"3xl"` (mặc định) chuẩn cho khung ngoài;
 * `"xl"` hạ một nấc bo góc cho ngữ cảnh hẹp (bong bóng chat), thường đi kèm
 * `variant="nested"` (concentric radius với bubble cha). Gộp từ hai leaf đơn-giá-trị
 * cũ (`Default` ngầm định `3xl`, `Compact`) thành MỘT leaf `Radius` render cả hai
 * cạnh nhau.
 *
 * 2026-07-26 (thầy): đổi từ `compact?: boolean` (`compact=true` → `radius="xl"`).
 */
export const Radius: Story = {
    render: () => (
        <div className="flex flex-wrap items-start gap-6 p-8">
            <div className="max-w-md flex-1">
                <SurfaceCard.Nested title="Related lessons" radius="3xl" items={relatedItems} />
            </div>
            <div className="max-w-sm flex-1 rounded-2xl bg-surface p-3 shadow-surface">
                <BlockAnatomy
                    name="SurfaceCard.Nested"
                    tier="primitive"
                    leaf="Radius"
                    note={"`radius=\"xl\"` (phải, trong bubble panel) hạ bo góc một nấc, kết hợp `variant=\"nested\"` cho concentric radius với cha; `radius=\"3xl\"` (trái, mặc định) chuẩn cho khung ngoài."}
                    code={`<SurfaceCard.Nested
  title="Related lessons"
  radius="xl"
  variant="nested"
  items={[…]}
/>`}
                >
                    <SurfaceCard.Nested title="Related lessons" radius="xl" variant="nested" items={relatedItems} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
