import React from "react"
import { SubmissionAttemptsDrawer } from "@/components/drawersv2/SubmissionAttemptsDrawer"
import { PersonalProjectTaskAttemptsDrawer } from "@/components/drawersv2/PersonalProjectTaskAttemptsDrawer"
import { E2eResultDrawer } from "@/components/drawersv2/E2eResultDrawer"
import { ContentAiChatDrawer } from "@/components/drawersv2/ContentAiChatDrawer"
import { MiniCartDrawer } from "./MiniCartDrawer"

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