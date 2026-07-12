export default function Footer() {
  return (
    <footer
      style={{
        padding: "40px 20px",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        color: "var(--muted)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12.5px",
      }}
    >
      Built for <b style={{ color: "var(--accent)" }}>AI Learning Coach</b> ·
      Personalized roadmaps, a Bangla AI tutor, and progress tracking.
    </footer>
  );
}
