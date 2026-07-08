/**
 * The kind of a CV block (`cv_blocks.blocks[].type`) — drives which per-block
 * editor component + PDF template partial renders it. Mirrors the frozen block
 * table in `CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md` ("CHỐT CUỐI").
 */
export enum CvBlockType {
    /** Name / contact row — required, always present, not repeatable. */
    Personal = "personal",
    /** Summary / objective paragraph — optional AI-assisted prose. */
    Summary = "summary",
    /** Work experience entries (company, role, dates, bullets). */
    Experience = "experience",
    /** Education entries (school, degree, dates). */
    Education = "education",
    /** Skills — suggested from course tech-stack + freeform additions. */
    Skills = "skills",
    /**
     * Project entries — the ONLY block that feeds the trust score. Items are
     * either picked from a passed capstone (`verified`) or typed manually
     * (`self`) — see {@link CvBlockItemSource}.
     */
    Project = "project",
    /** Freeform achievements (outside awards) — self-reported, not scored. */
    Achievement = "achievement",
    /** Certification entries (name, issuer, date) — self-reported, no AI. */
    Certification = "certification",
    /** Language entries (name, proficiency level) — self-reported, no AI. */
    Language = "language",
    /** Extracurricular / volunteering entries (title, description) — AI-assisted like Achievement. */
    Activity = "activity",
    /** Freeform interests, one item per interest (like Skills) — self-reported, no AI. */
    Interest = "interest",
}
