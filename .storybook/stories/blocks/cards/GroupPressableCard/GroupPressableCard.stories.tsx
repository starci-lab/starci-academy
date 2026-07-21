import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretRightIcon } from "@phosphor-icons/react"
import { Typography } from "@heroui/react"
import { RatingBar } from "@/components/blocks/buttons/RatingBar"
import { GroupPressableCard } from "@/components/blocks/cards/GroupPressableCard"
import { Gallery, Variant } from "../../../../story-kit"
import { settingsItems, ratingOptions } from "./components"

const meta: Meta<typeof GroupPressableCard> = {
    title: "Blocks/Cards/GroupPressableCard",
    component: GroupPressableCard,
}
export default meta
type Story = StoryObj<typeof GroupPressableCard>

/**
 * Toàn bộ ma trận trạng thái của GroupPressableCard: mặc định (grid điều hướng
 * phụ), cụm hành động chính có phím tắt 1–N (qua `RatingBar`, thử bấm phím 1
 * đến 4), toàn cụm bị khoá khi đang submit, và thẻ lẻ trong pager phải ghim
 * đúng cột phải khi thẻ trước bị thiếu. Dùng để tra khi nào bật shortcut, khi
 * nào khoá cả cụm, và cách ghim đúng trục khi grid chỉ còn một thẻ.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Dùng khi mỗi ô mở một điểm đến riêng và cả lưới chỉ là đường đi phụ trên màn hình: không ô nào cần nổi hơn ô khác, và không ô nào chiếm phím số của trang."
            >
                <GroupPressableCard
                    ariaLabel="Settings pages"
                    columns={{ base: 1, sm: 2 }}
                    items={settingsItems}
                />
            </Variant>
            <Variant
                label="Cụm hành động chính có phím tắt"
                hint="Dùng khi cụm này là hành động CHÍNH của màn hình: bật phím tắt 1–N để người dùng đang gõ phím vẫn thao tác được. Chỉ bật shortcut ở đây — listener sống trên window, nên một lưới điều hướng phụ mà cũng bật cờ này sẽ cướp hết phím số của trang. Trường hợp thật duy nhất là chấm thẻ SM-2, nên story render trực tiếp RatingBar (wrapper mỏng của GroupPressableCard với đúng cờ này) để khỏi lệch khi component đổi. Thử bấm phím 1 đến 4."
            >
                <RatingBar
                    ariaLabel="Rate how well you remembered this card"
                    options={ratingOptions}
                    onRate={() => {}}
                />
            </Variant>
            <Variant
                label="Toàn cụm bị khoá"
                hint="Dùng khi một lượt submit đang chạy — khoá cả cụm để chặn bấm lần hai; phím tắt cũng ngưng theo, khác với việc ẩn ô đi (người dùng vẫn thấy các lựa chọn tồn tại, chỉ là chưa bấm được)."
            >
                <GroupPressableCard
                    ariaLabel="Settings pages"
                    columns={{ base: 1, sm: 2 }}
                    items={settingsItems.map((item) => ({ ...item, isDisabled: true }))}
                />
            </Variant>
            <Variant
                label="Thẻ pager lẻ ghim cột phải"
                hint="Dùng khi thẻ đầu của pager bị thiếu nhưng thẻ còn lại vẫn phải nằm đúng cột phải: ghim bằng `@sm:col-start-2` — cùng trục container mà grid chia cột, KHÔNG dùng `col-start-2` trần (ở bước 1 cột nó sinh ra một cột ẩn co thẻ lại còn ~30px) và KHÔNG dùng breakpoint `sm:` (sai trục: khung hẹp trong cửa sổ rộng vẫn vỡ, khung rộng trong cửa sổ hẹp thì không). Thu nhỏ cửa sổ để thấy thẻ vẫn full-width khi grid rớt về 1 cột."
            >
                <GroupPressableCard
                    ariaLabel="Go to previous or next content"
                    columns={{ base: 1, sm: 2 }}
                    items={[
                        {
                            key: "next",
                            href: "#",
                            className: "@sm:col-start-2",
                            content: (
                                <div className="flex items-center justify-end gap-2">
                                    <Typography type="body-sm" weight="medium">
                                        Next content
                                    </Typography>
                                    <CaretRightIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                                </div>
                            ),
                        },
                    ]}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của GroupPressableCard: mặc định (grid điều hướng phụ), cụm hành động " +
            "chính có phím tắt 1–N (qua RatingBar), toàn cụm bị khoá khi đang submit, và thẻ lẻ trong pager " +
            "ghim đúng cột phải khi thẻ trước bị thiếu. Dùng khi cần tra lúc nào bật shortcut, lúc nào khoá cả " +
            "cụm, và cách ghim đúng trục khi grid chỉ còn một thẻ.",
    },
}
