import type { Meta, StoryObj } from "@storybook/nextjs"
import { Kbd } from "@heroui/react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { InputButtonLike } from "@/components/blocks/buttons/InputButtonLike"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof InputButtonLike> = {
    title: "Blocks/Form/InputButtonLike",
    component: InputButtonLike,
}
export default meta
type Story = StoryObj<typeof InputButtonLike>

/**
 * Toàn bộ biến thể của InputButtonLike: mặc định, có icon, có gợi ý phím tắt, và
 * placeholder dài bị cắt. Dùng để tra khi nào cần thêm icon/suffix và xác nhận
 * hành vi truncate khi placeholder vượt chiều rộng field.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Dùng khi cần một field trông như input nhưng thực chất là button mở overlay, ví dụ mở dialog tìm kiếm toàn cục; không gõ được vào field này — nếu cần gõ thật, dùng Input."
            >
                <InputButtonLike
                    placeholder="Search courses..."
                    onPress={() => {}}
                    className="w-80"
                />
            </Variant>
            <Variant
                label="Có icon"
                hint="Thêm icon kính lúp mờ ở phía trước khi field đóng vai ô tìm kiếm, giúp người dùng nhận diện chức năng ngay từ icon."
            >
                <InputButtonLike
                    icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                    placeholder="Search courses, lessons..."
                    onPress={() => {}}
                    className="w-80"
                />
            </Variant>
            <Variant
                label="Có gợi ý phím tắt"
                hint="Gắn gợi ý phím tắt (Kbd) ở mép phải khi overlay có thể mở nhanh bằng bàn phím, ví dụ Cmd K cho tìm kiếm toàn cục."
            >
                <InputButtonLike
                    icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                    placeholder="Quick search..."
                    suffix={(
                        <Kbd>
                            <Kbd.Content>⌘K</Kbd.Content>
                        </Kbd>
                    )}
                    onPress={() => {}}
                    className="w-80"
                />
            </Variant>
            <Variant
                label="Placeholder dài bị cắt"
                hint="Khi placeholder dài hơn chiều rộng cho phép, chữ bị cắt một dòng thay vì phá vỡ layout."
            >
                <InputButtonLike
                    icon={<MagnifyingGlassIcon size={16} className="text-field-placeholder" />}
                    placeholder="Search Fullstack, System Design, DevOps courses and much more..."
                    onPress={() => {}}
                    className="w-64"
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ biến thể của InputButtonLike: mặc định, có icon, có gợi ý phím tắt, và " +
            "placeholder dài bị cắt. Dùng khi cần tra lúc nào thêm icon/suffix và xác nhận hành vi " +
            "truncate khi placeholder vượt chiều rộng field.",
    },
}
