import React from "react"
import { Card, CardContent, Skeleton as HeroSkeleton, Table, cn } from "@heroui/react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/skeleton/Skeleton`. Authored in Storybook (not `src`),
 * synced back to `src` later.
 *
 * FULL compound: a raw shimmer bar plus one placeholder per HeroUI / house
 * component, each sized to MATCH THE REAL COMPONENT'S BOX (text bars use glyph
 * height centered in the line box: `h-[F] my-[(L-F)/2]`) so layout never shifts
 * when data arrives. Build a loading state by MIRRORING the real layout tree:
 * keep structural nodes (separators, wrappers, gaps) and swap each content node
 * for its `Skeleton.<Piece>`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Raw shimmer bar — size it via `className` (e.g. `h-12 w-full rounded-xl`). */
const SkeletonBar = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn(className)} data-anat-part={anatPart} />
)

/** Typography variants whose glyph box the skeleton mirrors. */
export type SkeletonTypographyType =
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "body-sm" | "body-xs"

export type SkeletonTypographyWidth = "full" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4"

// bar height = font-size (glyph); vertical margin = (line-height - font-size)/2 → centered in the real box
const TYPE_TO_BAR: Record<SkeletonTypographyType, string> = {
    h1: "h-9 my-[2px]",
    h2: "h-[30px] my-[3px]",
    h3: "h-6 my-1",
    h4: "h-5 my-1",
    h5: "h-[18px] my-[5px]",
    h6: "h-4 my-1",
    body: "h-4 my-2",
    "body-sm": "h-[14px] my-[5px]",
    "body-xs": "h-3 my-1",
}

const WIDTH_TO_CLASS: Record<SkeletonTypographyWidth, string> = {
    full: "w-full",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "2/3": "w-2/3",
    "1/4": "w-1/4",
    "3/4": "w-3/4",
}

/**
 * Resolve a width token (`"full"`, `"1/2"`, …) to its Tailwind class, or pass an
 * ARBITRARY Tailwind width class (e.g. `"w-5/6"`, `"w-24"`) straight through —
 * absorbed from the former standalone `SkeletonText` so any width is expressible.
 */
const resolveWidth = (width: SkeletonTypographyWidth | (string & {})): string =>
    (WIDTH_TO_CLASS as Record<string, string>)[width] ?? width

/** Skeleton matching a `<Typography/>` line, sized to the variant's glyph box. */
const SkeletonTypography = ({
    type = "body-sm",
    width = "full",
    className,
    anatPart,
}: {
    type?: SkeletonTypographyType
    /** A width token (`"full"`, `"1/2"`, …) OR an arbitrary Tailwind width class (`"w-5/6"`). */
    width?: SkeletonTypographyWidth | (string & {})
    className?: string
    anatPart?: string
}) => (
    <HeroSkeleton
        className={cn("rounded", TYPE_TO_BAR[type], resolveWidth(width), className)}
        data-anat-part={anatPart}
    />
)

/**
 * Stepped decreasing widths cycled across paragraph lines (100% → 75% → 50%) so a
 * multi-line block reads like real prose instead of a solid rectangle — absorbed
 * from the former standalone `SkeletonParagraph` (opt-in via `stepped`).
 */
const PARAGRAPH_STEP_WIDTHS = ["w-full", "w-3/4", "w-1/2"] as const

/**
 * Skeleton matching a HeroUI prose paragraph (text-base leading-7, 16/28). Each
 * bar is the glyph height (h-4 = 16px) centered `my-[6px]` (6+6=12) so the line
 * box is exactly 28px (leading-7) — lines sit TIGHT like real prose, not loose.
 * The last line is shortened (w-2/3) to mimic a paragraph end.
 *
 * `type` overrides the glyph height with any {@link SkeletonTypographyType} box
 * (absorbed from the standalone's `size` prop); `stepped` swaps the shorten-last
 * width rhythm for the full→3/4→1/2 stepped progression.
 */
