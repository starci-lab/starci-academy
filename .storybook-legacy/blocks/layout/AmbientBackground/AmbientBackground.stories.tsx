import type { Meta, StoryObj } from "@storybook/nextjs"

import { AmbientBackground } from "@/components/blocks/layout/AmbientBackground"
import { BackgroundEffect } from "@/modules/types/enums/background-effect"
import { Gallery, Variant } from "../../../../story-kit"
import { PREVIEW_CLASS, effects } from "./components"

const meta: Meta<typeof AmbientBackground> = {
    title: "Legacy/Blocks/Media/AmbientBackground",
    component: AmbientBackground,
}
export default meta
type Story = StoryObj<typeof AmbientBackground>

/**
 * Bản dịch tiếng Việt của mô tả `when` trong `./components` — giữ nguyên nội
 * dung kỹ thuật (số hạt, hành vi dưới reduced motion), chỉ đổi ngôn ngữ để
 * khớp caption tiếng Việt của các Variant khác trong bộ story.
 */
const effectHints: Record<BackgroundEffect, string> = {
    [BackgroundEffect.None]: "Trạng thái khi effect là None: khung dưới phải hoàn toàn trống, không glow, không overlay — thấy bất kỳ thứ gì nghĩa là block đang vẽ thêm lớp phủ lên nền trang.",
    [BackgroundEffect.Aurora]: "Ba dải sáng trôi rất chậm, không có hạt — vẫn chạy khi người dùng bật giảm chuyển động, phù hợp làm nền cho màn hình đọc dài.",
    [BackgroundEffect.Ember]: "60 hạt bay lên, đứng thứ nhì về độ dày đặc — tắt hẳn khi bật giảm chuyển động, đừng chọn nếu nền phải luôn hiển thị trong mọi trường hợp.",
    [BackgroundEffect.Wave]: "Một dải sóng bám theo mép dưới, để trống nửa trên — phù hợp khi nội dung chính nằm phía trên; khi bật giảm chuyển động thì đứng yên nhưng vẫn hiện.",
    [BackgroundEffect.Snow]: "50 hạt rơi chậm, trải đều khắp màn hình — tắt hẳn khi bật giảm chuyển động.",
    [BackgroundEffect.Rain]: "45 vệt mưa, nhanh nhất trong nhóm, một lượt rơi chỉ 1.4–2.7 giây — động nhiều nhất, dễ giành sự chú ý với nội dung; tắt hẳn khi bật giảm chuyển động.",
    [BackgroundEffect.Bubbles]: "30 bong bóng bay lên chậm, thưa hơn Ember dù cùng hướng — tắt hẳn khi bật giảm chuyển động.",
    [BackgroundEffect.Fireflies]: "24 đốm sáng trôi vô định, thưa nhất trong nhóm — chọn khi cần chuyển động gần như không gây chú ý; tắt hẳn khi bật giảm chuyển động.",
    [BackgroundEffect.Stars]: "70 điểm sáng, dày đặc nhất, nhưng chỉ nhấp nháy tại chỗ chứ không di chuyển — hiệu ứng hạt DUY NHẤT còn hiển thị khi bật giảm chuyển động, chọn khi cần nền dạng hạt vẫn an toàn cho người nhạy cảm với chuyển động.",
    [BackgroundEffect.Circuit]: "Một lưới tĩnh mờ dần lên phía trên, không có hạt — hình học chứ không tự nhiên; khi bật giảm chuyển động thì ngừng nhấp nháy nhưng vẫn hiện.",
}

/**
 * Toàn bộ ma trận effect của AmbientBackground: None (mặc định hệ thống, cũng
 * là lựa chọn khi người dùng tắt hết effect — xác nhận block trả về null chứ
 * không vẽ lớp trong suốt) và 9 background effect người dùng chọn ở Settings
 * → Appearance — dùng để cân nhắc mức độ động và độ dày hạt giữa các lựa
 * chọn, đặc biệt để biết effect nào còn chạy khi người dùng bật giảm chuyển
 * động (5 trong 9 effect tắt hẳn). Mỗi ô là một preview neo vào khung của nó,
 * giống hệt trang Appearance: block nguyên bản là `fixed inset-0 -z-10` phủ
 * hết cả shell, nên phải override bằng `absolute inset-0 -z-0` để hiện được
 * trong khung nhỏ.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant label="None" hint={effectHints[BackgroundEffect.None]}>
                <div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-default">
                    <AmbientBackground effect={BackgroundEffect.None} className={PREVIEW_CLASS} />
                </div>
            </Variant>
            {effects.map(({ effect, label }) => (
                <Variant key={effect} label={label} hint={effectHints[effect]}>
                    <div className="relative h-40 w-72 overflow-hidden rounded-2xl border border-default">
                        <AmbientBackground effect={effect} className={PREVIEW_CLASS} />
                    </div>
                </Variant>
            ))}
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận effect của AmbientBackground: None (mặc định hệ thống, cũng là lựa chọn khi " +
            "người dùng tắt hết effect — xác nhận block trả về null chứ không vẽ lớp trong suốt) và 9 " +
            "background effect người dùng chọn ở Settings → Appearance — dùng để cân nhắc mức độ động và độ " +
            "dày hạt giữa các lựa chọn, đặc biệt để biết effect nào còn chạy khi người dùng bật giảm chuyển " +
            "động (5 trong 9 effect tắt hẳn). Mỗi ô là một preview neo vào khung của nó, giống hệt trang " +
            "Appearance: block nguyên bản là `fixed inset-0 -z-10` phủ hết cả shell, nên phải override bằng " +
            "`absolute inset-0 -z-0` để hiện được trong khung nhỏ.",
    },
}
