"use client"

import { useCallback } from "react"
import { useHeadhunterOverlayState } from "@/hooks"
import type { ConsultantEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import {
    setHeadhunter,
    setHeadhunterId,
} from "@/redux/slices"

/**
 * Selects a headhunter in Redux and opens the profile modal.
 * @returns A callback that takes the consultant to open.
 */
export const useOpenHeadhunterDetail = () => {
    const dispatch = useAppDispatch()
    const headhunterOverlay = useHeadhunterOverlayState()

    return useCallback((headhunter: ConsultantEntity) => {
        dispatch(setHeadhunter(headhunter))
        dispatch(setHeadhunterId(headhunter.id))
        headhunterOverlay.open()
    }, [
        dispatch,
        headhunterOverlay,
    ])
}
