import { useEffect, useRef } from "react";
import { Skeleton, Empty, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  Chart,
  PieController,
  LineController,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import "./Student.css";
import { useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";
import { useGetMyRoadmapQuery } from "../../redux/api/features/roadmap/roadmapApi";

Chart.register(
  PieController,
  LineController,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

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

// theme palette (kept in sync with Student.css tokens)
const COLORS = {
  mint: "#3FB68C",
  mintDim: "#1B4A3C",
  accent: "#F0B429",
  accentDim: "#7A5C15",
  sky: "#58A6FF",
  skyDim: "#173355",
  rose: "#F0836B",
  roseDim: "#4A241B",
  muted: "#8B949E",
  border: "#2A3340",
  text: "#E6EDF3",
};

const LINE_PALETTE = [COLORS.accent, COLORS.sky, COLORS.rose, COLORS.mint, "#B98CE0", "#4FD1C5"];

export default function Progress() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetMyRoadmapQuery(undefined);
  const [updateProgress] = useUpdateProgressMutation();

  const roadmaps: RoadmapEntry[] = data?.data ?? [];

  const pieCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);

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

  const toggleChecklistItem = async (item: { weekId: string; id: string }) => {
    try {
      await updateProgress({ id: item.weekId, topicId: item.id, done: true }).unwrap();
      refetch();
    } catch {
      // handled globally
    }
  };

  // ---- Pie chart data: week status distribution across ALL roadmaps (real counts) ----
  const weekStatusCounts = roadmaps
    .flatMap((rm) => rm.weeks)
    .reduce(
      (acc, w) => {
        acc[w.status] = (acc[w.status] ?? 0) + 1;
        return acc;
      },
      { done: 0, current: 0, upcoming: 0, locked: 0 } as Record<Week["status"], number>
    );

  // ---- Line chart data: per-roadmap completion % by week order (real, no fake dates) ----
  const maxWeekCount = Math.max(1, ...roadmaps.map((rm) => rm.weeks.length));
  const weekLabels = Array.from({ length: maxWeekCount }, (_, i) => `Week ${i + 1}`);
  const lineDatasets = roadmaps.map((rm, idx) => {
    const sortedWeeks = [...rm.weeks].sort((a, b) => a.order - b.order);
    const color = LINE_PALETTE[idx % LINE_PALETTE.length];
    return {
      label: rm.goal,
      data: sortedWeeks.map((w) => {
        const total = w.topics.length;
        const done = w.topics.filter((t) => t.done).length;
        return total === 0 ? 0 : Math.round((done / total) * 100);
      }),
      borderColor: color,
      backgroundColor: color,
      pointBackgroundColor: color,
      pointBorderColor: COLORS.text,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      borderWidth: 2,
    };
  });

  // ---- build / update pie chart ----
  useEffect(() => {
    if (!pieCanvasRef.current) return;

    pieChartRef.current?.destroy();

    pieChartRef.current = new Chart(pieCanvasRef.current, {
      type: "pie",
      data: {
        labels: ["Done", "Current", "Upcoming", "Locked"],
        datasets: [
          {
            data: [
              weekStatusCounts.done,
              weekStatusCounts.current,
              weekStatusCounts.upcoming,
              weekStatusCounts.locked,
            ],
            backgroundColor: [COLORS.mint, COLORS.accent, COLORS.sky, COLORS.border],
            borderColor: "#0D1117",
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: COLORS.muted,
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              boxWidth: 10,
              padding: 14,
            },
          },
          tooltip: {
            backgroundColor: "#161B22",
            borderColor: COLORS.border,
            borderWidth: 1,
            titleColor: COLORS.text,
            bodyColor: COLORS.muted,
            bodyFont: { family: "'JetBrains Mono', monospace" },
            padding: 10,
          },
        },
      },
    });

    return () => {
      pieChartRef.current?.destroy();
      pieChartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    weekStatusCounts.done,
    weekStatusCounts.current,
    weekStatusCounts.upcoming,
    weekStatusCounts.locked,
  ]);

  // ---- build / update line chart ----
  useEffect(() => {
    if (!lineCanvasRef.current) return;

    lineChartRef.current?.destroy();

    lineChartRef.current = new Chart(lineCanvasRef.current, {
      type: "line",
      data: {
        labels: weekLabels,
        datasets: lineDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            ticks: { color: COLORS.muted, font: { family: "'JetBrains Mono', monospace", size: 10.5 } },
            grid: { color: COLORS.border },
          },
          y: {
            min: 0,
            max: 100,
            ticks: {
              color: COLORS.muted,
              font: { family: "'JetBrains Mono', monospace", size: 10.5 },
              callback: (v) => `${v}%`,
            },
            grid: { color: COLORS.border },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: COLORS.muted,
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              boxWidth: 10,
              padding: 14,
            },
          },
          tooltip: {
            backgroundColor: "#161B22",
            borderColor: COLORS.border,
            borderWidth: 1,
            titleColor: COLORS.text,
            bodyColor: COLORS.muted,
            bodyFont: { family: "'JetBrains Mono', monospace" },
            padding: 10,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
            },
          },
        },
      },
    });

    return () => {
      lineChartRef.current?.destroy();
      lineChartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lineDatasets), JSON.stringify(weekLabels)]);

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

      {/* ---- Charts row: pie (week status) + line (per-roadmap completion) ---- */}
      <div
        className="dash-row"
        style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}
      >
        <div className="panel" style={{ width: "36vw", minWidth: 320 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>
            Week status distribution
          </div>
          <div style={{ position: "relative", height: 260 }}>
            <canvas ref={pieCanvasRef} />
          </div>
        </div>

        <div className="panel" style={{ width: "36vw", minWidth: 320 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>
            Completion by week
          </div>
          <div style={{ position: "relative", height: 260 }}>
            <canvas ref={lineCanvasRef} />
          </div>
        </div>
      </div>

      <div className="dash-row" style={{ display: "flex", justifyContent: "center" }}>
        <div className="panel" style={{ width: "75vw" }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16, margin: "0 auto" }}>
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
              <div key={item.id} className="check-item" onClick={() => toggleChecklistItem(item)}>
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