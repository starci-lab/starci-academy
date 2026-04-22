/** Socket.IO publication event names. */
export enum PublicationEvent {
    GlobalSearch = "autocomplete.global_search.publication",
    /** Must match the backend `PublicationEvent.SubscribeJobNotification` string. */
    SubscribeJobNotification = "job_notifications.subscribe_job_notification.publication",
}