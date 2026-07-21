import type { Meta, StoryObj } from "@storybook/nextjs"

import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ProgressMeter> = {
    title: "Primitives/DataDisplay/ProgressMeter",
    component: ProgressMeter,
}

export default meta

type Story = StoryObj<typeof ProgressMeter>

/**
 * Toàn bộ ma trận trạng thái của ProgressMeter: bare bar, tổ hợp label/số, các
 * tone theo Ý NGHĨA của giá trị, marker `target` so với mục tiêu, và đơn vị đếm
 * khác %. Dùng để tra khi nào chọn label/showValue nào, tone nào, và khi nào
 * cần target marker.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Bare bar"
                hint="Dùng khi chỉ cần thanh progress trần, không nhãn không số — ví dụ nhúng gọn trong dòng danh sách."
            >
                <div className="w-80">
                    <ProgressMeter value={45} />
                </div>
            </Variant>
            <Variant
                label="Chỉ nhãn"
                hint="Dùng khi người dùng cần biết progress là gì, nhưng phần trăm không quan trọng."
            >
                <div className="w-80">
                    <ProgressMeter value={62} label="Course progress" />
                </div>
            </Variant>
            <Variant
                label="Nhãn và số"
                hint="Dùng khi cần cả tên progress và phần trăm còn lại, ví dụ trang chi tiết khoá học."
            >
                <div className="w-80">
                    <ProgressMeter value={78} label="Module completion" showValue />
                </div>
            </Variant>
            <Variant
                label="Chỉ số"
                hint="Dùng khi ngữ cảnh xung quanh đã rõ progress là gì, chỉ cần thêm phần trăm."
            >
                <div className="w-80">
                    <ProgressMeter value={33} showValue />
                </div>
            </Variant>
            <Variant
                label="Tone accent"
                hint="Mặc định, dùng khi số liệu chỉ là progress trung tính, không mang nghĩa tốt/xấu."
            >
                <div className="w-80">
                    <ProgressMeter value={45} label="Default" showValue color="accent" />
                </div>
            </Variant>
            <Variant
                label="Tone success"
                hint="Dùng khi số liệu báo hiệu đạt/vượt ngưỡng, ví dụ hoàn thành 100% hoặc điểm vượt chuẩn."
            >
                <div className="w-80">
                    <ProgressMeter value={100} label="Quiz" showValue color="success" />
                </div>
            </Variant>
            <Variant
                label="Tone warning"
                hint="Dùng khi số liệu cảnh báo deadline gần tới, ví dụ thời gian còn lại sắp hết."
            >
                <div className="w-80">
                    <ProgressMeter value={55} label="Time remaining" showValue color="warning" />
                </div>
            </Variant>
            <Variant
                label="Tone danger"
                hint="Dùng khi số liệu báo hiệu mức nguy hiểm, ví dụ điểm thấp dưới ngưỡng đạt."
            >
                <div className="w-80">
                    <ProgressMeter value={12} label="Current score" showValue color="danger" />
                </div>
            </Variant>
            <Variant
                label="Có target — dưới mục tiêu (danger)"
                hint="Fill còn xa mục tiêu 85%. Marker là pill accent tràn ra khỏi thanh mỏng; meter tự chừa khoảng trên (mt-5) để nhãn '85%' nổi không đè chữ phía trên — không cần padding thủ công tại nơi gọi."
            >
                <div className="w-80">
                    <ProgressMeter value={39} color="danger" target={85} targetLabel="85%" />
                </div>
            </Variant>
            <Variant
                label="Có target — đạt/vượt mục tiêu (success)"
                hint="Fill đã vượt qua marker mục tiêu — giá trị đọc là success."
            >
                <div className="w-80">
                    <ProgressMeter value={88} color="success" target={85} targetLabel="85%" />
                </div>
            </Variant>
            <Variant
                label="Có target — không nhãn"
                hint="Truyền target mà không kèm targetLabel để chỉ có notch pill, không caption nổi — không chừa khoảng trên."
            >
                <div className="w-80">
                    <ProgressMeter value={55} color="warning" target={70} />
                </div>
            </Variant>
            <Variant
                label="Đơn vị đếm khác %"
                hint="Dùng khi đơn vị đếm không phải %, ví dụ đếm số bài học/câu hỏi hoàn thành trên tổng (7/10) thay vì phần trăm."
            >
                <div className="w-80">
                    <ProgressMeter value={7} max={10} label="7 / 10 lessons" showValue />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của ProgressMeter: bare bar (không label/số); tổ hợp " +
            "label/showValue theo mức chi tiết cần cho người dùng; tone theo Ý NGHĨA của giá trị " +
            "(accent trung tính, success đạt/vượt, warning deadline gần, danger dưới ngưỡng) — " +
            "không phải màu chọn tuỳ ý; marker target (pill accent w-1 h-5 tràn thanh, targetLabel " +
            "nổi phía trên với mt-5 tự chừa chỗ) để đọc fill so với một mục tiêu; và đơn vị đếm khác " +
            "% khi tổng là số nguyên (7/10 bài học) thay vì phần trăm.",
    },
}
