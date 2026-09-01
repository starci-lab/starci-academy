#!/usr/bin/env node
import fs from "node:fs"

const file = "src/components/pages/CvEditorPage/index.tsx"
let src = fs.readFileSync(file, "utf8")
const nl = src.includes("\r\n") ? "\r\n" : "\n"

function mustReplace(from, to, label) {
    const fromN = from.replace(/\n/g, nl)
    const toN = to.replace(/\n/g, nl)
    if (!src.includes(fromN)) {
        console.error("MISSING:", label)
        process.exit(1)
    }
    src = src.replace(fromN, toN)
    console.log("ok:", label)
}

mustReplace(
    "className=\"flex flex-col gap-6 p-6 @app-lg:min-h-0 @app-lg:flex-1 @app-lg:overflow-y-auto\"",
    "className=\"@app-lg:min-h-0 @app-lg:flex-1 @app-lg:overflow-y-auto\"",
    "scrollshadow strip spacing",
)

mustReplace(
    `className="@app-lg:min-h-0 @app-lg:flex-1 @app-lg:overflow-y-auto"
                        >
                            {/* Template — coarsest style lever, so it sits at the top.`,
    `className="@app-lg:min-h-0 @app-lg:flex-1 @app-lg:overflow-y-auto"
                        >
                            <Box principle="page-pad" className="flex min-h-full flex-col p-6">
                            <Box principle="block-boundary" className="flex flex-1 flex-col gap-6">
                            {/* Template — coarsest style lever, so it sits at the top.`,
    "open page-pad + block-boundary",
)

mustReplace(
    `                            <div className="flex flex-col gap-3">
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
                                        {t(\`cv.builder.template.names.\${draft?.style.template ?? "classic"}\`)}
                                    </span>
                                </Button>
                            </div>`,
    `                            <StackV gap={4} principle="label-field" items={[
                                () => <Label>{t("cv.builder.template.label")}</Label>,
                                () => (
                                    <Button
                                        variant="tertiary"
                                        size="sm"
                                        fullWidth
                                        aria-label={t("cv.builder.template.label")}
                                        onPress={() => setIsTemplateModalOpen(true)}
                                    >
                                        <SquaresFourIcon aria-hidden className="size-4 shrink-0" />
                                        <span className="min-w-0 flex-1 truncate text-left">
                                            {t(\`cv.builder.template.names.\${draft?.style.template ?? "classic"}\`)}
                                        </span>
                                    </Button>
                                ),
                            ]} />`,
    "template field",
)

mustReplace(
    `                            <div className="flex flex-col gap-3">
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
                            </div>`,
    `                            <StackV gap={4} principle="label-field" items={[
                                () => <Label>{t("cv.builder.fontLabel")}</Label>,
                                () => (
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
                                ),
                            ]} />`,
    "font field",
)

mustReplace(
    `                            <div className="flex flex-col gap-3">
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
                            </div>`,
    `                            <StackV gap={4} principle="label-field" items={[
                                () => <Label>{t("cv.builder.accentLabel")}</Label>,
                                () => (
                                    <Cluster
                                        gap={3}
                                        principle="chip-row"
                                        align="center"
                                        items={ACCENT_OPTIONS.map((hex) => () => (
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
                                    />
                                ),
                            ]} />`,
    "accent field",
)

mustReplace(
    `                            <div className="flex flex-col gap-3">
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
                                                    textValue={t(\`cv.builder.fontScale.\${item.value}\`)}
                                                    aria-label={t(\`cv.builder.fontScale.\${item.value}\`)}
                                                >
                                                    {t(\`cv.builder.fontScale.\${item.value}\`)}
                                                </ListBox.Item>
                                            )}
                                        </ListBox.Root>
                                    </Select.Popover>
                                </Select.Root>
                            </div>`,
    `                            <StackV gap={4} principle="label-field" items={[
                                () => <Label>{t("cv.builder.fontScaleLabel")}</Label>,
                                () => (
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
                                                        textValue={t(\`cv.builder.fontScale.\${item.value}\`)}
                                                        aria-label={t(\`cv.builder.fontScale.\${item.value}\`)}
                                                    >
                                                        {t(\`cv.builder.fontScale.\${item.value}\`)}
                                                    </ListBox.Item>
                                                )}
                                            </ListBox.Root>
                                        </Select.Popover>
                                    </Select.Root>
                                ),
                            ]} />`,
    "fontScale field",
)

