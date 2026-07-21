import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    CheckCircleIcon,
    CircleIcon,
    CreditCardIcon,
    WalletIcon,
    XCircleIcon,
} from "@phosphor-icons/react"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SurfaceListCard> = {
    title: "Blocks/Cards/SurfaceListCard",
    component: SurfaceListCard,
}

export default meta

type Story = StoryObj<typeof SurfaceListCard>

/**
 * Hình hài lõi của block: nhiều {@link SurfaceListCardRow} chỉ title+subtitle+caret
 * gộp thành MỘT card, cách nhau bằng separator full-bleed — row cuối tự ẩn separator.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Mẫu row chỉ chữ: title là dòng bắt buộc, subtitle thêm khi cần một dòng ngữ cảnh ngắn giúp phân biệt " +
            "các row. Thêm caret ở trailing khi bấm row CHUYỂN sang màn khác; bỏ caret khi row chạy hành động ngay " +
            "tại chỗ. Dùng khi mỗi item ĐƠN GIẢN và có nhiều item — gom hết vào MỘT card, đừng rải N Card riêng.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Programming fundamentals"
                    subtitle="12 lessons · 4 hours"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="Data structures & algorithms"
                    subtitle="18 lessons · 7 hours"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
                <SurfaceListCardRow
                    title="System design"
                    subtitle="9 lessons · 5 hours"
                    onPress={() => {}}
                    trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * `bordered` đổi `shadow-surface` → `border border-default` khi card nằm NESTED
 * trong một surface khác (modal/drawer) — nơi shadow gần như vô hình. State THẬT
 * do container (feature) truyền, không phải style tự chọn.
 */
