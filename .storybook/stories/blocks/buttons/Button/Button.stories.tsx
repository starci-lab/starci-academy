import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"

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

/** Pick a variant by ROLE, not by the color you'd like to see: primary = the main CTA (at most 1 per surface), secondary = a supporting button PAIRED with a primary, tertiary = a supporting button that stands ALONE, ghost = transparent, outline = bordered, danger = a standalone destructive action, danger-soft = a delete button REPEATED in each item. */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Pick a variant by ROLE, not by the color you'd like to see: primary = the main CTA (at most 1 per surface) · " +
            "secondary = a supporting button PAIRED with a primary · tertiary = a supporting button that stands ALONE (quiet) · ghost = " +
            "transparent · outline = bordered · danger = a standalone destructive action · danger-soft = a delete button REPEATED in each " +
            "item (solid danger repeated across many rows is glaring). Don't paint buttons with bg-*/text-* classNames — color is a role " +
            "signal, and the variant handles it.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Primary</Label>
                    <Typography type="body-sm" color="muted">
                        The main CTA. At most one per surface — two primaries breaks the hierarchy and the eye doesn't know where to go.
                    </Typography>
                </div>
                <Button variant="primary">Enroll now</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Secondary</Label>
                    <Typography type="body-sm" color="muted">
                        A supporting button paired with a primary — two buttons sitting side by side.
                    </Typography>
                </div>
                <Button variant="secondary">Preview</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Tertiary</Label>
                    <Typography type="body-sm" color="muted">
                        A supporting button that stands alone, with no primary next to it (quiet).
                    </Typography>
                </div>
                <Button variant="tertiary">Skip</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Ghost</Label>
                    <Typography type="body-sm" color="muted">
                        Transparent, no background and no border — the quietest action on the surface.
                    </Typography>
                </div>
                <Button variant="ghost">Cancel</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Outline</Label>
                    <Typography type="body-sm" color="muted">
                        Bordered, transparent background. Use it on buttons that should read like an input (SearchButton, InputButtonLike) and for full-width secondary CTAs.
                    </Typography>
                </div>
                <Button variant="outline">Details</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        A standalone destructive action that needs to stand out (delete account).
                    </Typography>
                </div>
                <Button variant="danger">Delete account</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger soft</Label>
                    <Typography type="body-sm" color="muted">
                        A delete button repeated in each item — solid danger repeated across many rows glares over the whole page.
                    </Typography>
                </div>
                <Button variant="danger-soft">Delete</Button>
            </div>
        </div>
    ),
}

/** Three sizes + the disabled state: the main CTA uses size lg, supporting buttons md; sm for controls repeated within an item. */
export const SizesAndStates: Story = {
    parameters: {
        usage:
            "Three sizes + the disabled state. Main CTA = primary size lg (with a trailing ArrowRightIcon at the real call-site) · " +
            "supporting button = md · sm for controls repeated within each item. For async buttons use the isPending prop, DON'T " +
            "hand-roll isDisabled + a ternary.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Small</Label>
                    <Typography type="body-sm" color="muted">
                        A control repeated within each item of a list.
                    </Typography>
                </div>
                <Button variant="primary" size="sm">Submit</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Medium</Label>
                    <Typography type="body-sm" color="muted">
                        The default for a supporting button / sub-CTA (no icon).
                    </Typography>
                </div>
                <Button variant="primary" size="md">Submit</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Large</Label>
                    <Typography type="body-sm" color="muted">
                        The main CTA — at the real call-site it comes with a trailing ArrowRightIcon.
                    </Typography>
                </div>
                <Button variant="primary" size="lg">Submit</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Settings save (xl-bump)</Label>
                    <Typography type="body-sm" color="muted">
                        The "Lưu thay đổi" button ending every settings page — HeroUI Button has no size xl, so it&apos;s size lg + a bump className (h-12 px-8 text-base). Same treatment on ALL settings pages. Ref button.md §9.
                    </Typography>
                </div>
                <Button variant="primary" size="lg" className="h-12 self-start px-8 text-base">Lưu thay đổi</Button>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Disabled</Label>
                    <Typography type="body-sm" color="muted">
                        Not clickable because a condition isn't met yet. When waiting on the network use the isPending prop, don't hand-roll isDisabled + a ternary.
                    </Typography>
                </div>
                <Button variant="primary" isDisabled>Submit</Button>
            </div>
        </div>
    ),
}
