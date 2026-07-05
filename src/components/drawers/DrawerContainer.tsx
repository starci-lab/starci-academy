import React from "react"
import { SubmissionAttemptsDrawer } from "./SubmissionAttemptsDrawer"
import { PersonalProjectTaskAttemptsDrawer } from "./PersonalProjectTaskAttemptsDrawer"
import { E2eResultDrawer } from "./E2eResultDrawer"
import { ContentAiChatDrawer } from "./ContentAiChatDrawer"
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