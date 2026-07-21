import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import { CaretRightIcon, FileTextIcon } from "@phosphor-icons/react"
import { ListRow } from "./ListRow"

const meta: Meta<typeof ListRow> = {
    title: "Primitives/List/ListRow",
    component: ListRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ListRow>

const chevron = <CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />

/** The simplest row — just a title. Used when the list has no subtitle, icon, or trailing action. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                <ListRow title="Bài tập buổi 1: Vòng lặp và điều kiện" />
            </div>
        </div>
    ),
}

/** `leading` (type icon) + `subtitle` (a module breadcrumb) below the title. */
export const LeadingSubtitle: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                <ListRow
                    leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                    title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                    subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                />
            </div>
        </div>
    ),
}

/** `meta` (a status chip) + `trailing` (a navigation chevron) on the right edge. */
export const MetaTrailing: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                <ListRow
                    title="Viết migration thêm unique index cho email"
                    subtitle="Nộp ngày 15/03/2026"
                    meta={
                        <Chip size="sm" variant="soft" color="success">
                            <Chip.Label>Đạt</Chip.Label>
                        </Chip>
                    }
                    trailing={chevron}
                />
            </div>
        </div>
    ),
}

/** `divider` between consecutive rows — set on every row EXCEPT the last, so no trailing border. */
export const DividerList: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                <ListRow title="Buổi 1: Vòng lặp và điều kiện" subtitle="Hoàn thành" divider />
                <ListRow title="Buổi 2: Hàm và phạm vi biến" subtitle="Hoàn thành" divider />
                <ListRow title="Buổi 3: Cấu trúc dữ liệu cơ bản" subtitle="Đang học" />
            </div>
        </div>
    ),
}

/** `href`: the whole row is an `<a>` that navigates to a real route on click (vs `onPress` for in-page callbacks). */
export const LinkRow: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                <ListRow
                    title="Xem lại chứng chỉ hoàn thành khoá"
                    subtitle="Cấp ngày 01/02/2026"
                    href="/certificates/fullstack-mastery"
                    trailing={chevron}
                />
            </div>
        </div>
    ),
}

/** `onPress`: the entire row is a keyboard-accessible button — click a row to fire its own handler (hover/focus surface). */
export const Clickable: Story = {
    render: () => {
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
        return (
            <div className="p-8">
                <ClickableRows />
            </div>
        )
    },
}
