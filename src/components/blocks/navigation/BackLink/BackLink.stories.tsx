import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { BackLink } from "./index"

const meta: Meta<typeof BackLink> = {
    title: "Core/Navigation/BackLink",
    component: BackLink,
}
export default meta
type Story = StoryObj<typeof BackLink>

/** Dùng khi trang con chỉ cần quay lại chung chung, không nêu đích danh nơi sẽ về. */
export const Default: Story = {
    parameters: { usage: "Dùng khi trang con chỉ cần quay lại chung chung, không nêu đích danh nơi sẽ về." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Quay lại chung</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi trang con chỉ cần quay lại chung chung, không nêu đích danh nơi sẽ về.
                </Typography>
            </div>
            <BackLink onPress={() => {}} />
        </div>
    ),
}

