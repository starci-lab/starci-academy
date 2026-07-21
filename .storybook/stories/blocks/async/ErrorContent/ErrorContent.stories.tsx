import type { Meta, StoryObj } from "@storybook/nextjs"
import { CloudWarningIcon } from "@phosphor-icons/react"
import { ErrorContent } from "@/components/blocks/async/ErrorContent"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ErrorContent> = {
    title: "Blocks/Async/ErrorContent",
    component: ErrorContent,
}
export default meta
type Story = StoryObj<typeof ErrorContent>

/**
 * Toàn bộ biến thể của ErrorContent: mặc định có nút thử lại, không có nút thử
 * lại khi lỗi không thể khắc phục bằng retry, và icon tuỳ chỉnh khi icon cảnh báo
 * mặc định không diễn tả đúng ngữ cảnh lỗi.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Default"
                hint="A load error that retrying can fix — this is AsyncContent's default errorContent."
            >
                <ErrorContent
                    title="Couldn't load data"
                    description="Something went wrong, please try again later."
                    onRetry={() => {}}
                    retryLabel="Try again"
                />
            </Variant>
            <Variant
                label="Without retry button"
                hint="An error that retrying WON'T fix (not found, no permission) — don't invite a tap on a button that can't help."
            >
                <ErrorContent title="Content not found" />
            </Variant>
            <Variant
                label="Custom icon"
                hint="A kind of error an icon states more clearly than the generic warning octagon (maintenance, lost connection)."
            >
                <ErrorContent
                    icon={<CloudWarningIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                    title="Server under maintenance"
                    description="Please check back in a few minutes."
                    onRetry={() => {}}
                    retryLabel="Check again"
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ biến thể của ErrorContent: mặc định có nút thử lại, không có nút thử lại khi lỗi " +
            "không thể khắc phục bằng retry, và icon tuỳ chỉnh khi icon cảnh báo mặc định không diễn tả " +
            "đúng ngữ cảnh lỗi.",
    },
}
