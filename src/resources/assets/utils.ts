import { ExplorerAssetConfig } from "./types"

export const getAsset = (assets: ExplorerAssetConfig) => {
    // we prefer svg over png over jpg
    return assets?.svg || assets?.png || assets?.jpg || ""
}