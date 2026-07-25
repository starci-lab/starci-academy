import type { Meta, StoryObj } from "@storybook/nextjs"
import { SeeMoreLink } from "@sb-components/atoms/navigation/SeeMoreLink/SeeMoreLink"

const meta: Meta<typeof SeeMoreLink.Base> = {
    title: "Atoms/Navigation/SeeMoreLink",
    component: SeeMoreLink.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SeeMoreLink.Base>

/** `onPress`: the feature owns routing (e.g. a router push at the end of a list). */
export const OnPress: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink.Base onPress={() => {}} label="Xem thêm" />
        </div>
    ),
}

/** `href`: the destination is a fixed URL — takes priority over `onPress`. */
export const WithHref: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink.Base href="/courses" label="Xem tất cả khóa học" />
        </div>
    ),
}

/** `decorative`: the parent surface is the one press target — hover rides its `group` class. */
export const Decorative: Story = {
    render: () => (
        <div className="p-8">
            <div className="group w-fit cursor-pointer rounded-lg border border-default p-3">
                <SeeMoreLink.Base decorative label="Tiếp tục" />
            </div>
        </div>
    ),
}

/** `size="sm"` (default): sits beside a full section label. */
export const SizeSmall: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink.Base size="sm" onPress={() => {}} label="Xem thêm (sm)" />
        </div>
    ),
}

/** `size="xs"`: sits beside a small eyebrow / subtle label. */
export const SizeExtraSmall: Story = {
    render: () => (
        <div className="p-8">
            <SeeMoreLink.Base size="xs" onPress={() => {}} label="Xem thêm (xs)" />
        </div>
    ),
}
