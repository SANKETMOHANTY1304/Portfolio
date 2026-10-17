import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/server/services/portfolio";
import { PortfolioSection } from "@/components/portfolio-section";
import { ChapterPagination } from "@/components/chapter-pagination";
export const metadata: Metadata = {
  title: "Selected projects",
  alternates: { canonical: "/projects" },
};
export default async function Page() {
  const data = await getPortfolio();
  return (
    <main id="main" className="chapter-page chapter-projects">
      <div className="chapter-breadcrumb container">
        <Link href="/">Portfolio</Link>
        <span>/</span>
        <span>Selected projects</span>
      </div>
      <PortfolioSection section="projects" data={data} />
      <ChapterPagination current="/projects" />
    </main>
  );
}
