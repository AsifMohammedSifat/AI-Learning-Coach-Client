import { Skeleton, Empty } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./Student.css";
import { useGetMyProgressQuery, useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";

export default function Progress() {
  const { data, isLoading } = useGetMyProgressQuery(undefined);
  const [updateProgress] = useUpdateProgressMutation();

  const progress = data?.data;

  const toggleChecklistItem = async (item:any) => {
    try {
      await updateProgress({ id: item.id, done: !item.done }).unwrap();
    } catch {
      // handled globally
    }
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!progress) {
    return <Empty description="No progress data yet — generate a roadmap first" />;
  }

  const stats = [
    { label: "Overall progress", value: `${progress.overallPercent ?? 0}%`, delta: `▲ ${progress.weeklyDelta ?? 0}% this week`, up: true },
    { label: "Day streak", value: `${progress.dayStreak ?? 0} days`, delta: "▲ personal best", up: true },
    { label: "Hours this week", value: `${progress.hoursThisWeek ?? 0}h`, delta: `Goal: ${progress.weeklyHourGoal ?? 0}h`, up: false },
    { label: "Problems solved", value: progress.problemsSolved ?? 0, delta: `▲ ${progress.problemsThisWeek ?? 0} this week`, up: true },
  ];

  return (
    <div>
      <div className="eyebrow">Progress</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your progress dashboard</h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Connected to your roadmap — updates live as you complete topics.
      </p>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-delta ${s.up ? "up" : "flat"}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="dash-row">
        <div className="panel">
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>
            Daily study time
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
            {(progress.dailyHours || []).map((d:any) => (
              <div
                key={d.label}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}
              >
                <div
                  style={{
                    width: "100%",
                    borderRadius: "5px 5px 3px 3px",
                    minHeight: 4,
                    height: `${d.percent}%`,
                    background: d.today
                      ? "linear-gradient(180deg, var(--accent), var(--accent-dim))"
                      : "linear-gradient(180deg, var(--mint), var(--mint-dim))",
                  }}
                />
                <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>
            Skill by topic
          </div>
          {(progress.topicMastery || []).map((t:any) => (
            <div className="topic-row" key={t.name}>
              <div className="topic-name">{t.name}</div>
              <div className="topic-bar-bg">
                <div
                  className="topic-bar-fill"
                  style={{
                    width: `${t.percent}%`,
                    background: t.percent < 60 ? "var(--accent)" : "var(--mint)",
                  }}
                />
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)", width: 34, textAlign: "right" }}>
                {t.percent}%
              </div>
            </div>
          ))}

          {progress.weakTopics?.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div className="stat-label" style={{ marginBottom: 10 }}>
                ⚠ Weak areas
              </div>
              {progress.weakTopics.map((w:any) => (
                <span className="weak-tag" key={w}>
                  ● {w}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {progress.todayChecklist?.length > 0 && (
        <div className="panel">
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>
            Today's checklist
          </div>
          <div className="checklist">
            {progress.todayChecklist.map((item:any) => (
              <div
                key={item.id}
                className={`check-item ${item.done ? "checked" : ""}`}
                onClick={() => toggleChecklistItem(item)}
              >
                <div className="checkbox">{item.done && <CheckOutlined style={{ fontSize: 11 }} />}</div>
                <div className="ci-text">{item.text}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                  {item.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
