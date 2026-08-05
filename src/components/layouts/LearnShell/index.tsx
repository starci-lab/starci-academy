"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams, useSelectedLayoutSegments } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseEnrollmentStatusSwr"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import {
    useContentAiChatOverlayState,
    useContentAiSelection,
    usePaymentOverlayState,
} from "@/hooks/zustand/overlay/hooks"
import { useSelectionHintStore } from "@/components/features/learn/ContentAiSelectionAsk/hintStore"
import { PaymentFlow } from "@/modules/types/payment"
import { toEnrollGatePrice } from "./map"
import { _LearnShell, type LearnShellProps, type LearnShellSelectionAsk, type LearnSurface } from "./component"

/**
 * Learn surfaces that require enrollment. Only the capstone (personal-project) is
 * gated today — mirrors `ENROLL_REQUIRED_SURFACES` in the real `/learn` route
 * layout (`src/app/[locale]/courses/[courseId]/learn/layout.tsx`).
 */
const ENROLL_REQUIRED_SURFACES: ReadonlySet<string> = new Set(["personal-project"])

/** i18n key for each gated surface's display name (folded into the gate title). Mirrors the real route layout. */
const SURFACE_LABEL_KEY: Record<string, string> = {
    "personal-project": "finalProject.title",
}

// --- selection-ask DOM tracking -------------------------------------------------
// The blueprint moved "which passage is selected, and where" from being owned by
// `ContentAiSelectionAsk` itself to being a resolved, controlled prop on the shell
// (`selectionAsk`). This connected file is therefore where that DOM-selection
// watching now lives — ported from the real
// `src/components/features/learn/ContentAiSelectionAsk/index.tsx`.

/** Marker attribute for any readable text region a selection may be asked about. */
const SELECTABLE_SELECTOR = "[data-ai-selectable]"
/** Ignore trivially short selections (clicks, single words barely worth asking about). */
const MIN_CHARS = 3
/** Cap the stored passage so a huge selection doesn't bloat the prompt / bubble. */
const MAX_CHARS = 600
/** Cap the surrounding-paragraph context fed to the model. */
const MAX_CONTEXT = 700
/** Block elements that count as the "containing paragraph" of a selection. */
const BLOCK_SELECTOR = "p, li, blockquote, td, th, pre, h1, h2, h3, h4, h5, h6"
/** Heading elements used to resolve the section a selection sits under. */
const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6, [data-toc-label]"

/** The resolved passage + hidden grounding context kept alongside the visible anchor. */
interface PendingSelection {
    text: string
    context: string
}

/** Resolve the block element (paragraph/list-item/…) containing a selection node. */
const containingBlock = (node: Node | null): Element | null => {
    const start = node?.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element | null)
    return start?.closest?.(BLOCK_SELECTOR) ?? null
}

/** Resolve the nearest AI-selectable reading region containing a selection node. */
const containingSelectable = (node: Node | null): Element | null => {
    const start = node?.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element | null)
    return start?.closest?.(SELECTABLE_SELECTOR) ?? null
}

/** Clean text of a heading element (prefer the anchor-free toc label). */
const headingText = (el: Element): string =>
    (el.getAttribute("data-toc-label") ?? el.textContent ?? "").trim()

/** The nearest section heading appearing BEFORE a block within the reading region. */
const nearestHeading = (block: Element | null, region: Element): string | null => {
    if (!block) {
        return null
    }
    let found: Element | null = null
    for (const heading of Array.from(region.querySelectorAll(HEADING_SELECTOR))) {
        if (heading.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING) {
            found = heading
        }
    }
    return found ? headingText(found) : null
}

/** Build the hidden grounding string from the selection + surroundings. */
const buildSelectionContext = (text: string, paragraph: string, heading: string | null): string => {
    const parts = [`Selected passage: «${text}»`]
    if (paragraph && paragraph !== text) {
        parts.push(`Within paragraph: «${paragraph}»`)
    }
    if (heading) {
        parts.push(`Under section: «${heading}»`)
    }
    return parts.join(". ")
}

/**
 * Course-learn layout shell — the CONNECTED half of `LearnShell`: resolves which
 * `/learn/**` surface is active, whether it's enrollment-gated, whether an
 * assessment is live (suppresses the AI triggers), the AI-chat open state, and the
 * current text-selection "ask AI" request, then hands them all to {@link _LearnShell}.
 *
 * Modeled on `src/app/[locale]/courses/[courseId]/learn/layout.tsx` (the real route
 * layout that today composes `LearnShell` + `EnrollGate` + `ContentAiFab` +
 * `ContentAiSelectionAsk` side by side) — the blueprint instead folds those three
 * concerns INTO the shell, driven by an `activeSurface` enum instead of segment
 * sniffing spread across the layout.
 *
 * @param props - only `children`, the active route's own content.
 */
