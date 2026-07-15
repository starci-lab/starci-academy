import type { Meta, StoryObj } from "@storybook/nextjs"
import { useEffect } from "react"
import { TopLoader } from "./index"

const meta: Meta<typeof TopLoader> = {
    title: "Blocks/Layout/TopLoader",
    component: TopLoader,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof TopLoader>

/** Kích hoạt một điều hướng giả (pushState) ngay sau khi mount, để minh hoạ
 *  thanh loader đang chạy thay vì đứng yên vô hình. */
const TriggerNavigation = () => {
    useEffect(() => {
        window.history.pushState({}, "", window.location.href)
    }, [])
    return <TopLoader />
}

/** Ép `prefers-reduced-motion: reduce` rồi kích hoạt điều hướng giả, để minh
 *  hoạ nhánh không hiệu ứng trickle. */
const TriggerReducedMotion = () => {
    useEffect(() => {
        const original = window.matchMedia
        window.matchMedia = (query: string) =>
            ({
                ...original(query),
                matches: query.includes("prefers-reduced-motion"),
            }) as MediaQueryList
        window.history.pushState({}, "", window.location.href)
        return () => {
            window.matchMedia = original
        }
    }, [])
    return <TopLoader />
}

/** Gắn một lần duy nhất ở gốc layout, phía trên navbar — mặc định vô hình khi chưa có điều hướng nào diễn ra. */
export const Default: Story = {
    parameters: { usage: "Gắn một lần duy nhất ở gốc layout, phía trên navbar — mặc định vô hình khi chưa có điều hướng nào diễn ra." },
    render: () => <TopLoader />,
}

/** Khi người dùng vừa bấm một liên kết điều hướng, thanh pink trickle dần tới 90% trong lúc chờ route mới commit. */
export const Navigating: Story = {
    parameters: { usage: "Khi người dùng vừa bấm một liên kết điều hướng, thanh pink trickle dần tới 90% trong lúc chờ route mới commit." },
    render: () => <TriggerNavigation />,
}

/** Khi thiết bị bật prefers-reduced-motion, thanh nhảy thẳng lên một mức cố định thay vì trickle mượt, tôn trọng lựa chọn giảm chuyển động của người dùng. */
export const ReducedMotion: Story = {
    parameters: { usage: "Khi thiết bị bật prefers-reduced-motion, thanh nhảy thẳng lên một mức cố định thay vì trickle mượt, tôn trọng lựa chọn giảm chuyển động của người dùng." },
    render: () => <TriggerReducedMotion />,
}
