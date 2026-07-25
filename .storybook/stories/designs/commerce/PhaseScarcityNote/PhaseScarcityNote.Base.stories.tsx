import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PhaseScarcityNote,
    PricingPhase,
} from "@sb-components/designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `PhaseScarcityNote.Base`: dòng khan-hiếm THẬT của một phase giá.
 *
 * MỌI con số đến từ `coursePricePreview` của backend. Component này TUYỆT ĐỐI không
 * bịa đồng hồ đếm ngược hay số ghế — khan hiếm giả là dark pattern bị cấm. Hệ quả:
 * phase không có trần ghế thì nó **im lặng**.
 *
 * 📐 **LEAF theo CẤU TRÚC** (§14d.2): ba leaf dưới đây là leaf THẬT vì mỗi cái làm
 * **mất node**. Còn đổi phase (Tiên phong/Sớm/Tiêu chuẩn) chỉ đổi chữ ⇒ STATE, render
 * chung trong leaf đủ-hai-vế.
 */
const meta: Meta<typeof PhaseScarcityNote.Base> = {
    title: "Designs/Commerce/PhaseScarcityNote.Base",
    component: PhaseScarcityNote.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    WarningCircleIcon: { tier: "atom", role: "dấu cảnh báo — mở đầu dòng" },
    SeatCountLine: { tier: "atom", role: "vế BẮT BUỘC: còn N suất giá {phase}" },
    Separator: { tier: "atom", role: "dấu · ngăn hai vế" },
    PriceRiseClause: { tier: "atom", role: "vế TUỲ CHỌN: giá tăng lên bao nhiêu sau đó" },
}

const leafShell = (leaf: string, node: ReactNode, note?: ReactNode) => (
    <div className="p-8">
        <BlockAnatomy
            name="PhaseScarcityNote.Base"
            tier="design"
            leaf={leaf}
            parts={[]}
            annotate={ANNOTATE}
            note={note}
        >
            {node}
        </BlockAnatomy>
    </div>
)

/** LEAF — đủ hai vế. Ba phase render chung: đổi phase chỉ đổi CHỮ, không đổi node. */
export const FullClause: Story = {
    render: () =>
        leafShell(
            "Đủ hai vế",
            <div className="flex flex-col gap-3">
                <PhaseScarcityNote.Base
                    showAnatomy
                    currentPhase={PricingPhase.EarlyBird}
                    seatsRemaining={14}
                    nextPhasePriceVnd={2_490_000}
                />
                <PhaseScarcityNote.Base
                    currentPhase={PricingPhase.Pioneer}
                    seatsRemaining={3}
                    nextPhasePriceVnd={1_990_000}
                />
            </div>,
            "Ba phase khác nhãn nhưng cùng cây DOM ⇒ state, không phải leaf.",
        ),
}

/** LEAF — phase cuối, không có mức giá kế tiếp ⇒ **mất** `Separator` + `PriceRiseClause`. */
export const NoPriceRise: Story = {
    render: () =>
        leafShell(
            "Không có mức tăng",
            <PhaseScarcityNote.Base
                showAnatomy
                currentPhase={PricingPhase.Regular}
                seatsRemaining={5}
                nextPhasePriceVnd={null}
            />,
            "Ít hơn leaf trên HAI node — đây mới là lý do tách leaf.",
        ),
}

/**
 * LEAF — không giới hạn ghế ⇒ **render NULL**. Không có trần ghế thì không có cớ
 * "giá tăng khi nào" trung thực, nên im lặng thay vì bịa.
 */
export const Silent: Story = {
    render: () =>
        leafShell(
            "Không giới hạn ghế",
            <PhaseScarcityNote.Base
                showAnatomy
                currentPhase={PricingPhase.Regular}
                seatsRemaining={null}
                nextPhasePriceVnd={2_990_000}
            />,
            "Không part nào — im lặng là hợp đồng, không phải lỗi render.",
        ),
}
