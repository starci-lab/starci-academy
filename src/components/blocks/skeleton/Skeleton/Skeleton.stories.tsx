import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
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
    Label,
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
import { Skeleton } from "./index"
import { UserCell } from "../../identity/UserCell"
import { ListRow } from "../../lists/ListRow"
import { MetricCard } from "../../stats/MetricCard"
import { ProgressMeter } from "../../stats/ProgressMeter"
import { SegmentBar } from "../../stats/SegmentBar"
import { UserAvatar } from "../../../reuseable/UserAvatar"

const meta: Meta<typeof Skeleton> = {
    title: "Core/Skeleton/Skeleton",
    component: Skeleton,
}
export default meta
type Story = StoryObj<typeof Skeleton>

/** Dùng cho placeholder shimmer thô — tự định cỡ qua className (h/w/rounded) khi cần 1 mảng loading không khớp component cụ thể nào. */
export const Bar: Story = {
    parameters: { usage: "Dùng cho placeholder shimmer thô — tự định cỡ qua className (h/w/rounded) khi cần 1 mảng loading không khớp component cụ thể nào." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mảnh thô</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi cần một mảng shimmer không khớp component nào — tự định cỡ qua className (h / w / rounded).
                </Typography>
            </div>
            <div className="flex w-80 flex-col gap-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <Skeleton className="h-28 w-full rounded-xl" />
            </div>
        </div>
    ),
}

/** Mỗi bậc chữ (type · size) + `Skeleton.Typography` khớp glyph box của nó — dùng cho cả `<Typography type=…>` lẫn `<div className="text-…">`. */
const TYPE_ROWS = [
    { type: "h1", size: "text-4xl", desc: "36/40 — tiêu đề lớn nhất của trang.", sample: "Tiêu đề trang" },
    { type: "h2", size: "text-3xl", desc: "30/36 — tiêu đề mục lớn.", sample: "Tiêu đề mục" },
    { type: "h3", size: "text-2xl", desc: "24/32 — tiêu đề khối/section.", sample: "Tiêu đề khối" },
    { type: "h4", size: "text-xl", desc: "20/28 — tiêu đề card.", sample: "Tiêu đề card" },
    { type: "h5", size: "text-lg", desc: "18/28 — tiêu đề nhỏ.", sample: "Tiêu đề nhỏ" },
    { type: "h6", size: "text-base", desc: "16/24 — nhãn đậm.", sample: "Nhãn đậm" },
    { type: "body", size: "text-base", desc: "16/28 — đoạn văn thường (base).", sample: "Đoạn văn thường trong nội dung." },
    { type: "body-sm", size: "text-sm", desc: "14/24 — chữ phụ, mô tả.", sample: "Dòng mô tả phụ, cỡ nhỏ hơn." },
    { type: "body-xs", size: "text-xs", desc: "12/20 — chú thích mờ, cỡ nhỏ nhất.", sample: "Chú thích mờ, cỡ nhỏ nhất." },
] as const

/**
 * Bảng tra `Skeleton.Typography` theo TỪNG BẬC CHỮ (type · size): mỗi bar cao đúng glyph
 * (font-size) + căn giữa trong line-box, nên chọn `type` khớp chữ thật là skeleton không
 * làm layout nhảy khi content về. Cùng font/line-height thì áp được cho cả `<Typography
 * type=…>` LẪN `<div className="text-…">`.
 */
export const TypographySizes: Story = {
    parameters: { usage: "Chọn `Skeleton.Typography type=…` khớp BẬC CHỮ thật: bar cao đúng glyph (font-size) + căn giữa trong line-box → layout không nhảy khi content về. Áp cho cả `<Typography type=…>` lẫn `<div className=\"text-…\">` (cùng font/line-height ⇒ cùng skeleton). Cột trái skeleton, phải là Typography thật cùng type để soi khớp chiều cao." },
    render: () => (
        <div className="flex w-[820px] flex-col gap-8">
            <SkeletonGroup title="Bậc chữ (type · size)">
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

            <SkeletonGroup title="Đoạn văn (nhiều dòng)">
                <SkeletonRow
                    label="Paragraph · 4 dòng"
                    desc="Đoạn văn nhiều dòng DÍNH nhau (text-base leading-7, line-box 28px); áp cho cả Typography lẫn div text-base leading-7. lines khớp số dòng ước lượng, dòng cuối ngắn."
                    skeleton={<Skeleton.Paragraph lines={4} />}
                    real={(
                        <div className="text-base leading-7">
                            Khoá học đi từ nền tảng web đến một dự án hoàn chỉnh, mỗi tuần một chủ đề kèm bài tập được chấm điểm tự động, và kết thúc bằng một sản phẩm bỏ thẳng vào hồ sơ xin việc.
                        </div>
                    )}
                />
            </SkeletonGroup>
        </div>
    ),
}

