/** Nested challenge configuration within the system config payload. */
export interface SystemConfigChallengeData {
    /** Minimum score (0–1) required to pass a challenge. */
    passThreshold: number
}

/** Mounted `systemConfig` payload (GraphQL: `systemConfig.data`). */
export interface SystemConfigData {
    /** Challenge-specific system configuration. */
    challenge: SystemConfigChallengeData
}
