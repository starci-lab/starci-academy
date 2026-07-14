"use client"

import React from "react"
import { cn } from "@heroui/react"
import {
    EnvelopeSimpleIcon,
    PhoneIcon,
    ClockIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { FounderCard } from "./FounderCard"
import {
    CONTACT_EMAIL,
    CONTACT_PHONE,
    CONTACT_PHONE_TEL,
} from "../constants"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

/** Props for {@link ContactChannels}. */
export type ContactChannelsProps = WithClassNames<undefined>

/**
 * Left rail of the contact page: the real direct channels (email · phone · support
 * hours) plus the founder card. Static, honest data — no fake form, no fabricated
 * office. Self-contained (reads its own constants + i18n).
 *
 * @param props - optional className (placement only).
 */
export const ContactChannels = ({ className }: ContactChannelsProps) => {
    const t = useTranslations()
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <LabeledCard label={t("contact.direct.title")} flushContent>
                <SurfaceListCard bordered>
                    <SurfaceListCardRow
                        leading={<IconTile icon={<EnvelopeSimpleIcon />} tone="accent" size="sm" />}
                        title={CONTACT_EMAIL}
                        subtitle={t("contact.direct.emailLabel")}
                        href={`mailto:${CONTACT_EMAIL}`}
                    />
                    <SurfaceListCardRow
                        leading={<IconTile icon={<PhoneIcon />} tone="success" size="sm" />}
                        title={CONTACT_PHONE}
                        subtitle={t("contact.direct.phoneLabel")}
                        href={`tel:${CONTACT_PHONE_TEL}`}
                    />
                    <SurfaceListCardRow
                        leading={<IconTile icon={<ClockIcon />} tone="warning" size="sm" />}
                        title={t("contact.direct.hoursValue")}
                        subtitle={t("contact.direct.hoursLabel")}
                    />
                </SurfaceListCard>
            </LabeledCard>

            <FounderCard />
        </div>
    )
}
