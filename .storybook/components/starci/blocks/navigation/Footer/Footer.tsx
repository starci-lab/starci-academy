import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `Footer`: the marketing site footer. Brand + tagline + founder
 * socials on the left, two quiet link columns (explore / support) on the
 * right, then a bottom bar with copyright + legal stubs. Rendered by
 * `InnerLayout` only on the routes that opt in (landing, `/home`) — every
 * other route (dashboard/learn/profile/auth) renders none of this, per the
 * real component's own doc comment.
 *
 * PORTED FROM `src/components/features/footer/Footer` (verified live —
 * `InnerLayout.tsx` imports this one, not a second copy). Faithful to its
 * structure and real Vietnamese copy (`src/messages/vi.json`'s `footer.*`
 * keys), with the same container→presentational split every other block in
 * this run takes: i18n resolution and the app router are wiring, not this
 * block's job.
 *
 * ⭐ STATIC CHROME IS HARDCODED, DOMAIN LISTS STAY TYPED PROPS — same split
 * `Navbar`'s own header documents. The tagline, the two column TITLES
 * ("Khám phá" / "Hỗ trợ"), and the "made by" + copyright line are fixed
 * marketing copy this block owns outright (matches the PriceTag/ContentPaywall
 * precedent for inlined-vs-prop copy) — they never vary per caller, so a prop
 * for them would just be a fancier way to always pass the same string. The
 * LINK ENTRIES themselves (`exploreLinks`/`supportLinks`/`socials`) stay typed
 * domain props, exactly like `NavLinks`' `items`: the actual route paths and
 * external URLs come from real path helpers / i18n / a contacts constants
 * file, none of which exists in a Storybook tree — this block only knows the
 * SHAPE of a link row (label + action), not which routes exist.
 *
 * ⭐ BRANDLOCKUP FOLDED INLINE, NOT PROMOTED TO ITS OWN COMPONENT. The real
 * `Footer` composes `@/components/blocks/identity/BrandLockup` (shared with
 * `Navbar`'s brand mark). This Storybook tree only has a `_legacy`-tier port
 * of it (`_legacy/designs/identity/BrandLockup`) — off-limits per this run's
 * boundary (read-only reference, not an import source) — and `Navbar` itself
 * already chose not to build it, using the bare `Logo` atom instead. Same
 * call here: the brand mark + "StarCi / Academy" wordmark are inlined
 * directly (the exact markup `BrandLockup` would produce), one judgement
 * call flagged once rather than a new atom promoted mid-task.
 *
 * ⭐ SOCIAL ICONS USE `react-icons/fa6`, NOT PHOSPHOR — carried over
 * verbatim from the real component's own rule ("brand logos → react-icons/fa6
 * per the icon rule"): Phosphor is this system's UI-icon set, but a brand
 * logo (Facebook/LinkedIn/GitHub) is a fixed trademark glyph, a different
 * vocabulary the icon rule already carves out an exception for.
 *
 * ⭐ THE SEAM BETWEEN THE TOP REGION AND THE BOTTOM BAR REUSES `StackV`'s OWN
 * `divider` PROP instead of a hand-placed `<Divider />` — the real component
 * hand-draws a `border-t` on the bottom bar's wrapper; this port lets the
 * frame interleave the atom itself (§13c: a frame never hand-rolls what an
 * atom already owns).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** The "Khám phá" column's rows (courses/blog/talents/jobs/community in the real app). */
    exploreLinks: Array<FooterLinkItem>
    /** The "Hỗ trợ" column's rows (contact/email in the real app). */
    supportLinks: Array<FooterLinkItem>
    /** Founder social links (Facebook/LinkedIn/GitHub in the real app). */
    socials: Array<FooterSocialLink>
    /** Fired when the bottom-bar "Điều khoản" stub is pressed. */
    onTermsPress: () => void
    /** Fired when the bottom-bar "Bảo mật" stub is pressed. */
    onPrivacyPress: () => void
    /** Extra class on the root `<footer>` (placement only). */
    className?: string
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/** Props for the internal {@link FooterLinkColumn} — one titled list of link rows. */
interface FooterLinkColumnProps {
    title: string
    links: Array<FooterLinkItem>
    showAnatomy?: boolean
}

/**
 * One titled column of link rows. Internal helper, not its own anatomy node
 * (same convention `Navbar`'s internal `NavbarLanguageMenu`/`NavbarThemeSwitch`
 * use) — its own `StackV`/`Typography`/`Link` parts are tagged directly.
 */
const FooterLinkColumn = ({ title, links, showAnatomy }: FooterLinkColumnProps) => {
    const rows = links.map((link) => (
        <HeroUILink
            key={link.id}
            onPress={link.onPress}
            className="w-fit cursor-pointer text-sm text-muted transition-colors hover:text-foreground"
            data-anat-part={showAnatomy ? "Link" : undefined}
        >
            {link.label}
        </HeroUILink>
    ))

    const column = (
        <>
            <Typography size="sm" weight="bold" text={title} anatPart={showAnatomy ? "Typography" : undefined} />
            <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined} body={rows} />
        </>
    )

    return <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} body={column} />
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
    anatPart,
    showAnatomy = false,
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
            <StackV gap="flush" className="hidden @app-md:flex" anatPart={showAnatomy ? "StackV" : undefined} body={wordmark} />
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
                data-anat-part={showAnatomy ? "Link" : undefined}
            >
                <Icon className="size-5" aria-hidden />
            </HeroUILink>
        )
    })

    const brandColumn = (
        <>
            <StackH gap="flush" classNames={["w-fit", "self-start"]} anatPart={showAnatomy ? "StackH" : undefined} body={brandMark} />
            <Typography
                size="sm"
                color="muted"
                text="Học bằng cách tự tay dựng hệ thống thật, đủ trình cho mọi vòng phỏng vấn kỹ thuật."
                anatPart={showAnatomy ? "Typography" : undefined}
            />
            <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined} body={socialLinks} />
        </>
    )

    const linkColumns = (
        <>
            <FooterLinkColumn title="Khám phá" links={exploreLinks} showAnatomy={showAnatomy} />
            <FooterLinkColumn title="Hỗ trợ" links={supportLinks} showAnatomy={showAnatomy} />
        </>
    )

    // top region: brand + tagline + socials (left) · two link columns (right)
    const topRegion = (
        <>
            <StackV gap="grouped" className="max-w-sm" anatPart={showAnatomy ? "StackV" : undefined} body={brandColumn} />
            <StackH gap="page" wrap anatPart={showAnatomy ? "StackH" : undefined} body={linkColumns} />
        </>
    )

    const legalLinks = (
        <>
            <HeroUILink
                onPress={onTermsPress}
                className="cursor-pointer text-xs text-muted transition-colors hover:text-foreground"
                data-anat-part={showAnatomy ? "Link" : undefined}
            >
                Điều khoản
            </HeroUILink>
            <HeroUILink
                onPress={onPrivacyPress}
                className="cursor-pointer text-xs text-muted transition-colors hover:text-foreground"
                data-anat-part={showAnatomy ? "Link" : undefined}
            >
                Bảo mật
            </HeroUILink>
        </>
    )

    // bottom bar: copyright + credit (left) · legal stubs (right)
    const bottomBar = (
        <>
            <Typography
                size="xs"
                color="muted"
                text={`© ${year} StarCi Academy · Được phát triển bởi Nguyễn Văn Tự Cường`}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
            <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined} body={legalLinks} />
        </>
    )

    const sections = (
        <>
            <StackH
                gap="page"
                justify="between"
                wrap
                className="flex-col @app-md:flex-row"
                anatPart={showAnatomy ? "StackH" : undefined}
                body={topRegion}
            />
            <StackH
                gap="related"
                justify="between"
                wrap
                className="flex-col items-start @app-sm:flex-row @app-sm:items-center"
                anatPart={showAnatomy ? "StackH" : undefined}
                body={bottomBar}
            />
        </>
    )

    const footerBody = (
        <StackV gap="section" divider showAnatomy={showAnatomy} anatPart={showAnatomy ? "StackV" : undefined} body={sections} />
    )

    return (
        <footer data-anat-part={anatPart} className={cn("border-t border-default bg-surface", className)}>
            <Container size="xl" padding="roomy" anatPart={showAnatomy ? "Container" : undefined} body={footerBody} />
        </footer>
    )
}

export { Footer }

/** Re-exported so `FaFacebook`/`FaLinkedin`/`FaGithub` fixtures stay ONE source for stories. */
export { FaFacebook, FaGithub, FaLinkedin }
