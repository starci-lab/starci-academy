"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    Button,
    cn,
} from "@heroui/react"
import { SparkleIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useContentAiChatOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useContentAiChatModeStore } from "@/hooks/zustand/contentAiChatMode/store"
import { FloatingActionButton } from "@/components/blocks/buttons/FloatingActionButton"

/** localStorage key for the FAB's persisted vertical position (px from viewport bottom). */
const STORAGE_KEY = "contentAiFabBottom"
/** Default distance from the viewport bottom (px). */
const DEFAULT_BOTTOM = 96
/** Lowest the FAB may sit (px from bottom) — keeps it clear of the very edge. */
const MIN_BOTTOM = 16
/** Pixels the pointer must travel before a press counts as a drag (not a click). */
const DRAG_THRESHOLD = 6
/** Headroom kept below the top edge so the FAB never drags off-screen (px). */
const TOP_GUARD = 80

/** Props for {@link ContentAiFab}. */
export type ContentAiFabProps = WithClassNames<undefined>

/**
 * Floating "ask StarCi AI" button shown anywhere inside a course — the TRIGGER for
 * the chat, whose panel is presented per the learner's persisted choice
 * ({@link useContentAiChatModeStore}), switchable in the panel header:
 * - **rail** — a resizable right-edge side panel that reflows the lesson, rendered
 *   as the learn shell's `rightRail` (see the learn `layout`); the FAB here is only
 *   the draggable toggle, hidden while the rail is open (the rail carries its close).
 * - **drawer** — the slide-in {@link import("@/components/drawers/ContentAiChatDrawer").ContentAiChatDrawer}
 *   (rendered globally); the FAB is its trigger.
 *
 * MOBILE always uses the drawer regardless of the preference. Open-state lives in
 * the shared overlay store (`contentAiChat` key).
 *
 * @param props - {@link ContentAiFabProps}
 */
export const ContentAiFab = ({ className }: ContentAiFabProps) => {
    const t = useTranslations()
    // the chat is available across the whole COURSE, not just the lesson reader —
    // with a lesson open it grounds on that lesson, otherwise on the course.
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const { isOpen, setOpen, open } = useContentAiChatOverlayState()
    const { mode } = useContentAiChatModeStore()
    const { isMobile } = useSmViewpoint()
    // a phone is always the drawer — a side rail is too cramped there.
    const effectiveMode = isMobile ? "drawer" : mode

    // vertical position of the FAB (px from viewport bottom); restored from localStorage on mount
    const [bottom, setBottom] = useState<number>(DEFAULT_BOTTOM)
    useEffect(() => {
        // localStorage is client-only; read once after mount to seed the persisted position
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved !== null && !Number.isNaN(Number(saved))) {
            setBottom(Number(saved))
        }
    }, [])

    // drag bookkeeping: a press opens the panel ONLY when it did not become a drag
    const draggingRef = useRef(false)
    const startRef = useRef<{ pointerY: number; bottom: number } | null>(null)

    // remember where the drag began so we can offset from it
    const onPointerDown = useCallback(
        (event: React.PointerEvent) => {
            startRef.current = { pointerY: event.clientY, bottom }
            draggingRef.current = false
            event.currentTarget.setPointerCapture?.(event.pointerId)
        },
        [bottom],
    )

    // move the FAB up/down with the pointer, clamped to the viewport; mark it a drag past the threshold
    const onPointerMove = useCallback((event: React.PointerEvent) => {
        const start = startRef.current
        if (!start) {
            return
        }
        // dragging UP (smaller clientY) should RAISE the bubble → larger `bottom`
        const delta = start.pointerY - event.clientY
        if (Math.abs(delta) > DRAG_THRESHOLD) {
            draggingRef.current = true
        }
        const maxBottom = window.innerHeight - TOP_GUARD
        setBottom(Math.min(Math.max(start.bottom + delta, MIN_BOTTOM), maxBottom))
    }, [])

    // end the gesture; persist the new position only if it was actually a drag
    const onPointerUp = useCallback(
        (event: React.PointerEvent) => {
            if (startRef.current && draggingRef.current) {
                window.localStorage.setItem(STORAGE_KEY, String(bottom))
            }
            startRef.current = null
            event.currentTarget.releasePointerCapture?.(event.pointerId)
        },
        [bottom],
    )

    // a real press (not a drag) opens the panel; swallow the click that fires at the
    // end of a drag-release.
    const onOpen = useCallback(() => {
        if (draggingRef.current) {
            draggingRef.current = false
            return
        }
        setOpen(true)
    }, [setOpen])

    // the FAB needs a COURSE to scope the conversation to (its enrollment owns the
    // session). A lesson is NOT required: on flashcards / mind-map / leaderboard
    // the chat opens course-general instead of hiding itself.
    if (!courseId) {
        return null
    }

    // DRAWER — the panel is the global ContentAiChatDrawer; here just the FAB trigger.
    if (effectiveMode === "drawer") {
        return (
            <FloatingActionButton
                onPress={open}
                ariaLabel={t("contentAi.ask")}
                className={className}
            >
                {/* sparkle = AI intent; the wrapped isIconOnly button sizes the svg */}
                <SparkleIcon />
            </FloatingActionButton>
        )
    }

    // RAIL — the resizable rail is rendered by the learn shell (rightRail) when open.
    // The FAB is the draggable toggle, hidden while the rail is open (the rail closes itself).
    if (isOpen) {
        return null
    }

    return (
        <Button
            isIconOnly
            variant="primary"
            aria-label={t("contentAi.ask")}
            aria-expanded={isOpen}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPress={onOpen}
            style={{ bottom }}
            className={cn(
                "fixed right-[calc(var(--app-rail-w,0px)+1rem)] z-40 mb-[env(safe-area-inset-bottom)] touch-none rounded-full shadow-lg",
                className,
            )}
        >
            {/* sparkle = AI intent; the isIconOnly button sizes the svg itself */}
            <SparkleIcon />
        </Button>
    )
}
