import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentPage } from "@sb-components/starci/pages/ContentPage/ContentPage"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContentPage` — the screen to read one lesson. A screen owns a list of
 * functions: it calls blocks, places them in frames, and hands each typed data.
 * Seven functions, in reading order: what this lesson is · how to look at it ·
 * read it · say how it landed · what else to read · talk about it · step to the
 * next one. The footer (reaction, related reading, discussion, pager) is
 * conditional — it appears only on an open lesson; a reader stopped by the
 * paywall sees one decision (the `Locked` leaf). The sandbox / challenges / AI
 * lab tab bodies are their own not-yet-built blocks and are deliberately left
 * unrendered rather than stubbed.
 */
const meta: Meta<typeof ContentPage> = {
    title: "StarCi/Pages/ContentPage/ContentPage",
    component: ContentPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentPage>

const BODY = `## Why images bloat

Every command in a \`Dockerfile\` produces a **layer**, and layers accumulate — deleting a
file in a later layer doesn't reclaim the space it took in an earlier one.

- \`COPY . .\` before \`npm ci\` breaks the cache on every code change
- the toolchain stays behind in the real runtime image

\`\`\`dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
\`\`\`

The rest covers multi-stage builds and how to pin tags for production.`

const BASE = {
    breadcrumbItems: [
        { key: "courses", label: "Courses", onPress: () => {} },
        { key: "course", label: "DevOps Mastery", onPress: () => {} },
        { key: "module", label: "Chapter 2 · Containerization" },
    ],
    title: "Writing an optimized Dockerfile",
    description: "Layers, caching, and multi-stage builds — the three things that decide whether an image is heavy or light.",
    minutesRead: 12,
    challengeCount: 3,
    outcomes: [
        { key: "layer", text: "Read each layer in an image and tell which one is bloating it" },
        { key: "cache", text: "Order a Dockerfile so the cache still holds after every code change" },
    ],
    modes: [
        { mode: "content" as const },
        { mode: "sandbox" as const },
        { mode: "challenges" as const },
        { mode: "aiLab" as const },
    ],
    mode: "content" as const,
    onModeChange: () => {},
    body: BODY,
    onReact: () => {},
    relatedLabel: "You might also want to read",
    relatedItems: [
        { key: "cache", title: "How image layers and caching actually work", breadcrumb: "Containerization · Docker", href: "#cache" },
    ],
    discussionLabel: "Discussion",
    currentUserId: "viewer-1",
    currentUser: { username: "You" },
    comments: [
        {
            id: "c1",
            author: { id: "u1", username: "Minh Anh" },
            createdTimeAgo: "2 hours ago",
            body: "I followed the multi-stage steps and the image is still 800MB — turns out I forgot COPY --from.",
            replyCount: 0,
            myReaction: null,
        },
    ],
    commentsTotal: 1,
    repliesByParent: {},
    onSubmitComment: () => {},
    onReply: () => {},
    onEditComment: () => {},
    onDeleteComment: () => {},
    onReactComment: () => {},
    onLoadReplies: () => {},
    previous: { title: "How image layers and caching actually work", href: "#prev" },
    next: { title: "Multi-stage builds: keeping the toolchain out of the real runtime image", href: "#next" },
    pagerAriaLabel: "Go to the previous or next lesson",
    tabsAriaLabel: "How to view the lesson",
    languages: [
        { key: "typescript", label: "TypeScript" },
        { key: "java", label: "Java" },
        { key: "csharp", label: "C#", isDisabled: true },
        { key: "go", label: "Go" },
    ],
    language: "typescript",
    languageAriaLabel: "Code language",
    onLanguageChange: () => {},
}

const OFFER = {
    title: "The rest is for enrolled students",
    description: "Unlock every lesson, challenge, and sandbox in this course.",
    discountedPriceVnd: 1290000,
    originalPriceVnd: 1990000,
    currentPhase: PricingPhase.Pioneer,
    seatsRemaining: 12,
    nextPhasePriceVnd: 1590000,
    ctaLabel: "Unlock this course",
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
    "MilestoneUpNextCard": { tier: "block", role: "mobile/tablet-only practice nudge after the reaction bar — reused with isHighlight=false (plain, matching src's own unaccented UpNextCard here)", storyId: "starci-blocks-learn-milestoneupnextcard-milestoneupnextcard--plain" },
}

