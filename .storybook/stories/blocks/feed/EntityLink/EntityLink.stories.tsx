import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { EntityLink } from "./EntityLink"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — an inline entity reference inside a feed/activity sentence (the actor
 * or the target). Almost a one-element PRIMITIVE: bold + clickable `Link` when an
 * `onPress` resolves, bold plain `span` when it doesn't — never a dead link.
 *
 * ANATOMY IS PER-LEAF: each leaf below (bấm được · không bấm được · đang xử lý)
 * carries its OWN BlockAnatomy reflecting the parts THAT leaf composes — there is
 * no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof EntityLink> = {
    title: "Design/Feed/EntityLink",
    component: EntityLink,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EntityLink>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// Clickable / pending leaves resolve a route → EntityLink renders the HeroUI Link.
const LINK_PARTS: Array<AnatomyNode> = [
    { name: "Link", tier: "primitive", role: "chữ đậm bấm được (HeroUI Link), gạch chân khi hover" },
]

// Not-clickable leaf shows BOTH branches: a resolvable actor (Link) + an
// unresolvable target that falls back to a plain bold span (no dead link).
const NOT_CLICKABLE_PARTS: Array<AnatomyNode> = [
    { name: "Link", tier: "primitive", role: "mốc resolve được → chữ đậm bấm được" },
    { name: "span", tier: "primitive", role: "mốc không resolve → chữ đậm thường, không phải link chết" },
]

export const Clickable: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="EntityLink"
                tier="design"
                leaf="Bấm được"
                parts={LINK_PARTS}
                reason="Mỗi mốc thực thể (người, bài học, thử thách, khóa học) trong câu activity của feed cần một cách hiển thị nhất quán: chữ đậm + gạch chân khi hover nếu resolve được route, chữ đậm thường nếu không — không bao giờ là link chết. Đây gần như một PRIMITIVE một-phần-tử (xem FLAGS)."
            >
                <span>
                    <EntityLink label="quochuy_backend" onPress={() => {}} showAnatomy />
                    {" "}đã hoàn thành thử thách{" "}
                    <EntityLink label="Xử lý luồng bất đồng bộ" onPress={() => {}} showAnatomy />
                </span>
            </BlockAnatomy>,
        ),
}

export const NotClickable: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="EntityLink"
                tier="design"
                leaf="Không bấm được"
                parts={NOT_CLICKABLE_PARTS}
                note="Thiếu onPress → mốc rơi về span chữ đậm thường (mục tiêu đã xoá / không resolve), khác composition với leaf bấm được."
            >
                <span>
                    <EntityLink label="minhanh_dev" onPress={() => {}} showAnatomy />
                    {" "}đã theo dõi{" "}
                    <EntityLink label="học viên đã xoá tài khoản" showAnatomy />
                </span>
            </BlockAnatomy>,
        ),
}

export const Pending: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="EntityLink"
                tier="design"
                leaf="Đang xử lý"
                parts={LINK_PARTS}
                note="Đang resolve/navigate → Link bị disable nhưng CÙNG composition với leaf bấm được."
            >
                <span>
                    <EntityLink label="thuha_ux" onPress={() => {}} isPending showAnatomy />
                    {" "}đã đạt mốc{" "}
                    <EntityLink label="Thiết kế hệ thống cho ứng dụng doanh nghiệp" onPress={() => {}} isPending showAnatomy />
                </span>
            </BlockAnatomy>,
        ),
}