/** Bảng tra để chọn đúng mảnh khi dựng loading state: tìm kind khớp node thật rồi thay vào. Nguyên tắc là mirror cây layout THẬT — giữ nguyên node cấu trúc (separator, wrapper, gap) và chỉ thay node nội dung bằng Skeleton.<Component>, không rải shimmer bừa. Cần một mảng thô không khớp component nào thì dùng Skeleton trần (story Bar) và tự định cỡ bằng className. */
export const AllKinds: Story = {
    parameters: { usage: "Bảng tra để chọn đúng mảnh khi dựng loading state: tìm kind khớp node thật rồi thay vào. Mỗi hàng đặt cạnh nhau MẢNH skeleton (trái) và COMPONENT THẬT nó mô phỏng (phải) để kiểm bằng mắt xem cái khung có khớp không. Nguyên tắc là mirror cây layout THẬT — giữ nguyên node cấu trúc (separator, wrapper, gap) và chỉ thay node nội dung bằng Skeleton.<Component>, không rải shimmer bừa. Cần một mảng thô không khớp component nào thì dùng Skeleton trần (story Bar) và tự định cỡ bằng className." },
    render: () => (
        <div className="flex w-[820px] flex-col gap-8">
            <SkeletonGroup title="Chữ">
                <SkeletonRow
                    label="Typography"
                    desc="Khi node thật là một dòng chữ đơn như tiêu đề hay nhãn; chọn type khớp bậc chữ thật."
                    skeleton={<Skeleton.Typography type="h3" width="2/3" />}
                    real={<Typography type="h3">Tiêu đề mẫu</Typography>}
                />
                <SkeletonRow
                    label="Paragraph"
                    desc="Khi node thật là đoạn văn nhiều dòng; đặt lines bằng số dòng ước lượng."
                    skeleton={<Skeleton.Paragraph lines={3} />}
                    real={
                        <div className="flex flex-col gap-1">
                            <Typography type="body-sm">Khoá học đi từ nền tảng đến dự án thật.</Typography>
                            <Typography type="body-sm">Mỗi tuần một chủ đề kèm bài tập chấm điểm.</Typography>
                            <Typography type="body-sm">Kết thúc bằng một sản phẩm bỏ vào hồ sơ.</Typography>
                        </div>
                    }
                />
            </SkeletonGroup>

            <SkeletonGroup title="Form">
                <SkeletonRow
                    label="Input"
                    desc="Khi node thật là một ô nhập một dòng."
                    skeleton={<Skeleton.Input />}
                    real={<Input variant="secondary" placeholder="ban@email.com" />}
                />
                <SkeletonRow
                    label="Select"
                    desc="Khi node thật là ô chọn có mũi tên xổ."
                    skeleton={<Skeleton.Select />}
                    real={
                        <Select.Root<{ id: string }, "single"> aria-label="Cấp độ" defaultSelectedKey="mid">
                            <Select.Trigger aria-label="Cấp độ">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox.Root aria-label="Cấp độ">
                                    <ListBox.Item id="junior" textValue="Junior">Junior</ListBox.Item>
                                    <ListBox.Item id="mid" textValue="Trung cấp">Trung cấp</ListBox.Item>
                                    <ListBox.Item id="senior" textValue="Senior">Senior</ListBox.Item>
                                </ListBox.Root>
                            </Select.Popover>
                        </Select.Root>
                    }
                />
                <SkeletonRow
                    label="TextArea"
                    desc="Khi node thật là vùng nhập nhiều dòng; rows khớp chiều cao thật."
                    skeleton={<Skeleton.TextArea rows={3} />}
                    real={<TextArea rows={3} placeholder="Viết ghi chú của bạn…" className="resize-none" />}
                />
                <SkeletonRow
                    label="Slider"
                    desc="Khi node thật là thanh kéo chọn giá trị."
                    skeleton={<div className="w-56"><Skeleton.Slider /></div>}
                    real={<div className="w-56"><Slider aria-label="Âm lượng" defaultValue={40} /></div>}
                />
                <SkeletonRow
                    label="Button"
                    desc="Khi node thật là một nút bấm."
                    skeleton={<Skeleton.Button />}
                    real={<Button size="sm">Lưu thay đổi</Button>}
                />
                <SkeletonRow
                    label="Switch"
                    desc="Khi node thật là công tắc bật tắt."
                    skeleton={<Skeleton.Switch />}
                    real={
                        <Switch defaultSelected aria-label="Nhận email thông báo">
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
                    desc="Khi node thật là ô tích chọn."
                    skeleton={<Skeleton.Checkbox />}
                    real={
                        <Checkbox defaultSelected aria-label="Ghi nhớ đăng nhập">
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Content>Ghi nhớ đăng nhập</Checkbox.Content>
                        </Checkbox>
                    }
                />
                <SkeletonRow
                    label="RadioGroup"
                    desc="Khi node thật là nhóm nút chọn một."
                    skeleton={<Skeleton.RadioGroup items={2} />}
                    real={
                        <RadioGroup aria-label="Tần suất nhận thông báo" defaultValue="daily" className="flex flex-col gap-2">
                            <Radio value="instant">
                                <Radio.Content>
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    Ngay lập tức
                                </Radio.Content>
                            </Radio>
                            <Radio value="daily">
                                <Radio.Content>
                                    <Radio.Control>
                                        <Radio.Indicator />
                                    </Radio.Control>
                                    Tóm tắt hằng ngày
                                </Radio.Content>
                            </Radio>
                        </RadioGroup>
                    }
                />
            </SkeletonGroup>

            <SkeletonGroup title="Danh tính">
                <SkeletonRow
                    label="Avatar"
                    desc="Khi node thật là ảnh đại diện tròn; size khớp avatar thật."
                    skeleton={<Skeleton.Avatar size="lg" />}
                    real={<UserAvatar username="levan.dev" size="lg" />}
                />
                <SkeletonRow
                    label="UserCell"
                    desc="Khi node thật là ô người dùng gồm avatar kèm tên."
                    skeleton={<Skeleton.UserCell />}
                    real={<UserCell username="levan.dev" displayName="Lê Văn" handle="@levan.dev" size="sm" />}
                />
                <SkeletonRow
                    label="Chip"
                    desc="Khi node thật là thẻ chip nhỏ bo tròn."
                    skeleton={<Skeleton.Chip />}
                    real={<Chip color="accent" variant="soft"><Chip.Label>Đang học</Chip.Label></Chip>}
                />
                <SkeletonRow
                    label="Kbd"
                    desc="Khi node thật là phím tắt hiển thị kiểu bàn phím."
                    skeleton={<Skeleton.Kbd />}
                    real={<Kbd><Kbd.Content>Ctrl</Kbd.Content><Kbd.Content>K</Kbd.Content></Kbd>}
                />
                <SkeletonRow
                    label="Badge"
                    desc="Khi node thật là huy hiệu số hoặc chấm đính góc."
                    skeleton={<Skeleton.Badge />}
                    real={
                        <Badge.Anchor>
                            <BellIcon className="size-5" />
                            <Badge size="sm" color="accent">3</Badge>
                        </Badge.Anchor>
                    }
                />
            </SkeletonGroup>

            <SkeletonGroup title="Tiến trình / số liệu">
                <SkeletonRow
                    label="ProgressBar"
                    desc="Khi node thật là thanh tiến trình tuyến tính."
                    skeleton={<div className="w-56"><Skeleton.ProgressBar /></div>}
                    real={<div className="w-56"><ProgressMeter value={65} showValue label="Tiến độ khoá học" /></div>}
                />
                <SkeletonRow
                    label="Meter"
                    desc="Khi node thật là đồng hồ đo mức giá trị."
                    skeleton={<div className="w-56"><Skeleton.Meter /></div>}
                    real={
                        <div className="w-56">
                            <Meter value={72} aria-label="Dung lượng đã dùng">
                                <Meter.Track>
                                    <Meter.Fill />
                                </Meter.Track>
                            </Meter>
                        </div>
                    }
                />
                <SkeletonRow
                    label="SegmentBar"
                    desc="Khi node thật là thanh chia đoạn kèm chú thích; legendItems khớp số mục."
                    skeleton={<div className="w-56"><Skeleton.SegmentBar legendItems={3} /></div>}
                    real={
                        <div className="w-56">
                            <SegmentBar
                                ariaLabel="Phân bổ độ khó bài tập"
                                segments={[
                                    { key: "easy", label: "Dễ", value: 8 },
                                    { key: "medium", label: "Trung bình", value: 5 },
                                    { key: "hard", label: "Khó", value: 3 },
                                ]}
                            />
                        </div>
                    }
                />
                <SkeletonRow
                    label="Metric"
                    desc="Khi node thật là con số lớn kèm nhãn thống kê."
                    skeleton={<Skeleton.Metric />}
                    real={<MetricCard value="1.204" label="Học viên đã ghi danh" hint="Cập nhật hàng ngày" />}
                />
            </SkeletonGroup>

            <SkeletonGroup title="Khối chứa">
                <SkeletonRow
                    label="Card"
                    desc="Khi node thật là thẻ có tiêu đề và vài dòng nội dung; lines khớp số dòng."
                    skeleton={<Skeleton.Card lines={3} />}
                    real={
                        <Card>
                            <CardContent className="flex flex-col gap-2">
                                <Typography type="body-sm" weight="medium">Khoá Fullstack</Typography>
                                <Typography type="body-xs" color="muted">
                                    Lộ trình mười hai tuần đi từ nền tảng web đến một dự án hoàn chỉnh bỏ vào hồ sơ xin việc.
                                </Typography>
                            </CardContent>
                        </Card>
                    }
                />
                <SkeletonRow
                    label="Disclosure"
                    desc="Khi node thật là một khối gập mở đơn."
                    skeleton={<div className="w-72"><Skeleton.Disclosure /></div>}
                    real={
                        <div className="w-72">
                            <Disclosure>
                                <Disclosure.Heading>
                                    <Disclosure.Trigger>
                                        Chi tiết học phí
                                        <Disclosure.Indicator />
                                    </Disclosure.Trigger>
                                </Disclosure.Heading>
                                <Disclosure.Content>
                                    <Disclosure.Body>
                                        <Typography type="body-xs" color="muted">Hỗ trợ trả góp không lãi trong ba tháng.</Typography>
                                    </Disclosure.Body>
                                </Disclosure.Content>
                            </Disclosure>
                        </div>
                    }
                />
                <SkeletonRow
                    label="Accordion"
                    desc="Khi node thật là nhiều khối gập xếp chồng; items khớp số khối."
                    skeleton={<div className="w-full"><Skeleton.Accordion items={2} /></div>}
                    real={
                        <div className="w-full">
                            <Accordion variant="surface">
                                <Accordion.Item aria-label="Khoá học có cấp chứng chỉ không">
                                    <Accordion.Heading>
                                        <Accordion.Trigger>
                                            <Typography type="body-sm" weight="medium" className="text-left">
                                                Khoá học có cấp chứng chỉ không?
                                            </Typography>
                                        </Accordion.Trigger>
                                    </Accordion.Heading>
                                    <Accordion.Panel>
                                        <Accordion.Body>
                                            <Typography type="body-sm" color="muted">
                                                Có, bạn nhận chứng chỉ sau khi hoàn thành toàn bộ dự án cuối khoá.
                                            </Typography>
                                        </Accordion.Body>
                                    </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item aria-label="Học viên mất gốc có theo được không">
                                    <Accordion.Heading>
                                        <Accordion.Trigger>
                                            <Typography type="body-sm" weight="medium" className="text-left">
                                                Học viên mất gốc có theo được không?
                                            </Typography>
                                        </Accordion.Trigger>
                                    </Accordion.Heading>
                                    <Accordion.Panel>
                                        <Accordion.Body>
                                            <Typography type="body-sm" color="muted">
                                                Được, lộ trình bắt đầu từ nền tảng nên không cần kiến thức trước.
                                            </Typography>
                                        </Accordion.Body>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    }
                />
            </SkeletonGroup>

            <SkeletonGroup title="Điều hướng">
                <SkeletonRow
                    label="Tabs"
                    desc="Khi node thật là dải tab chuyển mục; count khớp số tab."
                    skeleton={<Skeleton.Tabs count={3} />}
                    real={
                        <Tabs defaultSelectedKey="lessons" aria-label="Nội dung khoá học">
                            <Tabs.ListContainer>
                                <Tabs.List aria-label="Nội dung khoá học">
                                    <Tabs.Tab id="lessons" aria-controls="panel-lessons">
                                        Bài học
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                    <Tabs.Tab id="quiz" aria-controls="panel-quiz">
                                        Kiểm tra
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                    <Tabs.Tab id="notes" aria-controls="panel-notes">
                                        Ghi chú
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Tabs.ListContainer>
                        </Tabs>
                    }
                />
                <SkeletonRow
                    label="Breadcrumbs"
                    desc="Khi node thật là đường dẫn phân cấp."
                    skeleton={<Skeleton.Breadcrumbs count={3} />}
                    real={
                        <Breadcrumbs>
                            <Breadcrumbs.Item>Trang chủ</Breadcrumbs.Item>
                            <Breadcrumbs.Item>Khoá học</Breadcrumbs.Item>
                            <Breadcrumbs.Item>Fullstack</Breadcrumbs.Item>
                        </Breadcrumbs>
                    }
                />
                <SkeletonRow
                    label="Pagination"
                    desc="Khi node thật là dải phân trang."
                    skeleton={<Skeleton.Pagination count={3} />}
                    real={
                        <Pagination aria-label="Phân trang kết quả">
                            <Pagination.Content className="flex flex-wrap gap-1">
                                <Pagination.Item>
                                    <Pagination.Previous aria-label="Trang trước">
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
                                    <Pagination.Next aria-label="Trang sau">
                                        <Pagination.NextIcon />
                                    </Pagination.Next>
                                </Pagination.Item>
                            </Pagination.Content>
                        </Pagination>
                    }
                />
                <SkeletonRow
                    label="Menu"
                    desc="Khi node thật là danh sách mục trình đơn; items khớp số mục."
                    skeleton={<div className="w-56"><Skeleton.Menu items={3} /></div>}
                    real={
                        <div className="flex w-56 flex-col gap-1 rounded-2xl p-1">
                            <div className="flex items-center gap-2 px-2 py-2">
                                <UserIcon className="size-5" />
                                <Typography type="body-sm">Hồ sơ của tôi</Typography>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-2">
                                <GearIcon className="size-5" />
                                <Typography type="body-sm">Cài đặt tài khoản</Typography>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-2">
                                <SignOutIcon className="size-5" />
                                <Typography type="body-sm">Đăng xuất</Typography>
                            </div>
                        </div>
                    }
                />
            </SkeletonGroup>

            <SkeletonGroup title="Danh sách / bảng">
                <SkeletonRow
                    label="ListBox"
                    desc="Khi node thật là danh sách chọn được; items khớp số dòng."
                    skeleton={<div className="w-56"><Skeleton.ListBox items={4} /></div>}
                    real={
                        <ListBox
                            aria-label="Chủ đề luyện tập"
                            selectionMode="single"
                            defaultSelectedKeys={["arrays"]}
                            className="w-56 gap-1 p-1"
                        >
                            <ListBox.Item id="arrays" textValue="Mảng và chuỗi" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                Mảng và chuỗi
                            </ListBox.Item>
                            <ListBox.Item id="graph" textValue="Đồ thị" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                Đồ thị
                            </ListBox.Item>
                            <ListBox.Item id="dp" textValue="Quy hoạch động" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                Quy hoạch động
                            </ListBox.Item>
                            <ListBox.Item id="tree" textValue="Cây nhị phân" className="cursor-pointer rounded-xl px-3 py-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground">
                                Cây nhị phân
                            </ListBox.Item>
                        </ListBox>
                    }
                />
                <SkeletonRow
                    label="ListRow"
                    desc="Khi node thật là một dòng danh sách; bật withTrailing nếu có phần đuôi."
                    skeleton={<div className="w-72"><Skeleton.ListRow withTrailing /></div>}
                    real={
                        <div className="w-72">
                            <ListRow
                                leading={<UserAvatar username="levan.dev" size="sm" />}
                                title="Lê Văn"
                                subtitle="Đã nộp bài tập tuần ba"
                                trailing={<CaretRightIcon className="size-4 text-muted" />}
                            />
                        </div>
                    }
                />
                <SkeletonRow
                    label="Table"
                    desc="Khi node thật là bảng nhiều hàng cột; rows và cols khớp kích thước thật."
                    skeleton={<div className="w-full"><Skeleton.Table rows={3} cols={3} /></div>}
                    real={
                        <div className="max-w-full overflow-x-auto">
                            <Table variant="primary">
                                <Table.ScrollContainer>
                                    <Table.Content aria-label="Danh sách học viên">
                                        <Table.Header>
                                            <Table.Column isRowHeader>Học viên</Table.Column>
                                            <Table.Column>Khoá</Table.Column>
                                            <Table.Column>Tiến độ</Table.Column>
                                        </Table.Header>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell>Lê Văn</Table.Cell>
                                                <Table.Cell>Fullstack</Table.Cell>
                                                <Table.Cell>80%</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Trần Mai</Table.Cell>
                                                <Table.Cell>System Design</Table.Cell>
                                                <Table.Cell>45%</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Phạm An</Table.Cell>
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
    ),
}

/** Ví dụ ghép đúng chuẩn: mirror cây layout thật của một thẻ người dùng (avatar + 2 dòng chữ + nút), giữ nguyên cấu trúc và chỉ thay node nội dung bằng Skeleton.<Component>. */
export const ComposedExample: Story = {
    parameters: { usage: "Ví dụ ghép đúng chuẩn: mirror cây layout thật của một thẻ người dùng (avatar + 2 dòng chữ + nút), giữ nguyên cấu trúc và chỉ thay node nội dung bằng Skeleton.<Component>." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Ghép mirror layout</Label>
                <Typography type="body-sm" color="muted">
                    Cách ghép đúng chuẩn: mirror cây layout thật (avatar + 2 dòng chữ + nút), giữ nguyên cấu trúc và chỉ thay node nội dung bằng Skeleton.
                </Typography>
            </div>
            <div className="flex w-80 items-center gap-3 rounded-2xl border border-default p-4">
                <Skeleton.Avatar size="md" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton.Typography type="body-sm" />
                    <Skeleton.Typography type="body-xs" />
                </div>
                <Skeleton.Button />
            </div>
        </div>
    ),
}

/**
 * Một mẫu skeleton trong story AllKinds: nhãn tên + điều kiện chọn, rồi một hàng
 * so sánh hai cột — trái là mảnh skeleton, phải là component THẬT nó mô phỏng.
 */
const SkeletonRow = ({
    label,
    desc,
    skeleton,
    real,
}: {
    label: string
    desc: string
    skeleton: ReactNode
    real: ReactNode
}) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Typography type="body-sm" color="muted">{desc}</Typography>
        </div>
        {/* Hai cột chia bằng separator dọc; grid cho content FULL-WIDTH mỗi cột (card không
            co hẹp), separator (cột auto) tự kéo full chiều cao, content self-center. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6">
            <div className="self-center">{skeleton}</div>
            <div className="border-l border-separator" />
            <div className="self-center">{real}</div>
        </div>
    </div>
)

/** Một họ skeleton trong story AllKinds: tiêu đề nhỏ + nhãn 2 cột (khớp grid) + các mẫu xếp dọc. */
const SkeletonGroup = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6">
                <Typography type="body-xs" color="muted">Skeleton</Typography>
                <div />
                <Typography type="body-xs" color="muted">Thật</Typography>
            </div>
        </div>
        <div className="flex flex-col gap-6">{children}</div>
    </section>
)
