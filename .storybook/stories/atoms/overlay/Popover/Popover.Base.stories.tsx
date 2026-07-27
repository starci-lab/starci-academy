import type { Meta, StoryObj } from "@storybook/nextjs"
import { InfoIcon } from "@phosphor-icons/react"
import { Popover, type PopoverBaseProps } from "@sb-components/atoms/overlay/Popover/Popover"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Popover.Base`: atom click-panel DUY NHẤT, bọc thẳng HeroUI `Popover` +
 * một `Button` làm trigger pressable (react-aria `DialogTrigger` bắt buộc trigger
 * pressable). Không có atom con nào tách ra story riêng — `heading`/`triggerIcon`/
 * `triggerVariant`/`placement`/`showArrow` đều là LEAF prop-driven của chính
 * `Popover.Base` (§12g — audit 2026-07-26 bổ sung 3 leaf cuối, trước đó bị thiếu).
 *
 * ⛔ KHÔNG dùng `annotate`/`parts` (bỏ 2026-07-26) — hai lý do cộng lại:
 * 1. `Popover.Content` render qua **PORTAL** ra `document.body`, nằm NGOÀI render-box
 *    mà {@link BlockAnatomy} quét (nó leo ancestor BÊN TRONG `hostRef`). Khai part cho
 *    `Content`/`Arrow`/`Heading`/`Body` chỉ tạo entry không bao giờ vào cây — trôi
 *    trong im lặng, không ai biết.
 * 2. `Trigger` tuy nằm TRONG render-box nhưng là `HeroButton` thô (không phải
 *    `Button.Base` có story riêng) — kể cả không bị chặn portal, nó cũng không có
 *    `storyId` thật để bấm nhảy tới. Atom lá bọc thẳng HeroUI ⇒ không có deps thật.
 *
 * 🧭 Leaf `Placement`/`ShowArrow` mở panel qua PORTAL nên phải `defaultOpen` mới THẤY
 * hình (đóng = không có gì để soi). Cả hai xếp các popover THEO CỘT DỌC, mỗi hàng chừa
 * một dải trống cao — panel bung lên/xuống/trái/phải không đè lên hàng kế bên. Leaf
 * `TriggerVariant` thì ngược lại: khác biệt nằm ở NÚT (đóng), không cần mở panel.
 *
 * ✍️ Chữ hiện ra UI (`triggerLabel`, `content`, `reason`/`note`) viết TIẾNG ANH
 * (thầy chốt 2026-07-26) — kể cả nội dung demo, không riêng phần chú giải panel.
 */

const meta: Meta<typeof Popover.Base> = {
    title: "Atoms/Overlay/Popover/Popover.Base",
    component: Popover.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Popover.Base>

/** Union thật của prop `triggerVariant`, lấy từ component — không tự bịa. */
type TriggerVariantValue = NonNullable<PopoverBaseProps["triggerVariant"]>

/** Union thật của prop `placement` (8 giá trị), lấy từ component — không tự bịa. */
type PlacementValue = NonNullable<PopoverBaseProps["placement"]>

/** Leaf TRẦN — trigger button + panel mở sẵn, không heading. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Default"
                reason="The one click-panel atom wrapping HeroUI Popover plus a Button trigger (react-aria's DialogTrigger requires a pressable trigger). The atom owns the panel's surface, placement, and arrow."
                note="defaultOpen pins the panel open so you can see it here. placement defaults to bottom. The trigger label goes through triggerLabel — the atom does not accept children; content is the panel's body, so it stays a ReactNode."
                code={"<Popover.Base triggerLabel=\"Details\" content={<p>…</p>} placement=\"bottom\" />"}
            >
                <div className="flex justify-center py-16">
                    <Popover.Base
                        triggerLabel="Streak details"
                        content="Last session was 2 days ago. Keep the streak alive by studying every day."
                        placement="bottom"
                        defaultOpen
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `heading` — thêm dòng tiêu đề đậm phía trên thân. */
export const WithHeading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Prop `heading`"
                note="heading renders a bold line (Popover.Heading) above content — use it when the panel needs a short title of its own instead of leading straight with the body text."
                code={"<Popover.Base triggerLabel=\"Details\" heading=\"12-day streak\" content={<p>…</p>} />"}
            >
                <div className="flex justify-center py-16">
                    <Popover.Base
                        triggerLabel="Streak details"
                        heading="12-day streak"
                        content="Study today to keep it going. Miss one day and it resets to zero."
                        placement="bottom"
                        defaultOpen
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `triggerIcon` — nhãn nút kèm glyph dẫn đầu. */
export const WithTriggerIcon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Prop `triggerIcon`"
                note="triggerIcon is a Phosphor COMPONENT (§5.0); the atom pins it to size-3.5 — the trigger's own text size — plus the fixed stroke weight from §5.0a, so callers never pass weight themselves."
                code={"<Popover.Base triggerLabel=\"How scoring works\" triggerIcon={InfoIcon} content={<p>…</p>} />"}
            >
                <div className="flex justify-center py-16">
                    <Popover.Base
                        triggerLabel="How scoring works"
                        triggerIcon={InfoIcon}
                        content="Score = number of criteria passed divided by the total criteria in the question's checklist."
                        placement="bottom"
                        defaultOpen
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** One row of the `TriggerVariant` demo table — a single trigger variant plus its display label. */
interface TriggerVariantRow {
    /** The `triggerVariant` value this row demonstrates. */
    variant: TriggerVariantValue
    /** Display label shown on the trigger button. */
    label: string
}

/** ĐỦ union `triggerVariant` (4 giá trị) — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const TRIGGER_VARIANTS: Array<TriggerVariantRow> = [
    { variant: "primary", label: "Primary" },
    { variant: "secondary", label: "Secondary" },
    { variant: "tertiary", label: "Tertiary" },
    { variant: "ghost", label: "Ghost" },
]

/**
 * Leaf prop `triggerVariant` — ĐỦ 4 giá trị. Khác biệt nằm HOÀN TOÀN ở nút trigger,
 * panel không đổi hình theo variant, nên leaf này giữ mọi popover ĐÓNG.
 */
export const TriggerVariant: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Prop `triggerVariant`"
                reason="The trigger's weight tells the reader how loud the panel is before they even open it — a toolbar filter can stay quiet (secondary/ghost), a call-to-action popover can afford to be louder (primary)."
                note="Every panel here stays closed on purpose: triggerVariant only changes the button chrome, so the four triggers side by side already show the whole story."
                code={`<Popover.Base triggerVariant="primary" triggerLabel="Primary" content="..." />
