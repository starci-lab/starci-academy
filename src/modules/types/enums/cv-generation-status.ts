/**
 * Lifecycle state of an AI CV generation/revision (matches backend `CvGenerationStatus`).
 */
export enum CvGenerationStatus {
    /** The generation is queued and waiting to be processed. */
    Pending = "Pending",
    /** The generation is actively being produced by the AI. */
    Processing = "Processing",
    /** The generation finished and `latexSource` is available. */
    Done = "Done",
    /** The generation failed; `latexSource` is null. */
    Failed = "Failed",
}
