import type { Meta, StoryObj } from "@storybook/nextjs"
import { InfoIcon } from "@phosphor-icons/react"
import { Popover } from "@sb-components/atoms/overlay/Popover/Popover"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Popover.Base`: atom click-panel DUY NHẤT, bọc thẳng HeroUI `Popover` +
 * một `Button` làm trigger pressable (react-aria `DialogTrigger` bắt buộc trigger
 * pressable). Không có atom con nào tách ra story riêng — `heading`/`triggerIcon`/
 * `triggerVariant`/`placement`/`showArrow` đều là LEAF prop-driven của chính
 * `Popover.Base` (§12g — audit 2026-07-26 bổ sung 3 leaf cuối, trước đó bị thiếu).
 *
 * 🌿 `annotate` (2026-07-28): mọi import HeroUI mà `Popover.tsx` render thẳng đều
 * khai `tier: "heroui"` — tầng `heroui` KHÔNG cần `storyId`. Tên node đúng bằng tên
 * import THẬT (`Button` cho trigger; `Popover.Content`/`Popover.Arrow`/
 * `Popover.Heading` — dot-access thật trên compound `HeroPopover` — cho panel), không
 * phải vai nó đóng (KHÔNG còn gọi trigger là `"Trigger"` hay panel là `"Content"` trơn).
 *
 * ⚠️ Vẫn còn GIỚI HẠN PORTAL: `Popover.Content` (và `Popover.Arrow`/`Popover.Heading`
 * lồng trong nó) render ra `document.body`, NGOÀI render-box mà {@link BlockAnatomy}
 * quét, nên dù đã khai `annotate` chúng vẫn KHÔNG hiện trong cây Structure — khai
 * đúng tên vẫn cần, chỉ là honesty của DATA, không phải lời hứa sẽ THẤY được. Chỉ
 * `Button` (trigger, không portal) thực sự lên cây.
 *
 * 🧭 Leaf `Placement`/`ShowArrow` mở panel qua PORTAL nên phải `defaultOpen` mới THẤY
 * hình (đóng = không có gì để soi). Cả hai xếp các popover THEO CỘT DỌC, mỗi hàng chừa
 * một dải trống cao — panel bung lên/xuống/trái/phải không đè lên hàng kế bên. Leaf
 * `TriggerVariant` thì ngược lại: khác biệt nằm ở NÚT (đóng), không cần mở panel.
 *
 * ✍️ Chữ hiện ra UI (`triggerLabel`, `content`, `reason`/`why`) viết TIẾNG ANH
 * (thầy chốt 2026-07-26) — kể cả nội dung demo, không riêng phần chú giải panel.
 */

/**
 * Mọi import `@heroui/react` mà `Popover.Base` render thẳng. Dùng CHUNG cho mọi leaf
 * trong file — cây thật vẫn phụ thuộc leaf đang mở render gì.
 */
const POPOVER_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": { tier: "heroui", role: "Pressable trigger (react-aria DialogTrigger requires a pressable trigger)." },
    "Popover.Content": { tier: "heroui", role: "Panel surface (renders into document.body — never reachable here)." },
    "Popover.Arrow": { tier: "heroui", role: "Little arrow pointing at the trigger (renders into document.body — never reachable here)." },
    "Popover.Heading": { tier: "heroui", role: "Optional bold heading line (renders into document.body — never reachable here)." },
}

const meta: Meta<typeof Popover.Base> = {
    title: "Atoms/Overlay/Popover/Popover.Base",
    component: Popover.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Popover.Base>

/** Leaf TRẦN — trigger button + panel mở sẵn, không heading. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Default"
                reason="The one click-panel atom wrapping HeroUI Popover plus a Button trigger (react-aria's DialogTrigger requires a pressable trigger). The atom owns the panel's surface, placement, and arrow."
                states={[
                    {
                        name: "no heading, defaultOpen = true",
                        why: "The trigger button and its panel render with no heading line above the body text. `defaultOpen` pins the panel open here only so it can be seen; `placement` defaults to bottom and the trigger label goes through `triggerLabel` since the atom takes no `children`.",
                        code: "<Popover.Base triggerLabel=\"Details\" content={<p>…</p>} placement=\"bottom\" />",
                        render: (
                            <div className="flex justify-center py-16">
                                <Popover.Base
                                    triggerLabel="Streak details"
                                    content="Last session was 2 days ago. Keep the streak alive by studying every day."
                                    placement="bottom"
                                    defaultOpen
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />
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
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `heading`"
                states={[
                    {
                        name: "heading passed",
                        why: "A bold line (Popover.Heading) renders above the body text, inside the same panel. This is for a panel that needs a short title of its own instead of leading straight with the body copy.",
                        code: "<Popover.Base triggerLabel=\"Details\" heading=\"12-day streak\" content={<p>…</p>} />",
                        render: (
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
                        ),
                    },
                ]}
            />
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
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `triggerIcon`"
                states={[
                    {
                        name: "triggerIcon passed",
                        why: "A leading glyph renders on the trigger button before its label. `triggerIcon` takes a Phosphor COMPONENT (§5.0) so the atom itself pins it to `size-3.5`, the trigger's own text size, plus the fixed stroke weight from §5.0a — callers never choose the weight themselves.",
                        code: "<Popover.Base triggerLabel=\"How scoring works\" triggerIcon={InfoIcon} content={<p>…</p>} />",
                        render: (
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
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `triggerVariant` — ĐỦ 4 giá trị, mỗi giá trị là MỘT state. Khác biệt nằm
 * HOÀN TOÀN ở nút trigger, panel không đổi hình theo variant, nên mọi state giữ panel
 * ĐÓNG.
 */
export const TriggerVariant: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `triggerVariant`"
                reason="The trigger's weight tells the reader how loud the panel is before they even open it — a toolbar filter can stay quiet (secondary/ghost), a call-to-action popover can afford to be louder (primary). Only the button chrome changes across the four values; the panel itself never differs, so every state here keeps the panel closed."
                states={[
                    {
                        name: "triggerVariant = \"primary\"",
                        why: "The trigger button renders with primary chrome, the loudest weight available. This is for a popover that behaves like a genuine call to action, not a quiet filter or a secondary control.",
                        code: "<Popover.Base triggerVariant=\"primary\" triggerLabel=\"Primary\" content=\"...\" />",
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Popover.Base triggerVariant="primary" triggerLabel="Primary" content="Additional detail appears here when this trigger opens." showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"secondary\"",
                        why: "The trigger button renders with secondary chrome, a step down from primary. This is the everyday weight for a popover trigger that isn't the main action on the page.",
                        code: "<Popover.Base triggerVariant=\"secondary\" triggerLabel=\"Secondary\" content=\"...\" />",
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Popover.Base triggerVariant="secondary" triggerLabel="Secondary" content="Additional detail appears here when this trigger opens." showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"tertiary\"",
                        why: "The trigger button renders with tertiary chrome, quieter still than secondary. This is for a popover trigger that should read as a minor, optional affordance next to louder controls.",
                        code: "<Popover.Base triggerVariant=\"tertiary\" triggerLabel=\"Tertiary\" content=\"...\" />",
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Popover.Base triggerVariant="tertiary" triggerLabel="Tertiary" content="Additional detail appears here when this trigger opens." showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "triggerVariant = \"ghost\"",
                        why: "The trigger button renders with ghost chrome, the quietest weight of the four. This is for a popover tucked inside a toolbar or a dense row, where the trigger shouldn't draw the eye until it's pressed.",
                        code: "<Popover.Base triggerVariant=\"ghost\" triggerLabel=\"Ghost\" content=\"...\" />",
                        render: (
                            <div className="flex flex-wrap items-center gap-3">
                                <Popover.Base triggerVariant="ghost" triggerLabel="Ghost" content="Additional detail appears here when this trigger opens." showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `placement` — ĐỦ 8 hướng đặt panel quanh trigger, mỗi hướng là MỘT state.
 *
 * `Popover.Content` render qua PORTAL ra ngoài render-box, đóng thì không có gì để soi
 * → mỗi popover bắt buộc `defaultOpen`. Mỗi state chừa một dải trống cao quanh trigger
 * (`min-h-[16rem]`, 256px, bằng đúng bề ngang panel `w-64`) để panel dù bung hướng nào
 * cũng không chạm mép khung.
 */
export const Placement: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `placement`"
                reason="The panel opens toward whichever side has room around the trigger — pick the direction that matches where the trigger actually sits on the screen, not bottom out of habit. `defaultOpen` pins every state's panel open only so it can be seen here; in the real app only one is open at a time, chosen by where the trigger lives on the page."
                states={[
                    {
                        name: "placement = \"top\"",
                        why: "The panel opens directly above the trigger, arrow pointing down. This is for a trigger that sits near the bottom of the screen, where there's no room for the panel to open downward.",
                        code: "<Popover.Base placement=\"top\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Top" content="The panel repositions to the space around the trigger." placement="top" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"top start\"",
                        why: "The panel opens above the trigger, its left edge aligned with the trigger's left edge. This is for a trigger near the top-right of a narrow area, where a centred panel would overflow past the left edge.",
                        code: "<Popover.Base placement=\"top start\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Top start" content="The panel repositions to the space around the trigger." placement="top start" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"top end\"",
                        why: "The panel opens above the trigger, its right edge aligned with the trigger's right edge. This is for a trigger near the top-left of a narrow area, where a centred panel would overflow past the right edge.",
                        code: "<Popover.Base placement=\"top end\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Top end" content="The panel repositions to the space around the trigger." placement="top end" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom\"",
                        why: "The panel opens directly below the trigger, arrow pointing up. This is the everyday direction, used whenever the trigger has open space beneath it.",
                        code: "<Popover.Base placement=\"bottom\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Bottom" content="The panel repositions to the space around the trigger." placement="bottom" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom start\"",
                        why: "The panel opens below the trigger, its left edge aligned with the trigger's left edge. This is for a trigger near the bottom-right of a narrow area, where a centred panel would overflow past the left edge.",
                        code: "<Popover.Base placement=\"bottom start\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Bottom start" content="The panel repositions to the space around the trigger." placement="bottom start" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"bottom end\"",
                        why: "The panel opens below the trigger, its right edge aligned with the trigger's right edge. This is for a trigger near the bottom-left of a narrow area, where a centred panel would overflow past the right edge.",
                        code: "<Popover.Base placement=\"bottom end\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Bottom end" content="The panel repositions to the space around the trigger." placement="bottom end" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"left\"",
                        why: "The panel opens to the left of the trigger, arrow pointing right. This is for a trigger that sits near the right edge of the screen, where the panel would otherwise run off the viewport.",
                        code: "<Popover.Base placement=\"left\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Left" content="The panel repositions to the space around the trigger." placement="left" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "placement = \"right\"",
                        why: "The panel opens to the right of the trigger, arrow pointing left. This is for a trigger that sits near the left edge of the screen, such as a rail or a sidebar item.",
                        code: "<Popover.Base placement=\"right\" ... />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Right" content="The panel repositions to the space around the trigger." placement="right" defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `showArrow` — atom mặc định `true` (mọi leaf khác trong file này đã có sẵn
 * mũi tên), nên leaf này khai đúng HAI state: có mũi tên và không.
 */
export const ShowArrow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Popover.Base"
                tier="atom"
                annotate={POPOVER_ANNOTATE}
                leaf="Prop `showArrow`"
                reason="The arrow ties the panel back to the exact trigger that opened it — turn it off only when the panel already sits flush against the trigger and the connection reads on its own. `showArrow` defaults to true, so every other leaf in this file already carries it; this leaf is the only place the `false` case is demonstrated."
                states={[
                    {
                        name: "showArrow = true (default)",
                        why: "A small arrow renders on the panel's edge, pointing back at the trigger. This is the default, kept on whenever the panel doesn't sit flush against the trigger it belongs to.",
                        code: "<Popover.Base showArrow content=\"...\" />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Arrow shown" content="The arrow points back to the trigger that opened this panel." showArrow defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                    {
                        name: "showArrow = false",
                        why: "The arrow is dropped entirely, leaving the panel edge plain. This is only for a panel that already sits flush against its trigger, where the connection between the two is obvious without an arrow.",
                        code: "<Popover.Base showArrow={false} content=\"...\" />",
                        render: (
                            <div className="flex min-h-[16rem] items-center justify-center">
                                <Popover.Base triggerLabel="Arrow hidden" content="The arrow points back to the trigger that opened this panel." showArrow={false} defaultOpen showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
