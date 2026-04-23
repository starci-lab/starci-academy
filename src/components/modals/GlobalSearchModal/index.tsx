"use client"

import React, { useEffect, useMemo } from "react"
import { Input, Kbd, Modal, TextField } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { 
    useSearchOverlayState, 
    useGlobalSearchFormik, 
} from "@/hooks/singleton"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { 
    useAutocompleteSocketIo,
    PublicationEvent,
    SearchableEntity
} from "@/hooks/singleton"
import debounce from "lodash/debounce"
import { GlobalSearchContent } from "./Content"

/**
 * Global search modal opened by Navbar (Ctrl/Cmd+K).
 */
export const GlobalSearchModal = () => {
    const t = useTranslations()
    const locale = useLocale()
    const { isOpen, onOpenChange } = useSearchOverlayState()
    const formik = useGlobalSearchFormik()
    const socket = useAutocompleteSocketIo()

    const entities = useMemo<Array<SearchableEntity>>(
        () => ["CourseEntity", "ModuleEntity", "ContentEntity", "LessonVideoEntity", "ChallengeEntity"],
        [],
    )

    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return
            event.preventDefault()
            onOpenChange(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [isOpen, onOpenChange])

    useEffect(() => {
        if (!isOpen) return
        const emitSearch = debounce((query: string) => {
            socket.emit(
                PublicationEvent.GlobalSearch, {
                    locale,
                    data: {
                        query,
                        entities,
                        size: 8,
                    },
                }
            )
        }, 200)
        emitSearch(formik.values.query.trim())
        return () => emitSearch.cancel()
    }, [entities, formik.values.query, isOpen, locale, socket])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container className="p-0" size="lg">
                    <Modal.Dialog className="p-0 rounded-2xl">
                        <Modal.Body className="p-0 w-full overflow-hidden">
                            <TextField className="w-full relative">
                                <MagnifyingGlassIcon className="size-5 absolute left-2 top-1/2 -translate-y-1/2" />
                                <Input
                                    className="w-full max-w-full pl-9 pr-16 rounded-full ring-0 focus:ring-0 shadow-none"
                                    placeholder={t("search.placeholder")}
                                    value={formik.values.query}
                                    onChange={(event) => formik.setFieldValue("query", event.target.value)}
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

