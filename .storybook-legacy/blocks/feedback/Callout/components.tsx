import { CheckCircleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { type CalloutStatus } from "@/components/blocks/feedback/Callout"

export const TONE_CONTENT: Record<CalloutStatus, { label: string; when: string; title: string; description: string }> = {
    default: {
        label: "Default",
        when: "A neutral notice with no success or warning tone — a system note, a saved draft.",
        title: "Draft saved",
        description: "Your progress syncs automatically after each completion.",
    },
    accent: {
        label: "Accent",
        when: "Noteworthy information that isn't a warning — an update or new feature the user should know about.",
        title: "A new course update is available",
        description: "3 new lessons were just added to the Fullstack Mastery track.",
    },
    success: {
        label: "Success",
        when: "Confirm that an action just completed successfully — a submission recorded, an operation that succeeded.",
        title: "Submission successful",
        description: "Your submission has been recorded and is awaiting grading.",
    },
    warning: {
        label: "Warning",
        when: "Remind the user of something to handle before it's too late — a due date approaching, unfinished work; not for an error that already happened.",
        title: "Submission due soon",
        description: "The \"API Gateway\" milestone closes in 2 days.",
    },
    danger: {
        label: "Danger",
        when: "Report that an operation just failed and the user needs to handle it or retry — a connection error, a failed submission.",
        title: "Submission failed",
        description: "Couldn't connect to the GitHub repo. Please try again.",
    },
}

/** Action button per example — the callout's own tone/icon/copy + its CTA label. */
export const ACTION_EXAMPLES: Array<{
    status: CalloutStatus
    label: string
    when: string
    title: string
    description: string
    icon: React.ReactNode
    actionLabel: string
}> = [
    {
        status: "accent",
        label: "Accent",
        when: "Invite the user to try a new feature right away instead of just reading and moving on.",
        title: "Try the new feature",
        description: "AI interview practice just launched — try it today.",
        icon: <RocketLaunchIcon />,
        actionLabel: "Try now",
    },
    {
        status: "success",
        label: "Success",
        when: "Lead the user to view the details of a good result they just earned, right from the callout.",
        title: "Grading complete",
        description: "Your submission scored 92/100 — view the detailed feedback.",
        icon: <CheckCircleIcon />,
        actionLabel: "View feedback",
    },
    {
        status: "warning",
        label: "Warning",
        when: "Push the user to handle something due soon the moment they read the notice.",
        title: "1 exercise still unsubmitted",
        description: "The \"API Gateway\" milestone closes in 2 days.",
        icon: <RocketLaunchIcon />,
        actionLabel: "Submit now",
    },
]
