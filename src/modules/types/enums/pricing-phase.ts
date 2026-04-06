/**
 * Tier key for course pricing (matches GraphQL `GraphQLTypePricingPhase` / DB `phase`).
 */
export enum PricingPhase {
    Pioneer = "pioneer",
    EarlyBird = "earlyBird",
    Regular = "regular",
}
