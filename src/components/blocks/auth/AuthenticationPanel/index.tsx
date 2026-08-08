"use client"

import React from "react"
import { _AuthenticationPanel } from "./component"
import { useAppSelector } from "@/redux/hooks"
import type { SkeletonProps } from "@/components/frames/_slot"

/**
 * Shared authentication body — sign-in / sign-up step machines without modal
 * chrome. Mounted as `ModalShell.body` by {@link AuthenticationModal} and as
 * the page card body by {@link LoginPage}.
 *
 * CONNECTED half: reads Redux `tabs.authenticationModalTab` and hands the
 * resolved tab to the presentational {@link _AuthenticationPanel}. Nested
 * `SignInSection` / `SignUpSection` own their own step + form state.
 *
 * Typed as a `ComponentTypeWithSkeleton` slot so hosts can pass the panel by
 * reference (never a pre-built node).
 */
export const AuthenticationPanel = ({ isSkeleton }: SkeletonProps = {}) => {
    const tab = useAppSelector((state) => state.tabs.authenticationModalTab)
    return <_AuthenticationPanel tab={tab} isSkeleton={isSkeleton} />
}
