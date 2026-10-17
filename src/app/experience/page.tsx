import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/server/services/portfolio";
import { PortfolioSection } from "@/components/portfolio-section";
import { ChapterPagination } from "@/components/chapter-pagination";
export const metadata: Metadata = {
  title: "Experience",
  alternates: { canonical: "/experience" },
};
export default async function Page() {
  const data = await getPortfolio();
  return (
    <main id="main" className="chapter-page chapter-experience">
      <div className="chapter-breadcrumb container">
        <Link href="/">Portfolio</Link>
        <span>/</span>
        <span>Experience</span>
      </div>
      <PortfolioSection section="experience" data={data} />
      <ChapterPagination current="/experience" />
    </main>
  );
}
