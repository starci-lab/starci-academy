import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * Reference table for the HeroUI `Button` — the base primitive behind every button in the app
 * (the blocks in the `Core/Button` family are all built on it). It lives here so you can look up
 * "what does each variant look like" next to its sibling blocks, rather than splitting it into a
 * separate branch.
 */
const meta: Meta<typeof Button> = {
    title: "Primitives/Actions/Button",
    component: Button,
}
export default meta
type Story = StoryObj<typeof Button>

/**
 * Toàn bộ ma trận role + size + state của Button: 7 variant theo VAI TRÒ (không chọn theo
 * màu muốn thấy), 3 size, một biến thể xl-bump của settings, và trạng thái disabled.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Pick a variant by ROLE, not by the color you'd like to see: primary = the main CTA (at most 1 per surface) · " +
            "secondary = a supporting button PAIRED with a primary · tertiary = a supporting button that stands ALONE (quiet) · ghost = " +
            "transparent · outline = bordered · danger = a standalone destructive action · danger-soft = a delete button REPEATED in each " +
            "item (solid danger repeated across many rows is glaring). Don't paint buttons with bg-*/text-* classNames — color is a role " +
            "signal, and the variant handles it. Sizes: main CTA = lg (with a trailing ArrowRightIcon at the real call-site) · supporting " +
            "button = md · sm for controls repeated within an item. For async buttons use the isPending prop, DON'T hand-roll isDisabled + " +
            "a ternary.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Primary"
                hint="The main CTA. At most one per surface — two primaries breaks the hierarchy and the eye doesn't know where to go."
            >
                <Button variant="primary">Enroll now</Button>
            </Variant>
            <Variant
                label="Secondary"
                hint="A supporting button paired with a primary — two buttons sitting side by side."
            >
                <Button variant="secondary">Preview</Button>
            </Variant>
            <Variant
                label="Tertiary"
                hint="A supporting button that stands alone, with no primary next to it (quiet)."
            >
                <Button variant="tertiary">Skip</Button>
            </Variant>
            <Variant
                label="Ghost"
                hint="Transparent, no background and no border — the quietest action on the surface."
            >
                <Button variant="ghost">Cancel</Button>
            </Variant>
            <Variant
                label="Outline"
                hint="Bordered, transparent background. Use it on buttons that should read like an input (SearchButton, InputButtonLike) and for full-width secondary CTAs."
            >
                <Button variant="outline">Details</Button>
            </Variant>
            <Variant
                label="Danger"
                hint="A standalone destructive action that needs to stand out (delete account)."
            >
                <Button variant="danger">Delete account</Button>
            </Variant>
            <Variant
                label="Danger soft"
                hint="A delete button repeated in each item — solid danger repeated across many rows glares over the whole page."
            >
                <Button variant="danger-soft">Delete</Button>
            </Variant>
            <Variant
                label="Small"
                hint="A control repeated within each item of a list."
            >
                <Button variant="primary" size="sm">Submit</Button>
            </Variant>
            <Variant
                label="Medium"
                hint="The default for a supporting button / sub-CTA (no icon)."
            >
                <Button variant="primary" size="md">Submit</Button>
            </Variant>
            <Variant
                label="Large"
                hint="The main CTA — at the real call-site it comes with a trailing ArrowRightIcon."
            >
                <Button variant="primary" size="lg">Submit</Button>
            </Variant>
            <Variant
                label="Settings save (xl-bump)"
                hint="The 'Lưu thay đổi' button ending every settings page — HeroUI Button has no size xl, so it's size lg + a bump className (h-12 px-8 text-base). Same treatment on ALL settings pages. Ref button.md §9."
            >
                <Button variant="primary" size="lg" className="h-12 self-start px-8 text-base">Lưu thay đổi</Button>
            </Variant>
            <Variant
                label="Disabled"
                hint="Not clickable because a condition isn't met yet. When waiting on the network use the isPending prop, don't hand-roll isDisabled + a ternary."
            >
                <Button variant="primary" isDisabled>Submit</Button>
            </Variant>
        </Gallery>
    ),
}
