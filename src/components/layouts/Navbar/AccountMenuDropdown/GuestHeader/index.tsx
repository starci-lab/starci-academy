"use client"

import React from "react"
import { Typography, Avatar } from "@heroui/react"
import { UserIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

/** Props for {@link GuestHeader}. */
export type GuestHeaderProps = Record<string, never>
/**
 * Static header shown to signed-out viewers in the account dropdown — a generic
 * user glyph beside a short "sign in to track your progress" prompt. Mirrors the
 * {@link import("../UserSummary").UserSummary} shape (size-9 leading + a text
 * column) so the skeleton swap is seamless. Presentational.
 *
 * @param props - optional root class name (placement only).
 */
export const GuestHeader = () => {
    const t = useTranslations()
    return (
        <div className={"flex min-w-0 items-center gap-2"}>
            <Avatar >
                <UserIcon aria-hidden focusable="false" className="size-5 shrink-0" />
            </Avatar>
            <Typography type="body-sm" color="muted">
                {t("nav.guestPrompt")}
            </Typography>
        </div>
    )
}