mustReplace(
    `                            <div className="flex flex-col gap-3">
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
                                                    textValue={t(\`cv.builder.language.\${item.value}\`)}
                                                    aria-label={t(\`cv.builder.language.\${item.value}\`)}
                                                >
                                                    {t(\`cv.builder.language.\${item.value}\`)}
                                                </ListBox.Item>
                                            )}
                                        </ListBox.Root>
                                    </Select.Popover>
                                </Select.Root>
                            </div>`,
    `                            <StackV gap={4} principle="label-field" items={[
                                () => <Label>{t("cv.builder.languageLabel")}</Label>,
                                () => (
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
                                                        textValue={t(\`cv.builder.language.\${item.value}\`)}
                                                        aria-label={t(\`cv.builder.language.\${item.value}\`)}
                                                    >
                                                        {t(\`cv.builder.language.\${item.value}\`)}
                                                    </ListBox.Item>
                                                )}
                                            </ListBox.Root>
                                        </Select.Popover>
                                    </Select.Root>
                                ),
                            ]} />`,
    "language field",
)

mustReplace(
    `                            <div className="flex flex-col gap-3">
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
                            </div>`,
    `                            <StackV gap={4} principle="label-field" items={[
                                () => <Label>{t("cv.builder.aiAssistantLabel")}</Label>,
                                () => (
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
                                ),
                                () => (
                                    <GradeCreditCaption
                                        creditUsage={aiQuota}
                                        hasPinnedModel={aiSelection.model !== null}
                                        autoCreditCost={aiAutoConfig?.creditCost}
                                    />
                                ),
                            ]} />`,
    "ai assistant",
)

mustReplace(
    `                            <div className="flex flex-col gap-2">
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
                            </div>`,
    `                            <StackV gap={3} principle="sibling-stack" items={[
                                () => <Label>{t("cv.builder.quickAccessLabel")}</Label>,
                                () => (
                                    <Button variant="tertiary" className="w-full justify-start" onPress={() => setIsSplitModalOpen(true)}>
                                        <PaperclipIcon aria-hidden className="size-4 shrink-0" />
                                        <span className="min-w-0 flex-1 truncate text-left">{t("cv.builder.splitEntryCta")}</span>
                                    </Button>
                                ),
                                () => (
                                    <Button
                                        variant="tertiary"
                                        className="w-full justify-start"
                                        isDisabled={!draft}
                                        onPress={() => setIsTailorModalOpen(true)}
                                    >
                                        <BriefcaseIcon aria-hidden className="size-4 shrink-0" />
                                        <span className="min-w-0 flex-1 truncate text-left">{t("cv.builder.tailorEntryCta")}</span>
                                    </Button>
                                ),
                            ]} />`,
    "quick access",
)

mustReplace(
    `                            {completeness ? (
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
                                            style={{ width: \`\${completeness.percent}%\` }}
                                        />
                                    </div>
                                    {completeness.nextHintKey ? (
                                        <Typography type="body-xs" color="muted">
                                            {t(completeness.nextHintKey)}
                                        </Typography>
                                    ) : null}
                                </div>
                            ) : null}`,
    `                            {completeness ? (
                                <StackV gap={3} principle="sibling-stack" items={[
                                    () => (
                                        <StackH gap={3} principle="flex-action" justify="between" align="center" items={[
                                            () => <Label>{t("cv.builder.completeness.label")}</Label>,
                                            () => (
                                                <Typography type="body-xs" color="muted">
                                                    {t("cv.builder.completeness.percent", { percent: completeness.percent })}
                                                </Typography>
                                            ),
                                        ]} />
                                    ),
                                    () => (
                                        <div className="h-1.5 w-full rounded-full bg-default">
                                            <div
                                                className="h-full rounded-full bg-accent transition-all"
                                                style={{ width: \`\${completeness.percent}%\` }}
                                            />
                                        </div>
                                    ),
                                    ...(completeness.nextHintKey ? [() => (
                                        <Typography type="body-xs" color="muted">
                                            {t(completeness.nextHintKey)}
                                        </Typography>
                                    )] : []),
                                ]} />
                            ) : null}`,
    "completeness",
)

