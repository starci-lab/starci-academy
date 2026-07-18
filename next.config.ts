import {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"
 
const nextConfig: NextConfig = {
    // Deploy nhanh: bỏ qua tsc khi `next build` (code đã verify riêng qua
    // tsc --noEmit + lint-staged pre-commit). Bật lại khi hết gấp.
    // (Next 16 đã bỏ tích hợp ESLint-during-build nên không cần key `eslint`.)
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        // Rewrite `@heroui/react` barrel imports to direct sub-paths so a Server
        // Component pulling only e.g. Typography doesn't transitively load Toast
        // (which imports `client-only`) — webpack enforces that boundary strictly.
        optimizePackageImports: ["@heroui/react"],
    },
}
 
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)