import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentScreen } from "@sb-components/starci/pages/ContentScreen/ContentScreen"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `ContentScreen`: read one lesson.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else. It calls blocks, places
 * them in frames, and hands each one typed data — every `div` here would be a
 * shape it had no right to decide.
 *
 * SEVEN FUNCTIONS, in the order the reader meets them: what this lesson is · how
 * to look at it · read it · say how it landed · what else to read · talk about it
 * · step to the next one.
 *
 * ⭐ THE FOOTER IS CONDITIONAL, AND THE CONDITION IS THE POINT. Reaction, related
 * reading, discussion and the pager appear only on an OPEN lesson. A reader
 * stopped by the paywall has ONE decision in front of them, and four more things
 * to do underneath would compete with it. The `Locked` leaf below is what that
 * looks like.
 *
 * ⚠️ SCOPE OF THIS PASS: the reading mode. The tab row offers sandbox,
 * challenges and AI lab because a lesson really has them, but their bodies are
 * their own blocks and are not built yet. The screen does NOT fake them with a
 * frame and a div: a stub that renders is worse than an absence that does not
 * (§B3), because the stub passes every gate.
 */
const meta: Meta<typeof ContentScreen> = {
    title: "StarCi/Pages/ContentScreen/ContentScreen",
    component: ContentScreen,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentScreen>

const BODY = `## Vì sao image phình

Mỗi lệnh trong \`Dockerfile\` đẻ ra một **layer**, và layer thì cộng dồn — xoá file ở layer
sau không lấy lại chỗ đã chiếm ở layer trước.

- \`COPY . .\` trước \`npm ci\` làm cache vỡ mỗi lần sửa code
- toolchain nằm lại trong image chạy thật

\`\`\`dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
\`\`\`

Phần dưới đi vào multi-stage build và cách ghim tag cho production.`

const BASE = {
    breadcrumbItems: [
        { key: "courses", label: "Khoá học", onPress: () => {} },
        { key: "course", label: "DevOps Mastery", onPress: () => {} },
        { key: "module", label: "Chương 2 · Container hoá" },
    ],
    title: "Viết Dockerfile tối ưu",
    description: "Layer, cache và multi-stage build — ba thứ quyết định image nặng hay nhẹ.",
    minutesRead: 12,
    challengeCount: 3,
    outcomes: [
        { key: "layer", text: "Đọc được từng layer trong một image và biết layer nào đang phình" },
        { key: "cache", text: "Sắp xếp Dockerfile để cache còn dùng lại được sau mỗi lần sửa code" },
    ],
    modes: [
        { mode: "content" as const },
        { mode: "sandbox" as const },
        { mode: "challenges" as const, count: 3 },
        { mode: "aiLab" as const },
    ],
    mode: "content" as const,
    onModeChange: () => {},
    body: BODY,
    onReact: () => {},
    relatedLabel: "Có thể bạn muốn đọc",
    relatedItems: [
        { key: "cache", title: "Image layer và cache hoạt động ra sao", snippet: "Thứ tự lệnh quyết định cache còn dùng được không.", href: "#cache" },
    ],
    discussionLabel: "Thảo luận",
    comments: [
        { key: "c1", authorName: "Minh Anh", timeAgo: "2 giờ trước", body: "Chỗ multi-stage em làm theo mà image vẫn 800MB, hoá ra quên COPY --from." },
    ],
    draft: "",
    onDraftChange: () => {},
    onSubmitComment: () => {},
    previous: { title: "Image layer và cache hoạt động ra sao", href: "#prev" },
    next: { title: "Multi-stage build: bỏ toolchain khỏi image chạy thật", href: "#next" },
    pagerAriaLabel: "Điều hướng bài học",
    tabsAriaLabel: "Cách xem bài học",
    languages: [
        { key: "typescript", label: "TypeScript" },
        { key: "java", label: "Java" },
        { key: "go", label: "Go" },
    ],
    language: "typescript",
    languageAriaLabel: "Ngôn ngữ code",
    onLanguageChange: () => {},
}

const OFFER = {
    title: "Phần còn lại dành cho học viên",
    description: "Mở khoá toàn bộ bài học, thử thách và sandbox của khoá này.",
    discountedPriceVnd: 1290000,
    originalPriceVnd: 1990000,
    currentPhase: PricingPhase.Pioneer,
    seatsRemaining: 12,
    nextPhasePriceVnd: 1590000,
    ctaLabel: "Mở khoá khoá học",
    onPurchase: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame that owns every seam on this screen — between the identity, the mode row, the lesson, and the footer cluster", storyId: "frames-stack-stackv--default" },
    "ContentHeader": { tier: "block", role: "what this lesson is: trail, title, description, read state and reading time, and what the reader will learn", storyId: "starci-blocks-learn-contentheader-contentheader--full" },
    "ContentModeNav": { tier: "block", role: "how to look at the lesson — reading, sandbox, challenges or AI lab; navigation, not a tab/panel pair, and static chrome that never waits for data", storyId: "starci-blocks-learn-contentmodenav-contentmodenav--full" },
    "ContentArticle": { tier: "block", role: "the lesson itself, and when it is locked the faded tail with the offer under it inside the same card", storyId: "starci-blocks-learn-contentarticle-contentarticle--open" },
    "ContentReaction": { tier: "block", role: "say how the lesson landed, beside the quiet view count", storyId: "starci-blocks-learn-contentreaction-contentreaction--full" },
    "ContentRelatedList": { tier: "block", role: "what else in the course is worth reading; draws nothing at all when there is nothing related", storyId: "starci-blocks-learn-contentrelatedlist-contentrelatedlist--full" },
    "ContentDiscussion": { tier: "block", role: "talk about the lesson: a composer that never hides, and the thread under it", storyId: "starci-blocks-learn-contentdiscussion-contentdiscussion--full" },
    "ContentPager": { tier: "block", role: "step to the neighbouring lesson; renders nothing on the first and last lesson of a module", storyId: "starci-blocks-learn-contentpager-contentpager--full" },
}

/** LEAF — an OPEN lesson: the whole spine, header to pager. */
export const Reading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentScreen"
                tier="screen"
                leaf="Reading"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = false",
                        why: "Every function of the screen is present, in the order the reader meets them: what the lesson is, how to look at it, the lesson, then the four things worth doing once it has been read. Each of the eight nodes below is a block — the screen itself draws no shape at all.",
                        code: `<ContentScreen
    title="Viết Dockerfile tối ưu"
    body={lesson.body}
    modes={modes}
    mode="content"
    …
/>`,
                        render: <ContentScreen {...BASE} showAnatomy isRead reactionCount={128} viewCount={2481} hintText="Bôi đen một đoạn để hỏi AI về đúng chỗ đó." />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a LOCKED lesson ⇒ **loses the whole footer**, not just the body's tail. */
export const Locked: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentScreen"
                tier="screen"
                leaf="Locked"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = true",
                        why: "The lesson fades into its offer, and the reaction bar, related list, discussion and pager are all gone — four blocks removed by one condition. A reader stopped at a paywall has one decision to make, and leaving four more things to do underneath would compete with it rather than support it.",
                        code: `<ContentScreen
    title="Viết Dockerfile tối ưu"
    body={lesson.body}
    isLocked
    offer={offer}
    …
/>`,
                        render: <ContentScreen {...BASE} showAnatomy isLocked offer={OFFER} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block that can mirror does, the tab row does not. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentScreen"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that can mirror itself does, and the mode row deliberately does not — it is known before any request, so shimmering it would take away the one control that was ready. The page keeps its full height, which is what stops the footer from jumping up under a reader who has already started scrolling.",
                        code: "<ContentScreen {...props} isSkeleton />",
                        render: <ContentScreen {...BASE} showAnatomy isSkeleton relatedItems={[]} comments={[]} />,
                    },
                ]}
            />
        </div>
    ),
}
