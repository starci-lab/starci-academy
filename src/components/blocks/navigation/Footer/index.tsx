import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { Logo } from "@/components/atoms/display/Logo"
import { Typography } from "@/components/atoms/text/Typography"
import type { IconComponent } from "@/components/atoms/buttons/Button"
import { Container } from "@/components/frames/Container"
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
    /** Extra class on the root `<footer>` (placement only). */
    className?: string
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
    className,
}: FooterProps) => {
    const year = new Date().getFullYear()

    const wordmark = (
        <>
            <div className="text-sm font-semibold leading-none text-foreground">StarCi</div>
            <div className="text-[8px] uppercase leading-none text-muted">Academy</div>
        </>
    )

    // brand mark + wordmark, inlined (see file header: BrandLockup not
    // promoted). `StackH`/`StackV` (not a hand-rolled flex span) per §13z —
    // spacing is words. `Logo` itself stays unbadged here, same as `Navbar`'s
    // own brand-mark span (not in either block's ANNOTATE map).
    const brandMark = (
        <>
            <Logo size="footer" />
            <div className="hidden @app-md:flex">
                <StackV gap={1} items={[() => wordmark]} />
            </div>
        </>
    )

    const socialLinks = socials.map((social) => {
        const Icon = social.icon
        return (
            <HeroUILink
                key={social.id}
                onPress={social.onPress}
                aria-label={social.label}
                className="text-muted transition-colors hover:text-foreground"

            >
                <Icon className="size-5" aria-hidden />
            </HeroUILink>
        )
    })

    const brandColumn = (
        <>
            <StackH gap={1} classNames={["w-fit", "self-start"]} items={[() => brandMark]} />
            <Typography
                size="sm"
                color="muted"
                text="Learn by building real systems with your own hands — ready for any technical interview."

            />
            <StackH gap={3} items={[() => socialLinks]} />
        </>
    )

    const linkColumns = (
        <>
            <FooterLinkColumn title="Explore" links={exploreLinks} />
            <FooterLinkColumn title="Support" links={supportLinks} />
        </>
    )

    // top region: brand + tagline + socials (left) · two link columns (right)
    const topRegion = (
        <>
            <div className="max-w-sm">
                <StackV gap={4} items={[() => brandColumn]} />
            </div>
            <StackH gap={7} principle="layout-split"
                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                at="sm" items={[() => linkColumns]}  />
        </>
    )

    const legalLinks = (
        <>
            <HeroUILink
                onPress={onTermsPress}
                className="cursor-pointer text-xs text-muted transition-colors hover:text-foreground"

            >
                Terms
            </HeroUILink>
            <HeroUILink
                onPress={onPrivacyPress}
                className="cursor-pointer text-xs text-muted transition-colors hover:text-foreground"

            >
                Privacy
            </HeroUILink>
        </>
    )

    // bottom bar: copyright + credit (left) · legal stubs (right)
    const bottomBar = (
        <>
            <Typography
                size="xs"
                color="muted"
                text={`© ${year} StarCi Academy · Built by Nguyễn Văn Tự Cường`} // vn-ok: the author's real name

            />
            <StackH gap={3} items={[() => legalLinks]} />
        </>
    )

    const sections = (
        <>
            <StackH
                gap={7}
                principle="layout-split"
                explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                justify="between"
                at="md"

                items={[() => topRegion]}
            />
            <div className="items-start @app-sm:items-center">
                <StackH
                    gap={3}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    justify="between"
                    at="sm"

                    items={[() => bottomBar]}
                />
            </div>
        </>
    )

    const footerBody = (
        <StackV gap={6} principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            divider items={[() => sections]}  />
    )

    return (
        <footer className={cn("border-t border-default bg-surface", className)}>
            <Container size="xl" padding={6} body={() => footerBody} />
        </footer>
    )
}

export { Footer }

/** Re-exported so `FaFacebook`/`FaLinkedin`/`FaGithub` fixtures stay ONE source for stories. */
export { FaFacebook, FaGithub, FaLinkedin }
