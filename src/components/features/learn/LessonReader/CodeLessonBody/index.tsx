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
import { useQueryContentSwr } from "@/hooks"
import { buildSandpackFiles } from "@/utils"
import { SandpackPanel } from "@/components/reuseable/SandpackPanel"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import { ExplainingCard } from "../CodeExplainingBody/ExplainingCard"
import { ImplementationCard } from "../CodeImplementationBody/ImplementationCard"
import { CodeItemTabs } from "./CodeItemTabs"

type CodeLessonSection = "explainings" | "implementations" | "sandbox"

export type CodeLessonBodyProps = WithClassNames<undefined>

/**
 * Lecture tab: code explanation + multi-language implementations (one tab per language / snippet).
 * @param props.className - Optional wrapper class.
 */
export const CodeLessonBody = ({ className }: CodeLessonBodyProps) => {
    const t = useTranslations()
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)

    const explainings = useMemo(
        () => getContentCodeExplainings(content)
            .slice()
            .sort((prev, next) => prev.sortIndex - next.sortIndex),
        [content],
    )

    const implementations = useMemo(
        () => getContentCodeImplementations(content)
            .slice()
            .sort((prev, next) => prev.sortIndex - next.sortIndex),
        [content],
    )

    const hasExplainings = explainings.length > 0
    const hasImplementations = implementations.length > 0
    const hasSandbox = !!content?.isSandbox

    const sandpackFiles = useMemo(
        () => (hasSandbox ? buildSandpackFiles(explainings) : {}),
        [hasSandbox, explainings],
    )

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
                    : t("content.codeExplainings.indexLabel", { index: item.sortIndex })
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

    const sectionTabBar = (hasExplainings && hasImplementations) || hasSandbox ? (
        <Tabs
            selectedKey={sectionTab}
            variant="secondary"
            onSelectionChange={(key) => setSectionTab(key as CodeLessonSection)}
        >
            <Tabs.ListContainer>
                <Tabs.List aria-label={t("content.codeLesson.sectionsTabsAria")}>
                    {hasExplainings && (
                        <Tabs.Tab
                            id="explainings"
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {t("content.codeLesson.explainingsHeading")}
                        </Tabs.Tab>
                    )}
                    {hasImplementations && (
                        <Tabs.Tab
                            id="implementations"
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {t("content.codeLesson.implementationsHeading")}
                        </Tabs.Tab>
                    )}
                    {hasSandbox && (
                        <Tabs.Tab
                            id="sandbox"
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            {"Sandbox"}
                        </Tabs.Tab>
                    )}
                </Tabs.List>
            </Tabs.ListContainer>
        </Tabs>
    ) : null

    const activePanel = () => {
        if (sectionTab === "sandbox") return <SandpackPanel files={sandpackFiles} />
        if (sectionTab === "explainings") return explainingsPanel
        return implementationsPanel
    }

    return (
        <div className={cn("flex flex-col", className)}>
            {sectionTabBar}
            {sectionTabBar && <div className="h-4" />}
            {activePanel()}
        </div>
    )
}
