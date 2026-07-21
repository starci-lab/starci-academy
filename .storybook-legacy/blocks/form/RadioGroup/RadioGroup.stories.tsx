import type { Meta, StoryObj } from "@storybook/nextjs"
import { Radio, RadioGroup } from "@heroui/react"
import { OPTIONS } from "./components"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `RadioGroup` + `Radio` (HeroUI) — pick EXACTLY ONE of a few mutually exclusive options
 * (unlike Checkbox: multiple). Correct structure: `Radio > Radio.Content` (a horizontal
 * row `inline-flex items-center gap-3`) containing `Radio.Control > Radio.Indicator` + a
 * plain-text label (do NOT wrap it in `Typography` — react-aria treats `Typography` as
 * `Text` and requires a `slot`). The group stacks vertically with `gap-2`. Few options
 * (2–5) → RadioGroup; many → Select. Always set a default.
 */
const meta: Meta<typeof RadioGroup> = {
    title: "Primitives/Form/RadioGroup",
    component: RadioGroup,
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Dọc (mặc định)"
                hint="Pick exactly one trong vài lựa chọn loại trừ nhau. Nhóm xếp dọc gap-2; mỗi Radio.Content là một hàng ngang (control + label). Đúng cấu trúc HeroUI: Control nằm TRONG Content — để Control/Content làm anh em dưới Radio sẽ khiến .radio (flex-col) xếp chúng theo chiều dọc. Luôn đặt defaultValue."
            >
                <div className="w-80">
                    <RadioGroup aria-label="Notification frequency" defaultValue="daily" className="flex flex-col gap-2">
                        {OPTIONS.map((opt) => (
                            <Radio key={opt.value} value={opt.value}>
                                <Radio.Content>
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    {opt.label}
                                </Radio.Content>
                            </Radio>
                        ))}
                    </RadioGroup>
                </div>
            </Variant>
            <Variant
                label="Có tuỳ chọn bị khoá"
                hint="Một lựa chọn tồn tại nhưng chưa mở cho người dùng này → isDisabled trên Radio đó (mờ đi, không chọn được) thay vì ẩn hẳn — để họ vẫn biết lựa chọn đó có tồn tại."
            >
                <div className="w-80">
                    <RadioGroup aria-label="Notification plan" defaultValue="free" className="flex flex-col gap-2">
                        <Radio value="free">
                            <Radio.Content>
                                <Radio.Control>
                                    <Radio.Indicator />
                                </Radio.Control>
                                Basic (free)
                            </Radio.Content>
                        </Radio>
                        <Radio value="pro" isDisabled>
                            <Radio.Content>
                                <Radio.Control>
                                    <Radio.Indicator />
                                </Radio.Control>
                                Advanced (Pro plan only)
                            </Radio.Content>
                        </Radio>
                    </RadioGroup>
                </div>
            </Variant>
        </Gallery>
    ),
}
