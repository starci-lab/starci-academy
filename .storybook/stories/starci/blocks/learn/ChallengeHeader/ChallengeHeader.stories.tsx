import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeHeader } from "@sb-components/starci/blocks/learn/ChallengeHeader/ChallengeHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ChallengeHeader`: the CHALLENGE-IDENTITY cluster at the top of the
 * solve page. It answers "what is this challenge, and where do I stand on it".
 *
 * SIBLING OF `ContentHeader`, NOT AN EDIT OF IT. Both place identity into the
 * same `PageHeader` frame, but a lesson header carries read state / reading
 * time / outcomes, while a challenge header carries score / difficulty / the
 * learner's own pass-fail status — different domain fields entirely.
 *
 * ⚠️ TWO CHIPS ON PURPOSE, unlike `ContentHeader`'s one-chip-per-cluster. Here
 * `difficulty` (a property of the CHALLENGE, always known) and `status` (a
 * property of the ATTEMPT, may not exist yet) are two separate classifying
 * axes, not one fact weighed twice.
 *
 * 📐 ONE LEAF (§14d.2). The composed shape never changes — back link, title,
 * optional description, and a meta row that always exists — so this is a
 * SINGLE leaf. Whether the status chip is drawn, and whether the block is
 * loading, are DATA, not structure: the status chip is one item inside a row
 * that already exists (same reasoning `ContentHeader` used for its
 * `minutesRead`/`challengeCount` facts, which also stayed inside one leaf).
 */
const meta: Meta<typeof ChallengeHeader> = {
    title: "StarCi/Blocks/Learn/ChallengeHeader/ChallengeHeader",
    component: ChallengeHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the back link, title, description and meta row, owning the type scale for all four", storyId: "composites-layout-page-pageheader--full" },
    "LinkBack": { tier: "atom", role: "the single back affordance to the owning lesson, or its skeleton mirror while loading", storyId: "atoms-navigation-link-linkback--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the title, its description, or the quiet score fact — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the meta row, so the score text and both chips sit on one baseline with one seam", storyId: "frames-stack-stackh--default" },
    "EnumChip": { tier: "composite", role: "an enum-to-soft-chip delegate — difficulty always, status only once the learner has an attempt", storyId: "composites-chips-enumchip--overview" },
}

/** LEAF — `ChallengeHeader`: back link → title → description → meta row (score · difficulty · status). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ChallengeHeader"
                tier="block"
                leaf="ChallengeHeader"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "status = completed",
                        why: "The learner has already passed this challenge, so the meta row carries all three facts: the score the challenge is worth, the fixed difficulty tier, and the attempt's own pass chip. This is the shape a returning solver sees when they come back to review a challenge they already cleared.",
                        code: `<ChallengeHeader
    onBackPress={goBack}
    title="Cân bằng cây nhị phân tìm kiếm"
    description="Viết hàm kiểm tra một BST có cân bằng chiều cao hay không."
    scoreValue={100}
    difficulty="hard"
    status="completed"
/>`,
                        render: (
                            <ChallengeHeader
                                anatPart="ChallengeHeader"
                                showAnatomy
                                onBackPress={() => {}}
                                title="Cân bằng cây nhị phân tìm kiếm"
                                description="Viết hàm kiểm tra một BST có cân bằng chiều cao hay không."
                                scoreValue={100}
                                difficulty="hard"
                                status="completed"
                            />
                        ),
                    },
                    {
                        name: "status = failed",
                        why: "The chip swaps to the danger tone in place, without disturbing the score or difficulty beside it — status is the one fact in this row that can flip on a retry, and the row keeps its shape while it does.",
                        code: `<ChallengeHeader
    onBackPress={goBack}
    title="Cân bằng cây nhị phân tìm kiếm"
    description="Viết hàm kiểm tra một BST có cân bằng chiều cao hay không."
    scoreValue={100}
    difficulty="hard"
    status="failed"
/>`,
                        render: (
                            <ChallengeHeader
                                onBackPress={() => {}}
                                title="Cân bằng cây nhị phân tìm kiếm"
                                description="Viết hàm kiểm tra một BST có cân bằng chiều cao hay không."
                                scoreValue={100}
                                difficulty="hard"
                                status="failed"
                            />
                        ),
                    },
                    {
                        name: "status = undefined",
                        why: "The learner has never attempted this challenge, so there is no outcome to show yet — the status chip is simply not drawn, and difficulty carries the meta row alone. This is the first-visit shape, not an empty or a \"not started\" chip nobody asked for.",
                        code: `<ChallengeHeader
    onBackPress={goBack}
    title="Duyệt đồ thị theo chiều rộng"
    description="Cài đặt BFS trên đồ thị không trọng số, trả về khoảng cách ngắn nhất tới mỗi đỉnh."
    scoreValue={80}
    difficulty="medium"
/>`,
                        render: (
                            <ChallengeHeader
                                onBackPress={() => {}}
                                title="Duyệt đồ thị theo chiều rộng"
                                description="Cài đặt BFS trên đồ thị không trọng số, trả về khoảng cách ngắn nhất tới mỗi đỉnh."
                                scoreValue={80}
                                difficulty="medium"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the challenge is still loading, including a text mirror standing in for the back link, which has no skeleton mode of its own. The row reserves the full three-piece meta shape so nothing resizes once the data lands.",
                        code: "<ChallengeHeader onBackPress={goBack} title=\"\" difficulty=\"easy\" isSkeleton />",
                        render: (
                            <ChallengeHeader
                                onBackPress={() => {}}
                                title=""
                                difficulty="easy"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
