import type { Meta, StoryObj } from "@storybook/nextjs"
import { Accordion } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Accordion.Base` bọc thẳng HeroUI `DisclosureGroup` + `Disclosure`, không
 * compose atom nào của HỆ có story riêng. NHƯNG (2026-07-27, heroui tier thêm vào
 * canon): mọi sub-part đó vẫn là import THẬT từ `@heroui/react`, nên mỗi node vẫn
 * khai `tier: "heroui"` trong `ANNOTATE` bên dưới — tên khớp Y HỆT identifier import
 * (`DisclosureGroup`/`Disclosure`/`Disclosure.Trigger`/`Disclosure.Indicator`/
 * `Disclosure.Content`/`Skeleton`), KHÔNG cần `storyId` vì không có story CỦA TA để
 * nhảy sang. Trước 2026-07-27 các node này bị BỎ SÓT hoàn toàn (annotate rỗng) —
 * cây "nói dối bằng cách bỏ sót" dù compound HeroUI vẫn render thật.
 *
 * Bộ leaf = `Default` (trần, prop `items`) + `Single`/`Multiple` (prop `allowsMultiple`,
 * mỗi ô dùng `defaultExpandedKeys` để MỞ SẴN panel — vì `allowsMultiple` chỉ đổi HÀNH VI
 * lúc tương tác, không dựng state thì hai ô mount y hệt nhau) + `Skeleton` (prop
 * `isSkeleton`). Leaf `DefaultOpen` cũ đã GỘP vào `Single` — cùng cơ chế
 * `defaultExpandedKeys` mở một panel, tách riêng sẽ ra hai ô trùng hình (2026-07-26).
 *
 * `Skeleton` đổi tên từ `Loading` (2026-07-27, thầy chốt: leaf mang TÊN PROP, không
 * mang tên tình huống — prop sinh ra leaf này là `isSkeleton`). Atom không có trục
 * size/variant nào khác cho skeleton bám vào (chỉ `items`/`allowsMultiple`, không
 * đổi hình lúc `isSkeleton`) nên MỘT cách render là đủ theo §12g — không có nấc nào
 * bị bỏ sót.
 */

const meta: Meta<typeof Accordion.Base> = {
    title: "Atoms/Navigation/Accordion/Accordion.Base",
    component: Accordion.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Accordion.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "DisclosureGroup": { tier: "heroui", role: "owns single-open vs multi-open expansion across every panel" },
    "Disclosure": { tier: "heroui", role: "one FAQ panel — trigger row plus its collapsible content" },
    "Disclosure.Trigger": { tier: "heroui", role: "the pressable row that opens/closes this panel" },
    "Disclosure.Indicator": { tier: "heroui", role: "the chevron that rotates when the panel opens" },
    "Disclosure.Content": { tier: "heroui", role: "the collapsible region holding this panel's body" },
    "Skeleton": { tier: "heroui", role: "shimmer bar standing in for a trigger row's title or chevron" },
}

const FAQ_ITEMS = [
    { key: "refund", title: "Refund policy?", content: "Full refund within the first 7 days if you haven't completed more than 20% of the content." },
    { key: "cert", title: "Do I get a certificate?", content: "You get a certificate of completion once you pass the final exam." },
    { key: "access", title: "How long do I have access?", content: "Lifetime, pay once and revisit whenever you want." },
]

/** Leaf TRẦN — chỉ `items`, mọi panel đóng. Là leaf của prop `items` (§12g.2: content prop → Default chính là leaf của nó). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `items`"
                reason="This is the one accordion atom in the system, wrapping HeroUI's DisclosureGroup and Disclosure directly with no other component composed inside it."
                states={[
                    {
                        name: "items = 3 FAQ entries, allowsMultiple unset",
                        why: "`items` renders one Disclosure per entry, giving three panels here, and all three sit collapsed because nothing has been toggled open yet. This bare leaf is the shape a caller reaches for with only the data prop set, before any open behavior is pinned in.",
                        code: "<Accordion.Base items={FAQ_ITEMS} />",
                        render: <Accordion.Base items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Single — `allowsMultiple=false` (mặc định): mở panel này thì panel khác tự đóng.
 * `allowsMultiple` chỉ lộ ra khi TƯƠNG TÁC, nên leaf này dùng `defaultExpandedKeys` để
 * mở sẵn MỘT panel — vừa cho thấy hình khác `Default`, vừa là cặp đối chứng với `Multiple`.
 */
export const Single: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Single"
                reason="Single and Multiple share the same items and the same defaultExpandedKeys mechanism; only how many panels the group lets stay open at once tells them apart."
                states={[
                    {
                        name: "allowsMultiple unset (defaults false), defaultExpandedKeys = [\"refund\"]",
                        why: "allowsMultiple defaults to false, so opening one panel closes any other automatically, and defaultExpandedKeys seeds one panel open so that mutually-exclusive behavior has a visible shape at mount. Without seeding a panel open here, this leaf would mount looking identical to Multiple, and the reader could never tell single-open from multi-open just by looking.",
                        code: "<Accordion.Base defaultExpandedKeys={[\"refund\"]} items={FAQ_ITEMS} /> {/* allowsMultiple defaults to false */}",
                        render: <Accordion.Base defaultExpandedKeys={["refund"]} items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Multiple — `allowsMultiple` bật: nhiều panel mở độc lập cùng lúc. `defaultExpandedKeys`
 * mở sẵn HAI panel để hình này thật sự khác `Single` (một panel) ngay lúc mount.
 */
export const Multiple: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Multiple"
                states={[
                    {
                        name: "allowsMultiple = true, defaultExpandedKeys = [\"refund\", \"cert\"]",
                        why: "allowsMultiple lets panels expand independently, and two of the three start open together here, a count Single can never show at once. Same items, same defaultExpandedKeys mechanism as Single, only the number of panels open at mount differs.",
                        code: "<Accordion.Base allowsMultiple defaultExpandedKeys={[\"refund\", \"cert\"]} items={FAQ_ITEMS} />",
                        render: <Accordion.Base allowsMultiple defaultExpandedKeys={["refund", "cert"]} items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Skeleton — atom tự vẽ leaf skeleton (hàng trigger đóng); không dùng Skeleton.*. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The atom swaps every panel row for its own shimmer bar instead of forwarding to a shared Skeleton component, so it draws exactly the closed-trigger shape it will hold once real data lands. This is what the FAQ list looks like while it hasn't loaded yet.",
                        code: "<Accordion.Base isSkeleton items={FAQ_ITEMS} />",
                        render: <Accordion.Base isSkeleton items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
