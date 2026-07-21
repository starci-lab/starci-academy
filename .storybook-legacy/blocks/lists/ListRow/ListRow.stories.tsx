import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import { CaretRightIcon as ChevronRightIcon, FileTextIcon } from "@phosphor-icons/react"
import { ListRow } from "@/components/blocks/lists/ListRow"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ListRow> = {
    title: "Legacy/Blocks/List/ListRow",
    component: ListRow,
}
export default meta
type Story = StoryObj<typeof ListRow>

/** Rows that toggle a "last clicked" caption on press, to prove onPress fires with the row's own identity rather than a shared handler. */
const ClickableRows = () => {
    const [lastClicked, setLastClicked] = useState("(chưa bấm dòng nào)")
    const rows = [
        "Bài tập buổi 1: Vòng lặp và điều kiện",
        "Bài tập buổi 2: Hàm và phạm vi biến",
        "Bài tập buổi 3: Cấu trúc dữ liệu cơ bản",
    ]
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <div className="flex flex-col rounded-2xl border border-default px-3">
                {rows.map((row, index) => (
                    <ListRow
                        key={row}
                        title={row}
                        onPress={() => setLastClicked(row)}
                        divider={index < rows.length - 1}
                    />
                ))}
            </div>
            <Typography type="body-sm" color="muted">
                {`Dòng vừa bấm: ${lastClicked}`}
            </Typography>
        </div>
    )
}

/**
 * Toàn bộ trạng thái của ListRow: chỉ tiêu đề, thêm leading/subtitle, thêm
 * meta/trailing, nhiều dòng liền nhau với divider, và dạng liên kết href.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tổng quan mọi biến thể trước khi ghép ListRow vào SectionCard — chọn đúng tổ hợp leading/subtitle/meta/trailing/divider theo dữ liệu thật của danh sách, thay vì tự dựng lại layout hàng.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Chỉ có tiêu đề"
                hint="Dòng đơn giản nhất — dùng khi danh sách không có mô tả phụ, icon hay hành động ở cuối hàng."
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <ListRow title="Bài tập buổi 1: Vòng lặp và điều kiện" />
                </div>
            </Variant>

            <Variant
                label="Leading + subtitle"
                hint="Dùng khi hàng cần icon nhận diện loại nội dung và một dòng phụ (breadcrumb module) bên dưới tiêu đề."
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <ListRow
                        leading={<FileTextIcon className="size-5 text-muted" />}
                        title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                        subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                    />
                </div>
            </Variant>

            <Variant
                label="Meta + trailing"
                hint="Dùng khi hàng cần hiện trạng thái (chip kết quả) và mũi tên điều hướng ở cuối, ví dụ danh sách bài đã nộp."
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <ListRow
                        title="Viết migration thêm unique index cho email"
                        subtitle="Nộp ngày 15/03/2026"
                        meta={
                            <Chip size="sm" variant="soft" color="success">
                                <Chip.Label>Đạt</Chip.Label>
                            </Chip>
                        }
                        trailing={<ChevronRightIcon className="size-4 text-muted" />}
                    />
                </div>
            </Variant>

            <Variant
                label="Nhiều dòng liền nhau (N) — divider"
                hint="Ba dòng trong cùng một danh sách: mỗi dòng đặt divider trừ dòng cuối, để không dư viền dưới cùng."
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <ListRow title="Buổi 1: Vòng lặp và điều kiện" subtitle="Hoàn thành" divider />
                    <ListRow title="Buổi 2: Hàm và phạm vi biến" subtitle="Hoàn thành" divider />
                    <ListRow title="Buổi 3: Cấu trúc dữ liệu cơ bản" subtitle="Đang học" />
                </div>
            </Variant>

            <Variant
                label="Dạng liên kết — href"
                hint="Dùng khi cả hàng phải điều hướng sang một trang khác (route thật), khác onPress chỉ chạy callback nội bộ trong trang hiện tại."
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <ListRow
                        title="Xem lại chứng chỉ hoàn thành khoá"
                        subtitle="Cấp ngày 01/02/2026"
                        href="/certificates/fullstack-mastery"
                        trailing={<ChevronRightIcon className="size-4 text-muted" />}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}

/**
 * Bấm vào một dòng để xem onPress chạy đúng handler của dòng đó — dòng vừa
 * bấm hiện lại tiêu đề bên dưới danh sách.
 */
export const Clickable: Story = {
    parameters: {
        usage: "Dùng để kiểm tra onPress: mỗi dòng có handler riêng, bấm dòng nào thì caption dưới danh sách đổi theo đúng dòng đó — toàn bộ hàng là điểm bấm, có hover/focus surface.",
    },
    render: () => <ClickableRows />,
}
