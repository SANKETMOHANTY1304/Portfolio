import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chapters } from "@/lib/chapters";
export function ChapterPagination({ current }: { current: string }) {
  const index = chapters.findIndex((chapter) => chapter.href === current);
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  return (
    <nav className="chapter-pagination container" aria-label="Portfolio pages">
      <div className="chapter-pagination-top">
        <p className="eyebrow">CONTINUE EXPLORING</p>
        <span className="mono">
          PAGE {index + 1} OF {chapters.length}
        </span>
      </div>
      <div className="chapter-pagination-links">
        {previous ? (
          <Link href={previous.href} className="chapter-previous">
            <ArrowLeft size={20} />
            <span>
              <small>Previous page</small>
              {previous.label}
            </span>
          </Link>
        ) : (
          <span className="chapter-start">Start with curiosity.</span>
        )}
        <div className="chapter-numbers">
          {chapters.map((chapter) => (
            <Link
              key={chapter.href}
              href={chapter.href}
              aria-label={`${chapter.label}, page ${Number(chapter.number) + 1}`}
              aria-current={current === chapter.href ? "page" : undefined}
            >
              {String(Number(chapter.number) + 1).padStart(2, "0")}
            </Link>
          ))}
        </div>
        {next ? (
          <Link href={next.href} className="chapter-next">
            <span>
              <small>Next page</small>
              {next.label}
            </span>
            <ArrowRight size={20} />
          </Link>
        ) : (
          <Link href="/" className="chapter-next">
            <span>
              <small>Back to the beginning</small>Home
            </span>
            <ArrowRight size={20} />
          </Link>
        )}
      </div>
    </nav>
  );
}
