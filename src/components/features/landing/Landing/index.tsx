"use client"

import React from "react"
import {
    Accordion,
    Button,
    Chip,
    Link,
    Typography,
} from "@heroui/react"
import {
    ArrowRightIcon,
    CloudArrowUpIcon,
    CodeIcon,
    CubeIcon,
    HardDrivesIcon,
    StackIcon,
    TreeStructureIcon,
    UserIcon,
} from "@phosphor-icons/react"
import { FaGithub } from "react-icons/fa6"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    FounderManifesto,
    HeroBanner,
    IconTile,
    MicroservicesDiagram,
    RoadmapMetro,
    SectionHeading,
    TopicLane,
} from "@/components/blocks"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { FOUNDER_GITHUB } from "@/components/features/contact/Contact/constants"
import { StatStrip } from "./StatStrip"
import { TalentMarketplace } from "./TalentMarketplace"
import { LearnLoopScroll } from "./LearnLoopScroll"
import {
    LANDING_COURSE_TRACKS,
    LANDING_FAQ_INDEXES,
    LANDING_FOUNDER_EXPERTISE,
    LANDING_HERO_KEYWORDS,
    LANDING_ROADMAP_TIERS,
    LANDING_TRACK_COURSE_SLUG,
    LANDING_TRACK_TAG,
    LANDING_TREASURE_TOPICS,
} from "./constants"

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

