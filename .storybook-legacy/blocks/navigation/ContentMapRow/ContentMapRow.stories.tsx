import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { ContentMapRow } from "@/components/blocks/navigation/ContentMapRow"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ContentMapRow> = {
    title: "Legacy/Blocks/Navigation/ContentMapRow",
    component: ContentMapRow,
}
export default meta
type Story = StoryObj<typeof ContentMapRow>

/** Dải rail cố định để các specimen đơn lẻ có cùng bề rộng với danh sách thật. */
const Rail = ({ children }: { children: React.ReactNode }) => (
    <div className="w-72">{children}</div>
)

/**
 * Danh sách bài học có chọn — bấm một dòng còn mở khoá sẽ đổi dòng đang active,
 * chứng minh onPress do caller điều khiển highlight (component không tự giữ state).
 */
const SelectableContentMap = () => {
    const [activeId, setActiveId] = useState("normalization")
    const rows = [
        { id: "intro-sql", title: "Nhập môn SQL và mô hình quan hệ", isRead: true, isLocked: false, isPremium: false },
        { id: "normalization", title: "Chuẩn hoá dữ liệu quan hệ tới 3NF", isRead: true, isLocked: false, isPremium: false },
        { id: "indexing", title: "Chỉ mục B-Tree và kế hoạch truy vấn", isRead: false, isLocked: false, isPremium: false },
        { id: "replication", title: "Replication và consistency trong hệ phân tán", isRead: false, isLocked: false, isPremium: true },
        { id: "sharding", title: "Sharding cho hệ thống hàng triệu bản ghi", isRead: false, isLocked: true, isPremium: true },
    ]
    return (
        <div className="flex w-72 flex-col gap-3">
            <div className="flex flex-col gap-1 rounded-2xl border border-default p-1">
                {rows.map((row) => (
                    <ContentMapRow
                        key={row.id}
                        title={row.title}
                        isActive={row.id === activeId}
                        isRead={row.isRead}
                        isLocked={row.isLocked}
                        isPremium={row.isPremium}
                        onPress={() => {
                            if (row.isLocked) return
                            setActiveId(row.id)
                        }}
                    />
                ))}
            </div>
            <Typography type="body-sm" color="muted">
                {`Bài đang mở: ${rows.find((row) => row.id === activeId)?.title ?? ""}`}
            </Typography>
        </div>
    )
}

/**
 * Toàn bộ trạng thái của ContentMapRow: marker chưa đọc/đã đọc/khoá/premium theo
 * đúng thứ tự ưu tiên, dòng đang active, meta bên phải, tiêu đề dài clamp 2 dòng,
 * và nhiều dòng liền nhau trong một dải rail thật.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tổng quan mọi trạng thái trước khi ghép ContentMapRow vào rail nội dung khoá học — chọn đúng tổ hợp isRead/isLocked/isPremium theo dữ liệu tiến độ thật của học viên, thay vì tự dựng lại icon trạng thái.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Chưa đọc — vòng tròn rỗng"
                hint="Trạng thái mặc định: bài chưa mở khoá premium, chưa đọc, không bị khoá — chỉ còn vòng tròn trung tính."
            >
                <Rail>
                    <ContentMapRow
                        title="Chỉ mục B-Tree và kế hoạch truy vấn"
                        isActive={false}
                        isRead={false}
                        isPremium={false}
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Đã đọc — dấu tick xanh"
                hint="Ưu tiên cao nhất trong resolveStatus: một khi isRead=true thì dấu tick xanh luôn thắng, kể cả khi bài vẫn đang khoá hoặc là premium."
            >
                <Rail>
                    <ContentMapRow
                        title="Nhập môn SQL và mô hình quan hệ"
                        isActive={false}
                        isRead
                        isLocked
                        isPremium
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Bị khoá — chưa có quyền mở"
                hint="Dùng khi học viên chưa ghi danh hoặc chưa tới lượt mở bài; icon khoá thắng cả premium vì khoá đứng ưu tiên trước trong resolveStatus."
            >
                <Rail>
                    <ContentMapRow
                        title="Sharding cho hệ thống hàng triệu bản ghi"
                        isActive={false}
                        isRead={false}
                        isLocked
                        isPremium
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Premium — đã mở khoá"
                hint="Bài thuộc gói premium nhưng học viên đã ghi danh nên không còn bị khoá — hiện icon sao thay vòng tròn thường."
            >
                <Rail>
                    <ContentMapRow
                        title="Replication và consistency trong hệ phân tán"
                        isActive={false}
                        isRead={false}
                        isLocked={false}
                        isPremium
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Đang mở — accent tint"
                hint="Dòng khớp với bài học viên đang xem trong trang nội dung; nền và chữ đổi sang màu accent để định vị vị trí hiện tại trong rail."
            >
                <Rail>
                    <ContentMapRow
                        title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                        isActive
                        isRead={false}
                        isPremium={false}
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Có meta bên phải — nhãn thời gian đọc"
                hint="Dùng khi rail cần hiện thêm dữ liệu phụ mỗi dòng, ví dụ số phút đọc ước tính, để học viên ước lượng thời gian trước khi bấm vào."
            >
                <Rail>
                    <ContentMapRow
                        title="Chỉ mục B-Tree và kế hoạch truy vấn"
                        isActive={false}
                        isRead={false}
                        isPremium={false}
                        meta={(
                            <Typography type="body-sm" color="muted">
                                8 phút
                            </Typography>
                        )}
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Tiêu đề dài — clamp 2 dòng"
                hint="Kiểm tra tiêu đề dài không phá bề rộng rail cố định mà tự xuống dòng và cắt gọn ở dòng thứ hai."
            >
                <Rail>
                    <ContentMapRow
                        title="Thiết kế schema phân tán chịu lỗi cho hệ thống đặt bàn nhà hàng quy mô toàn quốc"
                        isActive={false}
                        isRead={false}
                        isPremium={false}
                        onPress={() => {}}
                    />
                </Rail>
            </Variant>

            <Variant
                label="Nhiều dòng liền nhau (N) — dải nội dung khoá học"
                hint="Một rail thật trộn đủ trạng thái: đã đọc, đang mở, chưa đọc, premium còn khoá — đúng bối cảnh sử dụng của block trong sidebar nội dung."
            >
                <div className="flex w-72 flex-col gap-1 rounded-2xl border border-default p-1">
                    <ContentMapRow title="Nhập môn SQL và mô hình quan hệ" isActive={false} isRead isPremium={false} onPress={() => {}} />
                    <ContentMapRow title="Chuẩn hoá dữ liệu quan hệ tới 3NF" isActive isRead={false} isPremium={false} onPress={() => {}} />
                    <ContentMapRow title="Chỉ mục B-Tree và kế hoạch truy vấn" isActive={false} isRead={false} isPremium={false} onPress={() => {}} />
                    <ContentMapRow title="Sharding cho hệ thống hàng triệu bản ghi" isActive={false} isRead={false} isLocked isPremium onPress={() => {}} />
                </div>
            </Variant>
        </Gallery>
    ),
}

/**
 * Bấm một dòng còn mở khoá để xem dòng đó trở thành active — caption dưới rail
 * đổi theo đúng tên bài vừa chọn, chứng minh accent tint do caller quyết định.
 */
export const Selectable: Story = {
    parameters: {
        usage: "Dùng để kiểm tra hành vi chọn dòng trong rail nội dung: bấm một bài còn mở khoá sẽ đổi accent tint sang bài đó, bấm bài đang khoá thì không đổi gì vì caller tự chặn điều hướng.",
    },
    render: () => <SelectableContentMap />,
}
