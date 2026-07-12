import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./PublicPages.css";

const stats = [
  { num: "03", label: "Core Features" },
  { num: "AI", label: "Personalized" },
  { num: "BN", label: "Native Language" },
  { num: "24/7", label: "Tutor Access" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-grid-bg" />
      <div className="page-shell hero-content">
        <div className="hackathon-tag">
          <span className="badge-pulse" />
          Personalized learning, end to end
        </div>
        <h1 className="hero-title">
          Your personal <span className="accent-word">AI Learning</span> Coach
        </h1>
        <p className="hero-sub">
          A personalized roadmap generator, a Bangla AI tutor, and a progress
          tracker — built to stop students from getting lost, and start them
          finishing what they start.
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <Button type="primary" size="large" onClick={() => navigate("/register")}>
            Start your roadmap
          </Button>
          <Button size="large" onClick={() => navigate("/features")}>
            See how it works
          </Button>
        </div>

        <div className="stat-row">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num mono">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
