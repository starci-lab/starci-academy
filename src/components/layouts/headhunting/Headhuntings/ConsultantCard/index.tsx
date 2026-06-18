"use client"

import { House as BuildingsIcon } from "@gravity-ui/icons"
import { cn } from "@heroui/react"

import type { ConsultantEntity } from "@/modules/types"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { ConsultantAvatar } from "../ConsultantAvatar"
import { useOpenHeadhunterDetail } from "../hooks"
import React from "react"


export interface ConsultantCardProps extends WithClassNames<undefined> {
    /** Consultant row from API / Redux. */
    consultant: ConsultantEntity
}

/**
 * Card for one consultant: opens profile modal; company name navigates to company page.
 * @param props.consultant - Consultant entity to display.
 */
export const ConsultantCard = ({ consultant, className }: ConsultantCardProps) => {
    const locale = useLocale()
    const router = useRouter()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const openHeadhunterDetail = useOpenHeadhunterDetail()

    const companyTitle = useMemo(
        () => consultant.company?.title ?? "",
        [consultant.company?.title],
    )

    /** Open this consultant's profile modal. */
    const onOpenDetail = useCallback(
        () => openHeadhunterDetail(consultant),
        [openHeadhunterDetail, consultant],
    )

    /** Navigate to the consultant's company page, stopping card activation. */
    const onOpenCompany = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation()
            const companyId = consultant.company?.id ?? consultant.companyId
            if (!companyId || !courseDisplayId) {
                return
            }
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .headhuntingCompanies(companyId)
                    .build(),
            )
        },
        [
            consultant.company?.id,
            consultant.companyId,
            courseDisplayId,
            locale,
            router,
        ],
    )

    /** Activate the card via keyboard (Enter / Space). */
    const onCardKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                openHeadhunterDetail(consultant)
            }
        },
        [openHeadhunterDetail, consultant],
    )

    return (
        <div
            role="button"
            tabIndex={0}
            className={cn(
                "card card--default flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-divider/60 text-left transition-colors hover:border-accent/40 hover:bg-accent/5",
                className,
            )}
            onClick={onOpenDetail}
            onKeyDown={onCardKeyDown}
        >
            <ConsultantAvatar
                avatarUrl={consultant.avatarUrl}
                fullName={consultant.fullName}
                size="card"
            />
            <div className="flex flex-1 flex-col p-4">
                <span className="text-lg font-semibold">{consultant.fullName}</span>
                {consultant.jobTitle ? (
                    <p className="text-muted mt-1 text-sm">{consultant.jobTitle}</p>
                ) : null}
                {companyTitle ? (
                    <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-1.5 text-left text-sm font-medium text-accent hover:underline"
                        onClick={onOpenCompany}
                    >
                        <BuildingsIcon className="size-5 shrink-0" aria-hidden />
                        {companyTitle}
                    </button>
                ) : null}
                {consultant.description ? (
                    <p className="text-muted mt-2 line-clamp-3 text-sm">{consultant.description}</p>
                ) : null}
            </div>
        </div>
    )
}
