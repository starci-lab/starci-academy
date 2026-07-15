import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Label, Typography } from "@heroui/react"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { CheckListCard, CheckListItem } from "./index"

const meta: Meta<typeof CheckListCard> = {
    title: "Core/Card/CheckListCard",
    component: CheckListCard,
}
export default meta
type Story = StoryObj<typeof CheckListCard>

/**
 * Dùng cho danh sách "brief có/không tick" — giá trị đạt được, đầu ra, mục tiêu học. Icon ở đây
 * CỐ ĐỊNH là tick thành công: đó vừa là điểm mạnh (không phải nghĩ) vừa là giới hạn. Cần icon
 * khác nhau từng dòng, hoặc icon mang màu theo trạng thái → dùng SurfaceListCardItem (free-form).
 * Danh sách mà mỗi hàng bấm được để đi đâu đó → SurfaceListCard.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Dùng cho danh sách \"brief có/không tick\" — giá trị đạt được, đầu ra, mục tiêu học. Icon ở đây CỐ " +
            "ĐỊNH là tick thành công: đó vừa là điểm mạnh (không phải nghĩ) vừa là giới hạn. Cần icon khác nhau " +
            "từng dòng, hoặc icon mang màu theo trạng thái → dùng SurfaceListCardItem (free-form). Danh sách mà " +
            "mỗi hàng bấm được để đi đâu đó → SurfaceListCard.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có tick</Label>
                <Typography type="body-sm" color="muted">
                    Mỗi dòng là một thứ người học ĐẠT ĐƯỢC — tick khẳng định nó đã thành. Đây là mặc định của block.
                </Typography>
            </div>
            <CheckListCard>
                <CheckListItem>Xây dựng được API RESTful hoàn chỉnh</CheckListItem>
                <CheckListItem>Triển khai xác thực JWT an toàn</CheckListItem>
                <CheckListItem>Tối ưu truy vấn cơ sở dữ liệu</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/** Vẫn là danh sách brief, nhưng mỗi dòng là ĐIỀU KIỆN chứ không phải thành tích — tắt tick vì tick đọc ra là "đã xong", mà điều kiện tiên quyết thì chưa ai xác nhận người học có hay không. */
export const WithoutCheck: Story = {
    parameters: { usage: "Vẫn là danh sách brief, nhưng mỗi dòng là ĐIỀU KIỆN chứ không phải thành tích — tắt tick vì tick đọc ra là \"đã xong\", mà điều kiện tiên quyết thì chưa ai xác nhận người học có hay không." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không tick</Label>
                <Typography type="body-sm" color="muted">
                    Tắt showCheck khi mỗi dòng là YÊU CẦU đầu vào, chưa ai xác nhận người học đạt hay chưa — để tick ở đây là khẳng định thay họ.
                </Typography>
            </div>
            <CheckListCard>
                <CheckListItem showCheck={false}>Đã hoàn thành khóa lập trình cơ bản</CheckListItem>
                <CheckListItem showCheck={false}>Có máy tính cài sẵn Node.js 20+</CheckListItem>
                <CheckListItem showCheck={false}>Hiểu cơ bản về Git</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/** Dòng dài KHÔNG bị cắt — nó xuống hàng, và tick giữ nguyên ở đầu dòng đầu chứ không trôi xuống giữa khối chữ. Nên đừng tự cắt ngắn nội dung ở call-site để "cho vừa": block chịu được, và một đầu ra bị cắt cụt thì mất nghĩa. */
export const LongText: Story = {
    parameters: { usage: "Dòng dài KHÔNG bị cắt — nó xuống hàng, và tick giữ nguyên ở đầu dòng đầu chứ không trôi xuống giữa khối chữ. Nên đừng tự cắt ngắn nội dung ở call-site để \"cho vừa\": block chịu được, và một đầu ra bị cắt cụt thì mất nghĩa." },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chữ dài</Label>
                <Typography type="body-sm" color="muted">
                    Khung hẹp và dòng dài hơn một hàng — kiểm tick có neo đúng đầu dòng đầu và lề chữ có thẳng khi wrap.
                </Typography>
            </div>
            <CheckListCard>
                <CheckListItem>
                    Thiết kế và triển khai hệ thống microservices có khả năng mở rộng cao, xử lý hàng triệu request mỗi ngày với độ trễ thấp
                </CheckListItem>
                <CheckListItem>Viết unit test đạt độ phủ trên 80%</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/**
 * Surface-in-surface: list lồng trong surface cha (thân modal/panel) → `bordered`
 * (viền XOR shadow). Pair `LabeledCard frameless` — label ngoài, không card-in-card.
 */
export const SurfaceInSurface: Story = {
    parameters: {
        usage: "Khi CheckListCard nằm trong surface CHA nhìn thấy được (thân modal/drawer/panel): `LabeledCard frameless` + `CheckListCard bordered`. `bordered` = VIỀN thay shadow (shadow vô hình trên bg-surface). Đứng top-level trên page → bỏ `bordered`. Không hack `shadow-none` / `border` qua className.",
    },
    render: () => (
        <div className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Lồng trong surface cha</Label>
                <Typography type="body-sm" color="muted">
                    Card ngoài = thân modal. Inner checklist dùng bordered.
                </Typography>
            </div>
            <Card>
                <CardContent>
                    <LabeledCard label="Bao gồm" frameless>
                        <CheckListCard bordered>
                            <CheckListItem>Toàn bộ lộ trình</CheckListItem>
                            <CheckListItem>Chấm bài AI</CheckListItem>
                            <CheckListItem>Cộng đồng khoá</CheckListItem>
                        </CheckListCard>
                    </LabeledCard>
                </CardContent>
            </Card>
        </div>
    ),
}