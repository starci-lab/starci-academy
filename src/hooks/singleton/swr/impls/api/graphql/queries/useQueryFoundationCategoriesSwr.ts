import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryFoundationCategoriesSwr = () => {
    const { queryFoundationCategoriesSwr } = use(SwrContext)!
    return queryFoundationCategoriesSwr
}
