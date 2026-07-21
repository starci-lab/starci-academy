import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Typography } from "@heroui/react"
import {
    ProgrammingLanguageTabs,
    ProgrammingLanguageTabsVariant,
} from "@/components/blocks/navigation/ProgrammingLanguageTabs"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ProgrammingLanguageTabs> = {
    title: "Blocks/Navigation/ProgrammingLanguageTabs",
    component: ProgrammingLanguageTabs,
}

export default meta
type Story = StoryObj<typeof ProgrammingLanguageTabs>

/** Giữ state `selectedLang` bằng useState để bấm chọn tab phản ánh đúng chỉ báo/tab đang active. */
const Controlled = ({
    availableLangs,
    initialLang,
    ariaLabel,
    alwaysShow = false,
    variant = ProgrammingLanguageTabsVariant.Pill,
    surfaceBorder = true,
}: {
    availableLangs: Array<string>
    initialLang: string
    ariaLabel: string
    alwaysShow?: boolean
    variant?: ProgrammingLanguageTabsVariant
    surfaceBorder?: boolean
}) => {
    const [selectedLang, setSelectedLang] = useState(initialLang)
    return (
        <ProgrammingLanguageTabs
            availableLangs={availableLangs}
            selectedLang={selectedLang}
            onSelectLang={setSelectedLang}
            ariaLabel={ariaLabel}
            alwaysShow={alwaysShow}
            variant={variant}
            surfaceBorder={surfaceBorder}
        />
    )
}

/**
 * Toàn bộ state của ProgrammingLanguageTabs trong một gallery: 4 tab cố định
 * (TypeScript/Java/C#/Go), pill vs secondary underline, ngôn ngữ thiếu bị
 * disable, rỗng ẩn theo mặc định hoặc luôn hiện với alwaysShow, và secondary
 * bỏ viền khi parent tự vẽ đường phân cách. Mỗi ô là component thật — bấm
 * tab để thấy chỉ báo/underline chuyển đúng ngôn ngữ.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Dùng ProgrammingLanguageTabs ở mọi bài học/challenge cho phép chọn ngôn ngữ lập trình (TypeScript/Java/C#/Go). " +
            "Mặc định variant=\"pill\" cho khối switcher độc lập (đầu trang bài học); variant=\"secondary\" khi cần khớp hình khối underline như ContentTabBar (đứng cùng hàng Content/Lecture/Challenges). " +
            "Ngôn ngữ không có trong availableLangs (backend chưa có code mẫu) tự động disable, không cần tự lọc tay. " +
            "Bỏ trống availableLangs sẽ ẩn hẳn component — dùng alwaysShow khi vẫn cần giữ chỗ (ví dụ khung preview trống của bài học mới tạo). " +
            "surfaceBorder=false chỉ áp cho secondary, khi trang cha đã tự vẽ border-b edge-to-edge quanh nội dung tab.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Pill — mặc định, đủ 4 ngôn ngữ khả dụng"
                hint={"variant=\"pill\" (mặc định) — khối switcher độc lập đứng đầu bài học, không cần khớp hàng tab nào khác. Cả 4 ngôn ngữ đều có trong availableLangs nên không tab nào bị khoá."}
            >
                <Controlled
                    availableLangs={["typescript", "java", "csharp", "go"]}
                    initialLang="typescript"
                    ariaLabel="Ngôn ngữ lập trình"
                />
            </Variant>
            <Variant
                label="Pill — chỉ một phần ngôn ngữ có code mẫu (còn lại disabled)"
                hint="availableLangs chỉ có typescript và go — Java và C# tự động render disabled vì backend chưa trả code mẫu cho hai ngôn ngữ đó, không cần component cha tự lọc."
            >
                <Controlled
                    availableLangs={["typescript", "go"]}
                    initialLang="typescript"
                    ariaLabel="Ngôn ngữ lập trình"
                />
            </Variant>
            <Variant
                label="Secondary — underline full-width, có viền dưới"
                hint={"variant=\"secondary\" khớp hình khối ContentTabBar — dùng khi ProgrammingLanguageTabs đứng cùng hàng với các tab nội dung khác (Content/Lecture/Challenges). surfaceBorder mặc định true nên tự vẽ border-b full-width."}
            >
                <Controlled
                    availableLangs={["typescript", "java", "csharp", "go"]}
                    initialLang="java"
                    ariaLabel="Ngôn ngữ lập trình"
                    variant={ProgrammingLanguageTabsVariant.Secondary}
                />
            </Variant>
            <Variant
                label="Secondary — bỏ viền (surfaceBorder=false)"
                hint="surfaceBorder=false bỏ khung border-b full-width để trang cha tự vẽ đường phân cách quanh cả vùng nội dung tab, tránh vẽ viền hai lần."
            >
                <Controlled
                    availableLangs={["typescript", "java", "csharp", "go"]}
                    initialLang="csharp"
                    ariaLabel="Ngôn ngữ lập trình"
                    variant={ProgrammingLanguageTabsVariant.Secondary}
                    surfaceBorder={false}
                />
            </Variant>
            <Variant
                label="Rỗng — availableLangs=[] không alwaysShow, ẩn hoàn toàn"
                hint="Khi chưa ngôn ngữ nào có code mẫu và alwaysShow=false (mặc định), component trả về null — không chiếm chỗ trên trang. Vùng dưới đây cố tình để trống để minh hoạ."
            >
                <div className="flex flex-col gap-2">
                    <ProgrammingLanguageTabs
                        availableLangs={[]}
                        selectedLang="typescript"
                        onSelectLang={() => {}}
                        ariaLabel="Ngôn ngữ lập trình"
                    />
                    <Typography type="body-sm" color="muted">
                        (Không render gì ở đây — component trả về null)
                    </Typography>
                </div>
            </Variant>
            <Variant
                label="Rỗng nhưng alwaysShow — luôn hiện đủ 4 tab, tất cả disabled"
                hint="alwaysShow=true giữ chỗ đủ 4 tab dù availableLangs rỗng — dùng cho khung preview của bài học mới tạo, trước khi có code mẫu cho ngôn ngữ nào."
            >
                <Controlled
                    availableLangs={[]}
                    initialLang="typescript"
                    ariaLabel="Ngôn ngữ lập trình"
                    alwaysShow
                />
            </Variant>
        </Gallery>
    ),
}