export const Bordered: Story = {
    parameters: {
        usage:
            "Bật khi card NẰM TRONG một surface khác đang hiện (modal, drawer, panel) — ở đó shadow gần như vô " +
            "hình vì đứng trên nền surface, nên phải hiện bằng border. Card đứng riêng trên nền trang giữ mặc " +
            "định (shadow).",
    },
    render: () => (
        <div className="max-w-md rounded-3xl bg-surface p-3 shadow-surface">
            <SurfaceListCard bordered>
                <SurfaceListCardRow
                    title="MoMo wallet"
                    subtitle="Linked on 12/06/2026"
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    title="Visa card •••• 4242"
                    subtitle="Expires 08/28"
                    onPress={() => {}}
                    selected
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * Row `selected` tô `bg-accent-soft` đánh dấu lựa chọn đang-dùng (ngôn ngữ, phương
 * thức thanh toán) — state ngữ nghĩa riêng của row, khác với hover/interactive.
 */
export const Selected: Story = {
    parameters: {
        usage:
            "Bật cho row mà lựa chọn Ở LẠI và đọc là 'cái mình đang dùng' — ngôn ngữ, phương thức thanh toán. " +
            "Row bấm-rồi-đi thì không cần trạng thái này.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow title="Vietnamese" onPress={() => {}} />
                <SurfaceListCardRow title="English" selected onPress={() => {}} />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * Row `isDisabled` dimmed + non-interactive: option TỒN TẠI nhưng chưa mở khoá
 * cho user — giữ hiện diện thay vì ẩn.
 */
export const Disabled: Story = {
    parameters: {
        usage:
            "Bật khi option đã tồn tại nhưng chưa mở khoá cho user này — giữ row hiện diện (đừng ẩn) vì ẩn nghĩa " +
            "là họ không biết nó tồn tại, còn thấy mà không bấm được thì rõ ràng cần nâng cấp hoặc chờ.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow title="Export PDF invoice" onPress={() => {}} />
                <SurfaceListCardRow
                    title="Export Excel report (coming soon)"
                    subtitle="Not yet available on the current plan"
                    isDisabled
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * `hover="underline"` biến row thành `group`, title gạch chân khi hover, KHÔNG
 * tô nền — cho row-là-link dẫn tới bài viết. Khác `hover="fill"` mặc định.
 */
export const HoverUnderline: Story = {
    parameters: {
        usage:
            "Chuyển sang underline khi row dẫn TỚI một bài viết — title (giữ foreground, content-first) gạch " +
            "chân khi hover bằng CSS underline của HeroUI Link vì bản chất nó là link. Row chạy hành động tại " +
            "chỗ hoặc mở item trong app giữ mặc định (tô nền).",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Why do learners drop out of courses?"
                    subtitle="12.4k reads"
                    hover="underline"
                    href="#"
                />
                <SurfaceListCardRow
                    title="The path to becoming a Senior Backend engineer"
                    subtitle="9.1k reads"
                    hover="underline"
                    href="#"
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * Row có `leading` (thumbnail/icon) + `meta` (badge/ưu đãi) — specimen cho slot
 * JSX trái/phải, chứng minh block là composition không phải flat.
 */
export const LeadingMeta: Story = {
    parameters: {
        usage:
            "Thêm leading khi row được nhận diện nhanh hơn bằng ẢNH thay vì chữ — phương thức thanh toán, khoá " +
            "học; bỏ đi cho danh sách chỉ chữ. Thêm meta cho một thông tin ngắn thuộc riêng 1 row và đáng so " +
            "sánh giữa các row, ví dụ ưu đãi; để trống ở row không có, đừng nhồi cho đều.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                            <CreditCardIcon className="size-5 text-accent-soft-foreground" aria-hidden focusable="false" />
                        </div>
                    }
                    title="One-time payment"
                    subtitle="Pay the full tuition now"
                    meta={<span className="text-xs text-muted">Save 10%</span>}
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    leading={
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default">
                            <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                        </div>
                    }
                    title="Installments over 3 months"
                    subtitle="No interest"
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * {@link SurfaceListCardItem} nhận `children` tuỳ ý (vd row có progress bar) thay
 * khuôn title/subtitle cố định — nhánh render riêng của block cho nội dung
 * không khớp mẫu {@link SurfaceListCardRow}.
 */
export const FreeForm: Story = {
    parameters: {
        usage:
            "Dùng khi nội dung row không khớp khuôn title/subtitle/leading — ví dụ row có progress bar riêng. " +
            "SurfaceListCardItem tĩnh theo mặc định, chỉ thêm onPress/href khi cả row thật sự bấm được (như " +
            "demo này); đổi lại layout do caller tự lo — phải tự xử lý truncate và giữ các row cùng chiều cao, " +
            "hai việc mà mẫu SurfaceListCardRow đã lo sẵn.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Introduction to Backend Programming
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-2/3 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted">65%</span>
                    </div>
                </SurfaceListCardItem>
                <SurfaceListCardItem onPress={() => {}}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm">
                                Relational databases
                            </span>
                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                <div className="h-full w-1/5 rounded-full bg-accent" />
                            </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted">20%</span>
                    </div>
                </SurfaceListCardItem>
            </SurfaceListCard>
        </div>
    ),
}

/**
 * Row dùng icon `leading` làm TÍN HIỆU TRẠNG THÁI (todo/done/fail) + title ăn
 * theo màu — pattern checklist đặc thù, đúng 1 icon/row (`icon.md` §7).
 */
export const StateMarkers: Story = {
    parameters: {
        usage:
            "Dùng cho checklist mà mỗi row theo dõi tiến độ (nhiệm vụ ngày, task của 1 bài học). Icon leading là " +
            "TÍN HIỆU TRẠNG THÁI, không phải icon loại — chọn đúng 1 icon/row (icon.md §7) và để title ăn theo " +
            "màu đó: todo = CircleIcon + foreground, done = CheckCircleIcon + success, fail = XCircleIcon + " +
            "muted/danger. Tô màu title qua node <span>, không dùng titleClassName (lint cấm).",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    leading={<CircleIcon className="size-5 shrink-0 text-foreground" aria-hidden focusable="false" />}
                    title="Đọc nội dung bài học"
                    meta={<Typography type="body-xs" color="muted">0/1</Typography>}
                />
                <SurfaceListCardRow
                    leading={<CheckCircleIcon className="size-5 shrink-0 text-success-soft-foreground" aria-hidden focusable="false" />}
                    title={<span className="text-success-soft-foreground">Ôn 5 flashcard</span>}
                    meta={<Typography type="body-xs" color="muted">5/5</Typography>}
                />
                <SurfaceListCardRow
                    leading={<XCircleIcon className="size-5 shrink-0 text-danger" aria-hidden focusable="false" />}
                    title={<span className="text-danger">Hoàn thành 1 phiên Phỏng vấn thử</span>}
                    meta={<Typography type="body-xs" color="muted">Hết hạn</Typography>}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * Không `onPress`/`href` → row render như `<div>` phẳng, không hover/focus/cursor:
 * danh sách chỉ-đọc không được giả tín hiệu bấm-được
 * (`hover-style-matches-clickable-nature`).
 */
export const Static: Story = {
    parameters: {
        usage:
            "Danh sách chỉ để đọc (không onPress/href): row render như <div> phẳng, không hover/focus/cursor — " +
            "tô hover cho row không làm gì là tín hiệu giả 'bấm được' (hover-style-matches-clickable-nature). Ví " +
            "dụ thật: list điểm yếu của flashcard-review (chủ đề + chip % nhớ), không có gì để bấm.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Resilience"
                    meta={<Chip size="sm" variant="soft" color="danger" className="shrink-0">nhớ 25%</Chip>}
                />
                <SurfaceListCardRow
                    title="Error Handling"
                    meta={<Chip size="sm" variant="soft" color="warning" className="shrink-0">nhớ 33%</Chip>}
                />
                <SurfaceListCardRow
                    title="Authorization"
                    meta={<Chip size="sm" variant="soft" color="success" className="shrink-0">nhớ 57%</Chip>}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * `withVerdict` render pill inset màu MANG NGHĨA từ dữ liệu (tier/vùng
 * promote-demote); first/last row bo góc để pill hook góc card — variant riêng
 * của row, khác `SectionCard.withVerdict` (border-left).
 */
export const Verdict: Story = {
    parameters: {
        usage:
            "Dùng withVerdict khi MÀU của row MANG NGHĨA từ dữ liệu (tier mastery, vùng promote/demote) — ví dụ " +
            "tier độ phổ biến từ khoá của mind-map. Pill được inset cách đều mọi cạnh (không phải border-l " +
            "thẳng) để không đâm vào góc tròn của card ở row đầu/cuối. Truyền variant (accent/success/warning/" +
            "danger) hoặc color thô.",
    },
    render: () => (
        <div className="max-w-md">
            <SurfaceListCard>
                <SurfaceListCardRow
                    title="Shell &amp; hệ thống file"
                    withVerdict={{ enable: true, variant: "success" }}
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    title="Redirect &amp; pipe"
                    withVerdict={{ enable: true, variant: "warning" }}
                    onPress={() => {}}
                />
                <SurfaceListCardRow
                    title="Quyền file cơ bản"
                    withVerdict={{ enable: true, variant: "danger" }}
                    onPress={() => {}}
                />
            </SurfaceListCard>
        </div>
    ),
}

/**
 * Toàn bộ ma trận trạng thái của SurfaceListCard: text-only, bordered (nested
 * trong surface khác), selected, disabled, hover underline, leading + meta,
 * nội dung free-form, checklist state-marker, row tĩnh (read-only), và
 * verdict band (tín hiệu dữ liệu). Dùng để tra khi nào ghép nhiều row đơn
 * giản vào MỘT card thay vì rải N card riêng, và khi nào chọn từng biến thể.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của SurfaceListCard: text-only, bordered (nested trong surface khác), " +
            "selected, disabled, hover underline, leading + meta, nội dung free-form, checklist state-marker, " +
            "row tĩnh (read-only), và verdict band (tín hiệu dữ liệu). Dùng khi mỗi item ĐƠN GIẢN (label + " +
            "subtitle + leading) và có nhiều item — gom hết vào MỘT card này, các row cách nhau bằng separator, " +
            "đừng rải N Card riêng. Item RÀNH (ảnh cover, nhiều action riêng) đến mức đáng là 1 block độc lập " +
            "→ tách thành N card cách gap-3. Danh sách cần thu/mở theo nhóm → dùng Accordion.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Chỉ text (title + subtitle)"
                hint="Mẫu row chỉ chữ: title là dòng bắt buộc, subtitle thêm khi cần một dòng ngữ cảnh ngắn giúp phân biệt các row. Thêm caret ở trailing khi bấm row CHUYỂN sang màn khác; bỏ caret khi row chạy hành động ngay tại chỗ."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow
                            title="Programming fundamentals"
                            subtitle="12 lessons · 4 hours"
                            onPress={() => {}}
                            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                        />
                        <SurfaceListCardRow
                            title="Data structures & algorithms"
                            subtitle="18 lessons · 7 hours"
                            onPress={() => {}}
                            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                        />
                        <SurfaceListCardRow
                            title="System design"
                            subtitle="9 lessons · 5 hours"
                            onPress={() => {}}
                            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Bordered"
                hint="Bật khi card NẰM TRONG một surface khác đang hiện (modal, drawer, panel) — ở đó shadow gần như vô hình vì đứng trên nền surface, nên phải hiện bằng border. Card đứng riêng trên nền trang giữ mặc định (shadow)."
            >
                <div className="max-w-md rounded-3xl bg-surface p-3 shadow-surface">
                    <SurfaceListCard bordered>
                        <SurfaceListCardRow
                            title="MoMo wallet"
                            subtitle="Linked on 12/06/2026"
                            onPress={() => {}}
                        />
                        <SurfaceListCardRow
                            title="Visa card •••• 4242"
                            subtitle="Expires 08/28"
                            onPress={() => {}}
                            selected
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Selected"
                hint="Bật cho row mà lựa chọn Ở LẠI và đọc là 'cái mình đang dùng' — ngôn ngữ, phương thức thanh toán. Row bấm-rồi-đi thì không cần trạng thái này."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow title="Vietnamese" onPress={() => {}} />
                        <SurfaceListCardRow title="English" selected onPress={() => {}} />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Disabled"
                hint="Bật khi option đã tồn tại nhưng chưa mở khoá cho user này — giữ row hiện diện (đừng ẩn) vì ẩn nghĩa là họ không biết nó tồn tại, còn thấy mà không bấm được thì rõ ràng cần nâng cấp hoặc chờ."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow title="Export PDF invoice" onPress={() => {}} />
                        <SurfaceListCardRow
                            title="Export Excel report (coming soon)"
                            subtitle="Not yet available on the current plan"
                            isDisabled
                            onPress={() => {}}
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Hover underline"
                hint="Chuyển sang underline khi row dẫn TỚI một bài viết — title (giữ foreground, content-first) gạch chân khi hover bằng CSS underline của HeroUI Link vì bản chất nó là link. Row chạy hành động tại chỗ hoặc mở item trong app giữ mặc định (tô nền)."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow
                            title="Why do learners drop out of courses?"
                            subtitle="12.4k reads"
                            hover="underline"
                            href="#"
                        />
                        <SurfaceListCardRow
                            title="The path to becoming a Senior Backend engineer"
                            subtitle="9.1k reads"
                            hover="underline"
                            href="#"
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Leading + meta"
                hint="Thêm leading khi row được nhận diện nhanh hơn bằng ẢNH thay vì chữ — phương thức thanh toán, khoá học; bỏ đi cho danh sách chỉ chữ. Thêm meta cho một thông tin ngắn thuộc riêng 1 row và đáng so sánh giữa các row, ví dụ ưu đãi; để trống ở row không có, đừng nhồi cho đều."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow
                            leading={
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                                    <CreditCardIcon className="size-5 text-accent-soft-foreground" aria-hidden focusable="false" />
                                </div>
                            }
                            title="One-time payment"
                            subtitle="Pay the full tuition now"
                            meta={<span className="text-xs text-muted">Save 10%</span>}
                            onPress={() => {}}
                        />
                        <SurfaceListCardRow
                            leading={
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-default">
                                    <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                                </div>
                            }
                            title="Installments over 3 months"
                            subtitle="No interest"
                            onPress={() => {}}
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Nội dung free-form"
                hint="Dùng khi nội dung row không khớp khuôn title/subtitle/leading — ví dụ row có progress bar riêng. SurfaceListCardItem tĩnh theo mặc định, chỉ thêm onPress/href khi cả row thật sự bấm được (như demo này); đổi lại layout do caller tự lo — phải tự xử lý truncate và giữ các row cùng chiều cao, hai việc mà mẫu SurfaceListCardRow đã lo sẵn."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardItem onPress={() => {}}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 flex-col gap-1">
                                    <span className="truncate text-sm">
                                        Introduction to Backend Programming
                                    </span>
                                    <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                        <div className="h-full w-2/3 rounded-full bg-accent" />
                                    </div>
                                </div>
                                <span className="shrink-0 text-xs text-muted">65%</span>
                            </div>
                        </SurfaceListCardItem>
                        <SurfaceListCardItem onPress={() => {}}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 flex-col gap-1">
                                    <span className="truncate text-sm">
                                        Relational databases
                                    </span>
                                    <div className="h-1.5 w-40 overflow-hidden rounded-full bg-default">
                                        <div className="h-full w-1/5 rounded-full bg-accent" />
                                    </div>
                                </div>
                                <span className="shrink-0 text-xs text-muted">20%</span>
                            </div>
                        </SurfaceListCardItem>
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="State markers (checklist)"
                hint="Dùng cho checklist mà mỗi row theo dõi tiến độ (nhiệm vụ ngày, task của 1 bài học). Icon leading là TÍN HIỆU TRẠNG THÁI, không phải icon loại — chọn đúng 1 icon/row (icon.md §7) và để title ăn theo màu đó: todo = CircleIcon + foreground, done = CheckCircleIcon + success, fail = XCircleIcon + muted/danger. Tô màu title qua node <span>, không dùng titleClassName (lint cấm)."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow
                            leading={<CircleIcon className="size-5 shrink-0 text-foreground" aria-hidden focusable="false" />}
                            title="Đọc nội dung bài học"
                            meta={<Typography type="body-xs" color="muted">0/1</Typography>}
                        />
                        <SurfaceListCardRow
                            leading={<CheckCircleIcon className="size-5 shrink-0 text-success-soft-foreground" aria-hidden focusable="false" />}
                            title={<span className="text-success-soft-foreground">Ôn 5 flashcard</span>}
                            meta={<Typography type="body-xs" color="muted">5/5</Typography>}
                        />
                        <SurfaceListCardRow
                            leading={<XCircleIcon className="size-5 shrink-0 text-danger" aria-hidden focusable="false" />}
                            title={<span className="text-danger">Hoàn thành 1 phiên Phỏng vấn thử</span>}
                            meta={<Typography type="body-xs" color="muted">Hết hạn</Typography>}
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Static (row tĩnh, read-only)"
                hint="Danh sách chỉ để đọc (không onPress/href): row render như <div> phẳng, không hover/focus/cursor — tô hover cho row không làm gì là tín hiệu giả 'bấm được' (hover-style-matches-clickable-nature). Ví dụ thật: list điểm yếu của flashcard-review (chủ đề + chip % nhớ), không có gì để bấm."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow
                            title="Resilience"
                            meta={<Chip size="sm" variant="soft" color="danger" className="shrink-0">nhớ 25%</Chip>}
                        />
                        <SurfaceListCardRow
                            title="Error Handling"
                            meta={<Chip size="sm" variant="soft" color="warning" className="shrink-0">nhớ 33%</Chip>}
                        />
                        <SurfaceListCardRow
                            title="Authorization"
                            meta={<Chip size="sm" variant="soft" color="success" className="shrink-0">nhớ 57%</Chip>}
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
            <Variant
                label="Verdict band (tín hiệu dữ liệu)"
                hint="Dùng withVerdict khi MÀU của row MANG NGHĨA từ dữ liệu (tier mastery, vùng promote/demote) — ví dụ tier độ phổ biến từ khoá của mind-map. Pill được inset cách đều mọi cạnh (không phải border-l thẳng) để không đâm vào góc tròn của card ở row đầu/cuối. Truyền variant (accent/success/warning/danger) hoặc color thô."
            >
                <div className="max-w-md">
                    <SurfaceListCard>
                        <SurfaceListCardRow
                            title="Shell &amp; hệ thống file"
                            withVerdict={{ enable: true, variant: "success" }}
                            onPress={() => {}}
                        />
                        <SurfaceListCardRow
                            title="Redirect &amp; pipe"
                            withVerdict={{ enable: true, variant: "warning" }}
                            onPress={() => {}}
                        />
                        <SurfaceListCardRow
                            title="Quyền file cơ bản"
                            withVerdict={{ enable: true, variant: "danger" }}
                            onPress={() => {}}
                        />
                    </SurfaceListCard>
                </div>
            </Variant>
        </Gallery>
    ),
}
