"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button, ListBox, Typography, cn } from "@heroui/react"
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
} from "framer-motion"
import { useTranslations } from "next-intl"
import {
    ArrowRightIcon,
    ArrowUpIcon,
    BookOpenIcon,
    CheckCircleIcon,
    PlayCircleIcon,
    RobotIcon,
    RocketLaunchIcon,
    TrophyIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import { GithubIcon } from "@/components/svg/GithubIcon"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LANDING_LOOP_STEPS } from "@/modules/utils/landing-constants"
import { SectionHeading } from "@/components/blocks/marketing/SectionHeading"
import { ShowcaseMockup, SHOWCASE_THEMES } from "@/components/blocks/marketing/ShowcaseMockup"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link LearnLoopScroll}. */
export type LearnLoopScrollProps = WithClassNames<undefined>

/** Icon for each step of the learning loop (keys match `landing.learnLoop.items.{key}`). */
const STEP_ICONS: Record<string, React.ReactNode> = {
    read: <BookOpenIcon aria-hidden focusable="false" />,
    grade: <RobotIcon aria-hidden focusable="false" />,
    capstone: <RocketLaunchIcon aria-hidden focusable="false" />,
    rank: <TrophyIcon aria-hidden focusable="false" />,
}

/** Address bar for each panel (reads like a real screen of the product). */
const STEP_URL: Record<string, string> = {
    read: "starci.academy/learn/dead-letter-queue",
    grade: "starci.academy/submit",
    capstone: "starci.academy/capstone/the-shop",
    rank: "starci.academy/leaderboard",
}

/**
 * Sample lesson illustrating the "Read" step — the SAME lesson (Dead Letter Queue) written in 4 languages.
 * Each tab swaps the filename + code; click to switch. The code is deliberately more than 1 line deep, for realism.
 */
const READ_LESSON = [
    {
        label: "TS",
        file: "order-consumer.ts",
        code: `// retry; past the threshold → DLQ
async function onMessage(msg: Message) {
  try { await handle(msg); await msg.ack() }
  catch {
    if (msg.attempts >= MAX) await dlq.send(msg.body)
    else await msg.nack()
  }
}`,
    },
    {
        label: "Java",
        file: "OrderConsumer.java",
        code: `// retry; past the threshold → DLQ
void onMessage(Message msg) {
  try { handle(msg); msg.ack(); }
  catch (Exception e) {
    if (msg.attempts() >= MAX) dlq.send(msg.body());
    else msg.nack();
  }
}`,
    },
    {
        label: "C#",
        file: "OrderConsumer.cs",
        code: `// retry; past the threshold → DLQ
async Task OnMessage(Message msg) {
  try { await Handle(msg); await msg.AckAsync(); }
  catch (Exception e) {
    if (msg.Attempts >= Max) await dlq.SendAsync(msg.Body);
    else await msg.NackAsync();
  }
}`,
    },
    {
        label: "Go",
        file: "consumer.go",
        code: `func onMessage(msg Message) {
  err := handle(msg)
  if err == nil { msg.Ack(); return }
  if msg.Attempts >= Max { dlq.Send(msg.Body) } else { msg.Nack() }
}`,
    },
] as const

/** Token for code tinting (comment · string · keyword) — enough for the demo, not a full lexer. */
const CODE_TOKEN = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|\b(const|let|var|async|await|function|func|return|if|else|for|class|public|private|static|void|new|using|namespace|package|import|from|type|struct|interface|defer|throw|catch|try|final|int|Task|Exception|nil|err)\b/g

/** Colors one line of code: comment → muted · string → warning · keyword → accent. */
const tintLine = (line: string): React.ReactNode => {
    if (line === "") {
        return " "
    }
    const out: React.ReactNode[] = []
    let last = 0
    let key = 0
    let match: RegExpExecArray | null
    CODE_TOKEN.lastIndex = 0
    while ((match = CODE_TOKEN.exec(line)) !== null) {
        if (match.index > last) {
            out.push(line.slice(last, match.index))
        }
        const token = match[0]
        const cls = match[1] ? "text-muted" : match[2] ? "text-warning-soft-foreground" : "text-accent-soft-foreground"
        out.push(<span key={key++} className={cls}>{token}</span>)
        last = match.index + token.length
    }
    if (last < line.length) {
        out.push(line.slice(last))
    }
    return out
}

