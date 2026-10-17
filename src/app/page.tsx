import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  BrainCircuit,
  Code2,
  Network,
} from "lucide-react";
import { Github, Linkedin } from "@/components/brand-icons";
import { getPortfolio } from "@/server/services/portfolio";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ChapterPagination } from "@/components/chapter-pagination";
import { chapters } from "@/lib/chapters";
import { jsonLd, siteUrl } from "@/lib/utils";
import { headers } from "next/headers";
export async function generateMetadata() {
  const { settings } = await getPortfolio();
  return {
    title: { absolute: settings.title },
    description: settings.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.title,
      description: settings.description,
      url: "/",
    },
  };
}
export default async function Home() {
  const { profile, social } = await getPortfolio();
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <main id="main" className="editorial-home">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            url: siteUrl(),
            jobTitle: "AI Engineer",
            sameAs: social.map((s) => s.url),
          }),
        }}
      />
      <div className="container edition-line">
        <span>THE ENGINEERING PORTFOLIO</span>
        <span>CODE, CURIOSITY & APPLIED INTELLIGENCE</span>
        <span>VOL. 01</span>
      </div>
      <section
        className="editorial-hero container"
        aria-labelledby="hero-title"
      >
        <Reveal className="editorial-hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" /> AI ENGINEERING · A PERSONAL PRACTICE
          </p>
          <p className="editorial-intro">Hello, I’m {profile.name}.</p>
          <h1 id="hero-title">
            {profile.headline ===
            "Building intelligent systems for the real world." ? (
              <>
                Building <br />
                intelligent systems <br />
                for the <em>real world.</em>
              </>
            ) : (
              profile.headline
            )}
          </h1>
          <div className="hero-copy-bottom">
            <span className="editorial-marker" aria-hidden="true">
              ↳
            </span>
            <div>
              <p className="editorial-description">{profile.introduction}</p>
              <p className="editorial-role">{profile.designation}</p>
            </div>
          </div>
          <div className="hero-buttons">
            <Button asChild>
              <Link href="/projects">
                Explore my work <ArrowUpRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Let’s connect <ArrowUpRight size={17} />
              </Link>
            </Button>
          </div>
          <div className="hero-links">
            {social.map((s) => (
              <a href={s.url} key={s.id} target="_blank" rel="noreferrer">
                {s.label.toLowerCase().includes("github") ? (
                  <Github size={17} />
                ) : (
                  <Linkedin size={17} />
                )}
                <span>{s.label}</span>
                <ArrowUpRight size={12} />
              </a>
            ))}
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download>
                <Download size={16} />
                <span>Download CV</span>
              </a>
            )}
          </div>
        </Reveal>
        <Reveal className="editorial-portrait-column">
          <div className="portrait-index">
            <span className="mono">THE PERSON BEHIND THE WORK</span>
            <span aria-hidden="true">[ SM ]</span>
          </div>
          <figure className="editorial-portrait">
            <div className="editorial-photo">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={"Portrait of " + profile.name}
                  fill
                  priority
                  sizes="(max-width: 600px) 90vw, (max-width: 1000px) 42vw, 400px"
                />
              ) : (
                <div className="portrait-placeholder">
                  <Code2 size={64} />
                  <span>{profile.name}</span>
                </div>
              )}
            </div>
            <figcaption>
              <span>{profile.name}</span>
              <small>AI & SOFTWARE ENGINEERING</small>
            </figcaption>
          </figure>
          <div className="editorial-focus">
            <BrainCircuit size={29} strokeWidth={1.3} />
            <div>
              <span className="mono">ON MY DESK / CURRENT FOCUS</span>
              <strong>{profile.focusTitle}</strong>
              <small>Documents → connected knowledge</small>
            </div>
            <span className="status-dot" />
          </div>
          <p className="portrait-note">
            <span className="mono">&lt; code. learn. build. /&gt;</span>
            <span>Ideas into practice. ↗</span>
          </p>
        </Reveal>
      </section>
      <div className="expertise-strip">
        <div className="container">
          {[
            "Python",
            "Generative AI",
            "Multimodal RAG",
            "FastAPI",
            "Knowledge Graphs",
          ].map((item, i) => (
            <span key={item}>
              {i === 0 ? (
                <Code2 size={18} />
              ) : i === 4 ? (
                <Network size={18} />
              ) : (
                <span className="strip-dot">✳</span>
              )}
              {item}
            </span>
          ))}
        </div>
      </div>
      <section
        className="portfolio-index container"
        aria-labelledby="index-title"
      >
        <div className="index-heading">
          <p className="eyebrow">A FEW WAYS IN</p>
          <h2 id="index-title">
            Follow your
            <br />
            <em>curiosity.</em>
          </h2>
          <p>
            Explore the work, the thinking, and the path that connects them.
          </p>
          <Link href="/resume" className="text-link">
            Prefer the full resume? <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="index-entries">
          {chapters.slice(1).map((chapter) => (
            <Link
              href={chapter.href}
              key={chapter.href}
              className="index-entry"
            >
              <span className="index-number">{chapter.number}</span>
              <div>
                <h3>{chapter.label}</h3>
                <p>{chapter.description}</p>
              </div>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
      </section>
      <ChapterPagination current="/" />
    </main>
  );
}
