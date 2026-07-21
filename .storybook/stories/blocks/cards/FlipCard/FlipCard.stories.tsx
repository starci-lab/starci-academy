import type { Meta, StoryObj } from "@storybook/nextjs"
import { useState } from "react"
import { Button, Chip, Typography } from "@heroui/react"
import { LockIcon } from "@phosphor-icons/react"
import { FlipCard } from "@/components/blocks/cards/FlipCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof FlipCard> = {
    title: "Blocks/Card/FlipCard",
    component: FlipCard,
}

export default meta

type Story = StoryObj<typeof FlipCard>

/** Question body reused across the gallery specimens. */
const QUESTION = (
    <Typography type="body">
        Sự khác biệt giữa <code>let</code>, <code>const</code> và <code>var</code> trong JavaScript là gì?
    </Typography>
)

/**
 * Level chip + tags reused across specimens that DO carry `belowFront` — only ONE
 * `Chip` (the level, the main classification axis), the rest stay inline text
 * (starci-fe/no-adjacent-chip: ≥2 sibling `Chip`s is banned).
 */
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
            Bẫy thường gặp: nhiều ứng viên trả lời đúng phần scope nhưng quên nhắc temporal dead zone —
            đây là điểm phân biệt <code>let</code> với <code>const</code> khỏi chỉ là &quot;var có khối&quot;.
        </Typography>
        <Typography type="body-sm" color="muted">
            Đào sâu: hỏi thêm về <code>const</code> với object — ứng viên hiểu &quot;immutable binding,
            không phải immutable value&quot; là dấu hiệu nắm chắc.
        </Typography>
    </>
)

/**
 * Every real shape of `FlipCard`: chưa xem đáp án (chỉ câu hỏi), đã xem đáp án (card đáp án
 * height-animate xuống dưới), không có chip `belowFront`, đáp án dài phải cuộn trong
 * `ScrollShadow`, và đáp án bị khoá premium (câu hỏi giữ nguyên, `back` thay bằng lời nhắc mở
 * khoá) — đúng những state `FlashcardReviewer` thật sự render.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dựng cạnh nhau mọi trạng thái thật của FlipCard (chưa/đã xem đáp án, có/không chip belowFront, đáp án dài cuộn, đáp án khoá premium) để soi bố cục trước khi ghép vào FlashcardReviewer hay QuizSession — không phải nơi kiểm animation, animation chỉ thấy khi tương tác thật (xem story Interactive).",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Chưa xem đáp án"
                hint="Trạng thái mặc định khi thẻ vừa hiện ra — chỉ có card câu hỏi + chip cấp độ/nhãn, chưa có card đáp án nào bên dưới vì học viên chưa bấm 'Xem đáp án'."
            >
                <FlipCard
                    revealed={false}
                    questionLabel="Câu hỏi"
                    answerLabel="Đáp án"
                    front={QUESTION}
                    belowFront={CHIPS}
                    back={ANSWER}
                />
            </Variant>
            <Variant
                label="Đã xem đáp án"
                hint="Sau khi bấm 'Xem đáp án' — card đáp án reveal bên dưới bằng height-animate; chip cấp độ/nhãn vẫn đứng yên ngay dưới câu hỏi, không bị đẩy xuống cuối."
            >
                <FlipCard
                    revealed
                    questionLabel="Câu hỏi"
                    answerLabel="Đáp án"
                    front={QUESTION}
                    belowFront={CHIPS}
                    back={ANSWER}
                />
            </Variant>
            <Variant
                label="Không có chip belowFront"
                hint="Bỏ prop belowFront khi câu hỏi không có level/tag nào để gắn — không chèn div rỗng, khoảng gap-3 dưới câu hỏi cũng biến mất theo."
            >
                <FlipCard
                    revealed={false}
                    questionLabel="Câu hỏi"
                    answerLabel="Đáp án"
                    front={QUESTION}
                    back={ANSWER}
                />
            </Variant>
            <Variant
                label="Đáp án dài — cuộn trong ScrollShadow"
                hint="back cao hơn max-h-[28rem] tự cuộn bên trong ScrollShadow của riêng card đáp án, không kéo giãn cả trang — dùng cho lời giải nhiều bước hoặc nhiều 'Đào sâu'."
            >
                <FlipCard
                    revealed
                    questionLabel="Câu hỏi"
                    answerLabel="Đáp án"
                    front={QUESTION}
                    belowFront={CHIPS}
                    back={LONG_ANSWER}
                />
            </Variant>
            <Variant
                label="Đáp án bị khoá (premium chưa mở)"
                hint="Thẻ thuộc gói premium mà học viên chưa enroll/mua — back thay hẳn bằng thông báo khoá + gợi ý mở khoá thay vì lộ đáp án thật (FlashcardReviewer.isLocked)."
            >
                <FlipCard
                    revealed
                    questionLabel="Câu hỏi"
                    answerLabel="Đáp án"
                    front={QUESTION}
                    belowFront={CHIPS}
                    back={(
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                            <LockIcon aria-hidden focusable="false" className="size-8 text-muted" />
                            <Typography type="body-sm" weight="semibold">
                                Thẻ này thuộc gói Premium
                            </Typography>
                            <Typography type="body-xs" color="muted">
                                Mở khoá khoá học để xem đáp án đầy đủ.
                            </Typography>
                        </div>
                    )}
                />
            </Variant>
        </Gallery>
    ),
}

/** Local demo owning `revealed` state + the "Xem đáp án" button, mirroring how a real caller (FlashcardReviewer) drives the reveal — FlipCard itself never toggles its own state. */
const Controlled = () => {
    const [revealed, setRevealed] = useState(false)
    return (
        <div className="flex flex-col gap-4">
            <FlipCard
                revealed={revealed}
                questionLabel="Câu hỏi"
                answerLabel="Đáp án"
                front={QUESTION}
                belowFront={CHIPS}
                back={ANSWER}
            />
            {!revealed ? (
                <Button variant="primary" onPress={() => setRevealed(true)}>
                    Xem đáp án
                </Button>
            ) : (
                <Button variant="secondary" onPress={() => setRevealed(false)}>
                    Ẩn đáp án
                </Button>
            )}
        </div>
    )
}

/**
 * Bấm thật "Xem đáp án" để thấy card đáp án height-animate xuống dưới — FlipCard chỉ
 * presentational (nhận `revealed` từ ngoài), nút và state này do CALLER sở hữu, đúng thiết kế
 * "retrieval practice trước khi thấy đáp án" mà block ghi trong JSDoc của nó.
 */
export const Interactive: Story = {
    parameters: {
        usage: "Dùng khi cần xem thật animation reveal (height-animate + shadow không bị overflow-hidden cắt sau khi settle) — bấm 'Xem đáp án' để lộ card đáp án, bấm 'Ẩn đáp án' để thu lại. FlipCard không tự giữ state revealed, đây là state của trang gọi nó (FlashcardReviewer/QuizSession)."
    },
    render: () => <Controlled />,
}
