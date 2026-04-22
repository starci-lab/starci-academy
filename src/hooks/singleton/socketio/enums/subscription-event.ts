/** Socket.IO subscription event names. */
export enum SubscriptionEvent {
    GlobalSearch = "autocomplete.global_search.subscription",
    /** Must match the backend `SubscriptionEvent.JobStatusUpdated` string. */
    JobStatusUpdated = "job_notifications.job_status_updated.subscription",
}
