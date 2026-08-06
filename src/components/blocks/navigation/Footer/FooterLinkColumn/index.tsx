import React from "react"
import { Link as HeroUILink } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import type { FooterLinkItem } from ".."

/** Props for {@link FooterLinkColumn}. */
export interface FooterLinkColumnProps {
    title: string
    links: Array<FooterLinkItem>
}

/**
 * One titled column of link rows. Internal helper, not its own anatomy node
 * (same convention `Navbar`'s internal `NavbarLanguageMenu`/`NavbarThemeSwitch`
 * use) — its own `StackV`/`Typography`/`Link` parts are tagged directly.
 */
export const FooterLinkColumn = ({ title, links }: FooterLinkColumnProps) => {
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

    return <StackV identity={{ tier: "block", component: "FooterLinkColumn" }} gap={4} items={[() => column]} />
}
