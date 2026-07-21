"use client"

import React from "react"
import { cn } from "@heroui/react"
import { LockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { SectionVisibility } from "@/modules/types/entities/user"
import { useProfileUsername } from "../hooks/useProfileUsername"
import { useAppSelector } from "@/redux/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"

/** Props for {@link ProfileSectionGuard}. */
export interface ProfileSectionGuardProps extends WithClassNames<undefined> {
    /** Which gateable section this tab renders (drives the `sectionVisibility` flag). */
    section: keyof SectionVisibility
    /** The tab's real content, shown when the section is visible to the viewer. */
    children: React.ReactNode
}

/**
 * Wraps a section tab and short-circuits to a graceful "this section is private"
 * {@link EmptyState} when a VISITOR opens a section the owner has hidden
 * (`sectionVisibility[section] === false`). The owner ({@link isSelf}) always sees
 * the real content. Rendering the placeholder here also stops the inner sections
 * from firing their (backend-guarded, doomed) data queries.
 *
 * Fails OPEN: while the profile is still loading, or when the flag is absent, the
 * children render — the backend still guards each section's data as the backstop.
 *
 * @param props - {@link ProfileSectionGuardProps}
 */
export const ProfileSectionGuard = ({
    section,
    children,
    className,
}: ProfileSectionGuardProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const { data: user } = useQueryUserProfileSwr(username)

    // "my own profile" — mirror PublicProfile's isSelf (username-keyed, id fallback)
    const isSelf = !!viewer && !!user
        && ((!!viewer.username && viewer.username === user.username) || viewer.id === user.id)
    // a visitor on a section the owner switched off → private placeholder
    const isPrivate = !!user && !isSelf && user.sectionVisibility?.[section] === false

    if (isPrivate) {
        return (
            <div className={cn("flex min-w-0 flex-col", className)}>
                <EmptyState
                    icon={<LockIcon aria-hidden focusable="false" />}
                    title={t("publicProfile.sectionPrivate.title")}
                    description={t("publicProfile.sectionPrivate.description")}
                />
            </div>
        )
    }

    return <>{children}</>
}
