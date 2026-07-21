import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Input } from "@heroui/react"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `Input` (HeroUI) — a bare single-line text field (styled `<input>`): accepts native props
 * (`type`, `placeholder`, `disabled`, `readOnly`, `defaultValue`). Pick `variant` by the
 * SURFACE CONTEXT the field sits on, NOT by emphasis level:
 * - `primary` = field sits ON THE PAGE BACKGROUND — its own border/fill to stand out from
 *   the background (comment composer, chat field, a form directly on the page).
 * - `secondary` = field sits INSIDE a surface/card/modal — the card already separates from
 *   the background so the field is lighter (muted fill); most form fields use this.
 * In real forms it is almost always wrapped in `TextField` (Label + a11y + error line); use a
 * bare `Input` only when the field needs no label/grouping (inline search, quick-edit cell).
 */
const meta: Meta<typeof Input> = {
    title: "Primitives/Form/Input",
    component: Input,
}
export default meta
type Story = StoryObj<typeof Input>

/**
 * Toàn bộ ma trận trạng thái của Input: hai variant theo bối cảnh mặt nền (primary/secondary)
 * và ba trạng thái native (default/disabled/read-only). Dùng để tra khi nào chọn variant nào
 * và các trạng thái khoá field trông ra sao.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Pick `variant` by the SURFACE the field sits on, not by emphasis level. `primary` = field on " +
            "the PAGE BACKGROUND (its own border/fill to stand out from the background — composer, chat, a " +
            "form directly on the page). `secondary` = field INSIDE a card/modal (the card already separates " +
            "from the background so the field is lighter — most form fields). Keep it consistent per surface, " +
            "don't mix the two variants in the same block. States via native props: default (editable), " +
            "`disabled` (dimmed, no focus/typing), `readOnly` (not editable but still focusable/selectable — " +
            "for viewing/copying a locked value). The error state is toggled on `TextField isInvalid`, not on " +
            "a bare Input.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Primary — trên nền trang"
                hint="Field đứng trực tiếp trên nền trang: tự có border/fill riêng để tách khỏi nền. Dùng cho ô comment, chat field, hoặc một form nằm ngay trên trang."
            >
                <div className="w-80">
                    <Input variant="primary" placeholder="Write a comment…" />
                </div>
            </Variant>
            <Variant
                label="Secondary — trong một surface (card)"
                hint="Field nằm TRONG card/modal: card đã tách khỏi nền rồi nên field nhẹ hơn (fill mờ). Hầu hết form field dùng biến thể này."
            >
                <Card className="w-80">
                    <CardContent>
                        <Input variant="secondary" placeholder="you@email.com" />
                    </CardContent>
                </Card>
            </Variant>
            <Variant
                label="Mặc định"
                hint="Input bình thường, focus và gõ được. Demo trong Card vì đó là ngữ cảnh secondary phổ biến nhất."
            >
                <Card className="w-80">
                    <CardContent>
                        <Input variant="secondary" placeholder="Enter content…" />
                    </CardContent>
                </Card>
            </Variant>
            <Variant
                label="Disabled"
                hint="Bị khoá theo ngữ cảnh — mờ đi, không focus hay gõ được."
            >
                <Card className="w-80">
                    <CardContent>
                        <Input variant="secondary" defaultValue="FS-2026-K12" disabled />
                    </CardContent>
                </Card>
            </Variant>
            <Variant
                label="Read-only"
                hint="Không sửa được nhưng vẫn focus và select được — dùng để xem hoặc copy một giá trị đã khoá."
            >
                <Card className="w-80">
                    <CardContent>
                        <Input variant="secondary" defaultValue="sk_live_a1b2c3d4" readOnly />
                    </CardContent>
                </Card>
            </Variant>
        </Gallery>
    ),
}
