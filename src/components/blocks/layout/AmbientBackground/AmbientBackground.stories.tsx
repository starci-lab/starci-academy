import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { AmbientBackground } from "./index"
import { BackgroundEffect } from "@/modules/types/enums/background-effect"

const meta: Meta<typeof AmbientBackground> = {
    title: "Core/Layout/AmbientBackground",
    component: AmbientBackground,
}
export default meta
type Story = StoryObj<typeof AmbientBackground>

/**
 * The same override the REAL picker passes (`profile/Appearance` — Cài đặt → Giao
 * diện). The block ships `fixed inset-0 -z-10` because in the app it IS the whole
 * shell's backdrop; a preview box has to re-anchor it to the box (`absolute`) and
 * lift it out from behind the page (`-z-0`). Without this the effect escapes to the
 * viewport and paints under the page, leaving an empty bordered box here.
 */
const PREVIEW_CLASS = "absolute inset-0 -z-0"

/**
 * `when` = the axis a user actually picks on, READ FROM SOURCE, not invented here:
 * `globals.css` under `prefers-reduced-motion: reduce` drops the five particle
 * effects to `opacity: 0` (a frozen flake reads as debris, not atmosphere) while
 * the four field effects only lose their animation and stay on. Counts are each
 * effect's own `count` default; Rain's cadence is its `rainFall` duration range.
 */
const effects: Array<{ effect: BackgroundEffect, label: string, when: string }> = [
    {
        effect: BackgroundEffect.Aurora,
        label: "Aurora",
        when: "ba dải sáng trôi rất chậm, không hạt — vẫn còn khi người dùng bật giảm chuyển động, hợp làm nền cho màn đọc lâu.",
    },
    {
        effect: BackgroundEffect.Ember,
        label: "Ember",
        when: "60 hạt bay lên, đông thứ nhì — tắt sạch khi bật giảm chuyển động, đừng chọn nếu nền cần còn thấy được trong mọi trường hợp.",
    },
    {
        effect: BackgroundEffect.Wave,
        label: "Wave",
        when: "dải sóng bám mép dưới, chừa trống nửa trên — hợp khi nội dung chính nằm phía trên; giảm chuyển động thì đứng yên nhưng vẫn còn.",
    },
    {
        effect: BackgroundEffect.Snow,
        label: "Snow",
        when: "50 hạt rơi chậm phủ đều cả màn — tắt sạch khi bật giảm chuyển động.",
    },
    {
        effect: BackgroundEffect.Rain,
        label: "Rain",
        when: "45 vệt rơi nhanh nhất nhóm, một lượt chỉ 1,4–2,7 giây — động nhất, dễ giành chú ý với nội dung; tắt sạch khi bật giảm chuyển động.",
    },
    {
        effect: BackgroundEffect.Bubbles,
        label: "Bubbles",
        when: "30 bong bóng nổi lên chậm, thưa hơn Ember dù cùng hướng — tắt sạch khi bật giảm chuyển động.",
    },
    {
        effect: BackgroundEffect.Fireflies,
        label: "Fireflies",
        when: "24 đốm trôi vô hướng, thưa nhất nhóm — chọn khi muốn có chuyển động mà gần như không chiếm chú ý; tắt sạch khi bật giảm chuyển động.",
    },
    {
        effect: BackgroundEffect.Stars,
        label: "Stars",
        when: "70 điểm, đông nhất, nhưng chỉ nhấp nháy tại chỗ chứ không dịch chuyển — hiệu ứng hạt duy nhất còn hiện khi bật giảm chuyển động, chọn khi cần nền có hạt mà vẫn an toàn với người nhạy chuyển động.",
    },
    {
        effect: BackgroundEffect.Circuit,
        label: "Circuit",
        when: "lưới tĩnh mờ dần lên trên, không hạt — hình học thay vì thiên nhiên; giảm chuyển động thì ngưng đập nhưng vẫn còn.",
    },
]

/** Bảng so sánh cả 9 hiệu ứng nền người dùng chọn ở Cài đặt → Giao diện — dùng khi cần đối chiếu mức chuyển động và độ dày hạt giữa các lựa chọn, nhất là để biết hiệu ứng nào còn sống khi người dùng bật giảm chuyển động (5 trong 9 tắt hẳn). Mỗi ô là bản xem trước neo vào khung, làm y như trang Giao diện: block vốn `fixed inset-0 -z-10` phủ cả shell nên phải đè `absolute inset-0 -z-0` mới thấy được trong khung nhỏ. */
export const AllEffects: Story = {
    parameters: { usage: "Bảng so sánh cả 9 hiệu ứng nền người dùng chọn ở Cài đặt → Giao diện — dùng khi cần đối chiếu mức chuyển động và độ dày hạt giữa các lựa chọn, nhất là để biết hiệu ứng nào còn sống khi người dùng bật giảm chuyển động (5 trong 9 tắt hẳn). Mỗi ô là bản xem trước neo vào khung, làm y như trang Giao diện: block vốn `fixed inset-0 -z-10` phủ cả shell nên phải đè `absolute inset-0 -z-0` mới thấy được trong khung nhỏ." },
    render: () => (
        <div className="flex flex-col gap-6">
            {effects.map(({ effect, label, when }) => (
                <div key={effect} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>{label}</Label>
                        <Typography type="body-sm" color="muted">
                            {when}
                        </Typography>
                    </div>
                    <div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-default">
                        <AmbientBackground effect={effect} className={PREVIEW_CLASS} />
                    </div>
                </div>
            ))}
        </div>
    ),
}

/** Giá trị mặc định của hệ thống, cũng là lựa chọn khi người dùng tắt hết hiệu ứng — dùng để xác nhận block trả về null chứ không vẽ một lớp trong suốt đè lên nền trang. */
export const None: Story = {
    name: "Không có hiệu ứng",
    parameters: { usage: "Giá trị mặc định của hệ thống, cũng là lựa chọn khi người dùng tắt hết hiệu ứng — dùng để xác nhận block trả về null chứ không vẽ một lớp trong suốt đè lên nền trang." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không có hiệu ứng</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái khi effect là None: khung dưới đây phải trống hoàn toàn, không vệt sáng không lớp phủ — thấy bất cứ thứ gì tức là block đang vẽ thừa lên nền trang.
                </Typography>
            </div>
            <div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-default">
                <AmbientBackground effect={BackgroundEffect.None} className={PREVIEW_CLASS} />
            </div>
        </div>
    ),
}
