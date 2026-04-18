import { useAppSelector } from "@/redux"
import { useReactFlow } from "@xyflow/react"
import { useEffect } from "react"

/**
 * The hook to fit the mind map view.
 */
export const useMindMapFitView = () => {
    /** The course entity. */
    const entity = useAppSelector((state) => state.course.entity)
    /** The React Flow fit view. */
    const { fitView } = useReactFlow()
    /** The useEffect to fit the mind map view. */
    useEffect(() => {
        /** If the entity is not found, return. */
        if (!entity) {
            return
        }
        /** The request animation frame to fit the mind map view. */
        const id = requestAnimationFrame(() => {
            fitView({ padding: 0.2 })
        })
        /** The cleanup function to cancel the request animation frame. */
        return () => cancelAnimationFrame(id)
    }, [entity, entity?.id, entity?.modules?.length, fitView])
}