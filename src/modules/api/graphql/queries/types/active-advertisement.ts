import type { GraphQLResponse } from "../../types"

/** Media kind of an ad banner (mirrors backend `AdvertisementMediaType`). */
export enum AdvertisementMediaType {
    /** A single poster image. */
    Image = "image",
    /** A video clip. */
    Video = "video",
    /** An auto-advancing slideshow. */
    Carousel = "carousel",
}

/** `media` payload for an image ad. */
export interface AdvertisementImageMedia {
    /** Poster image URL. */
    url: string
}

/** `media` payload for a video ad. */
export interface AdvertisementVideoMedia {
    /** Video source URL. */
    url: string
    /** Optional poster shown before playback. */
    poster?: string
    /** Autoplay on mount (requires muted). */
    autoplay?: boolean
    /** Loop playback. */
    loop?: boolean
    /** Start muted. */
    muted?: boolean
}

/** One slide of a carousel ad. */
export interface AdvertisementCarouselSlide {
    /** Slide image URL. */
    url: string
    /** Optional per-slide click destination. */
    link?: string
}

/** `media` payload for a carousel ad. */
export interface AdvertisementCarouselMedia {
    /** Ordered slides. */
    slides: Array<AdvertisementCarouselSlide>
    /** Auto-advance interval in ms. */
    intervalMs?: number
}

/** Discriminated `media` union (narrow by the row's `mediaType`). */
export type AdvertisementMedia =
    | AdvertisementImageMedia
    | AdvertisementVideoMedia
    | AdvertisementCarouselMedia

/** Payload inside `activeAdvertisement.data` (null when no active ad). */
export interface QueryActiveAdvertisementData {
    /** Advertisement id. */
    id: string
    /** Media kind — narrow `media` by this. */
    mediaType: AdvertisementMediaType
    /** Discriminated media payload (JSON scalar from the API). */
    media: AdvertisementMedia
    /** Banner title (locale-resolved). */
    title: string
    /** CTA label (locale-resolved), or null. */
    ctaText: string | null
    /** Click destination for the whole banner. */
    linkUrl: string
    /** Sponsor name (paid slot), or null for the house ad. */
    sponsorName: string | null
}

/** Apollo response shape for `activeAdvertisement`. */
export interface QueryActiveAdvertisementResponse {
    /** Top-level field wrapping the standard API response. */
    activeAdvertisement: GraphQLResponse<QueryActiveAdvertisementData | null>
}
