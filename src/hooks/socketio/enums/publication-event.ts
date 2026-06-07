/** Socket.IO publication event names (client → server). */
export enum PublicationEvent {
    GlobalSearch = "autocomplete.global_search.publication",
    SubscribeJobNotification = "job_notifications.subscribe_job_notification.publication",
    /** Join a content's discussion room (must match backend). */
    SubscribeContentDiscussion = "content_discussion.subscribe.publication",
}
