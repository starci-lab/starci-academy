import type { Meta, StoryObj } from "@storybook/nextjs"
import { RichText } from "@/components/blocks/rendering/RichText"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof RichText> = {
    title: "Blocks/Rendering/RichText",
    component: RichText,
}
export default meta
type Story = StoryObj<typeof RichText>

/**
 * Toàn bộ state của RichText trong một gallery: rỗng (không render gì), văn
 * bản thường không marker nào, từng marker inline riêng lẻ (code/bold/italic/
 * link/xuống dòng), marker lồng nhau, marker viết sai cú pháp (rơi về văn bản
 * thường, không vỡ layout), rồi tới thang size và màu chữ. Không có state
 * loading/error/disabled/selected — RichText là block trình bày thuần, không
 * tự quản state, không có onChange nên không cần bản Controlled.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Dùng RichText cho những đoạn copy ngắn (tiêu đề câu hỏi, mô tả thẻ, chú thích, gợi ý bài tập) cần một chút nhấn nhá — code/đậm/nghiêng/link/xuống dòng — mà không cần cả bộ máy MarkdownContent (block-level, remark plugin). Nếu copy có heading/list/table thật thì đổi sang MarkdownContent, RichText chỉ parse subset inline này.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng (text rỗng)"
                hint="text là chuỗi rỗng — renderText trả về null, Typography không có children hiển thị, không chiếm khoảng trống ngoài ý muốn."
            >
                <RichText text="" />
            </Variant>
            <Variant
                label="Văn bản thường, không marker"
                hint="Không khớp rule nào trong RULES thì render y nguyên là text, không có node bọc thêm."
            >
                <RichText text="Bấm nút Nộp bài để gửi câu trả lời, hệ thống sẽ chấm điểm ngay." />
            </Variant>
            <Variant
                label="Marker `code`"
                hint="Backtick bọc một đoạn code — không recurse, label hiện nguyên văn dù bên trong có ký tự markdown khác."
            >
                <RichText text="Dùng `useEffect` để đồng bộ state với DOM sau khi render." />
            </Variant>
            <Variant
                label="Marker **bold**"
                hint="Hai dấu sao bọc phần cần nhấn mạnh, ví dụ cảnh báo hoặc điều kiện quan trọng trong một câu hướng dẫn."
            >
                <RichText text="**Lưu ý:** bài tập này tính điểm cộng vào bảng xếp hạng tuần." />
            </Variant>
            <Variant
                label="Marker _italic_"
                hint="Dấu gạch dưới bọc phần muốn nhấn nhẹ hơn bold, ví dụ ghi chú không bắt buộc."
            >
                <RichText text="_Không bắt buộc_, nhưng nên hoàn thành trước khi qua module kế tiếp." />
            </Variant>
            <Variant
                label="Marker [link](url)"
                hint="Link luôn mở tab mới (target=_blank, rel=noopener) — dùng khi copy ngắn cần trỏ ra tài liệu ngoài."
            >
                <RichText text="Xem thêm tại [tài liệu React Hooks](https://react.dev/reference/react)." />
            </Variant>
            <Variant
                label="Xuống dòng (\\n)"
                hint="Mỗi \\n trong text tách thành một <br/> — dùng cho danh sách bước ngắn không cần thẻ <ul> thật."
            >
                <RichText text={"Bước 1: đọc đề bài.\nBước 2: viết code.\nBước 3: chạy test."} />
            </Variant>
            <Variant
                label="Kết hợp nhiều marker trong một câu"
                hint="renderInline chạy đệ quy trên phần còn lại sau mỗi marker, nên một câu có thể chứa code, bold và link cùng lúc."
            >
                <RichText text="Điền `npm install` rồi **build lại** trước khi nộp, xem [hướng dẫn](https://starci.dev/docs) nếu bí." />
            </Variant>
            <Variant
                label="Marker lồng nhau (bold chứa italic)"
                hint="bold và italic đều recurse: true, nên label bên trong **...** được parse tiếp để tìm _..._ lồng trong đó."
            >
                <RichText text="**Cảnh báo: _sắp hết thời gian_, nộp bài ngay** trước khi hệ thống tự đóng." />
            </Variant>
            <Variant
                label="Cú pháp sai/lẻ dấu — rơi về văn bản thường"
                hint="Backtick lẻ không có dấu đóng thì regex không khớp, renderInline không tìm được marker nào nên toàn câu render như text thường, không throw, không vỡ layout."
            >
                <RichText text="Dấu backtick lẻ ` không khép sẽ hiện nguyên văn, không vỡ layout." />
            </Variant>
            <VariantRow
                label="Thang size (Typography type)"
                hint="size mirror Typography type: body-xs/body-sm (mặc định)/body cho copy thường, h4 khi RichText đứng vai tiêu đề nhỏ có markup."
            >
                <RichText size="body-xs" text="Cỡ `body-xs` — chú thích rất nhỏ." />
                <RichText size="body-sm" text="Cỡ `body-sm` — mặc định khi không truyền size." />
                <RichText size="body" text="Cỡ `body` — thân bài đọc bình thường." />
                <RichText size="h4" text="Cỡ `h4` — tiêu đề nhỏ có markup" />
            </VariantRow>
            <VariantRow
                label="Màu chữ (Typography color)"
                hint="color bỏ trống thì kế thừa màu Typography mặc định; truyền muted khi câu chỉ là phụ chú, không phải nội dung chính."
            >
                <RichText color="default" text="Màu `default` — nội dung chính." />
                <RichText color="muted" text="Màu `muted` — phụ chú, ít quan trọng hơn." />
            </VariantRow>
        </Gallery>
    ),
}
