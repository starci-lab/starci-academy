"use client"

import React from "react"
import {
    Accordion,
    Button,
    Chip,
    Link,
    Table,
    Typography,
} from "@heroui/react"
import {
    ArrowRightIcon,
    BookOpenIcon,
    BuildingsIcon,
    CaretRightIcon,
    ChatCircleIcon,
    CloudArrowUpIcon,
    CubeIcon,
    LightningIcon,
    MapPinIcon,
    NewspaperIcon,
    RobotIcon,
    RocketLaunchIcon,
    StackIcon,
    TreeStructureIcon,
    TrophyIcon,
    UserIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import { FaGithub } from "react-icons/fa6"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    ArchitectureFlow,
    FounderManifesto,
    HeroBanner,
    IconTile,
    MicroservicesDiagram,
    PitchCard,
    SectionHeading,
} from "@/components/blocks"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { FOUNDER_GITHUB } from "@/components/features/contact/Contact/constants"
import { StatStrip } from "./StatStrip"
import { RecruiterProof } from "./RecruiterProof"
import {
    LANDING_COURSE_TRACKS,
    LANDING_FAQ_INDEXES,
    LANDING_FOUNDER_EXPERTISE,
    LANDING_HERO_KEYWORDS,
    LANDING_LOOP_STEPS,
    LANDING_OUTCOME_KEYS,
    LANDING_ROADMAP_TIERS,
    LANDING_SYSTEM_FLOWS,
    LANDING_SYSTEM_KEYS,
    LANDING_TRACK_COURSE_SLUG,
} from "./constants"

/** Icon cho từng bước trong vòng học. */
const LOOP_ICONS: Record<string, React.ReactNode> = {
    read: <BookOpenIcon aria-hidden focusable="false" />,
    grade: <RobotIcon aria-hidden focusable="false" />,
    capstone: <RocketLaunchIcon aria-hidden focusable="false" />,
    rank: <TrophyIcon aria-hidden focusable="false" />,
}

/** Icon per outcome card key. */
const OUTCOME_ICONS: Record<string, React.ReactNode> = {
    engineer: <RocketLaunchIcon aria-hidden focusable="false" />,
    enterprise: <BuildingsIcon aria-hidden focusable="false" />,
}

/** Icon per featured course track. */
const COURSE_TRACK_ICONS: Record<string, React.ReactNode> = {
    fullstack: <StackIcon aria-hidden focusable="false" />,
    systemDesign: <TreeStructureIcon aria-hidden focusable="false" />,
    devops: <CloudArrowUpIcon aria-hidden focusable="false" />,
}

