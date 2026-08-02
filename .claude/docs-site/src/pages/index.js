import React from "react"
import Link from "@docusaurus/Link"
import Layout from "@theme/Layout"

export default function Home() {
  return (
    <Layout title="StarCi · Claude Canon" description="The source an AI reads to build the design system safely.">
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: ".5rem" }}>StarCi · Claude Canon</h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8, lineHeight: 1.6 }}>
          Toàn bộ luật của design-system Storybook — <b>viết cho AI đọc</b> để build/mở rộng
          an toàn. Site này render <code>.claude/</code> <b>tại chỗ</b> (không copy): nguồn-sự-thật
          vẫn ở <code>.claude/&#123;design,rules,skills&#125;/</code>, Docusaurus chỉ trỏ vào.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <Link className="button button--primary button--lg" to="/docs/design/test-strategy">
            Test strategy (DOM-contract) →
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/design/storybook/architecture/split">
            Kiến trúc (split · tiers · principles) →
          </Link>
        </div>
        <p style={{ marginTop: "2.5rem", fontSize: ".95rem", opacity: 0.7 }}>
          <b>Cách chạy:</b> <code>cd .claude/docs-site &amp;&amp; npm install &amp;&amp; npm start</code> → <code>localhost:3030</code>.
        </p>
      </main>
    </Layout>
  )
}
