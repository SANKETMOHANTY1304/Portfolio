"use client";
import { useState } from "react";
import {
  Code2,
  BrainCircuit,
  Layers3,
  Database,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import type { Skill, Certification } from "@/lib/content-schema";
const icons = [Code2, BrainCircuit, Layers3, Database, Wrench];
export function Skills({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];
  const [active, setActive] = useState("All skills");
  return (
    <>
      <div
        className="filter-tabs skills-tabs"
        role="group"
        aria-label="Filter skills"
      >
        {["All skills", ...categories].map((c) => (
          <button
            key={c}
            aria-pressed={active === c}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="skills-grid">
        {categories
          .filter((c) => active === "All skills" || active === c)
          .map((category, i) => {
            const Icon = icons[i % icons.length];
            return (
              <article className="skill-group" key={category}>
                <Icon size={23} strokeWidth={1.5} />
                <h3>{category}</h3>
                <div className="skill-pills">
                  {skills
                    .filter((s) => s.category === category)
                    .map((s) =>
                      s.evidenceUrl ? (
                        <a
                          key={s.id || s.name}
                          href={s.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {s.name}
                          <ArrowUpRight size={12} />
                        </a>
                      ) : (
                        <span key={s.id || s.name}>{s.name}</span>
                      ),
                    )}
                </div>
              </article>
            );
          })}
      </div>
    </>
  );
}
export function Certifications({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [active, setActive] = useState("All");
  const cats = [...new Set(certifications.map((c) => c.category))];
  if (!certifications.length)
    return (
      <div className="credential-empty">
        <span className="credential-symbol">↗</span>
        <div>
          <h3>Learning is part of the work.</h3>
          <p>Verified certifications and credentials will be shared here.</p>
        </div>
        <span className="mono">CONTINUOUS LEARNING</span>
      </div>
    );
  return (
    <>
      <div
        className="filter-tabs"
        role="group"
        aria-label="Filter certifications"
      >
        {["All", ...cats].map((c) => (
          <button
            key={c}
            aria-pressed={active === c}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="education-grid">
        {certifications
          .filter((c) => active === "All" || active === c.category)
          .map((c) => (
            <article className="education-card" key={c.id}>
              <span className="eyebrow">{c.category}</span>
              <h3>{c.title}</h3>
              <p>{c.issuer}</p>
              <small>{c.issueDate}</small>
              <details>
                <summary>Credential details</summary>
                {c.credentialId && <p>ID: {c.credentialId}</p>}
                <div className="tech-tags">
                  {c.skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                {c.verificationUrl && (
                  <a
                    href={c.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Verify credential ↗
                  </a>
                )}
                {c.previewUrl && (
                  <a
                    href={c.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    View certificate ↗
                  </a>
                )}
              </details>
            </article>
          ))}
      </div>
    </>
  );
}
