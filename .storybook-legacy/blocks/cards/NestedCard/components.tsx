import { Typography } from "@heroui/react"
import { NestedCardSection } from "@/components/blocks/cards/NestedCard"

export const relatedSections = (
    <>
        <NestedCardSection
            eyebrow="Relational databases"
            title="Data normalization and normal forms"
        >
            <Typography type="body-sm" color="muted">
                Normalization splits data into multiple tables to reduce redundancy and update anomalies.
            </Typography>
        </NestedCardSection>
        <NestedCardSection
            eyebrow="Database review deck"
            title="When should you denormalize to optimize reads?"
        />
    </>
)
