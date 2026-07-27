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
 * Các ô cạnh nhau minh hoạ dưới đây (ba cỡ chiều cao + nền tối) KHÔNG phải leaf
 * riêng — §12g cấm tách leaf theo GIÁ TRỊ của `className`. Chúng minh hoạ cùng
 * MỘT hình ở các cỡ/nền khác nhau, vớt lại từ file cũ `stories/atoms/identity/Logo`
 * (`DefaultH9`/`LockupH10`/`SplashH14`/`OnDarkSurface`) — nay là bốn `states[]`
 * của CÙNG MỘT leaf `Default` (2026-07-27), không phải bốn leaf.
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
 * sinh leaf riêng), đây cũng là leaf DUY NHẤT của atom này. Bốn state dưới đây đều
 * là CÙNG một hình, chỉ khác cỡ chiều cao / nền — chứng minh câu trong JSDoc
 * component: một màu cố định đọc được trên cả nền sáng lẫn nền tối, không cần biến
 * thể nào. Migrated to `states` 2026-07-27.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Logo.Base"
                tier="atom"
                leaf="Bare mark"
                reason="The one brand mark in the system, so this single leaf is the whole atom — no tone prop, no size prop, no variant union. It is a fixed-colour, fixed-ratio SVG (1:1); height comes from className while width follows on its own, and the same pink reads on a light card and a dark surface without changing."
                states={[
                    {
                        name: "className = \"h-9\" (compact height)",
                        why: "Only the mark's rendered height changes; the SVG keeps its fixed 1:1 ratio, so the width follows on its own. A compact nav bar needs the smallest of the three common heights so the mark doesn't crowd the row.",
                        code: "<Logo.Base className=\"h-9\" />   // compact — nav bar",
                        render: (
                            <div className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                                <Logo.Base className="h-9" />
                                <span className="text-[11px] text-muted">h-9 · compact</span>
                            </div>
                        ),
                    },
                    {
                        name: "className = \"h-10\" (default height)",
                        why: "The mark renders one notch taller than the compact state, still the same fixed-colour SVG. This is the default lockup height used wherever the mark sits at normal reading size, like a footer or a card header.",
                        code: "<Logo.Base className=\"h-10\" />  // default lockup",
                        render: (
                            <div className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                                <Logo.Base className="h-10" />
                                <span className="text-[11px] text-muted">h-10 · default</span>
                            </div>
                        ),
                    },
                    {
                        name: "className = \"h-14\" (splash height)",
                        why: "The mark renders at the largest of the three common heights, again just scaling the same 1:1 SVG. A splash screen or a hero section needs the mark to read from further away, which is what the taller height buys.",
                        code: "<Logo.Base className=\"h-14\" />  // splash / hero",
                        render: (
                            <div className="flex items-center gap-2 rounded-lg border border-default bg-surface p-6">
                                <Logo.Base className="h-14" />
                                <span className="text-[11px] text-muted">h-14 · splash</span>
                            </div>
                        ),
                    },
                    {
                        name: "className = \"h-10\", on a dark surface",
                        why: "The exact same pink mark renders; only the surrounding background switches to a dark fill. This proves the one fixed colour is legible on both a light card and a dark surface without needing a separate dark-mode variant.",
                        code: `// on a dark surface — same mark, no variant prop
<div className="bg-neutral-950">
  <Logo.Base className="h-10" />
</div>`,
                        render: (
                            <div className="flex items-center gap-2 rounded-lg bg-neutral-950 p-6">
                                <Logo.Base className="h-10" />
                                <span className="text-[11px] text-neutral-400">on dark surface</span>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
