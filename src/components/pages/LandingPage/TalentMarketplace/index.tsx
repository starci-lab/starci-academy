"use client"

import React from "react"
import {
    Button,
    Chip,
    cn,
    Typography,
} from "@heroui/react"
import {
    BuildingsIcon,
    CaretRightIcon,
    CheckCircleIcon,
    LightningIcon,
    RocketLaunchIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LANDING_SAMPLE_CANDIDATE } from "../constants"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SectionHeading } from "@/components/blocks/marketing/SectionHeading"
import { ShowcaseMockup, SHOWCASE_THEMES } from "@/components/blocks/marketing/ShowcaseMockup"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link TalentMarketplace}. */
export type TalentMarketplaceProps = WithClassNames<undefined>

/** One flat "journey" row (engineer / company) — icon tile + claim + proof copy. */
const JourneyRow = ({
    icon,
    title,
    body,
}: {
    icon: React.ReactNode
    title: string
    body: string
}) => (
    <StackH gap={4} align="start" principle="content-row"
        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
        items={[
            () => <IconTile icon={icon} tone="accent" size="md" />,
            () => (
                <StackV gap={3} principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    items={[
                        () => <Typography type="h5" weight="semibold">{title}</Typography>,
                        () => <Typography type="body-sm" color="muted">{body}</Typography>,
                    ]} />
            ),
        ]} />
)

/** One label → value stat line inside the sample candidate card. */
const StatLine = ({ label, value }: { label: string; value: string }) => (
    <StackH gap={4} justify="between" principle="content-row"
        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
        items={[
            () => <Typography type="body-sm" color="muted">{label}</Typography>,
            () => <Typography type="body-sm" weight="medium">{value}</Typography>,
        ]} />
)

/**
 * Static sample candidate card — an illustrative "engineer profile" rendered as
 * a mini browser window (ShowcaseMockup chrome + profile URL), mirroring the real
 * public profile page: rank avatar, open-to-work badge, CV score, system
 * challenges, skills, XP. NOT backed by an API; numbers come from
 * {@link LANDING_SAMPLE_CANDIDATE}. Labels via `landing.outcome.card.*`.
 */
const SampleCandidateCard = () => {
    const t = useTranslations()
    const locale = useLocale()
    const c = LANDING_SAMPLE_CANDIDATE

    return (
        <ShowcaseMockup
            url={`starci.academy/profile/${c.slug}`}
            theme={SHOWCASE_THEMES.starci}
            backdrop="glow"
            contentClassName="flex flex-col gap-3 p-4"
        >
            <StackH gap={4} principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => <UserAvatar username={c.name} avatar={c.avatarUrl} seed={c.name} className="size-14 !rounded-full" />,
                    () => (
                        <div className="flex min-w-0 flex-col gap-0">
                            <Typography type="body" weight="semibold" truncate>
                                {c.name}
                            </Typography>
                            <Typography type="body-xs" color="muted" truncate>
                                {t("landing.outcome.card.role")}
                            </Typography>
                        </div>
                    ),
                ]} />

            <Chip variant="soft" color="success" size="sm" className="self-start">
                <CheckCircleIcon aria-hidden focusable="false" className="size-4" />
                <Chip.Label>{t("landing.outcome.card.openToWork")}</Chip.Label>
            </Chip>

            <div data-principle="sibling-stack" className="flex flex-col gap-2 border-t border-default pt-3">
                <StatLine
                    label={t("landing.outcome.card.cvScore")}
                    value={`${c.cvScore} / 100`}
                />
                <StatLine
                    label={t("landing.outcome.card.challenges")}
                    value={t("landing.outcome.card.challengeValue", {
                        count: c.challengeCount,
                        avg: c.challengeAvg,
                    })}
                />
            </div>

            <div data-principle="chip-row" className="flex flex-wrap items-center gap-2 border-t border-default pt-3">
                {c.skills.map((skill) => (
                    <Chip key={skill} variant="soft" color="default" size="sm">
                        <Chip.Label>{skill}</Chip.Label>
                    </Chip>
                ))}
                <span data-principle="push-end" className="ml-auto inline-flex items-center gap-2 text-sm text-muted">
                    <LightningIcon aria-hidden focusable="false" className="size-4 text-muted" />
                    {t("landing.outcome.card.xp", { xp: c.xp.toLocaleString(locale) })}
                </span>
            </div>
        </ShowcaseMockup>
    )
}

/**
 * Two-sided talent marketplace beat — the engineer / company outcome split,
 * product-led: the left column states each journey + its CTA, the right column
 * SHOWS the candidate card a recruiter browses (a static sample). Pure +
 * navigation only (no API); replaces the old outcome cards + recruiter-proof beat.
 *
 * @param props - optional className (placement only).
 */
export const TalentMarketplace = ({ className }: TalentMarketplaceProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const onBuildPortfolio = () => router.push(pathConfig().locale(locale).course().build())
    const onBrowseTalents = () => router.push(pathConfig().locale(locale).talents().build())
    const onBrowseJobs = () => router.push(pathConfig().locale(locale).jobs().build())

    return (
        <section className={cn("flex flex-col gap-16", className)}>
            <SectionHeading
                eyebrow={t("landing.outcome.eyebrow")}
                title={t("landing.outcome.title")}
            />
            <div className="grid grid-cols-1 gap-x-12 gap-y-20 @app-lg:grid-cols-2 @app-lg:items-center">
                {/* Left — two journeys + separate CTAs */}
                <StackV gap={6} principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    items={[
                        () => (
                            <StackV gap={6} principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                items={[
                                    () => (
                                        <JourneyRow
                                            icon={<RocketLaunchIcon aria-hidden focusable="false" />}
                                            title={t("landing.outcome.items.engineer.title")}
                                            body={t("landing.outcome.items.engineer.body")}
                                        />
                                    ),
                                    () => (
                                        <JourneyRow
                                            icon={<BuildingsIcon aria-hidden focusable="false" />}
                                            title={t("landing.outcome.items.enterprise.title")}
                                            body={t("landing.outcome.items.enterprise.body")}
                                        />
                                    ),
                                ]} />
                        ),
                        () => (
                            <div data-principle="content-row" className="flex flex-wrap items-center gap-3">
                                <Button variant="primary" size="lg" onPress={onBuildPortfolio}>
                                    <RocketLaunchIcon aria-hidden focusable="false" className="size-5" />
                                    {t("landing.outcome.items.engineer.cta")}
                                </Button>
                                <Button variant="secondary" size="md" onPress={onBrowseTalents}>
                                    {t("landing.outcome.items.enterprise.cta")}
                                    <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4" />
                                </Button>
                                <Button variant="tertiary" onPress={onBrowseJobs}>
                                    {t("landing.outcome.items.engineer.jobsCta")}
                                    <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4" />
                                </Button>
                            </div>
                        ),
                    ]} />

                {/* Right — sample candidate card (static) */}
                <SampleCandidateCard />
            </div>
        </section>
    )
}
