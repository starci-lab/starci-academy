import { DiscloresureContext } from "../DiscloresureContext"
import { use } from "react"

export const useLessonVideoDisclosure = () => {
    const { lessonVideo } = use(DiscloresureContext)!
    return lessonVideo
}
