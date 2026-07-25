/**
 * STORYBOOK-LOCAL copies of the lesson-video enums (`@/modules/types/enums/*`)
 * — inlined so the VideoRenderer port stays free of `@/` imports. Synced to
 * `src` later.
 */

/** Video delivery format for a lesson video. */
export enum LessonVideoType {
    /** Standard MP4 format. */
    Standard = "standard",
    /** MPEG-DASH adaptive streaming format. */
    MpegDash = "mpegDash",
}

/** Where the lesson video is hosted (YouTube, Drive, etc.). */
export enum VideoHostPlatform {
    /** YouTube — public or unlisted video. */
    Youtube = "youtube",
    /** Google Drive — shared MP4 or streaming link. */
    GoogleDrive = "googleDrive",
    /** Vimeo — hosted video with privacy controls. */
    Vimeo = "vimeo",
    /** Cloudflare Stream — CDN-delivered adaptive video. */
    CloudflareStream = "cloudflareStream",
    /** Any other hosting platform not explicitly listed. */
    Other = "other",
}

/** How the {@link VideoRenderer} should render the video. */
export enum VideoRendererType {
    /** Standard MP4 — native `<video>` with custom HeroUI controls. */
    Standard = "standard",
    /** MPEG-DASH adaptive streaming — dashjs player with quality selector. */
    MpegDash = "mpegDash",
    /** YouTube embed — iframe, no custom controls. */
    Youtube = "youtube",
}
