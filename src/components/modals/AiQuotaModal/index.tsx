"use client"

import React, {
    useEffect,
} from "react"
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
import { useAiQuotaOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch } from "@/redux/hooks"
import { resetAiQuotaTab } from "@/redux/slices/tabs"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

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
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            bodyStartsWithTabs
            bodyClassName="flex flex-col gap-6"
            header={<AiQuotaHeader />}
        >
            <AiQuotaTabBar />
            <AiQuotaBody />
            <AiQuotaFullConfigLink />
        </ModalShell>
    )
}
