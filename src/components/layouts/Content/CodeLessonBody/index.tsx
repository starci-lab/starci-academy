"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Tabs, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types"
import type {
    CodeExplainingEntity,
    CodeImplementationEntity,
} from "@/modules/types"
import {
    getContentCodeExplainings,
    getContentCodeImplementations,
} from "@/modules/types"
import { useQueryContentSwr } from "@/hooks/singleton"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import { ExplainingCard } from "../CodeExplainingBody/ExplainingCard"
import { ImplementationCard } from "../CodeImplementationBody/ImplementationCard"
import { CodeItemTabs } from "./CodeItemTabs"

type CodeLessonSection = "explainings" | "implementations"

export type CodeLessonBodyProps = WithClassNames<undefined>

/**
 * Tab Bài giảng: giải thích code + triển khai đa ngôn ngữ (mỗi ngôn ngữ / đoạn một tab).
 * @param props.className - Optional wrapper class.
 */
export const CodeLessonBody = ({ className }: CodeLessonBodyProps) => {
    const t = useTranslations()
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)

    const explainings = useMemo(
        () => getContentCodeExplainings(content)
            .slice()
            .sort((prev, next) => prev.orderIndex - next.orderIndex),
        [content],
    )

    const implementations = useMemo(
        () => getContentCodeImplementations(content)
            .slice()
            .sort((prev, next) => prev.orderIndex - next.orderIndex),
        [content],
    )

    const hasExplainings = explainings.length > 0
    const hasImplementations = implementations.length > 0

    const defaultSection: CodeLessonSection = hasExplainings
        ? "explainings"
        : "implementations"

    const [sectionTab, setSectionTab] = useState<CodeLessonSection>(defaultSection)

    useEffect(() => {
        if (sectionTab === "explainings" && !hasExplainings && hasImplementations) {
            setSectionTab("implementations")
        }
        if (sectionTab === "implementations" && !hasImplementations && hasExplainings) {
            setSectionTab("explainings")
        }
    }, [hasExplainings, hasImplementations, sectionTab])

    // loading gate: render content only when the content query has settled with
    // data and no error; otherwise show the code-shaped skeleton.
    const ready = !queryContentSwr.isLoading
        && !queryContentSwr.isValidating
        && !!queryContentSwr.data
        && !queryContentSwr.error

    if (!ready) {
        return <CodeBodySkeleton className={className} />
    }

    if (!hasExplainings && !hasImplementations) {
        return (
            <p className={cn("text-sm text-muted", className)}>
                {t("content.codeLesson.empty")}
            </p>
        )
    }

    const explainingsPanel = (
        <CodeItemTabs<CodeExplainingEntity>
            items={explainings}
            ariaLabel={t("content.codeLesson.explainingsTabsAria")}
            getTabLabel={(item) => (
                item.lang
                    ? item.lang
                    : t("content.codeExplainings.indexLabel", { index: item.orderIndex + 1 })
            )}
            renderPanel={(item) => <ExplainingCard item={item} />}
        />
    )

    const implementationsPanel = (
        <CodeItemTabs<CodeImplementationEntity>
            items={implementations}
            ariaLabel={t("content.codeLesson.implementationsTabsAria")}
            getTabLabel={(item) => item.lang}
            renderPanel={(item) => <ImplementationCard item={item} />}
        />
    )

    if (hasExplainings && hasImplementations) {
        return (
            <div className={cn("flex flex-col", className)}>
                <Tabs
                    selectedKey={sectionTab}
                    variant="secondary"
                    onSelectionChange={(key) => setSectionTab(key as CodeLessonSection)}
                >
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={t("content.codeLesson.sectionsTabsAria")}>
                            <Tabs.Tab
                                id="explainings"
                                className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                            >
                                {t("content.codeLesson.explainingsHeading")}
                            </Tabs.Tab>
                            <Tabs.Tab
                                id="implementations"
                                className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                            >
                                {t("content.codeLesson.implementationsHeading")}
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
                <div className="h-4" />
                {sectionTab === "explainings" ? explainingsPanel : implementationsPanel}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col", className)}>
            {hasExplainings ? explainingsPanel : implementationsPanel}
        </div>
    )
}
