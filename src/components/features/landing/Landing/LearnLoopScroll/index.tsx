"use client"

import React, { useEffect, useRef, useState } from "react"
import { ListBox, Typography, cn } from "@heroui/react"
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion"
import { useTranslations } from "next-intl"
import {
    ArrowUpIcon,
    BookOpenIcon,
    CaretRightIcon,
    CheckCircleIcon,
    LightbulbIcon,
    RobotIcon,
    RocketLaunchIcon,
    TrophyIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import { LabeledCard, SectionHeading } from "@/components/blocks"
import { UserAvatar } from "@/components/reuseable/UserAvatar"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LANDING_LOOP_STEPS } from "../constants"

/** Props for {@link LearnLoopScroll}. */
export type LearnLoopScrollProps = WithClassNames<undefined>

/** Icon cho từng bước của vòng học (keys khớp `landing.learnLoop.items.{key}`). */
const STEP_ICONS: Record<string, React.ReactNode> = {
    read: <BookOpenIcon aria-hidden focusable="false" />,
    grade: <RobotIcon aria-hidden focusable="false" />,
    capstone: <RocketLaunchIcon aria-hidden focusable="false" />,
    rank: <TrophyIcon aria-hidden focusable="false" />,
}

/** Tab ngôn ngữ trong visual bước "Đọc" (TS active). */
const READ_TABS = ["TS", "Java", "C#", "Go"] as const

/** Node nhỏ trong mini sơ đồ kiến trúc (Capstone). */
const DiagramBox = ({
    label,
    tone,
}: {
    label: string
    tone?: "accent" | "data"
}) => (
    <span
        className={cn(
            "rounded-lg border px-2.5 py-1.5 text-center font-mono text-xs",
            tone === "accent"
                ? "border-accent/70 bg-accent/10 font-medium text-accent"
                : tone === "data"
                    ? "border-success/40 bg-success/5 text-success"
                    : "border-default bg-default text-muted",
        )}
    >
        {label}
    </span>
)

/** Đường nối dọc giữa 2 tầng trong mini sơ đồ. */
const DiagramConn = () => <span aria-hidden className="h-3 w-px bg-default" />

/**
 * Vòng điểm SVG — đếm số chạy lên `value` + cung tròn quét theo, khi panel "Chấm AI"
 * xuất hiện. Tôn trọng reduced-motion (hiện thẳng số/cung cuối).
 */
const ScoreRing = ({ value }: { value: number }) => {
    const reduce = useReducedMotion()
    const radius = 26
    const circ = 2 * Math.PI * radius
    const count = useMotionValue(reduce ? value : 0)
    const display = useTransform(count, (v) => Math.round(v))

    useEffect(() => {
        if (reduce) {
            return
        }
        const controls = animate(count, value, { duration: 0.9, ease: "easeOut" })
        return () => controls.stop()
    }, [count, value, reduce])

    return (
        <div className="relative size-16 shrink-0">
            <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden focusable="false">
                <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" style={{ stroke: "var(--default)" }} />
                <motion.circle
                    cx="32"
                    cy="32"
                    r={radius}
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    style={{ stroke: "var(--success)" }}
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ * (1 - value / 100) }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.span className="text-lg font-semibold text-success">{display}</motion.span>
            </div>
        </div>
    )
}

/** Bảng xếp hạng minh hoạ (marketing, không phải data thật). */
const RANK_ROWS = [
    { rank: 1, name: "minh.dev", xp: 4280 },
    { rank: 2, name: "huyen.codes", xp: 2715 },
    { rank: 3, name: "thanh.io", xp: 1940 },
] as const

/**
 * Visual cột phải đổi theo bước — flat, dựng bằng token (không ảnh thật), mỗi panel
 * neo bằng icon của bước. Bốn panel: Đọc (tab 4 ngôn ngữ + code tint) · Chấm AI (score
 * ring + tiêu chí pass/warn) · Capstone (mini sơ đồ kiến trúc) · Bảng xếp hạng (medal +
 * avatar + thanh XP + dòng "Bạn"). Phần tử trong panel vào sân theo stagger nhẹ.
 */