mustReplace(
    `                            <div className="mt-auto">
                                {capstoneCount > 0 ? (
                                    <Chip className="bg-accent-soft text-accent-soft-foreground">
                                        <TrophyIcon aria-hidden className="size-4" />
                                        <Chip.Label>{t("cv.builder.trustBadge", { count: capstoneCount })}</Chip.Label>
                                    </Chip>
                                ) : (
                                    <Alert status="accent" className="bg-accent-soft shadow-none">
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
                        </ScrollShadow>`,
    `                            <Box principle="pin-bottom" className="mt-auto">
                                {capstoneCount > 0 ? (
                                    <Chip className="bg-accent-soft text-accent-soft-foreground">
                                        <TrophyIcon aria-hidden className="size-4" />
                                        <Chip.Label>{t("cv.builder.trustBadge", { count: capstoneCount })}</Chip.Label>
                                    </Chip>
                                ) : (
                                    <Alert status="accent" className="bg-accent-soft shadow-none">
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
                            </Box>
                            </Box>
                            </Box>
                        </ScrollShadow>`,
    "pin-bottom + close",
)

mustReplace(
    `import { Box } from "@/components/frames/Box"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"`,
    `import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"`,
    "cluster import",
)

mustReplace(
    `                    <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 p-6 @app-lg:grid-cols-2 @app-lg:overflow-hidden">
                        {/* Edit pane — a Block | LaTeX toggle over either the block form or
                            the raw \`.tex\` editor. */}
                        <div
                            className={cn(
                                "flex min-h-0 flex-col gap-3",
                                mobilePane !== "edit" && "hidden @app-lg:flex",
                            )}
                        >
                            <TabsCard
                                variant="primary"
                                size="sm"
                                leftTabs={{
                                    selectedKey: mode,
                                    ariaLabel: t("cv.builder.modeAria"),
                                    onSelectionChange: (key) => onModeChange(String(key) as WorkspaceMode),
                                    items: [
                                        { key: "block", label: t("cv.builder.modeBlock") },
                                        { key: "latex", label: t("cv.builder.modeLatex") },
                                    ],
                                }}
                            />
                            {mode === "block" ? (
                                <ScrollShadow hideScrollBar className="min-h-0 flex-1 @app-lg:pr-1">
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
                            ) : (
                                <div className="min-h-0 flex-1">
                                    <CvTexEditor value={texDraft} onChange={setTexDraft} />
                                </div>
                            )}
                        </div>

                        {/* Preview — the compiled PDF (debounced tectonic compile). */}
                        <div className={cn("min-h-0", mobilePane !== "preview" && "hidden @app-lg:block")}>
                            {draft ? <CvPdfPreview cvId={draft.id} tex={currentTex} /> : null}
                        </div>
                    </div>`,
    `                    <Box principle="page-pad" className="min-w-0 flex-1 p-6 @app-lg:overflow-hidden">
                        <Grid
                            gap={6}
                            principle="block-boundary"
                            columns={{ base: 1, lg: 2 }}
                            classNames={["min-h-0"]}
                            items={[
                                {
                                    key: "edit",
                                    content: () => (
                                        <div className={cn("min-h-0", mobilePane !== "edit" && "hidden @app-lg:block")}>
                                            <StackV
                                                gap={4}
                                                principle="label-field"
                                                classNames={["min-h-0"]}
                                                items={[
                                                    () => (
                                                        <TabsCard
                                                            variant="primary"
                                                            size="sm"
                                                            leftTabs={{
                                                                selectedKey: mode,
                                                                ariaLabel: t("cv.builder.modeAria"),
                                                                onSelectionChange: (key) => onModeChange(String(key) as WorkspaceMode),
                                                                items: [
                                                                    { key: "block", label: t("cv.builder.modeBlock") },
                                                                    { key: "latex", label: t("cv.builder.modeLatex") },
                                                                ],
                                                            }}
                                                        />
                                                    ),
                                                    () => (
                                                        mode === "block" ? (
                                                            <ScrollShadow hideScrollBar className="min-h-0 flex-1 @app-lg:pr-1">
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
                                                        ) : (
                                                            <div className="min-h-0 flex-1">
                                                                <CvTexEditor value={texDraft} onChange={setTexDraft} />
                                                            </div>
                                                        )
                                                    ),
                                                ]}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "preview",
                                    content: () => (
                                        <div className={cn("min-h-0", mobilePane !== "preview" && "hidden @app-lg:block")}>
                                            {draft ? <CvPdfPreview cvId={draft.id} tex={currentTex} /> : null}
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Box>`,
    "content grid",
)

fs.writeFileSync(file, src)
console.log("CvEditor migrated OK")
