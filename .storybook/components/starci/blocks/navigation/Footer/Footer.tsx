import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `Footer` — the marketing site footer: brand + tagline + founder socials on the
 * left, two quiet link columns (explore/support) on the right, and a bottom bar
 * with copyright + legal stubs. Rendered only on opted-in routes (landing,
 * `/home`). Static chrome (tagline, column titles, made-by/copyright line) is
 * hardcoded; the link entries (`exploreLinks`/`supportLinks`/`socials`) are typed
 * domain props. The brand lockup is folded inline; social icons use
 * `react-icons/fa6` (brand glyphs, not Phosphor UI icons). The top-region/
 * bottom-bar seam uses `StackV`'s `divider` prop.
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

/** Props for the internal {@link FooterLinkColumn} — one titled list of link rows. */
interface FooterLinkColumnProps {
    title: string
    links: Array<FooterLinkItem>
}

/**
 * One titled column of link rows. Internal helper, not its own anatomy node
 * (same convention `Navbar`'s internal `NavbarLanguageMenu`/`NavbarThemeSwitch`
 * use) — its own `StackV`/`Typography`/`Link` parts are tagged directly.
 */
const FooterLinkColumn = ({ title, links }: FooterLinkColumnProps) => {
    const rows = links.map((link) => (
        <HeroUILink
            key={link.id}
            onPress={link.onPress}
            className="w-fit cursor-pointer text-sm text-muted transition-colors hover:text-foreground"

        >
            {link.label}
        </HeroUILink>
    ))

    const column = (
        <>
            <Typography size="sm" weight="bold" text={title} />
            <StackV gap={2} items={[() => rows]} />
        </>
    )

    return <StackV gap={4} items={[() => column]} />
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
            <StackV gap={1} className="hidden @app-md:flex" items={[() => wordmark]} />
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
            <StackV gap={4} className="max-w-sm" items={[() => brandColumn]} />
            <StackH gap={7} wrap items={[() => linkColumns]} />
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
                justify="between"
                className="flex-col @app-md:flex-row"

                items={[() => topRegion]}
            />
            <StackH
                gap={3}
                justify="between"
                className="flex-col items-start @app-sm:flex-row @app-sm:items-center"

                items={[() => bottomBar]}
            />
        </>
    )

    const footerBody = (
        <StackV gap={6} divider items={[() => sections]} />
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
