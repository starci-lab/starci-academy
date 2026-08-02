import { LessonVideoKind as RealLessonVideoKind } from "@/modules/types/enums/lesson-video-kind"
import { VideoHostPlatform as RealVideoHostPlatform } from "@/modules/types/enums/video-host-platform"
import { LessonVideoKind, VideoHostPlatform } from "./component"

/**
 * `src`'s `LessonVideoKind` -> the blueprint's own `LessonVideoKind`. Same string
 * values, but distinct TS enum declarations (structurally incompatible), so the
 * connected file converts explicitly rather than casting.
 *
 * @param raw - The real entity's kind.
 * @returns The matching blueprint {@link LessonVideoKind}.
 */
export const toLessonVideoKind = (raw: RealLessonVideoKind): LessonVideoKind => {
    switch (raw) {
    case RealLessonVideoKind.EditedStream:
        return LessonVideoKind.EditedStream
    case RealLessonVideoKind.PremiumRecord:
        return LessonVideoKind.PremiumRecord
    case RealLessonVideoKind.RawStream:
    default:
        return LessonVideoKind.RawStream
    }
}

/**
 * `src`'s `VideoHostPlatform` -> the blueprint's own `VideoHostPlatform`. Same
 * string values, but distinct TS enum declarations — converted explicitly.
 *
 * @param raw - The real entity's host platform.
 * @returns The matching blueprint {@link VideoHostPlatform}.
 */
export const toVideoHostPlatform = (raw: RealVideoHostPlatform): VideoHostPlatform => {
    switch (raw) {
    case RealVideoHostPlatform.GoogleDrive:
        return VideoHostPlatform.GoogleDrive
    case RealVideoHostPlatform.Vimeo:
        return VideoHostPlatform.Vimeo
    case RealVideoHostPlatform.CloudflareStream:
        return VideoHostPlatform.CloudflareStream
    case RealVideoHostPlatform.Other:
        return VideoHostPlatform.Other
    case RealVideoHostPlatform.Youtube:
    default:
        return VideoHostPlatform.Youtube
    }
}
