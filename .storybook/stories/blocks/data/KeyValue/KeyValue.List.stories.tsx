import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValue } from "@sb-components/blocks/data/KeyValue/KeyValue"
import { Skeleton } from "@sb-components/blocks/skeleton/Skeleton/Skeleton"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (§12f/§13) — `KeyValue.List` là khung DANH SÁCH LẶP: nó chỉ sở
 * hữu những gì sinh ra khi NHIỀU hàng đứng cạnh nhau — mapping `items`, nhịp `gap`
 * (§10), đường ngăn GIỮA các hàng (`divider`), và hình thái tóm tắt "N dòng + 1 dòng
 * tổng" (`emphasis` ở item cuối).
 *
 * Bố cục/bậc chữ của MỘT hàng (nhãn muted · giá trị medium · `hint`) là state của
 * `KeyValue.Row` → sống ở story `KeyValue.Row`, KHÔNG lặp lại ở đây.
 *
 * `Loading`: khung KHÔNG có cờ `isSkeleton` (nó không biết giá trị là gì, và số hàng
 * là do consumer quyết) — caller MIRROR bằng cách đổ `Skeleton.Typography` vào đúng
 * hai ô `label`/`value`, giữ nguyên khung + số hàng (§8, không nhảy layout).
 */
const meta: Meta<typeof KeyValue.List> = {
    title: "Layouts/Data/KeyValue/KeyValue.List",
    component: KeyValue.List,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeyValue.List>

/** Tóm tắt đơn hàng — `value` là chuỗi ĐÃ format (khung không đổi đơn vị/tiền tệ). */
const ITEMS = [
    { key: "tuition", label: "Học phí", value: "1.200.000 ₫" },
    { key: "discount", label: "Giảm giá", hint: "Mã STARCI20", value: "-200.000 ₫" },
    { key: "vat", label: "Thuế VAT", value: "0 ₫" },
]

/**
 * ANATOMY IS PER-LEAF. Con TRỰC TIẾP của list là `KeyValue.Row` — cùng tầng khung
 * (§11a: mỗi tầng chỉ badge con trực tiếp ở tier cao nhất). Nội tạng của một hàng
 * (`Label`/`Hint`/`Value`) là cây của `KeyValue.Row`, xem story riêng của nó.
 */
const LIST_PARTS: Array<AnatomyNode> = [
    {
        name: "Row",
        tier: "primitive",
        role: "một `KeyValue.Row` dựng từ `items[i]`",
        storyId: "layouts-data-keyvalue-keyvalue-row--default",
    },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    {
        name: "Row",
        tier: "primitive",
        role: "một `KeyValue.Row` dựng từ `items[i]`",
        storyId: "layouts-data-keyvalue-keyvalue-row--default",
    },
    { name: "Divider", tier: "atom", role: "`Divider.Base` GIỮA hai hàng — hàng cuối không kẻ" },
]

/** Default — `items` là DỮ LIỆU (§13b cấm children); gap mặc định `3` (hàng dọc). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="primitive"
                leaf="Default"
                parts={LIST_PARTS}
                reason="N cặp nhãn–giá trị CÙNG KIỂU ⇒ §13b bắt buộc `items`, cấm children. `gap` bị ÉP BẰNG TYPE về thang §10 (`0·1·2·3·6·8`) nên nhịp dọc không thể trôi khỏi thang — đây là lý do khung này tồn tại thay vì `flex flex-col` hand-roll ở call-site."
                code={`<KeyValue.List
  items={[
    { key: "tuition", label: "Học phí", value: "1.200.000 ₫" },
    { key: "discount", label: "Giảm giá", hint: "Mã STARCI20", value: "-200.000 ₫" },
    { key: "vat", label: "Thuế VAT", value: "0 ₫" },
  ]}
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.List showAnatomy items={ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithDivider — đường ngăn là SEAM giữa hai hàng: hàng CUỐI không kẻ. */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="primitive"
                leaf="WithDivider"
                parts={DIVIDER_PARTS}
                note="LIST quyết định đường kẻ, không phải hàng — nên không bao giờ thừa một vạch treo ở đáy. Khoảng trên/dưới vạch dùng CHUNG `gap` của list ⇒ nhịp luôn cân (§10a: một seam, một chủ)."
                code={"<KeyValue.List divider items={ITEMS} />"}
            >
                <div className="max-w-sm">
                    <KeyValue.List showAnatomy divider items={ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithTotal — hình thái tóm tắt: N dòng thường + dòng cuối `emphasis`, tách bằng kẻ. */
export const WithTotal: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="primitive"
                leaf="WithTotal"
                parts={DIVIDER_PARTS}
                note="Dòng tổng chỉ là một item có `emphasis` — khung KHÔNG tự cộng (không mang chức năng, §13). Consumer đưa vào con số đã tính + đã format."
                code={`<KeyValue.List
  divider
  items={[
    …ITEMS,
    { key: "total", label: "Tổng cộng", value: "1.000.000 ₫", emphasis: true },
  ]}
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.List
                        showAnatomy
                        divider
                        items={[...ITEMS, { key: "total", label: "Tổng cộng", value: "1.000.000 ₫", emphasis: true }]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — caller MIRROR: giữ khung + số hàng, chỉ đổ thanh skeleton vào 2 ô. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="primitive"
                leaf="Loading"
                parts={LIST_PARTS}
                note="Khung không sở hữu state tải (không có `isSkeleton`): số hàng và ý nghĩa từng ô là của consumer. Mirror giữ ĐÚNG cây thật — vẫn là `KeyValue.Row`, chỉ swap `label`/`value` sang `Skeleton.Typography` nên footprint không nhảy khi dữ liệu về."
                code={`<KeyValue.List
  items={ITEMS.map((item) => ({
    key: item.key,
    label: <Skeleton.Typography type="body-sm" width="w-24" />,
    value: <Skeleton.Typography type="body-sm" width="w-20" />,
  }))}
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.List
                        showAnatomy
                        items={ITEMS.map((item) => ({
                            key: item.key,
                            label: <Skeleton.Typography type="body-sm" width="w-24" />,
                            value: <Skeleton.Typography type="body-sm" width="w-20" />,
                        }))}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
