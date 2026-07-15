import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { Chip } from "@heroui/react"
import {
    BookOpenIcon,
    CaretRightIcon,
    GitBranchIcon,
    TrophyIcon,
} from "@phosphor-icons/react"

import { ListRow } from "./index"

const meta: Meta<typeof ListRow> = {
    title: "Blocks/ListRow",
    component: ListRow,
}

export default meta

type Story = StoryObj<typeof ListRow>

/** ListRow is frameless — it's designed to live inside a `SectionCard`. Mimic that surface here. */
const Surface = ({ children }: { children: ReactNode }) => (
    <div className="max-w-md rounded-3xl bg-surface p-4 shadow-surface">{children}</div>
)

/** Danh sách điều hướng thật: leading icon + tiêu đề/phụ đề + caret, có divider giữa các hàng (bỏ divider ở hàng cuối). */
export const Default: Story = {
    parameters: { usage: "Danh sách điều hướng: leading icon + tiêu đề/phụ đề + caret, divider giữa các hàng (bỏ ở hàng cuối)." },
    render: () => (
        <Surface>
            <ListRow
                leading={<BookOpenIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="Nền tảng lập trình"
                subtitle="12 bài học · 4 giờ"
                trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                onPress={() => {}}
                divider
            />
            <ListRow
                leading={<GitBranchIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="Cấu trúc dữ liệu & giải thuật"
                subtitle="18 bài học · 7 giờ"
                trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                onPress={() => {}}
                divider
            />
            <ListRow
                leading={<TrophyIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="Thiết kế hệ thống"
                subtitle="9 bài học · 5 giờ"
                trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                onPress={() => {}}
            />
        </Surface>
    ),
}

/** Gallery giải phẫu các slot: chỉ tiêu đề → +phụ đề → +leading → +meta (chip) → +trailing (caret). Xếp dọc để soi từng cấu hình. */
export const Anatomy: Story = {
    parameters: { usage: "Giải phẫu các slot của hàng: title → +subtitle → +leading → +meta → +trailing. Trộn tuỳ nội dung cần." },
    render: () => (
        <Surface>
            <ListRow title="Chỉ tiêu đề" divider />
            <ListRow title="Có phụ đề" subtitle="dòng mô tả phụ, mờ" divider />
            <ListRow
                leading={<BookOpenIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="Có leading icon"
                subtitle="icon giữ nguyên kích thước, không co"
                divider
            />
            <ListRow
                title="Có meta bên phải"
                subtitle="chip đếm / nhãn trạng thái"
                meta={<Chip size="sm" variant="soft" color="success"><Chip.Label>Mới</Chip.Label></Chip>}
                divider
            />
            <ListRow
                leading={<TrophyIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="Đủ slot: leading · meta · trailing"
                subtitle="cụm phải = meta + trailing, canh phải"
                meta={<Chip size="sm" variant="soft" color="warning"><Chip.Label>5</Chip.Label></Chip>}
                trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            />
        </Surface>
    ),
}

/** Hàng tương tác: `onPress` (role=button, có hover surface + focus ring) và `href` (cả hàng là link điều hướng). Rê/tab để thấy nền hover. */
export const Interactive: Story = {
    parameters: { usage: "Hàng bấm được: `onPress` (role=button + hover surface + focus ring) hoặc `href` (cả hàng là anchor điều hướng)." },
    render: () => (
        <Surface>
            <ListRow
                leading={<BookOpenIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="onPress — cả hàng là nút"
                subtitle="hover đổi nền, Enter/Space kích hoạt"
                trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                onPress={() => {}}
            />
            <ListRow
                leading={<GitBranchIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                title="href — cả hàng là link"
                subtitle="render thành <a>, điều hướng khi click"
                trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                href="#demo"
            />
        </Surface>
    ),
}
