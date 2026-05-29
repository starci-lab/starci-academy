"use client"

import React from "react"
import { Accordion } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import type { ChallengeRequirementEntity } from "@/modules/types"

interface ChallengeRequirementsProps {
    /** Ordered requirement rows of the challenge. */
    challengeRequirements: Array<ChallengeRequirementEntity>
}

/** Fields to render as sub-sections inside each requirement accordion body. */
type RequirementField = {
    /** Translation key for the section label. */
    labelKey: string
    /** Accessor to get the markdown value from the entity. */
    getValue: (r: ChallengeRequirementEntity) => string | undefined
}

const requirementFields: Array<RequirementField> = [
    { labelKey: "challenge.requirement.purpose", getValue: (r) => r.purpose },
    { labelKey: "challenge.requirement.technicalConstraints", getValue: (r) => r.technicalConstraints },
    { labelKey: "challenge.requirement.proTipsHints", getValue: (r) => r.proTipsHints },
    { labelKey: "challenge.requirement.forbidden", getValue: (r) => r.forbidden },
]

/**
 * Render the requirements block as an accordion in challenge modal,
 * matching the steps accordion style on the right panel.
 *
 * @param props Requirement rows for current challenge.
 */
export const ChallengeRequirements = (props: ChallengeRequirementsProps) => {
    const { challengeRequirements } = props
    const t = useTranslations()

    return (
        <>
            <div className="text-lg font-semibold text-foreground">{t("challenge.requirements")}</div>
            <div className="h-2" />
            {challengeRequirements.length ? (
                <Accordion                   
                    allowsMultipleExpanded
                >
                    {challengeRequirements.map((requirement, index) => (
                        <Accordion.Item key={requirement.id} id={requirement.id}>
                            <Accordion.Heading>
                                <Accordion.Trigger className="w-full">
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <div className="text-sm text-foreground">
                                            {`${index + 1}. ${requirement.purpose?.slice(0, 80) || t("challenge.requirement.label", { index: index + 1 })}`}
                                        </div>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body>
                                    <div className="flex flex-col gap-3 p-3">
                                        {requirementFields.map((field) => {
                                            const value = field.getValue(requirement)
                                            if (!value) return null
                                            return (
                                                <div key={field.labelKey}>
                                                    <div className={"text-sm font-semibold"}>
                                                        {t(field.labelKey)}
                                                    </div>
                                                    <MarkdownContent markdown={value} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <div className="text-sm text-muted">{t("challenge.empty")}</div>
            )}
        </>
    )
}