const SkeletonParagraph = ({
    lines = 3,
    type,
    stepped = false,
    className,
    anatPart,
}: {
    lines?: number
    /** Glyph-height token per line; defaults to prose (leading-7, `h-4 my-[6px]`). */
    type?: SkeletonTypographyType
    /** Use stepped decreasing widths (`w-full → w-3/4 → w-1/2`) instead of only shortening the last line. */
    stepped?: boolean
    className?: string
    anatPart?: string
}) => {
    const count = Math.max(1, lines)
    // Prose default keeps the tight leading-7 box; `type` swaps in the token's glyph height.
    const barHeight = type ? TYPE_TO_BAR[type] : "h-4 my-[6px]"
    return (
        <div className={cn("flex flex-col", className)} data-anat-part={anatPart}>
            {Array.from({ length: count }).map((_, index) => {
                const isLast = index === count - 1
                const width = stepped
                    ? isLast
                        ? PARAGRAPH_STEP_WIDTHS[PARAGRAPH_STEP_WIDTHS.length - 1]
                        : PARAGRAPH_STEP_WIDTHS[Math.min(index, PARAGRAPH_STEP_WIDTHS.length - 2)]
                    : isLast
                        ? "w-2/3"
                        : "w-full"
                return <HeroSkeleton key={index} className={cn(barHeight, "rounded", width)} />
            })}
        </div>
    )
}

/**
 * Skeleton matching a HeroUI <Input/> field box
 * (TextField/SearchField/NumberField/InputGroup).
 * Field box = min-h-9 (36px) + rounded-field (0.75rem = rounded-xl).
 */
const SkeletonInput = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("h-9 w-full rounded-xl", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <TextArea/> field box (multi-row). A real EMPTY
 * textarea is just an empty rounded field box, so this is ONE shimmer block sized
 * to the field footprint (rounded-field = rounded-xl), height derived from `rows`
 * — not stacked text bars (that would read as pre-filled content).
 */
const SkeletonTextArea = ({
    rows = 3,
    className,
    anatPart,
}: {
    rows?: number
    className?: string
    anatPart?: string
}) => (
    <div
        className={cn("w-full", className)}
        style={{ height: `${rows * 20 + 16}px` }}
        data-anat-part={anatPart}
    >
        <HeroSkeleton className="h-full w-full rounded-xl" />
    </div>
)

/**
 * Skeleton matching a HeroUI <Select/> trigger box.
 * Trigger: min-h-9 (36px), rounded-field (rounded-xl), pe-7 reserves space for
 * the trailing chevron indicator. We render the field bar plus a small square
 * block on the trailing edge to mirror the chevron footprint.
 */
const SkeletonSelect = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <div className={cn("relative w-full", className)} data-anat-part={anatPart}>
        <HeroSkeleton className="h-9 w-full rounded-xl" />
        <HeroSkeleton className="absolute end-3 top-1/2 size-4 -translate-y-1/2 rounded" />
    </div>
)

/**
 * Skeleton matching a HeroUI <Button/> box.
 * Button is h-10 on mobile / @app-md:h-9 (36px) with rounded-3xl — a full pill at this height.
 */
