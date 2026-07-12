import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import "./PublicPages.css";

const features = [
  {
    title: "Personalized Study Plan Generator",
    tagline: "Goal + level in → week-by-week roadmap out",
    tags: ["Goal-based", "Adaptive pace", "Weekly breakdown", "AI-generated"],
  },
  {
    title: "AI Chat Tutor (Bangla Q&A)",
    tagline: "Ask anything, get explained in plain Bangla",
    tags: ["Bangla-first", "Context-aware", "Code examples", "Instant answers"],
  },
  {
    title: "Progress Tracking Dashboard",
    tagline: "Mark done → see it reflected instantly",
    tags: ["Live updates", "Streaks", "Topic mastery", "Weak-area detection"],
  },
];

export default function Features() {
  const [expanded, setExpanded] = useState(0);

  return (
    <section className="page-shell">
      <div className="eyebrow">What's inside</div>
      <h2 className="section-title">Three features, working together</h2>
      <p className="section-desc">
        Each one stands on its own, and they're stronger as a loop: plan,
        learn, track, repeat.
      </p>

      <div>
        {features.map((f, i) => (
          <div
            key={f.title}
            className={"feature-item" + (expanded === i ? " expanded" : "")}
            onClick={() => setExpanded(expanded === i ? -1 : i)}
          >
            <div className="feature-head">
              <div className="feature-head-left">
                <div className="feature-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-tagline">{f.tagline}</div>
                </div>
              </div>
              <DownOutlined className="feature-chev" />
            </div>
            {expanded === i && (
              <div className="feature-body-inner">
                {f.tags.map((t) => (
                  <span className="fb-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
