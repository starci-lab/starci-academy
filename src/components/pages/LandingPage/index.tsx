"use client"

import React from "react"
import {
    Accordion,
    Button,
    Link,
    Typography,
} from "@heroui/react"
import {
    ArrowRightIcon,
    ArrowUpIcon,
    CaretRightIcon,
    CloudArrowUpIcon,
    CubeIcon,
    StackIcon,
    TreeStructureIcon,
    UserIcon,
} from "@phosphor-icons/react"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
/** Hero architecture diagram in real 3D (WebGL/R3F). Client-only — never SSRs;
 * while the WebGL chunk loads, show a neutral sized skeleton (the old fallback
 * was a *different* SVG diagram → jarring swap to the 3D scene). */
const ArchitectureScene3D = dynamic(
    () => import("@/components/blocks/marketing/ArchitectureScene").then((m) => m.ArchitectureScene),
    {
        ssr: false,
        loading: () => (
            <div
                aria-hidden
                className="h-[440px] w-full animate-pulse rounded-3xl bg-default/20 @app-sm:h-[560px]"
            />
        ),
    },
)
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { FOUNDER_FACEBOOK, FOUNDER_GITHUB, FOUNDER_LINKEDIN } from "@/resources/contact"
import { StatStrip } from "./StatStrip"
import { TalentMarketplace } from "./TalentMarketplace"
import { LearnLoopScroll } from "./LearnLoopScroll"
import { KnowledgeGraph } from "./KnowledgeGraph"
import { KNOWLEDGE_NODES } from "./KnowledgeGraph/data"
import {
    LANDING_COURSE_TRACKS,
    LANDING_FAQ_INDEXES,
    LANDING_FOUNDER_TRUTH_INDEXES,
    LANDING_HERO_KEYWORDS,
    LANDING_ROADMAP_TIERS,
    LANDING_TRACK_COURSE_SLUG,
} from "./constants"
import { HeroBanner } from "@/components/blocks/marketing/HeroBanner"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SectionHeading } from "@/components/blocks/marketing/SectionHeading"
import { TrackCard } from "@/components/blocks/marketing/TrackCard"
import { TruthList } from "@/components/blocks/marketing/TruthList"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Icon per featured course track. */
const COURSE_TRACK_ICONS: Record<string, React.ReactNode> = {
    fullstack: <StackIcon aria-hidden focusable="false" />,
    systemDesign: <TreeStructureIcon aria-hidden focusable="false" />,
    devops: <CloudArrowUpIcon aria-hidden focusable="false" />,
}

/** Metro line colour per track. */
const TRACK_LINE_COLOR: Record<string, "accent" | "success" | "warning"> = {
    fullstack: "accent",
    systemDesign: "success",
    devops: "warning",
}

/** Founder social proof links (brand-icon row in the founder beat). */
const FOUNDER_SOCIALS = [
    { key: "github", href: FOUNDER_GITHUB, icon: FaGithub, label: "GitHub" },
    { key: "linkedin", href: FOUNDER_LINKEDIN, icon: FaLinkedin, label: "LinkedIn" },
    { key: "facebook", href: FOUNDER_FACEBOOK, icon: FaFacebook, label: "Facebook" },
] as const

/** Props for {@link LandingPage}. */
export type LandingPageProps = WithClassNames<undefined>

/**
 * Public landing page. Show-don't-tell information architecture: hero → live
 * proof → the wedge (challenge + AI grading) → track ladder → founder beat →
 * recruiter proof → two-sided outcomes → course catalog (conversion) → FAQ →
 * closing CTA. Real data only (platform stats, open-to-work talent, courses);
 * narrative beats stay tight. Container reads SWR + i18n and composes blocks;
 * all styling lives in the blocks.
 *
 * @param props - optional className (placement only).
 */