<Popover.Base triggerVariant="secondary" triggerLabel="Secondary" content="..." />
<Popover.Base triggerVariant="tertiary" triggerLabel="Tertiary" content="..." />
<Popover.Base triggerVariant="ghost" triggerLabel="Ghost" content="..." />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {TRIGGER_VARIANTS.map(({ variant, label }, index) => (
                        <Popover.Base
                            key={variant}
                            triggerVariant={variant}
                            triggerLabel={label}
                            content="Additional detail appears here when this trigger opens."
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** One row of the `Placement` demo table — a single placement direction plus its display label. */
interface PlacementRow {
    /** The `placement` value this row demonstrates. */
    placement: PlacementValue
    /** Display label shown on the trigger button. */
    label: string
}

/** ĐỦ union `placement` (8 giá trị) — thiếu một giá trị là giá trị đó sẽ mọc thành leaf lạc chỗ. */
const PLACEMENTS: Array<PlacementRow> = [
    { placement: "top", label: "Top" },
    { placement: "top start", label: "Top start" },
    { placement: "top end", label: "Top end" },
    { placement: "bottom", label: "Bottom" },
    { placement: "bottom start", label: "Bottom start" },
    { placement: "bottom end", label: "Bottom end" },
    { placement: "left", label: "Left" },
    { placement: "right", label: "Right" },
]

/**
 * Leaf prop `placement` — ĐỦ 8 hướng đặt panel quanh trigger.
 *
 * `Popover.Content` render qua PORTAL ra ngoài render-box, đóng thì không có gì để soi
 * → mỗi popover bắt buộc `defaultOpen`. Xếp CỘT DỌC, mỗi hàng cao `min-h-[16rem]`
 * (256px, bằng đúng bề ngang panel `w-64`) + `gap-20` (80px) giữa hai hàng: panel dù
 * bung lên hay xuống cũng không chạm hàng kế bên; trục ngang không ai tranh chỗ vì chỉ
 * có một cột.
 */
export const Placement: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Prop `placement`"
                reason="The panel opens toward whichever side has room around the trigger — pick the direction that matches where the trigger actually sits on the screen, not 'bottom' out of habit."
                note="defaultOpen pins every panel open here just to make all eight directions visible at once; in the real app only one is open at a time, chosen by where the trigger lives on the page. Each row gets its own tall band of empty space so neighbouring panels never touch."
                code={`<Popover.Base placement="top" ... />
<Popover.Base placement="top start" ... />
<Popover.Base placement="top end" ... />
<Popover.Base placement="bottom" ... />
<Popover.Base placement="bottom start" ... />
<Popover.Base placement="bottom end" ... />
<Popover.Base placement="left" ... />
<Popover.Base placement="right" ... />`}
            >
                <div className="flex flex-col gap-20">
                    {PLACEMENTS.map(({ placement, label }, index) => (
                        <div key={placement} className="flex min-h-[16rem] items-center justify-center">
                            <Popover.Base
                                triggerLabel={label}
                                content="The panel repositions to the space around the trigger."
                                placement={placement}
                                defaultOpen
                                showAnatomy={index === 0}
                            />
                        </div>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `showArrow` — atom mặc định `true` (mọi leaf khác trong file này đã có sẵn
 * mũi tên), nên leaf này bù thêm ca `false` và đặt cạnh `true` để so trực tiếp.
 */
export const ShowArrow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                leaf="Prop `showArrow`"
                reason="The arrow ties the panel back to the exact trigger that opened it — turn it off only when the panel already sits flush against the trigger and the connection reads on its own."
                note="showArrow defaults to true, so every other leaf in this file already carries the arrow — this leaf pins defaultOpen on both rows and adds the false case underneath for a direct compare."
                code={`<Popover.Base showArrow content="..." />
<Popover.Base showArrow={false} content="..." />`}
            >
                <div className="flex flex-col gap-20">
                    <div className="flex min-h-[16rem] items-center justify-center">
                        <Popover.Base
                            triggerLabel="Arrow shown"
                            content="The arrow points back to the trigger that opened this panel."
                            showArrow
                            defaultOpen
                            showAnatomy
                        />
                    </div>
                    <div className="flex min-h-[16rem] items-center justify-center">
                        <Popover.Base
                            triggerLabel="Arrow hidden"
                            content="The arrow points back to the trigger that opened this panel."
                            showArrow={false}
                            defaultOpen
                        />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
