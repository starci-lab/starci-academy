import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { SectionHeading } from "@/components/blocks/marketing/SectionHeading"

const meta: Meta<typeof SectionHeading> = {
    title: "Core/Marketing/SectionHeading",
    component: SectionHeading,
}
export default meta
type Story = StoryObj<typeof SectionHeading>

/** Use as the default marketing section heading: an eyebrow that reinforces the brand, a bold title, and one short line of description below. */
export const Default: Story = {
    parameters: { usage: "Use as the default marketing section heading: an eyebrow that reinforces the brand, a bold title, and one short line of description below." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default (centered)</Label>
                <Typography type="body-sm" color="muted">
                    For a standard marketing section heading — eyebrow + bold title + one line of description, centered.
                </Typography>
            </div>
            <SectionHeading
                eyebrow="Real learning"
                title="A learning path designed for working professionals"
                intro="From fundamentals to hands-on projects, every course is tied to a tangible product you can hold."
            />
        </div>
    ),
}

/** Use when the heading needs left alignment to match a content-column or sidebar layout, instead of the marketing section's default centering. */
export const AlignedStart: Story = {
    parameters: { usage: "Use when the heading needs left alignment to match a content-column or sidebar layout, instead of the marketing section's default centering." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Left-aligned</Label>
                <Typography type="body-sm" color="muted">
                    Use when the heading has to match a content-column or sidebar layout — left-aligned instead of the default centering.
                </Typography>
            </div>
            <SectionHeading
                align="start"
                title="Frequently asked questions"
                intro="The most common questions before you enroll in a course."
            />
        </div>
    ),
}

/** Use when the section needs to be referenced directly by URL (for example from a table of contents or navigation menu), showing a "#" next to the title to copy the link. */
export const WithAnchorLink: Story = {
    parameters: { usage: "Use when the section needs to be referenced directly by URL (for example from a table of contents or navigation menu), showing a \"#\" next to the title to copy the link." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With URL anchor</Label>
                <Typography type="body-sm" color="muted">
                    Use when the section needs to be linked directly by URL (from a table of contents / menu) — an anchor appears next to the title to copy the link.
                </Typography>
            </div>
            <SectionHeading
                title="Tuition and offers"
                intro="See the full details of tuition plans, installment options, and current offers."
                anchorId="hoc-phi"
            />
        </div>
    ),
}

/** Use the minimal version with no eyebrow and no intro when the title is already clear enough, avoiding redundant content in a short section. */
export const TitleOnly: Story = {
    parameters: { usage: "Use the minimal version with no eyebrow and no intro when the title is already clear enough, avoiding redundant content in a short section." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Title only</Label>
                <Typography type="body-sm" color="muted">
                    Use the minimal version (drop the eyebrow and intro) when the title is already clear — avoiding redundancy in a short section.
                </Typography>
            </div>
            <SectionHeading title="Training partners" />
        </div>
    ),
}
