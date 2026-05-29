import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the lesson-video overlay state from {@link OverlayStateContext}.
 * @returns the lesson-video overlay state handle.
 */
export const useLessonVideoOverlayState = () => {
    const { lessonVideo } = use(OverlayStateContext)!
    return lessonVideo
}