/** Icon per "real system you build" key (the SD capstones — 6 còn lại sau khi bỏ video + search). */
const SYSTEM_ICONS: Record<string, React.ReactNode> = {
    newsfeed: <NewspaperIcon aria-hidden focusable="false" />,
    flashSale: <LightningIcon aria-hidden focusable="false" />,
    wallet: <WalletIcon aria-hidden focusable="false" />,
    rideHailing: <MapPinIcon aria-hidden focusable="false" />,
    chat: <ChatCircleIcon aria-hidden focusable="false" />,
    deploy: <CloudArrowUpIcon aria-hidden focusable="false" />,
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

    return (
        <div className={className}>
            <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 sm:gap-24 sm:px-6 sm:py-24 lg:px-8">
                {/* 1 — Hero */}
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

                {/* 2 — Live proof strip */}
                <StatStrip />

                {/* 3 — Vòng học 4 bước: read → grade → capstone → rank */}
                <section className="flex flex-col gap-6">
                    <SectionHeading
                        eyebrow={t("landing.learnLoop.eyebrow")}
                        title={t("landing.learnLoop.title")}
                        intro={t("landing.learnLoop.intro")}
                    />
                    {/* Hàng 4 thẻ nối bằng mũi tên — mũi tên ẩn trên mobile (flex-col) */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                        {LANDING_LOOP_STEPS.map((key, index) => (
                            <React.Fragment key={key}>
                                {/* Thẻ bước */}
                                <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-default bg-surface p-5">
                                    {/* Số thứ tự + icon */}
                                    <div className="flex items-center justify-between">
                                        <Typography type="code" className="text-accent">
                                            {t(`landing.learnLoop.items.${key}.step`)}
                                        </Typography>
                                        <span className="text-muted [&>svg]:size-5">
                                            {LOOP_ICONS[key]}
                                        </span>
                                    </div>
                                    {/* Micro-label kỹ thuật (cho phép UPPERCASE trên landing này) */}
                                    <Typography type="code" className="text-xs text-muted">
                                        {t(`landing.learnLoop.items.${key}.tag`)}
                                    </Typography>
                                    {/* Tiêu đề bước */}
                                    <Typography type="body" weight="semibold">
                                        {t(`landing.learnLoop.items.${key}.title`)}
                                    </Typography>
                                    {/* Mô tả ngắn */}
                                    <Typography type="body-sm" color="muted">
                                        {t(`landing.learnLoop.items.${key}.desc`)}
                                    </Typography>
                                </div>
                                {/* Mũi tên nối — chỉ hiện từ sm trở lên, ẩn sau thẻ cuối */}
                                {index < LANDING_LOOP_STEPS.length - 1 && (
                                    <div className="hidden items-center sm:flex">
                                        <CaretRightIcon aria-hidden focusable="false" className="size-5 text-muted" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* 3 — Lộ trình: 3 track tiêu biểu. Mỗi card = identity (icon/module/tag/title/desc)
                    + tier path (foundation → application) + "Vào khóa" → course thật. Gộp từ 2
                    section cũ (Courses + Roadmap) vì track = course → tránh render lặp cùng 3 track. */}
                <section id="courses" className="flex scroll-mt-20 flex-col gap-6">
                    <SectionHeading
                        eyebrow={t("landing.courses.eyebrow")}
                        title={t("landing.courses.title")}
                        intro={t("landing.courses.intro")}
                    />
                    {/* Hướng A — ma trận trục chung: 4 tầng (cột) hiện 1 LẦN = "một tư duy";
                        mỗi track 1 hàng. Hết lặp ladder ở từng card. HeroUI Table (ScrollContainer
                        lo overflow ngang trên mobile). Cột đầu = identity track + CTA ra khóa thật. */}
                    <Table variant="primary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label={t("landing.courses.title")}>
                                <Table.Header>
                                    <Table.Column isRowHeader>
                                        <span className="sr-only">{t("landing.courses.eyebrow")}</span>
                                    </Table.Column>
                                    {LANDING_ROADMAP_TIERS[LANDING_COURSE_TRACKS[0]].map((tier, index) => (
                                        <Table.Column key={tier.label}>
                                            <span className="text-accent">{index + 1}</span>
                                            {" · "}
                                            {tier.label}
                                        </Table.Column>
                                    ))}
                                </Table.Header>
                                <Table.Body>
                                    {LANDING_COURSE_TRACKS.map((key) => (
                                        <Table.Row key={key}>
                                            <Table.Cell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-accent [&>svg]:size-5">{COURSE_TRACK_ICONS[key]}</span>
                                                        <Typography type="body-sm" weight="semibold">
                                                            {t(`landing.courses.items.${key}.title`)}
                                                        </Typography>
                                                    </div>
                                                    <Typography type="code" className="text-xs text-muted">
                                                        {t(`landing.courses.items.${key}.modules`)}
                                                        {" · "}
                                                        {t("landing.courses.systems")}
                                                    </Typography>
                                                    <Link
                                                        onPress={() => router.push(pathConfig().locale(locale).course(LANDING_TRACK_COURSE_SLUG[key]).build())}
                                                        className="inline-flex w-fit cursor-pointer items-center gap-1 pt-0.5 text-sm text-accent"
                                                    >
                                                        {t("landing.courses.view")}
                                                        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                                    </Link>
                                                </div>
                                            </Table.Cell>
                                            {LANDING_ROADMAP_TIERS[key].map((tier) => (
                                                <Table.Cell key={tier.label}>
                                                    <Typography type="body-sm">{tier.topic}</Typography>
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </section>

                {/* Real systems you build — the strongest "not CRUD" proof (curated SD capstones) */}
                <section className="flex flex-col gap-6">
                    <SectionHeading
                        eyebrow={t("landing.systems.eyebrow")}
                        title={t("landing.systems.title")}
                        intro={t("landing.systems.intro")}
                    />
                    {/* each system = a coded mini architecture diagram (ArchitectureFlow) — visual
                        proof of "real systems", no screenshot needed */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {LANDING_SYSTEM_KEYS.map((key) => (
                            <div
                                key={key}
                                className="flex flex-col gap-3 rounded-2xl border border-default bg-surface p-4"
                            >
                                {/* Header: icon + tên trái — badge kỹ thuật phải */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-accent [&>svg]:size-5">{SYSTEM_ICONS[key]}</span>
                                        <Typography type="body-sm" weight="semibold">
                                            {t(`landing.systems.items.${key}.name`)}
                                        </Typography>
                                    </div>
                                    {/* Badge UPPERCASE kỹ thuật — được phép trên landing này (thầy duyệt) */}
                                    <Typography type="code" className="text-[10px] text-accent">
                                        {t(`landing.systems.items.${key}.badge`)}
                                    </Typography>
                                </div>
                                <ArchitectureFlow nodes={LANDING_SYSTEM_FLOWS[key]} />
                                <Typography type="body-xs" color="muted">
                                    {t(`landing.systems.items.${key}.tag`)}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5 — Founder beat */}
                <section className="flex flex-col gap-6">
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

                {/* 6 — Recruiter proof (real open-to-work talent) */}
                <RecruiterProof />

                {/* 7 — Two-sided outcomes */}
                <section className="flex flex-col gap-6">
                    <SectionHeading
                        eyebrow={t("landing.outcome.eyebrow")}
                        title={t("landing.outcome.title")}
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {LANDING_OUTCOME_KEYS.map((key) => (
                            <PitchCard
                                key={key}
                                icon={OUTCOME_ICONS[key]}
                                title={t(`landing.outcome.items.${key}.title`)}
                                body={t(`landing.outcome.items.${key}.body`)}
                                footer={key === "enterprise" ? (
                                    <Link
                                        href={pathConfig().locale(locale).contact().build()}
                                        className="inline-flex items-center gap-2 text-accent"
                                    >
                                        {t("landing.outcome.items.enterprise.cta")}
                                        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                    </Link>
                                ) : undefined}
                            />
                        ))}
                    </div>
                </section>

                {/* 9 — FAQ */}
                <section className="flex flex-col gap-6">
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
                <section className="flex flex-col items-center gap-6">
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
