import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@heroui/react"
import { WorkSessionHeader } from "@/components/blocks/navigation/WorkSessionHeader"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof WorkSessionHeader> = {
    title: "Blocks/Navigation/WorkSessionHeader",
    component: WorkSessionHeader,
}
export default meta
type Story = StoryObj<typeof WorkSessionHeader>

/**
 * Bấm bất kỳ segment nào để nhảy tới bước đó, vừa cập nhật `current` vừa thêm
 * bước đó vào `doneSet` — mô phỏng free-nav thật do caller tự giữ state, đúng
 * cách WorkSessionHeader vốn không tự lưu tiến trình.
 */
const FreeNavigationHeader = () => {
    const [current, setCurrent] = useState(2)
    const [doneSet, setDoneSet] = useState<ReadonlyArray<number>>([0, 1, 4])
    return (
        <WorkSessionHeader
            backLabel="Rời phỏng vấn"
            onBack={() => {}}
            title="Phỏng vấn thử"
            counter={`Câu ${current + 1}/6`}
            current={current}
            total={6}
            doneSet={doneSet}
            onSegmentClick={(position) => {
                setCurrent(position)
                setDoneSet((prev) => (prev.includes(position) ? prev : [...prev, position]))
            }}
            onFinish={() => {}}
            finishLabel="Kết thúc"
        />
    )
}

