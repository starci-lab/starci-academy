import {
    GraphQLHeadersKey,
    queryTemplateCvs,
} from "@/modules/api"
import { useAppDispatch } from "@/redux"
import { setTemplateCvs } from "@/redux/slices"
import { useLocale } from "next-intl"
import useSWR from "swr"

/**
 * SWR query core for the template CVs query.
 * @returns the SWR query handle.
 */
export const useQueryTemplateCvsSwrCore = () => {
    const locale = useLocale()
    const dispatch = useAppDispatch()
    const swr = useSWR(
        [
            "QUERY_TEMPLATE_CVS_SWR",
            locale,
        ],
        async () => {
            const response = await queryTemplateCvs({
                debug: false,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })

            const wrapped = response.data?.templateCvs
            if (!wrapped) {
                throw new Error("Template CVs not found")
            }
            if (!wrapped.success) {
                throw new Error(wrapped.error || wrapped.message || "Template CVs not found")
            }
            const payload = wrapped.data ?? []
            dispatch(setTemplateCvs(payload))
            return payload
        },
    )

    return swr
}
