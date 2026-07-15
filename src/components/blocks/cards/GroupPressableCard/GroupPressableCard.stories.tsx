import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { CaretRightIcon, GearIcon } from "@phosphor-icons/react"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { GroupPressableCard } from "./index"

const meta: Meta<typeof GroupPressableCard> = {
    title: "Block/Card/GroupPressableCard",
    component: GroupPressableCard,
}
export default meta
type Story = StoryObj<typeof GroupPressableCard>

const settingsItems = ["Chỉnh sửa hồ sơ", "Giao diện", "Bảo mật", "Thông báo"].map((title) => ({
    key: title,
    onPress: () => {},
    className: "flex items-center gap-3",
    content: (
        <>
            <GearIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
            <Typography type="body-sm" weight="medium" truncate>
                {title}
            </Typography>
        </>
    ),
}))

/** SM-2 grades shown by `RatingBar` below — same shape it exposes publicly (grade/label/hint). */
const ratingOptions = [
    { grade: 0, label: "Quên", hint: "Ôn lại ngay" },
    { grade: 1, label: "Khó", hint: "10 phút nữa" },
    { grade: 2, label: "Tốt", hint: "1 ngày" },
    { grade: 3, label: "Dễ", hint: "4 ngày" },
]

/** Dùng khi bấm xong KHÔNG có gì ở lại dạng đã-chọn — thẻ chạy một hành động rồi thôi (mở trang, chấm điểm); nếu lựa chọn phải Ở LẠI và đọc được là "cái tôi đã chọn" thì dùng SelectableCardGroup (radio thật) chứ không phải block này. */
export const Default: Story = {
    parameters: { usage: "Dùng khi bấm xong KHÔNG có gì ở lại dạng đã-chọn — thẻ chạy một hành động rồi thôi (mở trang, chấm điểm); nếu lựa chọn phải Ở LẠI và đọc được là \"cái tôi đã chọn\" thì dùng SelectableCardGroup (radio thật) chứ không phải block này." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    chọn khi mỗi ô mở một đích riêng và cả lưới chỉ là đường phụ của màn: không ô nào cần được ưu ái hơn ô nào, không ô nào giữ phím số của trang.
                </Typography>
            </div>
            <GroupPressableCard
                ariaLabel="Các trang cài đặt"
                columns={{ base: 1, sm: 2 }}
                items={settingsItems}
            />
        </div>
    ),
}

/** Dùng khi cụm là hành động CHÍNH của màn hình: bật phím tắt 1–N để tay ở sẵn bàn phím vẫn thao tác được. Chỉ bật phím tắt ở đây — listener nằm ở window nên một lưới điều hướng phụ mà bật sẽ cướp mọi phím số của trang. Ca thật DUY NHẤT của cờ này là chấm thẻ SM-2, nên story render thẳng `RatingBar` — nó chỉ là wrapper mỏng bọc `GroupPressableCard` với đúng cờ này, tự mock lại tile ở đây sẽ trôi khỏi component thật ngay lần sửa kế tiếp. Thử bấm phím 1 đến 4. */
export const ActionTilesWithShortcut: Story = {
    parameters: { usage: "Dùng khi cụm là hành động CHÍNH của màn hình: bật phím tắt 1–N để tay ở sẵn bàn phím vẫn thao tác được. Chỉ bật phím tắt ở đây — listener nằm ở window nên một lưới điều hướng phụ mà bật sẽ cướp mọi phím số của trang. Ca thật DUY NHẤT của cờ này là chấm thẻ SM-2, nên story render thẳng RatingBar — nó chỉ là wrapper mỏng bọc GroupPressableCard với đúng cờ này, tự mock lại tile ở đây sẽ trôi khỏi component thật ngay lần sửa kế tiếp. Thử bấm phím 1 đến 4." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Ô hành động có phím tắt</Label>
                <Typography type="body-sm" color="muted">
                    chọn khi người dùng bấm cụm này nhiều lượt liên tiếp nên tay ở sẵn bàn phím, và mỗi ô cần đọc được hệ quả của lượt bấm trước khi chọn.
                </Typography>
            </div>
            <RatingBar
                ariaLabel="Chọn mức độ nhớ thẻ này"
                options={ratingOptions}
                onRate={() => {}}
            />
        </div>
    ),
}

/** Dùng khi một lượt gửi đang bay — khoá cả cụm để tránh bấm thêm lần nữa; phím tắt ngưng theo, khác với việc ẩn thẻ đi (người dùng vẫn thấy lựa chọn tồn tại, chỉ là chưa bấm được). */
export const AllDisabled: Story = {
    parameters: { usage: "Dùng khi một lượt gửi đang bay — khoá cả cụm để tránh bấm thêm lần nữa; phím tắt ngưng theo, khác với việc ẩn thẻ đi (người dùng vẫn thấy lựa chọn tồn tại, chỉ là chưa bấm được)." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Khoá cả cụm</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái khi một lượt gửi đang bay: mọi ô mờ đi và ngưng nhận cả chuột lẫn phím, người dùng vẫn thấy các lựa chọn còn đó nhưng chưa bấm được cái nào.
                </Typography>
            </div>
            <GroupPressableCard
                ariaLabel="Các trang cài đặt"
                columns={{ base: 1, sm: 2 }}
                items={settingsItems.map((item) => ({ ...item, isDisabled: true }))}
            />
        </div>
    ),
}

/** Dùng khi thiếu thẻ đầu nhưng thẻ còn lại vẫn phải nằm đúng cột phải (pager không có bài trước): ghim bằng `@sm:col-start-2` — CÙNG trục container mà lưới chia cột, KHÔNG `col-start-2` trần (ở bước 1 cột nó đẻ một cột ngầm co theo nội dung, bóp thẻ còn ~30px) và cũng KHÔNG `sm:` viewport (trượt trục: slot hẹp trong cửa sổ rộng vẫn nổ, slot rộng trong cửa sổ hẹp lại không). Thu cửa sổ để thấy thẻ vẫn full-width khi lưới về 1 cột. */
export const LonePagerCardPinnedRight: Story = {
    parameters: { usage: "Dùng khi thiếu thẻ đầu nhưng thẻ còn lại vẫn phải nằm đúng cột phải (pager không có bài trước): ghim bằng `@sm:col-start-2` — CÙNG trục container mà lưới chia cột, KHÔNG `col-start-2` trần (ở bước 1 cột nó đẻ một cột ngầm co theo nội dung, bóp thẻ còn ~30px) và cũng KHÔNG `sm:` viewport (trượt trục: slot hẹp trong cửa sổ rộng vẫn nổ, slot rộng trong cửa sổ hẹp lại không). Thu cửa sổ để thấy thẻ vẫn full-width khi lưới về 1 cột." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Một thẻ ghim cột phải</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái pager khi thiếu thẻ trước: chỉ còn một thẻ nhưng nó phải ở lại đúng cột phải như lúc đủ đôi, không nhảy về cột trái.
                </Typography>
            </div>
            <GroupPressableCard
                ariaLabel="Chuyển nội dung trước hoặc tiếp"
                columns={{ base: 1, sm: 2 }}
                items={[
                    {
                        key: "next",
                        href: "#",
                        className: "@sm:col-start-2",
                        content: (
                            <div className="flex items-center justify-end gap-2">
                                <Typography type="body-sm" weight="medium">
                                    Nội dung tiếp
                                </Typography>
                                <CaretRightIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
