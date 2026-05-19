"use client"

import { useHeadhunterOverlayState } from "@/hooks/singleton"
import type { ConsultantEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import {
    setHeadhunter,
    setHeadhunterId,
} from "@/redux/slices"
import { useCallback } from "react"

/**
 * Selects a headhunter in Redux and opens the profile modal.
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
