import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getPortfolio } from "@/server/services/portfolio";
import { PrintButton } from "@/components/print-button";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = {
  title: "Resume",
  alternates: { canonical: "/resume" },
};
export default async function Resume() {
  const p = await getPortfolio();
  return (
    <main id="main" className="container resume-page">
      <div className="resume-actions">
        <PrintButton />
        {p.profile.resumeUrl && (
          <Button asChild>
            <a href={p.profile.resumeUrl} download>
              <Download size={16} /> Download original PDF
            </a>
          </Button>
        )}
      </div>
      <article className="resume-paper">
        <h1>{p.profile.name}</h1>
        <p className="resume-designation">{p.profile.designation}</p>
        <p>
          <a href={`mailto:${p.profile.email}`}>{p.profile.email}</a>
          {p.profile.showPhone && p.profile.phone && ` · ${p.profile.phone}`}
        </p>
        <div className="resume-social">
          {p.social.map((s) => (
            <a key={s.id} href={s.url}>
              {s.label}: {s.url.replace("https://", "")}
            </a>
          ))}
        </div>
        <section>
          <h2>Professional summary</h2>
          <p>{p.profile.about}</p>
        </section>
        <section>
          <h2>Experience</h2>
          {p.experience.map((e) => (
            <div className="resume-entry" key={e.id}>
              <h3>
                {e.position} — {e.company}
              </h3>
              <p className="resume-meta">
                {e.startDate} – {e.endDate} · {e.location}
              </p>
              <ul>
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2>Selected projects</h2>
          {p.projects.map((project) => (
            <div className="resume-entry" key={project.slug}>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <p className="resume-meta">{project.technologies.join(" · ")}</p>
              {project.repositoryUrl && (
                <a href={project.repositoryUrl}>{project.repositoryUrl}</a>
              )}
            </div>
          ))}
        </section>
        <section>
          <h2>Technical skills</h2>
          {[...new Set(p.skills.map((s) => s.category))].map((c) => (
            <p key={c}>
              <strong>{c}:</strong>{" "}
              {p.skills
                .filter((s) => s.category === c)
                .map((s) => s.name)
                .join(", ")}
            </p>
          ))}
        </section>
        <section>
          <h2>Education</h2>
          {p.education.map((e) => (
            <div className="resume-entry" key={e.id}>
              <h3>
                {e.degree}
                {e.specialization && ` in ${e.specialization}`}
              </h3>
              <p>
                {e.institution} · {e.startDate} – {e.endDate}
              </p>
            </div>
          ))}
        </section>
        {p.certifications.length > 0 && (
          <section>
            <h2>Certifications</h2>
            {p.certifications.map((c) => (
              <p key={c.id}>
                {c.title} — {c.issuer} {c.issueDate}
              </p>
            ))}
          </section>
        )}
      </article>
    </main>
  );
}
