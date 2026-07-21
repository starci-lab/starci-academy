import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Chip, Typography } from "@heroui/react"
import { LockIcon } from "@phosphor-icons/react"
import { FlipCard } from "./FlipCard"

const meta: Meta<typeof FlipCard> = {
    title: "Primitives/Card/FlipCard",
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

/** Not revealed — the default when the card first appears: only the question card + its chips. */
export const NotRevealed: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <FlipCard revealed={false} questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={ANSWER} />
            </div>
        </div>
    ),
}

/** Revealed — the answer card is shown below the question (height-animate); the chips stay under the question. */
export const Revealed: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <FlipCard revealed questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={ANSWER} />
            </div>
        </div>
    ),
}

/** `belowFront` omitted — no level/tag to attach, so the `gap-3` below the question collapses too. */
export const WithoutChips: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <FlipCard revealed={false} questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} back={ANSWER} />
            </div>
        </div>
    ),
}

/** Long answer — `back` taller than `max-h-[28rem]` scrolls inside the answer card's own `ScrollShadow`. */
export const LongAnswer: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <FlipCard revealed questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={LONG_ANSWER} />
            </div>
        </div>
    ),
}

/** Locked answer — a premium card the learner hasn't unlocked: `back` is replaced by an unlock prompt, not the real answer. */
export const Locked: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <FlipCard
                    revealed
                    questionLabel="Câu hỏi"
                    answerLabel="Đáp án"
                    front={QUESTION}
                    belowFront={CHIPS}
                    back={(
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                            <LockIcon aria-hidden focusable="false" className="size-8 text-muted" />
                            <Typography type="body-sm" weight="semibold">Thẻ này thuộc gói Premium</Typography>
                            <Typography type="body-xs" color="muted">Mở khoá khoá học để xem đáp án đầy đủ.</Typography>
                        </div>
                    )}
                />
            </div>
        </div>
    ),
}

/** Local demo owning `revealed` state + the "Xem đáp án" button — mirrors how a real caller drives the reveal. */
const Controlled = () => {
    const [revealed, setRevealed] = useState(false)
    return (
        <div className="flex max-w-md flex-col gap-4">
            <FlipCard revealed={revealed} questionLabel="Câu hỏi" answerLabel="Đáp án" front={QUESTION} belowFront={CHIPS} back={ANSWER} />
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
