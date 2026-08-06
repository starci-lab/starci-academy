/** Inputs for {@link truncateMiddle}. */
export interface TruncateMiddleParams {
    str: string
    front?: number
    back?: number
}
/** Truncates a string in the middle with an ellipsis. */
export const truncateMiddle = (
    { str, front = 6, back = 4 }: TruncateMiddleParams
): string => {
    if (str.length <= front + back) return str
    return `${str.substring(0, front)}...${str.substring(str.length - back)}`
}

/** Inputs for {@link truncateEnd}. */
export interface TruncateEndParams {
    str: string | undefined
    maxLength?: number
}

/** Truncates a string at the end with an ellipsis. */
export const truncateEnd = (
    { str, maxLength = 12  }: TruncateEndParams
) => {
    if (!str) return ""
    if (str.length <= maxLength) return str
    return str.slice(0, maxLength) + "..."
}