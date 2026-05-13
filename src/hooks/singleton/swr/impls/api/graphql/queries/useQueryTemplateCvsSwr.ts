import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryTemplateCvsSwr = () => {
    const context = use(SwrContext)
    if (!context) {
        throw new Error("SwrContext not found")
    }
    return context.queryTemplateCvsSwr
}
