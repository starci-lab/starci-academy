import type { Meta, StoryObj } from "@storybook/nextjs"
import { Skeleton } from "./Skeleton"

const meta: Meta<typeof Skeleton> = {
    title: "Primitives/Skeletons/Skeleton",
    component: Skeleton,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Bar: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-3 p-8">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-28 w-full rounded-xl" />
        </div>
    ),
}

export const Typography: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-3 p-8">
            <Skeleton.Typography type="h3" width="2/3" />
            <Skeleton.Typography type="body-sm" />
            <Skeleton.Typography type="body-xs" width="1/2" />
        </div>
    ),
}

/** `width` also accepts an ARBITRARY Tailwind width class (absorbed from SkeletonText). */
export const TypographyCustomWidth: Story = {
    render: () => (
        <div className="flex w-96 flex-col gap-3 p-8">
            <Skeleton.Typography type="body" width="w-5/6" />
            <Skeleton.Typography type="body" width="w-24" />
            <Skeleton.Typography type="body-sm" width="w-[137px]" />
        </div>
    ),
}

export const Paragraph: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Paragraph lines={4} />
        </div>
    ),
}

/** Stepped widths (w-full → w-3/4 → w-1/2) + a larger glyph height (absorbed from SkeletonParagraph). */
export const ParagraphStepped: Story = {
    render: () => (
        <div className="w-96 p-8">
            <Skeleton.Paragraph lines={4} stepped type="h4" />
        </div>
    ),
}

export const Input: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Input />
        </div>
    ),
}

export const TextArea: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.TextArea rows={3} />
        </div>
    ),
}

export const Select: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Select />
        </div>
    ),
}

export const Button: Story = {
    render: () => (
        <div className="flex items-center gap-3 p-8">
            <Skeleton.Button />
            <Skeleton.Button width="w-full" />
        </div>
    ),
}

export const Switch: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.Switch />
        </div>
    ),
}

export const Checkbox: Story = {
    render: () => (
        <div className="flex flex-col gap-3 p-8">
            <Skeleton.Checkbox />
            <Skeleton.Checkbox withLabel={false} />
        </div>
    ),
}

export const RadioGroup: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.RadioGroup items={3} />
        </div>
    ),
}

export const Slider: Story = {
    render: () => (
        <div className="w-64 p-8">
            <Skeleton.Slider />
        </div>
    ),
}

export const Avatar: Story = {
    render: () => (
        <div className="flex items-center gap-3 p-8">
            <Skeleton.Avatar size="sm" />
            <Skeleton.Avatar size="md" />
            <Skeleton.Avatar size="lg" />
        </div>
    ),
}

export const Chip: Story = {
    render: () => (
        <div className="flex items-center gap-2 p-8">
            <Skeleton.Chip />
            <Skeleton.Chip />
            <Skeleton.Chip />
        </div>
    ),
}

export const Badge: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.Badge />
        </div>
    ),
}

export const Kbd: Story = {
    render: () => (
        <div className="flex items-center gap-2 p-8">
            <Skeleton.Kbd />
            <Skeleton.Kbd />
        </div>
    ),
}

export const ProgressBar: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.ProgressBar />
        </div>
    ),
}

export const SegmentBar: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.SegmentBar legendItems={3} />
        </div>
    ),
}

export const Meter: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Meter />
        </div>
    ),
}

export const Card: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Card lines={3} />
        </div>
    ),
}

export const Disclosure: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Disclosure />
        </div>
    ),
}

export const Accordion: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.Accordion items={4} />
        </div>
    ),
}

/** Per-row config: title width/size + hidden indicator (absorbed from AccordionSkeleton). */
export const AccordionPerItem: Story = {
    render: () => (
        <div className="w-full max-w-md p-8">
            <Skeleton.Accordion
                items={[
                    { titleWidth: "w-3/4", titleSize: "body" },
                    { titleWidth: "w-2/3", titleSize: "body-sm" },
                    { titleWidth: "w-1/2", showIndicator: false },
                ]}
            />
        </div>
    ),
}

/** One row expanded with a body slot (absorbed from AccordionSkeleton). */
export const AccordionExpanded: Story = {
    render: () => (
        <div className="w-full max-w-md p-8">
            <Skeleton.Accordion
                items={[
                    { titleWidth: "w-3/4" },
                    { titleWidth: "w-2/3", expanded: true },
                    { titleWidth: "w-5/6" },
                ]}
                renderExpandedBody={() => (
                    <div className="flex flex-col gap-2">
                        <Skeleton.Typography type="body-sm" width="full" />
                        <Skeleton.Typography type="body-sm" width="w-5/6" />
                        <Skeleton.Typography type="body-sm" width="2/3" />
                    </div>
                )}
            />
        </div>
    ),
}

export const Tabs: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.Tabs count={3} />
        </div>
    ),
}

export const Breadcrumbs: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.Breadcrumbs count={3} />
        </div>
    ),
}

export const Pagination: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.Pagination count={3} />
        </div>
    ),
}

/** Full-width centered row (absorbed from PaginationSkeleton's centered default). */
export const PaginationCentered: Story = {
    render: () => (
        <div className="w-full p-8">
            <Skeleton.Pagination count={5} center />
        </div>
    ),
}

export const Table: Story = {
    render: () => (
        <div className="p-8">
            <Skeleton.Table rows={3} cols={3} />
        </div>
    ),
}

export const ListBox: Story = {
    render: () => (
        <div className="w-80 p-8">
            <Skeleton.ListBox items={4} />
        </div>
    ),
}

export const ListRow: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-1 p-8">
            <Skeleton.ListRow withTrailing />
            <Skeleton.ListRow withTrailing />
            <Skeleton.ListRow withTrailing />
        </div>
    ),
}

/** Single-line: title bar only (no subtitle, no leading). */
export const SingleLine: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-1 p-8">
            <Skeleton.ListRow withLeading={false} withSubtitle={false} />
            <Skeleton.ListRow withLeading={false} withSubtitle={false} />
            <Skeleton.ListRow withLeading={false} withSubtitle={false} />
        </div>
    ),
}

export const Menu: Story = {
    render: () => (
        <div className="w-64 p-8">
            <Skeleton.Menu items={4} />
        </div>
    ),
}

export const UserCell: Story = {
    render: () => (
        <div className="flex flex-col gap-3 p-8">
            <Skeleton.UserCell />
            <Skeleton.UserCell withHandle={false} />
        </div>
    ),
}

export const Metric: Story = {
    render: () => (
        <div className="w-64 p-8">
            <Skeleton.Metric />
        </div>
    ),
}
