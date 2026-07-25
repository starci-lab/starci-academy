import type { Meta, StoryObj } from "@storybook/nextjs"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Alert.Base`: port DUY NHẤT xuống HeroUI Alert (`Feedback.Callout` và
 * `Toast.Base` đều compose từ đây).
 *
 * 📐 **HAI LEAF** (§14d.2): leaf chia theo CẤU TRÚC. `status` và `tone` cùng một cây
 * DOM, chỉ khác nội dung/màu ⇒ chúng là STATE, gộp chung MỘT leaf. Leaf thứ hai là
 * `WithActionAndClose` vì cây MỌC THÊM node thật (`Action` + `Close`).
 *
 * Skeleton KHÔNG phải leaf — cùng cấu trúc, chỉ thay chữ bằng gạch (prop `isSkeleton`
 * vẫn có, §12c — hai chuyện khác nhau).
 */
const meta: Meta<typeof Alert.Base> = {
    title: "Atoms/Feedback/Alert/Alert.Base",
    component: Alert.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Alert.Base>

const BASE_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "atom", role: "chỉ báo valence — atom tự chọn icon Phosphor theo `status`" },
    { name: "Content", tier: "atom", role: "cụm text" },
    { name: "Title", tier: "atom", role: "dòng tiêu đề — prop `title`" },
    { name: "Description", tier: "atom", role: "dòng phụ — prop `description`" },
]

const FULL_PARTS: Array<AnatomyNode> = [
    ...BASE_PARTS,
    { name: "Body", tier: "atom", role: "vùng tự do dưới description — prop `body` (atom CẤM children, §12b)" },
    { name: "Action", tier: "atom", role: "hành động (prop `action`) — đặt trước ×" },
    { name: "Close", tier: "atom", role: "nút × (prop `onClose`) — `Button.Icon`, tone theo status" },
]

/**
 * Leaf "alert chỉ có CHỮ" — render đủ STATE trong CÙNG một cây DOM (§14d.2):
 * 5 `status` · 2 `tone` · hàng `isSkeleton`.
 *
 * `status` chọn tint + icon cùng lúc nên không thể lỡ ghép icon sai valence;
 * `tone` là CHỖ ĐẶT chứ không phải màu mới (`soft` trong surface, `plain` nổi).
 */
export const Statuses: Story = {
    render: () => (
        <div className="flex max-w-xl flex-col gap-4 p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="Statuses"
                parts={BASE_PARTS}
                reason="Port DUY NHẤT xuống HeroUI Alert. `Feedback.Callout` và `Toast.Base` đều compose từ đây — trước 2026-07-25 mỗi bên tự cắt thẳng vào HeroUI và nuôi bảng màu riêng."
                note="`status` + `tone` + `isSkeleton` KHÔNG đổi một node nào ⇒ state, nằm chung một leaf. Glyph cố định size-5 (weight regular, §5.0a), không có trục `size`."
                code={"<Alert.Base status=\"warning\" title=\"…\" description=\"…\" />\n<Alert.Base tone=\"plain\" … />   // alert nổi (toast)\n<Alert.Base isSkeleton />        // khung + icon THẬT, chữ thành gạch"}
            >
                <div className="flex w-full flex-col gap-3">
                    <Alert.Base status="default" title="Ghi chú trung tính" description="Không mang valence — dùng cho thông tin phụ." showAnatomy />
                    <Alert.Base status="accent" title="Mẹo học nhanh" description="Ôn lại thẻ đến hạn trước khi vào bài mới." />
                    <Alert.Base status="success" title="Đã lưu bài nộp" description="Kết quả chấm sẽ có sau ít phút." />
                    <Alert.Base status="warning" title="Bạn chưa vào GitHub team của khoá" description="Một số bài lab cần quyền repo — bấm để tham gia." />
                    <Alert.Base status="danger" title="Không tải được nội dung" description="Kết nối bị gián đoạn, thử lại sau ít phút." />
                    {/* `tone` = chỗ đặt: soft nằm TRONG surface (không đọc thành card-in-card), plain là alert nổi. */}
                    <Alert.Base tone="soft" status="warning" title="tone=soft" description="Hình của Feedback.Callout — dải tint phẳng trong surface." />
                    <Alert.Base tone="plain" status="warning" title="tone=plain" description="Hình của Toast.Base — tint mặc định HeroUI." />
                    {/* Skeleton = STATE, không phải leaf: khung + icon giữ THẬT, chỉ chữ thành gạch (§12c). */}
                    <Alert.Base status="accent" isSkeleton />
                    <Alert.Base status="danger" tone="plain" isSkeleton />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Đủ slot: action (footer) + close (×) + body tự do dưới description. */
export const WithActionAndClose: Story = {
    render: () => (
        <div className="max-w-xl p-8">
            <BlockAnatomy
                name="Alert.Base"
                tier="atom"
                leaf="WithActionAndClose"
                parts={FULL_PARTS}
                reason="Slot CÓ TÊN là đường chính: `title` header · `description`/`body` body · `action` footer. Nút × là `Button.Icon` (atom), tone lấy theo status — badge dừng ở node Close, không drill vào ruột atom."
                note="`body` (hoặc children) là vùng tự do — chỗ nhét list ngắn hay meta row."
                code={"<Alert.Base status=\"warning\" title=\"…\" action={<Button.Base … />} onClose={fn} />"}
            >
                <Alert.Base
                    status="warning"
                    title="Bạn chưa vào GitHub team của khoá"
                    description="Một số bài lab cần quyền repo — bấm để tham gia."
                    action={<Button.Base size="sm" label="Vào team" onPress={() => {}} />}
                    onClose={() => {}}
                    closeAriaLabel="Đóng"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
