import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/server/services/portfolio";
import { PortfolioSection } from "@/components/portfolio-section";
import { ChapterPagination } from "@/components/chapter-pagination";
export const metadata: Metadata = {
  title: "Get in touch",
  alternates: { canonical: "/contact" },
};
export default async function Page() {
  const data = await getPortfolio();
  return (
    <main id="main" className="chapter-page chapter-contact">
      <div className="chapter-breadcrumb container">
        <Link href="/">Portfolio</Link>
        <span>/</span>
        <span>Get in touch</span>
      </div>
      <PortfolioSection section="contact" data={data} />
      <ChapterPagination current="/contact" />
    </main>
  );
}
