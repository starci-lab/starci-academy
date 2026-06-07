"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React, { useEffect, useState } from "react"
import { Input, Kbd, Modal, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    useSearchOverlayState,
} from "@/hooks"
import debounce from "lodash/debounce"
import { GlobalSearchContent } from "./Content"
import { setSearchQuery } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"


/**
 * Global search modal opened by Navbar (Ctrl/Cmd+K).
 */
export const GlobalSearchModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useSearchOverlayState()
    const dispatch = useAppDispatch()
    // The search box is just an input synced to Redux search.query — no form lib needed.
    // Initialized from redux; dispatch (debounced) on type; GlobalSearchContent reads from redux.
    const [query, setQuery] = useState(useAppSelector((state) => state.search.query))

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

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container className="p-0" size="lg">
                    <Modal.Dialog className="p-0 rounded-2xl">
                        <Modal.Body className="p-0 w-full overflow-hidden">
                            <TextField className="w-full relative">
                                <MagnifyingGlassIcon className="size-5 absolute left-2 top-1/2 -translate-y-1/2" />
                                <Input
                                    className="w-full max-w-full pl-9 pr-16 rounded-full ring-0 focus:ring-0 shadow-none"
                                    placeholder={t("search.placeholder")}
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                <Kbd className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <Kbd.Content>ESC</Kbd.Content>
                                </Kbd>
                            </TextField>
                            <div className="border-b "/>
                            <GlobalSearchContent />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

