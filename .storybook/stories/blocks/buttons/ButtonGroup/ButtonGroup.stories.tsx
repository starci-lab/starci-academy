import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRight } from "@gravity-ui/icons"
import { ButtonGroup } from "./ButtonGroup"

const meta: Meta<typeof ButtonGroup> = {
    title: "Primitives/Button/ButtonGroup",
    component: ButtonGroup,
    tags: ["autodocs", "news"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ButtonGroup>

/** Nút CHÍNH + nút PHỤ — cụm CTA điển hình. Truyền config (`{label,icon,onPress}`), group tự set variant + size + gap. */
export const PrimarySecondary: Story = {
    name: "Chính + phụ",
    parameters: {
        usage:
            "Dùng khi 1 surface có 1 hành động CHÍNH + 1 PHỤ (vd \"Tiếp tục học\" + \"Xem khóa học\"). " +
            "Group nắm vai/thứ tự + `size` + `gap-2`; caller chỉ truyền `{label,icon,onPress}` (§4). " +
            "Responsive: dọc-full-width ở hẹp → ngang từ `@app-sm` (thu hẹp panel để thấy).",
    },
    render: () => (
        <div className="max-w-md p-8">
            <ButtonGroup
                primary={{ label: "Tiếp tục học", icon: <ArrowRight aria-hidden /> }}
                secondary={{ label: "Xem khóa học" }}
            />
        </div>
    ),
}

/** SHAPE dọc + full-width — ép mọi breakpoint (khi cụm luôn hẹp). */
export const Vertical: Story = {
    name: "Dọc (full-width)",
    parameters: {
        usage: "Ép `vertical` khi cụm LUÔN hẹp (cột hẹp cố định) — nút giãn full-width, xếp dọc. Composition khác, không chỉ style.",
    },
    render: () => (
        <div className="w-56 p-8">
            <ButtonGroup
                vertical
                primary={{ label: "Tiếp tục học" }}
                secondary={{ label: "Xem khóa học" }}
            />
        </div>
    ),
}

/** 3 size trong 1 khung — `size` group sở hữu, áp cả cụm; icon THEO size (sm bỏ · md size-5 · lg size-6). */
export const Sizes: Story = {
    name: "Kích thước (sm · md · lg)",
    parameters: {
        usage:
            "`size` áp cho CẢ cụm (caller không set lẻ). Icon co theo size nút: lg → size-6, md → size-5, " +
            "sm → BỎ icon (nút nhỏ không mang icon). Chọn theo trọng lượng surface: sm = dày đặc, lg = hero.",
    },
    render: () => {
        const arrow = { label: "Tiếp tục học", icon: <ArrowRight aria-hidden /> }
        const view = { label: "Xem khóa học" }
        return (
            <div className="flex flex-col gap-6 p-8">
                <ButtonGroup size="sm" primary={arrow} secondary={view} />
                <ButtonGroup size="md" primary={arrow} secondary={view} />
                <ButtonGroup size="lg" primary={arrow} secondary={view} />
            </div>
        )
    },
}

/** STATE loading — `isSkeleton` tự render skeleton mirror (đúng số nút + size), KHÔNG skeleton rời. */
export const Loading: Story = {
    name: "Đang tải",
    parameters: {
        usage: "Truyền `isSkeleton` khi cụm đang tải — group tự vẽ skeleton mirror layout + số nút + size. Không dựng Skeleton rời ngoài.",
    },
    render: () => (
        <div className="max-w-md p-8">
            <ButtonGroup isSkeleton primary={{ label: "Tiếp tục học" }} secondary={{ label: "Xem khóa học" }} />
        </div>
    ),
}
