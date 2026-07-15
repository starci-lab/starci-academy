import type { Meta, StoryObj } from "@storybook/nextjs"
import { AmbientBackground } from "./index"
import { BackgroundEffect } from "@/modules/types/enums/background-effect"

const meta: Meta<typeof AmbientBackground> = {
    title: "Blocks/Layout/AmbientBackground",
    component: AmbientBackground,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof AmbientBackground>

const effects: { effect: BackgroundEffect; label: string }[] = [
    { effect: BackgroundEffect.Aurora, label: "Aurora — dải sáng phương bắc" },
    { effect: BackgroundEffect.Ember, label: "Ember — than hồng bay lên" },
    { effect: BackgroundEffect.Wave, label: "Wave — sóng gợn đáy màn hình" },
    { effect: BackgroundEffect.Snow, label: "Snow — tuyết rơi chậm" },
    { effect: BackgroundEffect.Rain, label: "Rain — mưa buông xuống" },
    { effect: BackgroundEffect.Bubbles, label: "Bubbles — bong bóng nổi lên" },
    { effect: BackgroundEffect.Fireflies, label: "Fireflies — đom đóm lập lòe" },
    { effect: BackgroundEffect.Stars, label: "Stars — sao lấp lánh" },
    { effect: BackgroundEffect.Circuit, label: "Circuit — lưới mạch điện tử" },
]

/** Bảng so sánh cả 9 hiệu ứng nền trong Cài đặt → Giao diện cạnh nhau — dùng khi cần đối chiếu nhanh từng lựa chọn để chọn hoặc tinh chỉnh phong cách. */
export const AllEffects: Story = {
    parameters: { usage: "Bảng so sánh cả 9 hiệu ứng nền trong Cài đặt → Giao diện cạnh nhau — dùng khi cần đối chiếu nhanh từng lựa chọn để chọn hoặc tinh chỉnh phong cách." },
    render: () => (
        <div className="grid grid-cols-3 gap-4">
            {effects.map(({ effect, label }) => (
                <div key={effect} className="flex flex-col gap-2">
                    <div className="relative h-40 w-56 overflow-hidden rounded-lg border border-default-200">
                        <AmbientBackground effect={effect} />
                    </div>
                    <span className="text-tiny text-default-500">{label}</span>
                </div>
            ))}
        </div>
    ),
}

/** Không render gì cả khi người dùng chưa chọn hiệu ứng nào (giá trị mặc định của hệ thống) — dùng để xác nhận component không vẽ thừa lên nền trang. */
export const KhongCoHieuUng: Story = {
    parameters: { usage: "Không render gì cả khi người dùng chưa chọn hiệu ứng nào (giá trị mặc định của hệ thống) — dùng để xác nhận component không vẽ thừa lên nền trang." },
    render: () => (
        <div className="relative h-64 w-96 overflow-hidden rounded-lg border border-default-200">
            <AmbientBackground effect={BackgroundEffect.None} />
        </div>
    ),
}
