"use client"

import React from "react"
import { Button, Typography } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useQueryOpenToWorkUsersSwr } from "@/hooks"
import { AvatarGroup, SectionHeading } from "@/components/blocks"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LANDING_HIRING_PARTNERS, LANDING_RECRUITER_MIN } from "../constants"

/** Props for {@link RecruiterProof}. */
export type RecruiterProofProps = WithClassNames<undefined>

/**
 * Recruiter-side proof — real "open to work" learners surfaced as an avatar group
 * with a live count and a CTA into the talent directory. Backed by the public
 * `openToWorkUsers` query. Hidden entirely on error or when fewer than
 * {@link LANDING_RECRUITER_MIN} profiles exist (no thin/empty proof).
 *
 * @param props - optional className (placement only).
 */
export const RecruiterProof = ({ className }: RecruiterProofProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, error } = useQueryOpenToWorkUsersSwr()
    const users = data ?? []

    // Honest proof only — hide unless there is a real, non-trivial pool.
    if (error || users.length < LANDING_RECRUITER_MIN) {
        return null
    }

    const onViewTalents = () => router.push(pathConfig().locale(locale).talents().build())

    return (
        <div className={className}>
            <SectionHeading
                eyebrow={t("landing.recruiter.eyebrow")}
                title={t("landing.recruiter.title")}
                intro={t("landing.recruiter.intro")}
            />
            <div className="mt-6 flex flex-col items-center gap-4">
                <AvatarGroup
                    users={users.map((user) => ({
                        username: user.username ?? user.id,
                        displayName: user.displayName,
                        avatar: user.avatar,
                    }))}
                    max={6}
                    total={users.length}
                />
                <Typography type="body-sm" color="muted" align="center">
                    {t("landing.recruiter.count", { count: users.length })}
                </Typography>
                <Button variant="primary" size="lg" onPress={onViewTalents}>
                    {t("landing.recruiter.cta")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                </Button>

                {/* Strip đối tác tuyển dụng — tên text-logo, không cần ảnh */}
                <div className="mt-2 flex flex-col items-center gap-2">
                    <Typography type="code" className="text-xs text-muted">
                        {t("landing.recruiter.partnersLabel")}
                    </Typography>
                    <div className="flex flex-wrap justify-center gap-4">
                        {LANDING_HIRING_PARTNERS.map((name) => (
                            <Typography key={name} type="body-sm" weight="medium" color="muted">
                                {name}
                            </Typography>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
