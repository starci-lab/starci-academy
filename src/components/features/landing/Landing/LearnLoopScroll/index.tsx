"use client"

import React, { useEffect, useRef, useState } from "react"
import { ListBox, Typography, cn } from "@heroui/react"
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
} from "framer-motion"
import { useTranslations } from "next-intl"
import {
    BookOpenIcon,
    CaretRightIcon,
    CheckCircleIcon,
    RobotIcon,
    RocketLaunchIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { SectionHeading } from "@/components/blocks"
import { useSmViewpoint } from "@/hooks"
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

/** Ngôn ngữ hiển thị trong visual bước "Đọc". */
const READ_LANGS = ["TypeScript", "Java", "C#", "Go"] as const

/** Vạch giả lập 1 dòng văn bản (skeleton tone). */
const FakeLine = ({ w }: { w: string }) => (
    <div className="h-2 rounded-full bg-default" style={{ width: w }} />
)

/**
 * Visual cột phải đổi theo bước — flat, dựng bằng token (không ảnh thật), mỗi
 * panel neo bằng icon của bước. Bốn panel: Đọc (tab 4 ngôn ngữ) · Chấm AI (điểm +
 * nhận xét) · Capstone (mini sơ đồ hệ thống) · Bảng xếp hạng (vài dòng XP).
 */
const StepVisual = ({ stepKey }: { stepKey: string }) => {
    const t = useTranslations()
    const header = (
        <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent [&>svg]:size-5">
                {STEP_ICONS[stepKey]}
            </span>
            <Typography type="body" weight="semibold">
                {t(`landing.learnLoop.items.${stepKey}.title`)}
            </Typography>
        </div>
    )

    if (stepKey === "read") {
        return (
            <div className="flex flex-col gap-4 rounded-2xl border border-default bg-surface p-5">
                {header}
                <div className="flex flex-col gap-2">
                    <FakeLine w="90%" />
                    <FakeLine w="100%" />
                    <FakeLine w="75%" />
                    <FakeLine w="85%" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {READ_LANGS.map((lang) => (
                        <span key={lang} className="rounded-lg border border-default px-2.5 py-1 font-mono text-xs text-muted">
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
        )
    }

    if (stepKey === "grade") {
        return (
            <div className="flex flex-col gap-4 rounded-2xl border border-default bg-surface p-5">
                {header}
                <div className="flex flex-col gap-1.5 rounded-xl bg-default p-3 font-mono text-xs text-muted">
                    <span>function handle(req) {"{"}</span>
                    <span className="pl-3">return ok(req.body)</span>
                    <span>{"}"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-success/10 px-3 py-1 text-sm font-semibold text-success">92/100</span>
                    <span className="text-sm text-success">{t("submissionResult.passed")}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success" />
                        Idempotency key đã xử lý đúng.
                    </span>
                    <span className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success" />
                        Bù trừ lỗi mạng bằng retry hợp lý.
                    </span>
                </div>
            </div>
        )
    }

    if (stepKey === "capstone") {
        return (
            <div className="flex flex-col gap-4 rounded-2xl border border-default bg-surface p-5">
                {header}
                <div className="flex flex-col items-center gap-2">
                    <span className="rounded-xl border border-accent bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
                        API Gateway
                    </span>
                    <CaretRightIcon aria-hidden focusable="false" className="size-4 rotate-90 text-muted" />
                    <div className="flex w-full justify-center gap-2">
                        {["Postgres", "Redis", "Kafka"].map((node) => (
                            <span key={node} className="flex-1 rounded-xl border border-default bg-default px-2 py-2 text-center font-mono text-xs text-muted">
                                {node}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // rank
    const rows = [
        { rank: 1, name: "minh.dev", xp: "4.280" },
        { rank: 2, name: "huyen.codes", xp: "2.715" },
        { rank: 3, name: "thanh.io", xp: "1.940" },
    ]
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-default bg-surface p-5">
            {header}
            <div className="flex flex-col gap-2">
                {rows.map((row) => (
                    <div
                        key={row.rank}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2",
                            row.rank === 1 ? "bg-accent/10" : "bg-default",
                        )}
                    >
                        <span className={cn("w-5 font-mono text-sm", row.rank === 1 ? "text-accent" : "text-muted")}>
                            {row.rank}
                        </span>
                        <span className="size-7 shrink-0 rounded-full bg-surface-secondary" />
                        <span className="flex-1 truncate text-sm">{row.name}</span>
                        <span className={cn("font-mono text-sm", row.rank === 1 ? "text-accent" : "text-muted")}>
                            {row.xp} XP
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/** Thẻ bước cho layout tĩnh (fallback mobile / reduced-motion). */
const StaticStep = ({ stepKey }: { stepKey: string }) => {
    const t = useTranslations()
    return (
        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-default bg-surface p-5">
            <div className="flex items-center justify-between">
                <Typography type="code" className="text-accent">
                    {t(`landing.learnLoop.items.${stepKey}.step`)}
                </Typography>
                <span className="text-muted [&>svg]:size-5">{STEP_ICONS[stepKey]}</span>
            </div>
            <Typography type="code" className="text-xs text-muted">
                {t(`landing.learnLoop.items.${stepKey}.tag`)}
            </Typography>
            <Typography type="body" weight="semibold">
                {t(`landing.learnLoop.items.${stepKey}.title`)}
            </Typography>
            <Typography type="body-sm" color="muted">
                {t(`landing.learnLoop.items.${stepKey}.desc`)}
            </Typography>
        </div>
    )
}

/**
 * Section "Cách học" dạng scroll-pinned (giống ika.xyz): ghim cả khối giữa màn,
 * cuộn → bước active nhảy 01→04 (ListBox trái highlight) + visual phải đổi + thanh
 * tiến độ chạy; cuộn hết bước 04 → `sticky` tự nhả, trang chạy tiếp. Bấm 1 bước ở
 * ListBox → cuộn tới đúng vị trí của bước đó.
 *
 * Trên mobile hoặc khi người dùng bật reduced-motion → bỏ pin, render layout tĩnh
 * (4 thẻ ngang/stack) để không scroll-hijack trên cảm ứng + tôn trọng a11y.
 *
 * @param props - optional className (placement only).
 */
export const LearnLoopScroll = ({ className }: LearnLoopScrollProps) => {
    const t = useTranslations()
    const sectionRef = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const { isDesktop } = useSmViewpoint()
    const [mounted, setMounted] = useState(false)
    const [active, setActive] = useState(0)

    useEffect(() => setMounted(true), [])

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

    const heading = (
        <SectionHeading
            eyebrow={t("landing.learnLoop.eyebrow")}
            title={t("landing.learnLoop.title")}
            intro={t("landing.learnLoop.intro")}
        />
    )

    // Fallback: mobile / reduced-motion / trước khi mount → layout tĩnh (không pin).
    if (!mounted || !isDesktop || reduce) {
        return (
            <section className={cn("flex flex-col gap-6", className)}>
                {heading}
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
    }

    const activeKey = LANDING_LOOP_STEPS[active]

    return (
        <section ref={sectionRef} className={cn("relative h-[360vh]", className)}>
            <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 py-12">
                {heading}
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    {/* TRÁI — ListBox 4 bước, selected = bước active (scroll lái); bấm → cuộn tới */}
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
                        className="gap-2 p-0"
                    >
                        {LANDING_LOOP_STEPS.map((key) => {
                            const selected = key === activeKey
                            return (
                                <ListBox.Item
                                    key={key}
                                    id={key}
                                    textValue={t(`landing.learnLoop.items.${key}.title`)}
                                    className="cursor-pointer rounded-2xl px-4 py-3 data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent/10"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={cn("font-mono text-sm", selected ? "text-accent" : "text-muted")}>
                                            {t(`landing.learnLoop.items.${key}.step`)}
                                        </span>
                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("[&>svg]:size-4", selected ? "text-accent" : "text-muted")}>
                                                    {STEP_ICONS[key]}
                                                </span>
                                                <Typography type="body" weight="semibold">
                                                    {t(`landing.learnLoop.items.${key}.title`)}
                                                </Typography>
                                            </div>
                                            {selected && (
                                                <>
                                                    <Typography type="code" className="text-xs text-muted">
                                                        {t(`landing.learnLoop.items.${key}.tag`)}
                                                    </Typography>
                                                    <Typography type="body-sm" color="muted">
                                                        {t(`landing.learnLoop.items.${key}.desc`)}
                                                    </Typography>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </ListBox.Item>
                            )
                        })}
                    </ListBox>

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

                {/* Thanh tiến độ + bộ đếm bước (giống Ika) */}
                <div className="flex items-center gap-3">
                    <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-default">
                        <motion.div
                            className="h-full origin-left rounded-full bg-accent"
                            style={{ scaleX: scrollYProgress }}
                        />
                    </div>
                    <span className="font-mono text-xs text-muted">
                        {`${String(active + 1).padStart(2, "0")} / ${String(LANDING_LOOP_STEPS.length).padStart(2, "0")}`}
                    </span>
                </div>
            </div>
        </section>
    )
}
