import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Chip, Typography } from "@heroui/react"
import { FlipCard } from "@sb-components/blocks/cards/FlipCard/FlipCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof FlipCard> = {
    title: "Design/Cards/FlipCard",
    component: FlipCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FlipCard>

const QUESTION = (
    <Typography type="body">
        Sự khác biệt giữa <code>let</code>, <code>const</code> và <code>var</code> trong JavaScript là gì?
    </Typography>
)

/** Level chip + tags — only ONE `Chip` (the level), the rest stay inline text (no ≥2 sibling chips). */
const CHIPS = (
    <div className="flex flex-wrap items-center gap-2">
        <Chip size="sm" variant="soft" color="warning">Junior</Chip>
        <Typography type="body-xs" color="muted">javascript · es6</Typography>
    </div>
)

/** Ordinary answer body — short enough to never trigger the `ScrollShadow` scroll. */
const ANSWER = (
    <>
        <Typography type="body-sm">
            <code>var</code> khai báo theo phạm vi HÀM (function-scope) và bị hoisting kèm giá trị{" "}
            <code>undefined</code>; <code>let</code>/<code>const</code> khai báo theo phạm vi KHỐI
            (block-scope) và nằm trong &quot;temporal dead zone&quot; cho tới dòng khai báo.
        </Typography>
        <Typography type="body-sm" color="muted">
            <code>const</code> chỉ cấm gán lại chính binding, không đóng băng nội dung object/array —
            vẫn có thể mutate field bên trong.
        </Typography>
    </>
)

/** Long-form answer used to demonstrate the `ScrollShadow` overflow at `max-h-[28rem]`. */
const LONG_ANSWER = (
    <>
        <Typography type="body-sm">
            Bước 1 — Hoisting: cả ba đều được hoisting lên đầu scope, nhưng chỉ <code>var</code> gán sẵn{" "}
            <code>undefined</code>; <code>let</code>/<code>const</code> nằm trong temporal dead zone.
        </Typography>
        <Typography type="body-sm">
            Bước 2 — Phạm vi: <code>var</code> chỉ tôn trọng ranh giới hàm, nên một biến khai báo trong
            khối <code>if</code>/<code>for</code> vẫn &quot;lọt&quot; ra ngoài khối đó.
        </Typography>
        <Typography type="body-sm">
            Bước 3 — Redeclare: <code>var</code> cho khai báo lại cùng tên trong cùng scope mà không lỗi;
            <code>let</code>/<code>const</code> throw <code>SyntaxError</code> ngay lập tức.
        </Typography>
        <Typography type="body-sm">
            Bước 4 — Closure trong loop: vòng <code>for (var i...)</code> chia sẻ MỘT biến <code>i</code>{" "}
            cho mọi callback, còn <code>for (let i...)</code> tạo một binding <code>i</code> riêng mỗi lần lặp.
        </Typography>
        <Typography type="body-sm" color="muted">
            Bẫy thường gặp: nhiều ứng viên trả lời đúng phần scope nhưng quên nhắc temporal dead zone.
        </Typography>
        <Typography type="body-sm" color="muted">
            Đào sâu: hỏi thêm về <code>const</code> với object — hiểu &quot;immutable binding, không phải
            immutable value&quot; là dấu hiệu nắm chắc.
        </Typography>
    </>
)

// DOM thật: câu hỏi = SurfaceCard riêng; chips (level+tag) nhóm NGAY dưới câu hỏi;
// đáp án = SurfaceCard riêng, chỉ hiện khi revealed.
const NOT_REVEALED_PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCard.Question", tier: "primitive", role: "thẻ câu hỏi (label ngoài, viền bordered)" },
    { name: "BelowFront", tier: "primitive", role: "cụm chip cấp độ + tag, gom NGAY dưới câu hỏi" },
]

const REVEALED_PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCard.Question", tier: "primitive", role: "thẻ câu hỏi (label ngoài, viền bordered)" },
    { name: "BelowFront", tier: "primitive", role: "cụm chip cấp độ + tag, gom NGAY dưới câu hỏi" },
    { name: "SurfaceCard.Answer", tier: "primitive", role: "thẻ đáp án, reveal bên dưới (height-animate)" },
]

const NO_CHIPS_PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCard.Question", tier: "primitive", role: "thẻ câu hỏi (label ngoài, viền bordered)" },
    { name: "SurfaceCard.Answer", tier: "primitive", role: "thẻ đáp án, reveal bên dưới (height-animate)" },
]

