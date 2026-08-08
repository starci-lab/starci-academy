"use client"

import React from "react"
import {
    FaFacebook,
    FaLinkedin,
    FaGithub,
} from "react-icons/fa6"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { pathConfig } from "@/resources/path"
import {
    CONTACT_EMAIL,
    FOUNDER_FACEBOOK,
    FOUNDER_GITHUB,
    FOUNDER_LINKEDIN,
} from "@/resources/contact"
import { BrandLockup } from "@/components/blocks/identity/BrandLockup"
import { FooterLinkColumn } from "@/components/blocks/navigation/Footer/FooterLinkColumn"
import { InlineLink } from "@/components/atoms/navigation/Link"
import { Typography } from "@/components/atoms/text/Typography"
import { FooterFrame } from "@/components/frames/FooterFrame"
import { Measure } from "@/components/frames/Measure"
import { StackH, StackV } from "@/components/frames/Stack"

/** Founder social links (brand logos → react-icons/fa6 per the icon rule). */
const SOCIALS = [
    { id: "facebook", href: FOUNDER_FACEBOOK, icon: FaFacebook, labelKey: "facebook" as const },
    { id: "linkedin", href: FOUNDER_LINKEDIN, icon: FaLinkedin, labelKey: "linkedin" as const },
    { id: "github", href: FOUNDER_GITHUB, icon: FaGithub, labelKey: "github" as const },
] as const

/** Props for {@link Footer}. */
export type FooterProps = Record<string, never>

/**
 * Global site footer (editorial-minimal). Connected layout half: locale copy +
 * router wiring over the same `FooterFrame` / `Measure` / column vocabulary as
 * the starci `Footer` block. Hidden on the reader/auth shells by the caller
 * ({@link InnerLayout}).
 */
export const Footer = () => {
    const t = useTranslations()
    const router = useRouter()
    const paths = pathConfig().locale()
    const year = new Date().getFullYear()

    const exploreLinks = [
        { id: "courses", label: t("footer.links.courses"), onPress: () => router.push(paths.course().build()) },
        { id: "blog", label: t("footer.links.blog"), onPress: () => router.push(paths.blog().build()) },
        { id: "talents", label: t("footer.links.talents"), onPress: () => router.push(paths.talents().build()) },
        { id: "jobs", label: t("footer.links.jobs"), onPress: () => router.push(paths.jobs().build()) },
        { id: "community", label: t("footer.links.community"), onPress: () => router.push(paths.community().build()) },
    ]
    const supportLinks = [
        { id: "contact", label: t("footer.links.contact"), onPress: () => router.push(paths.contact().build()) },
        {
            id: "email",
            label: CONTACT_EMAIL,
            onPress: () => {
                window.location.href = `mailto:${CONTACT_EMAIL}`
            },
        },
    ]

    const socialLinkItems = SOCIALS.map((social) => () => (
        <InlineLink
            key={social.id}
            icon={social.icon}
            ariaLabel={t(`contact.founder.${social.labelKey}`)}
            onPress={() => {
                window.open(social.href, "_blank", "noreferrer")
            }}
        />
    ))

    return (
        <FooterFrame
            identity={{ tier: "layout", component: "Footer" }}
            body={() => (
                <StackV
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    divider
                    items={[
                        () => (
                            <StackH
                                principle="layout-split"
                                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                                at="md"
                                items={[
                                    () => (
                                        <Measure
                                            size="sm"
                                            body={() => (
                                                <StackV
                                                    principle="card-caption"
                                                    explain="Brand lockup over its tagline and socials — not title-subtitle, because the social row is a separate action cluster rather than a continuing subtitle line."
                                                    items={[
                                                        () => <BrandLockup />,
                                                        () => (
                                                            <Typography
                                                                size="sm"
                                                                color="muted"
                                                                text={t("footer.tagline")}
                                                            />
                                                        ),
                                                        () => (
                                                            <StackH
                                                                principle="flex-action"
                                                                explain="Groups social icon controls on one horizontal peer row so they share a single hit baseline — not chip-row, because these are press targets rather than display tags."
                                                                items={socialLinkItems}
                                                            />
                                                        ),
                                                    ]}
                                                />
                                            )}
                                        />
                                    ),
                                    () => (
                                        <StackH
                                            principle="layout-split"
                                            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                                            at="sm"
                                            items={[
                                                () => (
                                                    <FooterLinkColumn
                                                        title={t("footer.exploreTitle")}
                                                        links={exploreLinks}
                                                    />
                                                ),
                                                () => (
                                                    <FooterLinkColumn
                                                        title={t("footer.supportTitle")}
                                                        links={supportLinks}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <StackH
                                principle="sibling-stack"
                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                at="sm"
                                items={[
                                    () => (
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            text={`${t("footer.copyright", { year })} · ${t("footer.madeBy")}`}
                                        />
                                    ),
                                    () => (
                                        <StackH
                                            principle="flex-action"
                                            explain="Groups legal stubs on one horizontal peer row so they share a single hit baseline — not chip-row, because these are press targets rather than display tags."
                                            items={[
                                                () => (
                                                    <InlineLink
                                                        label={t("footer.links.terms")}
                                                        size="xs"
                                                        onPress={() => router.push(paths.terms().build())}
                                                    />
                                                ),
                                                () => (
                                                    <InlineLink
                                                        label={t("footer.links.privacy")}
                                                        size="xs"
                                                        onPress={() => router.push(paths.privacy().build())}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}
