"use client"

import { Cup as TrophyIcon, Flag as SwordIcon } from "@gravity-ui/icons"
import React, { useEffect, useMemo, useState } from "react"
import { Accordion, Chip, cn, Modal } from "@heroui/react"
import { DragScrollArea, MarkdownContent, ProgrammingLanguageTabs, ProgrammingLanguageTabsVariant, ReferenceLinks, Score } from "@/components/reuseable"
import { useChallengeOverlayState } from "@/hooks"
import { ChallengeSubmissionPanel } from "../ChallengeSubmissionPanel"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import _ from "lodash"
import { difficultyPalette } from "@/components/pallettes"
import {
    ChallengeDifficulty,
    listChallengeV2ProgrammingLangs,
    resolveActiveProgrammingLang,
    resolveChallengeV2SectionRows,
} from "@/modules/types"

/**
 * SCHEMA V2 challenge modal — lang-bucket or position-model V2 sections with programming-language tabs.
 * Requirements/steps render inner `langs[]` rows (`body`); outputs/prerequisites use `text` only.
 * Grading criteria are intentionally NOT shown — they are an internal rubric, not exposed to the learner.
 */
export const ChallengeV2Modal = () => {
    const { isOpen, setOpen } = useChallengeOverlayState()
    const t = useTranslations()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const completionTasks = useAppSelector((state) => state.challenge.completionTasks)
    const config = useAppSelector((state) => state.system.config)
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)

    const langs = useMemo(
        () => listChallengeV2ProgrammingLangs(challenge),
        [challenge],
    )
    const [selectedLang, setSelectedLang] = useState<string | null>(null)
    const activeLang = useMemo(
        () => resolveActiveProgrammingLang(selectedLang, langs),
        [selectedLang, langs],
    )
    // the programming language the learner last submitted with, if any (to reopen the tabs on it)
    const storedLang = useMemo(
        () => challengeSubmissions
            ?.find((submission) => submission.userSubmission?.selectedLang)
            ?.userSubmission?.selectedLang ?? null,
        [challengeSubmissions],
    )
    // Mobile-only panel switch: "work" = submission column, "steps" = guided-steps column.
    // Desktop (lg+) shows both side by side and ignores this.
    const [mobileTab, setMobileTab] = useState<"work" | "steps">("work")

    useEffect(() => {
        setSelectedLang(null)
        setMobileTab("work")
    }, [challenge?.id])

    // open the tabs on the persisted language once it loads — only until the learner picks one
    useEffect(() => {
        if (selectedLang === null && storedLang) {
            setSelectedLang(storedLang)
        }
    }, [storedLang, selectedLang])

    const requirements = useMemo(
        () => resolveChallengeV2SectionRows(challenge?.requirementsV2, activeLang),
        [challenge?.requirementsV2, activeLang],
    )
    const steps = useMemo(
        () => resolveChallengeV2SectionRows(challenge?.stepsV2, activeLang),
        [challenge?.stepsV2, activeLang],
    )
    const outputs = useMemo(
        () => resolveChallengeV2SectionRows(challenge?.outputsV2, activeLang)
            .filter((row) => row.body.trim().length > 0),
        [challenge?.outputsV2, activeLang],
    )
    const prerequisites = useMemo(
        () => resolveChallengeV2SectionRows(challenge?.prerequisitesV2, activeLang)
            .filter((row) => row.body.trim().length > 0),
        [challenge?.prerequisitesV2, activeLang],
    )
    /** Prerequisites for the active language as a single markdown bullet list. */
    const prerequisitesMarkdown = useMemo(
        () => prerequisites
            .map((item) => item.body.trim())
            .filter((body) => body.length > 0)
            .map((body) => `- ${body}`)
            .join("\n"),
        [prerequisites],
    )
    /** Expected outputs for the active language as a single markdown bullet list. */
    const outputsMarkdown = useMemo(
        () => outputs
            .map((item) => item.body.trim())
            .filter((body) => body.length > 0)
            .map((body) => `- ${body}`)
            .join("\n"),
        [outputs],
    )

    const passThreshold = config?.challenge?.passThreshold ?? 0
    const challengeProgress = useMemo(
        () => completionTasks.find((completionTask) => completionTask.id === challenge?.id) ?? null,
        [completionTasks, challenge?.id],
    )
    const earnedScore = challengeProgress?.lastScore ?? 0
    const maxScore = challengeProgress?.maxScore ?? challenge?.score ?? 0
    const statusBadge = useMemo(() => {
        switch (challengeProgress?.status) {
        case "completed":
            return { className: "text-success", label: t("challenge.pass") }
        case "failed":
            return { className: "text-danger", label: t("challenge.fail") }
        case "inProgress":
            return { className: "text-warning", label: t("challenge.inProgress") }
        default:
            return null
        }
    }, [challengeProgress?.status, t])
    const challengeDifficultyKey = useMemo(() => {
        switch (challenge?.difficulty) {
        case ChallengeDifficulty.Easy:
            return "challenge.difficulty.easy"
        case ChallengeDifficulty.Medium:
            return "challenge.difficulty.medium"
        case ChallengeDifficulty.Hard:
            return "challenge.difficulty.hard"
        default:
            return "challenge.difficulty.easy"
        }
    }, [challenge?.difficulty])

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="full">
                    <Modal.Dialog className="p-0">
                        <Modal.CloseTrigger />
                        <Modal.Header className="border-b max-w-full w-full">
                            <div className="flex w-full flex-col items-center gap-1 px-8">
                                <div className="flex w-full max-w-full justify-center">
                                    <div className="min-w-0 truncate text-center text-2xl font-bold text-foreground">
                                        {statusBadge ? (
                                            <span className={cn("font-bold", statusBadge.className)}>{`[${statusBadge.label}] `}</span>
                                        ) : null}
                                        {challenge?.title ?? ""}
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Chip color="accent" variant="soft">
                                        <TrophyIcon className="size-5" />
                                        <Chip.Label>
                                            {t("challenge.score", { score: challenge?.score ?? 0 })}
                                        </Chip.Label>
                                    </Chip>
                                    <Chip className={difficultyPalette[challenge?.difficulty ?? ChallengeDifficulty.Easy].text} variant="soft">
                                        <SwordIcon className="size-5" />
                                        <Chip.Label>{t(challengeDifficultyKey)}</Chip.Label>
                                    </Chip>
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="mt-0 max-w-full overflow-hidden p-0">
                            {/* Mobile-only tab switch — desktop shows both columns side by side */}
                            <div className="flex border-b border-divider lg:hidden">
                                {([
                                    ["work", t("challenge.tabs.work")],
                                    ["steps", t("challenge.tabs.steps")],
                                ] as const).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setMobileTab(key)}
                                        className={cn(
                                            "flex-1 px-3 py-3 text-sm font-semibold transition-colors",
                                            mobileTab === key
                                                ? "border-b-2 border-accent text-foreground"
                                                : "text-muted",
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex min-h-0 h-[calc(100dvh-8rem)] flex-col lg:grid lg:h-[calc(100vh-80px)] lg:grid-cols-5">
                                <div className={cn(
                                    mobileTab === "work" ? "block" : "hidden",
                                    "min-h-0 h-full lg:block lg:col-span-2 lg:h-full lg:overflow-hidden",
                                )}>
                                    <div className="flex h-full min-h-0 flex-col">
                                        <DragScrollArea className="min-h-0 h-full flex-1">
                                            <div className="border-b border-divider">
                                                <div className="p-3 pb-0">
                                                    <ProgrammingLanguageTabs
                                                        alwaysShow
                                                        availableLangs={langs}
                                                        selectedLang={activeLang}
                                                        onSelectLang={setSelectedLang}
                                                        ariaLabel={t("challenge.language")}
                                                        variant={ProgrammingLanguageTabsVariant.Secondary}
                                                        surfaceBorder={false}
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                <div className="text-lg font-semibold text-foreground">{t("challenge.yourScore")}</div>
                                                <div className="h-3" />
                                                <Score current={earnedScore} max={maxScore} threshold={passThreshold} />
                                                <div className="h-3" />
                                                <div className="text-xs text-muted">{t("challenge.minimumPassRequirementAll")}</div>
                                            </div>
                                            {prerequisites.length > 0 || requirements.length > 0 || outputs.length > 0 ? (
                                                <div className="border-t border-divider" />
                                            ) : null}

                                            {prerequisites.length > 0 ? (
                                                <div className="p-3">
                                                    <div className="text-lg font-semibold text-foreground">{t("challenge.prerequisites")}</div>
                                                    <div className="h-4.5" />
                                                    <div className="pl-3">
                                                        <MarkdownContent markdown={prerequisitesMarkdown} />
                                                    </div>
                                                </div>
                                            ) : null}

                                            {prerequisites.length > 0 && (requirements.length > 0 || outputs.length > 0) ? (
                                                <div className="border-t border-divider" />
                                            ) : null}

                                            {requirements.length > 0 ? (
                                                <div className="p-3">
                                                    <div className="text-lg font-semibold text-foreground">{t("challenge.requirements")}</div>
                                                    <div className="h-4.5" />
                                                    <div className="flex flex-col divide-y divide-default">
                                                        {requirements.map((item, index) => (
                                                            <div key={`req-${index}`} className="py-3 first:pt-0 last:pb-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="text-base font-semibold text-foreground">
                                                                        {item.title}
                                                                    </div>
                                                                    {item.score !== undefined ? (
                                                                        <Chip color="accent" variant="soft" size="sm">
                                                                            <Chip.Label>{t("challenge.score", { score: item.score })}</Chip.Label>
                                                                        </Chip>
                                                                    ) : null}
                                                                </div>
                                                                <div className="h-3" />
                                                                <MarkdownContent markdown={item.body} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {requirements.length > 0 && outputs.length > 0 ? (
                                                <div className="border-t border-divider" />
                                            ) : null}

                                            {outputs.length > 0 ? (
                                                <div className="p-3">
                                                    <div className="text-lg font-semibold text-foreground">{t("challenge.outputs")}</div>
                                                    <div className="h-4.5" />
                                                    <div className="pl-3">
                                                        <MarkdownContent markdown={outputsMarkdown} />
                                                    </div>
                                                </div>
                                            ) : null}

                                            <div className="border-t border-divider" />
                                            <div className="p-3 pb-0">
                                                <div className="text-lg font-semibold text-foreground">{t("challenge.submissionModal.title")}</div>
                                                <div className="h-1.5" />
                                            </div>
                                            <ChallengeSubmissionPanel lang={activeLang} />
                                        </DragScrollArea>
                                    </div>
                                </div>

                                <DragScrollArea className={cn(
                                    mobileTab === "steps" ? "block" : "hidden",
                                    "min-h-0 h-full lg:block lg:border-l lg:col-span-3",
                                )}>
                                    <Accordion className="px-0" allowsMultipleExpanded defaultExpandedKeys={steps.map((_step, index) => `step-${index}`)}>
                                        {steps.map((step, index) => (
                                            <Accordion.Item key={`step-${index}`} id={`step-${index}`}>
                                                <Accordion.Heading>
                                                    <Accordion.Trigger className="w-full">
                                                        <div className="flex w-full items-center justify-between gap-2">
                                                            <div className="font-semibold text-lg text-foreground">
                                                                {`${index + 1}. ${step.title || t("challenge.steps.label", { index: index + 1 })}`}
                                                            </div>
                                                            <Accordion.Indicator />
                                                        </div>
                                                    </Accordion.Trigger>
                                                </Accordion.Heading>
                                                <Accordion.Panel>
                                                    <Accordion.Body>
                                                        <MarkdownContent markdown={step.body} />
                                                    </Accordion.Body>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                    <div className="border-t" />
                                    <div className="p-3">
                                        <ReferenceLinks references={_.cloneDeep(challenge?.references ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex)} titleKey="reference.title" />
                                    </div>
                                </DragScrollArea>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
