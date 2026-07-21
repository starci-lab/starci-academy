import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label } from "@heroui/react"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { ErrorState } from "../../feedback/ErrorState/ErrorState"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ContinueCard> = {
    title: "Block/Cards/ContinueCard",
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
        { name: "SeeMoreLink", role: 'CTA "Tiếp tục →" (hover/click trên link)' },
        { name: "Skeleton", role: "state đang tải — mirror LAYOUT item (title·subtitle·link), KHÔNG sweep" },
        { name: "ErrorState", role: "state mạng rớt — lỗi + Thử lại, trong khung card" },
    ],
    reason:
        'Biến thể "item" (1-trong-N — story trình bày 1 card đại diện, lưới là việc của consumer) + vòng đời, mỗi mức có <Label>: mục (content, CTA SeeMoreLink) · đang tải (Skeleton mirror LAYOUT item — item KHÔNG có progress/sweep) · lỗi mạng rớt (ErrorState trong SectionCard). Skeleton mirror layout, không nhấn/animation.',
}

/** Item variant — one card across its lifecycle (each level under a `<Label>`). Just ONE card: the grid layout is the consumer's concern, not the block's. */
export const Item: Story = {
    render: () =>
        blockShell(
            <div className="flex w-80 flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label>Mục</Label>
                    <ContinueCard variant="item" title="Building a RESTful API with NestJS" subtitle="Reading" ctaLabel="Continue" href="/courses/nestjs-api/lessons/5" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Đang tải</Label>
                    {/* skeleton mirrors the item LAYOUT: title · subtitle · CTA link (no progress, no sweep) */}
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton.Typography type="body" width="2/3" />
                            <Skeleton.Typography type="body-xs" width="1/3" />
                        </div>
                        <Skeleton.Typography type="body-sm" width="1/4" />
                    </SectionCard>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Lỗi tải (mạng rớt)</Label>
                    <SectionCard>
                        <ErrorState
                            title="Mất kết nối"
                            description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                            retryLabel="Thử lại"
                            onRetry={() => {}}
                        />
                    </SectionCard>
                </div>
            </div>,
            ITEM_ANATOMY,
        ),
}

const HERO_ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung surface (frame chung mọi trạng thái)" },
        { name: "HighlightCard", role: "vành arc accent quét quanh hero" },
        { name: "ProgressMeter", role: "thanh tiến độ khi có value" },
        { name: "Skeleton", role: "state đang tải — mirror LAYOUT hero (KHÔNG kèm vành sweep — đó là nhấn của hero đã load)" },
        { name: "ErrorState", role: "state mạng rớt — lỗi + Thử lại, trong khung card" },
    ],
    reason:
        'Biến thể "hero" (thứ DUY NHẤT chưa xong) + vòng đời, mỗi mức có <Label>: còn nhiều / gần hết thời gian (content) · đang tải (Skeleton mirror LAYOUT hero, KHÔNG vành sweep — sweep là nhấn của hero đã load) · lỗi mạng rớt (ErrorState trong SectionCard, không để card trống). "Trống" KHÔNG có ở card này — đối chiếu ContinueLearning: rỗng là card onboarding ở content branch, không phải state của card.',
}

/**
 * Hero variant — the single most-important thing to continue, across its REAL lifecycle
 * (each level under a `<Label>`): plenty of time · almost out of time · loading. Per the
 * ContinueLearning consumer there is NO error state and NO empty-state card (empty = a
 * section-level onboarding CTA, not a state of this card), so those are omitted.
 */
export const Hero: Story = {
    render: () =>
        blockShell(
            <div className="flex w-96 flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label>Không có tiến độ</Label>
                    {/* hero WITHOUT `value` → ProgressMeter không render; WITHOUT `icon` → không watermark */}
                    <ContinueCard
                        variant="hero"
                        title="Ôn tập thẻ đến hạn"
                        subtitle="Card 3 / 20"
                        ctaLabel="Ôn ngay"
                        onPress={() => {}}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Còn nhiều thời gian</Label>
                    <ContinueCard
                        variant="hero"
                        title="Mock interview: Design a rate limiter"
                        subtitle="Question 2 / 8 · Middle · 40 minutes left"
                        value={2}
                        max={8}
                        ctaLabel="Continue"
                        onPress={() => {}}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Gần hết thời gian</Label>
                    <ContinueCard
                        variant="hero"
                        title="Mock interview: Design a rate limiter"
                        subtitle="Question 7 / 8 · Middle · 2 minutes left"
                        urgent
                        value={7}
                        max={8}
                        ctaLabel="Continue"
                        onPress={() => {}}
                    />
                </div>

                {/* skeleton mirrors the LAYOUT PER KIND — plain SectionCard (no sweep: that's a
                    loaded-hero emphasis). No-progress kind → no progress bar; with-progress kind → bar. */}
                <div className="flex flex-col gap-2">
                    <Label>Đang tải · không tiến độ</Label>
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton.Typography type="body" width="2/3" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                        </div>
                        <Skeleton.Button width="w-28" />
                    </SectionCard>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Đang tải · có tiến độ</Label>
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton.Typography type="body" width="2/3" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                        </div>
                        <Skeleton.Button width="w-28" />
                        <Skeleton.ProgressBar />
                    </SectionCard>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Lỗi tải (mạng rớt)</Label>
                    {/* network drop → error rendered INSIDE the same card frame, not a blank card */}
                    <SectionCard>
                        <ErrorState
                            title="Mất kết nối"
                            description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                            retryLabel="Thử lại"
                            onRetry={() => {}}
                        />
                    </SectionCard>
                </div>
            </div>,
            HERO_ANATOMY,
        ),
}
