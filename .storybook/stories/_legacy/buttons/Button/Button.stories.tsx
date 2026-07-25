import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button, type ButtonSize, type ButtonVariant } from "@sb-components/_legacy/designs/buttons/Button/Button"

const meta: Meta<typeof Button> = {
    title: "Legacy/Primitives/Buttons/Button",
    component: Button,
    tags: ["autodocs", "news"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Button>

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "tertiary", "ghost", "danger", "danger-soft"]
const SIZES: ButtonSize[] = ["sm", "md", "lg"]

/**
 * 5 variant theo VAI (primary CTA chính · secondary phụ · tertiary đứng-1-mình ·
 * ghost nhẹ · danger destructive).
 *
 * Gộp 2026-07-26: `danger` trước đó đứng thành story RIÊNG dù nó chỉ là một GIÁ TRỊ
 * của `variant` — cùng cây DOM, khác mỗi màu. Leaf tách theo CẤU TRÚC, không theo giá
 * trị prop (§14d.2), nên nó thuộc về đây. Mảng `VARIANTS` cũng đang thiếu `danger`
 * chính là lý do nó phải mọc ra chỗ khác.
 */
export const Variants: Story = {
    parameters: {
        usage: "Chọn variant theo VAI, không theo màu: primary = CTA chính (≤1/surface) · secondary = phụ đi kèm primary · tertiary = phụ đứng một mình · ghost = nhẹ nhất · danger = hành động HUỶ/XOÁ không đảo ngược được (là `variant`, KHÔNG phải prop `color` — HeroUI fork có variant riêng).",
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
    parameters: {
        usage: "`size` ép cả nút + icon: sm→icon size-4 · md→size-5 · lg→size-6 (§5a, primitive sở hữu). Trailing icon trượt phải khi hover (§5b).",
    },
    render: () => (
        <div className="flex items-center gap-3 p-8">
            {SIZES.map((s) => (
                <Button key={s} size={s} icon={<ArrowRightIcon aria-hidden />}>
                    Tiếp tục
                </Button>
            ))}
        </div>
    ),
}

/** STATE loading — `isSkeleton` (if-else) tự vẽ Skeleton.Button đúng size, KHÔNG skeleton rời. */
export const Loading: Story = {
    parameters: {
        usage: "Bật `isSkeleton` → base Button tự render skeleton mirror đúng size. Consumer/ButtonGroup chỉ pass cờ xuống.",
    },
    render: () => (
        <div className="flex items-center gap-3 p-8">
            {SIZES.map((s) => (
                <Button key={s} size={s} isSkeleton>
                    Tiếp tục
                </Button>
            ))}
        </div>
    ),
}

/** STATE `isPending` — Spinner render TAY trước label + khoá press (react-aria `isPending` không tự vẽ spinner). */
export const Pending: Story = {
    parameters: {
        usage: "Bật `isPending` → Spinner (size=sm, color=current) chèn trước label/icon + nút khoá press. Dùng khi chờ mutation/API.",
    },
    render: () => (
        <div className="flex items-center gap-3 p-8">
            {SIZES.map((s) => (
                <Button key={s} size={s} isPending>
                    Tiếp tục
                </Button>
            ))}
            <Button iconOnly isPending ariaLabel="Đang xử lý" icon={<ArrowRightIcon aria-hidden />} />
        </div>
    ),
}

/** STATE `isDisabled` — forward thẳng xuống HeroUI button, không có Spinner (khác `isPending`). */
export const Disabled: Story = {
    parameters: {
        usage: "`isDisabled` khoá nút không kèm Spinner — dùng khi form invalid/chưa đủ điều kiện, khác `isPending` (đang chờ tác vụ).",
    },
    render: () => (
        <div className="flex items-center gap-3 p-8">
            {SIZES.map((s) => (
                <Button key={s} size={s} isDisabled>
                    Tiếp tục
                </Button>
            ))}
        </div>
    ),
}
