import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRight } from "@gravity-ui/icons"
import { Button, type ButtonSize, type ButtonVariant } from "./Button"

const meta: Meta<typeof Button> = {
    title: "Primitives/Button/Button",
    component: Button,
    tags: ["autodocs", "news"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Button>

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "tertiary", "ghost"]
const SIZES: ButtonSize[] = ["sm", "md", "lg"]

/** 4 variant theo VAI (primary CTA chính · secondary phụ · tertiary đứng-1-mình · ghost nhẹ). */
export const Variants: Story = {
    name: "Variants",
    parameters: {
        usage: "Chọn variant theo VAI, không theo màu: primary = CTA chính (≤1/surface) · secondary = phụ đi kèm primary · tertiary = phụ đứng một mình · ghost = nhẹ nhất.",
    },
    render: () => (
        <div className="flex flex-wrap items-center gap-3 p-8">
            {VARIANTS.map((v) => (
                <Button key={v} variant={v}>
                    {v}
                </Button>
            ))}
        </div>
    ),
}

/** 3 size — icon TRAILING co theo size nút (§5a: sm→size-4 · md→size-5 · lg→size-6). */
export const Sizes: Story = {
    name: "Kích thước + icon",
    parameters: {
        usage: "`size` ép cả nút + icon: sm→icon size-4 · md→size-5 · lg→size-6 (§5a, primitive sở hữu). Trailing icon trượt phải khi hover (§5b).",
    },
    render: () => (
        <div className="flex items-center gap-4 p-8">
            {SIZES.map((s) => (
                <Button key={s} size={s} icon={<ArrowRight aria-hidden />}>
                    Tiếp tục
                </Button>
            ))}
        </div>
    ),
}

/** STATE loading — `isSkeleton` (if-else) tự vẽ Skeleton.Button đúng size, KHÔNG skeleton rời. */
export const Loading: Story = {
    name: "Đang tải",
    parameters: {
        usage: "Bật `isSkeleton` → base Button tự render skeleton mirror đúng size. Consumer/ButtonGroup chỉ pass cờ xuống.",
    },
    render: () => (
        <div className="flex items-center gap-4 p-8">
            {SIZES.map((s) => (
                <Button key={s} size={s} isSkeleton>
                    Tiếp tục
                </Button>
            ))}
        </div>
    ),
}