const SkeletonButton = ({
    className,
    width = "w-24",
    anatPart,
}: {
    className?: string
    width?: string
    anatPart?: string
}) => (
    <HeroSkeleton className={cn("h-10 @app-md:h-9 rounded-full", width, className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <Switch/> track.
 * The app globals.css override sizes the track to 2.25rem (h-9) × 4rem (w-16),
 * a fully rounded pill matching the navbar icon buttons (36px tall).
 */
const SkeletonSwitch = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("h-9 w-16 rounded-full", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <Checkbox/>.
 * Control is size-4 (16px) rounded-md; the label uses text-sm (body-sm 14/24),
 * so the label bar is the 14px glyph height centered in its 24px box (my-[5px]).
 * Row is gap-3 to match the checkbox label gap.
 */
const SkeletonCheckbox = ({
    className,
    withLabel = true,
    labelWidth = "w-32",
    anatPart,
}: {
    className?: string
    withLabel?: boolean
    labelWidth?: string
    anatPart?: string
}) => (
    <div className={cn("flex items-center gap-3", className)} data-anat-part={anatPart}>
        <HeroSkeleton className="size-4 shrink-0 rounded-md" />
        {withLabel && <HeroSkeleton className={cn("h-[14px] my-[5px] rounded", labelWidth)} />}
    </div>
)

/**
 * Skeleton matching a HeroUI <RadioGroup/>.
 * Group stacks vertically with gap-2 (matches the house RadioGroup `flex flex-col
 * gap-2`). Each radio is a circular size-4 dot (rounded-full) plus a text-sm
 * (body-sm 14/24) label bar centered in its box, dot↔label separated by gap-3
 * (matches `Radio.Content` `items-center gap-3`).
 */
const SkeletonRadioGroup = ({
    className,
    items = 3,
    labelWidth = "w-32",
    anatPart,
}: {
    className?: string
    items?: number
    labelWidth?: string
    anatPart?: string
}) => (
    <div className={cn("flex flex-col gap-2", className)} data-anat-part={anatPart}>
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
                <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                <HeroSkeleton className={cn("h-[14px] my-[5px] rounded", labelWidth)} />
            </div>
        ))}
    </div>
)

/**
 * Skeleton matching a HeroUI <Slider/>.
 * The track row is h-5 (rounded-xl). The thumb is a 5×5 (w-5 h-5) rounded handle
 * sitting on the track; here it is parked at the start to suggest the control.
 */
const SkeletonSlider = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <div className={cn("relative h-5 w-full", className)} data-anat-part={anatPart}>
        <HeroSkeleton className="absolute inset-0 h-5 w-full rounded-xl" />
        <HeroSkeleton className="absolute top-0 left-0 size-5 rounded-xl" />
    </div>
)

/** Avatar size matching HeroUI <Avatar/> (sm=size-8/md=size-10/lg=size-12). */
export type SkeletonAvatarSize = "sm" | "md" | "lg"

const AVATAR_SIZE_CLASS: Record<SkeletonAvatarSize, string> = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
}

