import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: 96, margin: "64px 0 8px" }}>404</h1>
      <p className="lead">The page you're looking for doesn't exist.</p>
      <Link href="/" className="morph-btn" style={{ display: "inline-block" }}>
        Back to home
      </Link>
    </main>
  );
}
