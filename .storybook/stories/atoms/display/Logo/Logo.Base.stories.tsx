import type { Meta, StoryObj } from "@storybook/nextjs"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Logo.Base`: viên brand mark DUY NHẤT của hệ (chữ "C" nét mạch pink + hai
 * góc chấm mạch), SVG inline, không nền, một màu cố định.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Component chỉ có MỘT prop: `className` — và
 * `className`/`classNames` nằm trong danh sách "không sinh hình riêng" (cửa sizing/
 * placement, không phải một trục ý nghĩa). Vì vậy atom này KHÔNG có leaf nào ngoài
 * `Default` — không có `tone`, không có `size`, không union nào để liệt kê.
 *
 * Các ô cạnh nhau trong `Default` dưới đây (ba cỡ chiều cao + nền tối) KHÔNG phải
 * leaf riêng — §12g cấm tách leaf theo GIÁ TRỊ của `className`. Chúng minh hoạ cùng
 * MỘT hình ở các cỡ/nền khác nhau, vớt lại từ file cũ `stories/atoms/identity/Logo`
 * (`DefaultH9`/`LockupH10`/`SplashH14`/`OnDarkSurface`) gộp vào một leaf duy nhất.
 *
 * ⚠️ File cũ đó (title cũ `"Atoms/Display/Logo"`, KHÔNG bọc `BlockAnatomy`) là bản
 * TRƯỚC canon §12g. KHÔNG thuộc phạm vi sửa của lượt này — xem `issues`.
 */

/** Hướng dẫn hiện đầu trang autodocs. Chữ trên UI viết TIẾNG ANH. */
const LOGO_DOC = `
## One mark, one colour

The mark is a single fixed brand-pink colour on a transparent background — no dark
square, no colour variants. It reads on a light surface and a dark surface without
any change, so it never needs a "light" or "dark" version.

## Sizing is height-driven

The atom has no size prop. Pass a height utility through \`className\` (\`h-9\`,
\`h-10\`, \`h-14\`…) and the width follows on its own — the mark is a fixed square,
so one dimension is always enough.
`

const meta: Meta<typeof Logo.Base> = {
    title: "Atoms/Display/Logo/Logo.Base",
    component: Logo.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: LOGO_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof Logo.Base>

/**
 * Leaf TRẦN — chưa bật prop nào có ý nghĩa. Vì component chỉ có `className` (không
 * sinh leaf riêng), đây cũng là leaf DUY NHẤT của atom này.
 *
 * Các ô KHÔNG phải các state của một prop — cùng một hình, chỉ khác cỡ chiều cao
 * (`h-9`/`h-10`/`h-14`, ba nấc thường gặp: nav compact · lockup mặc định · splash)
 * và một ô đặt trên nền tối, để chứng minh đúng câu trong JSDoc component: một màu
 * cố định đọc được trên cả nền sáng lẫn nền tối, không cần biến thể nào.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Logo.Base"
                tier="atom"
                leaf="Bare mark"
                reason="The one brand mark in the system. It carries no tone, no size prop, no variant union — this single leaf is the whole atom."
                note="Fixed-colour, fixed-ratio SVG (1:1). Height comes from className (h-9/h-10/h-14 shown here); width follows on its own. The same pink reads on a light card and a dark surface without changing."
                code={`<Logo.Base className="h-9" />   // compact — nav bar
<Logo.Base className="h-10" />  // default lockup
<Logo.Base className="h-14" />  // splash / hero

// on a dark surface — same mark, no variant prop
<div className="bg-neutral-950">
  <Logo.Base className="h-10" />
</div>`}
            >
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                        <Logo.Base className="h-9" />
                        <span className="text-[11px] text-muted">h-9 · compact</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                        <Logo.Base className="h-10" />
                        <span className="text-[11px] text-muted">h-10 · default</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                        <Logo.Base className="h-14" />
                        <span className="text-[11px] text-muted">h-14 · splash</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-neutral-950 p-6">
                        <Logo.Base className="h-10" />
                        <span className="text-[11px] text-neutral-400">on dark surface</span>
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
