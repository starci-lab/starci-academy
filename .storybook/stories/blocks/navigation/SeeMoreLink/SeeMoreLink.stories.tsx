import type { Meta, StoryObj } from "@storybook/nextjs"
import { SeeMoreLink } from "./SeeMoreLink"

const meta: Meta<typeof SeeMoreLink> = {
    title: "Primitives/Navigation/SeeMoreLink",
    component: SeeMoreLink,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SeeMoreLink>

/** `onPress`: the feature owns routing (e.g. a router push at the end of a list). */
export const OnPress: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink onPress={() => {}}>Xem thêm</SeeMoreLink>
        </div>
    ),
}

/** `href`: the destination is a fixed URL — takes priority over `onPress`. */
export const WithHref: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink href="/courses">Xem tất cả khóa học</SeeMoreLink>
        </div>
    ),
}

/** `decorative`: the parent surface is the one press target — hover rides its `group` class. */
export const Decorative: Story = {
    render: () => (
        <div className="p-8">
            <div className="group w-fit cursor-pointer rounded-lg border border-default p-3">
                <SeeMoreLink decorative>Tiếp tục</SeeMoreLink>
            </div>
        </div>
    ),
}

/** `size="sm"` (default): sits beside a full section label. */
export const SizeSmall: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink size="sm" onPress={() => {}}>Xem thêm (sm)</SeeMoreLink>
        </div>
    ),
}

/** `size="xs"`: sits beside a small eyebrow / subtle label. */
export const SizeExtraSmall: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink size="xs" onPress={() => {}}>Xem thêm (xs)</SeeMoreLink>
        </div>
    ),
}
