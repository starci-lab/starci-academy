import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Button } from "../../buttons/Button/Button"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ContinueCard> = {
    title: "Design/Cards/ContinueCard/Item",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

const ITEM_ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung surface tự đóng" },
        { name: "SeeMoreLink", role: "CTA \"Tiếp tục →\" (hover/click trên link)" },
        { name: "Skeleton", role: "state đang tải — mirror LAYOUT item (title·subtitle·link), KHÔNG sweep" },
        { name: "EmptyState", role: "state mạng rớt — lỗi + Thử lại, trong khung card" },
    ],
    reason:
        "Biến thể \"item\" (1-trong-N — story trình 1 card đại diện, lưới là việc của consumer). Mỗi state là 1 leaf trong folder: Mục (content, CTA SeeMoreLink) · Đang tải (Skeleton mirror LAYOUT item, KHÔNG progress/sweep) · Lỗi mạng rớt (EmptyState tone=\"danger\" trong SectionCard). Skeleton mirror layout, không nhấn/animation.",
}

/** The loaded item card — one representative (grid is the consumer's concern). */
export const Content: Story = {
    name: "Mục",
    render: () =>
        blockShell(
            <div className="w-80">
                <ContinueCard variant="item" title="Building a RESTful API with NestJS" subtitle="Reading" ctaLabel="Continue" href="/courses/nestjs-api/lessons/5" />
            </div>,
            ITEM_ANATOMY,
        ),
}

/** Loading — skeleton mirrors the item LAYOUT (title · subtitle · CTA link; no progress, no sweep). */
export const Loading: Story = {
    name: "Đang tải",
    render: () => (
        <div className="w-80 p-8">
            <SectionCard contentClassName="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body" width="2/3" />
                    <Skeleton.Typography type="body-xs" width="1/3" />
                </div>
                <Skeleton.Typography type="body-sm" width="1/4" />
            </SectionCard>
        </div>
    ),
}

/** Network drop — error rendered INSIDE the card frame (not a blank card). */
export const LoadError: Story = {
    name: "Lỗi tải (mạng rớt)",
    render: () => (
        <div className="w-80 p-8">
            <SectionCard>
                <EmptyState
                    tone="danger"
                    icon={<WarningIcon weight="duotone" />}
                    title="Mất kết nối"
                    description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                    action={
                        <Button variant="secondary" size="sm" onPress={() => {}}>
                            Thử lại
                        </Button>
                    }
                />
            </SectionCard>
        </div>
    ),
}
