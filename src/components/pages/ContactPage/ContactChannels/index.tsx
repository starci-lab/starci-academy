"use client"

import React from "react"
import {
    EnvelopeSimpleIcon,
    PhoneIcon,
    ClockIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { FounderCard } from "./FounderCard"
import {
    CONTACT_EMAIL,
    CONTACT_PHONE,
    CONTACT_PHONE_TEL,
} from "@/resources/contact"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"

/** Props for {@link ContactChannels}. */
export type ContactChannelsProps = Record<string, never>
/**
 * Left rail of the contact page: the real direct channels (email · phone · support
 * hours) plus the founder card. Static, honest data — no fake form, no fabricated
 * office. Self-contained (reads its own constants + i18n).
 *
 * @param props - optional className (placement only).
 */
export const ContactChannels = () => {
    const t = useTranslations()

    const channelItems: Array<SurfaceCardListItem> = [
        {
            key: "email",
            leading: () => <IconTile icon={<EnvelopeSimpleIcon />} tone="accent" size="sm" />,
            title: CONTACT_EMAIL,
            subtitle: t("contact.direct.emailLabel"),
            href: `mailto:${CONTACT_EMAIL}`,
        },
        {
            key: "phone",
            leading: () => <IconTile icon={<PhoneIcon />} tone="success" size="sm" />,
            title: CONTACT_PHONE,
            subtitle: t("contact.direct.phoneLabel"),
            href: `tel:${CONTACT_PHONE_TEL}`,
        },
        {
            key: "hours",
            leading: () => <IconTile icon={<ClockIcon />} tone="warning" size="sm" />,
            title: t("contact.direct.hoursValue"),
            subtitle: t("contact.direct.hoursLabel"),
        },
    ]

    return (
        <div className={"flex flex-col gap-6"}>
            <SurfaceCardList
                identity={{ tier: "page", component: "ContactChannels" }}
                label={t("contact.direct.title")}
                items={channelItems}
            />

            <FounderCard />
        </div>
    )
}
