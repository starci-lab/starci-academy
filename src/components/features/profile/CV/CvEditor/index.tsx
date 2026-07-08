"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import {
    Alert,
    Button,
    Chip,
    Label,
    ListBox,
    ScrollShadow,
    Select,
    Typography,
    cn,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
    ArrowRightIcon,
    BriefcaseIcon,
    PaperclipIcon,
    SquaresFourIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { SegmentedControl } from "@/components/blocks/navigation/SegmentedControl"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { GradeModelDropdown, type GradeModelSelection } from "@/components/blocks/grading/GradeModelDropdown"
import { GradeCreditCaption } from "@/components/blocks/grading/GradeCreditCaption"
import { AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import { pathConfig } from "@/resources/path"
import { useSystemAiAutoConfig } from "@/hooks/useSystemAiAutoConfig"
import { useRegisterNavbarBottomLayer } from "@/hooks/zustand/navbarBottomLayer/store"
import { useCvEditorToolbarStore } from "@/hooks/zustand/cvEditorToolbar/store"
import { useQueryMyCvBlocksSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCvBlocksSwr"
import { useQueryMyPickableCvAchievementsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyPickableCvAchievementsSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"
import { useMutateUpdateCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateUpdateCvBlocksSwr"
import { useMutateRenderCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRenderCvBlocksSwr"
import { useMutateRewriteCvBlockSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRewriteCvBlockSwr"
import { CvBlockType } from "@/modules/types/enums/cv-block-type"
import { CvExportFormat } from "@/modules/types/enums/cv-export-format"
import {
    CV_BLOCK_TYPE_DEFAULT_TITLE_EN,
    CV_BLOCK_TYPE_ORDER,
    CV_BLOCK_TYPE_REGISTRY,
} from "../BlockRegistry"
import {
    DEFAULT_CV_STYLE,
    type CvBlock,
    type CvBlockItemFields,
    type CvDocument,
    type CvFontScale,
    type CvLanguage,
    type CvTemplate,
} from "../types"
import { computeCvCompleteness } from "../completeness"
import { CvBlockStack } from "../CvBlocksWorkspace/CvBlockStack"
import { CvHtmlPreview } from "../CvBlocksWorkspace/CvHtmlPreview"
import { buildCvExportHtml } from "../CvBlocksWorkspace/CvHtmlDocument"
import {
    CV_FONTS,
    CV_GOOGLE_FONTS_HREF,
    fontFamilyOf,
} from "../CvBlocksWorkspace/CvHtmlDocument/fonts"
import { CvSplitFromTextModal } from "../CvBlocksWorkspace/CvSplitFromTextModal"
import { CvTailorToJobModal } from "../CvBlocksWorkspace/CvTailorToJobModal"
import { CvTemplateGalleryModal } from "../CvBlocksWorkspace/CvTemplateGalleryModal"
import { CvWorkspaceSkeleton } from "../CvBlocksWorkspace/CvWorkspaceSkeleton"
import { CvEditorToolbarBar } from "./CvEditorToolbarBar"

/** Accent swatches the style rail offers. */
const ACCENT_OPTIONS: Array<string> = [
    "#E84393",
    "#2563EB",
    "#16A34A",
    "#EA580C",
    "#7C3AED",
    "#0F172A",
]

/** How long to wait after the last edit before autosaving. */
const AUTOSAVE_DEBOUNCE_MS = 1000

/** Which pane the mobile `Sửa | Xem` toggle is showing. */
type MobilePane = "edit" | "preview"

/** Font-scale segments the style rail offers ("Cỡ chữ"). */
const FONT_SCALE_VALUES: Array<CvFontScale> = ["sm", "md", "lg"]

/** CV-language segments the style rail offers ("Ngôn ngữ CV"). */
const LANGUAGE_VALUES: Array<CvLanguage> = ["vi", "en"]

/** Props for {@link CvEditor}. */
export interface CvEditorProps extends WithClassNames<undefined> {
    /** `cv_blocks.id` of the document being edited (from the route param). */
    cvId: string
}

/**
 * The dedicated CV editor surface (route `/profile/cv/[cvId]`). A roomy
 * three-zone layout: a narrow left STYLE RAIL (font + accent), the block form
 * in the middle, and the instant HTML preview on the right. A top bar holds
 * the back link to the gallery + the export buttons (PDF via Puppeteer, Word
 * via html-to-docx). Autosaves the draft; the preview updates client-side the
 * moment a block changes.
 *
 * @param props - {@link CvEditorProps}
 */
export const CvEditor = ({ className, cvId }: CvEditorProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const documentsSwr = useQueryMyCvBlocksSwr()
    const activeDocument = documentsSwr.data?.find((doc) => doc.id === cvId)
    const [mobilePane, setMobilePane] = useState<MobilePane>("edit")
    const { trigger: updateDocument } = useMutateUpdateCvBlocksSwr()
    const { trigger: exportDocument } = useMutateRenderCvBlocksSwr()
    const { trigger: rewriteBlock } = useMutateRewriteCvBlockSwr()
    const [exportingFormat, setExportingFormat] = useState<CvExportFormat | null>(null)
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)
    const [isTailorModalOpen, setIsTailorModalOpen] = useState(false)
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)

    const pickableAchievementsSwr = useQueryMyPickableCvAchievementsSwr()
    const capstoneCount = pickableAchievementsSwr.data?.milestoneTaskAttempts.length ?? 0

    // AI model picker ("Trợ lý AI") — drives both "AI viết giúp" (per-block
    // rewrite) and "Chỉnh theo tin tuyển dụng" (tailor-to-JD). Auto lane
    // (both null) omits the model from the mutations below.
    const aiModelsSwr = useQueryAiModelsSwr()
    const aiSettingsSwr = useQueryMyAiSettingsSwr()
    const aiQuotaSwr = useQueryMyAiQuotaSwr()
    const aiQuota = aiQuotaSwr.data
    const aiAutoConfig = useSystemAiAutoConfig()
    const gradeModels = aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []
    const canPremium = aiSettingsSwr.data?.canPremium ?? false
    const [aiSelection, setAiSelection] = useState<GradeModelSelection>({ model: null, provider: null })

    const onUpgrade = useCallback(() => {
        router.push(`${pathConfig().locale(locale).profile().build()}/ai-subscription`)
    }, [locale, router])

    /** Local editable copy — the stack edits this; this component debounces the autosave. */
    const [draft, setDraft] = useState<CvDocument | undefined>(undefined)

    useEffect(() => {
        setDraft(activeDocument)
    }, [activeDocument])

    useEffect(() => {
        if (!draft) {
            return
        }
        const timer = setTimeout(() => {
            void updateDocument({
                id: draft.id,
                label: draft.label,
                blocks: draft.blocks,
                style: draft.style,
            })
        }, AUTOSAVE_DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [draft, updateDocument])

    const onBackToGallery = useCallback(() => {
        router.push(pathConfig().locale(locale).profile().cv().build())
    }, [locale, router])

    const onOpenCourses = () => {
        router.push(pathConfig().locale(locale).course().build())
    }

    const onLabelChange = useCallback((label: string) => {
        setDraft((prev) => (prev ? { ...prev, label } : prev))
    }, [])

    const onBlocksChange = (blocks: Array<CvBlock>) => {
        setDraft((prev) => (prev ? { ...prev, blocks } : prev))
    }

    const onAddBlock = (type: CvBlockType) => {
        setDraft((prev) => {
            if (!prev) {
                return prev
            }
            // English CVs get an English default title; Vietnamese (default) keeps
            // the i18n title. Only affects the DEFAULT — the learner can still rename it.
            const title = prev.style.language === "en"
                ? CV_BLOCK_TYPE_DEFAULT_TITLE_EN[type]
                : t(CV_BLOCK_TYPE_REGISTRY[type].titleKey)
            const nextBlock: CvBlock = {
                id: crypto.randomUUID(),
                type,
                title,
                order: prev.blocks.length,
                items: [],
            }
            return { ...prev, blocks: [...prev.blocks, nextBlock] }
        })
    }

    const onFontChange = (font: string) => {
        setDraft((prev) => (prev ? { ...prev, style: { ...prev.style, font } } : prev))
    }

    const onAccentChange = (accent: string) => {
        setDraft((prev) => (prev ? { ...prev, style: { ...prev.style, accent } } : prev))
    }

    const onFontScaleChange = (fontScale: CvFontScale) => {
        setDraft((prev) => (prev ? { ...prev, style: { ...prev.style, fontScale } } : prev))
    }

    const onLanguageChange = (language: CvLanguage) => {
        setDraft((prev) => (prev ? { ...prev, style: { ...prev.style, language } } : prev))
    }

    const onTemplateChange = (template: CvTemplate) => {
        setDraft((prev) => (prev ? { ...prev, style: { ...prev.style, template } } : prev))
    }

    const onAiRewrite = async (block: CvBlock, itemId: string | undefined): Promise<CvBlockItemFields> => {
        const targetItem = itemId ? block.items.find((item) => item.id === itemId) : block.items[0]
        const result = await rewriteBlock({
            block,
            capstoneAttemptId: targetItem?.sourceRef,
            selectedModel: aiSelection.model,
            selectedModelProvider: aiSelection.provider,
        })
        const rewrittenBlock = result.data?.rewriteCvBlock?.data?.block
        if (!rewrittenBlock) {
            throw new Error("AI rewrite failed")
        }
        const rewrittenItem = itemId
            ? rewrittenBlock.items.find((item) => item.id === itemId)
            : rewrittenBlock.items[0]
        return rewrittenItem?.fields ?? {}
    }

    const onSplitBlocks = (blocks: Array<CvBlock>) => {
        setDraft((prev) => (prev ? { ...prev, blocks } : prev))
    }

    const onTailoredBlocks = (blocks: Array<CvBlock>) => {
        setDraft((prev) => (prev ? { ...prev, blocks } : prev))
    }

    const onExport = useCallback(async (format: CvExportFormat) => {
        if (!draft) {
            return
        }
        setExportingFormat(format)
        try {
            await updateDocument({
                id: draft.id,
                label: draft.label,
                blocks: draft.blocks,
                style: draft.style,
            })
            const result = await exportDocument({
                id: draft.id,
                html: buildCvExportHtml(draft),
                format,
            })
            const url = result.data?.renderCvBlocks?.data?.url
            if (url) {
                window.open(url, "_blank")
            }
        } finally {
            setExportingFormat(null)
        }
    }, [draft, updateDocument, exportDocument])

    // Feed the toolbar (rendered as the Navbar's bottom layer) via a store, and
    // register a STABLE node once so the name input never remounts (keeps focus).
    const setToolbar = useCvEditorToolbarStore((state) => state.setToolbar)
    useEffect(() => {
        setToolbar({
            label: draft?.label ?? "",
            canExport: Boolean(draft),
            exportingFormat,
            onBack: onBackToGallery,
            onLabelChange,
            onExport,
        })
    }, [draft?.label, draft, exportingFormat, onBackToGallery, onLabelChange, onExport, setToolbar])
    const toolbarNode = useMemo(() => <CvEditorToolbarBar />, [])
    useRegisterNavbarBottomLayer(toolbarNode)

    const completeness = useMemo(
        () => (draft ? computeCvCompleteness(draft) : null),
        [draft],
    )

    const presentSingletonTypes = useMemo(
        () => new Set(
            (draft?.blocks ?? [])
                .filter((block) => CV_BLOCK_TYPE_REGISTRY[block.type].singleton)
                .map((block) => block.type),
        ),
        [draft?.blocks],
    )
    const addableTypes = CV_BLOCK_TYPE_ORDER.filter((type) => !presentSingletonTypes.has(type))

    const isLoading = documentsSwr.isLoading && !documentsSwr.data
    const isMissing = !documentsSwr.isLoading && !activeDocument

    return (
        <div className={cn("flex flex-col overflow-x-hidden", className)}>
            {/* Load all catalog Google fonts so any pick renders instantly in the
                preview (React 19 hoists this <link> into <head>). The toolbar
                (back + name + export) renders in the Navbar's bottom layer. */}
            <link rel="stylesheet" href={CV_GOOGLE_FONTS_HREF} />

            <AsyncContent
                isLoading={isLoading}
                skeleton={<div className="p-6"><CvWorkspaceSkeleton /></div>}
                isEmpty={isMissing}
                emptyContent={{
                    title: t("cv.builder.missingTitle"),
                    description: t("cv.builder.missingHint"),
                    onRetry: onBackToGallery,
                    retryLabel: t("cv.builder.galleryTarget"),
                }}
                error={documentsSwr.error}
                errorContent={{
                    title: t("cv.builder.errorTitle"),
                    onRetry: () => documentsSwr.mutate(),
                    retryLabel: t("cv.builder.retry"),
                }}
            >
                {/* Mobile mode switch — desktop shows all zones. */}
                <div className="px-6 pt-4 lg:hidden">
                    <SegmentedControl
                        ariaLabel={t("cv.builder.mobilePaneAria")}
                        items={[
                            { value: "edit", label: t("cv.builder.editPane") },
                            { value: "preview", label: t("cv.builder.previewPane") },
                        ]}
                        value={mobilePane}
                        onChange={setMobilePane}
                    />
                </div>

                {/* Full-bleed shell — flush style SIDEBAR (border-r, viewport-tall,
                    drag-resizable on desktop) + content (blocks | preview), each an
                    independent scroll region. */}
                <div className="flex flex-col lg:h-[calc(100dvh-7.5rem)] lg:flex-row">
                    {/* Style sidebar — flush-left, full-height, docs-style. Resizable
                        (mirrors the learn-shell content rail); mobile stays full-width
                        (the JS-driven width + drag handle are desktop-only). */}
                    <ResizableRail
                        storageKey="starci.cv.editorSidebar.width"
                        defaultWidth={256}
                        minWidth={220}
                        maxWidth={420}
                        ariaLabel={t("cv.builder.resizeSidebarAria")}
                        className={cn(
                            // the resize handle IS the divider — no separate `border-r` (mirrors
                            // the learn-shell content rail, which has none either; adding one on
                            // top of the handle line reads as a doubled/thicker divider). The
                            // long content scrolls inside a ScrollShadow (fade edges) below —
                            // the root just frames + carries the resize handle.
                            "relative flex flex-col border-b border-separator max-lg:w-full! lg:shrink-0 lg:border-b-0",
                            "[&>[role=separator]]:max-lg:hidden",
                            mobilePane !== "edit" && "hidden lg:flex",
                        )}
                    >
                        {/* Long style/config list → ScrollShadow (fade edges) on desktop
                            (rule: rail dài → ScrollShadow, not bare overflow). Mobile flows
                            naturally in the page stack (no fixed-height scroll). */}
                        <ScrollShadow
                            hideScrollBar
                            className="flex flex-col gap-6 p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
                        >
                            {/* Mẫu (template) — coarsest style lever, so it sits at the top.
                            Shows the CURRENT value and opens a picker (the thumbnail
                            gallery), rendered as `Button variant="tertiary"` — matching
                            the "Trợ lý AI" picker below (both button-style pickers;
                            Phông chữ/Cỡ chữ stay real `Select` fields). */}
                            <div className="flex flex-col gap-3">
                                <Label>{t("cv.builder.template.label")}</Label>
                                <Button
                                    variant="tertiary"
                                    size="sm"
                                    fullWidth
                                    aria-label={t("cv.builder.template.label")}
                                    onPress={() => setIsTemplateModalOpen(true)}
                                >
                                    <SquaresFourIcon aria-hidden className="size-4 shrink-0" />
                                    <span className="min-w-0 flex-1 truncate text-left">
                                        {t(`cv.builder.template.names.${draft?.style.template ?? "classic"}`)}
                                    </span>
                                </Button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>{t("cv.builder.fontLabel")}</Label>
                                <Select.Root
                                    selectedKey={draft?.style.font ?? DEFAULT_CV_STYLE.font}
                                    onSelectionChange={(key) => {
                                        if (key) {
                                            onFontChange(String(key))
                                        }
                                    }}
                                >
                                    <Select.Trigger aria-label={t("cv.builder.fontLabel")}>
                                        <Select.Value style={{ fontFamily: fontFamilyOf(draft?.style.font ?? DEFAULT_CV_STYLE.font) }} />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox.Root aria-label={t("cv.builder.fontLabel")} items={CV_FONTS}>
                                            {(font) => (
                                                <ListBox.Item key={font.key} id={font.key} textValue={font.label} aria-label={font.label}>
                                                    <span style={{ fontFamily: font.family }}>{font.label}</span>
                                                </ListBox.Item>
                                            )}
                                        </ListBox.Root>
                                    </Select.Popover>
                                </Select.Root>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label>{t("cv.builder.accentLabel")}</Label>
                                <div role="group" aria-label={t("cv.builder.accentLabel")} className="flex flex-wrap items-center gap-2">
                                    {ACCENT_OPTIONS.map((hex) => (
                                        <button
                                            key={hex}
                                            type="button"
                                            aria-label={hex}
                                            aria-pressed={draft?.style.accent === hex}
                                            onClick={() => onAccentChange(hex)}
                                            style={{ backgroundColor: hex }}
                                            className={cn(
                                                "size-6 shrink-0 cursor-pointer rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-accent",
                                                draft?.style.accent === hex && "scale-110 ring-2 ring-accent ring-offset-2 ring-offset-surface",
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>{t("cv.builder.fontScaleLabel")}</Label>
                                <Select.Root
                                    selectedKey={draft?.style.fontScale ?? DEFAULT_CV_STYLE.fontScale ?? "md"}
                                    onSelectionChange={(key) => {
                                        if (key) {
                                            onFontScaleChange(key as CvFontScale)
                                        }
                                    }}
                                >
                                    <Select.Trigger aria-label={t("cv.builder.fontScaleLabel")}>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox.Root
                                            aria-label={t("cv.builder.fontScaleLabel")}
                                            items={FONT_SCALE_VALUES.map((value) => ({ value }))}
                                        >
                                            {(item) => (
                                                <ListBox.Item
                                                    key={item.value}
                                                    id={item.value}
                                                    textValue={t(`cv.builder.fontScale.${item.value}`)}
                                                    aria-label={t(`cv.builder.fontScale.${item.value}`)}
                                                >
                                                    {t(`cv.builder.fontScale.${item.value}`)}
                                                </ListBox.Item>
                                            )}
                                        </ListBox.Root>
                                    </Select.Popover>
                                </Select.Root>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label>{t("cv.builder.languageLabel")}</Label>
                                <Select.Root
                                    selectedKey={draft?.style.language ?? DEFAULT_CV_STYLE.language ?? "vi"}
                                    onSelectionChange={(key) => {
                                        if (key) {
                                            onLanguageChange(key as CvLanguage)
                                        }
                                    }}
                                >
                                    <Select.Trigger aria-label={t("cv.builder.languageLabel")}>
                                        <Select.Value />
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox.Root
                                            aria-label={t("cv.builder.languageLabel")}
                                            items={LANGUAGE_VALUES.map((value) => ({ value }))}
                                        >
                                            {(item) => (
                                                <ListBox.Item
                                                    key={item.value}
                                                    id={item.value}
                                                    textValue={t(`cv.builder.language.${item.value}`)}
                                                    aria-label={t(`cv.builder.language.${item.value}`)}
                                                >
                                                    {t(`cv.builder.language.${item.value}`)}
                                                </ListBox.Item>
                                            )}
                                        </ListBox.Root>
                                    </Select.Popover>
                                </Select.Root>
                            </div>

                            {/* AI assistant — the model picker for "AI viết giúp" rewrites,
                            rendered `isButton` (matches the "Mẫu" picker above — both
                            button-style pickers; Phông chữ/Cỡ chữ stay real `Select`
                            fields). Sits ABOVE "Truy cập nhanh" (thầy: trợ lý AI ở trên).
                            Credit caption = shared `GradeCreditCaption` (weekly pool, same
                            as every other AI surface — see canon
                            `ai-credit-caption-bound-to-picker-not-button.md`). */}
                            <div className="flex flex-col gap-3">
                                <Label>{t("cv.builder.aiAssistantLabel")}</Label>
                                <GradeModelDropdown
                                    isButton
                                    isButtonFullWidth
                                    models={gradeModels}
                                    selection={aiSelection}
                                    canPremium={canPremium}
                                    showAutoLane
                                    task={AiModelTask.CvGenerating}
                                    onSelect={setAiSelection}
                                    onUpgrade={onUpgrade}
                                />
                                <GradeCreditCaption
                                    creditUsage={aiQuota}
                                    hasPinnedModel={aiSelection.model !== null}
                                    autoCreditCost={aiAutoConfig?.creditCost}
                                />
                            </div>

                            {/* Quick access — both ingest entry points: paste an existing CV +
                            tailor to a job description (thầy: cả 2 ở truy cập nhanh). */}
                            <div className="flex flex-col gap-2">
                                <Label>{t("cv.builder.quickAccessLabel")}</Label>
                                <Button variant="tertiary" className="w-full justify-start" onPress={() => setIsSplitModalOpen(true)}>
                                    <PaperclipIcon aria-hidden className="size-4 shrink-0" />
                                    <span className="min-w-0 flex-1 truncate text-left">{t("cv.builder.splitEntryCta")}</span>
                                </Button>
                                <Button
                                    variant="tertiary"
                                    className="w-full justify-start"
                                    isDisabled={!draft}
                                    onPress={() => setIsTailorModalOpen(true)}
                                >
                                    <BriefcaseIcon aria-hidden className="size-4 shrink-0" />
                                    <span className="min-w-0 flex-1 truncate text-left">{t("cv.builder.tailorEntryCta")}</span>
                                </Button>
                            </div>

                            {/* Completeness meter — cheap client-derived score + a
                            one-line nudge toward the highest-impact missing item. */}
                            {completeness ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <Label>{t("cv.builder.completeness.label")}</Label>
                                        <Typography type="body-xs" color="muted">
                                            {t("cv.builder.completeness.percent", { percent: completeness.percent })}
                                        </Typography>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-default">
                                        <div
                                            className="h-full rounded-full bg-accent transition-all"
                                            style={{ width: `${completeness.percent}%` }}
                                        />
                                    </div>
                                    {completeness.nextHintKey ? (
                                        <Typography type="body-xs" color="muted">
                                            {t(completeness.nextHintKey)}
                                        </Typography>
                                    ) : null}
                                </div>
                            ) : null}

                            {/* Verified-project trust: a badge once earned, else an
                            ACCENT Alert card (course-funnel CTA — empty state pushes
                            to enrol/learn). The whole card IS the CTA (not just the
                            button), so the alert itself is accent-toned via `status`
                            (nested-in-sidebar tint — [[elements/alert]] §3), not
                            warning. Vertical (button stacked in Content) to fit the
                            narrow sidebar. */}
                            <div className="mt-auto">
                                {capstoneCount > 0 ? (
                                    <Chip className="bg-accent/10 text-accent">
                                        <TrophyIcon aria-hidden className="size-4" />
                                        <Chip.Label>{t("cv.builder.trustBadge", { count: capstoneCount })}</Chip.Label>
                                    </Chip>
                                ) : (
                                    <Alert status="accent" className="bg-accent/10 shadow-none">
                                        <Alert.Content>
                                            <Alert.Title>{t("cv.builder.noCourseTitle")}</Alert.Title>
                                            <Alert.Description>{t("cv.builder.noCourseHint")}</Alert.Description>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="mt-2 w-full"
                                                onPress={onOpenCourses}
                                            >
                                                {t("cv.builder.noCourseCta")}
                                                <ArrowRightIcon aria-hidden className="size-4" />
                                            </Button>
                                        </Alert.Content>
                                    </Alert>
                                )}
                            </div>
                        </ScrollShadow>
                    </ResizableRail>

                    {/* Content — blocks | preview, each an independent scroll region. */}
                    <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-2 lg:overflow-hidden">
                        {/* Blocks — ScrollShadow scroll region on desktop. */}
                        <ScrollShadow
                            hideScrollBar
                            className={cn(
                                "min-h-0 lg:pr-1",
                                mobilePane !== "edit" && "hidden lg:block",
                            )}
                        >
                            {draft ? (
                                <CvBlockStack
                                    blocks={draft.blocks}
                                    onChange={onBlocksChange}
                                    addableTypes={addableTypes}
                                    onAddBlock={onAddBlock}
                                    onAiRewrite={onAiRewrite}
                                />
                            ) : null}
                        </ScrollShadow>

                        {/* Preview — independent scroll region on desktop. */}
                        <div className={cn("min-h-0", mobilePane !== "preview" && "hidden lg:block")}>
                            {draft ? <CvHtmlPreview doc={draft} /> : null}
                        </div>
                    </div>
                </div>
            </AsyncContent>

            <CvSplitFromTextModal
                isOpen={isSplitModalOpen}
                onOpenChange={setIsSplitModalOpen}
                onSplit={onSplitBlocks}
            />

            <CvTailorToJobModal
                isOpen={isTailorModalOpen}
                onOpenChange={setIsTailorModalOpen}
                blocks={draft?.blocks ?? []}
                selectedModel={aiSelection.model}
                selectedModelProvider={aiSelection.provider}
                onTailored={onTailoredBlocks}
            />

            {draft ? (
                <CvTemplateGalleryModal
                    isOpen={isTemplateModalOpen}
                    onOpenChange={setIsTemplateModalOpen}
                    doc={draft}
                    onSelect={onTemplateChange}
                />
            ) : null}
        </div>
    )
}