/**
 * Toàn bộ trạng thái của WorkSessionHeader: có/không title phân biệt work-mode,
 * identity có/không avatar, thanh tiến trình theo doneSet (chấm ngoài thứ tự)
 * và fallback tuyến tính khi thiếu doneSet, nút Kết thúc, chip meta, rightSlot,
 * và hàng đầy tràn cần ScrollShadow.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng để đối chiếu mọi trạng thái của WorkSessionHeader trước khi ráp vào một work-surface mới (vòng phỏng vấn thử, phiên học thẻ) — chọn đúng tổ hợp title/identity/doneSet/rightSlot theo dữ liệu phiên thật, đừng tự dựng lại HUD row.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Một work-mode — không cần title"
                hint="Dùng khi caller chỉ có một chế độ duy nhất (ví dụ Mock Interview) — bỏ title vì không có gì để phân biệt."
            >
                <WorkSessionHeader
                    backLabel="Rời phỏng vấn"
                    onBack={() => {}}
                    counter="Câu 3/6"
                    current={2}
                    total={6}
                />
            </Variant>

            <Variant
                label="Nhiều work-mode — có title phân biệt"
                hint="Dùng khi một shell dùng chung cho nhiều chế độ (Hỏi nhanh/Học thẻ) — title không ẩn trên mobile vì cần thiết hơn identity."
            >
                <WorkSessionHeader
                    backLabel="Thoát"
                    onBack={() => {}}
                    title="Hỏi nhanh"
                    counter="Câu 2/8"
                    current={1}
                    total={8}
                />
            </Variant>

            <Variant
                label="Identity có avatar — persona người phỏng vấn"
                hint="Dùng cho vòng Mock Interview với một nhân vật AI cụ thể — avatar và tên hiện sau back link."
            >
                <WorkSessionHeader
                    backLabel="Rời phỏng vấn"
                    onBack={() => {}}
                    identity={{
                        avatarSrc: "https://picsum.photos/seed/interviewer-mai/56/56",
                        name: "Chị Mai — Senior Backend"
                    }}
                    counter="Câu 4/10"
                    current={3}
                    total={10}
                />
            </Variant>

            <Variant
                label="Identity chỉ có tên — không avatar"
                hint="Dùng khi identity là tên khoá/bộ thẻ chứ không phải một người, ví dụ phiên học flashcard."
            >
                <WorkSessionHeader
                    backLabel="Thoát"
                    onBack={() => {}}
                    identity={{ name: "Bộ thẻ Node.js Core" }}
                    counter="Thẻ 5/20"
                    current={4}
                    total={20}
                />
            </Variant>

            <Variant
                label="doneSet — chấm ngoài thứ tự vẫn xanh"
                hint="Free-nav: bước đang xem (viền hồng) đã được chấm từ trước nên vẫn giữ màu xanh — accent (đang xem) và success (đã chấm) là 2 tín hiệu độc lập, không cái nào đè cái kia."
            >
                <WorkSessionHeader
                    backLabel="Rời phỏng vấn"
                    onBack={() => {}}
                    counter="Câu 4/8"
                    current={3}
                    total={8}
                    doneSet={[0, 1, 3, 6]}
                />
            </Variant>

            <Variant
                label="Không có doneSet — fallback tuyến tính cũ"
                hint="Dùng cho caller chưa theo dấu từng bước — mọi vị trí trước current tự coi là đã xong theo mô hình tuyến tính cũ."
            >
                <WorkSessionHeader
                    backLabel="Thoát"
                    onBack={() => {}}
                    counter="Thẻ 5/8"
                    current={4}
                    total={8}
                />
            </Variant>

            <Variant
                label="Có nút Kết thúc"
                hint="Dùng khi caller cho phép kết thúc sớm (chấm phần đã làm rồi xem kết quả), khác với back link chỉ để thoát tạm và quay lại sau."
            >
                <WorkSessionHeader
                    backLabel="Thoát"
                    onBack={() => {}}
                    counter="Câu 3/6"
                    current={2}
                    total={6}
                    doneSet={[0, 1]}
                    onFinish={() => {}}
                    finishLabel="Kết thúc"
                />
            </Variant>

            <Variant
                label="Có meta — chip cấp độ và chủ đề"
                hint="Dùng khi cần gắn thêm nhãn cấp độ hoặc chủ đề ngay trên HUD row, thay vì tách thành một dòng riêng bên dưới."
            >
                <WorkSessionHeader
                    backLabel="Rời phỏng vấn"
                    onBack={() => {}}
                    counter="Câu 6/12"
                    current={5}
                    total={12}
                    meta={(
                        <>
                            <Chip size="sm" variant="soft">Senior</Chip>
                            <Chip size="sm" variant="soft">System Design</Chip>
                        </>
                    )}
                />
            </Variant>

            <Variant
                label="Có rightSlot — đồng hồ đếm giờ"
                hint="Dùng khi phiên có giới hạn thời gian — đồng hồ ghim sát mép phải, trước nút Kết thúc nếu có."
            >
                <WorkSessionHeader
                    backLabel="Rời phỏng vấn"
                    onBack={() => {}}
                    counter="Câu 7/10"
                    current={6}
                    total={10}
                    rightSlot={<Chip size="sm" variant="soft">12:45</Chip>}
                    onFinish={() => {}}
                    finishLabel="Kết thúc"
                />
            </Variant>

            <Variant
                label="Hàng đầy — title, identity, meta, rightSlot tràn ScrollShadow"
                hint="Kiểm tra ca xấu nhất: mọi phần cùng xuất hiện, hàng dài hơn bề rộng khả dụng nên ScrollShadow hiện mép mờ báo còn nội dung."
            >
                <WorkSessionHeader
                    backLabel="Rời phỏng vấn"
                    onBack={() => {}}
                    title="Phỏng vấn thử"
                    identity={{
                        avatarSrc: "https://picsum.photos/seed/interviewer-long/56/56",
                        name: "Anh Đức — Staff Engineer, Nền tảng Thanh toán"
                    }}
                    counter="Câu 8/15 · Vòng System Design"
                    current={7}
                    total={15}
                    doneSet={[0, 1, 2, 3, 4, 5, 6]}
                    meta={(
                        <>
                            <Chip size="sm" variant="soft">Senior</Chip>
                            <Chip size="sm" variant="soft">Distributed Systems</Chip>
                        </>
                    )}
                    rightSlot={<Chip size="sm" variant="soft">08:12</Chip>}
                    onFinish={() => {}}
                    finishLabel="Kết thúc"
                />
            </Variant>
        </Gallery>
    )
}

/**
 * Bấm bất kỳ segment nào (trước hoặc sau vị trí đang xem) để nhảy tới đó — mô
 * phỏng free navigation thật: bước vừa nhảy tới lập tức được thêm vào doneSet,
 * còn nếu nhảy lại vào một bước đã chấm thì màu xanh vẫn giữ nguyên, chỉ viền
 * hồng di chuyển theo current.
 */
export const FreeNavigation: Story = {
    parameters: {
        usage: "Dùng để kiểm tra hành vi free-nav thật: mọi segment đều bấm được để nhảy bước, không bị chặn theo thứ tự trước hay sau — xác nhận viền hồng (đang xem) và màu xanh (đã chấm) không đè lên nhau khi nhảy qua nhảy lại."
    },
    render: () => <FreeNavigationHeader />
}
