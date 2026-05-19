"use client"

import { Breadcrumbs, Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { pathConfig } from "@/resources"
import { useAppDispatch, useAppSelector } from "@/redux"
import {
    setHeadhunterCompany,
    setHeadhunterCompanyId,
} from "@/redux/slices"
import {
    useQueryHeadhunterCompaniesSwr,
    useQueryHeadhuntersSwr,
} from "@/hooks/singleton"
import { HeadhuntingCompanyConsultants } from "./HeadhuntingCompanyConsultants"
import { HeadhuntingCompanyProfile } from "./HeadhuntingCompanyProfile"
import type { HeadhuntingCompanyBreadcrumbItem } from "./types"

/**
 * Learn headhunting company detail: company profile and consultants at that company.
 */
export const HeadhuntingCompanyLayout = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams()
    const dispatch = useAppDispatch()
    const companyId = typeof params.companyId === "string" ? params.companyId : undefined
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const company = useAppSelector((state) => state.headhunter.company)
    const companies = useAppSelector((state) => state.headhunter.companies)
    const consultants = useAppSelector((state) => state.headhunter.entities)

    useQueryHeadhunterCompaniesSwr()
    useQueryHeadhuntersSwr()

    useEffect(() => {
        if (!companyId || !companies?.length) {
            return
        }
        const match = companies.find((entry) => entry.id === companyId)
        if (match) {
            dispatch(setHeadhunterCompany(match))
            dispatch(setHeadhunterCompanyId(match.id))
        }
    }, [
        companies,
        companyId,
        dispatch,
    ])

    const companyConsultants = useMemo(() => {
        if (!consultants?.length || !companyId) {
            return []
        }
        return consultants
            .filter((entry) => (entry.company?.id ?? entry.companyId) === companyId)
            .sort((a, b) => a.orderIndex - b.orderIndex)
    }, [
        companyId,
        consultants,
    ])

    const headhuntingsListHref = useMemo(() => {
        if (!courseDisplayId) {
            return undefined
        }
        return pathConfig()
            .locale(locale)
            .course(courseDisplayId)
            .learn()
            .headhuntings()
            .build()
    }, [
        courseDisplayId,
        locale,
    ])

    const breadcrumbItems = useMemo((): Array<HeadhuntingCompanyBreadcrumbItem> => [
        {
            key: "home",
            label: t("nav.home"),
            onPress: () => router.push(pathConfig().locale().build()),
        },
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()),
        },
        {
            key: "headhuntings",
            label: t("headhuntings.title"),
            onPress: headhuntingsListHref
                ? () => router.push(headhuntingsListHref)
                : undefined,
        },
        {
            key: "company",
            label: company?.title || t("headhuntings.companyDetailTitle"),
        },
    ], [
        company?.title,
        course?.title,
        courseDisplayId,
        headhuntingsListHref,
        locale,
        router,
        t,
    ])

    if (!companies) {
        return (
            <div className="p-3">
                <Skeleton className="mb-4 h-8 w-2/3 rounded-lg" />
                <Skeleton className="h-24 w-full rounded-xl" />
            </div>
        )
    }

    if (!company && companyId) {
        return (
            <div className="p-3">
                <p className="text-muted text-sm">{t("headhuntings.companyNotFound")}</p>
            </div>
        )
    }

    return (
        <div className="p-3">
            <Breadcrumbs>
                {breadcrumbItems.map((item) => (
                    <Breadcrumbs.Item
                        key={item.key}
                        onPress={item.onPress}
                    >
                        {item.label}
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
            <div className="h-6" />
            <HeadhuntingCompanyProfile company={company} />
            <div className="h-8" />
            <HeadhuntingCompanyConsultants
                consultants={consultants}
                companyConsultants={companyConsultants}
            />
        </div>
    )
}

/** @deprecated Use `HeadhuntingCompanyLayout` */
export const HeadhuntingCompanyDetailLayout = HeadhuntingCompanyLayout
