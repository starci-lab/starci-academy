import type { Meta, StoryObj } from "@storybook/nextjs"
import { Accordion } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Accordion.Base` bọc thẳng HeroUI `DisclosureGroup` + `Disclosure`, không
 * compose atom nào khác có story riêng (Item/Trigger/Indicator/Content/Skeleton
 * chỉ là KHE nội bộ). Theo canon §12g: atom lá bọc thẳng HeroUI ⇒ KHÔNG có deps
 * ⇒ BỎ HẲN prop `annotate` trên mọi leaf bên dưới (thầy chốt 2026-07-26).
 *
 * Bộ leaf = `Default` (trần, prop `items`) + `Single`/`Multiple` (prop `allowsMultiple`,
 * mỗi ô dùng `defaultExpandedKeys` để MỞ SẴN panel — vì `allowsMultiple` chỉ đổi HÀNH VI
 * lúc tương tác, không dựng state thì hai ô mount y hệt nhau) + `Loading` (prop
 * `isSkeleton`). Leaf `DefaultOpen` cũ đã GỘP vào `Single` — cùng cơ chế
 * `defaultExpandedKeys` mở một panel, tách riêng sẽ ra hai ô trùng hình (2026-07-26).
 */

const meta: Meta<typeof Accordion.Base> = {
    title: "Atoms/Navigation/Accordion/Accordion.Base",
    component: Accordion.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Accordion.Base>

const FAQ_ITEMS = [
    { key: "refund", title: "Refund policy?", content: "Full refund within the first 7 days if you haven't completed more than 20% of the content." },
    { key: "cert", title: "Do I get a certificate?", content: "You get a certificate of completion once you pass the final exam." },
    { key: "access", title: "How long do I have access?", content: "Lifetime — pay once, revisit whenever you want." },
]

/** Leaf TRẦN — chỉ `items`, mọi panel đóng. Là leaf của prop `items` (§12g.2: content prop → Default chính là leaf của nó). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                leaf="Prop `items`"
                reason="The one accordion atom, wrapping HeroUI's DisclosureGroup and Disclosure. `items` renders one Disclosure per entry — three panels here, all collapsed on first mount."
                code={"<Accordion.Base items={FAQ_ITEMS} />"}
            >
                <Accordion.Base items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
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
                leaf="Single"
                reason="allowsMultiple defaults to false: only one panel can stay open. defaultExpandedKeys seeds that one open panel so the mutually-exclusive behavior has a visible shape — without it, this leaf would mount identically to Multiple."
                code={"<Accordion.Base defaultExpandedKeys={[\"refund\"]} items={FAQ_ITEMS} /> {/* allowsMultiple defaults to false */}"}
            >
                <Accordion.Base defaultExpandedKeys={["refund"]} items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
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
                leaf="Multiple"
                note="allowsMultiple lets panels expand independently — two panels start open together here, something single-open can never show at once. Compare against Single: same items, same defaultExpandedKeys mechanism, different count of panels open."
                code={"<Accordion.Base allowsMultiple defaultExpandedKeys={[\"refund\", \"cert\"]} items={FAQ_ITEMS} />"}
            >
                <Accordion.Base allowsMultiple defaultExpandedKeys={["refund", "cert"]} items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (hàng trigger đóng); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Accordion.Base"
                tier="atom"
                leaf="Loading"
                note="isSkeleton renders a shimmer row per item, owned by the atom, while the FAQ data hasn't loaded yet."
                code={"<Accordion.Base isSkeleton items={FAQ_ITEMS} />"}
            >
                <Accordion.Base isSkeleton items={FAQ_ITEMS} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
