import type { Meta, StoryObj } from "@storybook/nextjs"
import { TagChips } from "@/components/blocks/chips/TagChips"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof TagChips> = {
    title: "Blocks/Chip/TagChips",
    component: TagChips,
}
export default meta
type Story = StoryObj<typeof TagChips>

/**
 * Toàn bộ ma trận trạng thái của TagChips: rỗng, một tag, đúng maxVisible, vượt
 * maxVisible (chip "+N" mở tooltip liệt kê hết), tuỳ chỉnh maxVisible, và các biến
 * thể variant của Chip nền dưới. Dùng để tra khi nào chọn maxVisible bao nhiêu và
 * khi nào tràn thật sự xảy ra.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Bài viết/khoá học chưa gắn tag nào — không render gì cả, kể cả chip đếm +N (chỉ hiện khi có tag bị gom, tức số tràn > 0)."
            >
                <TagChips tags={[]} />
            </Variant>
            <Variant
                label="Một tag"
                hint="Chỉ một tag duy nhất, ví dụ bài viết mới gắn nhãn chủ đề đầu tiên."
            >
                <TagChips tags={["nestjs"]} />
            </Variant>
            <Variant
                label="Bằng maxVisible (chưa tràn)"
                hint="Số tag bằng đúng maxVisible mặc định (3) — mọi tag đều hiện, không tag nào bị gom vào chip +N."
            >
                <TagChips tags={["typescript", "nodejs", "postgresql"]} />
            </Variant>
            <Variant
                label="Vượt maxVisible (tràn thật)"
                hint="Danh sách tag của một bài lab dài, chỉ 3 tag đầu hiện ra, phần còn lại gom vào chip +N; rê chuột vào chip +N mở tooltip liệt kê đủ toàn bộ tag."
            >
                <TagChips
                    tags={[
                        "system-design",
                        "microservices",
                        "docker",
                        "kubernetes",
                        "graphql",
                        "keycloak",
                        "rag",
                    ]}
                />
            </Variant>
            <Variant
                label="Tuỳ chỉnh maxVisible"
                hint="Trang có nhiều chỗ trống hơn (ví dụ card lớn) nên nới maxVisible lên 5 để hiện được nhiều tag hơn trước khi gom."
            >
                <TagChips
                    tags={[
                        "javascript",
                        "react",
                        "nextjs",
                        "tailwindcss",
                        "heroui",
                        "vitest",
                        "playwright",
                        "ci-cd",
                    ]}
                    maxVisible={5}
                />
            </Variant>
            <VariantRow
                label="Biến thể variant của Chip nền"
                hint="TagChips truyền variant xuống thẳng từng Chip; soft (mặc định) dùng cho tag nổi trên nền surface, tertiary/primary/secondary dùng khi cụm tag cần hoà nhẹ hơn hoặc nổi hơn theo ngữ cảnh xung quanh."
            >
                <TagChips tags={["frontend", "backend", "ai", "vector-db"]} variant="soft" />
                <TagChips tags={["frontend", "backend", "ai", "vector-db"]} variant="tertiary" />
                <TagChips tags={["frontend", "backend", "ai", "vector-db"]} variant="primary" />
            </VariantRow>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của TagChips: rỗng, một tag, đúng maxVisible, vượt maxVisible " +
            "(chip \"+N\" mở tooltip liệt kê hết), tuỳ chỉnh maxVisible, và các biến thể variant của Chip nền. " +
            "Dùng khi cần tra maxVisible nên đặt bao nhiêu cho một khu vực cụ thể, và xác nhận lúc nào tràn " +
            "thật sự xảy ra để chip +N có ý nghĩa.",
    },
}
