import {NextConfig} from "next"
import createNextIntlPlugin from "next-intl/plugin"
 
const nextConfig: NextConfig = {
    experimental: {
        // Rewrite `@heroui/react` barrel imports to direct sub-paths so a Server
        // Component pulling only e.g. Typography doesn't transitively load Toast
        // (which imports `client-only`) — webpack enforces that boundary strictly.
        optimizePackageImports: ["@heroui/react"],
    },
}
 
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)