/** Promise that resolves after `ms` milliseconds. */
export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}