/** Skeleton matching a HeroUI <Avatar/> box (square, circular shape). */
const SkeletonAvatar = ({
    size = "md",
    className,
    anatPart,
}: {
    size?: SkeletonAvatarSize
    className?: string
    anatPart?: string
}) => (
    <HeroSkeleton className={cn("rounded-full", AVATAR_SIZE_CLASS[size], className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <Chip/> box.
 * Chip: py-0.5 (4px) + text-xs leading-5 (20px) = 24px tall → h-6, pill shape.
 */
const SkeletonChip = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("h-6 w-16 rounded-full", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <Badge/> box (small size).
 * Badge --sm: min-h-4 min-w-4 → 16px square, circular shape.
 */
const SkeletonBadge = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("size-4 rounded-full", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <Kbd/> box.
 * Kbd: h-6 rounded-lg px-2.
 */
const SkeletonKbd = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("h-6 w-10 rounded-lg", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <ProgressBar/> track.
 * ProgressBar track: h-2, full-width bar.
 */
const SkeletonProgressBar = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("h-2 w-full rounded-full", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching the house `SegmentBar` block: a thin `h-2` rounded track over
 * a `flex-wrap` legend of colour-dot + label. Mirrors the bar AND the legend so
 * the loading state doesn't jump when the real distribution arrives. Pass
 * `legendItems` to match the expected slice count.
 */
const SkeletonSegmentBar = ({
    legendItems = 3,
    className,
    anatPart,
}: {
    legendItems?: number
    className?: string
    anatPart?: string
}) => (
    <div className={cn("flex flex-col gap-2", className)} data-anat-part={anatPart}>
        {/* the proportion track */}
        <HeroSkeleton className="h-2 w-full rounded-full" />
        {/* legend: dot + label per slice */}
        <div className="flex flex-wrap gap-x-3 gap-y-2">
            {Array.from({ length: legendItems }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                    <HeroSkeleton className="size-2 shrink-0 rounded-full" />
                    <HeroSkeleton className="my-1 h-3 w-12 rounded" />
                </div>
            ))}
        </div>
    </div>
)

/**
 * Skeleton matching a HeroUI <Meter/> track.
 * Meter track: h-2, full-width bar (same box as ProgressBar).
 */
const SkeletonMeter = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <HeroSkeleton className={cn("h-2 w-full rounded-full", className)} data-anat-part={anatPart} />
)

/**
 * Skeleton matching a HeroUI <Card/>: renders the REAL `Card` + `CardContent`
 * frame (border/radius/padding baked in) wrapping a title bar (body-sm 14px) over
 * body lines (body-xs 12px), so the loading box shares the card's exact footprint.
 */
const SkeletonCard = ({
    className,
    lines = 3,
    anatPart,
}: {
    className?: string
    lines?: number
    anatPart?: string
}) => (
    <Card className={className} data-anat-part={anatPart}>
        <CardContent className="flex flex-col gap-2">
            {/* Title (body-sm) */}
            <HeroSkeleton className="my-[5px] h-[14px] w-1/2 rounded" />
            {/* Body lines (body-xs) */}
            {Array.from({ length: lines }).map((_, index) => (
                <HeroSkeleton
                    key={index}
                    className={cn("h-3 rounded", index === lines - 1 ? "w-2/3" : "w-full")}
                />
            ))}
        </CardContent>
    </Card>
)

/**
 * Skeleton matching a HeroUI <Disclosure/> trigger row: an inline label bar
 * (text-sm/leading-5 -> h-[14px] my-[3px]) with a trailing size-4 indicator.
 */
const SkeletonDisclosure = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <div className={cn("relative flex items-center gap-2", className)} data-anat-part={anatPart}>
        <HeroSkeleton className="my-[3px] h-[14px] w-2/5 rounded" />
        <HeroSkeleton className="ml-auto size-4 shrink-0 rounded" />
    </div>
)

/**
 * Per-row config for {@link SkeletonAccordion} — absorbed from the former
 * standalone `AccordionSkeleton` so each trigger row can be sized/labelled and
 * optionally rendered expanded with a body slot.
 */
export type SkeletonAccordionItem = {
    /** Tailwind width class for the title bar (default `w-2/5`). */
    titleWidth?: string
    /** Glyph-height token for the title line (default `body-sm`). */
    titleSize?: SkeletonTypographyType
    /** When `false`, hides the trailing chevron placeholder (default shown). */
    showIndicator?: boolean
    /** When `true`, renders the expanded body slot under the title row. */
    expanded?: boolean
    /** Accessible name for the placeholder row. */
    ariaLabel?: string
}

/**
 * Skeleton matching a `SurfaceAccordionCard`: KEEPS the full surface FRAME
 * (rounded-3xl bg-surface + shadow-surface — surface blocks keep their surface AND
 * elevation in the skeleton so the card reads as a bounded surface, not a blank
 * region; only inner content becomes bars). Each item = an h-14 trigger row + a 1px
 * separator (the last item has no separator).
 *
 * Pass `items` as a NUMBER for N identical default rows, or as an ARRAY of
 * {@link SkeletonAccordionItem} for per-row width/size/indicator/expanded config.
 * `renderExpandedBody(index)` fills the body slot of rows flagged `expanded`.
 */
const SkeletonAccordion = ({
    items = 3,
    renderExpandedBody,
    className,
    anatPart,
    titleAnatPart,
    indicatorAnatPart,
    separatorAnatPart,
}: {
    items?: number | Array<SkeletonAccordionItem>
    renderExpandedBody?: (index: number) => React.ReactNode
    className?: string
    anatPart?: string
    /** Anatomy tag for each row's title bar (repeated per row — mirrors `Accordion.Item` repeating per real item). */
    titleAnatPart?: string
    /** Anatomy tag for each row's trailing indicator placeholder. */
    indicatorAnatPart?: string
    /** Anatomy tag for each row separator (the last row has none). */
    separatorAnatPart?: string
}) => {
    // Normalise: a number → that many default rows; an array → per-item config.
    const rows: Array<SkeletonAccordionItem> =
        typeof items === "number" ? Array.from({ length: Math.max(0, items) }, () => ({})) : items
    return (
        <div
            className={cn("w-full overflow-hidden rounded-3xl bg-surface shadow-surface", className)}
            data-anat-part={anatPart}
        >
            {rows.map((item, index) => {
                const showIndicator = item.showIndicator !== false
                const titleSize = item.titleSize ?? "body-sm"
                const titleWidth = item.titleWidth ?? "w-2/5"
                return (
                    <div key={index} className="relative" aria-label={item.ariaLabel}>
                        <div className="flex h-14 items-center justify-between px-4">
                            <HeroSkeleton
                                className={cn("rounded", TYPE_TO_BAR[titleSize], titleWidth)}
                                data-anat-part={titleAnatPart}
                            />
                            {showIndicator ? (
                                <HeroSkeleton className="size-4 rounded" data-anat-part={indicatorAnatPart} />
                            ) : null}
                        </div>
                        {item.expanded && renderExpandedBody ? (
                            <div className="px-4 pb-4">{renderExpandedBody(index)}</div>
                        ) : null}
                        {index < rows.length - 1 && (
                            <HeroSkeleton className="h-px w-full rounded-xs" data-anat-part={separatorAnatPart} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/**
 * Skeleton matching a HeroUI <Tabs/> list: an inline pill container (p-1)
 * holding count tab bars, each h-8 (rounded-3xl pill). The container box is
 * 32 + 8 = 40px tall, matching the real tab list.
 */
const SkeletonTabs = ({
    className,
    count = 3,
    anatPart,
}: {
    className?: string
    count?: number
    anatPart?: string
}) => (
    <div
        className={cn(
            "inline-flex gap-2 rounded-[calc(var(--radius)*2.5)] bg-default p-1",
            className,
        )}
        data-anat-part={anatPart}
    >
        {Array.from({ length: count }).map((_, index) => (
            <HeroSkeleton key={index} className="h-8 w-20 rounded-3xl" />
        ))}
    </div>
)

/**
 * Skeleton matching a HeroUI <Breadcrumbs/>: count crumb bars
 * (link text-sm/leading-5 -> h-[14px] my-[3px]) interleaved with size-3
 * separator icons.
 */
const SkeletonBreadcrumbs = ({
    className,
    count = 3,
    anatPart,
}: {
    className?: string
    count?: number
    anatPart?: string
}) => (
    <div className={cn("flex items-center", className)} data-anat-part={anatPart}>
        {Array.from({ length: count }).map((_, index) => (
            <React.Fragment key={index}>
                {/* Crumb item wrapper */}
                <div className="flex shrink-0 items-center">
                    <HeroSkeleton className="my-[3px] h-[14px] w-16 rounded" />
                </div>
                {/* Separator (size-3), omitted after the last crumb */}
                {index < count - 1 && <HeroSkeleton className="size-3 rounded-xs" />}
            </React.Fragment>
        ))}
    </div>
)

/** Prev/next arrow slot — a chevron centered in the SAME 32px box as a page button. */
const PAGINATION_ARROW_SLOT = "flex size-9 shrink-0 items-center justify-center @app-md:size-8"

/**
 * Skeleton matching a HeroUI <Pagination/> content row: real prev/next chevrons
 * (structural affordances) bracketing `count` page-number squares as skeleton —
 * i.e. `‹ [ske] [ske] [ske] ›`. Arrows sit in the SAME size-9/md:size-8 box as the
 * squares so all slots line up uniformly; gap-1 between.
 *
 * `center` stretches the row full-width and centers the controls (absorbed from
 * the former standalone `PaginationSkeleton`, whose default was centered).
 */
const SkeletonPagination = ({
    className,
    count = 3,
    center = false,
    anatPart,
}: {
    className?: string
    count?: number
    center?: boolean
    anatPart?: string
}) => (
    <div
        className={cn("flex items-center gap-1", center && "w-full justify-center", className)}
        data-anat-part={anatPart}
    >
        <div className={PAGINATION_ARROW_SLOT}>
            <CaretLeftIcon weight="bold" className="size-4 text-muted" aria-hidden focusable="false" />
        </div>
        {Array.from({ length: count }).map((_, index) => (
            <HeroSkeleton key={index} className="size-9 rounded-3xl @app-md:size-8" />
        ))}
        <div className={PAGINATION_ARROW_SLOT}>
            <CaretRightIcon weight="bold" className="size-4 text-muted" aria-hidden focusable="false" />
        </div>
    </div>
)

/**
 * Skeleton matching a HeroUI <Table/>: renders the REAL `Table` structure
 * (header + body rows, borders/padding baked in — rule: keep the real container
 * in the skeleton, only cell content becomes bars) with a `body-sm` glyph bar
 * (`h-[14px]` centered `my-[5px]`) in each header column + body cell.
 */
const SkeletonTable = ({
    rows = 3,
    cols = 3,
    className,
    anatPart,
}: {
    rows?: number
    cols?: number
    className?: string
    anatPart?: string
}) => (
    <Table variant="primary" aria-label="Đang tải bảng" className={className} data-anat-part={anatPart}>
        <Table.ScrollContainer>
            <Table.Content aria-label="Đang tải bảng">
                <Table.Header>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <Table.Column key={colIndex} id={`col-${colIndex}`} isRowHeader={colIndex === 0}>
                            <HeroSkeleton className="my-[5px] h-[14px] w-16 rounded" />
                        </Table.Column>
                    ))}
                </Table.Header>
                <Table.Body>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <Table.Row key={rowIndex} id={`row-${rowIndex}`}>
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <Table.Cell key={colIndex}>
                                    <HeroSkeleton className="my-[5px] h-[14px] w-full rounded" />
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
    </Table>
)

/** Text-width per option so bars read as LABELS, not full-width solid blocks. */
const LISTBOX_OPTION_WIDTHS = ["w-3/5", "w-2/5", "w-4/5", "w-1/2", "w-2/3"]

/**
 * Skeleton matching a HeroUI <ListBox/>: `p-1` container, each option a
 * `rounded-xl px-3 py-2` row (matches an option's padding) with a `body-sm`
 * glyph bar sized to the LABEL width (varying, not `w-full`) so it reads as a
 * text option rather than a solid block.
 */
const SkeletonListBox = ({
    items = 4,
    className,
    anatPart,
}: {
    items?: number
    className?: string
    anatPart?: string
}) => (
    <div className={cn("flex w-full flex-col gap-1 p-1", className)} data-anat-part={anatPart}>
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="rounded-xl px-3 py-2">
                <HeroSkeleton
                    className={cn("h-[14px] rounded", LISTBOX_OPTION_WIDTHS[index % LISTBOX_OPTION_WIDTHS.length])}
                />
            </div>
        ))}
    </div>
)

/** Skeleton matching a list row: optional leading dot · title (+optional subtitle) · optional trailing icon. */
const SkeletonListRow = ({
    withSubtitle = true,
    withLeading = true,
    withTrailing = false,
    className,
    anatPart,
}: {
    withSubtitle?: boolean
    withLeading?: boolean
    withTrailing?: boolean
    className?: string
    anatPart?: string
}) => (
    <div className={cn("flex min-w-0 items-center gap-3 py-2", className)} data-anat-part={anatPart}>
        {withLeading ? <HeroSkeleton className="size-8 shrink-0 rounded-full" /> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0">
            <HeroSkeleton className="my-[5px] h-[14px] w-1/2 rounded" />
            {withSubtitle ? <HeroSkeleton className="my-1 h-3 w-1/3 rounded" /> : null}
        </div>
        {withTrailing ? <HeroSkeleton className="ml-auto size-4 shrink-0 rounded" /> : null}
    </div>
)

/**
 * Skeleton matching a `Dropdown.Menu` of icon + label items (e.g. the account
 * menu). The menu has `p-1`; each item is `flex items-center gap-2 px-2 py-2`
 * with a leading `size-5` icon and a single `body-sm` label. Mirrors exactly
 * that — a round `size-5` icon placeholder + ONE short text bar per row.
 */
const SkeletonMenu = ({
    items = 4,
    className,
    anatPart,
}: {
    items?: number
    className?: string
    anatPart?: string
}) => (
    <div className={cn("flex w-full flex-col gap-1 p-1", className)} data-anat-part={anatPart}>
        {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 px-2 py-2">
                <HeroSkeleton className="size-5 shrink-0 rounded-full" />
                <HeroSkeleton className="h-[14px] w-24 rounded" />
            </div>
        ))}
    </div>
)

/**
 * Skeleton matching the house `UserCell` block: `flex items-center gap-2` with an
 * avatar plus a name line (`body-sm` 14/24) and an optional `@handle` line
 * (`body-xs` 12/20).
 *
 * - Avatar: `size-9` rounded-full (36px).
 * - Name bar: `h-3 w-24` in a 20px box (`my-1`) — matches name `leading-5`.
 * - Handle bar: `h-3 w-16` in a 16px box (`my-0`) — matches handle `leading-4`.
 */
const SkeletonUserCell = ({
    withHandle = true,
    className,
    anatPart,
}: {
    withHandle?: boolean
    className?: string
    anatPart?: string
}) => (
    <div className={cn("flex min-w-0 items-center gap-2", className)} data-anat-part={anatPart}>
        <HeroSkeleton className="size-9 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col gap-0">
            <HeroSkeleton className="my-1 h-3 w-24 rounded" />
            {withHandle ? <HeroSkeleton className="my-0 h-3 w-16 rounded" /> : null}
        </div>
    </div>
)

/**
 * Skeleton matching a house `MetricCard` — a FRAMED card (SectionCard) around
 * value + label + hint. Renders its own `Card` + `CardContent` frame with a value
 * bar (h4), a label bar (body-sm) and a hint bar (body-xs), so `<Skeleton.Metric/>`
 * shares MetricCard's exact box.
 */
const SkeletonMetric = ({ className, anatPart }: { className?: string; anatPart?: string }) => (
    <Card className={className} data-anat-part={anatPart}>
        <CardContent>
            <div className="flex flex-col gap-2">
                {/* Value (h4) */}
                <HeroSkeleton className="h-6 w-16 rounded" />
                {/* Label (body-sm) */}
                <HeroSkeleton className="my-[5px] h-[14px] w-2/3 rounded" />
                {/* Hint (body-xs) */}
                <HeroSkeleton className="h-3 w-24 rounded" />
            </div>
        </CardContent>
    </Card>
)

/**
 * Skeleton compound — a raw bar plus placeholders sized to match real components.
 * Build a loading state by MIRRORING the real layout tree: keep structural nodes
 * (separators, wrappers, gaps) and swap each content node for its `Skeleton.<Piece>`.
 */
export const Skeleton = Object.assign(SkeletonBar, {
    Typography: SkeletonTypography,
    Paragraph: SkeletonParagraph,
    Input: SkeletonInput,
    TextArea: SkeletonTextArea,
    Select: SkeletonSelect,
    Button: SkeletonButton,
    Switch: SkeletonSwitch,
    Checkbox: SkeletonCheckbox,
    RadioGroup: SkeletonRadioGroup,
    Slider: SkeletonSlider,
    Avatar: SkeletonAvatar,
    Chip: SkeletonChip,
    Badge: SkeletonBadge,
    Kbd: SkeletonKbd,
    ProgressBar: SkeletonProgressBar,
    SegmentBar: SkeletonSegmentBar,
    Meter: SkeletonMeter,
    Card: SkeletonCard,
    Disclosure: SkeletonDisclosure,
    Accordion: SkeletonAccordion,
    Tabs: SkeletonTabs,
    Breadcrumbs: SkeletonBreadcrumbs,
    Pagination: SkeletonPagination,
    Table: SkeletonTable,
    ListBox: SkeletonListBox,
    ListRow: SkeletonListRow,
    Menu: SkeletonMenu,
    UserCell: SkeletonUserCell,
    Metric: SkeletonMetric,
})
