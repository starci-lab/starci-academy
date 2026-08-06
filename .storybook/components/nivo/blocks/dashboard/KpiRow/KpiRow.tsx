import { Grid } from "@sb-components/frames/Grid/Grid"
import { KpiTile, type KpiTileProps } from "@sb-components/nivo/blocks/dashboard/KpiTile/KpiTile"

/**
 * `KpiRow` — the account-health stat row: one `KpiTile` per figure, laid out
 * on the shared `Grid` frame. `items`: the four-figure default plus a shorter
 * set prove the row reflows from data instead of assuming a fixed four-cell
 * shape.
 */

/** One tile's data, keyed for the grid. */
export interface KpiRowItem extends KpiTileProps {
    /** Stable React key. */
    key: string
}

/** Props for {@link KpiRow}. */
export interface KpiRowProps {
    /** The stat tiles, in reading order. */
    items: Array<Omit<KpiRowItem, "isSkeleton">>
    /**
     * `true` → every tile's own first fetch is in flight: each shimmers in
     * place, matching the loaded shape. Threaded straight down — never fed to
     * a separate skeleton tree.
     */
    isSkeleton?: boolean
}

/**
 * The stat row. See the file header for why the column count is a `Grid`
 * concern and the tile count is data, not a fixed shape.
 *
 * @param props - {@link KpiRowProps}
 */
const KpiRow = ({ items, isSkeleton = false }: KpiRowProps) => (
    <div data-tier="block" data-component="KpiRow">
        <Grid
            columns={{ base: 1, sm: 2, lg: 4 }}
            principle="content-row"
            isSkeleton={isSkeleton}
            items={items.map(({ key, ...tile }) => ({
                key,
                content: () => <KpiTile {...tile} isSkeleton={isSkeleton} />,
            }))}
        />
    </div>
)

export { KpiRow }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "KpiRow" } as const
