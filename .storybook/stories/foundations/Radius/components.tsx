/** A square filled with light accent to make the token's corner radius clearly visible. */
export const Swatch = ({ cls }: { cls: string }) => (
    <div className={`size-10 bg-accent/15 ${cls}`} />
)

export interface RadiusItem {
    token: string
    px: string
    swatchCls: string
    use: string
}

export interface ConcentricItem {
    layer: string
    token: string
    px: string
    calc: string
}
