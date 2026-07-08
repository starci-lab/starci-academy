/**
 * Origin of a single item inside a CV block (`cv_blocks.blocks[].items[].source`).
 * Only meaningful on {@link CvBlockType.Project} items — every other block type's
 * items are implicitly self-reported and never carry this field.
 */
export enum CvBlockItemSource {
    /**
     * Picked from a passed capstone (`user_milestone_task_attempts.passed = true`)
     * via `myPickableCvAchievements` — the ONLY origin that feeds the trust score.
     * Carries `sourceRef` = the milestone task attempt id.
     */
    Verified = "verified",
    /** Typed manually by the learner — never scored. */
    Self = "self",
}
