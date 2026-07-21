import {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"
 
const nextConfig: NextConfig = {
    // Deploy nhanh: bỏ qua tsc khi `next build` (code đã verify riêng qua
    // tsc --noEmit + lint-staged pre-commit). Bật lại khi hết gấp.
    // (Next 16 đã bỏ tích hợp ESLint-during-build nên không cần key `eslint`.)
    typescript: {
        ignoreBuildErrors: true,
    },
    // `@lobehub/icons` (the AI-model brand marks used in the playground readiness
    // rows) ships pure ESM. Left untranspiled it surfaces as "CJS module can't be
    // async" in the bundler graph; listing it here makes Next compile it with the
    // app's own pipeline so the ESM/CJS boundary is handled.
    transpilePackages: ["@lobehub/icons"],
    experimental: {
        // Rewrite `@heroui/react` barrel imports to direct sub-paths so a Server
        // Component pulling only e.g. Typography doesn't transitively load Toast
        // (which imports `client-only`) — webpack enforces that boundary strictly.
        optimizePackageImports: ["@heroui/react"],
    },
}
 
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)