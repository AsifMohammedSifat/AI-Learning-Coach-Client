import { useState } from "react";
import { Skeleton, Empty, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

import "./Student.css";
import "../auth/Auth.css";
import { useUpdateProgressMutation } from "../../redux/api/features/roadmap/progressApi";
import { useGetRoadmapByIdQuery } from "../../redux/api/features/roadmap/roadmapApi";

type WeekStatus = "done" | "current" | "upcoming" | "locked";

interface Topic {
  id: string;
  text: string;
  done: boolean;
}

interface Week {
  id: string;
  order: number;
  title: string;
  status: WeekStatus;
  topics?: Topic[];
  estimatedHoursLeft?: number;
  resource?: string[]; // ✅ was `string` — your real data is an array
}

export interface RoadmapData {
  goal: string;
  language: string;
  hoursPerDay: number;
  currentLevel: string;
  weeks: Week[];
}

export default function GeneratedRoadMap() {
  const [updateProgress] = useUpdateProgressMutation();
  const { roadmapId } = useParams();

  const { data, isLoading, isError, refetch } = useGetRoadmapByIdQuery(
    roadmapId!,
    { skip: !roadmapId },
  );

  const roadmap: RoadmapData | undefined = data?.data;

  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(
    () => roadmap?.weeks?.find((w) => w.status === "current")?.id ?? null,
  );

  const markTopicDone = async (
    weekId: string,
    topicId: string,
    currentlyDone: boolean,
  ) => {
    try {
      // Backend re-evaluates the whole week after this: if every topic in
      // the week is now done, it marks the week "done" and unlocks the
      // next one — none of that logic lives here on purpose, so refresh
      // (`refetch`) after the mutation settles to pick up any week/next-
      // week status changes the server made.
      await updateProgress({
        id: weekId,
        topicId,
        done: !currentlyDone,
      }).unwrap();
      refetch();
    } catch {
      // handled globally
    }
  };

  const toggleCard = (week: Week) => {
    if (week.status === "locked") return;
    setExpandedWeekId((prev) => (prev === week.id ? null : week.id));
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (isError || !roadmap) {
    return (
      <Empty description="No roadmap found yet">
        <Button onClick={() => refetch()}>রিফ্রেশ করো</Button>
      </Empty>
    );
  }

  const completedCount = roadmap.weeks.filter((w) => w.status === "done").length;
  const totalCount = roadmap.weeks.length;

  return (
    <div id="rm-result">
      <div className="rm-header">
        <div>
          <div className="rm-goal">{roadmap.goal}</div>
          <div className="rm-meta">
            {roadmap.language} &nbsp;·&nbsp; {roadmap.hoursPerDay} ঘন্টা/দিন
            &nbsp;·&nbsp; আনুমানিক {totalCount} সপ্তাহ
          </div>
        </div>
        <div className="badge">
          {completedCount}/{totalCount} কমপ্লিট
        </div>
      </div>

      {!roadmap.weeks?.length ? (
        <Empty description="No weeks in this plan yet" />
      ) : (
        <div className="track">
          {roadmap.weeks.map((week) => {
            const isOpen = expandedWeekId === week.id;
            const isLocked = week.status === "locked";
            const isDone = week.status === "done";
            const isCurrent = week.status === "current";

            return (
              <div className={`node ${week.status}`} key={week.id}>
                <div className="node-dot">
                  {isDone ? "✓" : isCurrent ? "●" : week.order}
                </div>

                <div
                  className={`card ${isOpen ? "open" : ""}`}
                  onClick={() => toggleCard(week)}
                  style={{ cursor: isLocked ? "default" : "pointer" }}
                >
                  <div className="card-top">
                    <div className="card-title">
                      <span className="week-tag">WK {week.order}</span>
                      {week.title}
                    </div>

                    {isDone && <div className="card-time">সম্পন্ন</div>}

                    {isCurrent && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="card-time">
                          চলছে
                          {typeof week.estimatedHoursLeft === "number" &&
                            ` · ${week.estimatedHoursLeft}ঘ বাকি`}
                        </div>
                        <span className="chev">{isOpen ? "⌄" : "›"}</span>
                      </div>
                    )}

                    {!isDone && !isCurrent && !isLocked && (
                      <span className="chev">{isOpen ? "⌄" : "›"}</span>
                    )}

                    {isLocked && <div className="card-time">লক করা</div>}
                  </div>

                  {!isLocked && isOpen && (
                    <div className="card-body">
                      <div className="topic-list">
                        {week.topics?.map((t) => (
                          <div
                            key={t.id}
                            className="topic-row-inline"
                            onClick={(e) => {
                              e.stopPropagation();
                              markTopicDone(week.id, t.id, t.done);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                              cursor: "pointer",
                            }}
                          >
                            {/* ✅ actual checkbox visual, not just a dot */}
                            <span
                              className="checkbox"
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: 4,
                                border: "1px solid var(--line)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                ...(t.done
                                  ? {
                                      background: "var(--mint)",
                                      borderColor: "var(--mint)",
                                      color: "#0d1117",
                                    }
                                  : {}),
                              }}
                            >
                              {t.done && <CheckOutlined style={{ fontSize: 9 }} />}
                            </span>
                            <span
                              style={
                                t.done
                                  ? {
                                      color: "var(--muted)",
                                      textDecoration: "line-through",
                                    }
                                  : undefined
                              }
                            >
                              {t.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* ✅ resource is string[] now — join instead of rendering the array directly */}
                      {week.resource && week.resource.length > 0 && (
                        <div className="res">
                          📺 সাজেস্টেড: {week.resource.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}