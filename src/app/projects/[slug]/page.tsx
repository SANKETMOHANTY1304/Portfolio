import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Github } from "@/components/brand-icons";
import { getPortfolio } from "@/server/services/portfolio";
import { ProjectVisual } from "@/components/project-visual";
import { Button } from "@/components/ui/button";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = (await getPortfolio()).projects.find((p) => p.slug === slug);
  return p
    ? {
        title: p.title,
        description: p.summary,
        alternates: { canonical: `/projects/${p.slug}` },
        openGraph: {
          title: p.title,
          description: p.summary,
          url: `/projects/${p.slug}`,
        },
      }
    : { title: "Project not found" };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = (await getPortfolio()).projects;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next =
    projects[
      (projects.findIndex((v) => v.slug === slug) + 1) % projects.length
    ];
  return (
    <main id="main" className="container case-study">
      <Link href="/projects" className="text-link back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <p className="eyebrow">CASE STUDY / {p.category}</p>
      <h1>{p.title}</h1>
      <p className="case-summary">{p.summary}</p>
      <div className="case-actions">
        <div className="tech-tags">
          {p.technologies.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {p.repositoryUrl && (
          <Button asChild variant="outline">
            <a href={p.repositoryUrl} target="_blank" rel="noreferrer">
              <Github size={17} /> View repository
            </a>
          </Button>
        )}
        {p.demoUrl && (
          <Button asChild>
            <a href={p.demoUrl} target="_blank" rel="noreferrer">
              Live demo <ArrowUpRight size={16} />
            </a>
          </Button>
        )}
      </div>
      <div className="case-visual">
        {p.cover ? (
          <Image
            src={p.cover}
            alt={p.coverAlt || p.title}
            width={1200}
            height={600}
          />
        ) : (
          <ProjectVisual kind={p.visual} />
        )}
      </div>
      <p className="visual-caption">
        Conceptual illustration · not a product screenshot or benchmark
      </p>
      {p.workRelated && (
        <p className="proprietary-note">
          <ShieldCheck size={19} /> Industry project. This overview covers my
          contributions without sharing proprietary code or internal artifacts.
        </p>
      )}
      <div className="case-layout">
        <aside className="case-toc">
          <span className="mono">IN THIS CASE STUDY</span>
          <nav aria-label="Case study sections">
            {p.sections.map((s, i) => (
              <a href={`#section-${i}`} key={i}>
                {String(i + 1).padStart(2, "0")} {s.title}
              </a>
            ))}
          </nav>
        </aside>
        <div>
          {p.sections.map((s, i) => (
            <section className="case-section" id={`section-${i}`} key={i}>
              <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
              <h2>{s.title}</h2>
              {s.body
                .split("\n")
                .filter(Boolean)
                .map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
            </section>
          ))}
          {p.images.length > 0 && (
            <section className="case-section">
              <h2>Screenshots & diagrams</h2>
              {p.images.map((img) => (
                <figure key={img.url}>
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={1000}
                    height={650}
                    className="case-screenshot"
                  />
                  <figcaption>{img.alt}</figcaption>
                </figure>
              ))}
            </section>
          )}
        </div>
      </div>
      {next && next.slug !== p.slug && (
        <Link href={`/projects/${next.slug}`} className="next-project">
          <span className="eyebrow">NEXT PROJECT</span>
          <h2>
            {next.title}
            <ArrowUpRight />
          </h2>
        </Link>
      )}
    </main>
  );
}
