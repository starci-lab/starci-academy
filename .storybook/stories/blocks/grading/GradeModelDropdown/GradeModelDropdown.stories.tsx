import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    GradeModelDropdown,
    AiModelCategory,
    AiModelTask,
    ModelProvider,
} from "./GradeModelDropdown"
import type { AiGradableModel, GradeModelSelection } from "./GradeModelDropdown"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof GradeModelDropdown> = {
    title: "Block/Grading/GradeModelDropdown",
    component: GradeModelDropdown,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof GradeModelDropdown>

const ANATOMY = {
    primitives: [
        { name: "AiCategoryChip", role: "chip hạng (tier) tô màu ở cuối mỗi hàng model" },
        { name: "FlexWrapButtonRadio", role: "cụm pill lọc theo hạng trong popover" },
        { name: "SelfHostGpuMark", role: "icon GPU cạnh model self-host trên hạ tầng nội bộ" },
    ],
    reason:
        "Picker lane + model dùng chung cho mọi surface AI (chấm bài, AI lab). Gói search + lọc theo hạng (FlexWrapButtonRadio) + mỗi hàng model có chip hạng (AiCategoryChip), dấu self-host (SelfHostGpuMark), badge health, và các trạng thái disabled/locked/warning vào MỘT block — feature chỉ truyền catalog + selection, không phải tự dựng lại toàn bộ logic khoá gói / dưới-floor / hợp-tác-vụ ở mỗi màn.",
}

/** Danh mục model đủ 5 hạng — gpt-4o cố tình "down" (available=false) để minh hoạ hàng bị disable. */
const FULL_CATALOG: Array<AiGradableModel> = [
    {
        model: "qwen2.5-coder:7b",
        provider: ModelProvider.Local,
        category: AiModelCategory.Free,
        complimentary: true,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.Chatting],
    },
    {
        model: "gpt-4o-mini",
        provider: ModelProvider.OpenAI,
        category: AiModelCategory.Economy,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading, AiModelTask.Chatting],
    },
    {
        model: "gemini-2.5-flash",
        provider: ModelProvider.Gemini,
        category: AiModelCategory.Balanced,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading],
    },
    {
        model: "gpt-4o",
        provider: ModelProvider.OpenAI,
        category: AiModelCategory.Premium,
        complimentary: false,
        available: false,
        supportedTasks: [AiModelTask.Grading],
    },
    {
        model: "claude-3-7-sonnet",
        provider: ModelProvider.Anthropic,
        category: AiModelCategory.Frontier,
        complimentary: false,
        available: true,
        supportedTasks: [AiModelTask.Grading],
    },
]

/** Giữ state `selection` bằng useState để bấm chọn Auto/model trong popover phản ánh đúng ngoài trigger. */
const Controlled = ({
    models,
    initialSelection,
    canPremium,
    isDisabled = false,
    showAutoLane = true,
    floor,
    task,
    isDropdown,
    isButton = false,
    isButtonFullWidth = false,
}: {
    models: Array<AiGradableModel>
    initialSelection: GradeModelSelection
    canPremium: boolean
    isDisabled?: boolean
    showAutoLane?: boolean
    floor?: AiModelCategory
    task?: AiModelTask
    isDropdown?: boolean
    isButton?: boolean
    isButtonFullWidth?: boolean
}) => {
    const [selection, setSelection] = React.useState<GradeModelSelection>(initialSelection)
    return (
        <GradeModelDropdown
            models={models}
            selection={selection}
            canPremium={canPremium}
            isDisabled={isDisabled}
            showAutoLane={showAutoLane}
            floor={floor}
            task={task}
            isDropdown={isDropdown}
            isButton={isButton}
            isButtonFullWidth={isButtonFullWidth}
            onSelect={setSelection}
            onUpgrade={() => {}}
        />
    )
}

export const DefaultTrigger: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: null, provider: null }}
                canPremium
            />,
            ANATOMY,
        ),
}

export const FieldTrigger: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: null, provider: null }}
                canPremium
                isDropdown
            />,
            ANATOMY,
        ),
}

export const ButtonTrigger: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: null, provider: null }}
                canPremium
                isButton
            />,
            ANATOMY,
        ),
}

export const ButtonFullWidth: Story = {
    render: () =>
        blockShell(
            <div className="w-64">
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    isButton
                    isButtonFullWidth
                />
            </div>,
            ANATOMY,
        ),
}

export const NoAutoLanePinned: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: "gemini-2.5-flash", provider: ModelProvider.Gemini }}
                canPremium
                showAutoLane={false}
            />,
            ANATOMY,
        ),
}

export const LockedModels: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: null, provider: null }}
                canPremium={false}
            />,
            ANATOMY,
        ),
}

export const BelowFloorWarning: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: null, provider: null }}
                canPremium
                floor={AiModelCategory.Economy}
            />,
            ANATOMY,
        ),
}

export const EmptyCatalog: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={[]}
                initialSelection={{ model: null, provider: null }}
                canPremium
            />,
            ANATOMY,
        ),
}

export const DisabledControl: Story = {
    render: () =>
        blockShell(
            <Controlled
                models={FULL_CATALOG}
                initialSelection={{ model: "gpt-4o-mini", provider: ModelProvider.OpenAI }}
                canPremium
                isDisabled
            />,
            ANATOMY,
        ),
}
