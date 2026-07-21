import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { TrayIcon } from "@phosphor-icons/react"
import { TruthList } from "./TruthList"
import { blockShell } from "../../../block-anatomy"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof TruthList> = {
    title: "Block/Marketing/TruthList",
    component: TruthList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TruthList>

const ANATOMY = {
    primitives: [
        { name: "Accordion", role: "mỗi sự thật = trigger mở ra câu trả lời" },
        { name: "Typography", role: "statement (body medium) + fix (body-sm muted) + byline" },
    ],
    reason:
        "Định vị đối đầu, có căn cứ: mỗi sự thật khó chịu của ngành mở ra một câu 'đây là cách tụi mình xử'. Gói accordion + byline vào một surface flush để sự thật là nhân vật chính, tác giả lùi về chữ ký cuối.",
}

const typicalTruths = [
    {
        truth: "Học xong khoá online là làm được việc ngay.",
        fix: "→ Mỗi module đóng bằng một sản phẩm chạy thật, review bởi mentor — không chỉ video xem xong là qua.",
    },
    {
        truth: "Chứng chỉ đẹp là đủ để nhà tuyển dụng gật đầu.",
        fix: "→ Portfolio là repo Git thật kèm log commit, không phải PDF in ra treo tường.",
    },
    {
        truth: "AI sẽ thay hết lập trình viên trong vài năm tới.",
        fix: "→ AI thay người không biết đọc lỗi. Chương trình dạy debug và đọc log trước khi dạy prompt.",
    },
    {
        truth: "Càng nhiều ngôn ngữ biết, càng dễ có việc.",
        fix: "→ Tuyển dụng chấm chiều sâu một stack, không chấm số lượng logo trên CV.",
    },
]

export const SingleTruth: Story = {
    render: () =>
        blockShell(
            <TruthList
                items={[
                    {
                        truth: "Bootcamp 3 tháng biến người mới thành senior.",
                        fix: "→ Senior cần va vấp thật qua nhiều dự án, khoá học chỉ rút ngắn đường đi chứ không rút ngắn số năm.",
                    },
                ]}
            />,
            ANATOMY,
        ),
}

export const TypicalWithByline: Story = {
    render: () =>
        blockShell(
            <TruthList
                items={typicalTruths}
                byline={
                    <Typography type="body-sm" color="muted">
                        Thầy Long — Founder, StarCi Academy
                    </Typography>
                }
            />,
            ANATOMY,
        ),
}

export const NoByline: Story = {
    render: () => blockShell(<TruthList items={typicalTruths} />, ANATOMY),
}

export const LongContentWrap: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[360px]">
                <TruthList
                    items={[
                        {
                            truth: "Chỉ cần giỏi thuật toán là qua được mọi vòng phỏng vấn hệ thống lớn ở công ty product.",
                            fix: "→ Vòng system design chấm khả năng đánh đổi giữa chi phí, độ trễ và độ tin cậy — không có sẵn trong leetcode, phải luyện riêng qua case thật.",
                        },
                    ]}
                />
            </div>,
            ANATOMY,
        ),
}

/** Empty: no truths → the {@link EmptyState} primitive fills the surface instead of a blank accordion. */
export const Empty: Story = {
    render: () =>
        blockShell(
            <div className="overflow-hidden rounded-3xl bg-surface shadow-surface">
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Chưa có sự thật nào"
                    description="Các tuyên bố định vị sẽ hiện ở đây."
                />
            </div>,
            ANATOMY,
        ),
}

/**
 * Loading: MIRROR the surface frame — keep the `rounded-3xl bg-surface shadow-surface`
 * shell + per-item trigger rows/separators, swap only the statement text for `Skeleton`
 * bars (reuses `Skeleton.Accordion`, sized to the accordion trigger box).
 */
export const SkeletonLoading: Story = {
    render: () => blockShell(<Skeleton.Accordion items={4} />, ANATOMY),
}
