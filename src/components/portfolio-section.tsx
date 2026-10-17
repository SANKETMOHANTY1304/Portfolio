import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  FileText,
  Network,
  Braces,
  Database,
  GraduationCap,
  MapPin,
  Mail,
} from "lucide-react";
import { ProjectGallery } from "@/components/project-gallery";
import { Skills, Certifications } from "@/components/skills";
import { ContactForm, CopyEmail } from "@/components/contact-form";
import type { Portfolio } from "@/lib/content-schema";
function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span>{number}</span> / {label}
        </p>
        <h1>{title}</h1>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function PortfolioSection({
  section,
  data,
}: {
  section: string;
  data: Portfolio;
}) {
  const {
    profile,
    projects,
    experience,
    skills,
    education,
    certifications,
    social,
    achievements,
  } = data;
  const workIcons = [
    BrainCircuit,
    FileText,
    Network,
    Braces,
    BrainCircuit,
    Database,
  ];
  switch (section) {
    case "about":
      return (
        <section id="about" className="section container">
          <SectionHeading
            number="01"
            label="ABOUT ME"
            title="Curiosity meets engineering."
          />
          <div className="about-layout">
            <div className="about-copy">
              <p className="lead">
                Intelligent software starts with understanding the problem.
              </p>
              <p>{profile.about}</p>
              <p>{profile.goals}</p>
              <div className="about-focus">
                <span className="status-dot" />
                <div>
                  <span className="mono">WHAT I’M EXPLORING</span>
                  <p>{profile.focus}</p>
                </div>
              </div>
              <Link href="/resume" className="text-link">
                The full story in my resume <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="work-grid">
              {profile.specializations.map(({ title, body }, index) => {
                const Icon = workIcons[index % workIcons.length];
                return (
                  <div className="work-item" key={title}>
                    <Icon size={23} strokeWidth={1.5} />
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    case "projects":
      return (
        <section id="projects" className="section section-tinted">
          <div className="container">
            <SectionHeading
              number="02"
              label="SELECTED WORK"
              title="Ideas, made tangible."
              description="A closer look at the problems, systems, and engineering decisions behind my work."
            />
            <ProjectGallery projects={projects} />
          </div>
        </section>
      );
    case "experience":
      return (
        <section id="experience" className="section container">
          <SectionHeading
            number="03"
            label="EXPERIENCE"
            title="Building in the real world."
            description="Hands-on work across intelligent applications, software development, and data analysis."
          />
          <div className="timeline">
            {experience.map((e, i) => (
              <article key={e.id} className="timeline-item">
                <div className="timeline-date">
                  <span
                    className={
                      i === 0 ? "timeline-dot current" : "timeline-dot"
                    }
                  />
                  <span>
                    {e.startDate} — {e.endDate}
                  </span>
                  <small>{e.employmentType}</small>
                </div>
                <div className="timeline-content">
                  <div className="experience-top">
                    <div>
                      <h3>{e.position}</h3>
                      <p className="company">
                        {e.company}
                        {e.link && (
                          <a
                            href={e.link}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${e.company} website`}
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}
                      </p>
                    </div>
                    {e.location && (
                      <span className="location">
                        <MapPin size={13} />
                        {e.location}
                      </span>
                    )}
                  </div>
                  <p>{e.description}</p>
                  <div className="tech-tags">
                    {e.technologies.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <details className="experience-details">
                    <summary>
                      Explore responsibilities <span>+</span>
                    </summary>
                    <ul>
                      {e.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    case "skills":
      return (
        <section id="skills" className="section section-tinted">
          <div className="container">
            <SectionHeading
              number="04"
              label="TECHNICAL TOOLKIT"
              title="The tools behind the thinking."
              description="A practical toolkit for working with models, building systems, and finding meaning in data."
            />
            <Skills skills={skills} />
          </div>
        </section>
      );
    case "education":
      return (
        <section id="education" className="section container">
          <SectionHeading
            number="05"
            label="EDUCATION"
            title="A foundation to build on."
          />
          <div className="education-grid">
            {education.map((e) => (
              <article className="education-card" key={e.id}>
                <div className="education-top">
                  <GraduationCap size={24} />
                  <span className="mono">
                    {e.startDate} — {e.endDate}
                  </span>
                </div>
                <h3>{e.degree}</h3>
                {e.specialization && (
                  <p className="specialization">{e.specialization}</p>
                )}
                <p>{e.institution}</p>
                <span className="location">
                  <MapPin size={13} />
                  {e.location}
                </span>
                {e.grade && <p>{e.grade}</p>}
                {e.achievements && <p>{e.achievements}</p>}
                {e.coursework.length > 0 && (
                  <p>Coursework: {e.coursework.join(", ")}</p>
                )}
              </article>
            ))}
          </div>
          {data.settings.showCertifications && (
            <div className="certification-section">
              <p className="eyebrow">CERTIFICATIONS & CONTINUOUS LEARNING</p>
              <Certifications certifications={certifications} />
            </div>
          )}
          {achievements.length > 0 && (
            <div className="certification-section">
              <h2>Publications & achievements</h2>
              {achievements.map((a) => (
                <article className="education-card" key={a.id}>
                  <h3>{a.title}</h3>
                  <p>
                    {a.organization} · {a.date}
                  </p>
                  <p>{a.description}</p>
                  <a
                    className="text-link"
                    href={a.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read more ↗
                  </a>
                  {a.doi && <p>DOI: {a.doi}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      );
    case "contact":
      return (
        <section id="contact" className="section contact-section">
          <div className="container contact-layout">
            <div className="contact-copy">
              <p className="eyebrow">
                <span>06</span> / GET IN TOUCH
              </p>
              <h1>
                Good things start
                <br />
                with a <span>conversation.</span>
              </h1>
              <p>
                Have an interesting problem, a role in mind, or an idea worth
                exploring? I’d love to hear from you.
              </p>
              <div className="contact-email">
                <Mail size={19} />
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <CopyEmail email={profile.email} />
              </div>
              {profile.showPhone && profile.phone && (
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              )}
              <div className="contact-socials">
                {social.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
                    {s.label} <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
              <div className="contact-decoration" aria-hidden="true">
                <Database size={25} />
                <span />
                <Network size={25} />
                <span />
                <Braces size={25} />
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      );
    default:
      return null;
  }
}
