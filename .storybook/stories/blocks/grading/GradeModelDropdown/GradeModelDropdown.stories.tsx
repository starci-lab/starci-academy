import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { GradeModelDropdown } from "@/components/blocks/grading/GradeModelDropdown"
import type { GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof GradeModelDropdown> = {
    title: "Blocks/Grading/GradeModelDropdown",
    component: GradeModelDropdown,
}

export default meta
type Story = StoryObj<typeof GradeModelDropdown>

/** Danh mục model đủ 5 hạng, dùng chung cho mọi variant — gpt-4o cố tình "down" (available=false) để minh hoạ hàng bị disable. */
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

/**
 * Toàn bộ state của GradeModelDropdown trong một gallery: 4 kiểu trigger (inline
 * mặc định, field isDropdown, button isButton, button full-width), có/không lane
 * Auto, model bị khoá vì chưa mở gói, model dưới mức khuyến nghị (floor), catalog
 * rỗng, và cả control bị khoá. Mỗi ô là component thật — bấm vào để mở popover và
 * thấy đúng hàng disabled (gpt-4o "down"), hàng locked, hàng warning bên trong.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Dùng GradeModelDropdown ở mọi nơi cần chọn lane chấm bài (Auto hoặc pin một model cụ thể): trigger inline mặc định khi đứng độc lập, isDropdown khi cần đồng bộ chrome với các Select khác trong form, isButton khi đứng cạnh các nút/pill khác. Truyền floor để cảnh báo model dưới mức khuyến nghị (chấm bài dùng Economy, chatbot bỏ trống), showAutoLane=false khi surface bắt buộc phải chốt một model cụ thể (review dự án cá nhân), và canPremium=false để khoá các hạng Balanced/Premium/Frontier cho tới khi người dùng mở gói hoặc enroll khoá.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Trigger mặc định — có lane Auto"
                hint="Trigger inline mặc định, dùng khi dropdown không cần đứng cạnh field Select nào khác. Bấm để mở popover: lane Auto trên cùng, rồi 5 model theo hạng — gpt-4o hiện icon cảnh báo vì đang tạm ngưng (available=false)."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                />
            </Variant>
            <Variant
                label="Trigger dạng field (isDropdown)"
                hint="isDropdown biến trigger thành field viền/nền giống Select thật — dùng khi model picker nằm cạnh các Select khác trong cùng form và cần đồng bộ chrome (viền, hover, focus)."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    isDropdown
                />
            </Variant>
            <Variant
                label="Trigger dạng nút (isButton)"
                hint="isButton render trigger như một Button variant tertiary — dùng khi model picker đứng cạnh các nút/pill khác (ví dụ cụm pill FlexWrapButtonRadio trong Mock Interview) để đồng bộ hình khối."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    isButton
                />
            </Variant>
            <Variant
                label="Trigger dạng nút full-width (isButton + isButtonFullWidth)"
                hint="Kết hợp isButton với isButtonFullWidth khi model picker nằm trong sidebar xếp các field full-width theo chiều dọc (ví dụ trình sửa CV xếp Font/Font-size)."
            >
                <div className="w-64">
                    <Controlled
                        models={FULL_CATALOG}
                        initialSelection={{ model: null, provider: null }}
                        canPremium
                        isButton
                        isButtonFullWidth
                    />
                </div>
            </Variant>
            <Variant
                label="Không có lane Auto, đã pin sẵn một model (showAutoLane=false)"
                hint="showAutoLane=false ẩn lựa chọn Auto khi surface bắt buộc phải chốt một model cụ thể — ví dụ review dự án cá nhân phải pin model, không được để balancer tự chọn. Trigger hiện sẵn tên model đã pin."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: "gemini-2.5-flash", provider: ModelProvider.Gemini }}
                    canPremium
                    showAutoLane={false}
                />
            </Variant>
            <Variant
                label="Model cần mở khoá (canPremium=false)"
                hint="canPremium=false khoá các hạng Balanced/Premium/Frontier — bấm vào một model bị khoá gọi onUpgrade để đưa người dùng tới trang nâng cấp, thay vì chọn được ngay."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium={false}
                />
            </Variant>
            <Variant
                label="Model dưới mức khuyến nghị (floor=Economy)"
                hint="floor gắn cờ cảnh báo màu hổ phách cho model nằm dưới mức khuyến nghị — model hạng Free vẫn chọn được nhưng kết quả chấm có thể không chính xác. Chấm bài truyền floor=Economy; chatbot bỏ trống prop này vì Free là lane bình thường của nó."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                    floor={AiModelCategory.Economy}
                />
            </Variant>
            <Variant
                label="Danh mục rỗng — chưa có model nào"
                hint="Khi models=[] (catalog trống hoặc bộ lọc không khớp), popover hiện dòng thông báo Không có model khớp thay cho danh sách."
            >
                <Controlled
                    models={[]}
                    initialSelection={{ model: null, provider: null }}
                    canPremium
                />
            </Variant>
            <Variant
                label="Cả control bị khoá (isDisabled)"
                hint="isDisabled khoá toàn bộ trigger khi một lượt chấm đang chạy — không bấm mở popover được, dù đã pin model từ trước."
            >
                <Controlled
                    models={FULL_CATALOG}
                    initialSelection={{ model: "gpt-4o-mini", provider: ModelProvider.OpenAI }}
                    canPremium
                    isDisabled
                />
            </Variant>
        </Gallery>
    ),
}
