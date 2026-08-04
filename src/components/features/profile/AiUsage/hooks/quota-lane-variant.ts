/** Which AI lane {@link useQuotaLaneData} derives (data from SWR, not props). */
export enum QuotaLaneVariant {
    /** Free Auto lane — credit windows from `myCreditUsage`. */
    Auto = "auto",
    /** Paid Premium lane — limits from `myAiQuota`. */
    Premium = "premium",
}
