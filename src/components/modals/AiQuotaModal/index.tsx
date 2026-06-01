"use client"

import React, {
    useEffect,
} from "react"
import {
    Modal,
} from "@heroui/react"
import {
    useAiQuotaOverlayState,
} from "@/hooks/singleton"
import {
    useAppDispatch,
} from "@/redux"
import {
    resetAiQuotaTab,
} from "@/redux/slices"
import {
    AiQuotaBody,
} from "./Body"
import {
    AiQuotaHeader,
} from "./Header"
import {
    AiQuotaFullConfigLink,
} from "./FullConfigLink"
import {
    AiQuotaTabBar,
} from "./TabBar"

/**
 * AI quota modal shell — overlay state, Redux tabs, nested tab panels own SWR.
 * Opened via {@link useAiQuotaOverlayState}.
 */
export const AiQuotaModal = () => {
    const dispatch = useAppDispatch()
    const { isOpen, setOpen } = useAiQuotaOverlayState()

    useEffect(() => {
        if (!isOpen) {
            dispatch(resetAiQuotaTab())
        }
    }, [
        isOpen,
        dispatch,
    ])

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AiQuotaHeader />
                        <Modal.Body>
                            <AiQuotaTabBar />
                            <div className="h-4.5"/>
                            <AiQuotaBody />
                            <div className="h-4.5"/>
                            <AiQuotaFullConfigLink />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
