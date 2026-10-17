"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Search,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Github } from "@/components/brand-icons";
import type { Project } from "@/lib/content-schema";
import { ProjectVisual } from "@/components/project-visual";
const categories = [
  "All work",
  "Generative AI",
  "AI/ML",
  "Deep Learning",
  "Data Science",
  "Backend",
  "Full-Stack",
];
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All work");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const resultsHeading = useRef<HTMLParagraphElement>(null);
  const pageSize = 3;
  const visible = [...projects]
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        a.displayOrder - b.displayOrder,
    )
    .filter(
      (p) =>
        (category === "All work" || p.category === category) &&
        `${p.title} ${p.summary} ${p.technologies.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageProjects = visible.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }
  return (
    <>
      <div className="gallery-toolbar">
        <div className="filter-tabs" role="group" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search projects</span>
          <input
            placeholder="Find a project"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>
      <p
        className="gallery-results"
        aria-live="polite"
        tabIndex={-1}
        ref={resultsHeading}
      >
        <span>
          {visible.length
            ? String((currentPage - 1) * pageSize + 1).padStart(2, "0") +
              "–" +
              String(Math.min(currentPage * pageSize, visible.length)).padStart(
                2,
                "0",
              )
            : "0"}{" "}
          / {visible.length} PROJECTS
        </span>
        <span>
          PAGE {currentPage} OF {pageCount}
        </span>
      </p>
      <div className="project-grid">
        {pageProjects.map((p) => (
          <article className="project-card" key={p.slug}>
            {p.cover ? (
              <div className="project-cover">
                <Image
                  src={p.cover}
                  alt={p.coverAlt || p.title}
                  fill
                  sizes="(max-width: 600px) 100vw, 45vw"
                />
              </div>
            ) : (
              <ProjectVisual kind={p.visual} />
            )}
            <div className="project-card-body">
              <div className="project-eyebrow">
                <span>{p.category}</span>
                {p.workRelated && (
                  <span className="work-label">Industry project</span>
                )}
              </div>
              <Link href={`/projects/${p.slug}`} className="project-title">
                <h3>{p.title}</h3>
                <ArrowUpRight size={22} />
              </Link>
              <p>{p.summary}</p>
              <div className="tech-tags">
                {p.technologies.slice(0, 5).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="project-bottom">
                <Link href={`/projects/${p.slug}`}>
                  Explore case study <ArrowUpRight size={15} />
                </Link>
                <div>
                  {p.repositoryUrl && (
                    <a
                      href={p.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${p.title} source code`}
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {p.demoUrl && (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${p.title} live demo`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="project-pagination" aria-label="Project results pages">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            aria-label="Previous project results page"
          >
            <ArrowLeft size={16} />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
            <button
              type="button"
              key={number}
              aria-label={"Project results page " + number}
              aria-current={currentPage === number ? "page" : undefined}
              onClick={() => changePage(number)}
            >
              {String(number).padStart(2, "0")}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => changePage(currentPage + 1)}
            aria-label="Next project results page"
          >
            <ArrowRight size={16} />
          </button>
        </nav>
      )}
      {!visible.length && (
        <div className="empty-state">
          <Search />
          <h3>No matching projects</h3>
          <p>Try another category or search term.</p>
          <button
            className="text-link"
            onClick={() => {
              setSearch("");
              setCategory("All work");
              setPage(1);
            }}
          >
            Show all work →
          </button>
        </div>
      )}
    </>
  );
}