const StepVisual = ({ stepKey }: { stepKey: string }) => {
    const t = useTranslations()
    const reduce = useReducedMotion()

    const childVariants = reduce
        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
        : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.05 } },
    }

    // Panel phải = block LabeledCard (label NGOÀI: icon bước + title · tag bên phải). Body
    // = visual của bước + 1 dòng mô tả (mỗi card "nói" thêm, không trơ visual). Stagger nhẹ.
    const shell = (children: React.ReactNode) => (
        <LabeledCard
            label={t(`landing.learnLoop.items.${stepKey}.title`)}
            icon={<span className="text-accent [&>svg]:size-5">{STEP_ICONS[stepKey]}</span>}
            labelEnd={t(`landing.learnLoop.items.${stepKey}.tag`)}
        >
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-4"
            >
                {children}
                <motion.div variants={childVariants}>
                    <Typography type="body-sm" color="muted">
                        {t(`landing.learnLoop.items.${stepKey}.desc`)}
                    </Typography>
                </motion.div>
            </motion.div>
        </LabeledCard>
    )

    if (stepKey === "read") {
        return shell(
            <>
                <motion.div variants={childVariants} className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">Idempotency trong thanh toán</span>
                        <span className="rounded-full bg-default px-2 py-0.5 text-xs text-muted">12 phút</span>
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Trung cấp</span>
                    </div>
                    <Typography type="body-sm" color="muted">
                        Mỗi lần gọi thanh toán phải an toàn khi lặp lại — cùng một key chỉ tính tiền đúng một lần.
                    </Typography>
                </motion.div>
                <motion.div variants={childVariants} className="flex flex-wrap gap-1.5">
                    {READ_TABS.map((lang, index) => (
                        <span
                            key={lang}
                            className={cn(
                                "rounded-lg px-2.5 py-1 text-xs",
                                index === 0 ? "bg-accent/10 font-medium text-accent" : "text-muted",
                            )}
                        >
                            {lang}
                        </span>
                    ))}
                </motion.div>
                <motion.div variants={childVariants} className="overflow-hidden rounded-xl border border-default bg-default">
                    <div className="flex items-center gap-1.5 border-b border-default/70 px-3 py-2">
                        <span aria-hidden className="size-2.5 rounded-full bg-danger/60" />
                        <span aria-hidden className="size-2.5 rounded-full bg-warning/60" />
                        <span aria-hidden className="size-2.5 rounded-full bg-success/60" />
                        <span className="ml-2 font-mono text-xs text-muted">order-service.ts</span>
                    </div>
                    <div className="flex font-mono text-xs leading-relaxed">
                        <div aria-hidden className="flex flex-col items-end gap-1.5 border-r border-default/70 px-3 py-4 text-muted/60 select-none">
                            <span>1</span><span>2</span><span>3</span><span>4</span>
                        </div>
                        <div className="flex flex-col gap-1.5 px-4 py-4">
                            <span>
                                <span className="text-accent">const</span> app = <span className="text-success">express</span>()
                            </span>
                            <span>
                                app.<span className="text-success">get</span>(<span className="text-warning">{"\"/health\""}</span>, handler)
                            </span>
                            <span>
                                app.<span className="text-success">listen</span>(<span className="text-warning">3000</span>)
                            </span>
                            <span className="text-muted">{"// cùng một bài — viết bằng 4 ngôn ngữ"}</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={childVariants} className="flex items-start gap-2 rounded-xl bg-accent/5 px-3 py-2.5 text-sm text-muted">
                    <LightbulbIcon aria-hidden focusable="false" className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>Mẹo: khoá theo <span className="font-mono text-xs">idempotency-key</span> để chặn double-charge khi client retry.</span>
                </motion.div>
            </>,
        )
    }

    if (stepKey === "grade") {
        const criteria = [
            { ok: true, text: "Idempotency key xử lý đúng.", pts: "+30" },
            { ok: true, text: "Retry + backoff hợp lý.", pts: "+25" },
            { ok: true, text: "Validate payload đầy đủ.", pts: "+20" },
            { ok: false, text: "Thiếu rate-limit ở gateway.", pts: "−8" },
        ]
        return shell(
            <>
                <motion.div variants={childVariants} className="flex items-center gap-4">
                    <ScoreRing value={92} />
                    <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-sm font-semibold text-success">{t("submissionResult.passed")} · 92/100</span>
                        <span className="text-xs text-muted">Xây <span className="font-mono">/payments</span> idempotent</span>
                    </div>
                    <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                        +120 XP
                    </span>
                </motion.div>
                <motion.div variants={childVariants} className="flex flex-col gap-1.5">
                    {criteria.map((item) => (
                        <span key={item.text} className="flex items-center gap-2 text-sm text-muted">
                            {item.ok ? (
                                <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success" />
                            ) : (
                                <WarningCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-warning" />
                            )}
                            <span className="flex-1">{item.text}</span>
                            <span className={cn("shrink-0 font-medium", item.ok ? "text-success" : "text-warning")}>{item.pts}</span>
                        </span>
                    ))}
                </motion.div>
                <motion.div variants={childVariants} className="rounded-xl bg-default px-3 py-2.5 text-sm italic text-muted">
                    “Xử lý khoá tốt — nên thêm giới hạn tần suất ở gateway để chống lạm dụng.”
                </motion.div>
            </>,
        )
    }

    if (stepKey === "capstone") {
        return shell(
            <>
                <motion.div variants={childVariants} className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">the-shop</span>
                    <span className="flex items-center gap-1.5 text-xs text-success">
                        <span aria-hidden className="size-2 rounded-full bg-success" />
                        live · 99.9% uptime
                    </span>
                </motion.div>
                <motion.div variants={childVariants} className="flex flex-col items-center gap-1.5">
                    <DiagramBox label="Client" />
                    <DiagramConn />
                    <DiagramBox label="API Gateway" tone="accent" />
                    <DiagramConn />
                    <div className="flex w-full justify-center gap-1.5">
                        {["Auth", "Orders", "Payment"].map((node) => (
                            <DiagramBox key={node} label={node} />
                        ))}
                    </div>
                    <DiagramConn />
                    <div className="flex w-full justify-center gap-1.5">
                        {["Postgres", "Redis", "Kafka"].map((node) => (
                            <DiagramBox key={node} label={node} tone="data" />
                        ))}
                    </div>
                </motion.div>
                <motion.div variants={childVariants} className="flex flex-wrap gap-1.5">
                    {["TypeScript", "Docker", "Postgres", "Redis", "Kafka"].map((tag) => (
                        <span key={tag} className="rounded-full bg-default px-2.5 py-1 text-xs text-muted">
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </>,
        )
    }

    // rank
    const maxXp = RANK_ROWS[0].xp
    return shell(
        <motion.div variants={childVariants} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Tuần này</span>
                <span className="text-xs text-muted">XP tích luỹ</span>
            </div>
            {RANK_ROWS.map((row) => (
                <div key={row.rank} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={cn("w-5 text-center text-sm font-semibold", row.rank === 1 ? "text-accent" : "text-muted")}>
                            {row.rank}
                        </span>
                        <UserAvatar className="size-7" username={row.name} seed={row.name} />
                        <span className="flex-1 truncate text-sm">{row.name}</span>
                        <span className={cn("text-sm", row.rank === 1 ? "font-semibold text-accent" : "text-muted")}>
                            {row.xp.toLocaleString("vi-VN")}
                        </span>
                    </div>
                    <div className="ml-7 h-1.5 overflow-hidden rounded-full bg-default">
                        <div
                            className={cn("h-full rounded-full", row.rank === 1 ? "bg-accent" : "bg-accent/40")}
                            style={{ width: `${(row.xp / maxXp) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
            <div className="mt-1 flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2">
                <span className="w-5 text-center text-sm font-semibold text-accent">12</span>
                <UserAvatar className="size-7" username="Bạn" seed="ban-viewer" />
                <span className="flex-1 truncate text-sm text-accent">Bạn</span>
                <span className="flex items-center gap-1 text-xs text-success">
                    <ArrowUpIcon aria-hidden focusable="false" className="size-3" />3
                </span>
            </div>
        </motion.div>,
    )
}

/** Thẻ bước cho layout tĩnh (fallback mobile / reduced-motion). */
const StaticStep = ({ stepKey }: { stepKey: string }) => {
    const t = useTranslations()
    return (
        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-default bg-surface p-5">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted">
                    {t(`landing.learnLoop.items.${stepKey}.step`)}
                </span>
                <span className="text-muted [&>svg]:size-5">{STEP_ICONS[stepKey]}</span>
            </div>
            <span className="text-xs text-muted">
                {t(`landing.learnLoop.items.${stepKey}.tag`)}
            </span>
            <Typography type="body" weight="semibold">
                {t(`landing.learnLoop.items.${stepKey}.title`)}
            </Typography>
            <Typography type="body-sm" color="muted">
                {t(`landing.learnLoop.items.${stepKey}.desc`)}
            </Typography>
        </div>
    )
}

/** Heading dùng chung cho cả 2 biến thể (tĩnh + pinned). */
const LoopHeading = () => {
    const t = useTranslations()
    return (
        <SectionHeading
            eyebrow={t("landing.learnLoop.eyebrow")}
            title={t("landing.learnLoop.title")}
            intro={t("landing.learnLoop.intro")}
        />
    )
}

/** Layout TĨNH (mobile / reduced-motion / trước mount) — 4 thẻ ngang, KHÔNG pin/scroll. */
const LearnLoopStatic = ({ className }: LearnLoopScrollProps) => (
    <section className={cn("flex flex-col gap-6", className)}>
        <LoopHeading />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            {LANDING_LOOP_STEPS.map((key, index) => (
                <React.Fragment key={key}>
                    <StaticStep stepKey={key} />
                    {index < LANDING_LOOP_STEPS.length - 1 && (
                        <div className="hidden items-center sm:flex">
                            <CaretRightIcon aria-hidden focusable="false" className="size-5 text-muted" />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    </section>
)

/**
 * Biến thể PINNED (desktop) — tách riêng để `useScroll`'s target ref LUÔN gắn vào
 * `<section>` được render (tránh "Target ref defined but not hydrated" khi nhánh
 * fallback không gắn ref). Ghim khối giữa màn; cuộn → bước active 01→04 + visual phải
 * đổi + thanh tiến độ; cuộn hết → `sticky` nhả. Bấm bước ở ListBox → cuộn tới đúng đó.
 */
const LearnLoopPinned = ({ className }: LearnLoopScrollProps) => {
    const t = useTranslations()
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

    /** Cuộn cửa sổ tới vị trí ứng với bước `index` (khi bấm ListBox). */
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
            <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 py-12">
                <LoopHeading />
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    {/* TRÁI — danh sách 4 bước (sạch: 1 icon-tile + title; active = accent ở chi
                        tiết: left-bar + tile + title + mô tả mở). Scroll lái active; bấm → cuộn tới */}
                    <div>
                        <ListBox
                            aria-label={t("landing.learnLoop.title")}
                            selectionMode="single"
                            disallowEmptySelection
                            selectedKeys={[activeKey]}
                            onSelectionChange={(keys) => {
                                const key = [...keys][0]
                                const index = LANDING_LOOP_STEPS.findIndex((step) => step === key)
                                if (index >= 0) {
                                    jumpToStep(index)
                                }
                            }}
                            className="gap-1 p-0"
                        >
                            {LANDING_LOOP_STEPS.map((key, index) => {
                                const selected = key === activeKey
                                const done = index < active
                                return (
                                    <ListBox.Item
                                        key={key}
                                        id={key}
                                        textValue={t(`landing.learnLoop.items.${key}.title`)}
                                        className={cn(
                                            "cursor-pointer rounded-2xl px-4 py-3 transition-colors data-[hovered=true]:bg-default-100",
                                            // selected = fill bg-accent/10 (KHÔNG border trái)
                                            selected && "bg-accent/10 data-[hovered=true]:bg-accent/10",
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span
                                                className={cn(
                                                    "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors [&>svg]:size-5",
                                                    selected
                                                        ? "bg-accent/15 text-accent"
                                                        : done
                                                            ? "bg-success/10 text-success"
                                                            : "bg-default text-muted",
                                                )}
                                            >
                                                {done ? (
                                                    <CheckCircleIcon
                                                        aria-hidden
                                                        focusable="false"
                                                        className="size-5"
                                                    />
                                                ) : (
                                                    STEP_ICONS[key]
                                                )}
                                            </span>
                                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                <Typography type="body" weight="semibold" className={cn(selected && "text-accent")}>
                                                    {t(`landing.learnLoop.items.${key}.title`)}
                                                </Typography>
                                                {selected && (
                                                    <Typography type="body-sm" color="muted">
                                                        {t(`landing.learnLoop.items.${key}.desc`)}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    </ListBox.Item>
                                )
                            })}
                        </ListBox>
                    </div>

                    {/* PHẢI — visual đổi theo bước (crossfade) */}
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
                </div>
            </div>
        </section>
    )
}

/**
 * Section "Cách học" (vòng học 4 bước). Desktop (sau mount, không reduced-motion) →
 * {@link LearnLoopPinned} (scroll-pinned giống ika.xyz). Mobile / reduced-motion /
 * trước khi mount → {@link LearnLoopStatic} (4 thẻ tĩnh, không scroll-hijack + a11y).
 * Tách 2 biến thể để `useScroll` (trong Pinned) chỉ chạy khi `<section ref>` thật sự
 * render — tránh lỗi "Target ref defined but not hydrated".
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