/** LEAF — an OPEN lesson: the whole spine, header to pager. */
export const Reading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPage"
                tier="screen"
                leaf="Reading"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = false",
                        why: "Every function of the screen is present, in the order the reader meets them: what the lesson is, how to look at it, the lesson, then the four things worth doing once it has been read. Each of the eight nodes below is a block — the screen itself draws no shape at all.",
                        code: `<ContentPage
    title="Writing an optimized Dockerfile"
    body={lesson.body}
    modes={modes}
    mode="content"
    …
/>`,
                        render: <ContentPage {...BASE} isRead myReaction="like" reactionCounts={[{ type: "like", count: 80 }, { type: "love", count: 32 }, { type: "haha", count: 16 }]} viewCount={2481} hintText="Highlight a passage to ask AI about that exact spot." />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a LOCKED lesson ⇒ **loses the whole footer**, not just the body's tail. */
export const Locked: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPage"
                tier="screen"
                leaf="Locked"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = true",
                        why: "The lesson fades into its offer, and the reaction bar, related list, discussion and pager are all gone — four blocks removed by one condition. A reader stopped at a paywall has one decision to make, and leaving four more things to do underneath would compete with it rather than support it.",
                        code: `<ContentPage
    title="Writing an optimized Dockerfile"
    body={lesson.body}
    isLocked
    offer={offer}
    …
/>`,
                        render: <ContentPage {...BASE} isLocked offer={OFFER} />,
                    },
                ]}
            />
        </div>
    ),
}

/** One `@container`-wrapped render at a fixed device width — same helper shape `CourseContents` uses. */
const containerWidth = (width: number | undefined) => (
    <div data-tier="fixture" className="@container" style={width ? { width, maxWidth: "100%" } : undefined}>
        <ContentPage {...BASE} isRead myReaction="like" reactionCounts={[{ type: "like", count: 80 }, { type: "love", count: 32 }, { type: "haha", count: 16 }]} viewCount={2481} />
    </div>
)

/**
 * LEAF — the mobile/tablet-only practice nudge, across THREE container widths. ONE screen, no
 * namespace: `ContentPage` always mounts the nudge when the lesson has challenges, and
 * `HideAbove at="lg"` (1024px) hides it once the container is wide enough — same mechanism `src`
 * uses. `src` draws exactly ONE real boundary here, so Mobile (375px) and Tablet (768px) both
 * show the card and Desktop (1280px, past `@app-lg`) hides it — not three different treatments.
 */
export const PracticeNudgeResponsive: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPage"
                tier="screen"
                leaf="Practice nudge — responsive"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "Mobile — 375px",
                        why: "Below @app-lg, the practice nudge is visible right after the reaction bar — the SAME `ContentPage` desktop uses, just narrower.",
                        code: `<div className="@container" style={{ width: 375 }}>
    <ContentPage {...props} mode="content" challengeCount={3} />
</div>`,
                        render: containerWidth(375),
                    },
                    {
                        name: "Tablet — 768px",
                        why: "Still below @app-lg (1024px), so the nudge stays visible — `src` draws no distinct tablet-only treatment for this screen, only one mobile+tablet-vs-desktop boundary.",
                        code: `<div className="@container" style={{ width: 768 }}>
    <ContentPage {...props} mode="content" challengeCount={3} />
</div>`,
                        render: containerWidth(768),
                    },
                    {
                        name: "Desktop — 1280px",
                        why: "Past @app-lg, `HideAbove at=\"lg\"` removes the nudge from view — the right rail (outside this screen, in `LearnShell`) already surfaces the same offer there, so a second CTA here would be a duplicate.",
                        code: "<ContentPage {...props} mode=\"content\" challengeCount={3} />",
                        render: containerWidth(1280),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block that can mirror does, the tab row does not. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that can mirror itself does, and the mode row deliberately does not — it is known before any request, so shimmering it would take away the one control that was ready. The page keeps its full height, which is what stops the footer from jumping up under a reader who has already started scrolling.",
                        code: "<ContentPage {...props} isSkeleton />",
                        render: <ContentPage {...BASE} isSkeleton relatedItems={[]} comments={[]} />,
                    },
                ]}
            />
        </div>
    ),
}
