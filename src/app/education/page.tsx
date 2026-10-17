import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/server/services/portfolio";
import { PortfolioSection } from "@/components/portfolio-section";
import { ChapterPagination } from "@/components/chapter-pagination";
export const metadata: Metadata = {
  title: "Education & credentials",
  alternates: { canonical: "/education" },
};
export default async function Page() {
  const data = await getPortfolio();
  return (
    <main id="main" className="chapter-page chapter-education">
      <div className="chapter-breadcrumb container">
        <Link href="/">Portfolio</Link>
        <span>/</span>
        <span>Education & credentials</span>
      </div>
      <PortfolioSection section="education" data={data} />
      <ChapterPagination current="/education" />
    </main>
  );
}
