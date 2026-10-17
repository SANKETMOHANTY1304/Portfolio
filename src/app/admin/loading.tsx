export default function Loading() {
  return (
    <main
      id="main"
      className="container loading-page"
      aria-busy="true"
      aria-label="Loading workspace"
    >
      <div className="skeleton skeleton-label" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-copy" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}
