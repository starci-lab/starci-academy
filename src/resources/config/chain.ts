import { iconAssetConfig } from "@/resources/assets"
import { ChainId } from "../../modules/types"

export interface ChainConfig {
    name: string
    iconUrl: string
    description: string
}

export const supportedChains = (): Array<ChainId> => ([
    ChainId.Solana,
    ChainId.Sui,
])

export const getChainConfig = (chainId: ChainId): ChainConfig => {
    switch (chainId) {
    case ChainId.Solana:
        return {
            name: "Solana",
            iconUrl: iconAssetConfig().icon.tokens.solana,
            description: "Solana's high trading volume enables more frequent yield opportunities. Select Solana if you want a more stable farming experience.",
        }
    case ChainId.Sui:
        return {
            name: "Sui",
            iconUrl: iconAssetConfig().icon.chains.sui,
            description: "Sui is a high-performance blockchain platform that enables fast and secure transactions.",
        }
    default:
        throw new Error("Chain not supported")
    }
}