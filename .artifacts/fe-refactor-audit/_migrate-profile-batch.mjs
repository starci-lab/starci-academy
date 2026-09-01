#!/usr/bin/env node
import fs from "node:fs"

function patch(file, replacements) {
    let src = fs.readFileSync(file, "utf8")
    const nl = src.includes("\r\n") ? "\r\n" : "\n"
    for (const [from, to, label] of replacements) {
        const fromN = from.replace(/\n/g, nl)
        const toN = to.replace(/\n/g, nl)
        if (!src.includes(fromN)) {
            console.error("MISSING in", file, ":", label)
            process.exit(1)
        }
        src = src.replace(fromN, toN)
        console.log("ok", file, label)
    }
    fs.writeFileSync(file, src)
}

// ── FlashcardReview: principle must share the className line ─────────────────
{
    const file = "src/components/pages/DashboardPage/FlashcardReview/component.tsx"
    let src = fs.readFileSync(file, "utf8")
    const from = `<Box
            principle="cell-pad"
            className="p-3"
            identity={{ tier: "block", component: "FlashcardReview" }}
        >`
    const to = "<Box principle=\"cell-pad\" className=\"p-3\" identity={{ tier: \"block\", component: \"FlashcardReview\" }}>"
    const nl = src.includes("\r\n") ? "\r\n" : "\n"
    if (!src.includes(from.replace(/\n/g, nl))) {
        console.error("FlashcardReview box missing")
        process.exit(1)
    }
    src = src.replace(from.replace(/\n/g, nl), to)
    fs.writeFileSync(file, src)
    console.log("ok FlashcardReview one-line Box")
}