/** Props for {@link Landing}. */
export type LandingProps = WithClassNames<undefined>

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
export const Landing = ({ className }: LandingProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    /** Smooth-scroll to the embedded course catalog (the conversion surface). */
    const onSeeCourses = () => {
        document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
    }
    const onLogin = () => router.push(pathConfig().locale(locale).authentication().build())

    // Mỗi "beat" = 1 màn: min-height = viewport − navbar (dvh chống nhảy do thanh URL
    // mobile) + căn giữa dọc. min-h (KHÔNG height cứng) → section ngắn đầy 1 màn, section
    // dài (3 rail lộ trình, catalog…) vẫn giãn ra được, không bị cắt cụt.
    const screen = "flex min-h-[calc(100dvh-4rem)] flex-col justify-center"

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
                {/* 1 — Hero */}
                <div className={screen}>
                    <HeroBanner
                        eyebrow={t("landing.hero.eyebrow")}
                        eyebrowIcon={<CubeIcon aria-hidden focusable="false" className="size-3" />}
                        headline={t.rich("landing.hero.headline", {
                            accent: (chunks) => <span className="text-accent">{chunks}</span>,
                        })}
                        subline={t("landing.hero.subline")}
                        primary={(
                            <Button variant="primary" size="lg" onPress={onSeeCourses}>
                                {t("landing.hero.ctaPrimary")}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                            </Button>
                        )}
                        secondary={(
                            <Button variant="secondary" onPress={onLogin}>
                                {t("landing.hero.ctaSecondary")}
                            </Button>
                        )}
                        keywords={LANDING_HERO_KEYWORDS}
                        keywordsLabel={t("landing.hero.solveWith")}
                        visual={(
                        // coded microservices "where it breaks" diagram — the System Design value
                        // prop made visible (no image needed). Matches the v0 hero.
                            <MicroservicesDiagram caption={t("landing.hero.diagramCaption")} />
                        )}
                    />
                </div>

                {/* 2 — Live proof strip (strip mỏng, có thể tự ẩn → KHÔNG ép full-screen) */}
                <div className="py-16">
                    <StatStrip />
                </div>

                {/* 3 — Vòng học 4 bước (read → grade → capstone → rank): scroll-pinned
                    scrollytelling (ghim section, cuộn → bước active + visual phải đổi;
                    cuộn hết → nhả). Tự rơi về layout tĩnh trên mobile / reduced-motion. */}
                <LearnLoopScroll />

                {/* 3 — Lộ trình: 3 track tiêu biểu. Mỗi card = identity (icon/module/tag/title/desc)
                    + tier path (foundation → application) + "Vào khóa" → course thật. Gộp từ 2
                    section cũ (Courses + Roadmap) vì track = course → tránh render lặp cùng 3 track. */}
                <section id="courses" className="flex min-h-[calc(100dvh-4rem)] scroll-mt-20 flex-col justify-center gap-6">
                    <SectionHeading
                        eyebrow={t("landing.courses.eyebrow")}
                        title={t("landing.courses.title")}
                        intro={t("landing.courses.intro")}
                    />
                    {/* Metro map — "ba lộ trình · một tư duy": 1 trục 4 ga dùng chung, mỗi track
                        là 1 tuyến màu chạy qua các ga; ga cuối (Application) = đích + "Vào khóa". */}
                    <RoadmapMetro
                        stations={LANDING_ROADMAP_TIERS[LANDING_COURSE_TRACKS[0]].map((tier) => tier.label)}
                        tracks={LANDING_COURSE_TRACKS.map((key) => ({
                            key,
                            icon: COURSE_TRACK_ICONS[key],
                            title: t(`landing.courses.items.${key}.title`),
                            meta: `${t(`landing.courses.items.${key}.modules`)} · ${t("landing.courses.systems")}`,
                            color: TRACK_LINE_COLOR[key],
                            stops: LANDING_ROADMAP_TIERS[key].map((tier) => tier.topic),
                            viewLabel: t("landing.courses.view"),
                            onView: () => router.push(pathConfig().locale(locale).course(LANDING_TRACK_COURSE_SLUG[key]).build()),
                        }))}
                    />
                </section>

                {/* Kho tàng nội dung — 2 làn code ↔ infra; mỗi chip = bài THẬT (rút từ
                    content) → bấm vào khóa chứa nó. Khoe chiều sâu chương trình. */}
                <section className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-6">
                    <SectionHeading
                        eyebrow={t("landing.treasure.eyebrow")}
                        title={t("landing.treasure.title")}
                        intro={t("landing.treasure.intro")}
                    />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <TopicLane
                            icon={<CodeIcon aria-hidden focusable="false" />}
                            title={t("landing.treasure.codeLane")}
                            items={LANDING_TREASURE_TOPICS.code.map((topic) => ({
                                label: topic.label,
                                tag: LANDING_TRACK_TAG[topic.track],
                                onPress: () => router.push(
                                    pathConfig().locale(locale).course(LANDING_TRACK_COURSE_SLUG[topic.track]).build(),
                                ),
                            }))}
                        />
                        <TopicLane
                            icon={<HardDrivesIcon aria-hidden focusable="false" />}
                            title={t("landing.treasure.infraLane")}
                            items={LANDING_TREASURE_TOPICS.infra.map((topic) => ({
                                label: topic.label,
                                tag: LANDING_TRACK_TAG[topic.track],
                                onPress: () => router.push(
                                    pathConfig().locale(locale).course(LANDING_TRACK_COURSE_SLUG[topic.track]).build(),
                                ),
                            }))}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Typography type="body-xs" color="muted">
                            {t("landing.treasure.footnote")}
                        </Typography>
                        <Link onPress={onSeeCourses} className="inline-flex cursor-pointer items-center gap-1 text-accent">
                            {t("landing.treasure.seeAll")}
                            <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                        </Link>
                    </div>
                </section>

                {/* 5 — Founder beat */}
                <section className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-6">
                    <SectionHeading
                        eyebrow={t("landing.founder.eyebrow")}
                        title={t("landing.founder.title")}
                    />
                    <FounderManifesto
                        portrait={(
                            <IconTile
                                size="lg"
                                tone="accent"
                                src="/landing/founder.jpg"
                                alt={t("landing.founder.name")}
                                icon={<UserIcon aria-hidden focusable="false" />}
                            />
                        )}
                        name={t("landing.founder.name")}
                        role={t("landing.founder.role")}
                        body={(
                            <>
                                {/* CTO titles (authority) + expertise chips */}
                                <Typography type="body-sm" color="muted">
                                    {t("landing.founder.titles")}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {LANDING_FOUNDER_EXPERTISE.map((key) => (
                                        <Chip key={key} variant="soft" color="accent" size="sm">
                                            <Chip.Label>{t(`landing.founder.expertise.${key}`)}</Chip.Label>
                                        </Chip>
                                    ))}
                                </div>
                                {/* playful founder voice — blockquote, humanizes the authority */}
                                <blockquote className="border-l-2 border-separator pl-3">
                                    <Typography type="body" className="italic text-foreground">
                                        {t("landing.founder.quote")}
                                    </Typography>
                                </blockquote>
                                <Typography type="body" color="muted">
                                    {t("landing.founder.body1")}
                                </Typography>
                            </>
                        )}
                        links={(
                            <>
                                <Link href={FOUNDER_GITHUB} target="_blank" className="inline-flex items-center gap-2 text-accent">
                                    <FaGithub aria-hidden className="size-5" />
                                    {t("landing.founder.github")}
                                </Link>
                                <Link href={pathConfig().locale(locale).blog().build()} className="inline-flex items-center gap-2 text-accent">
                                    {t("landing.founder.blog")}
                                    <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                </Link>
                            </>
                        )}
                    />
                </section>

                {/* 6 — Two-sided talent marketplace (engineer outcome + recruiter browse, product-led) */}
                <div className={screen}>
                    <TalentMarketplace />
                </div>

                {/* 9 — FAQ */}
                <section className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-6">
                    <SectionHeading
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
                <section className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-3">
                        <Typography.Heading level={2} weight="bold" align="center" className="max-w-2xl">
                            {t("landing.closing.title")}
                        </Typography.Heading>
                        <Typography type="body" color="muted" align="center" className="max-w-xl">
                            {t("landing.closing.subtitle")}
                        </Typography>
                    </div>
                    <Button variant="primary" size="lg" onPress={onSeeCourses}>
                        {t("landing.closing.cta")}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                    </Button>
                </section>
            </div>
        </div>
    )
}
