import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { SearchAutocomplete } from "./index"
import type { SearchAutocompleteItem } from "./index"

const meta: Meta<typeof SearchAutocomplete> = {
    title: "Core/Form/SearchAutocomplete",
    component: SearchAutocomplete,
}
export default meta
type Story = StoryObj<typeof SearchAutocomplete>

const CATALOG: Array<SearchAutocompleteItem> = [
    { id: "fullstack", label: "Fullstack Mastery", description: "Khoá học web toàn diện" },
    { id: "system-design", label: "System Design Mastery", description: "Thiết kế hệ thống quy mô lớn" },
    { id: "devops", label: "DevOps Mastery", description: "CI/CD, hạ tầng và vận hành" },
    { id: "tag-react", label: "React", description: "Chủ đề" },
    { id: "tag-kafka", label: "Kafka", description: "Chủ đề" },
]

/** Dùng khi cần một ô tìm kiếm gợi ý theo từng ký tự cho khoá học hoặc chủ đề — cha giữ ô nhập và danh sách gợi ý, component chỉ hiển thị. Mỗi dòng có nhãn và một dòng mô tả mờ tuỳ chọn. */
export const Default: Story = {
    parameters: {
        usage: "Dùng khi cần ô tìm kiếm gợi ý theo từng ký tự cho khoá học hoặc chủ đề. Cha giữ inputValue và danh sách items (không lọc trong component); chọn một dòng trả về id qua onSelect. Ở đây danh sách lọc theo chuỗi đã gõ để mô phỏng gợi ý thật.",
    },
    render: () => {
        const [inputValue, setInputValue] = useState("")
        const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
        // parent-owned filtering — the block renders `items` as-is
        const items = useMemo(() => {
            const query = inputValue.trim().toLowerCase()
            if (query.length === 0) {
                return CATALOG
            }
            return CATALOG.filter((item) => item.label.toLowerCase().includes(query))
        }, [inputValue])
        return (
            <div className="flex max-w-sm flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Có gợi ý</Label>
                    <Typography type="body-sm" color="muted">
                        Gõ để lọc danh sách khoá học và chủ đề. Chọn một dòng sẽ ghi lại id được chọn.
                    </Typography>
                    {selectedId ? (
                        <Typography type="body-xs" color="muted">
                            Đã chọn: {selectedId}
                        </Typography>
                    ) : null}
                </div>
                <SearchAutocomplete
                    items={items}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSelect={setSelectedId}
                />
            </div>
        )
    },
}

/** Dùng để kiểm tra trạng thái đang tải — khi cha đang lấy kết quả, danh sách được thay bằng một spinner cho tới khi có dữ liệu. */
export const Loading: Story = {
    parameters: {
        usage: "Dùng để kiểm tra trạng thái đang tải: đặt isLoading khi cha đang lấy gợi ý cho truy vấn hiện tại, lưới gợi ý được thay bằng spinner cho tới khi có dữ liệu.",
    },
    render: () => {
        const [inputValue, setInputValue] = useState("system")
        return (
            <div className="flex max-w-sm flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Đang tải</Label>
                    <Typography type="body-sm" color="muted">
                        Trong lúc cha lấy kết quả, dropdown hiển thị spinner thay cho danh sách.
                    </Typography>
                </div>
                <SearchAutocomplete
                    items={CATALOG}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSelect={() => undefined}
                    isLoading
                />
            </div>
        )
    },
}

/** Dùng để kiểm tra trạng thái rỗng — khi truy vấn không khớp gợi ý nào, dropdown hiển thị dòng thông báo trống thay cho danh sách. */
export const Empty: Story = {
    parameters: {
        usage: "Dùng để kiểm tra trạng thái rỗng: khi items rỗng và không đang tải, dropdown hiển thị emptyLabel thay cho danh sách gợi ý.",
    },
    render: () => {
        const [inputValue, setInputValue] = useState("khong-co-ket-qua")
        return (
            <div className="flex max-w-sm flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Rỗng</Label>
                    <Typography type="body-sm" color="muted">
                        Khi không có gợi ý nào khớp, dropdown hiển thị dòng thông báo trống.
                    </Typography>
                </div>
                <SearchAutocomplete
                    items={[]}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSelect={() => undefined}
                    emptyLabel="Không tìm thấy khoá học hay chủ đề phù hợp"
                />
            </div>
        )
    },
}
