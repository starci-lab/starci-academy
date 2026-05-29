import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the template CVs query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryTemplateCvsSwr = () => {
    const context = use(SwrContext)
    if (!context) {
        throw new Error("SwrContext not found")
    }
    return context.queryTemplateCvsSwr
}
