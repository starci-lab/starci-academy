import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card, CardContent, Link, Typography } from "@heroui/react"
import { PencilIcon } from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Gallery, Variant } from "../../../../story-kit"
import { SampleBody } from "./components"

/**
 * The StarCi section card (UI 2.0): title `Label` sits OUTSIDE, above the card,
 * while `Card` holds only content. See `src/components/blocks/cards/LabeledCard/index.tsx`.
 */
const meta: Meta<typeof LabeledCard> = {
    title: "Blocks/Cards/LabeledCard",
    component: LabeledCard,
}
export default meta
type Story = StoryObj<typeof LabeledCard>

/**
 * Toàn bộ ma trận trạng thái của LabeledCard: slot phải trống (mặc định), có
 * labelEnd, có onSeeMore, có action, có description dưới card, surface-in-surface
 * (lồng trong panel cha), và danh sách chia nhóm bằng subtleLabel. Dùng để tra khi
 * nào chọn slot nào cho phần bên phải label, và khi nào cần frameless/subtleLabel
 * để tránh lồng surface-trong-surface.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định (slot phải trống)"
                hint={"Dùng cho MỌI block có tiêu đề — đây là block mặc định, kể cả khi label chỉ là một eyebrow nhỏ (\"Hôm nay\", \"7 ngày qua\"): đừng tự lấy Card trơn rồi đặt Typography lên trên. Label nằm NGOÀI card, card chỉ chứa nội dung. Mỗi số liệu khác Ý NGHĨA là một LabeledCard riêng — đừng nhồi 2-3 thứ khác ý nghĩa vào 1 card; ngược lại một số liệu đơn lẻ thì không cần card riêng, gộp các số cùng ý nghĩa lại. Block không có tiêu đề → dùng Card trơn. Ngoại lệ hẹp: block trong RAIL/PANEL mà list chỉ vài dòng → LabeledList (label + list, không khung card)."}
            >
                <LabeledCard label="My courses">
                    <SampleBody />
                </LabeledCard>
            </Variant>
            <Variant
                label="Có labelEnd"
                hint="Gắn một đơn vị/chú thích ngắn ngay cạnh label (VND, đơn vị đo, trạng thái tóm tắt). Slot phải mang tag MUTE, không bấm được — ưu tiên THẤP NHẤT trong 3 slot cạnh label: truyền onSeeMore hoặc action cùng lúc thì labelEnd không còn render."
            >
                <LabeledCard label="Tuition remaining" labelEnd="VND">
                    <SampleBody />
                </LabeledCard>
            </Variant>
            <Variant
                label="Có onSeeMore"
                hint={"Card chỉ là bản RÚT GỌN của một danh sách dài hơn và cần đường dẫn sang trang đầy đủ — onSeeMore gắn đường dẫn đó ngay cạnh label, không chiếm chỗ trong thân card. Đừng gắn khi card đã hiện đủ hết dữ liệu, vì \"xem thêm\" mà không còn gì để xem là lời hứa suông. Đổi seeMoreLabel khi \"Xem thêm\" không hợp ngữ cảnh (ví dụ \"Xem tất cả\"). Cần một HÀNH ĐỘNG QUẢN LÝ (thêm/sửa) thay vì một liên kết đi → dùng action."}
            >
                <LabeledCard label="Featured courses" onSeeMore={() => {}}>
                    <SampleBody />
                </LabeledCard>
            </Variant>
            <Variant
                label="Có action"
                hint={"Block cần một hành động quản lý cạnh label (thêm/sửa/quản lý) thay vì một liên kết \"xem thêm\" sang trang khác. action LUÔN là một Link (không phải Button/Chip đặc) — cùng công thức hover với onSeeMore: no-underline + transition-opacity hover:opacity-60 (không gạch chân khi hover). Icon tuỳ chọn đặt trước/sau text; chỉ CaretRightIcon của onSeeMore mới có hiệu ứng trượt (group-hover:translate-x-1), icon khác thì không cần. action có mặt thì cả labelEnd và onSeeMore đều bị bỏ qua — ưu tiên CAO NHẤT."}
            >
                <LabeledCard
                    label="Manager"
                    action={(
                        <Link className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm text-accent-soft-foreground no-underline transition-opacity hover:opacity-60">
                            <PencilIcon aria-hidden focusable="false" className="size-4" />
                            Add / manage
                        </Link>
                    )}
                >
                    <SampleBody />
                </LabeledCard>
            </Variant>
            <Variant
                label="Có description dưới card"
                hint={"Dùng description cho một chú thích/lời nhắc/trạng thái thuộc về section nhưng nằm DƯỚI card (gap-2), không bao giờ nằm trong surface — ví dụ lời nhắc \"hoàn thành cả 3 để nhận quà\" hoặc nút claim dưới danh sách nhiệm vụ. Giữ nó ngoài card để không bao giờ thành surface-trong-surface; người gọi tự quyết alignment của node này. Ví dụ thật: DailyQuest (\"Nhiệm vụ hôm nay\") — danh sách nhiệm vụ là card, lời nhắc/nút claim là description. Gap label→card vẫn là gap-3, chỉ card→description là gap-2."}
            >
                <LabeledCard
                    label="Today's tasks"
                    frameless
                    description={(
                        <Typography type="body-xs" color="muted">
                            Complete all 3 to claim 20 points.
                        </Typography>
                    )}
                >
                    <SurfaceListCard>
                        <SurfaceListCardItem>
                            <span className="text-sm">Read a lesson</span>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem>
                            <span className="text-sm">Pass a challenge</span>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem>
                            <span className="text-sm">Review flashcards</span>
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                </LabeledCard>
            </Variant>
            <Variant
                label="Surface-in-surface (lồng trong panel cha)"
                hint={"Một list surface LỒNG bên trong một PARENT surface đang hiển thị (thân modal/drawer/panel). Panel cha là một Card THẬT (đừng tự chế div mô phỏng đúng class của Card — Card đã là component sẵn dùng, mặc định p-3 rounded-3xl shadow-surface, đúng lớp da \"surface cấp cao nhất\" cần); bên trong nó là SurfaceListCard bordered — dùng BORDER thay vì shadow vì shadow-surface gần như vô hình khi đặt trên một bg-surface khác. Đây mới là surface-trong-surface THẬT (KHÁC với một list card đứng riêng lẻ như ở biến thể chia nhóm dưới đây). Ví dụ thật: PaymentModal (danh sách cổng thanh toán lồng trong thân modal)."}
            >
                <Card>
                    <CardContent>
                        <LabeledCard label="Payment method" frameless>
                            <SurfaceListCard bordered>
                                <SurfaceListCardItem>
                                    <span className="text-sm">MoMo wallet</span>
                                </SurfaceListCardItem>
                                <SurfaceListCardItem>
                                    <span className="text-sm">VNPay QR</span>
                                </SurfaceListCardItem>
                                <SurfaceListCardItem>
                                    <span className="text-sm">Credit / debit card</span>
                                </SurfaceListCardItem>
                            </SurfaceListCard>
                        </LabeledCard>
                    </CardContent>
                </Card>
            </Variant>
            <Variant
                label="Danh sách chia nhóm bằng subtleLabel"
                hint="Sub-label theo category: cắt MỘT danh sách dài thành các NHÓM. Một LabeledCard frameless (label chính) bọc nhiều cụm LabeledCard subtleLabel frameless + SurfaceListCard — mỗi nhóm có một eyebrow sub-label (text-xs text-muted) nằm ngay trên một LIST CARD độc lập (shadow, KHÔNG bordered — vì nó không lồng trong surface nào, khác với biến thể surface-in-surface phía trên). Khoảng cách giữa các nhóm là gap-3 (cùng một category, không phải hai vùng riêng biệt). Dùng khi một danh sách cần chia mục (Cơ bản / Nâng cao…) thay vì đổ dồn một lượt."
            >
                <LabeledCard label="Lesson list" frameless contentClassName="flex flex-col gap-3">
                    <LabeledCard label="Basic" subtleLabel frameless>
                        <SurfaceListCard>
                            <SurfaceListCardItem>
                                <span className="text-sm">Lesson 1: Intro to React Hooks</span>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <span className="text-sm">Lesson 2: useState and useEffect</span>
                            </SurfaceListCardItem>
                        </SurfaceListCard>
                    </LabeledCard>
                    <LabeledCard label="Advanced" subtleLabel frameless>
                        <SurfaceListCard>
                            <SurfaceListCardItem>
                                <span className="text-sm">Lesson 3: Custom Hooks</span>
                            </SurfaceListCardItem>
                            <SurfaceListCardItem>
                                <span className="text-sm">Lesson 4: useReducer &amp; Context</span>
                            </SurfaceListCardItem>
                        </SurfaceListCard>
                    </LabeledCard>
                </LabeledCard>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của LabeledCard: slot phải trống (mặc định), có labelEnd, có " +
            "onSeeMore, có action, có description dưới card, surface-in-surface (lồng trong panel cha), " +
            "và danh sách chia nhóm bằng subtleLabel. Dùng để tra khi nào chọn slot nào cho phần bên phải " +
            "label (labelEnd < onSeeMore < action theo độ ưu tiên), và khi nào cần frameless/subtleLabel " +
            "để tránh lồng surface-trong-surface.",
    },
}
