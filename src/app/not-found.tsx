import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container status-page">
      <p className="eyebrow">404 / NOT FOUND</p>
      <h1>This page took a different path.</h1>
      <p>The page may have moved or isn’t published.</p>
      <Link className="button button-primary" href="/">
        Back to the portfolio →
      </Link>
    </main>
  );
}
