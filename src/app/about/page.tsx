import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/server/services/portfolio";
import { PortfolioSection } from "@/components/portfolio-section";
import { ChapterPagination } from "@/components/chapter-pagination";
export const metadata: Metadata = {
  title: "About & approach",
  alternates: { canonical: "/about" },
};
export default async function Page() {
  const data = await getPortfolio();
  return (
    <main id="main" className="chapter-page chapter-about">
      <div className="chapter-breadcrumb container">
        <Link href="/">Portfolio</Link>
        <span>/</span>
        <span>About & approach</span>
      </div>
      <PortfolioSection section="about" data={data} />
      <ChapterPagination current="/about" />
    </main>
  );
}
