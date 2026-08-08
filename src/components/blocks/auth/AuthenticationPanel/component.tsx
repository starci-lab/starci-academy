import React from "react"
import { SignInSection } from "./SignInSection"
import { SignUpSection } from "./SignUpSection"
import { AuthenticationModalTab } from "@/redux/slices/tabs"
import type { SkeletonProps } from "@/components/frames/_slot"

/** Props for {@link _AuthenticationPanel}. */
export interface AuthenticationPanelProps {
    /** Active auth tab — selects the sign-in or sign-up step machine. */
    tab: AuthenticationModalTab
}

/**
 * Presentational auth body — title + form content for whichever tab is active.
 * Owns no modal chrome (`CloseTrigger` / `Header` / `Body` / backdrop); hosts
 * ({@link AuthenticationModal} via `ModalShell`, {@link LoginPage} via page card)
 * supply the surface around this panel.
 *
 * @param props - {@link AuthenticationPanelProps}
 */
export const _AuthenticationPanel = ({
    tab,
}: SkeletonProps<AuthenticationPanelProps>) => {
    switch (tab) {
    case AuthenticationModalTab.SignIn:
        return <SignInSection />
    case AuthenticationModalTab.SignUp:
        return <SignUpSection />
    default:
        return null
    }
}
