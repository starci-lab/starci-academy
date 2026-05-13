import {
    GraphQLHeadersKey,
    queryTemplateCvs,
} from "@/modules/api"
import { useLocale } from "next-intl"
import useSWR from "swr"

export const useQueryTemplateCvsSwrCore = () => {
    const locale = useLocale()
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

            const payload = response.data?.templateCvs?.data
            if (!payload) {
                throw new Error(response.data?.templateCvs?.error || "Template CVs not found")
            }

            return payload
        },
    )

    return swr
}
