import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    Accordion,
    Badge,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Disclosure,
    Input,
    Kbd,
    ListBox,
    Meter,
    Pagination,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Switch,
    Table,
    Tabs,
    TextArea,
    Typography,
} from "@heroui/react"
import { BellIcon, CaretRightIcon, GearIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { ListRow } from "@/components/blocks/lists/ListRow"
import { MetricCard } from "@/components/blocks/stats/MetricCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { Gallery, Variant } from "../../../../story-kit"
import { SkeletonGroup, SkeletonRow, TYPE_ROWS } from "./components"

const meta: Meta<typeof Skeleton> = {
    title: "Legacy/Blocks/Feedback/Skeleton",
    component: Skeleton,
}
export default meta
type Story = StoryObj<typeof Skeleton>

/**
 * Toàn bộ story tra-cứu của Skeleton: khối shimmer thô tự định cỡ, bảng tra kích
 * thước Typography theo từng tier chữ, bảng tra TOÀN BỘ loại skeleton theo từng
 * component thật tương ứng (text/form/identity/progress/containers/navigation/
 * lists), và một ví dụ ghép đúng cách (mirror layout tree thật). Dùng để tra khi
 * build loading state: tìm state khớp nhu cầu rồi copy cách ghép.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Khối thô (raw block)"
                hint="Dùng khi cần một khối shimmer không khớp component cụ thể nào — tự định cỡ qua className (h / w / rounded)."
            >
                <div className="flex w-80 flex-col gap-3">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                </div>
            </Variant>

            <Variant
                label="Kích thước Typography theo tier chữ"
                hint="Chọn `Skeleton.Typography type=…` khớp TIER CHỮ thật: thanh có chiều cao đúng font-size và căn giữa dòng, nên nội dung về không làm lệch layout. Áp dụng cho cả `<Typography type=…>` và `<div className=&quot;text-…&quot;>` (cùng font/line-height ⇒ cùng skeleton). Cột trái là skeleton, cột phải là Typography thật cùng type để đối chiếu chiều cao."
            >
                <div className="flex w-[820px] flex-col gap-8">
                    <SkeletonGroup title="Text tier (type · size)">
                        {TYPE_ROWS.map((row) => (
                            <SkeletonRow
                                key={row.type}
                                label={`${row.type} · ${row.size}`}
                                desc={row.desc}
                                skeleton={<Skeleton.Typography type={row.type} width="2/3" />}
                                real={<Typography type={row.type}>{row.sample}</Typography>}
                            />
                        ))}
                    </SkeletonGroup>

                    <SkeletonGroup title="Paragraph (multi-line)">
                        <SkeletonRow
                            label="Paragraph · 4 lines"
                            desc="Multi-line paragraph packed together (text-base leading-7, 28px line-box); applies to both Typography and a div text-base leading-7. lines matches the estimated line count, last line shorter."
                            skeleton={<Skeleton.Paragraph lines={4} />}
                            real={(
                                <div className="text-base leading-7">
                                    The course goes from web fundamentals to a complete project, one topic per week with auto-graded exercises, ending in a product you drop straight into your résumé.
                                </div>
                            )}
                        />
                    </SkeletonGroup>
                </div>
            </Variant>

            <Variant
                label="Bảng tra toàn bộ loại skeleton theo component"
                hint="Tra bảng để chọn ĐÚNG piece khi build loading state: tìm kind khớp node thật rồi thay vào. Mỗi hàng đặt piece skeleton (trái) cạnh component thật nó mô phỏng (phải) để đối chiếu khung. Nguyên tắc là mirror layout tree THẬT — giữ các node cấu trúc (separator, wrapper, gap) và chỉ thay node nội dung bằng Skeleton.<Component>, đừng rải shimmer tuỳ tiện. Cần khối thô không khớp component nào thì dùng variant Khối thô ở trên."
            >
                <div className="flex w-[820px] flex-col gap-8">
                    <SkeletonGroup title="Text">
                        <SkeletonRow
                            label="Typography"
                            desc="When the real node is a single line of text like a heading or label; choose the type matching the real text tier."
                            skeleton={<Skeleton.Typography type="h3" width="2/3" />}
                            real={<Typography type="h3">Sample heading</Typography>}
                        />
                        <SkeletonRow
                            label="Paragraph"
                            desc="When the real node is a multi-line paragraph; set lines to the estimated line count."
                            skeleton={<Skeleton.Paragraph lines={3} />}
                            real={
                                <div className="flex flex-col gap-1">
                                    <Typography type="body-sm">The course goes from fundamentals to a real project.</Typography>
                                    <Typography type="body-sm">One topic per week with graded exercises.</Typography>
                                    <Typography type="body-sm">Ending in a product for your résumé.</Typography>
                                </div>
                            }
                        />
                    </SkeletonGroup>

                    <SkeletonGroup title="Form">
                        <SkeletonRow
                            label="Input"
                            desc="When the real node is a single-line input."
                            skeleton={<Skeleton.Input />}
                            real={<Input variant="secondary" placeholder="you@email.com" />}
                        />
                        <SkeletonRow
                            label="Select"
                            desc="When the real node is a select with a dropdown arrow."
                            skeleton={<Skeleton.Select />}
                            real={
                                <Select.Root<{ id: string }, "single"> aria-label="Level" defaultSelectedKey="mid">
                                    <Select.Trigger aria-label="Level">
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox.Root aria-label="Level">
                                            <ListBox.Item id="junior" textValue="Junior">Junior</ListBox.Item>
                                            <ListBox.Item id="mid" textValue="Mid-level">Mid-level</ListBox.Item>
                                            <ListBox.Item id="senior" textValue="Senior">Senior</ListBox.Item>
                                        </ListBox.Root>
                                    </Select.Popover>
                                </Select.Root>
                            }
                        />
                        <SkeletonRow
                            label="TextArea"
                            desc="When the real node is a multi-line text area; rows matches the real height."
                            skeleton={<Skeleton.TextArea rows={3} />}
                            real={<TextArea rows={3} placeholder="Write your note…" className="resize-none" />}
                        />
                        <SkeletonRow
                            label="Slider"
                            desc="When the real node is a slider for picking a value."
                            skeleton={<div className="w-56"><Skeleton.Slider /></div>}
                            real={<div className="w-56"><Slider aria-label="Volume" defaultValue={40} /></div>}
                        />
                        <SkeletonRow
                            label="Button"
                            desc="When the real node is a button."
                            skeleton={<Skeleton.Button />}
                            real={<Button size="sm">Save changes</Button>}
                        />
                        <SkeletonRow
                            label="Switch"
                            desc="When the real node is an on/off switch."
                            skeleton={<Skeleton.Switch />}
                            real={
                                <Switch defaultSelected aria-label="Receive email notifications">
                                    <Switch.Content>
                                        <Switch.Control>
                                            <Switch.Thumb />
                                        </Switch.Control>
                                    </Switch.Content>
                                </Switch>
                            }
                        />
                        <SkeletonRow
                            label="Checkbox"
                            desc="When the real node is a checkbox."
                            skeleton={<Skeleton.Checkbox />}
                            real={
                                <Checkbox defaultSelected aria-label="Remember me">
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Checkbox.Content>Remember me</Checkbox.Content>
                                </Checkbox>
                            }
                        />
                        <SkeletonRow
                            label="RadioGroup"
                            desc="When the real node is a single-select radio group."
                            skeleton={<Skeleton.RadioGroup items={2} />}
                            real={
                                <RadioGroup aria-label="Notification frequency" defaultValue="daily" className="flex flex-col gap-2">
                                    <Radio value="instant">
                                        <Radio.Content>
                                            <Radio.Control>
                                                <Radio.Indicator />
                                            </Radio.Control>
                                            Instantly
                                        </Radio.Content>
                                    </Radio>
                                    <Radio value="daily">
                                        <Radio.Content>
                                            <Radio.Control>
                                                <Radio.Indicator />
                                            </Radio.Control>
                                            Daily summary
                                        </Radio.Content>
                                    </Radio>
                                </RadioGroup>
                            }
                        />
                    </SkeletonGroup>

                    <SkeletonGroup title="Identity">
                        <SkeletonRow
                            label="Avatar"
                            desc="When the real node is a round avatar; size matches the real avatar."
                            skeleton={<Skeleton.Avatar size="lg" />}
                            real={<UserAvatar username="levan.dev" size="lg" />}
                        />
                        <SkeletonRow
                            label="UserCell"
                            desc="When the real node is a user cell with an avatar and name."
                            skeleton={<Skeleton.UserCell />}
                            real={<UserCell username="levan.dev" displayName="David Le" handle="@levan.dev" size="sm" />}
                        />
                        <SkeletonRow
                            label="Chip"
                            desc="When the real node is a small rounded chip."
                            skeleton={<Skeleton.Chip />}
                            real={<Chip color="accent" variant="soft"><Chip.Label>In progress</Chip.Label></Chip>}
                        />
                        <SkeletonRow
                            label="Kbd"
                            desc="When the real node is a keyboard shortcut shown as keys."
                            skeleton={<Skeleton.Kbd />}
                            real={<Kbd><Kbd.Content>Ctrl</Kbd.Content><Kbd.Content>K</Kbd.Content></Kbd>}
                        />
                        <SkeletonRow
                            label="Badge"
                            desc="When the real node is a numeric badge or corner dot."
                            skeleton={<Skeleton.Badge />}
                            real={
                                <Badge.Anchor>
                                    <BellIcon className="size-5" />
                                    <Badge size="sm" color="accent">3</Badge>
                                </Badge.Anchor>
                            }
                        />
                    </SkeletonGroup>

                    <SkeletonGroup title="Progress / metrics">
                        <SkeletonRow
                            label="ProgressBar"
                            desc="When the real node is a linear progress bar."
                            skeleton={<div className="w-56"><Skeleton.ProgressBar /></div>}
                            real={<div className="w-56"><ProgressMeter value={65} showValue label="Course progress" /></div>}
                        />
                        <SkeletonRow
                            label="Meter"
                            desc="When the real node is a meter showing a value level."
                            skeleton={<div className="w-56"><Skeleton.Meter /></div>}
                            real={
                                <div className="w-56">
                                    <Meter value={72} aria-label="Storage used">
                                        <Meter.Track>
                                            <Meter.Fill />
                                        </Meter.Track>
                                    </Meter>
                                </div>
                            }
                        />
                        <SkeletonRow
                            label="SegmentBar"
                            desc="When the real node is a segmented bar with a legend; legendItems matches the item count."
                            skeleton={<div className="w-56"><Skeleton.SegmentBar legendItems={3} /></div>}
                            real={
                                <div className="w-56">
                                    <SegmentBar
                                        ariaLabel="Exercise difficulty distribution"
                                        segments={[
                                            { key: "easy", label: "Easy", value: 8 },
                                            { key: "medium", label: "Medium", value: 5 },
                                            { key: "hard", label: "Hard", value: 3 },
                                        ]}
                                    />
                                </div>
                            }
                        />
                        <SkeletonRow
                            label="Metric"
                            desc="When the real node is a large number with a stat label."
                            skeleton={<Skeleton.Metric />}
                            real={<MetricCard value="1.204" label="Enrolled students" hint="Updated daily" />}
                        />
                    </SkeletonGroup>

                    <SkeletonGroup title="Containers">
                        <SkeletonRow
                            label="Card"
                            desc="When the real node is a card with a title and a few lines of content; lines matches the line count."
                            skeleton={<Skeleton.Card lines={3} />}
                            real={
                                <Card>
                                    <CardContent className="flex flex-col gap-2">
                                        <Typography type="body-sm" weight="medium">Fullstack course</Typography>
                                        <Typography type="body-xs" color="muted">
                                            A twelve-week path from web fundamentals to a complete project for your résumé.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            }
                        />
                        <SkeletonRow
                            label="Disclosure"
                            desc="When the real node is a single collapsible block."
                            skeleton={<div className="w-72"><Skeleton.Disclosure /></div>}
                            real={
                                <div className="w-72">
                                    <Disclosure>
                                        <Disclosure.Heading>
                                            <Disclosure.Trigger>
                                                Tuition details
                                                <Disclosure.Indicator />
                                            </Disclosure.Trigger>
                                        </Disclosure.Heading>
                                        <Disclosure.Content>
                                            <Disclosure.Body>
                                                <Typography type="body-xs" color="muted">Interest-free installments over three months.</Typography>
                                            </Disclosure.Body>
                                        </Disclosure.Content>
                                    </Disclosure>
                                </div>
                            }
                        />
                        <SkeletonRow
                            label="Accordion"
                            desc="When the real node is several stacked collapsible blocks; items matches the block count."
                            skeleton={<div className="w-full"><Skeleton.Accordion items={2} /></div>}
                            real={
                                <div className="w-full">
                                    <Accordion variant="surface">
                                        <Accordion.Item aria-label="Does the course give a certificate">
                                            <Accordion.Heading>
                                                <Accordion.Trigger>
                                                    <Typography type="body-sm" weight="medium" className="text-left">
                                                        Does the course give a certificate?
                                                    </Typography>
                                                </Accordion.Trigger>
                                            </Accordion.Heading>
                                            <Accordion.Panel>
                                                <Accordion.Body>
                                                    <Typography type="body-sm" color="muted">
                                                        Yes, you receive a certificate after completing the entire final project.
                                                    </Typography>
                                                </Accordion.Body>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                        <Accordion.Item aria-label="Can a complete beginner keep up">
                                            <Accordion.Heading>
                                                <Accordion.Trigger>
                                                    <Typography type="body-sm" weight="medium" className="text-left">
                                                        Can a complete beginner keep up?
                                                    </Typography>
                                                </Accordion.Trigger>
                                            </Accordion.Heading>
                                            <Accordion.Panel>
                                                <Accordion.Body>
                                                    <Typography type="body-sm" color="muted">
                                                        Yes, the path starts from the fundamentals so no prior knowledge is needed.
                                                    </Typography>
                                                </Accordion.Body>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            }
                        />
                    </SkeletonGroup>

                    <SkeletonGroup title="Navigation">
                        <SkeletonRow
                            label="Tabs"
                            desc="When the real node is a tab strip switching sections; count matches the tab count."
                            skeleton={<Skeleton.Tabs count={3} />}
                            real={
                                <Tabs defaultSelectedKey="lessons" aria-label="Course content">
                                    <Tabs.ListContainer>
                                        <Tabs.List aria-label="Course content">
                                            <Tabs.Tab id="lessons" aria-controls="panel-lessons">
                                                Lessons
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                            <Tabs.Tab id="quiz" aria-controls="panel-quiz">
                                                Quiz
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                            <Tabs.Tab id="notes" aria-controls="panel-notes">
                                                Notes
                                                <Tabs.Indicator />
                                            </Tabs.Tab>
                                        </Tabs.List>
                                    </Tabs.ListContainer>
                                </Tabs>
                            }
                        />
                        <SkeletonRow
                            label="Breadcrumbs"
                            desc="When the real node is a hierarchical breadcrumb path."
                            skeleton={<Skeleton.Breadcrumbs count={3} />}
                            real={
                                <Breadcrumbs>
                                    <Breadcrumbs.Item>Home</Breadcrumbs.Item>
                                    <Breadcrumbs.Item>Courses</Breadcrumbs.Item>
                                    <Breadcrumbs.Item>Fullstack</Breadcrumbs.Item>
                                </Breadcrumbs>
                            }
                        />
                        <SkeletonRow
                            label="Pagination"
                            desc="When the real node is a pagination strip."
                            skeleton={<Skeleton.Pagination count={3} />}
                            real={
                                <Pagination aria-label="Results pagination">
                                    <Pagination.Content className="flex flex-wrap gap-1">
                                        <Pagination.Item>
                                            <Pagination.Previous aria-label="Previous page">
                                                <Pagination.PreviousIcon />
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        <Pagination.Item>
                                            <Pagination.Link>1</Pagination.Link>
                                        </Pagination.Item>
                                        <Pagination.Item>
                                            <Pagination.Link isActive>2</Pagination.Link>
                                        </Pagination.Item>
                                        <Pagination.Item>
                                            <Pagination.Link>3</Pagination.Link>
                                        </Pagination.Item>
                                        <Pagination.Item>
                                            <Pagination.Next aria-label="Next page">
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            }
                        />
                        <SkeletonRow
                            label="Menu"
                            desc="When the real node is a menu item list; items matches the item count."
                            skeleton={<div className="w-56"><Skeleton.Menu items={3} /></div>}
                            real={
                                <div className="flex w-56 flex-col gap-1 rounded-2xl p-1">
                                    <div className="flex items-center gap-2 px-2 py-2">
                                        <UserIcon className="size-5" />
                                        <Typography type="body-sm">My profile</Typography>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-2">
                                        <GearIcon className="size-5" />
                                        <Typography type="body-sm">Account settings</Typography>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-2">
                                        <SignOutIcon className="size-5" />
                                        <Typography type="body-sm">Sign out</Typography>
                                    </div>
                                </div>
                            }
                        />
                    </SkeletonGroup>

                    <SkeletonGroup title="Lists / tables">
                        <SkeletonRow
                            label="ListBox"
                            desc="When the real node is a selectable list; items matches the row count."
                            skeleton={<div className="w-56"><Skeleton.ListBox items={4} /></div>}
                            real={
                                <ListBox
                                    aria-label="Practice topics"
                                    selectionMode="single"
                                    defaultSelectedKeys={["arrays"]}
                                    className="w-56 gap-1 p-1"
                                >
                                    <ListBox.Item id="arrays" textValue="Arrays and strings" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                        Arrays and strings
                                    </ListBox.Item>
                                    <ListBox.Item id="graph" textValue="Graphs" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                        Graphs
                                    </ListBox.Item>
                                    <ListBox.Item id="dp" textValue="Dynamic programming" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                        Dynamic programming
                                    </ListBox.Item>
                                    <ListBox.Item id="tree" textValue="Binary trees" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                        Binary trees
                                    </ListBox.Item>
                                </ListBox>
                            }
                        />
                        <SkeletonRow
                            label="ListRow"
                            desc="When the real node is a list row; enable withTrailing if it has a trailing part."
                            skeleton={<div className="w-72"><Skeleton.ListRow withTrailing /></div>}
                            real={
                                <div className="w-72">
                                    <ListRow
                                        leading={<UserAvatar username="levan.dev" size="sm" />}
                                        title="David Le"
                                        subtitle="Submitted the week-three exercise"
                                        trailing={<CaretRightIcon className="size-4 text-muted" />}
                                    />
                                </div>
                            }
                        />
                        <SkeletonRow
                            label="Table"
                            desc="When the real node is a multi-row/column table; rows and cols match the real dimensions."
                            skeleton={<div className="w-full"><Skeleton.Table rows={3} cols={3} /></div>}
                            real={
                                <div className="max-w-full overflow-x-auto">
                                    <Table variant="primary">
                                        <Table.ScrollContainer>
                                            <Table.Content aria-label="Student list">
                                                <Table.Header>
                                                    <Table.Column isRowHeader>Student</Table.Column>
                                                    <Table.Column>Course</Table.Column>
                                                    <Table.Column>Progress</Table.Column>
                                                </Table.Header>
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell>David Le</Table.Cell>
                                                        <Table.Cell>Fullstack</Table.Cell>
                                                        <Table.Cell>80%</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Mai Tran</Table.Cell>
                                                        <Table.Cell>System Design</Table.Cell>
                                                        <Table.Cell>45%</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>An Pham</Table.Cell>
                                                        <Table.Cell>DevOps</Table.Cell>
                                                        <Table.Cell>62%</Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table.Content>
                                        </Table.ScrollContainer>
                                    </Table>
                                </div>
                            }
                        />
                    </SkeletonGroup>
                </div>
            </Variant>

            <Variant
                label="Ví dụ ghép đúng cách"
                hint="Cách ghép chuẩn: mirror layout tree thật của một user card (avatar + 2 dòng chữ + button), giữ nguyên cấu trúc và chỉ thay node nội dung bằng Skeleton.<Component>."
            >
                <div className="flex w-80 items-center gap-3 rounded-2xl border border-default p-3">
                    <Skeleton.Avatar size="md" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <Skeleton.Typography type="body-sm" />
                        <Skeleton.Typography type="body-xs" />
                    </div>
                    <Skeleton.Button />
                </div>
            </Variant>
        </Gallery>
    ),
}