/** Code block with line numbers + tint (mono). */
const CodeBlock = ({ code }: { code: string }) => {
    const lines = code.split("\n")
    return (
        <div className="flex font-mono text-xs leading-relaxed">
            <div aria-hidden data-principle="sibling-stack" className="flex flex-col items-end gap-2 border-r border-default/70 px-3 py-4 text-muted/60 select-none">
                {lines.map((_, index) => <span key={index}>{index + 1}</span>)}
            </div>
            <div data-principle="sibling-stack" className="flex flex-col gap-2 overflow-x-auto px-4 py-4">
                {lines.map((line, index) => <span key={index} className="whitespace-pre">{tintLine(line)}</span>)}
            </div>
        </div>
    )
}

/** Sample leaderboard (marketing, not real data). */
const RANK_ROWS = [
    { rank: 1, name: "minh.dev", xp: 4280 },
    { rank: 2, name: "huyen.codes", xp: 2715 },
    { rank: 3, name: "thanh.io", xp: 1940 },
] as const

/**
 * The right-column visual changes per step — flat, built from tokens (no real images), each panel
 * anchored by the step's icon. Four panels: Read (4-language tabs + code tint) · AI Grading (score
 * ring + pass/warn criteria) · Capstone (mini architecture diagram) · Leaderboard (medal +
 * avatar + XP bar + a "You" row). Elements inside each panel enter with a light stagger.
 */
