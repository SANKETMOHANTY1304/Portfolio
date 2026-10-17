import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <Link href="/" className="footer-wordmark">
            Sanket
            <br />
            <em>Mohanty.</em>
          </Link>
          <div>
            <p className="eyebrow">ALWAYS CURIOUS. ALWAYS BUILDING.</p>
            <p>
              Thoughtfully built.
              <br />
              Always evolving.
            </p>
            <Link href="/contact" className="text-link">
              Start a conversation <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sanket Mohanty</span>
          <Link href="/resume">
            Read my resume <ArrowUpRight size={14} />
          </Link>
          <a href="#top" className="back-top">
            Back to top <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
