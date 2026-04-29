import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLessonVideoOverlayState = () => {
    const { lessonVideo } = use(OverlayStateContext)!
    return lessonVideo
}