const StepVisual = ({ stepKey }: { stepKey: string }) => {
    const t = useTranslations()
    const reduce = useReducedMotion()
    // the currently selected language in the "Read" step (clickable tab; resets when the panel re-mounts)
    const [readLang, setReadLang] = useState(0)

    const childVariants = reduce
        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
        : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.05 } },
    }

    // The right panel = a LabeledCard block (label OUTSIDE: step icon + title · tag on the right). Body
    // = the step's visual + one line of description (each card "says" a bit more, not a bare visual). Light stagger.
    const shell = (children: React.ReactNode, align: "center" | "start" = "center") => (
        <ShowcaseMockup
            url={STEP_URL[stepKey]}
            aspect="video"
            tilt="left"
            backdrop="glow"
            theme={SHOWCASE_THEMES.starci}
            contentClassName={cn("flex flex-col p-4", align === "start" ? "justify-start" : "justify-center")}
        >
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3" data-principle="content-row"
            >
                {children}
            </motion.div>
        </ShowcaseMockup>
    )

    if (stepKey === "read") {
        return shell(
            <>
                <motion.div variants={childVariants} data-principle="group-boundary" className="flex flex-wrap gap-4 border-b border-default text-xs">
                    {READ_LESSON.map((item, index) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => setReadLang(index)}
                            aria-pressed={index === readLang}
                            className={cn(
                                "-mb-px cursor-pointer border-b-2 pb-2 transition-colors",
                                index === readLang
                                    ? "border-accent font-medium text-accent-soft-foreground"
                                    : "border-transparent text-muted hover:text-foreground",
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </motion.div>
                <motion.div variants={childVariants} className="overflow-hidden rounded-xl border border-default bg-default">
                    <Box principle="control-pad" className="border-b border-default/70">
                        <span className="font-mono text-xs text-muted">{READ_LESSON[readLang].file}</span>
                    </Box>
                    <CodeBlock code={READ_LESSON[readLang].code} />
                </motion.div>
            </>,
            "start",
        )
    }

    if (stepKey === "grade") {
        const criteria = [
            { ok: true, text: "Idempotency key handled correctly.", pts: "+30" },
            { ok: true, text: "Sensible retry + backoff.", pts: "+25" },
            { ok: false, text: "Missing rate-limit at the gateway.", pts: "−8" },
        ]
        return shell(
            <>
                {/* verdict = HeroUI Alert style (matches SubmissionResult): success tint + icon + score */}
                <motion.div variants={childVariants} data-principle="content-row" className="flex items-center gap-3 rounded-xl bg-success-soft px-3 py-2">
                    <CheckCircleIcon aria-hidden focusable="false" className="size-7 shrink-0 text-success-soft-foreground" />
                    <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-success-soft-foreground">{t("submissionResult.passed")} · 92/100</span>
                        <span className="text-xs text-success-soft-foreground/80">need ≥ 70 to pass</span>
                    </div>
                    <span data-principle="control-pad" className="shrink-0 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success-soft-foreground">+120 XP</span>
                </motion.div>
                <motion.div variants={childVariants} data-principle="sibling-stack" className="flex flex-col gap-2">
                    {criteria.map((item) => (
                        <span key={item.text} data-principle="icon-text" className="flex items-center gap-2 text-sm text-muted">
                            {item.ok ? (
                                <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success-soft-foreground" />
                            ) : (
                                <WarningCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-warning-soft-foreground" />
                            )}
                            <span className="flex-1">{item.text}</span>
                            <span className={cn("shrink-0 font-medium", item.ok ? "text-success-soft-foreground" : "text-warning-soft-foreground")}>{item.pts}</span>
                        </span>
                    ))}
                </motion.div>
            </>,
        )
    }

    if (stepKey === "capstone") {
        const milestones = [
            { label: "Scaffold & CI", state: "done" },
            { label: "Auth + API Gateway", state: "done" },
            { label: "Split services · DB-per-service", state: "active" },
        ] as const
        return shell(
            <>
                <motion.div variants={childVariants} className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">the-shop</span>
                    <span className="flex items-center gap-2 text-xs text-muted" data-principle="icon-text">
                        <GithubIcon className="size-3.5" />
                        main
                    </span>
                </motion.div>
                <motion.div variants={childVariants} data-principle="sibling-stack" className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-muted">
                        <span>Progress</span>
                        <span>8/20 milestones · 40%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-default">
                        <div className="h-full rounded-full bg-accent" style={{ width: "40%" }} />
                    </div>
                </motion.div>
                <motion.div variants={childVariants} data-principle="sibling-stack" className="flex flex-col gap-2">
                    {milestones.map((item) => (
                        <span key={item.label} data-principle="icon-text" className="flex items-center gap-2 text-sm">
                            {item.state === "done" ? (
                                <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success-soft-foreground" />
                            ) : (
                                <PlayCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-accent-soft-foreground" />
                            )}
                            <span className={cn("flex-1", item.state === "active" ? "font-medium text-foreground" : "text-muted")}>
                                {item.label}
                            </span>
                        </span>
                    ))}
                </motion.div>
            </>,
        )
    }

    // rank
    const maxXp = RANK_ROWS[0].xp
    return shell(
        <motion.div variants={childVariants} data-principle="sibling-stack" className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">This week</span>
                <span className="text-xs text-muted">XP earned</span>
            </div>
            {RANK_ROWS.map((row) => (
                <StackV key={row.rank} gap={2} principle="icon-text" items={[
                    () => (
                        <StackH gap={3} principle="sibling-stack" items={[
                            () => (
                                <span className={cn("w-5 text-center text-sm font-semibold", row.rank === 1 ? "text-accent-soft-foreground" : "text-muted")}>
                                    {row.rank}
                                </span>
                            ),
                            () => <UserAvatar className="size-7" username={row.name} seed={row.name} />,
                            () => <span className="flex-1 truncate text-sm">{row.name}</span>,
                            () => (
                                <span className={cn("text-sm", row.rank === 1 ? "font-semibold text-accent-soft-foreground" : "text-muted")}>
                                    {row.xp.toLocaleString("en-US")}
                                </span>
                            ),
                        ]} />
                    ),
                    () => (
                        <div className="ml-7 h-1.5 overflow-hidden rounded-full bg-default">
                            <div
                                className={cn("h-full rounded-full", row.rank === 1 ? "bg-accent" : "bg-accent/40")}
                                style={{ width: `${(row.xp / maxXp) * 100}%` }}
                            />
                        </div>
                    ),
                ]} />
            ))}
            <div data-principle="identity" className="mt-1 flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2">
                <span className="w-5 text-center text-sm font-semibold text-accent-soft-foreground">12</span>
                <UserAvatar className="size-7" username="You" seed="ban-viewer" />
                <span className="flex-1 truncate text-sm text-accent-soft-foreground">You</span>
                <span data-principle="icon-text" className="flex items-center gap-1 text-xs text-success-soft-foreground">
                    <ArrowUpIcon aria-hidden focusable="false" className="size-3" />3
                </span>
            </div>
        </motion.div>,
    )
}

/** Step card for the static layout (mobile / reduced-motion fallback). */
/**
 * The 4-step list (ListBox) shared by both variants. `active` = the step currently selected;
 * clicking a step → `onSelect(index)` (pinned: scrolls to that step · static: sets active
 * directly). done (index < active) shows a green check; active = accent.
 */
const LoopStepList = ({ active, onSelect }: { active: number; onSelect: (index: number) => void }) => {
    const t = useTranslations()
    const activeKey = LANDING_LOOP_STEPS[active]
    return (
        <ListBox
            aria-label={t("landing.learnLoop.title")}
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[activeKey]}
            onSelectionChange={(keys) => {
                const key = [...keys][0]
                const index = LANDING_LOOP_STEPS.findIndex((step) => step === key)
                if (index >= 0) {
                    onSelect(index)
                }
            }}
            className="gap-1 p-0" data-principle="title-subtitle"
        >
            {LANDING_LOOP_STEPS.map((key, index) => {
                const selected = key === activeKey
                const done = index < active
                const stepColor = cn(
                    "transition-colors group-data-[hovered=true]:text-accent-soft-foreground",
                    done ? "text-success-soft-foreground" : selected ? "text-accent-soft-foreground" : "text-muted",
                )
                return (
                    <ListBox.Item
                        key={key}
                        id={key}
                        textValue={t(`landing.learnLoop.items.${key}.title`)}
                        className={cn(
                            "group cursor-pointer rounded-xl px-4 py-2 transition-colors data-[hovered=true]:bg-accent-soft",
                            selected && "bg-accent-soft",
                        )}
                    >
                        <StackH gap={4} principle="content-row" items={[
                            () => (
                                <span className={cn("[&>svg]:size-5", stepColor)}>
                                    {done ? (
                                        <CheckCircleIcon aria-hidden focusable="false" className="size-5" />
                                    ) : (
                                        STEP_ICONS[key]
                                    )}
                                </span>
                            ),
                            () => (
                                <Typography type="body" className={stepColor}>
                                    {t(`landing.learnLoop.items.${key}.title`)}
                                </Typography>
                            ),
                        ]} />
                    </ListBox.Item>
                )
            })}
        </ListBox>
    )
}

/** The visual panel that changes per step (crossfade) — shared by both variants. */
const LoopPanel = ({ activeKey }: { activeKey: string }) => (
    <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
            >
                <StepVisual stepKey={activeKey} />
            </motion.div>
        </AnimatePresence>
    </div>
)

/** Heading shared by both variants (static + pinned). */
const LoopHeading = () => {
    const t = useTranslations()
    // CTA "jump in and try it" — scrolls down to the Tracks block (#courses) to pick a track + try a lesson.
    const onJumpIn = () => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })
    return (
        <StackV align="center" gap={6} principle="block-boundary" items={[
            () => (
                <SectionHeading
                    eyebrow={t("landing.learnLoop.eyebrow")}
                    title={t("landing.learnLoop.title")}
                    intro={t("landing.learnLoop.intro")}
                />
            ),
            () => (
                <Button variant="primary" size="lg" onPress={onJumpIn}>
                    {t("landing.learnLoop.cta")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                </Button>
            ),
        ]} />
    )
}

