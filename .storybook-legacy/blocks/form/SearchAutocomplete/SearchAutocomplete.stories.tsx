import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SearchAutocomplete } from "@/components/blocks/form/SearchAutocomplete"
import { Gallery, Variant } from "../../../../story-kit"
import { CATALOG } from "./components"

const meta: Meta<typeof SearchAutocomplete> = {
    title: "Legacy/Blocks/Form/SearchAutocomplete",
    component: SearchAutocomplete,
}
export default meta
type Story = StoryObj<typeof SearchAutocomplete>

/**
 * Toàn bộ trạng thái của SearchAutocomplete: có gợi ý (parent giữ inputValue và
 * danh sách items, tự lọc theo chuỗi gõ vào), đang tải (spinner thay danh sách),
 * và không có kết quả khớp (emptyLabel thay danh sách). Dùng để tra khi nào bật
 * isLoading, khi nào items rỗng thật sự hiện emptyLabel.
 */
export const AllVariants: Story = {
    render: () => {
        const [inputValue, setInputValue] = useState("")
        const [, setSelectedId] = useState<string | undefined>(undefined)
        // parent-owned filtering — the block renders `items` as-is
        const items = useMemo(() => {
            const query = inputValue.trim().toLowerCase()
            if (query.length === 0) {
                return CATALOG
            }
            return CATALOG.filter((item) => item.label.toLowerCase().includes(query))
        }, [inputValue])
        const [loadingInputValue, setLoadingInputValue] = useState("system")
        const [emptyInputValue, setEmptyInputValue] = useState("no-results")
        return (
            <Gallery>
                <Variant
                    label="Có gợi ý"
                    hint="Trường tìm-kiếm tự-hoàn theo từng ký tự cho khoá học/chủ đề — parent giữ inputValue và danh sách items (không lọc trong component), chọn một dòng trả id qua onSelect. Ở đây danh sách lọc theo chuỗi đang gõ để mô phỏng gợi ý thật; mỗi dòng có nhãn và mô tả mờ tuỳ chọn."
                >
                    <div className="max-w-sm">
                        <SearchAutocomplete
                            items={items}
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSelect={setSelectedId}
                        />
                    </div>
                </Variant>
                <Variant
                    label="Đang tải"
                    hint="Khi parent đang gọi API lấy gợi ý cho query hiện tại, bật isLoading để danh sách gợi ý được thay bằng spinner cho tới khi có dữ liệu."
                >
                    <div className="max-w-sm">
                        <SearchAutocomplete
                            items={CATALOG}
                            inputValue={loadingInputValue}
                            onInputChange={setLoadingInputValue}
                            onSelect={() => undefined}
                            isLoading
                        />
                    </div>
                </Variant>
                <Variant
                    label="Không có kết quả"
                    hint="Khi items rỗng và không loading, dropdown hiện emptyLabel thay cho danh sách gợi ý — dùng để báo không tìm thấy khoá học/chủ đề khớp."
                >
                    <div className="max-w-sm">
                        <SearchAutocomplete
                            items={[]}
                            inputValue={emptyInputValue}
                            onInputChange={setEmptyInputValue}
                            onSelect={() => undefined}
                            emptyLabel="No matching course or topic found"
                        />
                    </div>
                </Variant>
            </Gallery>
        )
    },
    parameters: {
        usage:
            "Toàn bộ trạng thái của SearchAutocomplete: có gợi ý (parent giữ inputValue và " +
            "danh sách items, không lọc trong component, chọn một dòng trả id qua onSelect), " +
            "đang tải (bật isLoading khi parent đang gọi API, danh sách được thay bằng spinner " +
            "cho tới khi có dữ liệu), và không có kết quả khớp (items rỗng và không loading thì " +
            "dropdown hiện emptyLabel thay cho danh sách gợi ý).",
    },
}
