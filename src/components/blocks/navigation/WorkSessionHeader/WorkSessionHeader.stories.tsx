import type { Meta, StoryObj } from "@storybook/nextjs"
import { WorkSessionHeader } from "./index"

const meta: Meta<typeof WorkSessionHeader> = {
    title: "Blocks/Navigation/WorkSessionHeader",
    component: WorkSessionHeader,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof WorkSessionHeader>

/** Dùng cho một vòng mock-interview: có avatar người phỏng vấn, các bước đã chấm hiện xanh, bước đang xem hiện hồng, và nút "Kết thúc" để chấm sớm. */
export const Default: Story = {
    parameters: { usage: "Dùng cho một vòng mock-interview: có avatar người phỏng vấn, các bước đã chấm hiện xanh, bước đang xem hiện hồng, và nút \"Kết thúc\" để chấm sớm." },
    render: () => (
        <div className="w-[720px]">
            <WorkSessionHeader
                backLabel="Rời phỏng vấn"
                onBack={() => {}}
                identity={{
                    avatarSrc: "https://i.pravatar.cc/64?img=12",
                    name: "Chị Lan Anh",
                }}
                counter="Câu 3/6"
                current={2}
                total={6}
                doneSet={[0, 1]}
                onSegmentClick={() => {}}
                onFinish={() => {}}
                finishLabel="Kết thúc"
            />
        </div>
    ),
}

/** Dùng khi một shell dùng chung nhiều chế độ làm việc (ví dụ "Hỏi nhanh" và "Học thẻ") để phân biệt rõ đang ở chế độ nào ngay sau nút quay lại. */
export const WithModeTitle: Story = {
    parameters: { usage: "Dùng khi một shell dùng chung nhiều chế độ làm việc (ví dụ \"Hỏi nhanh\" và \"Học thẻ\") để phân biệt rõ đang ở chế độ nào ngay sau nút quay lại." },
    render: () => (
        <div className="w-[720px]">
            <WorkSessionHeader
                backLabel="Thoát"
                onBack={() => {}}
                title="Học thẻ"
                identity={{ name: "Bộ thẻ React Fundamentals" }}
                counter="2/4 · Thiết kế"
                current={1}
                total={4}
                doneSet={[0]}
            />
        </div>
    ),
}

/** Dùng khi cần gắn thêm tag cấp độ/chủ đề ngay trên thanh và một bộ đếm giờ ghim bên phải, cho phiên có ràng buộc thời gian. */
export const WithMetaAndTimer: Story = {
    parameters: { usage: "Dùng khi cần gắn thêm tag cấp độ/chủ đề ngay trên thanh và một bộ đếm giờ ghim bên phải, cho phiên có ràng buộc thời gian." },
    render: () => (
        <div className="w-[720px]">
            <WorkSessionHeader
                backLabel="Rời phỏng vấn"
                onBack={() => {}}
                identity={{
                    avatarSrc: "https://i.pravatar.cc/64?img=5",
                    name: "Anh Minh Đức",
                }}
                counter="Câu 4/8"
                current={3}
                total={8}
                doneSet={[0, 1, 2]}
                meta={
                    <>
                        <span className="rounded-full bg-default px-2 py-1 text-xs">Senior</span>
                        <span className="rounded-full bg-default px-2 py-1 text-xs">System Design</span>
                    </>
                }
                rightSlot={<span className="text-sm font-medium tabular-nums">04:12</span>}
                onFinish={() => {}}
                finishLabel="Kết thúc"
            />
        </div>
    ),
}

/** Dùng cho một phiên chỉ-đọc, tuần tự (không free-nav, không danh sách đã chấm rời) — thanh tiến trình rơi về mô hình tuyến tính cũ (đã qua vị trí hiện tại là xong). */
export const LinearReadOnlyProgress: Story = {
    parameters: { usage: "Dùng cho một phiên chỉ-đọc, tuần tự (không free-nav, không danh sách đã chấm rời) — thanh tiến trình rơi về mô hình tuyến tính cũ (đã qua vị trí hiện tại là xong)." },
    render: () => (
        <div className="w-[720px]">
            <WorkSessionHeader
                backLabel="Thoát"
                onBack={() => {}}
                counter="Bước 5/5"
                current={4}
                total={5}
            />
        </div>
    ),
}