// ── ProfileChallengeManagePage ───────────────────────────────────────────────
{
    const file = "src/components/pages/ProfileChallengeManagePage/index.tsx"
    let src = fs.readFileSync(file, "utf8")
    if (!src.includes("from \"@/components/frames/Stack\"")) {
        src = src.replace(
            "import type { WithClassNames } from \"@/modules/types/base/class-name\"",
            "import { Box } from \"@/components/frames/Box\"\nimport { Cluster } from \"@/components/frames/Cluster\"\nimport { StackH, StackV } from \"@/components/frames/Stack\"\nimport type { WithClassNames } from \"@/modules/types/base/class-name\"",
        )
    }
    fs.writeFileSync(file, src)

    patch(file, [
        [
            `            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <SearchInput
                        className="min-w-0 flex-1"
                        value={search}
                        onValueChange={setSearch}
                        placeholder={t("publicProfile.challengesTab.manage.searchPlaceholder")}
                    />
                    <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                        <Button
                            isIconOnly
                            variant="ghost"
                            aria-label={t("publicProfile.challengesTab.manage.filterButton")}
                            className="shrink-0"
                        >
                            {activeFacetCount > 0 ? (
                                <Badge.Anchor>
                                    <FunnelIcon className="size-5" />
                                    <Badge size="sm" color="accent" placement="top-left">{activeFacetCount}</Badge>
                                </Badge.Anchor>
                            ) : (
                                <FunnelIcon className="size-5" />
                            )}
                        </Button>
                        <Popover.Content className="w-72">
                            <div className="flex flex-col gap-3 p-3">
                                <div className="flex flex-col gap-2">
                                    <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.sortHeading")}</Typography>
                                    <FlexWrapButtonRadio<SortValue>
                                        ariaLabel={t("publicProfile.challengesTab.manage.sortAria")}
                                        value={sort}
                                        onChange={setSort}
                                        items={[
                                            { value: "newest", content: t("publicProfile.challengesTab.manage.sortNewest") },
                                            { value: "score", content: t("publicProfile.challengesTab.manage.sortScore") },
                                        ]}
                                    />
                                </div>
                                {difficultyOptions.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.difficultyHeading")}</Typography>
                                        <FlexWrapButtonRadio<DifficultyFilterValue>
                                            ariaLabel={t("publicProfile.challengesTab.manage.difficultyFilterAria")}
                                            value={difficultyFilter}
                                            onChange={setDifficultyFilter}
                                            items={[
                                                { value: "all", content: t("publicProfile.challengesTab.manage.allDifficulties") },
                                                ...difficultyOptions.map((raw) => ({
                                                    value: raw,
                                                    content: <DifficultyChip difficulty={difficultyLevel(raw) ?? "beginner"} />,
                                                })),
                                            ]}
                                        />
                                    </div>
                                ) : null}
                                {languageOptions.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.languageHeading")}</Typography>
                                        <FlexWrapButtonRadio<LanguageFilterValue>
                                            ariaLabel={t("publicProfile.challengesTab.manage.languageFilterAria")}
                                            value={languageFilter}
                                            onChange={setLanguageFilter}
                                            items={[
                                                { value: "all", content: t("publicProfile.challengesTab.manage.allLanguages") },
                                                ...languageOptions.map((lang) => ({
                                                    value: lang,
                                                    content: <LanguageChip language={lang} />,
                                                })),
                                            ]}
                                        />
                                    </div>
                                ) : null}
                                {activeFacetCount > 0 ? (
                                    <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                        {t("publicProfile.challengesTab.manage.clearFilters")}
                                    </Button>
                                ) : null}
                            </div>
                        </Popover.Content>
                    </Popover>
                </div>
                <Typography type="body-sm" color="muted" className="shrink-0">
                    {t("publicProfile.challengesTab.manage.found", { count: filtered.length })}
                </Typography>
            </div>`,
            `            <Cluster gap={4} principle="content-row" justify="between" align="center" classNames={["w-full"]} items={[
                () => (
                    <StackH gap={4} principle="flex-action" classNames={["min-w-0", "flex-1"]} items={[
                        () => (
                            <SearchInput
                                className="min-w-0 flex-1"
                                value={search}
                                onValueChange={setSearch}
                                placeholder={t("publicProfile.challengesTab.manage.searchPlaceholder")}
                            />
                        ),
                        () => (
                            <Popover isOpen={filterOpen} onOpenChange={setFilterOpen}>
                                <Button
                                    isIconOnly
                                    variant="ghost"
                                    aria-label={t("publicProfile.challengesTab.manage.filterButton")}
                                    className="shrink-0"
                                >
                                    {activeFacetCount > 0 ? (
                                        <Badge.Anchor>
                                            <FunnelIcon className="size-5" />
                                            <Badge size="sm" color="accent" placement="top-left">{activeFacetCount}</Badge>
                                        </Badge.Anchor>
                                    ) : (
                                        <FunnelIcon className="size-5" />
                                    )}
                                </Button>
                                <Popover.Content className="w-72">
                                    <Box principle="cell-pad" className="p-3">
                                        <StackV gap={4} principle="group-boundary" items={[
                                            () => (
                                                <StackV gap={4} principle="label-field" items={[
                                                    () => <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.sortHeading")}</Typography>,
                                                    () => (
                                                        <FlexWrapButtonRadio<SortValue>
                                                            ariaLabel={t("publicProfile.challengesTab.manage.sortAria")}
                                                            value={sort}
                                                            onChange={setSort}
                                                            items={[
                                                                { value: "newest", content: t("publicProfile.challengesTab.manage.sortNewest") },
                                                                { value: "score", content: t("publicProfile.challengesTab.manage.sortScore") },
                                                            ]}
                                                        />
                                                    ),
                                                ]} />
                                            ),
                                            ...(difficultyOptions.length > 0 ? [() => (
                                                <StackV gap={4} principle="label-field" items={[
                                                    () => <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.difficultyHeading")}</Typography>,
                                                    () => (
                                                        <FlexWrapButtonRadio<DifficultyFilterValue>
                                                            ariaLabel={t("publicProfile.challengesTab.manage.difficultyFilterAria")}
                                                            value={difficultyFilter}
                                                            onChange={setDifficultyFilter}
                                                            items={[
                                                                { value: "all", content: t("publicProfile.challengesTab.manage.allDifficulties") },
                                                                ...difficultyOptions.map((raw) => ({
                                                                    value: raw,
                                                                    content: <DifficultyChip difficulty={difficultyLevel(raw) ?? "beginner"} />,
                                                                })),
                                                            ]}
                                                        />
                                                    ),
                                                ]} />
                                            )] : []),
                                            ...(languageOptions.length > 0 ? [() => (
                                                <StackV gap={4} principle="label-field" items={[
                                                    () => <Typography type="body-xs" color="muted">{t("publicProfile.challengesTab.manage.languageHeading")}</Typography>,
                                                    () => (
                                                        <FlexWrapButtonRadio<LanguageFilterValue>
                                                            ariaLabel={t("publicProfile.challengesTab.manage.languageFilterAria")}
                                                            value={languageFilter}
                                                            onChange={setLanguageFilter}
                                                            items={[
                                                                { value: "all", content: t("publicProfile.challengesTab.manage.allLanguages") },
                                                                ...languageOptions.map((lang) => ({
                                                                    value: lang,
                                                                    content: <LanguageChip language={lang} />,
                                                                })),
                                                            ]}
                                                        />
                                                    ),
                                                ]} />
                                            )] : []),
                                            ...(activeFacetCount > 0 ? [() => (
                                                <Button variant="danger-soft" size="sm" className="self-start" onPress={clearFacets}>
                                                    {t("publicProfile.challengesTab.manage.clearFilters")}
                                                </Button>
                                            )] : []),
                                        ]} />
                                    </Box>
                                </Popover.Content>
                            </Popover>
                        ),
                    ]} />
                ),
                () => (
                    <Typography type="body-sm" color="muted" className="shrink-0">
                        {t("publicProfile.challengesTab.manage.found", { count: filtered.length })}
                    </Typography>
                ),
            ]} />`,
            "toolbar + popover",
        ],
        [
            `                                <div className="flex flex-col gap-2">
                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                    <Skeleton.Typography type="body-xs" width="1/3" />
                                </div>`,
            `                                <StackV gap={2} principle="title-subtitle" items={[
                                    () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                    () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                ]} />`,
            "skeleton row",
        ],
        [
            `                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <Typography type="body-sm" weight="medium" truncate className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                            {challenge.title}
                                        </Typography>
                                        <div className="flex flex-wrap items-center gap-2 @app-sm:grid @app-sm:grid-cols-[6rem_5.5rem_1fr]">
                                            {level ? <DifficultyChip difficulty={level} /> : null}
                                            {challenge.selectedLang ? <LanguageChip language={challenge.selectedLang} /> : null}
                                            {passedAt ? (
                                                <Typography type="body-xs" color="muted">
                                                    {passedAt}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    </div>
                                    {typeof challenge.score === "number" ? (
                                        <Typography
                                            type="body-xs"
                                            weight="medium"
                                            className={cn("shrink-0", scoreToneClass(challenge.score))}
                                        >
                                            {t("publicProfile.challengesTab.score", { score: challenge.score })}
                                        </Typography>
                                    ) : null}
                                </div>`,
            `                                <StackH gap={4} principle="content-row" justify="between" align="center" items={[
                                    () => (
                                        <StackV gap={2} principle="title-subtitle" classNames={["min-w-0", "flex-1"]} items={[
                                            () => (
                                                <Typography type="body-sm" weight="medium" truncate className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">
                                                    {challenge.title}
                                                </Typography>
                                            ),
                                            () => (
                                                // teacher-hold: challenge-manage-meta-grid — wrap→fixed cols at sm; Cluster cannot own that.
                                                <div className="flex flex-wrap items-center gap-2 @app-sm:grid @app-sm:grid-cols-[6rem_5.5rem_1fr]">
                                                    {level ? <DifficultyChip difficulty={level} /> : null}
                                                    {challenge.selectedLang ? <LanguageChip language={challenge.selectedLang} /> : null}
                                                    {passedAt ? (
                                                        <Typography type="body-xs" color="muted">
                                                            {passedAt}
                                                        </Typography>
                                                    ) : null}
                                                </div>
                                            ),
                                        ]} />
                                    ),
                                    ...(typeof challenge.score === "number" ? [() => (
                                        <Typography
                                            type="body-xs"
                                            weight="medium"
                                            className={cn("shrink-0", scoreToneClass(challenge.score))}
                                        >
                                            {t("publicProfile.challengesTab.score", { score: challenge.score })}
                                        </Typography>
                                    )] : []),
                                ]} />`,
            "list row",
        ],
    ])
}

console.log("manage done")
