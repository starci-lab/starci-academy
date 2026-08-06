import React from "react"
import { SubmissionAttemptsDrawer } from "@/components/overlays/drawers/SubmissionAttemptsDrawer"
import { PersonalProjectTaskAttemptsDrawer } from "@/components/overlays/drawers/PersonalProjectTaskAttemptsDrawer"
import { E2eResultDrawer } from "@/components/overlays/drawers/E2eResultDrawer"
import { ContentAiChatDrawer } from "@/components/overlays/drawers/ContentAiChatDrawer"
import { MiniCartDrawer } from "./MiniCartDrawer"

/** Mounts the app-wide drawer overlays (attempts, E2E, AI chat, mini-cart). */
export const DrawerContainer = () => {
    return (
        <>
            <SubmissionAttemptsDrawer />
            <PersonalProjectTaskAttemptsDrawer />
            <E2eResultDrawer />
            <ContentAiChatDrawer />
            <MiniCartDrawer />
        </>
    )
}