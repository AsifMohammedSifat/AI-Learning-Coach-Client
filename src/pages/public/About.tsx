import "./PublicPages.css";

export default function About() {
  return (
    <section className="page-shell">
      <div className="eyebrow">About the project</div>
      <h2 className="section-title">Why students drop off</h2>
      <p className="section-desc">
        The gap between "wanting to learn" and "knowing how" is where most
        students disappear. AI Learning Coach closes that gap.
      </p>

      <div className="about-grid">
        <div className="about-card problem">
          <h3>⚠ Problem</h3>
          <p>
            Students often lack a personalized path — no clear guidance on
            what to learn next, no visibility into weak areas, no progress
            tracking. This leads to disorientation, inefficient learning
            order, and higher dropout rates.
          </p>
        </div>
        <div className="about-card solution">
          <h3>✓ Solution</h3>
          <p>
            An AI-powered web app that generates a personalized learning
            roadmap based on the student's goal and current level, answers
            questions in plain Bangla, and tracks progress — end to end.
          </p>
        </div>
      </div>
    </section>
  );
}
