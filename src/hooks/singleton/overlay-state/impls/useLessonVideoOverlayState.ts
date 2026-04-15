import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLessonVideoOverlayState = () => {
    const { lessonVideo } = use(OverlayStateContext)!
    return {
        isOpen: lessonVideo.isOpen,
        onOpen: lessonVideo.open,
        onClose: lessonVideo.close,
        onOpenChange: lessonVideo.setOpen,
    }
}
