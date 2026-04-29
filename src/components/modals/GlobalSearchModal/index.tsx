"use client"

import React, { useEffect } from "react"
import { Input, Kbd, Modal, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { 
    useSearchOverlayState, 
    useGlobalSearchFormik, 
} from "@/hooks/singleton"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import debounce from "lodash/debounce"
import { GlobalSearchContent } from "./Content"
import { setSearchQuery } from "@/redux/slices"
import { useAppDispatch } from "@/redux"

/**
 * Global search modal opened by Navbar (Ctrl/Cmd+K).
 */
export const GlobalSearchModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen } = useSearchOverlayState()
    const formik = useGlobalSearchFormik()
    const dispatch = useAppDispatch()

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
        const emitSearch = debounce((query: string) => {
            dispatch(setSearchQuery(query))
        }, 200)
        emitSearch(formik.values.query.trim())
        return () => emitSearch.cancel()
    }, [dispatch, formik.values.query, isOpen])

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

