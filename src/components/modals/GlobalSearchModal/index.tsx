"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import React, { useEffect, useRef, useState } from "react"
import { cn, Input, Kbd, Modal, TextField, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import debounce from "lodash/debounce"
import { GlobalSearchContent } from "./Content"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import { setSearchQuery } from "@/redux/slices/search"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for {@link GlobalSearchModal}.
 */
export type GlobalSearchModalProps = WithClassNames<undefined>

/**
 * Global search command palette opened by Navbar (Ctrl/Cmd+K).
 *
 * Keyboard-first: type in the input, press ArrowDown to drop focus into the result
 * list (a React-Aria ListBox → ↑↓ to move, ↵ to open), Esc to close. A footer hint
 * bar spells the shortcuts out. Results render as a flat grouped list (no accordion);
 * the empty state surfaces popular courses.
 *
 * @param props - Optional styling props.
 */
export const GlobalSearchModal = (props: GlobalSearchModalProps) => {
    const { className } = props
    const t = useTranslations()
    const { isOpen, setOpen } = useSearchOverlayState()
    const dispatch = useAppDispatch()
    // The search box is just an input synced to Redux search.query — no form lib needed.
    // Initialized from redux; dispatch (debounced) on type; GlobalSearchContent reads from redux.
    const [query, setQuery] = useState(useAppSelector((state) => state.search.query))
    // wraps the result list; ArrowDown from the input hands focus to its first option.
    const resultsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return
            event.preventDefault()
            setOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [isOpen, setOpen])

    useEffect(() => {
        if (!isOpen) return
        const emitSearch = debounce((next: string) => {
            dispatch(setSearchQuery(next))
        }, 200)
        emitSearch(query.trim())
        return () => emitSearch.cancel()
    }, [dispatch, query, isOpen])

    /** ArrowDown in the input → move focus to the first result option (command-palette flow). */
    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "ArrowDown") return
        const firstOption = resultsRef.current?.querySelector<HTMLElement>("[role=\"option\"]")
        if (firstOption) {
            event.preventDefault()
            firstOption.focus()
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container className="p-0" size="lg">
                    <Modal.Dialog className={cn("p-0 rounded-2xl modal__dialog--flush", className)}>
                        <Modal.Body className="p-0 w-full overflow-hidden">
                            <TextField variant="secondary" className="w-full">
                                <div className="flex w-full items-center gap-2 p-3 border-b border-default">
                                    <MagnifyingGlassIcon className="size-5 shrink-0 text-muted" />
                                    <Input
                                        autoFocus
                                        className="flex-1 min-w-0 p-0 rounded-none border-0 ring-0 focus:ring-0 shadow-none"
                                        style={{
                                            "--input-bg": "transparent",
                                            "--input-bg-hover": "transparent",
                                            "--input-bg-focus": "transparent",
                                        } as React.CSSProperties}
                                        placeholder={t("search.placeholder")}
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        onKeyDown={onInputKeyDown}
                                    />
                                    <Kbd className="shrink-0">
                                        <Kbd.Content>Esc</Kbd.Content>
                                    </Kbd>
                                </div>
                            </TextField>
                            <div ref={resultsRef} className="pt-2">
                                <GlobalSearchContent />
                            </div>
                            {/* footer key-hints (HeroUI-style Kbd, no divider line — spacing separates it) */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                                <span className="inline-flex items-center gap-2">
                                    <Kbd><Kbd.Abbr keyValue="up" /></Kbd>
                                    <Kbd><Kbd.Abbr keyValue="down" /></Kbd>
                                    <Typography type="body-xs" color="muted">{t("search.hint.move")}</Typography>
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Kbd><Kbd.Abbr keyValue="enter" /></Kbd>
                                    <Typography type="body-xs" color="muted">{t("search.hint.open")}</Typography>
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Kbd><Kbd.Content>Esc</Kbd.Content></Kbd>
                                    <Typography type="body-xs" color="muted">{t("search.hint.close")}</Typography>
                                </span>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
