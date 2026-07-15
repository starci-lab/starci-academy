import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { GradeModelDropdown, type GradeModelSelection } from "./index"
import { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"

const meta: Meta<typeof GradeModelDropdown> = {
    title: "Blocks/Grading/GradeModelDropdown",
    component: GradeModelDropdown,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof GradeModelDropdown>

const MODELS: Array<AiGradableModel> = [
    {
        model: "qwen2.5-coder:7b",
        provider: ModelProvider.Local,
        category: AiModelCategory.Free,
        complimentary: true,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.Chatting, AiModelTask.TaskGrading],
    },
    {
        model: "gpt-4o-mini",
        provider: ModelProvider.OpenAI,
        category: AiModelCategory.Economy,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.TaskGrading, AiModelTask.ChallengeGrading],
    },
    {
        model: "gpt-4o",
        provider: ModelProvider.OpenAI,
        category: AiModelCategory.Balanced,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.ChallengeGrading],
    },
    {
        model: "claude-opus-4",
        provider: ModelProvider.Anthropic,
        category: AiModelCategory.Frontier,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.ChallengeGrading],
    },
    {
        model: "gemini-1.5-pro",
        provider: ModelProvider.Gemini,
        category: AiModelCategory.Premium,
        complimentary: false,
        available: false,
        supportedTasks: [AiModelTask.Grading],
    },
]

const Controlled = (props: {
    models: Array<AiGradableModel>
    canPremium: boolean
    isDisabled?: boolean
    showAutoLane?: boolean
    floor?: AiModelCategory
    task?: AiModelTask
    isButton?: boolean
}) => {
    const [selection, setSelection] = useState<GradeModelSelection>({ model: null, provider: null })
    return (
        <GradeModelDropdown
            models={props.models}
            selection={selection}
            canPremium={props.canPremium}
            isDisabled={props.isDisabled}
            showAutoLane={props.showAutoLane}
            floor={props.floor}
            task={props.task}
            isButton={props.isButton}
            onSelect={setSelection}
            onUpgrade={() => {}}
        />
    )
}

/** Dùng khi chấm bài thường: có sẵn lane Auto, các model Balanced trở lên khoá lại vì tài khoản chưa nâng gói hoặc chưa enroll khoá. */
export const Default: Story = {
    parameters: { usage: "Dùng khi chấm bài thường: có sẵn lane Auto, các model Balanced trở lên khoá lại vì tài khoản chưa nâng gói hoặc chưa enroll khoá." },
    render: () => <Controlled models={MODELS} canPremium={false} />,
}

/** Dùng khi tài khoản đã nâng gói hoặc đã enroll khoá — mọi model đều chọn được, không còn icon khoá. */
export const Unlocked: Story = {
    parameters: { usage: "Dùng khi tài khoản đã nâng gói hoặc đã enroll khoá — mọi model đều chọn được, không còn icon khoá." },
    render: () => <Controlled models={MODELS} canPremium />,
}

/** Dùng cho chấm bài capstone/dự án cá nhân — bắt buộc ghim đúng một model cụ thể nên ẩn lane Auto. */
export const WithoutAutoLane: Story = {
    parameters: { usage: "Dùng cho chấm bài capstone/dự án cá nhân — bắt buộc ghim đúng một model cụ thể nên ẩn lane Auto." },
    render: () => <Controlled models={MODELS} canPremium showAutoLane={false} />,
}

/** Dùng khi chấm bài cần độ chính xác cao — model dưới mức Economy được flag cảnh báo màu hổ phách thay vì bị ẩn. */
export const WithFloorWarning: Story = {
    parameters: { usage: "Dùng khi chấm bài cần độ chính xác cao — model dưới mức Economy được flag cảnh báo màu hổ phách thay vì bị ẩn." },
    render: () => <Controlled models={MODELS} canPremium={false} floor={AiModelCategory.Economy} />,
}

/** Dùng khi toàn bộ control cần khoá tạm thời, ví dụ đang có một lượt chấm bài khác chạy dở. */
export const Disabled: Story = {
    parameters: { usage: "Dùng khi toàn bộ control cần khoá tạm thời, ví dụ đang có một lượt chấm bài khác chạy dở." },
    render: () => <Controlled models={MODELS} canPremium isDisabled />,
}
