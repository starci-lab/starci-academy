import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ProofStrip` — the landing's one honest proof strip. Two stats are DERIVED
 * from the real catalog (product count, total plans), so the leaf shows two
 * catalog inputs to prove the numbers are computed, not hardcoded. Grounded in
 * the streamlined two-product catalog.
 */

/** One catalog product, reduced to what the proof counts need. */
export interface ProofProduct {
    /** Catalog item id. */
    id: string
    /** How many pricing plans (tiers) this product offers. */
    planCount: number
}

/** The already-resolved copy the strip renders. */
export interface ProofStripLabels {
    /** Label under the product count (e.g. "Products"). */
    productsLabel: string
    /** Label under the total-plans count (e.g. "Pricing plans"). */
    plansLabel: string
    /** The qualitative infrastructure value (e.g. "Self-hosted"). */
    infrastructureValue: string
    /** Label under the infrastructure value (e.g. "Runs where you control it"). */
    infrastructureLabel: string
}

/** Props for {@link ProofStrip}. */
export interface ProofStripProps {
    /** The real catalog products — the numeric stats are derived from these. */
    products: Array<ProofProduct>
    /** Already-localized copy. */
    labels: ProofStripLabels
}

/** One stat cell: a bold value over a muted label. */
const Stat = ({ value, label }: { value: string; label: string }) => (
    <StackV
        gap={1}
        align="center"
        principle="name-handle"
        items={[
            () => <Typography size="h3" weight="bold" align="center" text={value} />,
            () => <Typography size="sm" color="muted" align="center" text={label} />,
        ]}
    />
)

/**
 * The proof strip. See the file header for why the first two values are derived
 * from the passed products and never hardcoded.
 *
 * @param props - {@link ProofStripProps}
 */
const ProofStrip = ({ products, labels }: ProofStripProps) => {
    const productCount = products.length
    const planCount = products.reduce((total, product) => total + product.planCount, 0)

    return (
        <div data-tier="block" data-component="ProofStrip">
            <SurfaceCard
                padding={3}
                body={() => (
                    <Grid
                        columns={{ base: 1, sm: 3 }}
                        principle="block-boundary"
                        items={[
                            { key: "products", content: () => <Stat value={String(productCount)} label={labels.productsLabel} /> },
                            { key: "plans", content: () => <Stat value={String(planCount)} label={labels.plansLabel} /> },
                            { key: "infra", content: () => <Stat value={labels.infrastructureValue} label={labels.infrastructureLabel} /> },
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { ProofStrip }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ProofStrip" } as const
