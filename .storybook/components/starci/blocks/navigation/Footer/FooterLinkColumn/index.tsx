import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { InlineLink } from "@sb-components/atoms/navigation/Link/InlineLink"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { FooterLinkItem } from "../Footer"

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
    const rows = links.map((link) => () => (
        <InlineLink
            key={link.id}
            label={link.label}
            size="sm"
            onPress={link.onPress}
        />
    ))

    return (
        <StackV
            identity={{ tier: "block", component: "FooterLinkColumn" }}
            gap={4}
            principle="label-field"
            explain="Column title over its link list — not title-subtitle, because the title names the group of controls below rather than continuing in one voice."
            items={[
                () => <Typography size="sm" weight="bold" text={title} />,
                () => (
                    <StackV
                        gap={2}
                        principle="sibling-stack"
                        explain="Same-kind peer stack of link rows — not group-boundary, because these are repeating siblings rather than section groups."
                        items={rows}
                    />
                ),
            ]}
        />
    )
}
