import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card } from "@heroui/react"

import { StatPair } from "@/components/blocks/stats/StatPair"
import { Gallery, Variant } from "../../../../story-kit"
import { STATS } from "./components"

const meta: Meta<typeof StatPair> = {
    title: "Primitives/DataDisplay/StatPair",
    component: StatPair,
    args: {
        value: "1,204",
        label: "Followers",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/**
 * Toàn bộ cách bố trí StatPair: một cặp đơn lẻ (frameless), dải ngang nhiều
 * cặp trong một card khi bề rộng thoải mái, và lưới 2 cột khi bề rộng hẹp.
 * StatPair không tự có khung — card + spacing luôn do parent quyết định.
 */
export const AllVariants: Story = {
    render: (args) => (
        <Gallery>
            <Variant
                label="Một cặp đơn lẻ"
                hint="Một giá trị lớn (h4) trên một nhãn mờ, căn trái. Block không có khung riêng — luôn đặt trong card của parent."
            >
                <StatPair {...args} />
            </Variant>
            <Variant
                label="Dải ngang (Row)"
                hint="Dùng khi bề rộng thoải mái: nhiều StatPair trên một dòng trong một card, ngăn bằng đường kẻ dọc — dải thống kê hero/hồ sơ. Parent lo card + đường kẻ."
            >
                <Card variant="default" className="w-fit">
                    <div className="flex items-stretch divide-x divide-default">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
                                <StatPair value={stat.value} label={stat.label} />
                            </div>
                        ))}
                    </div>
                </Card>
            </Variant>
            <Variant
                label="Lưới 2 cột (Grid)"
                hint="Dùng khi bề rộng hẹp (sidebar/widget): cùng bộ số liệu, nhưng xếp lưới 2 cột vì không đủ chỗ cho một dòng. Parent lo card + spacing."
            >
                <Card variant="default" className="w-[420px]">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                        {STATS.map((stat) => (
                            <StatPair key={stat.label} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </Card>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ cách bố trí StatPair: một cặp đơn lẻ (frameless, luôn đặt trong card của parent), " +
            "dải ngang nhiều cặp trong một card khi bề rộng thoải mái (ngăn bằng đường kẻ dọc), và lưới " +
            "2 cột khi bề rộng hẹp (sidebar/widget) — cùng bộ số liệu nhưng không đủ chỗ cho một dòng.",
    },
}
