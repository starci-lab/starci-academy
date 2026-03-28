import { ChainId } from "@/modules/types"

// we represent as a function to ensure optional loading or logic processing
export const iconAssetConfig = () => ({
    icon: {
        kani: {
            default: "/kani/kani-default.png",
            pools: "/kani/kani-pools.png",
            notFound: "/kani/kani-not-found.png",
        },
        chains: {
            solana: "/icons/chains/solana.png",
            sui: "/icons/chains/sui.png",
        },
        tokens: {
            solana: "/icons/tokens/solana.png",
            sui: "/icons/tokens/sui.png",
        },
    }
})

export const getChainAssets = (chainId: ChainId) => {
    switch (chainId) {
    case ChainId.Solana:
        return {
            icon: iconAssetConfig().icon.chains.solana,
            token: iconAssetConfig().icon.tokens.solana
        }
    case ChainId.Sui:
        return {
            icon: iconAssetConfig().icon.chains.sui,
            token: iconAssetConfig().icon.tokens.sui,
        }
    default:
        throw new Error("Chain not supported")
    }
}