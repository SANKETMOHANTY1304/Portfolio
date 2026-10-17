"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container status-page">
      <p className="eyebrow">A TEMPORARY INTERRUPTION</p>
      <h1>Something didn’t load.</h1>
      <p>Please try again in a moment.</p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
