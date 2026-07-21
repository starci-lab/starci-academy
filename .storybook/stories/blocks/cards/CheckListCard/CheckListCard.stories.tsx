import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent } from "@heroui/react"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CheckListCard> = {
    title: "Blocks/Cards/CheckListCard",
    component: CheckListCard,
}
export default meta
type Story = StoryObj<typeof CheckListCard>

/**
 * Toàn bộ ma trận trạng thái của CheckListCard: có tick (mặc định), không tick
 * (điều kiện chưa được xác nhận), dòng dài không bị cắt, và trường hợp lồng
 * trong một surface cha (modal/panel body). Dùng để tra khi nào bật/tắt tick
 * và khi nào cần `bordered`.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có tick"
                hint={"Mỗi dòng là điều gì đó người học ĐẠT ĐƯỢC — tick xác nhận đã hoàn thành. Đây là mặc định của block. Dùng cho danh sách kiểu \"tóm tắt có/không tick\" — giá trị đạt được, kết quả đầu ra, mục tiêu học. Icon ở đây CỐ ĐỊNH là tick thành công: đó vừa là điểm mạnh (không cần suy nghĩ) vừa là giới hạn. Cần icon khác nhau mỗi dòng, hoặc icon đổi màu theo state → dùng SurfaceListCardItem (tự do). Danh sách mà mỗi dòng bấm được để đi đến đâu → dùng SurfaceListCard."}
            >
                <div className="w-80">
                    <CheckListCard>
                        <CheckListItem>Build a complete RESTful API</CheckListItem>
                        <CheckListItem>Implement secure JWT authentication</CheckListItem>
                        <CheckListItem>Optimize database queries</CheckListItem>
                    </CheckListCard>
                </div>
            </Variant>
            <Variant
                label="Không tick"
                hint={"Vẫn là danh sách tóm tắt, nhưng mỗi dòng là một ĐIỀU KIỆN chứ không phải một thành tựu — tắt tick vì tick đọc như là \"đã xong\", trong khi chưa ai xác nhận người học đáp ứng điều kiện đó. Tắt showCheck khi mỗi dòng là một YÊU CẦU đầu vào chưa được ai xác nhận — tick ở đây sẽ khẳng định thay cho họ."}
            >
                <div className="w-80">
                    <CheckListCard>
                        <CheckListItem showCheck={false}>Completed a basic programming course</CheckListItem>
                        <CheckListItem showCheck={false}>A machine with Node.js 20+ installed</CheckListItem>
                        <CheckListItem showCheck={false}>A basic understanding of Git</CheckListItem>
                    </CheckListCard>
                </div>
            </Variant>
            <Variant
                label="Dòng dài"
                hint={"Một dòng dài KHÔNG bị cắt — nó xuống dòng, và tick giữ nguyên vị trí ở đầu dòng đầu tiên thay vì trôi vào giữa khối chữ. Nên đừng rút ngắn nội dung ở nơi gọi chỉ để \"vừa khung\": block xử lý được, và một outcome bị cắt sẽ mất nghĩa."}
            >
                <div className="w-80">
                    <CheckListCard>
                        <CheckListItem>
                            Design and implement a highly scalable microservices system handling millions of requests per day with low latency
                        </CheckListItem>
                        <CheckListItem>Write unit tests with over 80% coverage</CheckListItem>
                    </CheckListCard>
                </div>
            </Variant>
            <Variant
                label="Lồng trong surface cha"
                hint="Khi CheckListCard nằm trong một PARENT surface hiển thị (modal/drawer/panel body): dùng LabeledCard frameless + CheckListCard bordered. bordered = viền thay cho shadow (shadow vô hình trên bg-surface). Đứng độc lập ở đầu trang → bỏ bordered. Đừng chế shadow-none / border qua className."
            >
                <div className="max-w-sm">
                    <Card>
                        <CardContent>
                            <LabeledCard label="Included" frameless>
                                <CheckListCard bordered>
                                    <CheckListItem>The entire learning path</CheckListItem>
                                    <CheckListItem>AI grading</CheckListItem>
                                    <CheckListItem>Course community</CheckListItem>
                                </CheckListCard>
                            </LabeledCard>
                        </CardContent>
                    </Card>
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của CheckListCard: có tick (mặc định), không tick (điều kiện chưa " +
            "được xác nhận), dòng dài không bị cắt, và trường hợp lồng trong một surface cha (modal/panel " +
            "body). Dùng để tra khi nào bật/tắt tick và khi nào cần `bordered`.",
    },
}

/**
 * Mỗi dòng là một điều gì đó người học ĐẠT ĐƯỢC — tick thành công cố định xác nhận
 * đã hoàn thành. Đây là công dụng chính của block: danh sách "tóm tắt có/không tick"
 * cho giá trị đạt được, kết quả đầu ra, mục tiêu học.
 */
