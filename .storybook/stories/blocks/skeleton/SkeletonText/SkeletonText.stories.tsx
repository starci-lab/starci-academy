import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SkeletonText } from "@/components/blocks/skeleton/SkeletonText"
import type { SkeletonTextSize } from "@/components/blocks/skeleton/SkeletonText"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SkeletonText> = {
    title: "Blocks/Skeleton/SkeletonText",
    component: SkeletonText,
}
export default meta
type Story = StoryObj<typeof SkeletonText>

/** Toàn bộ token size, từ nhỏ nhất đến lớn nhất, dùng cho gallery liệt kê dưới đây. */
const SIZE_TOKENS: SkeletonTextSize[] = [
    "xs",
    "sm",
    "base",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
]

/**
 * Toàn bộ cách dùng SkeletonText: 10 token size khớp line-box thật, width tuỳ
 * biến để mô phỏng đoạn văn nhiều dòng không đều, và className để đổi hình
 * dạng bar khi cần thay cho một dòng không phải văn bản thường (pill/tag).
 * Không có state loading/empty/error/disabled/selected — bản thân block CHÍNH
 * LÀ trạng thái loading đứng thay cho một dòng chữ, không tự quản state nào
 * khác; cũng không stateful (không onChange) nên không cần bản Controlled.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Chọn đúng token size khớp với text thật sắp thay thế (vd text-sm thật thì dùng size=\"sm\") để layout không giật khi dữ liệu về; dùng width khi cần mô phỏng dòng ngắn/dài không đều như dòng cuối một đoạn văn; dùng className khi bar cần thay hình dạng khác rounded-md mặc định.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Toàn bộ size (xs → 6xl)"
                hint="Mỗi token trỏ đúng height + margin của line-box thật (qua skeletonTextSizeMap) — chọn size khớp text-* thật đang bị thay thế, không đoán."
            >
                <div className="flex w-80 flex-col gap-4">
                    {SIZE_TOKENS.map((size) => (
                        <div key={size} className="flex flex-col gap-1">
                            <Typography type="body-xs" color="muted">
                                size=&quot;{size}&quot;
                            </Typography>
                            <SkeletonText size={size} />
                        </div>
                    ))}
                </div>
            </Variant>
            <Variant
                label="Chiều rộng tuỳ biến (width)"
                hint="Ghép nhiều SkeletonText cùng size, dòng cuối rút ngắn width — mô phỏng một đoạn văn nhiều dòng, dòng cuối thường ngắn hơn dòng đầy."
            >
                <div className="flex w-96 flex-col gap-2">
                    <SkeletonText size="base" />
                    <SkeletonText size="base" />
                    <SkeletonText size="base" width="w-2/3" />
                </div>
            </Variant>
            <Variant
                label="className tuỳ biến"
                hint="className merge sau cùng nên có thể đè bo góc mặc định — dùng khi bar thay cho một dòng không phải văn bản thường, ví dụ một pill/tag đang chờ dữ liệu."
            >
                <SkeletonText size="base" width="w-24" className="rounded-full" />
            </Variant>
        </Gallery>
    ),
}
