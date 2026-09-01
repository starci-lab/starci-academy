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

{
    const file = "src/components/pages/ProfileProjectRoadmapPage/index.tsx"
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
            `                meta={project ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {hasVerified ? (
                                <StatusChip
                                    tone="success"
                                    icon={<SealCheckIcon aria-hidden focusable="false" className="size-4" />}
                                >
                                    {t("pinnedProjects.verified")}
                                </StatusChip>
                            ) : null}
                            <Typography type="body-xs" color="muted">
                                {t("publicProfile.capstone.roadmapSummary", {
                                    completedMilestones: project.completedMilestones,
                                    totalMilestones: project.totalMilestones,
                                    completedTasks: project.completedTasks,
                                    totalTasks: project.totalTasks,
                                })}
                            </Typography>
                        </div>
                        <SegmentBar
                            hideLegend
                            max={totalTasks}
                            ariaLabel={\`\${project.courseTitle} · \${percent}%\`}
                            segments={[
                                {
                                    key: "verified",
                                    label: t("publicProfile.capstone.projectsHeading"),
                                    value: project.completedTasks,
                                    color: "var(--success)",
                                },
                            ]}
                        />
                    </div>
                ) : undefined}`,
            `                meta={project ? (
                    <StackV gap={3} principle="sibling-stack" items={[
                        () => (
                            <StackH gap={3} principle="chip-row" align="center" items={[
                                ...(hasVerified ? [() => (
                                    <StatusChip
                                        tone="success"
                                        icon={<SealCheckIcon aria-hidden focusable="false" className="size-4" />}
                                    >
                                        {t("pinnedProjects.verified")}
                                    </StatusChip>
                                )] : []),
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {t("publicProfile.capstone.roadmapSummary", {
                                            completedMilestones: project.completedMilestones,
                                            totalMilestones: project.totalMilestones,
                                            completedTasks: project.completedTasks,
                                            totalTasks: project.totalTasks,
                                        })}
                                    </Typography>
                                ),
                            ]} />
                        ),
                        () => (
                            <SegmentBar
                                hideLegend
                                max={totalTasks}
                                ariaLabel={\`\${project.courseTitle} · \${percent}%\`}
                                segments={[
                                    {
                                        key: "verified",
                                        label: t("publicProfile.capstone.projectsHeading"),
                                        value: project.completedTasks,
                                        color: "var(--success)",
                                    },
                                ]}
                            />
                        ),
                    ]} />
                ) : undefined}`,
            "meta",
        ],
        [
            `                        {[0, 1].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <div className="flex items-start gap-3">
                                    {/* rocket IconTile (sm = size-12 rounded-xl) */}
                                    <Skeleton className="size-12 shrink-0 rounded-xl" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                                        {/* milestone progress meter (label + bar) + summary line */}
                                        <Skeleton.Typography type="body-sm" width="1/3" />
                                        <Skeleton.ProgressBar />
                                        <Skeleton.Typography type="body-xs" width="2/3" />
                                        {/* per-task checklist (check/circle icon + title) */}
                                        <div className="flex flex-col gap-0">
                                            {[0, 1].map((task) => (
                                                <div key={task} className="flex items-center gap-3 py-2">
                                                    <Skeleton className="size-5 shrink-0 rounded-full" />
                                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SurfaceListCardItem>
                        ))}`,
            `                        {[0, 1].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <StackH gap={4} principle="content-row" align="start" items={[
                                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                                    () => (
                                        <StackV gap={4} principle="label-field" classNames={["min-w-0", "flex-1"]} items={[
                                            () => <Skeleton.Typography type="body-sm" width="1/3" />,
                                            () => <Skeleton.ProgressBar />,
                                            () => <Skeleton.Typography type="body-xs" width="2/3" />,
                                            () => (
                                                <StackV gap={1} principle="name-handle" items={
                                                    [0, 1].map((task) => () => (
                                                        // teacher-hold: roadmap-task-row-py2 — vertical-only py-2; no house pad token.
                                                        <div key={task} className="py-2">
                                                            <StackH gap={4} principle="content-row" align="center" items={[
                                                                () => <Skeleton className="size-5 shrink-0 rounded-full" />,
                                                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                            ]} />
                                                        </div>
                                                    ))
                                                } />
                                            ),
                                        ]} />
                                    ),
                                ]} />
                            </SurfaceListCardItem>
                        ))}`,
            "skeleton",
        ],
        [
            `                            <div className="flex items-start gap-3">
                                <IconTile
                                    size="sm"
                                    icon={<RocketIcon aria-hidden focusable="false" />}
                                />
                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <ProgressMeter
                                        label={milestone.title}
                                        value={milestone.passedTasks}
                                        max={Math.max(milestone.totalTasks, 1)}
                                        showValue
                                    />
                                    <Typography type="body-xs" color="muted">
                                        {t("publicProfile.capstone.roadmapMilestoneProgress", {
                                            completed: milestone.passedTasks,
                                            total: milestone.totalTasks,
                                        })}
                                    </Typography>
                                    <div className="flex flex-col gap-0">
                                        {milestone.tasks.map((task, taskIndex) => (
                                            <div
                                                key={task.taskGlobalId ?? \`\${task.title}-\${taskIndex}\`}
                                                className={cn(
                                                    "flex items-center gap-3 py-2",
                                                    taskIndex < milestone.tasks.length - 1 && "border-b border-default",
                                                )}
                                            >
                                                {task.passed ? (
                                                    <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" />
                                                ) : (
                                                    <CircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted-foreground" />
                                                )}
                                                <Typography
                                                    type="body-sm"
                                                    className={cn("min-w-0 flex-1 truncate", task.passed && "text-success-soft-foreground")}
                                                >
                                                    {task.title}
                                                </Typography>
                                                {task.passed ? (
                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <Typography
                                                            type="body-xs"
                                                            weight="medium"
                                                            className={scoreToneClass(task.score)}
                                                        >
                                                            {t("publicProfile.capstone.score", { score: task.score })}
                                                        </Typography>
                                                        {task.passedAt ? (
                                                            <Typography type="body-xs" color="muted">
                                                                {\` · \${new Date(task.passedAt).toLocaleDateString(locale)}\`}
                                                            </Typography>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>`,
            `                            <StackH gap={4} principle="content-row" align="start" items={[
                                () => (
                                    <IconTile
                                        size="sm"
                                        icon={<RocketIcon aria-hidden focusable="false" />}
                                    />
                                ),
                                () => (
                                    <StackV gap={4} principle="label-field" classNames={["min-w-0", "flex-1"]} items={[
                                        () => (
                                            <ProgressMeter
                                                label={milestone.title}
                                                value={milestone.passedTasks}
                                                max={Math.max(milestone.totalTasks, 1)}
                                                showValue
                                            />
                                        ),
                                        () => (
                                            <Typography type="body-xs" color="muted">
                                                {t("publicProfile.capstone.roadmapMilestoneProgress", {
                                                    completed: milestone.passedTasks,
                                                    total: milestone.totalTasks,
                                                })}
                                            </Typography>
                                        ),
                                        () => (
                                            <StackV gap={1} principle="name-handle" items={
                                                milestone.tasks.map((task, taskIndex) => () => (
                                                    // teacher-hold: roadmap-task-row-py2 — vertical-only py-2 + optional border; no house pad token.
                                                    <div
                                                        key={task.taskGlobalId ?? \`\${task.title}-\${taskIndex}\`}
                                                        className={cn(
                                                            "py-2",
                                                            taskIndex < milestone.tasks.length - 1 && "border-b border-default",
                                                        )}
                                                    >
                                                        <StackH
                                                            gap={4}
                                                            principle="content-row"
                                                            align="center"
                                                            items={[
                                                                () => (
                                                                    task.passed ? (
                                                                        <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" />
                                                                    ) : (
                                                                        <CircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted-foreground" />
                                                                    )
                                                                ),
                                                                () => (
                                                                    <Typography
                                                                        type="body-sm"
                                                                        className={cn("min-w-0 flex-1 truncate", task.passed && "text-success-soft-foreground")}
                                                                    >
                                                                        {task.title}
                                                                    </Typography>
                                                                ),
                                                                ...(task.passed ? [() => (
                                                                    <StackH gap={2} principle="separator-dot" classNames={["shrink-0"]} items={[
                                                                        () => (
                                                                            <Typography
                                                                                type="body-xs"
                                                                                weight="medium"
                                                                                className={scoreToneClass(task.score)}
                                                                            >
                                                                                {t("publicProfile.capstone.score", { score: task.score })}
                                                                            </Typography>
                                                                        ),
                                                                        ...(task.passedAt ? [() => (
                                                                            <Typography type="body-xs" color="muted">
                                                                                {\` · \${new Date(task.passedAt).toLocaleDateString(locale)}\`}
                                                                            </Typography>
                                                                        )] : []),
                                                                    ]} />
                                                                )] : []),
                                                            ]}
                                                        />
                                                    </div>
                                                ))
                                            } />
                                        ),
                                    ]} />
                                ),
                            ]} />`,
            "milestone rows",
        ],
    ])
}

console.log("roadmap done")
