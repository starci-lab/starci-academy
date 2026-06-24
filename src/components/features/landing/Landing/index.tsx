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
    BookOpenIcon,
    BuildingsIcon,
    CubeIcon,
    PuzzlePieceIcon,
    RobotIcon,
    RocketLaunchIcon,
    UserIcon,
} from "@phosphor-icons/react"
import { FaGithub } from "react-icons/fa6"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { CourseCatalog } from "@/components/features/course/CourseCatalog"
import {
    FounderManifesto,
    HeroBanner,
    IconTile,
    PitchCard,
    SectionHeading,
    TrackLadder,
} from "@/components/blocks"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { FOUNDER_GITHUB } from "@/components/features/contact/Contact/constants"
import { StatStrip } from "./StatStrip"
import { RecruiterProof } from "./RecruiterProof"
import {
    LANDING_FAQ_INDEXES,
    LANDING_HERO_KEYWORDS,
    LANDING_OUTCOME_KEYS,
    LANDING_TRACK_KEYS,
    LANDING_WEDGE_KEYS,
} from "./constants"

/** Icon per wedge pillar key. */
const WEDGE_ICONS: Record<string, React.ReactNode> = {
    content: <BookOpenIcon aria-hidden focusable="false" />,
    challenge: <PuzzlePieceIcon aria-hidden focusable="false" />,
    aiGrading: <RobotIcon aria-hidden focusable="false" />,
}

/** Icon per outcome card key. */
const OUTCOME_ICONS: Record<string, React.ReactNode> = {
    engineer: <RocketLaunchIcon aria-hidden focusable="false" />,
    enterprise: <BuildingsIcon aria-hidden focusable="false" />,
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
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
                {/* 1 — Hero */}
                <HeroBanner
                    eyebrow={t("landing.hero.eyebrow")}
                    eyebrowIcon={<CubeIcon aria-hidden focusable="false" className="size-3" />}
                    headline={t.rich("landing.hero.headline", {
                        crud: (chunks) => <span className="line-through">{chunks}</span>,
                        accent: (chunks) => <span className="text-accent">{chunks}</span>,
                        br: () => <br />,
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
                />

                {/* 2 — Live proof strip */}
                <StatStrip />

                {/* 3 — The wedge: learn for real */}
                <section className="flex flex-col gap-6">
                    <SectionHeading
                        eyebrow={t("landing.wedge.eyebrow")}
                        title={t("landing.wedge.title")}
                        intro={t("landing.wedge.intro")}
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {LANDING_WEDGE_KEYS.map((key) => (
                            <PitchCard
                                key={key}
                                icon={WEDGE_ICONS[key]}
                                title={t(`landing.wedge.items.${key}.title`)}
                                body={t(`landing.wedge.items.${key}.body`)}
                            />
                        ))}
                    </div>
                </section>

                {/* 4 — Track ladder */}
                <section className="flex flex-col gap-6">
                    <SectionHeading
                        eyebrow={t("landing.roadmap.eyebrow")}
                        title={t("landing.roadmap.title")}
                        intro={t("landing.roadmap.intro")}
                    />
                    <TrackLadder
                        tracks={LANDING_TRACK_KEYS.map((key) => ({
                            label: t(`landing.roadmap.tracks.${key}.label`),
                            caption: t(`landing.roadmap.tracks.${key}.caption`),
                            highlighted: key === "architect",
                        }))}
                    />
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
                                icon={<UserIcon aria-hidden focusable="false" />}
                            />
                        )}
                        name={t("contact.founder.name")}
                        role={t("landing.founder.role")}
                        body={(
                            <>
                                <Typography type="body" color="muted">
                                    {t("landing.founder.body1")}
                                </Typography>
                                <Typography type="body" color="muted">
                                    {t("landing.founder.body2")}
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

                {/* 8 — Course catalog (conversion surface) */}
                <section id="courses" className="scroll-mt-20">
                    <CourseCatalog />
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
                    <Typography.Heading level={2} weight="bold" align="center" className="max-w-2xl">
                        {t("landing.closing.title")}
                    </Typography.Heading>
                    <Button variant="primary" size="lg" onPress={onSeeCourses}>
                        {t("landing.closing.cta")}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                    </Button>
                </section>
            </div>
        </div>
    )
}
