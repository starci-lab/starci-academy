import type { Meta, StoryObj } from "@storybook/nextjs"
import { Kbd } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { InputButtonLike } from "./InputButtonLike"

const meta: Meta<typeof InputButtonLike> = {
    title: "Primitives/Button/InputButtonLike",
    component: InputButtonLike,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof InputButtonLike>

/**
 * Dùng khi cần một field trông như input nhưng thực chất là button mở overlay, ví dụ
 * mở dialog tìm kiếm toàn cục; không gõ được vào field này — nếu cần gõ thật, dùng Input.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <InputButtonLike
                placeholder="Search courses..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Thêm icon kính lúp mờ ở phía trước khi field đóng vai ô tìm kiếm. Icon truyền TRẦN — block tự ép size + màu. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <InputButtonLike
                icon={<MagnifyingGlassIcon />}
                placeholder="Search courses, lessons..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Gắn gợi ý phím tắt (Kbd) ở mép phải khi overlay có thể mở nhanh bằng bàn phím (⌘K). */
export const WithShortcut: Story = {
    render: () => (
        <div className="p-8">
            <InputButtonLike
                icon={<MagnifyingGlassIcon />}
                placeholder="Quick search..."
                suffix={(
                    <Kbd>
                        <Kbd.Content>⌘K</Kbd.Content>
                    </Kbd>
                )}
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}

/** Khi placeholder dài hơn chiều rộng cho phép, chữ bị cắt một dòng thay vì phá vỡ layout. */
export const TruncatedPlaceholder: Story = {
    render: () => (
        <div className="p-8">
            <InputButtonLike
                icon={<MagnifyingGlassIcon />}
                placeholder="Search Fullstack, System Design, DevOps courses and much more..."
                onPress={() => {}}
                className="w-64"
            />
        </div>
    ),
}

/** Đang load (chưa biết placeholder/shortcut) — bật cờ `isSkeleton`, bar giữ đúng chiều cao field theo `size`. */
export const IsSkeleton: Story = {
    render: () => (
        <div className="p-8">
            <InputButtonLike
                placeholder="Search courses..."
                onPress={() => {}}
                isSkeleton
                className="w-80"
            />
        </div>
    ),
}

/** Ba nấc chiều cao — block tự co icon-size theo `size` (sm/md/lg), story không chỉnh icon. */
export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4 p-8">
            <InputButtonLike
                size="sm"
                icon={<MagnifyingGlassIcon />}
                placeholder="Small search..."
                onPress={() => {}}
                className="w-80"
            />
            <InputButtonLike
                size="md"
                icon={<MagnifyingGlassIcon />}
                placeholder="Medium search..."
                onPress={() => {}}
                className="w-80"
            />
            <InputButtonLike
                size="lg"
                icon={<MagnifyingGlassIcon />}
                placeholder="Large search..."
                onPress={() => {}}
                className="w-80"
            />
        </div>
    ),
}
