import { Skeleton, Empty, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./Student.css";
import { useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";
import { useGetMyRoadmapQuery } from "../../redux/api/features/roadmap/roadmapApi";

interface Topic {
  id: string;
  text: string;
  done: boolean;
}

interface Week {
  id: string;
  order: number;
  title: string;
  status: "done" | "current" | "upcoming" | "locked";
  topics: Topic[];
}

interface RoadmapEntry {
  _id: string;
  goal: string;
  language: string;
  currentLevel: string;
  roadMapStatus: "active" | "completed" | "archived";
  weeks: Week[];
}

export default function Progress() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetMyRoadmapQuery(undefined);
  const [updateProgress] = useUpdateProgressMutation();

  const roadmaps: RoadmapEntry[] = data?.data ?? [];

  // ---- Overall progress: real topic completion across all roadmaps ----
  const allTopics = roadmaps.flatMap((rm) => rm.weeks.flatMap((w) => w.topics));
  const completedTopics = allTopics.filter((t) => t.done).length;
  const overallPercent =
    allTopics.length === 0 ? 0 : Math.round((completedTopics / allTopics.length) * 100);

  // ---- "Skill by topic": one row per roadmap, % = topics done in it ----
  const topicMastery = roadmaps.map((rm) => {
    const topics = rm.weeks.flatMap((w) => w.topics);
    const done = topics.filter((t) => t.done).length;
    return {
      name: rm.goal,
      roadmapId: rm._id,
      percent: topics.length === 0 ? 0 : Math.round((done / topics.length) * 100),
    };
  });

  // ---- Today's checklist: real data — unfinished topics in each roadmap's CURRENT week ----
  const todayChecklist = roadmaps.flatMap((rm) => {
    const currentWeek = rm.weeks.find((w) => w.status === "current");
    if (!currentWeek) return [];
    return currentWeek.topics
      .filter((t) => !t.done)
      .map((t) => ({
        id: t.id,
        weekId: currentWeek.id,
        roadmapId: rm._id,
        text: `${rm.goal} — ${t.text}`,
      }));
  });

  const toggleChecklistItem = async (item: {
    weekId: string;
    id: string;
  }) => {
    try {
      await updateProgress({ id: item.weekId, topicId: item.id, done: true }).unwrap();
      refetch();
    } catch {
      // handled globally
    }
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (isError) {
    return (
      <Empty description="Couldn't load your progress">
        <Button onClick={() => refetch()}>রিফ্রেশ করো</Button>
      </Empty>
    );
  }

  if (!roadmaps.length) {
    return (
      <Empty description="No progress data yet — generate a roadmap first">
        <Button type="primary" onClick={() => navigate("/student/roadmap/generate")}>
          Generate your first roadmap
        </Button>
      </Empty>
    );
  }

  const stats = [
    { label: "Overall progress", value: `${overallPercent}%` },
    { label: "Roadmaps", value: roadmaps.length },
    {
      label: "Completed roadmaps",
      value: roadmaps.filter((r) => r.roadMapStatus === "completed").length,
    },
    { label: "Topics done", value: `${completedTopics}/${allTopics.length}` },
  ];

  return (
    <div>
      <div className="eyebrow">Progress</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        Your progress dashboard
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Connected to your roadmaps — updates live as you complete topics.
      </p>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="dash-row" style={{display:'flex', justifyContent:'center'}}>
        <div className="panel" style={{width:'75vw'}}>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16, margin: '0 auto' }}>
            Skill by roadmap
          </div>
          {topicMastery.map((t) => (
            <div
              className="topic-row"
              key={t.roadmapId}
              onClick={() => navigate(`/student/roadmap/me/${t.roadmapId}`)}
              style={{ cursor: "pointer" }}
            >
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
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--muted)", width: 34, textAlign: "right" }}
              >
                {t.percent}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {todayChecklist.length > 0 && (
        <div className="panel">
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>
            Today's checklist
          </div>
          <div className="checklist">
            {todayChecklist.map((item) => (
              <div
                key={item.id}
                className="check-item"
                onClick={() => toggleChecklistItem(item)}
              >
                <div className="checkbox" />
                <div className="ci-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}