/**
 * Block entry for course progress lanes. Implementation lives in the
 * {@link CourseProgressBar} composite (Storybook-authored, then synced to `src`);
 * this path stays so product importers keep a stable block import.
 */
export {
    CourseProgressBar,
    type CourseProgressBarProps,
    type CourseProgressDimension,
} from "@/components/composites/stats/CourseProgressBar"
