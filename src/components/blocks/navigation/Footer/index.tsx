import React from "react"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { Logo } from "@/components/atoms/display/Logo"
import { Typography } from "@/components/atoms/text/Typography"
import { InlineLink } from "@/components/atoms/navigation/Link"
import type { IconComponent } from "@/components/atoms/buttons/Button"
import { FooterFrame } from "@/components/frames/FooterFrame"
import { Measure } from "@/components/frames/Measure"
import { ShowFrom } from "@/components/frames/ShowFrom"
import { StackH, StackV } from "@/components/frames/Stack"
import { FooterLinkColumn } from "./FooterLinkColumn"

/**
 * BLOCK — `Footer`: the marketing site footer. See the component's own file
 * header for the full port/reuse ledger; this story only exercises what a
 * caller actually configures.
 *
 * ONE LEAF — the footer has a single structural shape (brand column, two link
 * columns, bottom bar); nothing about its composition ever drops or gains a
 * whole node. Longer vs. shorter link lists are DATA, so they live as states
 * inside this one leaf rather than separate leaves.
 */

/** One row inside a footer link column, or one of the two bottom-bar legal links. */
export interface FooterLinkItem {
    /** Stable id — also the React key. */
    id: string
    /** Visible label, already localized by the caller. */
    label: string
    /** Fired when the row is pressed — navigation is the caller's job. */
    onPress: () => void
}

/** One founder social icon link. */
export interface FooterSocialLink {
    /** Stable id — also the React key. */
    id: string
    /** Aria-label for the glyph-only trigger, e.g. "GitHub". */
    label: string
    /** Brand glyph component (a `react-icons/fa6` icon — see file header). */
    icon: IconComponent
    /** Fired when the icon is pressed — opening the external URL is the caller's job. */
    onPress: () => void
}

/** Props for {@link Footer}. */
export interface FooterProps {
    /** The "Explore" column's rows (courses/blog/talents/jobs/community in the real app). */
    exploreLinks: Array<FooterLinkItem>
    /** The "Support" column's rows (contact/email in the real app). */
    supportLinks: Array<FooterLinkItem>
    /** Founder social links (Facebook/LinkedIn/GitHub in the real app). */
    socials: Array<FooterSocialLink>
    /** Fired when the bottom-bar "Terms" stub is pressed. */
    onTermsPress: () => void
    /** Fired when the bottom-bar "Privacy" stub is pressed. */
    onPrivacyPress: () => void
}

/**
 * The marketing site footer. See the file header for the static-vs-prop copy
 * split and the BrandLockup/icon-rule judgement calls.
 *
 * @param props - {@link FooterProps}
 */
const Footer = ({
    exploreLinks,
    supportLinks,
    socials,
    onTermsPress,
    onPrivacyPress,
}: FooterProps) => {
    const year = new Date().getFullYear()

    const brandMark = [
        () => <Logo size="footer" />,
        () => (
            <ShowFrom
                at="md"
                body={() => (
                    <StackV
                        gap={1}
                        principle="name-handle"
                        explain="Brand name stacked on its academy handle with no seam — not title-subtitle, because title-subtitle opens a 4px joint this lockup keeps closed at 0px."
                        items={[
                            () => (
                                <span className="text-sm font-semibold leading-none text-foreground">
                                    StarCi
                                </span>
                            ),
                            () => (
                                <span className="text-[8px] uppercase leading-none text-muted">
                                    Academy
                                </span>
                            ),
                        ]}
                    />
                )}
            />
        ),
    ]

    const socialLinkItems = socials.map((social) => () => (
        <InlineLink
            key={social.id}
            icon={social.icon}
            ariaLabel={social.label}
            onPress={social.onPress}
        />
    ))

    return (
        <FooterFrame
            identity={{ tier: "block", component: "Footer" }}
            body={() => (
                <StackV
                    gap={6}
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    divider
                    items={[
                        () => (
                            <StackH
                                gap={7}
                                principle="layout-split"
                                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                                justify="between"
                                at="md"
                                items={[
                                    () => (
                                        <Measure
                                            size="sm"
                                            body={() => (
                                                <StackV
                                                    gap={4}
                                                    principle="card-caption"
                                                    explain="Brand lockup over its tagline and socials — not title-subtitle, because the social row is a separate action cluster rather than a continuing subtitle line."
                                                    items={[
                                                        () => (
                                                            <StackH
                                                                gap={1}
                                                                principle="name-handle"
                                                                explain="Logo flush to wordmark as one lockup — not icon-text, because icon-text's 4px joint would open a seam this lockup keeps closed at 0px."
                                                                items={brandMark}
                                                            />
                                                        ),
                                                        () => (
                                                            <Typography
                                                                size="sm"
                                                                color="muted"
                                                                text="Learn by building real systems with your own hands — ready for any technical interview."
                                                            />
                                                        ),
                                                        () => (
                                                            <StackH
                                                                gap={3}
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
                                            gap={7}
                                            principle="layout-split"
                                            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                                            at="sm"
                                            items={[
                                                () => <FooterLinkColumn title="Explore" links={exploreLinks} />,
                                                () => <FooterLinkColumn title="Support" links={supportLinks} />,
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <StackH
                                gap={3}
                                principle="sibling-stack"
                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                justify="between"
                                align="start"
                                at="sm"
                                items={[
                                    () => (
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            text={`(c) ${year} StarCi Academy - Built by Nguyen Van Tu Cuong`} // vn-ok: the author's real name
                                        />
                                    ),
                                    () => (
                                        <StackH
                                            gap={3}
                                            principle="flex-action"
                                            explain="Groups legal stubs on one horizontal peer row so they share a single hit baseline — not chip-row, because these are press targets rather than display tags."
                                            items={[
                                                () => (
                                                    <InlineLink
                                                        label="Terms"
                                                        size="xs"
                                                        onPress={onTermsPress}
                                                    />
                                                ),
                                                () => (
                                                    <InlineLink
                                                        label="Privacy"
                                                        size="xs"
                                                        onPress={onPrivacyPress}
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

export { Footer }

/** Re-exported so `FaFacebook`/`FaLinkedin`/`FaGithub` fixtures stay ONE source for stories. */
export { FaFacebook, FaGithub, FaLinkedin }
