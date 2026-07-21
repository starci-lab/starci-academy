import { Typography } from "@heroui/react"
import { GearIcon } from "@phosphor-icons/react"

export const settingsItems = ["Edit profile", "Appearance", "Security", "Notifications"].map((title) => ({
    key: title,
    onPress: () => {},
    className: "flex items-center gap-3",
    content: (
        <>
            <GearIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
            <Typography type="body-sm" weight="medium" truncate>
                {title}
            </Typography>
        </>
    ),
}))

/** SM-2 grades shown by `RatingBar` below — same shape it exposes publicly (grade/label/hint). */
export const ratingOptions = [
    { grade: 0, label: "Forgot", hint: "Review now" },
    { grade: 1, label: "Hard", hint: "In 10 minutes" },
    { grade: 2, label: "Good", hint: "In 1 day" },
    { grade: 3, label: "Easy", hint: "In 4 days" },
]