const LOCKED_PARTS: Array<AnatomyNode> = [
    { name: "SurfaceCard.Question", tier: "primitive", role: "thẻ câu hỏi (label ngoài, viền bordered)" },
    { name: "BelowFront", tier: "primitive", role: "cụm chip cấp độ + tag, gom NGAY dưới câu hỏi" },
    { name: "SurfaceCard.Answer", tier: "primitive", role: "thẻ đáp án — nội dung thay bằng prompt mở khoá (icon khoá + title + subtitle)", state: "locked" },
]

/** Not revealed — the default when the card first appears: only the question card + its chips. */
export const NotRevealed: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="FlipCard"
                    tier="design"
                    leaf="NotRevealed"
                    parts={NOT_REVEALED_PARTS}
                    reason="Anki-style: câu hỏi và đáp án là HAI thẻ tách biệt, không lật ảo. Leaf này chưa reveal nên chỉ thẻ câu hỏi + chips render."
                >
                    <FlipCard revealed={false} questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={ANSWER} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Revealed — the answer card is shown below the question (height-animate); the chips stay under the question. */
export const Revealed: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="FlipCard"
                    tier="design"
                    leaf="Revealed"
                    parts={REVEALED_PARTS}
                    note="revealed=true thêm SurfaceCard.Answer bên dưới; SurfaceCard.Question + BelowFront giữ nguyên vị trí."
                >
                    <FlipCard revealed questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={ANSWER} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `belowFront` omitted — no level/tag to attach, so the `gap-3` below the question collapses too. */
export const WithoutChips: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="FlipCard"
                    tier="design"
                    leaf="WithoutChips"
                    parts={NO_CHIPS_PARTS}
                    note="belowFront bỏ trống → không render (không phải div rỗng) — chỉ 2 part: Question + Answer."
                >
                    <FlipCard revealed={false} questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} back={ANSWER} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Long answer — `back` taller than `max-h-[28rem]` scrolls inside the answer card's own `ScrollShadow`. */
export const LongAnswer: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="FlipCard"
                    tier="design"
                    leaf="LongAnswer"
                    parts={REVEALED_PARTS}
                    note="Cùng bộ part như Revealed — chỉ nội dung answer dài hơn, cuộn trong ScrollShadow riêng của SurfaceCard.Answer."
                >
                    <FlipCard revealed questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={LONG_ANSWER} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Locked answer — a premium card the learner hasn't unlocked: `locked` swaps in the built-in unlock prompt, not a hand-rolled `back`. */
export const Locked: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="FlipCard"
                    tier="design"
                    leaf="Locked"
                    parts={LOCKED_PARTS}
                    note="locked=true: SurfaceCard.Answer vẫn là 1 part, nhưng nội dung bên trong đổi thành prompt mở khoá do primitive tự vẽ (icon+title+subtitle), không phải `back` truyền vào."
                >
                    <FlipCard
                        revealed
                        locked
                        questionLabel="Câu hỏi"
                        answerLabel="Đáp án"
                        front={QUESTION}
                        belowFront={CHIPS}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Local demo owning `revealed` state + the "Xem đáp án" button — mirrors how a real caller drives the reveal. */
const Controlled = () => {
    const [revealed, setRevealed] = useState(false)
    return (
        <div className="flex max-w-md flex-col gap-3">
            <BlockAnatomy
                name="FlipCard"
                tier="design"
                leaf="Interactive"
                parts={REVEALED_PARTS}
                note="revealed do CALLER giữ state — bấm nút để toggle; SurfaceCard.Answer chỉ có mặt trong DOM khi revealed=true."
            >
                <FlipCard revealed={revealed} questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={ANSWER} showAnatomy />
            </BlockAnatomy>
            {!revealed ? (
                <Button variant="primary" onPress={() => setRevealed(true)}>Xem đáp án</Button>
            ) : (
                <Button variant="secondary" onPress={() => setRevealed(false)}>Ẩn đáp án</Button>
            )}
        </div>
    )
}

/** Interactive — press "Xem đáp án" to see the answer card height-animate in; FlipCard never owns its own `revealed` state. */
export const Interactive: Story = {
    render: () => (
        <div className="p-8">
            <Controlled />
        </div>
    ),
}

/** Đang tải — `isSkeleton` tự vẽ skeleton mirror của cả 2 thẻ (câu hỏi + đáp án), không dựng Skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="FlipCard"
                    tier="design"
                    leaf="Loading"
                    parts={REVEALED_PARTS}
                    note="isSkeleton mirror LUÔN vẽ đủ 3 part (Question/BelowFront/Answer) bằng Skeleton.* — composition giống leaf loaded, chỉ nội dung thay bằng bar."
                >
                    <FlipCard isSkeleton revealed questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} back={ANSWER} showAnatomy />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
