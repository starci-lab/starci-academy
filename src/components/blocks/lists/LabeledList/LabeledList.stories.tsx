import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CaretRightIcon, LightningIcon, PlusIcon } from "@phosphor-icons/react"

import { LabeledList } from "./index"
import { ListRow } from "../ListRow"

const meta: Meta<typeof LabeledList> = {
    title: "Blocks/List/LabeledList",
    component: LabeledList,
}

export default meta

type Story = StoryObj<typeof LabeledList>

/** Rows dùng chung cho các story dưới. */
const rows = (
    <>
        <ListRow
            title="Ôn tập spaced-repetition"
            subtitle="8 thẻ đến hạn hôm nay"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
        <ListRow
            title="Thử thách coding"
            subtitle="2 bài chưa nộp"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
        <ListRow
            title="Phỏng vấn thử"
            subtitle="mở khoá sau bài 5"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
    </>
)

/**
 * Ngoại lệ hẹp của `LabeledCard`, không phải mặc định: chỉ dùng khi khối nằm trong RAIL hoặc PANEL
 * và list chỉ vài hàng — nhãn và list ngăn nhau bằng whitespace, không khung card, không divider,
 * không đếm số thừa. Mọi khối-có-tiêu-đề khác vẫn là `LabeledCard`: khối đứng ở cột chính của trang,
 * hoặc cần một mặt phẳng bao lấy nội dung để tách khỏi nền, thì dùng `LabeledCard` chứ đừng dùng cái
 * này (bỏ khung giữa trang thì khối trôi, mắt không thấy biên đâu mà gom). Nếu là nhiều item đơn giản
 * cần gộp chung một card có separator giữa các hàng thì dùng `SurfaceListCard` — `LabeledList` không
 * vẽ separator, đông hàng sẽ dính lại thành một mảng chữ. Một hành động đi kèm thì truyền qua prop
 * `action` để nó neo dưới list, đừng nhét button vào `children`.
 */
export const Default: Story = {
    parameters: {
        usage: "Ngoại lệ hẹp của LabeledCard, không phải mặc định: chỉ dùng khi khối nằm trong RAIL hoặc PANEL "
            + "và list chỉ vài hàng — nhãn và list ngăn nhau bằng whitespace, không khung card, không divider, "
            + "không đếm số thừa. Mọi khối-có-tiêu-đề khác vẫn là LabeledCard: khối đứng ở cột chính của trang, "
            + "hoặc cần một mặt phẳng bao lấy nội dung để tách khỏi nền, thì dùng LabeledCard chứ đừng dùng cái "
            + "này (bỏ khung giữa trang thì khối trôi, mắt không thấy biên đâu mà gom). Nếu là nhiều item đơn giản "
            + "cần gộp chung một card có separator giữa các hàng thì dùng SurfaceListCard — LabeledList không "
            + "vẽ separator, đông hàng sẽ dính lại thành một mảng chữ. Một hành động đi kèm thì truyền qua prop "
            + "action để nó neo dưới list, đừng nhét button vào children.",
    },
    render: () => (
        <div className="max-w-sm">
            <LabeledList label="Ôn tập & luyện" icon={<LightningIcon className="size-4 text-muted" aria-hidden focusable="false" />}>
                {rows}
            </LabeledList>
        </div>
    ),
}

/** Có footer action pinned dưới list (`gap-3` từ list) — ví dụ CTA "Thêm mục" ở panel do người dùng sở hữu. */
export const WithAction: Story = {
    parameters: { usage: "Có footer action dưới list (gap-3) — ví dụ CTA thêm mục ở panel người dùng sở hữu." },
    render: () => (
        <div className="max-w-sm">
            <LabeledList
                label="Ôn tập & luyện"
                icon={<LightningIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                action={
                    <Button variant="secondary" size="sm" className="w-fit">
                        <PlusIcon className="size-4" aria-hidden focusable="false" />
                        Thêm mục
                    </Button>
                }
            >
                {rows}
            </LabeledList>
        </div>
    ),
}

/** Bỏ icon khi label đã đủ rõ nghĩa và panel muốn giữ phần header tối giản. */
export const WithoutIcon: Story = {
    parameters: { usage: "Bỏ icon khi label đã đủ rõ nghĩa và panel muốn giữ phần header tối giản." },
    render: () => (
        <div className="max-w-sm">
            <LabeledList label="Ghi chú bài học">{rows}</LabeledList>
        </div>
    ),
}
