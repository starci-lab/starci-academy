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

// ── ProfileChallengeSubmissionPage ───────────────────────────────────────────
{
    const file = "src/components/pages/ProfileChallengeSubmissionPage/index.tsx"
    let src = fs.readFileSync(file, "utf8")
    if (!src.includes("frames/Stack")) {
        src = src.replace(
            "import type { WithClassNames } from \"@/modules/types/base/class-name\"",
            "import { Cluster } from \"@/components/frames/Cluster\"\nimport { StackH, StackV } from \"@/components/frames/Stack\"\nimport type { WithClassNames } from \"@/modules/types/base/class-name\"",
        )
        fs.writeFileSync(file, src)
    }

    patch(file, [
        [
            `                meta={detail ? (
                    <div className="flex flex-wrap items-center gap-3">
                        {level ? <DifficultyChip difficulty={level} /> : null}
                        {detail.selectedLang ? <LanguageChip language={detail.selectedLang} /> : null}
                        {typeof detail.score === "number" ? (
                            <Typography type="body-xs" weight="medium" className={scoreToneClass(detail.score)}>
                                {t("publicProfile.challengesTab.score", { score: detail.score })}
                            </Typography>
                        ) : null}
                        {passedAt ? (
                            <Typography type="body-xs" color="muted">
                                {passedAt}
                            </Typography>
                        ) : null}
                    </div>
                ) : undefined}`,
            `                meta={detail ? (
                    <Cluster gap={3} principle="chip-row" align="center" items={[
                        ...(level ? [() => <DifficultyChip difficulty={level} />] : []),
                        ...(detail.selectedLang ? [() => <LanguageChip language={detail.selectedLang} />] : []),
                        ...(typeof detail.score === "number" ? [() => (
                            <Typography type="body-xs" weight="medium" className={scoreToneClass(detail.score)}>
                                {t("publicProfile.challengesTab.score", { score: detail.score })}
                            </Typography>
                        )] : []),
                        ...(passedAt ? [() => (
                            <Typography type="body-xs" color="muted">
                                {passedAt}
                            </Typography>
                        )] : []),
                    ]} />
                ) : undefined}`,
            "meta chips",
        ],
        [
            `                skeleton={(
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-6 w-1/2" />
                        <SurfaceListCard>
                            {[0, 1, 2].map((row) => (
                                <SurfaceListCardItem key={row}>
                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </div>
                )}`,
            `                skeleton={(
                    <StackV gap={6} principle="block-boundary" items={[
                        () => <Skeleton className="h-6 w-1/2" />,
                        () => (
                            <SurfaceListCard>
                                {[0, 1, 2].map((row) => (
                                    <SurfaceListCardItem key={row}>
                                        <Skeleton.Typography type="body-sm" width="3/4" />
                                    </SurfaceListCardItem>
                                ))}
                            </SurfaceListCard>
                        ),
                    ]} />
                )}`,
            "skeleton",
        ],
        [
            `                {detail ? (
                    <div className="flex flex-col gap-6">
                        {/* repo/docs link — the URL itself is the link text (the
                            dev's "flex"), not a generic "view repo" label */}
                        <div className="flex flex-col gap-1">
                            <Typography type="body-xs" color="muted">
                                {t("publicProfile.challengesTab.detail.repoLabel")}
                            </Typography>
                            <Link
                                href={detail.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-fit min-w-0 max-w-full items-center gap-2 text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                aria-label={t("publicProfile.openRepo", { title: detail.title })}
                            >
                                <LinkIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                <Typography type="body-sm" truncate className="text-accent-soft-foreground">
                                    {detail.submissionUrl}
                                </Typography>
                            </Link>
                        </div>

                        <LabeledCard
                            label={t("publicProfile.challengesTab.detail.attemptsHeading")}
                            frameless
                        >
                            {attempts.length > 0 ? (
                                <SurfaceListCard>
                                    {attempts.map((attempt) => {
                                        const attemptProcessedAt = attempt.processedAt
                                            ? dayjs(attempt.processedAt).locale(locale).format("hh:mm MMMM DD, YYYY")
                                            : undefined
                                        return (
                                            <SurfaceListCardItem key={attempt.attemptNumber}>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <Typography type="body-sm" weight="medium">
                                                            {t("publicProfile.challengesTab.detail.attemptLabel", { number: attempt.attemptNumber })}
                                                        </Typography>
                                                        {typeof attempt.score === "number" ? (
                                                            <Typography
                                                                type="body-xs"
                                                                weight="medium"
                                                                className={cn("shrink-0", scoreToneClass(attempt.score))}
                                                            >
                                                                {t("publicProfile.challengesTab.score", { score: attempt.score })}
                                                            </Typography>
                                                        ) : null}
                                                    </div>
                                                    {attemptProcessedAt ? (
                                                        <Typography type="body-xs" color="muted">
                                                            {attemptProcessedAt}
                                                        </Typography>
                                                    ) : null}
                                                    <Link
                                                        href={attempt.submissionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex w-fit min-w-0 max-w-full items-center gap-2 text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                                        aria-label={t("publicProfile.openRepo", { title: detail.title })}
                                                    >
                                                        <LinkIcon aria-hidden focusable="false" className="size-4 shrink-0" />
                                                        <Typography type="body-xs" truncate className="text-accent-soft-foreground">
                                                            {attempt.submissionUrl}
                                                        </Typography>
                                                    </Link>
                                                    {attempt.shortFeedback ? (
                                                        <Typography type="body-xs" color="muted">
                                                            {attempt.shortFeedback}
                                                        </Typography>
                                                    ) : null}
                                                </div>
                                            </SurfaceListCardItem>
                                        )
                                    })}
                                </SurfaceListCard>
                            ) : (
                                <Typography type="body-sm" color="muted">
                                    {t("publicProfile.challengesTab.detail.noAttempts")}
                                </Typography>
                            )}
                        </LabeledCard>
                    </div>
                ) : null}`,
            `                {detail ? (
                    <StackV gap={6} principle="block-boundary" items={[
                        () => (
                            <StackV gap={1} principle="name-handle" items={[
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {t("publicProfile.challengesTab.detail.repoLabel")}
                                    </Typography>
                                ),
                                () => (
                                    <Link
                                        href={detail.submissionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-fit min-w-0 max-w-full text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                        aria-label={t("publicProfile.openRepo", { title: detail.title })}
                                    >
                                        <StackH gap={2} principle="icon-text" align="center" items={[
                                            () => <LinkIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
                                            () => (
                                                <Typography type="body-sm" truncate className="text-accent-soft-foreground">
                                                    {detail.submissionUrl}
                                                </Typography>
                                            ),
                                        ]} />
                                    </Link>
                                ),
                            ]} />
                        ),
                        () => (
                            <LabeledCard
                                label={t("publicProfile.challengesTab.detail.attemptsHeading")}
                                frameless
                            >
                                {attempts.length > 0 ? (
                                    <SurfaceListCard>
                                        {attempts.map((attempt) => {
                                            const attemptProcessedAt = attempt.processedAt
                                                ? dayjs(attempt.processedAt).locale(locale).format("hh:mm MMMM DD, YYYY")
                                                : undefined
                                            return (
                                                <SurfaceListCardItem key={attempt.attemptNumber}>
                                                    <StackV gap={3} principle="sibling-stack" items={[
                                                        () => (
                                                            <StackH gap={4} principle="content-row" justify="between" align="center" classNames={["flex-wrap"]} items={[
                                                                () => (
                                                                    <Typography type="body-sm" weight="medium">
                                                                        {t("publicProfile.challengesTab.detail.attemptLabel", { number: attempt.attemptNumber })}
                                                                    </Typography>
                                                                ),
                                                                ...(typeof attempt.score === "number" ? [() => (
                                                                    <Typography
                                                                        type="body-xs"
                                                                        weight="medium"
                                                                        className={cn("shrink-0", scoreToneClass(attempt.score))}
                                                                    >
                                                                        {t("publicProfile.challengesTab.score", { score: attempt.score })}
                                                                    </Typography>
                                                                )] : []),
                                                            ]} />
                                                        ),
                                                        ...(attemptProcessedAt ? [() => (
                                                            <Typography type="body-xs" color="muted">
                                                                {attemptProcessedAt}
                                                            </Typography>
                                                        )] : []),
                                                        () => (
                                                            <Link
                                                                href={attempt.submissionUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-fit min-w-0 max-w-full text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)]"
                                                                aria-label={t("publicProfile.openRepo", { title: detail.title })}
                                                            >
                                                                <StackH gap={2} principle="icon-text" align="center" items={[
                                                                    () => <LinkIcon aria-hidden focusable="false" className="size-4 shrink-0" />,
                                                                    () => (
                                                                        <Typography type="body-xs" truncate className="text-accent-soft-foreground">
                                                                            {attempt.submissionUrl}
                                                                        </Typography>
                                                                    ),
                                                                ]} />
                                                            </Link>
                                                        ),
                                                        ...(attempt.shortFeedback ? [() => (
                                                            <Typography type="body-xs" color="muted">
                                                                {attempt.shortFeedback}
                                                            </Typography>
                                                        )] : []),
                                                    ]} />
                                                </SurfaceListCardItem>
                                            )
                                        })}
                                    </SurfaceListCard>
                                ) : (
                                    <Typography type="body-sm" color="muted">
                                        {t("publicProfile.challengesTab.detail.noAttempts")}
                                    </Typography>
                                )}
                            </LabeledCard>
                        ),
                    ]} />
                ) : null}`,
            "detail body",
        ],
    ])
}

console.log("submission done")