export const LandingPage = ({ className }: LandingPageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    /** Smooth-scroll to the embedded course catalog (the conversion surface). */
    const onSeeCourses = () => {
        document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
    }
    const onLogin = () => router.push(pathConfig().locale(locale).authentication().build())

    // Back-to-top FAB — shows after scrolling past the first screen (scrollY > 600), click smooth-scrolls back to the top.
    const [showTop, setShowTop] = React.useState(false)
    React.useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 600)
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // HERO only fills the first fold (min-height = viewport − navbar, dvh prevents the mobile
    // URL bar from causing jumps, vertically centered). Other beats shrink to their content
    // (no min-h) → no more "half-empty screen", and rhythm is even via the root gap.
    const screen = "flex min-h-[calc(100dvh-4rem)] flex-col justify-center"

    return (
        <div className={className}>
            {/* Section-to-section rhythm: gap-16→20 (64–80px) between beats. ONLY the HERO is
                min-h-screen; other beats shrink to their content → this small gap is REAL
                whitespace, enough to separate sections without a short section (stats,
                learn-loop) drifting in the middle of a half-empty screen. */}
            <Box principle="center-measure" className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pt-8 pb-16 @app-sm:px-6 @app-md:gap-20 @app-md:pb-20 @app-md:pt-10 @app-lg:px-8"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                {/* 1 — Hero */}
                <div className={screen}>
                    <HeroBanner
                        eyebrow={t("landing.hero.eyebrow")}
                        eyebrowIcon={<CubeIcon aria-hidden focusable="false" className="size-3" />}
                        headline={t.rich("landing.hero.headline", {
                            accent: (chunks) => <span className="text-accent-soft-foreground">{chunks}</span>,
                        })}
                        subline={t("landing.hero.subline")}
                        primary={(
                            <Button variant="primary" size="lg" onPress={onSeeCourses}>
                                {t("landing.hero.ctaPrimary")}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                            </Button>
                        )}
                        secondary={(
                            <Button variant="secondary" size="lg" onPress={onLogin}>
                                {t("landing.hero.ctaSecondary")}
                            </Button>
                        )}
                        keywords={LANDING_HERO_KEYWORDS}
                        keywordsLabel={t("landing.hero.solveWith")}
                        visual={(
                        // grounded StarCi backend topology in real 3D (R3F) — the System Design
                        // value prop made visible (no image; client-only, SVG fallback while loading).
                            <ArchitectureScene3D caption={t("landing.hero.diagramCaption")} />
                        )}
                    />
                </div>

                {/* 2 — Live proof strip + "transparent" header: frames REAL numbers (early,
                    small) as an honest signal instead of bragging. Header → strip = gap-16
                    (synced with other sections); spacing between beats is handled by the root gap. */}
                <div id="stats" className="flex scroll-mt-24 flex-col gap-16">
                    <SectionHeading
                        anchorId="stats"
                        eyebrow={t("landing.stats.eyebrow")}
                        title={t("landing.stats.title")}
                        intro={t("landing.stats.intro")}
                    />
                    <StatStrip />
                </div>

                {/* 3 — 4-step learn loop (read → grade → capstone → rank): scroll-pinned
                    scrollytelling (section pins, scroll → active step + visual must change;
                    scroll finishes → releases). Falls back to a static layout on
                    mobile / reduced-motion. */}
                <LearnLoopScroll />

                {/* 3 — Roadmap: 3 flagship tracks. Each card = identity (icon/module/tag/title/desc)
                    + tier path (foundation → application) + "Enter course" → the real course. Merged
                    from 2 old sections (Courses + Roadmap) since track = course → avoids rendering
                    the same 3 tracks twice. */}
                <section id="courses" className="flex scroll-mt-24 flex-col gap-12">
                    <SectionHeading
                        anchorId="courses"
                        eyebrow={t("landing.courses.eyebrow")}
                        title={t("landing.courses.title")}
                        intro={t("landing.courses.intro")}
                    />
                    {/* "Three roadmaps · one mindset": each track = 1 self-contained card (identity +
                        a VERTICAL 4-tier path foundation→application + "Enter course" → the real
                        course). 3 cards side by side to read + compare; the same 4-tier structure
                        = "one mindset". */}
                    <Box principle="block-boundary" className="grid grid-cols-1 gap-6 @app-md:grid-cols-3"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.">
                        {LANDING_COURSE_TRACKS.map((key) => (
                            <TrackCard
                                key={key}
                                icon={COURSE_TRACK_ICONS[key]}
                                title={t(`landing.courses.items.${key}.title`)}
                                meta={`${t(`landing.courses.items.${key}.modules`)} · ${t(`landing.courses.items.${key}.systems`)}`}
                                color={TRACK_LINE_COLOR[key]}
                                tiers={LANDING_ROADMAP_TIERS[key]}
                                viewLabel={t("landing.courses.view")}
                                onView={() => router.push(pathConfig().locale(locale).course(LANDING_TRACK_COURSE_SLUG[key]).build())}
                            />
                        ))}
                    </Box>
                </section>

                {/* Skill map — SPLIT: "flex your skills" copy (left) + knowledge graph contained
                    (right). The graph is NO LONGER full-bleed (no more "sprawling everywhere") but
                    keeps the interactive wow factor. */}
                <section id="treasure" className="scroll-mt-24">
                    <div className="grid grid-cols-1 items-center gap-10 @app-lg:grid-cols-[0.85fr_1.15fr] @app-lg:gap-12">
                        {/* LEFT — flex copy: heading + editorial stat + interconnection line + CTA */}
                        <StackV gap={6} principle="block-boundary"
                            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                            items={[
                                () => (
                                    <SectionHeading
                                        anchorId="treasure"
                                        align="start"
                                        eyebrow={t("landing.treasure.eyebrow")}
                                        title={t("landing.treasure.title")}
                                        intro={t("landing.treasure.intro")}
                                    />
                                ),
                                () => (
                                    <StackH gap={6} principle="block-boundary"
                                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                        items={[
                                            () => (
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-medium tracking-tight text-foreground @app-sm:text-4xl">
                                                        {KNOWLEDGE_NODES.length}
                                                    </span>
                                                    <Typography type="body-xs" color="muted">
                                                        {t("landing.treasure.statConcepts")}
                                                    </Typography>
                                                </div>
                                            ),
                                            () => <span aria-hidden className="h-10 w-px bg-default" />,
                                            () => (
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-medium tracking-tight text-foreground @app-sm:text-4xl">
                                                        {LANDING_COURSE_TRACKS.length}
                                                    </span>
                                                    <Typography type="body-xs" color="muted">
                                                        {t("landing.treasure.statTracks")}
                                                    </Typography>
                                                </div>
                                            ),
                                        ]} />
                                ),
                                () => (
                                    <Typography type="body-sm" color="muted">
                                        {t("landing.treasure.interconnect")}
                                    </Typography>
                                ),
                                () => (
                                    <Button variant="primary" size="lg" onPress={onSeeCourses} className="self-start">
                                        {t("landing.treasure.cta")}
                                        <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                                    </Button>
                                ),
                            ]} />
                        {/* RIGHT — knowledge graph contained: ~38 REAL concepts (nodes) linked by
                            builds-on + cross-track relations (d3-force live, drag/zoom). Node colour
                            follows its track, click → the course containing it. "Interconnected
                            knowledge" (Qdrant vibe, @xyflow). */}
                        <KnowledgeGraph />
                    </div>
                </section>

                {/* 5 — Founder beat */}
                <section id="founder" className="flex scroll-mt-24 flex-col gap-12">
                    <SectionHeading
                        anchorId="founder"
                        eyebrow={t("landing.founder.eyebrow")}
                        title={t("landing.founder.title")}
                        intro={t("landing.founder.thesis")}
                    />
                    {/* the uncomfortable truths are the hero; the founder recedes to a
                        byline (who's saying this), each truth anchored to a real mechanism */}
                    <TruthList
                        items={LANDING_FOUNDER_TRUTH_INDEXES.map((index) => ({
                            truth: t(`landing.founder.truth${index}`),
                            fix: t(`landing.founder.fix${index}`),
                        }))}
                        byline={(
                            <>
                                <IconTile
                                    size="sm"
                                    tone="accent"
                                    src="/landing/founder.jpg"
                                    alt={t("landing.founder.name")}
                                    icon={<UserIcon aria-hidden focusable="false" />}
                                />
                                <StackV gap={3} principle="sibling-stack" classNames={["min-w-0"]}
                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                    items={[
                                        () => (
                                            <Typography type="body-sm" weight="semibold">
                                                {t("landing.founder.name")}
                                            </Typography>
                                        ),
                                        () => (
                                            <Typography type="body-xs" color="muted">
                                                {t("landing.founder.titles")}
                                            </Typography>
                                        ),
                                    ]} />
                                <div data-principle="content-row" className="flex items-center gap-3 @app-sm:ml-auto">
                                    {/* social proof — brand icons (GitHub · LinkedIn · Facebook) */}
                                    {FOUNDER_SOCIALS.map(({ key, href, icon: Icon, label }) => (
                                        <Link
                                            key={key}
                                            href={href}
                                            target="_blank"
                                            aria-label={label}
                                            className="text-muted transition-colors hover:text-accent-soft-foreground"
                                        >
                                            <Icon aria-hidden className="size-4" />
                                        </Link>
                                    ))}
                                    {/* blog = "go read + judge the quality yourself" CTA */}
                                    <Link href={pathConfig().locale(locale).blog().build()} data-principle="flex-action" className="inline-flex items-center gap-2 text-accent-soft-foreground">
                                        {t("landing.founder.blog")}
                                        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                    </Link>
                                </div>
                            </>
                        )}
                    />
                </section>

                {/* 6 — Two-sided talent marketplace (engineer outcome + recruiter browse, product-led) */}
                <TalentMarketplace />

                {/* 9 — FAQ */}
                <section id="faq" className="flex scroll-mt-24 flex-col gap-12">
                    <SectionHeading
                        anchorId="faq"
                        eyebrow={t("landing.faq.eyebrow")}
                        title={t("landing.faq.title")}
                    />
                    <Accordion variant="surface">
                        {LANDING_FAQ_INDEXES.map((index) => (
                            <Accordion.Item key={index} aria-label={t(`landing.faq.q${index}`)}>
                                <Accordion.Heading>
                                    <Accordion.Trigger>
                                        <Typography type="body-sm" weight="medium">
                                            {t(`landing.faq.q${index}`)}
                                        </Typography>
                                    </Accordion.Trigger>
                                </Accordion.Heading>
                                <Accordion.Panel>
                                    <Accordion.Body>
                                        <Typography type="body-sm" color="muted">
                                            {t(`landing.faq.a${index}`)}
                                        </Typography>
                                    </Accordion.Body>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </section>

                {/* 10 — Closing CTA */}
                <StackV as="section" align="center" gap={6} principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    items={[
                        () => (
                            <StackV align="center" gap={4} principle="card-caption"
                                explain="Holds caption text under card media so the caption stays attached to the image above it."
                                items={[
                                    () => (
                                        <Typography.Heading level={2} weight="bold" align="center" className="max-w-2xl">
                                            {t("landing.closing.title")}
                                        </Typography.Heading>
                                    ),
                                    () => (
                                        <Typography type="body" color="muted" align="center" className="max-w-xl">
                                            {t("landing.closing.subtitle")}
                                        </Typography>
                                    ),
                                ]} />
                        ),
                        () => (
                            <Button variant="primary" size="lg" onPress={onSeeCourses}>
                                {t("landing.closing.cta")}
                                <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4" />
                            </Button>
                        ),
                    ]} />
            </Box>

            {/* Back-to-top FAB — floats bottom-right (primary accent), shows after scrolling past the first screen */}
            {showTop ? (
                <Button
                    isIconOnly
                    variant="primary"
                    aria-label={t("landing.backToTop")}
                    onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-[calc(var(--app-rail-w,0px)+1.5rem)] z-40 size-12 rounded-full shadow-lg"
                >
                    <ArrowUpIcon aria-hidden focusable="false" className="size-5" />
                </Button>
            ) : null}
        </div>
    )
}
