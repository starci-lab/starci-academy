import React from "react"
import { SubmissionAttemptsDrawer } from "./SubmissionAttemptsDrawer"
import { UserCvSubmissionAttemptsDrawer } from "./UserCvSubmissionAttemptsDrawer"
import { PersonalProjectTaskAttemptsDrawer } from "./PersonalProjectTaskAttemptsDrawer"
import { MindMapContentDetailsDrawer } from "./MindMapContentDetailsDrawer"

export const DrawerContainer = () => {
    return (
        <>
            <SubmissionAttemptsDrawer />
            <UserCvSubmissionAttemptsDrawer />
            <PersonalProjectTaskAttemptsDrawer />
            <MindMapContentDetailsDrawer />
        </>
    )
}