/**
 * CLICK-DRIVEN layout (mobile / reduced-motion / before mount) — a clickable list + a panel
 * that changes per step, NO scroll-hijack. Same list+panel as pinned, the only difference: clicking
 * a step sets active directly (no scrolling). Mobile: list on top · panel below (1 column).
 */
const LearnLoopStatic = ({ className }: LearnLoopScrollProps) => {
    const [active, setActive] = useState(0)
    return (
        <section className={cn("flex flex-col gap-16", className)}>
            <LoopHeading />
            <div className="grid grid-cols-1 items-center gap-x-12 gap-y-12 @app-lg:grid-cols-2 @app-lg:gap-y-20">
                <div>
                    <LoopStepList active={active} onSelect={setActive} />
                </div>
                <LoopPanel activeKey={LANDING_LOOP_STEPS[active]} />
            </div>
        </section>
    )
}

/**
 * PINNED variant (desktop) — split out so `useScroll`'s target ref is ALWAYS attached to
 * the rendered `<section>` (avoiding "Target ref defined but not hydrated" when the
 * fallback branch attaches no ref). Pins the block centered on screen; scrolling → active
 * step 01→04 + the right visual changes + a progress bar; scrolling past → `sticky` releases.
 * Clicking a step in the ListBox → scrolls to that step.
 */