export const LearnShell = ({ children }: Pick<LearnShellProps, "children">) => {
    const t = useTranslations()

    // --- which surface is active -------------------------------------------------
    const segments = useSelectedLayoutSegments()
    const searchParams = useSearchParams()
    const surface = segments[0]
    const activeSurface: LearnSurface =
        surface === "content" ? "content"
            : surface === "personal-project" ? "personalProject"
                : surface === "leaderboard" ? "leaderboard"
                    : "other"

    // a live quiz / interview grades a recruiter-facing signal → the AI chat is a
    // cheat channel there and gets suppressed, same gate as the real route layout.
    const isFlashcardQuizLive = surface === "flashcards" && segments[1] === "quiz" && segments[2] === "sessions"
    const isMockInterviewInterviewRoute = surface === "mock-interview" && segments[1] === "interview"
    const isMockInterviewLive = isMockInterviewInterviewRoute || (surface === "mock-interview" && searchParams.get("phase") === "interview")
    const isAssessmentLive = isFlashcardQuizLive || isMockInterviewLive

    // --- enrollment gate ----------------------------------------------------------
    // enrollment status drives the enroll-gate on hands-on surfaces (populates state.user.enrolled).
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    // `enrolled` defaults to false, so only trust it once the status query has settled.
    const enrollKnown = Boolean(enrollmentSwr.data) || Boolean(enrollmentSwr.error)
    const isEnrollRequired = Boolean(surface) && ENROLL_REQUIRED_SURFACES.has(surface as string)
    const isEnrollGated = isEnrollRequired && enrollKnown && !enrolled

    // loyalty-aware price preview — same query the real EnrollGate reads, disabled unless the gate is showing.
    const priceSwr = useQueryCoursePricePreviewSwr(isEnrollGated ? courseId : null)
    const { open: openPayment } = usePaymentOverlayState()
    const onEnroll = useCallback(() => openPayment({ flow: PaymentFlow.CourseEnroll }), [openPayment])
    const gateLabelKey = surface ? SURFACE_LABEL_KEY[surface] : undefined
    const enrollGateProps: LearnShellProps["enrollGateProps"] = isEnrollGated
        ? {
            title: t("enrollGate.title", { surface: gateLabelKey ? t(gateLabelKey) : "" }),
            description: t("enrollGate.description"),
            // TODO(i18n): no per-surface mock teaser is wired yet (the real
            // `PersonalProjectGatePreview` lives in the old-world tree) — omitted
            // rather than importing across the split; the gate still renders
            // correctly without a `preview`.
            price: toEnrollGatePrice(priceSwr.data),
            onEnroll,
        }
        : undefined

    // --- AI chat trigger ------------------------------------------------------------
    const { isOpen: isAiChatOpen, open: openAiChat } = useContentAiChatOverlayState()

    // --- selection-ask --------------------------------------------------------------
    const { setSelection } = useContentAiSelection()
    const hydrateHint = useSelectionHintStore((state) => state.hydrate)
    const markHintSeen = useSelectionHintStore((state) => state.markSeen)
    const hintSeen = useSelectionHintStore((state) => state.seen)
    useEffect(() => hydrateHint(), [hydrateHint])

    const [selectionAsk, setSelectionAsk] = useState<LearnShellSelectionAsk | null>(null)
    const pendingRef = useRef<PendingSelection | null>(null)

    // recompute the pill's anchor + passage when a selection settles inside a selectable region
    const onSettle = useCallback(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
            setSelectionAsk(null)
            return
        }
        const range = selection.getRangeAt(0)
        const region = containingSelectable(range.commonAncestorContainer)
        if (!region) {
            setSelectionAsk(null)
            return
        }
        const text = selection.toString().trim()
        if (text.length < MIN_CHARS) {
            setSelectionAsk(null)
            return
        }
        const rect = range.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) {
            setSelectionAsk(null)
            return
        }
        const block = containingBlock(range.commonAncestorContainer)
        const paragraph = (block?.textContent ?? "").trim().slice(0, MAX_CONTEXT)
        const heading = nearestHeading(block, region)
        const cappedText = text.slice(0, MAX_CHARS)
        pendingRef.current = {
            text: cappedText,
            context: buildSelectionContext(cappedText, paragraph, heading),
        }
        setSelectionAsk({
            anchor: { x: rect.left + rect.width / 2, y: rect.top },
            isNew: !hintSeen,
        })
    }, [hintSeen])

    useEffect(() => {
        // show on settle (mouse/touch release); hide when the selection collapses
        // (click elsewhere) or the page scrolls (the anchor would drift)
        const onSelectionChange = () => {
            const selection = window.getSelection()
            if (!selection || selection.isCollapsed) {
                setSelectionAsk(null)
            }
        }
        const onScroll = () => setSelectionAsk(null)
        document.addEventListener("mouseup", onSettle)
        document.addEventListener("touchend", onSettle)
        document.addEventListener("selectionchange", onSelectionChange)
        window.addEventListener("scroll", onScroll, true)
        window.addEventListener("resize", onScroll)
        return () => {
            document.removeEventListener("mouseup", onSettle)
            document.removeEventListener("touchend", onSettle)
            document.removeEventListener("selectionchange", onSelectionChange)
            window.removeEventListener("scroll", onScroll, true)
            window.removeEventListener("resize", onScroll)
        }
    }, [onSettle])

    const onOpenSelectionAsk = useCallback(() => {
        const pending = pendingRef.current
        if (!pending) {
            return
        }
        setSelection(pending.text, pending.context)
        markHintSeen()
        openAiChat()
        window.getSelection()?.removeAllRanges()
        setSelectionAsk(null)
    }, [setSelection, markHintSeen, openAiChat])

    return (
        <_LearnShell
            activeSurface={activeSurface}
            isEnrollGated={isEnrollGated}
            isAssessmentLive={isAssessmentLive}
            enrollGateProps={enrollGateProps}
            onOpenAiChat={openAiChat}
            isAiChatOpen={isAiChatOpen}
            selectionAsk={selectionAsk}
            onOpenSelectionAsk={onOpenSelectionAsk}
        >
            {children}
        </_LearnShell>
    )
}