export const DataChecked: Story = {
    render: () => (
        <div className="w-80">
            <CheckListCard>
                <CheckListItem>Build a complete RESTful API</CheckListItem>
                <CheckListItem>Implement secure JWT authentication</CheckListItem>
                <CheckListItem>Optimize database queries</CheckListItem>
            </CheckListCard>
        </div>
    ),
    parameters: {
        usage:
            "Mỗi dòng là một điều gì đó người học ĐẠT ĐƯỢC — tick thành công cố định xác nhận đã hoàn " +
            "thành. Đây là công dụng chính của block.",
    },
}

/**
 * `showCheck={false}` từng dòng — dùng khi mỗi dòng là một ĐIỀU KIỆN (yêu cầu đầu
 * vào, tiên quyết) chứ không phải một thành tựu. Tick sẽ khẳng định thay cho người
 * học điều họ chưa được ai xác nhận, nên tắt tick trong trường hợp này.
 */
export const DataNoCheck: Story = {
    render: () => (
        <div className="w-80">
            <CheckListCard>
                <CheckListItem showCheck={false}>Completed a basic programming course</CheckListItem>
                <CheckListItem showCheck={false}>A machine with Node.js 20+ installed</CheckListItem>
                <CheckListItem showCheck={false}>A basic understanding of Git</CheckListItem>
            </CheckListCard>
        </div>
    ),
    parameters: {
        usage:
            "showCheck={false} từng dòng — mỗi dòng là một ĐIỀU KIỆN (yêu cầu đầu vào, tiên quyết) chứ " +
            "không phải một thành tựu, nên không mang tick.",
    },
}

/**
 * Một dòng dài KHÔNG bị cắt — nó xuống dòng, và tick giữ nguyên vị trí ở đầu dòng
 * đầu tiên thay vì trôi vào giữa khối chữ. Chứng minh block xử lý được nhiều dòng
 * mà không cần rút ngắn nội dung ở nơi gọi.
 */
export const OverflowLongrow: Story = {
    render: () => (
        <div className="w-80">
            <CheckListCard>
                <CheckListItem>
                    Design and implement a highly scalable microservices system handling millions of requests per day with low latency
                </CheckListItem>
                <CheckListItem>Write unit tests with over 80% coverage</CheckListItem>
            </CheckListCard>
        </div>
    ),
    parameters: {
        usage:
            "Một dòng dài KHÔNG bị cắt — nó xuống dòng, tick giữ nguyên vị trí ở đầu dòng đầu tiên thay " +
            "vì trôi vào giữa khối chữ.",
    },
}

/**
 * `bordered` render viền thay cho shadow-surface — dùng khi CheckListCard lồng
 * trong một surface cha (modal/drawer/panel body), nơi shadow vô hình trên
 * bg-surface. Ghép với LabeledCard frameless cho nhãn mục.
 */
export const Bordered: Story = {
    render: () => (
        <div className="max-w-sm">
            <Card>
                <CardContent>
                    <LabeledCard label="Included" frameless>
                        <CheckListCard bordered>
                            <CheckListItem>The entire learning path</CheckListItem>
                            <CheckListItem>AI grading</CheckListItem>
                            <CheckListItem>Course community</CheckListItem>
                        </CheckListCard>
                    </LabeledCard>
                </CardContent>
            </Card>
        </div>
    ),
    parameters: {
        usage:
            "bordered render viền thay cho shadow-surface — dùng khi CheckListCard lồng trong một surface " +
            "cha (modal/drawer/panel body), nơi shadow vô hình trên bg-surface.",
    },
}