const LearnLoopPinned = ({ className }: LearnLoopScrollProps) => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    })
    useMotionValueEvent(scrollYProgress, "change", (value) => {
        const last = LANDING_LOOP_STEPS.length - 1
        const index = Math.min(last, Math.max(0, Math.round(value * last)))
        setActive(index)
    })

    /** Scrolls the window to the position matching step `index` (when the ListBox is clicked). */
    const jumpToStep = (index: number) => {
        const element = sectionRef.current
        if (!element) {
            return
        }
        const last = LANDING_LOOP_STEPS.length - 1
        const fraction = last > 0 ? index / last : 0
        const start = element.getBoundingClientRect().top + window.scrollY
        const distance = element.offsetHeight - window.innerHeight
        window.scrollTo({ top: start + fraction * distance, behavior: "smooth" })
    }

    const activeKey = LANDING_LOOP_STEPS[active]

    return (
        <section ref={sectionRef} className={cn("relative h-[360vh]", className)}>
            <div className="sticky top-0 flex h-screen flex-col justify-center gap-16 py-12">
                <LoopHeading />
                <div className="grid grid-cols-1 items-center gap-x-12 gap-y-12 @app-lg:grid-cols-2 @app-lg:gap-y-20">
                    {/* LEFT — the 4-step list (scroll drives active; click → scrolls to it). RIGHT — the visual that changes. */}
                    <div>
                        <LoopStepList active={active} onSelect={jumpToStep} />
                    </div>
                    <LoopPanel activeKey={activeKey} />
                </div>
            </div>
        </section>
    )
}

/**
 * "How you learn" section (the 4-step learning loop). Desktop (after mount, no reduced-motion) →
 * {@link LearnLoopPinned} (scroll-pinned, like ika.xyz). Mobile / reduced-motion /
 * before mount → {@link LearnLoopStatic} (4 static cards, no scroll-hijack + a11y).
 * Split into 2 variants so `useScroll` (inside Pinned) only runs once the `<section ref>` actually
 * renders — avoiding the "Target ref defined but not hydrated" error.
 *
 * @param props - optional className (placement only).
 */
export const LearnLoopScroll = ({ className }: LearnLoopScrollProps) => {
    const reduce = useReducedMotion()
    const { isDesktop } = useSmViewpoint()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted || !isDesktop || reduce) {
        return <LearnLoopStatic className={className} />
    }
    return <LearnLoopPinned className={className} />
}
